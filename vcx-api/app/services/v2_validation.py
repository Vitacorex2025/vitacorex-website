"""vcx-api v2 — request validation (catalog-driven, machine error codes).

Errors are returned as stable machine codes; the frontend localizes them.
Entered values are never echoed back in errors and never logged.
"""

import math
import re
from datetime import datetime, timezone

from . import v2_catalog

ALLOWED_TOP_LEVEL = {
    "idempotency_key", "service_id", "subtype", "locale", "source_channel",
    "contact", "details", "summary", "consent", "hp",
}
ALLOWED_CONTACT = {"name", "email", "phone"}
ALLOWED_CONSENT = {"privacy", "notice_version", "referral"}

MAX_SUMMARY = 1500
MAX_DETAIL_VALUE = 300
MAX_NAME = 120

IDEMPOTENCY_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9_\-:.]{7,127}$")
EMAIL_RE = re.compile(
    r"^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]{1,64}@"
    r"[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?"
    r"(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$"
)
PHONE_RE = re.compile(r"^[+0-9() .\-]{7,25}$")
CONTROL_RE = re.compile(r"[\x00-\x08\x0b-\x1f\x7f]")
LINEBREAK_RE = re.compile(r"[\r\n]")

# Sensitive-data detectors (contract): SSN-like and Luhn-valid card-like numbers.
SSN_RE = re.compile(r"\b\d{3}-?\d{2}-?\d{4}\b")
CARD_CANDIDATE_RE = re.compile(r"(?<!\d)(?:\d[ -]?){12,18}\d(?!\d)")
SSN_DASHED_RE = re.compile(r"(?<![\d-])\d{3}-\d{2}-\d{4}(?![\d-])")  # SSN typed into the phone field

NY_ALIASES = {"NY", "NEW YORK", "NEWYORK", "N Y", "NEW YORK STATE"}

SOURCE_CHANNELS_WEB = {"web"}


class RequestRejected(Exception):
    """Validation outcome that maps to an HTTP error response."""

    def __init__(self, status_code: int, body: dict):
        super().__init__(body.get("error", "rejected"))
        self.status_code = status_code
        self.body = body


class HoneypotTriggered(Exception):
    pass


def _luhn_ok(digits: str) -> bool:
    total, parity = 0, len(digits) % 2
    for i, ch in enumerate(digits):
        d = int(ch)
        if i % 2 == parity:
            d *= 2
            if d > 9:
                d -= 9
        total += d
    return total % 10 == 0


def contains_sensitive(text: str) -> bool:
    if not text:
        return False
    if SSN_RE.search(text):
        return True
    for m in CARD_CANDIDATE_RE.finditer(text):
        digits = re.sub(r"\D", "", m.group(0))
        if 13 <= len(digits) <= 19 and _luhn_ok(digits):
            return True
    return False


def normalize_state(value) -> str:
    if not isinstance(value, str):
        return ""
    v = re.sub(r"[.\s]+", " ", value).strip().upper()
    if v in NY_ALIASES:
        return "NY"
    return v


def _check_text(value, max_len: int, required: bool = False, allow_newlines: bool = True):
    """Return (clean_value, error_code|None)."""
    if value is None or (isinstance(value, str) and not value.strip()):
        return None, ("required" if required else None)
    if not isinstance(value, str):
        return None, "invalid_type"
    clean = value.strip()
    if len(clean) > max_len:
        return None, "too_long"
    if CONTROL_RE.search(clean) or (not allow_newlines and LINEBREAK_RE.search(clean)):
        return None, "invalid_characters"
    return clean, None


def _short_key(key) -> str:
    text = str(key)
    return re.sub(r"[^A-Za-z0-9_\-]", "_", text)[:40] or "_"


def validate_request(payload, source_channel: str) -> dict:
    """Validate a public/voice request body. Raises RequestRejected / HoneypotTriggered."""
    if not isinstance(payload, dict):
        raise RequestRejected(422, {"error": "validation", "fields": {"body": "invalid_json"}})

    hp = payload.get("hp")
    if hp not in (None, "", False):
        raise HoneypotTriggered()

    service_id = payload.get("service_id")
    service = v2_catalog.get_service(service_id)
    if service is None:
        raise RequestRejected(422, {"error": "unknown_service"})

    errors: dict[str, str] = {}

    for key in payload:
        if key not in ALLOWED_TOP_LEVEL:
            errors[_short_key(key)] = "unexpected_field"

    idem = payload.get("idempotency_key")
    if not isinstance(idem, str) or not IDEMPOTENCY_RE.match(idem):
        errors["idempotency_key"] = "required" if not idem else "invalid"

    raw_locale = payload.get("locale", "en")
    locale = raw_locale if raw_locale in ("en", "ru", "es") else None
    if locale is None:
        errors["locale"] = "invalid_choice"

    if source_channel == "web":
        sc = payload.get("source_channel", "web")
        if sc not in SOURCE_CHANNELS_WEB:
            errors["source_channel"] = "invalid_choice"

    # contact
    contact = payload.get("contact")
    clean_contact = {"name": None, "email": None, "phone": None}
    if not isinstance(contact, dict):
        errors["contact.name"] = "required"
        errors["contact"] = "email_or_phone_required"
    else:
        for key in contact:
            if key not in ALLOWED_CONTACT:
                errors[f"contact.{_short_key(key)}"] = "unexpected_field"
        name, err = _check_text(contact.get("name"), MAX_NAME, required=True, allow_newlines=False)
        if err:
            errors["contact.name"] = err
        clean_contact["name"] = name
        email_raw = contact.get("email")
        if email_raw not in (None, ""):
            if not isinstance(email_raw, str) or len(email_raw.strip()) > 254 or not EMAIL_RE.match(email_raw.strip()):
                errors["contact.email"] = "invalid_email"
            else:
                clean_contact["email"] = email_raw.strip()
        phone_raw = contact.get("phone")
        if phone_raw not in (None, ""):
            ok = isinstance(phone_raw, str) and PHONE_RE.match(phone_raw.strip())
            digits = re.sub(r"\D", "", phone_raw) if isinstance(phone_raw, str) else ""
            if not ok or not 7 <= len(digits) <= 15:
                errors["contact.phone"] = "invalid_phone"
            else:
                clean_contact["phone"] = phone_raw.strip()
        if email_raw in (None, "") and phone_raw in (None, ""):
            errors["contact"] = "email_or_phone_required"

    # subtype
    subtype = payload.get("subtype")
    allowed_subtypes = list(service.get("subtypes") or [])
    if subtype in ("",):
        subtype = None
    if subtype is not None and subtype not in allowed_subtypes:
        errors["subtype"] = "invalid_choice"

    # details: only catalog fields (+ subtype)
    details = payload.get("details", {})
    clean_details: dict = {}
    allowed_fields = set(service.get("fields") or [])
    if details is None:
        details = {}
    if not isinstance(details, dict):
        errors["details"] = "invalid_type"
        details = {}
    for key, value in details.items():
        skey = _short_key(key)
        if key == "subtype":
            if value in (None, ""):
                continue
            if value not in allowed_subtypes or (subtype is not None and value != subtype):
                errors["details.subtype"] = "invalid_choice"
            elif subtype is None:
                subtype = value
            continue
        if key not in allowed_fields:
            errors[f"details.{skey}"] = "unexpected_field"
            continue
        if value is None or (isinstance(value, str) and not value.strip()):
            continue
        if isinstance(value, bool):
            clean_details[key] = value
        elif isinstance(value, (int, float)):
            if isinstance(value, float) and not math.isfinite(value):
                errors[f"details.{skey}"] = "invalid_type"
            else:
                clean_details[key] = value
        elif isinstance(value, str):
            clean, err = _check_text(value, MAX_DETAIL_VALUE)
            if err:
                errors[f"details.{skey}"] = err
            else:
                clean_details[key] = clean
        else:
            errors[f"details.{skey}"] = "invalid_type"

    if "tax_year" in clean_details:
        ty = str(clean_details["tax_year"]).strip()
        max_year = datetime.now(timezone.utc).year + 1
        if not (ty.isdigit() and len(ty) == 4 and 2000 <= int(ty) <= max_year):
            errors["details.tax_year"] = "invalid_year"
        else:
            clean_details["tax_year"] = ty

    if "b2b_state" in clean_details and isinstance(clean_details["b2b_state"], str):
        clean_details["b2b_state"] = normalize_state(clean_details["b2b_state"])

    summary, err = _check_text(payload.get("summary"), MAX_SUMMARY)
    if err:
        errors["summary"] = err

    consent = payload.get("consent")
    clean_consent = {"privacy": False, "notice_version": None, "referral": False}
    if not isinstance(consent, dict):
        errors["consent.privacy"] = "required"
    else:
        for key in consent:
            if key not in ALLOWED_CONSENT:
                errors[f"consent.{_short_key(key)}"] = "unexpected_field"
        if consent.get("privacy") is not True:
            errors["consent.privacy"] = "required"
        else:
            clean_consent["privacy"] = True
        nv, err = _check_text(consent.get("notice_version"), 64, allow_newlines=False)
        if err:
            errors["consent.notice_version"] = err
        clean_consent["notice_version"] = nv
        ref = consent.get("referral", False)
        if not isinstance(ref, bool):
            errors["consent.referral"] = "invalid_type"
        else:
            clean_consent["referral"] = ref

    if errors:
        raise RequestRejected(422, {"error": "validation", "fields": errors})

    # Sensitive data: summary, details values and the free-text name.
    texts = [summary or "", clean_contact["name"] or ""]
    texts += [str(v) for v in clean_details.values() if isinstance(v, str)]
    if any(contains_sensitive(t) for t in texts) or SSN_DASHED_RE.search(clean_contact["phone"] or ""):
        raise RequestRejected(422, {"error": "sensitive_data"})

    # B2B NY exclusion — business lane only; private services never check NY.
    if service.get("lane") == "business" and clean_details.get("b2b_state") == "NY":
        raise RequestRejected(422, {"error": "jurisdiction_excluded", "code": "B2B_NY_EXCLUDED"})

    return {
        "idempotency_key": idem,
        "service_id": service_id,
        "service": service,
        "subtype": subtype,
        "locale": locale,
        "source_channel": source_channel,
        "contact": clean_contact,
        "details": clean_details,
        "summary": summary,
        "consent": clean_consent,
    }
