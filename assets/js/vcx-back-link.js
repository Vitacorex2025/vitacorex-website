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

    // Click handler: ALWAYS navigate to "/" (homepage). We deliberately do
    // not call window.history.back() because Safari on iOS frequently
    // restores a stale cached/blank state from bfcache when going back,
    // which looked to users like "the button doesn't work". Hard-
    // navigating to "/" gives predictable behaviour on every platform.
    link.addEventListener('click', function (ev) {
      ev.preventDefault();
      // Use assign() (not replace) so the browser keeps a forward entry.
      window.location.assign('/');
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
