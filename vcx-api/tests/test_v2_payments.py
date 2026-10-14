"""v2 payments: server-computed totals, quotes, webhook verification, idempotency, mock provider."""

import json
import uuid

from conftest import WHSEC, admin_headers, create, db_exec, db_rows


def _fixed_service(catalog):
    return next(s for s, v in catalog["services"].items() if v["price"]["mode"] == "fixed_after_eligibility")


def _checkout(client, req, **extra):
    body = {"request_id": req["request_id"], "access_token": req["access_token"],
            "idempotency_key": str(uuid.uuid4()), **extra}
    return client.post("/api/v2/checkout", json=body)


def _signed_post(client, event: dict, secret: str = WHSEC):
    from app.services.v2_payments import sign_payload
    raw = json.dumps(event).encode()
    return client.post("/api/v2/stripe/webhook", content=raw,
                       headers={"Stripe-Signature": sign_payload(raw, secret), "Content-Type": "application/json"})


def _session_event(session_id, amount, etype="checkout.session.completed", payment_status="paid", evt_id=None):
    return {"id": evt_id or "evt_test_" + uuid.uuid4().hex, "object": "event", "type": etype, "livemode": False,
            "data": {"object": {"id": session_id, "object": "checkout.session", "amount_total": amount,
                                "currency": "usd", "payment_status": payment_status}}}


def _session_id(env, request_id):
    return db_rows(env, "SELECT provider_session_id FROM v2_payments WHERE request_id=? ORDER BY id DESC LIMIT 1",
                   (request_id,))[0]["provider_session_id"]


def test_fixed_checkout_amount_from_catalog_and_client_amount_ignored(client, env, catalog):
    sid = _fixed_service(catalog)
    expected = catalog["services"][sid]["price"]["amount_cents"]
    req = create(client, sid)
    r = _checkout(client, req, amount_cents=1, amount=1, price=0.01)
    assert r.status_code == 200, r.text
    out = r.json()
    assert out["amount_cents"] == expected and out["provider_mode"] == "mock" and out["payment_status"] == "PENDING"
    assert out["checkout_url"].startswith("http://testserver/api/v2/mock-checkout/cs_test_mock_")
    assert db_rows(env, "SELECT amount_cents FROM v2_payments")[0]["amount_cents"] == expected


def test_same_idempotency_key_same_session(client, env, catalog):
    req = create(client, _fixed_service(catalog))
    key = str(uuid.uuid4())
    a = _checkout(client, req, idempotency_key=key).json()
    b = _checkout(client, req, idempotency_key=key).json()
    assert a["checkout_url"] == b["checkout_url"]
    assert db_rows(env, "SELECT COUNT(*) n FROM v2_payments")[0]["n"] == 1
    assert _checkout(client, {**req, "access_token": "nope"}).status_code == 404


def test_non_payable_quote_service_rejected(client, env):
    tax = create(client, "tax_1040_simple")
    r = _checkout(client, tax)
    assert r.status_code == 409 and r.json() == {"error": "not_payable"}
    scope = create(client, "legal_request")
    assert _checkout(client, scope).json() == {"error": "not_payable"}
    assert db_rows(env, "SELECT COUNT(*) n FROM v2_payments")[0]["n"] == 0


def test_quote_revision_accept_and_expiry(client, env):
    req = create(client, "tax_1040_simple", locale="es")
    rid, tok = req["request_id"], req["access_token"]
    q1 = client.post(f"/api/v2/owner/requests/{rid}/quote", headers=admin_headers(),
                     json={"amount_cents": 18900, "scope_text": "TEST scope r1", "expires_in_days": 7}).json()
    assert q1["revision"] == 1 and q1["status"] == "SENT"
    # quote sent but not accepted -> still not payable
    assert _checkout(client, req, quote_id=q1["quote_id"]).json() == {"error": "not_payable"}
    q2 = client.post(f"/api/v2/owner/requests/{rid}/quote", headers=admin_headers(),
                     json={"amount_cents": 21900, "scope_text": "TEST scope r2", "external_costs_text": "state fee",
                           "expires_in_days": 7}).json()
    assert q2["quote_id"] == q1["quote_id"] and q2["revision"] == 2
    revs = db_rows(env, "SELECT revision, status FROM v2_quotes ORDER BY revision")
    assert revs == [{"revision": 1, "status": "SUPERSEDED"}, {"revision": 2, "status": "SENT"}]
    view = client.get(f"/api/v2/quotes/{q2['quote_id']}?t={tok}").json()
    assert view["revision"] == 2 and view["amount_cents"] == 21900 and view["locale"] == "es"
    assert client.get(f"/api/v2/quotes/{q2['quote_id']}?t=bad").status_code == 404
    stale = client.post(f"/api/v2/quotes/{q2['quote_id']}/accept", json={"access_token": tok, "revision": 1})
    assert stale.status_code == 409 and stale.json()["error"] == "quote_superseded"
    acc = client.post(f"/api/v2/quotes/{q2['quote_id']}/accept", json={"access_token": tok, "revision": 2})
    assert acc.status_code == 200 and acc.json()["status"] == "ACCEPTED"
    # expire the accepted revision
    db_exec(env, "UPDATE v2_quotes SET expires_at='2000-01-01T00:00:00Z' WHERE revision=2")
    r = _checkout(client, req, quote_id=q2["quote_id"])
    assert r.status_code == 409 and r.json() == {"error": "quote_expired"}
    status = client.get(f"/api/v2/requests/{rid}?t={tok}").json()
    assert status["quote"]["status"] == "EXPIRED"
    assert db_rows(env, "SELECT COUNT(*) n FROM v2_events WHERE event_type='quote.expired'")[0]["n"] == 1
    # a fresh revision can be accepted and paid at exactly the quoted amount
    q3 = client.post(f"/api/v2/owner/requests/{rid}/quote", headers=admin_headers(),
                     json={"amount_cents": 20500, "scope_text": "TEST scope r3", "expires_in_days": 3}).json()
    client.post(f"/api/v2/quotes/{q3['quote_id']}/accept", json={"access_token": tok})
    out = _checkout(client, req, quote_id=q3["quote_id"], amount_cents=5).json()
    assert out["amount_cents"] == 20500
    assert _signed_post(client, _session_event(_session_id(env, rid), 20500)).status_code == 200
    order = db_rows(env, "SELECT * FROM v2_orders WHERE request_id=?", (rid,))[0]
    assert order["quote_id"] == q3["quote_id"] and order["quote_revision"] == 3 and order["amount_cents"] == 20500
    sent = db_rows(env, "SELECT subject FROM v2_outbox WHERE kind='customer.quote_sent' ORDER BY id")
    assert len(sent) == 3 and "presupuesto" in sent[0]["subject"]


def test_webhook_bad_signature_400(client, env, catalog):
    req = create(client, _fixed_service(catalog))
    _checkout(client, req)
    event = _session_event(_session_id(env, req["request_id"]), 12345)
    assert _signed_post(client, event, secret="whsec_wrong").status_code == 400
    raw = json.dumps(event).encode()
    assert client.post("/api/v2/stripe/webhook", content=raw).status_code == 400
    assert client.post("/api/v2/stripe/webhook", content=raw,
                       headers={"Stripe-Signature": "t=1,v1=deadbeef"}).status_code == 400
    assert db_rows(env, "SELECT COUNT(*) n FROM v2_provider_events")[0]["n"] == 0
    assert db_rows(env, "SELECT payment_status FROM v2_requests")[0]["payment_status"] == "PENDING"


def test_duplicate_webhook_no_double_order_or_notification(client, env, catalog):
    sid = _fixed_service(catalog)
    amount = catalog["services"][sid]["price"]["amount_cents"]
    req = create(client, sid)
    _checkout(client, req)
    session = _session_id(env, req["request_id"])
    event = _session_event(session, amount, evt_id="evt_test_duplicate_1")
    first = _signed_post(client, event)
    second = _signed_post(client, event)
    assert first.status_code == 200 and first.json()["result"] == "paid"
    assert second.status_code == 200 and second.json()["duplicate"] is True
    # a different event for the same session (async succeeded) is also guarded
    third = _signed_post(client, _session_event(session, amount, etype="checkout.session.async_payment_succeeded"))
    assert third.json()["result"] == "already_paid"
    assert db_rows(env, "SELECT COUNT(*) n FROM v2_orders")[0]["n"] == 1
    paid_notes = db_rows(env, "SELECT subject FROM v2_outbox WHERE kind='owner.payment_confirmed'")
    assert len(paid_notes) == 1
    assert paid_notes[0]["subject"].startswith("[TEST][VitaCoreX][") and "[PAID] VX-REQ-" in paid_notes[0]["subject"]
    assert db_rows(env, "SELECT COUNT(*) n FROM v2_provider_events")[0]["n"] == 2


def test_paid_only_via_verified_event(client, env, catalog):
    req = create(client, _fixed_service(catalog))
    rid, tok = req["request_id"], req["access_token"]
    out = _checkout(client, req).json()
    # visiting the success URL / status with provider-ish params changes nothing
    for extra in ("", "&c=1", "&session_id=cs_test_x&paid=1&payment_status=paid"):
        st = client.get(f"/api/v2/requests/{rid}?t={tok}{extra}").json()
        assert st["payment_status"] == "PENDING" and st["order_id"] is None
    # viewing the mock checkout page changes nothing
    assert client.get(out["checkout_url"].replace("http://testserver", "")).status_code == 200
    assert client.get(f"/api/v2/requests/{rid}?t={tok}").json()["payment_status"] == "PENDING"
    # mock Pay goes through the signed webhook path, then redirects to the success URL
    r = client.post(out["checkout_url"].replace("http://testserver", "") + "/pay", follow_redirects=False)
    assert r.status_code == 303
    assert r.headers["location"] == f"http://localhost:4646/order-status.html?r={rid}&t={tok}"
    st = client.get(f"/api/v2/requests/{rid}?t={tok}").json()
    assert st["payment_status"] == "PAID" and st["status"] == "ORDER_CREATED" and st["order_id"].startswith("VX-ORD-")
    pe = db_rows(env, "SELECT provider_event_id, status FROM v2_provider_events")
    assert len(pe) == 1 and pe[0]["status"] == "PROCESSED" and pe[0]["provider_event_id"].startswith("evt_mock_")
    assert _checkout(client, req).json() == {"error": "already_paid"}


def test_mock_fail_and_cancel(client, env, catalog):
    req = create(client, _fixed_service(catalog))
    out = _checkout(client, req).json()
    path = out["checkout_url"].replace("http://testserver", "")
    r = client.post(path + "/fail", follow_redirects=False)
    assert r.status_code == 303 and r.headers["location"].endswith("&c=1")
    st = client.get(f"/api/v2/requests/{req['request_id']}?t={req['access_token']}").json()
    assert st["payment_status"] == "FAILED" and st["order_id"] is None
    assert client.post(path + "/bogus").status_code == 404


def test_amount_mismatch_is_exception_not_order(client, env, catalog):
    req = create(client, _fixed_service(catalog))
    _checkout(client, req)
    r = _signed_post(client, _session_event(_session_id(env, req["request_id"]), 1))
    assert r.json()["result"] == "amount_mismatch"
    assert db_rows(env, "SELECT COUNT(*) n FROM v2_orders")[0]["n"] == 0
    exc = db_rows(env, "SELECT queue, code FROM v2_exceptions")
    assert exc == [{"queue": "PAYMENT_EXCEPTION", "code": "AMOUNT_MISMATCH"}]
    subj = db_rows(env, "SELECT subject FROM v2_outbox WHERE kind='owner.payment_exception'")[0]["subject"]
    assert "[PAYMENT EXCEPTION]" in subj


def test_live_event_ignored_outside_production(client, env, catalog):
    req = create(client, _fixed_service(catalog))
    _checkout(client, req)
    event = _session_event(_session_id(env, req["request_id"]), 12345)
    event["livemode"] = True
    assert _signed_post(client, event).json()["result"] == "ignored"
    assert db_rows(env, "SELECT payment_status FROM v2_requests")[0]["payment_status"] == "PENDING"


def test_stripe_live_key_refused_and_test_mode_params(client, env, catalog, monkeypatch):
    from app.services import v2_payments
    req = create(client, _fixed_service(catalog), contact={"name": "Stripe Test", "email": "s@example.test"})
    monkeypatch.setenv("VCX_PAYMENTS_MODE", "stripe_test")
    monkeypatch.setenv("STRIPE_SECRET_KEY", "sk_live_placeholder")
    r = _checkout(client, req)
    assert r.status_code == 503 and r.json() == {"error": "live_key_refused"}
    monkeypatch.setenv("STRIPE_SECRET_KEY", "")
    assert _checkout(client, req).status_code == 503
    captured = {}

    def fake_create(api_key, params, idem):
        captured.update(api_key_prefix=api_key[:8], params=params, idem=idem)
        return "cs_test_fake_session_1", "https://checkout.stripe.test/c/pay/cs_test_fake_session_1"

    monkeypatch.setattr(v2_payments, "_stripe_create_session", fake_create)
    monkeypatch.setenv("STRIPE_SECRET_KEY", "sk_test_placeholder")
    out = _checkout(client, req, amount_cents=1).json()
    assert out["provider_mode"] == "stripe_test" and out["checkout_url"].startswith("https://checkout.stripe.test/")
    params = captured["params"]
    assert set(params["metadata"]) == {"request_id", "order_id", "service_id", "catalog_version"}
    assert params["metadata"] == params["payment_intent_data"]["metadata"]
    assert params["line_items"][0]["price_data"]["unit_amount"] == out["amount_cents"]
    assert params["success_url"].startswith("http://localhost:4646/order-status.html?r=")
    assert params["cancel_url"].endswith("&c=1")
    assert "s@example.test" not in json.dumps(params["metadata"])
    assert _signed_post(client, _session_event("cs_test_fake_session_1", out["amount_cents"])).json()["result"] == "paid"
