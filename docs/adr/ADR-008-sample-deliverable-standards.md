# ADR-008 — Sample Deliverable Standards

- **Status**: accepted
- **Date**: 2026-04-19 (accepted at P03 kickoff)
- **Phase**: P03 Sample Deliverables
- **Supersedes**: none
- **Depends on**: ADR-005 (Pricing Tier Architecture) · ADR-006 (Navigation B2B/B2C Split)
- **Obsidian**: [[Upgrade 2026-04/Phases/P03 Sample Deliverables]]

---

## Context

Audit 2026-04-18 §4.2 identified "abstract-service bounce" as the second-largest non-pricing conversion drop behind the IA collision P02 just fixed:

1. **Buyers cannot see the shape of the work.** "Contract review", "AR consulting", "immigration packet" are category labels — the buyer does not know whether VCX's output is a bullet-point email, a 40-page memo, or a procurement-grade artifact. Absent that signal, B2B procurement teams and B2C buyers default to the lowest-risk assumption: "probably thin."
2. **B2B procurement specifically asks for sample deliverables** during vendor screening. Without one, VCX either loses the slot or spends the intake call describing documents that should have been visible before the call.
3. **B2C buyers (contract review, auto deal review, immigration packet)** are being asked to prepay $149–$649 for something they can't preview. That is the single biggest reason B2C CTAs route to consultations (per P08 audit finding §6.2) — buyers are forced into a sales call because they can't self-qualify the output.

The asset we already have — `sample-deliverable.html` (the redacted 30-Day Diagnostic Report) — proves the format works: 664 lines, 3 languages, full redaction discipline, procurement-grade structure. The gap is that this is **one** sample where the audit lists **six**, and the single file is not surfaced as a library. Procurement buyers screening us for fit cannot find sibling samples for the other five deliverable categories.

**Blocking constraint**: P03 cannot ship until ADR-006 (nav IA) is merged (done 2026-04-19 at `1233a18..c439850`) — otherwise samples would have no consistent home in either door.

**Environmental constraint**: Figma MCP token is not yet provisioned (tracked in [[Engineering/MCP Setup Backlog]]). The original P03 Step 3.1 plan called for an InDesign/Figma template → PDF export path. That path is not executable in the current environment, and waiting on it would stall four downstream phases (P03 → P08 checkout; P04 claims; P05 legal; P06 GBP each reference at least one sample card).

---

## Decision

Adopt an **HTML-first, print-compatible, i18n-native sample system** with seven samples published under a single library hub, a shared template contract, and a redaction + disclaimer rubric that pre-stages P05 legal hardening.

### Sample roster (final)

| # | Slug | Title | Audience | Lane page that embeds it | Gating |
|---|------|-------|----------|--------------------------|--------|
| 1 | `ar-leakage-map` | AR Leakage Map | B2B | `revenue-recovery-workflow.html` | **gated** |
| 2 | `counsel-ready-packet` | Counsel-Ready Packet Index | B2B | `corporate-legal-file-control.html` | **gated** |
| 3 | `contract-risk-memo` | Contract Risk Flag Memo | B2C | `contract-review-service.html` | ungated |
| 4 | `small-claims-chronology` | Small Claims Chronology | B2C + B2B | `florida-small-claims-help.html` + `small-claims-documentation.html` | ungated |
| 5 | `immigration-evidence-index` | Immigration Evidence Index | B2C | `immigration-packet-review.html` | ungated |
| 6 | `auto-deal-cost-breakdown` | Auto Deal Cost Breakdown | B2C | `auto-deal-review.html` | ungated |
| 7 | `diagnostic-report` | 30-Day Diagnostic Report | B2B | `pre-collection-pilot.html` + `solutions.html` | ungated (already public) |

Sample #7 is the existing `sample-deliverable.html` content, preserved verbatim (structure, 3 language catalogs, 664 lines). It is migrated to `/samples/diagnostic-report.html` with a 301 from the old URL to the new library hub.

### URL scheme

```
/sample-deliverable.html        → library hub (rebuilt in Step 3.3, keeps URL for SEO continuity)
/samples/<slug>.html            → individual sample pages (7 total)
/assets/samples/<slug>.pdf      → print-to-PDF export (optional, side-artifact)
```

- `sample-deliverable.html` keeps its URL (SEO preservation rule from ADR-006 still binds). Its content changes from single-sample to library index, with a prominent link to `/samples/diagnostic-report.html` which carries the content that previously lived at the old URL.
- `/samples/` becomes a new directory with one `index.html`-free hub pattern (the library hub is the flat `sample-deliverable.html` URL, not `/samples/index.html`, to preserve inbound links).
- `assets/samples/*.pdf` is an **optional** export directory — created when the author uses browser Print-to-PDF on the HTML sample. The HTML is the canonical; the PDF is a convenience artifact for procurement teams that want an attachment.

### Template contract (every sample follows this)

```
┌─ Cover ────────────────────────────────┐
│  Eyebrow: "Sample deliverable · Redacted"
│  H1: <Sample title>
│  Lead: one paragraph — what this is, who
│        it's for, why it's redacted, and
│        what is identical to a live file.
│  Side card: Redaction standard + UPL/FDCPA line
├─ Document header (metadata table) ─────┤
│  Client (REDACTED) · Engagement type ·
│  Prepared by (VitaCoreX LLC + lead) ·
│  Distribution list · Version + date
├─ TOC (section numbers + titles) ───────┤
├─ Section 1 — Executive summary ────────┤
│  5 observations, each tied to dollar
│  magnitude or concrete risk unit.
│  No recommendation in Section 1.
├─ Section 2 — Methodology ──────────────┤
│  3-phase breakdown: collection → audit → synthesis
│  Read-only data access notes.
├─ Section 3 — Findings by domain ───────┤
│  Each finding: Observation → Impact →
│  Root cause → Recommendation (four lines)
├─ Section 4 — Range-framed outcome band ┤
│  Low/High/mid — never single-point.
│  Assumptions underlying the band listed.
├─ Section 5 — Prioritized roadmap ──────┤
│  Time-windowed (Days 1–30, 31–60, 61–90).
│  Not a quote; scope/price negotiated separately.
├─ Section 6 — Out of scope ─────────────┤
│  5–6 explicit exclusions: no legal
│  representation, no debt-collection,
│  no HIPAA design, no contract renegotiation,
│  no PHI on VCX infra, no outcome warranty.
├─ Closing CTA ──────────────────────────┤
│  Primary: Request un-redacted under NDA
│  Secondary: Review security & compliance
└─ Footer disclaimer ────────────────────┘
```

Samples that don't have a meaningful "6-month outcome band" (Contract Risk Memo, Auto Deal Cost Breakdown) may collapse Section 4 into a per-item risk table; the other five sections are mandatory.

### Watermark discipline

Every sample HTML carries, on every screen AND every printed page:

- **Screen watermark**: diagonal `SAMPLE — NOT A CLIENT DELIVERABLE` across mid-page, 8% opacity, non-interactive (pointer-events: none). CSS class `.vcx-sample-watermark`.
- **Print watermark**: same string repeated in `@page` margin box so it survives print-to-PDF.
- **Header stripe**: sticky top banner `This is a redacted sample · Not a live client document`.
- **Metadata row**: `Sample version: 2026-04-19 · Redacted replica · Not for operational use`.

The watermark is load-bearing — removing it converts a sample into something that could be mistaken for a live client artifact, which triggers UPL / contract-impersonation risk. Any edit that removes the watermark class must be blocked at review.

### Redaction rubric (what gets `[REDACTED]`)

| Field type | Action |
|-----------|--------|
| Client legal name, DBAs, trade names | `[REDACTED]` always |
| Personnel names, titles tied to identity | `[REDACTED]` or generic role ("Lead: [REDACTED], Director") |
| Exact dollar amounts, percentages tied to identifiable company | `$[REDACTED]M` / `[REDACTED]%` (keep unit so shape is visible) |
| Site counts, store counts, case counts that identify the operator | `[REDACTED]` |
| Dates within 90 days of engagement | `[REDACTED]` (long-ago is fine) |
| Specific docket numbers, case numbers, file IDs | `[REDACTED]` |
| State-level geography (country, state) | **not redacted** — shape of work |
| Industry sector | **not redacted** — shape of work |
| Methodology, framework names, internal KPI labels | **not redacted** — shape of work |
| Section numbering, document structure, layout | **not redacted** — the whole point |

The test: a reader should be able to recognize VCX's process, rigor, and tone from a sample, but should not be able to identify the underlying client within reasonable investigative effort.

### Disclaimer boilerplate (top + bottom of every sample)

**Top (above TOC, in a bordered callout):**

> **Redaction standard.** Every item marked `[REDACTED]` was a specific value in the live deliverable — client name, site names, exact balance figures, staff members, and dates. Section headings, methodology, diagnostic logic, and recommendation framing are published verbatim. This redacted version matches the real deliverable page-for-page in structure.

**Bottom (in the footer, after the closing CTA):**

> **VitaCoreX LLC is not a law firm and does not provide legal representation.** This sample is a redacted replica of a deliverable produced under a prior engagement. It is not an offer of service, not legal advice, not a recommendation about any specific matter, and not a warranty of any particular outcome. Any engagement is governed by a separate written Statement of Work. Legal strategy remains the responsibility of licensed counsel.

The bottom disclaimer is a pre-stage of P05 Legal Language Hardening — when P05 writes the global disclaimer architecture (ADR-009), sample pages inherit the global version automatically via shared include. The text above is the minimum floor.

### JSON-LD schema (every sample page)

```json
{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "@id": "https://vitacorexllc.com/samples/<slug>.html#sample",
  "name": "<Sample title>",
  "description": "<1-sentence redacted description>",
  "creator": { "@type": "Organization", "@id": "https://vitacorexllc.com/#org" },
  "publisher": { "@type": "Organization", "@id": "https://vitacorexllc.com/#org" },
  "inLanguage": ["en", "ru", "es"],
  "isAccessibleForFree": true | false,  // true for B2C, false (gated) for AR Leakage Map + Counsel-Ready Packet
  "educationalUse": "procurement-evaluation",
  "genre": "redacted-sample",
  "license": "https://vitacorexllc.com/terms-of-use.html",
  "copyrightHolder": { "@type": "Organization", "@id": "https://vitacorexllc.com/#org" },
  "dateCreated": "2026-04-19",
  "dateModified": "2026-04-19",
  "version": "1.0",
  "keywords": ["sample deliverable", "redacted", "<domain>", "procurement review"]
}
```

Plus a `BreadcrumbList` on every sample page: Home → Samples (library hub) → <Sample title>. Audience: `shared` (the library hub itself carries both-door exposure; individual samples inherit the lane from their embed page but the sample itself is shared/visible to both audiences).

### i18n contract

Every sample page loads `vcx-translations.js` and uses namespaced keys:

```
smp_<slug>_<section>_<field>
```

Example: `smp_ar_leakage_hero_h1`, `smp_contract_risk_find_1_title`, `smp_diagnostic_scope_li3`.

Three language coverage (EN/RU/ES) is **mandatory** per sample — no "EN-only" sample ships. The existing `PAGE_DATA` inline catalog pattern on `sample-deliverable.html` (line 22+) is grandfathered for sample #7 (diagnostic report). New samples #1–#6 use the shared `VCX_TRANSLATIONS` catalog pattern (the one already canonical across all other pages since P02 Step 2.2).

### Audience tagging

```
/sample-deliverable.html             body[data-audience="shared"]  (library hub, both-door visible)
/samples/ar-leakage-map.html         body[data-audience="b2b"]
/samples/counsel-ready-packet.html   body[data-audience="b2b"]
/samples/contract-risk-memo.html     body[data-audience="b2c"]
/samples/small-claims-chronology.html body[data-audience="shared"]  (B2C + B2B both claim it)
/samples/immigration-evidence-index.html body[data-audience="b2c"]
/samples/auto-deal-cost-breakdown.html body[data-audience="b2c"]
/samples/diagnostic-report.html      body[data-audience="b2b"]
```

These map into the P02 sitemap clusters (ADR-006 §audience). Samples get added to `scripts/generate-sitemap.js` classification in Step 3.3.

### Gating architecture

**Ungated samples (5 of 7)**: direct click → sample page opens, no form, no email capture. Contract Risk Memo, Small Claims Chronology, Immigration Evidence Index, Auto Deal Cost Breakdown, Diagnostic Report. These de-risk B2C purchase (P08) and give B2B procurement immediate self-service.

**Gated samples (2 of 7)**: AR Leakage Map and Counsel-Ready Packet Index. These are the two B2B samples that procurement teams asked for during the audit interviews — they carry the highest perceived value and the highest commercial sensitivity. Gating produces a qualified-company email list that P07 (B2B Outbound) and P10 (CRM) will consume.

**Gating form fields (minimum)**: company name, role (CFO / Controller / Legal / Ops / Procurement / Other), work email (blocked: freemail domains on the two gated samples — allowed on all other form surfaces), AR portfolio size band (<$500K / $500K–$2M / $2M–$10M / $10M+). No phone required. Form submission: POST to `vcx-api.onrender.com/sample-request` → backend emails the sample PDF link + records lead in CRM queue (CRM deferred to P10; until then, the queue is a simple append-only log the team reads manually).

**The gating UI** is deferred to Step 3.5 of the phase plan. This ADR locks that two samples are gated, five are ungated, and the qualification fields are the four above.

### Print CSS contract

Every sample page includes `@media print` rules that:
- Set `@page { size: A4; margin: 18mm 14mm }`
- Place the top header and watermark inside `@page` margin boxes so they repeat per printed page
- Disable navigation, CTA buttons, and footer links (they print as dead surface, not clickable)
- Force `page-break-before: always` on each numbered section
- Render TOC with page numbers via `target-counter()` where the browser supports it; fall back to section numbers otherwise

Target size for browser-exported PDF: 6–12 A4 pages per sample, <2MB PDF.

### Embedding contract

Each lane page that embeds a sample uses a shared card component:

```html
<aside class="vcx-sample-card" data-sample="<slug>" data-audience="b2b|b2c">
  <span class="vcx-sample-card__eyebrow">Sample deliverable</span>
  <h3 class="vcx-sample-card__title" data-page="smp_embed_<slug>_title">…</h3>
  <p class="vcx-sample-card__lead" data-page="smp_embed_<slug>_lead">…</p>
  <a class="vcx-sample-card__cta" href="/samples/<slug>.html" data-page="smp_embed_<slug>_cta">Open sample →</a>
  <p class="vcx-sample-card__note" data-page="smp_embed_<slug>_note">Redacted replica · Not a live client document</p>
</aside>
```

The card is injection-friendly (Step 3.4 script, analogous to `scripts/rollout-footer.js` from P02). Every embed uses the same DOM so CSS + i18n are centrally maintained.

### Library hub layout (`sample-deliverable.html`, rebuilt)

The rebuilt hub:
- Preserves the page title, canonical, 3-lang hreflang, and SEO metadata (SEO continuity from ADR-006 URL preservation rule).
- Replaces the single-sample body with a 7-card grid. Grid order: B2B samples first (AR Leakage Map, Counsel-Ready Packet, Diagnostic Report), then shared (Small Claims Chronology), then B2C (Contract Risk, Immigration Evidence, Auto Deal Cost Breakdown). This mirrors the ADR-006 B2B-dominant lane hierarchy.
- Each card: audience badge + title + 2-line description + CTA (`Open sample` ungated OR `Request sample` gated).
- Top-of-hub explainer paragraph names the redaction standard and the UPL/FDCPA boundary (no UPL/FDCPA exposure because these are not client artifacts).
- Sticky `body[data-audience="shared"]` since the hub is visible to both doors.

### Execution sequencing (phase-plan compression)

Original P03 plan had 7 steps. With the HTML-first decision above:

- **Step 3.1** (this ADR) — standards locked, template contract defined, sample roster final, URL scheme chosen, redaction + disclaimer rubrics frozen. No PDFs produced in Step 3.1; no HTML produced in Step 3.1 either — pure architecture.
- **Step 3.2** — produce 6 new HTML samples under `/samples/` using the template contract. `diagnostic-report.html` moves from the root to `/samples/` in the same step with content preserved (ADR-allowed mechanical migration).
- **Step 3.3** — rebuild `sample-deliverable.html` as the library hub (7-card grid).
- **Step 3.4** — script-based embed of the `.vcx-sample-card` component on the seven lane pages listed in the roster table above.
- **Step 3.5** — gating form scaffold for the two B2B samples (AR Leakage Map, Counsel-Ready Packet Index). CRM integration deferred to P10; log the lead to an append-only file or a protected admin-view endpoint.
- **Step 3.6** — JSON-LD CreativeWork + BreadcrumbList on every sample page. Sitemap generator updated to include new `/samples/*` URLs in the shared-lane cluster (or a new `samples` sub-cluster).
- **Step 3.7** — full smoke (node --check, grep for watermark class presence, schema parse, broken-link scan), i18n audit (EN/RU/ES parity per sample), cache-bump, vault close.

---

## Alternatives considered

### A) Figma/InDesign → static PDF only (original plan)
**Rejected**: requires Figma MCP token (not provisioned), requires a DTP round-trip per sample edit, PDFs are not SEO-crawlable, cannot be i18n-switched at runtime, cannot inherit the global disclaimer when P05 ships. HTML-first inverts all four failures. PDF export remains available via browser Print-to-PDF.

### B) Markdown samples rendered via static-site generator (Jekyll/Hugo)
**Rejected**: the site is not Jekyll/Hugo; introducing one for six files is disproportionate. The existing HTML + `VCX_TRANSLATIONS` pattern is already the site-wide standard.

### C) One combined sample page with anchor-linked sections (no new URLs)
**Rejected**: procurement teams specifically asked for shareable sample links per deliverable type. A single long page forces them to deep-link into a section, which breaks when we revise structure. Per-URL samples give them durable citation targets.

### D) Gating all seven samples (email-gate the library entirely)
**Rejected**: five of seven are B2C purchase-adjacent. Gating a B2C sample at $149 price point is friction that kills the self-qualify loop. B2B samples are the only two with commercial sensitivity that justifies capture.

### E) Preserve `/sample-deliverable.html` as the diagnostic report + create `/samples-library.html` as the new hub
**Considered, then rejected**: clean URL split, but it fragments inbound links and breaks the P02 sitemap classification we just stabilized. Instead, `/sample-deliverable.html` is re-purposed as the hub (keeps inbound links + SEO) and the diagnostic content migrates to `/samples/diagnostic-report.html` with a 301 at the server level if the old `/sample-deliverable.html#section-N` deep-links appear in analytics.

### F) One set of samples in English only, translate later
**Rejected**: the existing diagnostic report (sample #7) is already trilingual. Shipping EN-only samples would be a regression from the current floor. Trilingual is the baseline.

### G) No watermark (cleaner-looking samples)
**Rejected**: without a persistent watermark, any copy of a sample can be represented as a live client artifact. That exposes VCX to UPL / contract-impersonation claims in a state where practice-of-law lines are regulated. The watermark is a regulatory control, not a stylistic choice.

---

## Consequences

### Positive
- Buyers see the shape of the work before contract or intake call. Procurement asks for samples; we have samples.
- B2C purchase friction drops: the $149–$649 price points now have a 2-minute self-preview. P08 checkout inherits this as a de-risking asset.
- HTML samples are SEO surface — Google indexes them, which widens top-of-funnel coverage beyond the service-page set.
- i18n-native samples mean RU/ES buyers see redacted work in their own language, a first on the site for this category of asset.
- JSON-LD CreativeWork + BreadcrumbList adds 7 schema surfaces that Google can reward.
- Two gated samples produce a qualified B2B lead list that P07 (Outbound) and P10 (CRM) consume on arrival.
- Watermark + disclaimer pre-stage P05 legal hardening — no re-work when the global disclaimer lands.

### Negative
- Seven new pages to maintain. Translation keys grow by ~150–250 per sample × 7 samples × 3 languages → ~3,000–5,000 catalog entries. Mitigated by the existing `VCX_TRANSLATIONS` pattern scaling linearly (Step 1.10 already added 57 entries × 3 langs with no architectural change).
- Gating form needs a backend route. Current backend (`vcx-api.onrender.com`) does not yet have `/sample-request`. Backend work is deferred to Step 3.5; the UI scaffold lands first with a "coming soon" state that still captures form data to local storage until the route is live.
- Print-to-PDF fidelity varies across browsers. Mitigated by keeping the Print CSS minimal and print-tested in Chrome + Firefox; Safari and Edge are best-effort.
- Some buyers will skim only the cover and miss the "sample, not live" framing. Mitigated by persistent watermark + sticky top banner + bottom disclaimer — three non-skippable surfaces.

### Reversible via
- Revert P03 commit range
- Remove `/samples/` directory — samples are additive, no existing functionality depends on them
- Library hub at `sample-deliverable.html` can be rolled back to single-sample content without URL change
- Gating form is additive — removal is a CSS display:none + route removal

---

## Links

- Obsidian phase: [[Upgrade 2026-04/Phases/P03 Sample Deliverables]]
- Audit source: [[Upgrade 2026-04/Research/Site Audit 2026-04-18]] §4.2
- Depends on: ADR-005 (Pricing) · ADR-006 (Navigation)
- Unblocks: P08 (Checkout — needs samples to de-risk purchase) · P04 (Claims — samples are provable claims) · P07 (Outbound — gated samples feed lead list)
- Related: P05 (Legal) will inherit sample disclaimer scaffolding automatically when ADR-009 lands
