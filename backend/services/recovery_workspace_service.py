from __future__ import annotations

from datetime import datetime, timezone
from decimal import Decimal
from uuid import uuid4

from backend.models.case_schema import (
    CaseRecord,
    CommunicationLogEntry,
    DeadlineItem,
    DeadlineOverrideRecord,
    PacketArchiveEntry,
    SettlementTrackerEntry,
)
from backend.services.case_state import active_source_files

COURT_FACING_DOCUMENT_TYPES = {
    "complaint",
    "civil_cover_sheet",
    "request_for_issuance_of_summons",
    "summons_company",
    "summons_individual",
    "motion_for_clerks_default",
    "proposed_final_judgment",
    "affidavit_of_amount_due",
    "exhibit_index",
}


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _dedupe(values: list[object]) -> list[str]:
    results: list[str] = []
    seen: set[str] = set()
    for value in values:
        text = " ".join(str(value or "").split()).strip()
        if not text or text in seen:
            continue
        seen.add(text)
        results.append(text)
    return results


def _decimal_text(value: object | None) -> str:
    try:
        amount = Decimal(str(value or "0").replace(",", "").replace("$", "").strip())
    except Exception:
        amount = Decimal("0.00")
    return f"{amount:.2f}"


def _file_amount_hint(source) -> str | None:
    evidence = source.normalized_evidence or {}
    amounts = evidence.get("amounts") or []
    if amounts:
        first = amounts[0]
        if isinstance(first, dict):
            return first.get("value") or first.get("amount") or None
        return str(first)

    payload = source.parsed_payload or {}
    for key in [
        "total_balance_due",
        "approved_total",
        "source_spreadsheet_total",
        "invoice_pdf_total",
        "supported_balance",
        "balance_due",
    ]:
        value = payload.get(key)
        if value not in (None, "", []):
            return str(value)
    return None


def merge_deadlines_with_overrides(record: CaseRecord, detected_deadlines: list[DeadlineItem] | None = None) -> list[DeadlineItem]:
    items = list(detected_deadlines or [])
    seen: set[tuple[str, str | None, str, str]] = set()
    merged: list[DeadlineItem] = []

    def add(item: DeadlineItem) -> None:
        key = (str(item.type or "deadline"), item.date, str(item.label or ""), str(item.source_kind or "detected"))
        if key in seen:
            return
        seen.add(key)
        merged.append(item)

    for item in items:
        add(item)

    for override in record.deadline_overrides or []:
        add(
            DeadlineItem(
                type=override.deadline_type or "deadline",
                label=override.label,
                date=override.date,
                urgency="high" if override.date else "medium",
                confidence=1.0,
                source_excerpt=override.reason,
                source_file="Manual override",
                source_kind="manual_override",
                override_reason=override.reason,
                actor_label=override.actor_label,
                created_at=override.created_at,
            )
        )

    merged.sort(key=lambda item: (0 if item.date else 1, item.date or "", item.label or ""))
    return merged[:12]


def append_communication_log(
    record: CaseRecord,
    *,
    entry_type: str,
    channel: str,
    direction: str,
    summary: str,
    body: str | None = None,
    actor_user_id: str | None = None,
    actor_label: str | None = None,
    related_packet_version: int | None = None,
    metadata: dict[str, object] | None = None,
) -> CommunicationLogEntry:
    entry = CommunicationLogEntry(
        id=uuid4().hex[:12],
        entry_type=entry_type,
        channel=channel,
        direction=direction,
        summary=summary,
        body=body,
        actor_user_id=actor_user_id,
        actor_label=actor_label,
        related_packet_version=related_packet_version,
        metadata=dict(metadata or {}),
    )
    record.communications_log.append(entry)
    record.communications_log = sorted(record.communications_log, key=lambda item: item.created_at, reverse=True)[:60]
    return entry


def upsert_settlement_tracker_entry(
    record: CaseRecord,
    *,
    entry_id: str | None = None,
    proposal_type: str,
    status: str,
    title: str | None = None,
    summary: str | None = None,
    term_summary: str | None = None,
    proposed_amount: object | None = None,
    proposed_payment_count: int | None = None,
    proposed_first_payment_date: str | None = None,
    linked_route_status: str | None = None,
    reason_codes: list[str] | None = None,
    actor_user_id: str | None = None,
    actor_label: str | None = None,
) -> SettlementTrackerEntry:
    existing = next((item for item in record.settlement_tracker if item.id == entry_id), None) if entry_id else None
    if existing is None:
        existing = SettlementTrackerEntry(
            id=entry_id or uuid4().hex[:12],
            proposal_type=proposal_type,
            status=status,
            actor_user_id=actor_user_id,
            actor_label=actor_label,
        )
        record.settlement_tracker.append(existing)

    existing.proposal_type = proposal_type or existing.proposal_type
    existing.status = status or existing.status
    existing.title = title if title is not None else existing.title
    existing.summary = summary if summary is not None else existing.summary
    existing.term_summary = term_summary if term_summary is not None else existing.term_summary
    existing.proposed_payment_count = proposed_payment_count if proposed_payment_count is not None else existing.proposed_payment_count
    existing.proposed_first_payment_date = (
        proposed_first_payment_date if proposed_first_payment_date is not None else existing.proposed_first_payment_date
    )
    existing.linked_route_status = linked_route_status if linked_route_status is not None else existing.linked_route_status
    existing.reason_codes = list(reason_codes or existing.reason_codes or [])
    existing.actor_user_id = actor_user_id or existing.actor_user_id
    existing.actor_label = actor_label or existing.actor_label
    if proposed_amount not in (None, ""):
        try:
            existing.proposed_amount = Decimal(str(proposed_amount).replace("$", "").replace(",", "").strip())
        except Exception:
            pass
    existing.updated_at = _utcnow()
    record.settlement_tracker = sorted(record.settlement_tracker, key=lambda item: item.updated_at, reverse=True)
    return existing


def apply_deadline_override(
    record: CaseRecord,
    *,
    deadline_type: str,
    label: str,
    date: str | None,
    reason: str | None,
    actor_user_id: str | None = None,
    actor_label: str | None = None,
) -> DeadlineOverrideRecord:
    entry = DeadlineOverrideRecord(
        id=uuid4().hex[:12],
        deadline_type=deadline_type or "deadline",
        label=label,
        date=date,
        reason=reason,
        actor_user_id=actor_user_id,
        actor_label=actor_label,
    )
    record.deadline_overrides.append(entry)
    record.deadline_overrides = sorted(record.deadline_overrides, key=lambda item: item.created_at, reverse=True)[:24]
    return entry


def next_packet_version(record: CaseRecord) -> int:
    versions = [int(item.version_number or 0) for item in (record.packet_archive or [])]
    if record.packet_generation and record.packet_generation.version_number:
        versions.append(int(record.packet_generation.version_number))
    return max(versions or [0]) + 1


def archive_packet_generation(record: CaseRecord) -> PacketArchiveEntry | None:
    packet = record.packet_generation
    if not packet:
        return None

    version_number = next_packet_version(record)
    generated_types = [doc.document_type for doc in (packet.documents or []) if str(doc.status or "").lower() == "generated"]
    selected_types = list(packet.selected_document_types or [])
    is_court_draft = bool(set(selected_types or generated_types) & COURT_FACING_DOCUMENT_TYPES)
    warning_count = len(packet.warnings or [])
    qa_status = packet.generation_qa_status or ("completed_with_warnings" if warning_count else "ready_for_review")
    entry = PacketArchiveEntry(
        id=uuid4().hex[:12],
        version_number=version_number,
        generation_qa_status=qa_status,
        release_state=packet.release_state or "ready_for_review",
        review_required=bool(packet.review_required or is_court_draft),
        is_court_draft=is_court_draft,
        selected_document_types=selected_types,
        document_types=generated_types,
        document_count=len(generated_types),
        zip_path=packet.zip_path,
        zip_download_url=packet.download_url,
        warning_count=warning_count,
        summary=packet.summary,
    )
    record.packet_archive.append(entry)
    record.packet_archive = sorted(record.packet_archive, key=lambda item: item.version_number, reverse=True)
    packet.version_number = entry.version_number
    packet.generation_qa_status = entry.generation_qa_status
    packet.release_state = entry.release_state
    packet.review_required = entry.review_required
    packet.is_court_draft = entry.is_court_draft
    packet.archive_entry_id = entry.id
    return entry


def set_packet_release_state(
    record: CaseRecord,
    *,
    archive_entry_id: str,
    release_state: str,
    reviewer_user_id: str | None = None,
    reviewer_label: str | None = None,
) -> PacketArchiveEntry:
    entry = next((item for item in record.packet_archive if item.id == archive_entry_id), None)
    if entry is None:
        raise FileNotFoundError(f"Packet archive entry '{archive_entry_id}' was not found.")
    entry.release_state = release_state
    entry.updated_at = _utcnow()
    entry.reviewed_by_user_id = reviewer_user_id
    entry.reviewed_by_label = reviewer_label
    if record.packet_generation and record.packet_generation.archive_entry_id == archive_entry_id:
        record.packet_generation.release_state = release_state
    return entry


def _last_touch_summary(record: CaseRecord) -> dict[str, object] | None:
    latest = (record.communications_log or [None])[0]
    if not latest:
        return None
    return {
        "summary": latest.summary,
        "entry_type": latest.entry_type,
        "channel": latest.channel,
        "actor_label": latest.actor_label,
        "created_at": latest.created_at,
    }


def build_reconciliation_center(record: CaseRecord) -> dict[str, object]:
    extraction = record.extracted_case_data
    reconciliation = extraction.amount_reconciliation
    consistency = extraction.matter_consistency
    invoice_summary = extraction.invoice_summary
    route = extraction.recovery_truth or {}
    active_files = active_source_files(record) or list(record.source_files or [])

    source_balances = []
    for source in active_files:
        source_balances.append(
            {
                "file_name": source.original_filename,
                "file_type": str(source.file_type or "unknown"),
                "scope": "excluded" if source.excluded_from_active_matter else "active",
                "extraction_status": source.extraction_status,
                "quality_score": source.extraction_quality_score,
                "balance_hint": _file_amount_hint(source),
                "warnings": list(source.warnings or []),
            }
        )

    invoice_count = int(invoice_summary.invoice_count or 0)
    matched_invoice_count = int(reconciliation.used_invoice_count or 0)
    unmatched_invoice_count = max(invoice_count - matched_invoice_count, 0) + int(reconciliation.excluded_low_confidence_rows or 0)
    evidence_gaps = _dedupe(
        list(extraction.missing_required_facts or [])
        + list(consistency.blockers or [])
        + list(reconciliation.blockers or [])
        + list(route.get("missing_evidence") or [])
    )

    return {
        "supported_balance": _decimal_text(reconciliation.approved_reconciled_total or reconciliation.approved_total),
        "unsupported_balance": _decimal_text((reconciliation.source_spreadsheet_total or reconciliation.spreadsheet_total or 0) - (reconciliation.approved_reconciled_total or reconciliation.approved_total or 0)),
        "invoice_count": invoice_count,
        "matched_invoice_count": matched_invoice_count,
        "unmatched_invoice_count": unmatched_invoice_count,
        "debtor_count": len(consistency.detected_debtor_entities or []),
        "debtor_conflicts": [
            {
                "source_file": item.source_filename,
                "conflict_type": item.conflict_type,
                "entities": list(item.entities or []),
            }
            for item in (consistency.conflicts or [])
        ],
        "guarantor_present": bool(extraction.personal_guarantor and extraction.personal_guarantor.party_name),
        "guarantor_status": (
            extraction.personal_guarantor.party_name
            if extraction.personal_guarantor and extraction.personal_guarantor.party_name
            else "No guarantor extracted"
        ),
        "evidence_gaps": evidence_gaps,
        "source_balances_by_file": source_balances,
        "route_reason_codes": list(route.get("route_reason_codes") or route.get("reason_codes") or []),
    }


def refresh_workspace_modules(record: CaseRecord) -> CaseRecord:
    payload = dict(record.workflow_payload or {})
    settlement_latest = (record.settlement_tracker or [None])[0]
    packet_latest = (record.packet_archive or [None])[0]
    payload["recovery_workspace_modules"] = {
        "reconciliation_center": build_reconciliation_center(record),
        "communications_log": {
            "count": len(record.communications_log or []),
            "last_touch": _last_touch_summary(record),
        },
        "settlement_tracker": {
            "count": len(record.settlement_tracker or []),
            "latest": settlement_latest.model_dump(mode="json") if settlement_latest else None,
        },
        "deadline_engine": {
            "deadline_count": len(record.deadlines or []),
            "override_count": len(record.deadline_overrides or []),
        },
        "packet_archive": {
            "version_count": len(record.packet_archive or []),
            "latest": packet_latest.model_dump(mode="json") if packet_latest else None,
        },
        "portal_access": record.portal_access.model_dump(mode="json"),
    }
    record.workflow_payload = payload
    return record
