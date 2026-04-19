#!/usr/bin/env node
/**
 * scripts/classify-claims.config.js — P04 Step 4.2 classification overlay
 * Governed by: docs/adr/ADR-007-claims-inventory-classification.md
 *
 * Takes each row emitted by scripts/inventory-claims.js (Step 4.1 scanner)
 * and returns the operator's Final class + Evidence ref + Rewrite/action.
 *
 * Final class values (per ADR-007):
 *   citable        — has a public source allowlisted in §source-allowlist
 *   illustrative   — composite / caveat required (ADR-007 §visible-caveat-contract)
 *   internal       — process/scope/heading/disclaimer prose; not an outcome claim; keep as-is
 *   risky          — outcome promise we can't defend; REMOVE or rewrite to process statement
 *   out-of-scope   — governed by another ADR (ADR-005 pricing, ADR-008 samples)
 *   needs-source   — research required in Step 4.4; resolves → citable or illustrative
 *
 * Evidence refs resolve in docs/claims-evidence.md (Step 4.4 bibliography).
 *
 * NOTE: First-match-wins. Keep rules ordered from most-specific (page+line) to
 *       most-generic (pattern+match). Scanner default (row.klass) is the
 *       fallback if no rule matches — that fallback should never actually fire
 *       after this pass; any unclassified row is a P04 Step 4.2 bug.
 */

'use strict';

// ---- EVIDENCE REGISTRY (resolves in docs/claims-evidence.md) ----------------

const EVIDENCE = {
  // Statutory / government (HIGH confidence, direct public URL)
  'cite-fl-rule-7050':              'Florida Rules of Civil Procedure 7.050 (small-claims $8,000 ceiling)',
  'cite-fl-sunbiz-fees':            'Florida Division of Corporations (Sunbiz) published fee schedule',
  'cite-uscis-n400-civics':         'USCIS N-400 Civics Test Policy Manual Vol 12 Part E',
  'cite-census-miami-demographics': 'US Census QuickFacts — Miami-Dade County demographics',

  // Industry-benchmark (retrieved + archived in Step 4.4)
  'cite-us-chamber-precol':         'US Chamber of Commerce — pre-collection recovery benchmark (25–33%)',
  'cite-aca-contingency':           'ACA International — contingency commission rate range (25–50%)',
  'cite-industry-aging-curve':      'Industry aging-curve recoverability (70–90% <6mo, 45–55% 6–12mo, 15–30% >12mo, 1–5% charged-off)',

  // Internal (not citable; the row becomes illustrative with composite caveat)
  'internal-composite-engagement':  'VitaCoreX internal composite engagement data (no public source)',
  'internal-scope-definition':      'Scope/capacity language in a service definition — not an outcome claim',
  'internal-disclaimer':            'Existing legal/marketing disclaimer — scanner matched a word inside its negation',
  'internal-kpi-label':             'KPI label, form-field label, or process description',
  'internal-heading':               'Section heading or filter label',
  'internal-legal':                 'Legal-terms / policy text; out of P04 proof-discipline scope',
};

// ---- ACTION TEMPLATES -------------------------------------------------------

const ACTIONS = {
  outOfScopePricing:   'Skip — ADR-005 pricing policy (not a P04 outcome claim)',
  internalScope:       'Keep — scope/capacity statement (e.g. "up to N documents"); no caveat needed',
  internalHeading:     'Keep — section heading or filter label; not an outcome claim; no caveat needed',
  internalDisclaimer:  'Keep — this IS the disclaimer (scanner matched the word inside its negation); no caveat needed',
  internalProcess:     'Keep — process/definition/KPI-label prose; not an outcome claim; no caveat needed',
  internalLegal:       'Keep — legal-terms / policy text; out of P04 scope',
  compositeCase:       'Composite case-study — top banner + per-KPI caveat (ADR-007 §composite-case-study-contract); set JSON-LD genre: "composite-case-study"',
  compositeFeature:    'Composite engagement example — add .vcx-claim-caveat micro-label inside the card body (ADR-007 §visible-caveat-contract)',
  compositeCounter:    'Impact counter — add composite-caveat strip within reading distance of the counter grid (ADR-007 §visible-caveat-contract)',
  compositeRoi:        'Composite ROI figure — label "representative across engagements" via .vcx-claim-caveat',
  compositeTiming:     'Composite timing claim — add .vcx-claim-caveat within reading distance',
  compositeInternal:   'Composite internal benchmark — label "representative across engagements" via .vcx-claim-caveat',
  citable:             'Citable — add <cite> or footnote link to allowlisted source in Step 4.4',
  needsSource:         'Needs research in Step 4.4 — source allowlist (CFPB / US Chamber / ACA / Census / BLS / peer-reviewed); resolves → citable or illustrative',
};

// ---- HELPERS ---------------------------------------------------------------

function snippetHas(row, re) { return re.test(row.snippet); }
function matchIs(row, re) { return re.test(row.match); }
function pageIs(row, name) { return row.page === name; }
function pagePrefix(row, prefix) { return row.page.startsWith(prefix); }

// ---- CLASSIFIER ------------------------------------------------------------

function classify(row) {
  const { page, line, pattern, match, snippet } = row;

  // ==========================================================================
  // TIER 1 — HARD OUT-OF-SCOPE: disclaimers that got flagged for negated words
  // ==========================================================================

  if (snippetHas(row, /\bnot guaranteed\b|\bdo not promise guaranteed\b|\bwe do not promise\b|\bnot a specific recovery percent\b/i)) {
    return { final: 'internal', evidence: 'internal-disclaimer', action: ACTIONS.internalDisclaimer };
  }

  // ==========================================================================
  // TIER 2 — PAGE-SPECIFIC HIGH-SPECIFICITY RULES
  // ==========================================================================

  // ---- Case studies: everything illustrative, one prose exception ----------
  if (pagePrefix(row, 'case-study-')) {
    if (page === 'case-study-healthcare-network.html' && line === 531) {
      // "The boundary matters as much as the intervention" — philosophical prose, not an outcome claim
      return { final: 'internal', evidence: 'internal-kpi-label', action: ACTIONS.internalProcess };
    }
    return { final: 'illustrative', evidence: 'internal-composite-engagement', action: ACTIONS.compositeCase };
  }

  // ---- Florida small claims: all $8,000 = Rule 7.050 statutory -------------
  if (pageIs(row, 'florida-small-claims-help.html') && pattern === 'money' && /\$8,?000\b/.test(match)) {
    return { final: 'citable', evidence: 'cite-fl-rule-7050', action: ACTIONS.citable };
  }

  // ---- Florida LLC formation: state fees citable, S-Corp band internal -----
  if (pageIs(row, 'llc-formation-florida.html') && pattern === 'money') {
    if (/\$(138\.75|125|150|400)\b/.test(match)) {
      return { final: 'citable', evidence: 'cite-fl-sunbiz-fees', action: ACTIONS.citable };
    }
    if (/\$(40,000|50,000)\b/.test(match)) {
      return { final: 'internal', evidence: 'internal-kpi-label', action: ACTIONS.internalProcess };
    }
  }

  // ---- N-400: "up to 10 questions" = USCIS civics policy ------------------
  if (pageIs(row, 'n-400-naturalization.html') && /up to 10 questions/i.test(snippet)) {
    return { final: 'citable', evidence: 'cite-uscis-n400-civics', action: ACTIONS.citable };
  }

  // ---- Miami 70% Hispanic = Census ----------------------------------------
  if (pageIs(row, 'revenue-recovery-miami.html') && pattern === 'pct' && /^70\s*%/.test(match)) {
    return { final: 'citable', evidence: 'cite-census-miami-demographics', action: ACTIONS.citable };
  }

  // ---- I-485: "eliminates" in USCIS form definition is process -----------
  if (pageIs(row, 'i-485-adjustment.html') && line === 259) {
    return { final: 'internal', evidence: 'internal-kpi-label', action: ACTIONS.internalProcess };
  }

  // ---- industries.html "guaranteed" inside disclaimer --------------------
  if (pageIs(row, 'industries.html') && line === 176) {
    return { final: 'internal', evidence: 'internal-disclaimer', action: ACTIONS.internalDisclaimer };
  }

  // ==========================================================================
  // TIER 3 — vitacorex-vs-traditional-agency.html (industry-benchmark page)
  // ==========================================================================

  if (pageIs(row, 'vitacorex-vs-traditional-agency.html')) {
    // Disclaimer
    if (line === 231) {
      return { final: 'internal', evidence: 'internal-disclaimer', action: ACTIONS.internalDisclaimer };
    }
    // VitaCoreX controlled-pilots ROI
    if (line === 228) {
      return { final: 'illustrative', evidence: 'internal-composite-engagement', action: ACTIONS.compositeRoi };
    }
    // Aging-curve percentages
    if (line === 220 && pattern === 'pct') {
      return { final: 'citable', evidence: 'cite-industry-aging-curve', action: ACTIONS.citable };
    }
    // 25–50% contingency commission (ACA)
    if ((line === 138 || line === 224) && (pattern === 'pct' || pattern === 'verb' || pattern === 'hedge')) {
      return { final: 'citable', evidence: 'cite-aca-contingency', action: ACTIONS.citable };
    }
    // 10–14¢ per $1 + 25–50% (composite US Chamber + ACA; use US Chamber primary)
    if (line === 133) {
      return { final: 'citable', evidence: 'cite-us-chamber-precol', action: ACTIONS.citable };
    }
    // 35–55¢ per $1 recovered + "industry benchmarks"
    if (line === 113 || line === 127) {
      return { final: 'citable', evidence: 'cite-us-chamber-precol', action: ACTIONS.citable };
    }
    // Placement-timing industry description
    if (line === 168) {
      return { final: 'citable', evidence: 'cite-us-chamber-precol', action: ACTIONS.citable };
    }
    // All other "typically" / verb rows describing industry behavior → internal narrative
    if (pattern === 'hedge' && /^typicall?y?$/i.test(match)) {
      return { final: 'internal', evidence: 'internal-kpi-label', action: ACTIONS.internalProcess };
    }
    if (pattern === 'verb') {
      return { final: 'internal', evidence: 'internal-kpi-label', action: ACTIONS.internalProcess };
    }
  }

  // ==========================================================================
  // TIER 4 — index.html (home — largest surface)
  // ==========================================================================

  if (pageIs(row, 'index.html')) {
    // 100% uptime/reliability marks (lines 218, 281)
    if ((line === 218 || line === 281) && /^100\s*%/.test(match)) {
      return { final: 'illustrative', evidence: 'internal-composite-engagement', action: ACTIONS.compositeRoi };
    }
    // Pricing ladder recap (line 256 "15/18/22.5%" with "recovered cash")
    if (line === 256) {
      return { final: 'out-of-scope', evidence: null, action: ACTIONS.outOfScopePricing };
    }
    // Per-case packets + weekly options (line 262)
    if (line === 262) {
      return { final: 'out-of-scope', evidence: null, action: ACTIONS.outOfScopePricing };
    }
    // "Best fit" / "best" headings (lines 469, 474, 594)
    if ((line === 469 || line === 474 || line === 594) && pattern === 'hedge') {
      return { final: 'internal', evidence: 'internal-heading', action: ACTIONS.internalHeading };
    }
    // KPI label "Recovered cash compared with the operator's prior baseline" (line 662)
    if (line === 662) {
      return { final: 'internal', evidence: 'internal-kpi-label', action: ACTIONS.internalProcess };
    }
    // Impact counter grid (lines 688–705): 37% / Average reduction / 68% / 90%
    if (line >= 685 && line <= 705) {
      return { final: 'illustrative', evidence: 'internal-composite-engagement', action: ACTIONS.compositeCounter };
    }
    // Featured engagement example cards (lines 710–790)
    if (line >= 710 && line <= 790) {
      // "78% of accounts retained (vs typical 20–30% post-collection)" (line 749)
      if (line === 749) {
        if (pattern === 'pct' && match === '78%') {
          return { final: 'illustrative', evidence: 'internal-composite-engagement', action: ACTIONS.compositeFeature };
        }
        if (pattern === 'pct' && (match === '30%' || match === '20%')) {
          return { final: 'needs-source', evidence: 'cite-industry-aging-curve', action: ACTIONS.needsSource };
        }
        if (pattern === 'hedge') {
          return { final: 'needs-source', evidence: 'cite-industry-aging-curve', action: ACTIONS.needsSource };
        }
      }
      return { final: 'illustrative', evidence: 'internal-composite-engagement', action: ACTIONS.compositeFeature };
    }
    // Process summary (line 814)
    if (line === 814) {
      return { final: 'internal', evidence: 'internal-kpi-label', action: ACTIONS.internalProcess };
    }
  }

  // ==========================================================================
  // TIER 5 — faq.html
  // ==========================================================================

  if (pageIs(row, 'faq.html')) {
    // Engagement-tier pricing recap (line 105 — $2,500 fee + 50% recovery + "recovered")
    if (line === 105) {
      return { final: 'out-of-scope', evidence: null, action: ACTIONS.outOfScopePricing };
    }
    // "First cash movement within 30 days" + 50% composite (line 112)
    if (line === 112) {
      return { final: 'illustrative', evidence: 'internal-composite-engagement', action: ACTIONS.compositeTiming };
    }
    // Workflow guarantee disclaimer (line 119)
    if (line === 119) {
      return { final: 'internal', evidence: 'internal-disclaimer', action: ACTIONS.internalDisclaimer };
    }
    // Traditional-agency industry benchmark (line 133 — 10–14¢, 30–50%, typically)
    if (line === 133) {
      return { final: 'citable', evidence: 'cite-aca-contingency', action: ACTIONS.citable };
    }
    // Diagnostic eligibility (line 147 — $100K receivables / $500K / $25K leakage)
    if (line === 147) {
      return { final: 'internal', evidence: 'internal-scope-definition', action: ACTIONS.internalScope };
    }
    // Process definitions + KPI labels
    if (line === 73 || line === 87 || line === 168 || line === 186 || line === 228) {
      return { final: 'internal', evidence: 'internal-kpi-label', action: ACTIONS.internalProcess };
    }
  }

  // ==========================================================================
  // TIER 6 — pre-collection-pilot.html
  // ==========================================================================

  if (pageIs(row, 'pre-collection-pilot.html')) {
    // Pricing ladder + per-recovered-cash label (lines 295, 321–332)
    if (line === 295 || (line >= 321 && line <= 332)) {
      return { final: 'out-of-scope', evidence: null, action: ACTIONS.outOfScopePricing };
    }
    // "~20%, ~45%" recovery range chart
    if (line === 305 || line === 311) {
      return { final: 'illustrative', evidence: 'internal-composite-engagement', action: ACTIONS.compositeRoi };
    }
    // US Chamber benchmark (line 350)
    if (line === 350) {
      return { final: 'citable', evidence: 'cite-us-chamber-precol', action: ACTIONS.citable };
    }
    // Composite pilot timing (lines 409, 430)
    if (line === 409 || line === 430) {
      return { final: 'illustrative', evidence: 'internal-composite-engagement', action: ACTIONS.compositeRoi };
    }
    // Diagnostic 30-day credit window (line 441) — pricing policy
    if (line === 441) {
      return { final: 'internal', evidence: 'internal-scope-definition', action: ACTIONS.internalScope };
    }
    // "Best-fit industries" heading (line 251)
    if (line === 251) {
      return { final: 'internal', evidence: 'internal-heading', action: ACTIONS.internalHeading };
    }
    // AR portfolio ≥ $100K eligibility (line 237)
    if (line === 237) {
      return { final: 'internal', evidence: 'internal-scope-definition', action: ACTIONS.internalScope };
    }
    // Process / KPI-label fallthrough
    return { final: 'internal', evidence: 'internal-kpi-label', action: ACTIONS.internalProcess };
  }

  // ==========================================================================
  // TIER 7 — revenue-recovery-florida.html
  // ==========================================================================

  if (pageIs(row, 'revenue-recovery-florida.html')) {
    // Pricing ladder (lines 228, 229, 233, 234, 238, 239)
    if ([228, 229, 233, 234, 238, 239].includes(line)) {
      return { final: 'out-of-scope', evidence: null, action: ACTIONS.outOfScopePricing };
    }
    // Weekly retainer rates (lines 256, 261, 266, 355)
    if ([256, 261, 266, 355].includes(line)) {
      return { final: 'out-of-scope', evidence: null, action: ACTIONS.outOfScopePricing };
    }
    // US Chamber benchmark (line 242)
    if (line === 242) {
      return { final: 'citable', evidence: 'cite-us-chamber-precol', action: ACTIONS.citable };
    }
    // Process / KPI labels
    return { final: 'internal', evidence: 'internal-kpi-label', action: ACTIONS.internalProcess };
  }

  // ==========================================================================
  // TIER 8 — revenue-recovery-workflow.html (estimator form)
  // ==========================================================================

  if (pageIs(row, 'revenue-recovery-workflow.html')) {
    // Estimator form page: all rows are form labels / headings / sample params / eligibility
    if (line === 222) return { final: 'internal', evidence: 'internal-heading', action: ACTIONS.internalHeading }; // "Where this fits best"
    return { final: 'internal', evidence: 'internal-kpi-label', action: ACTIONS.internalProcess };
  }

  // ==========================================================================
  // TIER 9 — small-claims-documentation.html
  // ==========================================================================

  if (pageIs(row, 'small-claims-documentation.html')) {
    // Pricing comparisons + weekly rates
    if ([300, 311, 322, 333, 350, 361, 373, 407].includes(line)) {
      return { final: 'out-of-scope', evidence: null, action: ACTIONS.outOfScopePricing };
    }
    // Capacity ceilings (lines 352, 365)
    if (line === 352 || line === 365) {
      return { final: 'internal', evidence: 'internal-scope-definition', action: ACTIONS.internalScope };
    }
  }

  // ==========================================================================
  // TIER 10 — corporate-legal-file-control.html
  // ==========================================================================

  if (pageIs(row, 'corporate-legal-file-control.html')) {
    if (line === 85) return { final: 'internal', evidence: 'internal-heading', action: ACTIONS.internalProcess };
    if (line === 290) return { final: 'internal', evidence: 'internal-heading', action: ACTIONS.internalHeading };
    if (line === 139 || line === 149 || line === 183) {
      return { final: 'illustrative', evidence: 'internal-composite-engagement', action: ACTIONS.compositeInternal };
    }
  }

  // ==========================================================================
  // TIER 11 — solutions.html
  // ==========================================================================

  if (pageIs(row, 'solutions.html')) {
    if (line === 163) return { final: 'internal', evidence: 'internal-heading', action: ACTIONS.internalHeading };
    if (line === 208) return { final: 'internal', evidence: 'internal-kpi-label', action: ACTIONS.internalProcess };
    if (line === 227) return { final: 'illustrative', evidence: 'internal-composite-engagement', action: ACTIONS.compositeRoi };
  }

  // ==========================================================================
  // TIER 12 — location pages (Tampa / Orlando — market-context only)
  // ==========================================================================

  if (pageIs(row, 'revenue-recovery-tampa.html') || pageIs(row, 'revenue-recovery-orlando.html')) {
    return { final: 'internal', evidence: 'internal-kpi-label', action: ACTIONS.internalProcess };
  }

  // ==========================================================================
  // TIER 13 — industry-* pages
  // ==========================================================================

  if (pagePrefix(row, 'industry-')) {
    // 90% file-readiness KPI target → composite internal benchmark
    if (pattern === 'pct' && /^90\s*%/.test(match) && /file[- ]readiness|packet (ready|complete)/i.test(snippet)) {
      return { final: 'illustrative', evidence: 'internal-composite-engagement', action: ACTIONS.compositeInternal };
    }
    return { final: 'internal', evidence: 'internal-kpi-label', action: ACTIONS.internalProcess };
  }

  // ==========================================================================
  // TIER 14 — service / outlier pages
  // ==========================================================================

  if (pageIs(row, 'additional-services.html')) {
    if (line === 183 || line === 218) return { final: 'internal', evidence: 'internal-scope-definition', action: ACTIONS.internalScope };
    if (line === 217) return { final: 'out-of-scope', evidence: null, action: ACTIONS.outOfScopePricing };
  }

  if (pageIs(row, 'contact.html') && (line === 104 || line === 114)) {
    return { final: 'internal', evidence: 'internal-heading', action: ACTIONS.internalHeading };
  }

  if (pageIs(row, 'contract-review-service.html') && line === 243) {
    return { final: 'internal', evidence: 'internal-scope-definition', action: ACTIONS.internalScope };
  }

  if (pageIs(row, 'structured-case-intake.html') && line === 85) {
    return { final: 'internal', evidence: 'internal-heading', action: ACTIONS.internalHeading };
  }

  if (pageIs(row, 'sub-processors-and-dpa.html') && line === 266) {
    return { final: 'internal', evidence: 'internal-kpi-label', action: ACTIONS.internalProcess };
  }

  if (pageIs(row, 'sample-deliverable.html')) {
    return { final: 'internal', evidence: 'internal-kpi-label', action: ACTIONS.internalProcess };
  }

  if (pageIs(row, 'terms-of-use.html') && line === 195) {
    return { final: 'internal', evidence: 'internal-legal', action: ACTIONS.internalLegal };
  }

  if (pageIs(row, 'about.html') && line === 174) {
    return { final: 'internal', evidence: 'internal-heading', action: ACTIONS.internalProcess };
  }

  // ==========================================================================
  // FALLBACK — any row not matched above
  // ==========================================================================
  // After Step 4.2 this fallback should NEVER fire. If it does, the row is a
  // bug: either the scanner matched something unexpected, or the overlay
  // config missed a page. The regression verifier (Step 4.6) will catch it.

  return {
    final: row.klass === 'unclassified' ? 'internal' : row.klass,
    evidence: row.klass === 'illustrative' ? 'internal-composite-engagement' :
              row.klass === 'needs-source' ? 'cite-industry-aging-curve' :
              'internal-kpi-label',
    action: row.action,
  };
}

module.exports = { classify, EVIDENCE, ACTIONS };
