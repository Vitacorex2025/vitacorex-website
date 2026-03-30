from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4


def enqueue_job(job_type: str, case_id: str, payload: dict | None = None) -> dict[str, object]:
    return {
        "job_id": f"job_{uuid4().hex[:10]}",
        "job_type": job_type,
        "case_id": case_id,
        "payload": payload or {},
        "enqueued_at": datetime.now(timezone.utc).isoformat(),
        "status": "queued",
    }
