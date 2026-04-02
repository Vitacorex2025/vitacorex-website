"""VCX Intake OS — FastAPI application entrypoint."""

import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Load env before anything else
load_dotenv()

from .db import init_db
from .routers import chat, contracts, intakes, matters, portal, recovery, review, uploads

app = FastAPI(
    title="VCX Intake OS",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url=None,
)

# CORS
origins = os.getenv("VCX_ALLOWED_ORIGINS", "http://localhost:8765").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
def startup():
    init_db()

# Health check
@app.get("/healthz")
def healthz():
    return {"ok": True, "service": "VCX Intake OS", "version": "1.0.0"}

# Mount routers
app.include_router(intakes.router)
app.include_router(uploads.router)
app.include_router(matters.router)
app.include_router(review.router)
app.include_router(chat.router)
app.include_router(contracts.router)
app.include_router(recovery.router)
app.include_router(portal.router)
