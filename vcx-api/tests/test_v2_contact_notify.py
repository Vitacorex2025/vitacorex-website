"""v2 contact notifications: website chat transcript and Vapi end-of-call report -> owner email via the outbox."""

import json
from email import message_from_bytes, policy

from conftest import db_rows

SID = "4e448231-b6ac-4f8f-9d39-d3d113bbaf20"
CALL = "01a1421b-591e-7aac-999d-fefc383fc7ae"
PHONE_ASSISTANT = "0f63d010-dc45-4dbc-a184-d0a31688442f"


def _chat(client, msgs, sid=SID, **over):
    body = {"session_id": sid, "locale": "ru", "page": "/ru/pricing.html", "messages": msgs}
    body.update(over)
    return client.post("/api/v2/contact/chat", content=json.dumps(body), headers={"Content-Type": "text/plain"})


def _report(call_id=CALL, assistant=PHONE_ASSISTANT, **msg):
    m = {"type": "end-of-call-report", "endedReason": "customer-ended-call", "durationSeconds": 136.4,
         "call": {"id": call_id, "type": "inboundPhoneCall", "assistantId": assistant,
                  "customer": {"number": "+18135550100"}, "phoneNumber": {"number": "+18887948292"}},
         "analysis": {"summary": "TEST caller asked about an apostille."},
         "artifact": {"transcript": "AI: Thank you for calling VitaCoreX.\nUser: Hi, I need an apostille. "
                                    "My email is caller@example.test, SSN 123-45-6789.\nAI: Steven will call you back."}}
    m.update(msg)
    return {"message": m}


def _mails(env):
    return [message_from_bytes(p.read_bytes(), policy=policy.default) for p in sorted((env / "sink").glob("TEST_*.eml"))]


CONVO = [
    {"r": "me", "t": "Здравствуйте! Сколько стоит апостиль?"},
    {"r": "bot", "t": "Апостиль — от $119 за первый документ."},
    {"r": "me", "t": "Я Анна, anna@example.test, (813) 555-0100. Карта 4111 1111 1111 1111, SSN 123-45-6789"},
]


def test_chat_transcript_mails_owner_and_gmail(client, env):
    from app.services import v2_outbox
    r = _chat(client, CONVO)
    assert r.status_code == 202 and r.json() == {"queued": True}
    rows = db_rows(env, "SELECT recipient, kind, subject, body_text FROM v2_outbox ORDER BY id")
    assert [x["recipient"] for x in rows] == ["vitacorex2025@gmail.com", "owner@example.test"]
    assert {x["kind"] for x in rows} == {"contact.chat.r0", "contact.chat.r1"}
    assert v2_outbox.process_due() == 2
    mails = _mails(env)
    assert len(mails) == 2
    assert mails[0]["Subject"] == "[TEST][VitaCoreX] Чат сайта: Здравствуйте! Сколько стоит апостиль?"
    text = mails[0].get_body(preferencelist=("plain",)).get_content()
    for needle in ("Новый разговор в чате сайта", "Язык: русский", "Страница: http://localhost:4646/ru/pricing.html",
                   "Контакты из переписки: email anna@example.test; телефон (813) 555-0100", f"Сессия Vapi: {SID}",
                   "Посетитель: Здравствуйте!", "Ассистент: Апостиль — от $119"):
        assert needle in text, needle
    assert "4111" not in text and "123-45-6789" not in text and text.count("[скрыто]") == 2


def test_chat_dedupe_update_and_session_cap(client, env):
    from app.services import v2_contact_notify
    assert _chat(client, CONVO[:1]).json() == {"queued": True}
    assert _chat(client, CONVO[:1]).json() == {"queued": False, "duplicate": True}  # same transcript again
    assert _chat(client, CONVO).json() == {"queued": True}                            # visitor wrote more
    subjects = [x["subject"] for x in db_rows(env, "SELECT subject FROM v2_outbox WHERE kind='contact.chat.r0' ORDER BY id")]
    assert subjects[1].startswith("[TEST][VitaCoreX] Чат сайта (продолжение): ")
    msgs = list(CONVO)
    for _ in range(v2_contact_notify.MAX_PER_SESSION):
        msgs = msgs + [{"r": "me", "t": "ещё вопрос"}]
        _chat(client, msgs)
    assert _chat(client, msgs + [{"r": "me", "t": "и ещё"}]).json() == {"queued": False, "capped": "session"}
    n = db_rows(env, "SELECT COUNT(DISTINCT source_event_id) AS n FROM v2_outbox")[0]["n"]
    assert n == v2_contact_notify.MAX_PER_SESSION


def test_chat_rejects_bad_input(client, env):
    assert _chat(client, CONVO, sid="../../etc").status_code == 422
    assert _chat(client, [{"r": "bot", "t": "hello"}]).json() == {"error": "no_visitor_message"}
    assert _chat(client, [{"r": "admin", "t": "x"}]).status_code == 422
    assert _chat(client, [{"r": "me", "t": "x"}] * 61).status_code == 422
    assert client.post("/api/v2/contact/chat", content="not json").status_code == 422
    assert client.post("/api/v2/contact/chat", content="x" * (129 * 1024)).status_code == 413
    bad_page = _chat(client, CONVO, page="https://evil.example/")
    assert bad_page.status_code == 202
    assert "Страница: —" in db_rows(env, "SELECT body_text FROM v2_outbox LIMIT 1")[0]["body_text"]
    assert db_rows(env, "SELECT COUNT(*) AS n FROM v2_outbox")[0]["n"] == 2


def test_call_report_mails_once(client, env):
    from app.services import v2_outbox
    r = client.post("/api/v2/contact/call", json=_report())
    assert r.status_code == 200 and r.json() == {"queued": True}
    assert client.post("/api/v2/contact/call", json=_report()).json() == {"queued": False, "duplicate": True}
    v2_outbox.process_due()
    mail = _mails(env)[0]
    assert mail["Subject"] == "[TEST][VitaCoreX] Звонок: +18135550100 — 2 мин 16 с"
    text = mail.get_body(preferencelist=("plain",)).get_content()
    for needle in ("Кто звонил: +18135550100", "Номер линии: +18887948292", "Чем закончился: клиент положил трубку",
                   "Кратко: TEST caller asked about an apostille.", "Контакты из разговора: email caller@example.test",
                   f"ID звонка в Vapi: {CALL}", "User: Hi, I need an apostille."):
        assert needle in text, needle
    assert "123-45-6789" not in text


def test_call_report_ignores_other_messages_and_assistants(client, env):
    assert client.post("/api/v2/contact/call", json={"message": {"type": "status-update"}}).json() == {"ignored": True}
    other = _report(call_id="01a1421b-0000-7aac-999d-fefc383fc7ae", assistant="11111111-2222-3333-4444-555555555555")
    assert client.post("/api/v2/contact/call", json=other).json() == {"ignored": True}
    assert client.post("/api/v2/contact/call", json=_report(call_id="bad id!")).status_code == 422
    assert client.post("/api/v2/contact/call", json={"nope": 1}).status_code == 422
    assert db_rows(env, "SELECT COUNT(*) AS n FROM v2_outbox")[0]["n"] == 0


def test_call_report_secret_when_configured(client, env, monkeypatch):
    monkeypatch.setenv("VCX_VAPI_SERVER_SECRET", "test-vapi-placeholder-0123456789")
    assert client.post("/api/v2/contact/call", json=_report()).status_code == 401
    ok = client.post("/api/v2/contact/call", json=_report(), headers={"X-Vapi-Secret": "test-vapi-placeholder-0123456789"})
    assert ok.status_code == 200 and ok.json() == {"queued": True}


def test_recipients_override_and_masking(monkeypatch):
    from app.services import v2_contact_notify as n
    monkeypatch.setenv("VCX_CONTACT_NOTIFY_EMAILS", "a@example.test, A@example.test ,b@example.test,nonsense")
    assert n.recipients() == ["a@example.test", "b@example.test"]
    assert n.mask("call (813) 555-0100 or +1 813 555 0100") == "call (813) 555-0100 or +1 813 555 0100"
    assert n.mask("ssn 123456789 / 123 45 6789") == "ssn [скрыто] / [скрыто]"
    assert n.mask("card 4111-1111-1111-1111 ok") == "card [скрыто] ok"
