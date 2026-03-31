(function(){
  var api = window.DocketMintApi;
  var i18n = window.VCXI18n;
  if(!api){ return; }

  var state = {
    caseId: '',
    record: null,
    packet: null,
    loading: false,
    error: '',
    recordError: '',
    packetError: ''
  };

  function q(selector){ return document.querySelector(selector); }
  function qa(selector){ return Array.prototype.slice.call(document.querySelectorAll(selector) || []); }
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
  function errorMessage(error){
    return error && error.message ? error.message : '';
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
      notice: t('action_center.notice_intake', 'notice intake'),
      dispute: t('action_center.dispute_intake', 'dispute intake'),
      permits: t('action_center.permits_intake', 'permits and compliance intake')
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

  function packetFallbackMessage(){
    return state.packetError || t('action_center.packet_unavailable', 'Packet details are temporarily unavailable. Refresh this matter or open the workspace to continue.');
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
    state.recordError = '';
    state.packetError = '';
    var title = q('[data-action-center-title]');
    var status = q('[data-action-center-status]');
    if(title){ title.textContent = category.label ? t('action_center.empty_created', 'Matter created') : t('action_center.empty_none', 'No matter selected'); }
    if(status){ status.textContent = category.label ? (t('action_center.empty_created_status', 'This matter started from the ') + ' ' + category.label + ' ' + t('action_center.empty_created_status_suffix', 'path. Upload the first document to continue.')) : t('action_center.empty_none_status', 'Open a matter from My Cases or create a new matter first.'); }
    renderChip('[data-action-issue]', category.label || t('common.unknown', 'unknown'), category.label ? 'info' : 'neutral');
    renderChip('[data-action-urgency]', t('common.medium', 'medium'), 'neutral');
    renderChip('[data-action-stage]', t('common.draft', 'draft'), 'neutral');
    renderChip('[data-action-deadline]', t('legal.no_deadline_detected', 'No deadline detected'), 'neutral');
    renderShellEmpty(category.label ? t('action_center.upload_first', 'Upload the first document to continue.') : t('action_center.nothing_yet', 'Nothing to show yet.'));
  }

  function renderLoading(){
    state.loading = true;
    state.error = '';
    state.recordError = '';
    state.packetError = '';
    var title = q('[data-action-center-title]');
    var status = q('[data-action-center-status]');
    if(title){ title.textContent = t('common.loading_matter', 'Loading matter'); }
    if(status){ status.textContent = t('action_center.loading_status', 'Review what this matter is, what matters now, and what to do next.'); }
    renderChip('[data-action-issue]', t('common.loading', 'Loading'), 'info');
    renderChip('[data-action-urgency]', t('action_center.checking_deadlines', 'Checking deadlines'), 'info');
    renderChip('[data-action-stage]', t('common.loading', 'Loading'), 'info');
    renderChip('[data-action-deadline]', t('action_center.checking_deadlines', 'Checking deadlines'), 'info');
    renderShellEmpty(t('action_center.loading_data', 'Loading matter data...'));
  }

  function renderError(message){
    state.error = message || t('action_center.error_default', 'Matter could not be loaded.');
    state.loading = false;
    state.recordError = state.recordError || '';
    state.packetError = state.packetError || '';
    var title = q('[data-action-center-title]');
    var status = q('[data-action-center-status]');
    if(title){ title.textContent = t('action_center.error_title', 'Matter could not be loaded'); }
    if(status){ status.textContent = state.error; }
    renderChip('[data-action-issue]', t('action_center.error_issue', 'unavailable'), 'warning');
    renderChip('[data-action-urgency]', t('action_center.error_urgency', 'review'), 'warning');
    renderChip('[data-action-stage]', t('action_center.error_stage', 'blocked'), 'warning');
    renderChip('[data-action-deadline]', t('action_center.error_deadline', 'Deadline unknown'), 'warning');
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
      if(state.packetError && !state.packet){
        status.textContent = t('action_center.partial_packet_status', 'Matter loaded, but packet details are temporarily unavailable. Fallback guidance is shown below.');
      } else if(state.recordError && !state.record && state.packet){
        status.textContent = t('action_center.partial_record_status', 'Packet details loaded, but the saved matter header could not be refreshed. Review the generated guidance below.');
      } else {
        status.textContent = record.issue_category
          ? t('action_center.status_found', 'Here is what we found and what matters now.')
          : (category.label ? (t('action_center.status_created', 'Matter created from the') + ' ' + category.label + ' ' + t('action_center.status_created_suffix', 'path. Upload the first document to continue.')) : t('action_center.status_review', 'Review the matter status and continue with the recommended path.'));
      }
    }

    renderChip('[data-action-issue]', humanize(record.issue_category || category.label, t('common.unknown', 'unknown')), (record.issue_category || category.label) ? 'info' : 'neutral');
    renderChip('[data-action-urgency]', humanize(record.urgency_level, t('common.medium', 'medium')), record.urgency_level === 'high' ? 'warning' : (record.urgency_level ? 'info' : 'neutral'));
    renderChip('[data-action-stage]', humanize(stage, t('common.draft', 'draft')), stageTone);
    renderChip('[data-action-deadline]', firstDeadline && firstDeadline.date ? firstDeadline.date : t('legal.no_deadline_detected', 'No deadline detected'), firstDeadline ? 'warning' : 'neutral');
  }

  function renderSummary(){
    var node = q('[data-action-summary]');
    if(!node){ return; }
    var record = state.record || {};
    var summary = state.packet && state.packet.summary ? state.packet.summary : {};
    var lines = [
      [t('action_center.summary.workflow', 'Workflow'), summary.workflow_slug || record.workflow_slug || 'not assigned'],
      [t('action_center.summary.issue_type', 'Issue type'), summary.issue_category || record.issue_category || categoryContext().label || t('common.unknown', 'unknown')],
      [t('action_center.summary.current_stage', 'Current stage'), humanize(normalizedStage(record, state.packet), t('common.draft', 'draft'))],
      [t('action_center.summary.urgency', 'Urgency'), summary.urgency_level || record.urgency_level || t('common.medium', 'medium')]
    ];
    if(summary.supported_balance){
      lines.push([t('action_center.summary.supported_balance', 'Supported balance'), summary.supported_balance]);
    }
    if(typeof summary.invoice_count !== 'undefined'){
      lines.push([t('action_center.summary.invoices_found', 'Invoices found'), summary.invoice_count || 0]);
    }
    if(typeof summary.evidence_gap_count !== 'undefined'){
      lines.push([t('action_center.summary.evidence_gaps', 'Evidence gaps'), summary.evidence_gap_count || 0]);
    }
    if(state.packet && (state.packet.route_status_label || state.packet.route_status)){
      lines.push([t('action_center.summary.route_status', 'Route status'), humanize(state.packet.route_status_label || state.packet.route_status, t('common.review', 'review'))]);
    }
    node.innerHTML = '<div class="summary-grid">' + lines.map(function(item){
      return '<div class="summary-item"><span>' + escapeHtml(item[0]) + '</span><strong>' + escapeHtml(item[1]) + '</strong></div>';
    }).join('') + '</div>';
  }

  function renderNextStep(){
    var node = q('[data-action-next-step]');
    if(!node){ return; }
    if(state.packetError && !state.packet){
      node.innerHTML = '<div class="contact-card"><strong>' + escapeHtml(t('action_center.packet_unavailable_title', 'Packet guidance is temporarily unavailable')) + '</strong><span>' + escapeHtml(packetFallbackMessage()) + '</span></div>' +
        '<p class="micro-note">' + escapeHtml(t('action_center.packet_unavailable_copy', 'Refresh the matter or open the workspace to continue once packet hydration recovers.')) + '</p>';
      return;
    }
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
    var copy = t('action_center.review_first_copy', 'Nothing is sent automatically. Review first, then generate, export, or mark the matter as sent.');
    if(packet.generation_allowed === false){
      copy = t('action_center.generation_locked_copy', 'Generation stays locked until the blockers and missing evidence below are resolved.');
    } else if((packet.outputs || []).length){
      copy = t('action_center.outputs_ready_copy', 'Packet outputs are ready to review. Confirm them before you download or send anything.');
    }

    var html = '<div class="next-step-stack">' +
      '<div class="inline-alert is-' + tone + '"><strong>' + escapeHtml(t('action_center.next_step_heading', 'Recommended next step')) + '</strong><span>' + escapeHtml(next) + '</span></div>';

    if(packet.route_status_label || packet.route_status){
      html += '<p class="micro-note">' + escapeHtml(t('action_center.route_status', 'Route status')) + ': ' + escapeHtml(humanize(packet.route_status_label || packet.route_status, t('common.review', 'review'))) + '.</p>';
    }
    if(reasons.length){
      html += '<div class="contact-card"><strong>' + escapeHtml(t('action_center.why_route', 'Why this route was chosen')) + '</strong>' + renderPlainList(reasons, '') + '</div>';
    }
    if(blockers.length || missing.length){
      html += '<div class="contact-card"><strong>' + escapeHtml(t('action_center.blockers_first', 'Blockers to clear first')) + '</strong>' +
        renderPlainList(blockers.length ? blockers : missing, t('action_center.no_blockers_listed', 'No blockers listed.')) +
      '</div>';
    }
    if(optional.length){
      html += '<div class="contact-card"><strong>' + escapeHtml(t('action_center.optional_next_steps', 'Optional next steps')) + '</strong><span>' + escapeHtml(t('action_center.optional_next_steps_copy', 'These stay available after the primary step is reviewed.')) + '</span>' +
        renderActionLinks(optional) +
      '</div>';
    }
    if(settlement){
      html += '<div class="contact-card"><strong>' + escapeHtml(t('action_center.settlement_tracker', 'Settlement tracker')) + '</strong><span>' + escapeHtml(humanize(settlement.proposal_type, 'proposal')) + ' | ' + escapeHtml(humanize(settlement.status, t('common.draft', 'draft'))) + (settlement.summary ? ' | ' + escapeHtml(settlement.summary) : '') + '</span></div>';
    }
    if(lastTouch){
      html += '<div class="contact-card"><strong>' + escapeHtml(t('action_center.last_touch', 'Last touch')) + '</strong><span>' + escapeHtml(lastTouch.summary || 'Recent matter activity') + (lastTouch.created_at ? ' | ' + escapeHtml(lastTouch.created_at) : '') + '</span></div>';
    }
    html += '<p class="micro-note">' + escapeHtml(copy) + '</p></div>';
    node.innerHTML = html;
  }

  function renderDeadlines(){
    var node = q('[data-action-deadlines]');
    if(!node){ return; }
    if(state.packetError && !state.packet){
      node.innerHTML = '<p class="empty-copy">' + escapeHtml(packetFallbackMessage()) + '</p>';
      return;
    }
    var deadlines = (state.packet && state.packet.deadlines) || [];
    if(!deadlines.length){
      node.innerHTML = '<p class="empty-copy">' + escapeHtml(t('action_center.no_deadlines', 'No deadlines detected yet.')) + '</p>';
      return;
    }
    node.innerHTML = deadlines.map(function(item){
      var tone = item.urgency === 'high' ? 'high' : (item.urgency === 'low' ? 'low' : 'medium');
      return '<div class="deadline-card urgency-' + escapeHtml(tone) + '">' +
        '<strong>' + escapeHtml(item.label || t('action_center.detected_deadline', 'Detected deadline')) + '</strong>' +
        '<span>' + escapeHtml(item.date || t('action_center.date_unresolved', 'Date unresolved')) + '</span>' +
        '<small>' + escapeHtml(item.source_file || t('action_center.source_unknown', 'Source file not identified')) + '</small>' +
      '</div>';
    }).join('');
  }

  function renderMissing(){
    var node = q('[data-action-missing]');
    if(!node){ return; }
    if(state.packetError && !state.packet){
      node.innerHTML = '<p class="empty-copy">' + escapeHtml(packetFallbackMessage()) + '</p>';
      return;
    }
    var items = (state.packet && (state.packet.missing_evidence || state.packet.missing_documents)) || [];
    if(!items.length){
      node.innerHTML = '<p class="empty-copy">' + escapeHtml(t('action_center.no_missing_documents', 'No missing documents were flagged.')) + '</p>';
      return;
    }
    node.innerHTML = items.map(function(item){
      return '<div class="contact-card"><strong>' + escapeHtml(humanize(item, t('action_center.missing_item', 'missing item'))) + '</strong><span>' + escapeHtml(t('action_center.missing_copy', 'Still needed before the record is fully supported.')) + '</span></div>';
    }).join('');
  }

  function renderContacts(){
    var node = q('[data-action-contacts]');
    if(!node){ return; }
    if(state.packetError && !state.packet){
      node.innerHTML = '<p class="empty-copy">' + escapeHtml(packetFallbackMessage()) + '</p>';
      return;
    }
    var items = (state.packet && state.packet.contacts) || [];
    if(!items.length){
      node.innerHTML = '<p class="empty-copy">' + escapeHtml(t('action_center.no_contact_path', 'No official contact path is attached to this matter yet.')) + '</p>';
      return;
    }
    node.innerHTML = items.map(function(item){
      return '<div class="contact-card">' +
        '<strong>' + escapeHtml(item.authority_name || t('action_center.official_authority', 'Official authority')) + '</strong>' +
        '<span>' + escapeHtml(item.department_name || t('action_center.department_unspecified', 'Department not specified')) + '</span>' +
        (item.webform ? '<a class="btn btn-secondary btn-sm" href="' + escapeHtml(item.webform) + '" target="_blank" rel="noreferrer">' + escapeHtml(t('action_center.open_official_page', 'Open official page')) + '</a>' : '') +
      '</div>';
    }).join('');
  }

  function renderOutputs(){
    var node = q('[data-action-outputs]');
    if(!node){ return; }
    if(state.packetError && !state.packet){
      node.innerHTML = '<p class="empty-copy">' + escapeHtml(packetFallbackMessage()) + '</p>';
      return;
    }
    var items = (state.packet && state.packet.outputs) || [];
    var archive = (state.packet && state.packet.packet_archive) || [];
    if(!items.length){
      node.innerHTML = (archive.length
        ? '<div class="contact-card"><strong>' + escapeHtml(t('action_center.latest_packet_version', 'Latest packet version')) + '</strong><span>' + escapeHtml('v' + String((archive[0] && archive[0].version_number) || 0) + ' | ' + humanize((archive[0] && archive[0].release_state) || 'ready_for_review', 'ready for review')) + '</span></div>'
        : '<p class="empty-copy">' + escapeHtml(t('action_center.no_packet_outputs', 'No packet outputs are ready yet.')) + '</p>');
      return;
    }
    node.innerHTML = items.map(function(item){
      var link = item.download_url ? ('<a class="btn btn-secondary btn-sm" href="' + escapeHtml(api.toDownloadUrl(item.download_url)) + '">' + escapeHtml(t('common.download', 'Download')) + '</a>') : '';
      return '<div class="output-card">' +
        '<div><strong>' + escapeHtml(item.label || item.type) + '</strong><span>' + escapeHtml(humanize(item.status, 'available')) + '</span></div>' +
        link +
      '</div>';
    }).join('') + (archive.length ? '<p class="micro-note">' + escapeHtml(t('action_center.latest_packet_version', 'Latest packet version')) + ': ' + escapeHtml('v' + String((archive[0] && archive[0].version_number) || 0) + ' | ' + humanize((archive[0] && archive[0].release_state) || 'ready_for_review', 'ready for review')) + '.</p>' : '');
  }

  async function loadAll(){
    state.caseId = caseIdFromLocation();
    if(!state.caseId){
      renderEmpty();
      return;
    }
    state.loading = true;
    state.error = '';
    state.recordError = '';
    state.packetError = '';
    renderLoading();
    api.setActiveCaseId(state.caseId);
    try {
      var results = await Promise.allSettled([
        api.getCase(state.caseId),
        api.buildActionPacket(state.caseId)
      ]);
      var recordResult = results[0];
      var packetResult = results[1];

      state.record = recordResult.status === 'fulfilled' ? recordResult.value : null;
      state.packet = packetResult.status === 'fulfilled' ? packetResult.value : null;
      state.recordError = recordResult.status === 'rejected' ? errorMessage(recordResult.reason) : '';
      state.packetError = packetResult.status === 'rejected' ? errorMessage(packetResult.reason) : '';
      state.loading = false;

      if(!state.record && !state.packet){
        renderError(state.packetError || state.recordError || t('action_center.error_default', 'Matter could not be loaded.'));
        return;
      }

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
      state.recordError = '';
      state.packetError = '';
      renderError((error && error.message) || t('action_center.error_default', 'Matter could not be loaded.'));
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

  document.addEventListener('vcx:i18n:change', function(){
    if(state.record || state.packet){
      renderHeader();
      renderSummary();
      renderNextStep();
      renderDeadlines();
      renderMissing();
      renderContacts();
      renderOutputs();
    } else if(state.error){
      renderError(state.error);
    } else {
      renderEmpty();
    }
  });

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
