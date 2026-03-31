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

ROOT = Path(__file__).resolve().parents[1]
REPORT_PATH = ROOT / "BROWSER_FORENSIC_RETEST_2026-03-17.json"


def free_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.bind(("127.0.0.1", 0))
        return int(sock.getsockname()[1])


def serve(port: int, storage_path: str) -> None:
    os.environ["DOCKETMINT_STORAGE_PATH"] = storage_path
    if str(ROOT) not in sys.path:
        sys.path.insert(0, str(ROOT))
    import uvicorn
    from main import app

    uvicorn.run(app, host="127.0.0.1", port=port, log_level="error", access_log=False)


def wait_for(url: str, timeout: float = 20.0) -> None:
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


def main() -> None:
    storage_root = ROOT / "storage_browser_shell_runtime"
    if storage_root.exists():
        import shutil

        shutil.rmtree(storage_root)
    storage_root.mkdir(parents=True, exist_ok=True)

    port = free_port()
    base = f"http://127.0.0.1:{port}"
    process = Process(target=serve, args=(port, str(storage_root)), daemon=True)
    process.start()
    report: dict[str, object] = {"base_url": base, "console_errors": [], "page_errors": []}

    try:
        wait_for(base + "/api/health")
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(viewport={"width": 1440, "height": 900})
            page = context.new_page()
            page.on("console", lambda msg: report["console_errors"].append(msg.text) if msg.type == "error" else None)
            page.on("pageerror", lambda exc: report["page_errors"].append(str(exc)))

            email = f"browser-{uuid4().hex[:10]}@example.com"
            page.goto(base + "/app/sign-up/", wait_until="networkidle")
            page.locator('input[name="first_name"]').fill("Browser")
            page.locator('input[name="last_name"]').fill("QA")
            page.locator('input[name="email"]').fill(email)
            page.locator('input[name="title"]').fill("QA")
            page.locator('select[name="preferred_language"]').select_option("ru")
            page.locator('input[name="password"]').fill("Password123!")
            page.locator('input[name="confirm_password"]').fill("Password123!")
            page.locator('input[name="terms_accepted"]').check()
            page.locator('[data-signup-form] button[type="submit"]').click()
            page.wait_for_url("**/app/home/**", timeout=15000)
            page.reload(wait_until="networkidle")
            report["session_persisted_on_reload"] = "/app/home/" in page.url

            account_button = page.locator('[data-account-toggle]')
            account_button.click()
            report["account_menu_open"] = page.locator('[data-account-dropdown]').is_visible()
            page.keyboard.press("Escape")
            report["account_menu_closed_on_escape"] = not page.locator('[data-account-dropdown]').is_visible()

            account_button.click()
            page.locator('[data-language-choice="es"]').click()
            page.wait_for_timeout(400)
            report["language_switch_spanish"] = page.locator(".sidebar-nav").inner_text()

            case_id = page.evaluate(
                """async () => {
                  const response = await fetch('/api/cases', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      matter_name: 'Browser review matter',
                      plaintiff_name: 'Client Company LLC',
                      defendant_name: 'Counterparty LLC'
                    })
                  });
                  const payload = await response.json();
                  sessionStorage.setItem('docketmint.activeCaseId', payload.id);
                  return payload.id;
                }"""
            )
            report["case_id"] = case_id

            routes = [
                "/app/home/",
                "/app/my-cases/",
                "/app/services/",
                f"/app/contract-intelligence/?case={case_id}",
                f"/app/template-library/?case={case_id}",
                f"/app/ocr-source-mapping/?case={case_id}",
                f"/app/human-review/?case={case_id}",
            ]
            route_results = []
            for route in routes:
                page.goto(base + route, wait_until="networkidle")
                route_results.append(
                    {
                        "route": route,
                        "title": page.locator("[data-module-title], h1").first.inner_text(),
                    }
                )
            report["module_routes"] = route_results

            width_checks = []
            for width in (1440, 1280, 1100, 980, 860):
                page.set_viewport_size({"width": width, "height": 900})
                page.goto(base + f"/app/workspace/?case={case_id}", wait_until="networkidle")
                overflow = page.evaluate(
                    """() => ({
                      width: window.innerWidth,
                      scrollWidth: document.documentElement.scrollWidth,
                      bodyScrollWidth: document.body.scrollWidth,
                      overflow: document.documentElement.scrollWidth > window.innerWidth + 2 || document.body.scrollWidth > window.innerWidth + 2
                    })"""
                )
                width_checks.append(overflow)
            report["width_checks"] = width_checks

            browser.close()

        report["ok"] = bool(
            report.get("session_persisted_on_reload")
            and report.get("account_menu_open")
            and report.get("account_menu_closed_on_escape")
            and not report["console_errors"]
            and not report["page_errors"]
            and all(not item.get("overflow") for item in report.get("width_checks", []))
        )
        if not report["ok"]:
            raise RuntimeError("Browser shell smoke detected a regression.")
    finally:
        REPORT_PATH.write_text(json.dumps(report, indent=2), encoding="utf-8")
        if process.is_alive():
            process.terminate()
            process.join(timeout=5)


if __name__ == "__main__":
    main()
