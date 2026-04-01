
from __future__ import annotations

import io
import json
import re
import shutil
from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from uuid import uuid4

import requests
from bs4 import BeautifulSoup
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

from backend.core.config import settings
from backend.services.docx_extractor import extract_docx_text
from backend.services.pdf_extractor import extract_pdf_text
from backend.services.vehicle_market_sources import build_market_source_payload


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def dealer_root() -> Path:
    root = settings.storage_path / "dealer_contract_check"
    root.mkdir(parents=True, exist_ok=True)
    return root


def session_dir(session_id: str) -> Path:
    path = dealer_root() / session_id
    path.mkdir(parents=True, exist_ok=True)
    return path


def session_meta_path(session_id: str) -> Path:
    return session_dir(session_id) / "session.json"


def report_pdf_path(session_id: str) -> Path:
    return session_dir(session_id) / "dealer_review_summary.pdf"


ADD_ON_PATTERNS: list[tuple[str, str, re.Pattern[str]]] = [
    ("paint_protection", "Paint / fabric protection", re.compile(r"(paint|fabric|ceramic|appearance)\s+(protection|coating|package)", re.I)),
    ("vin_etching", "VIN etching", re.compile(r"vin\s+etching", re.I)),
    ("gap", "GAP / debt protection", re.compile(r"\b(?:gap|guaranteed asset protection|debt cancellation|debt suspension)\b", re.I)),
    ("service_contract", "Service contract / extended warranty", re.compile(r"(service contract|extended warranty|vehicle service contract)", re.I)),
    ("prepaid_maintenance", "Prepaid maintenance", re.compile(r"(prepaid maintenance|maintenance plan)", re.I)),
    ("wheel_tire", "Wheel / tire package", re.compile(r"(wheel|tire).*(protection|package)", re.I)),
    ("theft_tracking", "Theft tracking / GPS", re.compile(r"(gps|tracking|theft|locator)", re.I)),
    ("nitrogen", "Nitrogen tires", re.compile(r"nitrogen", re.I)),
    ("window_tint", "Window tint", re.compile(r"window tint|tint package", re.I)),
]

PRICE_PATTERNS = [
    re.compile(r"(?:dealer\s+price|internet\s+price|sale\s+price|vehicle\s+price|cash\s+price|selling\s+price|market\s+adjustment|total\s+sale\s+price|advertised\s+price)[^\d$]{0,20}\$?\s*([0-9][0-9,]{2,}(?:\.\d{2})?)", re.I),
    re.compile(r"\$\s*([0-9][0-9,]{2,}(?:\.\d{2})?)"),
]

VIN_PATTERN = re.compile(r"\b([A-HJ-NPR-Z0-9]{17})\b", re.I)
AMOUNT_PATTERN = re.compile(r"\$?\s*([0-9][0-9,]{1,}(?:\.\d{2})?)")


@dataclass
class DealerSession:
    id: str
    created_at: str
    user_id: str | None
    workspace_id: str | None
    vin: str
    mileage: int | None
    zip_code: str
    asking_price: float | None
    dealer_url: str
    dealer_price_manual: float | None
    state_hint: str
    contract_files: list[dict[str, Any]]
    supporting_files: list[dict[str, Any]]
    vin_report: dict[str, Any]
    dealer_listing: dict[str, Any]
    extracted: dict[str, Any]
    market_sources: dict[str, Any]
    analysis: dict[str, Any]
    report_pdf_name: str | None = None


def _load_binary_text(filename: str, blob: bytes) -> str:
    lower = (filename or "").lower()
    if lower.endswith(".pdf"):
        temp = session_dir("tmp_extract") / f"{uuid4().hex}.pdf"
        temp.parent.mkdir(parents=True, exist_ok=True)
        temp.write_bytes(blob)
        try:
            payload = extract_pdf_text(temp)
            if isinstance(payload, dict):
                return str(payload.get("text") or "")
            return str(payload or "")
        finally:
            try:
                temp.unlink()
            except FileNotFoundError:
                pass
    if lower.endswith(".docx"):
        temp = session_dir("tmp_extract") / f"{uuid4().hex}.docx"
        temp.parent.mkdir(parents=True, exist_ok=True)
        temp.write_bytes(blob)
        try:
            payload = extract_docx_text(temp)
            if isinstance(payload, dict):
                return str(payload.get("text") or "")
            return str(payload or "")
        finally:
            try:
                temp.unlink()
            except FileNotFoundError:
                pass
    try:
        return blob.decode("utf-8", errors="ignore")
    except Exception:
        return ""


def _parse_amount(raw: str | None) -> float | None:
    if not raw:
        return None
    try:
        return round(float(str(raw).replace(",", "").replace("$", "").strip()), 2)
    except Exception:
        return None


def _money(value: float | None) -> str:
    if value is None:
        return "-"
    return f"${value:,.2f}"


def _extract_vin(text: str, manual_vin: str = "") -> str:
    candidate = (manual_vin or "").strip().upper()
    if VIN_PATTERN.fullmatch(candidate):
        return candidate
    match = VIN_PATTERN.search(text or "")
    return (match.group(1).upper() if match else "")


def _extract_prices(text: str) -> dict[str, float | None]:
    prices: list[float] = []
    labels: dict[str, float | None] = {
        "contract_vehicle_price": None,
        "contract_total_price": None,
    }
    lines = [line.strip() for line in (text or "").splitlines() if line.strip()]
    for line in lines:
        lower = line.lower()
        for pattern in PRICE_PATTERNS:
            m = pattern.search(line)
            if not m:
                continue
            amount = _parse_amount(m.group(1))
            if amount is None:
                continue
            prices.append(amount)
            if any(token in lower for token in ["vehicle price", "sale price", "selling price", "cash price", "dealer price", "internet price"]):
                labels["contract_vehicle_price"] = max(labels["contract_vehicle_price"] or 0, amount)
            if any(token in lower for token in ["total", "amount financed", "out the door", "otd", "balance"]):
                labels["contract_total_price"] = max(labels["contract_total_price"] or 0, amount)
    if labels["contract_vehicle_price"] is None and prices:
        labels["contract_vehicle_price"] = max(prices)
    if labels["contract_total_price"] is None and len(prices) > 1:
        labels["contract_total_price"] = max(prices)
    return labels


def _detect_add_ons(text: str) -> list[dict[str, Any]]:
    items: list[dict[str, Any]] = []
    seen: set[str] = set()
    lines = [line.strip() for line in (text or "").splitlines() if line.strip()]
    for line in lines:
        for slug, label, pattern in ADD_ON_PATTERNS:
            if not pattern.search(line):
                continue
            amount_match = AMOUNT_PATTERN.search(line)
            amount = _parse_amount(amount_match.group(1) if amount_match else None)
            key = f"{slug}:{line.lower()}"
            if key in seen:
                continue
            seen.add(key)
            items.append(
                {
                    "slug": slug,
                    "label": label,
                    "line_text": line[:240],
                    "amount": amount,
                    "status": "likely_optional",
                    "note": "This add-on appears optional and should be confirmed in writing before signing.",
                }
            )
    return items


def _fetch_json(url: str, timeout: float = 8.0) -> dict[str, Any]:
    response = requests.get(url, timeout=timeout, headers={"User-Agent": "DocketMint Dealer Check/1.0"})
    response.raise_for_status()
    return response.json()


def lookup_vin_official(vin: str) -> dict[str, Any]:
    vin = (vin or "").strip().upper()
    if not VIN_PATTERN.fullmatch(vin):
        return {
            "status": "missing_or_invalid_vin",
            "vin": vin,
            "warnings": ["Enter a full 17-character VIN to run the official NHTSA vehicle lookup."],
            "source_urls": [],
        }
    result = {
        "status": "decoded",
        "vin": vin,
        "vehicle": {},
        "warnings": [],
        "source_urls": [
            f"https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/{vin}?format=json",
            "https://www.nhtsa.gov/recalls",
        ],
        "recall_lookup_url": f"https://www.nhtsa.gov/recalls",
    }
    try:
        data = _fetch_json(f"https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/{vin}?format=json")
        row = ((data or {}).get("Results") or [{}])[0]
        result["vehicle"] = {
            "year": row.get("ModelYear") or "",
            "make": row.get("Make") or "",
            "model": row.get("Model") or "",
            "trim": row.get("Trim") or "",
            "body_class": row.get("BodyClass") or "",
            "series": row.get("Series") or "",
            "manufacturer": row.get("Manufacturer") or "",
        }
    except Exception as exc:
        result["status"] = "provider_unavailable"
        result["warnings"].append(f"NHTSA VIN lookup is currently unavailable: {exc}")
    return result


def _extract_price_from_html(soup: BeautifulSoup, html_text: str) -> tuple[float | None, list[str]]:
    warnings: list[str] = []
    # JSON-LD offers
    for script in soup.find_all("script", attrs={"type": "application/ld+json"}):
        raw = script.string or script.get_text(" ", strip=True)
        if not raw:
            continue
        try:
            payload = json.loads(raw)
        except Exception:
            continue
        nodes = payload if isinstance(payload, list) else [payload]
        for node in nodes:
            offers = node.get("offers") if isinstance(node, dict) else None
            if isinstance(offers, dict):
                price = _parse_amount(offers.get("price"))
                if price is not None:
                    return price, warnings
    # meta/itemprop price
    for tag in soup.find_all(attrs={"itemprop": "price"}):
        value = tag.get("content") or tag.get_text(" ", strip=True)
        price = _parse_amount(value)
        if price is not None:
            return price, warnings
    meta = soup.find("meta", attrs={"property": "product:price:amount"}) or soup.find("meta", attrs={"name": "price"})
    if meta:
        price = _parse_amount(meta.get("content"))
        if price is not None:
            return price, warnings
    for pattern in PRICE_PATTERNS:
        match = pattern.search(html_text)
        if match:
            price = _parse_amount(match.group(1))
            if price is not None:
                warnings.append("Dealer price was inferred from page text and should be confirmed on the listing page.")
                return price, warnings
    return None, warnings


def lookup_dealer_listing(dealer_url: str, manual_price: float | None = None) -> dict[str, Any]:
    dealer_url = (dealer_url or "").strip()
    payload = {
        "status": "not_provided",
        "dealer_url": dealer_url,
        "dealer_title": "",
        "dealer_price": manual_price,
        "warnings": [],
        "source_urls": [dealer_url] if dealer_url else [],
    }
    if manual_price is not None:
        payload["status"] = "manual_reference"
    if not dealer_url:
        if manual_price is None:
            payload["warnings"].append("Add the dealer listing URL or enter the advertised dealer price manually.")
        return payload
    try:
        response = requests.get(dealer_url, timeout=8.0, headers={"User-Agent": "DocketMint Dealer Check/1.0"})
        response.raise_for_status()
        html = response.text
        soup = BeautifulSoup(html, "html.parser")
        payload["dealer_title"] = (soup.title.string.strip() if soup.title and soup.title.string else "")
        price, parse_warnings = _extract_price_from_html(soup, soup.get_text(" ", strip=True))
        payload["warnings"].extend(parse_warnings)
        if price is not None:
            payload["dealer_price"] = price
            payload["status"] = "fetched_listing"
        elif manual_price is not None:
            payload["status"] = "manual_reference"
            payload["warnings"].append("The dealer page was reachable but the advertised price could not be parsed automatically.")
        else:
            payload["status"] = "needs_manual_review"
            payload["warnings"].append("The dealer page could not be parsed into a clear advertised price.")
    except Exception as exc:
        payload["warnings"].append(f"Dealer website lookup failed: {exc}")
        if manual_price is not None:
            payload["status"] = "manual_reference"
        else:
            payload["status"] = "unavailable"
    return payload


def _recommended_price(contract_vehicle_price: float | None, dealer_price: float | None, add_ons: list[dict[str, Any]]) -> dict[str, Any]:
    optional_total = round(sum(item.get("amount") or 0 for item in add_ons), 2)
    baseline_candidates = [value for value in [dealer_price, contract_vehicle_price] if value is not None]
    baseline = min(baseline_candidates) if baseline_candidates else None
    recommended = baseline
    if dealer_price is not None:
        recommended = dealer_price
    elif contract_vehicle_price is not None:
        recommended = max(contract_vehicle_price - optional_total, 0)
    delta = None
    if contract_vehicle_price is not None and recommended is not None:
        delta = round(contract_vehicle_price - recommended, 2)
    return {
        "recommended_possible_price": recommended,
        "optional_add_ons_total": optional_total if optional_total else None,
        "possible_savings_vs_contract_vehicle_price": delta,
    }


def _estimate_market_value(
    vin_report: dict[str, Any],
    contract_vehicle_price: float | None,
    dealer_price: float | None,
    add_ons: list[dict[str, Any]],
) -> dict[str, Any]:
    vehicle = vin_report.get("vehicle") or {}
    current_year = _utcnow().year
    try:
        year = int(str(vehicle.get("year") or "").strip() or "0")
    except Exception:
        year = 0

    body_class = str(vehicle.get("body_class") or "").lower()
    make = str(vehicle.get("make") or "").strip().lower()
    base_value = 26000.0
    if "sport utility" in body_class or "crossover" in body_class or "utility" in body_class:
        base_value = 32000.0
    elif "pickup" in body_class or "truck" in body_class:
        base_value = 39000.0
    elif "van" in body_class:
        base_value = 34000.0
    elif "coupe" in body_class or "convertible" in body_class:
        base_value = 30000.0
    elif "sedan" in body_class or "hatchback" in body_class or "wagon" in body_class:
        base_value = 25000.0

    make_multiplier = 1.0
    if make in {"bmw", "mercedes-benz", "audi", "lexus", "tesla", "porsche"}:
        make_multiplier = 1.28
    elif make in {"toyota", "honda", "subaru", "mazda"}:
        make_multiplier = 1.08
    elif make in {"gmc", "ram", "jeep"}:
        make_multiplier = 1.12
    elif make in {"kia", "hyundai", "chevrolet", "ford", "nissan", "volkswagen"}:
        make_multiplier = 0.98

    age = max(0, current_year - year) if year else 0
    age_multiplier = 1.0 if age <= 1 else max(0.24, 1.0 - (0.11 * age))
    add_on_total = round(sum(item.get("amount") or 0 for item in add_ons), 2)

    estimated_mid = round(base_value * make_multiplier * age_multiplier, 2)
    observed_values = [value for value in [dealer_price, contract_vehicle_price] if value is not None]
    if observed_values:
        weighted_observed = sum(observed_values) / len(observed_values)
        estimated_mid = round((estimated_mid * 0.45) + (weighted_observed * 0.55), 2)
    if contract_vehicle_price is not None and add_on_total:
        estimated_mid = round(min(estimated_mid, max(contract_vehicle_price - add_on_total, 0)), 2)

    confidence = "low"
    spread_ratio = 0.18
    if vin_report.get("status") == "decoded" and year:
        confidence = "medium"
        spread_ratio = 0.14
    if dealer_price is not None:
        confidence = "medium-high" if confidence == "medium" else "medium"
        spread_ratio = 0.1

    low = round(max(estimated_mid * (1 - spread_ratio), 0), 2)
    high = round(max(estimated_mid * (1 + spread_ratio), low), 2)
    return {
        "estimated_market_value": estimated_mid,
        "estimated_market_range_low": low,
        "estimated_market_range_high": high,
        "estimate_confidence": confidence,
        "estimate_method": "internal_rules_v1",
        "estimate_disclaimer": "Internal estimate based on decoded VIN attributes, age curve, body-class heuristics, and any observed contract or listing price. It is not a live market appraisal.",
    }


def analyze_deal(
    vin_report: dict[str, Any],
    dealer_listing: dict[str, Any],
    extracted: dict[str, Any],
    market_sources: dict[str, Any],
    state_hint: str = "",
) -> dict[str, Any]:
    contract_vehicle_price = extracted.get("contract_vehicle_price")
    contract_total_price = extracted.get("contract_total_price")
    add_ons = extracted.get("add_ons") or []
    dealer_price = dealer_listing.get("dealer_price")
    recommended = _recommended_price(contract_vehicle_price, dealer_price, add_ons)
    estimate = _estimate_market_value(vin_report, contract_vehicle_price, dealer_price, add_ons)
    source_references = list((market_sources or {}).get("sources") or [])
    market_mid = (market_sources or {}).get("estimated_range_mid")
    market_low = (market_sources or {}).get("estimated_range_low")
    market_high = (market_sources or {}).get("estimated_range_high")
    confidence = (market_sources or {}).get("confidence") or estimate.get("estimate_confidence")
    unavailable_sources = [item.get("label") for item in source_references if item.get("status") == "unavailable"]
    issues: list[str] = []
    if contract_vehicle_price is None:
        issues.append("The contract vehicle price could not be extracted confidently.")
    if dealer_price is None:
        issues.append("The dealer advertised price could not be confirmed automatically. Add the listing URL or enter the advertised price manually.")
    if add_ons:
        issues.append(f"{len(add_ons)} add-on line(s) look optional and should be confirmed before signing.")
    if contract_vehicle_price is not None and dealer_price is not None and contract_vehicle_price > dealer_price:
        issues.append("The contract vehicle price is higher than the dealer listing price.")
    if vin_report.get("status") != "decoded":
        issues.append("VIN decoding needs review before relying on the vehicle identity.")
    if any(item.get("status") == "unavailable" for item in source_references if item.get("slug") in {"kbb", "edmunds", "carfax", "jd_power_nada"}):
        issues.append("Some branded pricing or history sources are not connected live in this environment and are shown honestly as unavailable.")
    suspicious_fee_review: list[str] = []
    if add_ons:
        suspicious_fee_review.append("Optional add-ons were detected in the uploaded paperwork and should be confirmed line by line before signing.")
    if contract_vehicle_price is not None and dealer_price is not None and contract_vehicle_price > dealer_price:
        suspicious_fee_review.append("The contract vehicle price appears higher than the observed dealer listing price.")
    if contract_total_price is not None and contract_vehicle_price is not None and contract_total_price > contract_vehicle_price:
        suspicious_fee_review.append("The total deal amount exceeds the extracted vehicle price, so fees, products, and financing terms should be reviewed carefully.")
    negotiation_angle = "Use the clean vehicle price, the add-on total, and the observed listing reference to ask for a written reduction before signing."
    if recommended.get("possible_savings_vs_contract_vehicle_price"):
        negotiation_angle = (
            f"Ask the dealer to explain the gap and use the potential savings figure of {_money(recommended.get('possible_savings_vs_contract_vehicle_price'))} "
            "as the starting point for a written price reduction."
        )
    history_signal = {
        "status": "not_connected",
        "summary": "Vehicle-history, ownership-count, and damage-report feeds are not connected live in this environment.",
    }
    for item in source_references:
        if item.get("slug") == "carfax":
            history_signal = {
                "status": item.get("status") or "review_needed",
                "summary": item.get("notes") or history_signal["summary"],
            }
            break
    legal_notes = [
        "Dealer add-ons like GAP, VIN etching, protection products, and service contracts are often optional and should not be treated as automatically required.",
        "Ask the dealer and lender to state in writing whether each add-on is required for the deal or financing.",
    ]
    if state_hint:
        legal_notes.append(f"State-specific dealer-fee and add-on rules still require review for {state_hint}.")
    summary = {
        "vehicle_identity": vin_report.get("vehicle") or {},
        "contract_vehicle_price": contract_vehicle_price,
        "contract_total_price": contract_total_price,
        "dealer_listing_price": dealer_price,
        "recommended_possible_price": recommended.get("recommended_possible_price"),
        "optional_add_ons_total": recommended.get("optional_add_ons_total"),
        "possible_savings_vs_contract_vehicle_price": recommended.get("possible_savings_vs_contract_vehicle_price"),
        "estimated_market_value": market_mid or estimate.get("estimated_market_value"),
        "estimated_market_range_low": market_low or estimate.get("estimated_market_range_low"),
        "estimated_market_range_high": market_high or estimate.get("estimated_market_range_high"),
        "estimate_confidence": confidence,
        "estimate_method": estimate.get("estimate_method"),
        "estimate_disclaimer": estimate.get("estimate_disclaimer"),
        "source_references": source_references,
        "unavailable_sources": unavailable_sources,
        "provider_limitations": list((market_sources or {}).get("provider_limitations") or []),
        "history_signal": history_signal,
        "suspicious_fee_review": suspicious_fee_review,
        "negotiation_angle": negotiation_angle,
        "issues": issues,
        "legal_notes": legal_notes,
        "recommended_actions": [
            "Match the signed numbers against the dealer website before signing.",
            "Ask the dealer to remove any optional add-ons you do not want.",
            "Ask for every fee and protection product to be explained in writing.",
            "Do not rely only on the monthly payment; compare the full vehicle price and total financed amount.",
        ],
    }
    return summary


def _session_from_dict(payload: dict[str, Any]) -> DealerSession:
    payload.setdefault("user_id", None)
    payload.setdefault("workspace_id", None)
    payload.setdefault("mileage", None)
    payload.setdefault("zip_code", "")
    payload.setdefault("asking_price", None)
    payload.setdefault("market_sources", {})
    return DealerSession(**payload)


def save_session(session: DealerSession) -> DealerSession:
    session_meta_path(session.id).write_text(json.dumps(asdict(session), indent=2), encoding="utf-8")
    return session


def load_session(session_id: str) -> DealerSession:
    path = session_meta_path(session_id)
    if not path.exists():
        raise FileNotFoundError(f"Dealer contract check session not found: {session_id}")
    session = _session_from_dict(json.loads(path.read_text(encoding="utf-8")))
    try:
        from backend.services.auth_service import current_user_id, current_workspace_id

        active_user_id = current_user_id()
        active_workspace_id = current_workspace_id()
        if active_user_id and session.user_id and session.user_id != active_user_id:
            raise FileNotFoundError(f"Dealer contract check session not found: {session_id}")
        if active_workspace_id and session.workspace_id and session.workspace_id != active_workspace_id:
            raise FileNotFoundError(f"Dealer contract check session not found: {session_id}")
    except FileNotFoundError:
        raise
    except Exception:
        pass
    return session


def list_sessions(limit: int = 20) -> list[DealerSession]:
    sessions: list[DealerSession] = []
    for path in dealer_root().glob("*/session.json"):
        try:
            payload = json.loads(path.read_text(encoding="utf-8"))
            sessions.append(load_session(str(payload.get("id") or "")))
        except Exception:
            continue
    sessions.sort(key=lambda item: item.created_at, reverse=True)
    return sessions[:limit]


def delete_session(session_id: str) -> None:
    directory = dealer_root() / session_id
    if not directory.exists():
        raise FileNotFoundError(f"Dealer contract check session not found: {session_id}")
    shutil.rmtree(directory, ignore_errors=False)


def create_session(
    contract_files: list[tuple[str, bytes]],
    supporting_files: list[tuple[str, bytes]] | None = None,
    vin: str = "",
    mileage: int | None = None,
    zip_code: str = "",
    asking_price: float | None = None,
    dealer_url: str = "",
    dealer_price_manual: float | None = None,
    state_hint: str = "",
) -> DealerSession:
    supporting_files = supporting_files or []
    try:
        from backend.services.auth_service import current_user_id, current_workspace_id

        active_user_id = current_user_id()
        active_workspace_id = current_workspace_id()
    except Exception:
        active_user_id = None
        active_workspace_id = None
    session_id = f"dealer_{uuid4().hex[:12]}"
    base = session_dir(session_id)
    file_records: list[dict[str, Any]] = []
    support_records: list[dict[str, Any]] = []
    all_text = []
    for idx, (name, blob) in enumerate(contract_files):
        stored = f"contract_{idx+1}_{Path(name or 'contract').name}"
        (base / stored).write_bytes(blob)
        text = _load_binary_text(name or stored, blob)
        all_text.append(text)
        file_records.append({"name": name or stored, "stored_name": stored, "size": len(blob), "kind": "contract"})
    for idx, (name, blob) in enumerate(supporting_files):
        stored = f"support_{idx+1}_{Path(name or 'support').name}"
        (base / stored).write_bytes(blob)
        text = _load_binary_text(name or stored, blob)
        all_text.append(text)
        support_records.append({"name": name or stored, "stored_name": stored, "size": len(blob), "kind": "support"})
    merged_text = "\n".join(all_text)
    resolved_vin = _extract_vin(merged_text, vin)
    vin_report = lookup_vin_official(resolved_vin)
    dealer_listing = lookup_dealer_listing(dealer_url, dealer_price_manual)
    price_data = _extract_prices(merged_text)
    add_ons = _detect_add_ons(merged_text)
    extracted = {
        "resolved_vin": resolved_vin,
        "contract_vehicle_price": price_data.get("contract_vehicle_price"),
        "contract_total_price": price_data.get("contract_total_price"),
        "add_ons": add_ons,
        "text_excerpt": merged_text[:4000],
    }
    market_sources = build_market_source_payload(
        vin=resolved_vin,
        mileage=mileage,
        zip_code=zip_code,
        asking_price=asking_price,
        contract_vehicle_price=extracted.get("contract_vehicle_price"),
        dealer_listing_price=dealer_listing.get("dealer_price"),
        vin_decoded=vin_report.get("status") == "decoded",
    )
    analysis = analyze_deal(vin_report, dealer_listing, extracted, market_sources, state_hint)
    session = DealerSession(
        id=session_id,
        created_at=_utcnow().isoformat(),
        user_id=active_user_id,
        workspace_id=active_workspace_id,
        vin=resolved_vin,
        mileage=mileage,
        zip_code=(zip_code or "").strip(),
        asking_price=asking_price,
        dealer_url=dealer_url.strip(),
        dealer_price_manual=dealer_price_manual,
        state_hint=(state_hint or "").strip(),
        contract_files=file_records,
        supporting_files=support_records,
        vin_report=vin_report,
        dealer_listing=dealer_listing,
        extracted=extracted,
        market_sources=market_sources,
        analysis=analysis,
    )
    return save_session(session)


def rerun_session(
    session_id: str,
    vin: str | None = None,
    mileage: int | None = None,
    zip_code: str | None = None,
    asking_price: float | None = None,
    dealer_url: str | None = None,
    dealer_price_manual: float | None = None,
    state_hint: str | None = None,
) -> DealerSession:
    session = load_session(session_id)
    if vin is not None:
        session.vin = vin
    if mileage is not None:
        session.mileage = mileage
    if zip_code is not None:
        session.zip_code = zip_code
    if asking_price is not None or asking_price is None:
        session.asking_price = asking_price
    if dealer_url is not None:
        session.dealer_url = dealer_url
    if state_hint is not None:
        session.state_hint = state_hint
    if dealer_price_manual is not None or dealer_price_manual is None:
        session.dealer_price_manual = dealer_price_manual
    merged_text = session.extracted.get("text_excerpt") or ""
    resolved_vin = _extract_vin(merged_text, session.vin)
    session.vin = resolved_vin
    session.vin_report = lookup_vin_official(resolved_vin)
    session.dealer_listing = lookup_dealer_listing(session.dealer_url, session.dealer_price_manual)
    session.market_sources = build_market_source_payload(
        vin=resolved_vin,
        mileage=session.mileage,
        zip_code=session.zip_code,
        asking_price=session.asking_price,
        contract_vehicle_price=session.extracted.get("contract_vehicle_price"),
        dealer_listing_price=session.dealer_listing.get("dealer_price"),
        vin_decoded=session.vin_report.get("status") == "decoded",
    )
    session.analysis = analyze_deal(session.vin_report, session.dealer_listing, session.extracted, session.market_sources, session.state_hint)
    return save_session(session)


def generate_report_pdf(session_id: str) -> DealerSession:
    session = load_session(session_id)
    buffer = io.BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    y = height - 50

    def section(title: str):
        nonlocal y
        if y < 78:
            pdf.showPage()
            y = height - 50
        pdf.setFont("Helvetica-Bold", 12)
        pdf.drawString(50, y, title[:90])
        y -= 18

    def line(text: str, step: int = 16):
        nonlocal y
        if y < 50:
            pdf.showPage()
            y = height - 50
        pdf.setFont("Helvetica", 10)
        pdf.drawString(50, y, text[:110])
        y -= step

    pdf.setFont("Helvetica-Bold", 16)
    pdf.drawString(50, y, "VitaCoreX Auto Deal Integrity Report")
    y -= 28
    line(f"Session: {session.id}")
    line(f"VIN: {session.vin or '-'}")
    vehicle = session.vin_report.get("vehicle") or {}
    line(f"Vehicle: {' '.join(str(vehicle.get(k) or '') for k in ['year','make','model','trim']).strip() or '-'}")
    line(f"Mileage: {session.mileage if session.mileage is not None else '-'}")
    line(f"ZIP / state hint: {session.zip_code or session.state_hint or '-'}")
    line(f"Contract vehicle price: {_money(session.analysis.get('contract_vehicle_price'))}")
    line(f"Dealer listing price: {_money(session.analysis.get('dealer_listing_price'))}")
    line(f"Asking price reference: {_money(session.asking_price)}")
    line(f"Recommended possible price: {_money(session.analysis.get('recommended_possible_price'))}")
    line(f"Estimated midpoint: {_money(session.analysis.get('estimated_market_value'))}")
    line(f"Estimated range: {_money(session.analysis.get('estimated_market_range_low'))} to {_money(session.analysis.get('estimated_market_range_high'))}")
    line(f"Confidence: {session.analysis.get('estimate_confidence') or '-'}")
    line(f"Optional add-ons total: {_money(session.analysis.get('optional_add_ons_total'))}")
    line(f"Possible savings vs contract price: {_money(session.analysis.get('possible_savings_vs_contract_vehicle_price'))}")
    section("Provider status")
    for item in session.analysis.get("source_references") or []:
        line(f"- {item.get('label')}: {item.get('status')} | {item.get('notes')}")
    section("History and ownership signals")
    history_signal = session.analysis.get("history_signal") or {}
    line(f"- Status: {history_signal.get('status') or '-'}")
    line(f"- {history_signal.get('summary') or 'No vehicle-history source notes available.'}")
    section("Suspicious fees and add-ons")
    for item in session.analysis.get("suspicious_fee_review") or []:
        line(f"- {item}")
    add_ons = session.extracted.get("add_ons") or []
    if not add_ons:
        line("No obvious optional add-on lines were detected from the uploaded text.")
    else:
        for item in add_ons:
            line(f"- {item.get('label')}: {_money(item.get('amount'))} | {item.get('line_text')}")
    section("Negotiation angle")
    line(session.analysis.get("negotiation_angle") or "Review the pricing, optional products, and dealer explanations before signing.")
    section("Recommended actions")
    for item in session.analysis.get("recommended_actions") or []:
        line(f"- {item}")
    section("Legal and review notes")
    for item in session.analysis.get("legal_notes") or []:
        line(f"- {item}")
    for item in session.analysis.get("provider_limitations") or []:
        line(f"- {item}")
    pdf.save()
    report_pdf_path(session.id).write_bytes(buffer.getvalue())
    session.report_pdf_name = report_pdf_path(session.id).name
    return save_session(session)


def session_payload(session: DealerSession) -> dict[str, Any]:
    payload = asdict(session)
    payload["session_id"] = session.id
    payload["service_slug"] = "auto_deal_integrity"
    payload["title"] = session.contract_files[0]["name"] if session.contract_files else session.id
    payload["report_pdf_url"] = (
        f"/files/dealer_contract_check/{session.id}/{session.report_pdf_name}"
        if session.report_pdf_name
        else None
    )
    return payload
