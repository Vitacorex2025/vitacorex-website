
from __future__ import annotations

import io
import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from reportlab.pdfgen import canvas

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from backend.main import app
from backend.tests.auth_test_utils import authenticated_client
import backend.services.dealer_contract_check_service as dealer_service

client = authenticated_client(app)


class DummyResponse:
    def __init__(self, json_data=None, text="", status_code=200):
        self._json = json_data
        self.text = text
        self.status_code = status_code
    def json(self):
        return self._json
    def raise_for_status(self):
        if self.status_code >= 400:
            raise RuntimeError(f"HTTP {self.status_code}")


def fake_requests_get(url, timeout=8.0, headers=None):
    if "DecodeVinValuesExtended" in url:
        return DummyResponse(
            json_data={
                "Results": [{
                    "ModelYear": "2023",
                    "Make": "Toyota",
                    "Model": "Camry",
                    "Trim": "SE",
                    "BodyClass": "Sedan",
                    "Manufacturer": "Toyota Motor Manufacturing"
                }]
            }
        )
    if "dealer.example" in url:
        html = """
        <html><head><title>Dealer Listing</title>
        <script type="application/ld+json">
        {"@context":"https://schema.org","@type":"Product","offers":{"price":"27995"}}
        </script></head>
        <body><h1>2023 Toyota Camry SE</h1></body></html>
        """
        return DummyResponse(text=html)
    raise RuntimeError("unexpected url " + url)


@pytest.fixture(autouse=True)
def patch_requests(monkeypatch):
    monkeypatch.setattr(dealer_service.requests, "get", fake_requests_get)


def build_contract_pdf() -> bytes:
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer)
    c.drawString(72, 760, "Retail Installment Contract")
    c.drawString(72, 740, "VIN 1HGCM82633A004352")
    c.drawString(72, 720, "Vehicle Price $31,995.00")
    c.drawString(72, 700, "Paint Protection $1,295.00")
    c.drawString(72, 680, "VIN Etching $399.00")
    c.showPage()
    c.save()
    buffer.seek(0)
    return buffer.read()


def test_create_dealer_contract_session_and_generate_pdf():
    pdf_bytes = build_contract_pdf()
    response = client.post(
        "/api/dealer-contract-check/sessions",
        data={"dealer_url": "https://dealer.example/listing", "state_hint": "Florida", "mileage": "45210", "asking_price": "28995"},
        files=[("contract_files", ("dealer-contract.pdf", pdf_bytes, "application/pdf"))],
    )
    assert response.status_code == 200
    payload = response.json()
    assert payload["vin"] == "1HGCM82633A004352"
    assert payload["mileage"] == 45210
    assert payload["asking_price"] == 28995
    assert payload["vin_report"]["vehicle"]["make"] == "Toyota"
    assert payload["dealer_listing"]["dealer_price"] == 27995
    assert len(payload["extracted"]["add_ons"]) >= 2
    assert payload["analysis"]["recommended_possible_price"] == 27995
    assert payload["analysis"]["source_references"]
    assert payload["analysis"]["provider_limitations"]

    report = client.post(f"/api/dealer-contract-check/sessions/{payload['id']}/generate-report")
    assert report.status_code == 200
    generated = report.json()
    assert generated["report_pdf_url"].endswith("/dealer_review_summary.pdf")


def test_dealer_contract_route_is_served():
    response = client.get("/app/dealer-contract-check/")
    assert response.status_code == 200
    assert "Auto Deal Integrity" in response.text
