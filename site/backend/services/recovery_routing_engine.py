from __future__ import annotations

from decimal import Decimal, InvalidOperation

from backend.models.case_schema import CaseRecord
from backend.services.case_state import active_source_files


ROUTE_STATUS_LABELS = {
    "ready_for_demand": "Ready for demand",
    "ready_for_settlement_offer": "Ready for settlement offer",
    "ready_for_payment_plan": "Ready for payment plan",
    "ready_for_counsel_handoff": "Ready for counsel handoff",
    "ready_for_court_draft": "Ready for court draft",
    "blocked_missing_evidence": "Blocked: missing evidence",
    "blocked_identity_conflict": "Blocked: identity conflict",
    "blocked_amount_conflict": "Blocked: amount conflict",
    "blocked_low_extraction_quality": "Blocked: low extraction quality",
}


REASON_MESSAGES = {
    "no_source_files": "No recovery file set is attached to this matter yet.",
    "processing_required": "The uploaded file set still needs to be processed before routing can be trusted.",
    "missing_signed_contract": "A signed contract or equivalent agreement is still missing.",
    "missing_invoice_support": "Invoice support or a clean aging report is still missing.",
    "missing_supported_balance": "A supported balance has not been confirmed from the current source set.",
    "missing_performance_proof": "Proof of delivery, acceptance, or completion is still missing.",
    "missing_contact_path": "A usable email, phone number, or service address is still missing.",
    "identity_conflict_detected": "The uploaded stack mixes more than one debtor identity and needs to be split or cleaned up.",
    "amount_conflict_detected": "Balances do not reconcile cleanly across the uploaded sources yet.",
    "low_extraction_quality_detected": "One or more critical files were only partially extracted or failed extraction, so the route is not reliable yet.",
    "supported_balance_confirmed": "The supported balance is confirmed from the approved reconciled source set.",
    "matched_invoice_support": "Invoice numbers line up across PDF and spreadsheet/CSV support.",
    "contact_path_available": "A usable contact path is present in the current record.",
    "venue_support_present": "Venue support is present in the extracted record.",
    "governing_law_present": "Governing-law support is present in the extracted record.",
    "core_evidence_complete": "Contract, invoice support, and performance proof are present.",
    "partial_resolution_fit": "This matter is actionable now, but an agreement-first path is safer than immediate escalation.",
    "low_balance_recovery_fit": "The supported balance is small enough to start with a structured payment-plan ask.",
    "high_balance_complexity": "The supported balance or matter complexity is high enough to justify a counsel-ready handoff.",
    "litigation_record_complete": "The record includes the contract, venue basis, governing law, and verified service data needed for draft court work.",
    "verified_service_data_available": "Verified debtor or service-path data is already available.",
    "personal_guaranty_present": "A personal guaranty is present in the current matter record.",
}


ACTION_SPECS = {
    "continue_recovery_diagnostic": {
        "label": "Continue Recovery Diagnostic",
        "service_slug": "invoice_recovery",
        "route": "/app/invoice-recovery/",
    },
    "complete_evidence_review": {
        "label": "Complete evidence review",
        "service_slug": "evidence_audit",
        "route": "/app/evidence-audit/",
    },
    "verify_debtor_record": {
        "label": "Verify debtor record",
        "service_slug": "entity_verification",
        "route": "/app/entity-verification/",
    },
    "build_demand_pack": {
        "label": "Build demand pack",
        "service_slug": "demand_pack",
        "route": "/app/action-center/",
    },
    "prepare_settlement_offer": {
        "label": "Prepare settlement offer",
        "service_slug": "demand_pack",
        "route": "/app/action-center/",
    },
    "prepare_payment_plan": {
        "label": "Prepare payment plan",
        "service_slug": "demand_pack",
        "route": "/app/action-center/",
    },
    "prepare_counsel_handoff": {
        "label": "Prepare counsel handoff",
        "service_slug": "counsel_handoff",
        "route": "/app/downloads/",
    },
    "prepare_court_draft": {
        "label": "Prepare court draft",
        "service_slug": "invoice_recovery",
        "route": "/app/workspace/",
    },
}


OPTIONAL_ACTIONS_BY_STATUS = {
    "blocked_missing_evidence": ["continue_recovery_diagnostic", "verify_debtor_record"],
    "blocked_identity_conflict": ["complete_evidence_review", "verify_debtor_record"],
    "blocked_amount_conflict": ["complete_evidence_review", "continue_recovery_diagnostic"],
    "blocked_low_extraction_quality": ["complete_evidence_review", "continue_recovery_diagnostic"],
    "ready_for_demand": ["prepare_settlement_offer", "prepare_payment_plan", "prepare_counsel_handoff"],
    "ready_for_settlement_offer": ["build_demand_pack", "prepare_payment_plan", "prepare_counsel_handoff"],
    "ready_for_payment_plan": ["prepare_settlement_offer", "build_demand_pack", "prepare_counsel_handoff"],
    "ready_for_counsel_handoff": ["prepare_court_draft", "build_demand_pack"],
    "ready_for_court_draft": ["prepare_counsel_handoff", "build_demand_pack"],
}


def _decimal(value: object | None) -> Decimal:
    try:
        return Decimal(str(value or "0").strip() or "0")
    except (InvalidOperation, ValueError, TypeError):
        return Decimal("0")


def _dedupe(values: list[str]) -> list[str]:
    results: list[str] = []
    seen: set[str] = set()
    for value in values:
        normalized = " ".join(str(value or "").split()).strip()
        if not normalized or normalized in seen:
            continue
        seen.add(normalized)
        results.append(normalized)
    return results


def _truth_payload(record: CaseRecord) -> dict[str, object]:
    extraction = record.extracted_case_data
    truth = dict(extraction.recovery_truth or {})
    payload = dict((record.workflow_payload or {}).get("invoice_recovery", {}) or {})
    original_payload = dict(payload)
    truth_coverage = dict(truth.get("evidence_coverage") or {})

    payload["supported_balance"] = truth.get("supported_balance") or payload.get("supported_balance") or str(
        extraction.amount_reconciliation.case_summary_total or extraction.amount_in_controversy or "0.00"
    )
    payload["unsupported_balance"] = truth.get("unsupported_balance") or payload.get("unsupported_balance") or "0.00"
    payload["invoice_count"] = truth.get("invoice_count")
    if payload["invoice_count"] in (None, ""):
        payload["invoice_count"] = original_payload.get("invoice_count") or extraction.invoice_summary.invoice_count or len(extraction.invoice_summary.line_items)
    payload["matched_invoice_count"] = truth.get("matched_invoice_count")
    if payload["matched_invoice_count"] in (None, ""):
        payload["matched_invoice_count"] = original_payload.get("matched_invoice_count") or 0
    payload["debtor_count"] = truth.get("debtor_count")
    if payload["debtor_count"] in (None, ""):
        payload["debtor_count"] = original_payload.get("debtor_count") or len(extraction.matter_consistency.detected_debtor_entities or [])

    payload["has_contract"] = bool(
        truth_coverage.get("contract_present")
        if "contract_present" in truth_coverage
        else payload.get("has_contract")
    ) or bool(extraction.contract_evidence) or bool(extraction.governing_law or extraction.payment_terms or extraction.default_terms or extraction.venue.venue_clause)
    payload["has_personal_guaranty"] = bool(
        truth.get("guarantor_present")
        if "guarantor_present" in truth
        else payload.get("has_personal_guaranty")
    ) or bool(extraction.personal_guarantor and extraction.personal_guarantor.party_name)
    payload["has_governing_law_clause"] = bool(
        truth.get("governing_law_present")
        if "governing_law_present" in truth
        else payload.get("has_governing_law_clause")
    ) or bool(extraction.governing_law)
    payload["has_venue_clause"] = bool(
        truth.get("venue_present")
        if "venue_present" in truth
        else payload.get("has_venue_clause")
    ) or bool(extraction.venue.venue_clause or extraction.venue.venue_county)
    payload["performance_proof_present"] = bool(
        truth.get("performance_proof_present")
        if "performance_proof_present" in truth
        else payload.get("performance_proof_present")
    )
    payload["contactability_present"] = bool(
        truth.get("contactability_present")
        if "contactability_present" in truth
        else payload.get("contactability_present")
    )
    payload["readiness_score"] = float(truth.get("readiness_score") or payload.get("readiness_score") or 0.0)
    payload["source_backed_explanation"] = list(truth.get("source_backed_explanation") or payload.get("source_backed_explanation") or [])
    payload["critical_blocker_codes"] = list(truth.get("critical_blocker_codes") or payload.get("critical_blocker_codes") or [])
    payload["critical_blockers"] = list(truth.get("critical_blockers") or payload.get("critical_blockers") or [])
    payload["low_quality_files"] = list(truth.get("low_quality_files") or payload.get("low_quality_files") or [])
    return payload


def _verified_service_data_available(record: CaseRecord) -> bool:
    sunbiz = record.sunbiz_lookup
    if sunbiz and str(sunbiz.result_classification or "").lower() == "verified_match":
        if sunbiz.registered_agent_name or sunbiz.registered_agent_address or sunbiz.principal_address:
            return True
    entity = record.entity_verification
    if entity and str(entity.classification or entity.status or "").lower() in {"verified_match", "verified", "matched"}:
        return True
    return False


def _missing_evidence(payload: dict[str, object], record: CaseRecord) -> tuple[list[str], list[str], list[str]]:
    extraction = record.extracted_case_data
    active_files = active_source_files(record)
    missing: list[str] = []
    blockers: list[str] = []
    reason_codes: list[str] = []

    if not active_files:
        missing.append("Upload the recovery file set for this matter.")
        blockers.append("Upload the contract, invoices, guaranty, or aging report before generation is allowed.")
        reason_codes.append("no_source_files")

    if active_files and not extraction.processed_at:
        blockers.append("Process the uploaded file set before generation is allowed.")
        reason_codes.append("processing_required")

    if not bool(payload.get("has_contract")):
        missing.append("Upload a signed contract or equivalent agreement.")
        reason_codes.append("missing_signed_contract")

    if int(payload.get("invoice_count") or 0) <= 0:
        missing.append("Upload invoice copies, statements, or a clean aging report.")
        reason_codes.append("missing_invoice_support")

    if _decimal(payload.get("supported_balance")) <= 0:
        missing.append("Confirm a supported balance from the invoices, statements, or aging report.")
        reason_codes.append("missing_supported_balance")

    if not bool(payload.get("performance_proof_present")):
        missing.append("Upload proof of delivery, acceptance, completion, or comparable performance support.")
        reason_codes.append("missing_performance_proof")

    return _dedupe(missing), _dedupe(blockers), _dedupe(reason_codes)


def _conflict_blockers(record: CaseRecord, payload: dict[str, object]) -> tuple[str | None, list[str], list[str]]:
    truth_codes = set(str(item) for item in (payload.get("critical_blocker_codes") or []))
    truth_blockers = [str(item) for item in (payload.get("critical_blockers") or []) if item]
    extraction = record.extracted_case_data

    if "blocked_identity_conflict" in truth_codes or extraction.matter_consistency.blockers:
        blockers = truth_blockers or [
            "This upload mixes multiple debtor identities or unrelated source sets. Split or exclude the unrelated files before continuing."
        ]
        return "blocked_identity_conflict", _dedupe(blockers), ["identity_conflict_detected"]

    if "blocked_amount_conflict" in truth_codes or extraction.amount_reconciliation.blockers or _decimal(payload.get("unsupported_balance")) > 0:
        blockers = truth_blockers or [
            "The balance support does not reconcile cleanly yet. Review invoice PDFs, statements, and spreadsheet/CSV balances before continuing."
        ]
        return "blocked_amount_conflict", _dedupe(blockers), ["amount_conflict_detected"]

    low_quality_files = list(payload.get("low_quality_files") or [])
    if "blocked_low_extraction_quality" in truth_codes or low_quality_files:
        blockers = truth_blockers or [
            "Critical files were only partially extracted or failed extraction. Review the flagged files before trusting the route."
        ]
        return "blocked_low_extraction_quality", _dedupe(blockers), ["low_extraction_quality_detected"]

    return None, [], []


def _action(case_id: str, code: str) -> dict[str, str]:
    spec = ACTION_SPECS[code]
    route = f"{spec['route']}?case={case_id}" if case_id else str(spec["route"])
    return {
        "code": code,
        "label": str(spec["label"]),
        "service_slug": str(spec["service_slug"]),
        "route": route,
    }


def _actions_for_status(case_id: str, status: str, *, verified_service_data: bool) -> tuple[dict[str, str], list[dict[str, str]]]:
    if status in {"blocked_missing_evidence", "blocked_identity_conflict", "blocked_amount_conflict", "blocked_low_extraction_quality"}:
        primary_code = "complete_evidence_review"
    elif status == "ready_for_demand":
        primary_code = "build_demand_pack"
    elif status == "ready_for_settlement_offer":
        primary_code = "prepare_settlement_offer"
    elif status == "ready_for_payment_plan":
        primary_code = "prepare_payment_plan"
    elif status == "ready_for_counsel_handoff":
        primary_code = "prepare_counsel_handoff"
    else:
        primary_code = "prepare_court_draft"

    optional_codes = list(OPTIONAL_ACTIONS_BY_STATUS.get(status, []))
    if verified_service_data:
        optional_codes = [code for code in optional_codes if code != "verify_debtor_record"]
    primary = _action(case_id, primary_code)
    optionals: list[dict[str, str]] = []
    seen_codes = {primary_code}
    for code in optional_codes:
        if code in seen_codes:
            continue
        seen_codes.add(code)
        optionals.append(_action(case_id, code))
    return primary, optionals


def _readiness_score(payload: dict[str, object], blockers: list[str]) -> float:
    score = float(payload.get("readiness_score") or 0.0)
    if score:
        return max(0.0, min(100.0, score))
    score = 20.0
    if _decimal(payload.get("supported_balance")) > 0:
        score += 20.0
    if bool(payload.get("has_contract")):
        score += 15.0
    if bool(payload.get("performance_proof_present")):
        score += 10.0
    if bool(payload.get("has_governing_law_clause")):
        score += 10.0
    if bool(payload.get("has_venue_clause")):
        score += 10.0
    if bool(payload.get("contactability_present")):
        score += 10.0
    if int(payload.get("matched_invoice_count") or 0) > 0:
        score += 5.0
    score -= min(40.0, float(len(blockers)) * 10.0)
    return max(0.0, min(100.0, score))


def determine_recovery_route(record: CaseRecord) -> dict[str, object]:
    payload = _truth_payload(record)
    balance = _decimal(payload.get("supported_balance"))
    has_governing_law = bool(payload.get("has_governing_law_clause"))
    has_venue_basis = bool(payload.get("has_venue_clause"))
    has_guaranty = bool(payload.get("has_personal_guaranty"))
    verified_service_data = _verified_service_data_available(record)

    missing_evidence, direct_blockers, direct_reason_codes = _missing_evidence(payload, record)
    conflict_status, conflict_blockers, conflict_reason_codes = _conflict_blockers(record, payload)

    blockers = _dedupe([*conflict_blockers, *direct_blockers])
    reason_codes = _dedupe([*conflict_reason_codes, *direct_reason_codes])

    if conflict_status:
        status = conflict_status
    elif blockers or missing_evidence:
        status = "blocked_missing_evidence"
    elif verified_service_data and has_governing_law and has_venue_basis and balance >= Decimal("25000"):
        status = "ready_for_court_draft"
        reason_codes = _dedupe(
            [
                *reason_codes,
                "supported_balance_confirmed",
                "litigation_record_complete",
                "verified_service_data_available",
                "venue_support_present",
                "governing_law_present",
            ]
        )
    elif balance >= Decimal("25000") or (has_guaranty and balance >= Decimal("10000")):
        status = "ready_for_counsel_handoff"
        reason_codes = _dedupe([*reason_codes, "supported_balance_confirmed", "high_balance_complexity"])
        if has_guaranty:
            reason_codes.append("personal_guaranty_present")
    elif balance <= Decimal("3500"):
        status = "ready_for_payment_plan"
        reason_codes = _dedupe([*reason_codes, "supported_balance_confirmed", "low_balance_recovery_fit"])
    elif balance <= Decimal("12000") and not has_guaranty:
        status = "ready_for_settlement_offer"
        reason_codes = _dedupe([*reason_codes, "supported_balance_confirmed", "partial_resolution_fit"])
    else:
        status = "ready_for_demand"
        route_codes = ["supported_balance_confirmed"]
        if bool(payload.get("has_contract")) and bool(payload.get("performance_proof_present")) and int(payload.get("invoice_count") or 0) > 0:
            route_codes.append("core_evidence_complete")
        if int(payload.get("matched_invoice_count") or 0) > 0:
            route_codes.append("matched_invoice_support")
        if verified_service_data:
            route_codes.append("verified_service_data_available")
        if bool(payload.get("contactability_present")):
            route_codes.append("contact_path_available")
        reason_codes = _dedupe([*reason_codes, *route_codes])

    if has_venue_basis and status in {"ready_for_demand", "ready_for_counsel_handoff", "ready_for_court_draft"}:
        reason_codes = _dedupe([*reason_codes, "venue_support_present"])
    if has_governing_law and status in {"ready_for_demand", "ready_for_counsel_handoff", "ready_for_court_draft"}:
        reason_codes = _dedupe([*reason_codes, "governing_law_present"])

    primary_action, optional_actions = _actions_for_status(
        record.id,
        status,
        verified_service_data=verified_service_data,
    )

    reasons = [REASON_MESSAGES[code] for code in reason_codes if code in REASON_MESSAGES]
    explanation = _dedupe([*list(payload.get("source_backed_explanation") or []), *reasons])
    readiness_score = _readiness_score(payload, blockers or missing_evidence)

    return {
        "status": status,
        "status_label": ROUTE_STATUS_LABELS.get(status, status.replace("_", " ")),
        "primary_action": primary_action,
        "optional_actions": optional_actions,
        "secondary_options": optional_actions,
        "reason_codes": reason_codes,
        "reasons": _dedupe(reasons),
        "blockers": blockers,
        "missing_evidence": missing_evidence,
        "generation_allowed": status not in {
            "blocked_missing_evidence",
            "blocked_identity_conflict",
            "blocked_amount_conflict",
            "blocked_low_extraction_quality",
        },
        "supported_balance": str(balance.quantize(Decimal("0.01"))),
        "unsupported_balance": f"{_decimal(payload.get('unsupported_balance')).quantize(Decimal('0.01'))}",
        "readiness_score": readiness_score,
        "source_backed_explanation": explanation,
    }
