from __future__ import annotations

import json
from datetime import datetime, timezone
from typing import Any

from backend.services.case_store import ensure_case_dirs


def record_case_event(case_id: str, event_type: str, payload: dict[str, Any] | None = None) -> None:
    dirs = ensure_case_dirs(case_id)
    event = {
        "recorded_at": datetime.now(timezone.utc).isoformat(),
        "event_type": event_type,
        "payload": payload or {},
    }
    with dirs["events_path"].open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(event, ensure_ascii=False) + "\n")


def load_case_events(case_id: str, limit: int = 80) -> list[dict[str, Any]]:
    events_path = ensure_case_dirs(case_id)["events_path"]
    if not events_path.exists():
        return []

    items: list[dict[str, Any]] = []
    with events_path.open("r", encoding="utf-8") as handle:
        for line in handle:
            line = line.strip()
            if not line:
                continue
            try:
                items.append(json.loads(line))
            except json.JSONDecodeError:
                continue

    items.sort(key=lambda item: item.get("recorded_at") or "", reverse=True)
    return items[:limit]
