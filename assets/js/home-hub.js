(function(){
  var api = window.DocketMintApi;
  var i18n = window.VCXI18n;
  if(!api){ return; }

  var state = { payload: null };

  function q(selector){ return document.querySelector(selector); }
  function t(key, fallback){
    return i18n ? i18n.t(key, fallback) : (fallback || key);
  }
  function escapeHtml(value){
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  function emptyCard(message){
    return '<div class="empty-copy">' + escapeHtml(message) + '</div>';
  }
  function joinMeta(parts){
    return (parts || []).filter(function(item){
      return !!String(item || '').trim();
    }).join(' | ');
  }
  function formatDate(value){
    if(!value){ return '-'; }
    try { return new Date(value).toLocaleString(); }
    catch (error){ return String(value); }
  }

  function recordAction(item){
    return item && item.route ? item.route : '/app/my-cases/';
  }

  function renderOverview(payload){
    var root = q('[data-hub-overview]');
    if(!root){ return; }
    var environments = (payload && payload.operating_environments) || [];
    if(!environments.length){
      root.innerHTML = emptyCard(t('home_hub.empty.no_environments', 'No operating environments are available yet.'));
      return;
    }
    root.innerHTML = environments.map(function(item){
      return '<article class="dashboard-list-item">' +
        '<div><strong>' + escapeHtml(item.label) + '</strong><p>' + escapeHtml(joinMeta([item.record_count + ' ' + t('home_hub.active_records', 'active records'), item.urgent_count + ' ' + t('home_hub.urgent_items', 'urgent items')])) + '</p></div>' +
        '<div class="inline-actions"><a class="btn btn-secondary btn-sm" href="' + escapeHtml(item.route) + '">' + escapeHtml(t('common.open', 'Open')) + '</a></div>' +
      '</article>';
    }).join('');
  }

  function renderEnvironmentCards(payload){
    var root = q('[data-hub-environments]');
    if(!root){ return; }
    var environments = (payload && payload.operating_environments) || [];
    if(!environments.length){
      root.innerHTML = emptyCard(t('home_hub.empty.switching_unavailable', 'Environment switching is not available yet.'));
      return;
    }
    root.innerHTML = environments.map(function(item){
      var recent = (item.recent_records || []).slice(0, 2);
      var available = item.available !== false;
      var cardClass = 'environment-card' + (item.default ? ' is-default' : '') + (available ? '' : ' is-limited');
      var actionRoute = item.slug === 'legal'
        ? '/app/new-case/?engine=legal'
        : '/app/new-case/?engine=recovery&category=dispute';
      return '<article class="' + cardClass + '">' +
        '<div class="environment-card-head">' +
            '<div>' +
            '<div class="eyebrow">' + escapeHtml(item.default ? t('home_hub.default_environment', 'Default environment') : t('home_hub.operating_environment', 'Operating environment')) + '</div>' +
            '<h3>' + escapeHtml(item.label) + '</h3>' +
          '</div>' +
          '<span class="status-chip ' + (available ? 'is-ready' : 'is-warning') + '">' + escapeHtml(available ? t('common.available', 'Available') : t('common.limited', 'Limited')) + '</span>' +
        '</div>' +
        '<p>' + escapeHtml(item.description || '') + '</p>' +
        '<div class="metric-strip">' +
          '<span class="metric-chip"><strong>' + escapeHtml(item.record_count) + '</strong><span>' + escapeHtml(t('common.records', 'records')) + '</span></span>' +
          '<span class="metric-chip"><strong>' + escapeHtml(item.urgent_count) + '</strong><span>' + escapeHtml(t('common.urgent', 'urgent')) + '</span></span>' +
        '</div>' +
        (recent.length ? '<div class="environment-card-list">' + recent.map(function(record){
          return '<a class="environment-card-row" href="' + escapeHtml(recordAction(record)) + '">' +
            '<strong>' + escapeHtml(record.title || record.id) + '</strong>' +
            '<span>' + escapeHtml(joinMeta([record.current_stage || record.status, record.next_action || record.environment_label])) + '</span>' +
          '</a>';
        }).join('') + '</div>' : '<div class="empty-copy">' + escapeHtml(t('home_hub.no_recent_environment_records', 'No recent records in this environment.')) + '</div>') +
        '<div class="inline-actions">' +
          '<a class="btn btn-primary" href="' + escapeHtml(item.route) + '">' + escapeHtml(t('common.open', 'Open')) + ' ' + escapeHtml(item.label) + '</a>' +
          (available ? '<a class="btn btn-secondary" href="' + escapeHtml(actionRoute) + '">New ' + escapeHtml(item.slug === 'legal' ? 'legal matter' : 'recovery record') + '</a>' : '') +
        '</div>' +
      '</article>';
    }).join('');
  }

  function renderQuickActions(payload){
    var root = q('[data-hub-quick-actions]');
    if(!root){ return; }
    var items = (payload && payload.quick_actions) || [];
    if(!items.length){
      root.innerHTML = emptyCard(t('home_hub.empty.quick_actions', 'No quick actions are available yet.'));
      return;
    }
    root.innerHTML = items.map(function(item){
      return '<article class="dashboard-list-item">' +
        '<div><strong>' + escapeHtml(item.label) + '</strong><p>' + escapeHtml(item.description || '') + '</p></div>' +
        '<div class="inline-actions"><a class="btn btn-secondary btn-sm" href="' + escapeHtml(item.route) + '">' + escapeHtml(t('common.open', 'Open')) + '</a></div>' +
      '</article>';
    }).join('');
  }

  function renderUrgent(payload){
    var root = q('[data-hub-urgent]');
    if(!root){ return; }
    var items = [];
    ((payload && payload.urgent_deadlines) || []).forEach(function(item){
      items.push({
        title: item.case_title,
        description: joinMeta([item.label || t('common.deadline', 'Deadline'), item.date || t('common.review_now', 'Review now')]),
        route: item.route
      });
    });
    ((payload && payload.recommended_actions) || []).forEach(function(item){
      items.push({
        title: item.label,
        description: item.description,
        route: item.route
      });
    });
    items = items.slice(0, 5);
    if(!items.length){
      root.innerHTML = emptyCard(t('home_hub.empty.urgent', 'No urgent items are surfaced right now.'));
      return;
    }
    root.innerHTML = items.map(function(item){
      return '<article class="dashboard-list-item">' +
        '<div><strong>' + escapeHtml(item.title) + '</strong><p>' + escapeHtml(item.description || '') + '</p></div>' +
        '<div class="inline-actions"><a class="btn btn-secondary btn-sm" href="' + escapeHtml(item.route) + '">' + escapeHtml(t('common.review', 'Review')) + '</a></div>' +
      '</article>';
    }).join('');
  }

  function renderRecords(payload){
    var root = q('[data-hub-records]');
    if(!root){ return; }
    var items = ((payload && payload.recent_cases) || []).slice(0, 6);
    if(!items.length){
      root.innerHTML = emptyCard(t('home_hub.empty.records', 'No shared records exist yet.'));
      return;
    }
    root.innerHTML = items.map(function(item){
      return '<article class="dashboard-list-item">' +
        '<div><strong>' + escapeHtml(item.title) + '</strong><p>' + escapeHtml(joinMeta([item.environment_label || item.environment_tag, item.current_stage || item.status, item.next_action || t('home_hub.record_open', 'Open the record')])) + '</p></div>' +
        '<div class="inline-actions"><a class="btn btn-secondary btn-sm" href="' + escapeHtml(recordAction(item)) + '">' + escapeHtml(t('common.open', 'Open')) + '</a></div>' +
      '</article>';
    }).join('');
  }

  function renderActivity(payload){
    var root = q('[data-hub-activity]');
    if(!root){ return; }
    var items = [];
    ((payload && payload.recent_cases) || []).forEach(function(item){
      items.push({
        title: item.title,
        description: joinMeta([item.environment_label || item.environment_tag, item.current_stage || item.status, item.next_action || t('home_hub.record_updated', 'Record updated')]),
        route: recordAction(item),
        updatedAt: item.updated_at
      });
    });
    ((payload && payload.recent_downloads) || []).forEach(function(item){
      items.push({
        title: item.title,
        description: joinMeta([t('common.output', 'Output'), item.context || item.service_label || item.service_slug || t('home_hub.recent_file', 'Recent file')]),
        route: item.route,
        updatedAt: item.updated_at
      });
    });
    items.sort(function(a, b){
      return (new Date(b.updatedAt || 0)).getTime() - (new Date(a.updatedAt || 0)).getTime();
    });
    items = items.slice(0, 5);
    if(!items.length){
      root.innerHTML = emptyCard(t('home_hub.empty.activity', 'No recent activity is visible yet.'));
      return;
    }
    root.innerHTML = items.map(function(item){
      return '<article class="dashboard-list-item">' +
        '<div><strong>' + escapeHtml(item.title) + '</strong><p>' + escapeHtml(joinMeta([item.description, formatDate(item.updatedAt)])) + '</p></div>' +
        '<div class="inline-actions"><a class="btn btn-secondary btn-sm" href="' + escapeHtml(item.route) + '">' + escapeHtml(t('common.open', 'Open')) + '</a></div>' +
      '</article>';
    }).join('');
  }

  function renderCommercial(payload){
    var root = q('[data-hub-commercial]');
    if(!root){ return; }
    var commercial = (payload && payload.commercial) || {};
    if(!commercial.plan_code){
      root.innerHTML = emptyCard(t('home_hub.empty.commercial', 'Plan visibility is not available yet.'));
      return;
    }
    var usage = commercial.usage || {};
    var entitlements = commercial.entitlements || {};
    root.innerHTML =
      '<article class="dashboard-card dashboard-card-featured">' +
        '<div class="dashboard-card-copy">' +
          '<div class="eyebrow">' + escapeHtml(t('common.current_plan', 'Current plan')) + '</div>' +
          '<h3>' + escapeHtml(commercial.plan_label || commercial.plan_code) + '</h3>' +
          '<p>' + escapeHtml(commercial.value_message || t('home_hub.plan_value_fallback', 'Workspace pricing and entitlements are available in Settings.')) + '</p>' +
          '<p>' + escapeHtml(joinMeta([t('home_hub.active_matters', 'Active matters') + ': ' + (usage.active_matters || 0), t('home_hub.generated_packets', 'Generated packets') + ': ' + (usage.generated_packets || 0), t('home_hub.seat_limit', 'Seat limit') + ': ' + (entitlements.seat_limit || 1)])) + '</p>' +
        '</div>' +
        '<div class="inline-actions"><a class="btn btn-secondary" href="/app/settings/">' + escapeHtml(t('home_hub.open_settings', 'Open settings')) + '</a></div>' +
      '</article>';
  }

  function render(payload){
    state.payload = payload || {};
    renderOverview(payload);
    renderEnvironmentCards(payload);
    renderQuickActions(payload);
    renderUrgent(payload);
    renderRecords(payload);
    renderActivity(payload);
    renderCommercial(payload);
  }

  async function boot(){
    try {
      if(typeof api.ensureValidActiveCaseId === 'function'){
        await api.ensureValidActiveCaseId();
      }
      render(await api.getPlatformDashboard());
    } catch (error){
      var banner = q('[data-home-error]');
      if(banner){
        banner.hidden = false;
        banner.textContent = error.message || t('home_hub.load_failed', 'Could not load the DocketMint home screen.');
      }
    }
  }

  document.addEventListener('vcx:i18n:change', function(){
    if(state.payload){ render(state.payload); }
  });

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
