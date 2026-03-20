(function(){
  var api = window.DocketMintApi;
  if(!api){ return; }

  function q(selector){ return document.querySelector(selector); }
  function params(){
    try { return new URLSearchParams(window.location.search || ''); }
    catch (error){ return new URLSearchParams(''); }
  }
  function activeCaseId(){
    var explicit = params().get('case') || '';
    if(explicit){ return explicit; }
    if(typeof api.getActiveCaseId === 'function'){
      return api.getActiveCaseId() || '';
    }
    return '';
  }
  function escapeHtml(value){
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  function normalizePath(value){
    return String(value || '').replace(/\/+$/, '/') || '/';
  }
  function currentPath(){
    try { return normalizePath(window.location.pathname || '/'); }
    catch (error){ return '/'; }
  }
  function routeHref(item){
    var caseId = activeCaseId();
    if(!caseId && item && item.entry_mode === 'case_bound'){
      return '/app/case-intake/?workflow=' + encodeURIComponent(item.slug || 'recovery_diagnostic');
    }
    try {
      var url = new URL(item.route, window.location.origin);
      if(caseId && item.entry_mode === 'case_bound'){
        url.searchParams.set('case', caseId);
      }
      return url.pathname + url.search + url.hash;
    } catch (error){
      return item.route;
    }
  }
  function primaryHref(item){
    try {
      var url = new URL(item.route, window.location.origin);
      var caseId = activeCaseId();
      if(caseId && /\/app\/(?:action-center|downloads|workspace)\/?$/i.test(url.pathname)){
        url.searchParams.set('case', caseId);
      }
      return url.pathname + url.search + url.hash;
    } catch (error){
      return item.route;
    }
  }
  function isActive(route){
    try {
      return normalizePath(new URL(route, window.location.origin).pathname) === currentPath();
    } catch (error){
      return normalizePath(route) === currentPath();
    }
  }
  function renderPrimaryNavigation(items){
    var root = q('.sidebar-nav');
    if(!root){ return; }
    root.innerHTML = (items || []).map(function(item){
      return '<a class="' + (isActive(item.route) ? 'active' : '') + '" href="' + escapeHtml(primaryHref(item)) + '">' +
        '<span>' + escapeHtml(item.label) + '</span>' +
      '</a>';
    }).join('');
  }
  function renderServiceLink(item, forcedBadge){
    var helper = item.next_action || item.description || '';
    var meta = item.category ? (item.category + ' | ' + helper) : helper;
    var badgeLabel = forcedBadge || item.status_label || 'Ready';
    var badgeCode = forcedBadge ? forcedBadge.toLowerCase().replace(/\s+/g, '_') : (item.status_code || 'ready');
    var relationshipClass = item.relationship === 'recommended' || forcedBadge === 'Recommended' ? ' service-nav-link-recommended' : '';
    return '<a class="service-nav-link' + relationshipClass + (isActive(item.route) ? ' active' : '') + '" href="' + escapeHtml(routeHref(item)) + '">' +
      '<span class="service-nav-icon" aria-hidden="true"></span>' +
      '<span class="service-nav-copy"><strong>' + escapeHtml(item.public_label || item.name) + '</strong><small>' + escapeHtml(meta) + '</small></span>' +
      '<span class="service-nav-badge badge-' + escapeHtml(badgeCode) + '">' + escapeHtml(badgeLabel) + '</span>' +
    '</a>';
  }
  function renderServiceSection(title, items, forcedBadge, extraClass){
    if(!items || !items.length){ return ''; }
    return '<section class="service-nav-group' + (extraClass ? (' ' + extraClass) : '') + '">' +
      '<div class="service-nav-title">' + escapeHtml(title) + '</div>' +
      items.map(function(item){ return renderServiceLink(item, forcedBadge); }).join('') +
    '</section>';
  }
  function renderServiceRail(payload){
    var root = q('[data-services-sidebar]');
    if(!root){ return; }
    var services = (payload && payload.services) || [];
    var recommended = services.filter(function(item){ return item.relationship === 'recommended'; });
    var related = services.filter(function(item){ return item.relationship === 'related'; });
    var available = services.filter(function(item){ return item.relationship !== 'recommended' && item.relationship !== 'related'; });

    var html = '';
    html += renderServiceSection('Recommended for this matter', recommended, 'Recommended', 'service-nav-group--recommended');
    html += renderServiceSection('Related workflows', related, 'Related', 'service-nav-group--related');
    html += renderServiceSection('Available workflows', available, 'Optional', 'service-nav-group--available');
    root.innerHTML = html || '<div class="service-nav-empty">No live recovery workflows are matched to this matter yet.</div>';
  }
  function renderSummary(payload){
    var heading = q('[data-platform-headline]');
    var title = q('[data-page-heading]');
    if(!heading && !title){ return; }
    var services = (payload && payload.services) || [];
    var active = null;
    services.some(function(item){
      if(isActive(item.route)){
        active = item;
        return true;
      }
      return false;
    });
    if(!active){ return; }
    if(title && !title.getAttribute('data-i18n')){ title.textContent = active.public_label || active.name; }
    if(heading && !heading.getAttribute('data-i18n')){ heading.textContent = active.description; }
  }
  async function boot(){
    try {
      if(typeof api.ensureValidActiveCaseId === 'function'){
        await api.ensureValidActiveCaseId();
      }
      var payload = await api.getPlatformServices(activeCaseId() || '');
      renderPrimaryNavigation(payload.primary_navigation || []);
      renderServiceRail(payload);
      renderSummary(payload);
    } catch (error){
      var root = q('[data-services-sidebar]');
      if(root){
        root.innerHTML = '<div class="service-nav-empty">' + escapeHtml(error && error.message ? error.message : 'Could not load services.') + '</div>';
      }
    }
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
