from __future__ import annotations

from pathlib import Path

from fastapi import HTTPException, Request
from fastapi.responses import FileResponse, JSONResponse
from starlette.routing import Mount, Route

from backend.core.config import settings
from backend.main import APP_ROOT, FRONTEND_ROOT, PUBLIC_API_PATHS, app
from backend.services.vitacorex_lead_store import normalize_lang, store_submission


NO_CACHE_HEADERS = {"Cache-Control": "no-store, max-age=0", "Pragma": "no-cache"}
LANDING_PATH = FRONTEND_ROOT / "index.html"
OPERATOR_HOME_PATH = APP_ROOT / "home" / "operator-home.html"
OPERATOR_SERVICES_PATH = APP_ROOT / "services" / "operator-services.html"
OPERATOR_NEW_CASE_PATH = APP_ROOT / "new-case" / "operator-new-case.html"
ROBOTS_PATH = FRONTEND_ROOT / "robots.txt"
SITEMAP_PATH = FRONTEND_ROOT / "sitemap.xml"
MANIFEST_PATH = FRONTEND_ROOT / "manifest.webmanifest"
SUPPORTED_PUBLIC_LANGS = {"ru", "es"}


def _existing_file(path: Path, label: str) -> Path:
    if not path.exists():
        raise HTTPException(status_code=404, detail=f"{label} not found.")
    return path


def _serve(path: Path, label: str):
    return FileResponse(_existing_file(path, label), headers=NO_CACHE_HEADERS)


def _localized_page(lang: str, page_name: str) -> Path:
    normalized_lang = normalize_lang(lang)
    if normalized_lang == "en" or normalized_lang not in SUPPORTED_PUBLIC_LANGS:
        raise HTTPException(status_code=404, detail="Localized page not found.")
    safe_name = "".join(ch for ch in page_name if ch.isalnum() or ch in {"-", "_"})
    path = FRONTEND_ROOT / normalized_lang / f"{safe_name}.html"
    return _existing_file(path, f"{normalized_lang}/{safe_name}.html")


def _strip_legacy_routes() -> None:
    legacy_paths = {
        "/",
        "/index.html",
        "/app",
        "/app/",
        "/app/home",
        "/app/home/",
        "/app/services",
        "/app/services/",
        "/app/new-case",
        "/app/new-case/",
    }
    filtered = []
    for route in app.router.routes:
        if isinstance(route, Mount) and getattr(route, "path", "") == "/app":
            continue
        if isinstance(route, Route) and getattr(route, "path", "") in legacy_paths:
            continue
        filtered.append(route)
    app.router.routes[:] = filtered


_strip_legacy_routes()
PUBLIC_API_PATHS.add(f"{settings.api_v1_prefix}/vitacorex/intake")


@app.get("/", include_in_schema=False)
@app.get("/index.html", include_in_schema=False)
def vitacorex_index():
    return _serve(LANDING_PATH, "VitaCoreX landing")


@app.get("/app", include_in_schema=False)
@app.get("/app/", include_in_schema=False)
@app.get("/app/home", include_in_schema=False)
@app.get("/app/home/", include_in_schema=False)
def vitacorex_home():
    return _serve(OPERATOR_HOME_PATH, "Operator home")


@app.get("/app/services", include_in_schema=False)
@app.get("/app/services/", include_in_schema=False)
def vitacorex_services():
    return _serve(OPERATOR_SERVICES_PATH, "Operator services")


@app.get("/app/new-case", include_in_schema=False)
@app.get("/app/new-case/", include_in_schema=False)
def vitacorex_new_case():
    return _serve(OPERATOR_NEW_CASE_PATH, "Operator new case")


@app.get("/robots.txt", include_in_schema=False)
def vitacorex_robots():
    return _serve(ROBOTS_PATH, "robots.txt")


@app.get("/sitemap.xml", include_in_schema=False)
def vitacorex_sitemap():
    return _serve(SITEMAP_PATH, "sitemap.xml")


@app.get("/manifest.webmanifest", include_in_schema=False)
def vitacorex_manifest():
    return _serve(MANIFEST_PATH, "manifest.webmanifest")


@app.get("/ru", include_in_schema=False)
@app.get("/ru/", include_in_schema=False)
@app.get("/es", include_in_schema=False)
@app.get("/es/", include_in_schema=False)
def vitacorex_localized_home(request: Request):
    lang = request.url.path.strip("/").split("/")[0]
    return _serve(_localized_page(lang, "index"), f"{lang}/index.html")


@app.get("/ru/{page_name}.html", include_in_schema=False)
@app.get("/es/{page_name}.html", include_in_schema=False)
def vitacorex_localized_page(page_name: str, request: Request):
    lang = request.url.path.strip("/").split("/")[0]
    return _serve(_localized_page(lang, page_name), f"{lang}/{page_name}.html")


@app.post(f"{settings.api_v1_prefix}/vitacorex/intake", include_in_schema=False)
async def vitacorex_public_intake(request: Request):
    form = await request.form()
    fields: dict[str, str] = {}
    files = []
    for key, value in form.multi_items():
        if hasattr(value, "filename"):
            if getattr(value, "filename", ""):
                files.append((key, value))
            continue
        fields[key] = str(value)

    client_ip = request.headers.get("x-forwarded-for", "").split(",")[0].strip() or (request.client.host if request.client else "")
    payload = await store_submission(
        fields=fields,
        files=files,
        client_ip=client_ip,
        user_agent=request.headers.get("user-agent", ""),
        referer=request.headers.get("referer", ""),
    )
    return JSONResponse(payload, headers=NO_CACHE_HEADERS)
