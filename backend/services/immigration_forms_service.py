
from __future__ import annotations

import json
import re
import shutil
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from uuid import uuid4

from pypdf import PdfReader, PdfWriter
from pypdf.generic import NameObject, BooleanObject
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

from backend.core.config import settings
from backend.services.docx_extractor import extract_docx_text
from backend.services.pdf_extractor import extract_pdf_text


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def immigration_root() -> Path:
    root = settings.storage_path / "immigration_forms"
    root.mkdir(parents=True, exist_ok=True)
    return root


def session_dir(session_id: str) -> Path:
    path = immigration_root() / session_id
    path.mkdir(parents=True, exist_ok=True)
    return path


def session_meta_path(session_id: str) -> Path:
    return session_dir(session_id) / "session.json"


COMMON_FIELD_PATTERNS: list[tuple[str, re.Pattern[str]]] = [
    ("given_name", re.compile(r"\b(?:given name|first name)\b[:\s]*([A-Z][A-Za-z'\-]+)", re.I)),
    ("family_name", re.compile(r"\b(?:family name|last name|surname)\b[:\s]*([A-Z][A-Za-z'\-]+)", re.I)),
    ("middle_name", re.compile(r"\bmiddle name\b[:\s]*([A-Z][A-Za-z'\-]+)", re.I)),
    ("a_number", re.compile(r"\bA[- ]?Number\b[:\s#]*([A0-9\-]{6,20})", re.I)),
    ("uscis_online_account_number", re.compile(r"\bUSCIS\s+Online\s+Account\s+Number\b[:\s#]*([A-Z0-9\-]{6,20})", re.I)),
    ("date_of_birth", re.compile(r"\b(?:date of birth|dob)\b[:\s]*([0-9]{1,2}[\/\-][0-9]{1,2}[\/\-][0-9]{2,4})", re.I)),
    ("city", re.compile(r"\bcity\b[:\s]*([A-Z][A-Za-z .\-]+)", re.I)),
    ("country", re.compile(r"\bcountry\b[:\s]*([A-Z][A-Za-z .\-]+)", re.I)),
    ("email", re.compile(r"([A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,})", re.I)),
    ("phone", re.compile(r"(\+?\d[\d\s().\-]{7,}\d)", re.I)),
    ("passport_number", re.compile(r"\bpassport(?: number)?\b[:\s#]*([A-Z0-9\-]{5,20})", re.I)),
]

FORM_PROFILES: dict[str, dict[str, Any]] = {
    "i-130": {
        "label": "Form I-130",
        "required_fields": ["given_name", "family_name", "date_of_birth", "city", "country"],
        "evidence_prompts": ["Government-issued identity document", "Relationship evidence", "Civil status documents"],
    },
    "i-485": {
        "label": "Form I-485",
        "required_fields": ["given_name", "family_name", "date_of_birth", "a_number", "passport_number", "city", "country"],
        "evidence_prompts": ["Identity and travel document", "Admission or status evidence", "Civil documents", "Supporting eligibility evidence"],
    },
    "i-751": {
        "label": "Form I-751",
        "required_fields": ["given_name", "family_name", "a_number", "date_of_birth"],
        "evidence_prompts": ["Permanent resident card copy", "Marriage or joint-life evidence", "Identity documents"],
    },
}


def _detect_form_profile(form_name: str) -> dict[str, Any]:
    lowered = str(form_name or "").lower()
    for key, profile in FORM_PROFILES.items():
        if key in lowered:
            return {"form_type": key, **profile}
    return {
        "form_type": "generic_uscis_form",
        "label": "USCIS PDF form",
        "required_fields": ["given_name", "family_name", "date_of_birth"],
        "evidence_prompts": ["Identity documents", "Civil status records", "Any form-specific supporting evidence"],
    }


def _missing_required_fields(required_fields: list[str], values: dict[str, str]) -> list[str]:
    return [field for field in required_fields if not str((values or {}).get(field) or "").strip()]


def _collect_supporting_text(paths: list[Path]) -> str:
    chunks: list[str] = []
    for path in paths:
        suffix = path.suffix.lower()
        if suffix == ".pdf":
            payload = extract_pdf_text(path)
            chunks.append(str(payload.get("text") or ""))
        elif suffix == ".docx":
            chunks.append(extract_docx_text(path))
        elif suffix in {".txt", ".md"}:
            chunks.append(path.read_text(encoding="utf-8", errors="ignore"))
    return "\n".join(part for part in chunks if part)


def _extract_hints(text: str) -> dict[str, str]:
    hints: dict[str, str] = {}
    for key, pattern in COMMON_FIELD_PATTERNS:
        if key in hints:
            continue
        match = pattern.search(text or "")
        if match:
            value = (match.group(1) or "").strip()
            if value:
                hints[key] = value
    return hints


def _pdf_field_names(form_path: Path) -> list[str]:
    try:
        reader = PdfReader(str(form_path))
        fields = reader.get_fields() or {}
        names = [str(name) for name in fields.keys()]
        if names:
            return names
    except Exception:
        pass
    return []


def _sanitize_filename(name: str) -> str:
    safe = "".join(ch for ch in (name or "file") if ch.isalnum() or ch in {"-", "_", ".", " "}).strip()
    return safe or "file"


def create_session(form_filename: str, form_bytes: bytes, supporting_files: list[tuple[str, bytes]]) -> dict[str, Any]:
    try:
        from backend.services.auth_service import current_user_id, current_workspace_id

        active_user_id = current_user_id()
        active_workspace_id = current_workspace_id()
    except Exception:
        active_user_id = None
        active_workspace_id = None
    session_id = f"imm_{uuid4().hex[:12]}"
    directory = session_dir(session_id)

    form_path = directory / f"uploaded_form_{_sanitize_filename(form_filename)}"
    form_path.write_bytes(form_bytes)

    support_records: list[dict[str, str]] = []
    support_paths: list[Path] = []
    for original_name, payload in supporting_files:
        file_path = directory / f"support_{uuid4().hex[:8]}_{_sanitize_filename(original_name)}"
        file_path.write_bytes(payload)
        support_paths.append(file_path)
        support_records.append({
            "original_name": original_name,
            "stored_name": file_path.name,
            "path": str(file_path),
        })

    field_names = _pdf_field_names(form_path)
    supporting_text = _collect_supporting_text(support_paths)
    extracted_hints = _extract_hints(supporting_text)
    form_profile = _detect_form_profile(form_filename)
    missing_fields = _missing_required_fields(form_profile["required_fields"], extracted_hints)

    session = {
        "session_id": session_id,
        "created_at": _utcnow().isoformat(),
        "updated_at": _utcnow().isoformat(),
        "user_id": active_user_id,
        "workspace_id": active_workspace_id,
        "form": {
            "original_name": form_filename,
            "stored_name": form_path.name,
            "path": str(form_path),
            "field_names": field_names,
            "is_fillable": bool(field_names),
        },
        "supporting_files": support_records,
        "supporting_hints": extracted_hints,
        "manual_values": {},
        "form_profile": form_profile,
        "missing_fields": missing_fields,
        "generated_output": None,
        "status": "draft",
        "review_notice": "Human review is required before filing. This workflow prepares a draft filled PDF and does not replace legal review.",
    }
    session_meta_path(session_id).write_text(json.dumps(session, indent=2), encoding="utf-8")
    return session


def load_session(session_id: str) -> dict[str, Any]:
    path = session_meta_path(session_id)
    if not path.exists():
        raise FileNotFoundError(f"Immigration form session '{session_id}' does not exist.")
    session = json.loads(path.read_text(encoding="utf-8"))
    try:
        from backend.services.auth_service import current_user_id, current_workspace_id

        active_user_id = current_user_id()
        active_workspace_id = current_workspace_id()
        if active_user_id and session.get("user_id") and session.get("user_id") != active_user_id:
            raise FileNotFoundError(f"Immigration form session '{session_id}' does not exist.")
        if active_workspace_id and session.get("workspace_id") and session.get("workspace_id") != active_workspace_id:
            raise FileNotFoundError(f"Immigration form session '{session_id}' does not exist.")
    except FileNotFoundError:
        raise
    except Exception:
        pass
    return session


def save_session(session: dict[str, Any]) -> dict[str, Any]:
    session["updated_at"] = _utcnow().isoformat()
    session_meta_path(session["session_id"]).write_text(json.dumps(session, indent=2), encoding="utf-8")
    return session


def list_sessions(limit: int = 20) -> list[dict[str, Any]]:
    sessions: list[dict[str, Any]] = []
    for path in immigration_root().glob("*/session.json"):
        try:
            payload = json.loads(path.read_text(encoding="utf-8"))
            sessions.append(load_session(str(payload.get("session_id") or "")))
        except Exception:
            continue
    sessions.sort(key=lambda item: item.get("updated_at") or item.get("created_at") or "", reverse=True)
    return sessions[:limit]


def delete_session(session_id: str) -> None:
    directory = immigration_root() / session_id
    if not directory.exists():
        raise FileNotFoundError(f"Immigration form session '{session_id}' does not exist.")
    shutil.rmtree(directory, ignore_errors=False)


def _resolve_values(session: dict[str, Any], manual_values: dict[str, str] | None) -> dict[str, str]:
    values = dict(session.get("supporting_hints") or {})
    values.update({k: v for k, v in (session.get("manual_values") or {}).items() if v not in {None, ""}})
    values.update({k: v for k, v in (manual_values or {}).items() if v not in {None, ""}})
    return {str(k): str(v) for k, v in values.items()}


def _create_overlay_pdf(values: dict[str, str], destination: Path) -> None:
    c = canvas.Canvas(str(destination), pagesize=letter)
    width, height = letter
    y = height - 54
    c.setFont("Helvetica-Bold", 14)
    c.drawString(48, y, "DocketMint Immigration Draft Overlay")
    y -= 20
    c.setFont("Helvetica", 10)
    c.drawString(48, y, "Review required before filing. The values below were mapped from supporting documents and manual input.")
    y -= 28
    c.setFont("Helvetica-Bold", 11)
    c.drawString(48, y, "Mapped values")
    y -= 18
    c.setFont("Helvetica", 10)
    for key, value in sorted(values.items()):
        if y < 60:
            c.showPage()
            y = height - 54
            c.setFont("Helvetica", 10)
        c.drawString(48, y, f"{key}: {value[:120]}")
        y -= 15
    c.save()


def _fill_pdf_form(form_path: Path, values: dict[str, str], output_path: Path) -> tuple[bool, list[str]]:
    reader = PdfReader(str(form_path))
    writer = PdfWriter()
    for page in reader.pages:
        writer.add_page(page)
    field_names = []
    try:
        fields = reader.get_fields() or {}
        field_names = list(fields.keys())
    except Exception:
        field_names = []
    if not field_names:
        return False, []

    matching_values: dict[str, str] = {}
    lowered = {str(k).lower(): str(v) for k, v in values.items()}
    for field_name in field_names:
        normalized_field = str(field_name).lower()
        if normalized_field in lowered:
            matching_values[field_name] = lowered[normalized_field]
            continue
        for key, value in values.items():
            if key.lower() in normalized_field or normalized_field in key.lower():
                matching_values[field_name] = str(value)
                break
    if not matching_values:
        matching_values = {field_name: "" for field_name in field_names}

    writer.update_page_form_field_values(writer.pages[0], matching_values)
    writer._root_object.update({NameObject("/NeedAppearances"): BooleanObject(True)})
    with output_path.open("wb") as fh:
        writer.write(fh)
    return True, sorted(matching_values.keys())


def generate_filled_pdf(session_id: str, manual_values: dict[str, str] | None = None) -> dict[str, Any]:
    session = load_session(session_id)
    values = _resolve_values(session, manual_values)
    session["manual_values"] = values
    profile = session.get("form_profile") or _detect_form_profile((session.get("form") or {}).get("original_name") or "")
    session["form_profile"] = profile
    session["missing_fields"] = _missing_required_fields(profile.get("required_fields") or [], values)
    directory = session_dir(session_id)

    form_path = Path(session["form"]["path"])
    output_path = directory / "filled_form.pdf"
    overlay_path = directory / "mapped_values_overlay.pdf"

    fillable = bool(session["form"].get("is_fillable"))
    filled_fields: list[str] = []
    used_fillable = False
    if fillable:
        try:
            used_fillable, filled_fields = _fill_pdf_form(form_path, values, output_path)
        except Exception:
            used_fillable = False
    if not used_fillable:
        _create_overlay_pdf(values, overlay_path)
        reader_original = PdfReader(str(form_path))
        reader_overlay = PdfReader(str(overlay_path))
        writer = PdfWriter()
        for page in reader_original.pages:
            writer.add_page(page)
        for page in reader_overlay.pages:
            writer.add_page(page)
        with output_path.open("wb") as fh:
            writer.write(fh)

    session["generated_output"] = {
        "file_name": output_path.name,
        "path": str(output_path),
        "download_url": f"/files/immigration_forms/{session_id}/{output_path.name}",
        "used_fillable_pdf_fields": used_fillable,
        "filled_fields": filled_fields,
    }
    session["status"] = "generated"
    save_session(session)
    return session


def session_payload(session: dict[str, Any]) -> dict[str, Any]:
    form = session.get("form") or {}
    generated = session.get("generated_output")
    profile = session.get("form_profile") or _detect_form_profile(form.get("original_name") or "")
    field_names = list(form.get("field_names") or [])
    suggested = sorted(set(field_names + list((session.get("supporting_hints") or {}).keys())))
    missing_fields = session.get("missing_fields") or _missing_required_fields(profile.get("required_fields") or [], _resolve_values(session, None))
    return {
        "session_id": session["session_id"],
        "service_slug": "immigration_forms",
        "title": form.get("original_name") or session["session_id"],
        "status": session.get("status", "draft"),
        "created_at": session.get("created_at"),
        "updated_at": session.get("updated_at"),
        "review_notice": session.get("review_notice"),
        "form_profile": profile,
        "form": {
            "original_name": form.get("original_name"),
            "is_fillable": bool(form.get("is_fillable")),
            "field_names": field_names,
        },
        "supporting_files": session.get("supporting_files", []),
        "supporting_hints": session.get("supporting_hints", {}),
        "manual_values": session.get("manual_values", {}),
        "suggested_fields": suggested,
        "required_fields": list(profile.get("required_fields") or []),
        "missing_fields": missing_fields,
        "evidence_prompts": list(profile.get("evidence_prompts") or []),
        "intake_sections": [
            {"slug": "identity", "title": "Identity and profile", "fields": ["given_name", "family_name", "middle_name", "date_of_birth", "a_number"]},
            {"slug": "contact", "title": "Contact and address", "fields": ["email", "phone", "city", "country"]},
            {"slug": "travel", "title": "Travel and document numbers", "fields": ["passport_number", "uscis_online_account_number"]},
        ],
        "nothing_is_sent_automatically": True,
        "generated_output": generated,
    }
