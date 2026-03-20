from __future__ import annotations

from backend.models.case_schema import CaseRecord
from backend.services.recovery_routing_engine import determine_recovery_route
from backend.services.workflow_registry import WorkflowDef, catalog_workflows


PRIMARY_NAV = [
    {"slug": "home", "label": "Home", "label_key": "nav.primary.home", "route": "/app/home/", "order": 1},
    {"slug": "my_cases", "label": "Matters", "label_key": "nav.primary.my_cases", "route": "/app/my-cases/", "order": 2},
    {"slug": "action_center", "label": "Action Center", "label_key": "nav.primary.action_center", "route": "/app/action-center/", "order": 3},
    {"slug": "workspace", "label": "Workspace", "label_key": "nav.primary.workspace", "route": "/app/workspace/", "order": 4},
    {"slug": "downloads", "label": "Outputs", "label_key": "nav.primary.downloads", "route": "/app/downloads/", "order": 5},
    {"slug": "settings", "label": "Settings", "label_key": "nav.primary.settings", "route": "/app/settings/", "order": 6},
]

FUNNEL_STAGE_LABELS = {
    "upload": "Start",
    "diagnose": "Diagnose",
    "build": "Build",
}


STATUS_LABELS = {
    "ready": "Ready",
    "standalone": "Standalone",
    "needs_review": "Needs review",
    "requires_case": "Open a matter",
    "coming_soon": "Internal",
}


def _category_slug(value: str) -> str:
    return str(value or "other").strip().lower().replace("&", "and").replace(" ", "_")


def _recovery_decision(record: CaseRecord | None) -> dict[str, object] | None:
    if not record:
        return None
    if str(record.issue_category or "").strip().lower() != "invoice_recovery_matter":
        return None
    return determine_recovery_route(record)


def _optional_service_slugs(decision: dict[str, object] | None) -> list[str]:
    if not decision:
        return []
    slugs: list[str] = []
    seen: set[str] = set()
    for item in decision.get("optional_actions") or []:
        slug = str(item.get("service_slug") or "").strip()
        if not slug or slug in seen:
            continue
        seen.add(slug)
        slugs.append(slug)
    return slugs


def _compute_fit_score(workflow: WorkflowDef, record: CaseRecord | None, decision: dict[str, object] | None = None) -> int:
    if not record:
        if workflow.slug == "invoice_recovery":
            return 42
        return 18 if workflow.entry_mode != "case_bound" else 8

    issue = str(record.issue_category or "").strip().lower()
    if decision:
        primary_slug = str((decision.get("primary_action") or {}).get("service_slug") or "").strip()
        optional_slugs = _optional_service_slugs(decision)
        if workflow.slug == primary_slug:
            return 100
        if workflow.slug in optional_slugs:
            return 86 - (optional_slugs.index(workflow.slug) * 4)
        if workflow.slug == "invoice_recovery":
            return 72
        if workflow.slug == "entity_verification":
            return 66
        return 22
    if issue == "irs_notice" and workflow.slug == "irs_notice":
        return 100
    if issue == "debt_collection_notice" and workflow.slug in {"invoice_recovery", "evidence_audit", "demand_pack"}:
        return 84 if workflow.slug == "invoice_recovery" else 78
    if issue == "invoice_recovery_matter" and workflow.slug == "invoice_recovery":
        return 100
    if issue == "invoice_recovery_matter" and workflow.slug == "demand_pack":
        return 95
    if issue == "invoice_recovery_matter" and workflow.slug == "evidence_audit":
        return 92
    if issue == "invoice_recovery_matter" and workflow.slug == "entity_verification":
        return 88
    if issue == "invoice_recovery_matter" and workflow.slug == "counsel_handoff":
        return 82
    if issue == "business_contract" and workflow.slug in {"invoice_recovery", "evidence_audit", "entity_verification"}:
        return 62 if workflow.slug == "invoice_recovery" else 56
    if issue == "vehicle_purchase_contract" and workflow.slug == "auto_deal_integrity":
        return 100
    if issue == "vehicle_purchase_contract" and workflow.slug == "evidence_audit":
        return 46
    if issue == "immigration_intake" and workflow.slug == "immigration_forms":
        return 96
    if issue == "permit_issue" and workflow.slug == "permit_navigator":
        return 100
    if workflow.slug == record.workflow_slug:
        return 95
    if workflow.slug in {"entity_verification", "evidence_audit"}:
        return 34
    if workflow.slug in {"demand_pack", "counsel_handoff"}:
        return 28
    if workflow.entry_mode == "case_bound":
        return 20
    return 20


def _status_code(workflow: WorkflowDef, record: CaseRecord | None, fit_score: int) -> str:
    if not workflow.enabled:
        return "coming_soon"
    if workflow.entry_mode == "case_bound" and not record:
        return "requires_case"
    if workflow.entry_mode == "standalone_session":
        return "standalone"
    if fit_score >= 75:
        return "ready"
    return "needs_review"


def _relationship(workflow: WorkflowDef, record: CaseRecord | None, fit_score: int) -> str:
    decision = _recovery_decision(record)
    if decision:
        primary_slug = str((decision.get("primary_action") or {}).get("service_slug") or "").strip()
        optional_slugs = _optional_service_slugs(decision)
        if workflow.slug == primary_slug:
            return "recommended"
        if workflow.slug in optional_slugs:
            return "related"
        return "available"
    if fit_score >= 75:
        return "recommended"
    if record and fit_score >= 60:
        return "related"
    return "available"


def _next_action(workflow: WorkflowDef, record: CaseRecord | None, fit_score: int, decision: dict[str, object] | None = None) -> str:
    if not workflow.enabled:
        return "This workflow is hidden from the production catalog."
    if workflow.entry_mode == "case_bound" and not record:
        return "Start a recovery matter first, then continue from Action Center."
    if decision:
        primary = decision.get("primary_action") or {}
        reasons = list(decision.get("reasons") or [])
        primary_slug = str(primary.get("service_slug") or "").strip()
        if workflow.slug == primary_slug:
            if reasons:
                return f"Primary action for this matter. {primary.get('label')}. {reasons[0]}"
            return f"Primary action for this matter. {primary.get('label')}."
        for item in decision.get("optional_actions") or []:
            if workflow.slug == str(item.get("service_slug") or "").strip():
                return f"Optional next step after the primary action. {item.get('label')}."
        blockers = list(decision.get("blockers") or [])
        if blockers and workflow.slug == "evidence_audit":
            return blockers[0]
        missing_evidence = list(decision.get("missing_evidence") or [])
        if missing_evidence and workflow.slug == "evidence_audit":
            return missing_evidence[0]
    if fit_score >= 75 and record and record.recommended_paths:
        return f"Recommended for this matter. Start with {record.recommended_paths[0].replace('_', ' ')}."
    if workflow.entry_mode == "standalone_session":
        return "Start clean in this service. Files from other workflows are not attached automatically."
    return workflow.description


def _render_workflow(workflow: WorkflowDef, record: CaseRecord | None) -> dict[str, object]:
    decision = _recovery_decision(record)
    fit_score = _compute_fit_score(workflow, record, decision)
    status_code = _status_code(workflow, record, fit_score)
    relationship = _relationship(workflow, record, fit_score)
    category_slug = _category_slug(workflow.category)
    funnel_stage = str(workflow.funnel_stage or "build").strip().lower()
    return {
        "slug": workflow.slug,
        "name": workflow.name,
        "public_label": "Recovery Diagnostic" if workflow.slug == "invoice_recovery" else workflow.name,
        "name_key": f"workflow.{workflow.slug}.name",
        "domain": category_slug,
        "domain_key": f"workflow.category.{category_slug}",
        "category": workflow.category,
        "description": workflow.description,
        "description_key": f"workflow.{workflow.slug}.description",
        "route": workflow.route,
        "entry_mode": workflow.entry_mode,
        "upload_supported": bool(workflow.required_inputs),
        "output_supported": bool(workflow.supported_outputs),
        "required_inputs": list(workflow.required_inputs),
        "supported_outputs": list(workflow.supported_outputs),
        "mobile_camera_first": workflow.mobile_camera_first,
        "price_hint": workflow.price_hint,
        "enabled": workflow.enabled,
        "funnel_stage": funnel_stage,
        "funnel_stage_key": f"workflow.stage.{funnel_stage}",
        "funnel_stage_label": FUNNEL_STAGE_LABELS.get(funnel_stage, "Build"),
        "public_order": int(workflow.public_order),
        "recommended": relationship == "recommended",
        "relationship": relationship,
        "fit_score": fit_score,
        "status_code": status_code,
        "status_label": STATUS_LABELS.get(status_code, "Needs review"),
        "status_key": f"status.{status_code}",
        "next_action": _next_action(workflow, record, fit_score, decision),
        "order": int(workflow.public_order),
    }


def build_platform_navigation() -> list[dict]:
    return [dict(item) for item in sorted(PRIMARY_NAV, key=lambda entry: entry["order"])]


def build_platform_services(record: CaseRecord | None = None) -> dict[str, list[dict]]:
    services = [_render_workflow(item, record) for item in catalog_workflows()]
    services.sort(key=lambda item: (int(item["public_order"]), str(item["name"])))

    return {
        "primary_navigation": build_platform_navigation(),
        "services": services,
        "secondary_services": [],
    }
