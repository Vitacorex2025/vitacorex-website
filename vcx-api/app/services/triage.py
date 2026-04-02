"""Triage scoring and matter ID generation."""

from datetime import datetime


URGENCY_BASE = {
    "Same day / urgent": 90,
    "24 hours": 80,
    "48 hours": 70,
    "Standard": 50,
}

HIGH_VALUE_SERVICES = {
    "Revenue Recovery Workflow Design",
    "Corporate Legal File Control",
    "Revenue Recovery Infrastructure",
}


def compute_triage_score(
    urgency: str,
    service_type: str,
    has_attachment: bool,
    client_type: str,
) -> int:
    """Deterministic urgency scoring (0-100)."""
    score = URGENCY_BASE.get(urgency, 50)
    if has_attachment:
        score += 5
    if client_type == "company":
        score += 5
    if service_type in HIGH_VALUE_SERVICES:
        score += 3
    return min(score, 100)


def generate_matter_id(conn) -> str:
    """Generate a sequential matter ID: VCX-YYYYMMDD-NNNN."""
    today = datetime.now().strftime("%Y%m%d")
    prefix = f"VCX-{today}-"
    row = conn.execute(
        "SELECT COUNT(*) as cnt FROM matters WHERE id LIKE ?",
        (prefix + "%",),
    ).fetchone()
    seq = (row["cnt"] if row else 0) + 1
    return f"{prefix}{seq:04d}"


def determine_routing(service_type: str) -> str:
    """Map service_type to an internal routing category."""
    mapping = {
        "Revenue Recovery Workflow Design": "recovery",
        "Corporate Legal File Control": "legal_file",
        "Structured Case Intake": "intake",
        "Revenue Recovery Infrastructure": "recovery",
        "Services for Individuals": "individual",
        "General Inquiry": "general",
    }
    return mapping.get(service_type, "general")
