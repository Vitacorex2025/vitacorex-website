DO NOT SHIP

## Blockers Remaining

1. Deployment runtime is still pointed at the stale DocketMint/Node surface instead of the VitaCoreX runtime.
   Evidence:
   `site/render.yaml:4-5`, `site/render.yaml:13`, `site/Dockerfile:5-6`, `site/Dockerfile:14`, `site/Procfile:1`
   Why this blocks ship:
   A deploy from the checked-in runtime configuration can publish the wrong app or intentionally block cutover, even though the audited public pages themselves are clean.

## Major Issues Remaining

1. Measurement is only partially provable from the repo snapshot.
   Evidence:
   `site/assets/js/vitacorex-public.js:559`, `site/assets/js/vitacorex-public.js:571`, `audit/tracker_scan_after.json`
   Notes:
   `window.VCX_TRACKING_IDS`, `dataLayer` pushes, attribution fields, and Calendly hooks are preserved, but actual GA4/Search Console/Apollo ingestion still requires live deployment and credentials.

2. The ranking-strategy content-cluster work is still incomplete.
   Evidence:
   `reports/PDF_PLAN_GAP_MATRIX.md`
   Notes:
   Flagship service pages are now structured and credible, but operator-grade articles, case notes, and outreach/reference-earning assets are not complete.

3. Company-first positioning is improved, but the secondary private-client lane still needs tighter de-emphasis.
   Evidence:
   `additional-services.html:1`, `reports/PDF_PLAN_GAP_MATRIX.md`

## Minor Issues Remaining

1. Shell boot still relies on JS-first hydration/localStorage initialization before the full runtime takes over.
2. WebKit evidence is a spot check, not the full 84-page matrix.
3. App-only utility routes were not treated as public-page blockers in this step.

## Waived Items

- No waiver was used for deploy/runtime blockers.
- App-auth utility routes were excluded from the audited public-page blocker set by scope.

## Rationale

If this were only a public-page content/runtime gate, the audited public surfaces would be ship-worthy: browser QA passed, visible translations passed, proof placeholders are gone, and forms/menu/switcher flows behaved correctly. The repo is still not safe to ship because the active deployment files would not publish the intended VitaCoreX runtime.
