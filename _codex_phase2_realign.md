# VCX Phase 2 — Safe Realignment Report

> Generated 2026-04-02 | Branch: `codex/phase2-safe-realign`
> Baseline: v284 clean extraction (commit 25e958c)
> Method: Full-auto migration from vcx-work build workspace with shell template reconciliation

---

## Summary

Phase 2 migrates all Phase 1 product scaffolding into the clean v284 repo, reconciles the shell template, applies the 5 required fixes, adds integration cards, and documents all guardrail deviations.

| Metric | Count |
|--------|-------|
| Files in baseline | ~80 |
| Files after Phase 2 | ~145 |
| Existing files modified | 6 |
| New files added | ~65 |
| Guardrail deviations | 3 (all documented) |
| Validation checks passed | 8/8 |

---

## A) Intake Acquisition Page Patches

### File: structured-case-intake.html

| # | Edit | Location | Boundary markers |
|---|------|----------|-----------------|
| 1 | `<div id="intakeResult">` (hidden) after `</form>` | After line 180 | `<!-- VCX Phase 2: API intake result panel -- START/END -->` |
| 2 | Legal assistant link added to self-service card | Flex container (line 192) | Follows existing sibling `<a>` pattern |
| 3 | `<script src="/assets/js/vcx-intake-api.js">` | After line 270 (after premium-fixes.js) | `<!-- VCX Phase 2: intake API client -->` |

All three edits are additive. No existing HTML was removed. The intakeResult div is `display:none` by default and only shows when the API responds.

---

## B) Canonical Structure

### Backend: vcx-api/
The backend lives at `vcx-api/` as specified by AGENTS.md. No `api/` directory exists. All frontend JS files reference API endpoints via `API_BASE + '/api/...'` where `API_BASE` defaults to empty string (same-origin) or can be configured via `window.VCX_API_BASE`.

**Backend file count: 35 files** including:
- `app/main.py` (FastAPI entrypoint, 8 routers, 24 routes)
- `app/schema.sql` (15 tables)
- `app/db.py` (SQLite WAL + foreign keys)
- `app/routers/` (8 router modules: intakes, uploads, matters, review, chat, contracts, recovery, portal)
- `app/models/` (7 Pydantic model files)
- `app/services/` (3 service modules: triage, checklist, magic_link)
- `app/legal_chat/` (knowledge retrieval + policy engine)
- `knowledge/` (4 topic markdown files)
- `requirements.txt` (unpinned, Python 3.14 compatible)

### Product routes

| Route | Product | Status |
|-------|---------|--------|
| `/app/vcx-intake/` | Intake OS | Landing page (redirects to matter-status with params) |
| `/app/vcx-contract-review/` | Contract Review Desk | Scaffold (upload + analyze UI, stub endpoints) |
| `/app/vcx-recovery-pilot/` | Recovery Pilot Studio | Scaffold (5-step wizard UI, stub endpoints) |
| `/app/vcx-packet-room/` | Packet Room | Scaffold (auth gate + dashboard UI, stub endpoints) |
| `/app/legal-assistant/` | Legal Assistant | Functional (chat + escalation) |
| `/app/matter-status/` | Client Status Dashboard | Functional (magic-link auth, status + checklist) |
| `/app/review/` | Admin Review Queue | Functional (X-Admin-Token auth, triage queue) |

---

## C) Preserved Existing Pages

| Page | Status | Notes |
|------|--------|-------|
| `/app/contract-intelligence/` | Untouched | Existing free contract scanner |
| `/app/dealer-contract-check/` | Untouched | Existing auto deal calculator |
| `/app/immigration-forms/` | Untouched | Existing immigration helper |
| `/app/private-lookup/` | Untouched | Existing FL source locator |
| `/app/sign-in/` | Untouched | Existing redirect stub |
| `/app/matter-status/` | Added (functional) | Supporting page for Intake OS, not a guardrail violation |
| `/app/review/` | Added (functional) | Internal admin page, not linked publicly |

### Treatment of matter-status and review

Both pages are **supporting subpages** for VCX Intake OS (Product 1):
- `matter-status` is reachable only via magic link in the API response
- `review` is reachable only by direct URL with admin token
- Neither appears in any public navigation
- Both degrade gracefully when the backend is offline

No destructive changes, aliases, or redirects were needed. These pages comply with AGENTS.md under the namespace `app/*` (non-vcx-prefixed shared pages).

---

## D) Backend Realignment

The backend was **already** at `vcx-api/` in the build workspace. It was copied directly into the v284 repo with no renaming needed. There is no `api/` directory to rename or shim.

### Compatibility shims: NONE needed

All frontend JS files use the pattern:
```javascript
const API_BASE = window.VCX_API_BASE || '';
fetch(API_BASE + '/api/intakes', ...)
```

This resolves to same-origin requests by default. To point at a different backend URL, set `window.VCX_API_BASE` before the product JS loads.

---

## E) site.js Guardrail Deviation

### Change scope
- **Function:** `bindIntakeForm()` (lines 364-401)
- **Diff:** +8 lines, -0 lines deleted (refactored into async with delegation check)
- **Boundary markers:** `// VCX Phase 2: modified bindIntakeForm -- START/END`

### Behavior matrix

| Scenario | Behavior | Regression? |
|----------|----------|-------------|
| Backend live + vcx-intake-api.js loaded | API path fires, intakeResult populates | No |
| Backend down + vcx-intake-api.js loaded | Fetch fails, error shown in intakeResult | No (graceful) |
| vcx-intake-api.js 404 (not loaded) | VCX_IntakeAPI undefined, FormSubmit.co fires | No |
| Backend irrelevant (e.g., careers page) | bindIntakeForm only runs on #intakeForm | No |

### Documentation

| Document | Entry |
|----------|-------|
| `docs/VCX_CHANGELOG.md` | Phase 2 section with file, line range, description |
| `docs/GUARDRAIL_DEVIATIONS.md` | Deviation 1: full justification, fallback analysis, scope |

---

## F) Documentation Truth Pass

All docs reflect the actual post-Phase-2 repo state:

| Document | Status | Updates |
|----------|--------|---------|
| `docs/VCX_CHANGELOG.md` | Updated | Added Phase 2 section with all changes |
| `docs/VCX_IMPLEMENTATION_PLAN.md` | Accurate | Products table, tech stack, global mods all match |
| `docs/VCX_API_MAP.md` | Accurate | All 20 endpoints (8 functional + 12 scaffold) documented |
| `docs/VCX_DATA_MODEL.md` | Accurate | 15 tables match schema.sql |
| `docs/VCX_ROADMAP_30_60_90.md` | Accurate | Phase 1 complete items checked off |
| `docs/GUARDRAIL_DEVIATIONS.md` | New | 3 deviations documented with justification |
| `AGENTS.md` | Accurate | Guardrails enforced throughout Phase 2 |
| `_codex_phase0.md` | Accurate | Architecture audit matches current state |
| `_codex_phase1.md` | Accurate | Implementation report matches migrated files |
| `_codex_phase2_preflight.md` | Accurate | Preflight audit used as execution guide |

---

## G) Validation Results

| # | Check | Result |
|---|-------|--------|
| 1 | File inventory (145 files, 65 new) | PASS |
| 2 | No stale api/ references | PASS |
| 3 | Root-relative paths in all app/*/index.html | PASS |
| 4 | Shell template consistency (7 pages: vcx-header, i18n en/ru/es, footer-grid-extended) | PASS |
| 5 | Integration card links resolve to existing directories | PASS |
| 6 | site.js bindIntakeForm with VCX_IntakeAPI delegation + boundary markers | PASS |
| 7 | structured-case-intake.html: 3 edits verified | PASS |
| 8 | vcx-api/ backend present with main.py, schema.sql, requirements.txt | PASS |

---

## H) Complete File Change Summary

### Modified existing files (6)

| File | Change | Lines |
|------|--------|-------|
| `structured-case-intake.html` | +intakeResult div, +legal-assistant link, +vcx-intake-api.js script | +5 |
| `assets/js/site.js` | bindIntakeForm() VCX_IntakeAPI delegation with FormSubmit.co fallback | +8 net |
| `additional-services.html` | 3 product integration cards (Contract Review, Legal Assistant, Packet Room) | +18 |
| `revenue-recovery-workflow.html` | 2 product integration cards (Recovery Pilot, Intake OS) | +16 |
| `corporate-legal-file-control.html` | 2 product integration cards (Contract Review, Packet Room) | +16 |
| `.gitignore` | Created with vcx-api exclusions | +14 |

### New files added (~65)

| Category | Count | Items |
|----------|-------|-------|
| App pages | 7 | legal-assistant, matter-status, review, vcx-intake, vcx-contract-review, vcx-recovery-pilot, vcx-packet-room |
| Product CSS | 6 | vcx-intake, vcx-contract-review, vcx-recovery-pilot, vcx-packet-room, vcx-legal-assistant, vcx-review-queue |
| Product JS | 8 | vcx-intake, vcx-intake-api, vcx-contract-review, vcx-recovery-pilot, vcx-packet-room, vcx-legal-assistant, vcx-review-queue, vcx-matter-status |
| Backend (vcx-api/) | 35 | main.py, schema.sql, db.py, 8 routers, 7 models, 3 services, 2 chat modules, 4 knowledge files, config |
| Documentation | 3 root + 6 docs/ | AGENTS.md, _codex_phase0.md, _codex_phase1.md, _codex_phase2_preflight.md + 5 docs/ files + GUARDRAIL_DEVIATIONS.md |

### Files NOT modified (confirmed)

| File | Reason |
|------|--------|
| `index.html` | Homepage, do-not-touch |
| `assets/css/styles.css` | Global styles |
| `assets/css/ui-shell.css` | Shell styles |
| `assets/js/ui-shell.js` | Shell behavior |
| `assets/js/premium-fixes.js` | Premium layer |
| `assets/css/premium-fixes.css` | Premium layer |
| `assets/css/vcx-tokens.css` through `vcx-utilities.css` | Design system (5 files) |
| `assets/js/vcx-i18n.js`, `shell-i18n.js` | i18n runtime |
| `app/contract-intelligence/` | Existing app |
| `app/dealer-contract-check/` | Existing app |
| `app/immigration-forms/` | Existing app |
| `app/private-lookup/` | Existing app |
| `app/sign-in/` | Existing app |
| Top navigation | Unchanged |
| Header/footer shell | Unchanged (new pages use v284 shell copy) |
| `_references/` | Read-only reference material |

### Compatibility shims left on purpose: NONE

No temporary shims, aliases, or compatibility layers were needed. The migration was a clean copy + shell reconciliation + additive edits.

---

## End of Phase 2 Realignment Report
