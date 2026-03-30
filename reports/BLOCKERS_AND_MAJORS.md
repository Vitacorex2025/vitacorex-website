# Blockers And Majors

## Blocker

### P0 deploy cutover mismatch

- `site/render.yaml:4` sets `runtime: node`
- `site/render.yaml:5` sets `rootDir: tmp_deadline_v10_validation`
- `site/render.yaml:13` keeps the build filter on `tmp_deadline_v10_validation/**`
- `site/Dockerfile:5-6` copies `tmp_deadline_v10_validation/package.json` and `package-lock.json`
- `site/Dockerfile:14` copies `tmp_deadline_v10_validation/ ./`
- `site/Procfile:1` runs `python scripts/render_cutover_block.py`
- `site/Procfile.vitacorex:1` shows the correct runtime but is not active

Impact:

- A deploy from this repo can serve the wrong surface or intentionally block cutover.

## Majors

### P1 measurement not fully provable from repo-only QA

- `site/assets/js/vitacorex-public.js:559`
- `site/assets/js/vitacorex-public.js:571`
- `audit/tracker_scan_after.json`

Impact:

- Analytics hooks and attribution are preserved, but actual vendor ingestion and Search Console state still require live access and credentials.

### P1 PDF strategy gap: content-cluster readiness not complete

- `reports/PDF_PLAN_GAP_MATRIX.md`
- `reports/NEXT_QUEUE_FROM_PDF.md`

Impact:

- The site is much stronger commercially, but the broader ranking strategy still lacks the article/case-note/reference layer.

### P1 secondary private-services lane still needs stronger strategic compression

- `additional-services.html:1`
- `reports/AGENT_REPORTS.md`

Impact:

- Not a public trust-breaker now, but still weaker than the company-first primary narrative.
