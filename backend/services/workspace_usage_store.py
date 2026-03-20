from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from backend.core.config import settings


def _utcnow() -> str:
    return datetime.now(timezone.utc).isoformat()


def _workspace_usage_dir(workspace_id: str) -> Path:
    path = settings.storage_path / "workspace_usage" / str(workspace_id or "workspace_legacy")
    path.mkdir(parents=True, exist_ok=True)
    return path


def usage_log_path(workspace_id: str) -> Path:
    return _workspace_usage_dir(workspace_id) / "usage.jsonl"


def record_workspace_usage_event(
    workspace_id: str,
    event_type: str,
    *,
    case_id: str | None = None,
    actor_user_id: str | None = None,
    payload: dict[str, Any] | None = None,
) -> dict[str, Any]:
    event = {
        "recorded_at": _utcnow(),
        "workspace_id": str(workspace_id or "workspace_legacy"),
        "case_id": case_id,
        "actor_user_id": actor_user_id,
        "event_type": str(event_type or "").strip().lower(),
        "payload": payload or {},
    }
    with usage_log_path(event["workspace_id"]).open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(event, ensure_ascii=False) + "\n")
    return event


def load_workspace_usage_events(workspace_id: str, limit: int | None = None) -> list[dict[str, Any]]:
    path = usage_log_path(workspace_id)
    if not path.exists():
        return []
    items: list[dict[str, Any]] = []
    with path.open("r", encoding="utf-8") as handle:
        for line in handle:
            raw = line.strip()
            if not raw:
                continue
            try:
                items.append(json.loads(raw))
            except json.JSONDecodeError:
                continue
    items.sort(key=lambda item: item.get("recorded_at") or "", reverse=True)
    if limit is not None:
        return items[:limit]
    return items
