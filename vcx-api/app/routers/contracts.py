"""Contract Review Desk -- upload, analyze, and report endpoints.

Phase 3: Wired to DB + contract_analyzer service.
Analysis is pattern-based (regex), not LLM-driven.
"""

import os
import uuid
from pathlib import Path

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from ..db import get_conn
from ..models.contract import (
    ClauseItem,
    ContractAnalysisResponse,
    ContractUploadResponse,
)
from ..services.contract_analyzer import (
    compute_risk_score,
    detect_clauses,
    extract_text_from_bytes,
    generate_risk_summary,
)

router = APIRouter(prefix="/api/contracts")
UPLOADS_DIR = Path(os.getenv("VCX_UPLOADS_DIR", "uploads"))


@router.post("/upload", status_code=201, response_model=ContractUploadResponse)
async def upload_contract(
    file: UploadFile = File(...),
    matter_id: str = Form(None),
):
    """Upload a contract document for later analysis."""
    review_id = str(uuid.uuid4())
    review_dir = UPLOADS_DIR / "contracts" / review_id
    review_dir.mkdir(parents=True, exist_ok=True)
    file_id = str(uuid.uuid4())
    safe_name = f"{file_id}_{file.filename}"
    file_path = review_dir / safe_name
    content = await file.read()
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
async def analyze_contract(
    file: UploadFile = File(...),
):
    """One-shot upload + analyze: extract text, detect clauses, score risk."""
    review_id = str(uuid.uuid4())
    content = await file.read()

    # Save file
    review_dir = UPLOADS_DIR / "contracts" / review_id
    review_dir.mkdir(parents=True, exist_ok=True)
    file_id = str(uuid.uuid4())
    safe_name = f"{file_id}_{file.filename}"
    file_path = review_dir / safe_name
    file_path.write_bytes(content)

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
                 "Upload a .txt file for instant analysis, or request manual review."),
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
                "Upload a .txt file for instant analysis, or submit via "
                "structured intake for manual review."
            ),
        )

    # Run clause detection
    raw_clauses = detect_clauses(text)
    risk_score = compute_risk_score(raw_clauses)
    risk_summary = generate_risk_summary(raw_clauses, risk_score)

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
