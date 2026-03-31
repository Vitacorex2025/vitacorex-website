from __future__ import annotations

import re
from datetime import date, datetime, timedelta

from backend.models.case_schema import CaseRecord, DeadlineItem
from backend.services.case_state import active_source_files

DATE_PATTERNS = [
    re.compile(r"\b(\d{1,2}/\d{1,2}/\d{2,4})\b"),
    re.compile(r"\b(\d{4}-\d{2}-\d{2})\b"),
    re.compile(
        r"\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})(?:,)?\s+(\d{4})\b",
        re.IGNORECASE,
    ),
]
WINDOW_PATTERN = re.compile(
    r"\b(within|no later than|respond by|reply by|appeal by|payment due within)\s+(\d{1,3})\s+days?\b",
    re.IGNORECASE,
)


def _parse_date(raw: str) -> date | None:
    raw = str(raw or "").strip()
    if not raw:
        return None
    for fmt in ("%m/%d/%Y", "%m/%d/%y", "%Y-%m-%d", "%B %d %Y", "%B %d, %Y"):
        try:
            return datetime.strptime(raw, fmt).date()
        except ValueError:
            continue
    return None


def _months_to_title(raw: str) -> str:
    return " ".join(part.capitalize() for part in str(raw).split())


def _nearby_label(snippet: str) -> tuple[str, str]:
    text = str(snippet or "").lower()
    if "appeal" in text:
        return "appeal", "Appeal deadline"
    if "payment" in text or "amount due" in text or "balance due" in text:
        return "payment", "Payment deadline"
    if "respond" in text or "reply" in text:
        return "response", "Response deadline"
    if "review" in text:
        return "review", "Review deadline"
    return "deadline", "Detected deadline"


def _urgency(deadline_date: date | None) -> str:
    if not deadline_date:
        return "medium"
    delta = (deadline_date - date.today()).days
    if delta <= 7:
        return "high"
    if delta <= 21:
        return "medium"
    return "low"


def extract_case_deadlines(record: CaseRecord) -> list[DeadlineItem]:
    items: list[DeadlineItem] = []
    seen: set[tuple[str, str | None, str | None]] = set()

    for source in active_source_files(record) or list(record.source_files or []):
        text = source.extracted_text or ""
        if not text:
            continue

        for pattern in DATE_PATTERNS:
            for match in pattern.finditer(text):
                if pattern.pattern.startswith(r"\b(January"):
                    raw = f"{_months_to_title(match.group(1))} {match.group(2)}, {match.group(3)}"
                else:
                    raw = match.group(1)
                parsed = _parse_date(raw)
                start = max(0, match.start() - 50)
                end = min(len(text), match.end() + 90)
                snippet = text[start:end].replace("\n", " ").strip()
                deadline_type, label = _nearby_label(snippet)
                key = (deadline_type, parsed.isoformat() if parsed else raw, source.original_filename)
                if key in seen:
                    continue
                seen.add(key)
                items.append(
                    DeadlineItem(
                        type=deadline_type,
                        label=label,
                        date=parsed.isoformat() if parsed else raw,
                        urgency=_urgency(parsed),
                        confidence=0.82 if parsed else 0.4,
                        source_excerpt=snippet[:220],
                        source_file=source.original_filename,
                    )
                )

        for match in WINDOW_PATTERN.finditer(text):
            days = int(match.group(2))
            anchor = (source.uploaded_at or datetime.utcnow()).date()
            parsed = anchor + timedelta(days=days)
            start = max(0, match.start() - 50)
            end = min(len(text), match.end() + 90)
            snippet = text[start:end].replace("\n", " ").strip()
            deadline_type, label = _nearby_label(snippet)
            key = (deadline_type, parsed.isoformat(), source.original_filename)
            if key in seen:
                continue
            seen.add(key)
            items.append(
                DeadlineItem(
                    type=deadline_type,
                    label=label,
                    date=parsed.isoformat(),
                    urgency=_urgency(parsed),
                    confidence=0.58,
                    source_excerpt=snippet[:220],
                    source_file=source.original_filename,
                )
            )

    items.sort(
        key=lambda item: (
            0 if item.date else 1,
            item.date or "",
            item.label,
        )
    )
    return items[:8]
