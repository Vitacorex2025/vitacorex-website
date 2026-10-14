"""vcx-api v2 — checkout with server-computed totals, Stripe webhook, mock provider.

Payment becomes PAID only from a signature-verified provider event processed
by handle_webhook(). The mock provider (preview only) signs Stripe-shaped
events with the same webhook secret and feeds them through that same function.
Provider metadata carries opaque ids only.
"""

import hashlib
import hmac
import json
import logging
import secrets
import sqlite3
import time
import uuid

import stripe

from ..db import get_conn
from . import v2_catalog, v2_messages, v2_store
from .v2_config import (
    is_production, now_iso, owner_email, payments_mode, stripe_secret_key, webhook_secret,
)
from .v2_store import StoreError
from .v2_validation import IDEMPOTENCY_RE

logger = logging.getLogger("vcx.v2.payments")

HANDLED_EVENTS = {
    "checkout.session.completed",
    "checkout.session.async_payment_succeeded",
    "checkout.session.async_payment_failed",
    "checkout.session.expired",
}


# ── provider mode ─────────────────────────────────────────────────────

def provider_mode_checked() -> str:
    """Resolve the payment provider, refusing unsafe key/environment combos."""
    mode = payments_mode()
    if not webhook_secret():
        raise StoreError(503, "payments_not_configured")
    if mode == "mock":
        if is_production():
            raise StoreError(503, "payments_not_configured")
        return "mock"
    if mode in ("stripe_test", "stripe_live"):
        key = stripe_secret_key()
        is_live = key.startswith(("sk_live_", "rk_live_"))
        is_test = key.startswith(("sk_test_", "rk_test_"))
        if is_live and not (is_production() and mode == "stripe_live"):
            raise StoreError(503, "live_key_refused")
        if is_test and mode != "stripe_test":
            raise StoreError(503, "payments_not_configured")
        if not (is_live or is_test):
            raise StoreError(503, "payments_not_configured")
        return mode
    raise StoreError(503, "payments_not_configured")


def _stripe_create_session(api_key: str, params: dict, idempotency_key: str) -> tuple[str, str]:
    """Network call (Stripe test mode). Isolated so tests can replace it."""
    client = stripe.StripeClient(api_key)
    session = client.v1.checkout.sessions.create(params=params, options={"idempotency_key": idempotency_key})
    return session.id, session.url


def _stripe_expire_session(api_key: str, session_id: str) -> None:
    try:
        stripe.StripeClient(api_key).v1.checkout.sessions.expire(session_id)
    except Exception as exc:  # best effort; a late payment is still caught by the webhook guard
        logger.warning("could not expire superseded session (%s)", type(exc).__name__)


# ── checkout ──────────────────────────────────────────────────────────

def _resolve_amount(conn, req: dict, quote_id) -> tuple[int, str | None, int | None]:
    service = v2_catalog.get_service(req["service_id"])
    if service is None:
        raise StoreError(409, "not_payable")
    q = v2_store.latest_quote(conn, req["request_id"])
    if quote_id is not None:
        if not isinstance(quote_id, str) or not q or q["quote_id"] != quote_id:
            raise StoreError(409, "not_payable")
    if quote_id is not None or (v2_catalog.fixed_amount_cents(service) is None and q):
        if q["status"] == "EXPIRED":
            raise StoreError(409, "quote_expired")
        if q["status"] != "ACCEPTED":
            raise StoreError(409, "not_payable")
        return int(q["amount_cents"]), q["quote_id"], int(q["revision"])
    fixed = v2_catalog.fixed_amount_cents(service)
    if fixed is None:
        raise StoreError(409, "not_payable")
    return fixed, None, None


def _checkout_response(pay: dict) -> dict:
    status = pay["status"]
    return {
        "checkout_url": pay["checkout_url"],
        "provider_mode": pay["provider_mode"],
        "amount_cents": pay["amount_cents"],
        "payment_status": "EXPIRED" if status == "SUPERSEDED" else status,
        "order_id": pay["order_id"],
    }


def create_checkout(body: dict, api_base_url: str) -> dict:
    if not isinstance(body, dict):
        raise StoreError(422, "validation", fields={"body": "invalid_json"})
    request_id, token = body.get("request_id"), body.get("access_token")
    idem, quote_id = body.get("idempotency_key"), body.get("quote_id")
    if not isinstance(idem, str) or not IDEMPOTENCY_RE.match(idem):
        raise StoreError(422, "validation", fields={"idempotency_key": "required" if not idem else "invalid"})
    if not isinstance(request_id, str):
        raise StoreError(404, "not_found")
    mode = provider_mode_checked()

    with get_conn() as conn:
        req = v2_store._fetch_request(conn, request_id)
        if not v2_store.token_matches(req, token):
            raise StoreError(404, "not_found")
        existing = conn.execute("SELECT * FROM v2_payments WHERE idempotency_key=?", (idem,)).fetchone()
        if existing:
            if existing["request_id"] != request_id:
                raise StoreError(409, "idempotency_conflict")
            return _checkout_response(dict(existing))
        if req["payment_status"] in ("PAID", "PROCESSING"):
            raise StoreError(409, "already_paid")
        if req["status"] in v2_store.TERMINAL_FOR_PAYMENT or req["status"] == "ORDER_CREATED":
            raise StoreError(409, "not_payable")
        v2_store.expire_due_quotes(conn, req)
        amount, q_id, q_rev = _resolve_amount(conn, req, quote_id)
        prev = conn.execute("SELECT order_id FROM v2_payments WHERE request_id=? ORDER BY id LIMIT 1",
                            (request_id,)).fetchone()
        order_id = prev["order_id"] if prev else v2_store.new_ref("VX-ORD-")
        stale = [dict(r) for r in conn.execute(
            "SELECT provider_mode, provider_session_id FROM v2_payments WHERE request_id=? AND status='PENDING'",
            (request_id,)).fetchall()]
    # (transaction closed before any provider network call)

    success_url = v2_messages.status_link(request_id, req["access_token"])
    cancel_url = success_url + "&c=1"
    cat_version = v2_catalog.catalog_version()
    metadata = {"request_id": request_id, "order_id": order_id, "service_id": req["service_id"],
                "catalog_version": cat_version}

    if mode == "mock":
        session_id = "cs_test_mock_" + secrets.token_hex(12)
        checkout_url = f"{api_base_url.rstrip('/')}/api/v2/mock-checkout/{session_id}"
    else:
        params = {
            "mode": "payment",
            "line_items": [{
                "quantity": 1,
                "price_data": {
                    "currency": "usd",
                    "unit_amount": amount,
                    "product_data": {"name": f"VitaCoreX — {v2_messages.service_name(req['service_id'], 'en')}"},
                },
            }],
            "success_url": success_url,
            "cancel_url": cancel_url,
            "client_reference_id": request_id,
            "metadata": metadata,
            "payment_intent_data": {"metadata": metadata},
        }
        if req.get("contact_email"):
            params["customer_email"] = req["contact_email"]
        try:
            session_id, checkout_url = _stripe_create_session(stripe_secret_key(), params, f"vcx-checkout-{idem}")
        except StoreError:
            raise
        except Exception as exc:
            logger.warning("stripe session create failed (%s)", type(exc).__name__)
            raise StoreError(502, "provider_unavailable") from exc
        for s in stale:
            if s["provider_mode"] == mode:
                _stripe_expire_session(stripe_secret_key(), s["provider_session_id"])

    now = now_iso()
    with get_conn() as conn:
        try:
            conn.execute(
                "UPDATE v2_payments SET status='SUPERSEDED', updated_at=? WHERE request_id=? AND status='PENDING'",
                (now, request_id))
            conn.execute(
                "INSERT INTO v2_payments (request_id, order_id, quote_id, quote_revision, idempotency_key,"
                " provider_mode, provider_session_id, amount_cents, currency, catalog_version, status, checkout_url,"
                " success_url, cancel_url, created_at, updated_at)"
                " VALUES (?,?,?,?,?,?,?,?, 'USD', ?, 'PENDING', ?,?,?,?,?)",
                (request_id, order_id, q_id, q_rev, idem, mode, session_id, amount, cat_version, checkout_url,
                 success_url, cancel_url, now, now))
        except sqlite3.IntegrityError:
            conn.rollback()
            existing = conn.execute("SELECT * FROM v2_payments WHERE idempotency_key=?", (idem,)).fetchone()
            if existing and existing["request_id"] == request_id:
                return _checkout_response(dict(existing))
            raise StoreError(409, "idempotency_conflict") from None
        conn.execute("UPDATE v2_requests SET payment_status='PENDING', amount_cents=?, updated_at=? WHERE request_id=?",
                     (amount, now, request_id))
        v2_store.add_event(conn, "checkout.created", req, actor="customer", order_id=order_id, quote_id=q_id,
                           data={"provider_mode": mode, "amount_cents": amount, "quote_revision": q_rev})
        pay = dict(conn.execute("SELECT * FROM v2_payments WHERE idempotency_key=?", (idem,)).fetchone())
    return _checkout_response(pay)


# ── webhook ───────────────────────────────────────────────────────────

def sign_payload(payload: bytes, secret: str, timestamp: int | None = None) -> str:
    ts = int(timestamp if timestamp is not None else time.time())
    sig = hmac.new(secret.encode(), f"{ts}.".encode() + payload, hashlib.sha256).hexdigest()
    return f"t={ts},v1={sig}"


def handle_webhook(payload: bytes, sig_header: str | None) -> tuple[int, dict]:
    secret = webhook_secret()
    if not secret:
        return 503, {"error": "webhook_not_configured"}
    if not sig_header:
        return 400, {"error": "invalid_signature"}
    try:
        stripe.Webhook.construct_event(payload, sig_header, secret)
    except (stripe.SignatureVerificationError, ValueError):
        return 400, {"error": "invalid_signature"}
    try:
        event = json.loads(payload)
        evt_id, etype = event["id"], event["type"]
        obj = event.get("data", {}).get("object", {}) or {}
        if not isinstance(evt_id, str) or not isinstance(etype, str) or not isinstance(obj, dict):
            raise ValueError
    except (ValueError, KeyError, TypeError, AttributeError):
        return 400, {"error": "invalid_payload"}
    livemode = bool(event.get("livemode"))

    with get_conn() as conn:
        try:
            conn.execute(
                "INSERT INTO v2_provider_events (provider, provider_event_id, event_type, object_id, livemode,"
                " payload_sha256, status, received_at) VALUES ('stripe',?,?,?,?,?,'RECEIVED',?)",
                (evt_id, etype[:80], str(obj.get("id") or "")[:120], 1 if livemode else 0,
                 hashlib.sha256(payload).hexdigest(), now_iso()))
        except sqlite3.IntegrityError:
            conn.rollback()
            row = conn.execute("SELECT status FROM v2_provider_events WHERE provider_event_id=?", (evt_id,)).fetchone()
            if row and row["status"] in ("PROCESSED", "IGNORED", "UNMATCHED"):
                return 200, {"received": True, "duplicate": True}
    try:
        result = _process_event(evt_id, etype, obj, livemode)
    except Exception:
        logger.exception("webhook processing failed for a provider event")
        with get_conn() as conn:
            conn.execute("UPDATE v2_provider_events SET status='ERROR' WHERE provider_event_id=?", (evt_id,))
        return 500, {"error": "processing_failed"}
    v2_store._kick_outbox()
    return 200, {"received": True, "duplicate": False, "result": result}


def _finish_event(conn, evt_id: str, status: str, request_id=None, note=None) -> None:
    conn.execute(
        "UPDATE v2_provider_events SET status=?, request_id=?, note=?, processed_at=? WHERE provider_event_id=?",
        (status, request_id, note, now_iso(), evt_id))


def _process_event(evt_id: str, etype: str, obj: dict, livemode: bool) -> str:
    with get_conn() as conn:
        if livemode and not is_production():
            _finish_event(conn, evt_id, "IGNORED", note="live_event_outside_production")
            return "ignored"
        if etype not in HANDLED_EVENTS:
            _finish_event(conn, evt_id, "IGNORED", note="unhandled_type")
            return "ignored"
        pay_row = conn.execute("SELECT * FROM v2_payments WHERE provider_session_id=?",
                               (str(obj.get("id") or ""),)).fetchone()
        if not pay_row:
            meta_req = (obj.get("metadata") or {}).get("request_id") if isinstance(obj.get("metadata"), dict) else None
            known = v2_store._fetch_request(conn, meta_req) if isinstance(meta_req, str) else None
            if known and obj.get("payment_status") == "paid":
                v2_store.add_exception(conn, "PAYMENT_EXCEPTION", "UNMATCHED_PAYMENT", known["request_id"],
                                       evt_id, "Paid provider session not found in local payments")
            _finish_event(conn, evt_id, "UNMATCHED", request_id=known["request_id"] if known else None)
            return "unmatched"
        pay = dict(pay_row)
        req = v2_store._fetch_request(conn, pay["request_id"])
        if etype in ("checkout.session.completed", "checkout.session.async_payment_succeeded"):
            ps = obj.get("payment_status")
            if etype == "checkout.session.async_payment_succeeded" or ps == "paid":
                result = _mark_paid(conn, req, pay, obj, evt_id)
            elif ps == "unpaid":
                result = _mark_processing(conn, req, pay, evt_id)
            else:
                result = "ignored_payment_status"
        elif etype == "checkout.session.async_payment_failed":
            result = _mark_closed(conn, req, pay, "FAILED", evt_id)
        else:
            result = _mark_closed(conn, req, pay, "EXPIRED", evt_id)
        _finish_event(conn, evt_id, "PROCESSED", request_id=req["request_id"], note=result)
        return result


def _payment_exception(conn, req: dict, code: str, detail: str, evt_id: str) -> None:
    v2_store.add_exception(conn, "PAYMENT_EXCEPTION", code, req["request_id"], evt_id, detail)
    ev = v2_store.add_event(conn, "payment.exception", req, actor="webhook", provider_event_id=evt_id,
                            data={"code": code})
    v2_store.enqueue(conn, ev, "owner.payment_exception", "owner", owner_email(),
                     v2_messages.owner_payment_exception(req, code, detail, now_iso()), req["request_id"])


def _mark_paid(conn, req: dict, pay: dict, obj: dict, evt_id: str) -> str:
    prev_status = pay["status"]
    if prev_status == "PAID":
        return "already_paid"
    now = now_iso()
    pi = obj.get("payment_intent")
    cur = conn.execute(
        "UPDATE v2_payments SET status='PAID', payment_intent_ref=?, updated_at=? WHERE id=? AND status!='PAID'",
        (str(pi)[:120] if isinstance(pi, str) else None, now, pay["id"]))
    if cur.rowcount == 0:
        return "already_paid"
    amount_total = obj.get("amount_total")
    currency = str(obj.get("currency") or "").lower()
    if amount_total != pay["amount_cents"] or currency != "usd":
        conn.execute("UPDATE v2_payments SET exception_code='AMOUNT_MISMATCH' WHERE id=?", (pay["id"],))
        conn.execute("UPDATE v2_requests SET payment_status='PAID', updated_at=? WHERE request_id=?",
                     (now, req["request_id"]))
        _payment_exception(conn, req, "AMOUNT_MISMATCH",
                           f"Provider amount {amount_total} {currency} differs from expected {pay['amount_cents']} usd",
                           evt_id)
        return "amount_mismatch"
    if req["payment_status"] == "PAID":
        conn.execute("UPDATE v2_payments SET exception_code='DUPLICATE_PAYMENT' WHERE id=?", (pay["id"],))
        _payment_exception(conn, req, "DUPLICATE_PAYMENT",
                           "A second checkout session was paid for an already paid request; refund review needed",
                           evt_id)
        return "duplicate_payment"
    if req["status"] in v2_store.TERMINAL_FOR_PAYMENT:
        conn.execute("UPDATE v2_requests SET payment_status='PAID', updated_at=? WHERE request_id=?",
                     (now, req["request_id"]))
        _payment_exception(conn, req, "PAID_ON_CLOSED_REQUEST",
                           f"Payment received while request is {req['status']}", evt_id)
        return "paid_on_closed_request"
    conn.execute("UPDATE v2_requests SET payment_status='PAID', status='ORDER_CREATED', updated_at=? WHERE request_id=?",
                 (now, req["request_id"]))
    cur = conn.execute(
        "INSERT OR IGNORE INTO v2_orders (order_id, request_id, service_id, quote_id, quote_revision, amount_cents,"
        " currency, catalog_version, status, created_at, updated_at)"
        " VALUES (?,?,?,?,?,?, 'USD', ?, 'AWAITING_REQUIREMENTS', ?,?)",
        (pay["order_id"], req["request_id"], req["service_id"], pay["quote_id"], pay["quote_revision"],
         pay["amount_cents"], pay["catalog_version"], now, now))
    if cur.rowcount == 1:
        fresh = v2_store._fetch_request(conn, req["request_id"])
        ev = v2_store.add_event(conn, "payment.confirmed", fresh, actor="webhook", order_id=pay["order_id"],
                                quote_id=pay["quote_id"], provider_event_id=evt_id,
                                data={"amount_cents": pay["amount_cents"], "provider_mode": pay["provider_mode"]})
        v2_store.add_event(conn, "order.created", fresh, actor="webhook", order_id=pay["order_id"],
                           quote_id=pay["quote_id"], provider_event_id=evt_id)
        quote_label = f"{pay['quote_id']} r{pay['quote_revision']}" if pay["quote_id"] else "fixed catalog price"
        v2_store.enqueue(conn, ev, "owner.payment_confirmed", "owner", owner_email(),
                         v2_messages.owner_paid(fresh, fresh["details"], pay["order_id"], pay["amount_cents"],
                                                quote_label), req["request_id"])
        if fresh.get("contact_email"):
            v2_store.enqueue(conn, ev, "customer.payment_confirmed", "customer", fresh["contact_email"],
                             v2_messages.customer_paid(fresh, pay["order_id"], pay["amount_cents"]), req["request_id"])
    if prev_status == "SUPERSEDED":
        v2_store.add_exception(conn, "PAYMENT_EXCEPTION", "SUPERSEDED_SESSION_PAID", req["request_id"], evt_id,
                               "An older checkout session was paid; confirm the scope and amount with the customer")
    return "paid"


def _mark_processing(conn, req: dict, pay: dict, evt_id: str) -> str:
    cur = conn.execute("UPDATE v2_payments SET status='PROCESSING', updated_at=? WHERE id=? AND status='PENDING'",
                       (now_iso(), pay["id"]))
    if cur.rowcount:
        conn.execute("UPDATE v2_requests SET payment_status='PROCESSING', updated_at=? WHERE request_id=?"
                     " AND payment_status IN ('PENDING','NOT_REQUESTED')", (now_iso(), req["request_id"]))
        v2_store.add_event(conn, "payment.processing", req, actor="webhook", order_id=pay["order_id"],
                           provider_event_id=evt_id)
        return "processing"
    return "no_change"


def _mark_closed(conn, req: dict, pay: dict, new_status: str, evt_id: str) -> str:
    cur = conn.execute(
        "UPDATE v2_payments SET status=?, updated_at=? WHERE id=? AND status IN ('PENDING','PROCESSING')",
        (new_status, now_iso(), pay["id"]))
    if not cur.rowcount:
        return "no_change"
    conn.execute("UPDATE v2_requests SET payment_status=?, updated_at=? WHERE request_id=?"
                 " AND payment_status IN ('PENDING','PROCESSING')", (new_status, now_iso(), req["request_id"]))
    v2_store.add_event(conn, "payment.failed" if new_status == "FAILED" else "checkout.expired", req,
                       actor="webhook", order_id=pay["order_id"], provider_event_id=evt_id,
                       data={"status": new_status})
    return new_status.lower()


# ── mock provider (preview only) ──────────────────────────────────────

MOCK_OUTCOMES = {
    "pay": "checkout.session.completed",
    "fail": "checkout.session.async_payment_failed",
    "expire": "checkout.session.expired",
}


def mock_enabled() -> bool:
    return payments_mode() == "mock" and not is_production()


def get_payment_by_session(session_id: str) -> dict | None:
    with get_conn() as conn:
        row = conn.execute("SELECT * FROM v2_payments WHERE provider_session_id=?", (session_id,)).fetchone()
        return dict(row) if row else None


def build_mock_event(pay: dict, outcome: str, service_id: str) -> bytes:
    etype = MOCK_OUTCOMES[outcome]
    obj = {
        "id": pay["provider_session_id"],
        "object": "checkout.session",
        "mode": "payment",
        "amount_total": pay["amount_cents"],
        "currency": "usd",
        "client_reference_id": pay["request_id"],
        "payment_status": "paid" if outcome == "pay" else "unpaid",
        "status": {"pay": "complete", "fail": "complete", "expire": "expired"}[outcome],
        "payment_intent": ("pi_mock_" + uuid.uuid4().hex[:16]) if outcome != "expire" else None,
        "metadata": {"request_id": pay["request_id"], "order_id": pay["order_id"],
                     "service_id": service_id, "catalog_version": pay["catalog_version"]},
        "livemode": False,
    }
    event = {
        "id": "evt_mock_" + uuid.uuid4().hex,
        "object": "event",
        "api_version": "mock",
        "created": int(time.time()),
        "livemode": False,
        "type": etype,
        "data": {"object": obj},
    }
    return json.dumps(event, separators=(",", ":")).encode()


def run_mock_outcome(session_id: str, outcome: str) -> tuple[int, dict, dict | None]:
    pay = get_payment_by_session(session_id)
    if not pay:
        return 404, {"error": "not_found"}, None
    secret = webhook_secret()
    if not secret:
        return 503, {"error": "payments_not_configured"}, pay
    req = v2_store.get_request(pay["request_id"])
    payload = build_mock_event(pay, outcome, req["service_id"] if req else "")
    status, body = handle_webhook(payload, sign_payload(payload, secret))
    return status, body, get_payment_by_session(session_id)
