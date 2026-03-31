from __future__ import annotations

import hashlib
import shutil
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, File, HTTPException, Request, UploadFile
from pydantic import BaseModel

from backend.models.case_schema import CaseStatus, FileType, StoredFile
from backend.services.audit_service import record_case_event
from backend.services.case_state import reset_processing_state, synchronize_case_status
from backend.services.case_store import ensure_case_dirs, load_case, save_case
from backend.services.docx_extractor import extract_docx_text
from backend.services.file_classifier import classify_file, infer_template_slot, normalized_filename
from backend.services.file_guard import validate_upload_file
from backend.services.file_ingestion import analyze_source_file
from backend.services.entitlements_service import record_usage_event
from backend.services import auth_service

router = APIRouter(tags=["upload"])


class SourceFilePatchRequest(BaseModel):
    active: bool
    reason: str | None = None


def _persist_file(destination: Path, upload: UploadFile) -> str:
    hasher = hashlib.sha256()
    with destination.open("wb") as buffer:
        while True:
            chunk = upload.file.read(1024 * 1024)
            if not chunk:
                break
            buffer.write(chunk)
            hasher.update(chunk)
    try:
        upload.file.close()
    except Exception:
        pass
    return hasher.hexdigest()


def _preprocess_source_file(destination: Path, upload: UploadFile) -> tuple[str | None, dict | None, list[str], str]:
    analysis = analyze_source_file(destination, upload.filename or destination.name, upload.content_type)
    return (
        analysis.get("extracted_text"),
        analysis.get("parsed_payload"),
        list(analysis.get("warnings") or []),
        str(analysis.get("file_type") or classify_file(upload.filename or destination.name, upload.content_type, None)),
    )


def _refresh_case_after_source_change(record, *, preserve_parties: bool = False):
    reset_processing_state(record, preserve_parties=preserve_parties)
    synchronize_case_status(record)
    save_case(record)
    return record


@router.post("/cases/{case_id}/source-files")
async def upload_source_files(case_id: str, request: Request, files: list[UploadFile] = File(...)):
    try:
        record = load_case(case_id)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    if not files:
        raise HTTPException(status_code=400, detail="At least one source file is required.")

    try:
        context = auth_service.require_session(request)
        actor_user_id = context.user.id
    except Exception:
        actor_user_id = None
    record_usage_event(
        record.workspace_id or "workspace_legacy",
        "upload_started",
        case_id=case_id,
        actor_user_id=actor_user_id,
        payload={"file_count": len(files)},
    )

    dirs = ensure_case_dirs(case_id)
    stored: list[StoredFile] = []
    duplicate_skipped: list[dict[str, str]] = []

    for upload in files:
        validation = validate_upload_file(upload)
        file_token = uuid4().hex[:12]
        safe_name = normalized_filename(upload.filename or "upload")
        destination = dirs["source_dir"] / f"{file_token}_{safe_name}"
        sha256 = _persist_file(destination, upload)

        existing = next((item for item in record.source_files if getattr(item, 'sha256', None) and getattr(item, 'sha256', None) == sha256), None)
        if existing is not None:
            try:
                destination.unlink()
            except Exception:
                pass
            duplicate_skipped.append({"file_id": existing.id, "filename": existing.original_filename, "sha256": sha256})
            record_case_event(case_id, "source_file.duplicate_skipped", {"file_id": existing.id, "filename": existing.original_filename})
            stored.append(existing)
            continue

        analysis = analyze_source_file(destination, upload.filename or destination.name, upload.content_type)
        extracted_text = analysis.get("extracted_text")
        parsed_payload = analysis.get("parsed_payload")
        warnings = list(analysis.get("warnings") or [])
        file_type = str(analysis.get("file_type") or classify_file(upload.filename or destination.name, upload.content_type, extracted_text))

        stored_file = StoredFile(
            id=file_token,
            filename=destination.name,
            original_filename=upload.filename or destination.name,
            content_type=upload.content_type,
            file_type=FileType(file_type),
            storage_path=str(destination),
            size_bytes=int(validation["size_bytes"]),
            extraction_quality_score=float(analysis.get("extraction_quality_score") or 0.0),
            extraction_status=str(analysis.get("extraction_status") or "failed"),
            extraction_method=analysis.get("extraction_method"),
            extraction_report=dict(analysis.get("extraction_report") or {}),
            extracted_text=extracted_text,
            parsed_payload=parsed_payload,
            normalized_evidence=analysis.get("normalized_evidence"),
            warnings=warnings,
            sha256=sha256,
        )
        record.source_files.append(stored_file)
        stored.append(stored_file)
        record_case_event(case_id, "source_file.uploaded", {"file_id": file_token, "filename": stored_file.original_filename, "sha256": sha256})
        for warning in warnings:
            if "multiple debtor companies" in warning.lower():
                record_case_event(case_id, "matter.consistency.failed", {"filename": stored_file.original_filename, "warning": warning})

    _refresh_case_after_source_change(record)
    record_usage_event(
        record.workspace_id or "workspace_legacy",
        "upload_completed",
        case_id=case_id,
        actor_user_id=actor_user_id,
        payload={
            "file_count": len(files),
            "stored_file_count": len(stored),
            "duplicate_skipped_count": len(duplicate_skipped),
        },
    )

    return {
        "case_id": case_id,
        "stored_files": stored,
        "source_file_count": len(record.source_files),
        "duplicate_skipped": duplicate_skipped,
        "status": record.status,
        "client_snapshot": record.client_snapshot.model_dump(mode="json"),
    }


@router.patch("/cases/{case_id}/source-files/{file_id}")
def patch_source_file(case_id: str, file_id: str, payload: SourceFilePatchRequest):
    try:
        record = load_case(case_id)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    target = next((item for item in record.source_files if item.id == file_id), None)
    if target is None:
        raise HTTPException(status_code=404, detail=f"Source file '{file_id}' does not exist.")

    target.excluded_from_active_matter = not bool(payload.active)
    target.exclusion_reason = None if payload.active else ((payload.reason or "").strip() or "manually excluded")
    _refresh_case_after_source_change(record)
    record_case_event(
        case_id,
        "source_file.scope_updated",
        {
            "file_id": file_id,
            "active": payload.active,
            "reason": target.exclusion_reason,
        },
    )
    return {"case_id": case_id, "file_id": file_id, "active": payload.active, "status": record.status, "client_snapshot": record.client_snapshot.model_dump(mode="json")}


@router.delete("/cases/{case_id}/source-files/{file_id}")
def remove_source_file(case_id: str, file_id: str):
    try:
        record = load_case(case_id)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    remaining: list[StoredFile] = []
    removed = None
    for item in record.source_files:
        if item.id == file_id:
            removed = item
            path = Path(item.storage_path)
            if path.exists():
                path.unlink()
        else:
            remaining.append(item)

    if removed is None:
        raise HTTPException(status_code=404, detail=f"Source file '{file_id}' does not exist.")

    record.source_files = remaining
    _refresh_case_after_source_change(record)
    record_case_event(case_id, "source_file.removed", {"file_id": file_id})
    return {"case_id": case_id, "removed_file_id": file_id, "source_file_count": len(record.source_files), "status": record.status, "client_snapshot": record.client_snapshot.model_dump(mode="json")}


@router.post("/cases/{case_id}/template-files")
async def upload_template_files(case_id: str, files: list[UploadFile] = File(...)):
    try:
        record = load_case(case_id)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    if not files:
        raise HTTPException(status_code=400, detail="At least one DOCX template file is required.")

    dirs = ensure_case_dirs(case_id)
    stored: list[StoredFile] = []

    for upload in files:
        validation = validate_upload_file(upload)
        slot = infer_template_slot(upload.filename or "")
        if not slot:
            raise HTTPException(status_code=400, detail=f"Template filename not recognized: {upload.filename}")
        file_token = uuid4().hex[:12]
        safe_name = normalized_filename(upload.filename or "template.docx")
        destination = dirs["template_dir"] / f"{file_token}_{safe_name}"
        sha256 = _persist_file(destination, upload)

        text = ""
        warnings: list[str] = []
        try:
            text = extract_docx_text(destination)
        except Exception as exc:
            warnings.append(f"DOCX text extraction failed: {exc}")

        new_list: list[StoredFile] = []
        for existing in record.template_files:
            if existing.template_slot == slot:
                existing_path = Path(existing.storage_path)
                if existing_path.exists():
                    existing_path.unlink()
            else:
                new_list.append(existing)

        stored_file = StoredFile(
            id=file_token,
            filename=destination.name,
            original_filename=upload.filename or destination.name,
            content_type=upload.content_type,
            file_type=FileType.TEMPLATE_DOCX,
            storage_path=str(destination),
            size_bytes=int(validation["size_bytes"]),
            extracted_text=text,
            warnings=warnings,
            template_slot=slot,
            sha256=sha256,
        )
        new_list.append(stored_file)
        record.template_files = new_list
        stored.append(stored_file)
        record_case_event(case_id, "template_file.uploaded", {"file_id": file_token, "filename": stored_file.original_filename, "template_slot": slot})

    record.packet_generation = None
    record.generation_progress = None
    synchronize_case_status(record)
    save_case(record)
    return {"case_id": case_id, "stored_files": stored, "template_file_count": len(record.template_files)}


@router.delete("/cases/{case_id}/template-files/{file_id}")
def remove_template_file(case_id: str, file_id: str):
    try:
        record = load_case(case_id)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    remaining: list[StoredFile] = []
    removed = None
    for item in record.template_files:
        if item.id == file_id:
            removed = item
            path = Path(item.storage_path)
            if path.exists():
                path.unlink()
        else:
            remaining.append(item)

    if removed is None:
        raise HTTPException(status_code=404, detail=f"Template file '{file_id}' does not exist.")

    record.template_files = remaining
    record.packet_generation = None
    record.generation_progress = None
    synchronize_case_status(record)
    save_case(record)
    record_case_event(case_id, "template_file.removed", {"file_id": file_id})
    return {"case_id": case_id, "removed_file_id": file_id, "template_file_count": len(record.template_files)}
