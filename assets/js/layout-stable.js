
(function(){
  if(window.__vcxStableLayoutV209) return;
  window.__vcxStableLayoutV209 = true;

  const header = document.querySelector('.site-header');
  const mobileNav = document.querySelector('.mobile-nav');
  const oldMenuBtn = document.querySelector('.menu-btn');
  if(!header || !mobileNav || !oldMenuBtn) return;

  const menuBtn = oldMenuBtn.cloneNode(true);
  oldMenuBtn.parentNode.replaceChild(menuBtn, oldMenuBtn);

  menuBtn.setAttribute('aria-expanded', 'false');
  mobileNav.setAttribute('aria-hidden', 'true');

  const DESKTOP_BREAKPOINT = 900;

  function isMobile(){
    return window.innerWidth <= DESKTOP_BREAKPOINT;
  }

  function closeMenu(){
    mobileNav.classList.remove('open');
    header.classList.remove('nav-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
  }

  function openMenu(){
    mobileNav.classList.add('open');
    header.classList.add('nav-open');
    menuBtn.setAttribute('aria-expanded', 'true');
    mobileNav.setAttribute('aria-hidden', 'false');
  }

  function toggleMenu(event){
    if(event) event.preventDefault();
    if(!isMobile()) return;
    if(mobileNav.classList.contains('open')) closeMenu();
    else openMenu();
  }

  function syncLayoutState(){
    header.classList.remove('header-hidden', 'header-hidden-ios');
    if(!isMobile()){
      closeMenu();
    }
  }

  menuBtn.addEventListener('click', toggleMenu, {passive:false});

  mobileNav.querySelectorAll('a').forEach((link)=>{
    link.addEventListener('click', ()=>closeMenu());
  });

  document.addEventListener('click', (event)=>{
    if(!isMobile()) return;
    const target = event.target;
    if(!(target instanceof Element)) return;
    if(target.closest('.mobile-header-toggle') || target.closest('.mobile-nav')) return;
    closeMenu();
  });

  document.addEventListener('keydown', (event)=>{
    if(event.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', syncLayoutState, {passive:true});
  window.addEventListener('orientationchange', syncLayoutState, {passive:true});
  window.addEventListener('scroll', ()=>{
    header.classList.remove('header-hidden', 'header-hidden-ios');
  }, {passive:true});

  syncLayoutState();
})();
