---
title: Contract Risk Flag Memo — Sample Deliverable
slug: contract-risk-memo
audience: b2c
gated: false
url: https://vitacorexllc.com/samples/contract-risk-memo.html
version: "1.0"
date_created: 2026-04-19
date_modified: 2026-04-19
last_reviewed: 2026-04-19
adr: ADR-008
status: live
tags: [sample, b2c, open, contract-review, private-client]
---

# Contract Risk Flag Memo — Sample Deliverable

> Redacted sample of the $149 contract review deliverable: 10-point risk rubric applied to a retail services agreement with marked redactions.

## Purpose

Private-client buyers purchasing the **$149 Contract Review** service (ADR-005 Tier 1) need to see what they receive before paying. This sample shows the deliverable shape and tone — an operational review memo, not a legal opinion.

**Operator value proposition**: "You paid $149 for a fixed-scope review. Here is what a $149 review looks like: 10 risk flags, each mapped to the clause that triggered it, each with a suggested question to bring to your own counsel. Not legal advice. Not a rewrite. Plain-English flags on risk surfaces you can act on before signing."

## Audience + gating

- **Audience**: B2C / Private Client (consumers, sole proprietors, small-business owners).
- **Gating**: **open** — directly readable at `/samples/contract-risk-memo.html`.

## Where it's referenced

| Location | How it appears |
|----------|---------------|
| Library hub ([`sample-deliverable.html`](../../sample-deliverable.html)) | B2C teal `.vcx-hub-card` (open); CTA opens sample directly |
| Service embed ([`contract-review-service.html`](../../contract-review-service.html)) | 1-card `.vcx-sample-embed`; CTA opens sample directly |
| CollectionPage schema (hub) | `hasPart[*]` with `isAccessibleForFree: true` |
| Sitemap (`sitemap.xml`) | Sample cluster at `monthly · 0.6` |

## Schema contract (JSON-LD)

Rendered inline in `samples/contract-risk-memo.html`.

- `@type`: `CreativeWork`
- `@id`: `https://vitacorexllc.com/samples/contract-risk-memo.html#sample`
- `name`: `Contract Risk Flag Memo — Sample Deliverable`
- `url`: `https://vitacorexllc.com/samples/contract-risk-memo.html`
- `isAccessibleForFree`: **`true`** (open)
- `inLanguage`: `["en", "ru", "es"]`
- `genre`: `redacted-sample`
- `educationalUse`: `procurement-evaluation`
- `license`: `https://vitacorexllc.com/terms-of-use.html`
- `dateCreated` / `dateModified`: `2026-04-19`
- `version`: `1.0`
- `creator` / `publisher`: VCX `Organization` block

BreadcrumbList chain: Home → Samples → Contract Risk Flag Memo.

Verified PASS by [`scripts/verify-sample-schema.js`](../../scripts/verify-sample-schema.js) §(A).

## Redaction rubric applied (per ADR-008 §redaction)

**Redacted**:
- Parties to the contract (both sides)
- Specific dollar amounts (kept as bands)
- Jurisdiction specifics that would identify the matter
- Dates that fingerprint the deal

**Kept verbatim**:
- 10-flag rubric and category taxonomy (termination · auto-renewal · indemnity · cap on liability · IP · dispute forum · damages carve-outs · fees-on-fees · notice · governing law)
- Plain-English explanation of each flag
- "Questions to bring to your own counsel" list format
- UPL disclaimer ("not legal advice · not a legal opinion · does not substitute for an attorney review", pre-staging P05)
- Watermark + banner copy

## i18n namespace

- **Namespace**: `smp_contract_risk_memo_*`
- **Catalog source**: inline `window.PAGE_DATA` in `samples/contract-risk-memo.html` (canonical `_mkContent(v)` shape)
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
- Service page: [`contract-review-service.html`](../../contract-review-service.html)
- Pricing ladder: [`pricing-and-engagement-tiers.html`](../../pricing-and-engagement-tiers.html) (ADR-005 Contract Review Tier 1 $149)
- Verifiers: [`scripts/verify-sample-schema.js`](../../scripts/verify-sample-schema.js)
- Playwright spec: [`tests/e2e/samples.spec.ts`](../../tests/e2e/samples.spec.ts) Suites (1-2)
