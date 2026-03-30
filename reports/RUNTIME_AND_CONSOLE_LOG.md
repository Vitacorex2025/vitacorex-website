# Runtime And Console Log

## Chromium matrix

Source:
`audit/browser_verification_matrix.json`

Summary:

- `ok: true`
- `screenshots: 84`
- `console_errors: 0`
- `console_warnings: 0`
- `page_errors: 0`
- `request_failures: 0`
- `unhandled_rejections: 0`
- `non_200_documents: 0`

Interaction checks:

- Menu opens: pass
- Hidden state sync on open: pass
- Mobile switcher visible after open: pass
- Escape close: pass
- Hidden state sync on Escape: pass
- Outside click close: pass
- Navigation close: pass
- Resize reset: pass
- Desktop switcher visible: pass
- RU switch: pass
- Locale persistence across navigation: pass
- Contact form invalid state before fill: pass (`6` invalid fields)
- Contact form redirect: pass
- Attribution persisted after submit: pass
- Resources form redirect: pass
- Thank-you locale switch preserved query and lead id: pass
- Dealer check: auth-gated non-public surface, treated as non-blocking for public-site gate

## WebKit spot check

Source:
`audit/browser_verification_webkit.json`

Summary:

- `available: true`
- `home_status: 200`
- `menu_open: true`

## No blocking runtime defects reproduced

No blocking console/runtime/public-network defects were reproduced in this step after the Step 08 fix and rebuild.
