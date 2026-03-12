(function(){
  if(window.__vcxUiShellV212) return;
  window.__vcxUiShellV212 = true;

  const menuBtn = document.querySelector('.vcx-menu-btn');
  const mobileNav = document.getElementById('vcxMobileNav');
  const mq = window.matchMedia('(max-width: 900px)');

  if(!menuBtn || !mobileNav) return;

  function setOpen(open){
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    mobileNav.hidden = !open;
    document.documentElement.classList.toggle('vcx-mobile-menu-open', open);
    if(open){
      document.documentElement.classList.remove('vcx-scroll-hide');
      document.documentElement.classList.add('vcx-scroll-compact');
    }
  }

  function closeMenu(){
    setOpen(false);
  }

  function toggleMenu(event){
    if(event) event.preventDefault();
    if(!mq.matches) return;
    setOpen(mobileNav.hidden);
  }

  setOpen(false);
  menuBtn.addEventListener('click', toggleMenu, {passive:false});
  mobileNav.querySelectorAll('a').forEach((link)=>{
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (event)=>{
    if(!mq.matches || mobileNav.hidden) return;
    const target = event.target;
    if(!(target instanceof Element)) return;
    if(target.closest('.vcx-header-mobile')) return;
    closeMenu();
  });

  document.addEventListener('keydown', (event)=>{
    if(event.key === 'Escape') closeMenu();
  });

  function sync(){
    if(!mq.matches){
      closeMenu();
    }
  }

  mq.addEventListener('change', sync);
  window.addEventListener('orientationchange', sync, {passive:true});

  let lastY = window.scrollY || 0;
  function syncScroll(){
    const y = window.scrollY || 0;
    const mobileOpen = document.documentElement.classList.contains('vcx-mobile-menu-open');
    const compact = y > 34;
    const shouldHide = !mobileOpen && y > 150 && y > lastY + 7;
    const shouldShow = y < 34 || y < lastY - 10 || mobileOpen;

    document.documentElement.classList.toggle('vcx-scroll-compact', compact || mobileOpen);

    if(shouldHide){
      document.documentElement.classList.add('vcx-scroll-hide');
    } else if(shouldShow){
      document.documentElement.classList.remove('vcx-scroll-hide');
    }

    lastY = y;
  }

  window.addEventListener('scroll', syncScroll, {passive:true});
  syncScroll();
})();

(function(){
  if(window.__vcxCalcRecoveryV213) return;
  window.__vcxCalcRecoveryV213 = true;

  const money = (n)=>{
    const value = Number.isFinite(n) ? n : 0;
    return '$' + Math.max(0, value).toLocaleString(undefined, {maximumFractionDigits:0});
  };

  function bindInputGroup(ids, handler){
    const nodes = ids.map((id)=>document.getElementById(id)).filter(Boolean);
    if(!nodes.length) return false;
    nodes.forEach((node)=>{
      if(node.dataset.vcxCalcBound === '1') return;
      node.addEventListener('input', handler);
      node.addEventListener('change', handler);
      node.dataset.vcxCalcBound = '1';
    });
    handler();
    return true;
  }

  function initExecutiveTools(){
    bindInputGroup(['leakRevenue','leakResponsibility','leakLeakage'], ()=>{
      const revenue = +(document.getElementById('leakRevenue') || {}).value || 0;
      const responsibility = (+(document.getElementById('leakResponsibility') || {}).value || 0) / 100;
      const leakage = (+(document.getElementById('leakLeakage') || {}).value || 0) / 100;
      const output = document.getElementById('leakOutput');
      if(output) output.textContent = money(revenue * responsibility * leakage);
    });

    bindInputGroup(['dsoRevenue','dsoCurrent','dsoTarget'], ()=>{
      const revenue = +(document.getElementById('dsoRevenue') || {}).value || 0;
      const current = +(document.getElementById('dsoCurrent') || {}).value || 0;
      const target = +(document.getElementById('dsoTarget') || {}).value || 0;
      const delta = Math.max(0, current - target);
      const released = (delta / 365) * revenue;
      const output = document.getElementById('dsoOutput');
      const badge = document.getElementById('dsoDelta');
      if(output) output.textContent = money(released);
      if(badge) badge.textContent = `${delta} days`;
    });

    bindInputGroup(['roiPortfolio','roiImprove','roiCost'], ()=>{
      const portfolio = +(document.getElementById('roiPortfolio') || {}).value || 0;
      const improve = (+(document.getElementById('roiImprove') || {}).value || 0) / 100;
      const cost = +(document.getElementById('roiCost') || {}).value || 0;
      const addCash = portfolio * improve;
      const multiple = cost > 0 ? (addCash / cost) : 0;
      const output = document.getElementById('roiOutput');
      const badge = document.getElementById('roiMultiple');
      if(output) output.textContent = money(addCash);
      if(badge) badge.textContent = `${multiple.toFixed(1)}x`;
    });
  }

  function initCfoCalc(){
    const form = document.getElementById('cfoCalc');
    if(!form || form.dataset.vcxCalcBound === '1') return;
    const fields = Array.from(form.querySelectorAll('input'));
    const out = {
      agency: document.getElementById('calcAgency'),
      pre: document.getElementById('calcPre'),
      lift: document.getElementById('calcLift'),
      pct: document.getElementById('calcLiftPct')
    };
    const recalc = ()=>{
      const principal = +((form.principal || {}).value) || 0;
      const gross = (+((form.gross || {}).value) || 0) / 100;
      const fee = (+((form.fee || {}).value) || 0) / 100;
      const accept = (+((form.accept || {}).value) || 0) / 100;
      const complete = (+((form.complete || {}).value) || 0) / 100;
      const recovery = (+((form.recovery || {}).value) || 0) / 100;
      const setup = +((form.setup || {}).value) || 0;
      const agency = principal * gross * (1 - fee);
      const pre = principal * (accept * complete * recovery) + (principal * (1 - accept * complete)) * (gross * (1 - fee)) - setup;
      const lift = pre - agency;
      const pct = agency ? (lift / agency * 100) : 0;
      if(out.agency) out.agency.textContent = money(agency);
      if(out.pre) out.pre.textContent = money(pre);
      if(out.lift) out.lift.textContent = (lift >= 0 ? '+' : '-') + money(Math.abs(lift));
      if(out.pct) out.pct.textContent = (pct >= 0 ? '+' : '') + pct.toLocaleString(undefined, {maximumFractionDigits:1}) + '%';
    };
    fields.forEach((field)=>{
      field.addEventListener('input', recalc);
      field.addEventListener('change', recalc);
    });
    form.dataset.vcxCalcBound = '1';
    recalc();
  }

  function initAll(){
    initExecutiveTools();
    initCfoCalc();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initAll, {once:true});
  } else {
    initAll();
  }

  document.addEventListener('click', (event)=>{
    const target = event.target;
    if(target instanceof Element && target.closest('.lang-btn')){
      setTimeout(initAll, 30);
    }
  });
})();
