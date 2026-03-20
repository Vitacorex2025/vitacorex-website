(function(){
  var api = window.DocketMintApi;
  if(!api){ return; }

  var state = {
    caseId: '',
    record: null,
    packet: null,
    loading: false,
    error: ''
  };

  function q(selector){ return document.querySelector(selector); }
  function qa(selector){ return Array.prototype.slice.call(document.querySelectorAll(selector) || []); }
  function escapeHtml(value){
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function params(){
    try { return new URLSearchParams(window.location.search || ''); }
    catch (error){ return new URLSearchParams(''); }
  }

  function caseIdFromLocation(){
    var explicit = params().get('case') || '';
    if(explicit){ return explicit; }
    return api.getActiveCaseId ? (api.getActiveCaseId() || '') : '';
  }
  function categoryContext(){
    var key = params().get('category') || '';
    var labelMap = {
      notice: 'notice intake',
      dispute: 'dispute intake',
      permits: 'permits and compliance intake'
    };
    return {
      key: key,
      label: labelMap[key] || ''
    };
  }

  function openWorkspaceHref(){
    return state.caseId ? ('/app/workspace/?case=' + encodeURIComponent(state.caseId)) : '/app/workspace/';
  }

  function humanize(value, fallback){
    var text = String(value || fallback || '').trim();
    if(!text){ return fallback || '-'; }
    return text.replace(/_/g, ' ');
  }

  function renderPlainList(items, emptyMessage){
    var safeItems = Array.isArray(items) ? items.filter(Boolean) : [];
    if(!safeItems.length){
      return '<p class="micro-note">' + escapeHtml(emptyMessage || '') + '</p>';
    }
    return '<ul class="plain-list">' + safeItems.map(function(item){
      return '<li>' + escapeHtml(item) + '</li>';
    }).join('') + '</ul>';
  }

  function renderActionLinks(items){
    var safeItems = Array.isArray(items) ? items.filter(function(item){ return item && item.label; }) : [];
    if(!safeItems.length){ return ''; }
    return '<div class="action-link-group">' + safeItems.map(function(item){
      return '<a class="btn btn-secondary btn-sm" href="' + escapeHtml(item.route || '#') + '">' + escapeHtml(item.label) + '</a>';
    }).join('') + '</div>';
  }

  function renderChip(selector, label, tone){
    var node = q(selector);
    if(!node){ return; }
    node.textContent = label;
    node.className = 'status-chip ' + (tone ? ('is-' + tone) : 'is-neutral');
  }

  function renderShellEmpty(message){
    var blocks = [
      '[data-action-summary]',
      '[data-action-next-step]',
      '[data-action-deadlines]',
      '[data-action-missing]',
      '[data-action-contacts]',
      '[data-action-outputs]'
    ];
    blocks.forEach(function(selector){
      var node = q(selector);
      if(node){ node.innerHTML = '<p class="empty-copy">' + escapeHtml(message) + '</p>'; }
    });
  }

  function normalizedStage(record, packet){
    var stage = String((record && record.current_stage) || (record && record.status) || 'draft').toLowerCase();
    var outputs = (packet && packet.outputs) || [];
    var missing = (packet && packet.missing_documents) || [];
    if(stage === 'classified' && missing.length){
      return 'awaiting_supporting_docs';
    }
    if(stage !== 'sent' && stage !== 'followup_pending' && outputs.length){
      return 'packet_ready';
    }
    return stage;
  }

  function renderEmpty(){
    var category = categoryContext();
    state.record = null;
    state.packet = null;
    var title = q('[data-action-center-title]');
    var status = q('[data-action-center-status]');
    if(title){ title.textContent = category.label ? 'Matter created' : 'No matter selected'; }
    if(status){ status.textContent = category.label ? ('This matter started from the ' + category.label + ' path. Upload the first document to continue.') : 'Open a matter from My Cases or create a new matter first.'; }
    renderChip('[data-action-issue]', category.label || 'unknown', category.label ? 'info' : 'neutral');
    renderChip('[data-action-urgency]', 'medium', 'neutral');
    renderChip('[data-action-stage]', 'draft', 'neutral');
    renderChip('[data-action-deadline]', 'No deadline detected', 'neutral');
    renderShellEmpty(category.label ? 'Upload the first document to continue.' : 'Nothing to show yet.');
  }

  function renderLoading(){
    state.loading = true;
    state.error = '';
    var title = q('[data-action-center-title]');
    var status = q('[data-action-center-status]');
    if(title){ title.textContent = 'Loading matter'; }
    if(status){ status.textContent = 'Review what this matter is, what matters now, and what to do next.'; }
    renderChip('[data-action-issue]', 'loading', 'info');
    renderChip('[data-action-urgency]', 'checking', 'info');
    renderChip('[data-action-stage]', 'loading', 'info');
    renderChip('[data-action-deadline]', 'Checking deadlines', 'info');
    renderShellEmpty('Loading matter data...');
  }

  function renderError(message){
    state.error = message || 'Matter could not be loaded.';
    state.loading = false;
    var title = q('[data-action-center-title]');
    var status = q('[data-action-center-status]');
    if(title){ title.textContent = 'Matter could not be loaded'; }
    if(status){ status.textContent = state.error; }
    renderChip('[data-action-issue]', 'unavailable', 'warning');
    renderChip('[data-action-urgency]', 'review', 'warning');
    renderChip('[data-action-stage]', 'blocked', 'warning');
    renderChip('[data-action-deadline]', 'Deadline unknown', 'warning');
    renderShellEmpty(state.error);
  }

  function renderHeader(){
    var record = state.record || {};
    var packet = state.packet || {};
    var summary = packet.summary || {};
    var category = categoryContext();
    var title = q('[data-action-center-title]');
    var status = q('[data-action-center-status]');
    var stage = normalizedStage(record, packet);
    var firstDeadline = (packet.deadlines || [])[0] || (record.deadlines || [])[0] || null;
    var missingCount = (packet.missing_documents || []).length;
    var outputCount = (packet.outputs || []).length;
    var stageTone = missingCount ? 'warning' : (outputCount ? 'success' : 'info');
    if(title){ title.textContent = summary.title || record.title || record.reference || record.id || 'Action Center'; }
    if(status){
      status.textContent = record.issue_category
        ? 'Here is what we found and what matters now.'
        : (category.label ? ('Matter created from the ' + category.label + ' path. Upload the first document to continue.') : 'Review the matter status and continue with the recommended path.');
    }

    renderChip('[data-action-issue]', humanize(record.issue_category || category.label, 'unknown'), (record.issue_category || category.label) ? 'info' : 'neutral');
    renderChip('[data-action-urgency]', humanize(record.urgency_level, 'medium'), record.urgency_level === 'high' ? 'warning' : (record.urgency_level ? 'info' : 'neutral'));
    renderChip('[data-action-stage]', humanize(stage, 'draft'), stageTone);
    renderChip('[data-action-deadline]', firstDeadline && firstDeadline.date ? firstDeadline.date : 'No deadline detected', firstDeadline ? 'warning' : 'neutral');
  }

  function renderSummary(){
    var node = q('[data-action-summary]');
    if(!node){ return; }
    var record = state.record || {};
    var summary = state.packet && state.packet.summary ? state.packet.summary : {};
    var lines = [
      ['Workflow', summary.workflow_slug || record.workflow_slug || 'not assigned'],
      ['Issue type', summary.issue_category || record.issue_category || categoryContext().label || 'unknown'],
      ['Current stage', humanize(normalizedStage(record, state.packet), 'draft')],
      ['Urgency', summary.urgency_level || record.urgency_level || 'medium']
    ];
    if(summary.supported_balance){
      lines.push(['Supported balance', summary.supported_balance]);
    }
    if(typeof summary.invoice_count !== 'undefined'){
      lines.push(['Invoices found', summary.invoice_count || 0]);
    }
    if(typeof summary.evidence_gap_count !== 'undefined'){
      lines.push(['Evidence gaps', summary.evidence_gap_count || 0]);
    }
    if(state.packet && (state.packet.route_status_label || state.packet.route_status)){
      lines.push(['Route status', humanize(state.packet.route_status_label || state.packet.route_status, 'review')]);
    }
    node.innerHTML = '<div class="summary-grid">' + lines.map(function(item){
      return '<div class="summary-item"><span>' + escapeHtml(item[0]) + '</span><strong>' + escapeHtml(item[1]) + '</strong></div>';
    }).join('') + '</div>';
  }

  function renderNextStep(){
    var node = q('[data-action-next-step]');
    if(!node){ return; }
    var packet = state.packet || {};
    var primary = packet.primary_next_step || {};
    var optional = packet.optional_next_steps || [];
    var reasons = packet.source_backed_explanation || packet.route_reasons || [];
    var blockers = packet.blockers || [];
    var missing = packet.missing_evidence || packet.missing_documents || [];
    var settlement = (packet.settlement_tracker || [])[0] || null;
    var lastTouch = packet.communications_last_touch || null;
    var next = primary.label || (packet.next_step ? humanize(packet.next_step, 'review matter') : 'review matter');
    var tone = (packet.generation_allowed === false || blockers.length || missing.length) ? 'warning' : 'info';
    var copy = 'Nothing is sent automatically. Review first, then generate, export, or mark the matter as sent.';
    if(packet.generation_allowed === false){
      copy = 'Generation stays locked until the blockers and missing evidence below are resolved.';
    } else if((packet.outputs || []).length){
      copy = 'Packet outputs are ready to review. Confirm them before you download or send anything.';
    }

    var html = '<div class="next-step-stack">' +
      '<div class="inline-alert is-' + tone + '"><strong>Recommended next step</strong><span>' + escapeHtml(next) + '</span></div>';

    if(packet.route_status_label || packet.route_status){
      html += '<p class="micro-note">Route status: ' + escapeHtml(humanize(packet.route_status_label || packet.route_status, 'review')) + '.</p>';
    }
    if(reasons.length){
      html += '<div class="contact-card"><strong>Why this route was chosen</strong>' + renderPlainList(reasons, '') + '</div>';
    }
    if(blockers.length || missing.length){
      html += '<div class="contact-card"><strong>Blockers to clear first</strong>' +
        renderPlainList(blockers.length ? blockers : missing, 'No blockers listed.') +
      '</div>';
    }
    if(optional.length){
      html += '<div class="contact-card"><strong>Optional next steps</strong><span>These stay available after the primary step is reviewed.</span>' +
        renderActionLinks(optional) +
      '</div>';
    }
    if(settlement){
      html += '<div class="contact-card"><strong>Settlement tracker</strong><span>' + escapeHtml(humanize(settlement.proposal_type, 'proposal')) + ' | ' + escapeHtml(humanize(settlement.status, 'draft')) + (settlement.summary ? ' | ' + escapeHtml(settlement.summary) : '') + '</span></div>';
    }
    if(lastTouch){
      html += '<div class="contact-card"><strong>Last touch</strong><span>' + escapeHtml(lastTouch.summary || 'Recent matter activity') + (lastTouch.created_at ? ' | ' + escapeHtml(lastTouch.created_at) : '') + '</span></div>';
    }
    html += '<p class="micro-note">' + escapeHtml(copy) + '</p></div>';
    node.innerHTML = html;
  }

  function renderDeadlines(){
    var node = q('[data-action-deadlines]');
    if(!node){ return; }
    var deadlines = (state.packet && state.packet.deadlines) || [];
    if(!deadlines.length){
      node.innerHTML = '<p class="empty-copy">No deadlines detected yet.</p>';
      return;
    }
    node.innerHTML = deadlines.map(function(item){
      var tone = item.urgency === 'high' ? 'high' : (item.urgency === 'low' ? 'low' : 'medium');
      return '<div class="deadline-card urgency-' + escapeHtml(tone) + '">' +
        '<strong>' + escapeHtml(item.label || 'Detected deadline') + '</strong>' +
        '<span>' + escapeHtml(item.date || 'Date unresolved') + '</span>' +
        '<small>' + escapeHtml(item.source_file || 'Source file not identified') + '</small>' +
      '</div>';
    }).join('');
  }

  function renderMissing(){
    var node = q('[data-action-missing]');
    if(!node){ return; }
    var items = (state.packet && (state.packet.missing_evidence || state.packet.missing_documents)) || [];
    if(!items.length){
      node.innerHTML = '<p class="empty-copy">No missing documents were flagged.</p>';
      return;
    }
    node.innerHTML = items.map(function(item){
      return '<div class="contact-card"><strong>' + escapeHtml(humanize(item, 'missing item')) + '</strong><span>Still needed before the record is fully supported.</span></div>';
    }).join('');
  }

  function renderContacts(){
    var node = q('[data-action-contacts]');
    if(!node){ return; }
    var items = (state.packet && state.packet.contacts) || [];
    if(!items.length){
      node.innerHTML = '<p class="empty-copy">No official contact path is attached to this matter yet.</p>';
      return;
    }
    node.innerHTML = items.map(function(item){
      return '<div class="contact-card">' +
        '<strong>' + escapeHtml(item.authority_name || 'Official authority') + '</strong>' +
        '<span>' + escapeHtml(item.department_name || 'Department not specified') + '</span>' +
        (item.webform ? '<a class="btn btn-secondary btn-sm" href="' + escapeHtml(item.webform) + '" target="_blank" rel="noreferrer">Open official page</a>' : '') +
      '</div>';
    }).join('');
  }

  function renderOutputs(){
    var node = q('[data-action-outputs]');
    if(!node){ return; }
    var items = (state.packet && state.packet.outputs) || [];
    var archive = (state.packet && state.packet.packet_archive) || [];
    if(!items.length){
      node.innerHTML = (archive.length
        ? '<div class="contact-card"><strong>Latest packet version</strong><span>' + escapeHtml('v' + String((archive[0] && archive[0].version_number) || 0) + ' | ' + humanize((archive[0] && archive[0].release_state) || 'ready_for_review', 'ready for review')) + '</span></div>'
        : '<p class="empty-copy">No packet outputs are ready yet.</p>');
      return;
    }
    node.innerHTML = items.map(function(item){
      var link = item.download_url ? ('<a class="btn btn-secondary btn-sm" href="' + escapeHtml(api.toDownloadUrl(item.download_url)) + '">Download</a>') : '';
      return '<div class="output-card">' +
        '<div><strong>' + escapeHtml(item.label || item.type) + '</strong><span>' + escapeHtml(humanize(item.status, 'available')) + '</span></div>' +
        link +
      '</div>';
    }).join('') + (archive.length ? '<p class="micro-note">Latest packet version: ' + escapeHtml('v' + String((archive[0] && archive[0].version_number) || 0) + ' | ' + humanize((archive[0] && archive[0].release_state) || 'ready_for_review', 'ready for review')) + '.</p>' : '');
  }

  async function loadAll(){
    state.caseId = caseIdFromLocation();
    if(!state.caseId){
      renderEmpty();
      return;
    }
    state.loading = true;
    state.error = '';
    renderLoading();
    api.setActiveCaseId(state.caseId);
    try {
      state.record = await api.getCase(state.caseId);
      state.packet = await api.buildActionPacket(state.caseId);
      state.loading = false;
      renderHeader();
      renderSummary();
      renderNextStep();
      renderDeadlines();
      renderMissing();
      renderContacts();
      renderOutputs();
    } catch (error){
      state.record = null;
      state.packet = null;
      renderError((error && error.message) || 'Matter could not be loaded.');
    }
  }

  function bindClick(selector, handler){
    qa(selector).forEach(function(node){
      node.addEventListener('click', handler);
    });
  }

  function bindActions(){
    bindClick('[data-open-workspace], [data-mobile-open-workspace]', function(){
      window.location.href = openWorkspaceHref();
    });
    bindClick('[data-refresh-action-center]', function(){
      loadAll();
    });
    bindClick('[data-mark-sent], [data-mobile-mark-sent]', async function(){
      if(!state.caseId){ return; }
      await api.updateCaseStage(state.caseId, 'sent');
      await loadAll();
    });
  }

  function boot(){
    bindActions();
    loadAll();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
