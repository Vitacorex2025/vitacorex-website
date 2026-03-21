# CHANGELOG_CODEX

## Files changed

- `index.html`
- `revenue-recovery-workflow.html`
- `corporate-legal-file-control.html`
- `structured-case-intake.html`
- `contact.html`
- `additional-services.html`
- `resources.html`
- `thank-you.html`
- `careers.html`
- `ai-intake.html`
- `auto-purchase.html`
- `business-plans.html`
- `contracts.html`
- `corporate-paralegal.html`
- `immigration-documents.html`
- `net-recovery.html`
- `sitemap.xml`
- `robots.txt`
- `assets/js/site.js`
- `assets/pdf/CONFIDENTIALITY_NOTICE.txt`
- `scripts.js` removed as an unused duplicate carrying stale template logic

## What was fixed

- Removed placeholder trust-damaging outputs and fake ROI/zero-state sections from the homepage and revenue recovery flow, replacing them with explanatory measurement-focused content.
- Removed template contamination from indexable pages, including market-pulse clutter, web-project modal logic, careers mobile modal logic, floating CTA clutter, and the now-unused global PDF gate modal.
- Converted homepage executive-brief cards to direct public PDF links and cleaned public resource copy so it no longer reads as gated or confidential.
- Reworked `additional-services.html` into a short, credible secondary-services page and kept it out of search with `noindex,follow`.
- Resolved duplicate intake intent by keeping `structured-case-intake.html` as the main document-ready intake page and turning `contact.html` into a noindex helper page that routes visitors to the right next step.
- Cleaned `thank-you.html` with `noindex,follow`, a self-canonical, neutral confirmation language, and a realistic response window.
- Removed unsupported patent/application language and softened illustrative proof/economics language where it read as unsubstantiated.
- Standardized canonical URLs, unique titles, unique meta descriptions, and one clear H1 across the main pages.
- Rebuilt the sitemap to include only canonical indexable pages and excluded noindex/helper/thank-you/thin pages.
- Disabled crawl-facing multilingual switching by forcing the active shared JS to English-only behavior unless real translated URLs exist.
- Added truthful Organization JSON-LD on the homepage and BreadcrumbList JSON-LD on key internal pages.
- Added `noindex,follow` to helper redirect pages that should not appear in search.
- Removed literal FormSubmit email endpoints from page source where possible and let the active JS configure submission endpoints at runtime.

## Still requires deployment or server work

- Configure real server-side `301` redirects for helper/alias URLs if you want redirect behavior stronger than static meta refresh.
- If any PDF must be non-public, enforce access control or deploy `X-Robots-Tag` headers at the server/CDN layer; HTML copy alone will not protect it.
- Deploy the updated `robots.txt` and `sitemap.xml`, then resubmit the sitemap in Google Search Console and request recrawls for the canonical pages.
- Run live URL inspection after deploy to confirm canonicals, noindex directives, and helper-page handling are being interpreted as intended.
- Validate the production form flows after deploy, because intake/careers submission endpoints are now assigned by JS at submit time instead of being exposed directly in the HTML.
