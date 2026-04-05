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

    // Premium palette — very subtle, barely visible
    var fills = [
      'rgba(91,186,167,0.05)',
      'rgba(91,186,167,0.04)',
      'rgba(123,174,158,0.04)',
      'rgba(141,212,197,0.03)',
      'rgba(61,142,126,0.04)',
      'rgba(91,186,167,0.03)'
    ];
    var strokes = [
      'rgba(141,212,197,0.06)',
      'rgba(91,186,167,0.05)',
      'rgba(123,174,158,0.05)',
      'rgba(197,221,214,0.04)'
    ];

    var LEAF_COUNT = 6; // fewer = more elegant
    var leaves = [];

    function createLeaf() {
      var svg = leafSVGs[Math.floor(Math.random() * leafSVGs.length)];
      var fill = fills[Math.floor(Math.random() * fills.length)];
      var stroke = strokes[Math.floor(Math.random() * strokes.length)];
      svg = svg.replace(/FG/g, fill).replace(/ST/g, stroke);

      var wrapper = document.createElement('div');
      var size = 14 + Math.random() * 18; // 14–32px (smaller)
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
        speed: 0.15 + Math.random() * 0.25,     // much slower drift
        swayAmp: 8 + Math.random() * 16,         // gentle sway
        swayFreq: 0.3 + Math.random() * 0.6,     // slow frequency
        rotSpeed: 0.1 + Math.random() * 0.3,     // minimal rotation
        delay: Math.random() * 12000,             // more spread out
        phase: Math.random() * Math.PI * 2
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
   * 10. Text Split Animation
   *     Hero h1/h2 words appear one by one on scroll
   * ------------------------------------------------------ */
  function initTextSplit() {
    if (prefersReducedMotion) return;

    function splitAndObserve() {
      var headings = document.querySelectorAll('.hero-copy h1, .section-head h2');
      if (!headings.length) return;

      for (var i = 0; i < headings.length; i++) {
        var el = headings[i];
        if (el.querySelector('.vcx-word')) continue; // already split
        var text = el.textContent.trim();
        if (!text) continue;
        var words = text.split(/\s+/);
        el.innerHTML = '';
        for (var w = 0; w < words.length; w++) {
          var span = document.createElement('span');
          span.className = 'vcx-word';
          span.textContent = words[w];
          span.style.transitionDelay = (w * 0.06) + 's';
          el.appendChild(span);
          if (w < words.length - 1) el.appendChild(document.createTextNode(' '));
        }
      }

      var observer = new IntersectionObserver(function(entries, obs) {
        entries.forEach(function(entry) {
          if (!entry.isIntersecting) return;
          var wordEls = entry.target.querySelectorAll('.vcx-word');
          for (var j = 0; j < wordEls.length; j++) {
            wordEls[j].classList.add('vcx-word-visible');
          }
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.2 });

      for (var k = 0; k < headings.length; k++) {
        observer.observe(headings[k]);
      }
    }

    // Delay to run AFTER translation systems finish
    setTimeout(splitAndObserve, 300);

    // Re-split when language changes (translations overwrite innerHTML)
    document.addEventListener('vcx:lang-change', function() {
      setTimeout(splitAndObserve, 100);
    });
  }

  /* --------------------------------------------------------
   * 11. 3D Card Tilt on Mouse Move
   * ------------------------------------------------------ */
  function initCardTilt() {
    var cards = document.querySelectorAll('.lux-card, .service-card-lux, .authority-card');
    if (!cards.length || prefersReducedMotion) return;
    if ('ontouchstart' in window && window.innerWidth < 1024) return; // skip touch-only devices

    for (var i = 0; i < cards.length; i++) {
      cards[i].classList.add('vcx-tilt-card');

      cards[i].addEventListener('mousemove', function(e) {
        var rect = this.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        this.style.transform =
          'perspective(600px) rotateY(' + (x * 6) + 'deg) rotateX(' + (-y * 6) + 'deg) translateY(-3px)';
      });

      cards[i].addEventListener('mouseleave', function() {
        this.style.transform = '';
      });
    }
  }

  /* --------------------------------------------------------
   * 12. Smooth Page Transitions
   * ------------------------------------------------------ */
  function initPageTransitions() {
    if (prefersReducedMotion) return;

    // Fade in on load
    document.body.classList.add('vcx-page-enter');

    // Intercept internal link clicks
    document.addEventListener('click', function(e) {
      var link = e.target.closest('a[href]');
      if (!link) return;
      var href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') ||
          href.startsWith('tel:') || href.startsWith('javascript:') ||
          link.target === '_blank' || href.startsWith('http')) return;

      e.preventDefault();
      document.body.classList.remove('vcx-page-enter');
      document.body.classList.add('vcx-page-exit');
      var dest = href;
      setTimeout(function() { window.location.href = dest; }, 300);
    });
  }

  /* --------------------------------------------------------
   * 13. Cursor Glow Effect (desktop only)
   * ------------------------------------------------------ */
  function initCursorGlow() {
    if (prefersReducedMotion) return;
    if ('ontouchstart' in window) return; // skip touch devices

    var glow = document.createElement('div');
    glow.className = 'vcx-cursor-glow';
    glow.style.opacity = '0';
    document.body.appendChild(glow);

    var mx = 0, my = 0, gx = 0, gy = 0;
    document.addEventListener('mousemove', function(e) {
      mx = e.clientX; my = e.clientY;
      glow.style.opacity = '1';
    });
    document.addEventListener('mouseleave', function() {
      glow.style.opacity = '0';
    });

    function tick() {
      gx += (mx - gx) * 0.12;
      gy += (my - gy) * 0.12;
      glow.style.left = gx + 'px';
      glow.style.top = gy + 'px';
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* --------------------------------------------------------
   * 14. Scroll-Triggered Video Play/Pause
   * ------------------------------------------------------ */
  function initScrollVideo() {
    var videos = document.querySelectorAll('.hero-video video, video[data-scroll-play]');
    if (!videos.length) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.play().catch(function(){});
        } else {
          entry.target.pause();
        }
      });
    }, { threshold: 0.1 });

    for (var i = 0; i < videos.length; i++) {
      observer.observe(videos[i]);
    }
  }

  /* --------------------------------------------------------
   * 15. Hero Canvas Particles (teal data-flow visualization)
   * ------------------------------------------------------ */
  function initHeroParticles() {
    var hero = document.querySelector('.hero-premium');
    if (!hero || prefersReducedMotion) return;
    if ('ontouchstart' in window && window.innerWidth < 1024) return; // skip small touch devices

    var canvas = document.createElement('canvas');
    canvas.className = 'vcx-hero-canvas';
    hero.insertBefore(canvas, hero.firstChild);

    var ctx = canvas.getContext('2d');
    var particles = [];
    var PARTICLE_COUNT = 40;
    var connections = [];

    function resize() {
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (var i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.3,
        r: 1.5 + Math.random() * 2,
        alpha: 0.15 + Math.random() * 0.25
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      for (var j = 0; j < particles.length; j++) {
        var p = particles[j];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(91, 196, 184, ' + p.alpha + ')';
        ctx.fill();
      }

      // Draw connections between nearby particles
      for (var a = 0; a < particles.length; a++) {
        for (var b = a + 1; b < particles.length; b++) {
          var dx = particles[a].x - particles[b].x;
          var dy = particles[a].y - particles[b].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.strokeStyle = 'rgba(91, 196, 184, ' + (0.06 * (1 - dist / 120)) + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }

  /* --------------------------------------------------------
   * 16. Enhanced Counter — add pop animation on complete
   * ------------------------------------------------------ */
  var _origAnimateCounter = null;
  function patchCounterPop() {
    // Add vcx-counted class after counter finishes for CSS pop
    var counters = document.querySelectorAll('[data-vcx-count-to]');
    if (!counters.length || prefersReducedMotion) return;

    var observer = new IntersectionObserver(function(entries, obs) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        // After 2.1s (counter duration + buffer), add pop class
        var el = entry.target;
        setTimeout(function() {
          el.classList.add('vcx-counted');
        }, 2100);
        obs.unobserve(el);
      });
    }, { threshold: 0.25 });

    for (var i = 0; i < counters.length; i++) {
      observer.observe(counters[i]);
    }
  }

  /* --------------------------------------------------------
   * 99. Init -- run everything on DOMContentLoaded
   * ------------------------------------------------------ */
  function safe(fn) { try { fn(); } catch(e) { console.warn('[VCX]', fn.name || 'anon', e.message); } }

  function init() {
    safe(initScrollReveals);
    safe(initCounters);
    safe(initParallax);
    safe(initStaggeredCards);
    safe(initActiveNav);
    safe(initSmoothScroll);
    safe(initApiBaseDetection);
    safe(initTypeReveal);
    safe(initLeafAnimation);
    // Premium v2
    safe(initTextSplit);
    safe(initCardTilt);
    safe(initPageTransitions);
    safe(initCursorGlow);
    safe(initScrollVideo);
    safe(initHeroParticles);
    safe(patchCounterPop);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM already ready (script loaded with defer or at end of body)
    init();
  }
})();
