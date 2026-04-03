"""Pydantic models for Contract Review Desk.

Phase 3: Initial models (ClauseItem, ContractUploadResponse, ContractAnalysisResponse).
Phase 4B: Enhanced response with missing_protections, suggested_questions, issue_buckets.
"""
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


# ── Phase 4B: Enhanced response models ──────────────────────────────

class MissingProtection(BaseModel):
    clause_type: str
    label: str
    severity: str  # high|medium
    recommendation: str


class SuggestedQuestion(BaseModel):
    category: str
    question: str
    context: str  # found|missing


class IssueBucketItem(BaseModel):
    type: str  # clause_found|missing_protection
    clause_type: str
    label: str
    excerpt: str
    note: str
    confidence: float


class IssueBucket(BaseModel):
    bucket: str  # "Immediate Attention", "Review Recommended", "Standard Provisions"
    severity: str  # high|medium|low
    items: list[IssueBucketItem]


class QuestionnaireContext(BaseModel):
    contract_type: str | None = None
    concerns: list[str] | None = None
    negotiated: str | None = None
    deadline: str | None = None


class ContractAnalysisResponse(BaseModel):
    ok: bool
    review_id: str
    filename: str
    status: str
    clauses: list[ClauseItem]
    risk_score: int | None = None
    risk_summary: str | None = None
    # Phase 4B fields
    extraction_method: str | None = None  # "text"|"pdf"|"docx"|"fallback"|None
    word_count: int | None = None
    missing_protections: list[MissingProtection] | None = None
    suggested_questions: list[SuggestedQuestion] | None = None
    issue_buckets: list[IssueBucket] | None = None
    questionnaire: QuestionnaireContext | None = None
    disclaimer: str = (
        "This is an automated preliminary scan. It does not constitute "
        "legal advice. Consult licensed counsel before acting on these findings."
    )
