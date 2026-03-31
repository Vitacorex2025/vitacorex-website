from __future__ import annotations

from datetime import datetime, timezone
from decimal import Decimal
from enum import Enum
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class FileType(str, Enum):
    CONTRACT_PDF = "contract_pdf"
    GUARANTY_PDF = "guaranty_pdf"
    INVOICE_EXCEL = "invoice_excel"
    INVOICE_CSV = "invoice_csv"
    INVOICE_PDF = "invoice_pdf"
    ACCOUNT_STATEMENT_PDF = "account_statement_pdf"
    SUPPORTING_EXHIBIT = "supporting_exhibit"
    TEMPLATE_DOCX = "template_docx"
    UNKNOWN = "unknown"


class PartyRole(str, Enum):
    PLAINTIFF = "plaintiff"
    DEFENDANT_ENTITY = "defendant_entity"
    PERSONAL_GUARANTOR = "personal_guarantor"
    OFFICER = "officer"
    REGISTERED_AGENT = "registered_agent"
    UNKNOWN = "unknown"


class FloridaCourtLevel(str, Enum):
    SMALL_CLAIMS = "small_claims"
    COUNTY_CIVIL = "county_civil"
    CIRCUIT_CIVIL = "circuit_civil"
    UNDETERMINED = "undetermined"


class CaseStatus(str, Enum):
    DRAFT = "draft"
    UPLOADED = "uploaded"
    EXTRACTED = "extracted"
    BLOCKED = "blocked"
    READY_FOR_VERIFICATION = "ready_for_verification"
    VERIFIED = "verified"
    READY_FOR_GENERATION = "ready_for_generation"
    GENERATING = "generating"
    PACKET_GENERATED = "packet_generated"
    GENERATION_FAILED = "generation_failed"


class WorkflowStage(str, Enum):
    DRAFT = "draft"
    UPLOADED = "uploaded"
    CLASSIFIED = "classified"
    ROUTE_READY = "route_ready"
    AWAITING_SUPPORTING_DOCS = "awaiting_supporting_docs"
    PACKET_READY = "packet_ready"
    SENT = "sent"
    FOLLOWUP_PENDING = "followup_pending"
    CLOSED = "closed"


class PartyDetails(BaseModel):
    party_name: str | None = None
    entity_type: str | None = None
    party_role: PartyRole = PartyRole.UNKNOWN
    address: str | None = None
    email: str | None = None
    phone: str | None = None
    source_evidence: list[str] = Field(default_factory=list)


class VenueDetails(BaseModel):
    venue_clause: str | None = None
    venue_state: str | None = None
    venue_county: str | None = None
    source_document_type: str | None = None
    selection_source: str | None = None
    selection_confidence: float | None = None
    venue_paragraph: str | None = None


class CountyCandidate(BaseModel):
    county: str
    source: str
    evidence: str | None = None
    confidence: float = 0.0


class InvoiceLineItem(BaseModel):
    invoice_number: str | None = None
    invoice_date: str | None = None
    due_date: str | None = None
    customer_name: str | None = None
    original_amount: Decimal = Decimal("0.00")
    balance_due: Decimal = Decimal("0.00")
    raw_original_amount_text: str | None = None
    raw_balance_due_text: str | None = None
    parse_confidence: float = 1.0
    parse_warning: str | None = None
    included_in_total: bool = True
    currency: str = "USD"
    source_sheet: str | None = None
    source_row: int | None = None
    source_filename: str | None = None
    source_kind: str | None = None


class InvoiceSummary(BaseModel):
    source_filename: str | None = None
    source_priority_used: str | None = None
    invoice_count: int = 0
    total_original_amount: Decimal = Decimal("0.00")
    total_balance_due: Decimal = Decimal("0.00")
    math_verified: bool = False
    warnings: list[str] = Field(default_factory=list)
    conflicts: list[str] = Field(default_factory=list)
    line_items: list[InvoiceLineItem] = Field(default_factory=list)


class FloridaCourtDecision(BaseModel):
    court_level: FloridaCourtLevel = FloridaCourtLevel.UNDETERMINED
    court_division_label: str | None = None
    amount_in_controversy: Decimal = Decimal("0.00")
    venue_county: str | None = None
    reasoning: list[str] = Field(default_factory=list)


class SunbizOfficer(BaseModel):
    officer_name: str | None = None
    officer_title: str | None = None
    officer_address: str | None = None


class SunbizSearchCandidate(BaseModel):
    result_index: int
    result_name: str
    result_status: str | None = None
    detail_url: str | None = None
    document_number: str | None = None
    match_score: float | None = None


class SunbizLookupResult(BaseModel):
    queried_entity_name: str | None = None
    matched: bool = False
    exact_match: bool = False
    match_score: float | None = None
    matched_entity_name: str | None = None
    detail_url: str | None = None
    florida_document_number: str | None = None
    fein_number: str | None = None
    entity_status: str | None = None
    entity_type: str | None = None
    principal_address: str | None = None
    mailing_address: str | None = None
    registered_agent_name: str | None = None
    registered_agent_address: str | None = None
    officers: list[SunbizOfficer] = Field(default_factory=list)
    search_candidates: list[SunbizSearchCandidate] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)
    looked_up_at: datetime | None = None
    source_url: str | None = None
    pdf_report_path: str | None = None
    pdf_download_url: str | None = None
    provider_status: str | None = None
    result_classification: str | None = None
    official_record_available: bool = False
    evidence_package_path: str | None = None
    evidence_download_url: str | None = None
    search_capture_path: str | None = None
    detail_capture_path: str | None = None
    source_capture_downloads: list[str] = Field(default_factory=list)
    official_source_urls: list[str] = Field(default_factory=list)


class StoredFile(BaseModel):
    id: str
    filename: str
    original_filename: str
    workspace_id: str | None = None
    matter_id: str | None = None
    content_type: str | None = None
    file_type: FileType = FileType.UNKNOWN
    storage_path: str
    size_bytes: int = 0
    extraction_version: int | None = None
    extraction_quality_score: float = 0.0
    extraction_status: str = "pending"
    extraction_method: str | None = None
    extraction_report: dict[str, Any] = Field(default_factory=dict)
    extracted_text: str | None = None
    parsed_payload: dict[str, Any] | None = None
    normalized_evidence: dict[str, Any] | None = None
    warnings: list[str] = Field(default_factory=list)
    uploaded_at: datetime = Field(default_factory=_utcnow)
    template_slot: str | None = None
    sha256: str | None = None
    excluded_from_active_matter: bool = False
    exclusion_reason: str | None = None
    scope_type: str = "matter"
    service_scope: str | None = None


class LegalCountDecision(BaseModel):
    code: str
    label: str
    supported: bool = False
    reason: str | None = None


class MatterConflictDetail(BaseModel):
    source_filename: str
    conflict_type: str
    entities: list[str] = Field(default_factory=list)


class MatterConsistencyReport(BaseModel):
    status: str = "pending"
    anchor_plaintiff_name: str | None = None
    anchor_debtor_name: str | None = None
    detected_debtor_entities: list[str] = Field(default_factory=list)
    detected_plaintiff_entities: list[str] = Field(default_factory=list)
    detected_guarantors: list[str] = Field(default_factory=list)
    source_set_used: list[str] = Field(default_factory=list)
    excluded_sources: list[str] = Field(default_factory=list)
    blockers: list[str] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)
    conflicts: list[MatterConflictDetail] = Field(default_factory=list)


class AmountReconciliation(BaseModel):
    status: str = "pending"
    spreadsheet_total: Decimal = Decimal("0.00")
    invoice_pdf_total: Decimal = Decimal("0.00")
    approved_total: Decimal = Decimal("0.00")
    spreadsheet_invoice_count: int = 0
    invoice_pdf_count: int = 0
    used_invoice_count: int = 0
    excluded_low_confidence_rows: int = 0
    warnings: list[str] = Field(default_factory=list)
    blockers: list[str] = Field(default_factory=list)
    source_pdf_total: Decimal = Decimal("0.00")
    source_spreadsheet_total: Decimal = Decimal("0.00")
    approved_reconciled_total: Decimal = Decimal("0.00")
    case_summary_total: Decimal = Decimal("0.00")
    review_approved: bool = False
    excluded_sources: list[str] = Field(default_factory=list)


class DebtCaseExtraction(BaseModel):
    plaintiff: PartyDetails = Field(default_factory=lambda: PartyDetails(party_role=PartyRole.PLAINTIFF))
    defendant_entity: PartyDetails = Field(default_factory=lambda: PartyDetails(party_role=PartyRole.DEFENDANT_ENTITY))
    personal_guarantor: PartyDetails | None = None
    venue: VenueDetails = Field(default_factory=VenueDetails)
    county_candidates: list[CountyCandidate] = Field(default_factory=list)
    invoice_summary: InvoiceSummary = Field(default_factory=InvoiceSummary)
    amount_in_controversy: Decimal = Decimal("0.00")
    florida_court: FloridaCourtDecision = Field(default_factory=FloridaCourtDecision)
    governing_law: str | None = None
    payment_terms: str | None = None
    default_terms: str | None = None
    interest_terms: str | None = None
    service_address: str | None = None
    business_address: str | None = None
    contract_execution_location: str | None = None
    separate_summons_required: bool = False
    contract_evidence: list[str] = Field(default_factory=list)
    guaranty_evidence: list[str] = Field(default_factory=list)
    legal_counts: list[LegalCountDecision] = Field(default_factory=list)
    source_conflicts: list[str] = Field(default_factory=list)
    missing_required_facts: list[str] = Field(default_factory=list)
    review_flags: list[str] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)
    matter_consistency: MatterConsistencyReport = Field(default_factory=MatterConsistencyReport)
    amount_reconciliation: AmountReconciliation = Field(default_factory=AmountReconciliation)
    source_set_used: list[str] = Field(default_factory=list)
    recovery_truth: dict[str, Any] = Field(default_factory=dict)
    processed_at: datetime | None = None


class GeneratedDocument(BaseModel):
    document_name: str
    document_path: str | None = None
    document_type: str
    download_url: str | None = None
    status: str = "generated"
    blocking_reason: str | None = None


class GenerationProgressItem(BaseModel):
    document_type: str
    document_name: str
    status: str = "queued"
    blocking_reason: str | None = None
    download_url: str | None = None


class GenerationProgress(BaseModel):
    job_id: str | None = None
    status: str = "idle"
    message: str | None = None
    selected_document_types: list[str] = Field(default_factory=list)
    total_documents: int = 0
    completed_documents: int = 0
    progress_percent: float = 0.0
    current_document_type: str | None = None
    current_document_name: str | None = None
    items: list[GenerationProgressItem] = Field(default_factory=list)
    blocking_items: list[str] = Field(default_factory=list)
    started_at: datetime | None = None
    finished_at: datetime | None = None



class EntityVerificationOfficer(BaseModel):
    name: str | None = None
    title: str | None = None
    address: str | None = None


class EntityVerificationResult(BaseModel):
    queried_entity: str | None = None
    normalized_entity: str | None = None
    state: str | None = None
    provider: str | None = None
    status: str | None = None
    classification: str | None = None
    match_confidence: float | None = None
    matched_entity_name: str | None = None
    entity_number_or_document_number: str | None = None
    entity_type: str | None = None
    good_standing_or_status: str | None = None
    registered_agent_name: str | None = None
    registered_agent_address: str | None = None
    public_officers_or_managers: list[EntityVerificationOfficer] = Field(default_factory=list)
    source_urls: list[str] = Field(default_factory=list)
    official_certificate_available: bool = False
    warnings: list[str] = Field(default_factory=list)
    provider_limitations: list[str] = Field(default_factory=list)
    raw_capture_metadata: dict[str, Any] = Field(default_factory=dict)
    looked_up_at: datetime | None = None


class JurisdictionOption(BaseModel):
    forum_state: str | None = None
    forum_county: str | None = None
    label: str | None = None
    rank: int = 0
    confidence_score: float = 0.0
    reasons: list[str] = Field(default_factory=list)
    blockers: list[str] = Field(default_factory=list)
    service_method_notes: list[str] = Field(default_factory=list)
    state_pack_available: bool = False


class JurisdictionAnalysisResult(BaseModel):
    recommended_forum: JurisdictionOption | None = None
    alternate_forum: JurisdictionOption | None = None
    ranked_forums: list[JurisdictionOption] = Field(default_factory=list)
    reason_summary: list[str] = Field(default_factory=list)
    blockers: list[str] = Field(default_factory=list)
    service_notes: list[str] = Field(default_factory=list)
    arbitration_override: bool = False
    generated_at: datetime | None = None


class DownloadLedgerEntry(BaseModel):
    id: str
    category: str = "generated_output"
    file_name: str
    file_path: str | None = None
    download_url: str | None = None
    generated_at: datetime = Field(default_factory=_utcnow)
    downloaded_at: datetime | None = None
    available: bool = True
    metadata: dict[str, Any] = Field(default_factory=dict)
    owner_kind: str = "case"
    owner_id: str | None = None
    service_slug: str | None = None


class DeadlineItem(BaseModel):
    type: str
    label: str
    date: str | None = None
    urgency: str = "medium"
    confidence: float | None = None
    source_excerpt: str | None = None
    source_file: str | None = None
    source_kind: str = "detected"
    override_reason: str | None = None
    actor_label: str | None = None
    created_at: datetime | None = None


class CommunicationLogEntry(BaseModel):
    id: str
    entry_type: str = "manual_note"
    channel: str = "internal_note"
    direction: str = "internal"
    summary: str
    body: str | None = None
    actor_user_id: str | None = None
    actor_label: str | None = None
    related_packet_version: int | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=_utcnow)


class SettlementTrackerEntry(BaseModel):
    id: str
    proposal_type: str = "settlement_offer"
    status: str = "draft"
    title: str | None = None
    summary: str | None = None
    term_summary: str | None = None
    proposed_amount: Decimal | None = None
    proposed_payment_count: int | None = None
    proposed_first_payment_date: str | None = None
    linked_route_status: str | None = None
    reason_codes: list[str] = Field(default_factory=list)
    actor_user_id: str | None = None
    actor_label: str | None = None
    created_at: datetime = Field(default_factory=_utcnow)
    updated_at: datetime = Field(default_factory=_utcnow)


class DeadlineOverrideRecord(BaseModel):
    id: str
    deadline_type: str = "deadline"
    label: str
    date: str | None = None
    reason: str | None = None
    actor_user_id: str | None = None
    actor_label: str | None = None
    created_at: datetime = Field(default_factory=_utcnow)


class PacketArchiveEntry(BaseModel):
    id: str
    version_number: int
    created_at: datetime = Field(default_factory=_utcnow)
    updated_at: datetime = Field(default_factory=_utcnow)
    generation_qa_status: str = "ready_for_review"
    release_state: str = "ready_for_review"
    review_required: bool = True
    is_court_draft: bool = False
    selected_document_types: list[str] = Field(default_factory=list)
    document_types: list[str] = Field(default_factory=list)
    document_count: int = 0
    zip_path: str | None = None
    zip_download_url: str | None = None
    warning_count: int = 0
    summary: str | None = None
    reviewed_by_user_id: str | None = None
    reviewed_by_label: str | None = None


class LinkedOperationalRecord(BaseModel):
    case_id: str
    environment_tag: str = "recovery"
    record_type: str = "recovery_record"
    relationship_type: str = "linked_operational_record"
    title: str | None = None
    status: str | None = None
    current_stage: str | None = None
    created_at: datetime = Field(default_factory=_utcnow)


class PortalAccessConfig(BaseModel):
    enabled: bool = False
    mode: str = "invite_only"
    signed_link_only: bool = True
    read_only: bool = True
    upload_request_enabled: bool = True
    ui_enabled: bool = False
    status_label: str = "deferred_for_safe_release"


class OfficialContact(BaseModel):
    authority_name: str
    department_name: str | None = None
    phone: str | None = None
    webform: str | None = None
    mailing_address: str | None = None
    escalation_level: int = 1
    required_docs: list[str] = Field(default_factory=list)
    status: str = "seeded"


class SourceFact(BaseModel):
    label: str
    value: str | None = None
    source_file: str | None = None
    source_excerpt: str | None = None
    confidence: float | None = None


class ActionPacketOutput(BaseModel):
    type: str
    label: str | None = None
    status: str = "available"
    download_url: str | None = None
    file_path: str | None = None
    owner_kind: str | None = None
    owner_id: str | None = None
    service_slug: str | None = None


class ContractClauseFinding(BaseModel):
    clause_type: str
    title: str
    finding_kind: str = "review"
    extracted_text: str | None = None
    source_file: str | None = None
    page_hint: str | None = None
    confidence: float = 0.0
    extraction_certainty: float = 0.0
    legal_certainty: float = 0.0
    risk_severity: str = "info"
    practical_implication: str | None = None
    recommended_correction: str | None = None
    why_it_matters: str | None = None
    what_can_go_wrong: str | None = None
    how_to_improve: str | None = None
    fallback_language: str | None = None
    legal_rationale: str | None = None
    jurisdiction_note: str | None = None


class ContractReviewResult(BaseModel):
    status: str = "not_run"
    findings: list[ContractClauseFinding] = Field(default_factory=list)
    summary: list[str] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)
    jurisdiction_warnings: list[str] = Field(default_factory=list)
    revised_contract_path: str | None = None
    revised_contract_download_url: str | None = None
    change_memo_path: str | None = None
    change_memo_download_url: str | None = None
    generated_at: datetime | None = None



class CanonicalCaseSnapshot(BaseModel):
    case_id: str | None = None
    matter_label: str | None = None
    selected_matter: str | None = None
    mode: str = "case"
    source_file_count: int = 0
    source_set_count: int = 0
    plaintiff_name: str | None = None
    defendant_name: str | None = None
    guarantor_name: str | None = None
    plaintiff: str | None = None
    defendant: str | None = None
    guarantor: str | None = None
    governing_law: str | None = None
    venue_county: str | None = None
    court_level: str | None = None
    draft_amount: Decimal = Decimal("0.00")
    extracted_amount: Decimal = Decimal("0.00")
    approved_amount: Decimal = Decimal("0.00")
    display_amount: Decimal = Decimal("0.00")
    status: str = "draft"
    readiness: str = "waiting_on_source_evidence"
    next_action: str | None = None
    route_status: str | None = None
    route_reason_codes: list[str] = Field(default_factory=list)
    readiness_score: float = 0.0
    blocker_count: int = 0
    warning_count: int = 0
    blockers: list[str] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)
    sunbiz_state: str = "not_run"
    generated_documents: list[dict[str, Any]] = Field(default_factory=list)
    generated_document_count: int = 0
    has_zip: bool = False
    packet_generation_allowed: bool = False
    verification_required: bool = True
    verification_report_available: bool = False
    recent_activity: list[dict[str, Any]] = Field(default_factory=list)

class FormsEngineRecord(BaseModel):
    form_family: str | None = None
    form_id: str | None = None
    jurisdiction: str | None = None
    agency_or_court: str | None = None
    edition_version: str | None = None
    template_type: str | None = None
    required_fields: list[str] = Field(default_factory=list)
    validation_rules: list[str] = Field(default_factory=list)
    review_required: bool = True



class PacketGenerationResult(BaseModel):
    generated_at: datetime = Field(default_factory=_utcnow)
    documents: list[GeneratedDocument] = Field(default_factory=list)
    zip_path: str | None = None
    download_url: str | None = None
    warnings: list[str] = Field(default_factory=list)
    selected_document_types: list[str] = Field(default_factory=list)
    summary: str | None = None
    version_number: int = 0
    generation_qa_status: str = "ready_for_review"
    release_state: str = "ready_for_review"
    review_required: bool = True
    is_court_draft: bool = False
    archive_entry_id: str | None = None


class CaseRecord(BaseModel):
    model_config = ConfigDict(use_enum_values=True)

    id: str
    workspace_id: str | None = None
    created_by_user_id: str | None = None
    environment_tag: str = "recovery"
    record_type: str = "recovery_record"
    reference: str | None = None
    title: str | None = None
    status: CaseStatus = CaseStatus.DRAFT
    current_extraction_version: int = 0
    workflow_slug: str | None = None
    issue_category: str | None = None
    intake_channel: str | None = None
    current_stage: str | None = None
    urgency_level: str | None = None
    recommended_paths: list[str] = Field(default_factory=list)
    deadlines: list[DeadlineItem] = Field(default_factory=list)
    official_contacts: list[OfficialContact] = Field(default_factory=list)
    source_map: list[SourceFact] = Field(default_factory=list)
    action_packet_status: str | None = None
    action_packet_outputs: list[ActionPacketOutput] = Field(default_factory=list)
    workflow_payload: dict[str, Any] = Field(default_factory=dict)
    source_files: list[StoredFile] = Field(default_factory=list)
    template_files: list[StoredFile] = Field(default_factory=list)
    extracted_case_data: DebtCaseExtraction = Field(default_factory=DebtCaseExtraction)
    sunbiz_lookup: SunbizLookupResult | None = None
    entity_verification: EntityVerificationResult | None = None
    jurisdiction_analysis: JurisdictionAnalysisResult | None = None
    contract_review: ContractReviewResult | None = None
    forms_engine: list[FormsEngineRecord] = Field(default_factory=list)
    client_snapshot: CanonicalCaseSnapshot = Field(default_factory=CanonicalCaseSnapshot)
    packet_generation: PacketGenerationResult | None = None
    generation_progress: GenerationProgress | None = None
    download_ledger: list[DownloadLedgerEntry] = Field(default_factory=list)
    linked_records: list[LinkedOperationalRecord] = Field(default_factory=list)
    communications_log: list[CommunicationLogEntry] = Field(default_factory=list)
    settlement_tracker: list[SettlementTrackerEntry] = Field(default_factory=list)
    deadline_overrides: list[DeadlineOverrideRecord] = Field(default_factory=list)
    packet_archive: list[PacketArchiveEntry] = Field(default_factory=list)
    portal_access: PortalAccessConfig = Field(default_factory=PortalAccessConfig)
    notes: list[str] = Field(default_factory=list)
    is_test: bool = False
    is_fixture: bool = False
    is_internal_diagnostic: bool = False
    archived_at: datetime | None = None
    deleted_at: datetime | None = None
    created_at: datetime = Field(default_factory=_utcnow)
    updated_at: datetime = Field(default_factory=_utcnow)


class RecoveryIntakeSession(BaseModel):
    id: str
    workspace_id: str | None = None
    created_by_user_id: str | None = None
    title: str | None = None
    entry_workflow: str | None = None
    preview_case: CaseRecord
    promoted_case_id: str | None = None
    created_at: datetime = Field(default_factory=_utcnow)
    updated_at: datetime = Field(default_factory=_utcnow)
