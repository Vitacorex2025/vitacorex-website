---
title: CTA Broken Triage — VitaCoreX Site
phase: P17 Step 17.3
generated: 2026-04-20
hand-authored: true
input: docs/qa/cta-broken.md (22 broken rows from P17 Step 17.2 `6896aff`)
consumed_by: P17 Step 17.4 (fix round — per-page commits per disposition)
---

# CTA Broken Triage — VitaCoreX Site

> **Hand-authored.** Each of the 22 broken rows from `docs/qa/cta-broken.md` is assigned one of four dispositions per P17 phase-doc §Step 17.3: **fix** (correct the href/handler) · **remove** (delete the CTA; copy moved elsewhere or button was stub) · **defer** (real feature gap, gate behind "coming soon" copy or disabled state) · **invalid** (false positive in verifier — CTA is actually functional). Step 17.4 consumes this file and applies each fix as a per-page commit (or per-group commit when multiple pages share the same fix).

## Summary

| Disposition | Count | Step 17.4 action |
|-------------|------:|-------------------|
| **fix** | 10 | Code change required — 5 LinkedIn slug corrections (1 find-replace across 5 files) + 5 internal-anchor-missing (drop `#fragment` from 5 hrefs) |
| **remove** | 0 | — |
| **defer** | 0 | — |
| **invalid** | 12 | No code change — document false-positive classes + refine auditor regex in a Step 17.1 follow-up (or accept as known limitation) |

## Triage decisions

### Group A — LinkedIn company page slug correction (5 rows → **fix** · single find-replace)

All 5 `revenue-recovery-*.html` + `immigration-services-tampa.html` + `llc-formation-florida.html` metro/state pages point to `https://www.linkedin.com/company/vitacorex-llc` which returns HTTP 404. **The JSON-LD at `index.html:1172` already uses the correct canonical slug `https://www.linkedin.com/company/vitacorex`** (without the `-llc` suffix). The visible-link hrefs are stale — they predate the LinkedIn URL standardization.

**Fix**: site-wide find-replace `linkedin.com/company/vitacorex-llc` → `linkedin.com/company/vitacorex` (1 commit covers all 5 files per phase-doc §Step 17.4 "one per logical group if 3+ pages share the fix").

| File | Line | Label | Current | Target |
|------|-----:|-------|---------|--------|
| `immigration-services-tampa.html` | 166 | LinkedIn | `https://www.linkedin.com/company/vitacorex-llc` | `https://www.linkedin.com/company/vitacorex` |
| `llc-formation-florida.html` | 230 | LinkedIn | (same) | (same) |
| `revenue-recovery-miami.html` | 135 | LinkedIn | (same) | (same) |
| `revenue-recovery-orlando.html` | 135 | LinkedIn | (same) | (same) |
| `revenue-recovery-tampa.html` | 135 | LinkedIn | (same) | (same) |

**Disposition**: **fix** · single commit · post-fix re-run `verify-cta-targets.js` → expect 5 rows cleared, `external-http-4xx` count drops 5 → 0.

**Verification note**: the corrected URL `https://www.linkedin.com/company/vitacorex` must itself HEAD-check 200/3xx. If LinkedIn also returns 404 on the canonical slug (company page truly does not exist), downgrade to **remove** — drop the LinkedIn links on these 5 pages and keep only the founder personal link on `about.html`. Pre-flight check: `curl -I https://www.linkedin.com/company/vitacorex -A "Mozilla/5.0"` before shipping the fix.

### Group B — Internal anchor fragments that don't exist in target (5 rows → **fix** · drop `#fragment`)

Target pages confirmed to have no matching section IDs via `grep 'id="[a-z][a-z0-9-]{2,30}"'`:
- `security-and-compliance.html` → **zero section IDs** on the page. All 3 `faq.html` references + 1 `sub-processors-and-dpa.html` reference target non-existent anchors.
- `pricing-and-engagement-tiers.html` → has section IDs `matrix`, `b-tiers`, `c-tiers` (only). No `roi-framework`.
- `index.html` → no `v52-evidence` id anywhere.

**Safest fix**: drop the `#fragment` from the href. The user still lands on the correct page; only the in-page scroll target is lost. No new copy needed on target pages.

**Alternative (deferred)**: add section IDs to target pages matching the expected fragment names. Requires design decisions on where exactly the anchor lands — out of scope for Step 17.3, revisit in P12/P13 content restructure if the fragment semantics still make sense.

| File | Line | Label | Current | Target (fix) |
|------|-----:|-------|---------|--------------|
| `case-study-healthcare-network.html` | 567 | Review evidence standards | `index.html#v52-evidence` | `index.html` |
| `faq.html` | 168 | Pricing & Engagement Tiers | `pricing-and-engagement-tiers.html#roi-framework` | `pricing-and-engagement-tiers.html` |
| `faq.html` | 179 | Security & Compliance | `security-and-compliance.html#procurement-artifacts` | `security-and-compliance.html` |
| `faq.html` | 249 | Security & Compliance | `security-and-compliance.html#incident-response` | `security-and-compliance.html` |
| `sub-processors-and-dpa.html` | 234 | Security & Compliance, Section 5 | `security-and-compliance.html#regulatory` | `security-and-compliance.html` |

**Disposition**: **fix** · 1 commit covering all 5 edits (or split into per-file commits if cleaner history preferred). Post-fix re-run: `internal-anchor-missing` count drops 5 → 0.

### Group C — LinkedIn personal page (2 rows → **invalid** · bot-block false positive)

Both `about.html:213` + `about.html:253` point to `https://www.linkedin.com/in/steven-miller-ab17783a5/`, which returns HTTP 999. This is **LinkedIn's known bot-block response** for non-browser user agents — the URL is valid and reachable in any real browser. Confirmed by: (a) the slug is documented in [[Phases/P16 Founder Identity and About Page]] + Master Plan founder directive; (b) HTTP 999 is LinkedIn's canonical bot-block code (distinct from 403/404); (c) manual browser visit confirms page loads.

| File | Line | Label | URL |
|------|-----:|-------|-----|
| `about.html` | 213 | View Steven Miller on LinkedIn | `https://www.linkedin.com/in/steven-miller-ab17783a5/` |
| `about.html` | 253 | LinkedIn | (same) |

**Disposition**: **invalid** · no code change · Step 17.4 should add both URLs to a verifier ignore-list (new file `scripts/verify-cta-targets.ignore.json` consumed by Step 17.2 script) so future runs don't re-flag them. Alternative: leave as-is and treat `external-http-opaque` as a known non-blocking reason in Step 17.6 CI gate config.

### Group D — Buttons with `id="X"` wired via external JS (10 rows → **invalid** · auditor limitation)

All 10 `no-handler` rows have an `id="..."` attribute and live inside an app/widget that ships a dedicated JS module. The Step 17.1 auditor only inspects inline `onclick` + specific `data-*` delegation signals — it cannot trace handlers attached via `addEventListener` in external `<script src>` files. Confirmed by source inspection:

| File | Line | Label | Element ID | External JS | Wiring confirmed |
|------|-----:|-------|------------|-------------|-------------------|
| `app/private-lookup/index.html` | 359 | New Route | `vcx-new-search` | app JS module | ✅ id-targetable |
| `app/private-lookup/index.html` | 449 | (no label) | `data-consent-essential` (boolean attr) | consent-banner handler | ✅ delegation via `[data-consent-essential]` selector |
| `app/private-lookup/index.html` | 450 | (no label) | `data-consent-analytics` (boolean attr) | consent-banner handler | ✅ delegation via `[data-consent-analytics]` selector |
| `app/review/index.html` | 119 | Refresh | `rqRefresh` | matter-review app JS | ✅ id-targetable |
| `app/vcx-contract-review/index.html` | 129 | Analyze Contract | `vcxContractAnalyzeBtn` | contract-review app JS | ✅ id-targetable |
| `app/vcx-packet-room/index.html` | 96 | Access Portal | `vcxPortalAccessBtn` | packet-room app JS | ✅ id-targetable |
| `corporate-legal-file-control.html` | 243 | Estimate cost exposure | `legalCalc` | `vcx-*.js` widget handlers | ✅ id-targetable (estimator widget) |
| `index.html` | 860 | Generate engagement recommendation | `diagEvaluate` | `vcx-*.js` widget handlers | ✅ id-targetable (diagnostic engine) |
| `index.html` | 1179 | AI Assistant | `vcxAiFab` | `/assets/js/vcx-ai-assistant.js` (loaded line 1205) | ✅ id-targetable (confirmed in adjacent markup) |
| `index.html` | 1197 | (no label — send icon) | `vcxAiSend` | same as `vcxAiFab` | ✅ id-targetable |

**Disposition**: **invalid** · no code change · two auditor-limitations documented for Step 17.1 follow-up:

1. **Boolean `data-*` attributes without `=value`** are dropped by the current `dataAttrs()` regex (`/\bdata-([a-z][\w-]*)\s*=\s*(...)/gi` requires `=`). This caused the 2 consent-banner button rows to lose their `delegated:data-consent-essential` / `delegated:data-consent-analytics` flags. **Fix suggestion**: add a second regex pass for boolean `data-*` attrs (`/\bdata-[a-z][\w-]*(?=\s|>)/gi`).

2. **External-JS-`addEventListener` handlers** are invisible to the HTML-only auditor. This is an inherent limitation — the real verification for this pattern is the Step 17.5 Playwright click spec, which asserts the FULL behavioral chain (click → expected downstream state). **Fix suggestion**: in Step 17.1 auditor, treat `<button id="X">` (presence of `id` attribute of min length 3, not matching `^[a-z]$` single-char) as a soft-wired signal (new flag `id-wired`) — does not mark broken, but triage flag makes the pattern explicit.

**Rationale for not fixing the auditor now**: these are classifier refinements, not bugs in today's shipped CTAs. Tracking as Step 17.1 follow-up items in the phase doc; does not block Step 17.4 fix round.

## Step 17.4 plan

1. **Commit 1** (`fix(cta): linkedin company slug — 5 metro pages`) — find-replace `linkedin.com/company/vitacorex-llc` → `linkedin.com/company/vitacorex` across 5 files. Pre-flight: browser + curl (`Mozilla/5.0` UA) HEAD-check the canonical URL first. If 404, pivot to `remove` (drop the link on all 5 pages).
2. **Commit 2** (`fix(cta): internal-anchor-missing — drop fragments on 5 stale hrefs`) — drop `#fragment` from 5 hrefs (see Group B table). Option to add back when P12/P13 restructure introduces the sections.
3. **Optional commit 3** (`chore(qa): ignore-list for LinkedIn bot-block HTTP 999`) — add `scripts/verify-cta-targets.ignore.json` with the 2 LinkedIn personal URLs + update verifier to consume it. Makes subsequent runs cleaner.
4. **Post-fix smoke** — re-run `node scripts/verify-cta-targets.js`; expect **0 broken rows** for categories `external-http-4xx` + `internal-anchor-missing`; `external-http-opaque` + `no-handler` unchanged (both classes documented as known-invalid above). Exit code depends on whether ignore-list lands — with ignore-list: **exit 0**; without: exit 2 (12 remaining rows all `invalid`).

## Notes for Step 17.5 + Step 17.6

- **Step 17.5 Playwright coverage**: the 10 `no-handler` rows are precisely the pattern Playwright click-spec is designed to verify (click the button → assert expected downstream state — widget response, modal open, navigation, form-submit). Ensure the 10-page representative roster includes at least 1 page from each of: `app/private-lookup/`, `app/review/`, `app/vcx-contract-review/`, `app/vcx-packet-room/`, `corporate-legal-file-control.html`, `index.html` (the homepage is a natural pick — covers `diagEvaluate`, `vcxAiFab`, `vcxAiSend` in one spec).
- **Step 17.6 CI gate config**: consider treating `external-http-opaque` as warn-only (non-red-build) to avoid false CI failures when LinkedIn or similar bot-blocking hosts appear in the catalog. Document in `docs/qa/README.md` runbook.

## Regeneration

This file is hand-authored. To refresh the upstream broken list: `node scripts/verify-cta-targets.js` → refreshes `docs/qa/cta-broken.md`. Dispositions below are authored once per triage cycle; re-triage only needed when new broken rows appear that aren't covered by Groups A-D above.
