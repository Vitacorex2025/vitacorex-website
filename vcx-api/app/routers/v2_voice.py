"""vcx-api v2 — voice (Vapi tool) endpoints.

Header X-VCX-Voice-Secret must equal VCX_VOICE_TOOL_SECRET (unset -> 503).
Same validation as the web form; source_channel is always "phone". These tools
never book appointments and never accept SSNs or card numbers. The customer
access token is not returned to the voice model.
"""

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

from ..rate_limit import limiter
from ..services import v2_catalog, v2_messages
from ..services.v2_auth import AuthError, voice_auth
from ..services.v2_catalog import CatalogError
from ..services.v2_store import StoreError
from ..services.v2_validation import HoneypotTriggered, RequestRejected
from .v2_public import read_json, submit

router = APIRouter(prefix="/api/v2/voice", tags=["v2-voice"])


def _json(status: int, body: dict) -> JSONResponse:
    return JSONResponse(status_code=status, content=body, headers={"Cache-Control": "no-store"})


@router.get("/catalog")
@limiter.limit("60/minute")
def voice_catalog(request: Request, locale: str = "en"):
    try:
        voice_auth(request)
        return _json(200, v2_catalog.public_catalog(v2_catalog.normalize_locale(locale)))
    except AuthError as exc:
        return _json(exc.status_code, exc.body)
    except CatalogError:
        return _json(503, {"error": "catalog_unavailable"})


@router.post("/requests")
@limiter.limit("30/minute")
async def voice_create_request(request: Request):
    locale = "en"
    try:
        voice_auth(request)
        payload = await read_json(request)
        if isinstance(payload, dict):
            payload.pop("source_channel", None)  # always phone
            locale = v2_catalog.normalize_locale(payload.get("locale"))
        status, body, req = submit(payload, "phone")
    except AuthError as exc:
        return _json(exc.status_code, exc.body)
    except HoneypotTriggered:
        return _json(202, {"accepted": True})
    except RequestRejected as exc:
        body = dict(exc.body)
        spoken = v2_messages.VOICE_ERRORS.get(body.get("error"), {})
        if spoken:
            body["spoken"] = spoken.get(locale, spoken["en"])
        return _json(exc.status_code, body)
    except CatalogError:
        return _json(503, {"error": "catalog_unavailable"})
    except StoreError as exc:
        return _json(exc.status_code, exc.body)
    return _json(status, {
        "request_id": req["request_id"],
        "status": req["status"],
        "next_step_spoken": v2_messages.voice_next_step(req["next_action"], req["request_id"], req["locale"]),
        "duplicate": body["duplicate"],
    })
