/* VCX 4-column footer (P02 Step 2.3 / ADR-006)
 * Transforms existing <footer class="footer"> 3-group layout into
 * a 4-column dual-door pattern:
 *   Col 1: For Companies (B2B links)
 *   Col 2: For Private Clients (B2C links)
 *   Col 3: Company (About / Careers / Contact / Intake)
 *   Col 4: Legal (Privacy / Terms / Cookies / Secure Coord / Sub-proc / Security)
 *
 * The .footer-company meta block (name / EIN / phone / disclaimer /
 * copyright / social) is preserved as a separate meta row above the
 * 4 columns.
 *
 * Runs after DOM ready. Safe to re-run: checks .footer-grid--dual marker
 * to avoid double-transform.
 */
(function () {
  'use strict';

  var COL = {
    companies: {
      header: { k: 'footer_col_companies', t: 'For Companies' },
      items: [
        { k: 'nav_revenue_recovery',     t: 'Revenue Recovery',                         href: 'revenue-recovery-workflow.html' },
        { k: 'nav_clfc',                 t: 'Corporate Legal File Control',             href: 'corporate-legal-file-control.html' },
        { k: 'nav_net_recovery_free',    t: 'Qualified Net Recovery Pilot — $0 upfront', href: 'pre-collection-pilot.html' },
        { k: 'nav_controlled_ops',       t: 'Paid Workflow Pilot — from $2,500/mo',      href: 'solutions.html' },
        { k: 'nav_small_claims_desk',    t: 'Small Claims & Civil Packet Desk',         href: 'small-claims-documentation.html' },
        { k: 'nav_industries',           t: 'Industries',                               href: 'industries.html' },
        { k: 'nav_pricing_hub',          t: 'Pricing',                                  href: 'pricing-and-engagement-tiers.html' },
        { k: 'nav_sample_deliverables',  t: 'Sample Deliverables',                      href: 'sample-deliverable.html' },
        { k: 'nav_security_procurement', t: 'Security & Procurement',                   href: 'security-and-compliance.html' }
      ]
    },
    privateClients: {
      header: { k: 'footer_col_private', t: 'For Private Clients' },
      items: [
        { k: 'nav_contract_review',   t: 'Contract Review',            href: 'contract-review-service.html' },
        { k: 'nav_immigration',       t: 'Immigration Packet',         href: 'immigration-packet-review.html' },
        { k: 'nav_auto_deal',         t: 'Auto Deal Review',           href: 'auto-deal-review.html' },
        { k: 'nav_small_claims_desk', t: 'Small Claims & Civil Packet Desk', href: 'small-claims-documentation.html' },
        { k: 'nav_llc_formation',     t: 'LLC Formation',              href: 'llc-formation-florida.html' },
        { k: 'nav_business_plan',     t: 'Business Plan',              href: 'business-plans.html' },
        { k: 'nav_location_analysis', t: 'Location Analysis',          href: 'location-analysis.html' },
        { k: 'nav_turnkey',           t: 'Turnkey Business Opening',   href: 'turnkey-business-opening.html' }
      ]
    },
    company: {
      header: { k: 'footer_col_company', t: 'Company' },
      items: [
        { k: 'nav_about',             t: 'About',                      href: 'about.html' },
        { k: 'nav_careers',           t: 'Careers',                    href: 'careers.html' },
        { k: 'nav_contact',           t: 'Contact',                    href: 'contact.html' },
        { k: 'nav_resources',         t: 'Resources',                  href: 'resources.html' },
        { k: 'footer_nav_intake',     t: 'Structured Case Intake',     href: 'structured-case-intake.html' },
        { k: 'footer_nav_deadline_cal', t: 'Deadline Calendar',        href: '/app/deadline-calendar/' },
        { k: 'footer_nav_partners',   t: 'Partners',                   href: 'partners.html' }
      ]
    },
    legal: {
      header: { k: 'footer_col_legal', t: 'Legal' },
      items: [
        { k: 'footer_nav_privacy',    t: 'Privacy Policy',             href: 'privacy-policy.html' },
        { k: 'footer_nav_terms',      t: 'Terms of Use',               href: 'terms-of-use.html' },
        { k: 'footer_nav_cookie',     t: 'Cookie Policy',              href: 'cookie-policy.html' },
        { k: 'footer_nav_secure',     t: 'Secure Coordination',        href: 'secure-coordination.html' },
        { k: 'footer_nav_subproc',    t: 'Sub-processors & DPA',       href: 'sub-processors-and-dpa.html' },
        { k: 'nav_security_procurement', t: 'Security & Compliance',   href: 'security-and-compliance.html' }
      ]
    },
    // P11.4 — State Tools: Florida-specific entry points live here, not in primary nav.
    // New states get appended here as they launch (TX/CA/NY/etc.).
    stateTools: {
      header: { k: 'footer_col_state_tools', t: 'State Tools' },
      items: [
        { k: 'nav_fl_small_claims',      t: 'Florida Small Claims',           href: 'florida-small-claims-help.html' },
        { k: 'nav_fl_revenue_recovery',  t: 'Florida Revenue Recovery',       href: 'revenue-recovery-florida.html' },
        { k: 'nav_fl_locator',           t: 'Florida Official Source Locator', href: 'additional-services.html#florida-locator' }
      ]
    }
  };

  // ---------- Translation helper (same contract as vcx-nav.js) ----------
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

  // ---------- CSS loader ----------
  function ensureCss() {
    if (document.getElementById('vcx-footer-css')) return;
    var link = document.createElement('link');
    link.id = 'vcx-footer-css';
    link.rel = 'stylesheet';
    link.href = '/assets/css/vcx-footer.css?v=2';
    document.head.appendChild(link);
  }

  // ---------- Build a column ----------
  function buildColumn(col, accentClass) {
    var group = document.createElement('div');
    group.className = 'footer-group footer-group--dual ' + (accentClass || '');

    var h = document.createElement('h3');
    h.setAttribute('data-common', col.header.k);
    h.textContent = tr(col.header.k, col.header.t);
    group.appendChild(h);

    var nav = document.createElement('nav');
    nav.className = 'footer-links footer-links--dual';
    nav.setAttribute('aria-label', col.header.t);
    col.items.forEach(function (item) {
      var a = document.createElement('a');
      a.href = item.href;
      a.setAttribute('data-common', item.k);
      a.textContent = tr(item.k, item.t);
      nav.appendChild(a);
    });
    group.appendChild(nav);

    return group;
  }

  // ---------- Structure .footer-meta children into 2 balanced columns ----------
  // Identity column: Established, EIN, Phone, Copyright (short stacked facts).
  // Legal column:    Disclaimer paragraph, trust line, public-forms note (long prose).
  // Without this, .footer-meta renders as a single stacked column and the
  // outer 0.9fr:2fr split on .footer-company creates a large empty gap to
  // the right of the heading.
  // Copyright gets its OWN full-width row below the 2-col grid (see the
  // .footer-meta__copyright block in CSS) — NOT in identity. At wide
  // viewports the legal column's prose is short enough that a copyright
  // stuck at the bottom of the identity column visually collides with
  // the trailing legal paragraph. Pulling it out into its own row with
  // a top rule eliminates the overlap and reads as a clear "signed-off"
  // line below the legal block.
  var IDENTITY_KEYS = ['footer_company', 'footer_est', 'footer_ein', 'footer_phone'];
  var LEGAL_KEYS    = ['footer_disc', 'footer_trust_line', 'footer_forms'];
  var COPYRIGHT_KEY = 'footer_copy';

  // Read the i18n key from an element. Handles both attribute conventions
  // (data-common used by the nav, data-i18n used by main-site footer HTML)
  // and falls back to the first nested child with a key (needed for the
  // phone line where the outer <p> has no key but wraps
  // <span data-i18n="footer_phone">).
  function readKey(el) {
    if (!el || !el.getAttribute) return '';
    var k = el.getAttribute('data-common') || el.getAttribute('data-i18n');
    if (k) return k;
    if (el.querySelector) {
      var nested = el.querySelector('[data-i18n], [data-common]');
      if (nested) return nested.getAttribute('data-i18n') || nested.getAttribute('data-common') || '';
    }
    return '';
  }

  function structureMeta(companyEl) {
    if (!companyEl) return;
    var meta = companyEl.querySelector('.footer-meta');
    if (!meta || meta.classList.contains('footer-meta--dual')) return;

    var identityDiv = document.createElement('div');
    identityDiv.className = 'footer-meta__identity';
    var legalDiv = document.createElement('div');
    legalDiv.className = 'footer-meta__legal';
    var copyrightDiv = document.createElement('div');
    copyrightDiv.className = 'footer-meta__copyright';

    // Pull the h3 heading into the identity column so the "VITACOREX LLC"
    // title sits at the same Y as the first line of the legal column.
    // Without this, h3 is a sibling above .footer-meta and creates a
    // visible 3-row stack: heading / identity+legal / social.
    var h3 = companyEl.querySelector(':scope > h3');
    if (h3) identityDiv.appendChild(h3);

    var children = Array.prototype.slice.call(meta.children);
    children.forEach(function (el) {
      var k = readKey(el);
      if (k === COPYRIGHT_KEY || (el.classList && el.classList.contains('footer-copyright'))) {
        // Copyright — full-width row at the bottom. Route first so the
        // class fallback wins over any accidental key match further down.
        copyrightDiv.appendChild(el);
      } else if (IDENTITY_KEYS.indexOf(k) >= 0) {
        identityDiv.appendChild(el);
      } else if (LEGAL_KEYS.indexOf(k) >= 0) {
        legalDiv.appendChild(el);
      } else if (el.classList && el.classList.contains('footer-trust-line')) {
        legalDiv.appendChild(el);
      } else if (el.classList && el.classList.contains('small-note') && !k) {
        // Unkeyed small-note (rare) defaults to legal column — legal prose
        // is the most common shape for stray small-notes in this block.
        legalDiv.appendChild(el);
      } else {
        // Anything else — keep it in the identity column to avoid data loss
        identityDiv.appendChild(el);
      }
    });

    meta.appendChild(identityDiv);
    meta.appendChild(legalDiv);
    // Only append the copyright row if something actually got routed there
    // (pages without a copyright line don't get an empty trailing row).
    if (copyrightDiv.children.length) meta.appendChild(copyrightDiv);
    meta.classList.add('footer-meta--dual');
  }

  // ---------- Transform the footer-grid ----------
  function transform(footerGrid) {
    if (!footerGrid || footerGrid.classList.contains('footer-grid--dual')) return;

    // Preserve the company meta block (if present)
    var meta = footerGrid.querySelector('.footer-company');

    // Clear existing groups
    footerGrid.innerHTML = '';
    footerGrid.classList.add('footer-grid--dual');

    // Meta row (top) — structure its children into 2 balanced columns
    if (meta) {
      structureMeta(meta);
      footerGrid.appendChild(meta);
    }

    // Four-column row
    var cols = document.createElement('div');
    cols.className = 'footer-cols footer-cols--dual';
    cols.appendChild(buildColumn(COL.companies,      'footer-group--b2b'));
    cols.appendChild(buildColumn(COL.privateClients, 'footer-group--b2c'));
    cols.appendChild(buildColumn(COL.company,        'footer-group--company'));
    cols.appendChild(buildColumn(COL.legal,          'footer-group--legal'));
    footerGrid.appendChild(cols);

    // P11.4 — State Tools row (inline strip below primary nav)
    // Only render if stateTools is defined with at least one item
    if (COL.stateTools && COL.stateTools.items && COL.stateTools.items.length) {
      var stateRow = document.createElement('div');
      stateRow.className = 'footer-state-tools';
      var stateHeader = document.createElement('span');
      stateHeader.className = 'footer-state-tools__label';
      stateHeader.setAttribute('data-common', COL.stateTools.header.k);
      stateHeader.textContent = tr(COL.stateTools.header.k, COL.stateTools.header.t) + ':';
      stateRow.appendChild(stateHeader);
      var stateLinks = document.createElement('nav');
      stateLinks.className = 'footer-state-tools__links';
      stateLinks.setAttribute('aria-label', COL.stateTools.header.t);
      COL.stateTools.items.forEach(function (item) {
        var a = document.createElement('a');
        a.href = item.href;
        a.setAttribute('data-common', item.k);
        a.textContent = tr(item.k, item.t);
        stateLinks.appendChild(a);
      });
      stateRow.appendChild(stateLinks);
      footerGrid.appendChild(stateRow);
    }
  }

  // ---------- Boot ----------
  function init() {
    ensureCss();
    var grid = document.querySelector('footer.footer .footer-grid')
            || document.querySelector('footer .footer-grid');
    if (grid) transform(grid);

    // Re-transform if language changes (text refresh)
    document.addEventListener('vcx:lang-change', function () {
      var g = document.querySelector('footer .footer-grid--dual');
      if (!g) return;
      // Refresh header text + links in-place
      var headers = g.querySelectorAll('.footer-group--dual h3');
      headers.forEach(function (h) {
        var k = h.getAttribute('data-common');
        if (k) h.textContent = tr(k, h.textContent);
      });
      var links = g.querySelectorAll('.footer-links--dual a');
      links.forEach(function (a) {
        var k = a.getAttribute('data-common');
        if (k) a.textContent = tr(k, a.textContent);
      });
      // State Tools row — refresh label + links
      var stateLabel = g.querySelector('.footer-state-tools__label');
      if (stateLabel) {
        var sk = stateLabel.getAttribute('data-common');
        if (sk) stateLabel.textContent = tr(sk, stateLabel.textContent.replace(/:$/, '')) + ':';
      }
      var stateLinks = g.querySelectorAll('.footer-state-tools__links a');
      stateLinks.forEach(function (a) {
        var k = a.getAttribute('data-common');
        if (k) a.textContent = tr(k, a.textContent);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
