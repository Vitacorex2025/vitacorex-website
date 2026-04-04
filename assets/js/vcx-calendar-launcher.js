/**
 * VCX Calendar Launcher FAB
 *
 * Site-wide floating action button that navigates to the Deadline Calendar.
 * Shows a small badge with the "due today" count fetched from the calendar
 * home API.  Hidden on the deadline-calendar page itself.
 *
 * Self-contained IIFE: injects its own CSS link, builds its own DOM.
 * No external dependencies.
 */
(function () {
  'use strict';

  /* ── Guard: skip on the deadline-calendar page ─────────────────── */
  var page = document.body && document.body.getAttribute('data-vcx-page');
  if (page === 'deadline-calendar') return;

  /* ── Config ─────────────────────────────────────────────────────── */

  /**
   * API_BASE resolution (mirrors vcx-chat-launcher.js):
   *  1. window.VCX_API_BASE (explicit override)
   *  2. Auto-detect: frontend on dev port => API on 8787
   *  3. Same-origin fallback (reverse-proxy production)
   */
  var API_BASE = (function () {
    if (window.VCX_API_BASE) return window.VCX_API_BASE;
    var port = location.port;
    if (port === '8080' || port === '8765' || port === '8090' || port === '3000') {
      return 'http://' + location.hostname + ':8787';
    }
    return '';
  })();

  var IS_STATIC = !API_BASE && (location.protocol === "https:" || location.hostname.indexOf("github.io") !== -1);
  var CALENDAR_URL = '/app/deadline-calendar/';
  var FETCH_TIMEOUT = 5000; /* ms */

  /* ── SVG calendar icon (inline, no external assets) ────────────── */
  var ICON_CALENDAR =
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
      '<rect x="3" y="4" width="18" height="18" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="1.6"/>' +
      '<line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="1.6"/>' +
      '<line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="1.6"/>' +
      '<line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="1.6"/>' +
      '<circle cx="12" cy="16" r="1.5" fill="currentColor" stroke="none"/>' +
    '</svg>';

  /* ── Self-inject CSS ────────────────────────────────────────────── */
  var cssLink = document.createElement('link');
  cssLink.rel = 'stylesheet';
  cssLink.href = '/assets/css/vcx-calendar-launcher.css';
  document.head.appendChild(cssLink);

  /* ── Build DOM ──────────────────────────────────────────────────── */

  function build() {
    var fab = document.createElement('button');
    fab.className = 'vcx-cal-fab vcx-cal-fab--pulse';
    fab.setAttribute('type', 'button');
    fab.setAttribute('aria-label', 'Open Deadline Calendar');

    fab.innerHTML =
      ICON_CALENDAR +
      '<span class="vcx-cal-badge" id="vcxCalBadge"></span>' +
      '<span class="vcx-cal-tip">Deadline Calendar</span>';

    document.body.appendChild(fab);
    return fab;
  }

  /* ── Fetch due-today count ──────────────────────────────────────── */

  function fetchBadgeCount(badgeEl) {
    var ownerId;
    try {
      ownerId = localStorage.getItem('dcal_owner_id');
    } catch (e) {
      /* localStorage blocked */ return;
    }
    if (!ownerId) return;

    var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = setTimeout(function () {
      if (controller) controller.abort();
    }, FETCH_TIMEOUT);

    if (IS_STATIC) { /* no badge on static */ return; }
    fetch(API_BASE + '/api/calendar/home?owner_id=' + encodeURIComponent(ownerId), {
      method: 'GET',
      signal: controller ? controller.signal : undefined,
    })
      .then(function (res) {
        clearTimeout(timer);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        var count = 0;
        if (data && data.kpi && typeof data.kpi.due_today === 'number') {
          count = data.kpi.due_today;
        }
        if (count > 0) {
          badgeEl.textContent = count > 99 ? '99+' : String(count);
          badgeEl.classList.add('vcx-cal-badge--visible');
        }
      })
      .catch(function () {
        clearTimeout(timer);
        /* Silently ignore — button still works, just no badge */
      });
  }

  /* ── Init ────────────────────────────────────────────────────────── */

  function init() {
    /* Second guard — body might not have data-vcx-page at parse time */
    if (document.body.getAttribute('data-vcx-page') === 'deadline-calendar') return;

    var fab = build();
    var badge = fab.querySelector('#vcxCalBadge');

    /* Navigate on click */
    fab.addEventListener('click', function () {
      window.location.href = CALENDAR_URL;
    });

    /* Stop pulse after animation ends so hover shadow works cleanly */
    fab.addEventListener('animationend', function () {
      fab.classList.remove('vcx-cal-fab--pulse');
    });

    /* Fetch badge count */
    fetchBadgeCount(badge);
  }

  /* ── Boot ────────────────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
