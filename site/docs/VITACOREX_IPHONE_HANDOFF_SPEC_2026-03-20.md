# VitaCoreX iPhone Handoff Spec

Do now on mobile web:
- Keep one primary action per viewport
- Use `email`, `tel`, and `inputmode`-aware fields
- Store attribution and routing context server-side
- Keep attachments optional and readable on narrow widths

Native iPhone layer should wait for authenticated workflows:
- Executive dashboard
- Outstanding document checklist
- Matter readiness state
- Review follow-up reminders

Do not build:
- A brochure-only native wrapper
- Widget surfaces without real authenticated data

Web-to-native bridge:
- Public site -> structured intake
- Structured intake -> authenticated portal when account access exists
- Portal -> future native dashboard/checklist/reminder surfaces
