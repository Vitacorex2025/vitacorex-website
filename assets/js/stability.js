(() => {
  if (window.__VCX_STABILITY_PATCH__) return;
  window.__VCX_STABILITY_PATCH__ = true;

  const doc = document;
  const root = doc.documentElement;
  const body = doc.body;

  function unlockScroll() {
    if (!body || !root) return;
    if (body.classList.contains('modal-open')) return;
    body.style.overflow = '';
    body.style.overflowY = 'auto';
    body.style.position = '';
    body.style.top = '';
    body.style.width = '';
    root.style.overflow = '';
    root.style.overflowY = 'auto';
    root.style.height = '';
  }

  function disableHeroVideo() {
    doc.querySelectorAll('.hero-video video, .sky-video, .sky-video-wrap video').forEach((video) => {
      try { video.pause(); } catch (_) {}
      video.removeAttribute('autoplay');
      video.setAttribute('preload', 'none');
      video.setAttribute('aria-hidden', 'true');
      video.setAttribute('tabindex', '-1');
    });
  }

  function normalizeMenuState() {
    const button = doc.querySelector('.vcx-menu-btn');
    const nav = doc.getElementById('vcxMobileNav');
    const wrap = doc.querySelector('.vcx-header-mobile');
    if (!button || !nav || !wrap) return;
    if (!button.hasAttribute('aria-expanded')) {
      button.setAttribute('aria-expanded', nav.hidden ? 'false' : 'true');
    }
    if (!nav.hidden && window.innerWidth > 900) {
      nav.hidden = true;
      button.setAttribute('aria-expanded', 'false');
      wrap.classList.remove('is-open');
    }
  }

  function boot() {
    disableHeroVideo();
    unlockScroll();
    normalizeMenuState();
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }

  window.addEventListener('pageshow', boot, { passive: true });
  window.addEventListener('focus', unlockScroll, { passive: true });
  window.addEventListener('resize', normalizeMenuState, { passive: true });
  doc.addEventListener('visibilitychange', () => {
    if (!doc.hidden) {
      disableHeroVideo();
      unlockScroll();
    }
  });
})();
