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
   * 9. Premium Falling Leaves Animation
   *    Creates organic, randomized falling leaf particles
   *    on .hero-premium — replaces cloud video background
   * ------------------------------------------------------ */
  function initLeafAnimation() {
    var hero = document.querySelector('.hero-premium');
    if (!hero || prefersReducedMotion) return;

    // Create leaf container
    var container = document.createElement('div');
    container.className = 'vcx-leaf-container';
    container.setAttribute('aria-hidden', 'true');
    container.style.cssText =
      'position:absolute;inset:0;z-index:1;pointer-events:none;overflow:hidden;';
    hero.style.position = 'relative';
    hero.insertBefore(container, hero.firstChild);

    // SVG leaf templates — 4 organic shapes
    var leafSVGs = [
      // Birch leaf — classic teardrop
      "<svg viewBox='0 0 40 55' xmlns='http://www.w3.org/2000/svg'>" +
        "<path d='M20 0C30 12 36 28 20 55C4 28 10 12 20 0Z' fill='FG'/>" +
        "<path d='M20 8L20 48' stroke='ST' stroke-width='0.6' fill='none'/>" +
        "<path d='M20 18L28 14M20 26L12 22M20 34L27 30' stroke='ST' stroke-width='0.3' fill='none'/>" +
      "</svg>",
      // Maple-style — wider
      "<svg viewBox='0 0 50 45' xmlns='http://www.w3.org/2000/svg'>" +
        "<path d='M25 0C32 6 42 12 48 20C42 22 38 18 35 22C38 28 40 35 38 42L25 45L12 42C10 35 12 28 15 22C12 18 8 22 2 20C8 12 18 6 25 0Z' fill='FG'/>" +
        "<path d='M25 8L25 42' stroke='ST' stroke-width='0.4' fill='none'/>" +
      "</svg>",
      // Small round leaf
      "<svg viewBox='0 0 30 36' xmlns='http://www.w3.org/2000/svg'>" +
        "<path d='M15 0C22 7 28 18 15 36C2 18 8 7 15 0Z' fill='FG'/>" +
        "<path d='M15 5L15 32' stroke='ST' stroke-width='0.4' fill='none'/>" +
      "</svg>",
      // Elongated willow leaf
      "<svg viewBox='0 0 18 50' xmlns='http://www.w3.org/2000/svg'>" +
        "<path d='M9 0C14 10 16 25 9 50C2 25 4 10 9 0Z' fill='FG'/>" +
        "<path d='M9 6L9 44' stroke='ST' stroke-width='0.3' fill='none'/>" +
      "</svg>"
    ];

    // Color palette — greens with varying opacity for depth
    var fills = [
      'rgba(91,186,167,0.12)',
      'rgba(91,186,167,0.08)',
      'rgba(123,174,158,0.10)',
      'rgba(141,212,197,0.07)',
      'rgba(61,142,126,0.09)',
      'rgba(91,186,167,0.06)'
    ];
    var strokes = [
      'rgba(141,212,197,0.15)',
      'rgba(91,186,167,0.10)',
      'rgba(123,174,158,0.12)',
      'rgba(197,221,214,0.08)'
    ];

    var LEAF_COUNT = 12;
    var leaves = [];

    function createLeaf() {
      var svg = leafSVGs[Math.floor(Math.random() * leafSVGs.length)];
      var fill = fills[Math.floor(Math.random() * fills.length)];
      var stroke = strokes[Math.floor(Math.random() * strokes.length)];
      svg = svg.replace(/FG/g, fill).replace(/ST/g, stroke);

      var wrapper = document.createElement('div');
      var size = 18 + Math.random() * 28; // 18–46px
      wrapper.innerHTML = svg;
      wrapper.style.cssText =
        'position:absolute;width:' + size + 'px;height:auto;' +
        'top:-60px;' +
        'left:' + (Math.random() * 100) + '%;' +
        'opacity:0;will-change:transform,opacity;';

      container.appendChild(wrapper);
      return {
        el: wrapper,
        x: Math.random() * 100,
        speed: 0.3 + Math.random() * 0.6,      // fall speed
        swayAmp: 15 + Math.random() * 40,        // horizontal sway amplitude
        swayFreq: 0.5 + Math.random() * 1.5,     // sway frequency
        rotSpeed: 0.3 + Math.random() * 1.2,      // rotation speed
        delay: Math.random() * 8000,               // initial delay
        phase: Math.random() * Math.PI * 2         // sway phase offset
      };
    }

    for (var i = 0; i < LEAF_COUNT; i++) {
      leaves.push(createLeaf());
    }

    var startTime = performance.now();

    function animateLeaves(now) {
      var elapsed = now - startTime;
      var heroH = hero.offsetHeight;

      for (var j = 0; j < leaves.length; j++) {
        var leaf = leaves[j];
        var t = elapsed - leaf.delay;
        if (t < 0) { continue; }

        // Cycle: each leaf takes ~10-18s to fall
        var cycleDuration = (heroH + 120) / leaf.speed / 60 * 1000;
        var progress = (t % cycleDuration) / cycleDuration;

        // Y position: top to bottom
        var y = -60 + progress * (heroH + 120);

        // X sway
        var sway = Math.sin(progress * Math.PI * 2 * leaf.swayFreq + leaf.phase) * leaf.swayAmp;

        // Rotation
        var rotation = (t / 1000) * leaf.rotSpeed * 60;

        // Opacity: fade in, visible, fade out
        var opacity = 1;
        if (progress < 0.08) opacity = progress / 0.08;
        else if (progress > 0.85) opacity = (1 - progress) / 0.15;

        leaf.el.style.transform =
          'translate3d(' + sway + 'px,' + y + 'px,0) rotate(' + rotation + 'deg)';
        leaf.el.style.opacity = opacity * 0.9;
      }

      requestAnimationFrame(animateLeaves);
    }

    requestAnimationFrame(animateLeaves);
  }

  /* --------------------------------------------------------
   * 10. Init -- run everything on DOMContentLoaded
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
    initLeafAnimation();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM already ready (script loaded with defer or at end of body)
    init();
  }
})();
