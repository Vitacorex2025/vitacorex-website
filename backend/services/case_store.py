from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path
import re

from backend.core.config import settings
from backend.models.case_schema import CaseRecord


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


INTERNAL_CASE_TITLE_PATTERNS = [
    re.compile(pattern, re.IGNORECASE)
    for pattern in [
        r"\bsmoke\b",
        r"\bforensics?\b",
        r"\bstale\s+state\b",
        r"\bblocked\s+payload\b",
        r"\bempty\s+matter\b",
        r"\binvalidation\b",
        r"\breset\b",
        r"\bdiagnostic\b",
        r"\bfixture\b",
        r"\btest\b",
    ]
]


def default_workspace_id() -> str | None:
    try:
        from backend.services.auth_service import current_workspace_id

        return current_workspace_id()
    except Exception:
        return None


def cases_root() -> Path:
    path = settings.storage_path / "cases"
    path.mkdir(parents=True, exist_ok=True)
    return path


def ensure_case_dirs(case_id: str) -> dict[str, Path]:
    case_root = cases_root() / case_id
    source_dir = case_root / "source_files"
    template_dir = case_root / "template_files"
    output_dir = case_root / "output"
    verification_dir = case_root / "verification"
    audit_dir = case_root / "audit"
    for directory in (case_root, source_dir, template_dir, output_dir, verification_dir, audit_dir):
        directory.mkdir(parents=True, exist_ok=True)
    return {
        "case_root": case_root,
        "source_dir": source_dir,
        "template_dir": template_dir,
        "output_dir": output_dir,
        "verification_dir": verification_dir,
        "audit_dir": audit_dir,
        "record_path": case_root / "case.json",
        "events_path": audit_dir / "events.jsonl",
    }


def infer_internal_case_flags(record: CaseRecord) -> tuple[bool, bool, bool]:
    if record.is_test or record.is_fixture or record.is_internal_diagnostic:
        return bool(record.is_test), bool(record.is_fixture), bool(record.is_internal_diagnostic)

    haystack = " ".join([record.id or "", record.title or "", record.reference or "", " ".join(record.notes or [])]).strip()
    if not haystack:
        return False, False, False

    matched = any(pattern.search(haystack) for pattern in INTERNAL_CASE_TITLE_PATTERNS)
    if not matched:
        return False, False, False

    lowered = haystack.lower()
    is_fixture = "fixture" in lowered
    is_test = not is_fixture
    return is_test, is_fixture, True


def normalize_case_scope(record: CaseRecord) -> CaseRecord:
    workspace_id = str(record.workspace_id or default_workspace_id() or "workspace_legacy")
    record.workspace_id = workspace_id
    normalized_environment = str(record.environment_tag or "").strip().lower()
    if normalized_environment not in {"legal", "recovery"}:
        normalized_environment = "recovery"
    record.environment_tag = normalized_environment
    normalized_record_type = str(record.record_type or "").strip().lower()
    if not normalized_record_type:
        normalized_record_type = "legal_matter" if normalized_environment == "legal" else "recovery_record"
    record.record_type = normalized_record_type
    record.created_by_user_id = record.created_by_user_id or "system"
    record.is_test, record.is_fixture, record.is_internal_diagnostic = infer_internal_case_flags(record)

    for item in record.source_files:
        item.workspace_id = str(item.workspace_id or workspace_id)
        item.matter_id = item.matter_id or record.id
        if item.extraction_version is None:
            item.extraction_version = int(record.current_extraction_version or 0)

    for item in record.template_files:
        item.workspace_id = str(item.workspace_id or workspace_id)
        item.matter_id = item.matter_id or record.id
        if item.extraction_version is None:
            item.extraction_version = int(record.current_extraction_version or 0)

    return record


def is_client_visible_case(record: CaseRecord, workspace_id: str | None = None, include_internal: bool = False) -> bool:
    normalize_case_scope(record)
    if workspace_id and record.workspace_id != str(workspace_id):
        return False
    if record.deleted_at is not None:
        return False
    if record.archived_at is not None and not include_internal:
        return False
    if include_internal:
        return True
    return not any([record.is_test, record.is_fixture, record.is_internal_diagnostic])


def save_case(record: CaseRecord) -> CaseRecord:
    from backend.services.canonical_snapshot import hydrate_case_for_client

    dirs = ensure_case_dirs(record.id)
    record.updated_at = _utcnow()
    normalize_case_scope(record)
    hydrate_case_for_client(record)
    dirs["record_path"].write_text(record.model_dump_json(indent=2), encoding="utf-8")
    return record


def load_case(case_id: str, workspace_id: str | None = None, include_internal: bool = True) -> CaseRecord:
    from backend.services.canonical_snapshot import hydrate_case_for_client

    record_path = ensure_case_dirs(case_id)["record_path"]
    if not record_path.exists():
        raise FileNotFoundError(f"Case '{case_id}' does not exist.")
    record = CaseRecord.model_validate_json(record_path.read_text(encoding="utf-8"))
    normalize_case_scope(record)
    requested_workspace = workspace_id or default_workspace_id()
    if requested_workspace and record.workspace_id != str(requested_workspace):
        raise FileNotFoundError(f"Case '{case_id}' does not exist in the active account.")
    if not include_internal and not is_client_visible_case(record, workspace_id=requested_workspace, include_internal=False):
        raise FileNotFoundError(f"Case '{case_id}' is not available in the active account.")
    return hydrate_case_for_client(record)


def list_cases(limit: int = 25, workspace_id: str | None = None, include_internal: bool = False) -> list[CaseRecord]:
    records: list[CaseRecord] = []
    requested_workspace = workspace_id or default_workspace_id()
    for record_path in cases_root().glob("*/case.json"):
        try:
            record = CaseRecord.model_validate_json(record_path.read_text(encoding="utf-8"))
            normalize_case_scope(record)
            if not is_client_visible_case(record, workspace_id=requested_workspace, include_internal=include_internal):
                continue
            records.append(record)
        except Exception:
            continue
    records.sort(key=lambda item: item.updated_at, reverse=True)
    return records[:limit]
