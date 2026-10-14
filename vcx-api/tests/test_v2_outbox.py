"""v2 durable outbox: TEST sink delivery, localized customer mail, retry/backoff, DEAD + desk exception."""

from email import message_from_bytes, policy

from conftest import admin_headers, create, db_rows

FAR_FUTURE = "2099-01-01T00:00:00Z"


def _read_eml(path):
    return message_from_bytes(path.read_bytes(), policy=policy.default)


def test_sink_delivery_subjects_and_localization(client, env):
    from app.services import v2_outbox
    req = create(client, "tax_1040_simple", locale="ru", subtype="mixed_income",
                 details={"tax_year": "2025", "tax_state": "FL"}, summary="TEST: W-2 and 1099 income")
    assert v2_outbox.process_due() == 2
    rows = {r["kind"]: r for r in db_rows(env, "SELECT * FROM v2_outbox")}
    assert {r["status"] for r in rows.values()} == {"ACCEPTED_BY_SINK"}
    files = sorted((env / "sink").glob("TEST_*.eml"))
    assert len(files) == 2
    msgs = {m["X-VCX-Outbox-Id"]: m for m in map(_read_eml, files)}
    owner = msgs[str(rows["owner.request_received"]["id"])]
    customer = msgs[str(rows["customer.request_received"]["id"])]
    assert owner["Subject"] == f"[TEST][VitaCoreX][TAX][QUOTE REQUEST] {req['request_id']}"
    assert owner["X-VCX-Test"] == "true"
    owner_text = owner.get_body(preferencelist=("plain",)).get_content()
    for needle in ("TEST RECORD", "subtype: mixed_income", "Russian (ru)", "tax_year: 2025", "America/New_York",
                   f"/owner/requests/{req['request_id']}", "Next action:"):
        assert needle in owner_text, needle
    assert req["access_token"] not in owner_text  # bearer token never in owner mail
    assert customer["Subject"].startswith("[TEST] VitaCoreX — заявка")
    cust_text = customer.get_body(preferencelist=("plain",)).get_content()
    assert "Здравствуйте" in cust_text and "ТЕСТОВОЕ ПИСЬМО" in cust_text
    assert "нотариус" not in cust_text.lower() and "notario" not in cust_text.lower()


def test_spanish_customer_confirmation(client, env):
    from app.services import v2_outbox
    create(client, "translation_standard", locale="es")
    v2_outbox.process_due()
    subj = db_rows(env, "SELECT subject, body_text FROM v2_outbox WHERE kind='customer.request_received'")[0]
    assert subj["subject"].startswith("[TEST] VitaCoreX — hemos recibido su solicitud VX-REQ-")
    assert "Hola" in subj["body_text"] and "presupuesto" in subj["body_text"]


def test_retry_backoff_then_dead_with_desk_exception(client, env):
    from app.services import v2_outbox
    from app.services.v2_config import parse_iso, utcnow

    def failing_sender(row):
        raise v2_outbox.DeliveryError("smtp_error:TEST_FORCED")

    v2_outbox.set_sender_override(failing_sender)
    req = create(client, "tax_1040_simple", contact={"name": "Phone Only", "phone": "813-555-0102"})
    assert v2_outbox.process_due() == 1  # owner only (no customer email)
    row = db_rows(env, "SELECT * FROM v2_outbox")[0]
    assert row["status"] == "FAILED" and row["attempts"] == 1
    delay = (parse_iso(row["next_attempt_at"]) - utcnow()).total_seconds()
    assert 20 <= delay <= 31
    assert v2_outbox.process_due() == 0  # not due yet: backoff respected
    for _ in range(5):
        v2_outbox.process_due(now_override=FAR_FUTURE)
    row = db_rows(env, "SELECT * FROM v2_outbox")[0]
    assert row["status"] == "DEAD" and row["attempts"] == 6 and "TEST_FORCED" in row["last_error"]
    assert v2_outbox.process_due(now_override=FAR_FUTURE) == 0
    failed = db_rows(env, "SELECT * FROM v2_events WHERE event_type='notification.failed'")
    assert len(failed) == 1 and failed[0]["request_id"] == req["request_id"]
    exc = db_rows(env, "SELECT queue, code, status FROM v2_exceptions")
    assert exc == [{"queue": "OPS", "code": "NOTIFICATION_DEAD", "status": "OPEN"}]
    desk = client.get("/owner", headers=admin_headers())
    assert desk.status_code == 200 and "NOTIFICATION_DEAD" in desk.text and "Open exceptions (1)" in desk.text
    detail = client.get(f"/owner/requests/{req['request_id']}", headers=admin_headers())
    assert "DEAD" in detail.text and "notification.failed" in detail.text
    # the request itself is intact even though delivery failed
    assert db_rows(env, "SELECT status FROM v2_requests")[0]["status"] == "SUBMITTED"


def test_recovery_after_transient_failure(client, env):
    from app.services import v2_outbox
    calls = {"n": 0}

    def flaky(row):
        calls["n"] += 1
        if calls["n"] == 1:
            raise v2_outbox.DeliveryError("smtp_error:TEMP")
        return "ACCEPTED", "<test-message-id@example.test>"

    v2_outbox.set_sender_override(flaky)
    create(client, contact={"name": "Phone Only", "phone": "813-555-0103"})
    v2_outbox.process_due()
    v2_outbox.process_due(now_override=FAR_FUTURE)
    row = db_rows(env, "SELECT * FROM v2_outbox")[0]
    assert row["status"] == "ACCEPTED" and row["attempts"] == 2 and row["last_error"] is None
