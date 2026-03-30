# Post Deploy Smoke Tests

1. Open live `/` at desktop and mobile widths and verify menu, switcher, footer, and hero CTA.
2. Open live `/contact.html`, submit a controlled test lead, and confirm redirect to `thank-you.html` with `purpose` and `lead` query params.
3. Switch locale on the live thank-you page and confirm query preservation.
4. Open live `/resources.html` and confirm the executive brief flow still works.
5. Confirm live `/ru/` and `/es/` routes return `200` and publish the correct `lang`, canonical, and hreflang tags.
6. Verify `robots.txt` and `sitemap.xml` return `200` on production.
7. Check live response titles/descriptions on the mandatory page set.
8. Confirm there are no console errors or failed public asset requests on the mandatory page set.
9. Confirm the visible phone number and `tel:` links match `(888) 794-8292` / `tel:+18887948292`.
10. Confirm Calendly links still point to `https://calendly.com/vitacorex2025/30min`.
11. Verify analytics events in the observable layer or GA debug tooling if available.
12. Re-run live parity against the deployed site and compare it with this Step 08 export.
