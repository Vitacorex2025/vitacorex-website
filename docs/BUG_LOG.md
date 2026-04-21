# VitaCoreX — Bug Log
_Authored: 2026-04-21 • Living document • Append-only entries_

Entry template:
```
## BL-NNN  <short title>
Discovered: YYYY-MM-DD
Severity: blocker | major | minor
Status: open | fixed | wontfix | observed
Fix commit: <sha or —>

Repro:
Impact:
Fix:
Regression sentinel:
```

---

## BL-001  Dark text on dark teal gradient in final-CTA sections
Discovered: 2026-04-19
Severity: major
Status: fixed
Fix commit: 8fee5cc

Repro: Service + case-study pages rendered `.fsch-final-cta h2`, `.rrf-upl h2`, `.adr-upl h2`, etc. with black text over a dark teal gradient. Inline `color: #fff` lost the cascade fight to `h1-h6 { color: #000 !important }` declared in `vcx-redesign.css` section 21.
Impact: Key CTA banners unreadable on 8+ service/case-study pages.
Fix: Added section B14 (`vcx-redesign.css` lines 2436–2479) defeating the master override for `[class*="-final-cta"]`, `.adr-upl`, `.crs-upl`, `.fsch-upl`, `.ipr-upl`, `.pet-upl`, `.rrf-upl`, `.scd-upl`, `.cmp-table .cmp-dim`, `.vcx-exit-head` with `color: #FFF !important; -webkit-text-fill-color: #FFF !important`. Bumped cache-bust to `v=9`.
Regression sentinel: Playwright snapshot at `/florida-small-claims-help.html` at 1440×900 must report h2 computed color `rgb(255,255,255)`.

---

## BL-002  Ghost CTA button text rendered as black-on-dark
Discovered: 2026-04-19
Severity: major
Status: fixed
Fix commit: 8fee5cc (within B14 block)

Repro: Hero ghost CTAs (`.vcx-btn-2--ghost` / `a.btn-secondary`) on dark sections inherited ink from `.btn-secondary { color:#1A2F2A !important }`.
Impact: "View services" and "See pricing" in homepage hero — black letters dissolving into teal.
Fix: Added selector block in B14 forcing `color: #FFF !important; -webkit-text-fill-color: #FFF !important; border: 2px solid #FFF !important` for ghost CTAs inside `[class*="-final-cta"]`.
Regression sentinel: Computed color of ghost CTA in homepage hero must be `rgb(255,255,255)`.

---

## BL-003  Blue/yellow/orange palette drift on secondary pages
Discovered: 2026-04-18
Severity: minor
Status: fixed
Fix commit: pre-I1 commits

Repro: Legacy pages imported `premium-fixes.css` which included navy gradient backgrounds and occasional `#C9A94E` amber accents used as primary decoration.
Impact: Visual drift away from home palette; brand inconsistency.
Fix: Converted navy gradients to teal gradients; amber accent kept only for warning/legal surfaces per `DESIGN_SYSTEM_LAYOUT_RULES.md` §1.

---

## BL-004  UTF-8 double-encoding from PowerShell cache-buster
Discovered: 2026-04-20
Severity: blocker (CI red)
Status: fixed
Fix commit: e980304

Repro: PowerShell script used `[IO.File]::ReadAllText($f.FullName)` without encoding argument. On Windows the default is system ANSI (CP-1252). UTF-8 bytes were misinterpreted, then re-saved as UTF-8 — creating mojibake:
- `☰` → `â˜°`
- `📷` → `ðŸ"·`
- `Español` → `EspaÃ±ol`
- Russian Cyrillic `долг` → `Ð´Ð¾Ð»Ð³`
80 files affected.
Impact: QA CTA audit workflow failed on commit 8fee5cc. Russian/Spanish UI strings visually broken.
Fix: `pip install ftfy` (v6.3.1) + Python script iterating over git changeset running `ftfy.fix_text()` per file. Hex-verified proper UTF-8 restored (`ñ` → `c3 b1`, `☰` → `e2 98 b0`, `📷` → `f0 9f 93 b7`).
Regression sentinel: **NEVER** use `[IO.File]::ReadAllText` or `Get-Content` without `-Encoding UTF8`. Prefer a Python script or the project's Node scripts which are encoding-safe. Documented in `DESIGN_SYSTEM_LAYOUT_RULES.md` §12.

---

## BL-005  Playwright file:// protocol blocked
Discovered: 2026-04-20
Severity: minor (workaround required)
Status: workaround documented
Fix commit: —

Repro: Attempting `playwright.browser_navigate('file:///C:/.../index.html')` returns error "Access to 'file:' protocol is blocked".
Impact: Local visual verification requires HTTP.
Fix: Run `python -m http.server 8765` (background) from the project root, then navigate via `http://localhost:8765/`.
Regression sentinel: CI Pages workflow serves HTTP in production — no fix needed there; this is a local-dev procedure only.

---

## BL-006  Homepage i18n keys missing for new tool-shelf section
Discovered: 2026-04-21
Severity: minor
Status: open
Fix commit: —

Repro: New tool shelf introduces `data-page` keys: `quickaccess_eyebrow`, `quickaccess_title`, `quickaccess_lede`, `quickaccess_item_intake`, `quickaccess_item_recovery`, `quickaccess_item_file`, `quickaccess_item_pricing`, `quickaccess_item_briefs`, `quickaccess_item_private`, `quickaccess_item_contact`, `quickaccess_legal`, `quickaccess_legal_strong`. These are absent from `assets/js/shell-i18n.js` dictionaries.
Impact: On ru/es language toggle, keys fall back to English. Not broken, not hidden — just untranslated.
Fix (planned): Add ru + es entries in shell-i18n.js during I2.
Regression sentinel: —

---

## BL-007  Pinned rail on Safari iOS < 18: sticky + will-change regression
Discovered: 2026-04-21
Severity: observed (not triggered yet — proactive note)
Status: observed
Fix commit: —

Repro: Historically, `position: sticky` combined with `will-change: transform` on a descendant of a composited ancestor has caused the sticky element to drop out of its pinned track on Safari iOS 16 and some iPad builds 17.0–17.3.
Impact: None yet (pinned rail not shipped in production as of I1). Tracked for I2.
Fix (planned): On Safari detect + mobile viewport, disable the translate-on-scroll and rely on dot clicks only. The CSS mobile fallback at `max-width: 899px` already switches to horizontal scroll — so desktop Safari iOS pads > iPad 11" is the only edge. If the regression recurs, add UA sniff to swap to horizontal fallback.
Regression sentinel: First production use of `.vcx-pinned-rail` must include Safari iOS 17.0 test.
