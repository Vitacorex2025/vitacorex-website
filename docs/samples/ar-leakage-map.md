---
title: AR Leakage Map — Sample Deliverable
slug: ar-leakage-map
audience: b2b
gated: true
url: https://vitacorexllc.com/samples/ar-leakage-map.html
version: "1.0"
date_created: 2026-04-19
date_modified: 2026-04-19
last_reviewed: 2026-04-19
adr: ADR-008
status: live
tags: [sample, b2b, gated, ar-recovery]
---

# AR Leakage Map — Sample Deliverable

> Redacted sample of the AR Leakage Map deliverable: seven-domain diagnostic identifying where accounts receivable are leaking value across aging, documentation, escalation, and handoff.

## Purpose

B2B procurement teams evaluating VitaCoreX for revenue recovery need to see *the shape* of the AR Leakage Map before signing an NDA or an engagement. This sample is the proof-before-contract artifact for the Revenue Recovery Workflow service.

**Operator value proposition**: "Here is the 7-domain diagnostic we apply to your AR book in the first 30 days. Here are the redacted findings from a real deployment. Here is the roadmap shape. Decide whether it maps to your workflow before you give us data."

## Audience + gating

- **Audience**: B2B (CFOs, controllers, revenue-ops, GC procurement).
- **Gating**: **gated** — accessible only after the NDA-intent + contact form on [`samples/request-gated-sample.html?s=ar-leakage-map`](../../samples/request-gated-sample.html).
- **Access flow**:
    1. User clicks "Request access" CTA on library hub or on `revenue-recovery-workflow.html` embed card.
    2. Gate page renders sample-specific title, 6 form fields + 2 consent checkboxes.
    3. On valid submit: `localStorage.vcxGatedAccess["ar-leakage-map"] = { granted: true, grantedAt, payload }` + `vcxGatedRequestQueue` append + mailto fallback.
    4. Direct navigation thereafter passes the `hasGrant()` check in `vcx-sample-gate.js` → no overlay.
    5. Without a grant: `#vcxGateLock` fixed-position overlay mounts with "Request access" CTA pointing back at the gate.

## Where it's referenced

| Location | How it appears |
|----------|---------------|
| Library hub ([`sample-deliverable.html`](../../sample-deliverable.html)) | B2B navy `.vcx-hub-card` with `data-gated-cta="1"`; CTA routes to gate |
| Service embed ([`revenue-recovery-workflow.html`](../../revenue-recovery-workflow.html)) | Left card in the 2-card `.vcx-sample-embed--pair` block; CTA routes to gate |
| CollectionPage schema (hub) | `hasPart[*]` with `isAccessibleForFree: false` |
| Sitemap (`sitemap.xml`) | Sample cluster at `monthly · 0.6` |

## Schema contract (JSON-LD)

Rendered inline in `samples/ar-leakage-map.html` (lines ~44-46 for `CreativeWork`, ~47-49 for `BreadcrumbList`).

- `@type`: `CreativeWork`
- `@id`: `https://vitacorexllc.com/samples/ar-leakage-map.html#sample`
- `name`: `AR Leakage Map — Sample Deliverable`
- `url`: `https://vitacorexllc.com/samples/ar-leakage-map.html`
- `isAccessibleForFree`: **`false`** (gated)
- `inLanguage`: `["en", "ru", "es"]`
- `genre`: `redacted-sample`
- `educationalUse`: `procurement-evaluation`
- `license`: `https://vitacorexllc.com/terms-of-use.html`
- `dateCreated` / `dateModified`: `2026-04-19`
- `version`: `1.0`
- `creator` / `publisher`: VCX `Organization` block (`@id: https://vitacorexllc.com/#org`)

BreadcrumbList chain: Home → Samples → AR Leakage Map.

Verified PASS by [`scripts/verify-sample-schema.js`](../../scripts/verify-sample-schema.js) §(A).

## Redaction rubric applied (per ADR-008 §redaction)

**Redacted** (replaced with `[REDACTED]`):
- Client name, industry vertical, domicile, ownership
- Dollar amounts — absolute values (kept as ranges/percentages)
- Specific counterparty names
- Specific invoice / matter IDs
- Any PII

**Kept verbatim**:
- Diagnostic methodology (7-domain framework — this is what we sell)
- Rubric questions and weighting logic
- Redaction markers themselves (shows operator that we redact transparently)
- Findings *patterns* (e.g., "dispute log not reconciled against aging" is the pattern; the specific counterparty is redacted)
- UPL/FDCPA disclaimers
- Watermark + banner copy

## i18n namespace

- **Namespace**: `smp_ar_leakage_map_*`
- **Catalog source**: inline `window.PAGE_DATA` in `samples/ar-leakage-map.html` (flat-key shape — the pilot sample used flat keys before the canonical `_mkContent(v)` helper landed; all keys still resolve via `assets/js/vcx-sample.js` reader)
- **Trilingual parity**: EN / RU / ES — audited via Node PAGE_DATA parse (0 missing keys across all 3 langs)

## Runtime assets

- `assets/css/vcx-sample.css?v=1` — cover / watermark / metadata grid / section / band / CTA
- `assets/css/vcx-sample-gate.css?v=1` — **`.vcx-gate-lock` overlay (mounted when no grant)**
- `assets/js/vcx-sample.js` — watermark + banner idempotent DOM injection + PAGE_DATA reader
- `assets/js/vcx-sample-gate.js?v=1` defer — dual-mode (gate form handler + gated-sample access check)

## Change log

| Version | Date | Notes |
|---------|------|-------|
| 1.0 | 2026-04-19 | Initial production (ADR-008 Step 3.2); gating wiring landed in Step 3.5; schema audit locked in Step 3.6. |

## Related

- ADR: [ADR-008](../adr/ADR-008-sample-deliverable-standards.md)
- Service page: [`revenue-recovery-workflow.html`](../../revenue-recovery-workflow.html)
- Gate page: [`samples/request-gated-sample.html`](../../samples/request-gated-sample.html)
- Verifiers: [`scripts/verify-sample-schema.js`](../../scripts/verify-sample-schema.js), [`scripts/verify-gated-samples.js`](../../scripts/verify-gated-samples.js)
- Playwright spec: [`tests/e2e/samples.spec.ts`](../../tests/e2e/samples.spec.ts) Suite (5) gate-grant flow + Suites (6-7) overlay behavior
