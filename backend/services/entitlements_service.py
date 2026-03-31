from __future__ import annotations

from typing import Any

from backend.core.config import settings
from backend.models.auth_schema import (
    CommercialPrompt,
    MembershipRecord,
    MembershipRole,
    PlanCode,
    PlanEntitlements,
    WorkspaceCommercialSnapshot,
    WorkspaceRecord,
    WorkspaceUsageSummary,
)
from backend.services import auth_store
from backend.services.audit_service import record_case_event
from backend.services.case_store import list_cases
from backend.services.workspace_usage_store import load_workspace_usage_events, record_workspace_usage_event


PLAN_LABELS = {
    PlanCode.STARTER: "Starter",
    PlanCode.TEAM: "Team",
    PlanCode.ENTERPRISE: "Enterprise",
    PlanCode.CONSUMER_MATTER_PACK: "Matter Pack",
}


PLAN_VALUE_MESSAGES = {
    PlanCode.STARTER: "Best for a focused recovery workspace proving one repeatable intake-to-packet flow.",
    PlanCode.TEAM: "Best for multi-user recovery operations where teams need batch intake, portal access, and shared execution.",
    PlanCode.ENTERPRISE: "Best for higher-volume recovery operations that need advanced exports, court-draft access, and wider rollout control.",
    PlanCode.CONSUMER_MATTER_PACK: "Best for one narrow matter where a user pays for a bounded recovery workflow instead of a broad subscription.",
}


PLAN_ENTITLEMENTS = {
    PlanCode.STARTER: PlanEntitlements(
        max_active_matters=5,
        batch_import_enabled=False,
        human_review_enabled=True,
        court_draft_enabled=False,
        portal_enabled=False,
        seat_limit=1,
        advanced_exports_enabled=False,
    ),
    PlanCode.TEAM: PlanEntitlements(
        max_active_matters=40,
        batch_import_enabled=True,
        human_review_enabled=True,
        court_draft_enabled=False,
        portal_enabled=True,
        seat_limit=5,
        advanced_exports_enabled=False,
    ),
    PlanCode.ENTERPRISE: PlanEntitlements(
        max_active_matters=250,
        batch_import_enabled=True,
        human_review_enabled=True,
        court_draft_enabled=True,
        portal_enabled=True,
        seat_limit=25,
        advanced_exports_enabled=True,
    ),
    PlanCode.CONSUMER_MATTER_PACK: PlanEntitlements(
        max_active_matters=1,
        batch_import_enabled=False,
        human_review_enabled=False,
        court_draft_enabled=False,
        portal_enabled=False,
        seat_limit=1,
        advanced_exports_enabled=False,
    ),
}


USAGE_EVENT_TYPES = [
    "upload_started",
    "upload_completed",
    "extraction_blocked",
    "readiness_viewed",
    "demand_pack_created",
    "counsel_handoff_created",
    "packet_generated",
    "packet_downloaded",
    "payment_plan_created",
    "settlement_proposed",
    "abandoned_step",
]


def _normalize_plan_code(value: str | None) -> str:
    normalized = str(value or "").strip().lower()
    if normalized in PLAN_ENTITLEMENTS:
        return normalized
    return PlanCode.STARTER


def _default_plan_code(workspace: WorkspaceRecord, membership: MembershipRecord | None = None) -> str:
    configured = _normalize_plan_code(getattr(settings, "default_plan", "starter"))
    if str(getattr(settings, "default_plan", "")).strip().lower() not in {"", "auto"}:
        return configured
    role = str(getattr(membership, "role", "") or "").strip().lower()
    if role in {MembershipRole.SUPER_ADMIN, MembershipRole.ADMIN} and str(workspace.name or "").strip().lower().startswith("docketmint admin"):
        return PlanCode.ENTERPRISE
    if not bool(getattr(workspace, "is_personal", True)):
        return PlanCode.TEAM
    return PlanCode.STARTER


def resolve_plan_code(workspace: WorkspaceRecord, membership: MembershipRecord | None = None) -> str:
    explicit = _normalize_plan_code(getattr(workspace, "plan_code", None))
    if getattr(workspace, "plan_code", None):
        return explicit
    return _default_plan_code(workspace, membership)


def entitlements_for_plan(plan_code: str) -> PlanEntitlements:
    return PLAN_ENTITLEMENTS[_normalize_plan_code(plan_code)].model_copy(deep=True)


def billing_mode_for_plan(plan_code: str) -> str:
    return "matter_pack" if _normalize_plan_code(plan_code) == PlanCode.CONSUMER_MATTER_PACK else "workspace_subscription"


def record_usage_event(
    workspace_id: str,
    event_type: str,
    *,
    case_id: str | None = None,
    actor_user_id: str | None = None,
    payload: dict[str, Any] | None = None,
) -> dict[str, Any]:
    normalized = str(event_type or "").strip().lower()
    if normalized not in USAGE_EVENT_TYPES:
        raise ValueError(f"Unsupported usage event: {event_type}")
    event = record_workspace_usage_event(
        workspace_id,
        normalized,
        case_id=case_id,
        actor_user_id=actor_user_id,
        payload=payload,
    )
    if case_id:
        record_case_event(case_id, f"usage.{normalized}", payload or {})
    return event


def _workspace_membership_count(workspace_id: str) -> int:
    return len([item for item in auth_store.all_memberships() if item.workspace_id == workspace_id and item.membership_status == "active"])


def _usage_counters_from_events(workspace_id: str) -> dict[str, int]:
    counters = {key: 0 for key in USAGE_EVENT_TYPES}
    for event in load_workspace_usage_events(workspace_id):
        event_type = str(event.get("event_type") or "").strip().lower()
        if event_type in counters:
            counters[event_type] += 1
    return counters


def _human_review_event_count(cases) -> int:
    total = 0
    for record in cases:
        total += len(record.communications_log or [])
        total += len(record.deadline_overrides or [])
        total += len([item for item in (record.packet_archive or []) if item.release_state in {"approved_for_release", "ready_for_review"}])
    return total


def build_usage_summary(workspace_id: str) -> WorkspaceUsageSummary:
    cases = list_cases(limit=5000, workspace_id=workspace_id, include_internal=False)
    event_counters = _usage_counters_from_events(workspace_id)
    generated_packets = 0
    advanced_exports = 0
    imported_matters = 0
    for record in cases:
        if record.source_files:
            imported_matters += 1
        generated_packets += len(record.packet_archive or [])
        advanced_exports += len([item for item in (record.download_ledger or []) if item.category in {"zip_package", "generated_output"}])
    return WorkspaceUsageSummary(
        active_matters=len(cases),
        imported_matters=imported_matters,
        generated_packets=generated_packets,
        human_review_events=_human_review_event_count(cases),
        portal_collaborators=max(0, _workspace_membership_count(workspace_id) - 1),
        advanced_exports=advanced_exports,
        event_counters=event_counters,
    )


def _locked_features(entitlements: PlanEntitlements) -> list[str]:
    locked: list[str] = []
    if not entitlements.batch_import_enabled:
        locked.append("Batch import for larger account or aging uploads")
    if not entitlements.portal_enabled:
        locked.append("Invite-only portal access for external collaborators")
    if not entitlements.advanced_exports_enabled:
        locked.append("Advanced exports and higher-volume output controls")
    if not entitlements.court_draft_enabled:
        locked.append("Review-gated court draft packs")
    return locked


def _upgrade_prompts(plan_code: str, entitlements: PlanEntitlements, usage: WorkspaceUsageSummary) -> list[CommercialPrompt]:
    prompts: list[CommercialPrompt] = []
    if usage.active_matters >= entitlements.max_active_matters:
        upgrade_to = PlanCode.TEAM if plan_code == PlanCode.STARTER else PlanCode.ENTERPRISE
        prompts.append(
            CommercialPrompt(
                kind="soft_limit",
                title="Active matter volume is at the current plan threshold.",
                message="Upgrade to keep more recovery matters moving at once without forcing archive churn.",
                upgrade_to=upgrade_to,
                metric_key="active_matters",
            )
        )
    if usage.portal_collaborators >= entitlements.seat_limit:
        prompts.append(
            CommercialPrompt(
                kind="soft_limit",
                title="Seat capacity is nearly full.",
                message="Add seats so team members, reviewers, or collaborators can work without sharing one account.",
                upgrade_to=PlanCode.TEAM if plan_code == PlanCode.STARTER else PlanCode.ENTERPRISE,
                metric_key="seat_limit",
            )
        )
    if not entitlements.batch_import_enabled and usage.imported_matters >= 2:
        prompts.append(
            CommercialPrompt(
                kind="feature_lock",
                title="Batch import is locked on the current plan.",
                message="Upgrade when you need to ingest multiple account tables or matter sets with less manual effort.",
                upgrade_to=PlanCode.TEAM,
                metric_key="batch_import_enabled",
            )
        )
    if not entitlements.court_draft_enabled and usage.generated_packets >= 1:
        prompts.append(
            CommercialPrompt(
                kind="feature_lock",
                title="Court draft access stays review-gated on a higher plan.",
                message="Upgrade when the workflow needs court-draft preparation in addition to demand and counsel handoff outputs.",
                upgrade_to=PlanCode.ENTERPRISE,
                metric_key="court_draft_enabled",
            )
        )
    return prompts


def can_view_commercial_details(membership: MembershipRecord | None) -> bool:
    role = str(getattr(membership, "role", "") or "").strip().lower()
    return role in {MembershipRole.SUPER_ADMIN, MembershipRole.ADMIN, MembershipRole.OWNER}


def commercial_snapshot(workspace: WorkspaceRecord, membership: MembershipRecord | None = None) -> WorkspaceCommercialSnapshot:
    plan_code = resolve_plan_code(workspace, membership)
    entitlements = entitlements_for_plan(plan_code)
    usage = build_usage_summary(workspace.id)
    return WorkspaceCommercialSnapshot(
        plan_code=plan_code,
        plan_label=PLAN_LABELS[plan_code],
        billing_mode=billing_mode_for_plan(plan_code),
        value_message=PLAN_VALUE_MESSAGES.get(plan_code),
        entitlements=entitlements,
        usage=usage,
        locked_features=_locked_features(entitlements),
        upgrade_prompts=_upgrade_prompts(plan_code, entitlements, usage),
        can_view_usage_details=can_view_commercial_details(membership),
    )


def safe_commercial_payload(workspace: WorkspaceRecord, membership: MembershipRecord | None = None) -> dict[str, Any]:
    snapshot = commercial_snapshot(workspace, membership)
    return snapshot.model_dump(mode="json")
