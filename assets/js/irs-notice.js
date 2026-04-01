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
  function renderSummary(){
    var node = q('[data-irs-summary]');
    if(!node){ return; }
    var record = state.record || {};
    var summary = (state.packet && state.packet.summary) || {};
    node.innerHTML = '<div class="summary-grid">' +
      '<div class="summary-item"><span>Notice number</span><strong>' + escapeHtml(summary.notice_number || 'Not detected') + '</strong></div>' +
      '<div class="summary-item"><span>Tax year</span><strong>' + escapeHtml(summary.tax_year || 'Not detected') + '</strong></div>' +
      '<div class="summary-item"><span>Claimed amount</span><strong>' + escapeHtml(summary.claimed_amount || '-') + '</strong></div>' +
      '<div class="summary-item"><span>Keywords</span><strong>' + escapeHtml(((summary.keywords || []).join(', ')) || 'None detected') + '</strong></div>' +
      '<div class="summary-item"><span>Workflow</span><strong>' + escapeHtml(summary.workflow_slug || record.workflow_slug || 'irs_notice') + '</strong></div>' +
      '<div class="summary-item"><span>Current stage</span><strong>' + escapeHtml(humanize(record.current_stage || 'classified', 'classified')) + '</strong></div>' +
    '</div>';
  }
  function renderNextStep(){
    var node = q('[data-irs-next-step]');
    if(!node){ return; }
    var packet = state.packet || {};
    node.innerHTML =
      '<div class="inline-alert is-info"><strong>Recommended next step</strong><span>' + escapeHtml(humanize(packet.next_step, 'build response packet')) + '</span></div>' +
      '<p class="micro-note">Nothing is sent automatically. Review the notice, confirm the supporting records, and export only after you are comfortable with the response path.</p>';
  }
  function renderDeadlines(){
    var node = q('[data-irs-deadlines]');
    var items = (state.packet && state.packet.deadlines) || [];
    if(!node){ return; }
    if(!items.length){
      node.innerHTML = '<p class="empty-copy">No deadlines detected yet.</p>';
      return;
    }
    node.innerHTML = items.map(function(item){
      return '<div class="deadline-card urgency-' + escapeHtml(item.urgency || 'medium') + '">' +
        '<strong>' + escapeHtml(item.label || 'Detected deadline') + '</strong>' +
        '<span>' + escapeHtml(item.date || 'Date unresolved') + '</span>' +
        '<small>' + escapeHtml(item.source_file || 'Source file not identified') + '</small>' +
      '</div>';
    }).join('');
  }
  function renderMissing(){
    var node = q('[data-irs-missing]');
    var items = (state.packet && state.packet.missing_documents) || [];
    if(!node){ return; }
    if(!items.length){
      node.innerHTML = '<p class="empty-copy">No missing items were flagged from the uploaded notice set.</p>';
      return;
    }
    node.innerHTML = items.map(function(item){
      return '<div class="contact-card"><strong>' + escapeHtml(humanize(item, 'missing item')) + '</strong><span>Review or attach this before exporting the response packet.</span></div>';
    }).join('');
  }
  function renderContacts(){
    var node = q('[data-irs-contacts]');
    var items = (state.packet && state.packet.contacts) || [];
    if(!node){ return; }
    if(!items.length){
      node.innerHTML = '<p class="empty-copy">No official IRS contact path is attached yet.</p>';
      return;
    }
    node.innerHTML = items.map(function(item){
      return '<div class="contact-card"><strong>' + escapeHtml(item.authority_name || 'IRS') + '</strong><span>' + escapeHtml(item.department_name || 'Official route') + '</span>' +
        (item.webform ? '<a class="btn btn-secondary btn-sm" href="' + escapeHtml(item.webform) + '" target="_blank" rel="noreferrer">Open official page</a>' : '') +
      '</div>';
    }).join('');
  }
  function renderOutputs(){
    var node = q('[data-irs-outputs]');
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
    setChip('[data-irs-issue]', humanize(record.issue_category, 'irs notice'), 'info');
    setChip('[data-irs-urgency]', humanize(record.urgency_level, 'medium'), record.urgency_level === 'high' ? 'warning' : 'info');
    setChip('[data-irs-stage]', humanize(record.current_stage, 'classified'), 'info');
    setChip('[data-irs-deadline-chip]', deadline && deadline.date ? deadline.date : 'No deadline detected', deadline ? 'warning' : 'neutral');
    var title = q('[data-page-heading]');
    var headline = q('[data-platform-headline]');
    if(title){ title.textContent = summary.notice_number ? ('IRS Notice ' + summary.notice_number) : 'IRS Notice Builder'; }
    if(headline){
      headline.textContent = summary.tax_year
        ? ('Review the notice for tax year ' + summary.tax_year + ', confirm the next step, and build the packet from one screen.')
        : 'Review the notice, see what matters now, and build a response packet from one screen.';
    }
  }
  function renderEmpty(){
    empty('[data-irs-summary]', 'Open or create a matter first.');
    empty('[data-irs-next-step]', 'Open or create a matter first.');
    empty('[data-irs-deadlines]', 'No matter selected.');
    empty('[data-irs-missing]', 'No matter selected.');
    empty('[data-irs-contacts]', 'No matter selected.');
    empty('[data-irs-outputs]', 'No matter selected.');
  }
  async function loadAll(){
    state.caseId = caseIdFromLocation();
    if(!state.caseId){
      renderEmpty();
      return;
    }
    api.setActiveCaseId(state.caseId);
    qa('[data-irs-open-action-center], [data-irs-mobile-action-center]').forEach(function(link){
      link.setAttribute('href', withCase('/app/action-center/'));
    });
    var workspaceLink = q('[data-irs-open-workspace]');
    if(workspaceLink){ workspaceLink.setAttribute('href', withCase('/app/workspace/')); }
    try {
      state.record = await api.getCase(state.caseId);
      state.packet = await api.buildActionPacket(state.caseId);
      renderHeader();
      renderSummary();
      renderNextStep();
      renderDeadlines();
      renderMissing();
      renderContacts();
      renderOutputs();
    } catch (error){
      empty('[data-irs-summary]', error.message || 'Matter could not be loaded.');
      empty('[data-irs-next-step]', 'Check the matter link and try again.');
      empty('[data-irs-deadlines]', 'Matter could not be loaded.');
      empty('[data-irs-missing]', 'Matter could not be loaded.');
      empty('[data-irs-contacts]', 'Matter could not be loaded.');
      empty('[data-irs-outputs]', 'Matter could not be loaded.');
    }
  }
  function bindActions(){
    qa('[data-irs-build-packet], [data-irs-mobile-build-packet]').forEach(function(button){
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
