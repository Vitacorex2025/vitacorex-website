"""
VitaCoreX Private Lookup — Court Cases Connector.

Routes court case searches to appropriate Florida courts:
- Florida ACIS (appellate and circuit court public portal)
- Hillsborough County clerk (direct link)
- PACER (federal — blocked unless credentials configured)

No fake case data is ever returned. All results are either
official_handoff (portal link) or blocked (PACER/no credentials).
"""
from __future__ import annotations

import logging
import os
import re
from typing import Any

from ..schema import CourtLookupFields, RoleFilter

logger = logging.getLogger(__name__)

_ACIS_URL = "https://acis.flcourts.gov/portal/search"
_HILLSBOROUGH_URL = "https://hover.hillsclerk.com/html/case/caseSearch.html"
_PACER_URL = "https://pacer.uscourts.gov"
_PACER_SEARCH_URL = "https://pcl.uscourts.gov/pcl/pages/search/find.jsf"


def _has_pacer_credentials() -> bool:
    username = os.getenv("PACER_USERNAME", "").strip()
    password = os.getenv("PACER_PASSWORD", "").strip()
    return bool(username and password)


def _sanitize_name(name: str) -> str:
    """Strip anything that isn't alpha, space, hyphen, apostrophe, period."""
    return re.sub(r"[^A-Za-z\s\-\.']+", "", name).strip()


def _role_label(role: RoleFilter) -> str:
    role_labels = {
        RoleFilter.ANY: "any party",
        RoleFilter.PLAINTIFF: "plaintiff",
        RoleFilter.DEFENDANT: "defendant",
        RoleFilter.PETITIONER: "petitioner",
        RoleFilter.RESPONDENT: "respondent",
    }
    return role_labels.get(role, "any party")


async def run_courts_lookup(fields: CourtLookupFields) -> list[dict[str, Any]]:
    """
    Return a list of court lookup results (one per source).

    For each applicable court system, we return either:
    - official_handoff: portal link with context
    - blocked: PACER requires credentials
    """
    results: list[dict[str, Any]] = []
    state = fields.state.upper()
    safe_name = _sanitize_name(fields.full_name)
    county = (fields.county or "").strip().lower()
    role_label = _role_label(fields.role_filter)

    # -----------------------------------------------------------------------
    # 1. Florida ACIS (appellate + circuit — public)
    # -----------------------------------------------------------------------
    if state == "FL":
        acis_summary = (
            f"To search Florida appellate and circuit court records for '{safe_name}' "
            f"(as {role_label}), use the Florida ACIS portal below. "
            f"ACIS covers the District Courts of Appeal and Supreme Court. "
            f"Results are informational only — not legal advice."
        )
        if fields.case_number:
            acis_summary += f" You may enter case number '{fields.case_number}' directly for a faster match."

        results.append({
            "result_state": "official_handoff",
            "status": "Verify via Florida ACIS",
            "summary": acis_summary,
            "source_name": "Florida ACIS — Appellate Case Info",
            "source_type": "florida_acis",
            "official_record_url": _ACIS_URL,
            "official_payment_url": None,
            "confidence": 0.92,
            "jurisdiction": "Florida — Appellate / Circuit",
            "case_number": fields.case_number,
            "court": "Florida District Courts of Appeal / Supreme Court",
            "role": role_label,
        })

    # -----------------------------------------------------------------------
    # 2. Hillsborough County Clerk (if county matches or no county specified)
    # -----------------------------------------------------------------------
    hillsborough_match = county in ("hillsborough", "hillsborough county", "")
    if state == "FL" and hillsborough_match:
        hill_summary = (
            f"For Hillsborough County court records, search the official Hillsborough "
            f"County Clerk portal below. Enter the name '{safe_name}' directly in the case search. "
            f"Results are informational only — not legal advice."
        )
        if fields.case_number:
            hill_summary += f" Case number '{fields.case_number}' can be used for a direct lookup."

        results.append({
            "result_state": "official_handoff",
            "status": "Verify via Hillsborough Clerk",
            "summary": hill_summary,
            "source_name": "Hillsborough County Clerk of Courts",
            "source_type": "florida_county_clerk",
            "official_record_url": _HILLSBOROUGH_URL,
            "official_payment_url": _HILLSBOROUGH_URL,
            "confidence": 0.90,
            "jurisdiction": "Florida — Hillsborough County",
            "case_number": fields.case_number,
            "court": "Hillsborough County Court",
            "role": role_label,
        })

    # -----------------------------------------------------------------------
    # 3. PACER — Federal courts (blocked unless credentials configured)
    # -----------------------------------------------------------------------
    if _has_pacer_credentials():
        # Future: implement PACER API lookup
        logger.info("PACER credentials found but live integration not yet active. Returning official_handoff.")
        pacer_summary = (
            f"For federal court records, search PACER (Public Access to Court Electronic Records) "
            f"at pacer.uscourts.gov. Registration is required. "
            f"Results are informational only — not legal advice."
        )
        results.append({
            "result_state": "official_handoff",
            "status": "Verify via PACER",
            "summary": pacer_summary,
            "source_name": "PACER — Federal Court Records",
            "source_type": "pacer_federal",
            "official_record_url": _PACER_SEARCH_URL,
            "official_payment_url": None,
            "confidence": 0.88,
            "jurisdiction": "Federal",
            "case_number": fields.case_number,
            "court": "U.S. Federal Courts",
            "role": role_label,
        })
    else:
        # PACER blocked — no credentials
        results.append({
            "result_state": "blocked",
            "status": "Federal court access not configured",
            "summary": (
                "Federal court (PACER) lookup is not available in this session. "
                "You can search PACER directly at pacer.uscourts.gov — registration and "
                "per-page fees apply. This service is provided by the U.S. courts, not VitaCoreX."
            ),
            "source_name": "PACER — Federal Court Records",
            "source_type": "pacer_federal",
            "official_record_url": _PACER_URL,
            "official_payment_url": None,
            "confidence": 0.0,
            "jurisdiction": "Federal",
            "case_number": fields.case_number,
            "court": "U.S. Federal Courts",
            "role": role_label,
        })

    return results
