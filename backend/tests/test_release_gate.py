from __future__ import annotations

import sys
from pathlib import Path

from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from backend.main import app


ROOT = Path(__file__).resolve().parents[2]


def test_env_example_covers_release_critical_variables_without_real_secrets():
    env_example = (ROOT / ".env.example").read_text(encoding="utf-8")

    required_keys = [
        "DOCKETMINT_ENV",
        "DOCKETMINT_API_PREFIX",
        "DOCKETMINT_FRONTEND_URL",
        "DOCKETMINT_PUBLIC_APP_URL",
        "DOCKETMINT_PUBLIC_APP_WWW_URL",
        "DOCKETMINT_RENDER_SERVICE_URL",
        "DOCKETMINT_ALLOWED_ORIGINS",
        "DOCKETMINT_STORAGE_PATH",
        "DOCKETMINT_RENDER_DISK_MOUNT_PATH",
        "DOCKETMINT_BOOTSTRAP_ADMIN_EMAIL",
        "DOCKETMINT_BOOTSTRAP_ADMIN_PASSWORD",
        "DOCKETMINT_ENFORCE_ADMIN_ONLY_CASE_CREATION",
        "DOCKETMINT_ENFORCE_ADMIN_ONLY_PACKET_GENERATION",
        "DOCKETMINT_DEFAULT_PLAN",
        "DOCKETMINT_SESSION_COOKIE_NAME",
        "DOCKETMINT_LOG_LEVEL",
    ]

    for key in required_keys:
        assert f"{key}=" in env_example

    assert "vitacorex2025@gmail.com" not in env_example
    assert "<SECRET>" not in env_example
    assert "change_me_in_secret_manager" in env_example
    assert "admin@example.com" in env_example


def test_release_runbook_exists_and_covers_env_startup_smoke_and_rollback():
    runbook = (ROOT / "docs" / "RELEASE_RUNBOOK.md").read_text(encoding="utf-8")

    assert "Required Environment Variables" in runbook
    assert "Startup Order" in runbook
    assert "Staging Verification Steps" in runbook
    assert "Production Smoke Checks" in runbook
    assert "Rollback Conditions" in runbook
    assert "Ready Now vs Still Risky" in runbook
    assert "DOCKETMINT_BOOTSTRAP_ADMIN_EMAIL" in runbook
    assert "DOCKETMINT_BOOTSTRAP_ADMIN_PASSWORD" in runbook
    assert "DOCKETMINT_RENDER_DISK_MOUNT_PATH=/var/data" in runbook
    assert "DOCKETMINT_STORAGE_PATH=/var/data/docketmint-storage" in runbook
    assert "python -m pytest backend/tests -q" in runbook
    assert "python scripts/smoke_acceptance.py" in runbook


def test_release_gate_diagnostics_expose_storage_and_routing_signals():
    client = TestClient(app, base_url="https://www.docketmint.app")

    system_status = client.get("/api/system-status")
    assert system_status.status_code == 200
    system_payload = system_status.json()
    assert system_payload["status"] == "ok"
    assert system_payload["storage_path_source"]
    assert system_payload["storage_persistence_risk"]
    assert "render_disk_mount_path" in system_payload
    assert "storage_path_within_render_disk_mount" in system_payload
    assert "storage_mount_verified" in system_payload
    assert "startup_guard_enabled" in system_payload
    assert system_payload["auth_db_path"]
    assert isinstance(system_payload["auth_db_exists"], bool)
    assert system_payload["deployment_guidance"]["preferred_mode"] == "same_origin_fastapi_web_service"

    auth_diagnostics = client.get("/api/auth/diagnostics")
    assert auth_diagnostics.status_code == 200
    auth_payload = auth_diagnostics.json()
    assert auth_payload["storage_path_source"]
    assert auth_payload["storage_persistence_risk"]
    assert "render_disk_mount_path" in auth_payload
    assert "storage_path_within_render_disk_mount" in auth_payload
    assert "storage_mount_verified" in auth_payload
    assert "startup_guard_enabled" in auth_payload
    assert auth_payload["auth_db_path"]
    assert isinstance(auth_payload["auth_db_exists"], bool)
    assert auth_payload["request_host"] == "www.docketmint.app"
    assert auth_payload["request_scheme"] == "https"
    assert auth_payload["resolved_cookie_domain"] == "docketmint.app"
    assert auth_payload["resolved_cookie_secure"] is True
    assert auth_payload["resolved_cookie_samesite"] == "lax"
    assert "default_plan" in auth_payload


def test_render_yaml_uses_safe_render_disk_defaults():
    render_yaml = (ROOT / "render.yaml").read_text(encoding="utf-8")

    assert "mountPath: /var/data" in render_yaml
    assert "DOCKETMINT_RENDER_DISK_MOUNT_PATH" in render_yaml
    assert "value: /var/data" in render_yaml
    assert "DOCKETMINT_STORAGE_PATH" in render_yaml
    assert "value: /var/data/docketmint-storage" in render_yaml
