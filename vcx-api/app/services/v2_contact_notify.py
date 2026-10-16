"""vcx-api v2 — owner email on every website-chat conversation and every phone call.

Owner 2026-10-16: «мне надо, чтобы вапи при каждом контакте с клиентом мне имейл присылал на vitacorex2025@gmail.com».
Vapi's Gmail tool was never called by the model (chat logs show no tool call while the assistant said it had passed
the message), so the mail no longer depends on the model: the website posts the chat transcript here, Vapi posts its
end-of-call report here, and the durable outbox delivers the email.

Neither source can carry a secret (the chat runs in the visitor's browser), so every input is bounded, digits that
look like an SSN or a card number are masked before anything is stored, and mail is capped per chat session and per
day. The call report also accepts an optional shared secret (VCX_VAPI_SERVER_SECRET) once one is configured in Vapi.
"""

import re

from ..db import get_conn
from . import v2_store
from .v2_config import env, now_iso, owner_email, site_base, subject_prefix
from .v2_messages import ny_time

DEFAULT_RECIPIENTS = ("vitacorex2025@gmail.com",)
# phone line "Vitacorex Inbound Reception" and "VitaCoreX Website Chat"
DEFAULT_ASSISTANTS = ("0f63d010-dc45-4dbc-a184-d0a31688442f", "54d364e8-2f13-4b20-99fb-f7812cde23f5")

MAX_MESSAGES = 60
MAX_MESSAGE_CHARS = 2000
MAX_TRANSCRIPT_CHARS = 15000
MAX_PER_SESSION = 6
MAX_PER_DAY = 300

LANG_RU = {"en": "английский", "ru": "русский", "es": "испанский"}
ENDED_RU = {
    "customer-ended-call": "клиент положил трубку",
    "assistant-ended-call": "ассистент завершила разговор",
    "silence-timed-out": "клиент молчал, звонок завершён",
    "voicemail": "автоответчик",
    "customer-did-not-answer": "клиент не ответил",
    "exceeded-max-duration": "превышена длительность звонка",
}

ID_RE = re.compile(r"^[A-Za-z0-9_-]{8,80}$")
_SSN_RE = re.compile(r"(?<!\d)\d{3}[- ]\d{2}[- ]\d{4}(?!\d)|(?<![\d-])\d{9}(?![\d-])")
_CARD_RE = re.compile(r"(?<!\d)(?:\d[ -]?){12,18}\d(?!\d)")
_EMAIL_RE = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}")
_PHONE_RE = re.compile(r"(?<![\d+])(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}(?!\d)")
_PAGE_RE = re.compile(r"^/[A-Za-z0-9/_.#?=&%-]{0,199}$")
MASK = "[скрыто]"


class NotifyRejected(Exception):
    def __init__(self, status_code: int, error: str):
        super().__init__(error)
        self.status_code = status_code
        self.body = {"error": error}


# ── helpers ───────────────────────────────────────────────────────────

def mask(text: str) -> str:
    """Card-like digit runs first (they may contain an SSN-like part), then SSN-like ones."""
    return _SSN_RE.sub(MASK, _CARD_RE.sub(MASK, text))


def recipients() -> list[str]:
    raw = env("VCX_CONTACT_NOTIFY_EMAILS")
    items = raw.split(",") if raw else [*DEFAULT_RECIPIENTS, owner_email()]
    out: list[str] = []
    for item in items:
        item = item.strip()
        if item and "@" in item and item.lower() not in (o.lower() for o in out):
            out.append(item)
    return out


def known_assistants() -> set[str]:
    raw = env("VCX_VAPI_ASSISTANT_IDS")
    return {a.strip() for a in raw.split(",") if a.strip()} if raw else set(DEFAULT_ASSISTANTS)


def contacts_line(texts: list[str]) -> str:
    joined = "\n".join(texts)
    emails = list(dict.fromkeys(_EMAIL_RE.findall(joined)))
    phones = list(dict.fromkeys(p.strip() for p in _PHONE_RE.findall(_EMAIL_RE.sub(" ", joined))))
    parts = ([f"email {', '.join(emails[:3])}"] if emails else []) + ([f"телефон {', '.join(phones[:3])}"] if phones else [])
    return "; ".join(parts) if parts else "не оставлены"


def _topic(text: str, limit: int = 60) -> str:
    one = " ".join(text.split())
    return one if len(one) <= limit else one[:limit - 1].rstrip() + "…"


def _duration(seconds) -> str:
    try:
        total = int(round(float(seconds)))
    except (TypeError, ValueError):
        return "—"
    return f"{total // 60} мин {total % 60:02d} с" if total >= 60 else f"{total} с"


def _over_daily_cap(conn) -> bool:
    row = conn.execute(
        "SELECT COUNT(DISTINCT source_event_id) FROM v2_outbox WHERE kind LIKE 'contact.%'"
        " AND created_at >= strftime('%Y-%m-%dT%H:%M:%SZ', 'now', '-1 day')").fetchone()
    return row[0] >= MAX_PER_DAY


def _enqueue(conn, source: str, kind: str, message: tuple[str, str, None]) -> int:
    queued = 0
    for i, rcpt in enumerate(recipients()):
        queued += v2_store.enqueue(conn, source, f"{kind}.r{i}", "owner", rcpt, message, None)
    return queued


# ── website chat ──────────────────────────────────────────────────────

def clean_chat(payload) -> dict:
    if not isinstance(payload, dict):
        raise NotifyRejected(422, "invalid_body")
    sid = payload.get("session_id")
    if not isinstance(sid, str) or not ID_RE.match(sid):
        raise NotifyRejected(422, "invalid_session_id")
    locale = payload.get("locale") if payload.get("locale") in LANG_RU else "en"
    page = payload.get("page") if isinstance(payload.get("page"), str) and _PAGE_RE.match(payload["page"]) else ""
    raw = payload.get("messages")
    if not isinstance(raw, list) or not raw or len(raw) > MAX_MESSAGES:
        raise NotifyRejected(422, "invalid_messages")
    msgs = []
    for m in raw:
        if not isinstance(m, dict) or m.get("r") not in ("me", "bot") or not isinstance(m.get("t"), str):
            raise NotifyRejected(422, "invalid_messages")
        text = m["t"].strip()[:MAX_MESSAGE_CHARS]
        if text:
            msgs.append({"r": m["r"], "t": mask(text)})
    if not any(m["r"] == "me" for m in msgs):
        raise NotifyRejected(422, "no_visitor_message")
    return {"session_id": sid, "locale": locale, "page": page, "messages": msgs, "count": len(raw)}


def chat_message(c: dict, update: bool) -> tuple[str, str, None]:
    visitor = [m["t"] for m in c["messages"] if m["r"] == "me"]
    head = "Продолжение разговора в чате сайта (переписка целиком)." if update else "Новый разговор в чате сайта vitacorexllc.com."
    subject = f"{subject_prefix()}[VitaCoreX] Чат сайта{' (продолжение)' if update else ''}: {_topic(visitor[0])}"
    lines = [
        head,
        f"Время: {ny_time(now_iso())}",
        f"Язык: {LANG_RU[c['locale']]}",
        f"Страница: {site_base()}{c['page']}" if c["page"] else "Страница: —",
        f"Контакты из переписки: {contacts_line(visitor)}",
        f"Сессия Vapi: {c['session_id']}",
        "",
        "Переписка:",
    ]
    for m in c["messages"]:
        lines.append(f"{'Посетитель' if m['r'] == 'me' else 'Ассистент'}: {m['t']}")
    lines += ["", "Цифры, похожие на SSN или номер карты, скрыты автоматически. Запись есть и в Vapi: Logs → Chat."]
    return subject, "\n".join(lines), None


def notify_chat(payload) -> dict:
    c = clean_chat(payload)
    source = f"chat:{c['session_id']}:{c['count']}"
    prefix = f"chat:{c['session_id']}:"
    with get_conn() as conn:
        if conn.execute("SELECT 1 FROM v2_outbox WHERE source_event_id=? LIMIT 1", (source,)).fetchone():
            return {"queued": False, "duplicate": True}
        sent = conn.execute("SELECT COUNT(DISTINCT source_event_id) FROM v2_outbox"
                            " WHERE substr(source_event_id, 1, ?)=?", (len(prefix), prefix)).fetchone()[0]
        if sent >= MAX_PER_SESSION:
            return {"queued": False, "capped": "session"}
        if _over_daily_cap(conn):
            return {"queued": False, "capped": "day"}
        queued = _enqueue(conn, source, "contact.chat", chat_message(c, update=sent > 0))
    v2_store._kick_outbox()
    return {"queued": queued > 0}


# ── phone call (Vapi end-of-call report) ─────────────────────────────

def call_message(msg: dict) -> tuple[str, str, None] | None:
    call = msg.get("call") if isinstance(msg.get("call"), dict) else {}
    call_id = call.get("id")
    if not isinstance(call_id, str) or not ID_RE.match(call_id):
        raise NotifyRejected(422, "invalid_call_id")
    assistant = call.get("assistantId") or (msg.get("assistant") or {}).get("id")
    if assistant and assistant not in known_assistants():
        return None
    customer = str((call.get("customer") or {}).get("number") or "скрыт или веб-звонок")[:40]
    line = str((call.get("phoneNumber") or {}).get("number") or "—")[:40]
    artifact = msg.get("artifact") if isinstance(msg.get("artifact"), dict) else {}
    transcript = artifact.get("transcript") or msg.get("transcript") or ""
    transcript = mask(transcript if isinstance(transcript, str) else "")[:MAX_TRANSCRIPT_CHARS]
    analysis = msg.get("analysis") if isinstance(msg.get("analysis"), dict) else {}
    summary = analysis.get("summary") or msg.get("summary") or ""
    summary = mask(summary if isinstance(summary, str) else "")[:2000]
    ended = str(msg.get("endedReason") or "—")[:80]
    caller_lines = [ln.split(":", 1)[1] for ln in transcript.splitlines() if ln.lower().startswith(("user:", "customer:"))]
    seconds = msg.get("durationSeconds")
    if seconds is None and isinstance(msg.get("durationMs"), (int, float)):
        seconds = msg["durationMs"] / 1000
    duration = _duration(seconds)
    subject = f"{subject_prefix()}[VitaCoreX] Звонок: {customer} — {duration}"
    lines = [
        "Звонок на линию VitaCoreX (ассистент Vapi).",
        f"Время: {ny_time(now_iso())}",
        f"Кто звонил: {customer}",
        f"Номер линии: {line}",
        f"Длительность: {duration}",
        f"Чем закончился: {ENDED_RU.get(ended, ended)}",
        f"Кратко: {summary or '—'}",
        f"Контакты из разговора: {contacts_line(caller_lines)}",
        f"ID звонка в Vapi: {call_id}",
        "",
        "Расшифровка:",
        transcript or "— (клиент ничего не сказал)",
        "",
        "Цифры, похожие на SSN или номер карты, скрыты автоматически. Запись звонка есть в Vapi: Logs → Calls.",
    ]
    return subject, "\n".join(lines), None


def notify_call(payload) -> dict:
    msg = payload.get("message") if isinstance(payload, dict) else None
    if not isinstance(msg, dict):
        raise NotifyRejected(422, "invalid_body")
    if msg.get("type") != "end-of-call-report":
        return {"ignored": True}
    message = call_message(msg)
    if message is None:
        return {"ignored": True}
    source = f"call:{msg['call']['id']}"
    with get_conn() as conn:
        if conn.execute("SELECT 1 FROM v2_outbox WHERE source_event_id=? LIMIT 1", (source,)).fetchone():
            return {"queued": False, "duplicate": True}
        if _over_daily_cap(conn):
            return {"queued": False, "capped": "day"}
        queued = _enqueue(conn, source, "contact.call", message)
    v2_store._kick_outbox()
    return {"queued": queued > 0}
