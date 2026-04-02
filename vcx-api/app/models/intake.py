"""Pydantic models for intake endpoints."""

from pydantic import BaseModel, EmailStr, Field


class IntakeResponse(BaseModel):
    ok: bool = True
    matter_id: str
    magic_link: str
    status: str = "intake_received"
    triage_score: int
    checklist: list[dict]
    next_step: str


class UploadResponse(BaseModel):
    ok: bool = True
    matter_id: str
    documents: list[dict]
