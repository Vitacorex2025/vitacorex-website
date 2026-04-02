"""Pydantic models for legal chat endpoints (ported from starter)."""

from pydantic import BaseModel


class ChatRequest(BaseModel):
    session_id: str
    message: str
    topic: str | None = None
    state: str | None = None
    language: str = "en"


class ChatResponse(BaseModel):
    session_id: str
    answer: str
    topic: str | None = None
    state: str | None = None
    status: str  # need_more_info | answered | escalate
    next_step: str | None = None
    suggestions: list[str] = []
    sources: list[str] = []


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
