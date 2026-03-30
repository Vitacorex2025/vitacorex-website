
from __future__ import annotations

from fastapi import APIRouter, HTTPException

from backend.services.case_store import load_case
from backend.services.template_registry import manifest_payload, strict_template_report
from backend.services.validation_service import collect_document_blockers, collect_generation_blockers, expected_document_types

router = APIRouter(tags=["templates"])


def _case_template_registry_payload(record) -> dict[str, object]:
    payload = manifest_payload(record)
    global_blockers = collect_generation_blockers(record, include_verification_gate=False)
    expected = set(expected_document_types(record))
    guarantor_present = bool(
        record.extracted_case_data.personal_guarantor
        and record.extracted_case_data.personal_guarantor.party_name
    )

    allowed_document_types: list[str] = []
    blocked_document_types: list[str] = []
    templates: list[dict[str, object]] = []

    for template in payload.get("templates", []):
        document_type = str(template.get("document_type") or "")
        blocking_reasons: list[str] = []
        generation_status = "ready"
        blocking_scope = None

        if not template.get("available"):
            generation_status = "template_missing"
            blocking_scope = "template"
            blocking_reasons = [f"Missing controlling template: {template.get('template_filename') or document_type}"]
        elif global_blockers:
            generation_status = "blocked"
            blocking_scope = "global"
            blocking_reasons = list(global_blockers)
        elif document_type == "summons_individual" and not guarantor_present:
            generation_status = "not_applicable"
            blocking_scope = "document"
            blocking_reasons = ["No individual guarantor was extracted from the uploaded record."]
        else:
            blocking_reasons = collect_document_blockers(record, document_type)
            if blocking_reasons:
                generation_status = "blocked"
                blocking_scope = "document"

        generation_allowed = bool(template.get("available")) and generation_status == "ready"
        if generation_allowed:
            allowed_document_types.append(document_type)
        elif generation_status in {"blocked", "template_missing"}:
            blocked_document_types.append(document_type)

        enriched = dict(template)
        enriched.update(
            {
                "expected_in_packet": document_type in expected,
                "generation_allowed": generation_allowed,
                "generation_status": generation_status,
                "blocking_scope": blocking_scope,
                "blocking_reasons": blocking_reasons,
            }
        )
        templates.append(enriched)

    payload["templates"] = templates
    payload["global_blockers"] = list(global_blockers)
    payload["expected_document_types"] = sorted(expected)
    payload["allowed_document_types"] = allowed_document_types
    payload["blocked_document_types"] = blocked_document_types
    payload["packet_generation_allowed"] = bool(allowed_document_types and not global_blockers)
    return payload


@router.get("/templates/registry")
def get_template_registry(case_id: str | None = None) -> dict[str, object]:
    if case_id:
        try:
            record = load_case(case_id)
        except FileNotFoundError as exc:
            raise HTTPException(status_code=404, detail=str(exc)) from exc
        return _case_template_registry_payload(record)
    return strict_template_report()
