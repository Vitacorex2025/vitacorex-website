from __future__ import annotations

import hashlib
import json
import shutil
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from uuid import uuid4

from fastapi import HTTPException, UploadFile

from backend.core.config import settings
from backend.models.case_schema import (
    ActionPacketOutput,
    CaseRecord,
    CaseStatus,
    FileType,
    RecoveryIntakeSession,
    SourceFact,
    StoredFile,
    WorkflowStage,
)
from backend.services import auth_service
from backend.services.canonical_snapshot import build_client_snapshot
from backend.services.case_extractor import extract_case_data
from backend.services.case_state import active_source_files, reset_processing_state, synchronize_case_status
from backend.services.case_store import default_workspace_id, ensure_case_dirs, load_case, save_case
from backend.services.deadline_extractor import extract_case_deadlines
from backend.services.document_issue_classifier import classify_case_issue
from backend.services.file_classifier import classify_file, normalized_filename
from backend.services.file_guard import validate_upload_file
from backend.services.file_ingestion import analyze_source_file
from backend.services.jurisdiction_engine import analyze_case_jurisdiction
from backend.services.official_contacts_service import resolve_official_contacts
from backend.services.recommended_path_service import recommend_paths
from backend.services.recovery_routing_engine import determine_recovery_route
from backend.services.validation_service import determine_case_status


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def intake_root() -> Path:
    root = settings.storage_path / "recovery_intake"
    root.mkdir(parents=True, exist_ok=True)
    return root


def ensure_session_dirs(session_id: str) -> dict[str, Path]:
    session_root = intake_root() / session_id
    source_dir = session_root / "source_files"
    for directory in (session_root, source_dir):
        directory.mkdir(parents=True, exist_ok=True)
    return {
        "session_root": session_root,
        "source_dir": source_dir,
        "record_path": session_root / "session.json",
    }


def session_meta_path(session_id: str) -> Path:
    return ensure_session_dirs(session_id)["record_path"]


def _default_case_title(entry_workflow: str | None) -> str:
    label = {
        "recovery_diagnostic": "Recovery Diagnostic session",
        "evidence_review": "Evidence review intake",
        "debtor_verification": "Debtor verification intake",
        "demand_pack": "Demand pack intake",
        "counsel_handoff": "Counsel handoff intake",
    }.get(str(entry_workflow or "").strip().lower())
    return label or "Recovery Diagnostic session"


def _build_preview_case(session_id: str, *, entry_workflow: str | None = None, title: str | None = None) -> CaseRecord:
    record = CaseRecord(
        id=f"intake_{session_id}",
        workspace_id=default_workspace_id(),
        created_by_user_id=auth_service.current_user_id() or "system",
        reference=session_id,
        title=(title or "").strip() or _default_case_title(entry_workflow),
        intake_channel="upload_first_intake",
        current_stage=WorkflowStage.DRAFT.value,
        action_packet_status="draft_only",
    )
    record.workflow_slug = str(entry_workflow or "").strip() or None
    record.client_snapshot = build_client_snapshot(record)
    record.client_snapshot.mode = "intake"
    record.client_snapshot.packet_generation_allowed = False
    return record


def _current_scope() -> tuple[str | None, str | None]:
    try:
        return auth_service.current_user_id(), auth_service.current_workspace_id()
    except Exception:
        return None, None


def _derive_source_map(record: CaseRecord) -> list[SourceFact]:
    source_facts: list[SourceFact] = []
    for item in active_source_files(record):
        excerpt = (item.extracted_text or "").strip().replace("\n", " ")
        source_facts.append(
            SourceFact(
                label=item.original_filename,
                value=str(item.file_type or "source_file"),
                source_file=item.original_filename,
                source_excerpt=excerpt[:220] or None,
                confidence=1.0 if excerpt else 0.5,
            )
        )
    return source_facts


def _assign_workflow(record: CaseRecord) -> None:
    if record.issue_category == "invoice_recovery_matter":
        record.workflow_slug = "invoice_recovery"
    elif record.issue_category == "irs_notice":
        record.workflow_slug = "irs_notice"
    elif record.issue_category == "debt_collection_notice":
        record.workflow_slug = "debt_defense"
    elif record.issue_category == "vehicle_purchase_contract":
        record.workflow_slug = "auto_deal_integrity"
    elif record.issue_category == "business_contract":
        record.workflow_slug = "contract_risk"
    elif record.issue_category == "permit_issue":
        record.workflow_slug = "permit_navigator"
    elif record.issue_category == "immigration_intake":
        record.workflow_slug = "immigration_forms"


def _refresh_workflow_state(record: CaseRecord) -> None:
    record.issue_category = classify_case_issue(record)
    record.deadlines = extract_case_deadlines(record)
    record.recommended_paths = recommend_paths(record)
    record.official_contacts = resolve_official_contacts(record)
    record.source_map = _derive_source_map(record)
    record.current_stage = WorkflowStage.CLASSIFIED.value if active_source_files(record) else WorkflowStage.DRAFT.value
    record.urgency_level = "high" if record.deadlines else ("medium" if active_source_files(record) else "low")
    record.action_packet_status = "draft_only"
    _assign_workflow(record)


def _refresh_recovery_truth(record: CaseRecord) -> None:
    truth = dict(record.extracted_case_data.recovery_truth or {})
    if str(record.issue_category or "").strip().lower() != "invoice_recovery_matter":
        record.extracted_case_data.recovery_truth = truth
        return
    decision = determine_recovery_route(record)
    truth.update(
        {
            "route_status": decision.get("status"),
            "route_reason_codes": list(decision.get("reason_codes") or []),
            "primary_next_step": (decision.get("primary_action") or {}).get("label"),
            "secondary_options": [item.get("label") for item in (decision.get("secondary_options") or decision.get("optional_actions") or []) if item.get("label")],
            "readiness_score": float(decision.get("readiness_score") or truth.get("readiness_score") or 0.0),
            "source_backed_explanation": list(decision.get("source_backed_explanation") or []),
            "generation_allowed": bool(decision.get("generation_allowed")),
        }
    )
    record.extracted_case_data.recovery_truth = truth


def _hydrate_preview_case(record: CaseRecord) -> CaseRecord:
    if not active_source_files(record):
        reset_processing_state(record, preserve_parties=True)
        record.status = CaseStatus.DRAFT.value
        record.current_stage = WorkflowStage.DRAFT.value
        record.deadlines = []
        record.recommended_paths = []
        record.official_contacts = []
        record.source_map = []
        record.client_snapshot = build_client_snapshot(record)
        record.client_snapshot.mode = "intake"
        record.client_snapshot.packet_generation_allowed = False
        return record

    for item in active_source_files(record):
        path = Path(item.storage_path)
        if not path.exists():
            item.warnings = list(dict.fromkeys([*(item.warnings or []), "Stored source file is missing from disk."]))
            continue
        analysis = analyze_source_file(path, item.original_filename, item.content_type)
        item.extracted_text = analysis.get("extracted_text")
        item.parsed_payload = analysis.get("parsed_payload")
        item.normalized_evidence = analysis.get("normalized_evidence")
        item.extraction_quality_score = float(analysis.get("extraction_quality_score") or 0.0)
        item.extraction_status = str(analysis.get("extraction_status") or "failed")
        item.extraction_method = analysis.get("extraction_method")
        item.extraction_report = dict(analysis.get("extraction_report") or {})
        item.warnings = list(dict.fromkeys(list(analysis.get("warnings") or [])))
        item.file_type = FileType(str(analysis.get("file_type") or classify_file(item.original_filename, item.content_type, item.extracted_text)))

    record.packet_generation = None
    record.generation_progress = None
    record.action_packet_outputs = []
    record.extracted_case_data = extract_case_data(record)
    record.jurisdiction_analysis = analyze_case_jurisdiction(record)
    _refresh_workflow_state(record)
    _refresh_recovery_truth(record)
    record.status = determine_case_status(record)
    synchronize_case_status(record)
    record.client_snapshot = build_client_snapshot(record)
    record.client_snapshot.mode = "intake"
    record.client_snapshot.packet_generation_allowed = False
    if record.client_snapshot.next_action:
        record.client_snapshot.next_action = (
            f"{record.client_snapshot.next_action} Formal matter promotion and packet generation stay admin-reviewed."
        )
    else:
        record.client_snapshot.next_action = "Upload the source set and review blockers before admin promotion."
    return record


def save_session(session: RecoveryIntakeSession) -> RecoveryIntakeSession:
    session.updated_at = _utcnow()
    session_meta_path(session.id).write_text(session.model_dump_json(indent=2), encoding="utf-8")
    return session


def load_session(session_id: str) -> RecoveryIntakeSession:
    path = session_meta_path(session_id)
    if not path.exists():
        raise FileNotFoundError(f"Recovery intake session '{session_id}' does not exist.")
    session = RecoveryIntakeSession.model_validate_json(path.read_text(encoding="utf-8"))
    _, workspace_id = _current_scope()
    if workspace_id and session.workspace_id and session.workspace_id != workspace_id:
        raise FileNotFoundError(f"Recovery intake session '{session_id}' does not exist.")
    return session


def create_session(*, entry_workflow: str | None = None, title: str | None = None) -> RecoveryIntakeSession:
    user_id, workspace_id = _current_scope()
    session_id = f"intake_{uuid4().hex[:12]}"
    session = RecoveryIntakeSession(
        id=session_id,
        workspace_id=workspace_id,
        created_by_user_id=user_id,
        title=(title or "").strip() or _default_case_title(entry_workflow),
        entry_workflow=(entry_workflow or "").strip() or "recovery_diagnostic",
        preview_case=_build_preview_case(session_id, entry_workflow=entry_workflow, title=title),
    )
    session.preview_case.workspace_id = workspace_id
    session.preview_case.created_by_user_id = user_id
    save_session(session)
    return session


def _persist_upload(destination: Path, upload: UploadFile) -> str:
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


def add_source_files(session_id: str, files: list[UploadFile]) -> RecoveryIntakeSession:
    session = load_session(session_id)
    if not files:
        raise HTTPException(status_code=400, detail="At least one source file is required.")

    directories = ensure_session_dirs(session_id)
    record = CaseRecord.model_validate(session.preview_case.model_dump(mode="json"))

    for upload in files:
        validation = validate_upload_file(upload)
        file_token = uuid4().hex[:12]
        safe_name = normalized_filename(upload.filename or "upload")
        destination = directories["source_dir"] / f"{file_token}_{safe_name}"
        sha256 = _persist_upload(destination, upload)
        analysis = analyze_source_file(destination, upload.filename or destination.name, upload.content_type)
        extracted_text = analysis.get("extracted_text")
        file_type = str(analysis.get("file_type") or classify_file(upload.filename or destination.name, upload.content_type, extracted_text))

        stored = StoredFile(
            id=file_token,
            filename=destination.name,
            original_filename=upload.filename or destination.name,
            workspace_id=session.workspace_id,
            matter_id=record.id,
            content_type=upload.content_type,
            file_type=FileType(file_type),
            storage_path=str(destination),
            size_bytes=int(validation["size_bytes"]),
            extraction_quality_score=float(analysis.get("extraction_quality_score") or 0.0),
            extraction_status=str(analysis.get("extraction_status") or "failed"),
            extraction_method=analysis.get("extraction_method"),
            extraction_report=dict(analysis.get("extraction_report") or {}),
            extracted_text=extracted_text,
            parsed_payload=analysis.get("parsed_payload"),
            normalized_evidence=analysis.get("normalized_evidence"),
            warnings=list(analysis.get("warnings") or []),
            sha256=sha256,
            scope_type="intake",
            service_scope="recovery_intake",
        )
        record.source_files.append(stored)

    session.preview_case = _hydrate_preview_case(record)
    save_session(session)
    return session


def _copy_file_to_case(item: StoredFile, case_id: str, workspace_id: str | None) -> StoredFile:
    source = Path(item.storage_path)
    if not source.exists():
        raise FileNotFoundError(f"Stored intake file '{item.original_filename}' is missing from disk.")
    directories = ensure_case_dirs(case_id)
    token = uuid4().hex[:12]
    destination = directories["source_dir"] / f"{token}_{source.name}"
    shutil.copy2(source, destination)
    copied = StoredFile.model_validate(item.model_dump(mode="json"))
    copied.id = token
    copied.filename = destination.name
    copied.storage_path = str(destination)
    copied.workspace_id = workspace_id
    copied.matter_id = case_id
    copied.scope_type = "matter"
    copied.service_scope = None
    return copied


def promote_session(session_id: str) -> CaseRecord:
    session = load_session(session_id)
    if session.promoted_case_id:
        try:
            return load_case(session.promoted_case_id)
        except FileNotFoundError:
            session.promoted_case_id = None

    preview = CaseRecord.model_validate(session.preview_case.model_dump(mode="json"))
    if not active_source_files(preview):
        raise HTTPException(status_code=400, detail={"message": "Upload source files before promoting the intake.", "code": "intake_missing_source_files"})

    case_id = f"case_{uuid4().hex[:10]}"
    promoted = CaseRecord.model_validate(preview.model_dump(mode="json"))
    promoted.id = case_id
    promoted.workspace_id = session.workspace_id or default_workspace_id()
    promoted.created_by_user_id = auth_service.current_user_id() or session.created_by_user_id or "system"
    promoted.reference = (preview.reference or session.id).strip() if isinstance(preview.reference, str) else (preview.reference or session.id)
    promoted.title = (preview.title or session.title or "Recovery matter").strip()
    promoted.intake_channel = "upload_first_intake"
    promoted.current_stage = preview.current_stage or WorkflowStage.CLASSIFIED.value
    promoted.action_packet_status = "not_built"
    promoted.action_packet_outputs = [ActionPacketOutput.model_validate(item.model_dump(mode="json")) for item in (preview.action_packet_outputs or [])]
    promoted.packet_generation = None
    promoted.generation_progress = None
    promoted.download_ledger = []
    promoted.notes = list(dict.fromkeys([*(preview.notes or []), f"Promoted from intake session {session.id}."]))
    promoted.source_files = [_copy_file_to_case(item, case_id, promoted.workspace_id) for item in active_source_files(preview)]

    save_case(promoted)
    session.promoted_case_id = case_id
    save_session(session)
    return promoted


def session_payload(session: RecoveryIntakeSession) -> dict[str, Any]:
    preview = CaseRecord.model_validate(session.preview_case.model_dump(mode="json"))
    snapshot = preview.client_snapshot or build_client_snapshot(preview)
    snapshot.mode = "intake"
    snapshot.packet_generation_allowed = False
    return {
        "session_id": session.id,
        "title": session.title or preview.title or session.id,
        "entry_workflow": session.entry_workflow or "recovery_diagnostic",
        "status": str(snapshot.status or preview.status or "draft"),
        "readiness": str(snapshot.readiness or "waiting_on_source_evidence"),
        "created_at": session.created_at,
        "updated_at": session.updated_at,
        "promoted_case_id": session.promoted_case_id,
        "workflow_slug": preview.workflow_slug,
        "issue_category": preview.issue_category,
        "current_stage": preview.current_stage,
        "urgency_level": preview.urgency_level,
        "recommended_paths": list(preview.recommended_paths or []),
        "deadlines": [item.model_dump(mode="json") for item in (preview.deadlines or [])],
        "official_contacts": [item.model_dump(mode="json") for item in (preview.official_contacts or [])],
        "source_files": [item.model_dump(mode="json") for item in (preview.source_files or [])],
        "source_file_count": len(preview.source_files or []),
        "client_snapshot": snapshot.model_dump(mode="json"),
        "diagnosis": {
            "next_action": snapshot.next_action,
            "blockers": list(snapshot.blockers or []),
            "warnings": list(snapshot.warnings or []),
            "blocker_count": int(snapshot.blocker_count or 0),
            "warning_count": int(snapshot.warning_count or 0),
            "readiness_score": float(preview.extracted_case_data.recovery_truth.get("readiness_score") or snapshot.readiness_score or 0.0),
            "route_reason_codes": list(preview.extracted_case_data.recovery_truth.get("route_reason_codes") or []),
            "source_backed_explanation": list(preview.extracted_case_data.recovery_truth.get("source_backed_explanation") or []),
            "packet_generation_allowed": False,
            "promotion_required": True,
        },
    }
