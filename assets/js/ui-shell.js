(() => {
  if (window.__VCX_UI_SHELL__) return;
  window.__VCX_UI_SHELL__ = true;

  const doc = document;
  const root = doc.documentElement;
  const body = doc.body;

  const $ = (s, e = doc) => e.querySelector(s);
  const $$ = (s, e = doc) => Array.from(e.querySelectorAll(s));

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
    body.classList.remove('vcx-lock-scroll');
    root.classList.remove('vcx-lock-scroll');
  }

  function initClocks() {
    const vcxClocks = $$('.clock-vcx');
    const localClocks = $$('.clock-local');
    if (!vcxClocks.length && !localClocks.length) return;

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

    const render = () => {
      const now = new Date();
      const vcx = fmtVcx.format(now);
      const local = fmtLocal.format(now);
      vcxClocks.forEach((el) => { el.textContent = vcx; });
      localClocks.forEach((el) => { el.textContent = local; });
    };

    render();
    if (window.__vcxClockTimer) clearInterval(window.__vcxClockTimer);
    window.__vcxClockTimer = setInterval(render, 60000);
  }

  function normalizeMobileHeader() {
    const mobile = $('.vcx-header-mobile');
    if (!mobile) return;
    const meta = $('.vcx-mobile-meta', mobile);
    const row = $('.vcx-mobile-row', mobile);
    const ribbon = $('.vcx-status-ribbon-mobile', mobile);
    const nav = $('.vcx-mobile-nav', mobile);
    if (!meta || !row) return;
    mobile.innerHTML = '';
    mobile.append(meta);
    mobile.append(row);
    if (ribbon) mobile.append(ribbon);
    if (nav) mobile.append(nav);
  }

  function bindMenu() {
    const wrap = $('.vcx-header-mobile');
    const button = $('.vcx-menu-btn');
    const nav = $('#vcxMobileNav');
    if (!wrap || !button || !nav || button.dataset.bound === '1') return;
    button.dataset.bound = '1';

    const mq = window.matchMedia('(max-width: 900px)');

    const setOpen = (open) => {
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
      nav.hidden = !open;
      wrap.classList.toggle('is-open', open);
      if (!open) unlockScroll();
    };

    setOpen(false);

    button.addEventListener('click', (event) => {
      event.preventDefault();
      if (!mq.matches) return;
      setOpen(nav.hidden);
    });

    $$('a', nav).forEach((link) => {
      if (link.dataset.bound === '1') return;
      link.dataset.bound = '1';
      link.addEventListener('click', () => setOpen(false), { passive: true });
    });

    doc.addEventListener('click', (event) => {
      if (!mq.matches || nav.hidden) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (!target.closest('.vcx-header-mobile')) setOpen(false);
    });

    doc.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setOpen(false);
    });

    const onChange = () => {
      if (!mq.matches) setOpen(false);
    };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  function boot() {
    unlockScroll();
    initClocks();
    normalizeMobileHeader();
    bindMenu();
    window.addEventListener('pageshow', unlockScroll, { passive: true });
    window.addEventListener('focus', unlockScroll, { passive: true });
    doc.addEventListener('visibilitychange', () => {
      if (!doc.hidden) unlockScroll();
    });
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();