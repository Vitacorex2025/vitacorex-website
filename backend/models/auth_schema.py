from __future__ import annotations

from datetime import datetime, timezone

from pydantic import BaseModel, ConfigDict, Field


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class UserStatus:
    ACTIVE = "active"
    DISABLED = "disabled"


class MembershipRole:
    SUPER_ADMIN = "super_admin"
    ADMIN = "admin"
    OWNER = "owner"
    OPERATOR = "operator"
    REVIEWER = "reviewer"
    VIEWER = "viewer"


class MembershipStatus:
    ACTIVE = "active"


class WorkspaceStatus:
    ACTIVE = "active"


class PlanCode:
    STARTER = "starter"
    TEAM = "team"
    ENTERPRISE = "enterprise"
    CONSUMER_MATTER_PACK = "consumer_matter_pack"


class UserRecord(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str
    email: str
    password_hash: str
    first_name: str = ""
    last_name: str = ""
    title: str = ""
    status: str = UserStatus.ACTIVE
    preferred_language: str = "en"
    created_at: datetime = Field(default_factory=utcnow)
    updated_at: datetime = Field(default_factory=utcnow)


class WorkspaceRecord(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str
    name: str
    slug: str
    owner_user_id: str
    status: str = WorkspaceStatus.ACTIVE
    is_personal: bool = True
    branding_name: str = "DocketMint"
    created_at: datetime = Field(default_factory=utcnow)
    updated_at: datetime = Field(default_factory=utcnow)


class MembershipRecord(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str
    workspace_id: str
    user_id: str
    role: str = MembershipRole.OWNER
    membership_status: str = MembershipStatus.ACTIVE
    joined_at: datetime = Field(default_factory=utcnow)
    last_active_at: datetime = Field(default_factory=utcnow)
    created_at: datetime = Field(default_factory=utcnow)
    updated_at: datetime = Field(default_factory=utcnow)


class SessionRecord(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str
    user_id: str
    workspace_id: str
    user_agent: str | None = None
    ip_address: str | None = None
    created_at: datetime = Field(default_factory=utcnow)
    last_seen_at: datetime = Field(default_factory=utcnow)
    revoked_at: datetime | None = None


class SessionContext(BaseModel):
    user: UserRecord
    workspace: WorkspaceRecord
    membership: MembershipRecord
    session: SessionRecord


class PlanEntitlements(BaseModel):
    max_active_matters: int
    batch_import_enabled: bool = False
    human_review_enabled: bool = True
    court_draft_enabled: bool = False
    portal_enabled: bool = False
    seat_limit: int = 1
    advanced_exports_enabled: bool = False


class WorkspaceUsageSummary(BaseModel):
    active_matters: int = 0
    imported_matters: int = 0
    generated_packets: int = 0
    human_review_events: int = 0
    portal_collaborators: int = 0
    advanced_exports: int = 0
    event_counters: dict[str, int] = Field(default_factory=dict)


class CommercialPrompt(BaseModel):
    kind: str = "soft_limit"
    title: str
    message: str
    upgrade_to: str | None = None
    metric_key: str | None = None


class WorkspaceCommercialSnapshot(BaseModel):
    plan_code: str = PlanCode.STARTER
    plan_label: str = "Starter"
    billing_mode: str = "workspace_subscription"
    value_message: str | None = None
    entitlements: PlanEntitlements
    usage: WorkspaceUsageSummary = Field(default_factory=WorkspaceUsageSummary)
    locked_features: list[str] = Field(default_factory=list)
    upgrade_prompts: list[CommercialPrompt] = Field(default_factory=list)
    can_view_usage_details: bool = False
