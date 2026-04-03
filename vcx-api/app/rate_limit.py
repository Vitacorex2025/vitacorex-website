"""Rate limiter configuration — shared across routers.

Phase 4A: Uses slowapi with per-IP rate limiting.
Enabled by default; disable with VCX_RATE_LIMIT_ENABLED=false.
Separate module to avoid circular imports (main.py imports routers,
routers import limiter).
"""

import os

from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(
    key_func=get_remote_address,
    enabled=os.getenv("VCX_RATE_LIMIT_ENABLED", "true").lower() == "true",
)
