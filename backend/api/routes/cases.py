from __future__ import annotations

import shutil
from datetime import datetime, timezone
from decimal import Decimal
from pathlib import Path
from typing import Any
from uuid import uuid4

from fastapi import APIRouter, HTTPException, Request
from openpyxl import Workbook
from pydantic import BaseModel, Field

from backend.models.case_schema import (
    ActionPacketOutput,
    CaseRecord,
    CaseStatus,
    CommunicationLogEntry,
    DebtCaseExtraction,
    DeadlineOverrideRecord,
    FileType,
    FloridaCourtLevel,
    PartyDetails,
    PartyRole,
    SettlementTrackerEntry,
    SourceFact,
    StoredFile,
    WorkflowStage,
)
from backend.services.action_packet_service import build_action_packet
from backend.services.audit_service import load_case_events, record_case_event
from backend.services.canonical_snapshot import build_client_snapshot
from backend.services.case_extractor import extract_case_data
from backend.services.case_state import active_source_files, reset_processing_state, synchronize_case_status, case_summary_total
from backend.services.case_store import default_workspace_id, ensure_case_dirs, list_cases, load_case, save_case
from backend.services.deadline_extractor import extract_case_deadlines
from backend.services.document_issue_classifier import classify_case_issue
from backend.services.docx_extractor import extract_docx_text
from backend.services.entitlements_service import record_usage_event
from backend.services.excel_parser import parse_invoice_workbook
from backend.services.file_classifier import classify_file
from backend.services.file_ingestion import analyze_source_file
from backend.services.jurisdiction_engine import analyze_case_jurisdiction
from backend.services.matter_validator import analyze_case_sources, entity_key, source_kind_from_item
from backend.services.official_contacts_service import resolve_official_contacts
from backend.services.recommended_path_service import recommend_paths
from backend.services.recovery_routing_engine import determine_recovery_route
from backend.services.recovery_workspace_service import (
    append_communication_log,
    apply_deadline_override,
    merge_deadlines_with_overrides,
    refresh_workspace_modules,
    upsert_settlement_tracker_entry,
)
from backend.services.validation_service import determine_case_status
from backend.services import auth_service

router = APIRouter(tags=["cases"])


class CaseCreateRequest(BaseModel):
    reference: str | None = Field(default=None, max_length=120)
    matter_name: str | None = Field(default=None, max_length=160)
    plaintiff_name: str | None = Field(default=None, max_length=140)
    defendant_name: str | None = Field(default=None, max_length=140)
    notes: str | None = Field(default=None, max_length=1200)


class CaseReviewRequest(BaseModel):
    plaintiff_name: str | None = None
    defendant_name: str | None = None
    guarantor_name: str | None = None
    service_address: str | None = None
    business_address: str | None = None
    venue_county: str | None = None
    venue_clause: str | None = None
    venue_paragraph: str | None = None
    governing_law: str | None = None
    payment_terms: str | None = None
    default_terms: str | None = None
    interest_terms: str | None = None
    amount_in_controversy: str | None = None


class BulkCaseDeleteRequest(BaseModel):
    case_ids: list[str] = Field(default_factory=list)
    delete_all: bool = False
    hard: bool = True


class CaseRouteRequest(BaseModel):
    path: str | None = None


class CaseStageRequest(BaseModel):
    stage: str | None = None


class CommunicationLogRequest(BaseModel):
    entry_type: str = Field(default="manual_note", max_length=40)
    channel: str = Field(default="internal_note", max_length=60)
    direction: str = Field(default="internal", max_length=30)
    summary: str = Field(min_length=1, max_length=240)
    body: str | None = Field(default=None, max_length=4000)


class SettlementTrackerRequest(BaseModel):
    entry_id: str | None = Field(default=None, max_length=40)
    proposal_type: str = Field(default="settlement_offer", max_length=40)
    status: str = Field(default="draft", max_length=40)
    title: str | None = Field(default=None, max_length=180)
    summary: str | None = Field(default=None, max_length=1000)
    term_summary: str | None = Field(default=None, max_length=1000)
    proposed_amount: str | None = Field(default=None, max_length=60)
    proposed_payment_count: int | None = Field(default=None, ge=1, le=120)
    proposed_first_payment_date: str | None = Field(default=None, max_length=40)
    linked_route_status: str | None = Field(default=None, max_length=60)
    reason_codes: list[str] = Field(default_factory=list)


class DeadlineOverrideRequest(BaseModel):
    deadline_type: str | None = Field(default=None, max_length=40)
    label: str = Field(min_length=1, max_length=160)
    date: str | None = Field(default=None, max_length=40)
    reason: str | None = Field(default=None, max_length=600)


def _recompute_court(record: CaseRecord) -> None:
    extraction = record.extracted_case_data
    amount = extraction.amount_reconciliation.case_summary_total or extraction.amount_in_controversy
    if amount <= 0:
        extraction.florida_court.court_level = FloridaCourtLevel.UNDETERMINED
        extraction.florida_court.court_division_label = "Undetermined"
        extraction.florida_court.reasoning = ["Amount in controversy missing or zero."]
    elif amount <= Decimal("50000"):
        extraction.florida_court.court_level = FloridaCourtLevel.COUNTY_CIVIL
        extraction.florida_court.court_division_label = "County Court"
        extraction.florida_court.reasoning = ["Amount in controversy does not exceed $50,000."]
    else:
        extraction.florida_court.court_level = FloridaCourtLevel.CIRCUIT_CIVIL
        extraction.florida_court.court_division_label = "Circuit Court"
        extraction.florida_court.reasoning = ["Amount in controversy exceeds $50,000."]
    extraction.florida_court.amount_in_controversy = amount
    extraction.florida_court.venue_county = extraction.venue.venue_county


def _case_summary(record: CaseRecord) -> dict[str, object]:
    snapshot = record.client_snapshot
    return {
        "id": record.id,
        "title": snapshot.matter_label or record.title,
        "reference": record.reference,
        "status": str(snapshot.status or record.status),
        "issue_category": record.issue_category,
        "workflow_slug": record.workflow_slug,
        "current_stage": record.current_stage,
        "urgency_level": record.urgency_level,
        "recommended_paths": list(record.recommended_paths or []),
        "action_packet_status": record.action_packet_status,
        "plaintiff_name": snapshot.plaintiff_name,
        "defendant_name": snapshot.defendant_name,
        "amount_in_controversy": str(snapshot.display_amount or "0.00"),
        "source_file_count": snapshot.source_file_count,
        "blockers": list(snapshot.blockers or []),
        "warning_count": snapshot.warning_count,
        "updated_at": record.updated_at,
        "action_center_route": f"/app/action-center/?case={record.id}",
        "workspace_route": f"/app/workspace/?case={record.id}",
    }


def _load_case_or_404(case_id: str) -> CaseRecord:
    try:
        return load_case(case_id)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


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
    record.deadlines = merge_deadlines_with_overrides(record, extract_case_deadlines(record))
    record.recommended_paths = recommend_paths(record)
    record.official_contacts = resolve_official_contacts(record)
    record.source_map = _derive_source_map(record)
    record.current_stage = WorkflowStage.CLASSIFIED.value
    record.urgency_level = "high" if record.deadlines else ("medium" if active_source_files(record) else "low")
    record.action_packet_status = record.action_packet_status or "ready_to_build"
    _assign_workflow(record)
    refresh_workspace_modules(record)


def _refresh_recovery_truth(record: CaseRecord) -> None:
    truth = dict(record.extracted_case_data.recovery_truth or {})
    if str(record.issue_category or "").strip().lower() != "invoice_recovery_matter":
        record.extracted_case_data.recovery_truth = truth
        refresh_workspace_modules(record)
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
    refresh_workspace_modules(record)


def _actor_label(context) -> str:
    user = getattr(context, "user", None)
    if not user:
        return "Workspace operator"
    name = " ".join(item for item in [getattr(user, "first_name", ""), getattr(user, "last_name", "")] if item).strip()
    if name:
        return name
    return getattr(user, "email", None) or "Workspace operator"


@router.get("/cases")
def get_cases(limit: int = 20, include_internal: bool = False) -> list[dict[str, object]]:
    summaries: list[dict[str, object]] = []
    for record in list_cases(limit=limit, workspace_id=default_workspace_id(), include_internal=include_internal):
        synchronize_case_status(record)
        save_case(record)
        summaries.append(_case_summary(record))
    return summaries


@router.post("/cases")
def create_case(payload: CaseCreateRequest, request: Request) -> CaseRecord:
    auth_service.require_case_creation_access(request)
    case_id = f"case_{uuid4().hex[:10]}"
    record = CaseRecord(
        id=case_id,
        workspace_id=default_workspace_id(),
        created_by_user_id=auth_service.current_user_id() or "system",
        reference=(payload.reference or "").strip() or None,
        title=(payload.matter_name or "").strip() or None,
        notes=[payload.notes.strip()] if payload.notes else [],
        intake_channel="web",
        current_stage=WorkflowStage.DRAFT.value,
        action_packet_status="not_built",
    )
    if payload.plaintiff_name:
        record.extracted_case_data.plaintiff = PartyDetails(
            party_name=payload.plaintiff_name.strip(),
            party_role=PartyRole.PLAINTIFF,
        )
    if payload.defendant_name:
        record.extracted_case_data.defendant_entity = PartyDetails(
            party_name=payload.defendant_name.strip(),
            party_role=PartyRole.DEFENDANT_ENTITY,
        )
    record.status = CaseStatus.DRAFT.value
    save_case(record)
    record_case_event(
        case_id,
        "case.created",
        {
            "reference": record.reference,
            "title": record.title,
            "plaintiff_name": record.extracted_case_data.plaintiff.party_name,
            "defendant_name": record.extracted_case_data.defendant_entity.party_name,
        },
    )
    return record


@router.get("/cases/{case_id}")
def get_case(case_id: str) -> CaseRecord:
    record = _load_case_or_404(case_id)
    if active_source_files(record) and not record.issue_category:
        _refresh_workflow_state(record)
    elif record.deadline_overrides:
        record.deadlines = merge_deadlines_with_overrides(record, list(record.deadlines or []))
    _refresh_recovery_truth(record)
    synchronize_case_status(record)
    save_case(record)
    return record


@router.delete("/cases/{case_id}")
def delete_case(case_id: str, hard: bool = True) -> dict[str, object]:
    record = _load_case_or_404(case_id)

    case_root = ensure_case_dirs(case_id)["case_root"]
    summary = _case_summary(record)
    if hard:
        shutil.rmtree(case_root, ignore_errors=False)
        return {"ok": True, "case_id": case_id, "hard_deleted": True, "summary": summary}

    record.deleted_at = datetime.now(timezone.utc)
    save_case(record)
    record_case_event(case_id, "case.deleted", {"hard_deleted": False})
    return {"ok": True, "case_id": case_id, "hard_deleted": False, "summary": summary}


@router.post("/cases/bulk-delete")
def bulk_delete_cases(payload: BulkCaseDeleteRequest) -> dict[str, object]:
    targets = payload.case_ids
    if payload.delete_all:
        targets = [item.id for item in list_cases(limit=5000, workspace_id=default_workspace_id(), include_internal=False)]
    targets = [item for item in list(dict.fromkeys(targets or [])) if item]
    if not targets:
        return {"ok": True, "deleted_case_ids": [], "deleted_count": 0}

    deleted: list[str] = []
    for case_id in targets:
        try:
            delete_case(case_id, hard=payload.hard)
            deleted.append(case_id)
        except HTTPException:
            continue
    return {"ok": True, "deleted_case_ids": deleted, "deleted_count": len(deleted), "delete_all": bool(payload.delete_all)}


@router.get("/cases/{case_id}/activity")
def get_case_activity(case_id: str, limit: int = 80) -> dict[str, object]:
    try:
        load_case(case_id)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return {"case_id": case_id, "events": load_case_events(case_id, limit=limit)}


@router.get("/cases/{case_id}/communications")
def get_case_communications(case_id: str, limit: int = 60) -> dict[str, object]:
    record = _load_case_or_404(case_id)
    refresh_workspace_modules(record)
    save_case(record)
    entries = list(record.communications_log or [])[:limit]
    modules = (record.workflow_payload or {}).get("recovery_workspace_modules") or {}
    communications = modules.get("communications_log") or {}
    return {
        "case_id": case_id,
        "entries": [item.model_dump(mode="json") for item in entries],
        "last_touch": communications.get("last_touch"),
    }


@router.post("/cases/{case_id}/communications")
def add_case_communication(case_id: str, payload: CommunicationLogRequest, request: Request) -> dict[str, object]:
    record = _load_case_or_404(case_id)
    context = auth_service.require_session(request)
    entry = append_communication_log(
        record,
        entry_type=payload.entry_type,
        channel=payload.channel,
        direction=payload.direction,
        summary=payload.summary,
        body=payload.body,
        actor_user_id=context.user.id,
        actor_label=_actor_label(context),
    )
    refresh_workspace_modules(record)
    save_case(record)
    record_case_event(case_id, "communications.note.saved", {"entry_type": entry.entry_type, "channel": entry.channel})
    return {"case_id": case_id, "entry": entry.model_dump(mode="json")}


@router.get("/cases/{case_id}/settlement-tracker")
def get_case_settlement_tracker(case_id: str) -> dict[str, object]:
    record = _load_case_or_404(case_id)
    refresh_workspace_modules(record)
    save_case(record)
    return {
        "case_id": case_id,
        "entries": [item.model_dump(mode="json") for item in (record.settlement_tracker or [])],
    }


@router.post("/cases/{case_id}/settlement-tracker")
def save_case_settlement_tracker(case_id: str, payload: SettlementTrackerRequest, request: Request) -> dict[str, object]:
    record = _load_case_or_404(case_id)
    context = auth_service.require_session(request)
    entry = upsert_settlement_tracker_entry(
        record,
        entry_id=payload.entry_id,
        proposal_type=payload.proposal_type,
        status=payload.status,
        title=payload.title,
        summary=payload.summary,
        term_summary=payload.term_summary,
        proposed_amount=payload.proposed_amount,
        proposed_payment_count=payload.proposed_payment_count,
        proposed_first_payment_date=payload.proposed_first_payment_date,
        linked_route_status=payload.linked_route_status,
        reason_codes=payload.reason_codes,
        actor_user_id=context.user.id,
        actor_label=_actor_label(context),
    )
    refresh_workspace_modules(record)
    save_case(record)
    record_case_event(case_id, "settlement.tracker.saved", {"entry_id": entry.id, "status": entry.status, "proposal_type": entry.proposal_type})
    if entry.proposal_type == "payment_plan":
        record_usage_event(
            record.workspace_id or "workspace_legacy",
            "payment_plan_created",
            case_id=case_id,
            actor_user_id=context.user.id,
            payload={"entry_id": entry.id, "status": entry.status},
        )
    if entry.proposal_type == "settlement_offer":
        record_usage_event(
            record.workspace_id or "workspace_legacy",
            "settlement_proposed",
            case_id=case_id,
            actor_user_id=context.user.id,
            payload={"entry_id": entry.id, "status": entry.status},
        )
    return {"case_id": case_id, "entry": entry.model_dump(mode="json")}



@router.post("/cases/{case_id}/process")
def process_case(case_id: str) -> CaseRecord:
    record = _load_case_or_404(case_id)

    active_sources = active_source_files(record)
    if not active_sources:
        record_usage_event(
            record.workspace_id or "workspace_legacy",
            "extraction_blocked",
            case_id=case_id,
            payload={"reason": "no_source_files"},
        )
        raise HTTPException(status_code=400, detail={"message": "At least one active source file is required before processing.", "outcome": "no_source_files"})

    preprocess_warnings: list[str] = []
    try:
        for item in active_sources:
            path = Path(item.storage_path)
            if not path.exists():
                item.warnings.append("Stored source file is missing from disk.")
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
            preprocess_warnings.extend(item.warnings)

        for item in record.template_files:
            path = Path(item.storage_path)
            if not path.exists():
                item.warnings.append("Stored template file is missing from disk.")
                continue
            if path.suffix.lower() == ".docx" and not item.extracted_text:
                item.extracted_text = extract_docx_text(path)

        record.packet_generation = None
        record.generation_progress = None
        record.extracted_case_data = extract_case_data(record)
        record.jurisdiction_analysis = analyze_case_jurisdiction(record)
        _refresh_workflow_state(record)
        _refresh_recovery_truth(record)
        record.status = determine_case_status(record)
        synchronize_case_status(record)
        save_case(record)

    except HTTPException:
        raise
    except Exception as exc:
        reset_processing_state(record, preserve_parties=False)
        record.notes = list(dict.fromkeys([*(record.notes or []), f"processing_error:{exc}"]))
        record.extracted_case_data.warnings = list(dict.fromkeys([*(record.extracted_case_data.warnings or []), "Processing failed before a canonical snapshot could be created.", *preprocess_warnings]))
        record.status = "blocked"
        save_case(record)
        raise HTTPException(
            status_code=503,
            detail={
                "message": "Processing failed before a canonical snapshot could be created.",
                "outcome": "operational_error",
                "blockers": [
                    "Processing failed before a canonical snapshot could be created.",
                    "Review FastAPI logs and storage/template initialization before retrying.",
                ],
                "warnings": preprocess_warnings,
                "client_snapshot": build_client_snapshot(record).model_dump(mode="json"),
            },
        ) from exc

    extraction = record.extracted_case_data
    structured_blockers = list(dict.fromkeys([
        *list(extraction.matter_consistency.blockers or []),
        *list(extraction.amount_reconciliation.blockers or []),
    ]))
    if extraction.matter_consistency.blockers:
        record_case_event(case_id, "matter.consistency.failed", {"blockers": extraction.matter_consistency.blockers})
    if extraction.amount_reconciliation.blockers:
        record_case_event(case_id, "amount.reconciliation.mismatch", {"blockers": extraction.amount_reconciliation.blockers})
    if structured_blockers:
        record_usage_event(
            record.workspace_id or "workspace_legacy",
            "extraction_blocked",
            case_id=case_id,
            payload={"blocker_count": len(structured_blockers), "blockers": structured_blockers[:6]},
        )
    ambiguous_rows = [row.invoice_number or row.source_filename or "row" for row in extraction.invoice_summary.line_items if row.parse_confidence < 0.95]
    if ambiguous_rows:
        record_case_event(case_id, "numeric_parse.ambiguous", {"rows": ambiguous_rows})
    record_case_event(
        case_id,
        "case.processed",
        {
            "status": str(record.status),
            "active_source_file_count": len(active_source_files(record)),
            "template_file_count": len(record.template_files),
            "blocker_count": len(record.extracted_case_data.missing_required_facts),
            "sunbiz_triggered": False,
        },
    )

    return record


@router.post("/cases/{case_id}/classify")
def classify_case(case_id: str) -> dict[str, object]:
    record = _load_case_or_404(case_id)
    _refresh_workflow_state(record)
    save_case(record)
    return {
        "case_id": case_id,
        "issue_category": record.issue_category,
        "workflow_slug": record.workflow_slug,
        "recommended_paths": record.recommended_paths,
    }


@router.get("/cases/{case_id}/deadlines")
def get_case_deadlines(case_id: str) -> dict[str, object]:
    record = _load_case_or_404(case_id)
    record.deadlines = merge_deadlines_with_overrides(record, list(record.deadlines or []))
    refresh_workspace_modules(record)
    save_case(record)
    return {
        "case_id": case_id,
        "deadlines": [item.model_dump(mode="json") for item in (record.deadlines or [])],
        "overrides": [item.model_dump(mode="json") for item in (record.deadline_overrides or [])],
    }


@router.post("/cases/{case_id}/deadlines/override")
def override_case_deadline(case_id: str, payload: DeadlineOverrideRequest, request: Request) -> dict[str, object]:
    record = _load_case_or_404(case_id)
    context = auth_service.require_session(request)
    entry = apply_deadline_override(
        record,
        deadline_type=payload.deadline_type or "deadline",
        label=payload.label,
        date=payload.date,
        reason=payload.reason,
        actor_user_id=context.user.id,
        actor_label=_actor_label(context),
    )
    record.deadlines = merge_deadlines_with_overrides(record, extract_case_deadlines(record))
    refresh_workspace_modules(record)
    save_case(record)
    record_case_event(case_id, "deadline.override.saved", {"label": entry.label, "date": entry.date, "actor": entry.actor_label})
    return {
        "case_id": case_id,
        "override": entry.model_dump(mode="json"),
        "deadlines": [item.model_dump(mode="json") for item in (record.deadlines or [])],
    }


@router.post("/cases/{case_id}/route")
def route_case(case_id: str, payload: CaseRouteRequest) -> dict[str, object]:
    record = _load_case_or_404(case_id)
    if payload.path:
        record.workflow_slug = payload.path
        record.current_stage = WorkflowStage.ROUTE_READY.value
        save_case(record)
    return {
        "case_id": case_id,
        "workflow_slug": record.workflow_slug,
        "current_stage": record.current_stage,
    }


@router.post("/cases/{case_id}/action-packet")
def build_case_action_packet(case_id: str, request: Request) -> dict[str, object]:
    record = _load_case_or_404(case_id)
    context = auth_service.require_session(request)
    packet = build_action_packet(record)
    record.action_packet_status = "ready"
    record.action_packet_outputs = [ActionPacketOutput.model_validate(item) for item in (packet.get("outputs") or [])]
    record.current_stage = WorkflowStage.PACKET_READY.value
    refresh_workspace_modules(record)
    save_case(record)
    record_usage_event(
        record.workspace_id or "workspace_legacy",
        "readiness_viewed",
        case_id=case_id,
        actor_user_id=context.user.id,
        payload={"route_status": packet.get("route_status"), "reason_codes": packet.get("route_reason_codes") or []},
    )
    output_labels = " ".join(str(item.label or item.type or "") for item in record.action_packet_outputs)
    if "Demand" in output_labels:
        record_usage_event(
            record.workspace_id or "workspace_legacy",
            "demand_pack_created",
            case_id=case_id,
            actor_user_id=context.user.id,
            payload={"route_status": packet.get("route_status")},
        )
    if "Counsel Handoff" in output_labels:
        record_usage_event(
            record.workspace_id or "workspace_legacy",
            "counsel_handoff_created",
            case_id=case_id,
            actor_user_id=context.user.id,
            payload={"route_status": packet.get("route_status")},
        )
    return packet


@router.get("/cases/{case_id}/official-contacts")
def get_case_official_contacts(case_id: str) -> dict[str, object]:
    record = _load_case_or_404(case_id)
    return {"case_id": case_id, "contacts": [item.model_dump(mode="json") for item in (record.official_contacts or [])]}


@router.post("/cases/{case_id}/stage")
def update_case_stage(case_id: str, payload: CaseStageRequest) -> dict[str, object]:
    record = _load_case_or_404(case_id)
    if payload.stage:
        record.current_stage = payload.stage.strip()
        refresh_workspace_modules(record)
        save_case(record)
    return {"case_id": case_id, "current_stage": record.current_stage}


@router.patch("/cases/{case_id}/review")
def review_case(case_id: str, payload: CaseReviewRequest) -> CaseRecord:
    try:
        record = load_case(case_id)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    extraction = record.extracted_case_data
    if payload.plaintiff_name is not None:
        extraction.plaintiff.party_name = payload.plaintiff_name or None
    if payload.defendant_name is not None:
        extraction.defendant_entity.party_name = payload.defendant_name or None
    if payload.guarantor_name is not None:
        if payload.guarantor_name:
            extraction.personal_guarantor = extraction.personal_guarantor or PartyDetails(party_role=PartyRole.PERSONAL_GUARANTOR)
            extraction.personal_guarantor.party_name = payload.guarantor_name
        else:
            extraction.personal_guarantor = None
    if payload.service_address is not None:
        extraction.service_address = payload.service_address or None
    if payload.business_address is not None:
        extraction.business_address = payload.business_address or None
    if payload.venue_county is not None:
        extraction.venue.venue_county = payload.venue_county or None
    if payload.venue_clause is not None:
        extraction.venue.venue_clause = payload.venue_clause or None
    if payload.venue_paragraph is not None:
        extraction.venue.venue_paragraph = payload.venue_paragraph or None
    if payload.governing_law is not None:
        extraction.governing_law = payload.governing_law or None
    if payload.payment_terms is not None:
        extraction.payment_terms = payload.payment_terms or None
    if payload.default_terms is not None:
        extraction.default_terms = payload.default_terms or None
    if payload.interest_terms is not None:
        extraction.interest_terms = payload.interest_terms or None
    if payload.amount_in_controversy is not None:
        try:
            amount = Decimal(str(payload.amount_in_controversy).replace("$", "").replace(",", "").strip())
            extraction.amount_in_controversy = amount
            extraction.amount_reconciliation.approved_total = amount
            extraction.amount_reconciliation.approved_reconciled_total = amount
            extraction.amount_reconciliation.case_summary_total = amount
            extraction.amount_reconciliation.review_approved = True
            extraction.amount_reconciliation.status = "manual_override"
            extraction.amount_reconciliation.blockers = []
        except Exception:
            pass

    extraction.separate_summons_required = bool(extraction.personal_guarantor and extraction.personal_guarantor.party_name)
    extraction.missing_required_facts = [
        field
        for field in extraction.missing_required_facts
        if field not in {
            "plaintiff.party_name",
            "defendant_entity.party_name",
            "venue.venue_county",
            "amount_in_controversy",
        }
    ]
    if not extraction.plaintiff.party_name:
        extraction.missing_required_facts.append("plaintiff.party_name")
    if not extraction.defendant_entity.party_name:
        extraction.missing_required_facts.append("defendant_entity.party_name")
    if not extraction.venue.venue_county:
        extraction.missing_required_facts.append("venue.venue_county")
    if extraction.amount_in_controversy <= 0:
        extraction.missing_required_facts.append("amount_in_controversy")
    _recompute_court(record)

    record.packet_generation = None
    record.generation_progress = None
    record.jurisdiction_analysis = analyze_case_jurisdiction(record)
    _refresh_workflow_state(record)
    _refresh_recovery_truth(record)
    record.status = determine_case_status(record)
    synchronize_case_status(record)
    save_case(record)
    record_case_event(
        case_id,
        "case.review.saved",
        {
            "status": str(record.status),
            "venue_county": record.extracted_case_data.venue.venue_county,
            "amount_in_controversy": str(record.extracted_case_data.amount_reconciliation.case_summary_total or record.extracted_case_data.amount_in_controversy),
        },
    )
    return record


def _copy_matching_pdf(item: StoredFile, child_case_id: str) -> StoredFile:
    dirs = ensure_case_dirs(child_case_id)
    source = Path(item.storage_path)
    token = uuid4().hex[:12]
    safe_name = source.name
    destination = dirs["source_dir"] / f"{token}_{safe_name}"
    shutil.copy2(source, destination)
    return StoredFile(
        id=token,
        filename=destination.name,
        original_filename=item.original_filename,
        workspace_id=item.workspace_id,
        matter_id=child_case_id,
        content_type=item.content_type,
        file_type=item.file_type,
        storage_path=str(destination),
        size_bytes=item.size_bytes,
        extraction_version=item.extraction_version,
        extracted_text=item.extracted_text,
        parsed_payload=item.parsed_payload,
        warnings=list(item.warnings),
        sha256=item.sha256,
    )


def _write_filtered_workbook(item: StoredFile, child_case_id: str, debtor_name: str) -> StoredFile | None:
    if not item.parsed_payload or not isinstance(item.parsed_payload, dict):
        return None
    matching_rows = [row for row in item.parsed_payload.get("line_items", []) if entity_key(row.get("company") or row.get("customer_name")) == entity_key(debtor_name)]
    if not matching_rows:
        return None

    dirs = ensure_case_dirs(child_case_id)
    token = uuid4().hex[:12]
    destination = dirs["source_dir"] / f"{token}_{Path(item.original_filename).stem}_{entity_key(debtor_name).replace(' ', '_')}.xlsx"

    workbook = Workbook()
    ws = workbook.active
    ws.title = "Sheet1"
    headers = ["Organization", "Company", "Owner Name", "Company Number", "Company Email", "Company Address", "Invoice Date", "Invoice Number", "Remaining Amount", "County"]
    ws.append(headers)
    for row in matching_rows:
        ws.append([
            row.get("organization"),
            row.get("company"),
            row.get("owner_name"),
            row.get("company_number"),
            row.get("company_email"),
            row.get("company_address"),
            row.get("invoice_date"),
            row.get("invoice_number"),
            row.get("raw_balance_due_text") or row.get("balance_due"),
            row.get("county"),
        ])
    workbook.save(destination)
    payload = parse_invoice_workbook(destination)
    return StoredFile(
        id=token,
        filename=destination.name,
        original_filename=destination.name,
        workspace_id=default_workspace_id(),
        matter_id=child_case_id,
        content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        file_type=FileType.INVOICE_EXCEL,
        storage_path=str(destination),
        size_bytes=destination.stat().st_size,
        extraction_version=0,
        extracted_text=None,
        parsed_payload=payload,
        warnings=list(payload.get("warnings", [])),
    )


@router.post("/cases/{case_id}/split-by-debtor")
def split_case_by_debtor(case_id: str) -> dict[str, object]:
    try:
        record = load_case(case_id)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    report, _ = analyze_case_sources(record)
    debtors = report.detected_debtor_entities
    if len(debtors) <= 1:
        raise HTTPException(status_code=400, detail="No multi-debtor upload was detected for this case.")

    created: list[dict[str, str]] = []
    for debtor_name in debtors:
        child_case_id = f"case_{uuid4().hex[:10]}"
        child = CaseRecord(
            id=child_case_id,
            workspace_id=record.workspace_id,
            created_by_user_id=auth_service.current_user_id() or record.created_by_user_id or "system",
            reference=record.reference,
            title=((record.title or record.reference or record.id) + " - " + debtor_name)[:160],
        )
        if report.anchor_plaintiff_name:
            child.extracted_case_data.plaintiff = PartyDetails(party_name=report.anchor_plaintiff_name, party_role=PartyRole.PLAINTIFF)
        child.extracted_case_data.defendant_entity = PartyDetails(party_name=debtor_name, party_role=PartyRole.DEFENDANT_ENTITY)

        for item in active_source_files(record):
            if source_kind_from_item(item) in {"invoice_excel", "invoice_csv"}:
                filtered = _write_filtered_workbook(item, child_case_id, debtor_name)
                if filtered:
                    child.source_files.append(filtered)
                continue
            text = item.extracted_text or ""
            temp_case = CaseRecord(id="tmp")
            temp_case.source_files = [item]
            extracted = extract_case_data(temp_case)
            if entity_key(debtor_name) and entity_key(debtor_name) == entity_key(extracted.defendant_entity.party_name):
                child.source_files.append(_copy_matching_pdf(item, child_case_id))

        reset_processing_state(child)
        save_case(child)
        created.append({"case_id": child_case_id, "debtor_name": debtor_name})

    record_case_event(case_id, "case.split_by_debtor", {"created_cases": created})
    return {"case_id": case_id, "created_cases": created}
