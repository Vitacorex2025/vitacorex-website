"""Pydantic models for Recovery Pilot Studio."""
from pydantic import BaseModel

class PilotCreateRequest(BaseModel):
    company_name: str | None = None
    industry: str | None = None
    employee_count: str | None = None
    annual_revenue: str | None = None

class PilotCreateResponse(BaseModel):
    ok: bool
    pilot_id: str
    status: str
    wizard_step: int

class PilotUpdateRequest(BaseModel):
    wizard_step: int | None = None
    baseline_data: dict | None = None

class PilotDetailResponse(BaseModel):
    pilot_id: str
    status: str
    wizard_step: int
    baseline_data: dict | None = None
    analysis_data: dict | None = None
    brief_path: str | None = None
