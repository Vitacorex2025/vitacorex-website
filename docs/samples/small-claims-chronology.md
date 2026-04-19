---
title: Small Claims Chronology — Sample Deliverable
slug: small-claims-chronology
audience: shared
gated: false
url: https://vitacorexllc.com/samples/small-claims-chronology.html
version: "1.0"
date_created: 2026-04-19
date_modified: 2026-04-19
last_reviewed: 2026-04-19
adr: ADR-008
status: live
tags: [sample, shared, open, small-claims, florida, documentation]
---

# Small Claims Chronology — Sample Deliverable

> Redacted sample chronology: date-by-date timeline of a Florida small-claims matter with attached document inventory and evidence-index pointers.

## Purpose

This sample serves **both** audiences — private-client plaintiffs pursuing a small-claims matter on their own, *and* B2B buyers (corporate small-claims intake, HR, finance) who need to understand what a well-documented chronology looks like before they engage VCX for either the Florida-specific `florida-small-claims-help.html` workflow or the more general `small-claims-documentation.html` service.

**Operator value proposition**: "The judge reads your chronology in 90 seconds. Here is what a readable chronology looks like: date-by-date events with hyperlinked exhibits, a timeline index, and plain-English captions. Not legal advice. Not representation. Documentation that makes your own preparation faster."

## Audience + gating

- **Audience**: **shared** (B2B + B2C) — appears on both private-client small-claims help pages and the more general small-claims documentation service page.
- **Gating**: **open** — directly readable at `/samples/small-claims-chronology.html`.

## Where it's referenced

| Location | How it appears |
|----------|---------------|
| Library hub ([`sample-deliverable.html`](../../sample-deliverable.html)) | Neutral shared `.vcx-hub-card` (open); CTA opens sample directly |
| Service embed ([`florida-small-claims-help.html`](../../florida-small-claims-help.html)) | 1-card `.vcx-sample-embed`; CTA opens sample directly |
| Service embed ([`small-claims-documentation.html`](../../small-claims-documentation.html)) | 1-card `.vcx-sample-embed`; CTA opens sample directly |
| CollectionPage schema (hub) | `hasPart[*]` with `isAccessibleForFree: true` |
| Sitemap (`sitemap.xml`) | Sample cluster at `monthly · 0.6` |

*Note on dual embed*: appearing on two service pages is by design per ADR-008 §embed-contract — both pages sell the documentation workflow to different intake flows (consumer vs. business). No duplicate-content SEO risk because the embed only **links** to the canonical sample; it does not **copy** the sample content.

## Schema contract (JSON-LD)

Rendered inline in `samples/small-claims-chronology.html`.

- `@type`: `CreativeWork`
- `@id`: `https://vitacorexllc.com/samples/small-claims-chronology.html#sample`
- `name`: `Small Claims Chronology — Sample Deliverable`
- `url`: `https://vitacorexllc.com/samples/small-claims-chronology.html`
- `isAccessibleForFree`: **`true`** (open)
- `inLanguage`: `["en", "ru", "es"]`
- `genre`: `redacted-sample`
- `educationalUse`: `procurement-evaluation`
- `license`: `https://vitacorexllc.com/terms-of-use.html`
- `dateCreated` / `dateModified`: `2026-04-19`
- `version`: `1.0`
- `creator` / `publisher`: VCX `Organization` block

BreadcrumbList chain: Home → Samples → Small Claims Chronology.

Verified PASS by [`scripts/verify-sample-schema.js`](../../scripts/verify-sample-schema.js) §(A).

## Redaction rubric applied (per ADR-008 §redaction)

**Redacted**:
- Plaintiff / defendant names, addresses, phone numbers
- Specific county / court case numbers
- Dollar amounts (kept as bands)
- Specific dates (kept relative: "Day 0 · Day +14 · Day +21" style)
- Counsel names on either side

**Kept verbatim**:
- Chronology structure (date column · event column · exhibit-pointer column · note column)
- Timeline-index format (monthly bucket + per-bucket event count)
- Evidence-pointer rubric (exhibit letter → page range → chronology row linkback)
- UPL disclaimer ("not legal advice · not representation · not court filing · documentation assistance is organizational, pre-staging P05 §small-claims-UPL-guardrail")
- Florida small-claims procedural landmarks that are public-record general knowledge (e.g., "pre-trial conference typically scheduled 4-8 weeks after filing")
- Watermark + banner copy

## i18n namespace

- **Namespace**: `smp_small_claims_chronology_*`
- **Catalog source**: inline `window.PAGE_DATA` in `samples/small-claims-chronology.html` (canonical `_mkContent(v)` shape)
- **Trilingual parity**: EN / RU / ES

## Runtime assets

- `assets/css/vcx-sample.css?v=1`
- `assets/js/vcx-sample.js`

(No gate assets — open sample.)

## Change log

| Version | Date | Notes |
|---------|------|-------|
| 1.0 | 2026-04-19 | Initial production (ADR-008 Step 3.2); dual embed on 2 service pages landed in Step 3.4; schema audit locked in Step 3.6. |

## Related

- ADR: [ADR-008](../adr/ADR-008-sample-deliverable-standards.md)
- Service pages: [`florida-small-claims-help.html`](../../florida-small-claims-help.html), [`small-claims-documentation.html`](../../small-claims-documentation.html)
- Pricing ladder: [`pricing-and-engagement-tiers.html`](../../pricing-and-engagement-tiers.html) (Small Claims Documentation lane, ADR-005)
- Verifiers: [`scripts/verify-sample-schema.js`](../../scripts/verify-sample-schema.js)
- Playwright spec: [`tests/e2e/samples.spec.ts`](../../tests/e2e/samples.spec.ts) Suites (1-2)
