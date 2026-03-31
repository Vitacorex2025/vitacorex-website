
from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from backend.services.audit_service import record_case_event
from backend.services.case_store import load_case, save_case
from backend.services.entity_registry_router import infer_state_hint, verify_entity
from backend.services.jurisdiction_engine import analyze_case_jurisdiction

router = APIRouter(tags=["entity-registry"])


@router.post("/entity-registry/cases/{case_id}/verify")
def verify_case_entity(
    case_id: str,
    entity_name: str | None = Query(default=None),
    state_hint: str | None = Query(default=None),
):
    try:
        record = load_case(case_id)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    lookup_name = entity_name or record.extracted_case_data.defendant_entity.party_name
    if not lookup_name:
        raise HTTPException(status_code=400, detail="No entity name was available for verification.")

    inferred_state = (state_hint or infer_state_hint(
        record.extracted_case_data.business_address,
        record.extracted_case_data.service_address,
        record.extracted_case_data.defendant_entity.address,
    ) or "").upper() or None

    result = verify_entity(lookup_name, inferred_state)
    record.entity_verification = result
    record.jurisdiction_analysis = analyze_case_jurisdiction(record)
    save_case(record)
    record_case_event(
        case_id,
        "entity_registry.verified",
        {
            "entity_name": lookup_name,
            "state": result.state,
            "provider": result.provider,
            "status": result.status,
        },
    )
    return {
        "case_id": case_id,
        "entity_verification": result.model_dump(mode="json"),
        "jurisdiction_analysis": record.jurisdiction_analysis.model_dump(mode="json") if record.jurisdiction_analysis else None,
    }
