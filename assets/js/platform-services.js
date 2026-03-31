(function(){
  var api = window.DocketMintApi;
  var i18n = window.VCXI18n;
  if(!api){ return; }
  var state = { primaryNavigation: [] };
  var FALLBACK_PRIMARY_NAV = [
    { slug: 'home', label: 'Home', label_key: 'nav.primary.home', route: '/app/home/', order: 1 },
    { slug: 'legal', label: 'Legal', label_key: 'nav.primary.legal', route: '/app/legal/', order: 2, environment: 'legal' },
    { slug: 'recovery', label: 'Recovery', label_key: 'nav.primary.recovery', route: '/app/recovery/', order: 3, environment: 'recovery' },
    { slug: 'calendar', label: 'Calendar', label_key: 'nav.primary.calendar', route: '/app/action-center/', order: 4 },
    { slug: 'document_prep', label: 'Document Prep', label_key: 'nav.primary.document_prep', route: '/app/workspace/', order: 5 },
    { slug: 'my_cases', label: 'Matters', label_key: 'nav.primary.my_cases', route: '/app/my-cases/', order: 6 },
    { slug: 'downloads', label: 'Outputs', label_key: 'nav.primary.downloads', route: '/app/downloads/', order: 7 },
    { slug: 'settings', label: 'Settings', label_key: 'nav.primary.settings', route: '/app/settings/', order: 8 }
  ];

  function q(selector){ return document.querySelector(selector); }
  function t(key, fallback){
    return i18n ? i18n.t(key, fallback) : (fallback || key);
  }
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
      if(caseId && /\/app\/(?:action-center|downloads|workspace|calendar|document-prep)\/?$/i.test(url.pathname)){
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
  function availableEnvironments(){
    var auth = window.DocketMintAuth || {};
    var environments = auth.environments || {};
    var available = Array.isArray(environments.available) ? environments.available.slice() : [];
    if(available.length){ return available; }
    var fromBody = (document.body && document.body.getAttribute('data-environment-access')) || '';
    available = fromBody.split(',').map(function(item){ return String(item || '').trim().toLowerCase(); }).filter(Boolean);
    return available.length ? available : ['legal', 'recovery'];
  }
  function filteredPrimaryNavigation(items){
    var available = availableEnvironments();
    return (items || []).filter(function(item){
      return !item.environment || available.indexOf(String(item.environment || '').toLowerCase()) !== -1;
    });
  }
  function primaryLabel(item){
    return t(item && item.label_key, (item && item.label) || '');
  }
  function effectivePrimaryNavigation(items){
    var source = (items && items.length) ? items : FALLBACK_PRIMARY_NAV;
    return filteredPrimaryNavigation(source);
  }
  function renderPrimaryNavigation(items){
    var root = q('.sidebar-nav');
    if(!root){ return; }
    root.innerHTML = effectivePrimaryNavigation(items).map(function(item){
      return '<a class="' + (isActive(item.route) ? 'active' : '') + '" href="' + escapeHtml(primaryHref(item)) + '">' +
        '<span>' + escapeHtml(primaryLabel(item)) + '</span>' +
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
    state.payload = payload || {};
    var services = (payload && payload.services) || [];
    var recommended = services.filter(function(item){ return item.relationship === 'recommended'; });
    var related = services.filter(function(item){ return item.relationship === 'related'; });
    var available = services.filter(function(item){ return item.relationship !== 'recommended' && item.relationship !== 'related'; });

    var html = '';
    html += renderServiceSection(t('service_rail.recommended', 'Recommended for this matter'), recommended, t('service_rail.badge.recommended', 'Recommended'), 'service-nav-group--recommended');
    html += renderServiceSection(t('service_rail.related', 'Related workflows'), related, t('service_rail.badge.related', 'Related'), 'service-nav-group--related');
    html += renderServiceSection(t('service_rail.available', 'Available workflows'), available, t('service_rail.badge.optional', 'Optional'), 'service-nav-group--available');
    root.innerHTML = html || '<div class="service-nav-empty">' + escapeHtml(t('service_rail.empty', 'No live recovery workflows are matched to this matter yet.')) + '</div>';
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
      state.primaryNavigation = payload.primary_navigation || [];
      renderPrimaryNavigation(state.primaryNavigation);
      renderServiceRail(payload);
      renderSummary(payload);
    } catch (error){
      state.primaryNavigation = [];
      renderPrimaryNavigation(FALLBACK_PRIMARY_NAV);
      var root = q('[data-services-sidebar]');
      if(root){
        root.innerHTML = '<div class="service-nav-empty">' + escapeHtml(error && error.message ? error.message : t('service_rail.load_failed', 'Could not load services.')) + '</div>';
      }
    }
  }

  document.addEventListener('vcx:i18n:change', function(){
    renderPrimaryNavigation(state.primaryNavigation);
    renderServiceRail(state.payload);
  });
  window.addEventListener('docketmint:session', function(){
    renderPrimaryNavigation(state.primaryNavigation);
  });

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
