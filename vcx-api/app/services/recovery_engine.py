"""Recovery Pilot Studio — deterministic financial models.

All calculations are rule-based and deterministic.
No LLM calls. No predictions. Projections are estimates only
and must be presented with appropriate disclaimers.
"""

import json
from typing import Optional


# ── Revenue baseline computation ─────────────────────────────────────

def compute_baseline(data: dict) -> dict:
    """Compute KPI baseline from wizard input data.

    Expected keys in data:
      annual_revenue (float)        — total annual revenue
      ar_outstanding (float)        — current AR outstanding
      ar_over_90 (float)            — AR over 90 days
      avg_days_to_collect (int)     — current DSO
      current_recovery_rate (float) — % of overdue AR eventually recovered (0-100)
      collection_cost_pct (float)   — current cost of collection as % of recovered (0-100)
      monthly_new_ar (float)        — new AR generated per month
    """
    annual_revenue = _float(data.get("annual_revenue"), 0)
    ar_outstanding = _float(data.get("ar_outstanding"), 0)
    ar_over_90 = _float(data.get("ar_over_90"), 0)
    avg_dso = _float(data.get("avg_days_to_collect"), 45)
    recovery_rate = _float(data.get("current_recovery_rate"), 50) / 100
    collection_cost = _float(data.get("collection_cost_pct"), 25) / 100
    monthly_new_ar = _float(data.get("monthly_new_ar"), 0)

    # Derived KPIs
    ar_ratio = (ar_outstanding / annual_revenue * 100) if annual_revenue > 0 else 0
    aging_severity = (ar_over_90 / ar_outstanding * 100) if ar_outstanding > 0 else 0
    net_recovery = recovery_rate * (1 - collection_cost)
    annual_leakage = ar_over_90 * (1 - recovery_rate) if ar_over_90 > 0 else 0
    monthly_leakage = annual_leakage / 12

    return {
        "annual_revenue": annual_revenue,
        "ar_outstanding": ar_outstanding,
        "ar_over_90": ar_over_90,
        "ar_ratio_pct": round(ar_ratio, 1),
        "aging_severity_pct": round(aging_severity, 1),
        "avg_dso": round(avg_dso),
        "current_recovery_rate_pct": round(recovery_rate * 100, 1),
        "collection_cost_pct": round(collection_cost * 100, 1),
        "net_recovery_pct": round(net_recovery * 100, 1),
        "annual_leakage_estimate": round(annual_leakage, 2),
        "monthly_leakage_estimate": round(monthly_leakage, 2),
        "monthly_new_ar": monthly_new_ar,
    }


# ── Recovery projections ─────────────────────────────────────────────

def compute_projections(baseline: dict) -> dict:
    """Project recovery improvement scenarios.

    Three scenarios:
      conservative — 10% improvement in recovery rate, 5-day DSO reduction
      moderate     — 20% improvement in recovery rate, 15-day DSO reduction
      aggressive   — 35% improvement in recovery rate, 25-day DSO reduction

    All projections are estimates and not guarantees.
    """
    ar_over_90 = baseline.get("ar_over_90", 0)
    current_rate = baseline.get("current_recovery_rate_pct", 50) / 100
    current_cost = baseline.get("collection_cost_pct", 25) / 100
    avg_dso = baseline.get("avg_dso", 45)
    annual_revenue = baseline.get("annual_revenue", 0)

    scenarios = {}
    for label, rate_bump, dso_cut, cost_cut in [
        ("conservative", 0.10, 5, 0.03),
        ("moderate", 0.20, 15, 0.07),
        ("aggressive", 0.35, 25, 0.12),
    ]:
        new_rate = min(current_rate + rate_bump, 0.98)
        new_cost = max(current_cost - cost_cut, 0.05)
        new_dso = max(avg_dso - dso_cut, 10)

        incremental_recovery = ar_over_90 * (new_rate - current_rate)
        annual_incremental = incremental_recovery  # one-time backlog
        net_annual = incremental_recovery * (1 - new_cost)
        dso_cash_freed = (dso_cut / 365) * annual_revenue if annual_revenue > 0 else 0

        scenarios[label] = {
            "new_recovery_rate_pct": round(new_rate * 100, 1),
            "new_dso": round(new_dso),
            "new_cost_pct": round(new_cost * 100, 1),
            "incremental_recovery": round(incremental_recovery, 2),
            "net_annual_benefit": round(net_annual, 2),
            "dso_cash_freed": round(dso_cash_freed, 2),
            "total_first_year_impact": round(net_annual + dso_cash_freed, 2),
        }

    return scenarios


# ── Pilot outline generation ─────────────────────────────────────────

def generate_pilot_outline(baseline: dict, projections: dict) -> dict:
    """Generate a structured pilot engagement outline."""
    severity = baseline.get("aging_severity_pct", 0)

    if severity > 50:
        priority = "immediate"
        phase1_focus = "Triage overdue accounts (90+ days), establish escalation protocol"
    elif severity > 25:
        priority = "high"
        phase1_focus = "Review aging buckets, identify quick recoveries, standardize follow-up"
    else:
        priority = "standard"
        phase1_focus = "Optimize collection cadence, reduce DSO through process improvements"

    moderate = projections.get("moderate", {})

    return {
        "priority": priority,
        "recommended_duration_weeks": 12 if severity > 25 else 8,
        "phases": [
            {
                "name": "Assessment & Quick Wins",
                "weeks": "1-3",
                "focus": phase1_focus,
                "deliverables": [
                    "AR portfolio analysis report",
                    "Top 20 actionable accounts list",
                    "Recovery workflow documentation",
                ],
            },
            {
                "name": "Process Implementation",
                "weeks": "4-8",
                "focus": "Deploy structured recovery workflows, begin active follow-up",
                "deliverables": [
                    "Recovery playbook by aging bucket",
                    "Escalation decision tree",
                    "Weekly KPI dashboard",
                ],
            },
            {
                "name": "Optimization & Handoff",
                "weeks": "9-12" if severity > 25 else "7-8",
                "focus": "Refine processes, train team, establish ongoing cadence",
                "deliverables": [
                    "Final KPI comparison report",
                    "Process documentation package",
                    "Executive summary brief",
                ],
            },
        ],
        "target_kpis": {
            "recovery_rate_improvement": f"+{moderate.get('new_recovery_rate_pct', 70) - baseline.get('current_recovery_rate_pct', 50):.0f}pp",
            "dso_reduction": f"-{baseline.get('avg_dso', 45) - moderate.get('new_dso', 30)} days",
            "projected_first_year_benefit": f"${moderate.get('total_first_year_impact', 0):,.0f}",
        },
    }


# ── Executive brief data assembly ────────────────────────────────────

def assemble_brief_data(
    baseline: dict,
    projections: dict,
    outline: dict,
    company_info: dict,
) -> dict:
    """Assemble all data needed for the executive brief template."""
    return {
        "company": company_info,
        "baseline_kpis": baseline,
        "projections": projections,
        "pilot_outline": outline,
        "disclaimer": (
            "This executive brief contains estimates and projections based on "
            "client-provided data. Actual results may vary. These figures do not "
            "constitute financial advice or guaranteed outcomes. VitaCoreX LLC "
            "provides administrative and operational support services only."
        ),
    }


# ── Helpers ──────────────────────────────────────────────────────────

def _float(val, default: float = 0) -> float:
    if val is None:
        return default
    try:
        return float(str(val).replace(",", "").replace("$", "").strip())
    except (ValueError, TypeError):
        return default
