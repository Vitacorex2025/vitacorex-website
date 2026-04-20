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
    link.href = '/';
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
    link.addEventListener('click', function (ev) {
      ev.preventDefault();
      var sameOriginRef = false;
      try {
        var ref = document.referrer || '';
        if (ref) sameOriginRef = (new URL(ref).origin === window.location.origin);
      } catch (_) { sameOriginRef = false; }
      // history.length >= 2 means there IS a back entry in this tab.
      if (sameOriginRef && window.history.length > 1) {
        window.history.back();
      } else {
        // Fallback: keep the forward entry (assign, not replace).
        window.location.assign('/');
      }
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
   vcx-header-chips  (second IIFE in this file)
   - Removes the two time widgets ("VitaCoreX Time" / "Your Time") that used
     to live in .vcx-header-meta and .vcx-mobile-meta.
   - Injects a compact "Home" chip in their place so every non-home page
     keeps a visible, elegant return-home affordance alongside the language
     switch. On the home page the chip renders in an .is-current state
     (styled as present but non-clickable) so the header layout stays
     balanced across the whole site.
   - Self-contained: injects its own CSS, resolves EN/RU/ES labels from
     window.VCX_TRANSLATIONS (falls back to inline strings), and re-renders
     on vcx:locale-change and vcx:lang-change.
   ========================================================================== */
(function () {
  'use strict';
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  var FALLBACK_LABEL = { en: 'Home', ru: 'Главная', es: 'Inicio' };
  var FALLBACK_ARIA  = {
    en: 'Return to VitaCoreX home',
    ru: 'Вернуться на главную VitaCoreX',
    es: 'Volver al inicio de VitaCoreX'
  };

  function currentLang() {
    return (document.documentElement.getAttribute('lang') || 'en')
      .toLowerCase().slice(0, 2);
  }

  function tr(key, fallbackByLang) {
    var lang = currentLang();
    try {
      var dict = window.VCX_TRANSLATIONS;
      if (dict && dict[lang] && dict[lang][key]) return dict[lang][key];
      if (dict && dict.en && dict.en[key]) return dict.en[key];
    } catch (e) { /* noop */ }
    return fallbackByLang[lang] || fallbackByLang.en;
  }

  function pickHomeLabel() { return tr('nav_home_chip', FALLBACK_LABEL); }
  function pickHomeAria()  { return tr('nav_home_chip_aria', FALLBACK_ARIA); }

  function injectCSS() {
    if (document.getElementById('vcx-header-chips-css')) return;
    var style = document.createElement('style');
    style.id = 'vcx-header-chips-css';
    style.textContent = [
      /* 1. Retire the old time widgets site-wide. Left as CSS rule (not
         DOM removal only) so any JS that re-renders the header won't
         reintroduce them visibly. */
      '.vcx-time-chip,.vcx-time-chip-mobile{display:none !important;}',

      /* 2. Rebalance the meta row now that it's just Home + EN/RU/ES. */
      '.vcx-header-meta{display:flex !important;align-items:center !important;gap:10px !important;flex-wrap:nowrap !important;}',
      '.vcx-mobile-meta{display:flex !important;align-items:center !important;gap:8px !important;flex-wrap:wrap !important;justify-content:flex-end !important;}',

      /* 3. Home chip — quiet, elegant, matches the lang-switch aesthetic. */
      '.vcx-home-chip{',
        'display:inline-flex;',
        'align-items:center;',
        'gap:6px;',
        'padding:5px 10px;',
        'color:rgba(255,255,255,.72) !important;',
        '-webkit-text-fill-color:rgba(255,255,255,.72) !important;',
        'font-family:inherit;',
        'font-size:.72rem;',
        'font-weight:600;',
        'letter-spacing:.04em;',
        'text-transform:uppercase;',
        'text-decoration:none !important;',
        'background:transparent;',
        'border:1px solid rgba(255,255,255,.22);',
        'border-radius:3px;',
        'line-height:1;',
        'white-space:nowrap;',
        'transition:color .16s ease, border-color .16s ease, background .16s ease, transform .16s ease;',
      '}',
      '.vcx-home-chip:hover{',
        'color:#FFFFFF !important;',
        '-webkit-text-fill-color:#FFFFFF !important;',
        'background:rgba(91,196,184,.14);',
        'border-color:rgba(91,196,184,.48);',
      '}',
      '.vcx-home-chip:focus-visible{',
        'outline:2px solid #5BBAA7;',
        'outline-offset:2px;',
      '}',
      '.vcx-home-chip svg{flex-shrink:0;opacity:.85;transition:opacity .16s ease;}',
      '.vcx-home-chip:hover svg{opacity:1;}',
      '.vcx-home-chip.is-current{',
        'color:#5BBAA7 !important;',
        '-webkit-text-fill-color:#5BBAA7 !important;',
        'border-color:rgba(91,196,184,.55);',
        'background:rgba(91,196,184,.12);',
        'pointer-events:none;',
        'cursor:default;',
      '}',
      '@media (max-width:720px){',
        '.vcx-home-chip{font-size:.68rem;padding:4px 8px;gap:5px;}',
        '.vcx-home-chip svg{width:11px;height:11px;}',
      '}'
    ].join('');
    (document.head || document.documentElement).appendChild(style);
  }

  var HOME_ICON =
    '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" ' +
    'stroke="currentColor" stroke-width="2.2" stroke-linecap="round" ' +
    'stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M3 11l9-8 9 8"/>' +
    '<path d="M5 10v10a1 1 0 0 0 1 1h4v-7h4v7h4a1 1 0 0 0 1-1V10"/>' +
    '</svg>';

  function buildChip() {
    var a = document.createElement('a');
    a.className = 'vcx-home-chip';
    /* Absolute path so the chip resolves to site root from /app/* pages
       too, not to the app's own index.html. */
    a.href = '/';
    a.setAttribute('data-common', 'nav_home_chip');
    a.setAttribute('aria-label', pickHomeAria());
    a.innerHTML = HOME_ICON +
      '<span class="vcx-home-chip__label">' + pickHomeLabel() + '</span>';
    return a;
  }

  function isHomePage() {
    var path = (location.pathname || '').toLowerCase();
    var lastSeg = path.split('/').filter(Boolean).pop() || '';
    return (
      path === '/' ||
      path === '/index.html' ||
      path === '/index' ||
      (lastSeg === '' && path === '/') ||
      (lastSeg === 'index.html' && path.split('/').filter(Boolean).length <= 1)
    );
  }

  function removeClocks() {
    var chips = document.querySelectorAll('.vcx-time-chip');
    for (var i = 0; i < chips.length; i++) {
      if (chips[i].parentNode) chips[i].parentNode.removeChild(chips[i]);
    }
  }

  function mountChips() {
    injectCSS();
    removeClocks();

    var targets = document.querySelectorAll('.vcx-header-meta, .vcx-mobile-meta');
    if (!targets.length) return;
    var onHome = isHomePage();
    for (var i = 0; i < targets.length; i++) {
      var host = targets[i];
      if (host.querySelector('.vcx-home-chip')) continue;
      var chip = buildChip();
      if (onHome) chip.classList.add('is-current');
      /* Insert at the very start so the order reads: Home · EN RU ES. */
      host.insertBefore(chip, host.firstChild);
    }
  }

  function refreshLabels() {
    var label = pickHomeLabel();
    var aria  = pickHomeAria();
    var chips = document.querySelectorAll('.vcx-home-chip');
    for (var i = 0; i < chips.length; i++) {
      chips[i].setAttribute('aria-label', aria);
      var span = chips[i].querySelector('.vcx-home-chip__label');
      if (span) span.textContent = label;
    }
  }

  document.addEventListener('vcx:locale-change', refreshLabels);
  document.addEventListener('vcx:lang-change',  refreshLabels);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountChips, { once: true });
  } else {
    mountChips();
  }
})();
