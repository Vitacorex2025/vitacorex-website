
from __future__ import annotations

import re
from datetime import datetime, timezone

from backend.models.case_schema import CaseRecord, JurisdictionAnalysisResult, JurisdictionOption
from backend.services.entity_registry_router import infer_state_hint


SUPPORTED_STATE_PACKS = {"FL"}


def _utcnow():
    return datetime.now(timezone.utc)


def _clean(value: object | None) -> str | None:
    text = " ".join(str(value or "").replace("\u00a0", " ").split()).strip(" \n\t\r,;")
    return text or None


def _state_from_text(value: str | None) -> str | None:
    text = f" {_clean(value or '') or ''} ".upper()
    mapping = {
        " FLORIDA ": "FL",
        " CALIFORNIA ": "CA",
        " TEXAS ": "TX",
        " DELAWARE ": "DE",
    }
    for needle, state in mapping.items():
        if needle in text:
            return state
    return None


def _find_county(text: str | None) -> str | None:
    match = re.search(r"([A-Z][A-Za-z ]+?)\s+County", text or "", flags=re.IGNORECASE)
    return _clean(match.group(1)) if match else None


def _has_arbitration(text: str | None) -> bool:
    lowered = (text or "").lower()
    return "arbitration" in lowered


def analyze_case_jurisdiction(record: CaseRecord) -> JurisdictionAnalysisResult:
    data = record.extracted_case_data
    contract_text = "\n".join(data.contract_evidence or [])
    venue_text = data.venue.venue_clause or data.venue.venue_paragraph or ""
    governing_law = data.governing_law or ""
    address_sources = [
        data.service_address,
        data.business_address,
        data.contract_execution_location,
        data.defendant_entity.address,
        data.personal_guarantor.address if data.personal_guarantor else None,
    ]
    defendant_state = infer_state_hint(*(address_sources + [record.entity_verification.state if record.entity_verification else None]))
    governing_state = infer_state_hint(governing_law, venue_text, contract_text)
    venue_county = data.venue.venue_county or _find_county(venue_text)
    arbitration = _has_arbitration(contract_text + "\n" + venue_text)

    options: list[JurisdictionOption] = []
    summary: list[str] = []
    blockers: list[str] = []
    service_notes: list[str] = []

    if arbitration:
        blockers.append("Arbitration language appears in the contract set. Court-packet generation must be reviewed before filing.")
        summary.append("Arbitration language was detected and may override litigation venue.")

    if governing_state == "FL" or venue_county or "orange county" in venue_text.lower():
        reasons = []
        if venue_text:
            reasons.append("Contract contains an explicit venue/forum signal favoring Florida.")
        if governing_law:
            reasons.append(f"Governing law extracted: {governing_law}.")
        if venue_county:
            reasons.append(f"Venue county extracted: {venue_county} County.")
        options.append(
            JurisdictionOption(
                forum_state="FL",
                forum_county=venue_county or None,
                label=f"Florida{' / ' + venue_county + ' County' if venue_county else ''}",
                rank=1,
                confidence_score=0.86 if venue_text else 0.68,
                reasons=reasons,
                blockers=list(blockers),
                service_method_notes=["Florida filing may still require non-Florida service planning if the defendant is foreign or unregistered."],
                state_pack_available=True,
            )
        )

    if defendant_state:
        options.append(
            JurisdictionOption(
                forum_state=defendant_state,
                forum_county=None,
                label={"CA": "California", "TX": "Texas", "DE": "Delaware", "FL": "Florida"}.get(defendant_state, defendant_state),
                rank=2,
                confidence_score=0.62,
                reasons=["Defendant/guarantor address or entity-registration indicators point to this state."],
                blockers=[],
                service_method_notes=["Service should follow the target state's registered-agent or individual-service rules."],
                state_pack_available=defendant_state in SUPPORTED_STATE_PACKS,
            )
        )

    if not options:
        options.append(
            JurisdictionOption(
                forum_state=None,
                forum_county=None,
                label="Undetermined",
                rank=1,
                confidence_score=0.2,
                reasons=["Uploaded sources did not provide enough reliable forum evidence."],
                blockers=["Jurisdiction remains review required."],
                service_method_notes=[],
                state_pack_available=False,
            )
        )
        blockers.append("No reliable jurisdiction path could be ranked from the uploaded materials.")

    ranked = []
    seen = set()
    for option in sorted(options, key=lambda item: (item.rank, -item.confidence_score)):
        key = (option.forum_state, option.forum_county, option.label)
        if key in seen:
            continue
        seen.add(key)
        ranked.append(option)

    recommended = ranked[0] if ranked else None
    alternate = ranked[1] if len(ranked) > 1 else None

    if recommended:
        if recommended.forum_state and recommended.forum_state not in SUPPORTED_STATE_PACKS:
            blockers.append(
                f"No {recommended.forum_state} court-pack is implemented in this build. Analysis-first outputs only."
            )
        if recommended.forum_state == "FL" and defendant_state and defendant_state != "FL":
            service_notes.append("Defendant appears to be out-of-state. Verify foreign-service path before Florida filing.")
    if record.entity_verification and record.entity_verification.status != "verified_match":
        service_notes.append("Official entity verification did not return a verified match, so company-service allegations remain review-required.")

    summary.extend([reason for option in ranked[:2] for reason in option.reasons][:6])

    return JurisdictionAnalysisResult(
        recommended_forum=recommended,
        alternate_forum=alternate,
        ranked_forums=ranked,
        reason_summary=summary,
        blockers=list(dict.fromkeys(blockers)),
        service_notes=list(dict.fromkeys(service_notes)),
        arbitration_override=arbitration,
        generated_at=_utcnow(),
    )
