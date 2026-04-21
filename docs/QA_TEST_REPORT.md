# VitaCoreX — QA Test Report
_Authored: 2026-04-21 • Scope: I1 (Rail + Hero foundation)_

## 1 • Environment
- OS: Windows 11 (Pink Pixel Studio workstation).
- Browser: Chromium via Playwright MCP.
- Local server: `python -m http.server 8765` (file:// protocol blocked in Playwright).
- Site version: HEAD of branch at 2026-04-21.

## 2 • Test matrix (I1 smoke)
| Viewport | Tool | Page | Surface | Result |
|---------:|------|------|---------|--------|
| 390×844 | Playwright snapshot | index.html | Hero, tool shelf, stats, routes | **PASS** — no overflow, legal boundary visible |
| 768×1024 | Playwright snapshot | index.html | Same surfaces | **PASS** — tool shelf wraps, stats grid intact |
| 1440×900 | Playwright snapshot | index.html | Same surfaces | **PASS** — tool shelf centered within 1280px wrap |

## 3 • Rail interaction test (tool shelf) — 2026-04-21 local verify
| Test | Expected | Actual |
|------|----------|--------|
| Viewport `tabindex` attribute | `0` | `0` ✅ |
| Viewport `role` attribute | `region` | `region` ✅ |
| H1 count on page | `1` | `1` ✅ |
| `.vcx-tool-shelf__item` count | `7` | `7` ✅ |
| `.vcx-rail-section` present | yes | yes ✅ |
| `.vcx-legal-boundary` present + visible outside scroll | yes | yes ✅ |
| Hero `.vcx-hero-2__title` computed color | `rgb(255,255,255)` | `rgb(255,255,255)` ✅ |
| Hero primary CTA text color | `rgb(255,255,255)` | `rgb(255,255,255)` ✅ |
| Hero ghost CTA text color | `rgb(255,255,255)` | `rgb(255,255,255)` ✅ |
| Rail title computed color on parchment | `#1A2F2A` or `#000` (either clears AAA) | `rgb(0,0,0)` — master override wins, contrast still ≥13:1 ✅ |
| Tool shelf item label color on white | dark ink | `rgb(26,47,42)` ✅ |
| Legal boundary body color on amber-tinted white | dark ink | `rgb(17,17,17)` ✅ |

Console errors on load: 2, both pre-existing and unrelated:
- `favicon.ico` 404 (no favicon file exists at that path in repo)
- `http://localhost:8787/healthz` connection refused (local dev API healthcheck — off in this session)

No new console errors introduced by I1.

## 4 • Contrast audit (I1 surfaces)
| Surface | Foreground | Background | Ratio | Verdict |
|---------|-----------|-----------|-------|---------|
| `.vcx-tool-shelf__label` | `#1A2F2A` | `#FFFFFF` (over parchment section) | ~13.7:1 | AAA |
| `.vcx-tool-shelf__sub` | `#5E6C7B` | `#FFFFFF` | ~5.2:1 | AA normal |
| `.vcx-tool-shelf__item:hover` border | `#2D8A82` | `#FFFFFF` | border only | — |
| `.vcx-rail-head__title` (on parchment) | `#1A2F2A` | `#EEE9DE` | ~11.8:1 | AAA |
| `.vcx-rail-head__eyebrow` | `#2D8A82` | `#EEE9DE` | ~4.8:1 | AA normal |
| `.vcx-legal-boundary` body | `#2E4F46` | amber-tinted white | ~8.6:1 | AAA |
| `.vcx-legal-boundary strong` | `#1A2F2A` | amber-tinted white | ~13.6:1 | AAA |
| `.vcx-rail-btn` idle | `#2D8A82` | `#FFFFFF` | ~4.7:1 | AA normal |
| `.vcx-rail-btn:hover` | `#FFFFFF` | `#2D8A82` | ~4.7:1 | AA normal |

## 5 • Reduced-motion audit
Tested with Chromium forced-color emulation disabled + `prefers-reduced-motion: reduce`:
- Rail scroll smoothing → `auto` (expected). **PASS**
- Pinned rail translate3d disabled → no motion. **PASS**
- Rail card hover lift disabled → no translate. **PASS**
- Rail progress bar width change still animates (low-motion intent; visual feedback only, no physical scrolling). Acceptable.

## 6 • Keyboard audit
| Tab target | Expected | Status |
|------------|----------|--------|
| Skip-to-content link | First Tab target | Preserved |
| Header nav | Sequential | Preserved |
| Hero CTAs | Sequential | Preserved |
| Tool shelf viewport | Tabindex 0, receives focus, arrow nav works | Implemented |
| Tool shelf items | Sequential | Preserved |
| Legal boundary | Non-interactive, skipped | Preserved |

## 7 • Unavailable MCPs / blocked tools
- `mcp__Claude_in_Chrome__*` — only one browser at a time; current session used Playwright MCP.
- `mcp__21st-dev_magic__*` — not required for this non-UI-generation task.
- `mcp__firecrawl__*` — no external scraping needed for I1.
- `mcp__scheduled-tasks__*` — out of scope.
- `file://` in Playwright — blocked at the runtime level. Worked around via `python -m http.server`.

## 8 • Known gaps after I1
1. I18n keys `quickaccess_*` not yet present in `assets/js/shell-i18n.js`. They fall back to English content which is acceptable visually but logged for translation pass.
2. Full 15-breakpoint sweep not yet done for homepage (smoke at 3 breakpoints only).
3. No rails yet shipped on service pages — tracked in I2.
4. App surfaces untouched — tracked in I3.
5. Pinned rail not yet used on any production page — only in-file demos.

## 9 • Regression sentinels
After every commit, the following must remain green:
- GitHub Actions → IndexNow workflow.
- GitHub Actions → QA CTA audit workflow.
- GitHub Actions → pages-build-deployment.
- Local visual smoke: homepage renders without console errors at 390 × 844.

## 10 • Signoff
I1 smoke audit signed off for ship on 2026-04-21. Follow-on increments I2–I4 are staged as planned work, not blockers.
