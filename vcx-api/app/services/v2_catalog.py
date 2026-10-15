"""vcx-api v2 — catalog access.

The catalog JSON in the site repo (assets/data/vcx-catalog.json) is the single
source of truth for services, prices and routing. Nothing here duplicates a
price: every amount is read from the file at request time (cached by mtime).
"""

import json
import threading

from .v2_config import SUPPORTED_LOCALES, catalog_path

_lock = threading.Lock()
_cache: dict = {"key": None, "data": None}

NEXT_ACTION_BY_ACTION = {
    "book_pay": "book_checkout",
    "order": "checkout",
    "quote": "quote",
    "scope": "scope",
    "b2b": "b2b_review",
    "existing_client": "b2b_review",
}

PAYABLE_FIXED_MODE = "fixed_after_eligibility"

_PRICE_WORDS = {
    "en": {"from": "from {m} — price confirmed after review",
           "after_review": " — price confirmed after review",
           "prepay": "; first payment {m}",
           "plus": " plus "},
    "ru": {"from": "от {m} — цена подтверждается после проверки",
           "after_review": " — цена подтверждается после проверки",
           "prepay": "; первый платёж {m}",
           "plus": " плюс "},
    "es": {"from": "desde {m} — el precio se confirma tras la revisión",
           "after_review": " — el precio se confirma tras la revisión",
           "prepay": "; primer pago {m}",
           "plus": " más "},
}


class CatalogError(RuntimeError):
    pass


def load_catalog() -> dict:
    path = catalog_path()
    try:
        stat = path.stat()
    except OSError as exc:
        raise CatalogError("catalog_unavailable") from exc
    key = (str(path), stat.st_mtime_ns, stat.st_size)
    with _lock:
        if _cache["key"] == key and _cache["data"] is not None:
            return _cache["data"]
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, ValueError) as exc:
            raise CatalogError("catalog_invalid") from exc
        if not isinstance(data.get("services"), dict):
            raise CatalogError("catalog_invalid")
        _cache["key"], _cache["data"] = key, data
        return data


def catalog_version() -> str:
    return str(load_catalog().get("catalog_version", "unknown"))


def get_service(service_id) -> dict | None:
    if not isinstance(service_id, str):
        return None
    svc = load_catalog()["services"].get(service_id)
    return svc if isinstance(svc, dict) else None


def all_service_ids() -> list[str]:
    return list(load_catalog()["services"].keys())


def normalize_locale(value) -> str:
    if not isinstance(value, str):
        return "en"
    short = value.strip().lower()[:2]
    return short if short in SUPPORTED_LOCALES else "en"


def loc(value, locale: str) -> str:
    """Localized catalog text with English fallback."""
    if isinstance(value, dict):
        return str(value.get(locale) or value.get("en") or "")
    return str(value or "")


def next_action_for(service: dict) -> str:
    return NEXT_ACTION_BY_ACTION.get(service.get("action"), "b2b_review" if service.get("lane") == "business" else "quote")


def fixed_amount_cents(service: dict) -> int | None:
    """Catalog amount only for services payable at a fixed price."""
    price = service.get("price") or {}
    amount = price.get("amount_cents")
    if price.get("mode") == PAYABLE_FIXED_MODE and isinstance(amount, int) and amount > 0:
        return amount
    return None


def prepay_cents(service: dict) -> int | None:
    """Upfront minimum for unit-priced services that are paid before the work (court hours: 2 hours)."""
    price = service.get("price") or {}
    amount, units = price.get("amount_cents"), price.get("prepay_units")
    if isinstance(amount, int) and amount > 0 and isinstance(units, int) and units > 0:
        return amount * units
    return None


def _ru_plural(n: int, one: str, few: str, many: str) -> str:
    if n % 10 == 1 and n % 100 != 11:
        return one
    if 2 <= n % 10 <= 4 and not 12 <= n % 100 <= 14:
        return few
    return many


def money_text(cents: int, locale: str = "en") -> str:
    """Spoken-friendly money: $25, $149.50, 10 cents / 10 центов / 10 centavos."""
    cents = int(cents)
    if cents < 100:
        if locale == "ru":
            return f"{cents} {_ru_plural(cents, 'цент', 'цента', 'центов')}"
        if locale == "es":
            return f"{cents} {'centavo' if cents == 1 else 'centavos'}"
        return f"{cents} {'cent' if cents == 1 else 'cents'}"
    dollars, rem = divmod(cents, 100)
    whole = f"{dollars:,}"
    return f"${whole}" if rem == 0 else f"${whole}.{rem:02d}"


def _cap(text: str) -> str:
    return text[:1].upper() + text[1:] if text else text


def price_display_text(service: dict, locale: str) -> str:
    price = service.get("price") or {}
    display = price.get("display")
    amount = price.get("amount_cents")
    unit = loc(service.get("unit"), locale)
    words = _PRICE_WORDS.get(locale, _PRICE_WORDS["en"])
    if display == "percent" and price.get("percent") is not None:
        return f"{price['percent']}% {unit}".strip()
    if not isinstance(amount, int):
        return _cap(unit)
    m = money_text(amount, locale)
    if display == "fixed":
        return f"{m} {unit}".strip()
    if display == "fixed_plus_fees":
        return f"{m} {unit.replace(' + ', words['plus'])}".strip()
    if display == "from":
        return words["from"].format(m=m)
    if display in ("per_unit", "per_word", "per_hour"):
        prepay = prepay_cents(service)
        first = words["prepay"].format(m=money_text(prepay, locale)) if prepay else ""
        return f"{m} {unit}{first}{words['after_review']}".strip()
    return f"{m} {unit}".strip()


def public_catalog(locale: str) -> dict:
    data = load_catalog()
    services = []
    for sid, svc in data["services"].items():
        price = svc.get("price") or {}
        services.append({
            "id": sid,
            "name": loc(svc.get("name"), locale),
            "unit": loc(svc.get("unit"), locale),
            "price_display_text": price_display_text(svc, locale),
            "amount_cents": price.get("amount_cents"),
            "price_mode": price.get("mode"),
            "action": svc.get("action"),
            "queue": svc.get("queue"),
            "page": svc.get("page"),
            # additive fields (phone agent / forms)
            "lane": svc.get("lane"),
            "next_action": next_action_for(svc),
            "subtypes": list(svc.get("subtypes") or []),
            "fields": list(svc.get("fields") or []),
        })
    return {
        "catalog_version": str(data.get("catalog_version", "unknown")),
        "currency": data.get("currency", "USD"),
        "locale": locale,
        "services": services,
    }
