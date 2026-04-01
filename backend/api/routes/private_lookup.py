"""
VitaCoreX Private Lookup — FastAPI router.

Endpoints:
  GET  /api/private-lookup/config          → PublicConfig (stripe pub key, prices)
  POST /api/private-lookup/session         → SessionCreateResponse (initiate session + Stripe checkout)
  POST /api/private-lookup/verify-payment  → PaymentVerifyResponse (verify Stripe and mint session token)
  POST /api/private-lookup/lookup          → LookupResponse (run the actual lookup)
  POST /api/private-lookup/upload          → ExtractionResult (extract fields from uploaded document)

Security:
- All endpoints are public (no auth required — tool has its own payment gate)
- Session tokens are HMAC-signed with SECRET_KEY + "vcx_lookup_salt"
- Rate limiting: max 20 requests per IP per hour (in-memory simple counter, not Redis)
- No PII in logs
- ASSISTED_PAYMENT_ENABLED = false hardcoded
"""
from __future__ import annotations

import hashlib
import hmac
import json
import logging
import os
import secrets
import time
from collections import defaultdict
from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, HTTPException, Request, UploadFile, File
from fastapi.responses import JSONResponse

from backend.private_lookup.schema import (
    LookupRequest, LookupResponse, LookupTab,
    ObligationType, PublicConfig, PaymentVerifyRequest, PaymentVerifyResponse,
    ResultState, SessionCreateResponse, SourceType,
    ExtractionResult, ExtractedField,
)
from backend.private_lookup.normalization import (
    normalize_toll_result, normalize_traffic_result, normalize_court_result,
    build_no_results_response,
)
from backend.private_lookup.connectors.tolls import run_tolls_lookup
from backend.private_lookup.connectors.traffic import run_traffic_lookup
from backend.private_lookup.connectors.courts import run_courts_lookup

router = APIRouter(prefix="/private-lookup", tags=["private-lookup"])
logger = logging.getLogger(__name__)

# ── Config from environment ──────────────────────────────────────────────────
_STRIPE_SECRET = os.getenv("STRIPE_SECRET_KEY", "").strip()
_STRIPE_PUB = os.getenv("STRIPE_PUBLISHABLE_KEY", "").strip()
_STRIPE_LOOKUP_PRICE_ID = os.getenv("STRIPE_LOOKUP_PRICE_ID", "").strip()
_STRIPE_ACTION_MEMO_PRICE_ID = os.getenv("STRIPE_ACTION_MEMO_PRICE_ID", "price_1TGRWlRyC2SuYGJbAQr45fgr").strip()
_STRIPE_CONSULT_PRICE_ID = os.getenv("STRIPE_CONSULT_PRICE_ID", "price_1TGRYRRyC2SuYGJbKckPdww8").strip()
_STRIPE_PACKET_PREP_PRICE_ID = os.getenv("STRIPE_PACKET_PREP_PRICE_ID", "price_1TGRZtRyC2SuYGJbHAoHNGV5").strip()
_STRIPE_MONITORING_PRICE_ID = os.getenv("STRIPE_MONITORING_PRICE_ID", "price_1TGRadRyC2SuYGJb5QI5drIJ").strip()
_LOOKUP_PRICE = int(os.getenv("VCX_LOOKUP_PRICE", "14"))
_ACTION_MEMO_PRICE = int(os.getenv("VCX_ACTION_MEMO_PRICE", "39"))
_MONITORING_PRICE = int(os.getenv("VCX_MONITORING_PRICE", "19"))
_SECRET_KEY = os.getenv("DOCKETMINT_SECRET_KEY", os.getenv("SECRET_KEY", "vcx_dev_secret_please_change"))
_SESSION_TTL_SECONDS = 3600 * 4  # 4 hours
_MAX_LOOKUPS_PER_SESSION = 3
_STRIPE_ENABLED = bool(_STRIPE_SECRET and _STRIPE_PUB and _STRIPE_LOOKUP_PRICE_ID)

# Free-mode override: set PRIVATE_LOOKUP_ACCESS_MODE=free to bypass Stripe even when keys are present
_ACCESS_MODE = os.getenv("PRIVATE_LOOKUP_ACCESS_MODE", "paid").strip().lower()
_FREE_MODE = _ACCESS_MODE == "free"

# SAFETY: never enable assisted payment for government obligations
ASSISTED_PAYMENT_ENABLED = False

# ── Simple in-memory rate limiter ────────────────────────────────────────────
_rate_store: dict[str, list[float]] = defaultdict(list)
_RATE_WINDOW = 3600  # 1 hour
_RATE_LIMIT = 20


def _check_rate_limit(ip: str) -> bool:
    now = time.time()
    calls = _rate_store[ip]
    calls[:] = [t for t in calls if now - t < _RATE_WINDOW]
    if len(calls) >= _RATE_LIMIT:
        return False
    calls.append(now)
    return True


def _get_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for", "")
    return forwarded.split(",")[0].strip() or (request.client.host if request.client else "unknown")


# ── Session token helpers ────────────────────────────────────────────────────
def _sign_token(payload: dict[str, Any]) -> str:
    raw = json.dumps(payload, separators=(",", ":"), sort_keys=True)
    sig = hmac.new(
        (_SECRET_KEY + "vcx_lookup_salt").encode(),
        raw.encode(),
        hashlib.sha256,
    ).hexdigest()
    import base64
    encoded = base64.urlsafe_b64encode(raw.encode()).decode()
    return f"{encoded}.{sig}"


def _verify_token(token: str) -> dict[str, Any] | None:
    import base64
    try:
        parts = token.split(".", 1)
        if len(parts) != 2:
            return None
        encoded, sig = parts
        raw = base64.urlsafe_b64decode(encoded.encode()).decode()
        expected_sig = hmac.new(
            (_SECRET_KEY + "vcx_lookup_salt").encode(),
            raw.encode(),
            hashlib.sha256,
        ).hexdigest()
        if not hmac.compare_digest(sig, expected_sig):
            return None
        payload = json.loads(raw)
        if payload.get("exp", 0) < time.time():
            return None
        return payload
    except Exception:
        return None


# ── Pre-session store (in-memory, keyed by pre_session_id) ──────────────────
_pre_sessions: dict[str, dict[str, Any]] = {}


# ── Endpoints ────────────────────────────────────────────────────────────────

@router.get("/config", response_model=PublicConfig, include_in_schema=False)
async def get_config():
    """Return safe public configuration for the frontend."""
    return PublicConfig(
        stripe_publishable_key=_STRIPE_PUB,
        lookup_price=_LOOKUP_PRICE,
        action_memo_price=_ACTION_MEMO_PRICE,
        monitoring_price=_MONITORING_PRICE,
        stripe_enabled=_STRIPE_ENABLED and not _FREE_MODE,
        lookup_access_enabled=True,
        action_memo_checkout_enabled=True,
        reminders_subscription_enabled=os.getenv("REMINDERS_SUBSCRIPTION_ENABLED", "false").lower() == "true",
        packet_prep_checkout_enabled=os.getenv("PACKET_PREP_CHECKOUT_ENABLED", "false").lower() == "true",
        booking_url="https://calendly.com/vitacorex2025/30min",
    )


@router.post("/session", response_model=SessionCreateResponse, include_in_schema=False)
async def create_session(request: Request):
    """
    Initiate a lookup session.
    If Stripe is configured, returns a Stripe Checkout URL.
    If Stripe is not configured (dev mode), returns a pre-session that can be
    immediately verified with mock payment.
    """
    ip = _get_ip(request)
    if not _check_rate_limit(ip):
        raise HTTPException(status_code=429, detail="Too many requests. Please try again later.")

    # Inline TTL cleanup: evict abandoned pre-sessions older than 30 minutes
    _PRE_SESSION_TTL = 1800  # 30 minutes
    _cutoff = time.time() - _PRE_SESSION_TTL
    stale = [k for k, v in _pre_sessions.items() if v.get("created_at", 0) < _cutoff]
    for k in stale:
        _pre_sessions.pop(k, None)

    pre_session_id = secrets.token_urlsafe(24)
    _pre_sessions[pre_session_id] = {
        "created_at": time.time(),
        "ip": ip,
        "paid": False,
    }

    if _STRIPE_ENABLED and not _FREE_MODE:
        try:
            import stripe
            stripe.api_key = _STRIPE_SECRET
            # Build success/cancel URLs using configured frontend URL (not request.base_url,
            # which returns the Render internal service URL behind a proxy, not the custom domain).
            from backend.core.config import settings as _settings
            origin = _settings.frontend_url.rstrip("/") or str(request.base_url).rstrip("/")
            success_url = f"{origin}/app/private-lookup/?session_id={{CHECKOUT_SESSION_ID}}&pre={pre_session_id}"
            cancel_url = f"{origin}/app/private-lookup/?cancelled=1"
            checkout = stripe.checkout.Session.create(
                mode="payment",
                line_items=[{"price": _STRIPE_LOOKUP_PRICE_ID, "quantity": 1}],
                success_url=success_url,
                cancel_url=cancel_url,
                metadata={"pre_session_id": pre_session_id, "product": "vcx_private_lookup"},
                payment_intent_data={"description": "VitaCoreX Private Lookup Access"},
            )
            return SessionCreateResponse(
                pre_session_id=pre_session_id,
                stripe_enabled=True,
                checkout_url=checkout.url,
                lookup_price=_LOOKUP_PRICE,
                action_memo_price=_ACTION_MEMO_PRICE,
                monitoring_price=_MONITORING_PRICE,
            )
        except Exception as e:
            logger.error("Stripe checkout creation failed: %s", str(e)[:200])
            raise HTTPException(status_code=502, detail="Payment system temporarily unavailable. Please try again.")
    else:
        # Development / unconfigured: allow access without payment
        return SessionCreateResponse(
            pre_session_id=pre_session_id,
            stripe_enabled=False,
            checkout_url=None,
            lookup_price=_LOOKUP_PRICE,
            action_memo_price=_ACTION_MEMO_PRICE,
            monitoring_price=_MONITORING_PRICE,
            message="Payment not configured. Access granted for development.",
        )


@router.post("/verify-payment", response_model=PaymentVerifyResponse, include_in_schema=False)
async def verify_payment(body: PaymentVerifyRequest, request: Request):
    """
    Verify Stripe payment and mint a signed session token.
    If Stripe is not configured, verify that pre_session_id is valid and grant access.
    """
    ip = _get_ip(request)
    pre = _pre_sessions.get(body.pre_session_id)
    if not pre:
        raise HTTPException(status_code=400, detail="Session not found or expired. Please start over.")

    paid = False

    if _STRIPE_ENABLED and body.stripe_session_id:
        try:
            import stripe
            stripe.api_key = _STRIPE_SECRET
            cs = stripe.checkout.Session.retrieve(body.stripe_session_id)
            if (
                cs.payment_status == "paid"
                and cs.metadata.get("pre_session_id") == body.pre_session_id
            ):
                paid = True
                pre["paid"] = True
        except Exception as e:
            logger.error("Stripe session retrieval failed: %s", str(e)[:200])
            # InvalidRequestError means the session ID is bogus (attacker/bad redirect)
            # Any other exception means Stripe is genuinely unreachable
            err_type = type(e).__name__
            if "InvalidRequestError" in err_type or "NotFoundError" in err_type:
                raise HTTPException(status_code=400, detail="Invalid payment session. Please complete checkout again.")
            raise HTTPException(status_code=502, detail="Could not verify payment. Please contact support.")
    elif not _STRIPE_ENABLED or _FREE_MODE:
        # Dev/free mode — grant without payment
        paid = True
        pre["paid"] = True

    if not paid:
        raise HTTPException(status_code=402, detail="Payment not confirmed. Please complete checkout.")

    expires_at = time.time() + _SESSION_TTL_SECONDS
    token_payload = {
        "pre": body.pre_session_id,
        "ip": ip,
        "exp": expires_at,
        "lookups_remaining": _MAX_LOOKUPS_PER_SESSION,
    }
    token = _sign_token(token_payload)
    # Clean up pre-session
    _pre_sessions.pop(body.pre_session_id, None)

    return PaymentVerifyResponse(
        session_token=token,
        expires_at=datetime.fromtimestamp(expires_at, tz=timezone.utc).isoformat(),
        lookup_count=_MAX_LOOKUPS_PER_SESSION,
        paid=True,
        message=f"Access granted. You have {_MAX_LOOKUPS_PER_SESSION} lookups in this session.",
    )


@router.post("/lookup", response_model=LookupResponse, include_in_schema=False)
async def run_lookup(body: LookupRequest, request: Request):
    """
    Execute the private lookup. Requires a valid signed session token.
    """
    ip = _get_ip(request)
    if not _check_rate_limit(ip):
        raise HTTPException(status_code=429, detail="Too many requests. Please try again later.")

    # Verify session token
    payload = _verify_token(body.session_token)
    if not payload:
        raise HTTPException(status_code=401, detail="Session expired or invalid. Please purchase a new lookup session.")

    lookups_remaining = payload.get("lookups_remaining", 0)
    if lookups_remaining <= 0:
        raise HTTPException(
            status_code=403,
            detail="Lookup limit reached for this session. Purchase a new session to continue.",
        )

    import uuid
    query_ref = uuid.uuid4().hex[:12]
    looked_up_at = datetime.now(tz=timezone.utc).isoformat()
    results = []

    if body.tab == LookupTab.TOLLS:
        if not body.tolls:
            raise HTTPException(status_code=422, detail="Tolls lookup fields are required.")
        raw = await run_tolls_lookup(body.tolls)
        results.append(normalize_toll_result(raw))

    elif body.tab == LookupTab.TRAFFIC:
        if not body.traffic:
            raise HTTPException(status_code=422, detail="Traffic lookup fields are required.")
        raw = await run_traffic_lookup(body.traffic)
        results.append(normalize_traffic_result(raw))

    elif body.tab == LookupTab.COURTS:
        if not body.courts:
            raise HTTPException(status_code=422, detail="Court lookup fields are required.")
        raw_list = await run_courts_lookup(body.courts)
        for raw in raw_list:
            results.append(normalize_court_result(raw))

    else:
        raise HTTPException(status_code=422, detail="Invalid lookup tab. Use tolls, traffic, or courts.")

    lookups_used = _MAX_LOOKUPS_PER_SESSION - lookups_remaining + 1
    new_remaining = max(0, lookups_remaining - 1)

    # Note: in production, decrement count in a persistent session store.
    # Here we return remaining count for the frontend to track.

    return LookupResponse(
        results=results,
        tab=body.tab,
        query_ref=query_ref,
        looked_up_at=looked_up_at,
        lookup_count_used=lookups_used,
        lookup_count_remaining=new_remaining,
        upsell_eligible=True,
    )


@router.post("/upload", response_model=ExtractionResult, include_in_schema=False)
async def upload_document(
    request: Request,
    file: UploadFile = File(...),
):
    """
    Upload a notice or document image and attempt to extract lookup fields.
    """
    ip = _get_ip(request)
    if not _check_rate_limit(ip):
        raise HTTPException(status_code=429, detail="Too many requests.")

    # File size check: 10 MB max
    content = await file.read(10 * 1024 * 1024 + 1)
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File too large. Maximum size is 10 MB.")

    filename = file.filename or ""
    content_type = file.content_type or ""

    # Only allow images and PDFs
    allowed_types = {"application/pdf", "image/jpeg", "image/png", "image/webp", "image/heic"}
    allowed_exts = {".pdf", ".jpg", ".jpeg", ".png", ".webp", ".heic"}
    ext = os.path.splitext(filename.lower())[1] if filename else ""

    if content_type not in allowed_types and ext not in allowed_exts:
        raise HTTPException(
            status_code=415,
            detail="Unsupported file type. Upload a PDF, JPEG, PNG, WebP, or HEIC file.",
        )

    # Attempt extraction
    try:
        from backend.private_lookup.extraction import extract_from_document
        result = extract_from_document(content=content, filename=filename, content_type=content_type)
        return result
    except Exception as e:
        logger.error("Document extraction error: %s", str(e)[:200])
        return ExtractionResult(
            suggested_tab=None,
            extracted_fields=[],
            raw_text_snippet=None,
            extraction_successful=False,
            message="Could not extract fields from this document. Please enter information manually.",
        )
