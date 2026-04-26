/* VCX Glass Header runtime
 * - Toggles .is-stuck on the bar after the page scrolls past 24 px
 *   so the bar gains opacity + a soft shadow over scrolled content.
 * - Wires hover-stable dropdown menus (For Companies / For Founders /
 *   For Private Clients). Uses an "intent timer": closing is delayed
 *   ~200ms when the cursor leaves either the trigger OR the panel, so
 *   the user can move the cursor between them without the menu
 *   collapsing. Touch and keyboard activation also supported.
 * - Wires the mobile menu button to the full-page drawer.
 * - Wires the language switcher to vcxSetLang (exposed by vcx-i18n.js)
 *   with a localStorage + custom-event fallback.
 * - Marks the active nav link based on the current pathname. */
(function () {
  'use strict';

  var header = document.querySelector('.vcx-header-glass');
  if (!header) return;

  // ---- 1. Stuck-state on scroll ---------------------------------
  var THRESHOLD = 24;
  function onScroll() {
    if (window.scrollY > THRESHOLD) header.classList.add('is-stuck');
    else header.classList.remove('is-stuck');
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---- 2. Hover-stable dropdown menus ---------------------------
  // Each .vcx-header-glass__menu has a button trigger and a panel.
  // We track open state via data-open="true|false". A delayed close
  // timer (CLOSE_DELAY) lets the cursor move from trigger to panel
  // without the menu collapsing.
  var CLOSE_DELAY = 220;
  var menus = header.querySelectorAll('.vcx-header-glass__menu');
  var openMenu = null;

  function closeAll(except) {
    menus.forEach(function (m) {
      if (m === except) return;
      m.setAttribute('data-open', 'false');
      var btn = m.querySelector('button');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
    if (except !== openMenu) openMenu = except || null;
  }

  menus.forEach(function (menu) {
    var btn = menu.querySelector('button');
    var panel = menu.querySelector('.vcx-header-glass__panel');
    if (!btn || !panel) return;
    var closeTimer = null;

    function open() {
      if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
      closeAll(menu);
      menu.setAttribute('data-open', 'true');
      btn.setAttribute('aria-expanded', 'true');
      openMenu = menu;
    }

    function scheduleClose() {
      if (closeTimer) clearTimeout(closeTimer);
      closeTimer = setTimeout(function () {
        menu.setAttribute('data-open', 'false');
        btn.setAttribute('aria-expanded', 'false');
        if (openMenu === menu) openMenu = null;
      }, CLOSE_DELAY);
    }

    function cancelClose() {
      if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
    }

    // Hover (desktop)
    menu.addEventListener('mouseenter', open);
    menu.addEventListener('mouseleave', scheduleClose);
    panel.addEventListener('mouseenter', cancelClose);
    panel.addEventListener('mouseleave', scheduleClose);

    // Click toggle (works for touch + mouse)
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var isOpen = menu.getAttribute('data-open') === 'true';
      if (isOpen) {
        menu.setAttribute('data-open', 'false');
        btn.setAttribute('aria-expanded', 'false');
        if (openMenu === menu) openMenu = null;
      } else {
        open();
      }
    });

    // Keyboard
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
        var first = panel.querySelector('a');
        if (first) first.focus();
      } else if (e.key === 'Escape') {
        menu.setAttribute('data-open', 'false');
        btn.setAttribute('aria-expanded', 'false');
        btn.focus();
      }
    });
    panel.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        menu.setAttribute('data-open', 'false');
        btn.setAttribute('aria-expanded', 'false');
        btn.focus();
      }
    });
  });

  // Click outside any menu closes the open one
  document.addEventListener('click', function (e) {
    if (!openMenu) return;
    if (!openMenu.contains(e.target)) {
      closeAll(null);
    }
  });

  // ---- 3. Mobile drawer ----------------------------------------
  var drawerBtn = header.querySelector('.vcx-header-glass__menu-btn');
  var drawer = header.querySelector('.vcx-header-glass__drawer');
  if (drawerBtn && drawer) {
    drawerBtn.addEventListener('click', function () {
      var open = drawer.getAttribute('data-open') === 'true';
      drawer.setAttribute('data-open', open ? 'false' : 'true');
      drawerBtn.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        drawer.setAttribute('data-open', 'false');
        drawerBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- 4. Language switcher -----------------------------------
  function applyLangVisual(lang) {
    header.querySelectorAll('.vcx-header-glass__lang button').forEach(function (b) {
      if (b.getAttribute('data-lang') === lang) b.classList.add('active');
      else b.classList.remove('active');
    });
  }

  var initial = (document.documentElement.lang || 'en').toLowerCase().slice(0, 2);
  try {
    var saved = localStorage.getItem('vcx-lang');
    if (saved) initial = saved;
  } catch (_) {}
  applyLangVisual(initial);

  header.querySelectorAll('.vcx-header-glass__lang button').forEach(function (b) {
    b.addEventListener('click', function () {
      var lang = b.getAttribute('data-lang');
      if (!lang) return;
      applyLangVisual(lang);
      try { localStorage.setItem('vcx-lang', lang); } catch (_) {}
      if (typeof window.vcxSetLang === 'function') {
        window.vcxSetLang(lang);
      } else {
        document.documentElement.lang = lang;
        document.dispatchEvent(new CustomEvent('vcx:lang-change', { detail: { lang: lang } }));
      }
    });
  });

  // ---- 5. Active link marker -----------------------------------
  var here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (!here || here === '/') here = 'index.html';
  header.querySelectorAll('.vcx-header-glass__nav a, .vcx-header-glass__drawer a, .vcx-header-glass__panel a').forEach(function (a) {
    var href = (a.getAttribute('href') || '').toLowerCase();
    if (href === here) a.classList.add('is-active');
  });
})();
