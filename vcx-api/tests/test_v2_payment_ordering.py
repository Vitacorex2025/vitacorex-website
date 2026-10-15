"""v2 payments: delayed (async) payment methods and out-of-order webhook delivery (lead-added QA cases)."""

from conftest import db_rows
from test_v2_payments import _checkout, _fixed_service, _session_event, _session_id, _signed_post
from conftest import create


def _status(env, rid):
    return db_rows(env, "SELECT payment_status FROM v2_requests WHERE request_id=?", (rid,))[0]["payment_status"]


def test_async_payment_processing_then_succeeded(client, env, catalog):
    sid = _fixed_service(catalog)
    amount = catalog["services"][sid]["price"]["amount_cents"]
    req = create(client, sid)
    assert _checkout(client, req).status_code == 200
    cs = _session_id(env, req["request_id"])
    # checkout completed but funds not yet captured (e.g. bank debit) -> PROCESSING, never PAID
    assert _signed_post(client, _session_event(cs, amount, payment_status="unpaid")).status_code == 200
    assert _status(env, req["request_id"]) == "PROCESSING"
    assert db_rows(env, "SELECT COUNT(*) n FROM v2_orders WHERE request_id=?", (req["request_id"],))[0]["n"] == 0 \
        or _status(env, req["request_id"]) != "PAID"
    assert _signed_post(client, _session_event(cs, amount, etype="checkout.session.async_payment_succeeded")).status_code == 200
    assert _status(env, req["request_id"]) == "PAID"


def test_late_failure_event_cannot_downgrade_paid(client, env, catalog):
    sid = _fixed_service(catalog)
    amount = catalog["services"][sid]["price"]["amount_cents"]
    req = create(client, sid)
    assert _checkout(client, req).status_code == 200
    cs = _session_id(env, req["request_id"])
    assert _signed_post(client, _session_event(cs, amount)).status_code == 200
    assert _status(env, req["request_id"]) == "PAID"
    # an older/out-of-order failure or expiry event arrives afterwards
    assert _signed_post(client, _session_event(cs, amount, etype="checkout.session.async_payment_failed")).status_code == 200
    assert _signed_post(client, _session_event(cs, amount, etype="checkout.session.expired")).status_code == 200
    assert _status(env, req["request_id"]) == "PAID"
