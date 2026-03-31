
from __future__ import annotations

from fastapi import APIRouter, HTTPException

from backend.services.audit_service import record_case_event
from backend.services.case_store import load_case, save_case
from backend.services.contract_review_service import analyze_contracts, generate_revised_contract
from backend.services.download_ledger import sync_generated_outputs

router = APIRouter(tags=["contract-review"])


@router.post("/contract-review/cases/{case_id}/analyze")
def analyze_case_contracts(case_id: str):
    try:
        record = load_case(case_id)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    review = analyze_contracts(record)
    record.contract_review = review
    save_case(record)
    record_case_event(case_id, "contract_review.analyzed", {"status": review.status, "finding_count": len(review.findings)})
    return {"case_id": case_id, "contract_review": review.model_dump(mode="json")}


@router.post("/contract-review/cases/{case_id}/generate-draft")
def generate_case_contract_draft(case_id: str):
    try:
        record = load_case(case_id)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    review = record.contract_review or analyze_contracts(record)
    if not review.findings:
        raise HTTPException(status_code=400, detail="No contract findings are available to support a revised draft.")

    review = generate_revised_contract(record, review)
    record.contract_review = review
    sync_generated_outputs(record)
    save_case(record)
    record_case_event(case_id, "contract_review.draft_generated", {"status": review.status})
    return {"case_id": case_id, "contract_review": review.model_dump(mode="json")}
