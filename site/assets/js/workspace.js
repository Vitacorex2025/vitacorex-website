(function(){
  var api = window.DocketMintApi;
  var i18n = window.VCXI18n;
  if(!api){ return; }

  function params(){
    try { return new URLSearchParams(window.location.search || ''); }
    catch (error){ return new URLSearchParams(''); }
  }

  function q(selector){ return document.querySelector(selector); }
  function qa(selector){ return Array.prototype.slice.call(document.querySelectorAll(selector) || []); }
  function safeArray(values){ return Array.isArray(values) ? values : []; }
  function t(key, fallback){ return i18n ? i18n.t(key, fallback) : fallback; }

  var els = {
    body: document.body,
    overlay: q('[data-app-overlay]'),
    sidebar: q('[data-app-sidebar]'),
    sidebarToggle: q('[data-sidebar-toggle]'),
    pageHeading: q('[data-page-heading]'),
    apiStatus: q('[data-api-status]'),
    caseSearch: q('[data-case-search]'),
    createForm: q('[data-create-case-form]'),
    reviewForms: qa('[data-review-form]'),
    refreshCases: q('[data-refresh-cases]'),
    refreshCase: q('[data-refresh-case]'),
    caseList: q('[data-case-list]'),
    sourceDropzone: q('[data-source-dropzone]'),
    sourceInput: document.getElementById('sourceFilesInput'),
    sourcePicker: q('[data-source-picker]'),
    sourceStored: q('[data-source-stored]'),
    splitCase: q('[data-split-case]'),
    startProcessing: q('[data-start-processing]'),
    processingSummary: q('[data-processing-summary]'),
    processingState: q('[data-processing-state]'),
    processingTask: q('[data-processing-task]'),
    processingStats: q('[data-processing-stats]'),
    processingProgress: q('[data-processing-progress]'),
    processingProgressFill: q('[data-processing-progress-fill]'),
    extractedSummary: q('[data-extracted-summary]'),
    sourceSetSummary: q('[data-source-set-summary]'),
    uploadOverallBar: q('[data-upload-overall-bar]'),
    uploadOverallFill: q('[data-upload-overall-fill]'),
    uploadOverallStats: q('[data-upload-overall-stats]'),
    uploadProgressList: q('[data-upload-progress-list]'),
    runSunbiz: q('[data-run-sunbiz]'),
    sunbizContent: q('[data-sunbiz-content]'),
    sunbizStatus: q('[data-sunbiz-status]'),
    sunbizPdf: q('[data-sunbiz-pdf]'),
    generateSelected: q('[data-generate-selected]'),
    generateAll: q('[data-generate-all]'),
    docSelection: q('[data-document-selection]'),
    selectAllDocs: q('[data-select-all-docs]'),
    clearAllDocs: q('[data-clear-all-docs]'),
    generationSummary: q('[data-generation-summary]'),
    generationOverallFill: q('[data-generation-overall-fill]'),
    generationOverallText: q('[data-generation-overall-text]'),
    generationCurrent: q('[data-generation-current]'),
    generationList: q('[data-generation-progress-list]'),
    generatedList: q('[data-generated-list]'),
    zipRow: q('[data-zip-row]'),
    zipDownload: q('[data-zip-download]'),
    blockerCount: q('[data-blocker-count]'),
    warningCount: q('[data-warning-count]'),
    blockerList: q('[data-blocker-list]'),
    warningList: q('[data-warning-list]'),
    activityList: q('[data-activity-list]'),
    communicationsList: q('[data-communications-list]'),
    communicationForm: q('[data-communication-form]'),
    communicationSummary: q('[data-communication-summary]'),
    communicationBody: q('[data-communication-body]'),
    settlementForm: q('[data-settlement-form]'),
    settlementList: q('[data-settlement-list]'),
    settlementType: q('[data-settlement-type]'),
    settlementStatus: q('[data-settlement-status]'),
    settlementTitle: q('[data-settlement-title]'),
    settlementAmount: q('[data-settlement-amount]'),
    settlementPayments: q('[data-settlement-payments]'),
    settlementFirstDate: q('[data-settlement-first-date]'),
    settlementSummary: q('[data-settlement-summary]'),
    settlementTerms: q('[data-settlement-terms]'),
    deadlineEngine: q('[data-deadline-engine]'),
    deadlineOverrideForm: q('[data-deadline-override-form]'),
    deadlineOverrideLabel: q('[data-deadline-override-label]'),
    deadlineOverrideDate: q('[data-deadline-override-date]'),
    deadlineOverrideReason: q('[data-deadline-override-reason]'),
    packetArchiveSummary: q('[data-packet-archive-summary]'),
    countyCandidates: q('[data-county-candidates]'),
    invoiceLedger: q('[data-invoice-ledger]'),
    reconciliationSummary: q('[data-reconciliation-summary]'),
    legalCounts: q('[data-legal-counts]'),
    caseTitle: q('[data-case-title]'),
    caseSubtitle: q('[data-case-subtitle]'),
    caseStatus: q('[data-case-status]'),
    activeCase: q('[data-active-case]'),
    nextAction: q('[data-next-action]'),
    nextActionInline: q('[data-next-action-inline]'),
    readinessCopy: q('[data-readiness-copy]'),
    caseStatusCopy: q('[data-case-status-copy]'),
    packetReady: q('[data-packet-ready]'),
    caseUpdated: q('[data-case-updated]'),
    dashboardCaseCount: q('[data-dashboard-case-count]'),
    metricFiles: q('[data-metric-files]'),
    metricTemplates: q('[data-metric-templates]'),
    metricVenue: q('[data-metric-venue]'),
    metricCourt: q('[data-metric-court]'),
    generationReadiness: q('[data-generation-readiness]'),
    generationState: q('[data-generation-state]'),
    generationNote: q('[data-generation-note]'),
    generationWarnings: q('[data-generation-warnings]'),
    navButtons: qa('[data-nav-target]'),
    preserveCaseLinks: qa('[data-preserve-case]'),
    screenLinks: qa('[data-screen-link]'),
    issueCategory: q('[data-issue-category]'),
    urgency: q('[data-urgency]'),
    currentStage: q('[data-current-stage]'),
    documentType: q('[data-document-type]'),
    primaryDeadline: q('[data-primary-deadline]'),
    primaryNextStep: q('[data-primary-next-step]'),
    packetStatus: q('[data-packet-status]'),
    intakeCategory: q('[data-intake-category]'),
    linkedRecords: q('[data-linked-records]')
  };

  var state = {
    cases: [],
    currentCaseId: null,
    currentCase: null,
    registry: null,
    registryCaseId: '',
    activity: [],
    selectedDocumentTypes: [],
    uploadItems: {},
    uploadOrder: [],
    isUploading: false,
    isProcessing: false,
    isRunningSunbiz: false,
    isGenerating: false,
    generationPoller: null,
    processingTimers: []
  };

  function currentScreen(){
    return (document.body && document.body.getAttribute('data-app-screen')) || '';
  }

  function currentCategory(){
    return params().get('category') || '';
  }

  function currentEngine(){
    var engine = String(params().get('engine') || '').trim().toLowerCase();
    return engine === 'legal' ? 'legal' : 'recovery';
  }

  function currentRecordType(){
    return currentEngine() === 'legal' ? 'legal_matter' : 'recovery_record';
  }

  function linkedCaseId(){
    return String(params().get('linked_case') || '').trim();
  }

  function createVerb(){
    return currentEngine() === 'legal' ? 'legal matter' : 'recovery record';
  }

  function shouldReturnToActionCenter(){
    return params().get('return') === 'action-center';
  }

  function isCreateMode(){
    var screen = currentScreen();
    var explicitCase = params().get('case') || '';
    var mode = params().get('mode') || '';
    return screen === 'new-case' && !explicitCase && mode !== 'edit';
  }

  function isEditMode(){
    return currentScreen() === 'new-case' && !!(params().get('case') || '') || (params().get('mode') === 'edit' && !!(params().get('case') || ''));
  }

  function shouldUseStoredActiveCase(){
    if(isCreateMode()){ return false; }
    var screen = currentScreen();
    return ['workspace', 'uploaded-files', 'review-data', 'entity-check', 'generate-packet', 'downloads', 'contract-review'].indexOf(screen) !== -1;
  }

  function canCreateCases(){
    return !window.DocketMintAuth || !window.DocketMintAuth.canCreateCases || window.DocketMintAuth.canCreateCases();
  }

  function canGeneratePackets(){
    return !window.DocketMintAuth || !window.DocketMintAuth.canGeneratePackets || window.DocketMintAuth.canGeneratePackets();
  }

  function createLockMessage(){
    if(window.DocketMintAuth && window.DocketMintAuth.createLockMessage){
      return window.DocketMintAuth.createLockMessage();
    }
    return 'Only admin users can create recovery matters in this environment.';
  }

  function generateLockMessage(){
    if(window.DocketMintAuth && window.DocketMintAuth.generateLockMessage){
      return window.DocketMintAuth.generateLockMessage();
    }
    return 'Only admin users can generate packet outputs in this environment.';
  }

  async function ensureCaseForUpload(){
    if(state.currentCaseId){ return state.currentCaseId; }
    if(!canCreateCases()){
      throw new Error(createLockMessage());
    }
    clearStoredActiveCaseId();
    var created = await api.createCase({
      reference: null,
      matter_name: null,
      plaintiff_name: null,
      defendant_name: null,
      notes: null,
      environment_tag: 'recovery',
      record_type: 'recovery_record'
    });
    state.currentCaseId = created.id;
    state.currentCase = created;
    setStoredActiveCaseId(created.id);
    setQueryCase(created.id);
    rewritePreservedLinks();
    renderCase(created);
    await loadCases();
    return created.id;
  }


  function getStoredActiveCaseId(){
    return api.getActiveCaseId ? api.getActiveCaseId() : '';
  }

  function setStoredActiveCaseId(value){
    if(api.setActiveCaseId){ return api.setActiveCaseId(value); }
    return '';
  }

  function clearStoredActiveCaseId(){
    if(api.clearActiveCaseId){ api.clearActiveCaseId(); }
  }

  function escapeHtml(value){
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function money(value){
    var number = Number(value || 0);
    if(!isFinite(number)){ number = 0; }
    try { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(number); }
    catch (error){ return '$' + number.toFixed(2); }
  }

  function formatDate(value){
    if(!value){ return 'Not available'; }
    try {
      return new Intl.DateTimeFormat('en-US', {
        year:'numeric', month:'short', day:'numeric', hour:'numeric', minute:'2-digit'
      }).format(new Date(value));
    } catch (error){
      return String(value);
    }
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

  function formatSpeed(value){
    var number = Number(value || 0);
    if(!isFinite(number) || number <= 0){ return '-'; }
    return formatBytes(number) + '/s';
  }

  function formatEta(seconds){
    var value = Number(seconds);
    if(!isFinite(value) || value < 0){ return '-'; }
    if(value < 60){ return Math.round(value) + 's'; }
    var minutes = Math.floor(value / 60);
    var rem = Math.round(value % 60);
    return minutes + 'm ' + rem + 's';
  }

  function humanType(value){
    var map = {
      contract_pdf: 'Contract PDF',
      guaranty_pdf: 'Guaranty PDF',
      invoice_excel: 'Invoice Excel',
      invoice_csv: 'Invoice CSV',
      invoice_pdf: 'Invoice PDF',
      account_statement_pdf: 'Account Statement PDF',
      supporting_exhibit: 'Supporting Exhibit',
      demand_letter: 'Demand Letter',
      complaint: 'Complaint',
      civil_cover_sheet: 'Civil Cover Sheet',
      request_for_issuance_of_summons: 'Request for Issuance of Summons',
      summons_company: 'Summons - Company',
      summons_individual: 'Summons - Individual',
      motion_for_clerks_default: "Motion for Clerk's Default",
      proposed_final_judgment: 'Proposed Final Judgment',
      debt_calculation_sheet: 'Debt Calculation Sheet',
      affidavit_of_amount_due: 'Affidavit of Amount Due',
      exhibit_index: 'Exhibit Index'
    };
    return map[value] || String(value || 'item').replace(/_/g, ' ');
  }

  function extractionStatusLabel(value){
    var map = {
      extracted_successfully: 'Extracted successfully',
      partially_extracted: 'Partially extracted',
      failed: 'Failed',
      pending: 'Pending'
    };
    return map[value] || String(value || 'pending').replace(/_/g, ' ');
  }

  function statusClass(status){
    var normalized = String(status || '').toLowerCase();
    if(normalized === 'extracted_successfully'){ return 'is-success'; }
    if(normalized === 'partially_extracted'){ return 'is-warning'; }
    if(normalized === 'completed_with_blockers'){ return 'is-warning'; }
    if(normalized === 'generated' || normalized.indexOf('packet_generated') !== -1){ return 'is-success'; }
    if(normalized.indexOf('complete') !== -1 || normalized.indexOf('ready') !== -1 || normalized === 'uploaded'){ return 'is-ready'; }
    if(normalized.indexOf('blocked') !== -1 || normalized.indexOf('failed') !== -1 || normalized.indexOf('review') !== -1 || normalized.indexOf('warning') !== -1){ return 'is-warning'; }
    if(normalized.indexOf('upload') !== -1 || normalized.indexOf('process') !== -1 || normalized.indexOf('generating') !== -1){ return 'is-info'; }
    return 'is-neutral';
  }

  function humanLabel(value, fallback){
    var text = String(value == null ? '' : value).trim();
    if(!text){ return fallback || '-'; }
    return text.replace(/_/g, ' ');
  }

  function resetForm(form){
    if(form && form.reset){ form.reset(); }
  }

  function valueOrDash(value){
    return value == null || value === '' ? '-' : String(value);
  }

  function currentWorkspaceModules(caseRecord){
    return caseRecord && caseRecord.workflow_payload && caseRecord.workflow_payload.recovery_workspace_modules
      ? caseRecord.workflow_payload.recovery_workspace_modules
      : {};
  }

  function closeSidebar(){
    document.body.classList.remove('sidebar-open');
    document.body.classList.remove('app-nav-open');
    if(els.overlay){ els.overlay.hidden = true; }
    if(els.sidebar){ els.sidebar.scrollTop = 0; }
  }

  function getRegistryTemplates(){
    return safeArray(state.registry && state.registry.templates);
  }

  function templateByType(documentType){
    var templates = getRegistryTemplates();
    for(var index = 0; index < templates.length; index += 1){
      if(templates[index] && templates[index].document_type === documentType){ return templates[index]; }
    }
    return null;
  }

  function templateSelectable(template){
    if(!template){ return false; }
    return template.generation_allowed !== false;
  }

  function selectableDocumentTypes(){
    return getRegistryTemplates().filter(templateSelectable).map(function(item){ return item.document_type; });
  }

  function checkedDocumentTypes(){
    return qa('[data-doc-checkbox]:checked').map(function(node){ return node.getAttribute('data-doc-checkbox'); });
  }

  function syncGenerationControls(){
    var allowed = selectableDocumentTypes();
    var generationLocked = !canGeneratePackets();
    qa('[data-doc-checkbox]').forEach(function(node){
      var template = templateByType(node.getAttribute('data-doc-checkbox'));
      node.disabled = generationLocked || state.isGenerating || !templateSelectable(template);
      if(node.disabled && node.checked && allowed.indexOf(node.getAttribute('data-doc-checkbox')) === -1){
        node.checked = false;
      }
    });
    var checked = checkedDocumentTypes().filter(function(item){
      return allowed.indexOf(item) !== -1;
    });
    if(els.generateSelected){ els.generateSelected.disabled = generationLocked || !state.currentCaseId || state.isGenerating || !checked.length; }
    if(els.generateAll){ els.generateAll.disabled = generationLocked || !state.currentCaseId || state.isGenerating || !allowed.length; }
    if(els.selectAllDocs){ els.selectAllDocs.disabled = generationLocked || state.isGenerating || !getRegistryTemplates().length || !allowed.length; }
    if(els.clearAllDocs){ els.clearAllDocs.disabled = generationLocked || state.isGenerating || !checkedDocumentTypes().length; }
  }

  function stopProcessingTimers(){
    safeArray(state.processingTimers).forEach(function(timerId){ window.clearTimeout(timerId); });
    state.processingTimers = [];
  }

  function renderProcessingBanner(options){
    options = options || {};
    var percent = Number(options.percent || 0);
    if(percent < 0){ percent = 0; }
    if(percent > 100){ percent = 100; }
    if(els.processingState){ els.processingState.textContent = options.label || t('workspace.processing.queued', 'Queued'); }
    if(els.processingTask){ els.processingTask.textContent = options.task || t('workspace.processing.none', 'No processing in progress.'); }
    if(els.processingStats){ els.processingStats.textContent = options.stats || t('workspace.processing.stats_empty', '0 / 0 stages completed'); }
    if(els.processingProgressFill){ els.processingProgressFill.style.width = percent + '%'; }
    if(els.processingProgress){
      els.processingProgress.setAttribute('aria-valuenow', String(percent));
    }
  }

  function beginProcessingFlow(task){
    state.isProcessing = true;
    stopProcessingTimers();
    renderProcessingBanner({
      label: t('workspace.processing.active', 'Processing'),
      task: task || t('workspace.processing.parsing', 'Parsing source documents.'),
      stats: t('workspace.processing.stage_1', '1 / 4 stages reached'),
      percent: 12
    });
    state.processingTimers = [
      window.setTimeout(function(){
        if(!state.isProcessing){ return; }
        renderProcessingBanner({
          label: t('workspace.processing.active', 'Processing'),
          task: t('workspace.processing.parsing', 'Parsing source documents.'),
          stats: t('workspace.processing.stage_2', '2 / 4 stages reached'),
          percent: 38
        });
      }, 250),
      window.setTimeout(function(){
        if(!state.isProcessing){ return; }
        renderProcessingBanner({
          label: t('workspace.processing.active', 'Processing'),
          task: t('workspace.processing.normalizing', 'Normalizing case data.'),
          stats: t('workspace.processing.stage_3', '3 / 4 stages reached'),
          percent: 68
        });
      }, 900),
      window.setTimeout(function(){
        if(!state.isProcessing){ return; }
        renderProcessingBanner({
          label: t('workspace.processing.active', 'Processing'),
          task: t('workspace.processing.validating', 'Validating readiness and blockers.'),
          stats: t('workspace.processing.stage_4', '4 / 4 stages reached'),
          percent: 88
        });
      }, 1800)
    ];
  }

  function finishProcessingFlow(caseRecord, message, tone){
    state.isProcessing = false;
    stopProcessingTimers();
    renderProcessingBanner({
      label: tone === 'warning' ? t('workspace.filter.blocked', 'Blocked') : t('workspace.processing.complete', 'Complete'),
      task: message || t('workspace.processing.finished', 'Processing finished.'),
      stats: t('workspace.processing.stats_done', '4 / 4 stages completed'),
      percent: 100
    });
    if(els.startProcessing){ els.startProcessing.disabled = false; }
    renderCase(caseRecord || state.currentCase || null);
  }

  function failProcessingFlow(message){
    state.isProcessing = false;
    stopProcessingTimers();
    renderProcessingBanner({
      label: t('workspace.processing.failed', 'Failed'),
      task: message || t('workspace.processing.failed.copy', 'Processing failed.'),
      stats: t('workspace.processing.stopped', 'Processing stopped before completion'),
      percent: 100
    });
    if(els.startProcessing){ els.startProcessing.disabled = false; }
  }

  function showToast(message, tone){
    var id = 'docketmint-toast-root';
    var root = document.getElementById(id);
    if(!root){
      root = document.createElement('div');
      root.id = id;
      root.className = 'toast-stack';
      document.body.appendChild(root);
    }
    var item = document.createElement('div');
    item.className = 'app-toast ' + (tone ? 'is-' + tone : 'is-info');
    item.textContent = message;
    root.appendChild(item);
    window.setTimeout(function(){
      item.classList.add('is-leaving');
      window.setTimeout(function(){
        if(item.parentNode){ item.parentNode.removeChild(item); }
      }, 220);
    }, 3200);
  }

  function setQueryCase(caseId){
    try {
      var url = new URL(window.location.href);
      if(caseId){ url.searchParams.set('case', caseId); }
      else { url.searchParams.delete('case'); }
      window.history.replaceState({}, '', url.toString());
    } catch (error){}
  }

  function withCase(href, caseId){
    if(!href){ return href; }
    try {
      var url = new URL(href, window.location.href);
      if(caseId){ url.searchParams.set('case', caseId); }
      if(currentCategory() && !url.searchParams.get('category') && /^\/app\//i.test(url.pathname || '')){
        url.searchParams.set('category', currentCategory());
      }
      return url.pathname + url.search + url.hash;
    } catch (error){
      return href;
    }
  }

  function redirectToActionCenter(caseId){
    window.location.href = withCase('../action-center/', caseId || state.currentCaseId);
  }

  function rewritePreservedLinks(){
    safeArray(els.preserveCaseLinks).forEach(function(link){
      var href = link.getAttribute('href') || '';
      link.setAttribute('data-base-href', href);
      link.setAttribute('href', withCase(href, state.currentCaseId));
    });
    safeArray(els.screenLinks).forEach(function(link){
      var href = link.getAttribute('href') || '';
      link.setAttribute('data-base-href', href);
      link.setAttribute('href', withCase(href, state.currentCaseId));
    });
  }

  function goToScreen(screen, caseId){
    var link = q('[data-screen-link="' + screen + '"]');
    if(!link){ return; }
    var target = withCase(link.getAttribute('data-base-href') || link.getAttribute('href') || '', caseId || state.currentCaseId);
    closeSidebar();
    window.location.href = target;
  }

  function workflowSummary(caseRecord){
    var snapshot = caseRecord && caseRecord.client_snapshot ? caseRecord.client_snapshot : null;
    if(!caseRecord || !snapshot){
      return {
        nextAction: t('workspace.workflow.next_action_initial', 'Upload client files to start a clean matter automatically.'),
        readiness: t('workspace.workflow.awaiting_creation', 'Awaiting matter creation'),
        readinessCopy: t('workspace.workflow.awaiting_copy', 'Upload client files to begin automated extraction.'),
        statusCopy: t('workspace.status.draft', 'Draft')
      };
    }
    var readinessMap = {
      waiting_on_source_evidence: 'Waiting on source evidence',
      ready_to_process: 'Ready to process',
      needs_review: 'Needs review',
      ready_for_verification: 'Ready for verification',
      ready_for_generation: 'Ready for generation',
      output_available: 'Output available'
    };
    return {
      nextAction: snapshot.next_action || t('workspace.workflow.generate_snapshot', 'Upload client files to generate the matter snapshot.'),
      readiness: readinessMap[snapshot.readiness] || String(snapshot.readiness || 'Needs review').replace(/_/g, ' '),
      readinessCopy: snapshot.blocker_count ? (String(snapshot.blocker_count) + ' ' + t('workspace.workflow.blockers_pending', 'blocker(s) still need attention.')) : t('workspace.workflow.ready_copy', 'The current case snapshot is ready.'),
      statusCopy: String(snapshot.status || 'draft').replace(/_/g, ' ')
    };
  }

  function processingFeedback(caseRecord){
    var snapshot = caseRecord && caseRecord.client_snapshot ? caseRecord.client_snapshot : null;
    var blockers = safeArray(snapshot && snapshot.blockers);
    var status = String(caseRecord && caseRecord.status || snapshot && snapshot.status || '').toLowerCase();
    if(blockers.length || status === 'blocked'){
      return {
        message: blockers[0] || t('workspace.workflow.analysis_blocked', 'Analysis finished with blockers that require review before generation.'),
        tone: 'warning'
      };
    }
    if(snapshot && snapshot.readiness === 'ready_for_verification'){
      return {
        message: t('workspace.workflow.analysis_success', 'Analysis complete. Review the extracted matter, run SunBiz if needed, and generate the supported documents you want.'),
        tone: 'success'
      };
    }
    return {
      message: t('workspace.workflow.analysis_review', 'Analysis complete. Review the extracted matter summary and generate the documents you need.'),
      tone: 'success'
    };
  }

  function filteredCases(query){
    var term = String(query || '').trim().toLowerCase();
    if(!term){ return state.cases.slice(); }
    return state.cases.filter(function(item){
      return [item.reference, item.title, item.plaintiff_name, item.defendant_name, item.id].join(' ').toLowerCase().indexOf(term) !== -1;
    });
  }

  function renderCaseList(){
    if(!els.caseList){ return; }
    var items = filteredCases(els.caseSearch && els.caseSearch.value);
    if(!items.length){
      els.caseList.innerHTML = '<p class="empty-copy">' + escapeHtml(t('workspace.empty.case_list', 'No matters yet. Upload client files to start a new matter.')) + '</p>';
      return;
    }
    els.caseList.innerHTML = items.map(function(item){
      var active = state.currentCaseId === item.id ? ' active' : '';
      return '<button class="matter-row' + active + '" data-open-case="' + escapeHtml(item.id) + '" type="button">' +
        '<strong>' + escapeHtml(item.title || item.reference || item.id) + '</strong>' +
        '<span>' + escapeHtml((item.defendant_name || 'Company') + ' | ' + (item.plaintiff_name || 'Client')) + '</span>' +
        '<small>' + escapeHtml(String(item.status || 'draft').replace(/_/g, ' ')) + '</small>' +
      '</button>';
    }).join('');
    qa('[data-open-case]').forEach(function(button){
      button.addEventListener('click', function(){
        openCase(button.getAttribute('data-open-case'));
      });
    });
  }

  function renderMessages(container, items, emptyCopy){
    if(!container){ return; }
    items = safeArray(items);
    if(!items.length){
        container.innerHTML = '<li class="empty-copy">' + escapeHtml(emptyCopy || t('workspace.empty.nothing', 'Nothing to show.')) + '</li>';
      return;
    }
    container.innerHTML = items.map(function(item){ return '<li>' + escapeHtml(item) + '</li>'; }).join('');
  }

  function renderStoredSourceFiles(files){
    if(!els.sourceStored){ return; }
    files = safeArray(files);
    if(!files.length){
        els.sourceStored.innerHTML = '<p class="empty-copy">' + escapeHtml(t('workspace.empty.stored_files', 'No client files uploaded yet.')) + '</p>';
      return;
    }
    els.sourceStored.innerHTML = files.map(function(file){
      var meta = [];
      if(file.file_type){ meta.push(humanType(file.file_type)); }
      if(file.size_bytes){ meta.push(formatBytes(file.size_bytes)); }
      if(file.sha256){ meta.push('dedupe ready'); }
      var excluded = !!file.excluded_from_active_matter;
      var scopeLabel = excluded ? 'Excluded from active matter' : 'Active in matter';
      var toggleLabel = excluded ? 'Use in matter' : 'Exclude';
      var note = excluded && file.exclusion_reason ? '<div class="micro-note">' + escapeHtml(file.exclusion_reason) + '</div>' : '';
      var score = Math.max(0, Math.min(100, Math.round(Number(file.extraction_quality_score || 0) * 100)));
      var qaStatus = extractionStatusLabel(file.extraction_status);
      var method = file.extraction_method ? String(file.extraction_method).replace(/_/g, ' ') : 'direct text';
      var evidence = file.normalized_evidence || {};
      var facts = safeArray(evidence.facts).slice(0, 4);
      var uncertainFields = safeArray(evidence.uncertain_fields).slice(0, 3);
      var conflicts = safeArray(evidence.conflicts).slice(0, 3);
      var parserReport = file.parsed_payload && file.parsed_payload.parser_report ? file.parsed_payload.parser_report : {};
      var selectedSheets = safeArray((file.parsed_payload && file.parsed_payload.selected_worksheets) || parserReport.selected_worksheets).slice(0, 4);
      var factList = facts.length ? '<div class="qa-inline-list">' + facts.map(function(item){
        return '<span class="qa-pill"><strong>' + escapeHtml(item.field || 'field') + ':</strong> ' + escapeHtml(item.value || 'Unclear') + (item.uncertain ? ' <em>(uncertain)</em>' : '') + '</span>';
      }).join('') + '</div>' : '';
      var uncertainList = uncertainFields.length ? '<div class="qa-flag-list">' + uncertainFields.map(function(item){
        return '<span class="qa-flag is-warning">' + escapeHtml((item.field || 'field') + ': ' + (item.reason || 'uncertain')) + '</span>';
      }).join('') + '</div>' : '';
      var conflictList = conflicts.length ? '<div class="qa-flag-list">' + conflicts.map(function(item){
        return '<span class="qa-flag is-danger">' + escapeHtml(item) + '</span>';
      }).join('') + '</div>' : '';
      var worksheetSummary = selectedSheets.length ? '<div class="micro-note"><strong>Worksheet selector:</strong> ' + escapeHtml(selectedSheets.join(' | ')) + '</div>' : '';
      var parserSummary = parserReport && parserReport.worksheet_count ? '<div class="micro-note">Parser report: ' + escapeHtml(String(parserReport.selected_worksheet_count || 0)) + ' selected / ' + escapeHtml(String(parserReport.ignored_worksheet_count || 0)) + ' ignored worksheet(s).</div>' : '';
      var qaSummary = '<div class="stored-item-qa">' +
        '<span class="status-chip ' + statusClass(file.extraction_status) + '">' + escapeHtml(qaStatus) + '</span>' +
        '<span class="micro-note">Quality ' + escapeHtml(String(score)) + '%</span>' +
        '<span class="micro-note">Method ' + escapeHtml(method) + '</span>' +
      '</div>';
      return '<div class="stored-item' + (excluded ? ' is-excluded' : '') + '">' +
        '<div><strong>' + escapeHtml(file.original_filename || file.filename || 'Uploaded file') + '</strong><span>' + escapeHtml(meta.join(' | ') || 'Uploaded') + ' | ' + escapeHtml(scopeLabel) + '</span>' + qaSummary + worksheetSummary + parserSummary + factList + uncertainList + conflictList + note + '</div>' +
        '<div class="stored-item-actions">' +
          '<button class="chip-toggle" data-toggle-source="' + escapeHtml(file.id) + '" data-file-active="' + String(!excluded) + '" type="button">' + escapeHtml(toggleLabel) + '</button>' +
          '<button class="chip-remove" data-remove-source="' + escapeHtml(file.id) + '" type="button">Remove</button>' +
        '</div>' +
      '</div>';
    }).join('');
    qa('[data-toggle-source]').forEach(function(button){
      button.addEventListener('click', async function(){
        if(!state.currentCaseId){ return; }
        var fileId = button.getAttribute('data-toggle-source');
        var active = button.getAttribute('data-file-active') !== 'true';
        try {
          await api.setSourceFileActive(state.currentCaseId, fileId, active, active ? '' : 'Removed from active matter scope by user review.');
          await refreshCurrentCase();
          showToast(active ? 'File returned to the active matter.' : 'File excluded from the active matter.', 'info');
        } catch (error){
          showToast(error.message || 'Could not update file scope.', 'warning');
        }
      });
    });
    qa('[data-remove-source]').forEach(function(button){
      button.addEventListener('click', async function(){
        if(!state.currentCaseId){ return; }
        try {
          await api.removeSourceFile(state.currentCaseId, button.getAttribute('data-remove-source'));
          await refreshCurrentCase();
          showToast('Source file removed.', 'info');
        } catch (error){
          showToast(error.message || 'Could not remove source file.', 'warning');
        }
      });
    });
  }

  function renderUploadProgress(){
    if(!els.uploadProgressList && !els.uploadOverallStats){ return; }
    var items = state.uploadOrder.map(function(id){ return state.uploadItems[id]; }).filter(Boolean);
    var totalLoaded = 0;
    var totalBytes = 0;
    items.forEach(function(item){
      totalLoaded += Number(item.loaded || 0);
      totalBytes += Number(item.total || 0);
    });
    var percent = totalBytes ? Math.round((totalLoaded / totalBytes) * 100) : 0;
    if(els.uploadOverallFill){ els.uploadOverallFill.style.width = percent + '%'; }
    if(els.uploadOverallBar){ els.uploadOverallBar.setAttribute('aria-valuenow', String(percent)); }
    if(els.uploadOverallStats){
      els.uploadOverallStats.textContent = items.length
        ? (percent + '% | ' + formatBytes(totalLoaded) + ' / ' + formatBytes(totalBytes))
        : 'No upload in progress.';
    }
    if(!els.uploadProgressList){ return; }
    if(!items.length){
      els.uploadProgressList.innerHTML = '<p class="empty-copy">Drop PDF and Excel files here. Real upload progress appears immediately.</p>';
      return;
    }
    els.uploadProgressList.innerHTML = items.map(function(item){
      var line = '<div class="upload-progress-item">' +
        '<div class="upload-progress-head"><strong>' + escapeHtml(item.name) + '</strong><span class="status-chip ' + statusClass(item.status) + '">' + escapeHtml(item.status) + '</span></div>' +
        '<div class="progress-track"><span style="width:' + Math.max(0, Math.min(100, Number(item.percent || 0))) + '%"></span></div>' +
        '<div class="upload-progress-meta">' +
          '<span>' + escapeHtml(String(item.percent || 0)) + '%</span>' +
          '<span>' + escapeHtml(formatBytes(item.loaded || 0) + ' / ' + formatBytes(item.total || 0)) + '</span>' +
          '<span>Speed ' + escapeHtml(formatSpeed(item.speedBps)) + '</span>' +
          '<span>ETA ' + escapeHtml(formatEta(item.etaSeconds)) + '</span>' +
        '</div>';
      if(item.message){
        line += '<div class="micro-note">' + escapeHtml(item.message) + '</div>';
      }
      line += '</div>';
      return line;
    }).join('');
  }

  function renderSunbiz(payload, snapshot){
    if(!els.sunbizContent){ return; }
    if(els.sunbizPdf){
      var available = !!(state.currentCaseId && payload && payload.looked_up_at);
      els.sunbizPdf.hidden = !available;
      if(available){
        els.sunbizPdf.href = api.getSunbizPdfUrl(state.currentCaseId);
      }
    }
    if(!payload){
      var emptyCopy = snapshot && snapshot.sunbiz_state === 'provider_unavailable' ? 'SunBiz provider is unavailable. No stored Florida verification snapshot exists.' : 'SunBiz verification has not been run yet. Processing and verification are intentionally separate.';
      els.sunbizContent.innerHTML = '<p class="empty-copy">' + escapeHtml(emptyCopy) + '</p>';
      return;
    }
    var officers = safeArray(payload.officers).map(function(item){
      var parts = [item.officer_name || 'Officer'];
      if(item.officer_title){ parts.push(item.officer_title); }
      if(item.officer_address){ parts.push(item.officer_address); }
      return '<li>' + escapeHtml(parts.join(' - ')) + '</li>';
    }).join('');
    var candidates = safeArray(payload.search_candidates).map(function(item){
      var score = (typeof item.match_score === 'number') ? item.match_score.toFixed(2) : 'n/a';
      return '<li>' + escapeHtml(item.result_name || 'Candidate') + ' - ' + escapeHtml(item.result_status || 'status unavailable') + ' - score ' + escapeHtml(score) + '</li>';
    }).join('');
    var warnings = safeArray(payload.warnings);
    var classification = String(payload.result_classification || '').toLowerCase();
    var headerWarning = '';
    if(classification === 'unavailable'){
      headerWarning = 'Live SunBiz integration is not configured in this environment. No official Florida verification was performed.';
    } else if(classification === 'no_match'){
      headerWarning = 'No Florida Division of Corporations match found. Review is required before using any Florida registered-agent service path.';
    }
    els.sunbizContent.innerHTML =
      ((headerWarning || warnings.length) ? '<div class="inline-alert is-warning">' + escapeHtml([headerWarning].concat(warnings).filter(Boolean).join(' | ')) + '</div>' : '') +
      '<div class="sunbiz-grid">' +
        '<div><strong>Queried entity</strong><span>' + escapeHtml(payload.queried_entity_name || 'Unavailable') + '</span></div>' +
        '<div><strong>Matched entity</strong><span>' + escapeHtml(payload.matched_entity_name || (classification === 'no_match' ? 'No Florida match found' : 'Unavailable')) + '</span></div>' +
        '<div><strong>Status</strong><span>' + escapeHtml(payload.entity_status || payload.provider_status || 'Unavailable') + '</span></div>' +
        '<div><strong>Classification</strong><span>' + escapeHtml(String(payload.result_classification || 'Not run').replace(/_/g, ' ')) + '</span></div>' +
        '<div><strong>Florida document #</strong><span>' + escapeHtml(payload.florida_document_number || 'Unavailable') + '</span></div>' +
        '<div><strong>Registered agent</strong><span>' + escapeHtml(payload.registered_agent_name || 'Unavailable') + '</span></div>' +
        '<div><strong>Registered office</strong><span>' + escapeHtml(payload.registered_agent_address || payload.principal_address || 'Unavailable') + '</span></div>' +
        '<div><strong>Lookup timestamp</strong><span>' + escapeHtml(formatDate(payload.looked_up_at)) + '</span></div>' +
      '</div>' +
      '<div class="sunbiz-officers"><strong>Officers / managers</strong>' + (officers ? '<ul>' + officers + '</ul>' : '<p class="empty-copy">No officers/managers returned.</p>') + '</div>' +
      (safeArray(payload.official_source_urls).length ? '<div class="sunbiz-officers"><strong>Official source URLs</strong><ul>' + safeArray(payload.official_source_urls).map(function(item){ return '<li>' + escapeHtml(item) + '</li>'; }).join('') + '</ul></div>' : '') +
      (candidates ? '<div class="sunbiz-officers"><strong>Search candidates</strong><ul>' + candidates + '</ul></div>' : '');
  }

  function renderGenerated(packet, snapshot){
    if(!els.generatedList){ return; }
    var blockers = safeArray(snapshot && snapshot.blockers);
    var docs = safeArray(packet && packet.documents);
    if(!docs.length || (snapshot && blockers.length)){
      els.generatedList.innerHTML = '<p class="empty-copy">No generated documents available for the current canonical matter.</p>';
      if(els.zipRow){ els.zipRow.hidden = true; }
      return;
    }
    els.generatedList.innerHTML = docs.map(function(doc){
      var url = doc.download_url ? api.toDownloadUrl(doc.download_url) : '';
      var status = String(doc.status || 'generated');
      var action = (url && status === 'generated')
        ? '<a class="btn btn-secondary btn-sm" href="' + escapeHtml(url) + '" target="_blank" rel="noopener">Download Word</a>'
        : '<span class="btn btn-secondary btn-sm is-disabled">Unavailable</span>';
      return '<div class="generated-item">' +
        '<div><strong>' + escapeHtml(doc.document_name) + '</strong>' +
        '<span>' + escapeHtml(humanType(doc.document_type)) + ' | ' + escapeHtml(status.replace(/_/g, ' ')) + (doc.blocking_reason ? ' | ' + escapeHtml(doc.blocking_reason) : '') + '</span></div>' +
        action +
      '</div>';
    }).join('');
    if(els.zipRow){
      var zipUrl = packet && packet.download_url && (!snapshot || snapshot.has_zip) ? api.toDownloadUrl(packet.download_url) : '';
      els.zipRow.hidden = !zipUrl;
      if(els.zipDownload && zipUrl){ els.zipDownload.href = zipUrl; }
    }
  }

  function renderGenerationProgress(progress){
    if(els.generationSummary){ els.generationSummary.textContent = progress && progress.message ? progress.message : 'No generation in progress.'; }
    var percent = progress && typeof progress.progress_percent === 'number' ? progress.progress_percent : 0;
    if(els.generationOverallFill){ els.generationOverallFill.style.width = percent + '%'; }
    if(els.generationOverallText){
      if(progress && progress.total_documents){
        els.generationOverallText.textContent = percent + '% | ' + progress.completed_documents + ' / ' + progress.total_documents + ' complete';
      } else {
        els.generationOverallText.textContent = 'No generation in progress.';
      }
    }
    if(els.generationCurrent){
      els.generationCurrent.textContent = progress && progress.current_document_name ? ('Current: ' + progress.current_document_name) : 'Current: -';
    }
    if(els.generationList){
      var items = safeArray(progress && progress.items);
      if(!items.length){
        els.generationList.innerHTML = '<p class="empty-copy">Select one or more documents. Progress appears here while generation runs.</p>';
      } else {
        els.generationList.innerHTML = items.map(function(item){
          return '<div class="generated-item">' +
            '<div><strong>' + escapeHtml(humanType(item.document_type)) + '</strong>' +
            '<span>' + escapeHtml(String(item.status || 'queued').replace(/_/g, ' ')) + (item.blocking_reason ? ' | ' + escapeHtml(item.blocking_reason) : '') + '</span></div>' +
            '<span class="status-chip ' + statusClass(item.status) + '">' + escapeHtml(item.status) + '</span>' +
          '</div>';
        }).join('');
      }
    }
  }

  function renderDocumentSelection(){
    if(!els.docSelection){ return; }
    var templates = safeArray(state.registry && state.registry.templates);
    if(!templates.length){
      els.docSelection.innerHTML = '<p class="empty-copy">Template availability appears after the matter loads.</p>';
      return;
    }
    if(!state.selectedDocumentTypes.length){
      state.selectedDocumentTypes = templates.map(function(item){ return item.document_type; });
    }
    els.docSelection.innerHTML = templates.map(function(item){
      var checked = state.selectedDocumentTypes.indexOf(item.document_type) !== -1 ? ' checked' : '';
      var availableCopy = item.available ? '' : '<span class="doc-select-note">Template missing in server library.</span>';
      return '<label class="doc-select-item">' +
        '<input data-doc-checkbox="' + escapeHtml(item.document_type) + '" type="checkbox"' + checked + '>' +
        '<div><strong>' + escapeHtml(item.display_name || humanType(item.document_type)) + '</strong><span>' + escapeHtml(item.template_filename || humanType(item.document_type)) + '</span>' + availableCopy + '</div>' +
      '</label>';
    }).join('');
    qa('[data-doc-checkbox]').forEach(function(input){
      input.addEventListener('change', function(){
        state.selectedDocumentTypes = qa('[data-doc-checkbox]:checked').map(function(node){ return node.getAttribute('data-doc-checkbox'); });
      });
    });
  }

  function renderCountyCandidates(caseRecord){
    if(!els.countyCandidates){ return; }
    var items = safeArray(caseRecord && caseRecord.extracted_case_data && caseRecord.extracted_case_data.county_candidates);
    if(!items.length){
      els.countyCandidates.innerHTML = '<p class="empty-copy">County evidence appears after processing.</p>';
      return;
    }
    els.countyCandidates.innerHTML = items.map(function(item){
      return '<div class="candidate-item"><strong>' + escapeHtml(item.county + ' County') + '</strong><span>' + escapeHtml(item.source || 'source') + ' | confidence ' + escapeHtml(String(item.confidence || 0)) + '</span></div>';
    }).join('');
  }

  function renderInvoiceLedger(caseRecord){
    if(!els.invoiceLedger){ return; }
    var summary = caseRecord && caseRecord.extracted_case_data && caseRecord.extracted_case_data.invoice_summary;
    var items = safeArray(summary && summary.line_items);
    if(!items.length){
      els.invoiceLedger.innerHTML = '<p class="empty-copy">Ledger lines appear after processing.</p>';
      return;
    }
    els.invoiceLedger.innerHTML = items.map(function(item){
      return '<div class="ledger-row"><strong>' + escapeHtml(item.invoice_number || 'Invoice') + '</strong><span>' +
        escapeHtml((item.invoice_date || 'No date') + ' | ' + (item.customer_name || 'No customer')) +
        '</span><span>' + escapeHtml(money(item.balance_due)) + '</span></div>';
    }).join('');
  }

  function renderLegalCounts(caseRecord){
    if(!els.legalCounts){ return; }
    var items = safeArray(caseRecord && caseRecord.extracted_case_data && caseRecord.extracted_case_data.legal_counts);
    if(!items.length){
      els.legalCounts.innerHTML = '<p class="empty-copy">Supported counts appear after processing.</p>';
      return;
    }
    els.legalCounts.innerHTML = items.map(function(item){
      return '<div class="rule-item"><strong>' + escapeHtml(item.label || item.code || 'Count') + '</strong><span>' + escapeHtml(item.supported ? 'Supported' : (item.reason || 'Review required')) + '</span></div>';
    }).join('');
  }

  function renderExtractedSummary(caseRecord){
    if(!els.extractedSummary){ return; }
    var data = caseRecord && caseRecord.extracted_case_data;
    var snapshot = caseRecord && caseRecord.client_snapshot ? caseRecord.client_snapshot : null;
    if(!caseRecord || !snapshot){
      els.extractedSummary.innerHTML = '<p class="empty-copy">Processing has not run yet.</p>';
      return;
    }
    var plaintiff = snapshot.plaintiff || 'Needs extraction';
    var defendant = snapshot.defendant || 'Needs extraction';
    var guarantor = snapshot.guarantor || 'None extracted';
    var county = snapshot.venue_county ? snapshot.venue_county + ' County' : 'Needs review';
    var court = snapshot.court_level || 'Needs review';
    var amount = money(snapshot.display_amount || 0);
    var invoices = Number(data && data.amount_reconciliation && data.amount_reconciliation.used_invoice_count || (data && data.invoice_summary && data.invoice_summary.invoice_count) || 0);
    var sourceSet = safeArray(data && (data.source_set_used || data.matter_consistency && data.matter_consistency.source_set_used));
    var governingLaw = snapshot.governing_law || 'Needs review';
    var sunbizState = snapshot.sunbiz_state || 'not_run';
    var consistency = data && data.matter_consistency && data.matter_consistency.status ? data.matter_consistency.status : 'pending';
    els.extractedSummary.innerHTML =
      '<div class="workflow-mini-grid">' +
        '<div class="summary-card"><span>Plaintiff</span><strong>' + escapeHtml(plaintiff) + '</strong></div>' +
        '<div class="summary-card"><span>Debtor entity</span><strong>' + escapeHtml(defendant) + '</strong></div>' +
        '<div class="summary-card"><span>Guarantor</span><strong>' + escapeHtml(guarantor) + '</strong></div>' +
        '<div class="summary-card"><span>Governing law</span><strong>' + escapeHtml(governingLaw) + '</strong></div>' +
        '<div class="summary-card"><span>Venue county</span><strong>' + escapeHtml(county) + '</strong></div>' +
        '<div class="summary-card"><span>Court level</span><strong>' + escapeHtml(court) + '</strong></div>' +
        '<div class="summary-card"><span>Approved amount</span><strong>' + escapeHtml(amount) + '</strong></div>' +
        '<div class="summary-card"><span>Invoice records used</span><strong>' + escapeHtml(String(invoices)) + '</strong><small>' + escapeHtml(sourceSet.length ? (sourceSet.length + ' source file(s) used') : 'Source set pending') + '</small></div>' +
        '<div class="summary-card"><span>Matter consistency</span><strong>' + escapeHtml(String(consistency).replace(/_/g, ' ')) + '</strong></div>' +
        '<div class="summary-card"><span>SunBiz status</span><strong>' + escapeHtml(String(sunbizState).replace(/_/g, ' ')) + '</strong></div>' +
        '<div class="summary-card"><span>Generation blockers</span><strong>' + escapeHtml(String(snapshot.blocker_count || 0)) + '</strong><small>' + escapeHtml(snapshot.blocker_count ? 'Resolve before generation.' : 'No active blockers.') + '</small></div>' +
      '</div>';
  }

  function renderSourceSetSummary(caseRecord){
    if(!els.sourceSetSummary){ return; }
    var data = caseRecord && caseRecord.extracted_case_data;
    if(!data){
      els.sourceSetSummary.innerHTML = '<p class="empty-copy">The single-matter source set used for extraction will appear here after processing.</p>';
      return;
    }
    var consistency = data.matter_consistency || {};
    var sourceSet = safeArray(data.source_set_used || consistency.source_set_used);
    var excluded = safeArray(consistency.excluded_sources);
    var debtors = safeArray(consistency.detected_debtor_entities);
    var plaintiffs = safeArray(consistency.detected_plaintiff_entities);
    var conflicts = safeArray(consistency.conflicts);
    els.sourceSetSummary.innerHTML =
      '<div class="reconciliation-grid">' +
        '<div class="reconciliation-card"><span>Consistency status</span><strong>' + escapeHtml(String(consistency.status || 'pending').replace(/_/g, ' ')) + '</strong></div>' +
        '<div class="reconciliation-card"><span>Anchor plaintiff</span><strong>' + escapeHtml(consistency.anchor_plaintiff_name || 'Needs extraction') + '</strong></div>' +
        '<div class="reconciliation-card"><span>Anchor debtor</span><strong>' + escapeHtml(consistency.anchor_debtor_name || 'Needs extraction') + '</strong></div>' +
      '</div>' +
      '<div class="source-set-list">' +
        '<div><strong>Source set used</strong>' + (sourceSet.length ? '<ul>' + sourceSet.map(function(item){ return '<li>' + escapeHtml(item) + '</li>'; }).join('') + '</ul>' : '<p class="empty-copy">No source files have been approved for the single-matter source set yet.</p>') + '</div>' +
        '<div><strong>Excluded / unrelated sources</strong>' + (excluded.length ? '<ul>' + excluded.map(function(item){ return '<li>' + escapeHtml(item) + '</li>'; }).join('') + '</ul>' : '<p class="empty-copy">No excluded files.</p>') + '</div>' +
      '</div>' +
      '<div class="mini-row"><strong>Detected debtors:</strong> <span>' + escapeHtml(debtors.join(' | ') || 'None yet') + '</span></div>' +
      '<div class="mini-row"><strong>Detected plaintiffs:</strong> <span>' + escapeHtml(plaintiffs.join(' | ') || 'None yet') + '</span></div>' +
      (conflicts.length ? '<div class="mini-row"><strong>Conflicting files:</strong> <span>' + escapeHtml(conflicts.map(function(item){ return (item.source_filename || 'file') + ' [' + (item.conflict_type || 'conflict') + '] ' + safeArray(item.entities).join(', '); }).join(' | ')) + '</span></div>' : '');
  }

  function renderReconciliationSummary(caseRecord){
    if(!els.reconciliationSummary){ return; }
    var data = caseRecord && caseRecord.extracted_case_data;
    var reconciliation = data && data.amount_reconciliation;
    if(!reconciliation){
      els.reconciliationSummary.innerHTML = '<p class="empty-copy">Reconciliation appears after processing.</p>';
      return;
    }
    var modules = currentWorkspaceModules(caseRecord);
    var center = modules.reconciliation_center || {};
    var warnings = safeArray(reconciliation.warnings);
    var blockers = safeArray(reconciliation.blockers);
    var sourceBalances = safeArray(center.source_balances_by_file).slice(0, 6);
    var debtorConflicts = safeArray(center.debtor_conflicts).slice(0, 4);
    var evidenceGaps = safeArray(center.evidence_gaps);
    var matched = Number(center.matched_invoice_count || reconciliation.used_invoice_count || 0);
    var unmatched = Number(center.unmatched_invoice_count || 0);
    var balanceRows = sourceBalances.length
      ? '<div class="mini-row"><strong>Source balances by file:</strong> <span>' + escapeHtml(sourceBalances.map(function(item){
          return (item.file_name || 'file') + ' [' + humanLabel(item.file_type, 'source') + '] ' + (item.balance_hint || 'no amount extracted');
        }).join(' | ')) + '</span></div>'
      : '';
    var conflictRows = debtorConflicts.length
      ? '<div class="mini-row"><strong>Debtor conflicts:</strong> <span>' + escapeHtml(debtorConflicts.map(function(item){
          return (item.source_file || 'file') + ' [' + humanLabel(item.conflict_type, 'conflict') + '] ' + safeArray(item.entities).join(', ');
        }).join(' | ')) + '</span></div>'
      : '';
    var gapRows = evidenceGaps.length
      ? '<div class="mini-row"><strong>Evidence gaps:</strong> <span>' + escapeHtml(evidenceGaps.join(' | ')) + '</span></div>'
      : '<div class="mini-row"><strong>Evidence gaps:</strong> <span>No active evidence gaps in the current source set.</span></div>';
    els.reconciliationSummary.innerHTML =
      '<div class="reconciliation-grid">' +
        '<div class="reconciliation-card"><span>Status</span><strong>' + escapeHtml(String(reconciliation.status || 'pending').replace(/_/g, ' ')) + '</strong></div>' +
        '<div class="reconciliation-card"><span>Source spreadsheet total</span><strong>' + escapeHtml(money(reconciliation.source_spreadsheet_total || reconciliation.spreadsheet_total)) + '</strong><small>' + escapeHtml(String(reconciliation.spreadsheet_invoice_count || 0) + ' invoice(s)') + '</small></div>' +
        '<div class="reconciliation-card"><span>Source invoice PDF total</span><strong>' + escapeHtml(money(reconciliation.source_pdf_total || reconciliation.invoice_pdf_total)) + '</strong><small>' + escapeHtml(String(reconciliation.invoice_pdf_count || 0) + ' invoice PDF(s)') + '</small></div>' +
        '<div class="reconciliation-card"><span>Approved reconciled total</span><strong>' + escapeHtml(money(reconciliation.approved_reconciled_total || reconciliation.approved_total)) + '</strong><small>' + escapeHtml(String(reconciliation.used_invoice_count || 0) + ' invoice record(s) used') + '</small></div>' +
        '<div class="reconciliation-card"><span>Case summary total</span><strong>' + escapeHtml(money(reconciliation.case_summary_total || reconciliation.approved_total)) + '</strong><small>' + escapeHtml(reconciliation.review_approved ? 'Manual review approved' : 'Derived from approved single-matter source set') + '</small></div>' +
        '<div class="reconciliation-card"><span>Matched invoice rows</span><strong>' + escapeHtml(String(matched)) + '</strong><small>' + escapeHtml(String(unmatched) + ' unmatched or low-confidence row(s) remain') + '</small></div>' +
        '<div class="reconciliation-card"><span>Guarantor status</span><strong>' + escapeHtml(valueOrDash(center.guarantor_status)) + '</strong><small>' + escapeHtml(center.guarantor_present ? 'Guarantor support detected' : 'Review guaranty support before escalation') + '</small></div>' +
      '</div>' +
      '<div class="mini-row"><strong>Low-confidence rows excluded:</strong> <span>' + escapeHtml(String(reconciliation.excluded_low_confidence_rows || 0)) + '</span></div>' +
      (safeArray(reconciliation.excluded_sources).length ? '<div class="mini-row"><strong>Excluded files:</strong> <span>' + escapeHtml(safeArray(reconciliation.excluded_sources).join(' | ')) + '</span></div>' : '') +
      balanceRows +
      conflictRows +
      gapRows +
      (blockers.length ? '<div class="workflow-alert workflow-alert-warning"><strong>Generation blocked.</strong><span>' + escapeHtml(blockers.join(' | ')) + '</span></div>' : '') +
      (warnings.length ? '<div class="mini-row"><strong>Warnings:</strong> <span>' + escapeHtml(warnings.join(' | ')) + '</span></div>' : '');
  }

  function populateReview(caseRecord){
    safeArray(els.reviewForms).forEach(function(form){
      if(!caseRecord){
        qa('[data-review-field]', form).forEach(function(field){ field.value = ''; });
        return;
      }
      var data = caseRecord.extracted_case_data || {};
      var values = {
        plaintiff_name: data.plaintiff && data.plaintiff.party_name || '',
        defendant_name: data.defendant_entity && data.defendant_entity.party_name || '',
        guarantor_name: data.personal_guarantor && data.personal_guarantor.party_name || '',
        service_address: data.service_address || '',
        business_address: data.business_address || '',
        venue_county: data.venue && data.venue.venue_county || '',
        venue_clause: data.venue && data.venue.venue_clause || '',
        venue_paragraph: data.venue && data.venue.venue_paragraph || '',
        governing_law: data.governing_law || '',
        payment_terms: data.payment_terms || '',
        default_terms: data.default_terms || '',
        interest_terms: data.interest_terms || '',
        amount_in_controversy: data.amount_in_controversy || ''
      };
      qa('[data-review-field]', form).forEach(function(field){
        var key = field.getAttribute('data-review-field');
        if(Object.prototype.hasOwnProperty.call(values, key)){ field.value = values[key]; }
      });
    });
  }

  function renderActivity(events){
    if(!els.activityList){ return; }
    var items = safeArray(events);
    if(!items.length){
      els.activityList.innerHTML = '<p class="empty-copy">' + escapeHtml(t('workspace.empty.activity', 'No activity yet.')) + '</p>';
      return;
    }
    els.activityList.innerHTML = items.map(function(item){
      return '<div class="activity-item"><strong>' + escapeHtml(item.event_type || 'event') + '</strong><span>' +
        escapeHtml(formatDate(item.recorded_at || item.created_at)) +
        '</span></div>';
    }).join('');
  }

  function renderCommunicationsLog(caseRecord){
    if(!els.communicationsList){ return; }
    var entries = safeArray(caseRecord && caseRecord.communications_log);
    if(!entries.length){
      els.communicationsList.innerHTML = '<p class="empty-copy">No communication history yet.</p>';
      return;
    }
    els.communicationsList.innerHTML = entries.map(function(item){
      var meta = [
        humanLabel(item.entry_type, 'note'),
        item.channel ? humanLabel(item.channel, 'channel') : '',
        item.actor_label || '',
        item.created_at ? formatDate(item.created_at) : ''
      ].filter(Boolean);
      var body = item.body ? '<div class="micro-note">' + escapeHtml(item.body) + '</div>' : '';
      var version = item.related_packet_version ? '<div class="micro-note">Packet version ' + escapeHtml(String(item.related_packet_version)) + '</div>' : '';
      return '<div class="generated-item">' +
        '<div><strong>' + escapeHtml(item.summary || 'Matter note') + '</strong><span>' + escapeHtml(meta.join(' | ')) + '</span>' + body + version + '</div>' +
        '<span class="status-chip ' + statusClass(item.entry_type) + '">' + escapeHtml(humanLabel(item.entry_type, 'note')) + '</span>' +
      '</div>';
    }).join('');
  }

  function renderSettlementTracker(caseRecord){
    if(!els.settlementList){ return; }
    var entries = safeArray(caseRecord && caseRecord.settlement_tracker);
    var route = caseRecord && caseRecord.extracted_case_data && caseRecord.extracted_case_data.recovery_truth
      ? caseRecord.extracted_case_data.recovery_truth.route_status
      : '';
    if(!entries.length){
      els.settlementList.innerHTML = '<p class="empty-copy">No settlement or payment-plan entries yet. Current route: ' + escapeHtml(humanLabel(route, 'not routed yet')) + '.</p>';
      return;
    }
    els.settlementList.innerHTML = entries.map(function(item){
      var detail = [];
      if(item.proposed_amount){ detail.push(money(item.proposed_amount)); }
      if(item.proposed_payment_count){ detail.push(String(item.proposed_payment_count) + ' payment(s)'); }
      if(item.proposed_first_payment_date){ detail.push('Starts ' + item.proposed_first_payment_date); }
      return '<div class="generated-item">' +
        '<div><strong>' + escapeHtml(item.title || humanLabel(item.proposal_type, 'proposal')) + '</strong>' +
        '<span>' + escapeHtml([humanLabel(item.proposal_type, 'proposal'), humanLabel(item.status, 'draft'), humanLabel(item.linked_route_status || route, 'route pending')].filter(Boolean).join(' | ')) + '</span>' +
        (item.summary ? '<div class="micro-note">' + escapeHtml(item.summary) + '</div>' : '') +
        (item.term_summary ? '<div class="micro-note">' + escapeHtml(item.term_summary) + '</div>' : '') +
        (detail.length ? '<div class="micro-note">' + escapeHtml(detail.join(' | ')) + '</div>' : '') +
        '</div>' +
        '<span class="status-chip ' + statusClass(item.status) + '">' + escapeHtml(humanLabel(item.status, 'draft')) + '</span>' +
      '</div>';
    }).join('');
  }

  function renderDeadlineEngine(caseRecord){
    if(!els.deadlineEngine){ return; }
    var deadlines = safeArray(caseRecord && caseRecord.deadlines);
    if(!deadlines.length){
      els.deadlineEngine.innerHTML = '<p class="empty-copy">No deadlines detected yet.</p>';
      return;
    }
    els.deadlineEngine.innerHTML = deadlines.map(function(item){
      var meta = [
        item.date || 'Date pending',
        humanLabel(item.urgency, 'medium'),
        item.source_kind === 'manual_override' ? 'manual override' : 'detected',
        item.source_file || ''
      ].filter(Boolean);
      var confidence = item.confidence != null ? '<div class="micro-note">Confidence ' + escapeHtml(String(Math.round(Number(item.confidence || 0) * 100))) + '%</div>' : '';
      var note = item.override_reason || item.source_excerpt || '';
      return '<div class="generated-item">' +
        '<div><strong>' + escapeHtml(item.label || 'Detected deadline') + '</strong><span>' + escapeHtml(meta.join(' | ')) + '</span>' +
        (note ? '<div class="micro-note">' + escapeHtml(note) + '</div>' : '') +
        confidence +
        '</div>' +
        '<span class="status-chip ' + statusClass(item.urgency) + '">' + escapeHtml(humanLabel(item.urgency, 'medium')) + '</span>' +
      '</div>';
    }).join('');
  }

  function renderPacketArchiveSummary(caseRecord){
    if(!els.packetArchiveSummary){ return; }
    var entries = safeArray(caseRecord && caseRecord.packet_archive).slice(0, 4);
    if(!entries.length){
      els.packetArchiveSummary.innerHTML = '<p class="empty-copy">No packet versions yet.</p>';
      return;
    }
    els.packetArchiveSummary.innerHTML = entries.map(function(item){
      var meta = [
        'v' + String(item.version_number || 0),
        item.created_at ? formatDate(item.created_at) : '',
        String(item.document_count || 0) + ' output(s)',
        humanLabel(item.release_state, 'ready for review')
      ].filter(Boolean);
      return '<div class="generated-item">' +
        '<div><strong>' + escapeHtml(item.summary || ('Packet version ' + String(item.version_number || 0))) + '</strong><span>' + escapeHtml(meta.join(' | ')) + '</span></div>' +
        '<span class="status-chip ' + statusClass(item.generation_qa_status || item.release_state) + '">' + escapeHtml(humanLabel(item.generation_qa_status || item.release_state, 'review')) + '</span>' +
      '</div>';
    }).join('');
  }

  function renderCase(caseRecord){
    state.currentCase = caseRecord || null;
    var snapshot = caseRecord && caseRecord.client_snapshot ? caseRecord.client_snapshot : null;
    var summary = workflowSummary(caseRecord);
    var blockers = safeArray(snapshot && snapshot.blockers);
    var warnings = safeArray(snapshot && snapshot.warnings);

    if(els.caseTitle){ els.caseTitle.textContent = caseRecord ? (snapshot && snapshot.selected_matter || caseRecord.title || caseRecord.reference || caseRecord.id) : t('workspace.current.none', 'No matter selected yet'); }
    if(els.caseSubtitle){
      var subtitle = t('workspace.current.subtitle_empty', 'Create a matter to begin the workflow.');
      if(snapshot){
        subtitle = (snapshot.defendant || 'No defendant') + ' | ' + (snapshot.plaintiff || 'No plaintiff');
      }
      els.caseSubtitle.textContent = subtitle;
    }
    if(els.caseStatus){ els.caseStatus.textContent = snapshot ? String(snapshot.status || 'draft').replace(/_/g, ' ') : 'Draft'; els.caseStatus.className = 'status-chip ' + statusClass(snapshot && snapshot.status); }
    if(els.activeCase){ els.activeCase.textContent = caseRecord ? (snapshot && snapshot.selected_matter || caseRecord.reference || caseRecord.title || caseRecord.id) : 'No active matter'; }
    if(els.nextAction){ els.nextAction.textContent = summary.nextAction; }
    if(els.nextActionInline){ els.nextActionInline.textContent = summary.nextAction; }
    if(els.readinessCopy){ els.readinessCopy.textContent = summary.readinessCopy; }
    if(els.caseStatusCopy){ els.caseStatusCopy.textContent = summary.statusCopy; }
    if(els.packetReady){ els.packetReady.textContent = summary.readiness; }
    if(els.caseUpdated){ els.caseUpdated.textContent = caseRecord ? (t('workspace.current.updated_prefix', 'Updated ') + formatDate(caseRecord.updated_at)) : t('workspace.current.updated_empty', 'Ready state updates appear here after processing.'); }
    if(els.dashboardCaseCount){ els.dashboardCaseCount.textContent = String(state.cases.length); }
    if(els.metricFiles){ els.metricFiles.textContent = String(snapshot && snapshot.source_file_count || 0); }
    if(els.metricTemplates && state.registry){ els.metricTemplates.textContent = String(state.registry.template_count || 0); }
    if(els.metricVenue){ els.metricVenue.textContent = snapshot && snapshot.venue_county ? (snapshot.venue_county + ' County') : '-'; }
    if(els.metricCourt){ els.metricCourt.textContent = snapshot && snapshot.court_level ? snapshot.court_level : '-'; }
    if(els.blockerCount){ els.blockerCount.textContent = String(snapshot && snapshot.blocker_count || blockers.length); }
    if(els.warningCount){ els.warningCount.textContent = String(snapshot && snapshot.warning_count || warnings.length); }
    if(els.generationReadiness){ els.generationReadiness.textContent = summary.readiness; }
    if(els.generationState){ els.generationState.textContent = summary.statusCopy; }
    if(els.generationNote){ els.generationNote.textContent = summary.nextAction; }
    if(els.generationWarnings){
      if(blockers.length || warnings.length){
        els.generationWarnings.innerHTML =
          '<div class="status-columns"><div><h4>Blockers</h4><ul class="message-list">' +
          (blockers.length ? blockers.map(function(item){ return '<li>' + escapeHtml(item) + '</li>'; }).join('') : '<li class="empty-copy">No blockers.</li>') +
          '</ul></div><div><h4>Warnings</h4><ul class="message-list">' +
          (warnings.length ? warnings.map(function(item){ return '<li>' + escapeHtml(item) + '</li>'; }).join('') : '<li class="empty-copy">No warnings.</li>') +
          '</ul></div></div>';
      } else {
        els.generationWarnings.innerHTML = '<p class="empty-copy">No blockers or warnings for the current matter.</p>';
      }
    }
    renderStoredSourceFiles(caseRecord && caseRecord.source_files);
    renderMessages(els.blockerList, blockers, t('workspace.no_blockers_yet', 'No blockers yet.'));
    renderMessages(els.warningList, warnings, t('workspace.no_warnings_yet', 'No warnings yet.'));
    renderSunbiz(caseRecord && caseRecord.sunbiz_lookup, snapshot);
    renderGenerated(caseRecord && caseRecord.packet_generation, snapshot);
    renderGenerationProgress(caseRecord && caseRecord.generation_progress);
    renderCountyCandidates(caseRecord);
    renderInvoiceLedger(caseRecord);
    renderLegalCounts(caseRecord);
    renderExtractedSummary(caseRecord);
    renderSourceSetSummary(caseRecord);
    renderReconciliationSummary(caseRecord);
    renderCommunicationsLog(caseRecord);
    renderSettlementTracker(caseRecord);
    renderDeadlineEngine(caseRecord);
    renderPacketArchiveSummary(caseRecord);
    if(els.generateSelected){ els.generateSelected.disabled = !caseRecord || !(snapshot && snapshot.packet_generation_allowed); }
    if(els.generateAll){ els.generateAll.disabled = !caseRecord || !(snapshot && snapshot.packet_generation_allowed); }
    if(els.splitCase){
      var showSplit = !!(caseRecord && blockers.some(function(item){ return String(item).toLowerCase().indexOf('multiple debtor') !== -1; }));
      els.splitCase.hidden = !showSplit;
      els.splitCase.disabled = !showSplit;
    }
    populateReview(caseRecord);
    rewritePreservedLinks();
    updateCreateModeUI();
  }

  function updateCreateModeUI(){
    var label = q('[data-create-mode-label]');
    var subcopy = q('[data-create-mode-copy]');
    var legacyBanner = q('[data-legacy-route-banner]');
    var category = params().get('category') || '';
    var engine = currentEngine();
    var categoryTitle = {
      notice: t('action_center.notice_intake', 'Notice intake'),
      dispute: engine === 'legal' ? 'Legal intake' : 'Recovery intake',
      permits: t('action_center.permits_intake', 'Permits and compliance intake')
    };
    var categoryCopy = {
      notice: 'Create a clean notice matter, then continue in Action Center to confirm deadlines, missing documents, and the response path.',
      dispute: engine === 'legal'
        ? 'Create a legal matter, then continue into deadline, filing, document, and linked recovery context from one shared workspace.'
        : 'Create a clean recovery record, then continue in Action Center to confirm the evidence picture, next step, and demand readiness before opening advanced workspace tools.',
      permits: 'Create a clean permits or compliance matter, then continue in Action Center to confirm the official route and next documents.'
    };
    if(els.intakeCategory){
      els.intakeCategory.textContent = categoryTitle[category] || (engine === 'legal' ? 'Legal intake' : 'Recovery intake');
    }
    if(!label && !subcopy && !legacyBanner){ return; }
    if(isCreateMode()){
      if(label){ label.textContent = engine === 'legal' ? 'Create New Legal Matter' : 'Create New Recovery Record'; }
      if(subcopy){
        subcopy.textContent = categoryCopy[category] || (
          engine === 'legal'
            ? 'Create mode starts clean. This legal matter can later link to recovery activity without duplicating records.'
            : 'Create mode starts clean. This recovery record can later escalate into a linked legal matter without duplicating records.'
        );
      }
      if(legacyBanner){ legacyBanner.textContent = category ? (categoryTitle[category] || 'Matter intake') : (engine === 'legal' ? 'Legal intake' : 'Recovery intake'); }
      return;
    }
    if(isEditMode()){
      if(label){ label.textContent = 'Edit Existing Case'; }
      if(subcopy){ subcopy.textContent = 'Edit mode is using the canonical case snapshot for the selected matter.'; }
      if(legacyBanner){ legacyBanner.textContent = 'Edit mode is using the canonical case snapshot.'; }
      return;
    }
    if(label){ label.textContent = 'Workspace'; }
  }

  async function loadCases(){
    state.cases = await api.listCases(50);
    renderCaseList();
    if(els.dashboardCaseCount){ els.dashboardCaseCount.textContent = String(state.cases.length); }
  }

  async function loadRegistry(caseId){
    var targetCaseId = caseId || state.currentCaseId || '';
    if(state.registryCaseId !== targetCaseId){
      state.selectedDocumentTypes = [];
    }
    state.registry = await api.getTemplateRegistry(targetCaseId);
    state.registryCaseId = targetCaseId;
    renderDocumentSelection();
    if(els.metricTemplates){ els.metricTemplates.textContent = String(state.registry && state.registry.template_count || '-'); }
  }

  async function loadActivity(caseId){
    if(!caseId || !els.activityList){ return; }
    var payload = await api.getCaseActivity(caseId, 40);
    state.activity = safeArray(payload && payload.events);
    renderActivity(state.activity);
  }

  async function refreshCurrentCase(){
    if(!state.currentCaseId){ return; }
    var caseRecord = await api.getCase(state.currentCaseId);
    state.currentCase = caseRecord;
    renderCase(caseRecord);
    await Promise.allSettled([loadActivity(state.currentCaseId), loadRegistry(state.currentCaseId)]);
    renderCase(state.currentCase);
  }

  async function openCase(caseId){
    if(!caseId){ return; }
    state.currentCaseId = caseId;
    setStoredActiveCaseId(caseId);
    closeSidebar();
    setQueryCase(caseId);
    var caseRecord = await api.getCase(caseId);
    state.currentCase = caseRecord;
    renderCase(caseRecord);
    await Promise.allSettled([loadActivity(caseId), loadRegistry(caseId)]);
    renderCase(state.currentCase);
    rewritePreservedLinks();
    updateCreateModeUI();
  }

  async function healthCheck(){
    try {
      var result = await api.integrationCheck();
      if(els.apiStatus){
        els.apiStatus.textContent = 'Backend connected. API base ' + result.apiBase + ' | environment ' + result.environment + ' | case routes reachable.';
      }
      return true;
    } catch (error){
      if(els.apiStatus){
        var base = api && api.runtime ? api.runtime.apiBaseUrl : '/api';
        var message = error && error.message ? error.message : 'API connection check failed.';
        els.apiStatus.textContent = message + ' Current API base: ' + base;
      }
      return false;
    }
  }

  function initializeUploadItem(file){
    var id = [file.name, file.size, file.lastModified].join('::');
    if(!state.uploadItems[id]){
      state.uploadItems[id] = {
        id: id,
        name: file.name,
        size: Number(file.size || 0),
        loaded: 0,
        total: Number(file.size || 0),
        percent: 0,
        speedBps: 0,
        etaSeconds: null,
        status: 'queued',
        message: ''
      };
      state.uploadOrder.push(id);
    }
    return state.uploadItems[id];
  }

  async function uploadSourceFiles(files){
    var normalized = Array.prototype.slice.call(files || []).filter(Boolean);
    if(!normalized.length || state.isUploading){ return; }
    if(!state.currentCaseId){
      try {
        if(els.processingSummary){ els.processingSummary.textContent = 'Creating a clean matter for these uploaded files...'; }
        await ensureCaseForUpload();
      } catch (error){
        showToast(error.message || 'Could not create a clean matter for upload.', 'warning');
        return;
      }
    }
    if(!normalized.length || state.isUploading){ return; }

    state.isUploading = true;
    normalized.forEach(initializeUploadItem);
    renderUploadProgress();

    try {
      await api.uploadSourceFilesWithProgress(state.currentCaseId, normalized, {
        onFileStatus: function(payload){
          var item = initializeUploadItem(payload.file);
          item.status = payload.status || item.status;
          item.percent = Math.max(item.percent, Number(payload.percent || 0));
          item.loaded = Number(payload.loaded || item.loaded || 0);
          item.total = Number(payload.total || item.total || 0);
          item.message = payload.message || '';
          renderUploadProgress();
        },
        onFileProgress: function(payload){
          var item = initializeUploadItem(payload.file);
          item.status = payload.status || 'uploading';
          item.loaded = Number(payload.loaded || 0);
          item.total = Number(payload.total || item.total || 0);
          item.percent = Number(payload.percent || 0);
          item.speedBps = Number(payload.speedBps || 0);
          item.etaSeconds = payload.etaSeconds;
          renderUploadProgress();
        },
        onOverallProgress: function(payload){
          if(els.uploadOverallFill){ els.uploadOverallFill.style.width = String(payload.percent || 0) + '%'; }
          if(els.uploadOverallStats){
            els.uploadOverallStats.textContent = String(payload.percent || 0) + '% | ' + formatBytes(payload.loaded || 0) + ' / ' + formatBytes(payload.total || 0) + ' | ' + formatSpeed(payload.speedBps) + ' | ETA ' + formatEta(payload.etaSeconds);
          }
        }
      });
      await refreshCurrentCase();
      if(els.processingSummary){ els.processingSummary.textContent = 'Files uploaded. Running document analysis automatically...'; }
      try {
        var processed = await api.processCase(state.currentCaseId);
        state.currentCase = processed;
        renderCase(processed);
        await Promise.allSettled([loadCases(), loadActivity(state.currentCaseId), loadRegistry(state.currentCaseId)]);
        renderCase(processed);
        var uploadFeedback = processingFeedback(processed);
        if(els.processingSummary){ els.processingSummary.textContent = uploadFeedback.message; }
        showToast(uploadFeedback.tone === 'warning' ? uploadFeedback.message : 'Files uploaded and analyzed.', uploadFeedback.tone);
      } catch (processError){
        try { await refreshCurrentCase(); } catch (refreshError){}
        var detail = processError && processError.detail && typeof processError.detail === 'object' ? processError.detail : null;
        var blockers = detail && Array.isArray(detail.blockers) ? detail.blockers : [];
        var message = processError.message || 'Files uploaded, but analysis needs review.';
        if(blockers.length){ message = blockers[0]; }
        if(els.processingSummary){ els.processingSummary.textContent = message; }
        renderCase(state.currentCase || {});
        showToast(message, 'warning');
      }
    } catch (error){
      showToast(error.message || 'Upload failed.', 'warning');
    } finally {
      state.isUploading = false;
      renderUploadProgress();
    }
  }

  function bindDropzone(){
    if(!els.sourceDropzone || !els.sourceInput){ return; }
    if(els.sourcePicker){
      els.sourcePicker.addEventListener('click', function(){ els.sourceInput.click(); });
    }
    els.sourceInput.addEventListener('change', function(){
      uploadSourceFiles(els.sourceInput.files || []);
      els.sourceInput.value = '';
    });
    ['dragenter','dragover'].forEach(function(name){
      els.sourceDropzone.addEventListener(name, function(event){
        event.preventDefault();
        event.stopPropagation();
        els.sourceDropzone.classList.add('is-dragover');
      });
    });
    ['dragleave','drop'].forEach(function(name){
      els.sourceDropzone.addEventListener(name, function(event){
        event.preventDefault();
        event.stopPropagation();
        els.sourceDropzone.classList.remove('is-dragover');
      });
    });
    els.sourceDropzone.addEventListener('drop', function(event){
      var files = event.dataTransfer && event.dataTransfer.files ? event.dataTransfer.files : [];
      uploadSourceFiles(files);
    });
    els.sourceDropzone.addEventListener('keydown', function(event){
      if(event.key === 'Enter' || event.key === ' '){
        event.preventDefault();
        els.sourceInput.click();
      }
    });
  }

  async function handleProcessCase(){
    if(!state.currentCaseId){
      showToast(t('workspace.toast.upload_first', 'Upload client files first or open an existing matter.'), 'warning');
      return;
    }
    try {
      if(els.startProcessing){ els.startProcessing.disabled = true; }
      if(els.processingSummary){ els.processingSummary.textContent = 'Processing uploaded PDF and Excel files...'; }
      var processed = await api.processCase(state.currentCaseId);
      state.currentCase = processed;
      renderCase(processed);
      await Promise.allSettled([loadCases(), loadActivity(state.currentCaseId), loadRegistry(state.currentCaseId)]);
      renderCase(processed);
      var processedFeedback = processingFeedback(processed);
      if(els.processingSummary){ els.processingSummary.textContent = processedFeedback.message; }
      showToast(processedFeedback.tone === 'warning' ? processedFeedback.message : 'Processing complete.', processedFeedback.tone);
    } catch (error){
      try { await refreshCurrentCase(); } catch (refreshError){}
      var detail = error && error.detail && typeof error.detail === 'object' ? error.detail : null;
      var blockers = detail && Array.isArray(detail.blockers) ? detail.blockers : [];
      var message = error.message || 'Processing failed.';
      if(blockers.length){ message = blockers[0]; }
      if(els.processingSummary){ els.processingSummary.textContent = message; }
      renderCase(state.currentCase || {});
      showToast(message, 'warning');
    } finally {
      if(els.startProcessing){ els.startProcessing.disabled = false; }
    }
  }

  async function handleSunbiz(){
    if(!state.currentCaseId || state.isRunningSunbiz){ return; }
    try {
      state.isRunningSunbiz = true;
      if(els.runSunbiz){ els.runSunbiz.disabled = true; }
      if(els.sunbizStatus){ els.sunbizStatus.textContent = 'Running SunBiz verification...'; }
      var defendant = state.currentCase && state.currentCase.extracted_case_data && state.currentCase.extracted_case_data.defendant_entity && state.currentCase.extracted_case_data.defendant_entity.party_name;
      await api.runSunbiz(state.currentCaseId, defendant || '');
      await refreshCurrentCase();
      if(els.sunbizStatus){ els.sunbizStatus.textContent = 'SunBiz verification stored. Download the PDF report if needed.'; }
      showToast('SunBiz verification completed.', 'success');
    } catch (error){
      if(els.sunbizStatus){ els.sunbizStatus.textContent = error.message || 'SunBiz verification failed.'; }
      showToast(error.message || 'SunBiz verification failed.', 'warning');
    } finally {
      state.isRunningSunbiz = false;
      if(els.runSunbiz){ els.runSunbiz.disabled = false; }
    }
  }

  function selectedDocumentTypes(allIfEmpty){
    var checked = qa('[data-doc-checkbox]:checked').map(function(node){ return node.getAttribute('data-doc-checkbox'); });
    if(!checked.length && allIfEmpty){
      checked = safeArray(state.registry && state.registry.templates).map(function(item){ return item.document_type; });
    }
    state.selectedDocumentTypes = checked.slice();
    return checked;
  }

  function stopGenerationPolling(){
    if(state.generationPoller){
      window.clearInterval(state.generationPoller);
      state.generationPoller = null;
    }
  }

  async function pollGeneration(){
    if(!state.currentCaseId){ return; }
    try {
      var payload = await api.getGenerationProgress(state.currentCaseId);
      if(payload && payload.generation_progress){
        renderGenerationProgress(payload.generation_progress);
      }
      if(payload && payload.packet_generation){
        renderGenerated(payload.packet_generation);
      }
      if(payload && payload.generation_progress && ['completed', 'blocked', 'failed', 'idle'].indexOf(payload.generation_progress.status) !== -1){
        stopGenerationPolling();
        await refreshCurrentCase();
        if(payload.generation_progress.status === 'completed'){
          showToast('Generation completed.', 'success');
        } else if(payload.generation_progress.status === 'blocked'){
          showToast(payload.generation_progress.message || 'Generation blocked.', 'warning');
        } else if(payload.generation_progress.status === 'failed'){
          showToast(payload.generation_progress.message || 'Generation failed.', 'warning');
        }
      }
    } catch (error){
      stopGenerationPolling();
      showToast(error.message || 'Could not read generation progress.', 'warning');
    }
  }

  async function startGeneration(useAll){
    if(!state.currentCaseId){
      showToast(t('workspace.toast.upload_first', 'Upload client files first or open an existing matter.'), 'warning');
      return;
    }
    var selected = useAll ? selectedDocumentTypes(true) : selectedDocumentTypes(false);
    if(!selected.length){
      showToast('Select at least one document first.', 'warning');
      return;
    }
    try {
      if(els.generateSelected){ els.generateSelected.disabled = true; }
      if(els.generateAll){ els.generateAll.disabled = true; }
      var response = await api.startGeneration(state.currentCaseId, selected, false);
      if(response && response.generation_progress){
        renderGenerationProgress(response.generation_progress);
      }
      stopGenerationPolling();
      state.generationPoller = window.setInterval(pollGeneration, 700);
      await pollGeneration();
    } catch (error){
      showToast(error.message || 'Could not start generation.', 'warning');
    } finally {
      if(els.generateSelected){ els.generateSelected.disabled = false; }
      if(els.generateAll){ els.generateAll.disabled = false; }
    }
  }

  function collectReviewPayload(form){
    var payload = {};
    qa('[data-review-field]', form).forEach(function(field){
      payload[field.getAttribute('data-review-field')] = field.value;
    });
    return payload;
  }

  function bindLayout(){
    if(els.sidebarToggle){
      els.sidebarToggle.addEventListener('click', function(){
        var isOpen = !document.body.classList.contains('app-nav-open');
        document.body.classList.toggle('app-nav-open', isOpen);
        if(els.overlay){ els.overlay.hidden = !isOpen; }
        if(!isOpen && els.sidebar){ els.sidebar.scrollTop = 0; }
      });
    }
    if(els.overlay){
      els.overlay.addEventListener('click', function(){
        document.body.classList.remove('app-nav-open');
        els.overlay.hidden = true;
      });
    }
    safeArray(els.navButtons).forEach(function(button){
      button.addEventListener('click', function(){
        goToScreen(button.getAttribute('data-nav-target'), state.currentCaseId);
      });
    });
    if(els.caseSearch){
      els.caseSearch.addEventListener('input', renderCaseList);
      els.caseSearch.addEventListener('keydown', function(event){
        if(event.key !== 'Enter'){ return; }
        var first = filteredCases(els.caseSearch.value)[0];
        if(first){
          event.preventDefault();
          openCase(first.id);
        }
      });
    }
  }

  function renderGenerationProgress(progress){
    if(els.generationSummary){ els.generationSummary.textContent = progress && progress.message ? progress.message : t('workspace.no_generation', 'No generation in progress.'); }
    var percent = progress && typeof progress.progress_percent === 'number' ? progress.progress_percent : 0;
    if(els.generationOverallFill){ els.generationOverallFill.style.width = percent + '%'; }
    if(els.generationOverallText){
      if(progress && progress.total_documents){
        els.generationOverallText.textContent = percent + '% - ' + progress.completed_documents + ' / ' + progress.total_documents + ' complete';
      } else {
        els.generationOverallText.textContent = t('workspace.no_generation', 'No generation in progress.');
      }
    }
    if(els.generationCurrent){
      els.generationCurrent.textContent = progress && progress.current_document_name ? (t('workspace.generation.current_prefix', 'Current: ') + progress.current_document_name) : t('workspace.generation.current_none', 'Current: -');
    }
    if(els.generationList){
      var items = safeArray(progress && progress.items);
      if(!items.length){
        els.generationList.innerHTML = '<p class="empty-copy">' + escapeHtml(t('workspace.progress.select_docs', 'Select one or more documents. Progress appears here while generation runs.')) + '</p>';
      } else {
        els.generationList.innerHTML = items.map(function(item){
          return '<div class="generated-item">' +
            '<div><strong>' + escapeHtml(humanType(item.document_type)) + '</strong>' +
            '<span>' + escapeHtml(String(item.status || 'queued').replace(/_/g, ' ')) + (item.blocking_reason ? ' - ' + escapeHtml(item.blocking_reason) : '') + '</span></div>' +
            '<span class="status-chip ' + statusClass(item.status) + '">' + escapeHtml(item.status) + '</span>' +
          '</div>';
        }).join('');
      }
    }
    syncGenerationControls();
  }

  function renderDocumentSelection(){
    if(!els.docSelection){ return; }
    var templates = getRegistryTemplates();
    if(!templates.length){
      state.selectedDocumentTypes = [];
      els.docSelection.innerHTML = '<p class="empty-copy">' + escapeHtml(t('workspace.empty.template_registry', 'Template availability appears after the matter loads.')) + '</p>';
      syncGenerationControls();
      return;
    }
    var availableSelections = selectableDocumentTypes();
    state.selectedDocumentTypes = state.selectedDocumentTypes.filter(function(item){
      return !!templateByType(item) && availableSelections.indexOf(item) !== -1;
    });
    els.docSelection.innerHTML = templates.map(function(item){
      var reasons = safeArray(item.blocking_reasons);
      var disabled = !templateSelectable(item) || state.isGenerating;
      var checked = state.selectedDocumentTypes.indexOf(item.document_type) !== -1 ? ' checked' : '';
      var statusText = String(item.generation_status || (item.available ? 'ready' : 'template_missing')).replace(/_/g, ' ');
      var notes = [];
      notes.push(item.expected_in_packet ? 'Included in full packet.' : 'Optional output.');
      if(!item.available){
        notes.push('Template missing in server library.');
      }
      reasons.forEach(function(reason){ notes.push(reason); });
      return '<label class="doc-select-item' + (disabled ? ' is-disabled' : '') + '">' +
        '<input data-doc-checkbox="' + escapeHtml(item.document_type) + '" type="checkbox"' + checked + (disabled ? ' disabled' : '') + '>' +
        '<div class="doc-select-copy">' +
          '<div class="doc-select-head"><strong>' + escapeHtml(item.display_name || humanType(item.document_type)) + '</strong><span class="status-chip ' + statusClass(item.generation_status || (item.available ? 'ready' : 'blocked')) + '">' + escapeHtml(statusText) + '</span></div>' +
          '<span>' + escapeHtml(item.template_filename || humanType(item.document_type)) + '</span>' +
          notes.map(function(note){ return '<span class="doc-select-note">' + escapeHtml(note) + '</span>'; }).join('') +
        '</div>' +
      '</label>';
    }).join('');
    qa('[data-doc-checkbox]').forEach(function(input){
      input.addEventListener('change', function(){
        state.selectedDocumentTypes = checkedDocumentTypes();
        syncGenerationControls();
      });
    });
    syncGenerationControls();
  }

  function renderMatterSummaryBand(caseRecord){
    var issue = caseRecord && caseRecord.issue_category ? caseRecord.issue_category : 'unknown_issue';
    var stage = caseRecord && caseRecord.current_stage ? caseRecord.current_stage : 'draft';
    var urgency = caseRecord && caseRecord.urgency_level ? caseRecord.urgency_level : 'medium';
    var deadlines = (caseRecord && caseRecord.deadlines) || [];
    var firstDeadline = deadlines.length ? (deadlines[0].date || deadlines[0].label || 'Detected') : '-';
    var nextPath = caseRecord && caseRecord.recommended_paths && caseRecord.recommended_paths.length
      ? caseRecord.recommended_paths[0]
      : 'review_matter';
    var packet = caseRecord && caseRecord.action_packet_status ? caseRecord.action_packet_status : 'not_built';

    if(els.issueCategory){ els.issueCategory.textContent = String(issue).replace(/_/g, ' '); }
    if(els.currentStage){ els.currentStage.textContent = String(stage).replace(/_/g, ' '); }
    if(els.urgency){ els.urgency.textContent = String(urgency).replace(/_/g, ' ') + ' urgency'; }
    if(els.documentType){ els.documentType.textContent = String(issue).replace(/_/g, ' '); }
    if(els.primaryDeadline){ els.primaryDeadline.textContent = firstDeadline; }
    if(els.primaryNextStep){ els.primaryNextStep.textContent = String(nextPath).replace(/_/g, ' '); }
    if(els.packetStatus){ els.packetStatus.textContent = String(packet).replace(/_/g, ' '); }
  }

  function renderLinkedRecords(caseRecord){
    if(!els.linkedRecords){ return; }
    var items = safeArray(caseRecord && caseRecord.linked_records);
    if(!items.length){
      els.linkedRecords.innerHTML = '<div class="empty-copy">Linked legal matters and recovery records appear here once the record is connected across environments.</div>';
      return;
    }
    els.linkedRecords.innerHTML = items.map(function(item){
      var route = '/app/action-center/?case=' + encodeURIComponent(item.case_id || '');
      var counterpartRoute = item.environment_tag === 'legal'
        ? '/app/new-case/?engine=recovery&category=dispute&linked_case=' + encodeURIComponent(caseRecord.id || '')
        : '/app/new-case/?engine=legal&linked_case=' + encodeURIComponent(caseRecord.id || '');
      return '<article class="dashboard-list-item">' +
        '<div><strong>' + escapeHtml(item.title || item.case_id) + '</strong><p>' + escapeHtml(joinMeta([item.environment_tag === 'legal' ? 'Legal Workflow' : 'Recovery Pipeline', item.current_stage || item.status || item.record_type])) + '</p></div>' +
        '<div class="inline-actions"><a class="btn btn-secondary btn-sm" href="' + escapeHtml(route) + '">Open</a><a class="btn btn-secondary btn-sm" href="' + escapeHtml(counterpartRoute) + '">Create counterpart</a></div>' +
      '</article>';
    }).join('');
  }

  function renderCase(caseRecord){
    state.currentCase = caseRecord || null;
    var snapshot = caseRecord && caseRecord.client_snapshot ? caseRecord.client_snapshot : null;
    var summary = workflowSummary(caseRecord);
    var blockers = safeArray(snapshot && snapshot.blockers);
    var warnings = safeArray(snapshot && snapshot.warnings);
    var consistency = caseRecord && caseRecord.extracted_case_data ? caseRecord.extracted_case_data.matter_consistency : null;
    var feedback = caseRecord ? processingFeedback(caseRecord) : { message: 'No processing in progress.', tone: 'neutral' };

    if(els.caseTitle){ els.caseTitle.textContent = caseRecord ? (snapshot && snapshot.selected_matter || caseRecord.title || caseRecord.reference || caseRecord.id) : t('workspace.current.none', 'No matter selected yet'); }
    if(els.caseSubtitle){
      var subtitle = t('workspace.current.subtitle_empty', 'Create a matter to begin the workflow.');
      if(snapshot){
        subtitle = (snapshot.defendant || 'No defendant') + ' - ' + (snapshot.plaintiff || 'No plaintiff');
      }
      els.caseSubtitle.textContent = subtitle;
    }
    if(els.caseStatus){
      els.caseStatus.textContent = snapshot ? String(snapshot.status || 'draft').replace(/_/g, ' ') : t('workspace.status.draft', 'Draft');
      els.caseStatus.className = 'status-chip ' + statusClass(snapshot && snapshot.status);
    }
    if(els.activeCase){ els.activeCase.textContent = caseRecord ? (snapshot && snapshot.selected_matter || caseRecord.reference || caseRecord.title || caseRecord.id) : t('module.current_matter.none', 'No active matter'); }
    if(els.nextAction){ els.nextAction.textContent = summary.nextAction; }
    if(els.nextActionInline){ els.nextActionInline.textContent = summary.nextAction; }
    if(els.readinessCopy){ els.readinessCopy.textContent = summary.readinessCopy; }
    if(els.caseStatusCopy){ els.caseStatusCopy.textContent = summary.statusCopy; }
    if(els.packetReady){ els.packetReady.textContent = summary.readiness; }
    if(els.caseUpdated){ els.caseUpdated.textContent = caseRecord ? (t('workspace.current.updated_prefix', 'Updated ') + formatDate(caseRecord.updated_at)) : t('workspace.current.updated_empty', 'Ready state updates appear here after processing.'); }
    if(els.dashboardCaseCount){ els.dashboardCaseCount.textContent = String(state.cases.length); }
    if(els.metricFiles){ els.metricFiles.textContent = String(snapshot && snapshot.source_file_count || 0); }
    if(els.metricTemplates && state.registry){ els.metricTemplates.textContent = String(state.registry.template_count || 0); }
    if(els.metricVenue){ els.metricVenue.textContent = snapshot && snapshot.venue_county ? (snapshot.venue_county + ' County') : '-'; }
    if(els.metricCourt){ els.metricCourt.textContent = snapshot && snapshot.court_level ? snapshot.court_level : '-'; }
    if(els.blockerCount){ els.blockerCount.textContent = String(snapshot && snapshot.blocker_count || blockers.length); }
    if(els.warningCount){ els.warningCount.textContent = String(snapshot && snapshot.warning_count || warnings.length); }
    if(els.generationReadiness){ els.generationReadiness.textContent = summary.readiness; }
    if(els.generationState){ els.generationState.textContent = summary.statusCopy; }
    if(els.generationNote){ els.generationNote.textContent = summary.nextAction; }
    if(els.generationWarnings){
      var splitRequired = !!(consistency && safeArray(consistency.blockers).some(function(item){
        var text = String(item || '').toLowerCase();
        return text.indexOf('multiple debtor') !== -1 || text.indexOf('multiple unrelated plaintiff') !== -1 || text.indexOf('split') !== -1;
      }));
      var splitPanel = '';
      if(splitRequired){
        splitPanel =
          '<div class="inline-alert is-warning split-guidance"><strong>' + escapeHtml(t('workspace.split_required', 'Split required.')) + '</strong><span>' + escapeHtml(t('workspace.split_required.copy', 'Generation is blocked because the uploaded stack mixes matters. Use "Split into child matters" and re-process each clean debtor matter separately.')) + '</span></div>' +
          '<div class="workflow-mini-grid split-guidance-grid">' +
            '<div class="summary-card"><span>' + escapeHtml(t('workspace.debtor_matters_detected', 'Debtor matters detected')) + '</span><strong>' + escapeHtml(String(safeArray(consistency.detected_debtor_entities).length || 0)) + '</strong></div>' +
            '<div class="summary-card"><span>' + escapeHtml(t('workspace.plaintiff_source_groups', 'Plaintiff/source groups')) + '</span><strong>' + escapeHtml(String(safeArray(consistency.detected_plaintiff_entities).length || 0)) + '</strong></div>' +
          '</div>';
      }
      if(blockers.length || warnings.length || splitPanel){
        els.generationWarnings.innerHTML =
          splitPanel +
          '<div class="status-columns"><div><h4>' + escapeHtml(t('workspace.blockers', 'Blockers')) + '</h4><ul class="message-list">' +
          (blockers.length ? blockers.map(function(item){ return '<li>' + escapeHtml(item) + '</li>'; }).join('') : '<li class="empty-copy">' + escapeHtml(t('workspace.no_blockers', 'No blockers.')) + '</li>') +
          '</ul></div><div><h4>' + escapeHtml(t('workspace.warnings', 'Warnings')) + '</h4><ul class="message-list">' +
          (warnings.length ? warnings.map(function(item){ return '<li>' + escapeHtml(item) + '</li>'; }).join('') : '<li class="empty-copy">' + escapeHtml(t('workspace.no_warnings', 'No warnings.')) + '</li>') +
          '</ul></div></div>';
      } else {
        els.generationWarnings.innerHTML = '<p class="empty-copy">' + escapeHtml(t('workspace.no_blockers_warnings', 'No blockers or warnings for the current matter.')) + '</p>';
      }
    }
    renderStoredSourceFiles(caseRecord && caseRecord.source_files);
    renderMessages(els.blockerList, blockers, t('workspace.no_blockers_yet', 'No blockers yet.'));
    renderMessages(els.warningList, warnings, t('workspace.no_warnings_yet', 'No warnings yet.'));
    renderSunbiz(caseRecord && caseRecord.sunbiz_lookup, snapshot);
    renderGenerated(caseRecord && caseRecord.packet_generation, snapshot);
    renderGenerationProgress(caseRecord && caseRecord.generation_progress);
    renderCountyCandidates(caseRecord);
    renderInvoiceLedger(caseRecord);
    renderLegalCounts(caseRecord);
    renderExtractedSummary(caseRecord);
    renderSourceSetSummary(caseRecord);
    renderReconciliationSummary(caseRecord);
    renderLinkedRecords(caseRecord);
    renderMatterSummaryBand(caseRecord);
    if(!state.isProcessing){
      renderProcessingBanner({
        label: caseRecord && caseRecord.extracted_case_data && caseRecord.extracted_case_data.processed_at ? (feedback.tone === 'warning' ? 'Blocked' : 'Complete') : 'Queued',
        task: caseRecord ? feedback.message : 'No processing in progress.',
        stats: caseRecord && caseRecord.extracted_case_data && caseRecord.extracted_case_data.processed_at ? '4 / 4 stages completed' : '0 / 0 stages completed',
        percent: caseRecord && caseRecord.extracted_case_data && caseRecord.extracted_case_data.processed_at ? 100 : 0
      });
    }
    if(els.startProcessing){ els.startProcessing.disabled = state.isProcessing || !state.currentCaseId; }
    if(els.runSunbiz){ els.runSunbiz.disabled = state.isRunningSunbiz || !(caseRecord && caseRecord.extracted_case_data && caseRecord.extracted_case_data.processed_at); }
    if(els.splitCase){
      var showSplit = !!(caseRecord && blockers.some(function(item){
        var text = String(item || '').toLowerCase();
        return text.indexOf('multiple debtor') !== -1 || text.indexOf('multiple unrelated plaintiff') !== -1 || text.indexOf('split') !== -1;
      }));
      els.splitCase.hidden = !showSplit;
      els.splitCase.disabled = !showSplit;
    }
    populateReview(caseRecord);
    rewritePreservedLinks();
    updateCreateModeUI();
    syncGenerationControls();
  }

  function selectedDocumentTypes(allIfEmpty){
    var checked = checkedDocumentTypes().filter(function(documentType){
      return selectableDocumentTypes().indexOf(documentType) !== -1;
    });
    if(!checked.length && allIfEmpty){
      checked = selectableDocumentTypes();
    }
    state.selectedDocumentTypes = checked.slice();
    syncGenerationControls();
    return checked;
  }

  async function uploadSourceFiles(files){
    var normalized = Array.prototype.slice.call(files || []).filter(Boolean);
    if(!normalized.length || state.isUploading){ return; }
    if(!state.currentCaseId){
      try {
        renderProcessingBanner({ label: t('workspace.upload.preparing', 'Preparing'), task: t('workspace.upload.preparing.copy', 'Creating a clean matter for these uploaded files.'), stats: t('workspace.upload.stage_0', '0 / 4 stages reached'), percent: 4 });
        await ensureCaseForUpload();
      } catch (error){
        failProcessingFlow(error.message || t('workspace.upload.preparing.failed', 'Could not create a clean matter for upload.'));
        showToast(error.message || t('workspace.upload.preparing.failed', 'Could not create a clean matter for upload.'), 'warning');
        return;
      }
    }

    state.isUploading = true;
    normalized.forEach(initializeUploadItem);
    renderUploadProgress();

    try {
      await api.uploadSourceFilesWithProgress(state.currentCaseId, normalized, {
        onFileStatus: function(payload){
          var item = initializeUploadItem(payload.file);
          item.status = payload.status || item.status;
          item.percent = Math.max(item.percent, Number(payload.percent || 0));
          item.loaded = Number(payload.loaded || item.loaded || 0);
          item.total = Number(payload.total || item.total || 0);
          item.message = payload.message || '';
          renderUploadProgress();
        },
        onFileProgress: function(payload){
          var item = initializeUploadItem(payload.file);
          item.status = payload.status || 'uploading';
          item.loaded = Number(payload.loaded || 0);
          item.total = Number(payload.total || item.total || 0);
          item.percent = Number(payload.percent || 0);
          item.speedBps = Number(payload.speedBps || 0);
          item.etaSeconds = payload.etaSeconds;
          renderUploadProgress();
        },
        onOverallProgress: function(payload){
          if(els.uploadOverallFill){ els.uploadOverallFill.style.width = String(payload.percent || 0) + '%'; }
          if(els.uploadOverallStats){
            els.uploadOverallStats.textContent = String(payload.percent || 0) + '% - ' + formatBytes(payload.loaded || 0) + ' / ' + formatBytes(payload.total || 0) + ' - ' + formatSpeed(payload.speedBps) + ' - ETA ' + formatEta(payload.etaSeconds);
          }
        }
      });
      await refreshCurrentCase();
      beginProcessingFlow('Upload complete. Parsing source documents.');
      try {
        var processed = await api.processCase(state.currentCaseId);
        state.currentCase = processed;
        await Promise.allSettled([loadCases(), loadActivity(state.currentCaseId), loadRegistry(state.currentCaseId)]);
        var uploadFeedback = processingFeedback(processed);
        finishProcessingFlow(processed, uploadFeedback.message, uploadFeedback.tone);
        showToast(uploadFeedback.tone === 'warning' ? uploadFeedback.message : 'Files uploaded and analyzed.', uploadFeedback.tone);
        if(shouldReturnToActionCenter()){
          window.setTimeout(function(){ redirectToActionCenter(state.currentCaseId); }, 220);
          return;
        }
      } catch (processError){
        try { await refreshCurrentCase(); } catch (refreshError){}
        var processDetail = processError && processError.detail && typeof processError.detail === 'object' ? processError.detail : null;
        var processBlockers = processDetail && Array.isArray(processDetail.blockers) ? processDetail.blockers : [];
        var processMessage = processError.message || 'Files uploaded, but analysis needs review.';
        if(processBlockers.length){ processMessage = processBlockers[0]; }
        finishProcessingFlow(state.currentCase || null, processMessage, 'warning');
        showToast(processMessage, 'warning');
      }
    } catch (error){
      failProcessingFlow(error.message || 'Upload failed.');
      showToast(error.message || 'Upload failed.', 'warning');
    } finally {
      state.isUploading = false;
      renderUploadProgress();
    }
  }

  async function handleProcessCase(){
    if(!state.currentCaseId || state.isProcessing){
      showToast(t('workspace.toast.upload_first', 'Upload client files first or open an existing matter.'), 'warning');
      return;
    }
    state.isProcessing = true;
    if(els.startProcessing){ els.startProcessing.disabled = true; }
    beginProcessingFlow('Processing uploaded PDF and Excel files.');
    try {
      var processed = await api.processCase(state.currentCaseId);
      state.currentCase = processed;
      await Promise.allSettled([loadCases(), loadActivity(state.currentCaseId), loadRegistry(state.currentCaseId)]);
      var processedFeedback = processingFeedback(processed);
      finishProcessingFlow(processed, processedFeedback.message, processedFeedback.tone);
      showToast(processedFeedback.tone === 'warning' ? processedFeedback.message : 'Processing complete.', processedFeedback.tone);
      if(shouldReturnToActionCenter()){
        window.setTimeout(function(){ redirectToActionCenter(state.currentCaseId); }, 220);
        return;
      }
    } catch (error){
      try { await refreshCurrentCase(); } catch (refreshError){}
      var detail = error && error.detail && typeof error.detail === 'object' ? error.detail : null;
      var blockers = detail && Array.isArray(detail.blockers) ? detail.blockers : [];
      var message = error.message || 'Processing failed.';
      if(blockers.length){ message = blockers[0]; }
      failProcessingFlow(message);
      renderCase(state.currentCase || null);
      showToast(message, 'warning');
    }
  }

  async function pollGeneration(){
    if(!state.currentCaseId){ return; }
    try {
      var payload = await api.getGenerationProgress(state.currentCaseId);
      if(payload && payload.generation_progress){
        renderGenerationProgress(payload.generation_progress);
      }
      if(payload && payload.packet_generation){
        renderGenerated(payload.packet_generation);
      }
      var progress = payload && payload.generation_progress ? payload.generation_progress : null;
      var terminal = ['completed', 'completed_with_blockers', 'blocked', 'failed', 'idle'];
      if(progress && terminal.indexOf(progress.status) !== -1){
        state.isGenerating = false;
        stopGenerationPolling();
        await refreshCurrentCase();
        if(progress.status === 'completed'){
          showToast(progress.message || 'Generation completed.', 'success');
        } else if(progress.status === 'completed_with_blockers'){
          showToast(progress.message || 'Generation completed with blockers.', 'warning');
        } else if(progress.status === 'blocked'){
          showToast(progress.message || 'Generation blocked.', 'warning');
        } else if(progress.status === 'failed'){
          showToast(progress.message || 'Generation failed.', 'warning');
        }
      } else {
        syncGenerationControls();
      }
    } catch (error){
      state.isGenerating = false;
      stopGenerationPolling();
      syncGenerationControls();
      showToast(error.message || 'Could not read generation progress.', 'warning');
    }
  }

  async function startGeneration(useAll){
    if(!canGeneratePackets()){
      showToast(generateLockMessage(), 'warning');
      return;
    }
    if(!state.currentCaseId || state.isGenerating){
      showToast(t('workspace.toast.upload_first', 'Upload client files first or open an existing matter.'), 'warning');
      return;
    }
    var selected = useAll ? selectableDocumentTypes() : selectedDocumentTypes(false);
    if(useAll){
      state.selectedDocumentTypes = selected.slice();
      syncGenerationControls();
    }
    if(!selected.length){
      showToast(t('workspace.toast.select_document', 'Select at least one available document first.'), 'warning');
      return;
    }
    try {
      state.isGenerating = true;
      syncGenerationControls();
      var response = await api.startGeneration(state.currentCaseId, selected, false);
      if(response && response.generation_progress){
        renderGenerationProgress(response.generation_progress);
      }
      stopGenerationPolling();
      state.generationPoller = window.setInterval(pollGeneration, 700);
      await pollGeneration();
    } catch (error){
      var detail = error && error.detail && typeof error.detail === 'object' ? error.detail : null;
      var message = error.message || 'Could not start generation.';
      if(detail && Array.isArray(detail.blockers) && detail.blockers.length){
        message = detail.blockers[0];
      }
      state.isGenerating = false;
      syncGenerationControls();
      showToast(message, 'warning');
    }
  }

  function bindLayout(){
    if(els.overlay){
      els.overlay.addEventListener('click', function(){
        closeSidebar();
      });
    }
    safeArray(els.navButtons).forEach(function(button){
      button.addEventListener('click', function(){
        goToScreen(button.getAttribute('data-nav-target'), state.currentCaseId);
      });
    });
    if(els.caseSearch){
      els.caseSearch.addEventListener('input', renderCaseList);
      els.caseSearch.addEventListener('keydown', function(event){
        if(event.key !== 'Enter'){ return; }
        var first = filteredCases(els.caseSearch.value)[0];
        if(first){
          event.preventDefault();
          openCase(first.id);
        }
      });
    }
  }

  function bindForms(){
    if(els.createForm){
      els.createForm.addEventListener('submit', async function(event){
        event.preventDefault();
        if(!canCreateCases()){
          showToast(createLockMessage(), 'warning');
          return;
        }
        var formData = new FormData(els.createForm);
        var payload = {
          reference: (formData.get('reference') || '').toString().trim() || null,
          matter_name: (formData.get('matter_name') || '').toString().trim() || null,
          plaintiff_name: (formData.get('plaintiff_name') || '').toString().trim() || null,
          defendant_name: (formData.get('defendant_name') || '').toString().trim() || null,
          notes: null,
          environment_tag: currentEngine(),
          record_type: currentRecordType(),
          linked_case_id: linkedCaseId() || null
        };
        try {
          clearStoredActiveCaseId();
          var created = await api.createCase(payload);
          state.currentCaseId = created.id;
          setStoredActiveCaseId(created.id);
          showToast(createVerb().charAt(0).toUpperCase() + createVerb().slice(1) + ' created. Opening Action Center...', 'success');
          window.location.href = withCase('../action-center/', created.id);
        } catch (error){
          showToast(error.message || ('Could not create ' + createVerb() + '.'), 'warning');
        }
      });
    }
    safeArray(els.reviewForms).forEach(function(form){
      form.addEventListener('submit', async function(event){
        event.preventDefault();
        if(!state.currentCaseId){
          showToast('Open a matter before saving review edits.', 'warning');
          return;
        }
        try {
          var updated = await api.reviewCase(state.currentCaseId, collectReviewPayload(form));
          state.currentCase = updated;
          renderCase(updated);
          await Promise.allSettled([loadCases(), loadActivity(state.currentCaseId), loadRegistry(state.currentCaseId)]);
          showToast('Review edits saved.', 'success');
        } catch (error){
          showToast(error.message || 'Could not save review edits.', 'warning');
        }
      });
    });
    if(els.communicationForm){
      els.communicationForm.addEventListener('submit', async function(event){
        event.preventDefault();
        if(!state.currentCaseId){
          showToast('Open a matter before saving a communication note.', 'warning');
          return;
        }
        var summary = (els.communicationSummary && els.communicationSummary.value || '').trim();
        var body = (els.communicationBody && els.communicationBody.value || '').trim();
        if(!summary){
          showToast('Add a short communication summary first.', 'warning');
          return;
        }
        try {
          await api.addCaseCommunication(state.currentCaseId, {
            entry_type: 'manual_note',
            channel: 'manual_review',
            direction: 'internal',
            summary: summary,
            body: body || null
          });
          resetForm(els.communicationForm);
          await refreshCurrentCase();
          showToast('Communication note saved.', 'success');
        } catch (error){
          showToast(error.message || 'Could not save the communication note.', 'warning');
        }
      });
    }
    if(els.settlementForm){
      els.settlementForm.addEventListener('submit', async function(event){
        event.preventDefault();
        if(!state.currentCaseId){
          showToast('Open a matter before saving a settlement tracker entry.', 'warning');
          return;
        }
        try {
          await api.saveSettlementTracker(state.currentCaseId, {
            proposal_type: els.settlementType ? els.settlementType.value : 'settlement_offer',
            status: els.settlementStatus ? els.settlementStatus.value : 'draft',
            title: els.settlementTitle && els.settlementTitle.value ? els.settlementTitle.value.trim() : null,
            proposed_amount: els.settlementAmount && els.settlementAmount.value ? els.settlementAmount.value.trim() : null,
            proposed_payment_count: els.settlementPayments && els.settlementPayments.value ? Number(els.settlementPayments.value) : null,
            proposed_first_payment_date: els.settlementFirstDate && els.settlementFirstDate.value ? els.settlementFirstDate.value : null,
            summary: els.settlementSummary && els.settlementSummary.value ? els.settlementSummary.value.trim() : null,
            term_summary: els.settlementTerms && els.settlementTerms.value ? els.settlementTerms.value.trim() : null,
            linked_route_status: state.currentCase && state.currentCase.extracted_case_data && state.currentCase.extracted_case_data.recovery_truth
              ? state.currentCase.extracted_case_data.recovery_truth.route_status
              : null,
            reason_codes: state.currentCase && state.currentCase.extracted_case_data && state.currentCase.extracted_case_data.recovery_truth
              ? safeArray(state.currentCase.extracted_case_data.recovery_truth.route_reason_codes)
              : []
          });
          resetForm(els.settlementForm);
          await refreshCurrentCase();
          showToast('Settlement tracker updated.', 'success');
        } catch (error){
          showToast(error.message || 'Could not save the settlement tracker entry.', 'warning');
        }
      });
    }
    if(els.deadlineOverrideForm){
      els.deadlineOverrideForm.addEventListener('submit', async function(event){
        event.preventDefault();
        if(!state.currentCaseId){
          showToast('Open a matter before saving a deadline override.', 'warning');
          return;
        }
        var label = (els.deadlineOverrideLabel && els.deadlineOverrideLabel.value || '').trim();
        if(!label){
          showToast('Add a deadline label first.', 'warning');
          return;
        }
        try {
          await api.saveDeadlineOverride(state.currentCaseId, {
            deadline_type: 'manual_override',
            label: label,
            date: els.deadlineOverrideDate && els.deadlineOverrideDate.value ? els.deadlineOverrideDate.value : null,
            reason: els.deadlineOverrideReason && els.deadlineOverrideReason.value ? els.deadlineOverrideReason.value.trim() : null
          });
          resetForm(els.deadlineOverrideForm);
          await refreshCurrentCase();
          showToast('Deadline override saved.', 'success');
        } catch (error){
          showToast(error.message || 'Could not save the deadline override.', 'warning');
        }
      });
    }
    if(els.refreshCases){
      els.refreshCases.addEventListener('click', function(){ loadCases().catch(function(error){ showToast(error.message || 'Could not refresh cases.', 'warning'); }); });
    }
    if(els.refreshCase){
      els.refreshCase.addEventListener('click', function(){ refreshCurrentCase().catch(function(error){ showToast(error.message || 'Could not refresh case.', 'warning'); }); });
    }
    if(els.startProcessing){
      els.startProcessing.addEventListener('click', function(){ handleProcessCase(); });
    }
    if(els.runSunbiz){
      els.runSunbiz.addEventListener('click', function(){ handleSunbiz(); });
    }
    if(els.splitCase){
      els.splitCase.addEventListener('click', async function(){
        if(!state.currentCaseId){ return; }
        try {
          var result = await api.splitCaseByDebtor(state.currentCaseId);
          await loadCases();
          var createdCases = safeArray(result && result.created_cases);
          if(createdCases.length){
            await openCase(createdCases[0].case_id);
          } else {
            await refreshCurrentCase();
          }
          showToast('Child matters created from the mixed upload.', 'success');
        } catch (error){
          showToast(error.message || 'Could not split the mixed matter.', 'warning');
        }
      });
    }
    if(els.selectAllDocs){
      els.selectAllDocs.addEventListener('click', function(){
        qa('[data-doc-checkbox]:not(:disabled)').forEach(function(node){ node.checked = true; });
        selectedDocumentTypes(true);
      });
    }
    if(els.clearAllDocs){
      els.clearAllDocs.addEventListener('click', function(){
        qa('[data-doc-checkbox]').forEach(function(node){ node.checked = false; });
        selectedDocumentTypes(false);
      });
    }
    if(els.generateSelected){
      els.generateSelected.addEventListener('click', function(){ startGeneration(false); });
    }
    if(els.generateAll){
      els.generateAll.addEventListener('click', function(){ startGeneration(true); });
    }
  }

  async function boot(){
    bindLayout();
    bindForms();
    bindDropzone();
    rewritePreservedLinks();
    renderUploadProgress();
    renderProcessingBanner({ label: 'Queued', task: 'No processing in progress.', stats: '0 / 0 stages completed', percent: 0 });
    renderGenerationProgress(null);
    var healthy = await healthCheck();
    if(!healthy){
      renderCase(null);
      return;
    }
    await loadCases();
    updateCreateModeUI();
    var explicitCase = params().get('case') || '';
    if(isCreateMode()){
      clearStoredActiveCaseId();
      state.currentCaseId = null;
      state.currentCase = null;
      await loadRegistry('');
      renderCase(null);
      return;
    }
    var requested = explicitCase || (shouldUseStoredActiveCase() ? getStoredActiveCaseId() : '');
    if(requested){
      try {
        await openCase(requested);
        return;
      } catch (error){
        clearStoredActiveCaseId();
      }
    }
    await loadRegistry('');
    renderCase(null);
  }

  document.addEventListener('vcx:i18n:change', function(){
    renderCaseList();
    renderDocumentSelection();
    renderGenerationProgress(state.currentCase && state.currentCase.generation_progress);
    renderCase(state.currentCase);
  });
  window.addEventListener('docketmint:session', function(){
    syncGenerationControls();
  });

  boot().catch(function(error){
    if(els.apiStatus){
      els.apiStatus.textContent = error && error.message ? error.message : 'Workspace failed to initialize.';
    }
  });
  window.DocketMintWorkspaceUploadSourceFiles = uploadSourceFiles;
})();

