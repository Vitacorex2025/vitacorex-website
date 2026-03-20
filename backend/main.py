
from __future__ import annotations

import sys
from contextlib import asynccontextmanager
from pathlib import Path
from urllib.parse import quote
from uuid import uuid4

CURRENT_FILE = Path(__file__).resolve()
PROJECT_ROOT = CURRENT_FILE.parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles

from backend.api.routes.auth import router as auth_router
from backend.api.routes.cases import router as cases_router
from backend.api.routes.contract_intelligence import router as contract_intelligence_router
from backend.api.routes.contract_review import router as contract_review_router
from backend.api.routes.downloads import router as downloads_router
from backend.api.routes.dealer_contract_check import router as dealer_contract_check_router
from backend.api.routes.entity_registry import router as entity_registry_router
from backend.api.routes.immigration_forms import router as immigration_forms_router
from backend.api.routes.generate import router as generate_router
from backend.api.routes.me import router as me_router
from backend.api.routes.platform import router as platform_router
from backend.api.routes.recovery_intake import router as recovery_intake_router
from backend.api.routes.sunbiz import router as sunbiz_router
from backend.api.routes.templates import router as templates_router
from backend.api.routes.upload import router as upload_router
from backend.core.config import settings
from backend.core.errors import register_exception_handlers
from backend.core.logging import clear_request_id, get_logger, set_request_id, setup_logging
from backend.services import auth_service, auth_store
from backend.services.template_registry import manifest_payload

setup_logging()
logger = get_logger(__name__)

FRONTEND_ROOT = PROJECT_ROOT
APP_ROOT = FRONTEND_ROOT / "app"
ASSETS_ROOT = FRONTEND_ROOT / "assets"


@asynccontextmanager
async def lifespan(_: FastAPI):
    auth_store.ensure_bootstrap_admin()
    logger.info(
        "Application startup complete. env=%s storage=%s max_upload_mb=%s",
        settings.app_env,
        settings.storage_path,
        settings.max_upload_file_size_mb,
    )
    yield


app = FastAPI(
    title=settings.app_name,
    version="0.4.1",
    description="Backend for DocketMint modular workflow software with collections, contract review, and downloads ledger.",
    lifespan=lifespan,
)

register_exception_handlers(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def request_context_middleware(request: Request, call_next):
    request_id = request.headers.get("x-request-id") or str(uuid4())
    request.state.request_id = request_id
    set_request_id(request_id)
    auth_context = auth_service.resolve_request_context(request)
    logger.info("Request started: %s %s", request.method, request.url.path)

    try:
        if request.url.path.startswith(settings.api_v1_prefix) and not _is_public_api_path(request.url.path):
            if not auth_context:
                response = JSONResponse(
                    status_code=401,
                    content={"detail": {"message": "Authentication required.", "code": "auth_required"}},
                )
                response.headers["x-request-id"] = request_id
                return response
        if request.method == "GET" and request.url.path.startswith("/app") and not _is_public_app_path(request.url.path):
            if not auth_context:
                response = _sign_in_redirect(request)
                response.headers["x-request-id"] = request_id
                return response
        response = await call_next(request)
    finally:
        logger.info("Request finished: %s %s", request.method, request.url.path)
        auth_service.set_request_context(None)
        clear_request_id()

    response.headers["x-request-id"] = request_id
    if request.url.path.startswith("/app"):
        response.headers["Cache-Control"] = "no-store, max-age=0"
        response.headers["Pragma"] = "no-cache"
    return response


app.include_router(cases_router, prefix=settings.api_v1_prefix)
app.include_router(contract_intelligence_router, prefix=settings.api_v1_prefix)
app.include_router(auth_router, prefix=settings.api_v1_prefix)
app.include_router(me_router, prefix=settings.api_v1_prefix)
app.include_router(upload_router, prefix=settings.api_v1_prefix)
app.include_router(generate_router, prefix=settings.api_v1_prefix)
app.include_router(sunbiz_router, prefix=settings.api_v1_prefix)
app.include_router(entity_registry_router, prefix=settings.api_v1_prefix)
app.include_router(immigration_forms_router, prefix=settings.api_v1_prefix)
app.include_router(downloads_router, prefix=settings.api_v1_prefix)
app.include_router(dealer_contract_check_router, prefix=settings.api_v1_prefix)
app.include_router(contract_review_router, prefix=settings.api_v1_prefix)
app.include_router(platform_router, prefix=settings.api_v1_prefix)
app.include_router(recovery_intake_router, prefix=settings.api_v1_prefix)
app.include_router(templates_router, prefix=settings.api_v1_prefix)

if ASSETS_ROOT.exists():
    app.mount("/assets", StaticFiles(directory=ASSETS_ROOT), name="assets")


PUBLIC_API_PATHS = {
    f"{settings.api_v1_prefix}/health",
    f"{settings.api_v1_prefix}/system-status",
    f"{settings.api_v1_prefix}/auth/login",
    f"{settings.api_v1_prefix}/auth/signup",
    f"{settings.api_v1_prefix}/auth/logout",
    f"{settings.api_v1_prefix}/auth/session",
    f"{settings.api_v1_prefix}/auth/diagnostics",
}

PUBLIC_APP_PREFIXES = {
    "/app/sign-in",
    "/app/sign-up",
    "/app.html",
}


def _is_public_api_path(path: str) -> bool:
    normalized = path.rstrip("/") or path
    return normalized in {item.rstrip("/") for item in PUBLIC_API_PATHS}


def _is_public_app_path(path: str) -> bool:
    normalized = path.rstrip("/") or path
    return normalized in {item.rstrip("/") for item in PUBLIC_APP_PREFIXES}


def _sign_in_redirect(request: Request) -> RedirectResponse:
    target = request.url.path + (f"?{request.url.query}" if request.url.query else "")
    return RedirectResponse(url=f"/app/sign-in/?next={quote(target, safe='/%?=&')}", status_code=307)


def _safe_join(base: Path, relative_path: str) -> Path:
    candidate = (base / relative_path).resolve()
    resolved_base = base.resolve()
    if candidate != resolved_base and resolved_base not in candidate.parents:
        raise HTTPException(status_code=404, detail="File not found.")
    if not candidate.exists() or not candidate.is_file():
        raise HTTPException(status_code=404, detail="File not found.")
    return candidate


def _health_payload() -> dict[str, str]:
    return {"status": "ok", "environment": settings.app_env}


def _app_file(*parts: str) -> Path:
    path = APP_ROOT.joinpath(*parts)
    if not path.exists():
        raise HTTPException(status_code=404, detail=f"App page not found: {'/'.join(parts)}")
    return path


def _serve_app_html(*parts: str):
    return FileResponse(_app_file(*parts), headers={"Cache-Control": "no-store, max-age=0", "Pragma": "no-cache"})


def _redirect_with_query(target: str, request: Request):
    query = request.url.query
    url = target + (f"?{query}" if query else "")
    return RedirectResponse(url=url, status_code=307)


@app.get("/health")
def healthcheck() -> dict[str, str]:
    return _health_payload()


@app.get(f"{settings.api_v1_prefix}/health")
def api_healthcheck() -> dict[str, str]:
    return _health_payload()


@app.get(f"{settings.api_v1_prefix}/system-status")
def api_system_status() -> dict[str, object]:
    storage_path = settings.storage_path
    return {
        "status": "ok",
        "environment": settings.app_env,
        "api_base": settings.api_v1_prefix,
        "canonical_api_base": settings.canonical_api_base,
        "frontend_served_by_backend": True,
        "workspace_root": str(APP_ROOT),
        "assets_root": str(ASSETS_ROOT),
        "storage_path": str(storage_path),
        "storage_path_source": settings.storage_path_source,
        "storage_persistence_risk": settings.storage_persistence_risk,
        "render_runtime_detected": settings.render_runtime_detected,
        "storage_exists": storage_path.exists(),
        "files_base": "/files",
        "frontend_url": settings.frontend_url or settings.public_app_url,
        "public_api_url": settings.public_api_url,
        "backend_candidates": settings.backend_candidates,
        "template_library": manifest_payload(),
        "deployment_guidance": {
            "preferred_mode": "same_origin_fastapi_web_service",
            "split_origin_supported": True,
            "required_static_routes": ["/api/*", "/files/*"],
        },
    }


@app.get("/app.html", include_in_schema=False)
def legacy_app_redirect():
    return RedirectResponse(url="/app/sign-in/", status_code=307)


@app.get("/app", include_in_schema=False)
@app.get("/app/", include_in_schema=False)
def serve_app_root():
    return _serve_app_html("home", "index.html")


@app.get("/app/sign-in", include_in_schema=False)
@app.get("/app/sign-in/", include_in_schema=False)
def serve_sign_in(request: Request):
    if auth_service.get_request_context() or auth_service.resolve_request_context(request):
        return RedirectResponse(url="/app/home/", status_code=307)
    return _serve_app_html("sign-in", "index.html")


@app.get("/app/sign-up", include_in_schema=False)
@app.get("/app/sign-up/", include_in_schema=False)
def serve_sign_up(request: Request):
    if auth_service.get_request_context() or auth_service.resolve_request_context(request):
        return RedirectResponse(url="/app/home/", status_code=307)
    return _serve_app_html("sign-up", "index.html")


@app.get("/app/home", include_in_schema=False)
@app.get("/app/home/", include_in_schema=False)
def serve_home():
    return _serve_app_html("home", "index.html")


@app.get("/app/my-cases", include_in_schema=False)
@app.get("/app/my-cases/", include_in_schema=False)
def serve_my_cases():
    return _serve_app_html("my-cases", "index.html")


@app.get("/app/action-center", include_in_schema=False)
@app.get("/app/action-center/", include_in_schema=False)
def serve_action_center():
    return _serve_app_html("action-center", "index.html")


@app.get("/app/irs-notice", include_in_schema=False)
@app.get("/app/irs-notice/", include_in_schema=False)
def serve_irs_notice():
    return _serve_app_html("irs-notice", "index.html")


@app.get("/app/invoice-recovery", include_in_schema=False)
@app.get("/app/invoice-recovery/", include_in_schema=False)
def serve_invoice_recovery():
    return _serve_app_html("invoice-recovery", "index.html")


@app.get("/app/services", include_in_schema=False)
@app.get("/app/services/", include_in_schema=False)
def serve_services():
    return _serve_app_html("services", "index.html")


@app.get("/app/settings", include_in_schema=False)
@app.get("/app/settings/", include_in_schema=False)
def serve_settings():
    return _serve_app_html("settings", "index.html")


@app.get("/app/workspace", include_in_schema=False)
@app.get("/app/workspace/", include_in_schema=False)
def serve_workspace():
    return _serve_app_html("workspace", "index.html")


@app.get("/app/new-case", include_in_schema=False)
@app.get("/app/new-case/", include_in_schema=False)
def serve_new_case():
    return _serve_app_html("new-case", "index.html")


@app.get("/app/uploaded-files", include_in_schema=False)
@app.get("/app/uploaded-files/", include_in_schema=False)
def serve_uploaded_files(request: Request):
    return _redirect_with_query("/app/workspace/", request)


@app.get("/app/review-data", include_in_schema=False)
@app.get("/app/review-data/", include_in_schema=False)
def serve_review_redirect(request: Request):
    return _redirect_with_query("/app/evidence-audit/", request)


@app.get("/app/entity-check", include_in_schema=False)
@app.get("/app/entity-check/", include_in_schema=False)
def serve_entity_redirect(request: Request):
    return _redirect_with_query("/app/entity-verification/", request)


@app.get("/app/generate-packet", include_in_schema=False)
@app.get("/app/generate-packet/", include_in_schema=False)
def serve_generate_redirect(request: Request):
    return _redirect_with_query("/app/forms-autofill/", request)


@app.get("/app/case-intake", include_in_schema=False)
@app.get("/app/case-intake/", include_in_schema=False)
def serve_case_intake():
    return _serve_app_html("case-intake", "index.html")


@app.get("/app/activity-status", include_in_schema=False)
@app.get("/app/activity-status/", include_in_schema=False)
def serve_activity_redirect(request: Request):
    return _redirect_with_query("/app/downloads/", request)


@app.get("/app/exports", include_in_schema=False)
@app.get("/app/exports/", include_in_schema=False)
def serve_exports_redirect(request: Request):
    return _redirect_with_query("/app/downloads/", request)


@app.get("/app/contract-review", include_in_schema=False)
@app.get("/app/contract-review/", include_in_schema=False)
def serve_contract_review(request: Request):
    return _redirect_with_query("/app/contract-intelligence/", request)


@app.get("/app/downloads", include_in_schema=False)
@app.get("/app/downloads/", include_in_schema=False)
def serve_downloads():
    return _serve_app_html("downloads", "index.html")

@app.get("/app/immigration-forms", include_in_schema=False)
@app.get("/app/immigration-forms/", include_in_schema=False)
def serve_immigration_forms():
    return _serve_app_html("immigration-forms", "index.html")


@app.get("/app/dealer-contract-check", include_in_schema=False)
@app.get("/app/dealer-contract-check/", include_in_schema=False)
def serve_dealer_contract_check():
    return _serve_app_html("dealer-contract-check", "index.html")



@app.get("/app/contract-intelligence", include_in_schema=False)
@app.get("/app/contract-intelligence/", include_in_schema=False)
def serve_contract_intelligence():
    return _serve_app_html("contract-intelligence", "index.html")


@app.get("/app/best-contract-builder", include_in_schema=False)
@app.get("/app/best-contract-builder/", include_in_schema=False)
def serve_best_contract_builder():
    return _serve_app_html("best-contract-builder", "index.html")


@app.get("/app/venue-engine", include_in_schema=False)
@app.get("/app/venue-engine/", include_in_schema=False)
def serve_venue_engine():
    return _serve_app_html("venue-engine", "index.html")


@app.get("/app/entity-verification", include_in_schema=False)
@app.get("/app/entity-verification/", include_in_schema=False)
def serve_entity_verification():
    return _serve_app_html("entity-verification", "index.html")


@app.get("/app/forms-autofill", include_in_schema=False)
@app.get("/app/forms-autofill/", include_in_schema=False)
def serve_forms_autofill():
    return _serve_app_html("forms-autofill", "index.html")


@app.get("/app/pre-suit-demand", include_in_schema=False)
@app.get("/app/pre-suit-demand/", include_in_schema=False)
def serve_pre_suit_demand():
    return _serve_app_html("pre-suit-demand", "index.html")


@app.get("/app/evidence-audit", include_in_schema=False)
@app.get("/app/evidence-audit/", include_in_schema=False)
def serve_evidence_audit():
    return _serve_app_html("evidence-audit", "index.html")


@app.get("/app/damages-calculator", include_in_schema=False)
@app.get("/app/damages-calculator/", include_in_schema=False)
def serve_damages_calculator():
    return _serve_app_html("damages-calculator", "index.html")


@app.get("/app/template-library", include_in_schema=False)
@app.get("/app/template-library/", include_in_schema=False)
def serve_template_library():
    return _serve_app_html("template-library", "index.html")


@app.get("/app/ocr-source-mapping", include_in_schema=False)
@app.get("/app/ocr-source-mapping/", include_in_schema=False)
def serve_ocr_source_mapping():
    return _serve_app_html("ocr-source-mapping", "index.html")


@app.get("/app/human-review", include_in_schema=False)
@app.get("/app/human-review/", include_in_schema=False)
def serve_human_review():
    return _serve_app_html("human-review", "index.html")


if APP_ROOT.exists():
    app.mount("/app", StaticFiles(directory=APP_ROOT, html=True), name="workspace-static")


@app.get("/", include_in_schema=False)
@app.get("/index.html", include_in_schema=False)
def serve_index():
    landing = FRONTEND_ROOT / "index.html"
    return FileResponse(landing, headers={"Cache-Control": "no-store, max-age=0", "Pragma": "no-cache"})


@app.get("/files/{file_path:path}", include_in_schema=False)
def serve_account_scoped_file(file_path: str, request: Request):
    auth_service.require_session(request)
    normalized = str(file_path or "").replace("\\", "/").strip("/")
    parts = [item for item in normalized.split("/") if item]
    if len(parts) < 3:
        raise HTTPException(status_code=404, detail="File not found.")

    if parts[0] == "cases":
        from backend.services.case_store import ensure_case_dirs, load_case

        case_id = parts[1]
        load_case(case_id)
        return FileResponse(_safe_join(ensure_case_dirs(case_id)["case_root"], "/".join(parts[2:])))

    if parts[0] == "immigration_forms":
        from backend.services.immigration_forms_service import load_session, session_dir

        session_id = parts[1]
        load_session(session_id)
        return FileResponse(_safe_join(session_dir(session_id), "/".join(parts[2:])))

    if parts[0] == "dealer_contract_check":
        from backend.services.dealer_contract_check_service import load_session, session_dir

        session_id = parts[1]
        load_session(session_id)
        return FileResponse(_safe_join(session_dir(session_id), "/".join(parts[2:])))

    if parts[0] == "contract_intelligence":
        from backend.services.contract_intelligence_service import load_session, session_dir

        session_id = parts[1]
        load_session(session_id)
        return FileResponse(_safe_join(session_dir(session_id), "/".join(parts[2:])))

    raise HTTPException(status_code=404, detail="File not found.")


@app.get("/{page_name}.html", include_in_schema=False)
def serve_public_page(page_name: str):
    safe_name = "".join(ch for ch in page_name if ch.isalnum() or ch in {"-", "_"})
    page_path = FRONTEND_ROOT / f"{safe_name}.html"
    if not page_path.exists():
        raise HTTPException(status_code=404, detail="Page not found.")
    return FileResponse(page_path)
