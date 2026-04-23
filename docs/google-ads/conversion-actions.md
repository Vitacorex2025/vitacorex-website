# GA4 Conversion Actions — Wiring Guide

This document maps the exact GA4 events fired by the site to the Google Ads conversion actions you should create.

**Site-side status:** All events below fire automatically. No code changes required.

---

## Events fired by the site

### On form submit (private intake pages)

Location: `/private-intake-immigration.html`, `/private-intake-business.html`, `/private-intake-auto.html`

Events fired (in order):

| Event | Source | Parameters |
|---|---|---|
| `form_submit` | `assets/js/site.js` (auto) | `form_name: <id>` |
| `contact_form_submit` | `assets/js/site.js` (auto) | `form_name: <id>` |
| `consultation_request` | `assets/js/site.js` (auto) | `form_name: <id>` |
| `generate_lead` | `assets/js/vcx-private-intake-attrib.js` | `currency: USD, value: 1.0, service: <immigration\|business\|auto>, form_id: <form_id>` |
| `private_client_lead` | `assets/js/vcx-private-intake-attrib.js` | `service: <immigration\|business\|auto>, form_id: <form_id>` |

### On thank-you page load

Location: `/private-thank-you.html?service=<immigration|business|auto>`

| Event | Source | Parameters |
|---|---|---|
| `generate_lead` | inline script on page | `currency: USD, value: 1.0, service: <x>, page: private_thank_you` |
| `private_client_lead` | inline script on page | `service: <x>, page: private_thank_you` |

> **Why two fire points?** The form-submit events catch clients whose thank-you redirect fails (browser back button, network blip, ad-blocker). The thank-you events catch clients where JS on the form page was blocked but the thank-you redirect succeeded. You want both, and session-storage dedup (built into the JS) prevents the same submission from counting twice.

---

## Google Ads conversion actions to create

Create in Google Ads under **Tools → Conversions → + New conversion action → Website → Import from GA4**.

### Primary: `generate_lead` (import from GA4)

| Setting | Value |
|---|---|
| Goal | Lead form submission |
| Name | `VCX Private Client Lead` |
| Count | **One** per click (prevents double-counting on form+thank-you) |
| Value | Use GA4 value (sent as 1.0 per event) |
| Click-through conversion window | 30 days |
| View-through conversion window | 1 day |
| Attribution model | **Data-driven** |
| Include in "Conversions" column | **Yes** |
| Enhanced conversions | **Enable** (Google Tag, user-provided email + phone) |

### Secondary: `private_client_lead` (import from GA4)

| Setting | Value |
|---|---|
| Goal | Secondary lead action |
| Name | `VCX Private Client Lead (detail)` |
| Count | One per click |
| Value | 0 (diagnostic only) |
| Include in "Conversions" column | **No** |
| Attribution | Last click |

> We mark `private_client_lead` as non-primary because it duplicates `generate_lead` — it exists for cleaner filtering in GA4 reports without polluting Google Ads primary-conversion reporting.

### Tertiary (optional): `contact_form_submit` (import from GA4)

| Setting | Value |
|---|---|
| Goal | Contact form submission |
| Name | `VCX Contact Form` |
| Count | One per click |
| Value | 0 |
| Include in "Conversions" column | **No** |
| Attribution | Last click |

This catches traffic from the existing `/structured-case-intake.html` and `/contact.html` forms too (useful if Google Ads traffic lands on those B2B forms by accident).

---

## Service-level value adjustments (optional, recommended at Week 3+)

After 30+ conversions across campaigns, adjust conversion values per service to optimize Smart Bidding:

### In GA4 (Admin → Events → generate_lead → Modify event)

Edit the `generate_lead` event to remap `value` based on `service`:

- If `service = immigration` → `value = 50`
- If `service = business` → `value = 150`
- If `service = auto` → `value = 30`

Why these numbers:
- Immigration: avg packet review $149–$399 → use 1/5 of avg revenue (accounts for close rate ~30–40%) → ~$50
- Business setup: avg turnkey $599–$899 → use 1/5 of avg revenue → ~$150
- Auto: avg review $89–$219 → use 1/5 of avg revenue → ~$30

Once values are flowing, switch Google Ads Smart Bidding strategy from **Maximize Conversions** to **Maximize Conversion Value → Target ROAS** (start at 3.0 = $3 revenue per $1 spend).

---

## Verification checklist

Before enabling any campaign, verify all of the following in GA4 Realtime:

- [ ] Open `/private-intake-immigration.html?gclid=TEST-001&utm_source=test` in incognito.
- [ ] Fill and submit form with test email.
- [ ] Within 60 seconds, GA4 Realtime → Events should show `generate_lead` with `service: immigration`.
- [ ] Check the `formsubmit.co` email delivery — confirm hidden fields `gclid=TEST-001`, `utm_source=test`, `landing_page=/private-intake-immigration.html` are all in the body.
- [ ] Repeat for `/private-intake-business.html?gclid=TEST-002` and `/private-intake-auto.html?gclid=TEST-003`.
- [ ] In Google Ads **Tools → Conversions**, your imported `generate_lead` should show "Receiving conversions" within 24 hours.

If GA4 Realtime does NOT show `generate_lead`:

1. Open the intake page, open browser DevTools → Console.
2. Submit the form.
3. Look for `[vcx-attrib]` warnings in the console.
4. Check that `window.gtag` is defined (`typeof gtag` in console should be `'function'`).
5. If `gtag` is undefined, check that consent is granted (our consent-aware loader only loads gtag after user consent). In DevTools Application → Cookies → look for `vcx_consent`. If it says `rejected`, clear and reload.

---

## Attribution parameter flow

This is the end-to-end flow for one Google Ads click:

```
1. User clicks Google Ad → lands on /private-intake-immigration.html?gclid=ABC123&utm_source=google&utm_campaign=vcx_immigration&utm_content=i130_exact
2. vcx-private-intake-attrib.js reads URL params, writes them to sessionStorage
3. Same script appends hidden <input> for each param to the intake form
4. User fills and submits form
5. site.js auto-fires form_submit event
6. vcx-private-intake-attrib.js fires generate_lead event to GA4 with service=immigration
7. formsubmit.co POSTs all form fields (including gclid, utm_*, landing_page, referrer) to stevenmiller@vitacorexllc.com
8. formsubmit.co 302 redirects browser to /private-thank-you.html?service=immigration
9. Thank-you page loads → inline script fires generate_lead + private_client_lead to GA4
10. GA4 attributes the lead to Google Ads via gclid (auto-tagging) and utm_* (manual)
11. Google Ads imports generate_lead as a conversion
12. Smart Bidding sees the conversion 24–48 hours later and starts optimizing
```

Every step above is already wired. Nothing is mock or placeholder.
