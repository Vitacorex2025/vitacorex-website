(() => {
  if (window.__VCX_EMERGENCY_SHELL_V251__) return;
  window.__VCX_EMERGENCY_SHELL_V251__ = true;
  const doc = document;
  const root = doc.documentElement;
  const NAV = [
    { href: 'index.html', label: 'Home' },
    { href: 'corporate-legal-file-control.html', label: 'Legal File Control' },
    { href: 'revenue-recovery-workflow.html', label: 'Pre-Collection' },
    { href: 'structured-case-intake.html', label: 'Request Service', cta: true },
    { href: 'resources.html', label: 'Executive Briefs' },
    { href: 'additional-services.html', label: 'Individuals' },
    { href: 'careers.html', label: 'Careers' }
  ];
  const DOCK = [
    { href: 'structured-case-intake.html', label: 'Request Service', primary: true },
    { href: 'index.html', label: 'Home' },
    { href: 'https://wa.me/18139194242', label: 'WhatsApp', external: true },
    { href: 'https://calendly.com/vitacorex2025/30min', label: 'Book', external: true },
    { href: 'resources.html', label: 'Briefs' }
  ];
  const LEGACY = [
    '.vcx-header','.vcx-dock-shell','.vcx-dock-desktop','.vcx-dock-mobile','.vcx-header-shell','.vcx-header-desktop','.vcx-header-mobile',
    '.vcx-recovery-shell','.vcx-recovery-dock','.vcx-xrec-header','.vcx-xrec-dock',
    '[data-vcx-hotfix="header"]','[data-vcx-hotfix="dock"]','[data-vcx-shell="single"]','[data-vcx-dock="single"]'
  ];
  const normalizePath = (path) => {
    const clean = String(path || '').split('?')[0].split('#')[0];
    if (!clean || clean === '/' || clean.endsWith('/')) return 'index.html';
    return clean.slice(clean.lastIndexOf('/') + 1) || 'index.html';
  };
  const currentPage = () => normalizePath(window.location.pathname);
  const isActive = (href) => !/^https?:\/\//i.test(href) && normalizePath(href) === currentPage();
  function unlockScroll() {
    const body = doc.body;
    if (!body) return;
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
  function removeLegacy() {
    LEGACY.forEach((selector) => {
      doc.querySelectorAll(selector).forEach((node) => node.remove());
    });
  }
  function emergencyHeaderHTML() {
    const links = NAV.map((item) => {
      const classes = ['vcx-emr-navlink'];
      if (isActive(item.href)) classes.push('is-active');
      if (item.cta) classes.push('is-cta');
      return '<a class="' + classes.join(' ') + '" href="' + item.href + '">' + item.label + '</a>';
    }).join('');
    return '' +
      '<header class="vcx-emr-header" data-vcx-emergency="header">' +
        '<div class="vcx-emr-wrap">' +
          '<div class="vcx-emr-bar">' +
            '<a class="vcx-emr-brand" href="index.html" aria-label="VitaCoreX home">' +
              '<img src="assets/img/logo.png" alt="VitaCoreX logo">' +
              '<div class="vcx-emr-brandcopy"><strong>VitaCoreX LLC</strong><span>Recovery systems & legal file control</span></div>' +
            '</a>' +
            '<button class="vcx-emr-menu" type="button" aria-expanded="false" aria-controls="vcxEmergencyNav">Menu</button>' +
            '<nav class="vcx-emr-nav" id="vcxEmergencyNav" aria-label="Primary">' + links + '</nav>' +
          '</div>' +
        '</div>' +
      '</header>';
  }
  function emergencyDockHTML() {
    const links = DOCK.map((item) => {
      const classes = ['vcx-emr-docklink'];
      if (item.primary) classes.push('is-primary');
      const attrs = item.external ? ' target="_blank" rel="noopener"' : '';
      return '<a class="' + classes.join(' ') + '" href="' + item.href + '"' + attrs + '>' + item.label + '</a>';
    }).join('');
    return '<div class="vcx-emr-dock" data-vcx-emergency="dock" aria-label="Quick actions"><div class="vcx-emr-dockinner">' + links + '</div></div>';
  }
  function ensureShell() {
    const body = doc.body;
    if (!body) return;
    removeLegacy();
    doc.querySelectorAll('[data-vcx-emergency="header"]').forEach((node, index) => { if (index > 0) node.remove(); });
    doc.querySelectorAll('[data-vcx-emergency="dock"]').forEach((node, index) => { if (index > 0) node.remove(); });
    if (!doc.querySelector('[data-vcx-emergency="header"]')) body.insertAdjacentHTML('afterbegin', emergencyHeaderHTML());
    if (!doc.querySelector('[data-vcx-emergency="dock"]')) body.insertAdjacentHTML('beforeend', emergencyDockHTML());
    body.classList.remove('vcx-lock-scroll');
    unlockScroll();
    bindMenu();
  }
  function bindMenu() {
    const header = doc.querySelector('[data-vcx-emergency="header"]');
    const button = header && header.querySelector('.vcx-emr-menu');
    const nav = header && header.querySelector('.vcx-emr-nav');
    if (!header || !button || !nav || button.dataset.bound === '1') return;
    button.dataset.bound = '1';
    const setOpen = (open) => {
      header.classList.toggle('is-open', !!open);
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    setOpen(false);
    button.addEventListener('click', () => setOpen(!header.classList.contains('is-open')));
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setOpen(false), { passive: true });
    });
    doc.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (!target.closest('[data-vcx-emergency="header"]')) setOpen(false);
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024) setOpen(false);
    }, { passive: true });
  }
  window.__VCX_EMERGENCY_SHELL_REPAIR__ = ensureShell;
  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', ensureShell, { once: true });
  } else {
    ensureShell();
  }
  window.addEventListener('pageshow', ensureShell, { passive: true });
  window.addEventListener('focus', unlockScroll, { passive: true });
  doc.addEventListener('visibilitychange', () => { if (!doc.hidden) unlockScroll(); });
})();


(() => {
  try { if (typeof window.__VCX_EMERGENCY_SHELL_REPAIR__ === 'function') window.__VCX_EMERGENCY_SHELL_REPAIR__(); } catch (e) {}
})();
