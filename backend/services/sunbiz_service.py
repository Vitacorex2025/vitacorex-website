from __future__ import annotations

import re
from dataclasses import dataclass, field
from html import unescape
from typing import Iterable
from urllib.parse import quote_plus, urljoin

import requests
from bs4 import BeautifulSoup

from backend.core.config import settings


SEARCH_FORM_URL = "https://search.sunbiz.org/inquiry/corporationsearch/byname"
SEARCH_RESULTS_URL = "https://search.sunbiz.org/Inquiry/corporationsearch/SearchResults"
DETAIL_PREFIX = "https://search.sunbiz.org/Inquiry/corporationsearch/"


@dataclass
class SunbizServiceResult:
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


def _clean(value: str | None) -> str:
    return " ".join(unescape(value or "").split()).strip()


def _entity_key(value: str | None) -> str:
    normalized = _clean(value).upper()
    normalized = normalized.replace("&", " AND ")
    normalized = re.sub(r"[^A-Z0-9]+", " ", normalized)
    suffixes = {"LLC", "L L C", "INC", "INCORPORATED", "CORP", "CORPORATION", "CO", "COMPANY", "LTD", "LIMITED"}
    tokens = [token for token in normalized.split() if token not in suffixes]
    return " ".join(tokens).strip()


def _candidate_score(query: str, candidate_name: str, status_text: str | None = None) -> float:
    query_key = _entity_key(query)
    candidate_key = _entity_key(candidate_name)
    if not query_key or not candidate_key:
        return 0.0
    if query_key == candidate_key:
        score = 1.0
    else:
        query_tokens = set(query_key.split())
        cand_tokens = set(candidate_key.split())
        overlap = len(query_tokens & cand_tokens)
        union = max(1, len(query_tokens | cand_tokens))
        score = overlap / union
        if candidate_key.startswith(query_key) or query_key.startswith(candidate_key):
            score = max(score, 0.88)
        elif query_key in candidate_key or candidate_key in query_key:
            score = max(score, 0.78)
    status_clean = _clean(status_text).lower()
    if status_clean.startswith("active"):
        score += 0.05
    return round(min(score, 1.0), 2)


def _text_lines_from_tag(tag) -> list[str]:
    return [_clean(item) for item in tag.get_text("\n", strip=True).splitlines() if _clean(item)]


def _fetch(url: str, *, params: dict[str, str] | None = None) -> str:
    response = requests.get(
        url,
        params=params,
        timeout=settings.sunbiz_timeout_seconds,
        headers={
            "User-Agent": "DocketMint/1.0 (+https://docketmint.app)",
            "Accept": "text/html,application/xhtml+xml",
        },
    )
    response.raise_for_status()
    return response.text


def _parse_search_results(query: str, html: str) -> list[dict[str, object]]:
    soup = BeautifulSoup(html, "html.parser")
    candidates: list[dict[str, object]] = []
    seen: set[str] = set()
    for anchor in soup.select('a[href*="SearchResultDetail"]'):
        name = _clean(anchor.get_text(" ", strip=True))
        href = urljoin(DETAIL_PREFIX, anchor.get("href") or "")
        if not name or not href or href in seen:
            continue
        seen.add(href)
        text = " ".join(_text_lines_from_tag(anchor.parent if anchor.parent else anchor))
        document_match = re.search(r"\b([A-Z]\d{10,}|\d{6,}[A-Z0-9]*)\b", text)
        status_match = re.search(r"\b(Active|Inactive|InActive|INACT|INACTIVE|ACTIVE|INACT/UA)\b", text)
        document_number = document_match.group(1) if document_match else None
        status = status_match.group(1) if status_match else None
        candidates.append(
            {
                "result_index": len(candidates) + 1,
                "result_name": name,
                "result_status": status,
                "detail_url": href,
                "document_number": document_number,
                "match_score": _candidate_score(query, name, status),
            }
        )
    candidates.sort(key=lambda item: (-float(item.get("match_score") or 0), item.get("result_index") or 0))
    return candidates[:12]


def _find_section(lines: list[str], title: str, stop_titles: Iterable[str]) -> list[str]:
    start = None
    stop_set = {item.lower() for item in stop_titles}
    for index, line in enumerate(lines):
        if line.lower() == title.lower():
            start = index + 1
            break
    if start is None:
        return []
    section: list[str] = []
    for line in lines[start:]:
        if line.lower() in stop_set:
            break
        section.append(line)
    return section


def _join_address(lines: list[str]) -> str | None:
    cleaned = [line for line in lines if line and not line.lower().startswith(("changed:", "address changed:"))]
    return ", ".join(cleaned) if cleaned else None


def _parse_officers(lines: list[str]) -> list[dict[str, str | None]]:
    officers: list[dict[str, str | None]] = []
    current_title = None
    current_name = None
    current_address: list[str] = []
    for line in lines:
        if line.lower().startswith("title"):
            if current_name:
                officers.append(
                    {
                        "officer_name": current_name,
                        "officer_title": current_title,
                        "officer_address": _join_address(current_address),
                    }
                )
            current_title = _clean(line.split("Title", 1)[-1]).strip(": ") or None
            current_name = None
            current_address = []
            continue
        if line.lower().startswith("annual reports"):
            break
        if current_name is None:
            current_name = line
        else:
            current_address.append(line)
    if current_name:
        officers.append(
            {
                "officer_name": current_name,
                "officer_title": current_title,
                "officer_address": _join_address(current_address),
            }
        )
    return officers


def _parse_detail(detail_url: str, html: str) -> dict[str, object]:
    soup = BeautifulSoup(html, "html.parser")
    lines = [_clean(line) for line in soup.get_text("\n", strip=True).splitlines() if _clean(line)]
    header_lines = lines[:25]
    detail_text = " ".join(header_lines)

    entity_type = None
    entity_name = None
    for index, line in enumerate(lines[:18]):
        if line.lower().startswith("detail by"):
            if index + 1 < len(lines):
                entity_type = lines[index + 1]
            if index + 2 < len(lines):
                entity_name = lines[index + 2]
            break

    filing_match = re.search(
        r"Document Number\s+(?P<document>\S+)\s+FEI/EIN Number\s+(?P<fein>\S+)\s+Date Filed .*? State \S+\s+Status\s+(?P<status>[A-Z/]+)",
        detail_text,
        flags=re.IGNORECASE,
    )
    if not filing_match:
        filing_match = re.search(
            r"Document Number\s+(?P<document>\S+).*?Status\s+(?P<status>[A-Z/]+)",
            detail_text,
            flags=re.IGNORECASE,
        )
    principal = _find_section(lines, "Principal Address", {"Mailing Address", "Registered Agent Name & Address", "Authorized Person(s) Detail Name & Address", "Annual Reports Report Year Filed Date", "Document Images"})
    mailing = _find_section(lines, "Mailing Address", {"Registered Agent Name & Address", "Authorized Person(s) Detail Name & Address", "Annual Reports Report Year Filed Date", "Document Images"})
    registered_agent = _find_section(lines, "Registered Agent Name & Address", {"Authorized Person(s) Detail Name & Address", "Annual Reports Report Year Filed Date", "Document Images"})
    officers = _find_section(lines, "Authorized Person(s) Detail Name & Address", {"Annual Reports Report Year Filed Date", "Document Images"})

    registered_agent_name = registered_agent[0] if registered_agent else None
    registered_agent_address = _join_address(registered_agent[1:]) if len(registered_agent) > 1 else None
    return {
        "matched_entity_name": entity_name,
        "detail_url": detail_url,
        "florida_document_number": filing_match.group("document") if filing_match else None,
        "fein_number": filing_match.group("fein") if filing_match and "fein" in filing_match.groupdict() else None,
        "entity_status": filing_match.group("status") if filing_match else None,
        "entity_type": entity_type,
        "principal_address": _join_address(principal),
        "mailing_address": _join_address(mailing),
        "registered_agent_name": registered_agent_name,
        "registered_agent_address": registered_agent_address,
        "officers": _parse_officers(officers),
        "official_record_available": bool(filing_match or entity_name),
    }


def lookup_entity(entity_name: str) -> SunbizServiceResult:
    normalized = _clean(entity_name)
    if not normalized:
        raise ValueError("entity_name is required for SunBiz lookup.")

    if not settings.live_sunbiz_lookup_enabled:
        return SunbizServiceResult(
            queried_entity_name=normalized,
            matched=False,
            exact_match=False,
            match_score=None,
            matched_entity_name=None,
            detail_url=None,
            florida_document_number=None,
            fein_number=None,
            entity_status="UNAVAILABLE",
            entity_type=None,
            principal_address=None,
            mailing_address=None,
            registered_agent_name=None,
            registered_agent_address=None,
            officers=[],
            search_candidates=[],
            warnings=["Live SunBiz integration is not configured in this environment."],
            provider_status="unavailable",
            result_classification="unavailable",
            official_record_available=False,
            official_source_urls=[SEARCH_FORM_URL],
        )

    try:
        search_html = _fetch(
            SEARCH_RESULTS_URL,
            params={
                "inquiryType": "EntityName",
                "searchTerm": normalized,
            },
        )
    except Exception as exc:
        return SunbizServiceResult(
            queried_entity_name=normalized,
            matched=False,
            warnings=[f"Official SunBiz lookup could not be completed: {exc}"],
            provider_status="unavailable",
            result_classification="unavailable",
            official_record_available=False,
            official_source_urls=[SEARCH_FORM_URL],
        )

    candidates = _parse_search_results(normalized, search_html)
    if not candidates:
        return SunbizServiceResult(
            queried_entity_name=normalized,
            matched=False,
            search_candidates=[],
            warnings=["No Florida Division of Corporations match found for the queried entity."],
            provider_status="ok",
            result_classification="no_match",
            official_record_available=False,
            source_url=SEARCH_FORM_URL,
            official_source_urls=[SEARCH_FORM_URL],
            search_html=search_html,
        )

    best = candidates[0]
    detail_html = None
    detail_data: dict[str, object] = {}
    if best.get("detail_url"):
        try:
            detail_html = _fetch(str(best["detail_url"]))
            detail_data = _parse_detail(str(best["detail_url"]), detail_html)
        except Exception as exc:
            return SunbizServiceResult(
                queried_entity_name=normalized,
                matched=False,
                search_candidates=candidates,
                warnings=[f"Official search found candidates, but detail retrieval failed: {exc}"],
                provider_status="unavailable",
                result_classification="unavailable",
                official_record_available=False,
                source_url=SEARCH_FORM_URL,
                official_source_urls=[SEARCH_FORM_URL, str(best.get("detail_url") or "")],
                search_html=search_html,
            )

    exact_match = _entity_key(normalized) == _entity_key(str(best.get("result_name") or ""))
    result_classification = "verified_match" if detail_data.get("official_record_available") else "candidate_only"
    warnings: list[str] = []
    if not exact_match:
        warnings.append("Official search returned a close match that should be reviewed before relying on service details.")

    official_urls = [SEARCH_FORM_URL]
    if best.get("detail_url"):
        official_urls.append(str(best["detail_url"]))

    return SunbizServiceResult(
        queried_entity_name=normalized,
        matched=bool(detail_data.get("official_record_available")),
        exact_match=exact_match,
        match_score=float(best.get("match_score") or 0),
        matched_entity_name=str(detail_data.get("matched_entity_name") or best.get("result_name") or ""),
        detail_url=str(best.get("detail_url") or ""),
        florida_document_number=detail_data.get("florida_document_number"),
        fein_number=detail_data.get("fein_number"),
        entity_status=detail_data.get("entity_status") or best.get("result_status"),
        entity_type=detail_data.get("entity_type"),
        principal_address=detail_data.get("principal_address"),
        mailing_address=detail_data.get("mailing_address"),
        registered_agent_name=detail_data.get("registered_agent_name"),
        registered_agent_address=detail_data.get("registered_agent_address"),
        officers=list(detail_data.get("officers") or []),
        search_candidates=candidates,
        warnings=warnings,
        provider_status="ok",
        result_classification=result_classification,
        official_record_available=bool(detail_data.get("official_record_available")),
        source_url=str(best.get("detail_url") or SEARCH_FORM_URL),
        official_source_urls=[item for item in official_urls if item],
        search_html=search_html,
        detail_html=detail_html,
    )
