# Line Audit

All changed generated HTML pages are minified single-line outputs. For those files, the relevant changed line reference is `:1`.

## Deploy blocker lines

- `site/render.yaml:4`
  `runtime: node`
- `site/render.yaml:5`
  `rootDir: tmp_deadline_v10_validation`
- `site/render.yaml:13`
  build filter still targets `tmp_deadline_v10_validation/**`
- `site/Dockerfile:5`
  `COPY tmp_deadline_v10_validation/package.json ./package.json`
- `site/Dockerfile:6`
  `COPY tmp_deadline_v10_validation/package-lock.json ./package-lock.json`
- `site/Dockerfile:14`
  `COPY tmp_deadline_v10_validation/ ./`
- `site/Procfile:1`
  `web: python scripts/render_cutover_block.py`
- `site/Procfile.vitacorex:1`
  desired VitaCoreX runtime entrypoint

## Step 08 code-level fix and verified lines

- `site/assets/js/vitacorex-public.js:87`
  RU shell cookie-policy label corrected to `Политика файлов cookie`
- `site/assets/js/vitacorex-public.js:339-340`
  preserves `landing_page`
- `site/assets/js/vitacorex-public.js:559`
  pushes browser events into `dataLayer`
- `site/assets/js/vitacorex-public.js:571`
  preserves `gtag` fallback push behavior
- `site/assets/js/vitacorex-public.js:657`
  writes `landing_page` into hidden form fields

## Attribution / thank-you persistence lines

- `site/backend/services/vitacorex_lead_store.py:358`
  stores `landing_page`
- `site/backend/services/vitacorex_lead_store.py:370-371`
  stores `msclkid` and `li_fat_id`
- `site/backend/services/vitacorex_lead_store.py:402`
  consumes `thank_you_path`
- `site/backend/tests/test_vitacorex_public_release.py:62-65`
  asserts `thank_you_path`, `landing_page`, `msclkid`, `li_fat_id`
- `site/backend/tests/test_vitacorex_public_release.py:75-82`
  asserts correct `thank_you_url` and stored attribution context

## Public trust-output lines

- `site/assets/js/dealer-contract-check.js:61`
  guarded/default public output path
- `site/scripts/build_vitacorex_public_release.py:1283`
  executive-brief `thank_you_path`
- `site/scripts/build_vitacorex_public_release.py:1287`
  `landing_page` hidden field
- `site/scripts/build_vitacorex_public_release.py:1296-1297`
  `msclkid` and `li_fat_id` hidden fields
- `site/scripts/build_vitacorex_public_release.py:1369`
  `purpose=company_review`
- `site/scripts/build_vitacorex_public_release.py:1373`
  company-review `thank_you_path`
- `site/scripts/build_vitacorex_public_release.py:1377`
  `landing_page` hidden field
- `site/scripts/build_vitacorex_public_release.py:1386-1387`
  `msclkid` and `li_fat_id` hidden fields
- `site/scripts/build_vitacorex_public_release.py:1559`
  careers `thank_you_path`
- `site/scripts/build_vitacorex_public_release.py:1563`
  careers `landing_page`
- `site/scripts/build_vitacorex_public_release.py:1572-1573`
  careers `msclkid` and `li_fat_id`

## Rebuilt HTML outputs

The following changed generated/minified HTML files were audited at line `1` after rebuild:

- `about.html:1`
- `additional-services.html:1`
- `ai-intake.html:1`
- `app.html:1`
- `auto-purchase.html:1`
- `business-plans.html:1`
- `careers.html:1`
- `contact.html:1`
- `contracts.html:1`
- `cookie-policy.html:1`
- `corporate-legal-file-control.html:1`
- `corporate-paralegal.html:1`
- `es/about.html:1`
- `es/additional-services.html:1`
- `es/careers.html:1`
- `es/contact.html:1`
- `es/cookie-policy.html:1`
- `es/corporate-legal-file-control.html:1`
- `es/index.html:1`
- `es/industries.html:1`
- `es/privacy-policy.html:1`
- `es/resources.html:1`
- `es/revenue-recovery-workflow.html:1`
- `es/solutions.html:1`
- `es/structured-case-intake.html:1`
- `es/terms-of-use.html:1`
- `es/thank-you.html:1`
- `immigration-documents.html:1`
- `index.html:1`
- `industries.html:1`
- `net-recovery.html:1`
- `privacy-policy.html:1`
- `resources.html:1`
- `revenue-recovery-workflow.html:1`
- `ru/about.html:1`
- `ru/additional-services.html:1`
- `ru/careers.html:1`
- `ru/contact.html:1`
- `ru/cookie-policy.html:1`
- `ru/corporate-legal-file-control.html:1`
- `ru/index.html:1`
- `ru/industries.html:1`
- `ru/privacy-policy.html:1`
- `ru/resources.html:1`
- `ru/revenue-recovery-workflow.html:1`
- `ru/solutions.html:1`
- `ru/structured-case-intake.html:1`
- `ru/terms-of-use.html:1`
- `ru/thank-you.html:1`
- `solutions.html:1`
- `structured-case-intake.html:1`
- `terms-of-use.html:1`
- `thank-you.html:1`
- `v51_institutional_blocks.html:1`
- `vitacorex-landing.html:1`
