from __future__ import annotations

from fastapi import APIRouter, File, HTTPException, UploadFile

from backend.services.contract_intelligence_service import (
    analyze_session,
    create_session,
    delete_session,
    generate_draft,
    list_sessions,
    load_session,
    session_payload,
)

router = APIRouter(tags=["contract-intelligence"])


@router.get("/contract-intelligence/sessions")
def get_contract_intelligence_sessions(limit: int = 20):
    return {"sessions": [session_payload(item) for item in list_sessions(limit=limit)]}


@router.post("/contract-intelligence/sessions")
async def create_contract_intelligence_session(
    contract_files: list[UploadFile] = File(...),
    supporting_files: list[UploadFile] = File(default=[]),
):
    if not contract_files:
        raise HTTPException(status_code=400, detail="Upload at least one contract, guaranty, or supporting contract file.")
    contract_payloads: list[tuple[str, bytes]] = []
    for item in contract_files:
        contract_payloads.append((item.filename or "contract_file", await item.read()))
    support_payloads: list[tuple[str, bytes]] = []
    for item in supporting_files:
        support_payloads.append((item.filename or "supporting_file", await item.read()))
    session = create_session(contract_payloads, support_payloads)
    return session_payload(session)


@router.get("/contract-intelligence/sessions/{session_id}")
def get_contract_intelligence_session(session_id: str):
    try:
        session = load_session(session_id)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return session_payload(session)


@router.post("/contract-intelligence/sessions/{session_id}/analyze")
def analyze_contract_intelligence_session(session_id: str):
    try:
        session = analyze_session(session_id)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return session_payload(session)


@router.post("/contract-intelligence/sessions/{session_id}/generate-draft")
def generate_contract_intelligence_draft(session_id: str):
    try:
        session = generate_draft(session_id)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return session_payload(session)


@router.delete("/contract-intelligence/sessions/{session_id}")
def remove_contract_intelligence_session(session_id: str):
    try:
        delete_session(session_id)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return {"ok": True, "session_id": session_id}
