from __future__ import annotations

import json
import sys
from pathlib import Path

from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from backend.vitacorex_runtime import app


ROOT = Path(__file__).resolve().parents[2]


def test_public_runtime_serves_localized_routes_and_assets():
    client = TestClient(app)

    assert client.get("/").status_code == 200
    assert client.get("/contact.html").status_code == 200
    assert client.get("/resources.html").status_code == 200
    assert client.get("/ru/").status_code == 200
    assert client.get("/ru/contact.html").status_code == 200
    assert client.get("/es/resources.html").status_code == 200
    assert client.get("/robots.txt").status_code == 200
    assert client.get("/sitemap.xml").status_code == 200
    assert client.get("/manifest.webmanifest").status_code == 200


def test_public_runtime_homepage_and_forms_use_vitacorex_shell():
    client = TestClient(app)

    home = client.get("/")
    contact = client.get("/contact.html")
    resources = client.get("/resources.html")

    assert "VitaCoreX" in home.text
    assert "Request confidential review" in home.text
    assert "VitaCoreX is not a law firm" in home.text
    assert "data-shell-switcher" in home.text
    assert "window.VCX_TRACKING_IDS" in home.text
    assert "data-intake-form" in contact.text
    assert "company_review" in contact.text
    assert "executive_brief" in resources.text
    assert "FormSubmit" not in contact.text
    assert "DocketMint by VitaCoreX" not in resources.text


def test_public_intake_endpoint_stores_structured_submission():
    client = TestClient(app)

    response = client.post(
        "/api/vitacorex/intake",
        data={
            "purpose": "company_review",
            "lang": "en",
            "full_name": "Test Operator",
            "work_email": "operator@example.com",
            "company_name": "Operator Group",
            "service_line": "company confidential review",
            "thank_you_path": "/thank-you.html?purpose=company_review",
            "landing_page": "https://vitacorexllc.com/contact.html?utm_source=qa",
            "msclkid": "msclkid-test",
            "li_fat_id": "li-fat-test",
            "submitted_after_ms": "2500",
        },
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["ok"] is True
    assert payload["purpose"] == "company_review"
    assert payload["pipeline_stage"] == "New"
    assert payload["thank_you_url"].startswith("/thank-you.html?purpose=company_review")
    assert "&lead=vcx-" in payload["thank_you_url"]
    storage_path = Path(payload["storage_path"])
    assert storage_path.exists()
    stored = json.loads((storage_path / "lead.json").read_text(encoding="utf-8"))
    assert stored["context"]["landing_page"] == "https://vitacorexllc.com/contact.html?utm_source=qa"
    assert stored["context"]["msclkid"] == "msclkid-test"
    assert stored["context"]["li_fat_id"] == "li-fat-test"


def test_public_intake_honeypot_is_rejected():
    client = TestClient(app)

    response = client.post(
        "/api/vitacorex/intake",
        data={
            "purpose": "individual_request",
            "lang": "en",
            "full_name": "Spam Bot",
            "email": "spam@example.com",
            "service_line": "Contracts and documentation support",
            "company_website": "https://spam.invalid",
            "submitted_after_ms": "2500",
        },
    )

    assert response.status_code == 400
    payload = response.json()
    code = (
        payload.get("code")
        or payload.get("detail", {}).get("code")
        or payload.get("error", {}).get("detail", {}).get("code")
    )
    assert code == "spam_blocked"


def test_generated_public_files_exist():
    expected = [
        ROOT / "assets" / "css" / "vitacorex-public.css",
        ROOT / "assets" / "js" / "vitacorex-public.js",
        ROOT / "assets" / "img" / "og-vitacorex-2026.svg",
        ROOT / "assets" / "briefs" / "vitacorex-executive-brief.pdf",
        ROOT / "assets" / "briefs" / "vitacorex-pilot-structure.pdf",
        ROOT / "assets" / "briefs" / "vitacorex-file-control-sample.pdf",
        ROOT / "ru" / "index.html",
        ROOT / "ru" / "contact.html",
        ROOT / "es" / "index.html",
        ROOT / "es" / "resources.html",
    ]
    for path in expected:
        assert path.exists(), path
