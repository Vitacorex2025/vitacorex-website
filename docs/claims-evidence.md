---
title: Claims Evidence Bibliography (per ADR-007)
adr: ADR-007
status: Step 4.4 research checkpoint 2026-04-20 — 3/7 active + 4/7 decision-pending (demote/rebase/rewrite)
created: 2026-04-19
last_reviewed: 2026-04-20
tags: [claims, proof, evidence, citations, adr-007, p04]
---

# Claims Evidence Bibliography (per ADR-007)

> Every row in `docs/claims-inventory.md` with **Final class = citable** points here via its `Evidence ref` column. Every entry below is either **active** (Step 4.4 retrieved + archived the source), **pending** (Step 4.4 will retrieve), or **decision-pending** (Step 4.4 research revealed primary-source gaps; operator must choose demote / rebase / rewrite).
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

## Step 4.4 research summary (2026-04-20)

Research agent ran all 7 pending cite-IDs against the ADR-007 source allowlist. Findings:

| cite ID | Status | Action required |
|---------|--------|-----------------|
| `cite-fl-rule-7050` | **rename** → `cite-fl-rule-7010` | Factual correction: $8,000 ceiling is in Rule 7.010(b), not 7.050. Rule 7.050 governs claim-filing procedure. Active after rename. |
| `cite-fl-sunbiz-fees` | **active (partial)** | $125 Articles of Organization ($100 filing + $25 registered agent) + $138.75 annual report **confirmed** at sunbiz official page. $150 and $400 variants **NOT found** on the LLC fees page. Decision required: drop the unverified variants OR split into sub-cites (LLC vs corp vs foreign-LLC). |
| `cite-uscis-n400-civics` | **active (with date-scope caveat)** | 6-of-10 passing threshold applies **only to filers with N-400 submitted before 2025-10-20** (the "2008 civics test" version). For filers on/after 2025-10-20, the **2025 test** applies: 20 questions drawn from 128, must answer 12 correctly. Site copy on `n-400-naturalization.html` may need date-qualifier to cover both cohorts. |
| `cite-census-miami-demographics` | **decision-pending** | Authoritative Miami-Dade Hispanic/Latino figure is **69.3%** (ACS 2024), not "over 70%". Operator choice: (a) update site copy "over 70%" → "nearly 70%" / "about 69%" to match source; (b) demote row to `illustrative`. |
| `cite-us-chamber-precol` | **demote (partial)** | US Chamber article confirms **only 25–50% contingency range**. Does NOT substantiate the specific figures: 25–33% pre-collection recovery · 35–55¢ per $1 recovered · 10–14¢ per $1 net to creditor. These three rows must demote to `illustrative` (with composite caveat) per ADR-007 §demote-fallback. 25–50% contingency rows can remain citable under this cite or `cite-aca-contingency`. |
| `cite-aca-contingency` | **rebase OR demote** | ACA International's public `/advocacy/collection-industry-basics` page returns HTTP 403 on both live and Wayback fetches. US Chamber (also in allowlist) confirms 25–50% contingency verbatim. Decision: (a) rebase cite URL to US Chamber; (b) demote to `illustrative` until ACA PDF sourced. |
| `cite-industry-aging-curve` | **demote** | **No single allowlist-compliant source covers the full 70–90% / 45–55% / 15–30% / 1–5% aging curve verbatim.** Closest primary sources: CLLA states "likelihood drops from 98% at due date to 27% after 12 months"; CCAA summaries state "73% after 90 days, sub-50% at 6 months". Neither quotes the four-bucket curve. Recommended: demote aging-curve row on `vitacorex-vs-traditional-agency.html` + "20–30% post-collection retention" on `index.html` to `illustrative`. **Scope impact**: `vitacorex-vs-traditional-agency.html`'s core value prop is industry-benchmark comparison — demoting all benchmark rows may require a framing-level copy review to preserve the page's comparative argument. |

### Wayback archive caveat (ADR-008 §HTTP-404-fatal)

WebFetch is blocked from `web.archive.org` directly in the research-agent environment. Archive URLs below were obtained via the Wayback availability API (where snapshots existed) or via the fallback pattern `https://web.archive.org/web/2026/<url>` (Wayback auto-resolves to latest snapshot). Per ADR-008 contract, the release pipeline MUST independently re-verify each archive URL returns HTTP 200 before publish. Several URLs had no snapshots at fetch time and will need on-demand Wayback capture via `https://web.archive.org/save/<url>` before the bibliography ships.

---

## Active citations

### cite-fl-rule-7010 — Florida Rules of Civil Procedure 7.010(b) (small-claims $8,000 ceiling)

> **Renamed from `cite-fl-rule-7050`** (2026-04-20 Step 4.4 research): the $8,000 ceiling lives in Rule 7.010(b), not 7.050. Rule 7.050 governs claim-filing procedure. Every inventory row referencing this claim must be updated to point at `cite-fl-rule-7010`.

- **Status**: active
- **Jurisdiction**: Florida (Administrative Office of State Courts / Florida Supreme Court)
- **Claim it supports**: "$8,000 ceiling" on `florida-small-claims-help.html` (6 rows)
- **retrieved**: 2026-04-20
- **url**: https://www.floridabar.org/the-florida-bar-news/jurisdictional-changes-to-civil-courts-take-effect-in-2023/
- **archive**: https://web.archive.org/web/2026/https://www.floridabar.org/the-florida-bar-news/jurisdictional-changes-to-civil-courts-take-effect-in-2023/ (fallback pattern — pipeline must re-verify HTTP 200 before publish per ADR-008)
- **excerpt**: "Small claims amounts will remain the same, with dispute amounts up to $8,000. [...] county civil courts will hear cases in which the dispute amounts range from $8,000.01 to $50,000; circuit courts will hear cases with dispute amounts greater than $50,000."
- **secondary source** (rule text PDF): https://www-media.floridabar.org/uploads/2025/01/2023_04-OCT-Small-Claims-Rules-10-24-2022.pdf — no Wayback snapshot; fetch live only

### cite-fl-sunbiz-fees — Florida Division of Corporations fee schedule (LLC)

> **Partial coverage** (2026-04-20 Step 4.4 research): $125 total Articles of Organization ($100 filing + $25 registered agent) and $138.75 annual report confirmed. $150 and $400 variants NOT on the official LLC fees page. Operator must drop unverified variants OR split into sub-cites (e.g., `cite-fl-sunbiz-corp-fees` for corporations, `cite-fl-sunbiz-foreign-llc-fees` for foreign-LLC qualification) before citable rows can wire `<cite>` tags.

- **Status**: active (for $125 + $138.75 only)
- **Jurisdiction**: Florida Department of State, Division of Corporations (Sunbiz)
- **Claim it supports** (verified): "$125 Articles of Organization" + "$138.75 annual report" on `llc-formation-florida.html` (2 rows)
- **Claim it does NOT support** (pending decision): $150 and $400 filing variants (2 rows — must demote OR split into new cite)
- **retrieved**: 2026-04-20
- **url**: https://dos.fl.gov/sunbiz/forms/fees/llc-fees/
- **archive**: http://web.archive.org/web/20260405004237/https://dos.fl.gov/sunbiz/forms/fees/llc-fees/
- **excerpt**: "Filing Fee (Required) $100.00 · Registered Agent Fee (Required) $25.00 · Annual Report (& Supplemental Fee) $138.75 · Annual Report (Received after May 1) $538.75"
- **companion url** (full fee schedule): https://dos.fl.gov/sunbiz/forms/fees/

### cite-uscis-n400-civics — USCIS N-400 Civics Test Policy Manual

> **Date-scope caveat** (2026-04-20 Step 4.4 research): 6-of-10 passing threshold applies only to filers with N-400 submitted **before 2025-10-20** (the "2008 test"). For filers on/after 2025-10-20, the **2025 test** applies: 20 questions drawn from 128, must answer 12 correctly. If `n-400-naturalization.html` is recommending the page to 2026 filers, the copy is stale and should cite **both** thresholds (6-of-10 for pre-10/20/25 and 65/20 senior exemption; 12-of-20 for post-10/20/25). Operator decision: update copy to date-qualify OR keep as-is (with scope caveat note below) OR demote to illustrative.

- **Status**: active (with scope caveat)
- **Jurisdiction**: US Citizenship and Immigration Services (federal)
- **Claim it supports** (verified): "up to 10 questions. You must answer at least 6 correctly to pass" for filers before 2025-10-20 and for 65/20 senior exemption filers — on `n-400-naturalization.html` (1 row)
- **retrieved**: 2026-04-20
- **url**: https://www.uscis.gov/policy-manual/volume-12-part-e-chapter-2
- **archive**: http://web.archive.org/web/20260325224141/https://www.uscis.gov/policy-manual/volume-12-part-e-chapter-2
- **companion archive** (test-resource page): http://web.archive.org/web/20260323211413/https://www.uscis.gov/citizenship/learn-about-citizenship/the-naturalization-interview-and-test
- **excerpt (paraphrase; page fetch-gated)**: "The USCIS officer will ask you up to 10 questions from the list of 100 civics test questions. You must answer 6 questions correctly to pass the 2008 naturalization civics test." Applies to N-400 applications filed before Oct. 20, 2025.

---

## Decision-pending citations (operator ratification required)

These 4 cites had their pending-research resolved by Step 4.4 but the findings require operator decisions (demote / rebase / rewrite) before `<cite>` wiring can proceed. Per ADR-007 §demote-fallback, the demote-to-illustrative path is pre-authorized; the specific sub-choices below are not.

### cite-census-miami-demographics — US Census QuickFacts Miami-Dade

- **Status**: decision-pending
- **Research finding**: authoritative Hispanic/Latino figure is **69.3%** (ACS 2024 V2024 estimate). The 2020 Decennial figure was 68.7%. The site's "over 70%" phrasing on `revenue-recovery-miami.html` is NOT supported by the primary source.
- **Operator options**:
  - (A) **Update site copy** from "over 70%" to "nearly 70%" / "about 69%" / "approximately 69% (ACS 2024)" — keeps row citable under this cite
  - (B) **Demote row to illustrative** — keep "over 70%" as illustrative prose with composite-engagement caveat
  - (C) **Seek higher ACS 5-year estimate** — ACS subsets sometimes present higher breakdowns (e.g., Miami city proper vs Miami-Dade county)
- **url**: https://www.census.gov/quickfacts/fact/table/miamidadecountyflorida/PST045224
- **archive**: http://web.archive.org/web/20260101221151/https://www.census.gov/quickfacts/fact/table/miamidadecountyflorida/PST045224
- **excerpt**: Census QuickFacts for Miami-Dade County reports Hispanic or Latino alone at approximately **69.3%** (2024 population estimates, V2024). 2020 Decennial figure: 68.7%.

### cite-us-chamber-precol — US Chamber pre-collection benchmark

- **Status**: demote (partial) — ADR-007 §demote-fallback pre-authorized
- **Research finding**: US Chamber article confirms the 25–50% contingency range ONLY. Does NOT substantiate the specific figures: 25–33% pre-collection recovery · 35–55¢ per $1 recovered · 10–14¢ per $1 net to creditor. These three figures appear to be synthesized/derived, not primary-source quoted.
- **Operator options**:
  - (A) **Demote affected rows to illustrative**: `pre-collection-pilot.html:350` · `revenue-recovery-florida.html:242` · `vitacorex-vs-traditional-agency.html` lines 113, 127, 133, 168 — get composite-engagement caveat; 25–50% rows migrate to `cite-aca-contingency` or new US-Chamber-only cite
  - (B) **Seek Commercial Law League of America or ACA International PDF** with the specific 25–33% / 35–55¢ / 10–14¢ figures (neither currently presents them publicly)
- **url (supports 25–50% contingency only)**: https://www.uschamber.com/co/start/strategy/how-do-debt-collection-agencies-get-paid
- **archive**: https://web.archive.org/web/2026/https://www.uschamber.com/co/start/strategy/how-do-debt-collection-agencies-get-paid
- **excerpt**: "Generally, collection agencies make money through commission or contingency fees — usually between 25 and 50% — based on the amount they successfully recover."

### cite-aca-contingency — ACA International 25–50% contingency range

- **Status**: decision-pending (rebase OR demote)
- **Research finding**: ACA International's public `/advocacy/collection-industry-basics` page returns HTTP 403 on live and Wayback fetches. The 25–50% figure cannot be verified verbatim from ACA's own domain at this time. US Chamber of Commerce (also in allowlist) confirms the figure verbatim.
- **Operator options**:
  - (A) **Rebase cite URL to US Chamber** — both in allowlist; US Chamber fetchable + archived; rename cite to `cite-us-chamber-contingency` or keep name and update url
  - (B) **Demote cite-aca-contingency to `illustrative`** until ACA PDF with figure is located
- **affected rows**: `faq.html:133` · `vitacorex-vs-traditional-agency.html:138, 224`

### cite-industry-aging-curve — Industry aging-curve recoverability

- **Status**: demote — ADR-007 §demote-fallback pre-authorized
- **Research finding**: **No single allowlist-compliant source covers the 70–90% / 45–55% / 15–30% / 1–5% full curve verbatim.** Closest primary sources:
  - Commercial Law League of America: "likelihood drops from 98% at due date to 27% after 12 months"
  - Commercial Collection Agency Association summaries: "73% after 90 days, sub-50% at 6 months"
  - CFPB 2024 FDCPA Annual Report: ~8.8% charge-off rates for revolving debt (different context)
- **Scope impact**: `vitacorex-vs-traditional-agency.html`'s core value prop is industry-benchmark comparison — demoting all benchmark rows may require a framing-level copy review (replace specific percentages with narrative language like "industry aging-curve research consistently shows recoverability declines steeply over the first 12 months" + attribution to a range of sources).
- **Operator options**:
  - (A) **Demote entire curve to illustrative** (ADR-007 §demote-fallback); add composite-caveat paragraph above aging-curve block
  - (B) **Split into narrower sub-cites** using CLLA (27% at 12 mo), CCAA (73% at 90d), CFPB (charge-off rates)
  - (C) **Rewrite page prose** to use narrative range language rather than specific percentages
- **affected rows**: `vitacorex-vs-traditional-agency.html:220` (full curve) + `index.html:749` (20–30% post-collection retention — also unsourced)

---

## Deferred cites (Step 4.4 did not attempt retrieval)

None — all 7 pending cites from Step 4.2 were researched in this round.

---

## Internal (non-citable) evidence pointers

These IDs appear in `docs/claims-inventory.md` on **illustrative**, **internal**, and **out-of-scope** rows. They are **not citations** — they are pointers to internal justification for why the row is not citable.

### internal-composite-engagement

- **Applies to**: all `case-study-*.html` rows (60) · `index.html` impact counter + featured examples (27) · `corporate-legal-file-control.html` attorney-cleanup widget (3) · `pre-collection-pilot.html` recovery range chart (2) · `solutions.html` ROI figure (1) · industry-* file-readiness KPI targets
- **Rationale**: internal composite engagement data across VitaCoreX's studio work; not drawn from a single named client; not publishable with attribution
- **Treatment**: each row gets `.vcx-claim-caveat` (inline) OR composite case-study banner (case-study pages) OR composite counter strip (home counter grid) per ADR-007 §visible-caveat-contract. **Shipped in Step 4.3** (commits `976712b` + `e25cb57` + `db61e20` + `5cd86b6` + `e327a47`).

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

## Next steps (Step 4.4 continuation — decision ratification required)

Before `<cite>` tags can ship on the 37 citable rows, operator must ratify:

1. **Rename** `cite-fl-rule-7050` → `cite-fl-rule-7010` in `scripts/classify-claims.config.js` + regenerate inventory
2. **cite-fl-sunbiz-fees** — drop $150/$400 variants OR split into sub-cites
3. **cite-uscis-n400-civics** — accept scope caveat (pre-2025-10-20 filers only) OR update `n-400-naturalization.html` copy to cover both test versions
4. **cite-census-miami-demographics** — update site copy "over 70%" → "about 69%" (keep citable) OR demote to illustrative
5. **cite-us-chamber-precol** — demote 3 specific rows (25–33% · 35–55¢ · 10–14¢) to illustrative; retain 25–50% contingency rows
6. **cite-aca-contingency** — rebase URL to US Chamber OR demote to illustrative
7. **cite-industry-aging-curve** — demote full curve; decide framing-level copy treatment for `vitacorex-vs-traditional-agency.html` comparison section

Once ratified, Step 4.4 continues with:

- Update `scripts/classify-claims.config.js` overlay with demote/rename rules
- Regenerate `docs/claims-inventory.md` (deferred from Step 4.3; will sweep P11 drift + Step 4.4 reclassifications together)
- Wire `<cite>` tags or footnote links on active-citation HTML surfaces
- Pipeline re-verify all archive URLs return HTTP 200 before publish (ADR-008 contract)

---

## Version history

- **2026-04-19**: Step 4.2 created this file with 7 pending cite-IDs + 6 internal pointer IDs (no public retrieval yet). Populated from `docs/claims-inventory.md` Final class = citable rows.
- **2026-04-20**: Step 4.4 research checkpoint. All 7 pending cites researched via ADR-007 allowlist. Result: 3 active (cite-fl-rule-7010 renamed from 7050 · cite-fl-sunbiz-fees partial · cite-uscis-n400-civics with date-scope caveat) + 4 decision-pending (cite-census-miami · cite-us-chamber-precol · cite-aca-contingency · cite-industry-aging-curve). Operator ratification required before `<cite>` wiring. Demote-to-illustrative path pre-authorized by ADR-007 §demote-fallback for the clearly-unsourced rows; site-copy updates require per-row operator sign-off. See Step 4.4 research summary section above.
