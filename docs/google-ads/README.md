# Google Search Ads — Private Client Launch Plan

**Goal:** Generate qualified private-client leads for three VitaCoreX services via Google Search Ads, driving traffic to dedicated short-form intake pages.

**Status:** Site-side infrastructure is **ready**. This document is the step-by-step guide for the final manual steps inside Google Ads, GA4, and (optionally) GTM.

---

## 1. What's already built on the site

| Asset | Path | Purpose |
|---|---|---|
| Immigration intake | `/private-intake-immigration.html` | Landing page for Campaign 1 |
| Business setup intake | `/private-intake-business.html` | Landing page for Campaign 2 |
| Auto purchase intake | `/private-intake-auto.html` | Landing page for Campaign 3 |
| Thank-you (shared) | `/private-thank-you.html?service=<x>` | Conversion page, fires `generate_lead` |
| Shared CSS | `/assets/css/vcx-private-intake.css` | Home-palette styling |
| Attribution JS | `/assets/js/vcx-private-intake-attrib.js` | Captures gclid/utm_* into form submissions |

**Behavior you get for free:**

- Every form submit on the 3 intake pages persists `gclid`, `gbraid`, `wbraid`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `landing_page`, `referrer` as hidden inputs delivered to `stevenmiller@vitacorexllc.com` via `formsubmit.co`.
- Every submit fires GA4 events: `form_submit` (auto), `contact_form_submit` (auto), `consultation_request` (auto), `generate_lead` (private-intake-specific), `private_client_lead` (private-intake-specific).
- The thank-you page fires `generate_lead` and `private_client_lead` on page load with a `service` parameter (`immigration` / `business` / `auto`).
- Existing GA4 property: `G-E08EE1KSQQ` — already live.

---

## 2. Manual launch — step-by-step

### Phase A — GA4 conversion setup (20 min)

You are logged into GA4 as admin for `vitacorexllc.com`.

1. In GA4, go to **Admin → Events → Create event** (or **Events** → look for the event once it shows up).
2. Mark the following events as **conversions** (toggle the "Mark as conversion" star):
   - `generate_lead` ← **primary** conversion
   - `private_client_lead` ← backup / detailed
   - `contact_form_submit` ← secondary
3. Wait 24 hours. Submit a test form on `/private-intake-immigration.html` using a test email to seed data. Confirm in GA4 **Realtime** → `generate_lead` appears with `service: immigration`.
4. See `conversion-actions.md` for the exact event-parameter mapping.

### Phase B — Link GA4 to Google Ads (10 min)

1. In GA4 **Admin → Product linking → Google Ads links → Link**. Select your Google Ads account.
2. Enable **Personalized advertising** and **Auto-tagging**.
3. In Google Ads, go to **Tools → Conversions → New conversion action → Import → GA4 (Analytics properties)**. Import `generate_lead` and `private_client_lead`.
4. Mark `generate_lead` as your **primary action** and set **count: one per click**, **attribution: data-driven**, **value: $1.00** (you can adjust value per service later — see `conversion-actions.md`).

### Phase C — Enhanced Conversions (optional but recommended — 15 min)

Enhanced Conversions hash email + phone from the form and send them to Google to improve match rates. Since our intake forms already collect `email` + `phone`, this is basically free.

1. In Google Ads **Tools → Conversions**, open `generate_lead`.
2. Enable **Enhanced conversions for web**.
3. Choose **Google Tag** method (since site.js already loads the GA4 gtag).
4. Set user-data mapping: `email` → form `email` field, `phone_number` → form `phone` field.
5. Paste the provided snippet — no site changes needed; GA4 gtag handles it.

### Phase D — Import campaigns (15 min)

1. Install **Google Ads Editor** (free desktop app).
2. Download `campaigns.csv` (in this folder).
3. In Ads Editor: **Account → Import → From file → Select campaigns.csv**.
4. Review the 3 campaigns it imports:
   - VCX — Private — Immigration (EN)
   - VCX — Private — Business Setup (EN)
   - VCX — Private — Auto Purchase (EN)
5. For each campaign, confirm the daily budget (default in CSV: $20/day = $600/mo per campaign). Adjust to your actual monthly budget before posting.
6. Click **Post** to push to Google Ads.

### Phase E — Ad copy finalization (15 min)

1. Open `ad-copy.md`. It contains 15 headlines + 4 descriptions per ad group (meets RSA max).
2. In Ads Editor, open each ad group → **Responsive Search Ads** → paste the headlines and descriptions.
3. Pin Headline 1 (service name) to **position 1** and Headline 2 (phone number) to **position 2** for all ads to keep brand-controlled messaging.

### Phase F — Launch gate (5 min)

Before clicking **Enable**:

- [ ] GA4 `generate_lead` is marked as conversion and showing test event in realtime.
- [ ] Google Ads shows `generate_lead` as primary conversion action.
- [ ] Auto-tagging is ON (Settings → Account Settings → Auto-tagging).
- [ ] Phone number extension added: **+1 (888) 794-8292** (call tracking optional).
- [ ] Sitelink extensions: About, Resources, Privacy Policy, Contact.
- [ ] Callout extensions: "Bilingual team", "Florida-registered", "Reply in 1 business day", "Not a law firm".
- [ ] Structured snippet (Services): Immigration, Business Setup, Auto Purchase, Documentation Review.
- [ ] Location targeting: see per-campaign geo in `campaigns.csv` (default: United States).
- [ ] Negative keyword list `PrivateClient-Negatives` applied to all 3 campaigns — see `keywords.md`.
- [ ] Budget confirmed per campaign.

Enable one campaign at a time, monitor for 48 hours, then enable the next. Never enable all three on day 1.

---

## 3. Budget guidance

**Minimum viable**: $15/day per campaign × 3 campaigns = **$1,350/mo**.
Below that, Google's ML has too little data to optimize. You can run 1 campaign at $30/day first, see what converts, then scale.

**Recommended starter**: $30/day per campaign × 3 = **$2,700/mo** for 2–3 weeks, then rebalance toward the winner.

**Target CPA** (cost per acquisition / cost per lead):
- Immigration: $25–$60 per lead (high-volume, moderate-intent)
- Business setup: $40–$120 per lead (high-intent, high LTV)
- Auto purchase: $20–$50 per lead (urgency-driven)

If your average cost per click settles below $3 for immigration or auto, and below $8 for business, you're in good shape. Above that, tighten the keyword match types (Phrase > Broad).

---

## 4. Geo + language strategy

**Starter (recommended for MVP):**
- **Geo:** United States. Florida boosted +25% bid adjustment (home state, fastest intake).
- **Language:** English campaigns only. Add Russian + Spanish in Phase 2 once you have conversion data.

**Expansion (Phase 2, after 2–3 weeks of data):**
- Clone the 3 English campaigns as RU and ES variants.
- Point them at the same landing pages (they auto-translate via `vcx-i18n.js` when the user clicks the EN/RU/ES switch, but for Google Ads we should build dedicated RU/ES landing variants for Quality Score — that's Phase 2 work).

---

## 5. What NOT to do

- **Don't use Performance Max.** For lead gen at this budget, Search campaigns with manual keyword targeting give you far better control and visibility. Move to PMax only after you have 30+ conversions/mo per campaign.
- **Don't enable Display Network** on these Search campaigns. Uncheck "Include Google Display Network" in campaign settings.
- **Don't let Google auto-apply recommendations.** Go to Settings → Auto-apply recommendations → turn OFF everything except "add responsive search ad assets".
- **Don't bid on competitor brand names** at launch. Start with service-intent keywords only.
- **Don't run broad-match keywords** in Week 1 — they burn budget on irrelevant clicks. Phrase + Exact only until you have negative-keyword coverage.

---

## 6. Monitoring cadence

- **Day 1–3:** Check impressions and CTR every 12 hours. Pause any keyword with >200 impressions and <1% CTR.
- **Day 4–7:** Check search terms report. Every garbage query = new negative keyword.
- **Week 2:** Review by ad group. Pause bottom-quartile keywords. Raise bids on top-quartile.
- **Week 3:** First conversion-rate pass. If a campaign has <1 conversion at $500 spend, pause it and diagnose.
- **Week 4:** Scale the winner. Pause the loser. Launch the Russian/Spanish variants if the EN side is working.

---

## 7. Files in this folder

| File | What it is |
|---|---|
| `README.md` | This document |
| `campaigns.csv` | Google Ads Editor bulk import for 3 campaigns |
| `ad-copy.md` | Full RSA headline + description sets for each ad group |
| `keywords.md` | Keyword lists (Phrase + Exact) per ad group + shared negative keyword list |
| `conversion-actions.md` | Exact GA4 event-parameter mapping + enhanced-conversions setup |

---

## 8. What I cannot do from here

- Log into your Google Ads account (no browser in this environment).
- Link your GA4 property to Google Ads (requires your admin login).
- Verify the Google Ads account has billing enabled.
- Run payment.

These are the manual steps described above. Everything on the VitaCoreX site side is ready to accept the traffic and convert it into trackable leads.

If you hit an error in any of the steps above, paste the exact Google Ads or GA4 error message back and I'll give you the specific fix.
