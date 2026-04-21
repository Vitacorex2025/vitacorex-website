/* ============================================================
   VCX RAILS — vanilla JS controller
   ------------------------------------------------------------
   Drives three behaviors:
     1. Horizontal rails (.vcx-rail):  button prev/next + keyboard
        arrows + progress bar, using scrollLeft on the viewport.
     2. Dashboard rails (.vcx-dashboard-rail) + tool shelf
        (.vcx-tool-shelf): keyboard arrow scroll only (no nav
        buttons markup required; nav buttons are opt-in).
     3. Pinned rails (.vcx-pinned-rail): sticky-stage + scroll-
        driven horizontal translation of the internal track,
        with dot indicators.

   All behavior is progressive enhancement. If JS fails, the
   rails still scroll natively (native touch / trackpad / arrow
   scroll on focused element).

   Respects prefers-reduced-motion (no smooth-scroll easing,
   no pinned translation animation).

   No external libraries.
   ============================================================ */
(function () {
  'use strict';

  var REDUCED_MOTION = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- RAIL (horizontal) -------------------------------------------------
  function wireRail(rail) {
    var viewport = rail.querySelector('.vcx-rail__viewport');
    if (!viewport) return;
    var track = viewport.querySelector('.vcx-rail__track') || viewport.firstElementChild;
    if (!track) return;

    var prevBtn = rail.querySelector('[data-rail-prev]');
    var nextBtn = rail.querySelector('[data-rail-next]');
    var progressBar = rail.querySelector('.vcx-rail-progress__bar');

    function cardStep() {
      var first = track.querySelector('.vcx-rail-card, [data-rail-card]')
                || track.firstElementChild;
      if (!first) return 320;
      var style = getComputedStyle(track);
      var gap = parseFloat(style.columnGap || style.gap || '0') || 0;
      return first.getBoundingClientRect().width + gap;
    }

    function scrollBy(dir) {
      viewport.scrollBy({
        left: dir * cardStep(),
        behavior: REDUCED_MOTION ? 'auto' : 'smooth'
      });
    }

    function updateButtons() {
      if (!prevBtn && !nextBtn && !progressBar) return;
      var maxLeft = viewport.scrollWidth - viewport.clientWidth;
      var ratio = maxLeft > 0 ? (viewport.scrollLeft / maxLeft) : 0;
      if (prevBtn) prevBtn.disabled = viewport.scrollLeft <= 2;
      if (nextBtn) nextBtn.disabled = viewport.scrollLeft >= maxLeft - 2;
      if (progressBar) {
        progressBar.style.width = Math.max(10, Math.min(100, ratio * 100)) + '%';
      }
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { scrollBy(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { scrollBy(+1); });

    viewport.addEventListener('scroll', updateButtons, { passive: true });
    window.addEventListener('resize', updateButtons);

    // Keyboard (arrow keys when a card inside has focus)
    viewport.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); scrollBy(+1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); scrollBy(-1); }
      else if (e.key === 'Home') { e.preventDefault(); viewport.scrollTo({ left: 0, behavior: REDUCED_MOTION ? 'auto' : 'smooth' }); }
      else if (e.key === 'End') {
        e.preventDefault();
        viewport.scrollTo({ left: viewport.scrollWidth, behavior: REDUCED_MOTION ? 'auto' : 'smooth' });
      }
    });

    // Make viewport focusable so keyboard nav works; ARIA role
    if (!viewport.hasAttribute('tabindex')) viewport.setAttribute('tabindex', '0');
    if (!viewport.hasAttribute('role')) viewport.setAttribute('role', 'region');
    if (!viewport.hasAttribute('aria-label')) {
      var label = rail.getAttribute('aria-label') ||
                  (rail.querySelector('.vcx-rail-head__title') || {}).textContent ||
                  'Scrollable content';
      viewport.setAttribute('aria-label', label.trim());
    }

    updateButtons();
  }

  // ---- DASHBOARD RAIL / TOOL SHELF (keyboard-only scroll) -----------------
  function wireScrollRegion(el) {
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
    if (!el.hasAttribute('role')) el.setAttribute('role', 'region');
    el.addEventListener('keydown', function (e) {
      var step = el.clientWidth * 0.85;
      if (e.key === 'ArrowRight') { e.preventDefault(); el.scrollBy({ left: step, behavior: REDUCED_MOTION ? 'auto' : 'smooth' }); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); el.scrollBy({ left: -step, behavior: REDUCED_MOTION ? 'auto' : 'smooth' }); }
      else if (e.key === 'Home') { e.preventDefault(); el.scrollTo({ left: 0, behavior: REDUCED_MOTION ? 'auto' : 'smooth' }); }
      else if (e.key === 'End') { e.preventDefault(); el.scrollTo({ left: el.scrollWidth, behavior: REDUCED_MOTION ? 'auto' : 'smooth' }); }
    });
  }

  // ---- PINNED RAIL (sticky + scroll-driven translation) -------------------
  function wirePinnedRail(pinned) {
    var stage = pinned.querySelector('.vcx-pinned-rail__stage');
    var track = pinned.querySelector('.vcx-pinned-rail__track');
    var viewport = pinned.querySelector('.vcx-pinned-rail__viewport');
    if (!stage || !track || !viewport) return;

    var cards = Array.prototype.slice.call(track.querySelectorAll('.vcx-pinned-rail__card'));
    if (!cards.length) return;

    // Build dot indicators
    var dots = pinned.querySelector('.vcx-pinned-rail__dots');
    if (!dots) {
      dots = document.createElement('div');
      dots.className = 'vcx-pinned-rail__dots';
      viewport.appendChild(dots);
    }
    dots.innerHTML = '';
    cards.forEach(function (_, i) {
      var d = document.createElement('button');
      d.type = 'button';
      d.className = 'vcx-pinned-rail__dot';
      d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      if (i === 0) d.classList.add('is-active');
      d.addEventListener('click', function () { go(i); });
      dots.appendChild(d);
    });

    var countEl = pinned.querySelector('.vcx-pinned-rail__count');
    function updateCount(i) {
      if (countEl) countEl.textContent = (i + 1) + ' / ' + cards.length;
    }
    updateCount(0);

    function go(index) {
      index = Math.max(0, Math.min(cards.length - 1, index));
      // Mobile fallback: stage is not sticky, use horizontal scroll.
      if (window.innerWidth < 900) {
        var target = cards[index];
        if (target && viewport.scrollTo) {
          viewport.scrollTo({
            left: target.offsetLeft - viewport.offsetLeft,
            behavior: REDUCED_MOTION ? 'auto' : 'smooth'
          });
        }
      } else {
        var offset = -(viewport.clientWidth * index) - (24 * index);
        track.style.transform = 'translate3d(' + offset + 'px, 0, 0)';
      }
      Array.prototype.forEach.call(dots.children, function (d, i) {
        d.classList.toggle('is-active', i === index);
      });
      updateCount(index);
    }

    // Keyboard
    viewport.setAttribute('tabindex', '0');
    viewport.setAttribute('role', 'region');
    if (!viewport.hasAttribute('aria-label')) {
      var label = (pinned.querySelector('.vcx-pinned-rail__title') || {}).textContent ||
                  'Pinned content';
      viewport.setAttribute('aria-label', label.trim());
    }
    var current = 0;
    viewport.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); current = Math.min(cards.length - 1, current + 1); go(current); }
      else if (e.key === 'ArrowLeft')  { e.preventDefault(); current = Math.max(0, current - 1); go(current); }
      else if (e.key === 'Home') { e.preventDefault(); current = 0; go(current); }
      else if (e.key === 'End')  { e.preventDefault(); current = cards.length - 1; go(current); }
    });

    // Scroll-driven update on desktop (when the parent pins).
    function onScroll() {
      if (window.innerWidth < 900 || REDUCED_MOTION) return;
      var rect = pinned.getBoundingClientRect();
      // Active region: stage pinned = top from 0 to (pinned.height - stage.height)
      var stageH = stage.offsetHeight || 0;
      var stretch = Math.max(0, pinned.offsetHeight - stageH);
      if (stretch <= 0) return;
      var scrolled = Math.max(0, -rect.top);
      var progress = Math.min(1, scrolled / stretch);
      var idx = Math.round(progress * (cards.length - 1));
      if (idx !== current) {
        current = idx;
        go(current);
      }
    }

    // When the pinned rail is used without an over-tall parent, wire dot
    // clicks + keyboard only. When the parent IS tall, wire scroll too.
    var dataScrollDrive = pinned.getAttribute('data-scroll-drive') === 'true';
    if (dataScrollDrive) {
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    // Mobile scroll → track dots
    viewport.addEventListener('scroll', function () {
      if (window.innerWidth >= 900) return;
      var left = viewport.scrollLeft;
      var best = 0, bestDelta = Infinity;
      for (var i = 0; i < cards.length; i++) {
        var delta = Math.abs(cards[i].offsetLeft - viewport.offsetLeft - left);
        if (delta < bestDelta) { bestDelta = delta; best = i; }
      }
      if (best !== current) {
        current = best;
        Array.prototype.forEach.call(dots.children, function (d, i) {
          d.classList.toggle('is-active', i === best);
        });
        updateCount(best);
      }
    }, { passive: true });

    // Init at first
    go(0);
  }

  // ---- INIT ---------------------------------------------------------------
  function init() {
    document.querySelectorAll('.vcx-rail').forEach(wireRail);
    document.querySelectorAll('.vcx-dashboard-rail').forEach(wireScrollRegion);
    document.querySelectorAll('.vcx-tool-shelf').forEach(wireScrollRegion);
    document.querySelectorAll('.vcx-pinned-rail').forEach(wirePinnedRail);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
