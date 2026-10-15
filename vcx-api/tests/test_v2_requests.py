"""v2 intake: validation, lanes, honeypot, idempotency, sensitive data, NY exclusion, status access."""

from conftest import create, db_rows, payload


def test_catalog_localized_ru_from_catalog_amounts(client, catalog):
    r = client.get("/api/v2/catalog?locale=ru")
    assert r.status_code == 200
    data = r.json()
    assert data["catalog_version"] == catalog["catalog_version"]
    by_id = {s["id"]: s for s in data["services"]}
    assert set(by_id) == set(catalog["services"])
    for sid, svc in catalog["services"].items():
        assert by_id[sid]["amount_cents"] == svc["price"]["amount_cents"]
        assert by_id[sid]["name"] == svc["name"]["ru"]
        assert by_id[sid]["queue"] == svc["queue"]
    tax = by_id["tax_1040_simple"]
    dollars = catalog["services"]["tax_1040_simple"]["price"]["amount_cents"] // 100
    assert tax["price_display_text"].startswith(f"от ${dollars}")
    en = {s["id"]: s for s in client.get("/api/v2/catalog?locale=en").json()["services"]}
    assert en["tax_1040_simple"]["price_display_text"] == f"from ${dollars} — price confirmed after review"


def test_valid_request_private_lane(client, env, catalog):
    body = create(client, "tax_1040_simple", subtype="simple_w2",
                  details={"tax_year": "2025", "tax_type": "federal", "tax_state": "FL"})
    assert body["request_id"].startswith("VX-REQ-") and len(body["request_id"]) == 15
    assert len(body["access_token"]) >= 43
    assert body["queue"] == catalog["services"]["tax_1040_simple"]["queue"]
    assert body["status"] == "SUBMITTED" and body["payment_status"] == "NOT_REQUESTED"
    assert body["next_action"] == "quote" and body["amount_cents"] is None and body["duplicate"] is False
    kinds = {r["kind"] for r in db_rows(env, "SELECT kind FROM v2_outbox WHERE request_id=?", (body["request_id"],))}
    assert kinds == {"owner.request_received", "customer.request_received"}
    events = db_rows(env, "SELECT event_type FROM v2_events WHERE request_id=?", (body["request_id"],))
    assert [e["event_type"] for e in events] == ["request.received"]


def test_valid_request_business_lane(client, env):
    body = create(client, "b2b_small_claims_packet", subtype="unpaid_invoice",
                  details={"company": "Test Co LLC", "b2b_state": "FL", "claim_amount": "4200"})
    assert body["queue"] == "B2B_SMALL_CLAIMS" and body["next_action"] == "b2b_review"
    subj = db_rows(env, "SELECT subject FROM v2_outbox WHERE kind='owner.request_received'")[0]["subject"]
    assert subj == f"[TEST][VitaCoreX][B2B_SMALL_CLAIMS][B2B CASE] {body['request_id']}"


def test_fixed_and_scope_lanes_next_actions(client, catalog):
    fixed_sid = next(s for s, v in catalog["services"].items() if v["action"] == "book_pay")
    body = create(client, fixed_sid)
    assert body["next_action"] == "book_checkout"
    assert body["amount_cents"] == catalog["services"][fixed_sid]["price"]["amount_cents"]
    scope_sid = next(s for s, v in catalog["services"].items() if v["action"] == "scope")
    assert create(client, scope_sid)["next_action"] == "scope"


def test_unknown_service(client, env):
    r = client.post("/api/v2/requests", json=payload("auto_deal_review"))
    assert r.status_code == 422 and r.json() == {"error": "unknown_service"}
    assert db_rows(env, "SELECT COUNT(*) n FROM v2_requests")[0]["n"] == 0


def test_missing_contact(client):
    r = client.post("/api/v2/requests", json=payload(contact={"name": "", "email": "", "phone": ""}))
    assert r.status_code == 422
    fields = r.json()["fields"]
    assert r.json()["error"] == "validation"
    assert fields["contact.name"] == "required" and fields["contact"] == "email_or_phone_required"
    r = client.post("/api/v2/requests", json=payload(contact={"name": "A", "email": "not-an-email"}))
    assert r.json()["fields"]["contact.email"] == "invalid_email"


def test_email_only_and_phone_only_contacts_accepted(client):
    create(client, contact={"name": "Email Only", "email": "e@example.test"})
    create(client, contact={"name": "Phone Only", "phone": "813-555-0101"})


def test_extra_field_rejection(client, env):
    r = client.post("/api/v2/requests", json=payload(details={"tax_year": "2025", "ssn_last4": "1234"}))
    assert r.status_code == 422 and r.json()["fields"] == {"details.ssn_last4": "unexpected_field"}
    r = client.post("/api/v2/requests", json=payload(price_cents=1))
    assert r.status_code == 422 and r.json()["fields"] == {"price_cents": "unexpected_field"}
    r = client.post("/api/v2/requests", json=payload(subtype="not_a_subtype"))
    assert r.json()["fields"] == {"subtype": "invalid_choice"}
    assert db_rows(env, "SELECT COUNT(*) n FROM v2_requests")[0]["n"] == 0


def test_honeypot_silently_dropped(client, env):
    r = client.post("/api/v2/requests", json=payload(hp="http://spam.example"))
    assert r.status_code == 202
    assert db_rows(env, "SELECT COUNT(*) n FROM v2_requests")[0]["n"] == 0
    assert db_rows(env, "SELECT COUNT(*) n FROM v2_outbox")[0]["n"] == 0


def test_idempotent_duplicate_no_second_notification(client, env):
    body = payload()
    first = client.post("/api/v2/requests", json=body)
    second = client.post("/api/v2/requests", json=body)
    assert first.status_code == 201 and second.status_code == 200
    assert second.json()["duplicate"] is True
    assert second.json()["request_id"] == first.json()["request_id"]
    assert second.json()["access_token"] == first.json()["access_token"]
    assert db_rows(env, "SELECT COUNT(*) n FROM v2_requests")[0]["n"] == 1
    assert db_rows(env, "SELECT COUNT(*) n FROM v2_outbox")[0]["n"] == 2  # owner + customer, once


def test_ssn_and_card_rejected(client, env):
    for text in ("my ssn is 123-45-6789", "ssn 123456789", "card 4111 1111 1111 1111"):
        r = client.post("/api/v2/requests", json=payload(summary=text))
        assert r.status_code == 422 and r.json() == {"error": "sensitive_data"}, text
    r = client.post("/api/v2/requests", json=payload(details={"tax_type": "123-45-6789"}))
    assert r.json() == {"error": "sensitive_data"}
    r = client.post("/api/v2/requests", json=payload(contact={"name": "A", "phone": "123-45-6789"}))
    assert r.json() == {"error": "sensitive_data"}
    # A non-Luhn long number and a phone number are fine.
    create(client, summary="invoice 1234 5678 9012 3456 and call 813-555-0100")
    assert db_rows(env, "SELECT COUNT(*) n FROM v2_requests")[0]["n"] == 1


def _has_details_column(env):
    return any(c["name"] == "details_json" for c in db_rows(env, "PRAGMA table_info(v2_requests)"))


def test_ny_b2b_goes_to_a_jurisdiction_check_and_ny_private_accepted(client, env):
    """Owner 2026-10-15: no blanket refusal. New York business requests are accepted and flagged for the team."""
    for i, state in enumerate(("NY", "ny", "New York")):
        req = create(client, "b2b_small_claims_support", details={"company": f"Test Co {i}", "b2b_state": state})
        assert req["next_action"] == "b2b_review"
    rows = db_rows(env, "SELECT details_json FROM v2_requests") if _has_details_column(env) else []
    for r in rows:
        assert '"jurisdiction_check": "NY"' in r["details_json"]
    ok = create(client, "apostille_coordination", details={"issuing_state": "NY", "destination_country": "Spain"})
    assert ok["status"] == "SUBMITTED"
    ok2 = create(client, "tax_1040_simple", details={"tax_state": "NY", "tax_year": "2025"})
    assert ok2["queue"] == "TAX"


def test_status_requires_access_token(client):
    body = create(client)
    rid = body["request_id"]
    assert client.get(f"/api/v2/requests/{rid}").status_code == 404
    assert client.get(f"/api/v2/requests/{rid}?t=wrong").status_code == 404
    assert client.get("/api/v2/requests/VX-REQ-00000000?t=" + body["access_token"]).status_code == 404
    r = client.get(f"/api/v2/requests/{rid}?t={body['access_token']}")
    assert r.status_code == 200
    data = r.json()
    assert data["request_id"] == rid and data["status"] == "SUBMITTED" and data["quote"] is None
    assert "access_token" not in data and "contact" not in data


def test_voice_requests_secret_and_spoken(client, env, monkeypatch):
    from conftest import VOICE
    body = payload("translation_certified", locale="ru")
    assert client.post("/api/v2/voice/requests", json=body).status_code == 401
    assert client.post("/api/v2/voice/requests", json=body, headers={"X-VCX-Voice-Secret": "wrong"}).status_code == 401
    r = client.post("/api/v2/voice/requests", json=body, headers={"X-VCX-Voice-Secret": VOICE})
    assert r.status_code == 201
    out = r.json()
    assert set(out) == {"request_id", "status", "next_step_spoken", "duplicate"}
    assert "Номер заявки" in out["next_step_spoken"]
    row = db_rows(env, "SELECT source_channel FROM v2_requests WHERE request_id=?", (out["request_id"],))[0]
    assert row["source_channel"] == "phone"
    bad = client.post("/api/v2/voice/requests", json=payload(summary="ssn 123-45-6789"),
                      headers={"X-VCX-Voice-Secret": VOICE})
    assert bad.status_code == 422 and bad.json()["error"] == "sensitive_data" and bad.json()["spoken"]
    assert client.get("/api/v2/voice/catalog?locale=es", headers={"X-VCX-Voice-Secret": VOICE}).status_code == 200
    monkeypatch.setenv("VCX_VOICE_TOOL_SECRET", "")
    assert client.post("/api/v2/voice/requests", json=payload(), headers={"X-VCX-Voice-Secret": VOICE}).status_code == 503
    assert client.get("/api/v2/voice/catalog").status_code == 503
