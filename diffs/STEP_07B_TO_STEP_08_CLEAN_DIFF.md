# Step 07B To Step 08 Clean Diff

This diff is measured against the clean Step 07B `site/` snapshot extracted from the valid Step 07B export ZIP.

Authoritative machine-readable list:

- `audit/changed_vs_step07b_clean.json`

Changed file count:

- `65`

Primary pattern:

- Step 08 restored the proven Step 07A public-site delta onto the Step 07B fallback baseline.
- Step 08 then applied one local RU shell-text fix in `assets/js/vitacorex-public.js`.
- QA-only caches and test lead-store residue were removed before packaging.
