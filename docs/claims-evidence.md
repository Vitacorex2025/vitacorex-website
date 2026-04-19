---
title: Claims Evidence Bibliography (per ADR-007)
adr: ADR-007
status: stub (Step 4.2 populated evidence IDs; Step 4.4 will fill retrieval metadata + archive URLs)
created: 2026-04-19
last_reviewed: 2026-04-19
tags: [claims, proof, evidence, citations, adr-007, p04]
---

# Claims Evidence Bibliography (per ADR-007)

> Every row in `docs/claims-inventory.md` with **Final class = citable** points here via its `Evidence ref` column. Every entry below is either **active** (Step 4.4 has retrieved + archived the source) or **pending** (Step 4.4 will retrieve).
>
> **Source allowlist** (per ADR-007 §source-allowlist): CFPB · BLS · HFMA · FTC · Urban Institute · Pew · NBER · ACA International · MBA · state agencies (Sunbiz, AOSC) · US Census · US Chamber of Commerce · peer-reviewed journals.
>
> **Not accepted**: vendor marketing, press releases without underlying report, LLM output, unsourced industry blog posts.

## Retrieval contract

Every active entry MUST have:
- `retrieved`: YYYY-MM-DD (date operator fetched the source)
- `url`: live source URL (HTTP 200 at retrieval time)
- `archive`: Wayback Machine / archive.ph URL (HTTP 200 required; mirror of the live URL at retrieval time — **HTTP 404 on archive is a fatal build error**)
- `excerpt`: verbatim quote or data point the claim rests on

---

## Active citations

### cite-fl-rule-7050 — Florida Rules of Civil Procedure 7.050 (small-claims $8,000 ceiling)

- **Status**: pending (Step 4.4 will retrieve)
- **Jurisdiction**: Florida (Administrative Office of State Courts / Florida Supreme Court)
- **Claim it supports**: "$8,000 ceiling" on `florida-small-claims-help.html` (6 rows)
- **Source candidates**:
  - Florida Rules of Civil Procedure (published by Florida Supreme Court)
  - Florida Bar — Small Claims Rules reference page
  - flcourts.gov — Rules of Civil Procedure
- **retrieved**: _pending Step 4.4_
- **url**: _pending_
- **archive**: _pending_
- **excerpt**: _pending_

### cite-fl-sunbiz-fees — Florida Division of Corporations fee schedule

- **Status**: pending (Step 4.4 will retrieve)
- **Jurisdiction**: Florida Department of State, Division of Corporations (Sunbiz)
- **Claim it supports**: $138.75 annual report · $125 Articles of Organization · $150 and $400 filing variants (on `llc-formation-florida.html`, 4 rows)
- **Source candidates**:
  - sunbiz.org — Fees and Forms page
- **retrieved**: _pending Step 4.4_
- **url**: _pending_
- **archive**: _pending_
- **excerpt**: _pending_

### cite-uscis-n400-civics — USCIS N-400 Civics Test Policy Manual

- **Status**: pending (Step 4.4 will retrieve)
- **Jurisdiction**: US Citizenship and Immigration Services (federal)
- **Claim it supports**: "up to 10 questions. You must answer at least 6 correctly to pass" on `n-400-naturalization.html` (1 row)
- **Source candidates**:
  - USCIS Policy Manual Vol 12 Part E Ch 2 — English and Civics Testing
  - uscis.gov — Civics Test (2008 version)
- **retrieved**: _pending Step 4.4_
- **url**: _pending_
- **archive**: _pending_
- **excerpt**: _pending_

### cite-census-miami-demographics — US Census QuickFacts, Miami-Dade County

- **Status**: pending (Step 4.4 will retrieve)
- **Jurisdiction**: US Census Bureau (federal, American Community Survey 5-year estimates)
- **Claim it supports**: "Miami's population is over 70% Hispanic or Latino" on `revenue-recovery-miami.html` (1 row)
- **Source candidates**:
  - census.gov/quickfacts/miamidadecountyflorida
- **retrieved**: _pending Step 4.4_
- **url**: _pending_
- **archive**: _pending_
- **excerpt**: _pending_

### cite-us-chamber-precol — US Chamber of Commerce, pre-collection recovery benchmark

- **Status**: pending (Step 4.4 will retrieve)
- **Jurisdiction**: US Chamber of Commerce (industry research)
- **Claim it supports**: "25–33% pre-collection recovery" + "35–55¢ per $1 recovered" + "10–14¢ per $1 net to creditor after agency contingency" — `pre-collection-pilot.html` line 350 · `revenue-recovery-florida.html` line 242 · `vitacorex-vs-traditional-agency.html` lines 113, 127, 133, 168
- **Source candidates**:
  - US Chamber of Commerce Commercial Collection Agency section
  - Commercial Law League of America
  - Fallback: ACA International industry reports
- **retrieved**: _pending Step 4.4_
- **url**: _pending_
- **archive**: _pending_
- **excerpt**: _pending_
- **Note**: If US Chamber source not retrievable at 25–33% figure, Step 4.4 demotes these rows to `illustrative` with caveat "industry-reported range; methodology varies across reports".

### cite-aca-contingency — ACA International contingency commission range (25–50%)

- **Status**: pending (Step 4.4 will retrieve)
- **Jurisdiction**: ACA International (Association of Credit and Collection Professionals)
- **Claim it supports**: "25–50% contingency commission" industry benchmark on `faq.html` line 133 · `vitacorex-vs-traditional-agency.html` lines 138, 224
- **Source candidates**:
  - ACA International industry reports
  - Commercial Collection Agency Association
  - CFPB Debt Collection Market Monitor (for cross-reference)
- **retrieved**: _pending Step 4.4_
- **url**: _pending_
- **archive**: _pending_
- **excerpt**: _pending_

### cite-industry-aging-curve — Industry aging-curve recoverability benchmark

- **Status**: pending (Step 4.4 will retrieve)
- **Jurisdiction**: industry aggregate (prefer ACA International, CFPB Debt Collection Market Monitor, or Commercial Law League of America)
- **Claim it supports**: "70–90% recoverability on invoices under 6 months old, dropping to 45–55% at 6 months, 15–30% at 12 months, 1–5% charged-off" on `vitacorex-vs-traditional-agency.html` line 220 + "typical 20–30% post-collection retention" on `index.html` line 749
- **Source candidates**:
  - ACA International aging-curve reports
  - CFPB Debt Collection Market Monitor annual
  - Dun & Bradstreet Commercial Collection Index
- **retrieved**: _pending Step 4.4_
- **url**: _pending_
- **archive**: _pending_
- **excerpt**: _pending_
- **Note**: If no single source covers the full aging curve, Step 4.4 may split this into `cite-industry-aging-curve-recent` + `cite-industry-aging-curve-aged`.

---

## Internal (non-citable) evidence pointers

These IDs appear in `docs/claims-inventory.md` on **illustrative**, **internal**, and **out-of-scope** rows. They are **not citations** — they are pointers to internal justification for why the row is not citable.

### internal-composite-engagement

- **Applies to**: all `case-study-*.html` rows (60) · `index.html` impact counter + featured examples (27) · `corporate-legal-file-control.html` attorney-cleanup widget (3) · `pre-collection-pilot.html` recovery range chart (2) · `solutions.html` ROI figure (1) · industry-* file-readiness KPI targets
- **Rationale**: internal composite engagement data across VitaCoreX's studio work; not drawn from a single named client; not publishable with attribution
- **Treatment**: each row gets `.vcx-claim-caveat` (inline) OR composite case-study banner (case-study pages) OR composite counter strip (home counter grid) per ADR-007 §visible-caveat-contract

### internal-scope-definition

- **Applies to**: rows where "up to N [pages/documents/cases/questions/addresses/blocks]" describes service capacity, not outcome claim
- **Rationale**: scope/capacity language governs what a deliverable INCLUDES, not what an outcome WILL BE; no caveat needed
- **Examples**: `additional-services.html:183` "up to 30 pages + appendix" · `contract-review-service.html:243` "Up to 3 related documents" · `small-claims-documentation.html:352` "Up to 3 cases per business day"

### internal-disclaimer

- **Applies to**: rows where the scanner matched an outcome word (guaranteed, recovered, etc.) that appears INSIDE an explicit negation/disclaimer (e.g. "we do not promise guaranteed outcomes")
- **Rationale**: the disclaimer itself is the guard against overclaim; deleting it would be harmful
- **Examples**: `industries.html:176` "We do not promise guaranteed outcomes or fixed dollar recovery" · `faq.html:119` "We guarantee the workflow... not a specific recovery percent" · `vitacorex-vs-traditional-agency.html:231` "Figures are industry benchmarks... not guaranteed outcomes"

### internal-kpi-label

- **Applies to**: KPI labels, form-field labels, table headers, and process descriptions that use outcome words ("recovered", "reduced", "average", "typical") as category names rather than quantitative claims
- **Rationale**: labels describe what a metric IS, not what it WILL BE
- **Examples**: `corporate-legal-file-control.html:139` "Average attorney cleanup hours per matter" · `faq.html:168` "cash recovered, contact rate, promise-to-pay conversion" · `industry-subscription-recurring.html:143` "rescue-eligible vs churn-expected cohort segmentation"

### internal-heading

- **Applies to**: section headings, filter labels, and card titles that use outcome-ish words without making an outcome claim
- **Rationale**: "Best for X" is routing language; "Where this fits best" is a heading; neither asserts an outcome
- **Examples**: `contact.html:104` "Best for document-ready matters" · `index.html:469` "Best fit" · `corporate-legal-file-control.html:290` "Where this fits best"

### internal-legal

- **Applies to**: legal-terms / liability-limitation text in `terms-of-use.html`, `privacy.html` (future), and similar policy pages
- **Rationale**: out of P04 proof-discipline scope; governed by legal-language phase (P05)
- **Examples**: `terms-of-use.html:195` "aggregate liability arising from... limited to $100 or the amount you paid"

---

## Pending research queue (Step 4.4)

Every `cite-*` ID above with status `pending` will be resolved in Step 4.4 by:

1. **Retrieve** the live source URL; verify HTTP 200
2. **Archive** via Wayback Machine (`web.archive.org/save/<url>`) or archive.ph; verify HTTP 200 on the archive URL — **404 is fatal and blocks phase close**
3. **Excerpt** the verbatim passage the claim rests on (quote ≤ 300 chars, or paraphrase if quote would be longer)
4. **Update** this file: flip status `pending → active`, fill `retrieved` / `url` / `archive` / `excerpt`
5. **Wire** in `<cite>` tag or footnote link in the source HTML page per Step 4.4 rewrite

If a pending entry cannot be sourced at Step 4.4:
- Operator demotes the inventory row from `citable` → `illustrative` (with composite caveat) OR `needs-source` (kept on queue for next audit cycle)
- Update `scripts/classify-claims.config.js` accordingly
- Regenerate `docs/claims-inventory.md`

---

## Version history

- **2026-04-19**: Step 4.2 created this file with 7 pending cite-IDs + 6 internal pointer IDs (no public retrieval yet). Populated from `docs/claims-inventory.md` Final class = citable rows.
