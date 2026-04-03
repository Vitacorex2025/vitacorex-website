"""Recovery Pilot Studio -- multi-step wizard with deterministic models.

Phase 3: Wired to DB + recovery_engine service.
Phase 4A: Added rate limiting.
All calculations are deterministic. No LLM calls.
"""

import json
import uuid

from fastapi import APIRouter, HTTPException, Request

from ..db import get_conn
from ..models.recovery import (
    PilotCreateRequest,
    PilotCreateResponse,
    PilotDetailResponse,
    PilotUpdateRequest,
)
from ..rate_limit import limiter
from ..services.recovery_engine import (
    assemble_brief_data,
    compute_baseline,
    compute_projections,
    generate_pilot_outline,
)

router = APIRouter(prefix="/api/recovery")


@router.post("/pilot", status_code=201, response_model=PilotCreateResponse)
@limiter.limit("10/minute")
def create_pilot(request: Request, req: PilotCreateRequest):
    """Create a new recovery pilot assessment."""
    pilot_id = str(uuid.uuid4())

    with get_conn() as conn:
        conn.execute(
            """INSERT INTO recovery_pilots
               (id, status, wizard_step, baseline_data, created_at, updated_at)
               VALUES (?, 'draft', 1, ?, datetime('now'), datetime('now'))""",
            (pilot_id, json.dumps({
                "company_name": req.company_name,
                "industry": req.industry,
                "employee_count": req.employee_count,
                "annual_revenue": req.annual_revenue,
            })),
        )

    return PilotCreateResponse(
        ok=True, pilot_id=pilot_id, status="draft", wizard_step=1,
    )


@router.patch("/pilot/{pilot_id}", response_model=PilotCreateResponse)
@limiter.limit("20/minute")
def update_pilot(request: Request, pilot_id: str, req: PilotUpdateRequest):
    """Update pilot data for the current wizard step."""
    with get_conn() as conn:
        row = conn.execute(
            "SELECT * FROM recovery_pilots WHERE id = ?", (pilot_id,)
        ).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Pilot not found.")

        current_data = json.loads(row["baseline_data"] or "{}")
        if req.baseline_data:
            current_data.update(req.baseline_data)

        new_step = req.wizard_step or row["wizard_step"]
        new_status = row["status"]

        # Compute analysis when advancing to step 4 or beyond
        analysis_data = row["analysis_data"]
        pilot_outline = row["pilot_outline"]
        if new_step >= 4 and current_data:
            baseline = compute_baseline(current_data)
            projections = compute_projections(baseline)
            outline = generate_pilot_outline(baseline, projections)
            analysis_data = json.dumps({
                "baseline": baseline,
                "projections": projections,
            })
            pilot_outline = json.dumps(outline)
            new_status = "analysis"

        if new_step >= 5:
            new_status = "brief_ready"

        conn.execute(
            """UPDATE recovery_pilots
               SET wizard_step = ?, baseline_data = ?, analysis_data = ?,
                   pilot_outline = ?, status = ?, updated_at = datetime('now')
               WHERE id = ?""",
            (new_step, json.dumps(current_data), analysis_data,
             pilot_outline, new_status, pilot_id),
        )

    return PilotCreateResponse(
        ok=True, pilot_id=pilot_id, status=new_status, wizard_step=new_step,
    )


@router.get("/pilot/{pilot_id}", response_model=PilotDetailResponse)
def get_pilot(pilot_id: str):
    """Get full pilot state, baseline, projections, and outline."""
    with get_conn() as conn:
        row = conn.execute(
            "SELECT * FROM recovery_pilots WHERE id = ?", (pilot_id,)
        ).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Pilot not found.")

    baseline_data = json.loads(row["baseline_data"] or "{}")
    analysis_data = json.loads(row["analysis_data"] or "null")
    pilot_outline_raw = row["pilot_outline"]

    return PilotDetailResponse(
        pilot_id=row["id"],
        status=row["status"],
        wizard_step=row["wizard_step"],
        baseline_data=baseline_data,
        analysis_data=analysis_data,
        brief_path=row["brief_path"],
    )


@router.post("/pilot/{pilot_id}/brief")
@limiter.limit("10/minute")
def generate_brief(request: Request, pilot_id: str):
    """Generate executive brief data for the pilot."""
    with get_conn() as conn:
        row = conn.execute(
            "SELECT * FROM recovery_pilots WHERE id = ?", (pilot_id,)
        ).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Pilot not found.")

    baseline_raw = json.loads(row["baseline_data"] or "{}")
    baseline = compute_baseline(baseline_raw)
    projections = compute_projections(baseline)
    outline = generate_pilot_outline(baseline, projections)

    company_info = {
        "name": baseline_raw.get("company_name", ""),
        "industry": baseline_raw.get("industry", ""),
        "employees": baseline_raw.get("employee_count", ""),
        "revenue": baseline_raw.get("annual_revenue", ""),
    }

    brief = assemble_brief_data(baseline, projections, outline, company_info)

    # Update status
    with get_conn() as conn:
        conn.execute(
            """UPDATE recovery_pilots
               SET status = 'brief_ready', analysis_data = ?,
                   pilot_outline = ?, updated_at = datetime('now')
               WHERE id = ?""",
            (json.dumps({"baseline": baseline, "projections": projections}),
             json.dumps(outline), pilot_id),
        )

    return {"ok": True, "pilot_id": pilot_id, "brief": brief}
