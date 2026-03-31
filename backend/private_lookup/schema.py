"""
VitaCoreX Private Lookup — Pydantic v2 schema definitions.

All models use strict types. No secrets or PII in any model
that is serialized to the client. Session tokens are opaque
signed strings; lookup results never contain raw user input.
"""
from __future__ import annotations

import os
from datetime import datetime
from enum import Enum
from typing import Literal, Optional

from pydantic import BaseModel, Field, field_validator


# ---------------------------------------------------------------------------
# Enumerations
# ---------------------------------------------------------------------------

class LookupTab(str, Enum):
    TOLLS = "tolls"
    TRAFFIC = "traffic"
    COURTS = "courts"
    UPLOAD = "upload"


class ResultState(str, Enum):
    FOUND = "found"
    EMPTY = "empty"
    OFFICIAL_HANDOFF = "official_handoff"
    OFFICIAL_ROUTING = "official_routing"
    BLOCKED = "blocked"
    ERROR = "error"
    PENDING_PAYMENT = "pending_payment"


class SourceType(str, Enum):
    FLORIDA_SUNPASS = "florida_sunpass"
    FLORIDA_FLHSMV = "florida_flhsmv"
    FLORIDA_ACIS = "florida_acis"
    FLORIDA_COUNTY_CLERK = "florida_county_clerk"
    PACER_FEDERAL = "pacer_federal"
    EXTRACTED_DOCUMENT = "extracted_document"


class ObligationType(str, Enum):
    TOLL = "toll"
    TRAFFIC_CITATION = "traffic_citation"
    COURT_CASE = "court_case"
    UNKNOWN = "unknown"


class RoleFilter(str, Enum):
    ANY = "any"
    PLAINTIFF = "plaintiff"
    DEFENDANT = "defendant"
    PETITIONER = "petitioner"
    RESPONDENT = "respondent"


# ---------------------------------------------------------------------------
# Request models
# ---------------------------------------------------------------------------

class TollsLookupFields(BaseModel):
    plate_number: Optional[str] = Field(None, max_length=12, description="License plate number")
    plate_state: Optional[str] = Field(None, max_length=2, description="Two-letter US state code")
    zip_code: Optional[str] = Field(None, max_length=10, description="ZIP code for account lookup")
    invoice_number: Optional[str] = Field(None, max_length=30, description="SunPass invoice or citation number")

    @field_validator("plate_state")
    @classmethod
    def normalize_state(cls, v: Optional[str]) -> Optional[str]:
        return v.upper().strip() if v else v

    @field_validator("plate_number")
    @classmethod
    def normalize_plate(cls, v: Optional[str]) -> Optional[str]:
        return v.upper().strip() if v else v


class TrafficLookupFields(BaseModel):
    fl_county: str = Field(..., max_length=60, description="Florida county name")
    citation_number: str = Field(..., max_length=30, description="Citation or uniform traffic citation number")

    @field_validator("citation_number")
    @classmethod
    def normalize_citation(cls, v: str) -> str:
        return v.upper().strip()


class CourtLookupFields(BaseModel):
    full_name: str = Field(..., max_length=120, description="Full legal name of party")
    state: str = Field(default="FL", max_length=2, description="State (default FL)")
    county: Optional[str] = Field(None, max_length=60, description="County for county court search")
    case_number: Optional[str] = Field(None, max_length=40, description="Optional case number")
    role_filter: RoleFilter = Field(default=RoleFilter.ANY, description="Party role filter")

    @field_validator("state")
    @classmethod
    def normalize_state(cls, v: str) -> str:
        return v.upper().strip()


class LookupRequest(BaseModel):
    tab: LookupTab
    session_token: str = Field(..., min_length=20, description="Signed session token from verify-payment")
    tolls: Optional[TollsLookupFields] = None
    traffic: Optional[TrafficLookupFields] = None
    courts: Optional[CourtLookupFields] = None
    consent_acknowledged: bool = Field(..., description="User must acknowledge consent before lookup")

    @field_validator("consent_acknowledged")
    @classmethod
    def must_consent(cls, v: bool) -> bool:
        if not v:
            raise ValueError("Consent must be acknowledged before performing a lookup.")
        return v


# ---------------------------------------------------------------------------
# Result models
# ---------------------------------------------------------------------------

class LookupResult(BaseModel):
    obligation_type: ObligationType
    source_name: str = Field(..., description="Human-readable source name, e.g. 'Florida SunPass'")
    source_type: SourceType
    jurisdiction: str = Field(..., description="State/county/federal identifier")
    status: str = Field(..., description="Human-readable status, e.g. 'Unpaid', 'Paid', 'Active'")
    amount_due: Optional[str] = Field(None, description="Formatted amount, e.g. '$42.50'. None if unknown.")
    due_date: Optional[str] = Field(None, description="ISO date string or human-readable date")
    case_number: Optional[str] = None
    court: Optional[str] = None
    role: Optional[str] = None
    summary: str = Field(..., description="1-2 sentence plain English summary of the result")
    official_record_url: Optional[str] = Field(None, description="URL to the official record (government source)")
    official_payment_url: Optional[str] = Field(None, description="URL to the official payment portal (government source)")
    confidence: float = Field(default=1.0, ge=0.0, le=1.0, description="Confidence score 0–1")
    result_state: ResultState


class LookupResponse(BaseModel):
    results: list[LookupResult]
    tab: LookupTab
    query_ref: str = Field(..., description="Opaque reference ID for this query (no PII)")
    looked_up_at: str = Field(..., description="ISO timestamp of when lookup was performed")
    lookup_count_used: int
    lookup_count_remaining: int
    upsell_eligible: bool = Field(default=True)


# ---------------------------------------------------------------------------
# Session models
# ---------------------------------------------------------------------------

class SessionToken(BaseModel):
    token: str
    expires_at: str  # ISO timestamp
    lookup_count: int = Field(default=3, description="Lookups included in this session")


class SessionCreateResponse(BaseModel):
    pre_session_id: str
    stripe_enabled: bool
    checkout_url: Optional[str] = None
    lookup_price: int
    action_memo_price: int
    monitoring_price: int
    message: Optional[str] = None


class PaymentVerifyRequest(BaseModel):
    stripe_session_id: Optional[str] = Field(None, description="Stripe Checkout session ID")
    pre_session_id: str


class PaymentVerifyResponse(BaseModel):
    session_token: str
    expires_at: str
    lookup_count: int
    paid: bool
    message: str


# ---------------------------------------------------------------------------
# Config response (safe, client-facing)
# ---------------------------------------------------------------------------

class PublicConfig(BaseModel):
    stripe_publishable_key: str = ""
    lookup_price: int = int(os.getenv("VCX_LOOKUP_PRICE", "14"))
    action_memo_price: int = int(os.getenv("VCX_ACTION_MEMO_PRICE", "29"))
    monitoring_price: int = int(os.getenv("VCX_MONITORING_PRICE", "19"))
    stripe_enabled: bool = False
    lookup_access_enabled: bool = True
    action_memo_checkout_enabled: bool = True
    reminders_subscription_enabled: bool = False
    packet_prep_checkout_enabled: bool = False
    booking_url: str = "https://calendly.com/vitacorex2025/30min"


# ---------------------------------------------------------------------------
# Upload / extraction models
# ---------------------------------------------------------------------------

class ExtractedField(BaseModel):
    field_name: str
    value: str
    confidence: float = Field(ge=0.0, le=1.0)
    requires_confirmation: bool = False


class ExtractionResult(BaseModel):
    suggested_tab: Optional[LookupTab] = None
    extracted_fields: list[ExtractedField]
    raw_text_snippet: Optional[str] = Field(None, max_length=500)
    extraction_successful: bool
    message: str
