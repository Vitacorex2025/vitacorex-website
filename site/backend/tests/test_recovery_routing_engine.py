from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from backend.models.case_schema import (
    CaseRecord,
    FileType,
    PartyDetails,
    PartyRole,
    StoredFile,
    SunbizLookupResult,
)
from backend.services.action_packet_service import build_action_packet
from backend.services.canonical_snapshot import build_client_snapshot
from backend.services.recovery_routing_engine import determine_recovery_route


def _recovery_record(
    *,
    balance: str = "8500.00",
    invoice_count: int = 3,
    has_contract: bool = True,
    has_guaranty: bool = False,
    has_governing_law: bool = False,
    has_venue_basis: bool = False,
    performance_proof: bool = True,
    verified_service_data: bool = False,
    processed: bool = True,
    with_source: bool = True,
) -> CaseRecord:
    record = CaseRecord(id=f"case_route_{balance.replace('.', '_')}")
    record.title = "Recovery matter"
    record.issue_category = "invoice_recovery_matter"
    record.workflow_slug = "invoice_recovery"
    record.current_stage = "classified"
    record.urgency_level = "medium"
    record.extracted_case_data.plaintiff = PartyDetails(party_name="Client Company LLC", party_role=PartyRole.PLAINTIFF)
    record.extracted_case_data.defendant_entity = PartyDetails(party_name="Debtor Company LLC", party_role=PartyRole.DEFENDANT_ENTITY)
    record.extracted_case_data.amount_in_controversy = balance
    record.extracted_case_data.amount_reconciliation.case_summary_total = balance
    record.extracted_case_data.contract_evidence = ["Master services agreement"] if has_contract else []
    if has_guaranty:
        record.extracted_case_data.personal_guarantor = PartyDetails(
            party_name="Jordan Guarantor",
            party_role=PartyRole.PERSONAL_GUARANTOR,
        )
    if has_governing_law:
        record.extracted_case_data.governing_law = "Florida"
    if has_venue_basis:
        record.extracted_case_data.venue.venue_clause = "Venue in Orange County, Florida."
        record.extracted_case_data.venue.venue_county = "Orange"
    if processed:
        record.extracted_case_data.processed_at = datetime.now(timezone.utc)
    if with_source:
        record.source_files = [
            StoredFile(
                id="source_001",
                filename="recovery.pdf",
                original_filename="recovery.pdf",
                storage_path="storage/test/recovery.pdf",
                file_type=FileType.CONTRACT_PDF,
            )
        ]
    if verified_service_data:
        record.sunbiz_lookup = SunbizLookupResult(
            queried_entity_name="Debtor Company LLC",
            matched=True,
            exact_match=True,
            official_record_available=True,
            registered_agent_name="Registered Agent LLC",
            registered_agent_address="123 Main St, Orlando, FL 32801",
            result_classification="verified_match",
            looked_up_at=datetime.now(timezone.utc),
        )
    record.workflow_payload = {
        "invoice_recovery": {
            "supported_balance": balance,
            "invoice_count": invoice_count,
            "has_contract": has_contract,
            "has_personal_guaranty": has_guaranty,
            "has_attorneys_fees_clause": has_contract,
            "has_governing_law_clause": has_governing_law,
            "has_venue_clause": has_venue_basis,
            "performance_proof_present": performance_proof,
        }
    }
    return record


def test_recovery_route_blocks_missing_evidence_before_generation():
    record = _recovery_record(balance="0.00", invoice_count=0, has_contract=False, performance_proof=False)
    decision = determine_recovery_route(record)
    assert decision["status"] == "blocked_missing_evidence"
    assert decision["primary_action"]["code"] == "complete_evidence_review"
    assert decision["generation_allowed"] is False
    assert "missing_signed_contract" in decision["reason_codes"]
    assert "missing_invoice_support" in decision["reason_codes"]
    assert "missing_supported_balance" in decision["reason_codes"]
    assert "missing_performance_proof" in decision["reason_codes"]
    assert "Upload a signed contract or equivalent agreement." in decision["missing_evidence"]
    assert decision["readiness_score"] < 50
    assert decision["source_backed_explanation"]


def test_recovery_route_can_choose_payment_plan_for_small_balances():
    record = _recovery_record(balance="1200.00", has_governing_law=True, has_venue_basis=True)
    decision = determine_recovery_route(record)
    assert decision["status"] == "ready_for_payment_plan"
    assert decision["primary_action"]["code"] == "prepare_payment_plan"
    assert decision["generation_allowed"] is True
    assert "low_balance_recovery_fit" in decision["reason_codes"]


def test_recovery_route_can_choose_demand_for_clean_midrange_matters():
    record = _recovery_record(balance="15000.00", has_governing_law=True, has_venue_basis=True)
    decision = determine_recovery_route(record)
    assert decision["status"] == "ready_for_demand"
    assert decision["primary_action"]["code"] == "build_demand_pack"
    assert "supported_balance_confirmed" in decision["reason_codes"]
    assert "core_evidence_complete" in decision["reason_codes"]


def test_recovery_route_can_choose_counsel_handoff_for_complex_matters():
    record = _recovery_record(balance="30000.00", has_guaranty=True)
    decision = determine_recovery_route(record)
    assert decision["status"] == "ready_for_counsel_handoff"
    assert decision["primary_action"]["code"] == "prepare_counsel_handoff"
    assert "high_balance_complexity" in decision["reason_codes"]


def test_recovery_route_can_choose_court_draft_when_litigation_record_is_complete():
    record = _recovery_record(
        balance="30000.00",
        has_governing_law=True,
        has_venue_basis=True,
        verified_service_data=True,
    )
    decision = determine_recovery_route(record)
    assert decision["status"] == "ready_for_court_draft"
    assert decision["primary_action"]["code"] == "prepare_court_draft"
    assert "litigation_record_complete" in decision["reason_codes"]
    assert "verified_service_data_available" in decision["reason_codes"]


def test_recovery_route_blocks_identity_conflicts_before_generation():
    record = _recovery_record(balance="8000.00", has_governing_law=True, has_venue_basis=True)
    record.extracted_case_data.matter_consistency.blockers = [
        "This upload contains multiple debtor matters. Split them into separate cases."
    ]
    record.extracted_case_data.recovery_truth = {
        "critical_blocker_codes": ["blocked_identity_conflict"],
        "critical_blockers": ["This upload contains multiple debtor matters. Split them into separate cases."],
        "readiness_score": 28,
    }
    decision = determine_recovery_route(record)
    assert decision["status"] == "blocked_identity_conflict"
    assert decision["generation_allowed"] is False
    assert "identity_conflict_detected" in decision["reason_codes"]


def test_recovery_route_blocks_amount_conflicts_before_generation():
    record = _recovery_record(balance="12000.00", has_governing_law=True, has_venue_basis=True)
    record.extracted_case_data.amount_reconciliation.blockers = [
        "Invoice PDF totals (120.00) do not match spreadsheet balances (100.00)."
    ]
    record.extracted_case_data.recovery_truth = {
        "critical_blocker_codes": ["blocked_amount_conflict"],
        "critical_blockers": ["Invoice PDF totals (120.00) do not match spreadsheet balances (100.00)."],
        "unsupported_balance": "20.00",
        "readiness_score": 34,
    }
    decision = determine_recovery_route(record)
    assert decision["status"] == "blocked_amount_conflict"
    assert decision["unsupported_balance"] == "20.00"
    assert "amount_conflict_detected" in decision["reason_codes"]


def test_recovery_route_blocks_low_quality_sources_before_generation():
    record = _recovery_record(balance="9000.00", has_governing_law=True, has_venue_basis=True)
    record.extracted_case_data.recovery_truth = {
        "critical_blocker_codes": ["blocked_low_extraction_quality"],
        "critical_blockers": ["Critical files were only partially extracted or failed extraction. Review the flagged files before trusting the route."],
        "low_quality_files": [{"filename": "scan.pdf", "status": "failed", "score": 0.18, "file_type": "invoice_pdf"}],
        "readiness_score": 22,
    }
    decision = determine_recovery_route(record)
    assert decision["status"] == "blocked_low_extraction_quality"
    assert decision["generation_allowed"] is False
    assert "low_extraction_quality_detected" in decision["reason_codes"]


def test_action_packet_exposes_primary_and_optional_steps_and_hides_primary_output_when_blocked():
    record = _recovery_record(balance="0.00", invoice_count=0, has_contract=False, performance_proof=False)
    packet = build_action_packet(record)
    assert packet["route_status"] == "blocked_missing_evidence"
    assert packet["generation_allowed"] is False
    assert packet["primary_next_step"]["code"] == "complete_evidence_review"
    assert packet["optional_next_steps"]
    assert packet["secondary_options"]
    assert packet["missing_evidence"]
    assert packet["readiness_score"] < 50
    assert packet["source_backed_explanation"]
    assert "Upload a signed contract or equivalent agreement." in packet["missing_documents"]
    assert not any(item["type"] == "recovery_primary_output_docx" for item in packet["outputs"])


def test_client_snapshot_uses_deterministic_recovery_route_to_lock_generation():
    record = _recovery_record(balance="0.00", invoice_count=0, has_contract=False, performance_proof=False)
    snapshot = build_client_snapshot(record)
    assert snapshot.status == "blocked"
    assert snapshot.packet_generation_allowed is False
    assert snapshot.route_status == "blocked_missing_evidence"
    assert snapshot.readiness_score < 50
    assert "Complete evidence review" in str(snapshot.next_action)
