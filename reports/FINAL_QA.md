# Final QA

## Verdict

The audited public site build is functionally strong, but the repo is not safe to ship yet as a deployment package.

Public-page hard-gate results:

- Browser/device matrix passed on 28 audited routes x 3 viewports = 84 screenshots.
- Console/runtime/network checks passed with 0 console errors, 0 warnings, 0 request failures, 0 page errors, 0 unhandled rejections, and 0 non-200 documents in `audit/browser_verification_matrix.json`.
- Visible translation gate passed on 28 audited EN/RU/ES/noindex pages with 0 visible untranslated hits in `audit/visible_translation_gate.json`.
- Placeholder-proof scan passed on 27 audited files with 0 issues in `audit/public_placeholder_scan.json`.
- SEO hard gate passed at the repo/output level with robots, sitemap, canonicals, hreflang, and schema present on the audited public pages in `audit/seo_hard_gate.json`.
- Phone scan shows only the current number in formatting variants in `audit/phone_scan_after.json`.
- Tracker and attribution surfaces are still present in `audit/tracker_scan_after.json`.
- Backend regression tests passed: `5 passed` in `site/backend/tests/test_vitacorex_public_release.py`.

Deploy/runtime blockers remain:

- `site/render.yaml:4-5` still targets the stale Node deployment rooted at `tmp_deadline_v10_validation`.
- `site/Dockerfile:5-6,14` still builds the stale Node app from `tmp_deadline_v10_validation`.
- `site/Procfile:1` still hard-blocks cutover with `python scripts/render_cutover_block.py`.
- `site/Procfile.vitacorex:1` contains the correct VitaCoreX runtime entrypoint, but it is not the active Procfile.

## What Step 08 fixed or verified

- Restored the Step 07A product delta onto the valid Step 07B baseline so the public shell, thank-you routing, trust outputs, and multilingual pages matched the latest working public build.
- Fixed the remaining RU shell string defect in `site/assets/js/vitacorex-public.js:87` from `Политика cookie` to `Политика файлов cookie`.
- Rebuilt the public release with the current canonical builder in `site/scripts/build_vitacorex_public_release.py`.
- Re-ran runtime QA after the fix and preserved analytics, attribution fields, disclaimers, Forms, and Calendly.
- Cleaned test-generated cache junk from the packaged `site/` snapshot and restored the lead-store baseline before final packaging.

## Ship Outcome

See `reports/SHIP_DECISION.md`. The correct hard-gate outcome for this step is `DO NOT SHIP`.
