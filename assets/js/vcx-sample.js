/* vcx-sample.js — Sample page runtime.
 * Anchored by ADR-008 Sample Deliverable Standards.
 * - Injects the branded top-nav bar with ← back link (v2+)
 * - Injects the sticky banner + diagonal watermark (idempotent, DOM-first)
 * - Reads page-local PAGE_DATA (inline, per-sample) and applies to [data-smp] targets
 * - Listens to vcx:lang-change so RU/ES switching works
 * - Pure vanilla, no framework, no cross-page state
 */
(function () {
  'use strict';

  var TOPNAV_ID = 'vcx-sample-topnav';
  var BANNER_ID = 'vcx-sample-banner';
  var WATER_ID  = 'vcx-sample-watermark';

  // Default strings; PAGE_DATA can override via smp_watermark / smp_banner_text.
  var DEFAULTS = {
    en: { banner: 'This is a redacted sample · Not a live client document · VitaCoreX LLC is not a law firm',
          watermark: 'SAMPLE — NOT A CLIENT DELIVERABLE' },
    ru: { banner: 'Это отредактированный пример · Не живой клиентский документ · VitaCoreX LLC не является юридической фирмой',
          watermark: 'ОБРАЗЕЦ — НЕ КЛИЕНТСКИЙ ДОКУМЕНТ' },
    es: { banner: 'Esta es una muestra redactada · No es un documento real de cliente · VitaCoreX LLC no es un bufete juridico',
          watermark: 'MUESTRA — NO ES UN DOCUMENTO DE CLIENTE' }
  };

  function currentLang() {
    var h = document.documentElement;
    var l = h.getAttribute('lang') || (window.VCX_LANG || 'en');
    l = String(l).toLowerCase().slice(0, 2);
    return DEFAULTS[l] ? l : 'en';
  }

  function pick(lang, key) {
    var pd = window.PAGE_DATA || {};
    var node = pd[lang] || pd.en || {};
    if (node[key]) return node[key];
    return DEFAULTS[lang][key.replace(/^smp_/, '').replace('watermark_text', 'watermark').replace('banner_text', 'banner')] || '';
  }

  // ---------- Branded top-nav (← back to samples hub) ----------
  // Labels: EN / RU / ES
  var TOPNAV_LABELS = {
    back: { en: 'Sample Deliverables', ru: 'Образцы', es: 'Muestras' },
    brand: { en: 'VitaCoreX LLC', ru: 'VitaCoreX LLC', es: 'VitaCoreX LLC' }
  };

  function ensureTopNav() {
    if (document.getElementById(TOPNAV_ID)) return;
    var lang = currentLang();
    var backLabel  = TOPNAV_LABELS.back[lang]  || TOPNAV_LABELS.back.en;
    var brandLabel = TOPNAV_LABELS.brand[lang] || TOPNAV_LABELS.brand.en;

    var nav = document.createElement('nav');
    nav.id = TOPNAV_ID;
    nav.className = 'vcx-sample-topnav';
    nav.setAttribute('aria-label', 'Sample navigation');

    var back = document.createElement('a');
    back.className = 'vcx-sample-topnav__back';
    back.href = '/sample-deliverable.html';
    back.innerHTML =
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="2.5" stroke-linecap="round" ' +
      'stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M19 12H5M12 19l-7-7 7-7"/></svg>' +
      '<span>' + backLabel + '</span>';

    var brand = document.createElement('a');
    brand.className = 'vcx-sample-topnav__brand';
    brand.href = '/';
    brand.textContent = brandLabel;

    nav.appendChild(back);
    nav.appendChild(brand);

    // Insert as the very first child of body — topnav must precede banner
    var body = document.body;
    if (body.firstChild) body.insertBefore(nav, body.firstChild);
    else body.appendChild(nav);
  }

  function ensureBanner() {
    var el = document.getElementById(BANNER_ID);
    if (!el) {
      el = document.createElement('div');
      el.id = BANNER_ID;
      el.className = 'vcx-sample-banner';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      var body = document.body;
      // Insert after topnav (if present), else as first child
      var topnav = document.getElementById(TOPNAV_ID);
      if (topnav && topnav.nextSibling) {
        body.insertBefore(el, topnav.nextSibling);
      } else if (topnav) {
        body.appendChild(el);
      } else if (body.firstChild) {
        body.insertBefore(el, body.firstChild);
      } else {
        body.appendChild(el);
      }
    }
    return el;
  }

  function ensureWatermark() {
    var el = document.getElementById(WATER_ID);
    if (!el) {
      el = document.createElement('div');
      el.id = WATER_ID;
      el.className = 'vcx-sample-watermark';
      el.setAttribute('aria-hidden', 'true');
      var inner = document.createElement('span');
      el.appendChild(inner);
      document.body.appendChild(el);
    }
    return el;
  }

  function paint() {
    var lang = currentLang();
    var defaults = DEFAULTS[lang];
    var pd = (window.PAGE_DATA && (window.PAGE_DATA[lang] || window.PAGE_DATA.en)) || {};

    // Banner + watermark
    var bannerText = pd.smp_banner_text || defaults.banner;
    var waterText  = pd.smp_watermark_text || defaults.watermark;

    var banner = ensureBanner();
    banner.innerHTML = '<strong>' + (pd.smp_banner_prefix || 'Sample') + '</strong> &middot; ' + bannerText;

    var water = ensureWatermark();
    var inner = water.querySelector('span');
    if (inner) inner.textContent = waterText;

    // Generic [data-smp="key"] → PAGE_DATA[lang][key]
    var nodes = document.querySelectorAll('[data-smp]');
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      var k = n.getAttribute('data-smp');
      if (!k) continue;
      var v = pd[k];
      if (v == null && window.PAGE_DATA && window.PAGE_DATA.en) v = window.PAGE_DATA.en[k];
      if (v == null) continue;
      if (n.tagName === 'TITLE') document.title = v;
      else n.textContent = v;
    }
  }

  function boot() {
    ensureTopNav();   // branded back-nav bar — must precede ensureBanner
    paint();
    document.addEventListener('vcx:lang-change', paint);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
