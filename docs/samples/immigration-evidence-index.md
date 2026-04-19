---
title: Immigration Evidence Index — Sample Deliverable
slug: immigration-evidence-index
audience: b2c
gated: false
url: https://vitacorexllc.com/samples/immigration-evidence-index.html
version: "1.0"
date_created: 2026-04-19
date_modified: 2026-04-19
last_reviewed: 2026-04-19
adr: ADR-008
status: live
tags: [sample, b2c, open, immigration, document-packets, private-client]
---

# Immigration Evidence Index — Sample Deliverable

> Redacted sample of the immigration packet evidence index: exhibit list, page map, categorization against the form's required-evidence schedule.

## Purpose

Private-client buyers purchasing **Immigration Packet Review** (ADR-005 Tier 1/2/3 — $149/$349/$649 per complexity) need to see the artifact that accompanies a filing. The evidence index is the operational spine of a packet: exhibit list, page-map to the filing form, and categorization against the form's required-evidence schedule.

**Operator value proposition**: "The form tells you *what evidence is required*. The index shows *where it is in your packet*, *what category it satisfies*, and *what gaps remain*. Not legal advice. Not form selection. Not eligibility assessment. Organizational completeness for the document packet you compile for your own counsel or your own filing."

## Audience + gating

- **Audience**: B2C / Private Client (immigration petitioners, families, sponsors; and their counsel-by-choice).
- **Gating**: **open** — directly readable at `/samples/immigration-evidence-index.html`.

## Where it's referenced

| Location | How it appears |
|----------|---------------|
| Library hub ([`sample-deliverable.html`](../../sample-deliverable.html)) | B2C teal `.vcx-hub-card` (open); CTA opens sample directly |
| Service embed ([`immigration-packet-review.html`](../../immigration-packet-review.html)) | 1-card `.vcx-sample-embed`; CTA opens sample directly |
| CollectionPage schema (hub) | `hasPart[*]` with `isAccessibleForFree: true` |
| Sitemap (`sitemap.xml`) | Sample cluster at `monthly · 0.6` |

## Schema contract (JSON-LD)

Rendered inline in `samples/immigration-evidence-index.html`.

- `@type`: `CreativeWork`
- `@id`: `https://vitacorexllc.com/samples/immigration-evidence-index.html#sample`
- `name`: `Immigration Evidence Index — Sample Deliverable`
- `url`: `https://vitacorexllc.com/samples/immigration-evidence-index.html`
- `isAccessibleForFree`: **`true`** (open)
- `inLanguage`: `["en", "ru", "es"]`
- `genre`: `redacted-sample`
- `educationalUse`: `procurement-evaluation`
- `license`: `https://vitacorexllc.com/terms-of-use.html`
- `dateCreated` / `dateModified`: `2026-04-19`
- `version`: `1.0`
- `creator` / `publisher`: VCX `Organization` block

BreadcrumbList chain: Home → Samples → Immigration Evidence Index.

Verified PASS by [`scripts/verify-sample-schema.js`](../../scripts/verify-sample-schema.js) §(A).

## Redaction rubric applied (per ADR-008 §redaction)

**Redacted**:
- Petitioner / beneficiary / sponsor names, DOBs, addresses, case / A-numbers
- Passport / I-94 / visa numbers, employer names, dollar amounts
- Form-specific narrative that would identify a real filing
- Counsel / preparer names

**Kept verbatim**:
- Evidence-index structure (exhibit letter → title → page range → form-section pointer → completeness mark)
- Category taxonomy (identity · relationship · eligibility · financial support · status history · supporting narrative · exhibits index)
- Gap-report format
- UPL disclaimer ("not legal advice · not form selection · not eligibility assessment", pre-staging P05 §UPL-immigration-guardrail)
- Watermark + banner copy

## i18n namespace

- **Namespace**: `smp_immigration_evidence_index_*`
- **Catalog source**: inline `window.PAGE_DATA` in `samples/immigration-evidence-index.html` (canonical `_mkContent(v)` shape)
- **Trilingual parity**: EN / RU / ES

## Runtime assets

- `assets/css/vcx-sample.css?v=1`
- `assets/js/vcx-sample.js`

(No gate assets — open sample.)

## Change log

| Version | Date | Notes |
|---------|------|-------|
| 1.0 | 2026-04-19 | Initial production (ADR-008 Step 3.2); embed on service page landed in Step 3.4; schema audit locked in Step 3.6. |

## Related

- ADR: [ADR-008](../adr/ADR-008-sample-deliverable-standards.md)
- Service page: [`immigration-packet-review.html`](../../immigration-packet-review.html)
- Pricing ladder: [`pricing-and-engagement-tiers.html`](../../pricing-and-engagement-tiers.html) (ADR-005 Immigration Packet Tier 1/2/3)
- Verifiers: [`scripts/verify-sample-schema.js`](../../scripts/verify-sample-schema.js)
- Playwright spec: [`tests/e2e/samples.spec.ts`](../../tests/e2e/samples.spec.ts) Suites (1-2)
