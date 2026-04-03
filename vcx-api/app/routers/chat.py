"""Legal-chat router — message, escalation, and transcript endpoints.

Phase 4A: Added rate limiting.
Phase 4C: Added event logging (saves policy decisions as role='event' messages),
          added GET /api/legal-chat/transcript/{session_id} for admin review.
Phase 4 Fix: Transcript endpoint now requires auth — signed HMAC token or
             X-Admin-Token header.  Public access removed.
"""

import json
import logging
import os
import secrets as _secrets
import uuid

from fastapi import APIRouter, HTTPException, Form, Header, Query, Request, UploadFile

from ..db import ensure_session, save_message, list_recent_messages, create_lead
from ..legal_chat.policy import answer_message, build_intake_summary
from ..models.chat import (
    ChatAttachment,
    ChatAttachmentsResponse,
    ChatRequest,
    ChatResponse,
    ChatUploadResponse,
    EscalationRequest,
    EscalationResponse,
    IntakeHandoffRequest,
    IntakeHandoffResponse,
)
from ..rate_limit import limiter
from ..services.chat_attachments import (
    attachment_acknowledgment,
    build_attachment_summary,
    classify_attachment,
    list_session_attachments,
    type_label,
)
from ..services.intake_handoff import enhance_handoff
from ..services.transcript_auth import generate_signed_token, verify_signed_token
from ..services.upload_validator import validate_file

logger = logging.getLogger("vcx.legal_chat")
router = APIRouter()

# ── Admin token (same env var as review.py) ───────────────────────────
_ADMIN_TOKEN = os.getenv("VCX_ADMIN_TOKEN", "change-me")


def _check_transcript_auth(
    token: str | None,
    x_admin_token: str | None,
    session_id: str,
) -> None:
    """Verify that the caller is authorised to read a transcript.

    Phase 4 Fix: Two accepted auth methods:
      1. X-Admin-Token header  (same secret as /api/review/*)
      2. Signed HMAC token     (query param ?token=…)

    Raises HTTPException 403 on failure.
    """
    # Method 1: admin header
    if x_admin_token:
        if _secrets.compare_digest(x_admin_token, _ADMIN_TOKEN):
            return  # admin access granted
        raise HTTPException(status_code=403, detail="Invalid admin token.")

    # Method 2: signed HMAC token
    if token:
        try:
            token_session_id = verify_signed_token(token)
        except ValueError as exc:
            raise HTTPException(status_code=403, detail=str(exc)) from exc
        # Token must match the requested session
        if token_session_id != session_id:
            raise HTTPException(
                status_code=403,
                detail="Token does not match requested session.",
            )
        return  # signed-token access granted

    # No credentials provided
    raise HTTPException(
        status_code=403,
        detail="Transcript access requires a valid token or admin credentials.",
    )


def _log_event(session_id: str, event_type: str, detail: str = ""):
    """Log a policy decision as a system event in the messages table.

    Phase 4C: Uses role='event' to distinguish from user/assistant messages.
    Events are stored as JSON for structured retrieval.
    """
    try:
        event_data = json.dumps({
            "event": event_type,
            "detail": detail,
        }, ensure_ascii=False)
        save_message(session_id, "event", event_data)
    except Exception as exc:
        logger.warning("Failed to log chat event: %s", exc)


@router.post("/api/legal-chat/message", response_model=ChatResponse)
@limiter.limit("30/minute")
def post_message(request: Request, req: ChatRequest):
    ensure_session(req.session_id, topic=req.topic, state=req.state, language=req.language)
    save_message(req.session_id, "user", req.message)

    resp = answer_message(
        message=req.message,
        topic=req.topic,
        state=req.state,
        session_id=req.session_id,
    )

    save_message(req.session_id, "assistant", resp.answer)

    # Phase 4C: Log the policy decision as an event
    _log_event(
        req.session_id,
        resp.event_type or resp.status,
        f"topic={resp.topic or 'none'} status={resp.status}",
    )

    return resp


# ── Phase 6A: Chat-to-Intake handoff endpoint ──────────────────────

@router.post("/api/legal-chat/convert-to-intake", response_model=IntakeHandoffResponse)
@limiter.limit("10/minute")
def convert_to_intake(request: Request, req: IntakeHandoffRequest):
    """Convert a chat session into a prefilled intake handoff payload.

    Phase 6A: Reads user messages from the session, builds a structured
    summary, maps topic to service type, and returns a prefill URL for
    the structured-case-intake form.
    Phase 6B: Enhanced with urgency inference, timeline extraction,
    state detection, and documents-needed from structured blocks.

    The user reviews and edits the prefilled data before submitting
    through the existing POST /api/intakes pipeline.
    """
    try:
        resp = build_intake_summary(
            session_id=req.session_id,
            name=req.name,
            email=req.email,
            phone=req.phone,
            urgency=req.urgency,
        )
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    # Phase 6B: enrich with better urgency, timeline, state, doc hints
    resp = enhance_handoff(req.session_id, resp)

    # Phase 7B: append attachment summary to doc_hint if files were uploaded
    att_summary = build_attachment_summary(req.session_id)
    if att_summary:
        existing_hint = resp.doc_hint or ""
        resp.doc_hint = (
            (existing_hint + "\n\n" if existing_hint else "")
            + "Chat attachments: " + att_summary
        )

    _log_event(
        req.session_id,
        "convert_to_intake",
        f"service={resp.service_type or 'none'} urgency={resp.urgency} attachments={bool(att_summary)}",
    )

    return resp


# ── Phase 7A: Chat file upload endpoint ──────────────────────────

_CHAT_UPLOADS_DIR = os.path.join(
    os.getenv("VCX_UPLOADS_DIR", "uploads"), "chat"
)


@router.post(
    "/api/legal-chat/upload",
    response_model=ChatUploadResponse,
    status_code=201,
)
@limiter.limit("10/minute")
async def upload_chat_file(
    request: Request,
    session_id: str = Form(...),
    file: UploadFile = ...,
):
    """Upload a file attached to a chat session.

    Phase 7A: Files are stored per session and can be carried forward
    when the user converts the chat session to a structured intake.

    Storage: uploads/chat/{session_id}/{file_id}_{filename}
    Validation: Same rules as intake uploads (extension allowlist, size limit).
    """
    content = await file.read()
    sanitized = validate_file(
        filename=file.filename or "unnamed",
        size=len(content),
        content_type=file.content_type,
    )

    file_id = str(uuid.uuid4())
    session_dir = os.path.join(_CHAT_UPLOADS_DIR, session_id)
    os.makedirs(session_dir, exist_ok=True)

    dest = os.path.join(session_dir, f"{file_id}_{sanitized}")
    with open(dest, "wb") as f:
        f.write(content)

    # Phase 7B: Classify attachment and generate acknowledgment
    category = classify_attachment(sanitized, file.content_type)
    label = type_label(sanitized)
    ack = attachment_acknowledgment(sanitized, category, label)

    _log_event(
        session_id,
        "chat_file_upload",
        f"file={sanitized} size={len(content)} category={category}",
    )

    return ChatUploadResponse(
        session_id=session_id,
        file_id=file_id,
        filename=sanitized,
        size=len(content),
        content_type=file.content_type,
        category=category,
        type_label=label,
        acknowledgment=ack,
    )


# ── Phase 7B: List session attachments ───────────────────────────

@router.get(
    "/api/legal-chat/attachments/{session_id}",
    response_model=ChatAttachmentsResponse,
)
@limiter.limit("30/minute")
def get_session_attachments(request: Request, session_id: str):
    """List all files attached to a chat session.

    Phase 7B: Returns attachment metadata (filename, category, size, type)
    and a human-readable summary. Used by the widget to display attachment
    status and by convert-to-intake to reference uploaded files.
    """
    items = list_session_attachments(session_id)
    summary = build_attachment_summary(session_id)

    return ChatAttachmentsResponse(
        session_id=session_id,
        count=len(items),
        attachments=[ChatAttachment(**a) for a in items],
        summary=summary,
    )


@router.post("/api/legal-chat/escalate", response_model=EscalationResponse)
@limiter.limit("10/minute")
def post_escalate(request: Request, req: EscalationRequest):
    lead_id = create_lead(
        session_id=req.session_id,
        name=req.name,
        email=req.email,
        phone=req.phone,
        notes=req.notes,
    )

    # Phase 4C: Log the escalation event
    _log_event(
        req.session_id or "unknown",
        "escalation_submitted",
        f"lead_id={lead_id}",
    )

    return EscalationResponse(
        lead_id=lead_id,
        message="Your information has been submitted. A team member will follow up shortly.",
    )


# ── Phase 4 Fix: Secured transcript endpoint ─────────────────────────

@router.get("/api/legal-chat/transcript/{session_id}")
@limiter.limit("30/minute")
def get_transcript(
    request: Request,
    session_id: str,
    token: str | None = Query(None, description="Signed HMAC transcript token"),
    x_admin_token: str | None = Header(None),
):
    """Return the full transcript for a chat session.

    Phase 4C: Includes user messages, assistant responses, and policy events.
    Phase 4 Fix: Now requires auth — signed HMAC token (?token=…) or
                 X-Admin-Token header.  Returns 403 without valid credentials.
    """
    _check_transcript_auth(token, x_admin_token, session_id)

    messages = list_recent_messages(session_id, limit=200)
    if not messages:
        raise HTTPException(status_code=404, detail="Session not found or empty.")

    return {
        "ok": True,
        "session_id": session_id,
        "message_count": len(messages),
        "messages": messages,
    }


@router.post("/api/legal-chat/transcript-token/{session_id}")
@limiter.limit("10/minute")
def create_transcript_token(
    request: Request,
    session_id: str,
    x_admin_token: str = Header(...),
    expiry_minutes: int = Query(60, ge=1, le=1440, description="Token lifetime in minutes (max 24h)"),
):
    """Generate a signed, time-limited token for transcript access.

    Admin-only endpoint. The returned token can be passed as ?token=…
    on GET /api/legal-chat/transcript/{session_id}.

    Phase 4 Fix: Allows admins to share time-limited transcript links
                 without exposing the admin token itself.
    """
    if not _secrets.compare_digest(x_admin_token, _ADMIN_TOKEN):
        raise HTTPException(status_code=403, detail="Invalid admin token.")

    signed_token = generate_signed_token(session_id, expiry_minutes)

    return {
        "ok": True,
        "session_id": session_id,
        "token": signed_token,
        "expiry_minutes": expiry_minutes,
    }
