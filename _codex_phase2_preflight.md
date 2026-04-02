# VCX Phase 2 — Preflight Audit

> Generated 2026-04-02 | Branch: `codex/phase2-safe-realign`
> Baseline: v284 clean extraction (commit 25e958c)
> Reference docs: _codex_phase0.md, _codex_phase1.md, docs/*.md, AGENTS.md (all in vcx-work build workspace, not yet present in this repo)

---

## 0. Baseline Inventory

### Files in v284

| Category | Count | Details |
|----------|-------|---------|
| Root HTML pages | 29 | index.html through v51_institutional_blocks.html |
| App pages (app/*/) | 5 | contract-intelligence, dealer-contract-check, immigration-forms, private-lookup, sign-in |
| CSS (assets/css/) | 10 | vcx-tokens, vcx-base, vcx-layout, vcx-components, vcx-utilities, styles, ui-shell, premium-fixes, private-lookup, vitacorex-public |
| JS (assets/js/) | 7 | site.js, ui-shell.js, premium-fixes.js, vcx-i18n.js, shell-i18n.js, private-lookup.js, vitacorex-public.js |
| Other | ~30 | images, video, PDFs, changelogs, config, python scripts |
| **Total** | **~80** | |

### What v284 does NOT have (must migrate from vcx-work)

- `AGENTS.md` (guardrails)
- `_codex_phase0.md` (architecture audit)
- `_codex_phase1.md` (implementation report)
- `docs/` directory (5 documentation files)
- `vcx-api/` directory (entire backend)
- `app/legal-assistant/` (Product 5 frontend)
- `app/matter-status/` (client status dashboard)
- `app/review/` (admin review queue)
- `app/vcx-intake/` (Intake OS landing)
- `app/vcx-contract-review/` (Product 2 scaffold)
- `app/vcx-recovery-pilot/` (Product 3 scaffold)
- `app/vcx-packet-room/` (Product 4 scaffold)
- 6 product CSS files (assets/css/vcx-*.css for products)
- 7 product JS files (assets/js/vcx-*.js for products)

---

## 1. Required Fix: intakeResult Container

### Current state (v284)

`structured-case-intake.html` line 180: `</form>` closes the intake form. Lines 181-190 contain the existing "Private Client Self-Service Tools" card with links to contract-intelligence, immigration-forms, and dealer-contract-check.

### Required change

Insert the `intakeResult` div immediately after `</form>` (line 180) and before the existing self-service card (line 181):

```html
<!-- VCX Phase 2: API intake result panel — START -->
<div id="intakeResult" class="card reveal" style="display:none;margin-top:18px;padding:28px 24px;"></div>
<!-- VCX Phase 2: API intake result panel — END -->
```

### Rationale

`vcx-intake-api.js` calls `document.getElementById('intakeResult')` to render the API response (matter_id, magic_link, checklist, triage_score). Without this div, API intake succeeds server-side but the user sees nothing. The div is invisible (`display:none`) until JS populates it, so zero visual impact when the API backend is offline.

### Risk: NONE

Hidden by default. No layout shift. Falls inside the existing `.intake-wrap` flow.

---

## 2. Required Fix: intake-api.js Script Tag

### Current state (v284)

Scripts load at lines 264-265:
- Line 264: `vcx-i18n.js`
- Line 265: `site.js`, `ui-shell.js`, `premium-fixes.js`
- Lines 266-288: inline service-type pre-select script
- Line 289: `</body></html>`

### Required change

Insert the script tag after the existing scripts and before the inline script block:

```html
<script src="/assets/js/vcx-intake-api.js"></script>
```

Recommended insertion point: after line 265 (after `premium-fixes.js`), before the inline `(function(){...})()` at line 266. This ensures `site.js` has already defined `bindIntakeForm()` and the DOM is ready.

### Dependency

This script tag is only useful once:
1. `assets/js/vcx-intake-api.js` exists in the repo (migrated from vcx-work)
2. The `intakeResult` div exists (Fix 1 above)
3. The site.js modification (Fix 5 below) is applied so that `bindIntakeForm()` delegates to `VCX_IntakeAPI.submit()`

Without Fix 5, the script loads but `window.VCX_IntakeAPI` is never called — harmless but inert.

### Risk: NONE

The script file defines a global and waits to be called. If the file is missing, browser logs a 404 with no user-visible impact.

---

## 3. Required Fix: Legal Assistant CTA Link

### Current state (v284)

Lines 182-190 already have a "Private Client Self-Service Tools" card with three tool links (contract-intelligence, immigration-forms, dealer-contract-check). This card uses inline styles matching the VCX design system (gold accent rgba(176,138,87,.07), border rgba(176,138,87,.2)).

### Required change

Add a fourth link inside the existing `.vcx-self-service-card` flex container (line 189, before the closing `</div>` of the flex row):

```html
<a href="/app/legal-assistant/" class="vcx-tool-link" style="display:inline-block;padding:10px 18px;background:rgba(23,58,99,.06);border:1px solid rgba(23,58,99,.18);border-radius:7px;color:#173A63;font-size:.87rem;text-decoration:none;font-weight:600;">Legal assistant &rarr;</a>
```

### Alternative approach

If the Legal Assistant page should also appear on `additional-services.html`, add an integration card there during Pass 2 (already designed in Phase 1). The intake page link is the minimum viable entry point.

### Risk: LOW

One additional flex child in an existing flex-wrap container. On narrow screens the chip wraps to a new line — identical behavior to the existing 3 chips. No layout breakage.

---

## 4. Namespace Reconciliation

### Convention (from AGENTS.md)

| Namespace | Pattern | Examples |
|-----------|---------|----------|
| Product frontend pages | `/app/vcx-*/` | vcx-intake, vcx-contract-review, vcx-recovery-pilot, vcx-packet-room |
| Shared product pages | `/app/*/` (no vcx prefix) | legal-assistant, matter-status, review |
| Product CSS | `assets/css/vcx-*.css` | vcx-legal-assistant.css, vcx-intake.css |
| Product JS | `assets/js/vcx-*.js` | vcx-legal-assistant.js, vcx-intake.js |
| Backend | `vcx-api/` | vcx-api/app/main.py |

### Conflict check: existing CSS files

v284 already has 5 `vcx-*.css` files in the design-system layer:
- `vcx-tokens.css`, `vcx-base.css`, `vcx-layout.css`, `vcx-components.css`, `vcx-utilities.css`

Product CSS files use a different naming segment: `vcx-intake.css`, `vcx-legal-assistant.css`, etc. No collision. The design-system files are loaded first (in `<head>` via the cascade), product CSS files are loaded per-page after `premium-fixes.css`.

### Conflict check: existing JS files

v284 has `vcx-i18n.js` in assets/js/. Product JS files use distinct names (vcx-intake.js, vcx-legal-assistant.js, etc.). No collision.

### Conflict check: app/ directories

v284 has 5 existing app dirs: contract-intelligence, dealer-contract-check, immigration-forms, private-lookup, sign-in. Product dirs use different names (vcx-intake, vcx-contract-review, vcx-recovery-pilot, vcx-packet-room, legal-assistant, matter-status, review). No collision.

### Conclusion: NO namespace conflicts. All product files can be copied directly.

---

## 5. site.js Modification Analysis

### Current state (v284 lines 346-393)

`bindIntakeForm()` listens for `submit`, validates, syncs metadata, calls `configureDirectFormSubmission()` to set FormSubmit.co hidden fields, then lets the native `form.submit()` happen (no `e.preventDefault()`). The form POSTs to `https://formsubmit.co/vitacorexllc@gmail.com`.

### Phase 1 modification (in vcx-work)

Changed to: `e.preventDefault()` always. If `window.VCX_IntakeAPI && window.VCX_IntakeAPI.submit` exists, delegates to it. Otherwise falls back to the original FormSubmit.co path (calls `configureDirectFormSubmission`, then `form.submit()`).

### Is this change necessary?

**YES, but only when the backend is deployed and `vcx-intake-api.js` is loaded.**

Without modifying site.js:
- `vcx-intake-api.js` defines `window.VCX_IntakeAPI` but nothing calls it
- The form still POSTs to FormSubmit.co as before
- The `intakeResult` div never populates
- The entire API intake pipeline is inert

With the modification:
- When backend is live: form submits via API, user sees matter_id + magic link + checklist in `intakeResult`
- When backend is offline: falls back to FormSubmit.co email path (zero regression)

### Risk assessment

| Scenario | Behavior | Risk |
|----------|----------|------|
| Backend live + vcx-intake-api.js loaded | API path fires | Expected |
| Backend down + vcx-intake-api.js loaded | VCX_IntakeAPI.submit() fetch fails, shows error in intakeResult | User sees error but can retry |
| vcx-intake-api.js NOT loaded (404) | window.VCX_IntakeAPI is undefined, fallback to FormSubmit.co | Zero regression |
| vcx-intake-api.js loaded, site.js NOT modified | VCX_IntakeAPI exists but never called | Harmless but useless |

### Recommendation

**Apply the site.js change.** The fallback logic guarantees that FormSubmit.co still works when the API is unavailable. The change is 33 lines and touches only the `bindIntakeForm()` function body (lines 364-393). No other function is affected.

### Guardrail deviation

AGENTS.md lists `assets/js/site.js` as a file to modify with extreme care. This change:
- Is scoped to a single function (`bindIntakeForm`)
- Does not alter any other event listener, DOM query, or i18n binding
- Preserves the original FormSubmit.co code path as fallback
- Must be documented in `docs/VCX_CHANGELOG.md` with exact line range

---

## 6. Files to Change (Exhaustive)

### A. Files to MODIFY in v284

| # | File | Change | Lines affected |
|---|------|--------|---------------|
| 1 | `structured-case-intake.html` | Insert intakeResult div after line 180 | +2 lines |
| 2 | `structured-case-intake.html` | Insert vcx-intake-api.js script after line 265 | +1 line |
| 3 | `structured-case-intake.html` | Add Legal Assistant link inside self-service card (line 189) | +1 line |
| 4 | `assets/js/site.js` | Replace bindIntakeForm submit handler (lines 364-393) | ~30 lines |
| 5 | `additional-services.html` | Insert 3 product integration cards | +30-40 lines |
| 6 | `revenue-recovery-workflow.html` | Insert 2 product integration cards | +20-30 lines |
| 7 | `corporate-legal-file-control.html` | Insert 2 product integration cards | +20-30 lines |
| 8 | `.gitignore` | Add vcx-api exclusions | +6-8 lines |

### B. New FILES to add (migrate from vcx-work)

| # | File/Directory | Source | Notes |
|---|----------------|--------|-------|
| 9 | `AGENTS.md` | vcx-work root | Guardrails for future development |
| 10 | `_codex_phase0.md` | vcx-work root | Architecture audit |
| 11 | `_codex_phase1.md` | vcx-work root | Implementation report |
| 12 | `docs/VCX_IMPLEMENTATION_PLAN.md` | vcx-work/docs/ | |
| 13 | `docs/VCX_API_MAP.md` | vcx-work/docs/ | |
| 14 | `docs/VCX_DATA_MODEL.md` | vcx-work/docs/ | |
| 15 | `docs/VCX_ROADMAP_30_60_90.md` | vcx-work/docs/ | |
| 16 | `docs/VCX_CHANGELOG.md` | vcx-work/docs/ | Update with Phase 2 entries |
| 17 | `vcx-api/` (entire directory) | vcx-work/vcx-api/ | 30 backend files |
| 18 | `app/legal-assistant/index.html` | vcx-work | Product 5 |
| 19 | `app/matter-status/index.html` | vcx-work | Client dashboard |
| 20 | `app/review/index.html` | vcx-work | Admin queue |
| 21 | `app/vcx-intake/index.html` | vcx-work | Intake landing |
| 22 | `app/vcx-contract-review/index.html` | vcx-work | Scaffold |
| 23 | `app/vcx-recovery-pilot/index.html` | vcx-work | Scaffold |
| 24 | `app/vcx-packet-room/index.html` | vcx-work | Scaffold |
| 25 | `assets/css/vcx-intake.css` | vcx-work/assets/css/ | |
| 26 | `assets/css/vcx-contract-review.css` | vcx-work/assets/css/ | |
| 27 | `assets/css/vcx-recovery-pilot.css` | vcx-work/assets/css/ | |
| 28 | `assets/css/vcx-packet-room.css` | vcx-work/assets/css/ | |
| 29 | `assets/css/vcx-legal-assistant.css` | vcx-work/assets/css/ | |
| 30 | `assets/css/vcx-review-queue.css` | vcx-work/assets/css/ | |
| 31 | `assets/js/vcx-intake.js` | vcx-work/assets/js/ | |
| 32 | `assets/js/vcx-intake-api.js` | vcx-work/assets/js/ | |
| 33 | `assets/js/vcx-contract-review.js` | vcx-work/assets/js/ | |
| 34 | `assets/js/vcx-recovery-pilot.js` | vcx-work/assets/js/ | |
| 35 | `assets/js/vcx-packet-room.js` | vcx-work/assets/js/ | |
| 36 | `assets/js/vcx-legal-assistant.js` | vcx-work/assets/js/ | |
| 37 | `assets/js/vcx-review-queue.js` | vcx-work/assets/js/ | |
| 38 | `assets/js/vcx-matter-status.js` | vcx-work/assets/js/ | |

### C. Files to leave UNTOUCHED

| File | Reason |
|------|--------|
| `index.html` | Homepage — AGENTS.md do-not-touch |
| `assets/css/styles.css` | Global styles — AGENTS.md do-not-touch |
| `assets/css/ui-shell.css` | Shell styles — AGENTS.md do-not-touch |
| `assets/js/ui-shell.js` | Shell behavior — AGENTS.md do-not-touch |
| `assets/js/premium-fixes.js` | Premium layer — AGENTS.md do-not-touch |
| `assets/css/premium-fixes.css` | Premium layer — AGENTS.md do-not-touch |
| `assets/css/vcx-tokens.css` | Design system — no modification needed |
| `assets/css/vcx-base.css` | Design system — no modification needed |
| `assets/css/vcx-layout.css` | Design system — no modification needed |
| `assets/css/vcx-components.css` | Design system — no modification needed |
| `assets/css/vcx-utilities.css` | Design system — no modification needed |
| `assets/js/vcx-i18n.js` | i18n runtime — no modification needed |
| `assets/js/shell-i18n.js` | i18n data — no modification needed |
| `app/contract-intelligence/` | Existing app — AGENTS.md do-not-touch |
| `app/dealer-contract-check/` | Existing app — AGENTS.md do-not-touch |
| `app/immigration-forms/` | Existing app — AGENTS.md do-not-touch |
| `app/private-lookup/` | Existing app — AGENTS.md do-not-touch |
| `app/sign-in/` | Existing app — AGENTS.md do-not-touch |
| Top navigation structure | No nav changes in Phase 2 |
| Header/footer shell | No shell changes |
| All other root HTML pages (27 unmentioned) | No modification planned |

---

## 7. Migration Strategy

### Source to Target mapping

```
SOURCE: C:\Users\sergz\AppData\Local\Temp\vcx-work\site\
TARGET: C:\Users\sergz\OneDrive\Desktop\...\vitacorex_RELEASE_v284\
```

### Step-by-step copy plan

1. **Copy new directories (no conflict possible):**
   - `vcx-work/vcx-api/` -> `v284/vcx-api/`
   - `vcx-work/docs/` -> `v284/docs/`
   - `vcx-work/app/legal-assistant/` -> `v284/app/legal-assistant/`
   - `vcx-work/app/matter-status/` -> `v284/app/matter-status/`
   - `vcx-work/app/review/` -> `v284/app/review/`
   - `vcx-work/app/vcx-intake/` -> `v284/app/vcx-intake/`
   - `vcx-work/app/vcx-contract-review/` -> `v284/app/vcx-contract-review/`
   - `vcx-work/app/vcx-recovery-pilot/` -> `v284/app/vcx-recovery-pilot/`
   - `vcx-work/app/vcx-packet-room/` -> `v284/app/vcx-packet-room/`

2. **Copy new files into existing directories (no overwrite):**
   - 6 CSS files: `vcx-{intake,contract-review,recovery-pilot,packet-room,legal-assistant,review-queue}.css` -> `v284/assets/css/`
   - 8 JS files: `vcx-{intake,intake-api,contract-review,recovery-pilot,packet-room,legal-assistant,review-queue,matter-status}.js` -> `v284/assets/js/`
   - Root docs: `AGENTS.md`, `_codex_phase0.md`, `_codex_phase1.md` -> `v284/`

3. **Apply edits to existing files (MUST use diff/patch, never overwrite):**
   - `structured-case-intake.html` — 3 insertions (Fixes 1, 2, 3)
   - `assets/js/site.js` — 1 function body replacement (Fix 5)
   - `additional-services.html` — 1 card block insertion
   - `revenue-recovery-workflow.html` — 1 card block insertion
   - `corporate-legal-file-control.html` — 1 card block insertion
   - `.gitignore` — append vcx-api exclusions

### Link integrity check

All new app pages use root-relative paths for assets:
- `/assets/css/vcx-*.css`
- `/assets/js/vcx-*.js`
- Links between pages use `/app/*/` paths

The vcx-work build workspace used `../../assets/` relative paths in the `_references/` legal-assistant template. The vcx-work product pages use root-relative `/assets/` paths. Verify after copy that ALL product page HTML files use root-relative paths — no `../../` references should appear in the migrated pages.

### Broken link prevention

| Link source | Target | Risk |
|-------------|--------|------|
| Integration cards on additional-services.html | `/app/vcx-contract-review/`, `/app/legal-assistant/`, `/app/vcx-packet-room/` | Safe if dirs created first |
| Integration cards on revenue-recovery-workflow.html | `/app/vcx-recovery-pilot/`, `/app/vcx-intake/` | Safe if dirs created first |
| Integration cards on corporate-legal-file-control.html | `/app/vcx-contract-review/`, `/app/vcx-packet-room/` | Safe if dirs created first |
| Self-service card on structured-case-intake.html | `/app/legal-assistant/` | Safe if dir created first |
| vcx-intake-api.js -> API endpoint | `http://localhost:8787/api/intakes` | Fails gracefully when backend off |
| matter-status page -> API | `/api/matters/{id}` | Fails gracefully |
| legal-assistant page -> API | `/api/legal-chat/message` | Fails gracefully |
| review queue -> API | `/api/review/queue` | Fails gracefully |

**Rule: Copy all new directories BEFORE editing existing files that link to them.**

---

## 8. app/matter-status and app/review Treatment

### app/matter-status/ (Client Status Dashboard)

- **Purpose:** Reads `?matter=VCX-xxx&token=xxx` from URL, fetches `GET /api/matters/{id}` with Bearer token, renders status badge, triage score, interactive checklist, timeline, documents, upload zone, deliverables.
- **Entry point:** Magic link generated by POST /api/intakes (included in IntakeResponse and displayed in intakeResult div).
- **Dependencies:** `vcx-matter-status.js`, `vcx-intake.css`, backend running.
- **Treatment:** Copy as-is. The page is inert without a valid magic link URL. No public navigation points to it — users only reach it via the magic link in their intake result.

### app/review/ (Admin Review Queue)

- **Purpose:** Admin-only page. Prompts for X-Admin-Token, fetches `GET /api/review/queue`, renders sortable/filterable table of pending matters, allows status updates via `PATCH /api/review/matters/{id}`.
- **Entry point:** Direct URL only. No public navigation link.
- **Dependencies:** `vcx-review-queue.js`, `vcx-review-queue.css`, backend running.
- **Treatment:** Copy as-is. Gated by admin token prompt — no accidental public exposure. Not linked from any public page. Add to AGENTS.md as an internal-only route.

### Recommendation for both

Neither page needs a navigation entry. Both are functional only when the backend is running. Both degrade gracefully (show "API not responding" messages) when the backend is offline. Copy without modification.

---

## 9. Guardrail Deviation Documentation

### Deviations from AGENTS.md

| # | Rule | Deviation | Justification | Mitigation |
|---|------|-----------|---------------|------------|
| 1 | Do not modify site.js (caution-level, not absolute) | Modifying bindIntakeForm() body (30 lines) | Required for API intake pipeline to function; FormSubmit.co fallback preserved | Document exact line range in CHANGELOG; add inline comment marking VCX modification boundaries |
| 2 | Additive changes only on existing pages | Integration cards on 3 service pages are additive HTML inserts | Uses existing .card.reveal CSS pattern; no deletion or restructuring | Each insertion is a self-contained HTML block; removal = delete the block |
| 3 | No nav changes | No deviation | Top navigation structure untouched | N/A |

### Documentation requirements

Every deviation must be recorded in:

1. `docs/VCX_CHANGELOG.md` — under a `[Phase 2]` section with file, line range, and change description

2. Inline HTML/JS comments at modification boundaries:
   ```
   <!-- VCX Phase 2: [description] -- START -->
   ...
   <!-- VCX Phase 2: [description] -- END -->
   ```
   ```
   // VCX Phase 2: modified bindIntakeForm -- START
   ...
   // VCX Phase 2: modified bindIntakeForm -- END
   ```

---

## 10. Mobile and Layout Regression Risks

### Risk matrix

| Component | Risk | Details | Mitigation |
|-----------|------|---------|------------|
| Intake form (structured-case-intake.html) | LOW | intakeResult div is display:none by default; Legal Assistant link joins existing flex-wrap row | Test at 375px: verify 4 chips wrap correctly |
| Integration cards (3 service pages) | LOW | Cards use existing .card.reveal with grid-template-columns that already have @media breakpoints in styles.css | Verify cards stack on mobile; no horizontal overflow |
| Product app pages (7 new) | MEDIUM | All use identical shell pattern with data-vcx-page scoping, but shell template was built in vcx-work, not derived from v284 | After copy, verify header/footer/nav/i18n match v284 shell exactly |
| Product CSS files | LOW | All scoped via body[data-vcx-page="..."] selectors — cannot leak into other pages | Verify no unscoped rules exist in any vcx-*.css |
| site.js modification | LOW | Only bindIntakeForm() changes; function is already scoped to #intakeForm | Test: form submit with and without backend; verify FormSubmit.co fallback fires |

### Critical test checklist

- [ ] `structured-case-intake.html` at 375px: self-service card wraps, no horizontal scroll
- [ ] `structured-case-intake.html` at 375px: intakeResult panel (when shown) fits within viewport
- [ ] `additional-services.html` at 375px: integration cards stack vertically
- [ ] `revenue-recovery-workflow.html` at 375px: integration cards stack vertically
- [ ] `corporate-legal-file-control.html` at 375px: integration cards stack vertically
- [ ] All 7 new app pages: header/footer render correctly at 375px, 768px, 1280px
- [ ] All 7 new app pages: mobile hamburger nav works (vcx-mobile-nav toggle)
- [ ] Form submission with backend OFF: FormSubmit.co receives the submission
- [ ] Form submission with backend ON: intakeResult populates with matter_id + magic link
- [ ] Legal Assistant page: chat sends/receives at 375px
- [ ] Matter Status page: renders at 375px with valid magic link

---

## 11. Recommended Execution Order

### Phase 2A — Foundation (no visual changes yet)

| Step | Action | Risk | Commit? |
|------|--------|------|---------|
| 1 | Copy AGENTS.md, _codex_phase0.md, _codex_phase1.md to v284 root | NONE | Yes |
| 2 | Copy docs/ directory (5 files) to v284 | NONE | Bundle with Step 1 |
| 3 | Copy vcx-api/ directory to v284 | NONE | Yes |
| 4 | Append vcx-api exclusions to .gitignore | NONE | Bundle with Step 3 |
| 5 | Verify: cd vcx-api, pip install, python -c "from app.main import app" | LOW | No commit |

### Phase 2B — Frontend assets (no existing pages touched yet)

| Step | Action | Risk | Commit? |
|------|--------|------|---------|
| 6 | Copy 6 product CSS files to assets/css/ | NONE | Yes |
| 7 | Copy 8 product JS files to assets/js/ | NONE | Bundle with Step 6 |
| 8 | Copy 7 product app page directories to app/ | NONE | Yes |
| 9 | Verify: all new HTML pages load without 404s for CSS/JS | LOW | No commit |

### Phase 2C — Intake wiring (smallest existing-file changes)

| Step | Action | Risk | Commit? |
|------|--------|------|---------|
| 10 | Edit structured-case-intake.html: insert intakeResult div (Fix 1) | LOW | Combined |
| 11 | Edit structured-case-intake.html: insert vcx-intake-api.js script (Fix 2) | LOW | Combined |
| 12 | Edit structured-case-intake.html: add Legal Assistant link (Fix 3) | LOW | Combined |
| 13 | Edit assets/js/site.js: replace bindIntakeForm body (Fix 5) | MEDIUM | Yes |
| 14 | Verify: load page, submit form with backend off -> FormSubmit.co fires | MEDIUM | No commit |
| 15 | Verify: start backend, submit form -> intakeResult populates | MEDIUM | No commit |

### Phase 2D — Integration cards (additive inserts on service pages)

| Step | Action | Risk | Commit? |
|------|--------|------|---------|
| 16 | Edit additional-services.html: insert 3 product cards | LOW | Combined |
| 17 | Edit revenue-recovery-workflow.html: insert 2 product cards | LOW | Combined |
| 18 | Edit corporate-legal-file-control.html: insert 2 product cards | LOW | Combined |
| 19 | Verify: all 3 pages at 375px, 768px, 1280px | LOW | No commit |
| 20 | Commit: "Add product integration cards to service pages" | | Yes |

### Phase 2E — Documentation and close

| Step | Action | Risk | Commit? |
|------|--------|------|---------|
| 21 | Update docs/VCX_CHANGELOG.md with Phase 2 entries | NONE | |
| 22 | Add _codex_phase2_preflight.md (this document) | NONE | |
| 23 | Final commit: "Complete Phase 2 migration and documentation" | | Yes |
| 24 | Run full mobile regression test (Section 10 checklist) | | |

### Total: 8 existing files modified, 30+ new files added, 4-6 commits

---

## 12. Shell Template Reconciliation Warning

The 7 new app pages in vcx-work were built using a shell template derived from the `_references/legal-assistant-starter/` pattern. This template uses a DIFFERENT header structure than v284.

**vcx-work app pages use:**
```html
<header class="site-header shell-header">
  <div class="wrap shell-header-inner">
    <div class="shell-branding">...
```

**v284 pages use:**
```html
<header class="vcx-header">
  <div class="wrap">
    <div class="vcx-header-shell">
      <div class="vcx-header-desktop">...
```

### Impact

If the app pages are copied as-is, they will have a DIFFERENT header/footer than every other page on the site. The navigation links, clock chips, mobile nav, and i18n bindings will not match.

### Required action (during Phase 2B Step 8)

After copying app pages, update each page header/footer to match the v284 shell pattern. This is a template swap — the `<main>` content stays unchanged, only `<header>` and `<footer>` wrappers need alignment.

### Scope

7 pages x ~60 lines of header/footer template = ~420 lines to update. This is mechanical but critical for visual consistency.

---

## End of Preflight Audit
