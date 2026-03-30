from __future__ import annotations

import json
import os
import socket
import sys
import time
from multiprocessing import Process
from pathlib import Path
from uuid import uuid4

import httpx
from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[3]
STEP = Path(__file__).resolve().parents[1]
SITE = STEP / "site"
AUDIT = STEP / "audit"
SCREENS = STEP / "screens"
STORAGE = AUDIT / "browser_runtime_storage"
REPORT_PATH = AUDIT / "browser_verification_matrix.json"
WEBKIT_PATH = AUDIT / "browser_verification_webkit.json"

PAGES = [
    ("en_home", "/"),
    ("en_corporate_legal_file_control", "/corporate-legal-file-control.html"),
    ("en_revenue_recovery_workflow", "/revenue-recovery-workflow.html"),
    ("en_structured_intake", "/structured-case-intake.html"),
    ("en_resources", "/resources.html"),
    ("en_additional_services", "/additional-services.html"),
    ("en_careers", "/careers.html"),
    ("en_contact", "/contact.html"),
    ("en_thank_you", "/thank-you.html?purpose=company_review&lead=seed123"),
    ("en_ai_intake", "/ai-intake.html"),
    ("ru_home", "/ru/"),
    ("ru_corporate_legal_file_control", "/ru/corporate-legal-file-control.html"),
    ("ru_revenue_recovery_workflow", "/ru/revenue-recovery-workflow.html"),
    ("ru_structured_intake", "/ru/structured-case-intake.html"),
    ("ru_resources", "/ru/resources.html"),
    ("ru_additional_services", "/ru/additional-services.html"),
    ("ru_careers", "/ru/careers.html"),
    ("ru_contact", "/ru/contact.html"),
    ("ru_thank_you", "/ru/thank-you.html?purpose=company_review&lead=seed123"),
    ("es_home", "/es/"),
    ("es_corporate_legal_file_control", "/es/corporate-legal-file-control.html"),
    ("es_revenue_recovery_workflow", "/es/revenue-recovery-workflow.html"),
    ("es_structured_intake", "/es/structured-case-intake.html"),
    ("es_resources", "/es/resources.html"),
    ("es_additional_services", "/es/additional-services.html"),
    ("es_careers", "/es/careers.html"),
    ("es_contact", "/es/contact.html"),
    ("es_thank_you", "/es/thank-you.html?purpose=company_review&lead=seed123"),
]
VIEWPORTS = [
    ("390", 390, 844),
    ("768", 768, 1024),
    ("1440", 1440, 1200),
]


def free_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.bind(("127.0.0.1", 0))
        return int(sock.getsockname()[1])


def serve(port: int, storage_path: str) -> None:
    os.environ["DOCKETMINT_STORAGE_PATH"] = storage_path
    if str(SITE) not in sys.path:
        sys.path.insert(0, str(SITE))
    import uvicorn
    from backend.vitacorex_runtime import app

    uvicorn.run(app, host="127.0.0.1", port=port, log_level="error", access_log=False)


def wait_for(url: str, timeout: float = 30.0) -> None:
    started = time.time()
    while time.time() - started < timeout:
        try:
            response = httpx.get(url, timeout=2.0)
            if response.status_code == 200:
                return
        except Exception:
            pass
        time.sleep(0.25)
    raise RuntimeError(f"Timed out waiting for {url}")


def attach_listeners(page, entry):
    page.add_init_script(
        """
        window.__VCX_UNHANDLED__ = [];
        window.addEventListener('unhandledrejection', function(event){
          window.__VCX_UNHANDLED__.push(String((event.reason && event.reason.message) || event.reason || 'unhandled rejection'));
        });
        """
    )

    def on_console(msg):
        entry["console_messages"].append({"type": msg.type, "text": msg.text})

    def on_page_error(exc):
        entry["page_errors"].append(str(exc))

    def on_request_failed(request):
        failure = request.failure
        entry["request_failures"].append(
            {
                "url": request.url,
                "method": request.method,
                "error_text": failure.error_text if failure else "",
            }
        )

    page.on("console", on_console)
    page.on("pageerror", on_page_error)
    page.on("requestfailed", on_request_failed)
    return on_console, on_page_error, on_request_failed


def finalize_page(page, entry, listeners):
    on_console, on_page_error, on_request_failed = listeners
    page.remove_listener("console", on_console)
    page.remove_listener("pageerror", on_page_error)
    page.remove_listener("requestfailed", on_request_failed)
    try:
        entry["unhandled_rejections"] = page.evaluate("() => window.__VCX_UNHANDLED__ || []")
    except Exception:
        entry["unhandled_rejections"] = []


def capture_page(context, base: str, route: str, slug: str, viewport_label: str):
    page = context.new_page()
    entry = {
        "route": route,
        "slug": slug,
        "viewport": viewport_label,
        "console_messages": [],
        "page_errors": [],
        "request_failures": [],
    }
    listeners = attach_listeners(page, entry)
    response = page.goto(base + route, wait_until="networkidle", timeout=45000)
    entry["document_status"] = response.status if response else None
    entry["title"] = page.title()
    screenshot = SCREENS / f"{slug}_{viewport_label}.png"
    page.screenshot(path=str(screenshot), full_page=True)
    entry["screenshot"] = screenshot.name
    finalize_page(page, entry, listeners)
    page.close()
    return entry


def prime_context(context) -> None:
    context.add_init_script(
        """
        try {
          window.localStorage.setItem('vitacorex-consent', 'essential');
        } catch (error) {}
        """
    )


def main() -> int:
    STORAGE.mkdir(parents=True, exist_ok=True)
    SCREENS.mkdir(parents=True, exist_ok=True)
    AUDIT.mkdir(parents=True, exist_ok=True)

    port = free_port()
    base = f"http://127.0.0.1:{port}"
    process = Process(target=serve, args=(port, str(STORAGE)), daemon=True)
    process.start()

    report = {
        "base_url": base,
        "pages": [],
        "interaction_checks": {},
        "summary": {
            "screenshots": 0,
            "console_errors": 0,
            "console_warnings": 0,
            "page_errors": 0,
            "request_failures": 0,
            "unhandled_rejections": 0,
            "non_200_documents": 0,
        },
    }
    webkit_report = {"available": False}

    try:
        wait_for(base + "/api/health")
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(headless=True)
            try:
                for viewport_label, width, height in VIEWPORTS:
                    context = browser.new_context(viewport={"width": width, "height": height})
                    prime_context(context)
                    for slug, route in PAGES:
                        entry = capture_page(context, base, route, slug, viewport_label)
                        report["pages"].append(entry)
                        report["summary"]["screenshots"] += 1
                        report["summary"]["console_errors"] += sum(1 for item in entry["console_messages"] if item["type"] == "error")
                        report["summary"]["console_warnings"] += sum(1 for item in entry["console_messages"] if item["type"] == "warning")
                        report["summary"]["page_errors"] += len(entry["page_errors"])
                        report["summary"]["request_failures"] += len(entry["request_failures"])
                        report["summary"]["unhandled_rejections"] += len(entry["unhandled_rejections"])
                        if entry["document_status"] != 200:
                            report["summary"]["non_200_documents"] += 1
                    context.close()

                interaction = {
                    "menu": {},
                    "cta": {},
                    "locale": {},
                    "contact_form": {},
                    "resources_form": {},
                    "thank_you_locale": {},
                    "dealer_check": {},
                    "errors": [],
                }

                mobile = browser.new_context(viewport={"width": 390, "height": 844})
                prime_context(mobile)
                page = mobile.new_page()
                page.goto(base + "/", wait_until="networkidle", timeout=45000)
                interaction["menu"]["mobile_switcher_visible_before_open"] = page.locator("#mobileMenu [data-shell-locale]").first.is_visible() if page.locator("#mobileMenu [data-shell-locale]").count() else False
                page.locator("[data-public-menu-toggle]").click()
                interaction["menu"]["opens"] = page.locator("[data-public-menu-panel]").is_visible() and page.locator("[data-public-menu-toggle]").get_attribute("aria-expanded") == "true"
                interaction["menu"]["hidden_state_sync_on_open"] = page.locator("[data-public-menu-panel]").evaluate("panel => panel.hidden === false")
                interaction["menu"]["mobile_switcher_visible_after_open"] = page.locator("#mobileMenu [data-shell-locale]").first.is_visible() if page.locator("#mobileMenu [data-shell-locale]").count() else False
                page.keyboard.press("Escape")
                page.wait_for_timeout(150)
                interaction["menu"]["closes_on_escape"] = page.locator("[data-public-menu-panel]").is_hidden()
                interaction["menu"]["hidden_state_sync_on_escape"] = page.locator("[data-public-menu-panel]").evaluate("panel => panel.hidden === true")
                page.locator("[data-public-menu-toggle]").click()
                page.mouse.click(360, 820)
                page.wait_for_timeout(150)
                interaction["menu"]["closes_on_outside_click"] = page.locator("[data-public-menu-panel]").is_hidden()
                page.locator("[data-public-menu-toggle]").click()
                page.wait_for_timeout(150)
                try:
                    page.evaluate("""() => { const link = document.querySelector('#mobileMenu a[href=\"/resources.html\"]'); if (link) { link.click(); } }""")
                    page.wait_for_url("**/resources.html", timeout=15000)
                    interaction["menu"]["closes_on_navigation"] = page.locator("[data-public-menu-panel]").is_hidden()
                except Exception as error:
                    interaction["menu"]["closes_on_navigation"] = False
                    interaction["errors"].append(f"menu_navigation: {error}")
                page.goto(base + "/", wait_until="networkidle", timeout=45000)
                page.locator("[data-public-menu-toggle]").click()
                page.set_viewport_size({"width": 1440, "height": 1200})
                page.wait_for_timeout(200)
                interaction["menu"]["closes_on_resize"] = page.locator("[data-public-menu-panel]").is_hidden() and page.locator("[data-public-menu-toggle]").get_attribute("aria-expanded") == "false"
                mobile.close()

                desktop = browser.new_context(viewport={"width": 1440, "height": 1200})
                prime_context(desktop)
                page = desktop.new_page()
                page.goto(base + "/", wait_until="networkidle", timeout=45000)
                interaction["locale"]["desktop_switcher_visible"] = page.locator('.header-actions .lang-switch [data-shell-locale]').count() >= 3
                page.locator("main .hero-actions .btn-primary").first.click()
                page.wait_for_url("**/contact.html", timeout=15000)
                interaction["cta"]["home_primary_to_contact"] = page.url.endswith("/contact.html")

                page.goto(base + "/", wait_until="networkidle", timeout=45000)
                page.locator('.header-actions .lang-switch [data-shell-locale="ru"]').click()
                page.wait_for_url("**/ru/", timeout=15000)
                interaction["locale"]["switches_to_ru"] = page.locator("html").get_attribute("lang") == "ru"
                page.locator('header nav a[href="/ru/contact.html"][data-shell-key="shell.nav.review"]').first.click()
                page.wait_for_url("**/ru/contact.html", timeout=15000)
                interaction["locale"]["persists_across_navigation"] = page.evaluate("() => window.localStorage.getItem('docketmint.locale')") == "ru"
                interaction["locale"]["contact_lang_attribute"] = page.locator("html").get_attribute("lang")

                page.goto(base + "/thank-you.html?purpose=company_review&lead=test123", wait_until="networkidle", timeout=45000)
                page.locator('.header-actions .lang-switch [data-shell-locale="es"]').click()
                page.wait_for_url("**/es/thank-you.html?purpose=company_review&lead=test123", timeout=15000)
                interaction["thank_you_locale"]["preserves_query"] = "purpose=company_review" in page.url and "lead=test123" in page.url
                interaction["thank_you_locale"]["lead_row_visible"] = page.locator("[data-thankyou-lead-row]").is_visible() and page.locator("[data-thankyou-lead]").inner_text() == "test123"

                page.goto(base + "/contact.html?utm_source=qa&gclid=gclid-test&msclkid=msclkid-test&li_fat_id=li-fat-test", wait_until="networkidle", timeout=45000)
                page.locator('[data-intake-form] button[type="submit"]').click()
                interaction["contact_form"]["invalid_fields_before_fill"] = page.evaluate('() => document.querySelectorAll(":invalid").length')
                page.fill('input[name="full_name"]', "QA Operator")
                page.fill('input[name="work_email"]', f"qa-{uuid4().hex[:8]}@example.com")
                page.fill('input[name="company_name"]', "VitaCoreX QA Co")
                page.select_option('select[name="industry"]', "Healthcare / Dental")
                page.fill('textarea[name="message"]', "Checking the structured review flow, attribution capture, and thank-you routing.")
                page.wait_for_timeout(1300)
                page.locator('[data-intake-form] button[type="submit"]').click()
                page.wait_for_url("**/thank-you.html?purpose=company_review&lead=*", timeout=20000)
                interaction["contact_form"]["redirected_to_thank_you"] = "purpose=company_review" in page.url and "lead=" in page.url
                interaction["contact_form"]["attribution_persisted"] = page.evaluate(
                    """() => {
                      const raw = window.sessionStorage.getItem('vitacorex.attribution') || '{}';
                      const data = JSON.parse(raw);
                      return Boolean(data.landing_page) && data.utm_source === 'qa' && data.gclid === 'gclid-test' && data.msclkid === 'msclkid-test' && data.li_fat_id === 'li-fat-test';
                    }"""
                )

                page.goto(base + "/resources.html", wait_until="networkidle", timeout=45000)
                page.fill('input[name="full_name"]', "Brief QA")
                page.fill('input[name="work_email"]', f"brief-{uuid4().hex[:8]}@example.com")
                page.fill('input[name="company_name"]', "VitaCoreX QA Co")
                page.wait_for_timeout(1300)
                page.locator('[data-intake-form] button[type="submit"]').click()
                page.wait_for_url("**/thank-you.html?purpose=executive_brief&lead=*", timeout=20000)
                interaction["resources_form"]["redirected_to_thank_you"] = "purpose=executive_brief" in page.url and "lead=" in page.url

                page.goto(base + "/app/dealer-contract-check/", wait_until="networkidle", timeout=45000)
                if "/app/sign-in/" in page.url:
                    interaction["dealer_check"]["skipped"] = "auth_gated_non_public_surface"
                else:
                    page.wait_for_selector("[data-asking-price-value]", timeout=5000)
                    interaction["dealer_check"]["asking_price_default"] = page.locator("[data-asking-price-value]").inner_text().strip()
                    interaction["dealer_check"]["report_button_disabled_without_session"] = page.locator("[data-generate-report]").is_disabled()
                    dealer_screenshot = SCREENS / "dealer_contract_check_1440.png"
                    page.screenshot(path=str(dealer_screenshot), full_page=True)
                    interaction["dealer_check"]["screenshot"] = dealer_screenshot.name
                desktop.close()
                browser.close()

                try:
                    webkit = playwright.webkit.launch(headless=True)
                    webkit_report["available"] = True
                    context = webkit.new_context(viewport={"width": 390, "height": 844})
                    prime_context(context)
                    page = context.new_page()
                    response = page.goto(base + "/", wait_until="networkidle", timeout=45000)
                    page.locator("[data-public-menu-toggle]").click()
                    webkit_report["home_status"] = response.status if response else None
                    webkit_report["menu_open"] = page.locator("[data-public-menu-panel]").is_visible()
                    screenshot = SCREENS / "home_390_webkit.png"
                    page.screenshot(path=str(screenshot), full_page=True)
                    webkit_report["screenshot"] = screenshot.name
                    context.close()
                    webkit.close()
                except Exception as error:
                    webkit_report["error"] = str(error)

                report["interaction_checks"] = interaction
            except Exception as error:
                report["fatal_error"] = str(error)
            finally:
                try:
                    browser.close()
                except Exception:
                    pass

            menu = interaction.get("menu", {})
            cta = interaction.get("cta", {})
            locale = interaction.get("locale", {})
            thank_you_locale = interaction.get("thank_you_locale", {})
            contact_form = interaction.get("contact_form", {})
            resources_form = interaction.get("resources_form", {})
            dealer_check = interaction.get("dealer_check", {})
            dealer_check_ok = dealer_check.get("skipped") == "auth_gated_non_public_surface" or (
                dealer_check.get("asking_price_default") == "-"
                and dealer_check.get("report_button_disabled_without_session")
            )
            report["interaction_checks"] = interaction
            report["ok"] = (
                report["summary"]["console_errors"] == 0
                and report["summary"]["page_errors"] == 0
                and report["summary"]["request_failures"] == 0
                and report["summary"]["unhandled_rejections"] == 0
                and report["summary"]["non_200_documents"] == 0
                and menu.get("opens")
                and menu.get("hidden_state_sync_on_open")
                and menu.get("mobile_switcher_visible_after_open")
                and menu.get("closes_on_escape")
                and menu.get("hidden_state_sync_on_escape")
                and menu.get("closes_on_outside_click")
                and menu.get("closes_on_navigation")
                and menu.get("closes_on_resize")
                and cta.get("home_primary_to_contact")
                and locale.get("desktop_switcher_visible")
                and locale.get("switches_to_ru")
                and locale.get("persists_across_navigation")
                and locale.get("contact_lang_attribute") == "ru"
                and thank_you_locale.get("preserves_query")
                and thank_you_locale.get("lead_row_visible")
                and bool(contact_form.get("invalid_fields_before_fill"))
                and contact_form.get("redirected_to_thank_you")
                and contact_form.get("attribution_persisted")
                and resources_form.get("redirected_to_thank_you")
                and dealer_check_ok
            )

        REPORT_PATH.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
        WEBKIT_PATH.write_text(json.dumps(webkit_report, ensure_ascii=False, indent=2), encoding="utf-8")
        print(
            json.dumps(
                {
                    "ok": report["ok"],
                    "screenshots": report["summary"]["screenshots"],
                    "console_errors": report["summary"]["console_errors"],
                    "request_failures": report["summary"]["request_failures"],
                    "page_errors": report["summary"]["page_errors"],
                    "unhandled_rejections": report["summary"]["unhandled_rejections"],
                    "non_200_documents": report["summary"]["non_200_documents"],
                },
                ensure_ascii=False,
            )
        )
        return 0 if report["ok"] else 1
    finally:
        if process.is_alive():
            process.terminate()
            process.join(timeout=5)


if __name__ == "__main__":
    raise SystemExit(main())
