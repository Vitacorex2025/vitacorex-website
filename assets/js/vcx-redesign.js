/**
 * vcx-redesign.js
 * Premium interaction JavaScript for the VitaCoreX redesign.
 *
 * Scroll-triggered animations, counter animations, parallax,
 * smooth scroll, nav highlighting, typing reveal, and chat
 * widget API_BASE auto-detection.
 *
 * Standalone IIFE -- zero dependencies.
 * Uses var for broad compatibility.
 */
(function () {
  'use strict';

  /* --------------------------------------------------------
   * 0. Prefers-reduced-motion detection
   * ------------------------------------------------------ */
  var prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --------------------------------------------------------
   * 1. Intersection Observer Scroll Reveals
   *    .vcx-reveal  -->  .vcx-visible on viewport entry
   *    Supports .vcx-stagger-N for sequential delay
   * ------------------------------------------------------ */
  function initScrollReveals() {
    var reveals = document.querySelectorAll('.vcx-reveal');
    if (!reveals.length) return;

    if (prefersReducedMotion) {
      // Skip animation -- make everything visible immediately
      for (var i = 0; i < reveals.length; i++) {
        reveals[i].classList.add('vcx-visible');
      }
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;

          // Determine stagger delay from .vcx-stagger-N class
          var delay = 0;
          var classList = el.className.split(/\s+/);
          for (var j = 0; j < classList.length; j++) {
            var match = classList[j].match(/^vcx-stagger-(\d+)$/);
            if (match) {
              delay = parseInt(match[1], 10) * 100; // each unit = 100ms
              break;
            }
          }

          if (delay > 0) {
            setTimeout(function () {
              el.classList.add('vcx-visible');
            }, delay);
          } else {
            el.classList.add('vcx-visible');
          }

          // One-time trigger
          obs.unobserve(el);
        });
      },
      { threshold: 0.15 }
    );

    for (var k = 0; k < reveals.length; k++) {
      observer.observe(reveals[k]);
    }
  }

  /* --------------------------------------------------------
   * 2. Counter Animation
   *    data-vcx-count-to="1200"
   *    data-vcx-count-suffix="%"
   *    data-vcx-count-prefix="$"
   * ------------------------------------------------------ */
  function initCounters() {
    var counters = document.querySelectorAll('[data-vcx-count-to]');
    if (!counters.length) return;

    var DURATION = 2000; // ms

    function animateCounter(el) {
      var target = parseFloat(el.getAttribute('data-vcx-count-to')) || 0;
      var suffix = el.getAttribute('data-vcx-count-suffix') || '';
      var prefix = el.getAttribute('data-vcx-count-prefix') || '';
      var isFloat = String(target).indexOf('.') !== -1;
      var start = performance.now();

      function tick(now) {
        var elapsed = now - start;
        var progress = Math.min(elapsed / DURATION, 1);
        // Ease-out quad
        var eased = 1 - (1 - progress) * (1 - progress);
        var current = eased * target;

        el.textContent = prefix + (isFloat ? current.toFixed(1) : Math.round(current)) + suffix;

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      }

      requestAnimationFrame(tick);
    }

    if (prefersReducedMotion) {
      for (var i = 0; i < counters.length; i++) {
        var el = counters[i];
        var t = el.getAttribute('data-vcx-count-to') || '0';
        var s = el.getAttribute('data-vcx-count-suffix') || '';
        var p = el.getAttribute('data-vcx-count-prefix') || '';
        el.textContent = p + t + s;
      }
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.25 }
    );

    for (var j = 0; j < counters.length; j++) {
      observer.observe(counters[j]);
    }
  }

  /* --------------------------------------------------------
   * 3. Parallax Scroll Effect
   *    .vcx-parallax elements shift at 0.3x scroll speed
   *    Desktop only -- disabled on mobile for performance
   * ------------------------------------------------------ */
  function initParallax() {
    var els = document.querySelectorAll('.vcx-parallax');
    if (!els.length || prefersReducedMotion) return;

    var isMobile = window.innerWidth < 768;
    if (isMobile) return;

    var ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var scrollY = window.pageYOffset;
        for (var i = 0; i < els.length; i++) {
          var offset = scrollY * 0.3;
          els[i].style.transform = 'translate3d(0,' + offset + 'px,0)';
        }
        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* --------------------------------------------------------
   * 4. Staggered Card Reveals
   *    .vcx-stagger-grid > children revealed one-by-one
   *    100ms delay between each card
   * ------------------------------------------------------ */
  function initStaggeredCards() {
    var grids = document.querySelectorAll('.vcx-stagger-grid');
    if (!grids.length) return;

    if (prefersReducedMotion) {
      for (var g = 0; g < grids.length; g++) {
        var kids = grids[g].children;
        for (var c = 0; c < kids.length; c++) {
          kids[c].classList.add('vcx-visible');
        }
      }
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var children = entry.target.children;
          for (var i = 0; i < children.length; i++) {
            (function (child, delay) {
              setTimeout(function () {
                child.classList.add('vcx-visible');
              }, delay);
            })(children[i], i * 100);
          }
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.1 }
    );

    for (var h = 0; h < grids.length; h++) {
      observer.observe(grids[h]);
    }
  }

  /* --------------------------------------------------------
   * 5. Active Nav Highlight
   *    Highlights the current section link in the nav as
   *    the user scrolls through the page.
   * ------------------------------------------------------ */
  function initActiveNav() {
    var sections = document.querySelectorAll('section[id]');
    if (!sections.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var id = entry.target.getAttribute('id');
          var link = document.querySelector('nav a[href="#' + id + '"]');
          if (!link) return;

          if (entry.isIntersecting) {
            // Remove active class from all nav links first
            var allLinks = document.querySelectorAll('nav a');
            for (var i = 0; i < allLinks.length; i++) {
              allLinks[i].classList.remove('vcx-nav-active');
            }
            link.classList.add('vcx-nav-active');
          }
        });
      },
      { threshold: 0.3, rootMargin: '-10% 0px -60% 0px' }
    );

    for (var i = 0; i < sections.length; i++) {
      observer.observe(sections[i]);
    }
  }

  /* --------------------------------------------------------
   * 6. Smooth Scroll for Anchor Links
   *    Intercepts clicks on href="#..." and scrolls smoothly
   *    Accounts for sticky header height
   * ------------------------------------------------------ */
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;

      var targetId = anchor.getAttribute('href');
      if (targetId === '#' || targetId.length < 2) return;

      var target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      // Account for sticky header
      var header = document.querySelector('header, .vcx-header, .site-header');
      var headerHeight = header ? header.offsetHeight : 0;

      var top =
        target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;

      window.scrollTo({
        top: top,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    });
  }

  /* --------------------------------------------------------
   * 7. Chat Widget API_BASE Auto-Detection
   *    Sets window.VCX_API_BASE for local dev environments
   *    Probes common backend ports via /healthz
   * ------------------------------------------------------ */
  function initApiBaseDetection() {
    if (window.VCX_API_BASE) return; // already configured

    var hostname = location.hostname;
    var currentPort = location.port;

    // Only run detection when we appear to be on a dev server
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') return;
    if (currentPort === '8080') return; // standard port, assume co-located

    var candidates = [
      'http://' + hostname + ':8787',
      'http://' + hostname + ':8080',
      'http://' + hostname + ':3000',
    ];

    function tryCandidate(index) {
      if (index >= candidates.length) return;
      var url = candidates[index];

      fetch(url + '/healthz', { method: 'GET', mode: 'cors' })
        .then(function (r) {
          if (r.ok) {
            window.VCX_API_BASE = url;
          } else {
            tryCandidate(index + 1);
          }
        })
        .catch(function () {
          tryCandidate(index + 1);
        });
    }

    tryCandidate(0);
  }

  /* --------------------------------------------------------
   * 8. Typing / Text Reveal Effect
   *    .vcx-type-reveal elements get a clip-path reveal
   *    triggered on page load via .vcx-type-active class
   * ------------------------------------------------------ */
  function initTypeReveal() {
    var els = document.querySelectorAll('.vcx-type-reveal');
    if (!els.length) return;

    if (prefersReducedMotion) {
      for (var i = 0; i < els.length; i++) {
        els[i].classList.add('vcx-type-active');
        els[i].style.clipPath = 'none';
        els[i].style.webkitClipPath = 'none';
      }
      return;
    }

    // Stagger each element slightly so multiple headlines cascade
    for (var j = 0; j < els.length; j++) {
      (function (el, delay) {
        setTimeout(function () {
          el.classList.add('vcx-type-active');
        }, delay);
      })(els[j], j * 400 + 200); // 200ms initial wait, 400ms apart
    }
  }

  /* --------------------------------------------------------
   * 9. Init -- run everything on DOMContentLoaded
   * ------------------------------------------------------ */
  function init() {
    initScrollReveals();
    initCounters();
    initParallax();
    initStaggeredCards();
    initActiveNav();
    initSmoothScroll();
    initApiBaseDetection();
    initTypeReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM already ready (script loaded with defer or at end of body)
    init();
  }
})();
