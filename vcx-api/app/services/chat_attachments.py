"""Chat attachment classification, listing, and context building.

Phase 7B: Provides attachment metadata services for the floating chat widget.
Classifies uploads as "document" or "image", lists session attachments, and
builds a summary string for the convert-to-intake flow.

No vision/image analysis is performed — image classification is based solely
on file extension and MIME type.
"""

import os
import re
from pathlib import PurePath

# ── Configuration ─────────────────────────────────────────────────────

_CHAT_UPLOADS_DIR = os.path.join(
    os.getenv("VCX_UPLOADS_DIR", "uploads"), "chat"
)

IMAGE_EXTENSIONS = frozenset({".jpg", ".jpeg", ".png", ".gif"})
DOCUMENT_EXTENSIONS = frozenset({
    ".pdf", ".doc", ".docx", ".txt", ".md",
    ".csv", ".xlsx", ".xls",
})

# Map extensions to human-readable type labels
_TYPE_LABELS: dict[str, str] = {
    ".pdf": "PDF document",
    ".doc": "Word document",
    ".docx": "Word document",
    ".txt": "Text file",
    ".md": "Markdown file",
    ".csv": "CSV spreadsheet",
    ".xlsx": "Excel spreadsheet",
    ".xls": "Excel spreadsheet",
    ".jpg": "JPEG image",
    ".jpeg": "JPEG image",
    ".png": "PNG image",
    ".gif": "GIF image",
}


# ── Public API ────────────────────────────────────────────────────────

def classify_attachment(
    filename: str,
    content_type: str | None = None,
) -> str:
    """Classify a file as 'document' or 'image' by extension/MIME.

    Returns:
        'image' if the file is a recognised image format,
        'document' for everything else in the allowlist.
    """
    ext = PurePath(filename).suffix.lower()

    # Extension-based classification (preferred)
    if ext in IMAGE_EXTENSIONS:
        return "image"
    if ext in DOCUMENT_EXTENSIONS:
        return "document"

    # MIME-based fallback
    if content_type:
        if content_type.startswith("image/"):
            return "image"

    return "document"


def type_label(filename: str) -> str:
    """Return a human-readable type label for a filename."""
    ext = PurePath(filename).suffix.lower()
    return _TYPE_LABELS.get(ext, "File")


def list_session_attachments(session_id: str) -> list[dict]:
    """List all attachments for a chat session.

    Returns a list of dicts with: file_id, filename, category, size, type_label.
    Files are read from the uploads/chat/{session_id}/ directory.
    """
    session_dir = os.path.join(_CHAT_UPLOADS_DIR, session_id)
    if not os.path.isdir(session_dir):
        return []

    attachments = []
    for entry in sorted(os.listdir(session_dir)):
        path = os.path.join(session_dir, entry)
        if not os.path.isfile(path):
            continue

        # Filename format: {uuid}_{sanitized_filename}
        # Split on first underscore to extract file_id
        parts = entry.split("_", 1)
        file_id = parts[0] if len(parts) > 1 else ""
        original_name = parts[1] if len(parts) > 1 else entry

        category = classify_attachment(original_name)
        size = os.path.getsize(path)

        attachments.append({
            "file_id": file_id,
            "filename": original_name,
            "category": category,
            "size": size,
            "type_label": type_label(original_name),
        })

    return attachments


def build_attachment_summary(session_id: str) -> str:
    """Build a brief summary of session attachments for intake handoff.

    Returns a string like:
      "2 files attached: contract.pdf (PDF document), photo.jpg (JPEG image)"
    Or empty string if no attachments.
    """
    attachments = list_session_attachments(session_id)
    if not attachments:
        return ""

    count = len(attachments)
    parts = []
    for att in attachments[:6]:  # Cap at 6 to keep URL length sane
        parts.append(f"{att['filename']} ({att['type_label']})")

    summary = f"{count} file{'s' if count != 1 else ''} attached: "
    summary += ", ".join(parts)
    if count > 6:
        summary += f", and {count - 6} more"

    return summary


def attachment_acknowledgment(
    filename: str,
    category: str,
    type_label_str: str,
) -> str:
    """Generate an appropriate acknowledgment message for an uploaded file.

    Phase 7B: Provides honest, controlled responses:
    - Documents: acknowledge receipt, note it will be included in intake
    - Images: acknowledge receipt, explain no automated analysis is available,
      ask the user to describe what the image shows

    No fake analysis or hallucinated image descriptions.
    """
    if category == "image":
        return (
            f"Image received: {filename} ({type_label_str}).\n\n"
            "I cannot analyze images directly. "
            "If this image is relevant to your matter, please describe "
            "what it shows and I can help guide you.\n\n"
            "The image will be included if you convert to a structured intake."
        )
    else:
        return (
            f"Document received: {filename} ({type_label_str}).\n\n"
            "I cannot read document contents directly in chat. "
            "For full document review, consider our Contract Review service.\n\n"
            "This file will be included if you convert to a structured intake."
        )
