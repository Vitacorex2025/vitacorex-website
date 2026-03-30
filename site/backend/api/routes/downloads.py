
from __future__ import annotations

from pathlib import Path

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field

from backend.services.audit_service import record_case_event
from backend.services.entitlements_service import record_usage_event
from backend.services import auth_service
from backend.services.case_store import load_case, save_case
from backend.services.download_ledger import mark_downloaded, visible_entries
from backend.services.recovery_workspace_service import refresh_workspace_modules, set_packet_release_state
from backend.services.retention_service import policy_payload

router = APIRouter(tags=["downloads"])


class PacketArchiveReleaseRequest(BaseModel):
    release_state: str = Field(default="ready_for_review", max_length=40)


@router.get("/downloads/cases/{case_id}")
def get_case_downloads(case_id: str):
    try:
        record = load_case(case_id)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    entries = visible_entries(record)
    refresh_workspace_modules(record)
    save_case(record)
    return {
        "case_id": case_id,
        "entries": [item.model_dump(mode="json") for item in entries],
        "packet_archive": [item.model_dump(mode="json") for item in (record.packet_archive or [])],
        "portal_access": record.portal_access.model_dump(mode="json"),
        "retention_policy": policy_payload(),
    }


@router.post("/downloads/cases/{case_id}/{ledger_id}/mark-downloaded")
def mark_case_downloaded(case_id: str, ledger_id: str):
    try:
        record = load_case(case_id)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    try:
        entry = mark_downloaded(record, ledger_id)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    record_case_event(case_id, "download.completed", {"ledger_id": ledger_id, "file_name": entry.file_name})
    record_usage_event(
        record.workspace_id or "workspace_legacy",
        "packet_downloaded",
        case_id=case_id,
        payload={"ledger_id": ledger_id, "file_name": entry.file_name, "category": entry.category},
    )
    return {"case_id": case_id, "entry": entry.model_dump(mode="json")}


@router.delete("/downloads/cases/{case_id}/{ledger_id}")
def delete_case_download(case_id: str, ledger_id: str):
    try:
        record = load_case(case_id)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    target = next((item for item in record.download_ledger if item.id == ledger_id), None)
    if target is None:
        raise HTTPException(status_code=404, detail=f"Download ledger entry '{ledger_id}' was not found.")

    file_path = Path(target.file_path) if target.file_path else None
    if file_path and file_path.exists():
        file_path.unlink()

    record.download_ledger = [item for item in record.download_ledger if item.id != ledger_id]

    if record.packet_generation:
        record.packet_generation.documents = [
            item
            for item in record.packet_generation.documents
            if Path(item.document_path or item.document_name).name != target.file_name
        ]
        if record.packet_generation.zip_path and Path(record.packet_generation.zip_path).name == target.file_name:
            record.packet_generation.zip_path = None
            record.packet_generation.download_url = None

    if record.contract_review:
        if record.contract_review.revised_contract_path and Path(record.contract_review.revised_contract_path).name == target.file_name:
            record.contract_review.revised_contract_path = None
            record.contract_review.revised_contract_download_url = None
        if record.contract_review.change_memo_path and Path(record.contract_review.change_memo_path).name == target.file_name:
            record.contract_review.change_memo_path = None
            record.contract_review.change_memo_download_url = None

    save_case(record)
    record_case_event(case_id, "download.removed", {"ledger_id": ledger_id, "file_name": target.file_name})
    return {"ok": True, "case_id": case_id, "removed": target.model_dump(mode="json")}


@router.patch("/downloads/cases/{case_id}/packet-archive/{archive_entry_id}")
def update_packet_archive_release_state(case_id: str, archive_entry_id: str, payload: PacketArchiveReleaseRequest, request: Request):
    auth_service.require_packet_generation_access(request)
    try:
        record = load_case(case_id)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    try:
        context = auth_service.require_session(request)
        entry = set_packet_release_state(
            record,
            archive_entry_id=archive_entry_id,
            release_state=payload.release_state,
            reviewer_user_id=context.user.id,
            reviewer_label=(context.user.email or "admin"),
        )
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    refresh_workspace_modules(record)
    save_case(record)
    record_case_event(case_id, "packet.release_state.updated", {"archive_entry_id": archive_entry_id, "release_state": entry.release_state})
    return {"case_id": case_id, "entry": entry.model_dump(mode="json")}
