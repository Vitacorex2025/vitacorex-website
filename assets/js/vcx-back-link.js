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

  // --- Find the best mount point inside the content flow ----------------
  function findAnchor() {
    // Prefer <main>, then first <section>, then <body>.
    var main = document.querySelector('main');
    if (main) return main;
    var section = document.querySelector('body > section, body > .wrap, body > .vcx-hero-2, body > [class*="hero"]');
    if (section) return section;
    return document.body;
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

    link.addEventListener('click', function (ev) {
      try {
        var ref = document.referrer;
        var sameOrigin = ref && ref.indexOf(location.origin) === 0;
        if (sameOrigin && window.history.length > 1) {
          ev.preventDefault();
          window.history.back();
          return;
        }
      } catch (_) { /* noop */ }
    });

    document.addEventListener('vcx:locale-change', function () {
      var label = pickLabel();
      link.setAttribute('aria-label', label);
      var span = link.querySelector('.vcx-back-link__label');
      if (span) span.textContent = label;
    });

    wrap.appendChild(link);

    // Inject as the FIRST child of <main> (or first <section>) so the link
    // appears above the page's hero/title, inside the content column.
    var anchor = findAnchor();
    if (anchor.firstChild) {
      anchor.insertBefore(wrap, anchor.firstChild);
    } else {
      anchor.appendChild(wrap);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount, { once: true });
  } else {
    mount();
  }
})();
