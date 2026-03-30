from __future__ import annotations

from fastapi import APIRouter, File, Form, HTTPException, Request, UploadFile

from backend.services import auth_service
from backend.services.recovery_intake_service import (
    add_source_files,
    create_session,
    load_session,
    promote_session,
    session_payload,
)


router = APIRouter(tags=["recovery_intake"])


@router.post("/recovery-intake/sessions")
async def create_recovery_intake_session(
    request: Request,
    entry_workflow: str | None = Form(default=None),
    title: str | None = Form(default=None),
    files: list[UploadFile] | None = File(default=None),
):
    auth_service.require_session(request)
    session = create_session(entry_workflow=entry_workflow, title=title)
    if files:
        session = add_source_files(session.id, files)
    return session_payload(session)


@router.get("/recovery-intake/sessions/{session_id}")
def get_recovery_intake_session(session_id: str, request: Request):
    auth_service.require_session(request)
    try:
        session = load_session(session_id)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return session_payload(session)


@router.post("/recovery-intake/sessions/{session_id}/source-files")
async def upload_recovery_intake_files(session_id: str, request: Request, files: list[UploadFile] = File(...)):
    auth_service.require_session(request)
    try:
        session = add_source_files(session_id, files)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return session_payload(session)


@router.post("/recovery-intake/sessions/{session_id}/promote")
def promote_recovery_intake_session(session_id: str, request: Request):
    auth_service.require_case_creation_access(request)
    try:
        case_record = promote_session(session_id)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return {
        "session_id": session_id,
        "case_id": case_record.id,
        "action_center_route": f"/app/action-center/?case={case_record.id}",
        "workspace_route": f"/app/workspace/?case={case_record.id}",
        "case": case_record.model_dump(mode="json"),
    }
