
from __future__ import annotations

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from pydantic import BaseModel

from backend.services.immigration_forms_service import (
    create_session,
    delete_session,
    generate_filled_pdf,
    list_sessions,
    load_session,
    session_payload,
)

router = APIRouter(tags=["immigration-forms"])


class ImmigrationGenerateRequest(BaseModel):
    values: dict[str, str] = {}


@router.get("/immigration/forms/sessions")
def list_immigration_sessions(limit: int = 20):
    return {"sessions": [session_payload(item) for item in list_sessions(limit=limit)]}


@router.post("/immigration/forms/sessions")
async def create_immigration_session(
    form_file: UploadFile = File(...),
    supporting_files: list[UploadFile] = File(default=[]),
):
    if not (form_file.filename or "").lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="The immigration form must be uploaded as a PDF.")
    form_bytes = await form_file.read()
    support_payloads: list[tuple[str, bytes]] = []
    for item in supporting_files:
        support_payloads.append((item.filename or "supporting_file", await item.read()))
    session = create_session(form_file.filename or "immigration_form.pdf", form_bytes, support_payloads)
    return session_payload(session)


@router.get("/immigration/forms/sessions/{session_id}")
def get_immigration_session(session_id: str):
    try:
        session = load_session(session_id)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return session_payload(session)


@router.post("/immigration/forms/sessions/{session_id}/generate")
def generate_immigration_pdf(session_id: str, payload: ImmigrationGenerateRequest):
    try:
        session = generate_filled_pdf(session_id, payload.values)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return session_payload(session)


@router.delete("/immigration/forms/sessions/{session_id}")
def remove_immigration_session(session_id: str):
    try:
        delete_session(session_id)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return {"ok": True, "session_id": session_id}
