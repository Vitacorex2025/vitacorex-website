from __future__ import annotations

from pathlib import Path
from typing import Any

from backend.services import auth_service
from backend.services.case_store import list_cases, load_case
from backend.services.contract_intelligence_service import list_sessions as list_contract_sessions
from backend.services.contract_intelligence_service import session_payload as contract_session_payload
from backend.services.dealer_contract_check_service import list_sessions as list_dealer_sessions
from backend.services.dealer_contract_check_service import session_payload as dealer_session_payload
from backend.services.download_ledger import visible_entries
from backend.services.entitlements_service import safe_commercial_payload
from backend.services.immigration_forms_service import list_sessions as list_immigration_sessions
from backend.services.immigration_forms_service import session_payload as immigration_session_payload
from backend.services.platform_services import build_platform_services
from backend.services.template_registry import manifest_payload


def _case_summary(record) -> dict[str, Any]:
    snapshot = record.client_snapshot
    deadline = (record.deadlines or [None])[0]
    return {
        "kind": "case",
        "id": record.id,
        "owner_kind": "case",
        "owner_id": record.id,
        "title": snapshot.matter_label or record.title or record.reference or record.id,
        "status": str(snapshot.status or record.status),
        "updated_at": record.updated_at.isoformat() if hasattr(record.updated_at, "isoformat") else str(record.updated_at),
        "route": f"/app/action-center/?case={record.id}",
        "workspace_route": f"/app/workspace/?case={record.id}",
        "downloads_route": f"/app/downloads/?case={record.id}",
        "service_slug": record.workflow_slug or "matter_workspace",
        "issue_category": record.issue_category,
        "current_stage": record.current_stage,
        "urgency_level": record.urgency_level,
        "source_file_count": snapshot.source_file_count,
        "generated_document_count": snapshot.generated_document_count,
        "blocker_count": snapshot.blocker_count,
        "warning_count": snapshot.warning_count,
        "next_action": snapshot.next_action,
        "primary_deadline": deadline.model_dump(mode="json") if deadline else None,
    }


def _session_summary(payload: dict[str, Any], *, label: str, route: str) -> dict[str, Any]:
    return {
        "kind": "session",
        "id": payload.get("session_id"),
        "owner_kind": "session",
        "owner_id": payload.get("session_id"),
        "title": payload.get("title") or label,
        "service_slug": payload.get("service_slug", label.lower().replace(" ", "_")),
        "service_label": label,
        "status": payload.get("status", "draft"),
        "updated_at": payload.get("updated_at") or payload.get("created_at"),
        "route": route.format(session_id=payload.get("session_id")),
        "output_supported": any(
            payload.get("generated_output", {}).get(key)
            for key in ("download_url", "report_pdf_url", "revised_contract_download_url", "change_memo_download_url")
        ),
    }


def recent_cases(limit: int = 8) -> list[dict[str, Any]]:
    return [_case_summary(record) for record in list_cases(limit=limit, workspace_id=auth_service.current_workspace_id())]


def recent_standalone_sessions(limit: int = 10) -> list[dict[str, Any]]:
    sessions: list[dict[str, Any]] = []
    for item in list_contract_sessions(limit=limit):
        sessions.append(
            _session_summary(
                contract_session_payload(item),
                label="Contract Risk Scanner",
                route="/app/contract-intelligence/?session={session_id}",
            )
        )
    for item in list_immigration_sessions(limit=limit):
        sessions.append(
            _session_summary(
                immigration_session_payload(item),
                label="Immigration Forms Studio",
                route="/app/immigration-forms/?session={session_id}",
            )
        )
    for item in list_dealer_sessions(limit=limit):
        payload = dealer_session_payload(item)
        payload["generated_output"] = {"report_pdf_url": payload.get("report_pdf_url")}
        sessions.append(
            _session_summary(
                payload,
                label="Auto Deal Integrity",
                route="/app/dealer-contract-check/?session={session_id}",
            )
        )
    sessions.sort(key=lambda entry: entry.get("updated_at") or "", reverse=True)
    return sessions[:limit]


def recent_downloads(limit: int = 8, *, service_slug: str | None = None, owner_id: str | None = None) -> list[dict[str, Any]]:
    downloads: list[dict[str, Any]] = []
    for record in list_cases(limit=limit * 4, workspace_id=auth_service.current_workspace_id()):
        try:
            hydrated = load_case(record.id)
        except Exception:
            continue
        owner_label = hydrated.title or hydrated.reference or hydrated.id
        case_service_slug = hydrated.workflow_slug or "matter_workspace"
        for entry in visible_entries(hydrated):
            downloads.append(
                {
                    "kind": "output",
                    "scope_kind": "case_output",
                    "id": entry.id,
                    "title": entry.file_name,
                    "updated_at": entry.generated_at.isoformat() if hasattr(entry.generated_at, "isoformat") else str(entry.generated_at),
                    "route": f"/app/action-center/?case={hydrated.id}",
                    "download_url": entry.download_url,
                    "context": owner_label,
                    "owner_kind": "case",
                    "owner_id": hydrated.id,
                    "owner_label": owner_label,
                    "service_slug": entry.service_slug or case_service_slug,
                    "service_label": case_service_slug.replace("_", " ").title(),
                }
            )
    for session in list_contract_sessions(limit=limit * 2):
        payload = contract_session_payload(session)
        for key, title in (
            ("revised_contract_download_url", "Revised contract draft"),
            ("change_memo_download_url", "Contract change memo"),
        ):
            if payload.get("generated_output", {}).get(key):
                downloads.append(
                    {
                        "kind": "output",
                        "scope_kind": "standalone_output",
                        "id": f"{payload['session_id']}:{key}",
                        "title": title,
                        "updated_at": payload.get("updated_at") or payload.get("created_at"),
                        "route": f"/app/contract-intelligence/?session={payload['session_id']}",
                        "download_url": payload["generated_output"][key],
                        "context": payload.get("title"),
                        "owner_kind": "session",
                        "owner_id": payload["session_id"],
                        "owner_label": payload.get("title"),
                        "service_slug": payload.get("service_slug", "contract_risk"),
                        "service_label": "Contract Risk Scanner",
                    }
                )
    for session in list_immigration_sessions(limit=limit * 2):
        payload = immigration_session_payload(session)
        generated = payload.get("generated_output") or {}
        if generated.get("download_url"):
            downloads.append(
                {
                    "kind": "output",
                    "scope_kind": "standalone_output",
                    "id": f"{payload['session_id']}:draft_pdf",
                    "title": generated.get("file_name") or "Filled immigration draft",
                    "updated_at": payload.get("updated_at") or payload.get("created_at"),
                    "route": f"/app/immigration-forms/?session={payload['session_id']}",
                    "download_url": generated["download_url"],
                    "context": payload.get("title"),
                    "owner_kind": "session",
                    "owner_id": payload["session_id"],
                    "owner_label": payload.get("title"),
                    "service_slug": payload.get("service_slug", "immigration_forms"),
                    "service_label": "Immigration Forms Studio",
                }
            )
    for session in list_dealer_sessions(limit=limit * 2):
        payload = dealer_session_payload(session)
        if payload.get("report_pdf_url"):
            downloads.append(
                {
                    "kind": "output",
                    "scope_kind": "standalone_output",
                    "id": f"{payload['id']}:report_pdf",
                    "title": Path(payload["report_pdf_url"]).name,
                    "updated_at": payload.get("created_at"),
                    "route": f"/app/dealer-contract-check/?session={payload['id']}",
                    "download_url": payload["report_pdf_url"],
                    "context": payload.get("title"),
                    "owner_kind": "session",
                    "owner_id": payload["id"],
                    "owner_label": payload.get("title"),
                    "service_slug": payload.get("service_slug", "auto_deal_integrity"),
                    "service_label": "Auto Deal Integrity",
                }
            )

    if service_slug:
        downloads = [item for item in downloads if item.get("service_slug") == service_slug]
    if owner_id:
        downloads = [item for item in downloads if item.get("owner_id") == owner_id]

    downloads.sort(key=lambda item: item.get("updated_at") or "", reverse=True)
    return downloads[:limit]


def urgent_deadlines(limit: int = 6) -> list[dict[str, Any]]:
    results: list[dict[str, Any]] = []
    for case in recent_cases(limit=limit * 2):
        deadline = case.get("primary_deadline")
        if not deadline:
            continue
        results.append(
            {
                "case_id": case["id"],
                "case_title": case["title"],
                "route": case["route"],
                "label": deadline.get("label") or "Detected deadline",
                "date": deadline.get("date"),
                "urgency": deadline.get("urgency") or case.get("urgency_level") or "medium",
            }
        )
    return results[:limit]


def recommended_actions() -> list[dict[str, Any]]:
    cases = recent_cases(limit=5)
    sessions = recent_standalone_sessions(limit=5)
    actions: list[dict[str, Any]] = []
    urgent = urgent_deadlines(limit=2)
    if urgent:
        for item in urgent:
            actions.append(
                {
                    "label": f"{item['case_title']} deadline",
                    "description": f"{item['label']} • {item.get('date') or 'Review now'}",
                    "route": item["route"],
                }
            )
    if not cases:
        actions.append(
            {
                "label": "Start Recovery Diagnostic",
                "description": "Upload the source record first, review blockers and readiness, and promote the matter only after admin review.",
                "route": "/app/case-intake/?workflow=recovery_diagnostic",
            }
        )
    else:
        for case in cases:
            if case.get("blocker_count"):
                actions.append(
                    {
                        "label": f"Resolve blockers in {case['title']}",
                        "description": case.get("next_action") or "Review the blockers before generation.",
                        "route": case["route"],
                    }
                )
                break
    if not actions:
        actions.append(
            {
                "label": "Open Action Center",
                "description": "Continue the active matter from its next-step screen.",
                "route": cases[0]["route"] if cases else "/app/home/",
            }
        )
    return actions[:4]


def workspace_commercial_payload() -> dict[str, Any]:
    context = auth_service.get_request_context()
    if not context:
        return {}
    return safe_commercial_payload(context.workspace, context.membership)


def home_dashboard_payload() -> dict[str, Any]:
    context = auth_service.get_request_context()
    services_payload = build_platform_services(None)
    template_manifest = manifest_payload()
    cases = recent_cases(limit=6)
    sessions = recent_standalone_sessions(limit=6)
    downloads = recent_downloads(limit=6)
    continue_item = cases[0] if cases else None
    return {
        "account": {
            "user_email": context.user.email if context else "",
            "workspace_name": context.workspace.name if context else "",
        },
        "continue_item": continue_item,
        "recent_cases": cases,
        "recent_sessions": sessions,
        "quick_start_services": services_payload["services"][:8],
        "popular_workflows": services_payload["services"][:6],
        "recommended_actions": recommended_actions(),
        "recent_downloads": downloads,
        "urgent_deadlines": urgent_deadlines(limit=4),
        "commercial": workspace_commercial_payload(),
        "system_summary": {
            "case_count": len(cases),
            "session_count": len(sessions),
            "download_count": len(downloads),
            "template_count": len(template_manifest.get("templates") or []),
            "template_manifest_loaded": bool(template_manifest.get("templates")),
        },
    }


def history_payload(*, service_slug: str | None = None, owner_id: str | None = None) -> dict[str, Any]:
    cases = recent_cases(limit=40)
    sessions = recent_standalone_sessions(limit=40)
    outputs = recent_downloads(limit=80, service_slug=service_slug, owner_id=owner_id)

    services: list[dict[str, str]] = []
    seen_services: set[str] = set()
    for item in [*cases, *sessions, *outputs]:
        slug = str(item.get("service_slug") or "").strip()
        if not slug or slug in seen_services:
            continue
        seen_services.add(slug)
        services.append({"slug": slug, "label": slug.replace("_", " ").title()})

    owners: list[dict[str, str]] = []
    seen_owners: set[tuple[str, str]] = set()
    for item in [*cases, *sessions, *outputs]:
        key = (str(item.get("owner_kind") or item.get("kind") or ""), str(item.get("owner_id") or item.get("id") or ""))
        if not key[1] or key in seen_owners:
            continue
        seen_owners.add(key)
        owners.append(
            {
                "kind": key[0],
                "id": key[1],
                "label": str(item.get("owner_label") or item.get("title") or key[1]),
            }
        )

    return {
        "cases": cases,
        "sessions": sessions,
        "outputs": outputs,
        "recent_downloads": outputs[:12],
        "filters": {
            "services": services,
            "owners": owners,
        },
    }
