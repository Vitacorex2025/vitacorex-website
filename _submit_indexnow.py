"""
Submit all public VitaCoreX URLs to IndexNow (Bing, Yandex, Seznam, Naver).

IndexNow is a protocol where you POST a list of URLs and a verification key,
and the search engines notify each other. No login required, only the key file
must be publicly accessible at https://vitacorexllc.com/{KEY}.txt.

Usage (after GitHub Pages has deployed vitacorex2025indexnow.txt):
    python _submit_indexnow.py

Re-run whenever content changes materially.
"""

import json
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib import request

HOST = "vitacorexllc.com"
KEY = "vitacorex2025indexnow"
KEY_LOCATION = f"https://{HOST}/{KEY}.txt"

# IndexNow accepts submissions via any of these endpoints; they sync with each other.
ENDPOINTS = [
    "https://api.indexnow.org/IndexNow",
    "https://www.bing.com/indexnow",
    "https://yandex.com/indexnow",
]


def load_urls_from_sitemap() -> list[str]:
    sitemap = Path("sitemap.xml")
    if not sitemap.exists():
        print("ERROR: sitemap.xml not found in cwd")
        sys.exit(1)
    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    root = ET.fromstring(sitemap.read_text(encoding="utf-8"))
    urls = [loc.text.strip() for loc in root.findall(".//sm:loc", ns) if loc.text]
    # IndexNow spec: all URLs must be from the same host as the key.
    return [u for u in urls if HOST in u]


def verify_key_file() -> bool:
    try:
        with request.urlopen(KEY_LOCATION, timeout=10) as resp:
            body = resp.read().decode("utf-8").strip()
            if body == KEY:
                print(f"OK: key file live at {KEY_LOCATION}")
                return True
            print(f"FAIL: key file content mismatch. Expected '{KEY}', got '{body}'")
            return False
    except Exception as e:
        print(f"FAIL: cannot fetch {KEY_LOCATION}: {e}")
        print("Wait ~2 min after `git push` for GitHub Pages to deploy, then retry.")
        return False


def submit(endpoint: str, urls: list[str]) -> None:
    payload = {
        "host": HOST,
        "key": KEY,
        "keyLocation": KEY_LOCATION,
        "urlList": urls,
    }
    body = json.dumps(payload).encode("utf-8")
    req = request.Request(
        endpoint,
        data=body,
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST",
    )
    try:
        with request.urlopen(req, timeout=15) as resp:
            print(f"  {endpoint} -> HTTP {resp.status}")
    except Exception as e:
        print(f"  {endpoint} -> ERROR: {e}")


def main() -> None:
    urls = load_urls_from_sitemap()
    print(f"Loaded {len(urls)} URLs from sitemap.xml")
    if not urls:
        sys.exit(1)

    if not verify_key_file():
        sys.exit(2)

    print(f"\nSubmitting {len(urls)} URLs to IndexNow endpoints...")
    for ep in ENDPOINTS:
        submit(ep, urls)

    print("\nDone. Bing and Yandex should index within hours.")
    print("Note: Google does NOT participate in IndexNow. Google indexation still")
    print("requires Search Console submission at https://search.google.com/search-console")


if __name__ == "__main__":
    main()
