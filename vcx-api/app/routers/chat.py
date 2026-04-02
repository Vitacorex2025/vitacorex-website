"""Legal-chat router — message + escalation endpoints."""

from fastapi import APIRouter

from ..db import ensure_session, save_message, list_recent_messages, create_lead
from ..legal_chat.policy import answer_message
from ..models.chat import ChatRequest, ChatResponse, EscalationRequest, EscalationResponse

router = APIRouter()


@router.post("/api/legal-chat/message", response_model=ChatResponse)
def post_message(req: ChatRequest):
    ensure_session(req.session_id, topic=req.topic, state=req.state, language=req.language)
    save_message(req.session_id, "user", req.message)

    resp = answer_message(
        message=req.message,
        topic=req.topic,
        state=req.state,
        session_id=req.session_id,
    )

    save_message(req.session_id, "assistant", resp.answer)
    return resp


@router.post("/api/legal-chat/escalate", response_model=EscalationResponse)
def post_escalate(req: EscalationRequest):
    lead_id = create_lead(
        session_id=req.session_id,
        name=req.name,
        email=req.email,
        phone=req.phone,
        notes=req.notes,
    )
    return EscalationResponse(
        lead_id=lead_id,
        message="Your information has been submitted. A team member will follow up shortly.",
    )
