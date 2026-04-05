/**
 * VCX Premium FX — Runtime animations
 * Ripple buttons, staggered card entrance, animated counters,
 * smooth page transitions
 */
(function () {
  'use strict';

  /* ── 1. Page Transition — fade in on load, fade out on navigate ── */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href');
    // Skip external, hash, mailto, tel, javascript, download, target links
    if (!href || href.charAt(0) === '#' || href.indexOf('mailto:') === 0 ||
        href.indexOf('tel:') === 0 || href.indexOf('javascript:') === 0 ||
        link.hasAttribute('download') || link.getAttribute('target') === '_blank' ||
        href.indexOf('http') === 0 && href.indexOf(location.origin) !== 0) return;

    e.preventDefault();
    document.body.classList.add('vcx-navigating');
    setTimeout(function () { window.location.href = href; }, 250);
  });

  /* ── 2. Button Ripple Effect ────────────────────────────────────── */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.btn, .dcal-add-btn, .dcal-tab');
    if (!btn) return;
    var rect = btn.getBoundingClientRect();
    var size = Math.max(rect.width, rect.height);
    var ripple = document.createElement('span');
    ripple.className = 'vcx-ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    btn.appendChild(ripple);
    setTimeout(function () { ripple.remove(); }, 600);
  });

  /* ── 3. Enhanced Stagger Delays on existing reveal cards ─────────── */
  function initCardStagger() {
    // Don't add a new reveal system — enhance existing .reveal / .vcx-reveal
    // by adding stagger delays to cards within grids
    var grids = document.querySelectorAll(
      '.card-grid, .card-grid--3, .card-grid--4, .grid-3, .grid-4, ' +
      '.leak-grid, .industry-grid, .trust-strip, .step-grid, ' +
      '.resource-grid, .comparison-grid'
    );
    grids.forEach(function (grid) {
      var children = grid.querySelectorAll('.reveal, .vcx-reveal');
      children.forEach(function (child, i) {
        if (i > 0 && i <= 6) {
          child.style.transitionDelay = (i * 0.08) + 's';
        }
      });
    });
  }

  /* ── 4. Animated Number Counter ─────────────────────────────────── */
  function initCounters() {
    // Find elements with data-vcx-count or stat-like numbers
    var statEls = document.querySelectorAll(
      '.stat-number, .kpi-value, .dcal-kpi-value, .dcal-risk-count, ' +
      '[data-vcx-count]'
    );
    if (!statEls.length) return;

    if (!('IntersectionObserver' in window)) return;

    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        counterObserver.unobserve(el);
        animateCounter(el);
      });
    }, { threshold: 0.5 });

    statEls.forEach(function (el) {
      el.classList.add('vcx-counter');
      counterObserver.observe(el);
    });
  }

  function animateCounter(el) {
    var text = el.textContent.trim();
    // Extract number and suffix/prefix
    var match = text.match(/^([^0-9]*)(\d[\d,.]*\d?|\d)(.*)$/);
    if (!match) return;

    var prefix = match[1];
    var numStr = match[2];
    var suffix = match[3];
    var target = parseFloat(numStr.replace(/,/g, ''));
    if (isNaN(target)) return;

    var hasComma = numStr.indexOf(',') !== -1;
    var decimals = numStr.indexOf('.') !== -1 ? numStr.split('.')[1].length : 0;
    var duration = 800; // ms
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = target * eased;

      var formatted = decimals > 0
        ? current.toFixed(decimals)
        : Math.round(current).toString();

      if (hasComma) {
        formatted = formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }

      el.textContent = prefix + formatted + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = prefix + numStr + suffix;
        el.classList.add('vcx-counter-done');
      }
    }

    requestAnimationFrame(step);
  }

  /* ── 5. Trust chip shine delay ──────────────────────────────────── */
  function initShineDelays() {
    var chips = document.querySelectorAll('.trust-chip');
    chips.forEach(function (chip, i) {
      chip.style.setProperty('--shine-delay', String(i * 1.5));
    });
  }

  /* ── 6. Glow divider lines between sections ────────────────────── */
  function initGlowLines() {
    var sections = document.querySelectorAll('.section, .vcx-section');
    sections.forEach(function (section, i) {
      if (i === 0) return; // skip first
      var line = document.createElement('div');
      line.className = 'vcx-fx-glow-line vcx-fx-card';
      section.parentNode.insertBefore(line, section);
    });
  }

  /* ── Init on DOMContentLoaded ───────────────────────────────────── */
  function init() {
    initCardStagger();
    initCounters();
    initShineDelays();
    initGlowLines();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
