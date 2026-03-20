(function(){
  var api = window.DocketMintApi;
  if(!api){ return; }

  var state = { caseId: '', record: null, packet: null };

  function q(selector){ return document.querySelector(selector); }
  function qa(selector){ return Array.prototype.slice.call(document.querySelectorAll(selector) || []); }
  function params(){
    try { return new URLSearchParams(window.location.search || ''); }
    catch (error){ return new URLSearchParams(''); }
  }
  function caseIdFromLocation(){
    return params().get('case') || (api.getActiveCaseId ? (api.getActiveCaseId() || '') : '');
  }
  function escapeHtml(value){
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  function humanize(value, fallback){
    var text = String(value || fallback || '').trim();
    return text ? text.replace(/_/g, ' ') : (fallback || '-');
  }
  function withCase(href){
    try {
      var url = new URL(href, window.location.origin);
      if(state.caseId){ url.searchParams.set('case', state.caseId); }
      return url.pathname + url.search + url.hash;
    } catch (error){
      return href;
    }
  }
  function setChip(selector, label, tone){
    var node = q(selector);
    if(!node){ return; }
    node.textContent = label;
    node.className = 'status-chip ' + (tone ? ('is-' + tone) : 'is-neutral');
  }
  function empty(selector, message){
    var node = q(selector);
    if(node){ node.innerHTML = '<p class="empty-copy">' + escapeHtml(message) + '</p>'; }
  }
  function boolText(value){
    return value ? 'Detected' : 'Not detected';
  }
  function renderSummary(){
    var node = q('[data-recovery-summary]');
    var summary = (state.packet && state.packet.summary) || {};
    if(!node){ return; }
    node.innerHTML = '<div class="summary-grid">' +
      '<div class="summary-item"><span>Supported balance</span><strong>' + escapeHtml(summary.supported_balance || '-') + '</strong></div>' +
      '<div class="summary-item"><span>Invoices found</span><strong>' + escapeHtml(summary.invoice_count || 0) + '</strong></div>' +
      '<div class="summary-item"><span>Evidence gaps</span><strong>' + escapeHtml(summary.evidence_gap_count || 0) + '</strong></div>' +
      '<div class="summary-item"><span>Invoice numbers</span><strong>' + escapeHtml(((summary.invoice_numbers || []).join(', ')) || 'Not detected') + '</strong></div>' +
    '</div>';
  }
  function renderFindings(){
    var node = q('[data-recovery-findings]');
    var summary = (state.packet && state.packet.summary) || {};
    if(!node){ return; }
    node.innerHTML =
      '<div class="contact-card"><strong>Contract detected</strong><span>' + escapeHtml(boolText(summary.has_contract)) + '</span></div>' +
      '<div class="contact-card"><strong>Personal guaranty</strong><span>' + escapeHtml(boolText(summary.has_personal_guaranty)) + '</span></div>' +
      '<div class="contact-card"><strong>Attorneys\' fees clause</strong><span>' + escapeHtml(boolText(summary.has_attorneys_fees_clause)) + '</span></div>' +
      '<div class="contact-card"><strong>Venue clause</strong><span>' + escapeHtml(boolText(summary.has_venue_clause)) + '</span></div>' +
      '<div class="contact-card"><strong>Performance proof</strong><span>' + escapeHtml(boolText(summary.performance_proof_present)) + '</span></div>';
  }
  function renderGaps(){
    var node = q('[data-recovery-gaps]');
    var items = (state.packet && state.packet.missing_documents) || [];
    if(!node){ return; }
    if(!items.length){
      node.innerHTML = '<p class="empty-copy">No major evidence gaps were flagged from the uploaded record.</p>';
      return;
    }
    node.innerHTML = items.map(function(item){
      return '<div class="contact-card"><strong>' + escapeHtml(humanize(item, 'missing item')) + '</strong><span>Review or attach this before exporting the demand packet.</span></div>';
    }).join('');
  }
  function renderNextStep(){
    var node = q('[data-recovery-next-step]');
    var packet = state.packet || {};
    if(!node){ return; }
    node.innerHTML =
      '<div class="inline-alert is-info"><strong>Recommended next step</strong><span>' + escapeHtml(humanize(packet.next_step, 'demand path')) + '</span></div>' +
      '<p class="micro-note">Nothing is sent automatically. Review the balance, supporting proof, and draft language before sending any demand or settlement communication.</p>';
  }
  function renderContacts(){
    var node = q('[data-recovery-contacts]');
    var items = (state.packet && state.packet.contacts) || [];
    if(!node){ return; }
    if(!items.length){
      node.innerHTML = '<p class="empty-copy">No official contact path is attached to this recovery matter yet.</p>';
      return;
    }
    node.innerHTML = items.map(function(item){
      return '<div class="contact-card"><strong>' + escapeHtml(item.authority_name || 'Official route') + '</strong><span>' + escapeHtml(item.department_name || 'Department not specified') + '</span>' +
        (item.webform ? '<a class="btn btn-secondary btn-sm" href="' + escapeHtml(item.webform) + '" target="_blank" rel="noreferrer">Open official page</a>' : '') +
      '</div>';
    }).join('');
  }
  function renderOutputs(){
    var node = q('[data-recovery-packet]');
    var items = (state.packet && state.packet.outputs) || [];
    if(!node){ return; }
    if(!items.length){
      node.innerHTML = '<p class="empty-copy">No packet outputs are ready yet.</p>';
      return;
    }
    node.innerHTML = items.map(function(item){
      var link = item.download_url ? '<a class="btn btn-secondary btn-sm" href="' + escapeHtml(api.toDownloadUrl(item.download_url)) + '">Download</a>' : '';
      return '<div class="output-card"><div><strong>' + escapeHtml(item.label || item.type) + '</strong><span>' + escapeHtml(humanize(item.status, 'available')) + '</span></div>' + link + '</div>';
    }).join('');
  }
  function renderHeader(){
    var record = state.record || {};
    var summary = (state.packet && state.packet.summary) || {};
    var deadline = ((state.packet && state.packet.deadlines) || [])[0] || null;
    setChip('[data-recovery-issue]', humanize(record.issue_category, 'invoice recovery'), 'info');
    setChip('[data-recovery-urgency]', humanize(record.urgency_level, 'medium'), record.urgency_level === 'high' ? 'warning' : 'info');
    setChip('[data-recovery-stage]', humanize(record.current_stage, 'classified'), 'info');
    setChip('[data-recovery-deadline]', deadline && deadline.date ? deadline.date : 'No deadline detected', deadline ? 'warning' : 'neutral');
    var title = q('[data-page-heading]');
    var headline = q('[data-platform-headline]');
    if(title){ title.textContent = summary.supported_balance ? ('Invoice Recovery | ' + summary.supported_balance) : 'Invoice Recovery OS'; }
    if(headline){
      headline.textContent = 'Review supported balance, spot evidence gaps, and build the next recovery packet from one screen.';
    }
  }
  function renderEmpty(){
    empty('[data-recovery-summary]', 'Open or create a matter first.');
    empty('[data-recovery-findings]', 'Open or create a matter first.');
    empty('[data-recovery-gaps]', 'No matter selected.');
    empty('[data-recovery-next-step]', 'Open or create a matter first.');
    empty('[data-recovery-contacts]', 'No matter selected.');
    empty('[data-recovery-packet]', 'No matter selected.');
  }
  async function loadAll(){
    state.caseId = caseIdFromLocation();
    if(!state.caseId){
      renderEmpty();
      return;
    }
    api.setActiveCaseId(state.caseId);
    qa('[data-recovery-open-action-center], [data-recovery-mobile-action-center]').forEach(function(link){
      link.setAttribute('href', withCase('/app/action-center/'));
    });
    var workspaceLink = q('[data-recovery-open-workspace]');
    if(workspaceLink){ workspaceLink.setAttribute('href', withCase('/app/workspace/')); }
    try {
      state.record = await api.getCase(state.caseId);
      state.packet = await api.buildActionPacket(state.caseId);
      renderHeader();
      renderSummary();
      renderFindings();
      renderGaps();
      renderNextStep();
      renderContacts();
      renderOutputs();
    } catch (error){
      empty('[data-recovery-summary]', error.message || 'Matter could not be loaded.');
      empty('[data-recovery-findings]', 'Check the matter link and try again.');
      empty('[data-recovery-gaps]', 'Matter could not be loaded.');
      empty('[data-recovery-next-step]', 'Matter could not be loaded.');
      empty('[data-recovery-contacts]', 'Matter could not be loaded.');
      empty('[data-recovery-packet]', 'Matter could not be loaded.');
    }
  }
  function bindActions(){
    qa('[data-build-recovery-packet], [data-mobile-build-recovery-packet]').forEach(function(button){
      button.addEventListener('click', function(){
        loadAll();
      });
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
