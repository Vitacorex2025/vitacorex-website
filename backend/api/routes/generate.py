
from __future__ import annotations

from fastapi import APIRouter, Body, HTTPException, Query, Request

from backend.services.case_store import load_case
from backend.services import auth_service
from backend.services.generation_service import ANALYSIS_ONLY_DOCUMENT_TYPES, get_generation_progress, run_generation_job_sync, start_generation_job
from backend.services.template_registry import strict_templates
from backend.services.validation_service import collect_generation_blockers

router = APIRouter(tags=["generate"])


def _normalize_selected_document_types(selected_document_types: list[str] | None) -> list[str]:
    available = [item.document_type for item in strict_templates()] + list(ANALYSIS_ONLY_DOCUMENT_TYPES.keys())
    allowed = set(available)
    normalized = [item for item in (selected_document_types or available) if item in allowed]
    if not normalized:
        return available
    ordered = [item for item in available if item in set(normalized)]
    return ordered


def _blocked_payload(selected_document_types: list[str], readiness) -> dict[str, object]:
    return {
        "status": "blocked",
        "message": "Packet generation blocked by readiness rules.",
        "blockers": list(readiness.blockers or []),
        "blocking_items": list(readiness.blockers or []),
        "documents_not_generated": list(selected_document_types or []),
        "allowed_document_types": list(readiness.allowed_document_types or []),
    }


@router.post("/generate/{case_id}")
def generate_case_packet(
    case_id: str,
    request: Request,
    payload: dict | None = Body(default=None),
    wait: bool = Query(default=False),
):
    auth_service.require_packet_generation_access(request)
    try:
        record = load_case(case_id)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    requested = []
    if isinstance(payload, dict):
        requested = payload.get("selected_document_types") or []
    selected_document_types = _normalize_selected_document_types(list(requested or []))

    blockers = collect_generation_blockers(record, include_verification_gate=False)
    if blockers:
        class _Readiness:
            def __init__(self, items):
                self.blockers = items
                self.allowed_document_types = []

        raise HTTPException(status_code=400, detail=_blocked_payload(selected_document_types, _Readiness(blockers)))

    if wait:
        progress = run_generation_job_sync(case_id, selected_document_types)
        record = load_case(case_id)
        packet = record.packet_generation
        if progress.status == "failed" and not packet:
            raise HTTPException(status_code=500, detail=progress.message or "Packet generation failed.")

        return {
            "case_id": record.id,
            "status": record.status,
            "generation_progress": progress.model_dump(mode="json"),
            "generated_documents": [doc.model_dump(mode="json") for doc in (packet.documents if packet else [])],
            "zip_download_url": packet.download_url if packet else None,
            "warnings": packet.warnings if packet else [],
            "selected_document_types": selected_document_types,
        }

    progress = start_generation_job(case_id, selected_document_types)
    record = load_case(case_id)
    return {
        "case_id": case_id,
        "status": record.status,
        "generation_progress": progress.model_dump(mode="json"),
        "selected_document_types": selected_document_types,
    }


@router.get("/generate/{case_id}/progress")
def get_case_generation_progress(case_id: str):
    try:
        record = load_case(case_id)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    progress = get_generation_progress(case_id)
    return {
        "case_id": case_id,
        "status": record.status,
        "generation_progress": progress.model_dump(mode="json"),
        "packet_generation": record.packet_generation.model_dump(mode="json") if record.packet_generation else None,
    }
