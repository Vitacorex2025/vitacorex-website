from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from fastapi.testclient import TestClient

from backend.main import app
from backend.tests.auth_test_utils import authenticated_client


ROOT = Path(__file__).resolve().parents[2]


def test_config_defaults_use_correct_render_service_host():
    config_py = (ROOT / "backend" / "core" / "config.py").read_text(encoding="utf-8")
    assert "https://docketmint.onrender.com" in config_py
    assert "https://docetmint.onrender.com" not in config_py


def test_deployment_configs_no_longer_route_root_into_workspace_or_docetmint_host():
    vercel_json = (ROOT / "vercel.json").read_text(encoding="utf-8")
    render_yaml = (ROOT / "render.yaml").read_text(encoding="utf-8")
    assert "/app/workspace/" not in vercel_json
    assert "https://docetmint.onrender.com" not in vercel_json
    assert "https://docetmint.onrender.com" not in render_yaml
    assert "name: docketmint" in render_yaml


def test_render_blueprint_uses_persistent_disk_for_storage():
    render_yaml = (ROOT / "render.yaml").read_text(encoding="utf-8")
    assert "disk:" in render_yaml
    assert "mountPath: /var/data" in render_yaml
    assert "DOCKETMINT_STORAGE_PATH" in render_yaml
    assert "/var/data/docketmint-storage" in render_yaml


def test_case_based_module_pages_exist_in_product_shell():
    module_pages = {
        "venue-engine": "venue_engine",
        "entity-verification": "entity_verification",
        "evidence-audit": "evidence_audit",
        "damages-calculator": "damages_calculator",
        "forms-autofill": "forms_autofill",
        "pre-suit-demand": "pre_suit_demand",
        "template-library": "template_library",
        "ocr-source-mapping": "ocr_source_map",
        "human-review": "human_review",
    }
    for directory, slug in module_pages.items():
        html = (ROOT / "app" / directory / "index.html").read_text(encoding="utf-8")
        assert f'data-module-slug="{slug}"' in html
        assert 'data-services-sidebar' in html
        assert 'service-module.js' in html


def test_template_library_screen_uses_truthful_system_library_copy():
    html = (ROOT / "app" / "template-library" / "index.html").read_text(encoding="utf-8")
    assert "Library coverage" in html
    assert "system template library only" in html
    assert "Current matter" not in html


def test_action_center_focuses_on_primary_matter_blocks_and_mobile_actions():
    html = (ROOT / "app" / "action-center" / "index.html").read_text(encoding="utf-8")
    script = (ROOT / "assets" / "js" / "action-center.js").read_text(encoding="utf-8")
    assert "Calendar &amp; Action Center" in html
    assert "Calendar &amp; deadlines" in html
    assert 'data-action-summary' in html
    assert 'data-action-next-step' in html
    assert 'data-action-deadlines' in html
    assert 'data-action-missing' in html
    assert 'data-action-contacts' in html
    assert 'data-action-outputs' in html
    assert 'data-action-progress' not in html
    assert 'data-mobile-open-workspace' in html
    assert 'data-mobile-mark-sent' in html
    assert 'setStatusBanner' not in script
    assert 'primary_next_step' in script
    assert 'optional_next_steps' in script
    assert 'Why this route was chosen' in script


def test_home_screen_stays_front_door_only():
    html = (ROOT / "app" / "home" / "index.html").read_text(encoding="utf-8")
    assert 'data-hub-environments' in html
    assert 'data-hub-quick-actions' in html
    assert 'data-hub-urgent' in html
    assert 'data-hub-records' in html
    assert 'data-hub-activity' in html
    assert "One platform. Two operational engines." in html
    assert "Run legal workflow and recovery pipeline from one shared operating surface." in html
    assert "Legal Workflow" in html
    assert "Recovery Pipeline" in html
    assert "permits, business setup, or compliance" not in html
    assert 'data-home-upload' not in html
    assert 'data-home-popular' not in html
    assert 'data-home-start-matter' not in html


def test_core_resolution_pages_use_single_primary_shell_stylesheet():
    for path in (
        ROOT / "app" / "home" / "index.html",
        ROOT / "app" / "legal" / "index.html",
        ROOT / "app" / "recovery" / "index.html",
        ROOT / "app" / "action-center" / "index.html",
        ROOT / "app" / "new-case" / "index.html",
        ROOT / "app" / "workspace" / "index.html",
        ROOT / "app" / "irs-notice" / "index.html",
        ROOT / "app" / "invoice-recovery" / "index.html",
    ):
        html = path.read_text(encoding="utf-8")
        assert "/assets/css/app-shell.css" in html
        assert "vitacorex-platform-shell.css" not in html


def test_logged_in_matters_outputs_and_settings_screens_share_the_app_shell():
    for path in (
        ROOT / "app" / "my-cases" / "index.html",
        ROOT / "app" / "downloads" / "index.html",
        ROOT / "app" / "settings" / "index.html",
        ROOT / "app" / "settings-support" / "index.html",
    ):
        html = path.read_text(encoding="utf-8")
        assert "/assets/css/app-shell.css" in html
        assert "vitacorex-platform-shell.css" not in html
        assert "/assets/css/styles.css" not in html


def test_all_logged_in_app_surfaces_use_normalized_shell_assets():
    for path in (ROOT / "app").rglob("index.html"):
        if path.parent.name in {"sign-in", "sign-up"}:
            continue
        html = path.read_text(encoding="utf-8")
        if 'data-app-screen="' not in html:
            continue
        assert "/assets/css/app-shell.css" in html, path.as_posix()
        assert "vitacorex-platform-shell.css" not in html, path.as_posix()
        assert "/assets/css/styles.css" not in html, path.as_posix()


def test_home_shell_includes_account_host_and_app_shell_styles_account_menu():
    home_html = (ROOT / "app" / "home" / "index.html").read_text(encoding="utf-8")
    shell_css = (ROOT / "assets" / "css" / "app-shell.css").read_text(encoding="utf-8")
    auth_js = (ROOT / "assets" / "js" / "auth.js").read_text(encoding="utf-8")
    home_js = (ROOT / "assets" / "js" / "home.js").read_text(encoding="utf-8")
    nav_js = (ROOT / "assets" / "js" / "platform-services.js").read_text(encoding="utf-8")
    assert "data-home-account" in home_html
    assert ".topbar-account-shell" in shell_css
    assert ".environment-switcher" in shell_css
    assert "buildEnvironmentSwitcher(session)" in auth_js
    assert "Operating environment switcher" in auth_js
    assert "action-center|downloads|workspace|calendar|document-prep" in nav_js
    assert ".account-button" in shell_css
    assert ".account-copy" in shell_css
    assert "node.textContent = account.workspace_name" not in home_js


def test_authenticated_shell_uses_fallback_nav_and_error_empty_states_instead_of_blank_panels():
    nav_js = (ROOT / "assets" / "js" / "platform-services.js").read_text(encoding="utf-8")
    home_js = (ROOT / "assets" / "js" / "home.js").read_text(encoding="utf-8")

    assert "FALLBACK_PRIMARY_NAV" in nav_js
    assert "label_key: 'nav.primary.calendar'" in nav_js
    assert "renderPrimaryNavigation(FALLBACK_PRIMARY_NAV)" in nav_js
    assert "window.addEventListener('docketmint:session'" in nav_js
    assert "document.addEventListener('vcx:i18n:change'" in nav_js
    assert "state.payload = {};" in home_js
    assert "No recent recovery records yet." in home_js
    assert "No urgent deadlines detected yet." in home_js
    assert "No recent recovery activity yet." in home_js


def test_nav_i18n_dictionary_covers_dual_engine_shell_labels():
    i18n_js = (ROOT / "assets" / "js" / "i18n.js").read_text(encoding="utf-8")

    assert "'nav.primary.legal': 'Legal'" in i18n_js
    assert "'nav.primary.recovery': 'Recovery'" in i18n_js
    assert "'nav.primary.calendar': 'Calendar'" in i18n_js
    assert "'nav.primary.document_prep': 'Document Prep'" in i18n_js
    assert "'nav.primary.legal': '\\u041b\\u0435\\u0433\\u0430\\u043b'" in i18n_js
    assert "'nav.primary.recovery': '\\u0412\\u0437\\u044b\\u0441\\u043a\\u0430\\u043d\\u0438\\u0435'" in i18n_js
    assert "'nav.primary.calendar': '\\u041a\\u0430\\u043b\\u0435\\u043d\\u0434\\u0430\\u0440\\u044c'" in i18n_js
    assert "'nav.primary.document_prep': '\\u041f\\u043e\\u0434\\u0433\\u043e\\u0442\\u043e\\u0432\\u043a\\u0430 \\u0434\\u043e\\u043a\\u0443\\u043c\\u0435\\u043d\\u0442\\u043e\\u0432'" in i18n_js
    assert "'nav.primary.recovery': 'Recuperacion'" in i18n_js
    assert "'nav.primary.calendar': 'Calendario'" in i18n_js
    assert "'nav.primary.document_prep': 'Preparacion documental'" in i18n_js


def test_authenticated_dual_engine_pages_use_structural_i18n_markers():
    for path in (
        ROOT / "app" / "home" / "index.html",
        ROOT / "app" / "recovery" / "index.html",
        ROOT / "app" / "legal" / "index.html",
        ROOT / "app" / "action-center" / "index.html",
        ROOT / "app" / "new-case" / "index.html",
        ROOT / "app" / "my-cases" / "index.html",
        ROOT / "app" / "case-intake" / "index.html",
    ):
        html = path.read_text(encoding="utf-8")
        assert 'data-i18n-title-key="' in html, path.as_posix()
        assert 'data-i18n="' in html, path.as_posix()
        assert 'data-i18n-aria-label="' in html, path.as_posix()


def test_wave4_i18n_dictionary_covers_authenticated_shell_pages_and_common_actions():
    i18n_js = (ROOT / "assets" / "js" / "i18n.js").read_text(encoding="utf-8")

    for key in (
        "'home_hub.title': 'Home | DocketMint'",
        "'recovery.title': 'Recovery Pipeline | DocketMint'",
        "'legal.title': 'Legal Workflow | DocketMint'",
        "'intake.title': 'Recovery Intake | DocketMint'",
        "'history.title': 'Matters | DocketMint'",
        "'action_center.title': 'Calendar & Action Center | DocketMint'",
        "'create_record.title': 'Create Record | DocketMint'",
        "'common.open': 'Open'",
        "'common.review': 'Review'",
        "'service_rail.recommended': 'Recommended for this matter'",
        "'home_hub.title': 'Главная | DocketMint'",
        "'recovery.title': 'Recovery Pipeline | DocketMint'",
        "'legal.title': 'Legal Workflow | DocketMint'",
        "'intake.status_draft': 'Черновик'",
        "'history.title': 'Дела | DocketMint'",
        "'action_center.topbar_kicker': 'Календарь и сроки'",
        "'create_record.title': 'Создать запись | DocketMint'",
    ):
        assert key in i18n_js


def test_authenticated_shell_runtime_scripts_rerender_on_locale_change():
    for path in (
        ROOT / "assets" / "js" / "app-shell.js",
        ROOT / "assets" / "js" / "platform-services.js",
        ROOT / "assets" / "js" / "home-hub.js",
        ROOT / "assets" / "js" / "home.js",
        ROOT / "assets" / "js" / "legal-dashboard.js",
        ROOT / "assets" / "js" / "case-intake.js",
        ROOT / "assets" / "js" / "my-cases.js",
        ROOT / "assets" / "js" / "action-center.js",
    ):
        script = path.read_text(encoding="utf-8")
        assert "window.VCXI18n" in script, path.as_posix()
        assert "vcx:i18n:change" in script, path.as_posix()


def test_wave5_shell_scripts_preserve_partial_data_and_explicit_fallback_copy():
    action_js = (ROOT / "assets" / "js" / "action-center.js").read_text(encoding="utf-8")
    downloads_js = (ROOT / "assets" / "js" / "downloads.js").read_text(encoding="utf-8")
    services_js = (ROOT / "assets" / "js" / "services-page.js").read_text(encoding="utf-8")
    downloads_html = (ROOT / "app" / "downloads" / "index.html").read_text(encoding="utf-8")
    services_html = (ROOT / "app" / "services" / "index.html").read_text(encoding="utf-8")
    i18n_js = (ROOT / "assets" / "js" / "i18n.js").read_text(encoding="utf-8")

    assert "Promise.allSettled([" in action_js
    assert "api.buildActionPacket(state.caseId)" in action_js
    assert "action_center.packet_unavailable_title" in action_js
    assert "action_center.partial_packet_status" in action_js

    assert "Promise.allSettled([" in downloads_js
    assert "api.getDownloads(state.caseId)" in downloads_js
    assert "downloads.partial_outputs_failed" in downloads_js
    assert "downloads.archive_unavailable_title" in downloads_js

    assert "services.catalog_unavailable_title" in services_js
    assert "services.mode.internal_module" in services_js
    assert "services.stage.upload.summary" in services_js

    assert 'data-i18n="downloads.archive_title"' in downloads_html
    assert 'data-i18n="services.catalog_title"' in services_html
    assert "'downloads.skip': 'Skip to downloads'" in i18n_js
    assert "'services.skip': 'Skip to recovery workflows'" in i18n_js
    assert "'common.yes': 'yes'" in i18n_js


def test_workspace_copy_positions_screen_as_document_prep():
    html = (ROOT / "app" / "workspace" / "index.html").read_text(encoding="utf-8")
    assert "Document Prep Workspace | DocketMint" in html
    assert "Document preparation" in html
    assert "Use this screen after Calendar &amp; Action Center" in html


def test_public_root_is_marketing_homepage_and_static_app_entry_points_to_sign_in():
    root_index = (ROOT / "index.html").read_text(encoding="utf-8")
    app_index = (ROOT / "app" / "index.html").read_text(encoding="utf-8")
    client = TestClient(app)

    assert "DocketMint | Legal workflow and recovery pipeline in one platform" in root_index
    assert "Run legal workflow and recovery pipeline in one system." in root_index
    assert "Request Demo" in root_index
    assert "One platform. Two operational engines." in root_index
    assert "Legal Workflow" in root_index
    assert "Recovery Pipeline" in root_index
    assert "/app/sign-in/" in root_index
    assert "/app/sign-up/" in root_index
    assert "/assets/css/vitacorex-public.css" in root_index
    assert "/assets/css/app-shell.css" not in root_index
    assert "window.location.replace('/app/sign-in/'" in app_index

    root_response = client.get("/")
    index_response = client.get("/index.html")
    assert root_response.status_code == 200
    assert index_response.status_code == 200
    assert "DocketMint" in root_response.text
    assert "DocketMint" in index_response.text


def test_public_homepage_rebuild_covers_required_conversion_sections_without_placeholder_copy():
    root_index = (ROOT / "index.html").read_text(encoding="utf-8")

    assert 'id="problem"' in root_index
    assert 'id="engines"' in root_index
    assert 'id="platform"' in root_index
    assert 'id="use-cases"' in root_index
    assert 'id="workflows"' in root_index
    assert 'id="trust"' in root_index
    assert 'id="preview"' in root_index
    assert 'id="faq"' in root_index
    assert 'id="final-cta"' in root_index
    assert "Request Demo" in root_index
    assert "One brand, one workspace, two disciplined ways to run the work." in root_index
    assert "shared records" in root_index.lower()
    assert "generic CRM" in root_index
    assert "legal workflow" in root_index.lower()
    assert "recovery pipeline" in root_index.lower()
    assert "Coming soon" not in root_index
    assert "Future-ready" not in root_index
    assert "all-in-one AI solution" not in root_index
    assert "game-changing" not in root_index


def test_vertical_pages_exist_for_irs_notice_and_invoice_recovery():
    irs_html = (ROOT / "app" / "irs-notice" / "index.html").read_text(encoding="utf-8")
    irs_js = (ROOT / "assets" / "js" / "irs-notice.js").read_text(encoding="utf-8")
    recovery_html = (ROOT / "app" / "invoice-recovery" / "index.html").read_text(encoding="utf-8")
    recovery_js = (ROOT / "assets" / "js" / "invoice-recovery.js").read_text(encoding="utf-8")

    assert "How to use this service" in irs_html
    assert "data-irs-build-packet" in irs_html
    assert "buildActionPacket" in irs_js
    assert "How to use this service" in recovery_html
    assert "data-build-recovery-packet" in recovery_html
    assert "buildActionPacket" in recovery_js


def test_service_module_script_contains_guide_and_template_library_logic():
    script = (ROOT / "assets" / "js" / "service-module.js").read_text(encoding="utf-8")
    assert "MODULE_GUIDES" in script
    assert "template_library" in script
    assert "renderGuide" in script
    assert "getTemplateRegistry()" in script


def test_standalone_contract_pages_use_session_flow():
    for directory, mode in {"contract-intelligence": "analysis", "best-contract-builder": "builder"}.items():
        html = (ROOT / "app" / directory / "index.html").read_text(encoding="utf-8")
        assert f'data-contract-mode="{mode}"' in html
        assert 'data-contract-upload-form' in html
        assert 'contract-session.js' in html


def test_contract_review_route_redirects_to_contract_intelligence():
    client = authenticated_client(app)
    response = client.get("/app/contract-review/", follow_redirects=False)
    assert response.status_code == 307
    assert response.headers["location"].startswith("/app/contract-intelligence/")


def test_new_library_routes_open_for_authenticated_users():
    client = authenticated_client(app)
    for route in ("/app/home/", "/app/legal/", "/app/recovery/", "/app/my-cases/", "/app/services/", "/app/case-intake/", "/app/template-library/", "/app/ocr-source-mapping/", "/app/human-review/", "/app/irs-notice/", "/app/invoice-recovery/"):
        response = client.get(route)
        assert response.status_code == 200, route
        assert "DocketMint" in response.text


def test_app_root_routes_single_environment_users_to_their_default_engine():
    client = authenticated_client(app, title="Collector", elevate_if_bootstrap=False)
    response = client.get("/app/", follow_redirects=False)
    if response.status_code == 307:
        assert response.headers["location"] == "/app/recovery/"
    else:
        assert response.status_code == 200
        assert ("Recovery Pipeline" in response.text) or ("data-home-upload" in response.text) or ("data-home-popular" in response.text)


def test_app_root_serves_environment_switcher_for_multi_environment_users():
    client = authenticated_client(app, title="Operations Manager", elevate_if_bootstrap=False)
    response = client.get("/app/", follow_redirects=False)
    assert response.status_code == 200
    assert "DocketMint" in response.text
    if 'data-hub-environments' in response.text:
        assert 'data-hub-quick-actions' in response.text
        assert 'Legal Workflow' in response.text
        assert 'Recovery Pipeline' in response.text
    else:
        assert ('Recovery Pipeline' in response.text) or ('Legal Workflow' in response.text) or ('data-home-upload' in response.text)


def test_auth_shell_supports_sign_out_and_existing_account_guidance():
    sign_in_html = (ROOT / "app" / "sign-in" / "index.html").read_text(encoding="utf-8")
    sign_in_js = (ROOT / "assets" / "js" / "sign-in.js").read_text(encoding="utf-8")
    sign_up_js = (ROOT / "assets" / "js" / "sign-up.js").read_text(encoding="utf-8")
    sign_up_html = (ROOT / "app" / "sign-up" / "index.html").read_text(encoding="utf-8")
    auth_js = (ROOT / "assets" / "js" / "auth.js").read_text(encoding="utf-8")
    settings_js = (ROOT / "assets" / "js" / "settings.js").read_text(encoding="utf-8")
    settings_css = (ROOT / "assets" / "css" / "settings-shell.css").read_text(encoding="utf-8")

    assert 'data-auth-info' in sign_in_html
    assert 'data-auth-signup-link' in sign_in_html
    assert "Use the same email you used when creating your account." in sign_in_html
    assert "Recovery OS workspace" in sign_in_html
    assert "Use at least 8 characters and confirm the same password below." in sign_up_html
    assert "start Recovery Diagnostic" in sign_up_html
    assert "signed_out" in sign_in_js
    assert "email_exists" in sign_in_js
    assert "Enter your email address." in sign_in_js
    assert "email_exists" in sign_up_js
    assert "Add your first name before creating the account." in sign_up_js
    assert "signed_out" in auth_js
    assert "signed_out" in settings_js
    assert "@media (max-width: 640px)" in settings_css
    assert "font-size:16px" in settings_css


def test_auth_entry_pages_use_shared_settings_shell_and_brand_hierarchy():
    sign_in_html = (ROOT / "app" / "sign-in" / "index.html").read_text(encoding="utf-8")
    sign_up_html = (ROOT / "app" / "sign-up" / "index.html").read_text(encoding="utf-8")
    settings_css = (ROOT / "assets" / "css" / "settings-shell.css").read_text(encoding="utf-8")

    assert "/assets/css/settings-shell.css" in sign_in_html
    assert "/assets/css/settings-shell.css" in sign_up_html
    assert "vitacorex-platform-shell.css" not in sign_in_html
    assert "vitacorex-platform-shell.css" not in sign_up_html
    assert "DocketMint <span>by VitaCoreX</span>" in sign_in_html
    assert "DocketMint <span>by VitaCoreX</span>" in sign_up_html
    assert ".auth-brand-note" in settings_css
    assert ".auth-mark" in settings_css


def test_step06_visual_system_uses_sober_palette_and_mobile_safe_areas():
    public_css = (ROOT / "assets" / "css" / "public-home.css").read_text(encoding="utf-8")
    app_css = (ROOT / "assets" / "css" / "app-shell.css").read_text(encoding="utf-8")
    sign_in_html = (ROOT / "app" / "sign-in" / "index.html").read_text(encoding="utf-8")
    sign_up_html = (ROOT / "app" / "sign-up" / "index.html").read_text(encoding="utf-8")

    assert "--accent:#18344f" in public_css
    assert "--app-accent:#18344f" in app_css
    assert "padding-bottom:env(safe-area-inset-bottom)" in app_css
    assert "meta name=\"theme-color\" content=\"#18344f\"" in sign_in_html
    assert "meta name=\"theme-color\" content=\"#18344f\"" in sign_up_html


def test_workspace_and_services_copy_use_resolution_os_language():
    workspace_html = (ROOT / "app" / "workspace" / "index.html").read_text(encoding="utf-8")
    services_html = (ROOT / "app" / "services" / "index.html").read_text(encoding="utf-8")
    services_js = (ROOT / "assets" / "js" / "services-page.js").read_text(encoding="utf-8")

    assert "Recovery OS" in services_html
    assert "Advanced matter workspace" in workspace_html
    assert 'data-workflow-flow' in workspace_html
    assert 'id="source-operations"' in workspace_html
    assert 'id="processing-review"' in workspace_html
    assert 'id="generated-outputs"' in workspace_html
    assert 'id="matter-activity"' in workspace_html
    assert "Operations platform" not in workspace_html
    assert "Recovery workflows" in services_html
    assert "Start Recovery Diagnostic" in services_html
    assert "Upload files, see blockers and readiness, then build the right next step." in services_html
    assert "Start, diagnose, and build" in services_html
    assert "function stageMeta(stage)" in services_js
    assert "item.funnel_stage" in services_js
    assert "group.domain" not in services_js
    assert "Coming soon" not in services_html
    assert "Future capabilities" not in services_html
    assert "future-ready" not in services_html.lower()


def test_workspace_script_does_not_duplicate_bind_forms():
    workspace_js = (ROOT / "assets" / "js" / "workspace.js").read_text(encoding="utf-8")
    assert workspace_js.count("function bindForms(){") == 1


def test_workspace_script_has_no_broken_string_literals():
    workspace_js = (ROOT / "assets" / "js" / "workspace.js").read_text(encoding="utf-8")
    assert "motion_for_clerks_default: 'Motion for Clerk's Default'" not in workspace_js
    assert 'motion_for_clerks_default: "Motion for Clerk\'s Default"' in workspace_js


def test_service_rail_copy_stays_recommendation_first():
    service_js = (ROOT / "assets" / "js" / "platform-services.js").read_text(encoding="utf-8")
    assert "Recommended for this matter" in service_js
    assert "Related workflows" in service_js
    assert "Available workflows" in service_js
    assert "'Related'" in service_js
    assert "'Optional'" in service_js
    assert "Future-ready only" not in service_js
    assert "No workflows available right now." not in service_js


def test_mobile_shell_uses_bottom_nav_for_logged_in_app_pages():
    shell_js = (ROOT / "assets" / "js" / "app-shell.js").read_text(encoding="utf-8")
    shell_css = (ROOT / "assets" / "css" / "app-shell.css").read_text(encoding="utf-8")
    assert "data-mobile-bottom-nav" in shell_js
    assert "mobile-bottom-nav" in shell_css
    assert "Matters" in shell_js
    assert "Legal" in shell_js
    assert "Recovery" in shell_js


def test_services_catalog_routes_case_bound_workflows_through_upload_first_intake_when_needed():
    services_js = (ROOT / "assets" / "js" / "services-page.js").read_text(encoding="utf-8")
    assert "function serviceHref(item)" in services_js
    assert "/app/case-intake/?workflow=" in services_js
    assert 'data-service-route' in services_js
    assert "secondary_services" not in services_js


def test_case_intake_shell_exists_for_upload_first_diagnosis_and_admin_promotion():
    intake_html = (ROOT / "app" / "case-intake" / "index.html").read_text(encoding="utf-8")
    intake_js = (ROOT / "assets" / "js" / "case-intake.js").read_text(encoding="utf-8")
    home_js = (ROOT / "assets" / "js" / "home.js").read_text(encoding="utf-8")
    router_js = (ROOT / "assets" / "js" / "intake-router.js").read_text(encoding="utf-8")
    platform_js = (ROOT / "assets" / "js" / "platform-services.js").read_text(encoding="utf-8")

    assert "Upload-first intake" in intake_html
    assert "Promote to formal matter" in intake_html
    assert "data-intake-dropzone" in intake_html
    assert "data-promote-intake" in intake_html
    assert "createRecoveryIntakeSession" in intake_js
    assert "promoteRecoveryIntakeSession" in intake_js
    assert "/app/case-intake/?workflow=" in home_js
    assert "/app/case-intake/?workflow=" in router_js
    assert "/app/case-intake/?workflow=" in platform_js


def test_logged_in_product_surfaces_hide_roadmap_and_demo_copy():
    new_case_html = (ROOT / "app" / "new-case" / "index.html").read_text(encoding="utf-8")
    workspace_html = (ROOT / "app" / "workspace" / "index.html").read_text(encoding="utf-8")
    settings_support_html = (ROOT / "app" / "settings-support" / "index.html").read_text(encoding="utf-8")
    dealer_html = (ROOT / "app" / "dealer-contract-check" / "index.html").read_text(encoding="utf-8")
    home_js = (ROOT / "assets" / "js" / "home.js").read_text(encoding="utf-8")
    intake_js = (ROOT / "assets" / "js" / "intake-router.js").read_text(encoding="utf-8")

    assert "Loading workflows..." not in new_case_html
    assert "Template registry loading..." not in workspace_html
    assert "Request Demo" not in settings_support_html
    assert "Request Pilot" not in settings_support_html
    assert "request-demo" not in settings_support_html
    assert "future-ready provider slots" not in dealer_html
    assert "unavailable right now" not in home_js
    assert "unavailable right now" not in intake_js
