"""vcx-api v2 — persistence: requests, quotes, events, outbox, exceptions.

All writes that must happen together (record + event + outbox row) share one
sqlite transaction, so a saved record can never silently lose its
notification. SQL is parameterized everywhere.
"""

import json
import secrets
import sqlite3
import uuid
from datetime import timedelta

from ..db import get_conn
from . import v2_catalog, v2_messages
from .v2_config import is_production, iso, now_iso, owner_email, utcnow

CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"
SCHEMA_VERSION = "vcx-events/1"

REQUEST_STATUSES = [
    "DRAFT", "SUBMITTED", "TRIAGE", "NEEDS_INFORMATION", "QUOTE_PENDING", "QUOTED",
    "ACCEPTED", "ORDER_CREATED", "DECLINED", "REFERRED_WITH_CONSENT", "WITHDRAWN",
]
PAYMENT_STATUSES = [
    "NOT_REQUESTED", "PENDING", "PROCESSING", "PAID", "FAILED", "EXPIRED",
    "PARTIALLY_REFUNDED", "REFUNDED", "DISPUTED",
]

# Owner-allowed manual transitions. QUOTED/ACCEPTED/ORDER_CREATED are reached
# only through quote creation, customer acceptance and verified payment.
OWNER_TRANSITIONS = {
    "SUBMITTED": {"TRIAGE", "NEEDS_INFORMATION", "QUOTE_PENDING", "DECLINED", "WITHDRAWN", "REFERRED_WITH_CONSENT"},
    "TRIAGE": {"NEEDS_INFORMATION", "QUOTE_PENDING", "DECLINED", "WITHDRAWN", "REFERRED_WITH_CONSENT"},
    "NEEDS_INFORMATION": {"TRIAGE", "QUOTE_PENDING", "DECLINED", "WITHDRAWN", "REFERRED_WITH_CONSENT"},
    "QUOTE_PENDING": {"NEEDS_INFORMATION", "DECLINED", "WITHDRAWN"},
    "QUOTED": {"QUOTE_PENDING", "NEEDS_INFORMATION", "DECLINED", "WITHDRAWN"},
    "ACCEPTED": {"DECLINED", "WITHDRAWN"},
    "ORDER_CREATED": set(),
    "DECLINED": {"TRIAGE"},
    "WITHDRAWN": {"TRIAGE"},
    "REFERRED_WITH_CONSENT": set(),
}

TERMINAL_FOR_PAYMENT = {"DECLINED", "WITHDRAWN", "REFERRED_WITH_CONSENT", "DRAFT"}


class StoreError(Exception):
    def __init__(self, status_code: int, error: str, **extra):
        super().__init__(error)
        self.status_code = status_code
        self.body = {"error": error, **extra}


# ── ids ───────────────────────────────────────────────────────────────

def new_ref(prefix: str) -> str:
    return prefix + "".join(secrets.choice(CROCKFORD) for _ in range(8))


def new_event_id() -> str:
    return "evt_" + uuid.uuid4().hex


def new_access_token() -> str:
    return secrets.token_urlsafe(32)


# ── events / outbox / exceptions ──────────────────────────────────────

def add_event(conn, event_type: str, req: dict | None, actor: str = "system", data: dict | None = None,
              order_id=None, quote_id=None, provider_event_id=None, correlation_id=None) -> str:
    event_id = new_event_id()
    req = req or {}
    conn.execute(
        "INSERT INTO v2_events (event_id, event_type, occurred_at_utc, request_id, service_id, locale,"
        " source_channel, schema_version, order_id, quote_id, provider_event_id, correlation_id, actor, data_json)"
        " VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        (event_id, event_type, now_iso(), req.get("request_id"), req.get("service_id"), req.get("locale"),
         req.get("source_channel"), SCHEMA_VERSION, order_id, quote_id, provider_event_id, correlation_id,
         actor, json.dumps(data or {}, ensure_ascii=False)),
    )
    return event_id


def enqueue(conn, source_event_id: str, kind: str, audience: str, recipient: str | None,
            message: tuple[str, str, str], request_id: str | None) -> bool:
    subject, body_text, body_html = message
    now = now_iso()
    cur = conn.execute(
        "INSERT OR IGNORE INTO v2_outbox (event_id, source_event_id, request_id, kind, channel, audience,"
        " recipient, subject, body_text, body_html, status, attempts, next_attempt_at, created_at, updated_at)"
        " VALUES (?,?,?,?,?,?,?,?,?,?,'PENDING',0,?,?,?)",
        (f"{source_event_id}:{kind}", source_event_id, request_id, kind, "email", audience,
         recipient or "", subject, body_text, body_html, now, now, now),
    )
    return cur.rowcount == 1


def add_exception(conn, queue: str, code: str, request_id: str | None, ref: str | None, detail: str) -> None:
    conn.execute(
        "INSERT INTO v2_exceptions (queue, code, request_id, ref, detail, status, created_at)"
        " VALUES (?,?,?,?,?,'OPEN',?)",
        (queue, code, request_id, ref, detail[:500], now_iso()),
    )


def _kick_outbox():
    try:
        from . import v2_outbox
        v2_outbox.kick()
    except Exception:  # pragma: no cover - worker optional
        pass


# ── requests ──────────────────────────────────────────────────────────

def row_to_request(row) -> dict | None:
    if row is None:
        return None
    req = dict(row)
    try:
        req["details"] = json.loads(req.get("details_json") or "{}")
    except ValueError:
        req["details"] = {}
    return req


def _fetch_request(conn, request_id: str) -> dict | None:
    return row_to_request(conn.execute("SELECT * FROM v2_requests WHERE request_id=?", (request_id,)).fetchone())


def create_request(clean: dict) -> tuple[dict, bool]:
    service = clean["service"]
    now = now_iso()
    with get_conn() as conn:
        existing = conn.execute("SELECT * FROM v2_requests WHERE idempotency_key=?",
                                (clean["idempotency_key"],)).fetchone()
        if existing:
            return row_to_request(existing), True
        request_id = None
        for _ in range(6):
            candidate = new_ref("VX-REQ-")
            try:
                conn.execute(
                    "INSERT INTO v2_requests (request_id, access_token, idempotency_key, service_id, subtype, lane,"
                    " queue, next_action, locale, source_channel, contact_name, contact_email, contact_phone,"
                    " details_json, summary, consent_privacy, consent_notice_version, consent_referral, status,"
                    " payment_status, amount_cents, catalog_version, is_test, created_at, updated_at)"
                    " VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,'SUBMITTED','NOT_REQUESTED',?,?,?,?,?)",
                    (candidate, new_access_token(), clean["idempotency_key"], clean["service_id"], clean["subtype"],
                     service.get("lane"), service.get("queue"), v2_catalog.next_action_for(service),
                     clean["locale"], clean["source_channel"], clean["contact"]["name"],
                     clean["contact"]["email"], clean["contact"]["phone"],
                     json.dumps(clean["details"], ensure_ascii=False), clean["summary"],
                     1 if clean["consent"]["privacy"] else 0, clean["consent"]["notice_version"],
                     1 if clean["consent"]["referral"] else 0, v2_catalog.fixed_amount_cents(service),
                     v2_catalog.catalog_version(), 0 if is_production() else 1, now, now),
                )
                request_id = candidate
                break
            except sqlite3.IntegrityError:
                existing = conn.execute("SELECT * FROM v2_requests WHERE idempotency_key=?",
                                        (clean["idempotency_key"],)).fetchone()
                if existing:
                    return row_to_request(existing), True
        if request_id is None:
            raise StoreError(500, "id_allocation_failed")
        req = _fetch_request(conn, request_id)
        evt = add_event(conn, "request.received", req, actor="voice" if req["source_channel"] == "phone" else "customer",
                        data={"queue": req["queue"], "lane": req["lane"], "subtype": req["subtype"],
                              "next_action": req["next_action"], "catalog_version": req["catalog_version"]})
        enqueue(conn, evt, "owner.request_received", "owner", owner_email(),
                v2_messages.owner_request_received(req, req["details"]), request_id)
        if req.get("contact_email"):
            enqueue(conn, evt, "customer.request_received", "customer", req["contact_email"],
                    v2_messages.customer_request_received(req), request_id)
    _kick_outbox()
    return req, False


def get_request(request_id: str) -> dict | None:
    with get_conn() as conn:
        return _fetch_request(conn, request_id)


def token_matches(req: dict | None, token) -> bool:
    if not req or not isinstance(token, str) or not token:
        return False
    return secrets.compare_digest(token.encode(), str(req["access_token"]).encode())


# ── quotes ────────────────────────────────────────────────────────────

def expire_due_quotes(conn, req: dict) -> None:
    now = now_iso()
    rows = conn.execute(
        "SELECT * FROM v2_quotes WHERE request_id=? AND status IN ('SENT','ACCEPTED') AND expires_at<=?",
        (req["request_id"], now),
    ).fetchall()
    for row in rows:
        cur = conn.execute(
            "UPDATE v2_quotes SET status='EXPIRED' WHERE id=? AND status IN ('SENT','ACCEPTED')", (row["id"],))
        if cur.rowcount:
            add_event(conn, "quote.expired", req, actor="system", quote_id=row["quote_id"],
                      data={"revision": row["revision"]})


def latest_quote(conn, request_id: str) -> dict | None:
    row = conn.execute(
        "SELECT * FROM v2_quotes WHERE request_id=? ORDER BY revision DESC LIMIT 1", (request_id,)).fetchone()
    return dict(row) if row else None


def quote_summary(q: dict | None) -> dict | None:
    if not q:
        return None
    return {"quote_id": q["quote_id"], "revision": q["revision"], "amount_cents": q["amount_cents"],
            "expires_at": q["expires_at"], "status": q["status"]}


def customer_status(request_id: str) -> dict | None:
    with get_conn() as conn:
        req = _fetch_request(conn, request_id)
        if not req:
            return None
        expire_due_quotes(conn, req)
        q = latest_quote(conn, request_id)
        order = conn.execute("SELECT order_id FROM v2_orders WHERE request_id=?", (request_id,)).fetchone()
    return {
        "request_id": req["request_id"],
        "service_id": req["service_id"],
        "subtype": req["subtype"],
        "locale": req["locale"],
        "status": req["status"],
        "payment_status": req["payment_status"],
        "amount_cents": req["amount_cents"],
        "quote": quote_summary(q),
        "created_at": req["created_at"],
        # additive
        "next_action": req["next_action"],
        "order_id": order["order_id"] if order else None,
    }


def create_quote(request_id: str, amount_cents: int, scope_text: str, external_costs_text: str | None,
                 expires_in_days: int) -> dict:
    with get_conn() as conn:
        req = _fetch_request(conn, request_id)
        if not req:
            raise StoreError(404, "not_found")
        if req["payment_status"] in ("PAID", "PROCESSING") or req["status"] in ("ORDER_CREATED", "REFERRED_WITH_CONSENT"):
            raise StoreError(409, "locked_scope")
        if req["status"] in ("DECLINED", "WITHDRAWN"):
            raise StoreError(409, "invalid_transition")
        prev = latest_quote(conn, request_id)
        quote_id = prev["quote_id"] if prev else new_ref("VX-QUO-")
        revision = (prev["revision"] + 1) if prev else 1
        now = utcnow()
        expires = iso(now + timedelta(days=expires_in_days))
        conn.execute("UPDATE v2_quotes SET status='SUPERSEDED' WHERE request_id=? AND status IN ('SENT','ACCEPTED')",
                     (request_id,))
        conn.execute(
            "INSERT INTO v2_quotes (quote_id, request_id, revision, amount_cents, currency, scope_text,"
            " external_costs_text, status, expires_at, created_at) VALUES (?,?,?,?, 'USD', ?,?, 'SENT', ?,?)",
            (quote_id, request_id, revision, amount_cents, scope_text, external_costs_text, expires, iso(now)),
        )
        # Any open checkout for an older amount must not be completed silently.
        conn.execute("UPDATE v2_payments SET status='SUPERSEDED', updated_at=? WHERE request_id=? AND status='PENDING'",
                     (iso(now), request_id))
        conn.execute(
            "UPDATE v2_requests SET status='QUOTED', amount_cents=?, payment_status=CASE WHEN payment_status='PENDING'"
            " THEN 'NOT_REQUESTED' ELSE payment_status END, updated_at=? WHERE request_id=?",
            (amount_cents, iso(now), request_id))
        req = _fetch_request(conn, request_id)
        quote = dict(conn.execute("SELECT * FROM v2_quotes WHERE quote_id=? AND revision=?",
                                  (quote_id, revision)).fetchone())
        evt = add_event(conn, "quote.sent", req, actor="owner", quote_id=quote_id,
                        data={"revision": revision, "amount_cents": amount_cents, "expires_at": expires})
        if req.get("contact_email"):
            enqueue(conn, evt, "customer.quote_sent", "customer", req["contact_email"],
                    v2_messages.customer_quote_sent(req, quote), request_id)
    _kick_outbox()
    return quote


def get_quote_for_customer(quote_id: str, token) -> tuple[dict, dict] | None:
    with get_conn() as conn:
        row = conn.execute("SELECT request_id FROM v2_quotes WHERE quote_id=? LIMIT 1", (quote_id,)).fetchone()
        if not row:
            return None
        req = _fetch_request(conn, row["request_id"])
        if not token_matches(req, token):
            return None
        expire_due_quotes(conn, req)
        q = latest_quote(conn, req["request_id"])
    return req, q


def accept_quote(quote_id: str, token, revision=None) -> dict:
    with get_conn() as conn:
        row = conn.execute("SELECT request_id FROM v2_quotes WHERE quote_id=? LIMIT 1", (quote_id,)).fetchone()
        req = _fetch_request(conn, row["request_id"]) if row else None
        if not token_matches(req, token):
            raise StoreError(404, "not_found")
        expire_due_quotes(conn, req)
        q = latest_quote(conn, req["request_id"])
        if revision is not None and revision != q["revision"]:
            raise StoreError(409, "quote_superseded", latest_revision=q["revision"])
        if q["status"] == "EXPIRED":
            raise StoreError(409, "quote_expired")
        if q["status"] == "ACCEPTED":
            return q
        if q["status"] != "SENT" or req["status"] in TERMINAL_FOR_PAYMENT:
            raise StoreError(409, "not_acceptable")
        now = now_iso()
        conn.execute("UPDATE v2_quotes SET status='ACCEPTED', accepted_at=? WHERE id=? AND status='SENT'", (now, q["id"]))
        conn.execute("UPDATE v2_requests SET status='ACCEPTED', amount_cents=?, updated_at=? WHERE request_id=?",
                     (q["amount_cents"], now, req["request_id"]))
        add_event(conn, "quote.accepted", req, actor="customer", quote_id=quote_id, data={"revision": q["revision"]})
        return latest_quote(conn, req["request_id"])


# ── owner actions ─────────────────────────────────────────────────────

def set_status(request_id: str, new_status: str, note: str | None) -> dict:
    with get_conn() as conn:
        req = _fetch_request(conn, request_id)
        if not req:
            raise StoreError(404, "not_found")
        if new_status not in REQUEST_STATUSES:
            raise StoreError(422, "validation", fields={"status": "invalid_choice"})
        allowed = OWNER_TRANSITIONS.get(req["status"], set())
        if new_status not in allowed:
            raise StoreError(409, "invalid_transition", **{"from": req["status"], "to": new_status})
        if new_status == "REFERRED_WITH_CONSENT" and not req["consent_referral"]:
            raise StoreError(409, "referral_consent_missing")
        conn.execute("UPDATE v2_requests SET status=?, updated_at=? WHERE request_id=?",
                     (new_status, now_iso(), request_id))
        etype = {"NEEDS_INFORMATION": "request.information_needed",
                 "REFERRED_WITH_CONSENT": "referral.consented"}.get(new_status, "request.status_changed")
        add_event(conn, etype, req, actor="owner",
                  data={"from": req["status"], "to": new_status, "note": (note or "")[:500]})
        return _fetch_request(conn, request_id)


def reclassify(request_id: str, service_id: str, subtype: str | None, reason: str) -> dict:
    service = v2_catalog.get_service(service_id)
    if service is None:
        raise StoreError(422, "unknown_service")
    if subtype is not None and subtype not in (service.get("subtypes") or []):
        raise StoreError(422, "validation", fields={"subtype": "invalid_choice"})
    with get_conn() as conn:
        req = _fetch_request(conn, request_id)
        if not req:
            raise StoreError(404, "not_found")
        q = latest_quote(conn, request_id)
        if req["payment_status"] in ("PAID", "PROCESSING") or (q and q["status"] == "ACCEPTED") \
                or req["status"] in ("ORDER_CREATED", "REFERRED_WITH_CONSENT"):
            raise StoreError(409, "locked_scope")
        if service.get("lane") == "business" and req["details"].get("b2b_state") == "NY":
            raise StoreError(409, "jurisdiction_excluded", code="B2B_NY_EXCLUDED")
        now = now_iso()
        conn.execute(
            "UPDATE v2_requests SET service_id=?, subtype=?, lane=?, queue=?, next_action=?, amount_cents=?,"
            " catalog_version=?, payment_status=CASE WHEN payment_status='PENDING' THEN 'NOT_REQUESTED'"
            " ELSE payment_status END, updated_at=? WHERE request_id=?",
            (service_id, subtype, service.get("lane"), service.get("queue"), v2_catalog.next_action_for(service),
             v2_catalog.fixed_amount_cents(service), v2_catalog.catalog_version(), now, request_id))
        conn.execute("UPDATE v2_payments SET status='SUPERSEDED', updated_at=? WHERE request_id=? AND status='PENDING'",
                     (now, request_id))
        new_req = _fetch_request(conn, request_id)
        add_event(conn, "request.classified", new_req, actor="owner",
                  data={"from_service": req["service_id"], "from_subtype": req["subtype"], "from_queue": req["queue"],
                        "to_service": service_id, "to_subtype": subtype, "to_queue": service.get("queue"),
                        "reason": reason[:300]})
        return new_req


def resolve_exception(exc_id: int) -> bool:
    with get_conn() as conn:
        cur = conn.execute("UPDATE v2_exceptions SET status='RESOLVED', resolved_at=? WHERE id=? AND status='OPEN'",
                           (now_iso(), exc_id))
        return cur.rowcount == 1


# ── owner desk reads ──────────────────────────────────────────────────

def list_requests(filters: dict, limit: int = 200) -> list[dict]:
    where, params = ["1=1"], []
    for key, col in (("service", "service_id"), ("queue", "queue"), ("status", "status"),
                     ("payment", "payment_status"), ("locale", "locale"), ("channel", "source_channel")):
        if filters.get(key):
            where.append(f"r.{col}=?")
            params.append(filters[key])
    if filters.get("from_utc"):
        where.append("r.created_at>=?")
        params.append(filters["from_utc"])
    if filters.get("to_utc"):
        where.append("r.created_at<?")
        params.append(filters["to_utc"])
    sql = (
        "SELECT r.*, (SELECT q.status || ' r' || q.revision FROM v2_quotes q WHERE q.request_id=r.request_id"
        " ORDER BY q.revision DESC LIMIT 1) AS quote_state,"
        " (SELECT COUNT(*) FROM v2_exceptions e WHERE e.request_id=r.request_id AND e.status='OPEN') AS open_exceptions"
        f" FROM v2_requests r WHERE {' AND '.join(where)} ORDER BY r.created_at DESC, r.rowid DESC LIMIT ?"
    )
    params.append(limit)
    with get_conn() as conn:
        return [row_to_request(r) for r in conn.execute(sql, params).fetchall()]


def open_exceptions() -> list[dict]:
    with get_conn() as conn:
        return [dict(r) for r in conn.execute(
            "SELECT * FROM v2_exceptions WHERE status='OPEN' ORDER BY created_at DESC LIMIT 100").fetchall()]


def request_detail(request_id: str) -> dict | None:
    with get_conn() as conn:
        req = _fetch_request(conn, request_id)
        if not req:
            return None
        expire_due_quotes(conn, req)
        return {
            "request": _fetch_request(conn, request_id),
            "quotes": [dict(r) for r in conn.execute(
                "SELECT * FROM v2_quotes WHERE request_id=? ORDER BY revision DESC", (request_id,)).fetchall()],
            "payments": [dict(r) for r in conn.execute(
                "SELECT id, order_id, quote_id, quote_revision, provider_mode, provider_session_id, amount_cents,"
                " currency, status, exception_code, created_at, updated_at FROM v2_payments WHERE request_id=?"
                " ORDER BY id DESC", (request_id,)).fetchall()],
            "order": (lambda r: dict(r) if r else None)(conn.execute(
                "SELECT * FROM v2_orders WHERE request_id=?", (request_id,)).fetchone()),
            "events": [dict(r) for r in conn.execute(
                "SELECT event_id, event_type, occurred_at_utc, actor, order_id, quote_id, provider_event_id, data_json"
                " FROM v2_events WHERE request_id=? ORDER BY id", (request_id,)).fetchall()],
            "notifications": [dict(r) for r in conn.execute(
                "SELECT id, kind, audience, recipient, subject, status, attempts, next_attempt_at, last_error,"
                " provider_ref, created_at, updated_at FROM v2_outbox WHERE request_id=? ORDER BY id",
                (request_id,)).fetchall()],
            "exceptions": [dict(r) for r in conn.execute(
                "SELECT * FROM v2_exceptions WHERE request_id=? ORDER BY id DESC", (request_id,)).fetchall()],
        }
