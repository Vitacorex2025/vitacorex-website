"""VCX Intake OS — FastAPI application entrypoint."""

import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

# Load env before anything else
load_dotenv()

from .db import init_db
from .rate_limit import limiter
from .routers import ai_analyze, calendar, chat, contracts, intakes, matters, portal, recovery, review, uploads
from .routers import v2_owner, v2_public, v2_voice
from .services import v2_outbox

app = FastAPI(
    title="VCX Intake OS",
    version="1.1.0",
    docs_url="/api/docs",
    redoc_url=None,
)

# Rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS — env-driven with whitespace stripping
origins_raw = os.getenv("VCX_ALLOWED_ORIGINS", "http://localhost:8765")
origins = [o.strip() for o in origins_raw.split(",") if o.strip()]

cors_credentials = os.getenv("VCX_CORS_ALLOW_CREDENTIALS", "true").lower() == "true"
cors_methods_raw = os.getenv("VCX_CORS_ALLOW_METHODS", "*")
cors_methods = [m.strip() for m in cors_methods_raw.split(",") if m.strip()]
cors_headers_raw = os.getenv("VCX_CORS_ALLOW_HEADERS", "*")
cors_headers = [h.strip() for h in cors_headers_raw.split(",") if h.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=cors_credentials,
    allow_methods=cors_methods,
    allow_headers=cors_headers,
)

# Initialize database on startup
@app.on_event("startup")
def startup():
    init_db()
    v2_outbox.start_worker()  # v2 durable notification outbox (VCX_OUTBOX_WORKER=false disables)


@app.on_event("shutdown")
def shutdown():
    v2_outbox.stop_worker()

# Health check
@app.get("/healthz")
def healthz():
    return {"ok": True, "service": "VCX Intake OS", "version": "1.1.0"}

# Mount routers
app.include_router(intakes.router)
app.include_router(uploads.router)
app.include_router(matters.router)
app.include_router(review.router)
app.include_router(chat.router)
app.include_router(contracts.router)
app.include_router(recovery.router)
app.include_router(portal.router)
app.include_router(ai_analyze.router)
app.include_router(calendar.router)
# v2 (catalog-driven intake, quotes, payments, owner desk, voice tools)
app.include_router(v2_public.router)
app.include_router(v2_voice.router)
app.include_router(v2_owner.router)
