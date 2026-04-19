/* P03 Step 3.5 — Sample gate form + soft access-check.
 *
 * Runs in two modes:
 *   (1) GATE PAGE  (samples/request-gated-sample.html)
 *       Reads ?s=<slug>, populates sample-specific copy, validates form,
 *       on submit writes localStorage grant + queue, shows success panel.
 *
 *   (2) GATED SAMPLE PAGE  (samples/ar-leakage-map.html, counsel-ready-packet.html)
 *       Checks localStorage grant for the current slug. If missing, shows
 *       a fixed overlay with a link back to the gate page.
 *
 * Data model (localStorage):
 *   vcxGatedAccess = {
 *     "ar-leakage-map":       { granted: true, grantedAt: ISO, payload: {...} },
 *     "counsel-ready-packet": { granted: true, grantedAt: ISO, payload: {...} }
 *   }
 *   vcxGatedRequestQueue = [ { slug, timestamp, payload } ]  // drained by P10 CRM sync
 *
 * Backend is NOT wired in this step; this is a frontend trust-gate. Backend
 * submission wiring is deferred to P10 Analytics & CRM.
 */
(function (w, d) {
  'use strict';
  if (!w || !d) return;

  var GATE_PAGE_MARKER = '.vcx-gate[data-gate="form"]';
  var GATED_SLUGS = ['ar-leakage-map', 'counsel-ready-packet'];
  var LS_KEY_ACCESS = 'vcxGatedAccess';
  var LS_KEY_QUEUE  = 'vcxGatedRequestQueue';
  var CONTACT_EMAIL = 'info@vitacorexllc.com';

  // Per-sample copy (EN fallback); i18n versions live in vcx-translations.js
  var SAMPLE_META = {
    'ar-leakage-map': {
      titleKey: 'smp_embed_ar_leakage_title',
      descKey:  'smp_embed_ar_leakage_desc'
    },
    'counsel-ready-packet': {
      titleKey: 'smp_embed_counsel_title',
      descKey:  'smp_embed_counsel_desc'
    }
  };

  function tr(key, fallback) {
    try {
      var lang = (d.documentElement.getAttribute('lang') || 'en').slice(0, 2);
      var dict = (w.VCX_TRANSLATIONS && w.VCX_TRANSLATIONS[lang]) || (w.VCX_TRANSLATIONS && w.VCX_TRANSLATIONS.en) || {};
      var v = dict[key];
      if (typeof v === 'string' && v.length) return v;
    } catch (e) {}
    return fallback || key;
  }

  function getSlugFromQuery() {
    try {
      var qs = w.location.search || '';
      var m = qs.match(/[?&]s=([a-z0-9-]+)/i);
      return m ? m[1] : '';
    } catch (e) { return ''; }
  }

  function readAccess() {
    try {
      var raw = w.localStorage.getItem(LS_KEY_ACCESS);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }

  function writeAccess(map) {
    try { w.localStorage.setItem(LS_KEY_ACCESS, JSON.stringify(map)); }
    catch (e) { /* quota / disabled */ }
  }

  function pushQueue(entry) {
    try {
      var raw = w.localStorage.getItem(LS_KEY_QUEUE);
      var arr = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(arr)) arr = [];
      arr.push(entry);
      w.localStorage.setItem(LS_KEY_QUEUE, JSON.stringify(arr));
    } catch (e) { /* ignore */ }
  }

  function hasGrant(slug) {
    var a = readAccess();
    return !!(a && a[slug] && a[slug].granted === true);
  }

  function grantAccess(slug, payload) {
    var a = readAccess();
    a[slug] = { granted: true, grantedAt: new Date().toISOString(), payload: payload || null };
    writeAccess(a);
  }

  function buildMailto(slug, payload) {
    var subj = 'Sample access request — ' + slug;
    var body = [
      'Sample requested: ' + slug,
      'Submitted: ' + new Date().toISOString(),
      '',
      'Name:       ' + (payload.name || ''),
      'Email:      ' + (payload.email || ''),
      'Company:    ' + (payload.company || ''),
      'Role:       ' + (payload.role || ''),
      'AR band:    ' + (payload.portfolio || ''),
      '',
      'Intended use:',
      (payload.use || '')
    ].join('\n');
    return 'mailto:' + CONTACT_EMAIL +
      '?subject=' + encodeURIComponent(subj) +
      '&body=' + encodeURIComponent(body);
  }

  function isEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || '').trim());
  }

  // ---------- GATE PAGE ----------
  function initGatePage(root) {
    var slug = getSlugFromQuery();
    var form = root.querySelector('[data-gate-form]');
    if (!form) return;

    // If slug unknown/missing, show all-samples fallback context and default submit to generic.
    var meta = SAMPLE_META[slug];
    var ctxSlugEl = root.querySelector('[data-gate-slug]');
    var ctxTitleEl = root.querySelector('[data-gate-sample-title]');
    if (ctxSlugEl) ctxSlugEl.textContent = slug || '(unspecified)';
    if (ctxTitleEl && meta) {
      var title = tr(meta.titleKey, slug);
      ctxTitleEl.textContent = title;
    } else if (ctxTitleEl) {
      ctxTitleEl.textContent = tr('smp_gate_unknown_sample', 'Gated sample');
    }

    // Pre-grant: if user already has access, show success state immediately.
    if (slug && hasGrant(slug)) {
      root.setAttribute('data-state', 'granted');
      wireSuccessOpen(root, slug);
      return;
    }

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      // Clear prior invalid state
      var fields = form.querySelectorAll('[data-validate]');
      var firstInvalid = null;
      fields.forEach(function (el) { el.removeAttribute('aria-invalid'); });

      var payload = {
        name:      (form.elements.namedItem('name')      || {}).value || '',
        email:     (form.elements.namedItem('email')     || {}).value || '',
        company:   (form.elements.namedItem('company')   || {}).value || '',
        role:      (form.elements.namedItem('role')      || {}).value || '',
        portfolio: (form.elements.namedItem('portfolio') || {}).value || '',
        use:       (form.elements.namedItem('use')       || {}).value || ''
      };
      var consentEl = form.elements.namedItem('consent');
      var ndaEl     = form.elements.namedItem('nda');

      function fail(el) {
        if (!el) return;
        el.setAttribute('aria-invalid', 'true');
        if (!firstInvalid) firstInvalid = el;
      }

      if (!payload.name.trim())             fail(form.elements.namedItem('name'));
      if (!isEmail(payload.email))          fail(form.elements.namedItem('email'));
      if (!payload.company.trim())          fail(form.elements.namedItem('company'));
      if (!payload.role.trim())             fail(form.elements.namedItem('role'));
      if (!payload.use.trim())              fail(form.elements.namedItem('use'));
      if (consentEl && !consentEl.checked)  fail(consentEl);
      if (ndaEl     && !ndaEl.checked)      fail(ndaEl);

      if (firstInvalid) {
        try { firstInvalid.focus(); } catch (e) {}
        return;
      }

      var finalSlug = slug && SAMPLE_META[slug] ? slug : 'unspecified';
      // Grant immediately for the requested sample (frontend trust gate).
      if (SAMPLE_META[finalSlug]) {
        grantAccess(finalSlug, payload);
      }
      // Queue for P10 CRM sync regardless (so submissions aren't lost).
      pushQueue({
        slug: finalSlug,
        timestamp: new Date().toISOString(),
        payload: payload
      });

      // Wire success panel CTAs
      var mailto = buildMailto(finalSlug, payload);
      var mailBtn = root.querySelector('[data-gate-mailto]');
      if (mailBtn) mailBtn.setAttribute('href', mailto);

      wireSuccessOpen(root, finalSlug);
      root.setAttribute('data-state', 'granted');
      // scroll to top of gate so success panel is visible
      try { root.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) {}
    }, false);
  }

  function wireSuccessOpen(root, slug) {
    var openBtn = root.querySelector('[data-gate-open]');
    if (!openBtn) return;
    if (SAMPLE_META[slug]) {
      openBtn.setAttribute('href', slug + '.html');
      openBtn.removeAttribute('aria-disabled');
    } else {
      openBtn.setAttribute('href', '../sample-deliverable.html');
      openBtn.setAttribute('aria-disabled', 'true');
    }
  }

  // ---------- GATED SAMPLE PAGE ----------
  function getCurrentSampleSlug() {
    try {
      var path = (w.location.pathname || '').toLowerCase();
      for (var i = 0; i < GATED_SLUGS.length; i++) {
        var s = GATED_SLUGS[i];
        if (path.indexOf('/samples/' + s + '.html') !== -1 ||
            path.indexOf('samples/' + s + '.html') !== -1) {
          return s;
        }
      }
    } catch (e) {}
    return '';
  }

  function mountLockOverlay(slug) {
    if (d.getElementById('vcxGateLock')) return;
    var wrap = d.createElement('div');
    wrap.className = 'vcx-gate-lock';
    wrap.id = 'vcxGateLock';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.setAttribute('aria-labelledby', 'vcxGateLockTitle');

    var eyebrow = tr('smp_gate_lock_eyebrow', 'Gated sample');
    var title   = tr('smp_gate_lock_title',   'Access required');
    var copy    = tr('smp_gate_lock_copy',
      'This sample is delivered to qualified teams under NDA. Submit a short request and you\u2019ll be returned here immediately.');
    var ctaReq  = tr('smp_gate_lock_cta_request', 'Request access');
    var ctaLib  = tr('smp_gate_lock_cta_library', 'Browse the sample library');

    wrap.innerHTML =
      '<div class="vcx-gate-lock__card">' +
        '<span class="vcx-gate-lock__eyebrow">' + eyebrow + '</span>' +
        '<h2 class="vcx-gate-lock__title" id="vcxGateLockTitle">' + title + '</h2>' +
        '<p class="vcx-gate-lock__copy">' + copy + '</p>' +
        '<div class="vcx-gate-lock__actions">' +
          '<a class="vcx-gate-lock__cta" href="request-gated-sample.html?s=' + slug + '">' + ctaReq + '</a>' +
          '<a class="vcx-gate-lock__secondary" href="../sample-deliverable.html">' + ctaLib + '</a>' +
        '</div>' +
      '</div>';

    d.body.appendChild(wrap);
  }

  function initGatedSamplePage() {
    var slug = getCurrentSampleSlug();
    if (!slug) return;
    if (GATED_SLUGS.indexOf(slug) === -1) return;
    if (hasGrant(slug)) return; // access granted, let sample render

    // Mount overlay as soon as body exists
    if (d.readyState === 'loading') {
      d.addEventListener('DOMContentLoaded', function () { mountLockOverlay(slug); });
    } else {
      mountLockOverlay(slug);
    }
  }

  // ---------- BOOTSTRAP ----------
  function boot() {
    var gateRoot = d.querySelector(GATE_PAGE_MARKER);
    if (gateRoot) {
      initGatePage(gateRoot);
      return;
    }
    initGatedSamplePage();
  }

  if (d.readyState === 'loading') {
    d.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  // Re-render the gate-page strings when language toggles on this page
  d.addEventListener('vcx:lang-change', function () {
    var gateRoot = d.querySelector(GATE_PAGE_MARKER);
    if (!gateRoot) return;
    var slug = getSlugFromQuery();
    var meta = SAMPLE_META[slug];
    var ctxTitleEl = gateRoot.querySelector('[data-gate-sample-title]');
    if (ctxTitleEl && meta) ctxTitleEl.textContent = tr(meta.titleKey, slug);
  });

})(typeof window !== 'undefined' ? window : null,
   typeof document !== 'undefined' ? document : null);
