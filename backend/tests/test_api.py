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
    assert "Start an operator intake" in response.text
    assert "data-create-case-form" in response.text


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
    assert "Revenue recovery design and documentation control" in root.text
    assert "Request confidential review" in root.text
    assert "/app/sign-in/" in root.text

    legacy = client.get("/app.html", follow_redirects=False)
    assert legacy.status_code == 307
    assert legacy.headers["location"] == "/app/sign-in/"


def test_workspace_requires_authentication():
    response = client.get("/app/workspace/", follow_redirects=False)
    assert response.status_code == 307
    assert response.headers["location"].startswith("/app/sign-in/")
