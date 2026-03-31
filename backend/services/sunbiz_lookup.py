from __future__ import annotations

from dataclasses import dataclass, field

from backend.services.sunbiz_service import SunbizServiceResult, lookup_entity as service_lookup_entity


@dataclass
class SunbizLookupPayload:
    queried_entity_name: str
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
    officers: list[dict[str, str | None]] = field(default_factory=list)
    search_candidates: list[dict[str, object]] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)
    provider_status: str | None = None
    result_classification: str | None = None
    official_record_available: bool = False
    source_url: str | None = None
    official_source_urls: list[str] = field(default_factory=list)
    search_html: str | None = None
    detail_html: str | None = None


def _to_payload(result: SunbizServiceResult) -> SunbizLookupPayload:
    return SunbizLookupPayload(
        queried_entity_name=result.queried_entity_name,
        matched=result.matched,
        exact_match=result.exact_match,
        match_score=result.match_score,
        matched_entity_name=result.matched_entity_name,
        detail_url=result.detail_url,
        florida_document_number=result.florida_document_number,
        fein_number=result.fein_number,
        entity_status=result.entity_status,
        entity_type=result.entity_type,
        principal_address=result.principal_address,
        mailing_address=result.mailing_address,
        registered_agent_name=result.registered_agent_name,
        registered_agent_address=result.registered_agent_address,
        officers=list(result.officers or []),
        search_candidates=list(result.search_candidates or []),
        warnings=list(result.warnings or []),
        provider_status=result.provider_status,
        result_classification=result.result_classification,
        official_record_available=result.official_record_available,
        source_url=result.source_url,
        official_source_urls=list(result.official_source_urls or []),
        search_html=result.search_html,
        detail_html=result.detail_html,
    )


def lookup_entity(entity_name: str) -> SunbizLookupPayload:
    return _to_payload(service_lookup_entity(entity_name))
