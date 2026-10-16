"""vcx-api v2 — contact notifications: the website chat transcript and Vapi's end-of-call report become an
owner email through the durable outbox (see services/v2_contact_notify.py).

POST /api/v2/contact/chat  — sent by the site's chat window (text/plain JSON, so the browser needs no preflight
                             and the request survives page close via fetch keepalive).
POST /api/v2/contact/call  — Vapi server URL; only "end-of-call-report" is used, other server messages are ignored.
                             If VCX_VAPI_SERVER_SECRET is set, the X-Vapi-Secret header must match it.
POST /api/v2/stats/hit     — the site's visitor counter for the owner's daily report (services/v2_stats.py).

Rate limits key on the visitor's address as Render's proxy reports it (the last X-Forwarded-For entry, which the
proxy appends itself); uvicorn alone would see only the proxy, so every visitor would share one limit.
"""

import hmac
import json

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

from ..rate_limit import limiter
from ..services import v2_contact_notify, v2_stats
from ..services.v2_config import env
from ..services.v2_contact_notify import NotifyRejected

router = APIRouter(prefix="/api/v2/contact", tags=["v2-contact"])
stats_router = APIRouter(prefix="/api/v2/stats", tags=["v2-stats"])

CHAT_MAX_BYTES = 128 * 1024
CALL_MAX_BYTES = 2 * 1024 * 1024  # Vapi reports carry the whole call artifact


def client_ip(request: Request) -> str:
    xff = request.headers.get("x-forwarded-for", "")
    return xff.split(",")[-1].strip() if xff.strip() else (request.client.host if request.client else "unknown")


def _json(status: int, body: dict) -> JSONResponse:
    return JSONResponse(status_code=status, content=body, headers={"Cache-Control": "no-store"})


async def _read(request: Request, limit: int):
    raw = await request.body()
    if len(raw) > limit:
        raise NotifyRejected(413, "payload_too_large")
    try:
        return json.loads(raw) if raw else None
    except ValueError as exc:
        raise NotifyRejected(422, "invalid_json") from exc


@router.post("/chat")
@limiter.limit("12/minute", key_func=client_ip)
async def chat_transcript(request: Request):
    try:
        return _json(202, v2_contact_notify.notify_chat(await _read(request, CHAT_MAX_BYTES)))
    except NotifyRejected as exc:
        return _json(exc.status_code, exc.body)


@router.post("/call")
@limiter.limit("60/minute")
async def call_report(request: Request):
    secret = env("VCX_VAPI_SERVER_SECRET")
    if secret and not hmac.compare_digest(request.headers.get("x-vapi-secret", ""), secret):
        return _json(401, {"error": "unauthorized"})
    try:
        return _json(200, v2_contact_notify.notify_call(await _read(request, CALL_MAX_BYTES)))
    except NotifyRejected as exc:
        return _json(exc.status_code, exc.body)


@stats_router.post("/hit")
@limiter.limit("120/minute", key_func=client_ip)
async def stats_hit(request: Request):
    try:
        payload = await _read(request, 4 * 1024)
        counted = v2_stats.record_hit(payload, client_ip(request), request.headers.get("user-agent", ""))
    except (NotifyRejected, v2_stats.HitRejected):
        return _json(422, {"error": "invalid_hit"})
    return _json(202, {"counted": counted})
