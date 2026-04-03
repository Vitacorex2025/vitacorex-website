"""Contract Review Desk -- upload, analyze, report, generate, and download.

Phase 3: Wired to DB + contract_analyzer service.
Phase 4A: Added upload validation + rate limiting.
Phase 4B: Enhanced analyze endpoint — PDF/DOCX extraction, missing protections,
          suggested questions, issue buckets, questionnaire context.
Phase 8: Contract Generator — generate + download endpoints.
Analysis is pattern-based (regex), not LLM-driven.
Generation uses clause templates + python-docx.
"""

import logging
import os
import uuid
from pathlib import Path

from fastapi import APIRouter, File, Form, HTTPException, Request, UploadFile
from fastapi.responses import Response

from ..db import get_conn
from ..models.contract import (
    ClauseItem,
    ContractAnalysisResponse,
    ContractUploadResponse,
    IssueBucket,
    IssueBucketItem,
    MissingProtection,
    QuestionnaireContext,
    SuggestedQuestion,
)
from ..models.contract_generator import (
    ContractGenerationRequest,
    ContractGenerationResponse,
    ContractTypeInfo,
    ContractTypesResponse,
)
from ..rate_limit import limiter
from ..services.contract_analyzer import (
    compute_risk_score,
    detect_clauses,
    detect_missing_protections,
    extract_text_from_bytes,
    generate_issue_buckets,
    generate_risk_summary,
    generate_suggested_questions,
)
from ..services.contract_templates import CONTRACT_TYPES, get_contract_types
from ..services.docx_generator import generate_contract_docx, is_available as docx_available
from ..services.upload_validator import sanitize_filename, validate_file

logger = logging.getLogger("vcx.contracts")

router = APIRouter(prefix="/api/contracts")
UPLOADS_DIR = Path(os.getenv("VCX_UPLOADS_DIR", "uploads"))
GENERATED_DIR = UPLOADS_DIR / "generated"


@router.post("/upload", status_code=201, response_model=ContractUploadResponse)
@limiter.limit("10/minute")
async def upload_contract(
    request: Request,
    file: UploadFile = File(...),
    matter_id: str = Form(None),
):
    """Upload a contract document for later analysis."""
    # Phase 4A: Validate file before processing
    content = await file.read()
    validate_file(file.filename, len(content), file.content_type)

    review_id = str(uuid.uuid4())
    review_dir = UPLOADS_DIR / "contracts" / review_id
    review_dir.mkdir(parents=True, exist_ok=True)
    file_id = str(uuid.uuid4())
    safe_name = f"{file_id}_{sanitize_filename(file.filename)}"
    file_path = review_dir / safe_name
    file_path.write_bytes(content)

    with get_conn() as conn:
        conn.execute(
            """INSERT INTO contract_reviews
               (id, matter_id, status, review_tier, created_at)
               VALUES (?, ?, 'uploaded', 'free', datetime('now'))""",
            (review_id, matter_id),
        )

    return ContractUploadResponse(
        ok=True,
        review_id=review_id,
        filename=file.filename,
        size_bytes=len(content),
        status="uploaded",
    )


@router.post("/analyze", response_model=ContractAnalysisResponse)
@limiter.limit("10/minute")
async def analyze_contract(
    request: Request,
    file: UploadFile = File(...),
    contract_type: str = Form(None),
    concerns: str = Form(None),
    negotiated: str = Form(None),
    deadline: str = Form(None),
):
    """One-shot upload + analyze with optional questionnaire context.

    Phase 4B: Accepts questionnaire fields, returns enriched analysis with
    missing protections, suggested questions, and issue buckets.
    """
    # Phase 4A: Validate file before processing
    content = await file.read()
    validate_file(file.filename, len(content), file.content_type)

    review_id = str(uuid.uuid4())

    # Save file
    review_dir = UPLOADS_DIR / "contracts" / review_id
    review_dir.mkdir(parents=True, exist_ok=True)
    file_id = str(uuid.uuid4())
    safe_name = f"{file_id}_{sanitize_filename(file.filename)}"
    file_path = review_dir / safe_name
    file_path.write_bytes(content)

    # Build questionnaire context
    concerns_list = (
        [c.strip() for c in concerns.split(",") if c.strip()]
        if concerns else None
    )
    questionnaire = QuestionnaireContext(
        contract_type=contract_type or None,
        concerns=concerns_list,
        negotiated=negotiated or None,
        deadline=deadline or None,
    )

    # Determine extraction method
    lower = file.filename.lower() if file.filename else ""
    extraction_method = None
    if lower.endswith(".txt") or lower.endswith(".md"):
        extraction_method = "text"
    elif lower.endswith(".pdf"):
        extraction_method = "pdf"
    elif lower.endswith(".docx"):
        extraction_method = "docx"
    elif lower.endswith(".doc"):
        extraction_method = "doc_legacy"

    # Try text extraction
    text = extract_text_from_bytes(content, file.filename)

    if text is None:
        with get_conn() as conn:
            conn.execute(
                """INSERT INTO contract_reviews
                   (id, status, review_tier, risk_summary, created_at)
                   VALUES (?, 'uploaded', 'free', ?, datetime('now'))""",
                (review_id,
                 "Text extraction for this file format is not yet supported. "
                 "Upload a .txt or .docx file for instant analysis, or request manual review."),
            )
        return ContractAnalysisResponse(
            ok=True,
            review_id=review_id,
            filename=file.filename,
            status="uploaded",
            clauses=[],
            risk_score=None,
            risk_summary=(
                "Text extraction for this file format is not yet supported. "
                "Upload a .txt, .docx, or text-layer PDF for instant analysis, "
                "or submit via structured intake for manual review."
            ),
            extraction_method=extraction_method,
            word_count=0,
            questionnaire=questionnaire,
        )

    # Run clause detection
    raw_clauses = detect_clauses(text)
    risk_score = compute_risk_score(raw_clauses)
    risk_summary = generate_risk_summary(raw_clauses, risk_score)

    # Phase 4B: Missing protections
    missing_protections_raw = detect_missing_protections(
        raw_clauses, contract_type
    )

    # Phase 4B: Suggested questions
    suggested_questions_raw = generate_suggested_questions(
        raw_clauses, missing_protections_raw
    )

    # Phase 4B: Issue buckets
    issue_buckets_raw = generate_issue_buckets(
        raw_clauses, missing_protections_raw
    )

    # Word count
    word_count = len(text.split()) if text else 0

    # Persist to DB
    with get_conn() as conn:
        conn.execute(
            """INSERT INTO contract_reviews
               (id, status, extraction_data, risk_score, risk_summary,
                review_tier, created_at, completed_at)
               VALUES (?, 'reviewed', ?, ?, ?, 'free',
                       datetime('now'), datetime('now'))""",
            (review_id, text[:5000], risk_score, risk_summary),
        )
        for i, clause in enumerate(raw_clauses):
            clause_id = str(uuid.uuid4())
            conn.execute(
                """INSERT INTO contract_clauses
                   (id, review_id, clause_type, text_excerpt, confidence,
                    risk_level, note, sort_order)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
                (clause_id, review_id, clause["clause_type"],
                 clause["text_excerpt"], clause["confidence"],
                 clause["risk_level"], clause["note"], i),
            )

    return ContractAnalysisResponse(
        ok=True,
        review_id=review_id,
        filename=file.filename,
        status="reviewed",
        clauses=[
            ClauseItem(
                clause_type=c["clause_type"],
                excerpt=c["text_excerpt"],
                confidence=min(c["confidence"], 1.0),
                risk_level=c["risk_level"],
                note=c["note"],
            )
            for c in raw_clauses
        ],
        risk_score=risk_score,
        risk_summary=risk_summary,
        extraction_method=extraction_method,
        word_count=word_count,
        missing_protections=[
            MissingProtection(**mp) for mp in missing_protections_raw
        ],
        suggested_questions=[
            SuggestedQuestion(**sq) for sq in suggested_questions_raw
        ],
        issue_buckets=[
            IssueBucket(
                bucket=ib["bucket"],
                severity=ib["severity"],
                items=[IssueBucketItem(**item) for item in ib["items"]],
            )
            for ib in issue_buckets_raw
        ],
        questionnaire=questionnaire,
    )


@router.get("/{review_id}/report")
def get_report(review_id: str):
    """Get the full analysis report for a contract review."""
    with get_conn() as conn:
        review = conn.execute(
            "SELECT * FROM contract_reviews WHERE id = ?", (review_id,)
        ).fetchone()
        if not review:
            raise HTTPException(status_code=404, detail="Review not found.")

        clauses = conn.execute(
            """SELECT * FROM contract_clauses
               WHERE review_id = ? ORDER BY sort_order""",
            (review_id,),
        ).fetchall()

    return {
        "ok": True,
        "review_id": review_id,
        "status": review["status"],
        "risk_score": review["risk_score"],
        "risk_summary": review["risk_summary"],
        "review_tier": review["review_tier"],
        "created_at": review["created_at"],
        "completed_at": review["completed_at"],
        "clauses": [
            {
                "clause_type": c["clause_type"],
                "excerpt": c["text_excerpt"],
                "confidence": c["confidence"],
                "risk_level": c["risk_level"],
                "note": c["note"],
            }
            for c in clauses
        ],
        "disclaimer": (
            "This is an automated preliminary scan. It does not constitute "
            "legal advice. Consult licensed counsel before acting on "
            "these findings."
        ),
    }


# ── Phase 8: Contract Generator endpoints ────────────────────────────


@router.get("/types", response_model=ContractTypesResponse)
def list_contract_types(request: Request):
    """List available contract types for the generation questionnaire."""
    return ContractTypesResponse(
        types=[ContractTypeInfo(**t) for t in get_contract_types()]
    )


@router.post("/generate", response_model=ContractGenerationResponse, status_code=201)
@limiter.limit("10/minute")
def generate_contract(request: Request, req: ContractGenerationRequest):
    """Generate a contract document from questionnaire answers.

    Phase 8: Accepts a ContractGenerationRequest with contract type
    and questionnaire parameters. Returns metadata with a download URL.

    The generated DOCX is stored on disk and downloadable via
    GET /api/contracts/{contract_id}/download.
    """
    # Validate contract type
    if req.contract_type not in CONTRACT_TYPES:
        valid_types = ", ".join(CONTRACT_TYPES.keys())
        raise HTTPException(
            status_code=400,
            detail=f"Unknown contract type: '{req.contract_type}'. "
                   f"Valid types: {valid_types}",
        )

    # Check python-docx availability
    if not docx_available():
        raise HTTPException(
            status_code=503,
            detail="DOCX generation is not available. "
                   "The server needs python-docx installed.",
        )

    # Build params dict from request model
    params = req.model_dump(exclude={"contract_type"}, exclude_none=True)

    # Generate DOCX
    try:
        docx_bytes = generate_contract_docx(req.contract_type, params)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        logger.error("DOCX generation failed: %s", exc)
        raise HTTPException(
            status_code=500,
            detail="Contract generation failed. Please try again.",
        ) from exc

    # Store on disk
    contract_id = str(uuid.uuid4())
    gen_dir = GENERATED_DIR / contract_id
    gen_dir.mkdir(parents=True, exist_ok=True)

    spec = CONTRACT_TYPES[req.contract_type]
    safe_label = spec["label"].replace(" ", "_").replace("(", "").replace(")", "")
    filename = f"VCX_{safe_label}_{contract_id[:8]}.docx"
    file_path = gen_dir / filename
    file_path.write_bytes(docx_bytes)

    # Persist metadata to DB
    try:
        with get_conn() as conn:
            conn.execute(
                """INSERT INTO generated_contracts
                   (id, contract_type, filename, file_path, size_bytes, created_at)
                   VALUES (?, ?, ?, ?, ?, datetime('now'))""",
                (contract_id, req.contract_type, filename,
                 str(file_path), len(docx_bytes)),
            )
    except Exception as exc:
        # DB table may not exist yet — log but don't fail the generation
        logger.warning("Could not persist generated contract to DB: %s", exc)

    download_url = f"/api/contracts/{contract_id}/download"

    return ContractGenerationResponse(
        contract_id=contract_id,
        contract_type=req.contract_type,
        contract_label=spec["label"],
        filename=filename,
        size_bytes=len(docx_bytes),
        download_url=download_url,
    )


@router.get("/{contract_id}/download")
def download_contract(contract_id: str):
    """Download a generated contract DOCX file.

    Phase 8: Serves the DOCX file from uploads/generated/{contract_id}/.
    Returns 404 if the contract_id does not exist or the file is missing.
    """
    gen_dir = GENERATED_DIR / contract_id
    if not gen_dir.exists():
        raise HTTPException(status_code=404, detail="Contract not found.")

    # Find the DOCX file in the directory
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
