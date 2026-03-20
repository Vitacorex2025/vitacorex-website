# VitaCoreX CRM Field Map

Primary endpoint: `POST /api/vitacorex/intake`

Core lead fields:
- `lead_id`
- `purpose`
- `pipeline_stage`
- `client_type`
- `language`
- `service_line`
- `asset_requested`

Contact fields:
- `contact.full_name`
- `contact.email`
- `contact.phone`
- `contact.company_name`
- `contact.title`
- `contact.location`
- `contact.linkedin_url`

Routing and attribution:
- `context.page_path`
- `context.page_url`
- `context.page_title`
- `context.referrer`
- `context.route_key`
- `context.utm_source`
- `context.utm_medium`
- `context.utm_campaign`
- `context.utm_term`
- `context.utm_content`
- `context.gclid`
- `context.fbclid`
- `context.landing_language`

Lead scoring inputs:
- `lead_scoring.industry`
- `lead_scoring.revenue_band`
- `lead_scoring.portfolio_band`
- `lead_scoring.documentation_quality`
- `lead_scoring.urgency`
- `lead_scoring.pain_type`
- `lead_scoring.campaign_source`

Attachments:
- `attachments[].field_name`
- `attachments[].filename`
- `attachments[].content_type`
- `attachments[].size_bytes`
- `attachments[].relative_path`

Recommended CRM stage mapping:
- `company_review` -> `New`
- `executive_brief` -> `New`
- `individual_request` -> `New`
- `careers_application` -> `New`
