---
title: Counsel-Ready Packet Index — Sample Deliverable
slug: counsel-ready-packet
audience: b2b
gated: true
url: https://vitacorexllc.com/samples/counsel-ready-packet.html
version: "1.0"
date_created: 2026-04-19
date_modified: 2026-04-19
last_reviewed: 2026-04-19
adr: ADR-008
status: live
tags: [sample, b2b, gated, counsel-handoff, corporate-legal]
---

# Counsel-Ready Packet Index — Sample Deliverable

> Redacted sample of the packet index VitaCoreX produces before a balance moves to counsel — 12-item rubric, scoring, readiness gates.

## Purpose

General counsel, CFOs, and corporate-legal-file-control buyers evaluating whether to move a balance (or a stack of them) into VCX's pre-litigation workflow need to see the **handoff artifact** — the index that shows counsel exactly what arrives and why, scored by a readiness rubric.

**Operator value proposition**: "Before any balance gets routed to outside counsel, we produce this index. 12 rubric items, scored, with readiness gates. Counsel knows whether it's worth spinning up billable hours before they open the first page."

## Audience + gating

- **Audience**: B2B (GC, deputy GC, corporate-legal-file-control buyers, CFO escalation flow).
- **Gating**: **gated** — accessible only after the NDA-intent + contact form on [`samples/request-gated-sample.html?s=counsel-ready-packet`](../../samples/request-gated-sample.html).
- **Access flow**: identical to `ar-leakage-map` — gate page → grant in `localStorage.vcxGatedAccess` → direct navigation passes `hasGrant()`; without a grant, `#vcxGateLock` overlay mounts.

## Where it's referenced

| Location | How it appears |
|----------|---------------|
| Library hub ([`sample-deliverable.html`](../../sample-deliverable.html)) | B2B navy `.vcx-hub-card` with `data-gated-cta="1"`; CTA routes to gate |
| Service embed ([`revenue-recovery-workflow.html`](../../revenue-recovery-workflow.html)) | Right card in the 2-card `.vcx-sample-embed--pair` block; CTA routes to gate |
| CollectionPage schema (hub) | `hasPart[*]` with `isAccessibleForFree: false` |
| Sitemap (`sitemap.xml`) | Sample cluster at `monthly · 0.6` |

*Note on embed placement*: ADR-008 §embed-contract initially named `corporate-legal-file-control.html` as the canonical embed page for this sample. In Step 3.4 the embed landed on `revenue-recovery-workflow.html` (paired with AR Leakage Map) because that page is the topmost-trafficked B2B discovery URL and the pair reads as "diagnose the leak → ready the packet for counsel." The canonical routing invariant that matters (gated-CTA → gate page) is preserved either way; future P07/P08 work can re-embed on `corporate-legal-file-control.html` without changing this sample's contract.

## Schema contract (JSON-LD)

Rendered inline in `samples/counsel-ready-packet.html`.

- `@type`: `CreativeWork`
- `@id`: `https://vitacorexllc.com/samples/counsel-ready-packet.html#sample`
- `name`: `Counsel-Ready Packet Index — Sample Deliverable`
- `url`: `https://vitacorexllc.com/samples/counsel-ready-packet.html`
- `isAccessibleForFree`: **`false`** (gated)
- `inLanguage`: `["en", "ru", "es"]`
- `genre`: `redacted-sample`
- `educationalUse`: `procurement-evaluation`
- `license`: `https://vitacorexllc.com/terms-of-use.html`
- `dateCreated` / `dateModified`: `2026-04-19`
- `version`: `1.0`
- `creator` / `publisher`: VCX `Organization` block

BreadcrumbList chain: Home → Samples → Counsel-Ready Packet Index.

Verified PASS by [`scripts/verify-sample-schema.js`](../../scripts/verify-sample-schema.js) §(A).

## Redaction rubric applied (per ADR-008 §redaction)

**Redacted**:
- Client + counterparty names, industry, matter IDs
- Dollar amounts (kept as ranges)
- Counsel name, firm, jurisdiction-specific identifiers
- Any PII in document excerpts

**Kept verbatim**:
- 12-item rubric (structure, weighting, readiness-gate thresholds)
- Score → readiness outcome mapping
- UPL disclaimer ("we do not practice law; we do not select counsel; readiness scoring is organizational, not legal")
- Watermark + banner copy

## i18n namespace

- **Namespace**: `smp_counsel_ready_packet_*`
- **Catalog source**: inline `window.PAGE_DATA` in `samples/counsel-ready-packet.html` (canonical `_mkContent(v)` shape)
- **Trilingual parity**: EN / RU / ES

## Runtime assets

- `assets/css/vcx-sample.css?v=1`
- `assets/css/vcx-sample-gate.css?v=1` — **`.vcx-gate-lock` overlay (mounted when no grant)**
- `assets/js/vcx-sample.js`
- `assets/js/vcx-sample-gate.js?v=1` defer

## Change log

| Version | Date | Notes |
|---------|------|-------|
| 1.0 | 2026-04-19 | Initial production (ADR-008 Step 3.2); gating wiring landed in Step 3.5; schema audit locked in Step 3.6. |

## Related

- ADR: [ADR-008](../adr/ADR-008-sample-deliverable-standards.md)
- Service pages (referential): [`revenue-recovery-workflow.html`](../../revenue-recovery-workflow.html), [`corporate-legal-file-control.html`](../../corporate-legal-file-control.html)
- Gate page: [`samples/request-gated-sample.html`](../../samples/request-gated-sample.html)
- Verifiers: [`scripts/verify-sample-schema.js`](../../scripts/verify-sample-schema.js), [`scripts/verify-gated-samples.js`](../../scripts/verify-gated-samples.js)
- Playwright spec: [`tests/e2e/samples.spec.ts`](../../tests/e2e/samples.spec.ts) Suite (5) + Suites (6-7)
