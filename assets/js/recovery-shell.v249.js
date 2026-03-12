
(() => {
  if (window.__XREC_SHELL_BOOTED__) return;
  window.__XREC_SHELL_BOOTED__ = true;

  const doc = document;
  const body = doc.body;
  if (body) body.setAttribute('data-xrec-recovery', 'true');

  const shell = doc.querySelector('[data-xrec-shell]');
  const dock = doc.querySelector('[data-xrec-dock]');
  const navWrap = doc.getElementById('xrecShellNav');
  const toggle = doc.querySelector('.xrec-shell__toggle');

  function routeKey(href) {
    if (!href) return '';
    const clean = href.split('#')[0].split('?')[0];
    if (!clean || clean === '/' || clean.endsWith('/')) return 'index.html';
    return clean.split('/').pop() || 'index.html';
  }

  function currentPage() {
    const path = (location.pathname || '').split('/').pop();
    return path || 'index.html';
  }

  function setActiveLinks() {
    const page = currentPage();
    doc.querySelectorAll('[data-xrec-route]').forEach((link) => {
      const active = routeKey(link.getAttribute('href')) === page;
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  function closeMenu() {
    if (!navWrap || !toggle) return;
    navWrap.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
  }

  function openMenu() {
    if (!navWrap || !toggle) return;
    navWrap.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
  }

  function syncDesktopMenu() {
    if (!navWrap || !toggle) return;
    if (window.innerWidth >= 980) {
      navWrap.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
    } else if (toggle.getAttribute('aria-expanded') !== 'true') {
      navWrap.hidden = true;
    }
  }

  function pruneLegacyShell() {
    const legacySelectors = [
      '.vcx-recovery-shell','.vcx-recovery-dock','.vcx-header-desktop','.vcx-header-mobile',
      '.vcx-dock-desktop','.vcx-dock-mobile','.vcx-shell-wrap','.vcx-shell-bar'
    ];
    legacySelectors.forEach((sel) => {
      doc.querySelectorAll(sel).forEach((node) => {
        if (shell && shell.contains(node)) return;
        if (dock && dock.contains(node)) return;
        node.remove();
      });
    });
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      if (expanded) closeMenu(); else openMenu();
    }, { passive: true });
  }

  doc.addEventListener('click', (event) => {
    if (!navWrap || !toggle || window.innerWidth >= 980) return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.closest('.xrec-shell__nav a')) closeMenu();
    if (!target.closest('[data-xrec-shell]')) closeMenu();
  });

  window.addEventListener('resize', syncDesktopMenu, { passive: true });
  setActiveLinks();
  pruneLegacyShell();
  syncDesktopMenu();
})();
