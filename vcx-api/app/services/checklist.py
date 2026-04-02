"""Generate initial checklists based on matter type."""

CHECKLISTS = {
    "Corporate Legal File Control": [
        "Upload current contracts or agreements",
        "Provide entity organizational documents (Articles, Operating Agreement)",
        "List known compliance gaps or audit findings",
        "Confirm jurisdiction and governing law",
        "Identify all parties involved",
    ],
    "Revenue Recovery Workflow Design": [
        "Provide accounts receivable aging report",
        "Upload sample invoices (3-5 representative)",
        "Document current collection workflow and escalation steps",
        "List any existing agency agreements or vendor contracts",
        "Confirm total portfolio value under management",
    ],
    "Revenue Recovery Infrastructure": [
        "Provide accounts receivable aging report",
        "Upload sample invoices (3-5 representative)",
        "Document current collection workflow and escalation steps",
        "Confirm total portfolio value under management",
    ],
    "Structured Case Intake": [
        "Upload supporting documents",
        "Provide timeline of key events",
        "List all parties and their roles",
        "Confirm jurisdiction",
    ],
    "Services for Individuals": [
        "Upload relevant documents (contract, notice, or agreement)",
        "Describe the issue and desired outcome",
        "Provide any deadlines or filing dates",
        "List parties involved",
    ],
    "General Inquiry": [
        "Describe your situation in detail",
        "Upload any relevant documents",
        "Provide your preferred timeline",
    ],
}

DEFAULT_CHECKLIST = [
    "Upload supporting documents",
    "Describe your situation in detail",
    "Confirm jurisdiction and timeline",
]


def generate_initial_checklist(
    service_type: str,
    has_attachment: bool,
    client_type: str,
) -> list[dict]:
    """Return a list of {label, sort_order} items for the given service type."""
    items = CHECKLISTS.get(service_type, DEFAULT_CHECKLIST)
    result = []
    for i, label in enumerate(items):
        result.append({"label": label, "sort_order": i})

    # If they already uploaded a file, mark the first upload-related item
    if has_attachment:
        for item in result:
            if "upload" in item["label"].lower():
                item["pre_complete"] = True
                break

    return result
