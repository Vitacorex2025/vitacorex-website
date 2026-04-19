---
title: Auto Deal Cost Breakdown — Sample Deliverable
slug: auto-deal-cost-breakdown
audience: b2c
gated: false
url: https://vitacorexllc.com/samples/auto-deal-cost-breakdown.html
version: "1.0"
date_created: 2026-04-19
date_modified: 2026-04-19
last_reviewed: 2026-04-19
adr: ADR-008
status: live
tags: [sample, b2c, open, auto-deal, private-client]
---

# Auto Deal Cost Breakdown — Sample Deliverable

> Redacted sample of the $149 auto deal review deliverable: line-by-line cost breakdown with flagged add-ons and negotiation pointers.

## Purpose

Private-client buyers considering the **$149 Auto Deal Review** (with optional same-day rush +$49) need to see the artifact before paying. This sample shows the deliverable shape — a structured cost breakdown with redacted numbers, flagged add-ons (the "where they pad the deal" section), and plain-English questions to bring to the dealer.

**Operator value proposition**: "You uploaded the deal sheet. Here is the line-by-line breakdown with every fee named, every add-on flagged as negotiable vs. non-negotiable, and every back-end product explained in plain English. Bring these questions to the dealer. Not legal advice. Not a negotiation service. Review, not repair."

## Audience + gating

- **Audience**: B2C / Private Client (car buyers — new and used, consumer and small-fleet).
- **Gating**: **open** — directly readable at `/samples/auto-deal-cost-breakdown.html`.

## Where it's referenced

| Location | How it appears |
|----------|---------------|
| Library hub ([`sample-deliverable.html`](../../sample-deliverable.html)) | B2C teal `.vcx-hub-card` (open); CTA opens sample directly |
| Service embed ([`auto-deal-review.html`](../../auto-deal-review.html)) | 1-card `.vcx-sample-embed`; CTA opens sample directly |
| CollectionPage schema (hub) | `hasPart[*]` with `isAccessibleForFree: true` |
| Sitemap (`sitemap.xml`) | Sample cluster at `monthly · 0.6` |

## Schema contract (JSON-LD)

Rendered inline in `samples/auto-deal-cost-breakdown.html`.

- `@type`: `CreativeWork`
- `@id`: `https://vitacorexllc.com/samples/auto-deal-cost-breakdown.html#sample`
- `name`: `Auto Deal Cost Breakdown — Sample Deliverable`
- `url`: `https://vitacorexllc.com/samples/auto-deal-cost-breakdown.html`
- `isAccessibleForFree`: **`true`** (open)
- `inLanguage`: `["en", "ru", "es"]`
- `genre`: `redacted-sample`
- `educationalUse`: `procurement-evaluation`
- `license`: `https://vitacorexllc.com/terms-of-use.html`
- `dateCreated` / `dateModified`: `2026-04-19`
- `version`: `1.0`
- `creator` / `publisher`: VCX `Organization` block

BreadcrumbList chain: Home → Samples → Auto Deal Cost Breakdown.

Verified PASS by [`scripts/verify-sample-schema.js`](../../scripts/verify-sample-schema.js) §(A).

## Redaction rubric applied (per ADR-008 §redaction)

**Redacted**:
- Buyer name, trade-in VIN, license plate
- Dealer name / address / F&I manager name
- Specific dollar amounts (kept as ranges where needed for category illustration)
- Deal date

**Kept verbatim**:
- Line-item taxonomy (MSRP · selling price · trade allowance · rebates · dealer fees · title · taxes · add-on products · F&I products · APR/term · monthly payment)
- Add-on flag rubric (non-negotiable · negotiable · waivable · back-end padding)
- Negotiation-pointer format ("questions to bring to the dealer")
- UPL + consumer-protection disclaimer ("not legal advice · not a negotiation service · review is organizational, not repair", pre-staging P05)
- Same-day rush acknowledgment line (ADR-005 §5 rush policy)
- Watermark + banner copy

## i18n namespace

- **Namespace**: `smp_auto_deal_cost_breakdown_*`
- **Catalog source**: inline `window.PAGE_DATA` in `samples/auto-deal-cost-breakdown.html` (canonical `_mkContent(v)` shape)
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
- Service page: [`auto-deal-review.html`](../../auto-deal-review.html)
- Pricing ladder: [`pricing-and-engagement-tiers.html`](../../pricing-and-engagement-tiers.html) (ADR-005 Auto Deal Review Tier 1 $149 + rush +$49)
- Verifiers: [`scripts/verify-sample-schema.js`](../../scripts/verify-sample-schema.js)
- Playwright spec: [`tests/e2e/samples.spec.ts`](../../tests/e2e/samples.spec.ts) Suites (1-2)
