
from __future__ import annotations

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from pydantic import BaseModel

from backend.services.dealer_contract_check_service import (
    create_session,
    delete_session,
    generate_report_pdf,
    list_sessions,
    load_session,
    rerun_session,
    session_payload,
)

router = APIRouter(tags=["dealer-contract-check"])


class DealerRerunRequest(BaseModel):
    vin: str | None = None
    mileage: int | None = None
    zip_code: str | None = None
    asking_price: float | None = None
    dealer_url: str | None = None
    dealer_price_manual: float | None = None
    state_hint: str | None = None


@router.get("/dealer-contract-check/sessions")
def list_dealer_contract_sessions(limit: int = 20):
    return {"sessions": [session_payload(item) for item in list_sessions(limit=limit)]}


@router.post("/dealer-contract-check/sessions")
async def create_dealer_contract_session(
    contract_files: list[UploadFile] = File(...),
    supporting_files: list[UploadFile] = File(default=[]),
    vin: str = Form(default=""),
    mileage: str = Form(default=""),
    zip_code: str = Form(default=""),
    asking_price: str = Form(default=""),
    dealer_url: str = Form(default=""),
    dealer_price_manual: str = Form(default=""),
    state_hint: str = Form(default=""),
):
    if not contract_files:
        raise HTTPException(status_code=400, detail="Upload at least one dealer contract, worksheet, or buyer order.")
    contract_payloads: list[tuple[str, bytes]] = []
    for item in contract_files:
        contract_payloads.append((item.filename or "contract_file", await item.read()))
    support_payloads: list[tuple[str, bytes]] = []
    for item in supporting_files:
        support_payloads.append((item.filename or "supporting_file", await item.read()))
    manual_price = None
    asking_price_value = None
    mileage_value = None
    if (mileage or "").strip():
        try:
            mileage_value = int(float(mileage.strip()))
        except ValueError as exc:
            raise HTTPException(status_code=400, detail="Mileage must be numeric.") from exc
    if (asking_price or "").strip():
        try:
            asking_price_value = float(asking_price.replace(",", "").replace("$", "").strip())
        except ValueError as exc:
            raise HTTPException(status_code=400, detail="Asking price must be numeric.") from exc
    if (dealer_price_manual or "").strip():
        try:
            manual_price = float(dealer_price_manual.replace(",", "").replace("$", "").strip())
        except ValueError as exc:
            raise HTTPException(status_code=400, detail="Dealer advertised price must be numeric.") from exc
    session = create_session(
        contract_files=contract_payloads,
        supporting_files=support_payloads,
        vin=vin,
        mileage=mileage_value,
        zip_code=zip_code,
        asking_price=asking_price_value,
        dealer_url=dealer_url,
        dealer_price_manual=manual_price,
        state_hint=state_hint,
    )
    return session_payload(session)


@router.get("/dealer-contract-check/sessions/{session_id}")
def get_dealer_contract_session(session_id: str):
    try:
        session = load_session(session_id)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return session_payload(session)


@router.post("/dealer-contract-check/sessions/{session_id}/rerun")
def rerun_dealer_contract_session(session_id: str, payload: DealerRerunRequest):
    try:
        session = rerun_session(
            session_id=session_id,
            vin=payload.vin,
            mileage=payload.mileage,
            zip_code=payload.zip_code,
            asking_price=payload.asking_price,
            dealer_url=payload.dealer_url,
            dealer_price_manual=payload.dealer_price_manual,
            state_hint=payload.state_hint,
        )
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return session_payload(session)


@router.post("/dealer-contract-check/sessions/{session_id}/generate-report")
def generate_dealer_contract_report(session_id: str):
    try:
        session = generate_report_pdf(session_id)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return session_payload(session)


@router.delete("/dealer-contract-check/sessions/{session_id}")
def remove_dealer_contract_session(session_id: str):
    try:
        delete_session(session_id)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return {"ok": True, "session_id": session_id}
