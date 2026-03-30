# Calculator Form Hard Gate

## Result

The audited public calculator/form/trust surfaces passed.

Evidence:

- `audit/browser_verification_matrix.json`
- `audit/public_placeholder_scan.json`
- `audit/tracker_scan_after.json`
- `site/backend/tests/test_vitacorex_public_release.py`

## Public forms

Contact form:

- Invalid state reproduced before input: yes (`6` invalid fields)
- Submit redirect to thank-you: yes
- Query preservation on thank-you locale switch: yes
- Hidden attribution persisted in session storage: yes

Resources form:

- Submit redirect to thank-you: yes

Attribution fields preserved:

- `landing_page`
- `referrer`
- `utm_*`
- `gclid`
- `fbclid`
- `msclkid`
- `li_fat_id`

Evidence lines:

- `site/assets/js/vitacorex-public.js:339-340`
- `site/assets/js/vitacorex-public.js:657`
- `site/backend/services/vitacorex_lead_store.py:358`
- `site/backend/services/vitacorex_lead_store.py:370-371`
- `site/backend/services/vitacorex_lead_store.py:402`
- `site/backend/tests/test_vitacorex_public_release.py:62-65`
- `site/backend/tests/test_vitacorex_public_release.py:80-82`

## Proof / placeholder states

`audit/public_placeholder_scan.json` reports:

- `ok: true`
- `files_checked: 27`
- `issue_count: 0`

Trust-damaging visible defaults such as `0`, `$0`, or fake-proof counters were not found on the audited public pages.

Relevant owner lines:

- `site/assets/js/dealer-contract-check.js:61`
- `site/assets/js/service-module.js` is part of the restored Step 07A trust-output delta

## Non-public note

- `/app/dealer-contract-check/` was reached and then redirected to `/app/sign-in/`
- The browser gate treated this as an auth-gated non-public surface, not a public-page blocker
