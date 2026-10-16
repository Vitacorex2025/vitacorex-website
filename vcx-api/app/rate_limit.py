"""Rate limiter configuration — shared across routers.

Phase 4A: Uses slowapi with per-IP rate limiting.
Enabled by default; disable with VCX_RATE_LIMIT_ENABLED=false.
Separate module to avoid circular imports (main.py imports routers,
routers import limiter).

Limits key on the visitor's address as Render's proxy reports it (the last X-Forwarded-For entry, which the proxy
appends itself, so a client cannot change it by sending its own header). uvicorn runs without --proxy-headers, so
request.client.host is the proxy and keying on it would make every visitor share one limit.
"""

import os

from fastapi import Request
from slowapi import Limiter


def client_ip(request: Request) -> str:
    xff = request.headers.get("x-forwarded-for", "")
    return xff.split(",")[-1].strip() if xff.strip() else (request.client.host if request.client else "unknown")


limiter = Limiter(
    key_func=client_ip,
    enabled=os.getenv("VCX_RATE_LIMIT_ENABLED", "true").lower() == "true",
)
