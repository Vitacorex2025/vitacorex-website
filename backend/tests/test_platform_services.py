from __future__ import annotations

from datetime import datetime, timezone
from decimal import Decimal

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from fastapi.testclient import TestClient

from backend.main import app
from backend.models.case_schema import CaseRecord, FileType, PartyDetails, PartyRole, StoredFile
from backend.services.case_store import save_case
from backend.tests.auth_test_utils import authenticated_client


client = authenticated_client(app)


def test_platform_services_catalog_matches_client_facing_domains():
    response = client.get("/api/platform/services")
    assert response.status_code == 200
    payload = response.json()
    assert payload["service_count"] == 5
    assert payload["primary_service"] in {item["slug"] for item in payload["services"]}
    primary_nav = [item["slug"] for item in payload["primary_navigation"]]
    assert primary_nav == ["home", "my_cases", "action_center", "workspace", "downloads", "settings"]
    names = [item["name"] for item in payload["services"]]
    slugs = [item["slug"] for item in payload["services"]]
    assert names == [
        "Recovery Diagnostic",
        "Evidence Review",
        "Debtor Verification",
        "Demand Pack",
        "Counsel Handoff",
    ]
    assert slugs == [
        "invoice_recovery",
        "evidence_audit",
        "entity_verification",
        "demand_pack",
        "counsel_handoff",
    ]
    assert [item["funnel_stage"] for item in payload["services"]] == ["upload", "diagnose", "diagnose", "build", "build"]
    assert [item["public_order"] for item in payload["services"]] == [1, 2, 3, 4, 5]
    assert payload["secondary_services"] == []
    assert "contract_risk" not in slugs
    assert "stronger_contract" not in slugs
    assert "immigration_forms" not in slugs
    assert "auto_deal_integrity" not in slugs
    assert "irs_notice" not in slugs
    assert "debt_defense" not in slugs
    assert "credit_recovery" not in slugs


def test_platform_services_can_use_case_context():
    workspace_id = client.get("/api/auth/session").json()["workspace"]["id"]
    record = CaseRecord(id="case_platform_001", title="Invoice recovery matter", workspace_id=workspace_id)
    record.issue_category = "invoice_recovery_matter"
    record.workflow_slug = "invoice_recovery"
    record.current_stage = "classified"
    record.source_files = [
        StoredFile(
            id="source_platform_001",
            filename="contract.pdf",
            original_filename="contract.pdf",
            storage_path="storage/platform/contract.pdf",
            file_type=FileType.CONTRACT_PDF,
        )
    ]
    record.extracted_case_data.processed_at = datetime.now(timezone.utc)
    record.extracted_case_data.amount_in_controversy = Decimal("15000.00")
    record.extracted_case_data.amount_reconciliation.case_summary_total = Decimal("15000.00")
    record.extracted_case_data.contract_evidence = ["Master services agreement"]
    record.workflow_payload = {
        "invoice_recovery": {
            "supported_balance": "15000.00",
            "invoice_count": 4,
            "has_contract": True,
            "has_personal_guaranty": False,
            "has_governing_law_clause": True,
            "has_venue_clause": True,
            "performance_proof_present": True,
        }
    }
    record.extracted_case_data.plaintiff = PartyDetails(party_name="Client company", party_role=PartyRole.PLAINTIFF)
    save_case(record)
    response = client.get("/api/platform/services", params={"case_id": record.id})
    assert response.status_code == 200
    payload = response.json()
    services = {item["slug"]: item for item in payload["services"]}
    assert [item["slug"] for item in payload["services"]] == [
        "invoice_recovery",
        "evidence_audit",
        "entity_verification",
        "demand_pack",
        "counsel_handoff",
    ]
    assert payload["recommended_services"] == ["demand_pack"]
    assert services["demand_pack"]["status_code"] == "ready"
    assert services["demand_pack"]["relationship"] == "recommended"
    assert services["counsel_handoff"]["relationship"] == "related"
    assert services["demand_pack"]["relationship"] == "recommended"
    assert "primary action for this matter" in services["demand_pack"]["next_action"].lower()
    assert "build demand pack" in services["demand_pack"]["next_action"].lower()
    assert services["invoice_recovery"]["entry_mode"] == "case_bound"
    assert services["demand_pack"]["entry_mode"] == "case_bound"
    assert "contract_risk" not in services
    assert "immigration_forms" not in services


def test_platform_dashboard_includes_commercial_snapshot_for_home_and_settings():
    response = client.get("/api/platform/dashboard")
    assert response.status_code == 200
    payload = response.json()
    assert payload["commercial"]["plan_code"] == "starter"
    assert payload["commercial"]["plan_label"] == "Starter"
    assert payload["commercial"]["entitlements"]["seat_limit"] >= 1
    assert "batch_import_enabled" in payload["commercial"]["entitlements"]
