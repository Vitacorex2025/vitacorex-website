/* ============================================================
   VCX PREMIUM 2.0 — Lenis + GSAP + ScrollTrigger + Counters
   Weave-level smooth scroll & animations
   ============================================================ */

(function () {
  'use strict';

  // ---- 1. LENIS SMOOTH SCROLL ----
  let lenis;
  function initLenis() {
    if (typeof Lenis === 'undefined') return;
    lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync with GSAP if available
    if (typeof gsap !== 'undefined' && gsap.ticker) {
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
  }

  // ---- 2. SCROLL-TRIGGERED REVEALS ----
  function initScrollReveals() {
    var els = document.querySelectorAll('[data-animate]');
    if (!els.length) return;

    // Prefer GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      // Sync Lenis with ScrollTrigger
      if (lenis) {
        lenis.on('scroll', ScrollTrigger.update);
      }

      els.forEach(function (el) {
        var dir = el.getAttribute('data-animate') || 'up';
        if (dir === 'none') return; // skip hero/stats

        var fromVars = { opacity: 0 };
        var toVars = { opacity: 1, duration: 0.8, ease: 'power2.out' };

        if (dir === 'left') { fromVars.x = -60; toVars.x = 0; }
        else if (dir === 'right') { fromVars.x = 60; toVars.x = 0; }
        else if (dir === 'scale') { fromVars.scale = 0.9; toVars.scale = 1; }
        else { fromVars.y = 60; toVars.y = 0; }

        toVars.scrollTrigger = {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        };

        gsap.fromTo(el, fromVars, toVars);
      });

      // Staggered card grids
      document.querySelectorAll('.vcx-stagger, .vcx-card-grid-2').forEach(function (grid) {
        gsap.fromTo(grid.children,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out',
            scrollTrigger: { trigger: grid, start: 'top 82%' }
          }
        );
      });

    } else {
      // Fallback: IntersectionObserver
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

      els.forEach(function (el) { observer.observe(el); });

      // Stagger observer
      document.querySelectorAll('.vcx-stagger, .vcx-card-grid-2').forEach(function (grid) {
        observer.observe(grid);
      });
    }
  }

  // ---- 3. COUNTER ANIMATIONS ----
  function initCounters() {
    var counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      counters.forEach(function (el) {
        var target = parseFloat(el.getAttribute('data-counter'));
        var obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2.2,
          ease: 'power1.out',
          scrollTrigger: { trigger: el, start: 'top 82%' },
          onUpdate: function () {
            el.textContent = Math.round(obj.val);
          }
        });
      });
    } else {
      // Fallback: simple counter
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var target = parseFloat(el.getAttribute('data-counter'));
          var start = 0;
          var duration = 2000;
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
  }

  // ---- 4. PARALLAX ELEMENTS ----
  function initParallax() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    document.querySelectorAll('[data-parallax]').forEach(function (el) {
      var speed = parseFloat(el.getAttribute('data-parallax')) || -15;
      gsap.to(el, {
        yPercent: speed,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });
  }

  // ---- 4B. SECTION STACKING (lightweight) ----
  function initSectionReveals() {
    // Just apply stacking z-index — no heavy scrub animations
    var allSections = document.querySelectorAll('section.section, section.vcx-impact-section, section.band');
    allSections.forEach(function (sec, i) {
      sec.classList.add('vcx-stack-section');
      sec.style.zIndex = 10 + i;
      sec.style.position = 'relative';
    });
  }

  // ---- 5. HEADER SHRINK ON SCROLL ----
  function initHeader() {
    var header = document.querySelector('.vcx-header-2') || document.querySelector('.vcx-header');
    if (!header) return;

    var scrollThreshold = 60;
    var onScroll = function () {
      var y = window.scrollY || window.pageYOffset;
      if (y > scrollThreshold) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };

    if (lenis) {
      lenis.on('scroll', function (e) {
        if (e.animatedScroll > scrollThreshold) {
          header.classList.add('is-scrolled');
        } else {
          header.classList.remove('is-scrolled');
        }
      });
    } else {
      window.addEventListener('scroll', onScroll, { passive: true });
    }
    onScroll();
  }

  // ---- 6. MAGNETIC BUTTONS ----
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

  // ---- 7. SPLIDE CAROUSELS ----
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

  // ---- INIT ALL ----
  function init() {
    initLenis();
    initScrollReveals();
    initSectionReveals();
    initCounters();
    initParallax();
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
