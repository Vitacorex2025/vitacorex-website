"""Pydantic models for Contract Review Desk."""
from pydantic import BaseModel

class ClauseItem(BaseModel):
    clause_type: str
    excerpt: str
    confidence: float
    risk_level: str = "neutral"  # safe|neutral|caution|high_risk
    note: str | None = None

class ContractUploadResponse(BaseModel):
    ok: bool
    review_id: str
    filename: str
    size_bytes: int
    status: str

class ContractAnalysisResponse(BaseModel):
    ok: bool
    review_id: str
    filename: str
    status: str
    clauses: list[ClauseItem]
    risk_score: int | None = None
    risk_summary: str | None = None
