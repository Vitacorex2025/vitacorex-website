# VCX guardrails

- Preserve the current VCX visual shell, typography, spacing, card system, premium styling, header, footer, and mobile behavior.
- Prefer additive changes over rewrites.
- Do not delete or replace existing pages.
- Do not rewrite homepage or top navigation.
- Avoid modifying global files unless absolutely necessary:
  - assets/css/styles.css
  - assets/css/ui-shell.css
  - assets/js/site.js
  - assets/js/ui-shell.js
  - assets/js/premium-fixes.js
- If a global file must be touched, keep the diff minimal and document why.
- Put all new work in namespaced files and routes:
  - app/vcx-intake/
  - app/vcx-contract-review/
  - app/vcx-recovery-pilot/
  - app/vcx-packet-room/
  - app/legal-assistant/
  - assets/css/vcx-*.css
  - assets/js/vcx-*.js
  - vcx-api/
- Keep asset paths root-relative.
- No broken layout on iPhone width. No text overlap. No horizontal scroll.
- Human review must remain in the loop. Do not present autonomous legal conclusions.
- Use the reference repositories under _references/ for ideas only. Never modify them.
- Build toward these products:
  1) VCX Intake OS
  2) VCX Contract Review Desk
  3) VCX Recovery Pilot Studio
  4) VCX Packet Room / Client Portal
  5) Public-facing private-client legal assistant
- Produce docs for assumptions, architecture, and rollout steps.
