from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

from fastapi import APIRouter, BackgroundTasks, HTTPException, Query
from fastapi.responses import FileResponse

from backend.core.logging import get_logger
from backend.models.case_schema import SunbizLookupResult
from backend.services.audit_service import record_case_event
from backend.services.case_state import synchronize_case_status
from backend.services.case_store import ensure_case_dirs, load_case, save_case
from backend.services.source_capture import write_text_capture
from backend.services.sunbiz_adapter import to_case_sunbiz_result
from backend.services.sunbiz_lookup import lookup_entity
from backend.services.sunbiz_pdf import build_sunbiz_pdf

router = APIRouter(tags=["sunbiz"])
logger = get_logger(__name__)


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _write_evidence_json(case_id: str, record) -> str:
    if not record.sunbiz_lookup:
        raise ValueError("SunBiz verification is not available for this case.")
    dirs = ensure_case_dirs(case_id)
    evidence_path = Path(dirs["verification_dir"]) / "sunbiz_evidence_package.json"
    payload = record.sunbiz_lookup.model_dump(mode="json")
    payload["case_id"] = case_id
    payload["memo_disclaimer"] = "Internal verification memo only. Not an official Florida certificate or certified copy."
    evidence_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
    record.sunbiz_lookup.evidence_package_path = str(evidence_path)
    record.sunbiz_lookup.evidence_download_url = f"/files/cases/{case_id}/verification/{evidence_path.name}"
    return str(evidence_path)


def _write_source_captures(case_id: str, record: object, search_html: str | None = None, detail_html: str | None = None) -> None:
    if not getattr(record, "sunbiz_lookup", None):
        return
    dirs = ensure_case_dirs(case_id)
    downloads: list[str] = []
    if search_html:
        path = write_text_capture(dirs["verification_dir"], "sunbiz_search_capture.html", search_html)
        record.sunbiz_lookup.search_capture_path = str(path)
        downloads.append(f"/files/cases/{case_id}/verification/{path.name}")
    if detail_html:
        path = write_text_capture(dirs["verification_dir"], "sunbiz_detail_capture.html", detail_html)
        record.sunbiz_lookup.detail_capture_path = str(path)
        downloads.append(f"/files/cases/{case_id}/verification/{path.name}")
    record.sunbiz_lookup.source_capture_downloads = downloads


def _refresh_pdf_metadata(case_id: str, record) -> str:
    if not record.sunbiz_lookup:
        raise ValueError("SunBiz verification is not available for this case.")
    dirs = ensure_case_dirs(case_id)
    pdf_path = build_sunbiz_pdf(record, dirs["verification_dir"] / "sunbiz_internal_verification_memo.pdf")
    record.sunbiz_lookup.pdf_report_path = str(pdf_path)
    record.sunbiz_lookup.pdf_download_url = f"/files/cases/{case_id}/verification/{pdf_path.name}"
    _write_evidence_json(case_id, record)
    save_case(record)
    return str(pdf_path)


@router.get("/sunbiz/lookup")
def lookup_sunbiz_entity(entity_name: str = Query(..., min_length=2)):
    try:
        result = lookup_entity(entity_name)
        payload = to_case_sunbiz_result(result)
        payload.looked_up_at = _utcnow()
        logger.info("SunBiz lookup completed for entity: %s", entity_name)
        return payload
    except Exception as exc:
        logger.exception("SunBiz lookup failed for entity: %s", entity_name)
        raise HTTPException(status_code=502, detail=f"SunBiz lookup request failed: {exc}") from exc


@router.post("/sunbiz/cases/{case_id}/lookup")
def lookup_sunbiz_for_case(
    case_id: str,
    background_tasks: BackgroundTasks,
    entity_name: str | None = Query(default=None),
):
    try:
        record = load_case(case_id)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    lookup_name = entity_name or record.extracted_case_data.defendant_entity.party_name
    if not lookup_name:
        raise HTTPException(status_code=400, detail="No entity_name provided and no defendant entity exists in the case record.")

    try:
        result = lookup_entity(lookup_name)
        mapped = to_case_sunbiz_result(result)
        mapped.looked_up_at = _utcnow()
        mapped.source_url = mapped.source_url or mapped.detail_url
        record.sunbiz_lookup = mapped
        _write_source_captures(case_id, record, getattr(result, "search_html", None), getattr(result, "detail_html", None))
        _refresh_pdf_metadata(case_id, record)
        synchronize_case_status(record)
        save_case(record)

        event_type = "sunbiz.lookup.completed"
        if mapped.result_classification == "no_match":
            event_type = "sunbiz.lookup.no_match"
        elif mapped.result_classification == "unavailable":
            event_type = "sunbiz.lookup.unavailable"

        background_tasks.add_task(
            record_case_event,
            case_id,
            event_type,
            {
                "queried_entity_name": lookup_name,
                "matched": mapped.matched,
                "result_classification": mapped.result_classification,
                "provider_status": mapped.provider_status,
                "pdf_download_url": mapped.pdf_download_url,
                "official_source_urls": mapped.official_source_urls,
            },
        )
        logger.info("SunBiz lookup saved to case %s", case_id)
        return mapped
    except Exception as exc:
        fallback = SunbizLookupResult(
            queried_entity_name=lookup_name,
            matched=False,
            warnings=[f"SunBiz lookup failed: {exc}"],
            looked_up_at=_utcnow(),
            provider_status="unavailable",
            result_classification="unavailable",
            official_record_available=False,
        )
        record.sunbiz_lookup = fallback
        synchronize_case_status(record)
        save_case(record)

        background_tasks.add_task(
            record_case_event,
            case_id,
            "sunbiz.lookup.unavailable",
            {"queried_entity_name": lookup_name, "error": str(exc)},
        )
        logger.exception("SunBiz lookup failed for case %s", case_id)
        return fallback


@router.get("/sunbiz/cases/{case_id}/report.pdf")
def get_sunbiz_case_report(case_id: str):
    try:
        record = load_case(case_id)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    if not record.sunbiz_lookup:
        raise HTTPException(status_code=404, detail="SunBiz verification has not been run for this case.")

    pdf_path = record.sunbiz_lookup.pdf_report_path
    if not pdf_path:
        pdf_path = _refresh_pdf_metadata(case_id, record)

    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename=f"{case_id}_sunbiz_internal_verification_memo.pdf",
    )
