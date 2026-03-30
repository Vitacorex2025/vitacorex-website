
from __future__ import annotations

from decimal import Decimal

from backend.models.case_schema import CanonicalCaseSnapshot, CaseRecord
from backend.services.audit_service import load_case_events
from backend.services.case_state import active_source_files, case_summary_total
from backend.services.recovery_routing_engine import determine_recovery_route
from backend.services.validation_service import assess_packet_readiness, collect_case_warnings


def sunbiz_state(record: CaseRecord) -> str:
    result = record.sunbiz_lookup
    if not result or not result.looked_up_at:
        return "not_run"
    classification = str(result.result_classification or result.provider_status or "").lower()
    if classification == "verified_match":
        return "verified_florida_match"
    if classification in {"no_match", "no_official_match_found"}:
        return "no_florida_match_found"
    if classification in {"unavailable", "provider_unavailable", "provider_unavailable_or_not_implemented"}:
        return "provider_unavailable"
    return "not_run"


def _blocked_next_action(record: CaseRecord, blockers: list[str]) -> str:
    consistency = record.extracted_case_data.matter_consistency
    blocker_text = " ".join(blockers).lower()
    if (
        consistency
        and consistency.blockers
        and (
            "multiple debtor" in blocker_text
            or "multiple unrelated plaintiff" in blocker_text
            or "single-matter source set" in blocker_text
            or "matter consistency" in blocker_text
        )
    ):
        return "Split the uploaded stack into child matters, then re-process each clean debtor matter separately."
    if record.extracted_case_data.amount_reconciliation.blockers:
        return "Review the reconciliation mismatch or exclude unrelated files before generation."
    if "source set" in blocker_text:
        return "Exclude unrelated files and re-run processing until one approved source set remains."
    return "Resolve blockers before generation."


def build_client_snapshot(record: CaseRecord) -> CanonicalCaseSnapshot:
    extraction = record.extracted_case_data
    active_files = active_source_files(record)
    active_count = len(active_files)
    source_set = list(extraction.source_set_used or (extraction.matter_consistency.source_set_used if extraction.matter_consistency else []) or [])
    source_set_count = len(source_set)
    processed = bool(extraction.processed_at and active_count > 0)
    verification_state = sunbiz_state(record)
    readiness = assess_packet_readiness(record)
    recovery_route = determine_recovery_route(record) if str(record.issue_category or "").strip().lower() == "invoice_recovery_matter" else None

    draft_amount = Decimal(str(extraction.amount_in_controversy or "0"))
    extracted_amount = Decimal(str(extraction.amount_reconciliation.case_summary_total or extraction.amount_reconciliation.approved_total or extraction.amount_in_controversy or "0"))
    approved_amount = Decimal(str(case_summary_total(record) or "0")) if processed else Decimal("0.00")

    generated_docs = [
        doc for doc in (record.packet_generation.documents if record.packet_generation else [])
        if str(doc.status or "").lower() == "generated"
    ]
    stale_generation = bool(
        generated_docs and (
            active_count == 0
            or not processed
            or readiness.blockers
            or (recovery_route and not recovery_route.get("generation_allowed"))
        )
    )
    if stale_generation:
        readiness.blockers = list(dict.fromkeys([*readiness.blockers, "A stale generation snapshot exists but is no longer valid for the current source stack."]))

    warnings = list(dict.fromkeys([*(readiness.warnings or []), *collect_case_warnings(record)]))
    route_missing_blockers = (recovery_route.get("missing_evidence") or []) if recovery_route and not recovery_route.get("generation_allowed") else []
    blockers = list(
        dict.fromkeys(
            [
                *((recovery_route.get("blockers") or []) if recovery_route else []),
                *route_missing_blockers,
                *(readiness.blockers or []),
            ]
        )
    )
    recovery_blocked = bool(recovery_route and recovery_route.get("status") == "blocked_missing_evidence")

    def recovery_next_action() -> str | None:
        if not recovery_route:
            return None
        primary = recovery_route.get("primary_action") or {}
        label = str(primary.get("label") or "").strip()
        reasons = list(recovery_route.get("source_backed_explanation") or recovery_route.get("reasons") or [])
        if label and reasons:
            return f"{label}. {reasons[0]}"
        return label or None

    if active_count == 0:
        status = "draft"
        readiness_state = "waiting_on_source_evidence"
        next_action = recovery_next_action() or "Upload PDF and Excel source files in Workspace."
    elif not processed:
        status = "uploaded"
        readiness_state = "ready_to_process"
        next_action = recovery_next_action() or "Start processing after the source set is complete."
    elif blockers:
        status = "blocked"
        readiness_state = "needs_review"
        next_action = recovery_next_action() or _blocked_next_action(record, blockers)
    elif generated_docs:
        status = "packet_generated"
        readiness_state = "output_available"
        next_action = "Download the generated outputs."
    elif readiness.verification_required and verification_state != "verified_florida_match":
        status = "ready_for_verification"
        readiness_state = "ready_for_verification"
        next_action = recovery_next_action() or "Run SunBiz verification."
    else:
        if recovery_blocked:
            status = "blocked"
            readiness_state = "needs_review"
            next_action = recovery_next_action() or "Resolve blockers before generation."
        else:
            status = "ready_for_generation"
            readiness_state = "ready_for_generation"
            next_action = recovery_next_action() or "Select one or more supported documents and generate."

    plaintiff = extraction.plaintiff.party_name if processed else None
    defendant = extraction.defendant_entity.party_name if processed else None
    guarantor = extraction.personal_guarantor.party_name if (processed and extraction.personal_guarantor) else None
    governing_law = extraction.governing_law if processed else None
    venue_county = extraction.venue.venue_county if processed else None
    court_level = extraction.florida_court.court_division_label if processed else None
    events = load_case_events(record.id, limit=5)

    generated_documents = [] if stale_generation else [doc.model_dump(mode="json") for doc in generated_docs]

    return CanonicalCaseSnapshot(
        case_id=record.id,
        matter_label=record.title or record.reference or record.id,
        selected_matter=record.title or record.reference or record.id,
        mode="case",
        source_file_count=active_count,
        source_set_count=source_set_count,
        plaintiff_name=plaintiff,
        defendant_name=defendant,
        guarantor_name=guarantor,
        plaintiff=plaintiff,
        defendant=defendant,
        guarantor=guarantor,
        governing_law=governing_law,
        venue_county=venue_county,
        court_level=court_level,
        draft_amount=draft_amount,
        extracted_amount=extracted_amount,
        approved_amount=approved_amount,
        display_amount=approved_amount,
        status=status,
        readiness=readiness_state,
        next_action=next_action,
        route_status=recovery_route.get("status") if recovery_route else None,
        route_reason_codes=list(recovery_route.get("reason_codes") or []) if recovery_route else [],
        readiness_score=float(recovery_route.get("readiness_score") or 0.0) if recovery_route else 0.0,
        blocker_count=len(blockers),
        warning_count=len(warnings),
        blockers=blockers,
        warnings=warnings,
        sunbiz_state=verification_state,
        generated_documents=generated_documents,
        generated_document_count=0 if stale_generation else len(generated_docs),
        has_zip=bool(record.packet_generation and record.packet_generation.download_url and not stale_generation and not blockers),
        packet_generation_allowed=bool(processed and not blockers and (recovery_route.get("generation_allowed") if recovery_route else True)),
        verification_required=readiness.verification_required,
        verification_report_available=bool(record.sunbiz_lookup and record.sunbiz_lookup.pdf_download_url and verification_state != "not_run"),
        recent_activity=events,
    )


def hydrate_case_for_client(record: CaseRecord) -> CaseRecord:
    record.client_snapshot = build_client_snapshot(record)
    if record.client_snapshot.status == "blocked" and record.packet_generation and not record.client_snapshot.has_zip:
        record.status = "blocked"
    else:
        record.status = record.client_snapshot.status
    return record
