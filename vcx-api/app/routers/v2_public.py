"""vcx-api v2 — public endpoints: catalog, requests, status, checkout, quotes,
Stripe webhook and the preview-only mock checkout provider."""

import html
import json
import os

from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse

from ..rate_limit import limiter
from ..services import v2_catalog, v2_messages, v2_payments, v2_store
from ..services.v2_catalog import CatalogError
from ..services.v2_config import site_base
from ..services.v2_store import StoreError
from ..services.v2_validation import HoneypotTriggered, RequestRejected, validate_request

router = APIRouter(prefix="/api/v2", tags=["v2"])

MAX_BODY_BYTES = 32 * 1024
NO_STORE = {"Cache-Control": "no-store"}


def _json(status: int, body: dict) -> JSONResponse:
    return JSONResponse(status_code=status, content=body, headers=NO_STORE)


async def read_json(request: Request):
    raw = await request.body()
    if len(raw) > MAX_BODY_BYTES:
        raise RequestRejected(413, {"error": "payload_too_large"})
    if not raw:
        return None
    try:
        return json.loads(raw)
    except ValueError as exc:
        raise RequestRejected(422, {"error": "validation", "fields": {"body": "invalid_json"}}) from exc


def request_response(req: dict, duplicate: bool) -> dict:
    return {
        "request_id": req["request_id"],
        "access_token": req["access_token"],
        "service_id": req["service_id"],
        "subtype": req["subtype"],
        "queue": req["queue"],
        "status": req["status"],
        "payment_status": req["payment_status"],
        "next_action": req["next_action"],
        "amount_cents": req["amount_cents"],
        "catalog_version": req["catalog_version"],
        "duplicate": duplicate,
    }


def submit(payload, channel: str) -> tuple[int, dict, dict]:
    """Shared by web and voice: validate, persist, enqueue. Raises RequestRejected/Honeypot."""
    clean = validate_request(payload, channel)
    req, duplicate = v2_store.create_request(clean)
    return (200 if duplicate else 201), request_response(req, duplicate), req


def api_base_for(request: Request) -> str:
    return (os.getenv("VCX_API_BASE") or "").strip() or str(request.base_url).rstrip("/")


# ── catalog ───────────────────────────────────────────────────────────

@router.get("/catalog")
@limiter.limit("60/minute")
def get_catalog(request: Request, locale: str = "en"):
    try:
        return JSONResponse(v2_catalog.public_catalog(v2_catalog.normalize_locale(locale)))
    except CatalogError:
        return _json(503, {"error": "catalog_unavailable"})


# ── requests ──────────────────────────────────────────────────────────

@router.post("/requests")
@limiter.limit("10/minute")
async def create_request(request: Request):
    try:
        payload = await read_json(request)
        status, body, _ = submit(payload, "web")
    except HoneypotTriggered:
        return _json(202, {"accepted": True})
    except RequestRejected as exc:
        return _json(exc.status_code, exc.body)
    except CatalogError:
        return _json(503, {"error": "catalog_unavailable"})
    except StoreError as exc:
        return _json(exc.status_code, exc.body)
    return _json(status, body)


@router.get("/requests/{request_id}")
@limiter.limit("60/minute")
def request_status(request: Request, request_id: str, t: str | None = None):
    req = v2_store.get_request(request_id) if len(request_id) <= 40 else None
    if not v2_store.token_matches(req, t):
        return _json(404, {"error": "not_found"})
    return _json(200, v2_store.customer_status(request_id))


# ── checkout ──────────────────────────────────────────────────────────

@router.post("/checkout")
@limiter.limit("10/minute")
async def checkout(request: Request):
    try:
        body = await read_json(request)
        result = v2_payments.create_checkout(body, api_base_for(request))
    except RequestRejected as exc:
        return _json(exc.status_code, exc.body)
    except StoreError as exc:
        return _json(exc.status_code, exc.body)
    except CatalogError:
        return _json(503, {"error": "catalog_unavailable"})
    return _json(200, result)


# ── quotes (customer) ─────────────────────────────────────────────────

def _quote_view(req: dict, q: dict) -> dict:
    lc = req["locale"]
    return {
        "quote_id": q["quote_id"],
        "request_id": req["request_id"],
        "revision": q["revision"],
        "amount_cents": q["amount_cents"],
        "amount_text": v2_catalog.money_text(q["amount_cents"], lc),
        "currency": q["currency"],
        "scope_text": q["scope_text"],
        "external_costs_text": q["external_costs_text"],
        "expires_at": q["expires_at"],
        "status": q["status"],
        "service_id": req["service_id"],
        "service_name": v2_messages.service_name(req["service_id"], lc),
        "locale": lc,
        "payment_status": req["payment_status"],
    }


@router.get("/quotes/{quote_id}")
@limiter.limit("30/minute")
def view_quote(request: Request, quote_id: str, t: str | None = None):
    found = v2_store.get_quote_for_customer(quote_id, t) if len(quote_id) <= 40 else None
    if not found:
        return _json(404, {"error": "not_found"})
    req, q = found
    return _json(200, _quote_view(req, q))


@router.post("/quotes/{quote_id}/accept")
@limiter.limit("10/minute")
async def accept_quote(request: Request, quote_id: str):
    try:
        body = await read_json(request) or {}
        if not isinstance(body, dict):
            raise RequestRejected(422, {"error": "validation", "fields": {"body": "invalid_json"}})
        revision = body.get("revision")
        if revision is not None and (not isinstance(revision, int) or isinstance(revision, bool)):
            raise RequestRejected(422, {"error": "validation", "fields": {"revision": "invalid_type"}})
        q = v2_store.accept_quote(quote_id, body.get("access_token"), revision)
    except RequestRejected as exc:
        return _json(exc.status_code, exc.body)
    except StoreError as exc:
        return _json(exc.status_code, exc.body)
    req = v2_store.get_request(q["request_id"])
    return _json(200, _quote_view(req, q))


# ── Stripe webhook (raw body) ─────────────────────────────────────────

@router.post("/stripe/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    if len(payload) > 512 * 1024:
        return _json(413, {"error": "payload_too_large"})
    status, body = v2_payments.handle_webhook(payload, request.headers.get("stripe-signature"))
    return _json(status, body)


# ── mock checkout provider (VCX_PAYMENTS_MODE=mock, never production) ─

def _mock_headers() -> dict:
    site = site_base()
    return {
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow",
        "Referrer-Policy": "no-referrer",
        "Content-Security-Policy": f"default-src 'none'; style-src 'unsafe-inline'; form-action 'self' {site}; "
                                   "frame-ancestors 'none'; base-uri 'none'",
    }


MOCK_PAGE = """<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>TEST MODE checkout</title>
<style>
body{{margin:0;font:17px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;background:#eef4f8;color:#0f1c26}}
.bar{{background:#5b2bb5;color:#fff;font-weight:700;text-align:center;padding:10px;letter-spacing:.04em}}
main{{max-width:520px;margin:32px auto;padding:0 16px}}
.card{{background:#fff;border:1px solid #d3dfe8;border-radius:12px;padding:24px}}
h1{{font-size:22px;margin:0 0 12px}} dl{{display:grid;grid-template-columns:140px 1fr;gap:6px 12px;margin:0 0 20px}}
dt{{color:#4a5b68}} dd{{margin:0;font-weight:600}} .amount{{font-size:28px}}
.row{{display:flex;gap:10px;flex-wrap:wrap}} form{{margin:0}}
button,a.btn{{font:inherit;border-radius:8px;padding:10px 18px;border:1px solid #9fb3c2;background:#fff;color:#0f1c26;
cursor:pointer;text-decoration:none;display:inline-block}}
button.pay{{background:#136f79;border-color:#136f79;color:#fff}} button.fail{{border-color:#b42318;color:#b42318}}
p.note{{color:#4a5b68;font-size:15px}}
</style></head><body><div class="bar">TEST MODE — mock payment provider, no real charge</div>
<main><div class="card"><h1>Mock checkout</h1>
<dl><dt>Amount</dt><dd class="amount">{amount}</dd><dt>Service</dt><dd>{service}</dd>
<dt>Reference</dt><dd>{ref}</dd><dt>Status</dt><dd>{status}</dd></dl>
{actions}
<p class="note">Pay / Fail send a signed Stripe-shaped event through the real webhook handler.
Payment state changes only from that verified event.</p></div></main></body></html>"""


@router.get("/mock-checkout/{session_id}", response_class=HTMLResponse)
@limiter.limit("60/minute")
def mock_checkout_page(request: Request, session_id: str):
    if not v2_payments.mock_enabled():
        return _json(404, {"error": "not_found"})
    pay = v2_payments.get_payment_by_session(session_id)
    if not pay:
        return _json(404, {"error": "not_found"})
    req = v2_store.get_request(pay["request_id"])
    e = html.escape
    sid = e(session_id)
    if pay["status"] == "PENDING":
        actions = (
            '<div class="row">'
            f'<form method="post" action="/api/v2/mock-checkout/{sid}/pay"><button class="pay" type="submit">Pay (test)</button></form>'
            f'<form method="post" action="/api/v2/mock-checkout/{sid}/fail"><button class="fail" type="submit">Fail</button></form>'
            f'<a class="btn" href="{e(pay["cancel_url"])}">Cancel</a></div>'
        )
    else:
        actions = f'<p>This test checkout is no longer open.</p><a class="btn" href="{e(pay["success_url"])}">Back to status</a>'
    page = MOCK_PAGE.format(
        amount=e(v2_catalog.money_text(pay["amount_cents"], "en")),
        service=e(v2_messages.service_name(req["service_id"], "en") if req else ""),
        ref=e(pay["request_id"]), status=e(pay["status"]), actions=actions)
    return HTMLResponse(page, headers=_mock_headers())


@router.post("/mock-checkout/{session_id}/{outcome}")
@limiter.limit("20/minute")
def mock_checkout_outcome(request: Request, session_id: str, outcome: str):
    if not v2_payments.mock_enabled() or outcome not in v2_payments.MOCK_OUTCOMES:
        return _json(404, {"error": "not_found"})
    pay = v2_payments.get_payment_by_session(session_id)
    if not pay:
        return _json(404, {"error": "not_found"})
    if pay["status"] != "PENDING":
        return RedirectResponse(pay["success_url"], status_code=303, headers=_mock_headers())
    status, body, pay = v2_payments.run_mock_outcome(session_id, outcome)
    if status != 200:
        return _json(status, body)
    target = pay["success_url"] if outcome == "pay" else pay["cancel_url"]
    return RedirectResponse(target, status_code=303, headers=_mock_headers())
