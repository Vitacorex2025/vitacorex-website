# Deploy Checklist

1. Replace the active deploy runtime configuration so the repo serves VitaCoreX instead of `tmp_deadline_v10_validation`.
2. Update `render.yaml` to point at the correct runtime/root/build/start commands.
3. Replace `Procfile` with the VitaCoreX runtime entrypoint or equivalent deploy command.
4. Update `Dockerfile` if container-based deployment is used.
5. Build and run a preview deployment.
6. Verify the preview serves:
   `/`, `/contact.html`, `/resources.html`, `/ru/`, `/es/`, `robots.txt`, `sitemap.xml`.
7. Confirm live response behavior:
   canonicals, hreflang, title/description, schema, status codes.
8. Confirm form flows:
   contact, resources, careers, additional services, thank-you routing.
9. Confirm analytics/tracker behavior:
   `window.VCX_TRACKING_IDS`, `dataLayer` events, hidden attribution fields, Calendly links.
10. Only after the above passes should production deployment proceed.
