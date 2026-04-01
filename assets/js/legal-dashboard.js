(function(){
  var api = window.DocketMintApi;
  var i18n = window.VCXI18n;
  if(!api){ return; }

  var state = { card: null };

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

  function recordTitle(item){
    return item.title || item.reference || item.id;
  }

  function recordRoute(item){
    return item.route || ('/app/action-center/?case=' + encodeURIComponent(item.id || ''));
  }

  function linkedRecoveryRoute(linked){
    return '/app/action-center/?case=' + encodeURIComponent(linked.case_id);
  }

  function renderOverview(card){
    var root = q('[data-legal-overview]');
    if(!root){ return; }
    if(!card){
      root.innerHTML = emptyCard(t('legal.not_configured', 'Legal Workflow is not configured for this workspace yet.'));
      return;
    }
    root.innerHTML =
      '<article class="dashboard-list-item">' +
        '<div><strong>' + escapeHtml(t('legal.open_matters', 'Open legal matters')) + '</strong><p>' + escapeHtml((card.record_count || 0) + ' ' + t('legal.open_matters_copy', 'active legal records in this workspace.')) + '</p></div>' +
      '</article>' +
      '<article class="dashboard-list-item">' +
        '<div><strong>' + escapeHtml(t('legal.urgent_items', 'Urgent legal items')) + '</strong><p>' + escapeHtml((card.urgent_count || 0) + ' ' + t('legal.urgent_items_copy', 'matters currently show deadline pressure or due dates.')) + '</p></div>' +
      '</article>';
  }

  function renderMatters(card){
    var root = q('[data-legal-matters]');
    if(!root){ return; }
    var items = (card && card.recent_records) || [];
    if(!items.length){
      root.innerHTML = emptyCard(t('legal.empty_matters', 'No legal matters exist yet. Create the first matter when work moves into legal execution.'));
      return;
    }
    root.innerHTML = items.map(function(item){
      var linked = (item.linked_records || []).find(function(entry){ return entry.environment_tag === 'recovery'; });
      var linkedAction = linked
        ? '<a class="btn btn-secondary btn-sm" href="' + escapeHtml(linkedRecoveryRoute(linked)) + '">' + escapeHtml(t('legal.open_linked_recovery', 'Open linked recovery')) + '</a>'
        : '<a class="btn btn-secondary btn-sm" href="/app/new-case/?engine=recovery&amp;category=dispute&amp;linked_case=' + escapeHtml(item.id) + '">' + escapeHtml(t('legal.create_linked_recovery', 'Create linked recovery')) + '</a>';
      return '<article class="dashboard-list-item">' +
        '<div><strong>' + escapeHtml(recordTitle(item)) + '</strong><p>' + escapeHtml(joinMeta([item.current_stage || item.status, item.next_action || t('legal.open_legal_matter', 'Open the legal matter'), item.primary_deadline && item.primary_deadline.date ? item.primary_deadline.date : t('legal.no_deadline_detected', 'No deadline detected')])) + '</p></div>' +
        '<div class="inline-actions"><a class="btn btn-secondary btn-sm" href="' + escapeHtml(recordRoute(item)) + '">' + escapeHtml(t('common.open', 'Open')) + '</a>' + linkedAction + '</div>' +
      '</article>';
    }).join('');
  }

  function renderDeadlines(card){
    var root = q('[data-legal-deadlines]');
    if(!root){ return; }
    var items = ((card && card.recent_records) || []).filter(function(item){ return item.primary_deadline; });
    if(!items.length){
      root.innerHTML = emptyCard(t('legal.empty_deadlines', 'No legal deadlines are detected yet.'));
      return;
    }
    root.innerHTML = items.map(function(item){
      var deadline = item.primary_deadline || {};
      return '<article class="dashboard-list-item">' +
        '<div><strong>' + escapeHtml(recordTitle(item)) + '</strong><p>' + escapeHtml(joinMeta([deadline.label || t('legal.deadline_label', 'Legal deadline'), deadline.date || t('common.review_now', 'Review now'), deadline.urgency || t('legal.medium_urgency', 'medium urgency')])) + '</p></div>' +
        '<div class="inline-actions"><a class="btn btn-secondary btn-sm" href="' + escapeHtml(recordRoute(item)) + '">' + escapeHtml(t('common.review', 'Review')) + '</a></div>' +
      '</article>';
    }).join('');
  }

  function renderLinkedRecords(card){
    var root = q('[data-legal-linked-records]');
    if(!root){ return; }
    var rows = [];
    ((card && card.recent_records) || []).forEach(function(item){
    ((item.linked_records || []) || []).forEach(function(linked){
        if(linked.environment_tag !== 'recovery'){ return; }
        rows.push({
          title: recordTitle(item),
          linked: linked
        });
      });
    });
    if(!rows.length){
      root.innerHTML = emptyCard(t('legal.empty_linked', 'No linked recovery records are attached to these legal matters yet.'));
      return;
    }
    root.innerHTML = rows.slice(0, 6).map(function(item){
      return '<article class="dashboard-list-item">' +
        '<div><strong>' + escapeHtml(item.title) + '</strong><p>' + escapeHtml(joinMeta([t('legal.linked_recovery', 'Linked recovery'), item.linked.title || item.linked.case_id, item.linked.current_stage || item.linked.status || t('common.active', 'Active')])) + '</p></div>' +
        '<div class="inline-actions"><a class="btn btn-secondary btn-sm" href="' + escapeHtml(linkedRecoveryRoute(item.linked)) + '">' + escapeHtml(t('legal.open_linked_recovery', 'Open linked recovery')) + '</a></div>' +
      '</article>';
    }).join('');
  }

  function renderActivity(card){
    var root = q('[data-legal-activity]');
    if(!root){ return; }
    var items = (card && card.recent_records) || [];
    if(!items.length){
      root.innerHTML = emptyCard(t('legal.empty_activity', 'No legal-side activity is visible yet.'));
      return;
    }
    root.innerHTML = items.map(function(item){
      return '<article class="dashboard-list-item">' +
        '<div><strong>' + escapeHtml(recordTitle(item)) + '</strong><p>' + escapeHtml(joinMeta([item.environment_label || t('legal.workflow_label', 'Legal Workflow'), item.next_action || t('legal.open_matter', 'Open the matter'), formatDate(item.updated_at)])) + '</p></div>' +
        '<div class="inline-actions"><a class="btn btn-secondary btn-sm" href="' + escapeHtml(recordRoute(item)) + '">' + escapeHtml(t('common.open', 'Open')) + '</a></div>' +
      '</article>';
    }).join('');
  }

  async function boot(){
    try {
      if(typeof api.ensureValidActiveCaseId === 'function'){
        await api.ensureValidActiveCaseId();
      }
      var payload = await api.getPlatformDashboard();
      var cards = (payload && payload.operating_environments) || [];
      var legal = cards.find(function(item){ return item.slug === 'legal'; }) || null;
      state.card = legal;
      renderOverview(legal);
      renderMatters(legal);
      renderDeadlines(legal);
      renderLinkedRecords(legal);
      renderActivity(legal);
    } catch (error){
      var banner = q('[data-legal-error]');
      if(banner){
        banner.hidden = false;
        banner.textContent = error.message || t('legal.load_failed', 'Could not load Legal Workflow.');
      }
    }
  }

  document.addEventListener('vcx:i18n:change', function(){
    if(state.card !== undefined){
      renderOverview(state.card);
      renderMatters(state.card);
      renderDeadlines(state.card);
      renderLinkedRecords(state.card);
      renderActivity(state.card);
    }
  });

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
