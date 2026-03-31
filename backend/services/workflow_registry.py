from __future__ import annotations

from dataclasses import dataclass, field


@dataclass
class WorkflowDef:
    slug: str
    name: str
    category: str
    route: str
    description: str
    entry_mode: str
    funnel_stage: str = "build"
    public_order: int = 999
    required_inputs: list[str] = field(default_factory=list)
    supported_outputs: list[str] = field(default_factory=list)
    mobile_camera_first: bool = False
    price_hint: str | None = None
    enabled: bool = True
    public_catalog: bool = True


WORKFLOW_DEFS: list[WorkflowDef] = [
    WorkflowDef(
        slug="invoice_recovery",
        name="Recovery Diagnostic",
        category="Recovery Workspace",
        route="/app/invoice-recovery/",
        description="Open a controlled recovery intake, upload invoices and debtor support, and route the matter into Action Center.",
        entry_mode="case_bound",
        funnel_stage="upload",
        public_order=1,
        required_inputs=["contract", "invoices", "emails"],
        supported_outputs=["action_summary", "evidence_checklist", "demand_path"],
        price_hint="$149+",
    ),
    WorkflowDef(
        slug="contract_risk",
        name="Contract Risk Scanner",
        category="Contracts",
        route="/app/contract-intelligence/",
        description="Upload a contract or guaranty and review strong clauses, weak clauses, missing protections, and practical commentary.",
        entry_mode="standalone_session",
        required_inputs=["contract_pdf"],
        supported_outputs=["risk_summary", "change_memo"],
        price_hint="$79+",
        public_catalog=False,
    ),
    WorkflowDef(
        slug="stronger_contract",
        name="Stronger Contract Generator",
        category="Contracts",
        route="/app/best-contract-builder/",
        description="Generate a stronger contract version and a detailed change memo while preserving the deal intent.",
        entry_mode="standalone_session",
        required_inputs=["contract_pdf"],
        supported_outputs=["revised_contract", "change_memo"],
        price_hint="$149+",
        public_catalog=False,
    ),
    WorkflowDef(
        slug="auto_deal_integrity",
        name="Auto Deal Integrity",
        category="Auto",
        route="/app/dealer-contract-check/",
        description="Review VIN identity, deal structure, add-ons, and pricing references with honest provider status.",
        entry_mode="standalone_session",
        required_inputs=["vin", "mileage", "buyer_order_optional"],
        supported_outputs=["deal_audit", "branded_pdf"],
        mobile_camera_first=True,
        price_hint="$49+",
        public_catalog=False,
    ),
    WorkflowDef(
        slug="immigration_forms",
        name="Immigration Forms Studio",
        category="Immigration",
        route="/app/immigration-forms/",
        description="Collect structured intake values, map them to form fields, and generate a review-ready PDF draft.",
        entry_mode="standalone_session",
        required_inputs=["form_pdf"],
        supported_outputs=["filled_pdf", "evidence_checklist"],
        mobile_camera_first=True,
        price_hint="$59+",
        public_catalog=False,
    ),
    WorkflowDef(
        slug="entity_verification",
        name="Debtor Verification",
        category="Recovery Workspace",
        route="/app/entity-verification/",
        description="Review debtor identity, public registry signals, and entity evidence for the active recovery matter.",
        entry_mode="case_bound",
        funnel_stage="diagnose",
        public_order=3,
        required_inputs=["entity_name"],
        supported_outputs=["registry_summary"],
    ),
    WorkflowDef(
        slug="evidence_audit",
        name="Evidence Review",
        category="Recovery Workspace",
        route="/app/evidence-audit/",
        description="Inspect blockers, warnings, and evidence gaps before demand generation or counsel handoff.",
        entry_mode="case_bound",
        funnel_stage="diagnose",
        public_order=2,
        required_inputs=["case_files"],
        supported_outputs=["readiness_review"],
    ),
    WorkflowDef(
        slug="demand_pack",
        name="Demand Pack",
        category="Recovery Workspace",
        route="/app/action-center/",
        description="Review the next recovery step, deadlines, contacts, and packet readiness before export.",
        entry_mode="case_bound",
        funnel_stage="build",
        public_order=4,
        required_inputs=["case_files"],
        supported_outputs=["demand_packet", "contact_path", "packet_status"],
    ),
    WorkflowDef(
        slug="counsel_handoff",
        name="Counsel Handoff",
        category="Recovery Workspace",
        route="/app/downloads/",
        description="Prepare the matter record, downloads, and output bundle for downstream counsel or internal review.",
        entry_mode="case_bound",
        funnel_stage="build",
        public_order=5,
        required_inputs=["case_files"],
        supported_outputs=["handoff_bundle", "downloads"],
    ),
    WorkflowDef(
        slug="irs_notice",
        name="IRS Notice Builder",
        category="Notices",
        route="/app/irs-notice/",
        description="Review a notice summary, detected deadlines, and the next response path for the active IRS matter.",
        entry_mode="case_bound",
        required_inputs=["irs_notice_pdf"],
        supported_outputs=["notice_summary", "response_packet", "deadline_review"],
        mobile_camera_first=True,
        price_hint="$29+",
        enabled=True,
        public_catalog=False,
    ),
    WorkflowDef(
        slug="debt_defense",
        name="Debt Collection Defense",
        category="Debt & Credit",
        route="/app/services/",
        description="Review collection notices, dispute paths, validation options, and settlement routes.",
        entry_mode="upload_first",
        required_inputs=["collection_notice"],
        supported_outputs=["dispute_path", "validation_letter"],
        mobile_camera_first=True,
        price_hint="$39+",
        enabled=False,
        public_catalog=False,
    ),
    WorkflowDef(
        slug="credit_recovery",
        name="Credit Error Recovery",
        category="Debt & Credit",
        route="/app/services/",
        description="Build evidence-based credit reporting and identity theft correction workflows.",
        entry_mode="upload_first",
        required_inputs=["credit_report"],
        supported_outputs=["dispute_packet"],
        price_hint="$59+",
        enabled=False,
        public_catalog=False,
    ),
    WorkflowDef(
        slug="permit_navigator",
        name="Permit Navigator",
        category="Permits & Business",
        route="/app/services/",
        description="Map the permit path, required departments, and the filing order for a project or business launch.",
        entry_mode="guided_intake",
        required_inputs=["address", "activity_type"],
        supported_outputs=["permit_map"],
        price_hint="$49+",
        enabled=False,
        public_catalog=False,
    ),
    WorkflowDef(
        slug="business_launch",
        name="Business Launch OS",
        category="Permits & Business",
        route="/app/services/",
        description="Build an organized launch checklist for entity setup, permits, core contracts, and compliance tracking.",
        entry_mode="guided_intake",
        required_inputs=["business_type", "state"],
        supported_outputs=["launch_plan"],
        price_hint="$99+",
        enabled=False,
        public_catalog=False,
    ),
]

WORKFLOW_MAP = {item.slug: item for item in WORKFLOW_DEFS}


def get_workflow(slug: str | None) -> WorkflowDef | None:
    if not slug:
        return None
    return WORKFLOW_MAP.get(str(slug))


def enabled_workflows() -> list[WorkflowDef]:
    return [item for item in WORKFLOW_DEFS if item.enabled]


def disabled_workflows() -> list[WorkflowDef]:
    return [item for item in WORKFLOW_DEFS if not item.enabled]


def catalog_workflows() -> list[WorkflowDef]:
    return sorted(
        [item for item in WORKFLOW_DEFS if item.enabled and item.public_catalog],
        key=lambda item: (int(item.public_order), str(item.name)),
    )
