# Guardrail Deviations Log

## Overview

AGENTS.md defines the VCX guardrails for safe development. This document records every intentional deviation from those guardrails, with justification and mitigation.

---

## Deviation 1: site.js modification

| Field | Value |
|-------|-------|
| **File** | `assets/js/site.js` |
| **Function** | `bindIntakeForm()` (lines 364-401) |
| **Guardrail** | AGENTS.md: "Avoid modifying global files unless absolutely necessary: assets/js/site.js" |
| **Change** | Replaced the form submit handler to delegate to `window.VCX_IntakeAPI.submit(form)` when the API client is loaded, else falls back to FormSubmit.co email path. Added `e.preventDefault()` and `async` to handler. |
| **Why necessary** | Without this change, the VCX Intake OS API pipeline is unreachable from the intake form. The `vcx-intake-api.js` script defines `window.VCX_IntakeAPI` but nothing calls it. The form continues to POST directly to FormSubmit.co. |
| **Fallback preserved** | YES. When `window.VCX_IntakeAPI` is undefined (script not loaded or 404), the original FormSubmit.co code path executes identically to the unmodified version. |
| **Scope** | Single function body. No other function, event listener, DOM query, or i18n binding is altered. |
| **Boundary markers** | `// VCX Phase 2: modified bindIntakeForm -- START` / `-- END` |
| **Introduced** | Phase 2 (2026-04-02) |

---

## Deviation 2: structured-case-intake.html modifications

| Field | Value |
|-------|-------|
| **File** | `structured-case-intake.html` |
| **Guardrail** | AGENTS.md: "Prefer additive changes over rewrites." |
| **Changes** | Three additive insertions: (1) `<div id="intakeResult">` after form, (2) Legal Assistant link in self-service card, (3) `<script src="vcx-intake-api.js">` before inline script. |
| **Compliance** | All three are pure insertions. No existing HTML was deleted or restructured. |
| **Boundary markers** | `<!-- VCX Phase 2: ... -- START/END -->` on the intakeResult div and script tag. The link insertion follows the existing pattern of sibling `<a>` tags. |
| **Introduced** | Phase 2 (2026-04-02) |

---

## Deviation 3: Integration cards on service pages

| Field | Value |
|-------|-------|
| **Files** | `additional-services.html`, `revenue-recovery-workflow.html`, `corporate-legal-file-control.html` |
| **Guardrail** | AGENTS.md: "Prefer additive changes over rewrites. Do not delete or replace existing pages." |
| **Changes** | Inserted self-contained product card blocks between existing sections. Uses existing `.card.reveal` CSS pattern with colored top borders matching VCX design tokens. |
| **Compliance** | All insertions are additive. No existing content was removed. Each insertion is wrapped in `<!-- VCX Phase 2: product integration cards -- START/END -->` markers. Removal = delete the marked block. |
| **Introduced** | Phase 2 (2026-04-02) |

---

## Non-deviations (confirmed)

| Guardrail | Status |
|-----------|--------|
| Do not rewrite homepage or top navigation | Compliant. index.html untouched. No nav changes. |
| Do not modify styles.css | Compliant. Untouched. |
| Do not modify ui-shell.css | Compliant. Untouched. |
| Do not modify ui-shell.js | Compliant. Untouched. |
| Do not modify premium-fixes.js | Compliant. Untouched. |
| Root-relative asset paths | Compliant. All new pages use /assets/ paths. |
| No broken layout on iPhone width | Testing required (see _codex_phase2_preflight.md Section 10). |
| Do not modify _references/ | Compliant. Untouched. |
