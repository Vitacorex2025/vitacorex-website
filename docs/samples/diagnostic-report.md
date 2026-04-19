---
title: 30-Day Diagnostic Report — Sample Deliverable
slug: diagnostic-report
audience: b2b
gated: false
url: https://vitacorexllc.com/samples/diagnostic-report.html
version: "1.0"
date_created: 2026-04-19
date_modified: 2026-04-19
last_reviewed: 2026-04-19
adr: ADR-008
status: live
tags: [sample, b2b, open, diagnostic, legacy-migrated]
---

# 30-Day Diagnostic Report — Sample Deliverable

> Redacted replica of the 30-day diagnostic VitaCoreX produces at engagement start: executive summary, methodology, findings by domain, recovery band, 90-day roadmap, and out-of-scope boundary.

## Purpose

The 30-Day Diagnostic Report is the output of the **Diagnostic Review ($2,500)** engagement and of the free pilot's first reporting cycle. Buyers weighing whether to commit to a diagnostic engagement need to see what the 30th-day artifact actually looks like.

**Operator value proposition**: "After 30 days of data access, you get this. Executive summary for the board, methodology for the audit trail, findings that rank by recoverable dollars, a range-framed outcome band (not a guarantee), and a 90-day roadmap that names owner + timeline per item. Out-of-scope section so you know what we did *not* look at."

## Audience + gating

- **Audience**: B2B (CFO, controller, AR manager, owner/operator evaluating the Diagnostic tier).
- **Gating**: **open** — directly readable at `/samples/diagnostic-report.html`. No gate form, no overlay.

## Lineage (legacy migration)

This sample is the **template-aligned port** of the 664-line legacy `sample-deliverable.html` page that lived at the root URL before P03. In Step 3.2:

1. The legacy content was ported into the canonical Step-3.2 template structure (cover → metadata → TOC → 6 sections → closing disclaimer).
2. The original URL (`/sample-deliverable.html`) was preserved — it became the **library hub** in Step 3.3.
3. The diagnostic content now lives at `/samples/diagnostic-report.html` as sample #7 of the roster.

Because the legacy page was already trilingual (EN/RU/ES), the migration preserved that catalog verbatim and re-keyed it into the `smp_diagnostic_report_*` namespace.

## Where it's referenced

| Location | How it appears |
|----------|---------------|
| Library hub ([`sample-deliverable.html`](../../sample-deliverable.html)) | B2B navy `.vcx-hub-card` (open, no `data-gated-cta`); CTA opens sample directly |
| Service embed ([`pre-collection-pilot.html`](../../pre-collection-pilot.html)) | 1-card `.vcx-sample-embed`; CTA opens sample directly |
| Service embed ([`solutions.html`](../../solutions.html)) | 1-card `.vcx-sample-embed`; CTA opens sample directly |
| CollectionPage schema (hub) | `hasPart[*]` with `isAccessibleForFree: true` |
| Sitemap (`sitemap.xml`) | Sample cluster at `monthly · 0.6` |

## Schema contract (JSON-LD)

Rendered inline in `samples/diagnostic-report.html`.

- `@type`: `CreativeWork`
- `@id`: `https://vitacorexllc.com/samples/diagnostic-report.html#sample`
- `name`: `30-Day Diagnostic Report — Sample Deliverable`
- `url`: `https://vitacorexllc.com/samples/diagnostic-report.html`
- `isAccessibleForFree`: **`true`** (open)
- `inLanguage`: `["en", "ru", "es"]`
- `genre`: `redacted-sample`
- `educationalUse`: `procurement-evaluation`
- `license`: `https://vitacorexllc.com/terms-of-use.html`
- `dateCreated` / `dateModified`: `2026-04-19`
- `version`: `1.0`
- `creator` / `publisher`: VCX `Organization` block

BreadcrumbList chain: Home → Samples → 30-Day Diagnostic Report.

Verified PASS by [`scripts/verify-sample-schema.js`](../../scripts/verify-sample-schema.js) §(A).

## Redaction rubric applied (per ADR-008 §redaction)

**Redacted**:
- Client name, industry, geography, ownership
- Dollar amounts (kept as bands + percentages)
- Counterparty names
- Staff names (replaced with role descriptors)

**Kept verbatim**:
- Executive summary structure + rhetorical arc
- Methodology (data sources, sampling window, domain decomposition)
- Finding domain taxonomy (aging, dispute log, credit policy, escalation path, handoff readiness)
- Range-framed outcome band (with explicit "not a guarantee" caveat, pre-staging P05 §no-outcome-guarantees)
- 90-day roadmap template (owner / timeline / measure columns)
- Out-of-scope section (pre-staging P05 §boundary-discipline — what we don't do, named explicitly)

## i18n namespace

- **Namespace**: `smp_diagnostic_report_*`
- **Catalog source**: inline `window.PAGE_DATA` in `samples/diagnostic-report.html` (canonical `_mkContent(v)` shape)
- **Trilingual parity**: EN / RU / ES — migrated verbatim from the pre-P03 legacy catalog, no key loss.

## Runtime assets

- `assets/css/vcx-sample.css?v=1`
- `assets/js/vcx-sample.js`

(No gate assets — open sample.)

## Change log

| Version | Date | Notes |
|---------|------|-------|
| 1.0 | 2026-04-19 | Legacy `sample-deliverable.html` content template-aligned + ported to `/samples/diagnostic-report.html` (ADR-008 Step 3.2). Original URL became the library hub in Step 3.3. |

## Related

- ADR: [ADR-008](../adr/ADR-008-sample-deliverable-standards.md)
- Service pages: [`pre-collection-pilot.html`](../../pre-collection-pilot.html), [`solutions.html`](../../solutions.html), [`diagnostic-review.html`](../../diagnostic-review.html)
- Pricing ladder: [`pricing-and-engagement-tiers.html`](../../pricing-and-engagement-tiers.html) (ADR-005 Diagnostic tier)
- Verifiers: [`scripts/verify-sample-schema.js`](../../scripts/verify-sample-schema.js)
- Playwright spec: [`tests/e2e/samples.spec.ts`](../../tests/e2e/samples.spec.ts) Suites (1-2)
