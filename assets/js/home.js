(function(){
  var api = window.DocketMintApi;
  if(!api){ return; }

  var state = { payload: null };

  function q(selector){ return document.querySelector(selector); }
  function workflowHref(item){
    var caseId = api.getActiveCaseId ? (api.getActiveCaseId() || '') : '';
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
      return item.route || '/app/new-case/?category=dispute';
    }
  }
  function escapeHtml(value){
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  function formatDate(value){
    if(!value){ return '-'; }
    try { return new Date(value).toLocaleString(); }
    catch (error){ return String(value); }
  }
  function emptyCard(message){
    return '<div class="empty-copy">' + escapeHtml(message) + '</div>';
  }
  function joinMeta(parts){
    return (parts || []).filter(function(item){
      return !!String(item || '').trim();
    }).join(' | ');
  }

  function renderContinue(payload){
    var root = q('[data-home-continue]');
    if(!root){ return; }
    var item = payload && payload.continue_item;
    if(!item){
      root.innerHTML = emptyCard('Start with Recovery Diagnostic to build a review-ready next-action queue.');
      return;
    }
    root.innerHTML =
      '<article class="dashboard-card dashboard-card-featured">' +
        '<div class="dashboard-card-copy">' +
          '<div class="eyebrow">' + escapeHtml(item.kind === 'case' ? 'Continue matter' : 'Continue session') + '</div>' +
          '<h3>' + escapeHtml(item.title || item.id) + '</h3>' +
          '<p>' + escapeHtml(item.next_action || 'Open the next step and continue from where you left off.') + '</p>' +
        '</div>' +
        '<div class="inline-actions">' +
          '<a class="btn btn-primary" href="' + escapeHtml(item.route) + '">Continue</a>' +
          (item.workspace_route ? '<a class="btn btn-secondary" href="' + escapeHtml(item.workspace_route) + '">Open workspace</a>' : '') +
        '</div>' +
      '</article>';
  }

  function renderRecentCases(payload){
    var root = q('[data-home-recent-cases]');
    if(!root){ return; }
    var items = ((payload && payload.recent_cases) || []).slice(0, 3);
    if(!items.length){
      root.innerHTML = emptyCard('No recent recovery matters yet.');
      return;
    }
    root.innerHTML = items.map(function(item){
      return '<article class="dashboard-list-item">' +
        '<div><strong>' + escapeHtml(item.title) + '</strong><p>' + escapeHtml(joinMeta([item.issue_category || 'matter', item.next_action || 'Review the matter'])) + '</p></div>' +
        '<div class="inline-actions"><a class="btn btn-secondary btn-sm" href="' + escapeHtml(item.route) + '">Open</a></div>' +
      '</article>';
    }).join('');
  }

  function renderUrgentDeadlines(payload){
    var root = q('[data-urgent-deadlines]');
    if(!root){ return; }
    var items = ((payload && payload.urgent_deadlines) || []).slice(0, 3);
    if(!items.length){
      root.innerHTML = emptyCard('No urgent deadlines detected yet.');
      return;
    }
    root.innerHTML = items.map(function(item){
      return '<article class="dashboard-list-item">' +
        '<div><strong>' + escapeHtml(item.case_title) + '</strong><p>' + escapeHtml(joinMeta([item.label || 'Deadline', item.date || 'Review now'])) + '</p></div>' +
        '<div class="inline-actions"><a class="btn btn-secondary btn-sm" href="' + escapeHtml(item.route) + '">Review</a></div>' +
      '</article>';
    }).join('');
  }

  function renderRecentSessions(payload){
    var root = q('[data-home-recent-sessions]');
    if(!root){ return; }
    var items = (payload && payload.recent_sessions) || [];
    if(!items.length){
      root.innerHTML = emptyCard('No standalone workflow sessions yet.');
      return;
    }
    root.innerHTML = items.map(function(item){
      return '<article class="dashboard-list-item">' +
        '<div><strong>' + escapeHtml(item.service_label || item.title) + '</strong><p>' + escapeHtml(joinMeta([item.title, item.status])) + '</p></div>' +
        '<div class="inline-actions"><a class="btn btn-secondary btn-sm" href="' + escapeHtml(item.route) + '">Open</a></div>' +
      '</article>';
    }).join('');
  }

  function renderActions(payload){
    var root = q('[data-home-actions]');
    if(!root){ return; }
    var items = (payload && payload.recommended_actions) || [];
    if(!items.length){
      root.innerHTML = emptyCard('No recommended actions right now.');
      return;
    }
    root.innerHTML = items.map(function(item){
      return '<article class="dashboard-list-item">' +
        '<div><strong>' + escapeHtml(item.label) + '</strong><p>' + escapeHtml(item.description || '') + '</p></div>' +
        '<div class="inline-actions"><a class="btn btn-secondary btn-sm" href="' + escapeHtml(item.route) + '">Open</a></div>' +
      '</article>';
    }).join('');
  }

  function renderDownloads(payload){
    var root = q('[data-home-downloads]');
    if(!root){ return; }
    var items = (payload && payload.recent_downloads) || [];
    if(!items.length){
      root.innerHTML = emptyCard('No recent outputs yet.');
      return;
    }
    root.innerHTML = items.map(function(item){
      var href = item.download_url ? api.toDownloadUrl(item.download_url) : item.route;
      return '<article class="dashboard-list-item">' +
        '<div><strong>' + escapeHtml(item.title) + '</strong><p>' + escapeHtml(joinMeta([item.service_label || item.service_slug || 'output', item.context || '', formatDate(item.updated_at)])) + '</p></div>' +
        '<div class="inline-actions"><a class="btn btn-secondary btn-sm" href="' + escapeHtml(href) + '">Open</a></div>' +
      '</article>';
    }).join('');
  }

  function renderPopular(payload){
    var root = q('[data-home-popular]');
    if(!root){ return; }
    var items = ((payload && payload.popular_workflows) || []).slice(0, 3);
    if(!items.length){
      root.innerHTML = emptyCard('No recovery workflows are pinned yet.');
      return;
    }
    root.innerHTML = items.map(function(item){
      var href = workflowHref(item);
      return '<a class="service-card-compact is-tappable" href="' + escapeHtml(href) + '">' +
        '<div class="eyebrow">' + escapeHtml(item.funnel_stage_label || item.category || 'Workflow') + '</div>' +
        '<h3>' + escapeHtml(item.public_label || item.name) + '</h3>' +
        '<p>' + escapeHtml(item.description) + '</p>' +
        '<div class="inline-actions"><span class="btn btn-secondary btn-sm">Open</span></div>' +
      '</a>';
    }).join('');
  }

  function renderRecentActivity(payload){
    var root = q('[data-home-activity]');
    if(!root){ return; }
    var activities = [];
    ((payload && payload.recent_cases) || []).forEach(function(item){
      activities.push({
        title: item.title,
        description: joinMeta(['Matter', item.next_action || item.current_stage || 'Open Action Center']),
        updatedAt: item.updated_at,
        route: item.route
      });
    });
    ((payload && payload.recent_downloads) || []).forEach(function(item){
      activities.push({
        title: item.title,
        description: joinMeta(['Output', item.context || item.service_label || item.service_slug || 'Recent file']),
        updatedAt: item.updated_at,
        route: item.route
      });
    });
    activities.sort(function(a, b){
      return (new Date(b.updatedAt || 0)).getTime() - (new Date(a.updatedAt || 0)).getTime();
    });
    activities = activities.slice(0, 4);
    if(!activities.length){
      root.innerHTML = emptyCard('No recent recovery activity yet.');
      return;
    }
    root.innerHTML = activities.map(function(item){
      return '<article class="dashboard-list-item">' +
        '<div><strong>' + escapeHtml(item.title) + '</strong><p>' + escapeHtml(joinMeta([item.description, formatDate(item.updatedAt)])) + '</p></div>' +
        '<div class="inline-actions"><a class="btn btn-secondary btn-sm" href="' + escapeHtml(item.route) + '">Open</a></div>' +
      '</article>';
    }).join('');
  }

  function renderCommercial(payload){
    var root = q('[data-home-commercial-panel]');
    if(!root){ return; }
    var commercial = (payload && payload.commercial) || {};
    if(!commercial.plan_code){
      root.innerHTML = emptyCard('Recovery workspace commercial fit is not available yet.');
      return;
    }
    if(!commercial.can_view_usage_details){
      root.innerHTML = '<article class="dashboard-list-item"><div><strong>' + escapeHtml(commercial.plan_label || commercial.plan_code) + '</strong><p>Workspace owners and admins can review usage, locked features, and upgrade prompts from Settings.</p></div></article>';
      return;
    }
    var entitlements = commercial.entitlements || {};
    var usage = commercial.usage || {};
    var prompts = commercial.upgrade_prompts || [];
    var locked = commercial.locked_features || [];
    var usageBits = [
      'Active matters: ' + escapeHtml(usage.active_matters || 0),
      'Imported matters: ' + escapeHtml(usage.imported_matters || 0),
      'Generated packets: ' + escapeHtml(usage.generated_packets || 0),
      'Seats in use: ' + escapeHtml((Number(usage.portal_collaborators || 0) + 1) + ' / ' + (entitlements.seat_limit || 1))
    ];
    root.innerHTML =
      '<article class="dashboard-card dashboard-card-featured">' +
        '<div class="dashboard-card-copy">' +
          '<div class="eyebrow">Current plan</div>' +
          '<h3>' + escapeHtml(commercial.plan_label || commercial.plan_code) + '</h3>' +
          '<p>' + escapeHtml(commercial.value_message || 'Recovery workspace plan information is available.') + '</p>' +
          '<p>' + escapeHtml(usageBits.join(' | ')) + '</p>' +
        '</div>' +
      '</article>' +
      (prompts.length ? prompts.map(function(item){
        return '<article class="dashboard-list-item">' +
          '<div><strong>' + escapeHtml(item.title) + '</strong><p>' + escapeHtml(item.message || '') + '</p></div>' +
          '<div class="eyebrow">' + escapeHtml((item.upgrade_to || '').replace(/_/g, ' ')) + '</div>' +
        '</article>';
      }).join('') : '') +
      (locked.length ? '<article class="dashboard-list-item"><div><strong>Locked on this plan</strong><p>' + escapeHtml(locked.join(' | ')) + '</p></div></article>' : '');
  }

  function renderSummary(payload){
    var summary = (payload && payload.system_summary) || {};
    var root = q('[data-home-system-summary]');
    if(!root){ return; }
    root.innerHTML =
      '<div class="summary-grid">' +
        '<div class="summary-item"><span>Recent cases</span><strong>' + escapeHtml(summary.case_count || 0) + '</strong></div>' +
        '<div class="summary-item"><span>Standalone sessions</span><strong>' + escapeHtml(summary.session_count || 0) + '</strong></div>' +
        '<div class="summary-item"><span>Recent outputs</span><strong>' + escapeHtml(summary.download_count || 0) + '</strong></div>' +
        '<div class="summary-item"><span>Templates loaded</span><strong>' + escapeHtml(summary.template_count || 0) + '</strong></div>' +
      '</div>';
  }

  function applyAccount(payload){
    var node = q('[data-home-account]');
    if(!node){ return; }
    if(node.querySelector('[data-auth-shell]') || q('[data-auth-shell]')){ return; }
    var account = (payload && payload.account) || {};
    if(account.workspace_name){
      node.setAttribute('data-workspace-name', account.workspace_name);
    }
    if(account.user_email){
      node.setAttribute('data-user-email', account.user_email);
    }
  }

  function render(){
    var payload = state.payload;
    applyAccount(payload);
    renderContinue(payload);
    renderRecentCases(payload);
    renderUrgentDeadlines(payload);
    renderCommercial(payload);
    renderPopular(payload);
    renderRecentActivity(payload);
  }

  async function boot(){
    try {
      if(typeof api.ensureValidActiveCaseId === 'function'){
        await api.ensureValidActiveCaseId();
      }
      state.payload = await api.getPlatformDashboard();
      render();
    } catch (error){
      var banner = q('[data-home-error]');
      if(banner){
        banner.hidden = false;
        banner.textContent = error.message || 'Could not load the home screen.';
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
