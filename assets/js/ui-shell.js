(() => {
  if (window.__VCX_SHELL_BOOTED__) return;
  window.__VCX_SHELL_BOOTED__ = true;

  const doc = document;
  const root = doc.documentElement;
  const body = doc.body;
  const q = (s, c = doc) => c.querySelector(s);
  const qa = (s, c = doc) => Array.from(c.querySelectorAll(s));

  function restoreNativeScroll(){
    if (!body) return;
    body.style.overflow = '';
    body.style.overflowY = 'auto';
    body.style.position = '';
    body.style.top = '';
    body.style.width = '';
    root.style.overflow = '';
    root.style.overflowY = 'auto';
    root.style.height = '';
    body.classList.remove('vcx-lock-scroll');
    root.classList.remove('vcx-lock-scroll');
  }

  function initClocks(){
    const vcx = qa('.clock-vcx');
    const local = qa('.clock-local');
    if (!vcx.length && !local.length) return;
    if (window.__vcxClockTimer) window.clearInterval(window.__vcxClockTimer);

    const fmtVcx = new Intl.DateTimeFormat([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'America/New_York'
    });
    const fmtLocal = new Intl.DateTimeFormat([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    const tick = () => {
      const now = new Date();
      const ny = fmtVcx.format(now);
      const here = fmtLocal.format(now);
      vcx.forEach((el) => { el.textContent = ny; });
      local.forEach((el) => { el.textContent = here; });
    };

    tick();
    window.__vcxClockTimer = window.setInterval(tick, 60000);
  }

  function reorderMobileHeader(){
    const mobile = q('.vcx-header-mobile');
    if (!mobile) return;
    const meta = q('.vcx-mobile-meta', mobile);
    const row = q('.vcx-mobile-row', mobile);
    const ribbon = q('.vcx-status-ribbon-mobile', mobile);
    const nav = q('.vcx-mobile-nav', mobile);
    if (meta && row && ribbon) {
      mobile.append(meta, row, ribbon);
      if (nav) mobile.append(nav);
    }
  }

  function initMobileMenu(){
    const wrap = q('.vcx-header-mobile');
    const btn = q('.vcx-menu-btn');
    const nav = q('#vcxMobileNav');
    if (!wrap || !btn || !nav) return;
    if (btn.dataset.vcxStableBound === '1') return;
    btn.dataset.vcxStableBound = '1';

    const mq = window.matchMedia('(max-width: 900px)');

    const setOpen = (open) => {
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      wrap.classList.toggle('is-open', open);
      nav.hidden = !open;
      root.classList.toggle('vcx-mobile-menu-open', open);
      if (!open) restoreNativeScroll();
    };

    setOpen(false);

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!mq.matches) return;
      setOpen(nav.hidden);
    });

    qa('a', nav).forEach((link) => {
      if (link.dataset.vcxStableBound === '1') return;
      link.dataset.vcxStableBound = '1';
      link.addEventListener('click', () => setOpen(false));
    });

    doc.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setOpen(false);
    }, { passive: true });

    doc.addEventListener('click', (e) => {
      if (!mq.matches || nav.hidden) return;
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (target.closest('.vcx-header-mobile')) return;
      setOpen(false);
    });

    mq.addEventListener('change', () => {
      if (!mq.matches) setOpen(false);
    });
  }

  function normalizeMarketPulse(){
    qa('.vcx-static-market').forEach((box) => {
      box.classList.add('is-ready');
    });
  }

  function boot(){
    restoreNativeScroll();
    initClocks();
    reorderMobileHeader();
    initMobileMenu();
    normalizeMarketPulse();

    window.addEventListener('pageshow', restoreNativeScroll, { passive: true });
    window.addEventListener('focus', restoreNativeScroll, { passive: true });
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) restoreNativeScroll();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
