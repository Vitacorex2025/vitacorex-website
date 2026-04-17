/* ============================================================
   VCX PREMIUM 2.1 — Lightweight (no GSAP, no Lenis)
   Pure IntersectionObserver reveals + counters
   ============================================================ */

(function () {
  'use strict';

  // ---- 1. SCROLL-TRIGGERED REVEALS (IntersectionObserver) ----
  function initScrollReveals() {
    var els = document.querySelectorAll('[data-animate]');
    if (!els.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    els.forEach(function (el) {
      var dir = el.getAttribute('data-animate');
      if (dir === 'none') {
        el.classList.add('is-visible');
        return;
      }
      observer.observe(el);
    });

    // Stagger grids
    document.querySelectorAll('.vcx-stagger, .vcx-card-grid-2').forEach(function (grid) {
      var gridObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var children = entry.target.children;
            for (var i = 0; i < children.length; i++) {
              (function (child, delay) {
                setTimeout(function () { child.classList.add('is-visible'); }, delay);
              })(children[i], i * 100);
            }
            gridObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      gridObs.observe(grid);
    });
  }

  // ---- 2. COUNTER ANIMATIONS (IntersectionObserver) ----
  function initCounters() {
    var counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseFloat(el.getAttribute('data-counter'));
        var start = parseFloat(el.textContent) || 0;
        if (start >= target) { observer.unobserve(el); return; }
        var duration = 1800;
        var startTime = null;
        function step(ts) {
          if (!startTime) startTime = ts;
          var p = Math.min((ts - startTime) / duration, 1);
          el.textContent = Math.round(start + (target - start) * p);
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(function (c) { observer.observe(c); });
  }

  // ---- 3. SECTION STACKING (z-index only) ----
  function initSectionReveals() {
    var allSections = document.querySelectorAll('section.section, section.vcx-impact-section, section.band');
    allSections.forEach(function (sec, i) {
      sec.style.zIndex = 10 + i;
      sec.style.position = 'relative';
    });
  }

  // ---- 4. HEADER SHRINK ON SCROLL ----
  function initHeader() {
    var header = document.querySelector('.vcx-header-2') || document.querySelector('.vcx-header');
    if (!header) return;

    var scrollThreshold = 60;
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          if (window.scrollY > scrollThreshold) {
            header.classList.add('is-scrolled');
          } else {
            header.classList.remove('is-scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ---- 5. MAGNETIC BUTTONS ----
  function initMagneticBtns() {
    document.querySelectorAll('.vcx-btn-2--primary').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.15 - 2) + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

  // ---- 6. SPLIDE CAROUSELS ----
  function initCarousels() {
    if (typeof Splide === 'undefined') return;
    document.querySelectorAll('.splide').forEach(function (el) {
      new Splide(el, {
        type: 'loop',
        perPage: 2,
        gap: '24px',
        padding: '48px',
        autoplay: true,
        interval: 5000,
        pauseOnHover: true,
        breakpoints: {
          768: { perPage: 1, padding: '16px' }
        }
      }).mount();
    });
  }

  // ---- INIT ----
  function init() {
    initScrollReveals();
    initSectionReveals();
    initCounters();
    initHeader();
    initMagneticBtns();
    initCarousels();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
