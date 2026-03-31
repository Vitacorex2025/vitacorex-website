from __future__ import annotations

import json
import os
import re
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit
from uuid import uuid4

import requests
from fastapi import HTTPException, UploadFile

from backend.core.config import settings


LEADS_ROOT = settings.storage_path / "vitacorex_leads"
LEADS_ROOT.mkdir(parents=True, exist_ok=True)
AUDIT_DIR = LEADS_ROOT / "audit"
AUDIT_DIR.mkdir(parents=True, exist_ok=True)
AUDIT_LOG = AUDIT_DIR / "submissions.jsonl"
ALERT_LOG = AUDIT_DIR / "alerts.jsonl"

SUPPORTED_LANGS = {"en", "ru", "es"}
SUPPORTED_PURPOSES = {
    "company_review",
    "individual_request",
    "executive_brief",
    "careers_application",
}
ALLOWED_EXTENSIONS = {
    ".pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".csv",
    ".png",
    ".jpg",
    ".jpeg",
    ".txt",
}
MAX_UPLOAD_BYTES = settings.max_upload_file_size_mb * 1024 * 1024
RATE_LIMIT_WINDOW = timedelta(minutes=10)
RATE_LIMIT_COUNT = int((os.getenv("VITACOREX_RATE_LIMIT_PER_10_MIN") or "8").strip() or "8")
PUBLIC_BASE_URL = (os.getenv("VITACOREX_PUBLIC_BASE_URL") or "https://vitacorexllc.com").strip().rstrip("/")
WEBHOOK_URL = (os.getenv("VITACOREX_CRM_WEBHOOK_URL") or "").strip()
WEBHOOK_TOKEN = (os.getenv("VITACOREX_CRM_WEBHOOK_TOKEN") or "").strip()
ALERT_WEBHOOK_URL = (os.getenv("VITACOREX_ALERT_WEBHOOK_URL") or "").strip()

REQUIRED_FIELDS = {
    "company_review": {"full_name", "work_email", "company_name", "service_line"},
    "individual_request": {"full_name", "email", "service_line"},
    "executive_brief": {"full_name", "work_email", "company_name", "asset_requested"},
    "careers_application": {"full_name", "email", "role_interest"},
}

# NOTE: Brief PDFs must be placed at /assets/briefs/ before enabling these download URLs.
# Current placeholder files in /assets/img/ are stubs (< 2KB) and are not real documents.
# Until real PDFs exist at the correct path, download_url is suppressed (returns None).
ASSET_DOWNLOADS: dict[str, str] = {}


def normalize_lang(value: str | None) -> str:
    candidate = (value or "en").strip().lower()
    return candidate if candidate in SUPPORTED_LANGS else "en"


def normalize_purpose(value: str | None) -> str:
    candidate = (value or "").strip().lower()
    if candidate not in SUPPORTED_PURPOSES:
        raise HTTPException(status_code=400, detail={"message": "Unsupported form purpose.", "code": "unsupported_purpose"})
    return candidate


def sanitize_filename(name: str) -> str:
    base = Path(name or "upload.bin").name
    cleaned = re.sub(r"[^A-Za-z0-9._-]+", "-", base).strip(".-")
    return cleaned or "upload.bin"


def _clean_text(value: Any, max_length: int = 4000) -> str:
    if value is None:
        return ""
    text = str(value).replace("\r", " ").replace("\n", "\n").strip()
    return text[:max_length]


def _clean_list(value: Any) -> list[str]:
    if value is None:
        return []
    if isinstance(value, list):
        return [_clean_text(item, 240) for item in value if _clean_text(item, 240)]
    text = _clean_text(value, 500)
    if not text:
        return []
    if "|" in text:
        items = text.split("|")
    elif "," in text:
        items = text.split(",")
    else:
        items = [text]
    return [item.strip() for item in items if item.strip()]


def _append_jsonl(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(payload, ensure_ascii=False) + "\n")


def _recent_submission_count(client_ip: str, purpose: str, now: datetime) -> int:
    if not AUDIT_LOG.exists():
        return 0
    count = 0
    threshold = now - RATE_LIMIT_WINDOW
    with AUDIT_LOG.open("r", encoding="utf-8") as handle:
        for line in handle:
            line = line.strip()
            if not line:
                continue
            try:
                item = json.loads(line)
            except json.JSONDecodeError:
                continue
            if item.get("client_ip") != client_ip:
                continue
            if item.get("purpose") != purpose:
                continue
            timestamp = item.get("created_at")
            if not timestamp:
                continue
            try:
                created_at = datetime.fromisoformat(timestamp)
            except ValueError:
                continue
            if created_at >= threshold:
                count += 1
    return count


def _safe_relative_path(value: str | None, fallback: str) -> str:
    candidate = (value or "").strip()
    if not candidate:
        return fallback
    if "://" in candidate or candidate.startswith("//"):
        return fallback
    if not candidate.startswith("/"):
        return fallback
    parsed_candidate = urlsplit(candidate)
    parsed_fallback = urlsplit(fallback)
    merged_query = dict(parse_qsl(parsed_fallback.query, keep_blank_values=True))
    merged_query.update(dict(parse_qsl(parsed_candidate.query, keep_blank_values=True)))
    return urlunsplit(
        (
            "",
            "",
            parsed_candidate.path or parsed_fallback.path,
            urlencode(merged_query, doseq=True),
            parsed_candidate.fragment or parsed_fallback.fragment,
        )
    )


def _purpose_stage(purpose: str) -> str:
    return "New"


def _client_type_for_purpose(purpose: str) -> str:
    if purpose == "company_review":
        return "company"
    if purpose == "executive_brief":
        return "company"
    if purpose == "careers_application":
        return "careers"
    return "individual"


def _validate_required_fields(purpose: str, fields: dict[str, Any]) -> None:
    missing = [name for name in REQUIRED_FIELDS[purpose] if not _clean_text(fields.get(name), 320)]
    if missing:
        raise HTTPException(
            status_code=422,
            detail={
                "message": "Required fields are missing.",
                "code": "required_fields_missing",
                "fields": missing,
            },
        )


def _enforce_submission_guards(purpose: str, fields: dict[str, Any], client_ip: str) -> None:
    honeypot = _clean_text(fields.get("company_website"), 240)
    if honeypot:
        raise HTTPException(status_code=400, detail={"message": "Spam protection triggered.", "code": "spam_blocked"})

    submitted_after_ms = int(_clean_text(fields.get("submitted_after_ms"), 24) or "0")
    if submitted_after_ms and submitted_after_ms < 1200:
        raise HTTPException(status_code=400, detail={"message": "Submission was too fast.", "code": "timing_blocked"})

    now = datetime.now(timezone.utc)
    if client_ip and _recent_submission_count(client_ip, purpose, now) >= RATE_LIMIT_COUNT:
        raise HTTPException(status_code=429, detail={"message": "Too many submissions. Please try again later.", "code": "rate_limited"})


async def _save_uploads(submission_dir: Path, files: list[tuple[str, UploadFile]]) -> list[dict[str, Any]]:
    saved: list[dict[str, Any]] = []
    if not files:
        return saved

    upload_dir = submission_dir / "files"
    upload_dir.mkdir(parents=True, exist_ok=True)

    for field_name, upload in files:
        filename = sanitize_filename(upload.filename or "upload.bin")
        ext = Path(filename).suffix.lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=415,
                detail={"message": f"Unsupported file type: {ext or 'unknown'}.", "code": "unsupported_file_type"},
            )
        blob = await upload.read()
        if len(blob) > MAX_UPLOAD_BYTES:
            raise HTTPException(
                status_code=413,
                detail={"message": f"File exceeds {settings.max_upload_file_size_mb} MB limit.", "code": "file_too_large"},
            )
        target = upload_dir / filename
        suffix = 1
        while target.exists():
            target = upload_dir / f"{target.stem}-{suffix}{target.suffix}"
            suffix += 1
        target.write_bytes(blob)
        saved.append(
            {
                "field_name": field_name,
                "filename": target.name,
                "content_type": upload.content_type or "application/octet-stream",
                "size_bytes": len(blob),
                "relative_path": str(target.relative_to(LEADS_ROOT)).replace("\\", "/"),
            }
        )
    return saved


def _asset_download_url(asset_key: str | None) -> str | None:
    if not asset_key:
        return None
    return ASSET_DOWNLOADS.get(asset_key.strip().lower())


def _dispatch_webhook(record: dict[str, Any]) -> dict[str, Any]:
    if not WEBHOOK_URL:
        return {"status": "skipped", "reason": "not_configured"}

    headers = {"Content-Type": "application/json"}
    if WEBHOOK_TOKEN:
        headers["Authorization"] = f"Bearer {WEBHOOK_TOKEN}"

    payload = {
        "lead_id": record["lead_id"],
        "created_at": record["created_at"],
        "purpose": record["purpose"],
        "pipeline_stage": record["pipeline_stage"],
        "client_type": record["client_type"],
        "language": record["language"],
        "asset_requested": record.get("asset_requested"),
        "lead_scoring": record.get("lead_scoring", {}),
        "contact": record["contact"],
        "context": record["context"],
        "attachments": record["attachments"],
        "notes": record["notes"],
    }

    try:
        response = requests.post(WEBHOOK_URL, json=payload, headers=headers, timeout=10)
        response.raise_for_status()
        return {"status": "sent", "http_status": response.status_code}
    except Exception as exc:  # pragma: no cover - best effort path
        _append_jsonl(
            ALERT_LOG,
            {
                "recorded_at": datetime.now(timezone.utc).isoformat(),
                "type": "crm_webhook_failure",
                "lead_id": record["lead_id"],
                "error": str(exc),
            },
        )
        if ALERT_WEBHOOK_URL:
            try:
                requests.post(
                    ALERT_WEBHOOK_URL,
                    json={"lead_id": record["lead_id"], "type": "crm_webhook_failure", "error": str(exc)},
                    timeout=6,
                )
            except Exception:
                pass
        return {"status": "failed", "error": str(exc)}


async def store_submission(
    *,
    fields: dict[str, Any],
    files: list[tuple[str, UploadFile]],
    client_ip: str,
    user_agent: str,
    referer: str,
) -> dict[str, Any]:
    purpose = normalize_purpose(fields.get("purpose"))
    _validate_required_fields(purpose, fields)
    _enforce_submission_guards(purpose, fields, client_ip)

    lang = normalize_lang(fields.get("lang"))
    lead_id = f"vcx-{datetime.now(timezone.utc).strftime('%Y%m%d')}-{uuid4().hex[:10]}"
    submission_dir = LEADS_ROOT / lead_id
    submission_dir.mkdir(parents=True, exist_ok=True)
    created_at = datetime.now(timezone.utc).isoformat()
    attachments = await _save_uploads(submission_dir, files)

    full_name = _clean_text(fields.get("full_name"), 180)
    contact_email = _clean_text(fields.get("work_email") or fields.get("email"), 240)
    contact_phone = _clean_text(fields.get("phone"), 80)

    scoring = {
        "industry": _clean_text(fields.get("industry"), 120),
        "revenue_band": _clean_text(fields.get("annual_revenue_band"), 120),
        "portfolio_band": _clean_text(fields.get("portfolio_size_band"), 120),
        "documentation_quality": _clean_text(fields.get("documentation_condition"), 160),
        "urgency": _clean_text(fields.get("urgency"), 120),
        "pain_type": _clean_text(fields.get("pain_type"), 160),
        "campaign_source": _clean_text(fields.get("utm_source"), 120),
    }

    record = {
        "lead_id": lead_id,
        "created_at": created_at,
        "purpose": purpose,
        "pipeline_stage": _purpose_stage(purpose),
        "client_type": _client_type_for_purpose(purpose),
        "language": lang,
        "asset_requested": _clean_text(fields.get("asset_requested"), 120),
        "service_line": _clean_text(fields.get("service_line"), 180),
        "contact": {
            "full_name": full_name,
            "email": contact_email,
            "phone": contact_phone,
            "company_name": _clean_text(fields.get("company_name"), 180),
            "title": _clean_text(fields.get("title"), 160),
            "location": _clean_text(fields.get("location"), 180),
            "linkedin_url": _clean_text(fields.get("linkedin_url"), 240),
        },
        "context": {
            "page_path": _clean_text(fields.get("page_path"), 240),
            "page_url": _clean_text(fields.get("page_url"), 320),
            "page_title": _clean_text(fields.get("page_title"), 240),
            "landing_page": _clean_text(fields.get("landing_page"), 320),
            "referrer": _clean_text(fields.get("referrer") or referer, 320),
            "route_key": _clean_text(fields.get("route_key"), 120),
            "client_ip": client_ip,
            "user_agent": user_agent,
            "utm_source": _clean_text(fields.get("utm_source"), 120),
            "utm_medium": _clean_text(fields.get("utm_medium"), 120),
            "utm_campaign": _clean_text(fields.get("utm_campaign"), 120),
            "utm_term": _clean_text(fields.get("utm_term"), 120),
            "utm_content": _clean_text(fields.get("utm_content"), 120),
            "gclid": _clean_text(fields.get("gclid"), 120),
            "fbclid": _clean_text(fields.get("fbclid"), 120),
            "msclkid": _clean_text(fields.get("msclkid"), 120),
            "li_fat_id": _clean_text(fields.get("li_fat_id"), 120),
            "landing_language": lang,
        },
        "lead_scoring": scoring,
        "notes": {
            "message": _clean_text(fields.get("message"), 5000),
            "operator_size": _clean_text(fields.get("operator_size"), 180),
            "geography": _clean_text(fields.get("geography"), 180),
            "role_interest": _clean_text(fields.get("role_interest"), 180),
            "services_requested": _clean_list(fields.get("services_requested")),
        },
        "attachments": attachments,
    }

    (submission_dir / "lead.json").write_text(json.dumps(record, ensure_ascii=False, indent=2), encoding="utf-8")
    _append_jsonl(
        AUDIT_LOG,
        {
            "created_at": created_at,
            "lead_id": lead_id,
            "purpose": purpose,
            "client_ip": client_ip,
            "language": lang,
            "asset_requested": record["asset_requested"],
            "company_name": record["contact"]["company_name"],
            "email": contact_email,
        },
    )

    webhook = _dispatch_webhook(record)
    response_path = _safe_relative_path(
        fields.get("thank_you_path"),
        f"/{'%s/' % lang if lang != 'en' else ''}thank-you.html?purpose={purpose}&lead={lead_id}",
    )
    download_url = _asset_download_url(record["asset_requested"])

    return {
        "ok": True,
        "lead_id": lead_id,
        "purpose": purpose,
        "pipeline_stage": record["pipeline_stage"],
        "client_type": record["client_type"],
        "thank_you_url": response_path,
        "download_url": download_url,
        "webhook": webhook,
        "storage_path": str(submission_dir),
    }
