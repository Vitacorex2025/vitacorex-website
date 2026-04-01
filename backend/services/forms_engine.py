
from __future__ import annotations

FORM_FAMILIES = {
    "state_court_packets": {
        "description": "State court filing packets for implemented jurisdictions only.",
        "supported_forms": [
            {"form_id": "collections-florida-v1", "jurisdiction": "FL", "agency_or_court": "Florida State Courts", "edition_version": "v1", "template_type": "docx", "review_required": True},
        ],
    },
    "federal_agency_forms": {
        "description": "Federal agency forms such as USCIS, version-guarded by edition.",
        "supported_forms": [],
    },
    "internal_review_memos": {
        "description": "Internal memos, evidence summaries, and blocker notices.",
        "supported_forms": [
            {"form_id": "jurisdiction-memo-v1", "jurisdiction": "US", "agency_or_court": "Internal", "edition_version": "v1", "template_type": "docx", "review_required": False},
            {"form_id": "service-memo-v1", "jurisdiction": "US", "agency_or_court": "Internal", "edition_version": "v1", "template_type": "docx", "review_required": False},
        ],
    },
}


def catalog() -> dict[str, object]:
    return {"families": FORM_FAMILIES}
