(function(){
  var i18n = window.VCXI18n;
  function q(selector){ return document.querySelector(selector); }
  function t(key, fallback){
    return i18n ? i18n.t(key, fallback) : (fallback || key);
  }
  function normalizePath(value){
    return String(value || '').replace(/\/+$/, '/') || '/';
  }
  function currentPath(){
    try { return normalizePath(window.location.pathname || '/'); }
    catch (error){ return '/'; }
  }
  function activeCaseId(){
    try {
      var params = new URLSearchParams(window.location.search || '');
      var explicit = params.get('case') || '';
      if(explicit){ return explicit; }
    } catch (error){}
    try {
      if(window.DocketMintApi && typeof window.DocketMintApi.getActiveCaseId === 'function'){
        return window.DocketMintApi.getActiveCaseId() || '';
      }
    } catch (error){}
    return '';
  }
  function navHref(basePath){
    var href = basePath;
    var caseId = activeCaseId();
    if(caseId && /\/app\/(?:action-center|workspace|downloads)\/?$/i.test(basePath)){
      href += (basePath.indexOf('?') >= 0 ? '&' : '?') + 'case=' + encodeURIComponent(caseId);
    }
    return href;
  }
  function setOverlay(open){
    var overlay = q('[data-app-overlay]');
    if(!overlay){ return; }
    overlay.hidden = !open;
  }
  function closeSidebar(){
    document.body.classList.remove('sidebar-open');
    setOverlay(false);
  }
  function openSidebar(){
    document.body.classList.add('sidebar-open');
    setOverlay(true);
  }
  function normalizeToggle(){
    var button = q('[data-sidebar-toggle]');
    if(!button){ return; }
    if(button.querySelector('span')){ return; }
    button.textContent = '';
    button.appendChild(document.createElement('span'));
    button.appendChild(document.createElement('span'));
    button.appendChild(document.createElement('span'));
  }
  function injectMobileNav(){
    var main = q('.app-main');
    if(!main){ return; }
    if(q('[data-mobile-bottom-nav]')){ return; }
    if(currentPath() === '/app/action-center/'){ return; }
    var environmentAccess = (window.DocketMintAuth && window.DocketMintAuth.environments && window.DocketMintAuth.environments.available) || ['recovery'];
    var items = [{ label: t('nav.primary.home', 'Home'), path: '/app/home/' }];
    if(environmentAccess.indexOf('legal') !== -1){
      items.push({ label: t('nav.primary.legal', 'Legal'), path: '/app/legal/' });
    }
    if(environmentAccess.indexOf('recovery') !== -1){
      items.push({ label: t('nav.primary.recovery', 'Recovery'), path: '/app/recovery/' });
    }
    items = items.concat([
      { label: t('nav.primary.my_cases', 'Matters'), path: '/app/my-cases/' },
      { label: t('nav.primary.settings', 'Settings'), path: '/app/settings/' }
    ]).slice(0, 5);
    var current = currentPath();
    var nav = document.createElement('nav');
    nav.className = 'mobile-bottom-nav';
    nav.setAttribute('aria-label', t('shell.mobile_navigation', 'Mobile navigation'));
    nav.setAttribute('data-mobile-bottom-nav', '');
    nav.innerHTML = items.map(function(item){
      var itemPath = normalizePath(item.path);
      var active = current === itemPath;
      if(current === '/app/settings-support/' && itemPath === '/app/settings/'){
        active = true;
      }
      if(current === '/app/workspace/' && itemPath === '/app/my-cases/'){
        active = true;
      }
      if(current === '/app/action-center/' && itemPath === '/app/my-cases/'){
        active = true;
      }
      return '<a class="mobile-bottom-nav-link' + (active ? ' active' : '') + '" href="' + navHref(item.path) + '">' +
        '<span>' + item.label + '</span>' +
      '</a>';
    }).join('');
    main.appendChild(nav);
  }
  function bindToggle(){
    var brand = q('.sidebar-brand');
    var sidebar = q('[data-app-sidebar]');
    if(brand){ brand.setAttribute('href', '/app/home/'); }
    normalizeToggle();
    injectMobileNav();
    var button = q('[data-sidebar-toggle]');
    var overlay = q('[data-app-overlay]');
    if(button){
      button.addEventListener('click', function(){
        if(document.body.classList.contains('sidebar-open')){
          closeSidebar();
          return;
        }
        openSidebar();
      });
    }
    if(overlay){
      overlay.addEventListener('click', closeSidebar);
    }
    if(sidebar){
      sidebar.addEventListener('click', function(event){
        if(window.innerWidth > 1120){ return; }
        var target = event.target && event.target.closest ? event.target.closest('a[href]') : null;
        if(!target){ return; }
        window.setTimeout(closeSidebar, 0);
      });
    }
    document.addEventListener('keydown', function(event){
      if(event.key === 'Escape'){ closeSidebar(); }
    });
    window.addEventListener('resize', function(){
      if(window.innerWidth > 1120){ closeSidebar(); }
    });
    document.addEventListener('vcx:i18n:change', function(){
      var existing = q('[data-mobile-bottom-nav]');
      if(existing){ existing.remove(); }
      injectMobileNav();
    });
  }
  async function bootShell(){
    try {
      if(window.DocketMintApi && typeof window.DocketMintApi.ensureValidActiveCaseId === 'function'){
        await window.DocketMintApi.ensureValidActiveCaseId();
      }
    } catch (error){}
    bindToggle();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){ bootShell().catch(function(){}); });
  } else {
    bootShell().catch(function(){});
  }
})();
