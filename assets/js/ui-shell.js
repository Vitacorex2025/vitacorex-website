
(function(){
  if(window.__vcxUiShellV210) return;
  window.__vcxUiShellV210 = true;

  const menuBtn = document.querySelector('.vcx-menu-btn');
  const mobileNav = document.getElementById('vcxMobileNav');
  const mq = window.matchMedia('(max-width: 900px)');

  if(!menuBtn || !mobileNav) return;

  function setOpen(open){
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    mobileNav.hidden = !open;
    document.documentElement.classList.toggle('vcx-mobile-menu-open', open);
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
})();
