"""Contract Review Desk -- upload, analyze, and report endpoints.

Phase 3: Wired to DB + contract_analyzer service.
Phase 4A: Added upload validation + rate limiting.
Phase 4B: Enhanced analyze endpoint — PDF/DOCX extraction, missing protections,
          suggested questions, issue buckets, questionnaire context.
Analysis is pattern-based (regex), not LLM-driven.
"""

import os
import uuid
from pathlib import Path

from fastapi import APIRouter, File, Form, HTTPException, Request, UploadFile

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
from ..services.upload_validator import sanitize_filename, validate_file

router = APIRouter(prefix="/api/contracts")
UPLOADS_DIR = Path(os.getenv("VCX_UPLOADS_DIR", "uploads"))


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
