"""Pydantic models for legal chat endpoints.

Phase 1: Initial models (ChatRequest, ChatResponse, EscalationRequest, EscalationResponse).
Phase 4C: Added escalation_links and event_type to ChatResponse.
"""

from pydantic import BaseModel


class ChatRequest(BaseModel):
    session_id: str
    message: str
    topic: str | None = None
    state: str | None = None
    language: str = "en"


class EscalationLink(BaseModel):
    """A product route the user should be directed to."""
    label: str
    url: str
    description: str = ""


class ChatResponse(BaseModel):
    session_id: str
    answer: str
    topic: str | None = None
    state: str | None = None
    status: str  # need_more_info | answered | escalate | out_of_scope | no_topic
    event_type: str | None = None  # Phase 4C: for logging (answered, out_of_scope, no_topic, etc.)
    next_step: str | None = None
    suggestions: list[str] = []
    sources: list[str] = []
    escalation_links: list[EscalationLink] = []  # Phase 4C: product routing links


class EscalationRequest(BaseModel):
    session_id: str
    name: str
    email: str
    phone: str | None = None
    notes: str | None = None


class EscalationResponse(BaseModel):
    ok: bool = True
    lead_id: int
    message: str
