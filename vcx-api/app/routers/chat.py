"""Legal-chat router — message, escalation, and transcript endpoints.

Phase 4A: Added rate limiting.
Phase 4C: Added event logging (saves policy decisions as role='event' messages),
          added GET /api/legal-chat/transcript/{session_id} for admin review.
"""

import json
import logging

from fastapi import APIRouter, HTTPException, Request

from ..db import ensure_session, save_message, list_recent_messages, create_lead
from ..legal_chat.policy import answer_message
from ..models.chat import ChatRequest, ChatResponse, EscalationRequest, EscalationResponse
from ..rate_limit import limiter

logger = logging.getLogger("vcx.legal_chat")
router = APIRouter()


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


@router.get("/api/legal-chat/transcript/{session_id}")
@limiter.limit("30/minute")
def get_transcript(request: Request, session_id: str):
    """Return the full transcript for a chat session (admin utility).

    Phase 4C: Includes user messages, assistant responses, and policy events.
    """
    messages = list_recent_messages(session_id, limit=200)
    if not messages:
        raise HTTPException(status_code=404, detail="Session not found or empty.")

    return {
        "ok": True,
        "session_id": session_id,
        "message_count": len(messages),
        "messages": messages,
    }
