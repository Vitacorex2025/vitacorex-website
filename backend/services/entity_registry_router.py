
from __future__ import annotations

import re
from datetime import datetime, timezone

from backend.models.case_schema import EntityVerificationOfficer, EntityVerificationResult
from backend.services.sunbiz_lookup import lookup_entity as sunbiz_lookup_entity


OFFICIAL_SOURCES = {
    "FL": ["https://search.sunbiz.org/inquiry/corporationsearch/byname"],
    "CA": ["https://bizfileonline.sos.ca.gov/search/business"],
    "TX": ["https://www.sos.state.tx.us/corp/sosda/index.shtml"],
    "DE": ["https://icis.corp.delaware.gov/eCorp/EntitySearch/NameSearch.aspx"],
}

PROVIDER_NAMES = {
    "FL": "SunBiz",
    "CA": "California Secretary of State BizFile",
    "TX": "Texas Secretary of State",
    "DE": "Delaware Division of Corporations",
}


def _utcnow():
    return datetime.now(timezone.utc)


def _clean(value: object | None) -> str | None:
    text = " ".join(str(value or "").replace("\u00a0", " ").split()).strip(" \n\t\r,;")
    return text or None


def normalize_entity_name(value: str | None) -> str | None:
    cleaned = (_clean(value) or "").upper()
    cleaned = cleaned.replace("&", " AND ")
    cleaned = re.sub(r"[^A-Z0-9 ]+", " ", cleaned)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    return cleaned or None


def infer_state_hint(*values: str | None) -> str | None:
    text = " ".join([str(v or "") for v in values]).upper()
    mapping = {
        "FLORIDA": "FL", " FL ": "FL",
        "CALIFORNIA": "CA", " CA ": "CA",
        "TEXAS": "TX", " TX ": "TX",
        "DELAWARE": "DE", " DE ": "DE",
    }
    padded = f" {text} "
    for needle, state in mapping.items():
        if needle in padded:
            return state
    return None


def unavailable_result(entity_name: str, state: str | None, reason: str) -> EntityVerificationResult:
    state_code = (state or "").upper() or None
    provider = PROVIDER_NAMES.get(state_code or "", "Registry Provider")
    return EntityVerificationResult(
        queried_entity=entity_name,
        normalized_entity=normalize_entity_name(entity_name),
        state=state_code,
        provider=provider,
        status="provider_unavailable_or_not_implemented",
        classification="provider_unavailable_or_not_implemented",
        source_urls=OFFICIAL_SOURCES.get(state_code or "", []),
        warnings=[reason],
        provider_limitations=[reason],
        looked_up_at=_utcnow(),
    )


def no_match_result(entity_name: str, state: str | None) -> EntityVerificationResult:
    state_code = (state or "").upper() or None
    provider = PROVIDER_NAMES.get(state_code or "", "Registry Provider")
    return EntityVerificationResult(
        queried_entity=entity_name,
        normalized_entity=normalize_entity_name(entity_name),
        state=state_code,
        provider=provider,
        status="no_official_match_found",
        classification="no_official_match_found",
        source_urls=OFFICIAL_SOURCES.get(state_code or "", []),
        warnings=["No official registry match was confirmed from the implemented provider response."],
        looked_up_at=_utcnow(),
    )


def _verify_florida(entity_name: str) -> EntityVerificationResult:
    try:
        result = sunbiz_lookup_entity(entity_name)
    except Exception as exc:
        return unavailable_result(entity_name, "FL", f"Florida provider request failed: {exc}")

    status = "verified_match" if result.matched and result.official_record_available else "no_official_match_found"
    officers = [
        EntityVerificationOfficer(
            name=item.get("officer_name"),
            title=item.get("officer_title"),
            address=item.get("officer_address"),
        )
        for item in (result.officers or [])
    ]
    return EntityVerificationResult(
        queried_entity=entity_name,
        normalized_entity=normalize_entity_name(entity_name),
        state="FL",
        provider="SunBiz",
        status=status,
        classification=status,
        match_confidence=float(result.match_score or 0.0),
        matched_entity_name=result.matched_entity_name,
        entity_number_or_document_number=result.florida_document_number,
        entity_type=result.entity_type,
        good_standing_or_status=result.entity_status,
        registered_agent_name=result.registered_agent_name,
        registered_agent_address=result.registered_agent_address,
        public_officers_or_managers=officers,
        source_urls=list(dict.fromkeys([url for url in [result.source_url, *list(result.official_source_urls or [])] if url])),
        official_certificate_available=False,
        warnings=list(result.warnings or []),
        provider_limitations=[],
        raw_capture_metadata={
            "detail_url": result.detail_url,
            "principal_address": result.principal_address,
            "mailing_address": result.mailing_address,
        },
        looked_up_at=_utcnow(),
    )


def _verify_placeholder(entity_name: str, state: str) -> EntityVerificationResult:
    state_code = state.upper()
    provider = PROVIDER_NAMES.get(state_code, "Registry Provider")
    return EntityVerificationResult(
        queried_entity=entity_name,
        normalized_entity=normalize_entity_name(entity_name),
        state=state_code,
        provider=provider,
        status="provider_unavailable_or_not_implemented",
        classification="provider_unavailable_or_not_implemented",
        source_urls=OFFICIAL_SOURCES.get(state_code, []),
        warnings=[f"{provider} routing exists, but live structured verification is not implemented in this build."],
        provider_limitations=[
            "No officer or registered-agent data is fabricated.",
            "A human reviewer must confirm any service path before court-facing use.",
        ],
        looked_up_at=_utcnow(),
    )


def verify_entity(
    entity_name: str,
    state_hint: str | None = None,
    filing_number_hint: str | None = None,
    ein_hint: str | None = None,
) -> EntityVerificationResult:
    normalized = normalize_entity_name(entity_name)
    state = (state_hint or "").upper() or None

    if not normalized:
        return unavailable_result(entity_name or "", state, "No entity name was provided for verification.")

    if state == "FL":
        return _verify_florida(entity_name)
    if state in {"CA", "TX", "DE"}:
        return _verify_placeholder(entity_name, state)

    return unavailable_result(
        entity_name,
        state,
        "No implemented provider matched the supplied state hint. Verification remains review-required.",
    )
