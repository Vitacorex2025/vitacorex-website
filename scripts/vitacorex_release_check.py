from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PAGES = [
    ROOT / "index.html",
    ROOT / "solutions.html",
    ROOT / "industries.html",
    ROOT / "resources.html",
    ROOT / "contact.html",
    ROOT / "about.html",
    ROOT / "additional-services.html",
    ROOT / "careers.html",
    ROOT / "privacy-policy.html",
    ROOT / "terms-of-use.html",
    ROOT / "cookie-policy.html",
    ROOT / "ru" / "index.html",
    ROOT / "ru" / "contact.html",
    ROOT / "ru" / "resources.html",
    ROOT / "es" / "index.html",
    ROOT / "es" / "contact.html",
    ROOT / "es" / "resources.html",
]
FLAGGED = [
    "The site should clearly separate",
    "Make the site feel like a private finance interface",
    "For search-driven traffic, the goal is clarity",
    "TODO",
    "FormSubmit",
    "DocketMint by VitaCoreX",
]


def main() -> None:
    results: dict[str, object] = {
        "pages_checked": len(PAGES),
        "missing_files": [],
        "missing_meta": [],
        "missing_canonical": [],
        "missing_hreflang": [],
        "flagged_copy_hits": [],
    }

    for path in PAGES:
        if not path.exists():
            results["missing_files"].append(str(path))
            continue
        text = path.read_text(encoding="utf-8")
        if "<meta name=\"description\"" not in text:
            results["missing_meta"].append(str(path))
        if "<link rel=\"canonical\"" not in text:
            results["missing_canonical"].append(str(path))
        if "hreflang=" not in text:
            results["missing_hreflang"].append(str(path))
        for phrase in FLAGGED:
            if phrase in text:
                results["flagged_copy_hits"].append({"file": str(path), "phrase": phrase})

    print(json.dumps(results, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
