(() => {
  if (window.__VCX_EMERGENCY_RECOVERY_V250__) return;
  window.__VCX_EMERGENCY_RECOVERY_V250__ = true;
  const doc = document, root = doc.documentElement;
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
    { href: 'resources.html', label: 'Briefs' },
    { href: 'https://wa.me/18139194242', label: 'WhatsApp', external: true },
    { href: 'https://calendly.com/vitacorex2025/30min', label: 'Book', external: true }
  ];
  const LEGACY_SELECTORS = ['.vcx-header','.vcx-dock','.vcx-recovery-shell','.vcx-recovery-dock','[data-vcx-shell="single"]','[data-vcx-dock="single"]'];
  const normalizePath = (path) => { const value = (path || '').split('?')[0].split('#')[0]; if (!value || value === '/' || value.endsWith('/')) return 'index.html'; return value.substring(value.lastIndexOf('/') + 1) || 'index.html'; };
  const currentPage = () => normalizePath(window.location.pathname);
  const isActive = (href) => !/^https?:\/\//i.test(href) && normalizePath(href) === currentPage();
  function unlockScroll(){ const body = doc.body; if (!body || body.classList.contains('modal-open')) return; body.style.overflow=''; body.style.overflowY='auto'; body.style.position=''; body.style.top=''; body.style.width=''; root.style.overflow=''; root.style.overflowY='auto'; root.style.height=''; }
  function removeLegacyShell(){ LEGACY_SELECTORS.forEach((selector)=>doc.querySelectorAll(selector).forEach((node)=>node.remove())); }
  function removeInjectedShell(){ doc.querySelectorAll('[data-vcx-hotfix="header"], [data-vcx-hotfix="dock"]').forEach((node)=>node.remove()); }
  function linkHTML(item){ const cls=[item.cta?'vcx-xrec-cta':'', item.primary?'vcx-xrec-dock-primary':'', isActive(item.href)?'is-active':''].filter(Boolean).join(' '); const attrs=item.external?' target="_blank" rel="noopener"':''; return `<a href="${item.href}" class="${cls}"${attrs}>${item.label}</a>`; }
  function buildHeader(){ const header = doc.createElement('header'); header.className='vcx-xrec-header'; header.setAttribute('data-vcx-hotfix','header'); header.innerHTML=`<div class="vcx-xrec-wrap"><div class="vcx-xrec-bar"><a class="vcx-xrec-brand" href="index.html" aria-label="VitaCoreX home"><img src="assets/img/logo.png" alt="VitaCoreX logo"><span class="vcx-xrec-brandtext"><strong>VitaCoreX LLC</strong><span>Recovery infrastructure and legal file control</span></span></a><div class="vcx-xrec-desktop"><nav class="vcx-xrec-nav" aria-label="Primary">${NAV.map((item)=>linkHTML(item)).join('')}</nav></div><button class="vcx-xrec-menu" type="button" aria-expanded="false" aria-controls="vcxXrecMobileNav"><span aria-hidden="true">☰</span><span>Menu</span></button></div></div><div class="vcx-xrec-mobile" id="vcxXrecMobileNav" hidden><div class="vcx-xrec-mobile-inner">${NAV.map((item)=>linkHTML(item)).join('')}<a href="https://wa.me/18139194242" target="_blank" rel="noopener">WhatsApp</a><a href="https://calendly.com/vitacorex2025/30min" target="_blank" rel="noopener">Book</a></div></div>`; return header; }
  function buildDock(){ const nav = doc.createElement('nav'); nav.className='vcx-xrec-dock'; nav.setAttribute('aria-label','Quick access'); nav.setAttribute('data-vcx-hotfix','dock'); nav.innerHTML=`<div class="vcx-xrec-dock-inner">${DOCK.map((item)=>linkHTML(item)).join('')}</div>`; return nav; }
  function bindHeader(header){ const button = header.querySelector('.vcx-xrec-menu'); const mobileNav = header.querySelector('#vcxXrecMobileNav'); if (!button || !mobileNav) return; const close=()=>{ button.setAttribute('aria-expanded','false'); mobileNav.hidden=true; }; const open=()=>{ button.setAttribute('aria-expanded','true'); mobileNav.hidden=false; }; const sync=()=>{ if (window.innerWidth > 940) close(); }; button.addEventListener('click', ()=>{ button.getAttribute('aria-expanded')==='true' ? close() : open(); }); mobileNav.querySelectorAll('a').forEach((link)=>link.addEventListener('click', close, { passive: true })); window.addEventListener('resize', sync, { passive: true }); window.addEventListener('pageshow', sync, { passive: true }); doc.addEventListener('keydown', (event)=>{ if (event.key === 'Escape') close(); }); sync(); }
  function injectShell(){ const body = doc.body; if (!body) return; removeInjectedShell(); removeLegacyShell(); unlockScroll(); const header=buildHeader(); const dock=buildDock(); body.insertBefore(header, body.firstChild); body.appendChild(dock); bindHeader(header); unlockScroll(); }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', injectShell, { once: true }); else injectShell();
})();