"""
VitaCoreX Private Lookup — Florida Tolls Connector.

SunPass / E-ZPass Florida toll obligation lookup.

Live API status: The SunPass programmatic API requires a formal
agreement with FDOT/SunPass. Until credentials are configured,
this connector returns result_state="official_handoff" with the
correct SunPass portal URL. No fake data is ever returned.
"""
from __future__ import annotations

import logging
import os
import re
from typing import Any

from ..schema import TollsLookupFields

logger = logging.getLogger(__name__)

_SUNPASS_INVOICE_URL = "https://www.sunpass.com/vector/invoices/invoiceInquiry.do"
_SUNPASS_ACCOUNT_URL = "https://www.sunpass.com"
_LEXI_NEXIS_ENABLED = os.getenv("VCX_LEXISNEXIS_TOLLS_ENABLED", "false").lower() == "true"


def _validate_plate(plate_number: str | None, plate_state: str | None) -> list[str]:
    errors: list[str] = []
    if plate_number is not None:
        cleaned = re.sub(r"[^A-Z0-9]", "", plate_number.upper())
        if len(cleaned) < 2 or len(cleaned) > 8:
            errors.append("Plate number must be 2–8 alphanumeric characters.")
    if plate_state is not None:
        if len(plate_state) != 2 or not plate_state.isalpha():
            errors.append("Plate state must be a 2-letter US state code.")
    return errors


def _validate_invoice(invoice_number: str | None) -> list[str]:
    errors: list[str] = []
    if invoice_number is not None:
        cleaned = re.sub(r"[^A-Z0-9\-]", "", invoice_number.upper())
        if len(cleaned) < 4:
            errors.append("Invoice number appears too short.")
    return errors


async def run_tolls_lookup(fields: TollsLookupFields) -> dict[str, Any]:
    """
    Attempt to look up Florida toll obligations.

    Returns a dict ready for normalization into a LookupResult.

    Since SunPass live API credentials are not verified, this connector
    always returns official_handoff with the correct portal URL and
    pre-filled context where possible.
    """
    # Validate inputs
    validation_errors: list[str] = []

    has_plate = bool(fields.plate_number and fields.plate_state)
    has_invoice = bool(fields.invoice_number)

    if not has_plate and not has_invoice:
        validation_errors.append(
            "Provide either (plate number + state) or an invoice/citation number."
        )

    if has_plate:
        validation_errors.extend(
            _validate_plate(fields.plate_number, fields.plate_state)
        )

    if has_invoice:
        validation_errors.extend(_validate_invoice(fields.invoice_number))

    if validation_errors:
        return {
            "result_state": "error",
            "status": "Invalid input",
            "summary": " ".join(validation_errors),
            "official_record_url": _SUNPASS_INVOICE_URL,
            "official_payment_url": _SUNPASS_INVOICE_URL,
            "confidence": 0.0,
            "jurisdiction": "Florida",
        }

    # Live API path (future): check if credentials are configured
    sunpass_api_key = os.getenv("VCX_SUNPASS_API_KEY", "").strip()
    if sunpass_api_key and _LEXI_NEXIS_ENABLED:
        # Future: implement live lookup against SunPass API
        # For now, log and fall through to official_handoff
        logger.info(
            "SunPass API key is configured but live integration is not yet active. "
            "Returning official_handoff."
        )

    # Build the best possible handoff context
    if fields.invoice_number:
        summary = (
            f"Your SunPass invoice or citation number has been noted. "
            f"To check your exact balance and payment status, visit the official SunPass "
            f"invoice inquiry portal using the link below. "
            f"Government payments go directly to SunPass — VitaCoreX does not process toll payments."
        )
        # SunPass invoice lookup URL with pre-fill hint (URL params are public and standard)
        official_url = _SUNPASS_INVOICE_URL
    else:
        summary = (
            f"To check unpaid toll obligations for your vehicle, visit the official SunPass "
            f"portal or call SunPass customer service at 1-888-865-5352. "
            f"Government payments go directly to SunPass — VitaCoreX does not process toll payments."
        )
        official_url = _SUNPASS_ACCOUNT_URL

    return {
        "result_state": "official_handoff",
        "status": "Verify via SunPass",
        "summary": summary,
        "official_record_url": official_url,
        "official_payment_url": _SUNPASS_INVOICE_URL,
        "confidence": 0.95,
        "jurisdiction": "Florida",
        "invoice_number": fields.invoice_number or None,
    }
