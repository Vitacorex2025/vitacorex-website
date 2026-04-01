from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from fastapi.testclient import TestClient

from backend.main import app
from backend.services.template_registry import strict_template_report
from backend.tests.auth_test_utils import authenticated_client

client = TestClient(app)


def test_template_registry_has_all_11_seeded_templates():
    report = strict_template_report()
    assert report["all_templates_available"] is True
    assert report["template_count"] == 11
    assert report["fallback_enabled"] is False


def test_health_and_system_status_routes():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

    api_response = client.get("/api/health")
    assert api_response.status_code == 200
    assert api_response.json()["status"] == "ok"

    system_status = client.get("/api/system-status")
    assert system_status.status_code == 200
    payload = system_status.json()
    assert payload["status"] == "ok"
    assert payload["files_base"] == "/files"
    assert payload["template_library"]["all_templates_available"] is True
    assert payload["canonical_api_base"] == "/api"
    assert payload["public_api_url"] == "/api"
    assert payload["backend_candidates"][0] == "/api"
    assert payload["storage_path_source"]
    assert payload["storage_persistence_risk"]


def test_workspace_shell_mounts():
    authed = authenticated_client(app)
    response = authed.get("/app/new-case/")
    assert response.status_code == 200
    assert "data-create-case-form" in response.text
    assert "data-page-heading" in response.text


def test_case_intake_shell_mounts_for_authenticated_users():
    authed = authenticated_client(app)
    response = authed.get("/app/case-intake/")
    assert response.status_code == 200
    assert "Recovery Intake" in response.text
    assert "Upload-first intake" in response.text
    assert "data-intake-dropzone" in response.text


def test_root_entry_serves_public_homepage_and_legacy_app_html_still_routes_into_app():
    root = client.get("/", follow_redirects=False)
    assert root.status_code == 200
    assert "DocketMint" in root.text
    assert "Run legal workflow and recovery pipeline in one system." in root.text
    assert "One platform. Two operational engines." in root.text
    assert "Request Demo" in root.text
    assert "/app/sign-in/" in root.text

    legacy = client.get("/app.html", follow_redirects=False)
    assert legacy.status_code == 307
    assert legacy.headers["location"] == "/app/sign-in/"


def test_workspace_requires_authentication():
    response = client.get("/app/workspace/", follow_redirects=False)
    assert response.status_code == 307
    assert response.headers["location"].startswith("/app/sign-in/")


def test_dual_engine_case_creation_filtering_and_linking():
    authed = authenticated_client(app)

    recovery = authed.post(
        "/api/cases",
        json={
            "reference": "REC-001",
            "matter_name": "Recovery record",
            "environment_tag": "recovery",
            "record_type": "recovery_record",
        },
    )
    assert recovery.status_code == 200
    recovery_payload = recovery.json()
    assert recovery_payload["environment_tag"] == "recovery"
    assert recovery_payload["record_type"] == "recovery_record"

    legal = authed.post(
        "/api/cases",
        json={
            "reference": "LEG-001",
            "matter_name": "Legal matter",
            "environment_tag": "legal",
            "record_type": "legal_matter",
            "linked_case_id": recovery_payload["id"],
        },
    )
    assert legal.status_code == 200
    legal_payload = legal.json()
    assert legal_payload["environment_tag"] == "legal"
    assert legal_payload["record_type"] == "legal_matter"

    legal_cases = authed.get("/api/cases", params={"environment_tag": "legal"})
    recovery_cases = authed.get("/api/cases", params={"environment_tag": "recovery"})
    assert legal_cases.status_code == 200
    assert recovery_cases.status_code == 200
    assert all(item["environment_tag"] == "legal" for item in legal_cases.json())
    assert all(item["environment_tag"] == "recovery" for item in recovery_cases.json())

    legal_record = authed.get(f"/api/cases/{legal_payload['id']}")
    recovery_record = authed.get(f"/api/cases/{recovery_payload['id']}")
    assert legal_record.status_code == 200
    assert recovery_record.status_code == 200
    assert legal_record.json()["linked_records"][0]["case_id"] == recovery_payload["id"]
    assert recovery_record.json()["linked_records"][0]["case_id"] == legal_payload["id"]
