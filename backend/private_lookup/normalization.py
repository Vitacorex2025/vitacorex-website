"""
VitaCoreX Private Lookup — Result normalization.

Converts raw connector outputs into normalized LookupResult objects.
Ensures consistent format regardless of which connector ran.
"""
from __future__ import annotations

from typing import Any

from .schema import LookupResult, ObligationType, ResultState, SourceType


def normalize_toll_result(raw: dict[str, Any]) -> LookupResult:
    """Convert raw tolls connector output to LookupResult."""
    return LookupResult(
        obligation_type=ObligationType.TOLL,
        source_name="Florida SunPass / E-ZPass",
        source_type=SourceType.FLORIDA_SUNPASS,
        jurisdiction=raw.get("jurisdiction", "Florida"),
        status=raw.get("status", "Unknown"),
        amount_due=raw.get("amount_due"),
        due_date=raw.get("due_date"),
        case_number=raw.get("invoice_number"),
        court=None,
        role=None,
        summary=raw.get("summary", "Toll obligation status. Verify directly with SunPass."),
        official_record_url=raw.get("official_record_url"),
        official_payment_url=raw.get(
            "official_payment_url",
            "https://www.sunpass.com/vector/invoices/invoiceInquiry.do",
        ),
        confidence=raw.get("confidence", 0.9),
        result_state=ResultState(raw.get("result_state", ResultState.OFFICIAL_HANDOFF)),
    )


def normalize_traffic_result(raw: dict[str, Any]) -> LookupResult:
    """Convert raw traffic connector output to LookupResult."""
    return LookupResult(
        obligation_type=ObligationType.TRAFFIC_CITATION,
        source_name=raw.get("source_name", "Florida DHSMV / County Clerk"),
        source_type=SourceType.FLORIDA_FLHSMV,
        jurisdiction=raw.get("jurisdiction", "Florida"),
        status=raw.get("status", "Unknown"),
        amount_due=raw.get("amount_due"),
        due_date=raw.get("due_date"),
        case_number=raw.get("citation_number"),
        court=raw.get("court"),
        role=None,
        summary=raw.get("summary", "Traffic citation status. Verify with the county clerk."),
        official_record_url=raw.get("official_record_url"),
        official_payment_url=raw.get(
            "official_payment_url",
            "https://www.flhsmv.gov/traffic-citations/",
        ),
        confidence=raw.get("confidence", 0.85),
        result_state=ResultState(raw.get("result_state", ResultState.OFFICIAL_ROUTING)),
    )


def normalize_court_result(raw: dict[str, Any]) -> LookupResult:
    """Convert raw court connector output to LookupResult."""
    source_type_map: dict[str, SourceType] = {
        "florida_acis": SourceType.FLORIDA_ACIS,
        "florida_county_clerk": SourceType.FLORIDA_COUNTY_CLERK,
        "pacer_federal": SourceType.PACER_FEDERAL,
    }
    raw_source_type = raw.get("source_type", "florida_acis")
    source_type = source_type_map.get(raw_source_type, SourceType.FLORIDA_ACIS)

    return LookupResult(
        obligation_type=ObligationType.COURT_CASE,
        source_name=raw.get("source_name", "Florida Courts"),
        source_type=source_type,
        jurisdiction=raw.get("jurisdiction", "Florida"),
        status=raw.get("status", "Unknown"),
        amount_due=raw.get("amount_due"),
        due_date=raw.get("due_date"),
        case_number=raw.get("case_number"),
        court=raw.get("court"),
        role=raw.get("role"),
        summary=raw.get("summary", "Court case activity. Verify via official court portal."),
        official_record_url=raw.get(
            "official_record_url",
            "https://acis.flcourts.gov/portal/search",
        ),
        official_payment_url=raw.get("official_payment_url"),
        confidence=raw.get("confidence", 0.8),
        result_state=ResultState(raw.get("result_state", ResultState.OFFICIAL_HANDOFF)),
    )


def build_no_results_response(
    jurisdiction: str,
    obligation_type: ObligationType,
    official_url: str,
    source_name: str,
    source_type: SourceType,
) -> LookupResult:
    """Create a standardized empty-result card."""
    return LookupResult(
        obligation_type=obligation_type,
        source_name=source_name,
        source_type=source_type,
        jurisdiction=jurisdiction,
        status="No record found",
        amount_due=None,
        due_date=None,
        case_number=None,
        court=None,
        role=None,
        summary=(
            "No matching record was found in the available sources. "
            "This may mean no obligation exists, or the record may be under a different identifier. "
            "Verify directly via the official source link."
        ),
        official_record_url=official_url,
        official_payment_url=None,
        confidence=0.7,
        result_state=ResultState.EMPTY,
    )
