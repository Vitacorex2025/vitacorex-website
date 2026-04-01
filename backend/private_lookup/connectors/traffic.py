"""
VitaCoreX Private Lookup — Florida Traffic / Fines Connector.

Routes traffic citations to the correct county clerk portal
or FLHSMV based on county. Returns official_routing result
with the correct URL and guidance. No fake status data.
"""
from __future__ import annotations

import logging
import re
from typing import Any

from ..schema import TrafficLookupFields

logger = logging.getLogger(__name__)

_FLHSMV_URL = "https://www.flhsmv.gov/traffic-citations/"

# Florida county to official clerk / payment portal mapping.
# PayFLClerk covers most FL counties. Some counties have their own portals.
_COUNTY_CLERK_MAP: dict[str, dict[str, str]] = {
    "hillsborough": {
        "name": "Hillsborough County Clerk",
        "url": "https://hover.hillsclerk.com/html/case/caseSearch.html",
        "pay_url": "https://hover.hillsclerk.com",
    },
    "miami-dade": {
        "name": "Miami-Dade Clerk of Courts",
        "url": "https://www2.miamidade.gov/courts/case-search.asp",
        "pay_url": "https://www2.miamidade.gov/courts/",
    },
    "broward": {
        "name": "Broward County Clerk",
        "url": "https://www.browardclerk.org/Web2/",
        "pay_url": "https://www.browardclerk.org/Web2/",
    },
    "palm beach": {
        "name": "Palm Beach County Clerk",
        "url": "https://ecpa.co.palm-beach.fl.us/pbc/",
        "pay_url": "https://ecpa.co.palm-beach.fl.us/pbc/",
    },
    "orange": {
        "name": "Orange County Clerk",
        "url": "https://myeclerk.myorangeclerk.com/",
        "pay_url": "https://myeclerk.myorangeclerk.com/",
    },
    "pinellas": {
        "name": "Pinellas County Clerk",
        "url": "https://ccmspa.pinellasclerk.org/PublicAccess/",
        "pay_url": "https://ccmspa.pinellasclerk.org/PublicAccess/",
    },
    "duval": {
        "name": "Duval County Clerk (Jacksonville)",
        "url": "https://onlineservices.duvalclerk.com/",
        "pay_url": "https://onlineservices.duvalclerk.com/",
    },
    "seminole": {
        "name": "Seminole County Clerk",
        "url": "https://courtrecords.seminoleclerk.org/",
        "pay_url": "https://courtrecords.seminoleclerk.org/",
    },
    "polk": {
        "name": "Polk County Clerk",
        "url": "https://www.polkcountyclerk.net/",
        "pay_url": "https://www.polkcountyclerk.net/",
    },
    "volusia": {
        "name": "Volusia County Clerk",
        "url": "https://www.clerk.org/",
        "pay_url": "https://www.clerk.org/",
    },
    "lee": {
        "name": "Lee County Clerk",
        "url": "https://www.leeclerk.org/",
        "pay_url": "https://www.leeclerk.org/",
    },
    "collier": {
        "name": "Collier County Clerk",
        "url": "https://www.collierclerk.com/",
        "pay_url": "https://www.collierclerk.com/",
    },
    "manatee": {
        "name": "Manatee County Clerk",
        "url": "https://www.manateeclerk.com/",
        "pay_url": "https://www.manateeclerk.com/",
    },
    "sarasota": {
        "name": "Sarasota County Clerk",
        "url": "https://www.sarasotaclerk.com/",
        "pay_url": "https://www.sarasotaclerk.com/",
    },
    "escambia": {
        "name": "Escambia County Clerk",
        "url": "https://www.escambiaclerk.com/",
        "pay_url": "https://www.escambiaclerk.com/",
    },
    "leon": {
        "name": "Leon County Clerk (Tallahassee)",
        "url": "https://www.leonclerk.com/",
        "pay_url": "https://www.leonclerk.com/",
    },
    "alachua": {
        "name": "Alachua County Clerk (Gainesville)",
        "url": "https://www.alachuaclerk.org/",
        "pay_url": "https://www.alachuaclerk.org/",
    },
}

# PayFLClerk fallback for counties not individually mapped
_PAYFLCLERK_URL = "https://www.payflclerk.com/"


def _normalize_county(county: str) -> str:
    """Normalize county name for map lookup."""
    return county.lower().strip().replace(" county", "").strip()


def _validate_citation(citation_number: str) -> list[str]:
    errors: list[str] = []
    cleaned = re.sub(r"[^A-Z0-9\-]", "", citation_number.upper())
    if len(cleaned) < 4:
        errors.append("Citation number appears too short. Uniform traffic citations are typically 8+ characters.")
    return errors


async def run_traffic_lookup(fields: TrafficLookupFields) -> dict[str, Any]:
    """
    Route a Florida traffic citation to the correct county clerk portal.

    Returns a dict ready for normalization into a LookupResult.
    """
    validation_errors: list[str] = []
    validation_errors.extend(_validate_citation(fields.citation_number))

    if not fields.fl_county.strip():
        validation_errors.append("Florida county is required.")

    if validation_errors:
        return {
            "result_state": "error",
            "status": "Invalid input",
            "summary": " ".join(validation_errors),
            "official_record_url": _FLHSMV_URL,
            "official_payment_url": _FLHSMV_URL,
            "confidence": 0.0,
            "jurisdiction": "Florida",
            "citation_number": fields.citation_number,
        }

    county_key = _normalize_county(fields.fl_county)
    county_info = _COUNTY_CLERK_MAP.get(county_key)

    if county_info:
        source_name = county_info["name"]
        official_record_url = county_info["url"]
        official_payment_url = county_info["pay_url"]
        routing_note = (
            f"Your citation ({fields.citation_number}) has been noted. "
            f"To check status and pay online, visit the {source_name} portal below. "
            f"Government payments go directly to the county clerk — "
            f"VitaCoreX does not process court or citation payments."
        )
    else:
        # Unknown county — use FLHSMV + PayFLClerk generic fallback
        county_display = fields.fl_county.strip().title()
        source_name = f"{county_display} County Clerk / FLHSMV"
        official_record_url = _PAYFLCLERK_URL
        official_payment_url = _PAYFLCLERK_URL
        routing_note = (
            f"Your citation ({fields.citation_number}) in {county_display} County has been noted. "
            f"Use PayFLClerk or the FLHSMV portal to check status. "
            f"Government payments go directly to the clerk — "
            f"VitaCoreX does not process court or citation payments."
        )

    return {
        "result_state": "official_routing",
        "status": "Verify with county clerk",
        "summary": routing_note,
        "source_name": source_name,
        "official_record_url": official_record_url,
        "official_payment_url": official_payment_url,
        "confidence": 0.92,
        "jurisdiction": f"Florida — {fields.fl_county.strip().title()} County",
        "citation_number": fields.citation_number,
        "court": source_name,
    }
