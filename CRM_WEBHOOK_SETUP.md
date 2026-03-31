VitaCoreX Step 06 CRM / Webhook Routing Notes

Purpose
- The public site now uses shared route keys for all premium forms.
- If no CRM endpoint is configured, the site falls back to the current FormSubmit path.
- If a webhook is configured, the shared runtime will POST form data there first and fall back to the site transport if the webhook fails.

Supported route keys
- `company_review`
- `individual_request`
- `executive_brief_unlock`
- `careers_application`

Current front-end behavior
- `company_review`: direct multipart submit fallback with local thank-you routing
- `individual_request`: direct multipart submit fallback with local thank-you routing
- `executive_brief_unlock`: AJAX submit with immediate asset release
- `careers_application`: AJAX submit with local thank-you routing

Hidden context captured by the shared runtime
- `Route key`
- `Route label`
- `Page path`
- `Page URL`
- `Page title`
- `Language`
- `Service line`
- `Client type`
- `Service detail`
- `Asset requested`
- `Asset label`
- `Referrer`
- `UTM source`
- `UTM medium`
- `UTM campaign`
- `UTM term`
- `UTM content`
- `Submitted at`
- `Browser / Device`

How to enable a webhook
1. Define `window.VCX_FORM_ROUTING` before `assets/js/site.js` loads.
2. Add a per-route `webhookEndpoint`.
3. Optionally add `webhookMethod`, `webhookHeaders`, `ajaxEndpoint`, or `directEndpoint`.

Example
```html
<script>
window.VCX_FORM_ROUTING = {
  company_review: {
    webhookEndpoint: "https://example-crm.local/intake/company"
  },
  individual_request: {
    webhookEndpoint: "https://example-crm.local/intake/individual"
  },
  executive_brief_unlock: {
    webhookEndpoint: "https://example-crm.local/assets/unlock"
  },
  careers_application: {
    webhookEndpoint: "https://example-crm.local/recruiting/apply"
  }
};
</script>
<script src="assets/js/site.js"></script>
```

Webhook expectations
- Accept `multipart/form-data`
- Accept the visible form fields plus the hidden context fields listed above
- Return a `2xx` response when the payload is accepted

Migration guidance
- Keep route keys unchanged so thank-you routing and CTA parity remain intact.
- If a CRM requires JSON instead of multipart form data, adapt the shared route layer in `assets/js/site.js` rather than adding page-specific submit logic.
