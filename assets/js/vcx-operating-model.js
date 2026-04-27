/* ==========================================================================
   VitaCoreX — Operating Model
   Subtle entrance animation for the consolidated operating-model section.
   IntersectionObserver triggers a stagger fade-in across all .vcx-om-card
   children once the section enters the viewport.
   ========================================================================== */

(function () {
  'use strict';

  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init() {
    var section = document.querySelector('[data-vcx-operating-model]');
    if (!section) return;

    var cards = section.querySelectorAll('.vcx-om-card');
    if (!cards.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      cards.forEach(function (c) { c.classList.add('is-in'); });
      return;
    }

    // Apply per-card delay so they cascade in
    cards.forEach(function (card, i) {
      // Cap delay at 480ms so the bottom card doesn't lag too long
      var delay = Math.min(i * 60, 480);
      card.style.transitionDelay = delay + 'ms';
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        // Reveal all at once — the per-card transition-delay above creates the cascade
        cards.forEach(function (c) { c.classList.add('is-in'); });
        observer.disconnect();
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

    observer.observe(section);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
