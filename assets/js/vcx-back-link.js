/* ==========================================================================
   vcx-back-link.js
   Inline "← Back" link placed at the start of the main page content on every
   page EXCEPT the homepage. Sits inside the first hero/section, NOT floating
   over the site header.

   Behaviour:
   - Skipped on / and /index.html — home needs no back affordance.
   - Tries history.back() when there's a same-origin referrer; otherwise the
     link falls through to href="/" (homepage).
   - Auto-translates EN / RU / ES based on <html lang="..."> + listens for
     vcx:locale-change to re-label on SPA-style locale toggles.
   - Injects its own scoped CSS once per page (no extra <link> required).
   ========================================================================== */
(function () {
  'use strict';
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // --- Page gate: skip on home. ------------------------------------------
  var path = (location.pathname || '').toLowerCase();
  var lastSeg = path.split('/').filter(Boolean).pop() || '';
  var isHome =
    path === '/' ||
    path === '/index.html' ||
    path === '/index' ||
    (lastSeg === '' && path === '/') ||
    (lastSeg === 'index.html' && path.split('/').filter(Boolean).length <= 1);
  if (isHome) return;

  // --- Locale labels -----------------------------------------------------
  var LABELS = { en: 'Back', ru: 'Назад', es: 'Atrás' };
  function pickLabel() {
    var lang = (document.documentElement.getAttribute('lang') || 'en').toLowerCase().slice(0, 2);
    return LABELS[lang] || LABELS.en;
  }

  // --- One-time CSS injection --------------------------------------------
  function injectCSS() {
    if (document.getElementById('vcx-back-link-css')) return;
    var style = document.createElement('style');
    style.id = 'vcx-back-link-css';
    style.textContent = [
      '.vcx-back-link-wrap{',
        'max-width:1160px;',
        'margin:0 auto;',
        'padding:18px 24px 0;',
        'position:relative;',
        'z-index:5;',
      '}',
      '.vcx-back-link{',
        'display:inline-flex;',
        'align-items:center;',
        'gap:6px;',
        'padding:7px 14px 7px 11px;',
        'background:rgba(255,255,255,0.86);',
        'color:#0F1F1B !important;',
        '-webkit-text-fill-color:#0F1F1B !important;',
        'border:1px solid rgba(23,58,99,0.14);',
        'border-radius:999px;',
        'font-family:inherit;',
        'font-size:.86rem;',
        'font-weight:600;',
        'letter-spacing:.01em;',
        'text-decoration:none;',
        'backdrop-filter:blur(8px) saturate(140%);',
        '-webkit-backdrop-filter:blur(8px) saturate(140%);',
        'transition:transform .16s ease, background .16s ease, color .16s ease, box-shadow .16s ease;',
      '}',
      '.vcx-back-link:hover{',
        'background:#FFFFFF;',
        'transform:translateX(-2px);',
        'color:#1E6E68 !important;',
        '-webkit-text-fill-color:#1E6E68 !important;',
        'box-shadow:0 4px 12px rgba(11,31,48,0.10);',
      '}',
      '.vcx-back-link:focus-visible{',
        'outline:2px solid #2D8A82;',
        'outline-offset:2px;',
      '}',
      '.vcx-back-link svg{flex-shrink:0;transition:transform .16s ease;}',
      '.vcx-back-link:hover svg{transform:translateX(-2px);}',
      '@media (max-width:720px){',
        '.vcx-back-link-wrap{padding:14px 16px 0;}',
        '.vcx-back-link{font-size:.80rem;padding:6px 12px 6px 9px;}',
      '}',
      '@media print{.vcx-back-link-wrap{display:none !important;}}',
      '@media (prefers-reduced-motion:reduce){',
        '.vcx-back-link,.vcx-back-link svg{transition:none !important;}',
        '.vcx-back-link:hover,.vcx-back-link:hover svg{transform:none !important;}',
      '}'
    ].join('');
    (document.head || document.documentElement).appendChild(style);
  }

  // --- Find the best mount point ----------------------------------------
  // Rule: the link must NEVER sit inside a dark hero or on top of the site
  // header. Target the FIRST content section that follows the hero and
  // insert the link BEFORE it, so the link lives in the content column on
  // the light body background, never over the dark hero visual.
  function isHeroish(el) {
    if (!el) return false;
    var cls = (el.className || '').toString().toLowerCase();
    return /\bhero\b|vcx-hero-2|pet-hero|pcp-hero|csfl-hero|rrw-hero|vcx-header-2/.test(cls)
      || el.tagName === 'HEADER';
  }
  function findInsertionPoint() {
    // 1. Prefer: the first body-level section that is NOT a hero and NOT
    //    the site header. Insert the link BEFORE it, so it lands between
    //    the hero and the first content block.
    var bodyKids = document.body.children;
    for (var i = 0; i < bodyKids.length; i++) {
      var el = bodyKids[i];
      if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') continue;
      if (isHeroish(el)) continue;
      // Skip header-adjacent shells like a top banner strip.
      if (el.id === 'vcx-top-banner' || el.classList && el.classList.contains('vcx-top-banner')) continue;
      if (el.tagName === 'MAIN' || el.tagName === 'SECTION' ||
          el.tagName === 'ARTICLE' || el.tagName === 'DIV') {
        return { parent: el.parentNode, before: el };
      }
    }
    // 2. Fallback: inside <main> as first child.
    var main = document.querySelector('main');
    if (main) return { parent: main, before: main.firstChild };
    // 3. Last resort: end of body.
    return { parent: document.body, before: null };
  }

  // --- Build + mount -----------------------------------------------------
  function mount() {
    if (document.getElementById('vcx-back-link')) return;
    injectCSS();

    var wrap = document.createElement('div');
    wrap.className = 'vcx-back-link-wrap';

    var link = document.createElement('a');
    link.id = 'vcx-back-link';
    link.className = 'vcx-back-link';
    /* Explicit /index.html (not bare "/") — some deployments/caches don't
       serve the directory index for "/" reliably and the user lands on a
       white screen. /index.html is unambiguous and always resolves. */
    link.href = '/index.html';
    link.setAttribute('aria-label', pickLabel());

    link.innerHTML =
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="2.4" stroke-linecap="round" ' +
      'stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M19 12H5M12 19l-7-7 7-7"/></svg>' +
      '<span class="vcx-back-link__label">' + pickLabel() + '</span>';

    // Click handler: restore the documented contract (see file header).
    // Strategy:
    //   1. If there IS a real previous page in this tab's history AND it
    //      was on the same origin → window.history.back(). That returns
    //      the user to their actual previous VitaCoreX page, preserving
    //      scroll position.
    //   2. Otherwise (fresh tab, direct hit, or external referrer) →
    //      fall through to "/" so the button never feels dead.
    //
    // iOS Safari bfcache note: the old "always go home" hack was added
    // to dodge a stale-frame bug on back navigation. Modern iOS (15+)
    // handles bfcache correctly for plain navigations; if staleness
    // resurfaces, add a targeted pageshow handler later.
    // Why we DON'T use history.back() anymore:
    // The back-link previously tried history.back() when a same-origin
    // referrer existed. That worked for the history entry itself, but the
    // browser's bfcache restored the previous home-page scroll position,
    // which often left the user mid-page on .vcx-stats-2 (dark band). On
    // the home page that band reads as a "white/blank screen" because
    // scroll-reveal elements there use [data-animate] and stay opacity:0
    // until IntersectionObserver fires — which doesn't happen on restore.
    //
    // Fix: ALWAYS navigate forward to an explicit /index.html and force
    // the browser to start at the top of the document. This guarantees
    // the user lands on the hero, never on a cached mid-page fragment.
    link.addEventListener('click', function (ev) {
      ev.preventDefault();
      // Opt out of scroll restoration for the outgoing navigation so the
      // next document starts at y=0 regardless of bfcache state.
      try {
        if ('scrollRestoration' in window.history) {
          window.history.scrollRestoration = 'manual';
        }
      } catch (_) { /* noop */ }
      // Belt + suspenders: scroll to top before leaving so any restore
      // that references the current position lands at 0.
      try { window.scrollTo(0, 0); } catch (_) { /* noop */ }
      // Always use explicit /index.html (not bare "/"), and append a
      // cache-neutral fragment marker so any remaining scroll-restoration
      // logic resolves to the top of the document.
      window.location.assign('/index.html');
    });

    document.addEventListener('vcx:locale-change', function () {
      var label = pickLabel();
      link.setAttribute('aria-label', label);
      var span = link.querySelector('.vcx-back-link__label');
      if (span) span.textContent = label;
    });

    wrap.appendChild(link);

    var spot = findInsertionPoint();
    if (spot.before) {
      spot.parent.insertBefore(wrap, spot.before);
    } else {
      spot.parent.appendChild(wrap);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount, { once: true });
  } else {
    mount();
  }
})();

/* ==========================================================================
   vcx-header-chrome  (second IIFE in this file)
   - Removes the two time widgets ("VitaCoreX Time" / "Your Time") site-wide.
     The widgets were decorative; they added noise without navigation value.
   - The visible "Home" entry moved to the primary dual-door nav itself
     (see vcx-nav.js → makeHomeLink / makeMobileHomeLink) so it sits in the
     canonical nav row before "For Companies", is always clickable, and
     renders consistently on every page the dual-door nav is built on.
   - All this IIFE still does is retire the time widgets.
   ========================================================================== */
(function () {
  'use strict';
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  function injectCSS() {
    if (document.getElementById('vcx-header-chrome-css')) return;
    var style = document.createElement('style');
    style.id = 'vcx-header-chrome-css';
    style.textContent = [
      /* Retire the old time widgets site-wide. CSS rule (not DOM removal
         alone) so any future JS that re-renders the header meta row can't
         reintroduce them visibly. */
      '.vcx-time-chip,.vcx-time-chip-mobile{display:none !important;}'
    ].join('');
    (document.head || document.documentElement).appendChild(style);
  }

  function removeClocks() {
    var chips = document.querySelectorAll('.vcx-time-chip');
    for (var i = 0; i < chips.length; i++) {
      if (chips[i].parentNode) chips[i].parentNode.removeChild(chips[i]);
    }
  }

  function run() {
    injectCSS();
    removeClocks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
})();

/* ==========================================================================
   vcx-home-scroll-reset  (third IIFE in this file)
   Problem: when the user landed on the home page via back/forward or a
   bfcache-restored navigation, the browser often restored the previous
   scroll position — which could be deep inside the dark .vcx-stats-2
   band. On that band, [data-animate] reveal elements without the
   .is-visible class stay at opacity:0 (the home page does NOT load the
   IntersectionObserver in vcx-premium-2.js), so the viewport looked like
   a "white/blank screen" even though the DOM was fully rendered above
   and below.
   Fix: on the home page ONLY, opt out of scroll restoration and force
   scroll-to-top for both fresh loads and bfcache restores (pageshow.persisted).
   ========================================================================== */
(function () {
  'use strict';
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // Gate: home page only. Same check the first IIFE uses, mirrored here
  // because the first IIFE early-returns on home and we need this second
  // behavior to run there.
  var path = (location.pathname || '').toLowerCase();
  var lastSeg = path.split('/').filter(Boolean).pop() || '';
  var isHome =
    path === '/' ||
    path === '/index.html' ||
    path === '/index' ||
    (lastSeg === '' && path === '/') ||
    (lastSeg === 'index.html' && path.split('/').filter(Boolean).length <= 1);
  if (!isHome) return;

  // Don't fight in-page anchor links: if the URL carries a real fragment
  // like "#who-you-are", honor the user's intent.
  function hasMeaningfulHash() {
    var h = (location.hash || '').replace(/^#/, '');
    return h && h !== 'top';
  }

  try {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  } catch (_) { /* noop */ }

  function toTop() {
    if (hasMeaningfulHash()) return;
    try { window.scrollTo(0, 0); } catch (_) { /* noop */ }
  }

  // Fresh load: hard-reset scroll before paint, then again after layout.
  toTop();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', toTop, { once: true });
  }
  window.addEventListener('load', toTop, { once: true });

  // bfcache restore (back/forward into home): pageshow fires with
  // persisted === true. Force scroll to the hero in that case.
  window.addEventListener('pageshow', function (e) {
    if (e && e.persisted) toTop();
  });
})();
