"""AI-powered analysis endpoints for all VitaCoreX applications.

Phase 10: Adds GPT-4o-mini intelligence to:
- Contract analysis and improvement
- Immigration packet review
- Auto deal evaluation

All endpoints fall back gracefully if AI is unavailable.
"""

import logging
from typing import Optional

from fastapi import APIRouter, File, Form, HTTPException, Request, UploadFile
from pydantic import BaseModel

from ..rate_limit import limiter
from ..services.ai_advisor import (
    analyze_auto_deal_ai,
    analyze_contract_ai,
    analyze_immigration_ai,
    improve_contract_ai,
    is_available,
)
from ..services.contract_analyzer import extract_text_from_bytes

logger = logging.getLogger("vcx.ai_analyze")

router = APIRouter(prefix="/api/ai")


# ── Models ────────────────────────────────────────────────────────────

class AIStatusResponse(BaseModel):
    available: bool
    model: str = "gpt-4o-mini"


class AIAnalysisResponse(BaseModel):
    ok: bool
    analysis: Optional[str] = None
    ai_powered: bool = False
    error: Optional[str] = None


class AutoDealRequest(BaseModel):
    msrp: float = 0
    agreed_price: float = 0
    doc_fee: float = 0
    gap_insurance: float = 0
    extended_warranty: float = 0
    apr: float = 0
    loan_term: int = 0
    down_payment: float = 0
    trade_in: float = 0
    other_fees: float = 0
    vehicle: str = ""
    year: str = ""
    make: str = ""
    model_name: str = ""
    language: str = "en"


# ── Status ────────────────────────────────────────────────────────────

@router.get("/status", response_model=AIStatusResponse)
def ai_status():
    """Check if AI analysis is available."""
    return AIStatusResponse(available=is_available())


# ── Contract Analysis ─────────────────────────────────────────────────

@router.post("/contract/analyze", response_model=AIAnalysisResponse)
@limiter.limit("10/minute")
async def ai_contract_analyze(
    request: Request,
    file: UploadFile = File(...),
    contract_type: str = Form(None),
    concerns: str = Form(None),
    language: str = Form("en"),
):
    """AI-powered contract analysis. Upload a contract file for deep review."""
    if not is_available():
        return AIAnalysisResponse(
            ok=False,
            ai_powered=False,
            error="AI analysis is not currently available. Using pattern-based analysis.",
        )

    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 10MB)")

    text = extract_text_from_bytes(content, file.filename)
    if not text:
        return AIAnalysisResponse(
            ok=False,
            ai_powered=False,
            error="Could not extract text from file. Please upload .txt, .docx, or text-layer PDF.",
        )

    result = analyze_contract_ai(
        contract_text=text,
        contract_type=contract_type,
        concerns=concerns,
        language=language,
    )

    if result:
        return AIAnalysisResponse(ok=True, analysis=result, ai_powered=True)
    return AIAnalysisResponse(
        ok=False, ai_powered=False,
        error="AI analysis failed. Please try again or use standard analysis.",
    )


@router.post("/contract/improve", response_model=AIAnalysisResponse)
@limiter.limit("10/minute")
async def ai_contract_improve(
    request: Request,
    file: UploadFile = File(...),
    contract_type: str = Form(None),
    analysis_summary: str = Form(None),
    language: str = Form("en"),
):
    """AI-powered contract improvement — generates stronger clause language."""
    if not is_available():
        return AIAnalysisResponse(
            ok=False, ai_powered=False,
            error="AI is not available.",
        )

    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 10MB)")

    text = extract_text_from_bytes(content, file.filename)
    if not text:
        return AIAnalysisResponse(
            ok=False, ai_powered=False,
            error="Could not extract text from file.",
        )

    result = improve_contract_ai(
        contract_text=text,
        analysis_summary=analysis_summary,
        contract_type=contract_type,
    )

    if result:
        return AIAnalysisResponse(ok=True, analysis=result, ai_powered=True)
    return AIAnalysisResponse(
        ok=False, ai_powered=False,
        error="AI improvement generation failed.",
    )


# ── Immigration Analysis ─────────────────────────────────────────────

@router.post("/immigration/analyze", response_model=AIAnalysisResponse)
@limiter.limit("10/minute")
async def ai_immigration_analyze(
    request: Request,
    file: UploadFile = File(...),
    form_type: str = Form(None),
    language: str = Form("en"),
):
    """AI-powered immigration document analysis."""
    if not is_available():
        return AIAnalysisResponse(
            ok=False, ai_powered=False,
            error="AI analysis is not currently available.",
        )

    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 10MB)")

    text = extract_text_from_bytes(content, file.filename)
    if not text:
        return AIAnalysisResponse(
            ok=False, ai_powered=False,
            error="Could not extract text. Please upload .txt, .docx, or text-layer PDF.",
        )

    result = analyze_immigration_ai(
        document_text=text,
        form_type=form_type,
        language=language,
    )

    if result:
        return AIAnalysisResponse(ok=True, analysis=result, ai_powered=True)
    return AIAnalysisResponse(
        ok=False, ai_powered=False,
        error="AI immigration analysis failed.",
    )


# ── Auto Deal Analysis ────────────────────────────────────────────────

@router.post("/auto-deal/analyze", response_model=AIAnalysisResponse)
@limiter.limit("15/minute")
async def ai_auto_deal_analyze(
    request: Request,
    body: AutoDealRequest,
):
    """AI-powered auto deal analysis with negotiation tips."""
    if not is_available():
        return AIAnalysisResponse(
            ok=False, ai_powered=False,
            error="AI analysis is not currently available.",
        )

    deal_data = {
        "msrp": body.msrp,
        "agreed_price": body.agreed_price,
        "doc_fee": body.doc_fee,
        "gap_insurance": body.gap_insurance,
        "extended_warranty": body.extended_warranty,
        "apr": body.apr,
        "loan_term": body.loan_term,
        "down_payment": body.down_payment,
        "trade_in": body.trade_in,
        "other_fees": body.other_fees,
        "vehicle": body.vehicle or f"{body.year} {body.make} {body.model_name}".strip(),
    }

    result = analyze_auto_deal_ai(
        deal_data=deal_data,
        language=body.language,
    )

    if result:
        return AIAnalysisResponse(ok=True, analysis=result, ai_powered=True)
    return AIAnalysisResponse(
        ok=False, ai_powered=False,
        error="AI deal analysis failed.",
    )
