from __future__ import annotations

import importlib.util
from pathlib import Path
from tempfile import TemporaryDirectory


def _text_metrics(text: str) -> dict[str, object]:
    normalized = str(text or "").strip()
    alnum = sum(1 for char in normalized if char.isalnum())
    return {
        "text_characters": len(normalized),
        "alnum_characters": alnum,
        "near_empty_text": len(normalized) < 40 or alnum < 20,
    }


def _ocr_text_from_pdf(path: Path) -> tuple[str, list[str]]:
    warnings: list[str] = []
    if not importlib.util.find_spec("pdf2image") or not importlib.util.find_spec("pytesseract"):
        warnings.append("OCR fallback unavailable in this environment; install pdf2image and pytesseract to enable it.")
        return "", warnings

    try:
        from pdf2image import convert_from_path  # type: ignore
        import pytesseract  # type: ignore
    except Exception as exc:  # pragma: no cover - import guard
        warnings.append(f"OCR fallback unavailable: {exc}")
        return "", warnings

    text_parts: list[str] = []
    try:
        with TemporaryDirectory(prefix="docketmint_ocr_") as temp_dir:
            images = convert_from_path(str(path), dpi=200, output_folder=temp_dir)
            for image in images:
                page_text = pytesseract.image_to_string(image) or ""
                if page_text.strip():
                    text_parts.append(page_text)
    except Exception as exc:
        warnings.append(f"OCR fallback failed: {exc}")
        return "", warnings

    return "\n\n".join(text_parts).strip(), warnings


def extract_pdf_text(path: str | Path) -> dict[str, object]:
    path = Path(path)
    warnings: list[str] = []
    text_parts: list[str] = []
    page_count = 0

    try:
        from pypdf import PdfReader  # type: ignore

        reader = PdfReader(str(path))
        page_count = len(reader.pages)
        for page in reader.pages:
            page_text = page.extract_text() or ""
            if page_text.strip():
                text_parts.append(page_text)
    except Exception as exc:
        warnings.append(f"PDF text extraction fallback used: {exc}")

    direct_text = "\n\n".join(text_parts).strip()
    method = "direct_text"
    quality_report = _text_metrics(direct_text)
    quality_report["page_count"] = page_count
    quality_report["ocr_attempted"] = False
    quality_report["ocr_used"] = False

    final_text = direct_text
    if quality_report["near_empty_text"]:
        quality_report["ocr_attempted"] = True
        ocr_text, ocr_warnings = _ocr_text_from_pdf(path)
        warnings.extend(ocr_warnings)
        if len(ocr_text or "") > len(final_text or ""):
            final_text = ocr_text
            method = "ocr_fallback"
            quality_report["ocr_used"] = bool(ocr_text.strip())

    final_metrics = _text_metrics(final_text)
    quality_report.update(final_metrics)

    return {
        "text": final_text,
        "warnings": warnings,
        "method": method,
        "quality_report": quality_report,
    }
