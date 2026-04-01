(function(){
  var api = window.DocketMintApi;
  var i18n = window.VCXI18n;
  if(!api){ return; }

  var state = { payload: null, error: '' };

  function q(selector){ return document.querySelector(selector); }
  function params(){
    try { return new URLSearchParams(window.location.search || ''); }
    catch (error){ return new URLSearchParams(''); }
  }
  function t(key, fallback){ return i18n ? i18n.t(key, fallback) : (fallback || key); }
  function escapeHtml(value){
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  function activeCaseId(){
    var explicit = params().get('case') || '';
    if(explicit){ return explicit; }
    return api.getActiveCaseId ? (api.getActiveCaseId() || '') : '';
  }
  function serviceHref(item){
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

  function stageMeta(stage){
    var normalized = String(stage || 'build').toLowerCase();
    if(normalized === 'upload'){
      return {
        key: 'upload',
        label: t('workflow.stage.upload', 'Start'),
        summary: t('services.stage.upload.summary', 'Upload files and open the recovery matter.'),
        order: 1
      };
    }
    if(normalized === 'diagnose'){
      return {
        key: 'diagnose',
        label: t('workflow.stage.diagnose', 'Diagnose'),
        summary: t('services.stage.diagnose.summary', 'See blockers, evidence gaps, and readiness before generation.'),
        order: 2
      };
    }
    return {
      key: 'build',
      label: t('workflow.stage.build', 'Build'),
      summary: t('services.stage.build.summary', 'Build the next practical step once the matter is ready.'),
      order: 3
    };
  }

  function groupServices(items){
    var grouped = {};
    (items || []).forEach(function(item){
      var stage = stageMeta(item.funnel_stage);
      if(!grouped[stage.key]){
        grouped[stage.key] = { stage: stage, items: [] };
      }
      grouped[stage.key].items.push(item);
    });
    return Object.keys(grouped).map(function(key){
      var group = grouped[key];
      group.items.sort(function(a, b){
        return Number(a.public_order || 999) - Number(b.public_order || 999);
      });
      return group;
    }).sort(function(a, b){
      return Number(a.stage.order || 99) - Number(b.stage.order || 99);
    });
  }

  function render(){
    var payload = state.payload || {};
    var root = q('[data-services-catalog]');
    if(!root){ return; }
    var groups = groupServices(payload.services || []);
    if(state.error && !groups.length){
      root.innerHTML = '<div class="contact-card"><strong>' + escapeHtml(t('services.catalog_unavailable_title', 'Recovery workflows are temporarily unavailable')) + '</strong><span>' + escapeHtml(state.error || t('services.catalog_unavailable_copy', 'Refresh the page or return home while the catalog reconnects.')) + '</span></div>';
      return;
    }
    if(!groups.length){
      root.innerHTML = '<div class="empty-copy">' + escapeHtml(t('services.empty', 'No recovery workflows are available.')) + '</div>';
      return;
    }
    root.innerHTML = groups.map(function(group){
      return '<section class="service-stage-block">' +
        '<div class="subsection-header subsection-header--tight">' +
          '<div><div class="eyebrow">' + escapeHtml(t('services.funnel_eyebrow', 'Recovery funnel')) + '</div><h2>' + escapeHtml(group.stage.label) + '</h2><p class="service-stage-summary">' + escapeHtml(group.stage.summary) + '</p></div>' +
        '</div>' +
        '<div class="service-catalog-grid">' +
          group.items.map(function(item){
            var features = [];
            var href = serviceHref(item);
            features.push(item.funnel_stage_label || group.stage.label);
            features.push(item.entry_mode === 'standalone_session'
              ? t('services.mode.internal_module', 'Internal module')
              : (item.entry_mode === 'global_utility'
                ? t('services.mode.utility', 'Utility')
                : t('services.mode.case_bound_record', 'Recovery matter')));
            if(item.upload_supported){ features.push(t('services.feature.upload', 'Upload supported')); }
            if(item.output_supported){ features.push(t('services.feature.output', 'Output supported')); }
            return '<article class="service-card-compact is-tappable" data-service-route="' + escapeHtml(href) + '" tabindex="0" role="link">' +
              '<div class="eyebrow">' + escapeHtml(item.funnel_stage_label || group.stage.label) + '</div>' +
              '<div class="inline-actions"><span class="service-nav-badge badge-' + escapeHtml(item.status_code || 'ready') + '">' + escapeHtml(t(item.status_key, item.status_label)) + '</span></div>' +
              '<h3>' + escapeHtml(t(item.name_key, item.public_label || item.name)) + '</h3>' +
              '<p>' + escapeHtml(t(item.description_key, item.description)) + '</p>' +
              '<div class="tag-list">' + features.map(function(tag){ return '<span>' + escapeHtml(tag) + '</span>'; }).join('') + '</div>' +
              '<div class="inline-actions"><a class="btn btn-secondary btn-sm" href="' + escapeHtml(href) + '">' + escapeHtml(t('services.action.open', 'Open')) + '</a></div>' +
            '</article>';
          }).join('') +
        '</div>' +
      '</section>';
    }).join('');

  }

  function bindCardLinks(){
    var root = q('[data-services-catalog]');
    if(!root || root._boundCardLinks){ return; }
    root._boundCardLinks = true;
    root.addEventListener('click', function(event){
      var card = event.target.closest('[data-service-route]');
      if(!card){ return; }
      if(event.target.closest('a, button, input, select, textarea')){ return; }
      window.location.href = card.getAttribute('data-service-route') || '/app/services/';
    });
    root.addEventListener('keydown', function(event){
      var card = event.target.closest('[data-service-route]');
      if(!card){ return; }
      if(event.key !== 'Enter' && event.key !== ' '){ return; }
      event.preventDefault();
      window.location.href = card.getAttribute('data-service-route') || '/app/services/';
    });
  }

  async function boot(){
    try {
      if(typeof api.ensureValidActiveCaseId === 'function'){
        await api.ensureValidActiveCaseId();
      }
      state.payload = await api.getPlatformServices(api.getActiveCaseId ? (api.getActiveCaseId() || '') : '');
      state.error = '';
      render();
      bindCardLinks();
    } catch (error){
      state.payload = null;
      state.error = error.message || t('services.error.load', 'Could not load the service catalog.');
      render();
      var banner = q('[data-services-error]');
      if(banner){
        banner.hidden = false;
        banner.textContent = state.error;
      }
    }
  }

  document.addEventListener('vcx:i18n:change', render);

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
