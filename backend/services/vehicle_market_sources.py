from __future__ import annotations

from dataclasses import asdict, dataclass
from typing import Any


@dataclass
class VehicleMarketSource:
    slug: str
    label: str
    status: str
    source_type: str
    notes: str
    price_low: float | None = None
    price_mid: float | None = None
    price_high: float | None = None
    source_url: str | None = None

    def as_payload(self) -> dict[str, Any]:
        return asdict(self)


def _normalize_mileage_factor(mileage: int | None) -> float:
    if mileage is None or mileage <= 0:
        return 1.0
    if mileage <= 15000:
        return 1.03
    if mileage <= 45000:
        return 1.0
    if mileage <= 75000:
        return 0.94
    if mileage <= 110000:
        return 0.88
    return 0.8


def build_market_source_payload(
    *,
    vin: str,
    mileage: int | None,
    zip_code: str,
    asking_price: float | None,
    contract_vehicle_price: float | None,
    dealer_listing_price: float | None,
    vin_decoded: bool,
) -> dict[str, Any]:
    observed_values = [value for value in [asking_price, dealer_listing_price, contract_vehicle_price] if value is not None]
    mileage_factor = _normalize_mileage_factor(mileage)
    reference_mid = None
    if observed_values:
        reference_mid = round((sum(observed_values) / len(observed_values)) * mileage_factor, 2)
    reference_low = round(reference_mid * 0.92, 2) if reference_mid is not None else None
    reference_high = round(reference_mid * 1.08, 2) if reference_mid is not None else None

    sources = [
        VehicleMarketSource(
            slug="kbb",
            label="Kelley Blue Book",
            status="unavailable",
            source_type="licensed_provider_slot",
            notes="No licensed Kelley Blue Book integration is configured in this environment.",
            source_url="https://www.kbb.com/",
        ),
        VehicleMarketSource(
            slug="edmunds",
            label="Edmunds",
            status="unavailable",
            source_type="licensed_provider_slot",
            notes="No Edmunds pricing integration is configured in this environment.",
            source_url="https://www.edmunds.com/",
        ),
        VehicleMarketSource(
            slug="carfax",
            label="Carfax",
            status="unavailable",
            source_type="licensed_provider_slot",
            notes="No lawful Carfax vehicle-history integration is configured in this environment.",
            source_url="https://www.carfax.com/",
        ),
        VehicleMarketSource(
            slug="jd_power_nada",
            label="J.D. Power / NADA",
            status="unavailable",
            source_type="licensed_provider_slot",
            notes="No J.D. Power / NADA valuation integration is configured in this environment.",
            source_url="https://www.jdpower.com/cars",
        ),
        VehicleMarketSource(
            slug="nhtsa",
            label="NHTSA VIN Decoder",
            status="available" if vin_decoded else "review_needed",
            source_type="official_source",
            notes="Official vehicle identity and recall source. This source does not provide a live market value.",
            source_url=f"https://vpic.nhtsa.dot.gov/decoder/Decoder?VIN={vin}" if vin else "https://vpic.nhtsa.dot.gov/",
        ),
    ]

    if dealer_listing_price is not None:
        sources.append(
            VehicleMarketSource(
                slug="listing_reference",
                label="Listing reference",
                status="available",
                source_type="observed_market_reference",
                notes="Observed price from the dealer or listing page. Confirm that the same trim, fees, and condition match the deal in front of you.",
                price_low=dealer_listing_price,
                price_mid=dealer_listing_price,
                price_high=dealer_listing_price,
            )
        )

    if asking_price is not None:
        sources.append(
            VehicleMarketSource(
                slug="asking_price",
                label="User asking price",
                status="available",
                source_type="user_reference",
                notes="This is the asking price entered by the user. It is useful as a negotiation reference but not an independent valuation source.",
                price_low=asking_price,
                price_mid=asking_price,
                price_high=asking_price,
            )
        )

    if contract_vehicle_price is not None:
        sources.append(
            VehicleMarketSource(
                slug="contract_reference",
                label="Contract vehicle price",
                status="available",
                source_type="deal_document_reference",
                notes="This is the vehicle price extracted from the uploaded deal documents.",
                price_low=contract_vehicle_price,
                price_mid=contract_vehicle_price,
                price_high=contract_vehicle_price,
            )
        )

    confidence = "low"
    if vin_decoded and reference_mid is not None:
        confidence = "medium"
    if len([item for item in sources if item.status == "available" and item.price_mid is not None]) >= 2:
        confidence = "medium-high"

    return {
        "mileage": mileage,
        "zip_code": zip_code or "",
        "mileage_factor": mileage_factor,
        "estimated_range_low": reference_low,
        "estimated_range_mid": reference_mid,
        "estimated_range_high": reference_high,
        "confidence": confidence,
        "sources": [item.as_payload() for item in sources],
        "provider_limitations": [
            "Live KBB, Edmunds, Carfax, and J.D. Power / NADA pricing are not directly available in this environment.",
            "Observed pricing references and official NHTSA identity data are used honestly where configured.",
        ],
    }
