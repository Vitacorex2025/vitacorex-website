from __future__ import annotations

from backend.models.case_schema import CaseRecord
from backend.services.recovery_routing_engine import determine_recovery_route


def recommend_paths(record: CaseRecord) -> list[str]:
    issue = str(getattr(record, "issue_category", "") or "").strip().lower()

    if issue == "irs_notice":
        payload = (getattr(record, "workflow_payload", {}) or {}).get("irs_notice", {})
        route = str(payload.get("recommended_route") or "").strip().lower()
        if route == "identity_verification_path":
            return ["identity_verification_path", "build_response_packet", "understand_notice"]
        if route == "payment_resolution":
            return ["payment_resolution", "build_response_packet", "understand_notice"]
        return ["build_response_packet", "understand_notice", "payment_resolution"]

    if issue == "ssa_overpayment_notice":
        return ["appeal_review", "waiver_path", "repayment_options"]

    if issue == "debt_collection_notice":
        return ["validation_request", "dispute_path", "settlement_path"]

    if issue == "medical_bill":
        return ["itemization_review", "appeal_path", "collector_dispute"]

    if issue == "vehicle_purchase_contract":
        return ["deal_audit", "fee_review", "negotiation_memo"]

    if issue == "immigration_intake":
        return ["complete_intake", "evidence_checklist", "draft_form_generation"]

    if issue == "permit_issue":
        return ["permit_checklist", "official_route", "document_prep"]

    if issue == "invoice_recovery_matter":
        decision = determine_recovery_route(record)
        primary = (decision.get("primary_action") or {}).get("code")
        optional = [item.get("code") for item in (decision.get("optional_actions") or []) if item.get("code")]
        recommended = [item for item in [primary, *optional] if item]
        return recommended or ["complete_evidence_review", "continue_recovery_diagnostic"]

    if issue == "business_contract":
        return ["risk_review", "generate_stronger_contract", "negotiation_memo"]

    return ["review_matter", "upload_supporting_documents", "build_action_summary"]
