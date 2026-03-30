
from __future__ import annotations

from pathlib import Path

from fastapi import APIRouter, HTTPException, Query, Request
from pydantic import BaseModel, Field

from backend.services.case_store import load_case, save_case
from backend.services.contract_intelligence_service import load_session as load_contract_session
from backend.services.contract_intelligence_service import save_session as save_contract_session
from backend.services.dealer_contract_check_service import load_session as load_dealer_session
from backend.services.dealer_contract_check_service import report_pdf_path
from backend.services.dealer_contract_check_service import save_session as save_dealer_session
from backend.services.immigration_forms_service import load_session as load_immigration_session
from backend.services.immigration_forms_service import save_session as save_immigration_session
from backend.services.entitlements_service import record_usage_event
from backend.services.platform_history import history_payload, home_dashboard_payload, workspace_commercial_payload
from backend.services.platform_services import build_platform_services
from backend.services import auth_service

router = APIRouter(tags=["platform"])


class HistorySelection(BaseModel):
    id: str
    scope_kind: str | None = None
    owner_kind: str | None = None
    owner_id: str | None = None
    service_slug: str | None = None


class HistoryClearRequest(BaseModel):
    items: list[HistorySelection] = Field(default_factory=list)
    clear_all: bool = False
    service_slug: str | None = None
    owner_id: str | None = None


class UsageEventRequest(BaseModel):
    event_type: str = Field(min_length=1, max_length=80)
    case_id: str | None = None
    payload: dict[str, object] = Field(default_factory=dict)


def _remove_case_output(owner_id: str, ledger_id: str) -> dict[str, object] | None:
    try:
        record = load_case(owner_id)
    except FileNotFoundError:
        return None

    target = next((item for item in record.download_ledger if item.id == ledger_id), None)
    if target is None:
        return None

    file_path = Path(target.file_path) if target.file_path else None
    if file_path and file_path.exists():
        file_path.unlink()

    record.download_ledger = [item for item in record.download_ledger if item.id != ledger_id]
    if record.packet_generation:
        record.packet_generation.documents = [
            item
            for item in record.packet_generation.documents
            if Path(item.document_path or item.document_name).name != target.file_name
        ]
        if record.packet_generation.zip_path and Path(record.packet_generation.zip_path).name == target.file_name:
            record.packet_generation.zip_path = None
            record.packet_generation.download_url = None
    if record.contract_review:
        if record.contract_review.revised_contract_path and Path(record.contract_review.revised_contract_path).name == target.file_name:
            record.contract_review.revised_contract_path = None
            record.contract_review.revised_contract_download_url = None
        if record.contract_review.change_memo_path and Path(record.contract_review.change_memo_path).name == target.file_name:
            record.contract_review.change_memo_path = None
            record.contract_review.change_memo_download_url = None

    save_case(record)
    return {"kind": "case_output", "id": ledger_id, "owner_id": owner_id}


def _remove_contract_output(session_id: str, output_key: str) -> dict[str, object] | None:
    session = load_contract_session(session_id)
    review = dict(session.get("review") or {})
    path_key = "revised_contract_path" if output_key == "revised_contract_download_url" else "change_memo_path"
    file_path = review.get(path_key)
    if file_path and Path(file_path).exists():
        Path(file_path).unlink()
    review[path_key] = None
    review[output_key] = None
    session["review"] = review
    session["status"] = "completed"
    save_contract_session(session)
    return {"kind": "standalone_output", "id": f"{session_id}:{output_key}", "owner_id": session_id}


def _remove_immigration_output(session_id: str) -> dict[str, object] | None:
    session = load_immigration_session(session_id)
    generated = dict(session.get("generated_output") or {})
    file_path = generated.get("path")
    if file_path and Path(file_path).exists():
        Path(file_path).unlink()
    session["generated_output"] = None
    session["status"] = "draft"
    save_immigration_session(session)
    return {"kind": "standalone_output", "id": f"{session_id}:draft_pdf", "owner_id": session_id}


def _remove_dealer_output(session_id: str) -> dict[str, object] | None:
    session = load_dealer_session(session_id)
    report_name = getattr(session, "report_pdf_name", None)
    if report_name:
        actual_path = report_pdf_path(session_id)
        if actual_path.exists():
            actual_path.unlink()
    session.report_pdf_name = None
    save_dealer_session(session)
    return {"kind": "standalone_output", "id": f"{session_id}:report_pdf", "owner_id": session_id}


def _clear_history_item(item: HistorySelection) -> dict[str, object] | None:
    owner_kind = str(item.owner_kind or "").strip().lower()
    service_slug = str(item.service_slug or "").strip().lower()
    if owner_kind == "case" and item.owner_id:
        return _remove_case_output(item.owner_id, item.id)
    if owner_kind == "session" and item.owner_id:
        session_id = item.owner_id
        if service_slug in {"contract_intelligence", "contract_risk"}:
            output_key = str(item.id).split(":", 1)[1] if ":" in str(item.id) else "revised_contract_download_url"
            return _remove_contract_output(session_id, output_key)
        if service_slug == "immigration_forms":
            return _remove_immigration_output(session_id)
        if service_slug in {"dealer_contract_check", "auto_deal_integrity"}:
            return _remove_dealer_output(session_id)
    return None


@router.get("/platform/services")
def get_platform_services(case_id: str | None = Query(default=None)):
    record = None
    if case_id:
        try:
            record = load_case(case_id)
        except FileNotFoundError as exc:
            raise HTTPException(status_code=404, detail=str(exc)) from exc
    payload = build_platform_services(record)
    services = payload["services"]
    context = auth_service.get_request_context()
    environments = auth_service.environment_access_payload(context.user, context.membership) if context else {}
    return {
        "service_count": len(services),
        "primary_service": services[0]["slug"] if services else None,
        "recommended_services": [item["slug"] for item in services if item.get("recommended")],
        "case_issue_category": getattr(record, "issue_category", None) if record else None,
        "urgent_action_required": bool(getattr(record, "deadlines", None)) if record else False,
        "current_stage": getattr(record, "current_stage", None) if record else None,
        "environments": environments,
        "primary_navigation": payload["primary_navigation"],
        "services": services,
        "secondary_services": payload["secondary_services"],
    }


@router.get("/platform/dashboard")
def get_platform_dashboard():
    return home_dashboard_payload()


@router.get("/platform/commercial")
def get_platform_commercial():
    return workspace_commercial_payload()


@router.post("/platform/usage-events")
def post_platform_usage_event(payload: UsageEventRequest, request: Request):
    context = auth_service.require_session(request)
    try:
        event = record_usage_event(
            context.workspace.id,
            payload.event_type,
            case_id=payload.case_id,
            actor_user_id=context.user.id,
            payload=payload.payload,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail={"message": str(exc), "code": "invalid_usage_event"}) from exc
    return {"ok": True, "event": event}


@router.get("/platform/history")
def get_platform_history(
    service_slug: str | None = Query(default=None),
    owner_id: str | None = Query(default=None),
):
    return history_payload(service_slug=service_slug, owner_id=owner_id)


@router.post("/platform/history/clear-selected")
def clear_selected_history(payload: HistoryClearRequest):
    removed: list[dict[str, object]] = []
    for item in payload.items:
        try:
            result = _clear_history_item(item)
        except FileNotFoundError:
            result = None
        if result:
            removed.append(result)
    return {"ok": True, "removed": removed, "removed_count": len(removed)}


@router.post("/platform/history/clear")
def clear_history(payload: HistoryClearRequest):
    items = payload.items
    if payload.clear_all:
        history = history_payload(service_slug=payload.service_slug, owner_id=payload.owner_id)
        items = [
            HistorySelection(
                id=item["id"],
                scope_kind=item.get("scope_kind"),
                owner_kind=item.get("owner_kind"),
                owner_id=item.get("owner_id"),
                service_slug=item.get("service_slug"),
            )
            for item in history.get("outputs", [])
        ]
    removed: list[dict[str, object]] = []
    for item in items:
        try:
            result = _clear_history_item(item)
        except FileNotFoundError:
            result = None
        if result:
            removed.append(result)
    return {"ok": True, "removed": removed, "removed_count": len(removed), "clear_all": bool(payload.clear_all)}
