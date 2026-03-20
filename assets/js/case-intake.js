(function(){
  var api = window.DocketMintApi;
  if(!api){ return; }

  var state = {
    sessionId: '',
    payload: null,
    loading: false
  };

  function q(selector){ return document.querySelector(selector); }
  function safeArray(values){ return Array.isArray(values) ? values : []; }
  function params(){
    try { return new URLSearchParams(window.location.search || ''); }
    catch (error){ return new URLSearchParams(''); }
  }
  function escapeHtml(value){
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  function formatBytes(value){
    var bytes = Number(value || 0);
    if(!isFinite(bytes) || bytes <= 0){ return '0 B'; }
    var units = ['B','KB','MB','GB'];
    var unit = 0;
    while(bytes >= 1024 && unit < units.length - 1){
      bytes = bytes / 1024;
      unit += 1;
    }
    return (unit === 0 ? Math.round(bytes) : bytes.toFixed(bytes >= 100 ? 0 : 1)) + ' ' + units[unit];
  }
  function statusLabel(value){
    var map = {
      extracted_successfully: 'Extracted successfully',
      partially_extracted: 'Partially extracted',
      failed: 'Failed',
      pending: 'Pending'
    };
    return map[value] || String(value || 'pending').replace(/_/g, ' ');
  }
  function statusClass(value){
    var normalized = String(value || '').toLowerCase();
    if(normalized === 'extracted_successfully'){ return 'is-success'; }
    if(normalized === 'partially_extracted'){ return 'is-warning'; }
    if(normalized === 'failed'){ return 'is-danger'; }
    return 'is-neutral';
  }
  function humanType(value){
    var map = {
      contract_pdf: 'Contract PDF',
      guaranty_pdf: 'Guaranty PDF',
      invoice_excel: 'Invoice Excel',
      invoice_csv: 'Invoice CSV',
      invoice_pdf: 'Invoice PDF',
      account_statement_pdf: 'Account Statement PDF',
      supporting_exhibit: 'Supporting Exhibit'
    };
    return map[value] || String(value || 'source').replace(/_/g, ' ');
  }
  function currentWorkflow(){
    return params().get('workflow') || 'recovery_diagnostic';
  }
  function currentSessionId(){
    return state.sessionId || params().get('session') || '';
  }
  function fileInput(){
    return document.getElementById('intakeSourceFilesInput');
  }
  function banner(){
    return q('[data-intake-error]');
  }
  function setBanner(message){
    var node = banner();
    if(!node){ return; }
    if(!message){
      node.hidden = true;
      node.textContent = '';
      return;
    }
    node.hidden = false;
    node.textContent = message;
  }
  function replaceSessionInUrl(sessionId){
    try {
      var url = new URL(window.location.href);
      if(sessionId){ url.searchParams.set('session', sessionId); }
      else { url.searchParams.delete('session'); }
      window.history.replaceState({}, '', url.toString());
    } catch (error){}
  }
  function emptyList(node, message){
    if(node){ node.innerHTML = '<li class="empty-copy">' + escapeHtml(message) + '</li>'; }
  }

  function renderSummary(){
    var payload = state.payload || {};
    var diagnosis = payload.diagnosis || {};
    var snapshot = payload.client_snapshot || {};
    var statusNode = q('[data-intake-status]');
    var readinessNode = q('[data-intake-readiness]');
    var fileCountNode = q('[data-intake-file-count]');
    var nextStepNode = q('[data-intake-next-step]');
    if(statusNode){ statusNode.textContent = payload.status || 'Draft'; }
    if(readinessNode){ readinessNode.textContent = payload.readiness || 'Waiting on files'; }
    if(fileCountNode){ fileCountNode.textContent = String(payload.source_file_count || 0); }
    if(nextStepNode){ nextStepNode.textContent = snapshot.next_action || diagnosis.next_action || 'Upload the source set'; }

    var summaryNode = q('[data-intake-diagnosis-summary]');
    if(summaryNode){
      summaryNode.innerHTML =
        '<strong>' + escapeHtml(snapshot.next_action || diagnosis.next_action || 'Upload files to start diagnosis.') + '</strong>' +
        '<span>' + escapeHtml((diagnosis.blocker_count ? 'Blockers are listed below before any formal matter can be promoted.' : 'No blocker text is available yet. Upload the source set to see readiness and evidence gaps.')) + '</span>';
    }

    var promoteButton = q('[data-promote-intake]');
    if(promoteButton){
      promoteButton.disabled = !state.sessionId || !(payload.source_file_count > 0) || state.loading;
    }
  }

  function renderFiles(){
    var root = q('[data-intake-files]');
    if(!root){ return; }
    var files = safeArray((state.payload && state.payload.source_files) || []);
    if(!files.length){
      root.innerHTML = '<p class="empty-copy">No source files uploaded yet.</p>';
      return;
    }
    root.innerHTML = files.map(function(file){
      var warnings = safeArray(file.warnings).slice(0, 3);
      var evidence = file.normalized_evidence || {};
      var uncertain = safeArray(evidence.uncertain_fields).slice(0, 3);
      var conflicts = safeArray(evidence.conflicts).slice(0, 3);
      var parserReport = file.parsed_payload && file.parsed_payload.parser_report ? file.parsed_payload.parser_report : {};
      var sheets = safeArray((file.parsed_payload && file.parsed_payload.selected_worksheets) || parserReport.selected_worksheets).slice(0, 4);
      var score = Math.max(0, Math.min(100, Math.round(Number(file.extraction_quality_score || 0) * 100)));
      return '<article class="stored-item">' +
        '<div class="upload-progress-head"><strong>' + escapeHtml(file.original_filename || file.filename || 'Source file') + '</strong><span>' + escapeHtml([humanType(file.file_type), formatBytes(file.size_bytes || 0)].join(' | ')) + '</span></div>' +
        '<div class="stored-item-qa">' +
          '<span class="status-chip ' + statusClass(file.extraction_status) + '">' + escapeHtml(statusLabel(file.extraction_status)) + '</span>' +
          '<span class="micro-note">Quality ' + escapeHtml(String(score)) + '%</span>' +
          '<span class="micro-note">Method ' + escapeHtml(String(file.extraction_method || 'direct_text').replace(/_/g, ' ')) + '</span>' +
        '</div>' +
        (sheets.length ? '<div class="micro-note"><strong>Worksheet selector:</strong> ' + escapeHtml(sheets.join(' | ')) + '</div>' : '') +
        (warnings.length ? '<div class="qa-flag-list">' + warnings.map(function(item){ return '<span class="qa-flag is-warning">' + escapeHtml(item) + '</span>'; }).join('') + '</div>' : '') +
        (uncertain.length ? '<div class="qa-flag-list">' + uncertain.map(function(item){ return '<span class="qa-flag is-warning">' + escapeHtml((item.field || 'field') + ': ' + (item.reason || 'uncertain')) + '</span>'; }).join('') + '</div>' : '') +
        (conflicts.length ? '<div class="qa-flag-list">' + conflicts.map(function(item){ return '<span class="qa-flag is-danger">' + escapeHtml(item) + '</span>'; }).join('') + '</div>' : '') +
      '</article>';
    }).join('');
  }

  function renderMessages(){
    var diagnosis = (state.payload && state.payload.diagnosis) || {};
    var blockersNode = q('[data-intake-blockers]');
    var warningsNode = q('[data-intake-warnings]');
    var blockers = safeArray(diagnosis.blockers);
    var warnings = safeArray(diagnosis.warnings);
    if(blockers.length){
      blockersNode.innerHTML = blockers.map(function(item){ return '<li>' + escapeHtml(item) + '</li>'; }).join('');
    } else {
      emptyList(blockersNode, 'No blockers detected yet.');
    }
    if(warnings.length){
      warningsNode.innerHTML = warnings.map(function(item){ return '<li>' + escapeHtml(item) + '</li>'; }).join('');
    } else {
      emptyList(warningsNode, 'No warnings detected yet.');
    }
  }

  function renderDeadlines(){
    var root = q('[data-intake-deadlines]');
    if(!root){ return; }
    var deadlines = safeArray((state.payload && state.payload.deadlines) || []);
    var contacts = safeArray((state.payload && state.payload.official_contacts) || []);
    var rows = [];
    deadlines.forEach(function(item){
      rows.push(
        '<article class="dashboard-list-item">' +
          '<div><strong>' + escapeHtml(item.label || 'Deadline') + '</strong><p>' + escapeHtml([item.date || 'Review now', item.urgency || 'medium'].join(' | ')) + '</p></div>' +
        '</article>'
      );
    });
    contacts.slice(0, 3).forEach(function(item){
      rows.push(
        '<article class="dashboard-list-item">' +
          '<div><strong>' + escapeHtml(item.authority_name || 'Official contact') + '</strong><p>' + escapeHtml([item.department_name || '', item.phone || '', item.webform || ''].filter(Boolean).join(' | ')) + '</p></div>' +
        '</article>'
      );
    });
    root.innerHTML = rows.length ? rows.join('') : '<p class="empty-copy">No deadlines or official contact paths detected yet.</p>';
  }

  function render(){
    renderSummary();
    renderFiles();
    renderMessages();
    renderDeadlines();
  }

  async function fetchSession(sessionId){
    var payload = await api.getRecoveryIntakeSession(sessionId);
    state.payload = payload;
    state.sessionId = payload.session_id;
    replaceSessionInUrl(payload.session_id);
    render();
    return payload;
  }

  async function createSession(files){
    var payload = await api.createRecoveryIntakeSession(currentWorkflow(), '', files || []);
    state.payload = payload;
    state.sessionId = payload.session_id;
    replaceSessionInUrl(payload.session_id);
    render();
    return payload;
  }

  async function uploadFiles(files){
    files = Array.prototype.slice.call(files || []).filter(Boolean);
    if(!files.length || state.loading){ return; }
    state.loading = true;
    setBanner('');
    renderSummary();
    try {
      if(!state.sessionId){
        await createSession(files);
      } else {
        state.payload = await api.uploadRecoveryIntakeFiles(state.sessionId, files);
        render();
      }
    } catch (error){
      setBanner(error.message || 'Could not upload the intake source set.');
    } finally {
      state.loading = false;
      renderSummary();
    }
  }

  async function promoteSession(){
    if(!state.sessionId || state.loading){ return; }
    state.loading = true;
    setBanner('');
    renderSummary();
    try {
      var result = await api.promoteRecoveryIntakeSession(state.sessionId);
      if(api.setActiveCaseId){ api.setActiveCaseId(result.case_id); }
      window.location.href = result.action_center_route || ('/app/action-center/?case=' + encodeURIComponent(result.case_id));
    } catch (error){
      setBanner(error.message || 'Could not promote the intake into a formal matter.');
    } finally {
      state.loading = false;
      renderSummary();
    }
  }

  function openPicker(){
    var input = fileInput();
    if(!input){ return; }
    if(params().get('capture') === '1'){
      input.setAttribute('capture', 'environment');
      input.accept = 'image/*,.pdf,.xlsx,.xls,.csv,.doc,.docx,.txt';
    } else {
      input.removeAttribute('capture');
    }
    input.click();
  }

  function bindPicker(){
    var input = fileInput();
    var dropzone = q('[data-intake-dropzone]');
    safeArray(document.querySelectorAll('[data-intake-open-picker], [data-intake-pick]')).forEach(function(button){
      button.addEventListener('click', function(event){
        event.preventDefault();
        openPicker();
      });
    });
    if(input){
      input.addEventListener('change', function(){
        uploadFiles(input.files || []);
        input.value = '';
      });
    }
    if(dropzone){
      ['dragenter', 'dragover'].forEach(function(name){
        dropzone.addEventListener(name, function(event){
          event.preventDefault();
          event.stopPropagation();
          dropzone.classList.add('is-dragover');
        });
      });
      ['dragleave', 'drop'].forEach(function(name){
        dropzone.addEventListener(name, function(event){
          event.preventDefault();
          event.stopPropagation();
          dropzone.classList.remove('is-dragover');
        });
      });
      dropzone.addEventListener('drop', function(event){
        var files = event.dataTransfer && event.dataTransfer.files ? event.dataTransfer.files : [];
        uploadFiles(files);
      });
      dropzone.addEventListener('keydown', function(event){
        if(event.key === 'Enter' || event.key === ' '){
          event.preventDefault();
          openPicker();
        }
      });
    }
    var promoteButton = q('[data-promote-intake]');
    if(promoteButton){
      promoteButton.addEventListener('click', function(){ promoteSession(); });
    }
  }

  async function boot(){
    bindPicker();
    try {
      if(typeof api.ensureValidActiveCaseId === 'function'){
        await api.ensureValidActiveCaseId();
      }
    } catch (error){}
    var sessionId = currentSessionId();
    if(sessionId){
      try {
        await fetchSession(sessionId);
      } catch (error){
        state.sessionId = '';
        state.payload = null;
        replaceSessionInUrl('');
        setBanner('The previous intake session is no longer available. Start a new upload-first intake.');
      }
    }
    render();
    if(params().get('capture') === '1'){
      window.setTimeout(openPicker, 180);
    }
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){ boot().catch(function(){}); });
  } else {
    boot().catch(function(){});
  }
})();
