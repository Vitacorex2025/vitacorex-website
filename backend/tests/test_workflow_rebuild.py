
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def test_create_case_redirects_to_action_center_workflow():
    workspace_js = (ROOT / "assets" / "js" / "workspace.js").read_text(encoding="utf-8")
    new_case_html = (ROOT / "app" / "new-case" / "index.html").read_text(encoding="utf-8")
    assert "window.location.href = withCase('../action-center/', created.id);" in workspace_js
    assert "This formal recovery matter path is admin-controlled." in new_case_html
    assert "use the upload-first intake flow instead" in new_case_html


def test_upload_progress_frontend_logic_is_wired():
    api_client_js = (ROOT / "assets" / "js" / "api-client.js").read_text(encoding="utf-8")
    workspace_html = (ROOT / "app" / "workspace" / "index.html").read_text(encoding="utf-8")
    assert "XMLHttpRequest" in api_client_js
    assert "uploadSourceFilesWithProgress" in api_client_js
    assert "data-upload-progress-list" in workspace_html
    assert "data-upload-overall-fill" in workspace_html


def test_single_matter_guardrails_and_summary_panels_exist():
    workspace_js = (ROOT / "assets" / "js" / "workspace.js").read_text(encoding="utf-8")
    workspace_html = (ROOT / "app" / "workspace" / "index.html").read_text(encoding="utf-8")
    downloads_html = (ROOT / "app" / "downloads" / "index.html").read_text(encoding="utf-8")
    downloads_js = (ROOT / "assets" / "js" / "downloads.js").read_text(encoding="utf-8")
    assert "Single matter only." in workspace_html
    assert "Do not upload multiple debtor cases together." in workspace_html
    assert "data-source-set-summary" in workspace_html
    assert "data-reconciliation-summary" in workspace_html
    assert "data-communications-list" in workspace_html
    assert "data-settlement-list" in workspace_html
    assert "data-deadline-engine" in workspace_html
    assert "data-packet-archive-summary" in workspace_html
    assert "data-packet-archive" in downloads_html
    assert "Split into child matters" in workspace_html
    assert "renderSourceSetSummary" in workspace_js
    assert "renderReconciliationSummary" in workspace_js
    assert "renderCommunicationsLog" in workspace_js
    assert "renderSettlementTracker" in workspace_js
    assert "renderDeadlineEngine" in workspace_js
    assert "renderPacketArchive" in downloads_js


def test_same_origin_api_base_is_canonical_in_frontend_runtime():
    config_js = (ROOT / "assets" / "js" / "config.js").read_text(encoding="utf-8")
    api_client_js = (ROOT / "assets" / "js" / "api-client.js").read_text(encoding="utf-8")
    assert "defaultBase = isBrowserHttp ? '/api'" in config_js
    assert "preferredBaseFromStatus" in api_client_js
    assert "normalizedResolved === '/api'" in api_client_js
    assert "Math.min(99" in api_client_js


def test_shell_is_generic_and_session_scoped():
    api_client_js = (ROOT / "assets" / "js" / "api-client.js").read_text(encoding="utf-8")
    immigration_js = (ROOT / "assets" / "js" / "immigration-forms.js").read_text(encoding="utf-8")
    new_case_html = (ROOT / "app" / "new-case" / "index.html").read_text(encoding="utf-8")
    settings_html = (ROOT / "app" / "settings-support" / "index.html").read_text(encoding="utf-8")
    workspace_html = (ROOT / "app" / "workspace" / "index.html").read_text(encoding="utf-8")

    assert "VitaCoreX LLC" not in new_case_html
    assert "VitaCoreX LLC" not in settings_html
    assert "Current workspace" not in workspace_html
    assert "window.sessionStorage" in api_client_js
    assert "window.sessionStorage" in immigration_js
