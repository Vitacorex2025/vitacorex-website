from __future__ import annotations

from backend.models.case_schema import SunbizLookupResult, SunbizOfficer, SunbizSearchCandidate
from backend.services.sunbiz_lookup import SunbizLookupPayload


def to_case_sunbiz_result(payload: SunbizLookupPayload) -> SunbizLookupResult:
    return SunbizLookupResult(
        queried_entity_name=payload.queried_entity_name,
        matched=payload.matched,
        exact_match=payload.exact_match,
        match_score=payload.match_score,
        matched_entity_name=payload.matched_entity_name,
        detail_url=payload.detail_url,
        source_url=payload.source_url or payload.detail_url,
        florida_document_number=payload.florida_document_number,
        fein_number=payload.fein_number,
        entity_status=payload.entity_status,
        entity_type=payload.entity_type,
        principal_address=payload.principal_address,
        mailing_address=payload.mailing_address,
        registered_agent_name=payload.registered_agent_name,
        registered_agent_address=payload.registered_agent_address,
        officers=[SunbizOfficer(**item) for item in payload.officers],
        search_candidates=[SunbizSearchCandidate(**item) for item in payload.search_candidates],
        warnings=list(payload.warnings or []),
        provider_status=payload.provider_status,
        result_classification=payload.result_classification,
        official_record_available=payload.official_record_available,
        official_source_urls=list(payload.official_source_urls or []),
    )
