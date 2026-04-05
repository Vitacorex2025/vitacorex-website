"""AI-powered analysis endpoints for all VitaCoreX applications.

Phase 10: Adds GPT-4o-mini intelligence to:
- Contract analysis and improvement
- Immigration packet review
- Auto deal evaluation
Phase 11: AI contract generation — full improved contract as downloadable DOCX.

All endpoints fall back gracefully if AI is unavailable.
"""

import logging
import os
import uuid
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, File, Form, HTTPException, Request, UploadFile
from fastapi.responses import Response
from pydantic import BaseModel

from ..rate_limit import limiter
from ..services.ai_advisor import (
    analyze_auto_deal_ai,
    analyze_contract_ai,
    analyze_immigration_ai,
    generate_full_contract_ai,
    improve_contract_ai,
    is_available,
    review_contract_comments_ai,
)
from ..services.contract_analyzer import extract_text_from_bytes
from ..services.docx_generator import (
    generate_ai_contract_docx,
    generate_review_comments_docx,
    is_available as docx_available,
)

logger = logging.getLogger("vcx.ai_analyze")

router = APIRouter(prefix="/api/ai")
GENERATED_DIR = Path(os.getenv("VCX_UPLOADS_DIR", "uploads")) / "ai-generated"


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


# ── AI Contract Generation (DOCX) ──────────────────────────────────


class AIGenerateResponse(BaseModel):
    ok: bool
    contract_id: Optional[str] = None
    filename: Optional[str] = None
    download_url: Optional[str] = None
    ai_powered: bool = False
    error: Optional[str] = None


@router.post("/contract/generate-docx", response_model=AIGenerateResponse)
@limiter.limit("5/minute")
async def ai_contract_generate_docx(
    request: Request,
    file: UploadFile = File(...),
    contract_type: str = Form(None),
    language: str = Form("en"),
):
    """AI-powered contract generation — upload original, get improved DOCX.

    Phase 11: Takes an uploaded contract, uses AI to generate a complete
    improved version, builds a DOCX, and returns a download URL.
    """
    if not is_available():
        return AIGenerateResponse(
            ok=False, ai_powered=False,
            error="AI is not currently available. Please try again later.",
        )

    if not docx_available():
        return AIGenerateResponse(
            ok=False, ai_powered=False,
            error="DOCX generation is not available on this server.",
        )

    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 10MB)")

    # Extract text
    text = extract_text_from_bytes(content, file.filename)
    if not text:
        return AIGenerateResponse(
            ok=False, ai_powered=False,
            error="Could not extract text. Upload .txt, .docx, or text-layer PDF.",
        )

    # AI generates improved contract
    ai_contract_text = generate_full_contract_ai(
        contract_text=text,
        contract_type=contract_type,
        language=language,
    )

    if not ai_contract_text:
        return AIGenerateResponse(
            ok=False, ai_powered=False,
            error="AI contract generation failed. Please try again.",
        )

    # Build DOCX from AI output
    try:
        original_name = file.filename or "contract"
        base_name = original_name.rsplit(".", 1)[0][:40]
        title = f"Improved Contract — {base_name}"
        docx_bytes = generate_ai_contract_docx(ai_contract_text, title=title)
    except Exception as exc:
        logger.error("DOCX build failed: %s", exc)
        return AIGenerateResponse(
            ok=False, ai_powered=True,
            error="DOCX generation failed after AI analysis.",
        )

    # Store on disk
    contract_id = str(uuid.uuid4())
    gen_dir = GENERATED_DIR / contract_id
    gen_dir.mkdir(parents=True, exist_ok=True)

    safe_base = base_name.replace(" ", "_").replace("/", "_").replace("\\", "_")
    filename = f"VCX_AI_{safe_base}_{contract_id[:8]}.docx"
    file_path = gen_dir / filename
    file_path.write_bytes(docx_bytes)

    download_url = f"/api/ai/contract/{contract_id}/download"

    logger.info(
        "AI contract generated: %s (%d bytes)", contract_id, len(docx_bytes)
    )

    return AIGenerateResponse(
        ok=True,
        contract_id=contract_id,
        filename=filename,
        download_url=download_url,
        ai_powered=True,
    )


@router.post("/contract/review-comments", response_model=AIGenerateResponse)
@limiter.limit("5/minute")
async def ai_contract_review_comments(
    request: Request,
    file: UploadFile = File(...),
    contract_type: str = Form(None),
    language: str = Form("en"),
):
    """AI-powered contract review — generates DOCX with comments for negotiation.

    Phase 11: Takes an uploaded contract, uses AI to generate review
    comments and negotiation notes, builds a DOCX with color-coded
    priority sections.
    """
    if not is_available():
        return AIGenerateResponse(
            ok=False, ai_powered=False,
            error="AI is not currently available.",
        )

    if not docx_available():
        return AIGenerateResponse(
            ok=False, ai_powered=False,
            error="DOCX generation is not available on this server.",
        )

    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 10MB)")

    text = extract_text_from_bytes(content, file.filename)
    if not text:
        return AIGenerateResponse(
            ok=False, ai_powered=False,
            error="Could not extract text. Upload .txt, .docx, or text-layer PDF.",
        )

    # AI generates review comments
    ai_comments = review_contract_comments_ai(
        contract_text=text,
        contract_type=contract_type,
        language=language,
    )

    if not ai_comments:
        return AIGenerateResponse(
            ok=False, ai_powered=False,
            error="AI review comment generation failed.",
        )

    # Build review DOCX
    try:
        original_name = file.filename or "contract"
        docx_bytes = generate_review_comments_docx(
            ai_comments, original_filename=original_name
        )
    except Exception as exc:
        logger.error("Review DOCX build failed: %s", exc)
        return AIGenerateResponse(
            ok=False, ai_powered=True,
            error="DOCX generation failed after AI analysis.",
        )

    # Store on disk
    contract_id = str(uuid.uuid4())
    gen_dir = GENERATED_DIR / contract_id
    gen_dir.mkdir(parents=True, exist_ok=True)

    safe_base = original_name.rsplit(".", 1)[0][:40]
    safe_base = safe_base.replace(" ", "_").replace("/", "_").replace("\\", "_")
    filename = f"VCX_Review_{safe_base}_{contract_id[:8]}.docx"
    file_path = gen_dir / filename
    file_path.write_bytes(docx_bytes)

    download_url = f"/api/ai/contract/{contract_id}/download"

    logger.info(
        "AI review comments generated: %s (%d bytes)", contract_id, len(docx_bytes)
    )

    return AIGenerateResponse(
        ok=True,
        contract_id=contract_id,
        filename=filename,
        download_url=download_url,
        ai_powered=True,
    )


@router.get("/contract/{contract_id}/download")
def download_ai_contract(contract_id: str):
    """Download an AI-generated contract or review DOCX."""
    gen_dir = GENERATED_DIR / contract_id
    if not gen_dir.exists():
        raise HTTPException(status_code=404, detail="Contract not found.")

    docx_files = list(gen_dir.glob("*.docx"))
    if not docx_files:
        raise HTTPException(status_code=404, detail="Contract file not found.")

    file_path = docx_files[0]
    content = file_path.read_bytes()

    return Response(
        content=content,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={
            "Content-Disposition": f'attachment; filename="{file_path.name}"',
            "Content-Length": str(len(content)),
        },
    )
