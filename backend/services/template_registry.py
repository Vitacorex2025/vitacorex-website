
from __future__ import annotations

import json
import shutil
from dataclasses import dataclass
from pathlib import Path

from backend.models.case_schema import CaseRecord
from backend.services.file_classifier import infer_template_slot


@dataclass(frozen=True)
class TemplateDefinition:
    order: int
    document_type: str
    display_name: str
    template_filename: str

    @property
    def output_filename(self) -> str:
        return self.template_filename


_TEMPLATE_MANIFEST = [
    TemplateDefinition(1, "demand_letter", "Demand Letter", "01 Demand Letter.docx"),
    TemplateDefinition(2, "complaint", "Complaint", "02 Complaint.docx"),
    TemplateDefinition(3, "civil_cover_sheet", "Civil Cover Sheet", "03 Civil Cover Sheet.docx"),
    TemplateDefinition(4, "request_for_issuance_of_summons", "Request for Issuance of Summons", "04 Request for Issuance of Summons.docx"),
    TemplateDefinition(5, "summons_company", "Summons Company", "05 Summons Company.docx"),
    TemplateDefinition(6, "summons_individual", "Summons Individual", "06 Summons Individual.docx"),
    TemplateDefinition(7, "motion_for_clerks_default", "Motion for Clerks Default", "07 Motion for Clerks Default.docx"),
    TemplateDefinition(8, "proposed_final_judgment", "Proposed Final Judgment", "08 Proposed Final Judgment.docx"),
    TemplateDefinition(9, "debt_calculation_sheet", "Debt Calculation Sheet", "09 Debt Calculation Sheet.docx"),
    TemplateDefinition(10, "affidavit_of_amount_due", "Affidavit of Amount Due", "10 Affidavit of Amount Due.docx"),
    TemplateDefinition(11, "exhibit_index", "Exhibit Index", "11 Exhibit Index.docx"),
]

ALT_FILENAMES = {
    "07 Motion for Clerks Default.docx": [
        "07 Motion for Clerk's Default.docx",
    ],
}


def strict_templates() -> list[TemplateDefinition]:
    return list(_TEMPLATE_MANIFEST)


def template_library_root() -> Path:
    return Path(__file__).resolve().parents[1] / "template_library"


def seeded_library_root() -> Path:
    return template_library_root() / "seeded"


def internal_library_root() -> Path:
    return template_library_root() / "uploaded"


def _candidate_roots() -> list[Path]:
    return [internal_library_root(), seeded_library_root()]


def _find_existing_template(root: Path, filename: str) -> Path | None:
    direct = root / filename
    if direct.exists():
        return direct
    for alternate in ALT_FILENAMES.get(filename, []):
        alt = root / alternate
        if alt.exists():
            return alt
    return None


def _seed_internal_library() -> None:
    uploaded_root = internal_library_root()
    uploaded_root.mkdir(parents=True, exist_ok=True)
    for item in strict_templates():
        target = uploaded_root / item.template_filename
        if target.exists():
            continue
        for source_root in [seeded_library_root(), Path("/mnt/data")]:
            candidate = _find_existing_template(source_root, item.template_filename)
            if candidate and candidate.exists():
                shutil.copy2(candidate, target)
                break


def controlling_library_root() -> Path:
    _seed_internal_library()
    uploaded_root = internal_library_root()
    if all((uploaded_root / item.template_filename).exists() for item in strict_templates()):
        return uploaded_root
    seeded_root = seeded_library_root()
    if all((_find_existing_template(seeded_root, item.template_filename) is not None) for item in strict_templates()):
        return seeded_root
    return uploaded_root


def case_template_map(record: CaseRecord) -> dict[str, Path]:
    results: dict[str, Path] = {}
    for template_file in record.template_files:
        slot = template_file.template_slot or infer_template_slot(template_file.original_filename)
        if slot:
            results[slot] = Path(template_file.storage_path)
    return results


def strict_template_report() -> dict[str, object]:
    return manifest_payload()


def resolve_template_path(record: CaseRecord | None, document_type: str) -> Path | None:
    if record is not None:
        overrides = case_template_map(record)
        override_path = overrides.get(document_type)
        if override_path and override_path.exists():
            return override_path

    for item in strict_templates():
        if item.document_type != document_type:
            continue
        for root in _candidate_roots():
            candidate = _find_existing_template(root, item.template_filename)
            if candidate and candidate.exists():
                return candidate
        return None
    raise KeyError(f"Unknown template slot: {document_type}")


def manifest_payload(record: CaseRecord | None = None) -> dict[str, object]:
    _seed_internal_library()
    overrides = case_template_map(record) if record else {}
    templates = []
    missing = []
    controlling_root = controlling_library_root()
    for item in strict_templates():
        controlling_path = _find_existing_template(controlling_root, item.template_filename) or (controlling_root / item.template_filename)
        override_path = overrides.get(item.document_type)
        active_path = override_path if override_path and override_path.exists() else controlling_path
        available = active_path.exists()
        if not available:
            missing.append(item.template_filename)
        templates.append(
            {
                "order": item.order,
                "document_type": item.document_type,
                "display_name": item.display_name,
                "template_filename": item.template_filename,
                "active_path": str(active_path),
                "system_library_path": str(controlling_path),
                "override_path": str(override_path) if override_path else None,
                "source": "case_admin_override" if override_path and override_path.exists() else "internal_system_library",
                "available": available,
            }
        )
    return {
        "mode": "internal_system_template_library",
        "runtime_user_template_upload_required": False,
        "case_override_mode": "admin_only_optional",
        "fallback_enabled": False,
        "template_count": len(templates),
        "templates": templates,
        "missing_templates": missing,
        "all_templates_available": not missing,
    }


def write_manifest(path: str | Path, record: CaseRecord | None = None) -> Path:
    path = Path(path)
    path.write_text(json.dumps(manifest_payload(record), indent=2), encoding="utf-8")
    return path
