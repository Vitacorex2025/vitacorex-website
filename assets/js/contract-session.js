(function(){
  var api = window.DocketMintApi;
  var i18n = window.VCXI18n;
  if(!api){ return; }

  var state = { session: null };

  function q(selector){ return document.querySelector(selector); }
  function t(key, fallback){ return i18n ? i18n.t(key, fallback) : (fallback || key); }
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
  function storage(){
    try { return window.sessionStorage || null; } catch (error){ return null; }
  }
  function currentSessionId(){
    var explicit = params().get('session') || '';
    if(explicit){
      setCurrentSessionId(explicit);
      return explicit;
    }
    try {
      var bag = storage();
      return bag ? (bag.getItem('docketmint.contractSessionId') || '') : '';
    } catch (error){
      return '';
    }
  }
  function setCurrentSessionId(value){
    try {
      var bag = storage();
      if(!bag){ return; }
      if(value){ bag.setItem('docketmint.contractSessionId', String(value)); }
      else { bag.removeItem('docketmint.contractSessionId'); }
    } catch (error){}
  }
  function isBuilderMode(){
    return (document.body.getAttribute('data-contract-mode') || 'analysis') === 'builder';
  }

  function renderFiles(session){
    var root = q('[data-contract-session-files]');
    if(!root){ return; }
    var files = (session && session.contract_files) || [];
    if(!files.length){
      root.innerHTML = '<div class="empty-copy">' + escapeHtml(t('contract.empty.files', 'Upload a contract or guaranty to start a standalone review session.')) + '</div>';
      return;
    }
    root.innerHTML = files.map(function(item){
      return '<div class="dashboard-list-item"><div><strong>' + escapeHtml(item.original_name || item.stored_name) + '</strong><p>' + escapeHtml(item.file_type || 'contract') + '</p></div></div>';
    }).join('');
  }

  function renderFindings(session){
    var root = q('[data-contract-session-findings]');
    if(!root){ return; }
    var review = (session && session.review) || {};
    var findings = review.findings || [];
    var jurisdictionWarnings = review.jurisdiction_warnings || [];
    if(!findings.length){
      root.innerHTML = '<div class="empty-copy">' + escapeHtml(t('contract.empty.findings', 'No clause findings yet. Upload a contract and run the analysis.')) + '</div>';
      return;
    }
    var warningBlock = jurisdictionWarnings.length
      ? '<div class="inline-alert is-warning"><strong>' + escapeHtml(t('contract.jurisdiction.title', 'Jurisdiction-aware cautions')) + '</strong><span>' + escapeHtml(jurisdictionWarnings.join(' ')) + '</span></div>'
      : '';
    root.innerHTML = warningBlock + findings.map(function(item){
      var findingKind = String(item.finding_kind || 'review').toLowerCase();
      return '<article class="dashboard-list-item contract-finding-card is-' + escapeHtml(findingKind) + '">' +
        '<div class="contract-finding-head">' +
          '<strong>' + escapeHtml(item.title || 'Finding') + '</strong>' +
          '<div class="tag-list"><span>' + escapeHtml(item.finding_kind || 'review') + '</span><span>' + escapeHtml(item.risk_severity || 'info') + '</span></div>' +
        '</div>' +
        '<p>' + escapeHtml(item.why_it_matters || item.practical_implication || item.extracted_text || '') + '</p>' +
        '<div class="contract-finding-meta">' +
          '<div><strong>' + escapeHtml(t('contract.finding.risk_logic', 'What can go wrong')) + '</strong><span>' + escapeHtml(item.what_can_go_wrong || '-') + '</span></div>' +
          '<div><strong>' + escapeHtml(t('contract.finding.improve', 'How to improve it')) + '</strong><span>' + escapeHtml(item.how_to_improve || item.recommended_correction || '-') + '</span></div>' +
          '<div><strong>' + escapeHtml(t('contract.finding.fallback', 'Stronger fallback wording')) + '</strong><span>' + escapeHtml(item.fallback_language || '-') + '</span></div>' +
          '<div><strong>' + escapeHtml(t('contract.finding.rationale', 'Legal / commercial rationale')) + '</strong><span>' + escapeHtml(item.legal_rationale || '-') + '</span></div>' +
        '</div>' +
        (item.jurisdiction_note ? '<p class="micro-note"><strong>' + escapeHtml(t('contract.finding.state_note', 'State-specific caution')) + ':</strong> ' + escapeHtml(item.jurisdiction_note) + '</p>' : '') +
        (item.extracted_text ? '<p class="micro-note"><strong>' + escapeHtml(t('contract.finding.source', 'Source excerpt')) + ':</strong> ' + escapeHtml(item.extracted_text) + '</p>' : '') +
      '</article>';
    }).join('');
  }

  function renderOutputs(session){
    var root = q('[data-contract-session-outputs]');
    if(!root){ return; }
    var review = (session && session.review) || {};
    var links = [];
    if(review.revised_contract_download_url){
      links.push('<a class="btn btn-secondary btn-sm" href="' + escapeHtml(api.toDownloadUrl(review.revised_contract_download_url)) + '">' + escapeHtml(t('contract.output.revised', 'Download revised draft')) + '</a>');
    }
    if(review.change_memo_download_url){
      links.push('<a class="btn btn-secondary btn-sm" href="' + escapeHtml(api.toDownloadUrl(review.change_memo_download_url)) + '">' + escapeHtml(t('contract.output.memo', 'Download change memo')) + '</a>');
    }
    root.innerHTML = links.length ? '<div class="inline-actions">' + links.join('') + '</div>' : '<div class="empty-copy">' + escapeHtml(t('contract.empty.outputs', 'Draft outputs appear here after generation.')) + '</div>';
  }

  function renderSummary(session){
    var review = (session && session.review) || {};
    var findings = review.findings || [];
    var strongCount = findings.filter(function(item){ return item.finding_kind === 'strong'; }).length;
    var weakCount = findings.filter(function(item){ return item.finding_kind === 'weak'; }).length;
    var missingCount = findings.filter(function(item){ return item.finding_kind === 'missing'; }).length;
    var dangerousCount = findings.filter(function(item){ return item.finding_kind === 'dangerous'; }).length;
    var summary = q('[data-contract-session-summary]');
    var status = q('[data-contract-session-status]');
    if(summary){
      summary.innerHTML =
        '<div class="summary-grid">' +
          '<div class="summary-item"><span>' + escapeHtml(t('contract.metric.files', 'Contract files')) + '</span><strong>' + escapeHtml((session && session.contract_files && session.contract_files.length) || 0) + '</strong></div>' +
          '<div class="summary-item"><span>' + escapeHtml(t('contract.metric.findings', 'Findings')) + '</span><strong>' + escapeHtml(findings.length || 0) + '</strong></div>' +
          '<div class="summary-item"><span>' + escapeHtml(t('contract.metric.strong', 'Strong')) + '</span><strong>' + escapeHtml(strongCount) + '</strong></div>' +
          '<div class="summary-item"><span>' + escapeHtml(t('contract.metric.weak', 'Weak')) + '</span><strong>' + escapeHtml(weakCount) + '</strong></div>' +
          '<div class="summary-item"><span>' + escapeHtml(t('contract.metric.missing', 'Missing protections')) + '</span><strong>' + escapeHtml(missingCount) + '</strong></div>' +
          '<div class="summary-item"><span>' + escapeHtml(t('contract.metric.dangerous', 'Dangerous')) + '</span><strong>' + escapeHtml(dangerousCount) + '</strong></div>' +
          '<div class="summary-item"><span>' + escapeHtml(t('contract.metric.status', 'Status')) + '</span><strong>' + escapeHtml((session && session.status) || 'draft') + '</strong></div>' +
          '<div class="summary-item"><span>' + escapeHtml(t('contract.metric.updated', 'Updated')) + '</span><strong>' + escapeHtml((session && session.updated_at) ? new Date(session.updated_at).toLocaleString() : '-') + '</strong></div>' +
        '</div>';
    }
    if(status){
      status.textContent = findings.length
        ? t('contract.status.findings_ready', 'Clause findings are ready for review. Check strong, weak, missing, and dangerous sections before signing.')
        : t('contract.status.awaiting', 'Upload a contract and run the analysis.');
    }
  }

  function renderActions(session){
    var analyze = q('[data-contract-analyze]');
    var generate = q('[data-contract-generate]');
    if(analyze){ analyze.disabled = !session; }
    if(generate){ generate.disabled = !session; }
  }

  function render(){
    renderSummary(state.session);
    renderFiles(state.session);
    renderFindings(state.session);
    renderOutputs(state.session);
    renderActions(state.session);
  }

  async function refreshSession(){
    var sessionId = currentSessionId();
    if(!sessionId){
      state.session = null;
      render();
      return;
    }
    try {
      state.session = await api.getContractIntelligenceSession(sessionId);
    } catch (error){
      state.session = null;
      setCurrentSessionId('');
    }
    render();
  }

  async function createSession(event){
    event.preventDefault();
    var contractFiles = Array.prototype.slice.call((q('[data-contract-files]') || {}).files || []);
    var supportFiles = Array.prototype.slice.call((q('[data-support-files]') || {}).files || []);
    var status = q('[data-contract-runtime-status]');
    if(!contractFiles.length){
      if(status){ status.textContent = t('contract.error.upload_required', 'Upload at least one contract or guaranty file.'); }
      return;
    }
    if(status){ status.textContent = t('contract.status.creating', 'Creating standalone contract session...'); }
    try {
      state.session = await api.createContractIntelligenceSession(contractFiles, supportFiles);
      setCurrentSessionId(state.session.session_id);
      render();
      if(status){ status.textContent = t('contract.status.created', 'Standalone contract session created. Run analysis to extract clause findings.'); }
      if(isBuilderMode()){
        await generateDraft();
      }
    } catch (error){
      if(status){ status.textContent = error.message || t('contract.error.create_failed', 'Could not create the standalone contract session.'); }
    }
  }

  async function analyzeSession(){
    var status = q('[data-contract-runtime-status]');
    if(!state.session){
      if(status){ status.textContent = t('contract.error.upload_required', 'Upload at least one contract or guaranty file.'); }
      return;
    }
    if(status){ status.textContent = t('contract.status.analyzing', 'Analyzing contract clauses...'); }
    try {
      state.session = await api.analyzeContractIntelligenceSession(state.session.session_id);
      render();
      if(status){ status.textContent = t('contract.status.analyzed', 'Contract analysis completed.'); }
    } catch (error){
      if(status){ status.textContent = error.message || t('contract.error.analyze_failed', 'Contract analysis failed.'); }
    }
  }

  async function generateDraft(){
    var status = q('[data-contract-runtime-status]');
    if(!state.session){
      if(status){ status.textContent = t('contract.error.upload_required', 'Upload at least one contract or guaranty file.'); }
      return;
    }
    if(status){ status.textContent = t('contract.status.generating', 'Generating improved draft...'); }
    try {
      state.session = await api.generateContractIntelligenceDraft(state.session.session_id);
      render();
      if(status){ status.textContent = t('contract.status.generated', 'Improved draft and memo are ready to download.'); }
    } catch (error){
      if(status){ status.textContent = error.message || t('contract.error.generate_failed', 'Could not generate the improved draft.'); }
    }
  }

  function bind(){
    var generate = q('[data-contract-generate]');
    if(generate && isBuilderMode()){
      generate.textContent = t('contract.action.generate_stronger', 'Generate stronger version');
    }
    var form = q('[data-contract-upload-form]');
    if(form){ form.addEventListener('submit', createSession); }
    var analyze = q('[data-contract-analyze]');
    if(analyze){ analyze.addEventListener('click', analyzeSession); }
    if(generate){ generate.addEventListener('click', generateDraft); }
    refreshSession();
  }

  document.addEventListener('vcx:i18n:change', render);

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();
