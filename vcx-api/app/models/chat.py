"""Pydantic models for legal chat endpoints.

Phase 1: Initial models (ChatRequest, ChatResponse, EscalationRequest, EscalationResponse).
Phase 4C: Added escalation_links and event_type to ChatResponse.
Phase 5A: Added mode field to ChatResponse (general_chat, legal_information, vcx_routing).
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
    mode: str | None = None  # Phase 5A: general_chat | legal_information | vcx_routing | high_risk
    status: str  # need_more_info | answered | escalate
    event_type: str | None = None  # Phase 4C: for logging
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


# ── Phase 6A: Chat-to-Intake handoff models ──────────────────────────

class ChatUploadResponse(BaseModel):
    """Response for a file uploaded during a chat session.

    Phase 7A: Initial upload response.
    Phase 7B: Added category, type_label, acknowledgment fields.
    """
    ok: bool = True
    session_id: str
    file_id: str
    filename: str
    size: int
    content_type: str | None = None
    category: str = "document"  # Phase 7B: "document" | "image"
    type_label: str = "File"  # Phase 7B: human-readable type
    acknowledgment: str = ""  # Phase 7B: assistant response for this upload


class ChatAttachment(BaseModel):
    """Metadata for a single chat attachment."""
    file_id: str
    filename: str
    category: str  # "document" | "image"
    size: int
    type_label: str


class ChatAttachmentsResponse(BaseModel):
    """List of attachments for a chat session."""
    ok: bool = True
    session_id: str
    count: int = 0
    attachments: list[ChatAttachment] = []
    summary: str = ""  # Human-readable summary


class IntakeHandoffRequest(BaseModel):
    """Request to convert a chat session into a prefilled intake payload."""
    session_id: str
    name: str | None = None
    email: str | None = None
    phone: str | None = None
    urgency: str = "Standard"


class IntakeHandoffResponse(BaseModel):
    """Prefill payload for the structured-case-intake form."""
    ok: bool = True
    session_id: str
    name: str | None = None
    email: str | None = None
    phone: str | None = None
    topic: str | None = None
    service_type: str | None = None
    state: str | None = None
    urgency: str = "Standard"
    summary: str = ""
    doc_hint: str | None = None
    recommended_next_step: str | None = None
    prefill_url: str = ""  # Full redirect URL with query params
