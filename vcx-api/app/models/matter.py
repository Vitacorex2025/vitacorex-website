"""Pydantic models for matter/status endpoints."""

from pydantic import BaseModel


class MatterDetail(BaseModel):
    matter_id: str
    status: str
    service_type: str
    urgency: str
    triage_score: int | None
    created_at: str
    checklist: list[dict]
    status_events: list[dict]
    documents: list[dict]
    deliverables: list[dict]


class ChecklistUpdate(BaseModel):
    is_complete: bool


class MatterPatch(BaseModel):
    status: str | None = None
    assigned_to: str | None = None
    triage_notes: str | None = None


class QueueItem(BaseModel):
    matter_id: str
    contact_name: str
    service_type: str
    urgency: str
    triage_score: int | None
    status: str
    created_at: str
    document_count: int
    magic_token: str | None = None


class QueueResponse(BaseModel):
    matters: list[QueueItem]
    total: int
    page: int
    per_page: int
