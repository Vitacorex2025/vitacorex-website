from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from backend.main import app
from backend.models.case_schema import CaseRecord, DownloadLedgerEntry
from backend.services.case_store import ensure_case_dirs, load_case, save_case
from backend.tests.auth_test_utils import authenticated_client


def test_home_dashboard_and_history_include_cases_and_sessions():
    client = authenticated_client(app)

    case = client.post(
        "/api/cases",
        json={"matter_name": "History matter", "plaintiff_name": "Client LLC", "defendant_name": "Counterparty LLC"},
    ).json()
    case_id = case["id"]

    contract_text = b"Governing law Florida. Venue Miami-Dade County. Attorneys' fees and personal guaranty apply."
    contract_session = client.post(
        "/api/contract-intelligence/sessions",
        files=[("contract_files", ("agreement.txt", contract_text, "text/plain"))],
    )
    assert contract_session.status_code == 200, contract_session.text

    dashboard = client.get("/api/platform/dashboard")
    assert dashboard.status_code == 200
    dashboard_payload = dashboard.json()
    assert dashboard_payload["recent_cases"][0]["id"] == case_id
    assert any(item["service_slug"] == "contract_intelligence" for item in dashboard_payload["recent_sessions"])

    history = client.get("/api/platform/history")
    assert history.status_code == 200
    history_payload = history.json()
    assert any(item["id"] == case_id for item in history_payload["cases"])
    assert any(item["service_slug"] == "contract_intelligence" for item in history_payload["sessions"])


def test_case_delete_and_output_remove_routes_work():
    client = authenticated_client(app)
    created = client.post(
        "/api/cases",
        json={"matter_name": "Delete matter", "plaintiff_name": "Client LLC", "defendant_name": "Counterparty LLC"},
    ).json()
    case_id = created["id"]

    dirs = ensure_case_dirs(case_id)
    output_path = dirs["output_dir"] / "test_output.docx"
    output_path.write_bytes(b"docx")
    record = load_case(case_id)
    record.download_ledger.append(
        DownloadLedgerEntry(
            id="ledger_delete_001",
            file_name=output_path.name,
            file_path=str(output_path),
            download_url=f"/files/cases/{case_id}/output/{output_path.name}",
        )
    )
    save_case(record)

    remove_output = client.delete(f"/api/downloads/cases/{case_id}/ledger_delete_001")
    assert remove_output.status_code == 200, remove_output.text
    assert not output_path.exists()

    delete_case = client.delete(f"/api/cases/{case_id}?hard=true")
    assert delete_case.status_code == 200, delete_case.text
    assert not dirs["case_root"].exists()


def test_platform_commercial_payload_exposes_plan_usage_and_event_counters():
    client = authenticated_client(app)

    session = client.get("/api/auth/session")
    assert session.status_code == 200
    assert session.json()["commercial"]["plan_code"] == "starter"

    baseline = client.get("/api/platform/commercial")
    assert baseline.status_code == 200
    baseline_payload = baseline.json()
    assert baseline_payload["plan_label"] == "Starter"
    assert baseline_payload["entitlements"]["max_active_matters"] >= 1
    assert baseline_payload["usage"]["event_counters"]["upload_started"] == 0

    tracked = client.post(
        "/api/platform/usage-events",
        json={"event_type": "upload_started", "payload": {"source": "settings_test"}},
    )
    assert tracked.status_code == 200, tracked.text

    refreshed = client.get("/api/platform/commercial")
    assert refreshed.status_code == 200
    refreshed_payload = refreshed.json()
    assert refreshed_payload["usage"]["event_counters"]["upload_started"] == 1

    dashboard = client.get("/api/platform/dashboard")
    assert dashboard.status_code == 200
    assert dashboard.json()["commercial"]["plan_code"] == "starter"
