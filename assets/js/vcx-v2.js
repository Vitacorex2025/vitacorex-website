/* VitaCoreX v2 runtime — i18n (EN/RU/ES), catalog-driven prices, header/menu/drawer,
   language control, consent, preview ribbon. Loaded with `defer` on every page.
   - Strings: /assets/i18n/{en,ru,es}.json  (flat "key": "text")
   - Catalog: /assets/data/vcx-catalog.json (single source of prices)
   - Language preference: localStorage "vcx_lang" (shared with the legacy engine)
   No dependencies. Never stores form contents. */
(function () {
  'use strict';
  var LANGS = ['en', 'ru', 'es'];
  var NATIVE = { en: 'English', ru: 'Русский', es: 'Español' };
  var STORE_KEY = 'vcx_lang';
  var PROD_HOSTS = ['vitacorexllc.com', 'www.vitacorexllc.com'];
  var VERSION = '7c8f5e7897';
  var state = { lang: 'en', dict: {}, en: {}, catalog: null, ready: false, applying: false };
  var cache = {};

  function safeGet(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
  function safeSet(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* private mode */ } }
  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function isProd() { return PROD_HOSTS.indexOf(location.hostname) !== -1; }

  function initialLang() {
    var p = new URLSearchParams(location.search).get('lang');
    if (p && LANGS.indexOf(p) !== -1) { safeSet(STORE_KEY, p); return p; }
    /* /ru/ and /es/ pages are pre-rendered in their language: the URL wins over a stored preference */
    var pageLang = document.documentElement.getAttribute('data-vx-page-lang');
    if (pageLang && LANGS.indexOf(pageLang) !== -1) { safeSet(STORE_KEY, pageLang); return pageLang; }
    var s = safeGet(STORE_KEY);
    return LANGS.indexOf(s) !== -1 ? s : 'en';
  }
  /* Keep the address in step with the language (hreflang alternates name the counterpart page); no reload, form values stay. */
  function syncLangURL(lang) {
    var alt = document.querySelector('link[rel="alternate"][hreflang="' + lang + '"]');
    if (!alt || !window.history || !history.replaceState) return;
    try {
      var path = new URL(alt.getAttribute('href'), location.href).pathname;
      if (path !== location.pathname) history.replaceState(history.state, '', path + location.search.replace(/([?&])lang=[a-z]{2}(&|$)/, '$1').replace(/[?&]$/, '') + location.hash);
    } catch (e) { /* old browsers: keep the URL */ }
  }

  function fetchJSON(url) {
    if (cache[url]) return cache[url];
    cache[url] = fetch(url + (url.indexOf('?') === -1 ? '?v=' : '&v=') + VERSION, { credentials: 'same-origin' })
      .then(function (r) { if (!r.ok) throw new Error(url + ' ' + r.status); return r.json(); });
    return cache[url];
  }

  /* ---------------- strings ---------------- */
  function t(key, params) {
    var s = state.dict[key];
    if (s == null) {
      s = state.en[key];
      if (s == null) { if (window.console) console.error('[vx-i18n] missing key', key); return ''; }
      if (state.lang !== 'en' && window.console) console.error('[vx-i18n] missing ' + state.lang + ' key', key);
    }
    if (params) s = s.replace(/\{(\w+)\}/g, function (m, k) { return params[k] != null ? params[k] : m; });
    return s;
  }

  function applyStrings(root) {
    root = root || document;
    qsa('[data-t]', root).forEach(function (el) {
      var k = el.getAttribute('data-t');
      if (!el.hasAttribute('data-t-en')) el.setAttribute('data-t-en', '1');
      var v = state.dict[k] != null ? state.dict[k] : state.en[k];
      if (v == null) { el.setAttribute('data-t-missing', state.lang); return; }
      if (state.dict[k] == null) el.setAttribute('data-t-missing', state.lang); else el.removeAttribute('data-t-missing');
      el.textContent = v;
    });
    qsa('[data-t-html]', root).forEach(function (el) {
      var k = el.getAttribute('data-t-html');
      var v = state.dict[k] != null ? state.dict[k] : state.en[k];
      if (v == null) { el.setAttribute('data-t-missing', state.lang); return; }
      if (state.dict[k] == null) el.setAttribute('data-t-missing', state.lang); else el.removeAttribute('data-t-missing');
      el.innerHTML = v; /* trusted: our own JSON files only */
    });
    qsa('[data-t-attr]', root).forEach(function (el) {
      el.getAttribute('data-t-attr').split(';').forEach(function (pair) {
        var bits = pair.split(':'); if (bits.length !== 2) return;
        var v = state.dict[bits[1].trim()] != null ? state.dict[bits[1].trim()] : state.en[bits[1].trim()];
        if (v != null) el.setAttribute(bits[0].trim(), v);
      });
    });
    /* v5 templates: {lang} from another key, {n} from data-t5-n, {money}/{ex} from the catalog — prices are never written into strings */
    qsa('[data-t5-tpl]', root).forEach(function (el) {
      var k = el.getAttribute('data-t5-tpl'), v = state.dict[k] != null ? state.dict[k] : state.en[k]; if (v == null) return;
      var lk = el.getAttribute('data-t5-lang'); if (lk) v = v.replace('{lang}', (state.dict[lk] != null ? state.dict[lk] : state.en[lk]) || '');
      if (el.hasAttribute('data-t5-n')) v = v.replace('{n}', el.getAttribute('data-t5-n'));
      var sid = el.getAttribute('data-t5-svc'), sv = sid && state.catalog ? state.catalog.services[sid] : null;
      if (sv && sv.price && sv.price.amount_cents != null) v = v.replace('{money}', money(sv.price.amount_cents)).replace('{ex}', money(2 * sv.price.amount_cents));
      if (v.indexOf('{') === -1) el.textContent = v;
    });
    qsa('[data-vx5-src-lang]', root).forEach(function (el) { el.setAttribute('lang', state.lang === 'ru' ? 'ru' : 'es'); });
    qsa('[data-vx-show-lang]', root).forEach(function (el) {
      el.hidden = el.getAttribute('data-vx-show-lang').split(/\s+/).indexOf(state.lang) === -1;
    });
    var titleKey = document.documentElement.getAttribute('data-t-title');
    if (titleKey && (state.dict[titleKey] || state.en[titleKey])) document.title = t(titleKey);
    var descKey = document.documentElement.getAttribute('data-t-desc');
    var meta = qs('meta[name="description"]');
    if (descKey && meta && (state.dict[descKey] || state.en[descKey])) meta.setAttribute('content', t(descKey));
    document.documentElement.setAttribute('lang', state.lang);
  }

  /* ---------------- catalog & prices ---------------- */
  function money(cents) {
    var whole = cents % 100 === 0;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: 2 }).format(cents / 100);
  }
  function svc(id) { return state.catalog && state.catalog.services[id]; }
  function loc(obj) { if (!obj) return ''; return obj[state.lang] || obj.en || ''; }

  /* Returns {amount, unit, tag, tagClass, short} for a service in the active language. */
  function priceInfo(id) {
    var s = svc(id); if (!s) return null;
    var p = s.price, a = p.amount_cents, out = { unit: loc(s.unit) };
    switch (p.display) {
      case 'fixed': out.amount = money(a); out.short = money(a); out.tag = t('price.tag.fixed'); out.tagClass = 'vx-tag--fixed'; break;
      case 'fixed_plus_fees': out.amount = money(a); out.short = t(p.fees_label ? 'price.plus_fees_' + p.fees_label : 'price.plus_fees', { amount: money(a) }); out.tag = t('price.tag.fixed_fees'); out.tagClass = 'vx-tag--fixed'; break;
      case 'from': out.amount = t('price.from', { amount: money(a) }); out.short = out.amount; out.tag = t('price.tag.after_review'); out.tagClass = 'vx-tag--quote'; break;
      case 'per_unit': out.amount = money(a); out.short = t('price.per_page_short', { amount: money(a) }); out.tag = t('price.tag.after_review'); out.tagClass = 'vx-tag--quote'; break;
      case 'per_hour': out.amount = money(a); out.short = t('price.per_hour_short', { amount: money(a) }); out.tag = t('price.tag.after_review'); out.tagClass = 'vx-tag--quote'; break;
      case 'per_word': out.amount = money(a); out.short = t('price.per_word_short', { amount: money(a) }); out.tag = t('price.tag.after_review'); out.tagClass = 'vx-tag--quote'; break;
      case 'free_scope': out.amount = t('price.no_charge'); out.short = out.amount; out.tag = t('price.tag.free'); out.tagClass = 'vx-tag--free'; break;
      default: out.amount = t('price.quote'); out.short = out.amount; out.tag = t('price.tag.individual'); out.tagClass = 'vx-tag--quote';
    }
    return out;
  }
  function actionLabel(id) { var s = svc(id); return s ? t('action.' + s.action) : ''; }
  function requestHref(id) { var s = svc(id); if (!s) return '/request.html'; return s.action === 'b2b' ? '/small-claims-documentation.html#check' : '/request.html?service=' + encodeURIComponent(id); }

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function priceHTML(id, opts) {
    var pi = priceInfo(id); if (!pi) return '';
    opts = opts || {};
    return '<div class="vx-price"><span class="vx-price__amount">' + esc(pi.amount) + '</span>' +
      (pi.unit ? '<span class="vx-price__unit">' + esc(pi.unit) + '</span>' : '') +
      (opts.noTag ? '' : ' <span class="vx-price__tag ' + pi.tagClass + '">' + esc(pi.tag) + '</span>') + '</div>';
  }

  function applyCatalog(root) {
    if (!state.catalog) return;
    root = root || document;
    qsa('[data-svc-name]', root).forEach(function (el) { var s = svc(el.getAttribute('data-svc-name')); if (s) el.textContent = loc(s.name); });
    qsa('[data-svc-short]', root).forEach(function (el) { var s = svc(el.getAttribute('data-svc-short')); if (s) el.textContent = loc(s.short); });
    qsa('[data-svc-unit]', root).forEach(function (el) { var s = svc(el.getAttribute('data-svc-unit')); if (s) el.textContent = loc(s.unit); });
    qsa('[data-svc-next]', root).forEach(function (el) { var s = svc(el.getAttribute('data-svc-next')); if (s) el.textContent = loc(s.next); });
    qsa('[data-svc-price-short]', root).forEach(function (el) { var pi = priceInfo(el.getAttribute('data-svc-price-short')); if (pi) el.textContent = pi.short; });
    qsa('[data-svc-price]', root).forEach(function (el) { var id = el.getAttribute('data-svc-price'); el.innerHTML = priceHTML(id, { noTag: el.hasAttribute('data-no-tag') }); });
    qsa('[data-svc-action]', root).forEach(function (el) { var id = el.getAttribute('data-svc-action'); el.textContent = actionLabel(id); if (el.tagName === 'A' && !el.hasAttribute('data-keep-href')) el.setAttribute('href', requestHref(id)); });
    qsa('[data-svc-list]', root).forEach(function (el) {
      var bits = el.getAttribute('data-svc-list').split(':'); var s = svc(bits[0]); if (!s) return;
      var items = (s[bits[1]] && (s[bits[1]][state.lang] || s[bits[1]].en)) || [];
      el.innerHTML = items.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('');
    });
    qsa('[data-vx-render="service-cards"]', root).forEach(renderServiceCards);
    qsa('[data-vx-render="pricing"]', root).forEach(renderPricing);
  }

  function serviceCard(id) {
    var s = svc(id); if (!s) return '';
    var details = s.page && s.page.indexOf('/request.html') !== 0;
    return '<article class="vx-scard" data-service="' + esc(id) + '">' +
      '<h3>' + esc(loc(s.name)) + '</h3><p>' + esc(loc(s.short)) + '</p>' + priceHTML(id) +
      '<div class="vx-scard__actions">' +
      '<a class="vx-btn vx-btn--accent" href="' + esc(requestHref(id)) + '">' + esc(actionLabel(id)) + '</a>' +
      (details ? '<a class="vx-btn vx-btn--line" href="' + esc(s.page) + '">' + esc(t('action.details')) + '</a>' : '') +
      '</div></article>';
  }
  function renderServiceCards(el) {
    var ids = (el.getAttribute('data-services') || '').split(/[\s,]+/).filter(Boolean);
    var group = el.getAttribute('data-group');
    if (group && state.catalog) { var g = state.catalog.groups.filter(function (x) { return x.id === group; })[0]; if (g) ids = g.services; }
    el.innerHTML = ids.map(serviceCard).join('');
  }
  function renderPricing(el) {
    var html = '';
    state.catalog.groups.forEach(function (g) {
      html += '<table class="vx-ptable"><caption>' + esc(loc(g.name)) + '</caption><thead><tr>' +
        '<th scope="col">' + esc(t('pricing.col.service')) + '</th><th scope="col">' + esc(t('pricing.col.price')) + '</th>' +
        '<th scope="col">' + esc(t('pricing.col.extra')) + '</th><th scope="col"><span class="vx-sr">' + esc(t('pricing.col.action')) + '</span></th></tr></thead><tbody>';
      g.services.forEach(function (id) {
        var s = svc(id), pi = priceInfo(id); if (!s) return;
        var extra = ((s.extra && (s.extra[state.lang] || s.extra.en)) || []).slice(0, 2).join(' · ');
        var link = s.page && s.page.indexOf('/request.html') !== 0 ? '<a href="' + esc(s.page) + '">' + esc(loc(s.name)) + '</a>' : esc(loc(s.name));
        html += '<tr><th scope="row">' + link + '<small>' + esc(loc(s.unit)) + '</small></th>' +
          '<td class="vx-ptable__price" data-label="' + esc(t('pricing.col.price')) + '"><span class="vx-pmark vx-pmark--' + pi.tagClass.replace('vx-tag--', '') + '" aria-hidden="true"></span>' + esc(pi.short) + '<span class="vx-sr"> (' + esc(pi.tag) + ')</span></td>' +
          '<td data-label="' + esc(t('pricing.col.extra')) + '">' + esc(extra) + '</td>' +
          '<td class="vx-ptable__go"><a class="vx-btn vx-btn--line" href="' + esc(requestHref(id)) + '">' + esc(actionLabel(id)) + '</a></td></tr>';
      });
      html += '</tbody></table>';
    });
    el.innerHTML = html;
  }

  /* ---------------- language ---------------- */
  function loadLang(lang) {
    return Promise.all([fetchJSON('/assets/i18n/en.json'), fetchJSON('/assets/i18n/' + lang + '.json')])
      .then(function (r) { state.en = r[0]; state.dict = r[1]; state.lang = lang; });
  }
  function setLang(lang, opts) {
    if (LANGS.indexOf(lang) === -1) return Promise.resolve();
    opts = opts || {};
    safeSet(STORE_KEY, lang);
    return loadLang(lang).then(function () {
      state.applying = true;
      applyStrings(); applyCatalog(); syncLangUI(); syncLangURL(lang);
      state.applying = false;
      document.dispatchEvent(new CustomEvent('vx:lang', { detail: { lang: lang } }));
      /* Legacy pages: let the old engine translate its own body content too. */
      if (!opts.fromLegacy && typeof window.vcxSetLang === 'function' && !window.__vxLegacyBusy && document.body.getAttribute('data-vx-legacy') === '1') {
        window.__vxLegacyBusy = true;
        try { window.vcxSetLang(lang); } catch (e) { /* legacy errors must not break v2 */ }
        window.__vxLegacyBusy = false;
      }
    }).catch(function (e) { if (window.console) console.error('[vx-i18n] load failed', e); });
  }
  function syncLangUI() {
    qsa('[data-vx-lang-current]').forEach(function (el) { el.textContent = NATIVE[state.lang]; });
    qsa('[data-vx-lang]').forEach(function (b) {
      var on = b.getAttribute('data-vx-lang') === state.lang;
      if (b.getAttribute('role') === 'menuitemradio') b.setAttribute('aria-checked', on ? 'true' : 'false');
      else b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  /* ---------------- header behaviours ---------------- */
  function closeAll(except) {
    qsa('.vx-nav__menu[data-open="true"], .vx-lang[data-open="true"]').forEach(function (m) {
      if (m === except) return;
      m.setAttribute('data-open', 'false');
      var b = qs('[aria-expanded]', m); if (b) b.setAttribute('aria-expanded', 'false');
    });
  }
  function initHeader() {
    var hdr = qs('.vx-hdr'); if (!hdr) return;
    var onScroll = function () { hdr.classList.toggle('is-stuck', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    /* Collapse to the menu button whenever the full navigation does not fit — covers text zoom,
       larger default fonts and long RU/ES labels, not only narrow viewports. */
    var row = qs('.vx-hdr__row', hdr);
    var fit = function () {
      if (!row) return;
      hdr.classList.remove('vx-hdr--compact');
      if (row.scrollWidth > row.clientWidth + 1 || (qs('.vx-nav', hdr) && qs('.vx-nav', hdr).scrollWidth > qs('.vx-nav', hdr).clientWidth + 1)) hdr.classList.add('vx-hdr--compact');
    };
    fit(); window.addEventListener('resize', fit); document.addEventListener('vx:lang', fit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);

    qsa('.vx-nav__menu').forEach(function (menu) {
      var btn = qs('.vx-nav__trigger', menu), timer;
      var open = function (v) { menu.setAttribute('data-open', v ? 'true' : 'false'); btn.setAttribute('aria-expanded', v ? 'true' : 'false'); };
      btn.addEventListener('click', function (e) { e.stopPropagation(); var v = menu.getAttribute('data-open') !== 'true'; closeAll(menu); open(v); });
      menu.addEventListener('mouseenter', function () { if (window.matchMedia('(hover: hover)').matches) { clearTimeout(timer); closeAll(menu); open(true); } });
      menu.addEventListener('mouseleave', function () { if (window.matchMedia('(hover: hover)').matches) { timer = setTimeout(function () { open(false); }, 400); } });
      menu.addEventListener('keydown', function (e) { if (e.key === 'Escape') { open(false); btn.focus(); } });
      menu.addEventListener('focusout', function (e) { if (!menu.contains(e.relatedTarget)) open(false); });
    });

    qsa('.vx-lang').forEach(function (box) {
      var btn = qs('.vx-lang__btn', box);
      var items = qsa('[data-vx-lang]', box);
      var open = function (v) { box.setAttribute('data-open', v ? 'true' : 'false'); btn.setAttribute('aria-expanded', v ? 'true' : 'false'); if (v) { var cur = items.filter(function (i) { return i.getAttribute('data-vx-lang') === state.lang; })[0] || items[0]; cur.focus(); } };
      btn.addEventListener('click', function (e) { e.stopPropagation(); var v = box.getAttribute('data-open') !== 'true'; closeAll(box); open(v); });
      box.addEventListener('keydown', function (e) {
        var i = items.indexOf(document.activeElement);
        if (e.key === 'Escape') { open(false); btn.focus(); }
        else if (e.key === 'ArrowDown' && i > -1) { e.preventDefault(); items[(i + 1) % items.length].focus(); }
        else if (e.key === 'ArrowUp' && i > -1) { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
      });
      box.addEventListener('focusout', function (e) { if (!box.contains(e.relatedTarget)) open(false); });
    });

    /* WCAG 1.4.13: content shown on hover must be dismissible with Escape without moving pointer or focus */
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || !qs('.vx-nav__menu[data-open="true"], .vx-lang[data-open="true"]')) return;
      closeAll();
    });
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-vx-lang]');
      if (b) { e.preventDefault(); setLang(b.getAttribute('data-vx-lang')); closeAll(); var lb = qs('.vx-lang__btn'); if (lb && qs('.vx-lang').contains(b)) lb.focus(); return; }
      if (!e.target.closest || !e.target.closest('.vx-nav__menu, .vx-lang')) closeAll();
    });

    var mbtn = qs('.vx-menu-btn'), drawer = qs('.vx-drawer');
    if (mbtn && drawer) {
      /* the sheet is a modal dialog: the page behind is inert, Tab cycles burger + sheet, Escape closes from anywhere */
      var behind = function () { return qsa('body > main, body > footer, .vx-ftr, body > .vx-notice, .vx-consent'); };
      var trap = function (e) {
        if (drawer.getAttribute('data-open') !== 'true') return;
        if (e.key === 'Escape') { e.preventDefault(); setD(false); mbtn.focus(); return; }
        if (e.key !== 'Tab') return;
        var f = [mbtn].concat(qsa('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])', drawer).filter(function (x) { return x.offsetParent !== null; }));
        var i = f.indexOf(document.activeElement);
        if (e.shiftKey && (i <= 0)) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && (i === -1 || i === f.length - 1)) { e.preventDefault(); f[0].focus(); }
      };
      var setD = function (v) {
        /* the sheet starts exactly under the header row (a preview ribbon or banner above the header must not push the row under the sheet) */
        if (v) { var hb = qs('.vx-hdr__row'); if (hb) drawer.style.top = Math.max(0, Math.round(hb.getBoundingClientRect().bottom)) + 'px'; }
        drawer.setAttribute('data-open', v ? 'true' : 'false'); mbtn.setAttribute('aria-expanded', v ? 'true' : 'false');
        if (v) { drawer.setAttribute('role', 'dialog'); drawer.setAttribute('aria-modal', 'true'); drawer.setAttribute('aria-label', t('nav.menu')); }
        else { drawer.removeAttribute('role'); drawer.removeAttribute('aria-modal'); }
        behind().forEach(function (el) { if (v) el.setAttribute('inert', ''); else el.removeAttribute('inert'); });
        if (v) document.addEventListener('keydown', trap); else document.removeEventListener('keydown', trap);
        document.body.classList.toggle('vx-drawer-open', v);
        var lbl = qs('[data-vx-menu-label]', mbtn); if (lbl) lbl.textContent = t(v ? 'nav.close' : 'nav.menu');
        if (v) { var first = qs('button, a', drawer); if (first) first.focus(); }
      };
      mbtn.addEventListener('click', function () { setD(drawer.getAttribute('data-open') !== 'true'); });
      drawer.addEventListener('click', function (e) { if (e.target.closest('a')) setD(false); });
      window.addEventListener('resize', function () { if (window.innerWidth > 1180 && drawer.getAttribute('data-open') === 'true') setD(false); });
    }

    var path = location.pathname.replace(/\/index\.html$/, '/');
    qsa('.vx-nav > a').forEach(function (a) { var h = a.getAttribute('href'); if (h && (h === path || (h !== '/' && path.indexOf(h) === 0))) a.setAttribute('aria-current', 'page'); });
    /* Services trigger: current on the services index and on every catalog service page (all languages) */
    var trig = qs('.vx-nav__trigger'), bare = path.replace(/^\/(ru|es)\//, '/');
    if (trig && !qs('.vx-nav > a[aria-current]')) {
      var svcPages = { '/services.html': 1 };
      if (state.catalog) Object.keys(state.catalog.services).forEach(function (id) { var pg = state.catalog.services[id].page; if (pg && pg.indexOf('/request.html') !== 0) svcPages[pg.split('#')[0]] = 1; });
      if (svcPages[bare]) trig.setAttribute('aria-current', 'true');
    }
  }

  /* ---------------- consent (same key/values as legacy site.js) ---------------- */
  function loadScript(src) { if (document.querySelector('script[src="' + src + '"]')) return; var s = document.createElement('script'); s.src = src; s.async = true; document.head.appendChild(s); }
  function applyConsent(c) {
    window.vcxConsent = c;
    if (c === 'essential' || !isProd()) return; /* no analytics on preview/local hosts */
    var ids = window.VCX_TRACKING_IDS || {};
    if (ids.ga4) {
      loadScript('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ids.ga4));
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date()); window.gtag('config', ids.ga4, { anonymize_ip: true });
    }
    if (ids.apolloAppId && !window.__vcx_apollo_loaded) {
      window.__vcx_apollo_loaded = true;
      var s = document.createElement('script');
      s.src = 'https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache=' + Math.random().toString(36).slice(2, 9);
      s.async = true; s.onload = function () { if (window.trackingFunctions && window.trackingFunctions.onLoad) window.trackingFunctions.onLoad({ appId: ids.apolloAppId }); };
      document.head.appendChild(s);
    }
  }
  function initConsent() {
    if (document.querySelector('.cookie-banner')) return; /* legacy page owns its banner */
    if (document.body.getAttribute('data-vx-legacy') === '1') return;
    var saved = safeGet('vcx_cookie_consent');
    if (saved) { applyConsent(saved); return; }
    var bar = document.createElement('section');
    bar.className = 'vx-consent'; bar.setAttribute('aria-label', t('consent.label'));
    /* two equal choices, neither highlighted (AD §9.7); the page reserves the slip's height so it never covers content */
    bar.innerHTML = '<p class="vx-consent__title" data-t="consent.title">' + esc(t('consent.title')) + '</p><p class="vx-consent__full" data-t-html="consent.text">' + t('consent.text') + '</p><p class="vx-consent__short" data-t-html="consent.short">' + t('consent.short') + '</p><div class="vx-consent__actions">' +
      '<button type="button" class="vx-btn vx-btn--ghost" data-c="essential" data-t="consent.essential">' + esc(t('consent.essential')) + '</button>' +
      '<button type="button" class="vx-btn vx-btn--ghost" data-c="analytics" data-t="consent.accept">' + esc(t('consent.accept')) + '</button></div>';
    var reserve = function () { document.body.style.paddingBottom = (bar.offsetHeight + 32) + 'px'; };
    /* phones: the slip docks after the first scroll, so it never covers the hero's primary button on the first screen */
    var show = function () { if (bar.isConnected) return; document.body.appendChild(bar); reserve(); };
    /* any viewport: wait for the first scroll if the slip would cover the hero's primary button or price chips */
    var covers = function () {
      var h = window.innerHeight, w = Math.min(window.innerWidth, 536), top = h - 280;
      return qsa('.vx5-hero .vx5-btn, .vx5-hero .vx5-chip, .vx-phero .vx-btn, .vx-hero3 .vx-btn').some(function (b) {
        var r = b.getBoundingClientRect(); return r.width && r.bottom > top && r.top < h && r.left < w;
      });
    };
    var phone = window.matchMedia && window.matchMedia('(max-width: 47.99em)').matches;
    if ((phone || covers()) && (window.scrollY || 0) < 120) {
      var onScroll = function () { if ((window.scrollY || 0) >= 120) { window.removeEventListener('scroll', onScroll); show(); } };
      window.addEventListener('scroll', onScroll, { passive: true });
    } else show();
    window.addEventListener('resize', reserve);
    qsa('[data-c]', bar).forEach(function (b) { b.addEventListener('click', function () { var c = b.getAttribute('data-c'); safeSet('vcx_cookie_consent', c); bar.remove(); window.removeEventListener('resize', reserve); document.body.style.paddingBottom = ''; applyConsent(c); }); });
  }

  function initPreviewRibbon() {
    if (isProd()) return;
    var r = document.createElement('div'); r.className = 'vx-preview-ribbon'; r.setAttribute('role', 'note');
    r.setAttribute('data-t', 'preview.banner'); r.textContent = t('preview.banner');
    document.body.insertBefore(r, document.body.firstChild);
  }

  /* ---------------- small shared behaviours ---------------- */
  function initBehaviours() {
    /* segmented switch: <div class="vx-switch" data-vx-switch="#target" data-attr="data-mode"><button data-value=…> */
    qsa('[data-vx-switch]').forEach(function (sw) {
      var target = qs(sw.getAttribute('data-vx-switch')); if (!target) return;
      var attr = sw.getAttribute('data-attr') || 'data-mode';
      qsa('button[data-value]', sw).forEach(function (b) {
        b.addEventListener('click', function () {
          target.setAttribute(attr, b.getAttribute('data-value'));
          qsa('button[data-value]', sw).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        });
      });
    });
    /* FAQ: animate height open/close, keep native <details> semantics */
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) qsa('.vx-faq details').forEach(function (d) {
      var sum = qs('summary', d), body = qs('summary + div', d); if (!sum || !body) return;
      sum.addEventListener('click', function (e) {
        e.preventDefault();
        if (d.open) {
          var h = body.scrollHeight; body.style.height = h + 'px';
          requestAnimationFrame(function () { body.style.transition = 'height .28s cubic-bezier(.16,1,.3,1)'; body.style.height = '0px'; });
          body.addEventListener('transitionend', function te() { body.removeEventListener('transitionend', te); d.open = false; body.style.cssText = ''; });
        } else {
          d.open = true; var h2 = body.scrollHeight; body.style.height = '0px';
          requestAnimationFrame(function () { body.style.transition = 'height .32s cubic-bezier(.16,1,.3,1)'; body.style.height = h2 + 'px'; });
          body.addEventListener('transitionend', function te2() { body.removeEventListener('transitionend', te2); body.style.cssText = ''; });
        }
      });
    });
  }

  /* ---------------- public API ---------------- */
  window.VX = {
    t: t, money: money, priceInfo: priceInfo, priceHTML: priceHTML, svc: svc, loc: loc, esc: esc,
    lang: function () { return state.lang; }, setLang: setLang, isProd: isProd,
    catalog: function () { return state.catalog; },
    apiBase: function () {
      var m = qs('meta[name="vcx-api"]'); if (!m) return '';
      var base = m.getAttribute('content').replace(/\/$/, '');
      /* Preview on a phone over the LAN: "localhost" in the meta would point at the phone itself,
         so reuse the host the page was loaded from (same machine serves the API on :8787). */
      if (/\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(base) && !/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) {
        base = base.replace(/\/\/(localhost|127\.0\.0\.1)/, '//' + location.hostname);
      }
      return base;
    },
    ready: null, apply: function (root) { applyStrings(root); applyCatalog(root); }
  };

  /* Legacy engine fires vcx:lang-change; keep v2 strings in sync without loops. */
  document.addEventListener('vcx:lang-change', function (e) {
    var l = (e && e.detail && (e.detail.lang || e.detail)) || safeGet(STORE_KEY);
    if (typeof l === 'string' && l !== state.lang && !state.applying && LANGS.indexOf(l) !== -1) setLang(l, { fromLegacy: true });
  });

  var lang = initialLang();
  window.VX.ready = Promise.all([loadLang(lang), fetchJSON('/assets/data/vcx-catalog.json').then(function (c) { state.catalog = c; })])
    .then(function () {
      applyStrings(); applyCatalog(); syncLangUI(); syncLangURL(lang); initHeader(); initBehaviours(); initPreviewRibbon(); initConsent();
      state.ready = true;
      document.documentElement.classList.add('vx-ready');
      document.dispatchEvent(new CustomEvent('vx:ready', { detail: { lang: state.lang } }));
      if (lang !== 'en' && typeof window.vcxSetLang === 'function' && document.body.getAttribute('data-vx-legacy') === '1') { try { window.vcxSetLang(lang); } catch (e) { /* ignore */ } }
    })
    .catch(function (e) { if (window.console) console.error('[vx] init failed', e); initHeader(); });
})();
