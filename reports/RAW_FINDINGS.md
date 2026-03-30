# Raw Findings

- Step 07A export path exists but `zipfile.is_zipfile(...)` returned `false`.
- Step 07A checksum:
  `60DCA778BDBF62C75507A6826CD89F1A04C52E1710968D4752C547046A5A0140`
- Step 07B export path is valid and was used as the baseline.
- Step 07B checksum:
  `46DF0EFFF00D45D64D6C2DB4095A9F350B03A1F7A3E6877B55183468ADBA5B0A`
- Ranking-strategy PDF was found in `Downloads` and read directly in this step.
- Browser verification matrix:
  `ok: true`, `screenshots: 84`, `console_errors: 0`, `request_failures: 0`, `page_errors: 0`, `unhandled_rejections: 0`, `non_200_documents: 0`
- WebKit spot check:
  `available: true`, `home_status: 200`, `menu_open: true`
- Visible translation gate:
  `ok: true`, `audited_pages: 28`, `issue_count: 0`
- Public placeholder scan:
  `ok: true`, `files_checked: 27`, `issue_count: 0`
- SEO hard gate:
  `ok: true`, `robots_exists: true`, `sitemap_exists: true`, `issue_count: 0`
- Phone scan:
  only `(888) 794-8292` / `+18887948292` formatting variants were found
- Tracker scan summary:
  `vcx_tracking_ids: 92`, `ga: 46`, `apollo: 46`, `calendly: 95`, `utm_fields: 65`, `landing_page: 16`
- Deploy blocker files still point at the stale stack:
  `render.yaml`, `Dockerfile`, `Procfile`
