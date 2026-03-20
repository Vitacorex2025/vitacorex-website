
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from fastapi.testclient import TestClient

from backend.main import app
from backend.tests.auth_test_utils import authenticated_client

client = authenticated_client(app)
DATA_DIR = Path(__file__).resolve().parents[1] / "sample_inputs"


def _create_case(title: str, plaintiff: str | None = None, defendant: str | None = None) -> str:
    response = client.post(
        "/api/cases",
        json={"matter_name": title, "plaintiff_name": plaintiff, "defendant_name": defendant},
    )
    assert response.status_code == 200
    return response.json()["id"]


def test_new_case_route_no_longer_auto_attaches_stored_active_case():
    workspace_js = (Path(__file__).resolve().parents[2] / "assets" / "js" / "workspace.js").read_text(encoding="utf-8")
    new_case_html = (Path(__file__).resolve().parents[2] / "app" / "new-case" / "index.html").read_text(encoding="utf-8")
    assert "screen === 'new-case' && !explicitCase" in workspace_js
    assert "Create mode starts clean" in new_case_html


def test_canonical_snapshot_hides_stale_party_fields_without_source_evidence():
    case_id = _create_case("Forensics stale state", plaintiff="Client Company LLC", defendant="Counterparty LLC")
    response = client.get(f"/api/cases/{case_id}")
    assert response.status_code == 200
    snapshot = response.json()["client_snapshot"]
    assert snapshot["status"] == "draft"
    assert snapshot["source_file_count"] == 0
    assert snapshot["plaintiff"] is None
    assert snapshot["defendant"] is None
    assert snapshot["blocker_count"] >= 1
    assert "No source evidence is uploaded for this case." in snapshot["blockers"]


def test_generation_is_fail_closed_when_source_evidence_is_missing():
    case_id = _create_case("Empty matter generation block")
    response = client.post(f"/api/generate/{case_id}?wait=true", json={"selected_document_types": ["complaint"]})
    assert response.status_code == 400
    payload = response.json()["error"]["detail"]
    assert any("No source evidence is uploaded for this case." in item for item in payload["blocking_items"])


def test_source_removal_invalidates_packet_like_state_and_restores_draft_snapshot():
    case_id = _create_case("Source invalidation", plaintiff="Client Company", defendant="Counterparty")
    sample = DATA_DIR / "Counterparty LLC.pdf"
    with sample.open("rb") as handle:
        upload = client.post(
            f"/api/cases/{case_id}/source-files",
            files=[("files", (sample.name, handle, "application/pdf"))],
        )
    assert upload.status_code == 200
    case_after_upload = client.get(f"/api/cases/{case_id}").json()
    file_id = case_after_upload["source_files"][0]["id"]
    assert case_after_upload["client_snapshot"]["status"] == "uploaded"
    removal = client.delete(f"/api/cases/{case_id}/source-files/{file_id}")
    assert removal.status_code == 200
    final_case = client.get(f"/api/cases/{case_id}").json()
    snapshot = final_case["client_snapshot"]
    assert snapshot["status"] == "draft"
    assert snapshot["source_file_count"] == 0
    assert snapshot["generated_document_count"] == 0
    assert snapshot["has_zip"] is False


def test_shell_uses_home_first_navigation_with_workspace_as_separate_ops_screen():
    root = Path(__file__).resolve().parents[2]
    home_html = (root / "app" / "home" / "index.html").read_text(encoding="utf-8")
    workspace_html = (root / "app" / "workspace" / "index.html").read_text(encoding="utf-8")
    assert 'data-app-screen="home"' in home_html
    assert "Turn confusing paperwork into a clear next step" in home_html
    assert 'data-app-screen="workspace"' in workspace_html
    assert "Advanced matter workspace" in workspace_html
    assert "/app/home/" in workspace_html
    assert "Review Data" not in workspace_html
    assert "Generate Packet" not in workspace_html
    assert "Recent matters" in home_html


def test_app_root_serves_home_shell_and_legacy_route_redirects():
    home = client.get("/app/")
    assert home.status_code == 200
    assert "Turn confusing paperwork into a clear next step" in home.text
    legacy = client.get("/app/review-data/")
    assert legacy.status_code == 200
    assert "Evidence Audit" in legacy.text


def test_generate_route_returns_structured_blocked_payload():
    case_id = _create_case("Blocked payload shape")
    response = client.post(f"/api/generate/{case_id}", json={"selected_document_types": ["complaint"]})
    assert response.status_code == 400
    detail = response.json()["error"]["detail"]
    assert detail["status"] == "blocked"
    assert "complaint" in detail["documents_not_generated"]
    assert detail["allowed_document_types"] == []


def test_upload_invalidation_response_includes_canonical_snapshot():
    case_id = _create_case("Upload invalidation response")
    sample = DATA_DIR / "Counterparty LLC.pdf"
    with sample.open("rb") as handle:
        upload = client.post(
            f"/api/cases/{case_id}/source-files",
            files=[("files", (sample.name, handle, "application/pdf"))],
        )
    assert upload.status_code == 200
    assert "client_snapshot" in upload.json()
