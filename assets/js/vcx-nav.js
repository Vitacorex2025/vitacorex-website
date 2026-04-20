/* VCX dual-door nav (P02 / ADR-006)
 * Transforms inline .vcx-main-nav + .vcx-mobile-nav into a two-door dropdown
 * (For Companies · For Private Clients · shared utility)
 * and sets body[data-audience] for per-audience styling + analytics.
 *
 * Design contract:
 *  - URL preservation: no slugs change.
 *  - Home dual-entry cards: untouched (Step 2.5 visual-diff gate).
 *  - Labels locked: "For Companies" / "For Private Clients".
 *  - B2B dominant weight (rendered first, accented).
 *  - Keyboard + screen-reader support (aria-expanded, focus management).
 *
 * Load order: after vcx-translations.js (so t()-keyed labels resolve),
 *             but safe to load standalone — falls back to English innerText.
 */
(function () {
  'use strict';

  // ---------- Config: canonical nav ladder (mirrors ADR-006) ----------
  var NAV = {
    companies: {
      label: 'For Companies',
      key: 'nav_door_companies',
      items: [
        { k: 'nav_revenue_recovery',     t: 'Revenue Recovery',                              href: 'revenue-recovery-workflow.html' },
        { k: 'nav_clfc',                 t: 'Corporate Legal File Control',                  href: 'corporate-legal-file-control.html' },
        { k: 'nav_net_recovery_free',    t: 'Net Recovery Program — free pilot',             href: 'pre-collection-pilot.html' },
        { k: 'nav_controlled_ops',       t: 'Controlled Operations Pilot — $8,500/mo',       href: 'solutions.html' },
        { k: 'nav_small_claims_desk',    t: 'Small Claims & Civil Packet Desk',              href: 'small-claims-documentation.html' },
        { k: 'nav_industries',           t: 'Industries',                                    href: 'industries.html' },
        { k: 'nav_pricing_hub',          t: 'Pricing',                                       href: 'pricing-and-engagement-tiers.html' },
        { k: 'nav_sample_deliverables',  t: 'Sample Deliverables',                           href: 'sample-deliverable.html' },
        { k: 'nav_security_procurement', t: 'Security & Procurement',                        href: 'security-and-compliance.html' }
      ]
    },
    privateClients: {
      label: 'For Private Clients',
      key: 'nav_door_private',
      items: [
        { k: 'nav_contract_review',   t: 'Contract Review',            href: 'contract-review-service.html' },
        { k: 'nav_immigration',       t: 'Immigration Packet',         href: 'immigration-packet-review.html' },
        { k: 'nav_auto_deal',         t: 'Auto Deal Review',           href: 'auto-deal-review.html' },
        { k: 'nav_fl_small_claims',   t: 'Florida Small Claims',       href: 'florida-small-claims-help.html' },
        { k: 'nav_llc_formation',     t: 'LLC Formation',              href: 'llc-formation-florida.html' },
        { k: 'nav_business_plan',     t: 'Business Plan',              href: 'business-plans.html' },
        { k: 'nav_location_analysis', t: 'Location Analysis',          href: 'additional-services.html#location-analysis' },
        { k: 'nav_turnkey',           t: 'Turnkey Business Opening',   href: 'additional-services.html#turnkey' }
      ]
    },
    shared: [
      { k: 'nav_about',     t: 'About',     href: 'about.html' },
      { k: 'nav_resources', t: 'Resources', href: 'resources.html' },
      { k: 'nav_contact',   t: 'Contact',   href: 'contact.html' },
      { k: 'nav_careers',   t: 'Careers',   href: 'careers.html' }
    ]
  };

  // ---------- Audience classification (body[data-audience]) ----------
  var AUD_B2B = [
    'solutions.html', 'corporate-legal-file-control.html', 'revenue-recovery-workflow.html',
    'revenue-recovery-florida.html', 'revenue-recovery-miami.html', 'revenue-recovery-orlando.html',
    'revenue-recovery-tampa.html',
    'pre-collection-pilot.html', 'small-claims-documentation.html',
    'industries.html', 'security-and-compliance.html', 'sample-deliverable.html',
    'structured-case-intake.html', 'partners.html',
    'case-study-fleet-logistics.html', 'case-study-healthcare-network.html', 'case-study-subscription-saas.html',
    'vitacorex-vs-traditional-agency.html',
    'industry-contract-services.html', 'industry-fleet-logistics.html',
    'industry-healthcare-dental.html', 'industry-subscription-recurring.html',
    'pricing-and-engagement-tiers.html',
    // P03 samples (B2B, under /samples/)
    'ar-leakage-map.html', 'counsel-ready-packet.html', 'diagnostic-report.html'
  ];
  var AUD_B2C = [
    'contract-review-service.html', 'immigration-packet-review.html', 'auto-deal-review.html',
    'florida-small-claims-help.html', 'llc-formation-florida.html', 'business-plans.html',
    'additional-services.html', 'diagnostic-review.html',
    'i-130-petition.html', 'i-485-adjustment.html', 'n-400-naturalization.html',
    'immigration-services-tampa.html',
    // P03 samples (B2C, under /samples/)
    'contract-risk-memo.html', 'immigration-evidence-index.html', 'auto-deal-cost-breakdown.html'
  ];

  function getAudience() {
    var path = (location.pathname || '').split('/').pop();
    if (!path || path === '' || path === 'index.html') return 'shared';
    if (AUD_B2B.indexOf(path) !== -1) return 'b2b';
    if (AUD_B2C.indexOf(path) !== -1) return 'b2c';
    return 'shared';
  }

  // ---------- Translation helper (falls back to EN text if t() unavailable) ----------
  function tr(key, fallback) {
    try {
      if (typeof window.VCX_TRANSLATIONS !== 'undefined' && window.VCX_TRANSLATIONS) {
        var lang = document.documentElement.lang || 'en';
        lang = (lang || 'en').toLowerCase().slice(0, 2);
        var cat = window.VCX_TRANSLATIONS;
        if (cat[lang] && cat[lang][key]) return cat[lang][key];
        if (cat.en && cat.en[key]) return cat.en[key];
      }
    } catch (e) { /* noop */ }
    return fallback;
  }

  // ---------- Active-link detector ----------
  function isActive(href) {
    var here = (location.pathname || '').split('/').pop() || 'index.html';
    var target = (href || '').split('#')[0].split('?')[0];
    return here === target;
  }

  // ---------- CSS loader (inject once) ----------
  function ensureCss() {
    if (document.getElementById('vcx-nav-css')) return;
    var link = document.createElement('link');
    link.id = 'vcx-nav-css';
    link.rel = 'stylesheet';
    link.href = 'assets/css/vcx-nav.css?v=3';
    document.head.appendChild(link);
  }

  // ---------- Build desktop dual-door ----------
  function buildDesktop(host) {
    host.classList.add('vcx-nav-dual');
    host.setAttribute('role', 'menubar');
    host.setAttribute('aria-label', 'Primary');
    host.innerHTML = '';

    // Door A — Companies (B2B, dominant)
    host.appendChild(makeDoor('companies', NAV.companies, 'b2b'));
    // Door B — Private Clients
    host.appendChild(makeDoor('private', NAV.privateClients, 'b2c'));

    // Shared utility — flat links to the right
    var utility = document.createElement('div');
    utility.className = 'vcx-nav-dual__utility';
    NAV.shared.forEach(function (item) {
      var a = document.createElement('a');
      a.href = item.href;
      a.className = 'vcx-nav-dual__util-link' + (isActive(item.href) ? ' is-active' : '');
      a.setAttribute('data-common', item.k);
      a.textContent = tr(item.k, item.t);
      utility.appendChild(a);
    });
    host.appendChild(utility);
  }

  function makeDoor(id, door, audienceClass) {
    var wrap = document.createElement('div');
    wrap.className = 'vcx-nav-dual__door vcx-nav-dual__door--' + audienceClass;
    wrap.setAttribute('data-door', id);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'vcx-nav-dual__trigger';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-haspopup', 'true');
    btn.setAttribute('aria-controls', 'vcx-nav-panel-' + id);
    btn.setAttribute('data-common', door.key);
    btn.innerHTML = '<span class="vcx-nav-dual__label">' + escapeHtml(tr(door.key, door.label)) + '</span><span class="vcx-nav-dual__caret" aria-hidden="true">▾</span>';
    wrap.appendChild(btn);

    var panel = document.createElement('div');
    panel.id = 'vcx-nav-panel-' + id;
    panel.className = 'vcx-nav-dual__panel';
    panel.setAttribute('role', 'menu');
    panel.hidden = true;

    door.items.forEach(function (item) {
      var a = document.createElement('a');
      a.href = item.href;
      a.className = 'vcx-nav-dual__item' + (isActive(item.href) ? ' is-active' : '');
      a.setAttribute('role', 'menuitem');
      a.setAttribute('data-common', item.k);
      a.textContent = tr(item.k, item.t);
      panel.appendChild(a);
    });
    wrap.appendChild(panel);

    // Event wiring — CLICK-ONLY. Hover-to-open was removed in P17 Step 17.0.3
    // because it fired on every mouse-over (incl. just passing through the
    // header area) and both doors ended up open simultaneously with no user
    // intent. Click-to-toggle + close-others is the only model.
    function closeSiblings() {
      // Any other door that is currently open must close before we open ours.
      var others = document.querySelectorAll('.vcx-nav-dual__door.is-open');
      for (var i = 0; i < others.length; i++) {
        if (others[i] !== wrap) {
          var obtn = others[i].querySelector('.vcx-nav-dual__trigger');
          var opanel = others[i].querySelector('.vcx-nav-dual__panel');
          if (obtn) obtn.setAttribute('aria-expanded', 'false');
          if (opanel) opanel.hidden = true;
          others[i].classList.remove('is-open');
        }
      }
    }
    function open()  { closeSiblings(); btn.setAttribute('aria-expanded', 'true');  panel.hidden = false; wrap.classList.add('is-open'); }
    function close() { btn.setAttribute('aria-expanded', 'false'); panel.hidden = true;  wrap.classList.remove('is-open'); }
    function toggle() { (btn.getAttribute('aria-expanded') === 'true') ? close() : open(); }

    btn.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); toggle(); });
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); var first = panel.querySelector('a'); if (first) first.focus(); }
      if (e.key === 'Escape') { close(); }
    });
    panel.addEventListener('keydown', function (e) {
      var items = Array.prototype.slice.call(panel.querySelectorAll('a'));
      var idx = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); var n = items[idx + 1] || items[0]; n && n.focus(); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); var p = items[idx - 1] || items[items.length - 1]; p && p.focus(); }
      if (e.key === 'Escape')    { close(); btn.focus(); }
      if (e.key === 'Tab')       { close(); }
    });
    // Close on outside click
    document.addEventListener('click', function (e) { if (!wrap.contains(e.target)) close(); });

    return wrap;
  }

  // ---------- Build mobile dual-door (collapsible sections) ----------
  function buildMobile(host) {
    host.classList.add('vcx-nav-dual--mobile');
    host.innerHTML = '';

    // Companies section
    host.appendChild(makeMobileSection('companies', NAV.companies, 'b2b'));
    // Private Clients section
    host.appendChild(makeMobileSection('private', NAV.privateClients, 'b2c'));
    // Shared flat at bottom
    var utility = document.createElement('div');
    utility.className = 'vcx-nav-dual__utility vcx-nav-dual__utility--mobile';
    NAV.shared.forEach(function (item) {
      var a = document.createElement('a');
      a.href = item.href;
      a.className = 'vcx-nav-dual__util-link' + (isActive(item.href) ? ' is-active' : '');
      a.setAttribute('data-common', item.k);
      a.textContent = tr(item.k, item.t);
      utility.appendChild(a);
    });
    host.appendChild(utility);
  }

  function makeMobileSection(id, door, audienceClass) {
    var sec = document.createElement('details');
    sec.className = 'vcx-nav-dual__m-section vcx-nav-dual__m-section--' + audienceClass;
    sec.setAttribute('data-door', id);

    var sum = document.createElement('summary');
    sum.className = 'vcx-nav-dual__m-trigger';
    sum.setAttribute('data-common', door.key);
    sum.innerHTML = '<span class="vcx-nav-dual__label">' + escapeHtml(tr(door.key, door.label)) + '</span><span class="vcx-nav-dual__caret" aria-hidden="true">▾</span>';
    sec.appendChild(sum);

    var list = document.createElement('div');
    list.className = 'vcx-nav-dual__m-list';
    door.items.forEach(function (item) {
      var a = document.createElement('a');
      a.href = item.href;
      a.className = 'vcx-nav-dual__item' + (isActive(item.href) ? ' is-active' : '');
      a.setAttribute('data-common', item.k);
      a.textContent = tr(item.k, item.t);
      list.appendChild(a);
    });
    sec.appendChild(list);

    // Pre-open the section that matches current audience
    if (getAudience() === audienceClass) sec.open = true;

    return sec;
  }

  // ---------- Small helpers ----------
  function isTouch() { return window.matchMedia && window.matchMedia('(hover:none)').matches; }
  function escapeHtml(s) { return String(s || '').replace(/[&<>"']/g, function (c) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]; }); }

  // ---------- Boot ----------
  function init() {
    // Set audience attribute early for CSS cascade
    document.body.setAttribute('data-audience', getAudience());

    ensureCss();

    var desktop = document.querySelector('.vcx-main-nav');
    if (desktop) buildDesktop(desktop);

    var mobile = document.querySelector('.vcx-mobile-nav');
    if (mobile) buildMobile(mobile);

    // Re-translate after vcx-translations.js boots (event-driven)
    document.addEventListener('vcx:lang-change', refresh);
  }

  function refresh() {
    var desktop = document.querySelector('.vcx-main-nav');
    if (desktop && desktop.classList.contains('vcx-nav-dual')) buildDesktop(desktop);
    var mobile = document.querySelector('.vcx-mobile-nav');
    if (mobile && mobile.classList.contains('vcx-nav-dual--mobile')) buildMobile(mobile);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
