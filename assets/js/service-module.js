(function(){
  var api = window.DocketMintApi;
  var i18n = window.VCXI18n;
  if(!api){ return; }

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

  function t(key, fallback){
    return i18n ? i18n.t(key, fallback) : (fallback || key);
  }

  function params(){
    try { return new URLSearchParams(window.location.search || ''); }
    catch (error){ return new URLSearchParams(''); }
  }

  function currentCaseId(){
    try {
      var explicit = params().get('case') || '';
      if(explicit){ return explicit; }
      if(api.getActiveCaseId){ return api.getActiveCaseId() || ''; }
    } catch (error){}
    return '';
  }

  function withCase(route){
    var caseId = currentCaseId();
    try {
      var url = new URL(route, window.location.origin);
      if(caseId && url.pathname.indexOf('/app/') === 0){ url.searchParams.set('case', caseId); }
      return url.pathname + url.search + url.hash;
    } catch (error){
      return route;
    }
  }

  function money(value){
    if(value === null || value === undefined || value === ''){ return '-'; }
    var number = Number(value);
    if(!isFinite(number)){ return '-'; }
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(number);
    } catch (error){
      return '$' + number.toFixed(2);
    }
  }

  function moneyOrPlaceholder(value, fallback){
    var formatted = money(value);
    return formatted === '-' ? (fallback || '-') : formatted;
  }

  function compactStatus(value){
    return String(value || '').replace(/_/g, ' ') || '-';
  }

  function humanize(value, fallback){
    var text = String(value || fallback || '').trim();
    if(!text){ return fallback || '-'; }
    return text.replace(/_/g, ' ');
  }

  function infoCard(label, value){
    return '<div class="summary-item"><span>' + escapeHtml(label) + '</span><strong>' + escapeHtml(value == null || value === '' ? '-' : value) + '</strong></div>';
  }

  function listItems(items, emptyText){
    var values = Array.isArray(items) ? items.filter(Boolean) : [];
    if(!values.length){
      return '<div class="empty-copy">' + escapeHtml(emptyText) + '</div>';
    }
    return '<div class="stack-list">' + values.map(function(item){
      return '<div>' + escapeHtml(item) + '</div>';
    }).join('') + '</div>';
  }

  var MODULE_GUIDES = {
    contract_intelligence: {
      title: 'How to use this service',
      subtitle: 'Upload the contract package, review the clause findings, and decide what to fix before you negotiate or sign. Nothing is sent automatically.',
      items: [
        { label: 'What to upload', copy: 'Contract, MSA, SOW, guaranty, addendum, or any agreement files that control the business deal.' },
        { label: 'Optional supporting files', copy: 'Redlines, prior drafts, counterparty comments, and internal deal notes.' },
        { label: 'What we check', copy: 'Strong clauses, weak clauses, missing protections, dangerous terms, and practical drafting risk.' },
        { label: 'What you receive', copy: 'Expanded findings with plain-language commentary, fallback wording, and legal-commercial caution where law can vary.' },
        { label: 'Important limits', copy: 'This is a structured risk review, not a guarantee that every clause is enforceable in every state or fact pattern.' },
        { label: 'How to proceed', copy: 'Run the stronger-contract workflow if you want a revised stronger draft and detailed change memo.' }
      ]
    },
    best_contract_builder: {
      title: 'How to use this service',
      subtitle: 'Use this after contract review or upload a draft directly, then generate a stronger version and review the change memo before sending it out.',
      items: [
        { label: 'What to upload', copy: 'A contract draft, master agreement, order form, guaranty, or other agreement you want strengthened.' },
        { label: 'Optional supporting files', copy: 'Negotiation notes, fallback clauses, prior redlines, and internal approval comments.' },
        { label: 'What we check', copy: 'Business intent, payment and default language, fee shifting, notices, venue, assignment, liability, and related protections.' },
        { label: 'What you receive', copy: 'A revised stronger draft plus a change memo that explains what was strengthened and why.' },
        { label: 'Important limits', copy: 'State-specific enforceability still depends on governing law, facts, and downstream review.' },
        { label: 'How to proceed', copy: 'Review the stronger draft carefully before sharing it with the counterparty. Nothing is sent automatically.' }
      ]
    },
    venue_engine: {
      title: 'How to use this service',
      subtitle: 'Open a matter with the contract and party information already uploaded, then review the suggested forum and venue support before filing anything.',
      items: [
        { label: 'What to upload', copy: 'Contract, invoices, correspondence, and party address information inside the current matter.' },
        { label: 'Optional supporting files', copy: 'Service addresses, delivery records, guaranties, and location-specific deal documents.' },
        { label: 'What we check', copy: 'Forum clauses, venue clues, county hints, service address support, and apparent filing blockers.' },
        { label: 'What you receive', copy: 'A venue summary with recommended forum logic and the reasons currently supported by the uploaded record.' },
        { label: 'Important limits', copy: 'Venue and jurisdiction remain fact-specific and can vary by court rules and governing law.' },
        { label: 'How to proceed', copy: 'Use this after uploads and processing so the matter has enough location evidence to evaluate.' }
      ]
    },
    entity_verification: {
      title: 'How to use this service',
      subtitle: 'Keep this workflow scoped to the current matter, run entity checks, and confirm the counterparty before you demand payment or prepare filings.',
      items: [
        { label: 'What to upload', copy: 'Current matter documents that identify the counterparty name, address, signer, or guarantor.' },
        { label: 'Optional supporting files', copy: 'Secretary of State screenshots, prior demand letters, signed guaranties, and address records.' },
        { label: 'What we check', copy: 'Entity name consistency, verification status, available provider notes, and obvious mismatch risk.' },
        { label: 'What you receive', copy: 'A verification snapshot showing what matched, what is missing, and where the record still needs review.' },
        { label: 'Important limits', copy: 'Provider coverage is honest and limited to available lawful sources. No hidden people-search data is implied.' },
        { label: 'How to proceed', copy: 'Use the result to clean up the matter before you build a demand packet or prepare filing documents.' }
      ]
    },
    evidence_audit: {
      title: 'How to use this service',
      subtitle: 'Process the matter first, then use this page to see blockers, warnings, and gaps in the record before moving to packet generation.',
      items: [
        { label: 'What to upload', copy: 'Contracts, invoices, ledgers, emails, proof of work, and any supporting exhibits inside the current matter.' },
        { label: 'Optional supporting files', copy: 'Acceptance emails, guaranties, photos, and delivery or completion confirmation.' },
        { label: 'What we check', copy: 'Missing evidence, inconsistent parties, blocker-level gaps, and weaker proof that can limit the next step.' },
        { label: 'What you receive', copy: 'A focused blocker and warning view so you can repair the record before exporting a packet.' },
        { label: 'Important limits', copy: 'A clean audit does not guarantee litigation readiness. It only reflects the currently uploaded record.' },
        { label: 'How to proceed', copy: 'Resolve blockers first, then return to Action Center or the recovery workflow.' }
      ]
    },
    damages_calculator: {
      title: 'How to use this service',
      subtitle: 'Use the processed matter to review approved totals, reconciliation status, and invoice rows before you rely on the amount demanded.',
      items: [
        { label: 'What to upload', copy: 'Invoices, ledger statements, payment history, credits, and any source record supporting the amount due.' },
        { label: 'Optional supporting files', copy: 'Settlement offsets, credit memos, and spreadsheet reconciliations.' },
        { label: 'What we check', copy: 'Approved totals, case summary totals, invoice rows, reconciliation mismatches, and missing ledger support.' },
        { label: 'What you receive', copy: 'A clean damages snapshot showing what is currently supported and where the numbers may still need review.' },
        { label: 'Important limits', copy: 'This is a calculation and reconciliation layer, not a final damages opinion for every jurisdiction.' },
        { label: 'How to proceed', copy: 'Confirm the number here before generating a demand packet or filing-ready summary.' }
      ]
    },
    forms_autofill: {
      title: 'How to use this service',
      subtitle: 'Process the current matter first, then generate only the supported outputs. Nothing is filed or sent automatically.',
      items: [
        { label: 'What to upload', copy: 'Matter files that support the requested court forms, including party details, venue support, and amounts.' },
        { label: 'Optional supporting files', copy: 'Guaranties, exhibits, and extra source files that fill gaps in the form set.' },
        { label: 'What we check', copy: 'Available templates, missing data, document blockers, and whether each form is ready, blocked, or not applicable.' },
        { label: 'What you receive', copy: 'Supported draft outputs generated from the active matter and the current template library.' },
        { label: 'Important limits', copy: 'Unavailable templates and unresolved blocker states are shown honestly instead of being hidden.' },
        { label: 'How to proceed', copy: 'Generate only after the matter is processed and the readiness state looks clean.' }
      ]
    },
    pre_suit_demand: {
      title: 'How to use this service',
      subtitle: 'Use this after the matter is processed so the recovery packet reflects the strongest available balance and evidence set. Nothing is sent automatically.',
      items: [
        { label: 'What to upload', copy: 'Contract or agreement, invoices, payment ledger, emails, and proof of delivery or completion.' },
        { label: 'Optional supporting files', copy: 'Personal guaranty, acceptance emails, change orders, or settlement history.' },
        { label: 'What we check', copy: 'Supported balance, invoice count, contract protections, missing evidence, and the best next recovery path.' },
        { label: 'What you receive', copy: 'Balance summary, evidence checklist, demand draft, and a recommended next step for recovery.' },
        { label: 'Important limits', copy: 'This workflow does not replace state-specific filing review or litigation counsel.' },
        { label: 'How to proceed', copy: 'Resolve blockers first if the matter still shows missing core evidence.' }
      ]
    },
    template_library: {
      title: 'How to use this service',
      subtitle: 'This page is a library coverage view. It shows the controlled system templates only and does not pull random user uploads into the library.',
      items: [
        { label: 'What to upload', copy: 'Nothing here by default. This page reflects the controlled system template library.' },
        { label: 'Optional supporting files', copy: 'Case-specific overrides are admin-only and must be attached deliberately inside the right matter.' },
        { label: 'What we check', copy: 'Which templates are present, which are missing, and whether the system library is complete.' },
        { label: 'What you receive', copy: 'A transparent inventory of available templates, missing files, and source-of-truth coverage.' },
        { label: 'Important limits', copy: 'This page is not a case workspace and does not auto-attach files from unrelated services.' },
        { label: 'How to proceed', copy: 'Review coverage here, then open the relevant matter or workflow when you are ready to generate outputs.' }
      ]
    },
    ocr_source_map: {
      title: 'How to use this service',
      subtitle: 'Open a processed matter to see which uploaded files produced the current text and source clues. Nothing is merged across services automatically.',
      items: [
        { label: 'What to upload', copy: 'Uploaded PDFs, images, and source documents inside the active matter.' },
        { label: 'Optional supporting files', copy: 'Additional scans or clearer photos if OCR quality needs improvement.' },
        { label: 'What we check', copy: 'File-by-file extracted text previews and the source map behind the current record.' },
        { label: 'What you receive', copy: 'A traceable OCR view showing which source files fed the workflow.' },
        { label: 'Important limits', copy: 'OCR quality depends on the source scan, image quality, and underlying document structure.' },
        { label: 'How to proceed', copy: 'Replace weak scans or add cleaner uploads if the extracted text is incomplete.' }
      ]
    },
    human_review: {
      title: 'How to use this service',
      subtitle: 'Use this page to correct or confirm core case facts after processing. Nothing is sent automatically.',
      items: [
        { label: 'What to upload', copy: 'A processed matter with source files already attached.' },
        { label: 'Optional supporting files', copy: 'Additional records that help confirm names, amount, venue, or party roles.' },
        { label: 'What we check', copy: 'Core extracted facts that often need human confirmation before packet generation.' },
        { label: 'What you receive', copy: 'A controlled review form that lets you correct the record and preserve a cleaner matter state.' },
        { label: 'Important limits', copy: 'This is a human validation layer, not an automated legal conclusion engine.' },
        { label: 'How to proceed', copy: 'Save corrections here, then return to Action Center or the next workflow step.' }
      ]
    }
  };

  var MODULES = {
    contract_intelligence: {
      kicker: 'domain.contracts_risk',
      title: 'service.contract_intelligence.name',
      subtitle: 'module.contract_intelligence.subtitle',
      detailTitle: 'module.contract_intelligence.detail_title',
      detailCopy: 'module.contract_intelligence.detail_copy',
      emptyCopy: 'module.current_matter.empty',
      loadRegistry: false
    },
    best_contract_builder: {
      kicker: 'domain.contracts_risk',
      title: 'service.best_contract_builder.name',
      subtitle: 'module.best_contract_builder.subtitle',
      detailTitle: 'module.best_contract_builder.detail_title',
      detailCopy: 'module.best_contract_builder.detail_copy',
      emptyCopy: 'module.current_matter.empty',
      loadRegistry: false
    },
    venue_engine: {
      kicker: 'domain.b2b_recovery',
      title: 'service.venue_engine.name',
      subtitle: 'module.venue_engine.subtitle',
      detailTitle: 'module.venue_engine.detail_title',
      detailCopy: 'module.venue_engine.detail_copy',
      emptyCopy: 'module.current_matter.empty',
      loadRegistry: false
    },
    entity_verification: {
      kicker: 'domain.b2b_recovery',
      title: 'service.entity_verification.name',
      subtitle: 'module.entity_verification.subtitle',
      detailTitle: 'module.entity_verification.detail_title',
      detailCopy: 'module.entity_verification.detail_copy',
      emptyCopy: 'module.current_matter.empty',
      loadRegistry: false
    },
    evidence_audit: {
      kicker: 'domain.b2b_recovery',
      title: 'service.evidence_audit.name',
      subtitle: 'module.evidence_audit.subtitle',
      detailTitle: 'module.evidence_audit.detail_title',
      detailCopy: 'module.evidence_audit.detail_copy',
      emptyCopy: 'module.current_matter.empty',
      loadRegistry: false
    },
    damages_calculator: {
      kicker: 'domain.b2b_recovery',
      title: 'service.damages_calculator.name',
      subtitle: 'module.damages_calculator.subtitle',
      detailTitle: 'module.damages_calculator.detail_title',
      detailCopy: 'module.damages_calculator.detail_copy',
      emptyCopy: 'module.current_matter.empty',
      loadRegistry: false
    },
    forms_autofill: {
      kicker: 'domain.b2b_recovery',
      title: 'service.forms_autofill.name',
      subtitle: 'module.forms_autofill.subtitle',
      detailTitle: 'module.forms_autofill.detail_title',
      detailCopy: 'module.forms_autofill.detail_copy',
      emptyCopy: 'module.current_matter.empty',
      loadRegistry: true
    },
    pre_suit_demand: {
      kicker: 'domain.b2b_recovery',
      title: 'Invoice Recovery OS',
      subtitle: 'Review supported balance, evidence gaps, and the best next step for unpaid invoice recovery.',
      detailTitle: 'Invoice Recovery OS',
      detailCopy: 'This module uses the active matter to build a recovery packet with balance support, missing evidence, and demand outputs.',
      emptyCopy: 'module.current_matter.empty',
      loadRegistry: true
    },
    template_library: {
      kicker: 'domain.quality_library',
      title: 'service.template_library.name',
      subtitle: 'Review the controlled system template library, confirm coverage, and see missing files without mixing in unrelated matter uploads.',
      summaryTitle: 'Library coverage',
      detailTitle: 'Available templates',
      detailCopy: 'This page shows controlled system template coverage. It does not pull uploads from unrelated matters automatically.',
      emptyCopy: 'module.template_library.empty',
      loadRegistry: true
    },
    ocr_source_map: {
      kicker: 'domain.quality_library',
      title: 'service.ocr_source_map.name',
      subtitle: 'module.ocr_source_map.subtitle',
      detailTitle: 'module.ocr_source_map.detail_title',
      detailCopy: 'module.ocr_source_map.detail_copy',
      emptyCopy: 'module.current_matter.empty',
      loadRegistry: false
    },
    human_review: {
      kicker: 'domain.quality_library',
      title: 'service.human_review.name',
      subtitle: 'module.human_review.subtitle',
      detailTitle: 'module.human_review.detail_title',
      detailCopy: 'module.human_review.detail_copy',
      emptyCopy: 'module.current_matter.empty',
      loadRegistry: false
    }
  };

  function moduleConfig(){
    var slug = (document.body.getAttribute('data-module-slug') || '').trim();
    return { slug: slug, config: MODULES[slug] || null };
  }

  function setHeader(config){
    var kicker = q('[data-module-kicker]');
    var title = q('[data-module-title]');
    var subtitle = q('[data-module-subtitle]');
    var summaryTitle = q('[data-module-summary-title]');
    var detailTitle = q('[data-module-detail-title]');
    var detailCopy = q('[data-module-detail-copy]');
    if(kicker){ kicker.textContent = t(config.kicker, config.kicker); }
    if(title){ title.textContent = t(config.title, config.title); }
    if(subtitle){ subtitle.textContent = t(config.subtitle, 'Use the active matter and the current upload set to complete this workflow.'); }
    if(summaryTitle){
      summaryTitle.textContent = t(config.summaryTitle || 'module.summary.matter_title', config.summaryTitle || 'Current matter');
    }
    if(detailTitle){ detailTitle.textContent = t(config.detailTitle, 'Current module detail'); }
    if(detailCopy){ detailCopy.textContent = t(config.detailCopy, 'This module works from the active matter in Workspace.'); }
  }

  function ensureGuideShell(){
    var existing = q('[data-module-guide]');
    if(existing){ return existing; }
    var main = q('#serviceModuleMain');
    var header = main ? main.querySelector('.page-header') : null;
    if(!main || !header){ return null; }
    var shell = document.createElement('section');
    shell.className = 'workspace-panel service-guide';
    shell.setAttribute('data-module-guide', '');
    shell.hidden = true;
    header.insertAdjacentElement('afterend', shell);
    return shell;
  }

  function renderGuide(slug){
    var guide = MODULE_GUIDES[slug];
    var shell = ensureGuideShell();
    if(!shell){
      return;
    }
    if(!guide){
      shell.hidden = true;
      shell.innerHTML = '';
      return;
    }
    shell.hidden = false;
    shell.innerHTML =
      '<div class="subhead">' +
        '<div><h2>' + escapeHtml(guide.title) + '</h2></div>' +
        '<span class="micro-note">' + escapeHtml(guide.subtitle) + '</span>' +
      '</div>' +
      '<div class="service-guide-grid">' +
        guide.items.map(function(item){
          return '<div><strong>' + escapeHtml(item.label) + '</strong><p>' + escapeHtml(item.copy) + '</p></div>';
        }).join('') +
      '</div>';
  }

  function renderEmpty(config){
    var summary = q('[data-module-summary]');
    var detail = q('[data-module-detail]');
    var actions = q('[data-module-actions]');
    if(actions){
      actions.innerHTML =
        '<a class="btn btn-primary" href="' + escapeHtml(withCase('/app/workspace/#source-operations')) + '">' + escapeHtml(t('module.action.open_uploads', 'Open uploads')) + '</a>' +
        '<a class="btn btn-secondary" href="' + escapeHtml(withCase('/app/workspace/')) + '">' + escapeHtml(t('module.action.open_workspace', 'Open workspace')) + '</a>';
    }
    if(summary){
      summary.innerHTML =
        '<div class="workflow-alert is-info">' +
          '<strong>' + escapeHtml(t('module.current_matter.none', 'No active matter')) + '</strong>' +
          '<span>' + escapeHtml(t(config.emptyCopy, 'Open or create a matter, upload source files, and return to this module.')) + '</span>' +
        '</div>';
    }
    if(detail){
      detail.innerHTML = '<div class="empty-copy">' + escapeHtml(t(config.emptyCopy, 'Open or create a matter, upload source files, and return to this module.')) + '</div>';
    }
  }

  function renderMatterSummary(record){
    var snapshot = record && record.client_snapshot ? record.client_snapshot : null;
    var summary = q('[data-module-summary]');
    if(!summary){ return; }
    if(!record || !snapshot){
      summary.innerHTML = '<div class="empty-copy">' + escapeHtml(t('module.current_matter.none', 'No active matter')) + '</div>';
      return;
    }
    summary.innerHTML =
      '<div class="summary-grid">' +
        infoCard(t('module.summary.matter', 'Matter'), snapshot.matter_label || record.title || record.reference || record.id) +
        infoCard(t('module.summary.status', 'Status'), compactStatus(snapshot.status || record.status)) +
        infoCard(t('module.summary.source_files', 'Source files'), String(snapshot.source_file_count || 0)) +
        infoCard(t('module.summary.amount', 'Approved amount'), moneyOrPlaceholder(snapshot.display_amount, t('module.summary.amount_pending', 'Pending review'))) +
        infoCard(t('module.summary.blockers', 'Blockers'), String(snapshot.blocker_count || 0)) +
        infoCard(t('module.summary.warnings', 'Warnings'), String(snapshot.warning_count || 0)) +
      '</div>';
  }

  function renderLibrarySummary(registry){
    var summary = q('[data-module-summary]');
    if(!summary){ return; }
    var templates = templateList(registry);
    var available = templates.filter(function(item){ return !!item.available; }).length;
    var missing = Array.isArray(registry && registry.missing_templates) ? registry.missing_templates.length : 0;
    summary.innerHTML =
      '<div class="summary-grid">' +
        infoCard('Library mode', humanize(registry && registry.mode, 'internal system template library')) +
        infoCard('Templates listed', String((registry && registry.template_count) || templates.length || 0)) +
        infoCard('Available now', String(available)) +
        infoCard('Missing files', String(missing)) +
        infoCard('Case overrides', humanize(registry && registry.case_override_mode, 'admin only optional')) +
        infoCard('Runtime uploads required', registry && registry.runtime_user_template_upload_required ? 'Yes' : 'No') +
      '</div>';
  }

  function renderDefaultActions(extra){
    var actions = q('[data-module-actions]');
    if(!actions){ return; }
    var buttons = [
      '<a class="btn btn-primary" href="' + escapeHtml(withCase('/app/workspace/')) + '">' + escapeHtml(t('module.action.open_workspace', 'Open workspace')) + '</a>',
      '<a class="btn btn-secondary" href="' + escapeHtml(withCase('/app/workspace/#source-operations')) + '">' + escapeHtml(t('module.action.open_uploads', 'Open uploads')) + '</a>',
      '<a class="btn btn-secondary" href="' + escapeHtml(withCase('/app/downloads/')) + '">' + escapeHtml(t('module.action.open_downloads', 'Open downloads')) + '</a>'
    ];
    (extra || []).forEach(function(item){ buttons.push(item); });
    actions.innerHTML = buttons.join('');
  }

  function renderContractReview(record, mode){
    var detail = q('[data-module-detail]');
    if(!detail){ return; }
    var review = record && record.contract_review ? record.contract_review : null;
    var findings = review && Array.isArray(review.findings) ? review.findings : [];
    var outputs = [];
    if(review && review.revised_contract_download_url){
      outputs.push('<a class="btn btn-secondary" href="' + escapeHtml(api.toDownloadUrl(review.revised_contract_download_url)) + '">' + escapeHtml(t('module.contract.download_docx', 'Download revised DOCX')) + '</a>');
    }
    if(review && review.change_memo_download_url){
      outputs.push('<a class="btn btn-secondary" href="' + escapeHtml(api.toDownloadUrl(review.change_memo_download_url)) + '">' + escapeHtml(t('module.contract.download_memo', 'Download change memo')) + '</a>');
    }
    detail.innerHTML =
      '<div class="stack-list">' +
        (findings.length ? findings.map(function(item){
          return '<div><strong>' + escapeHtml(item.title || t('module.contract.finding', 'Finding')) + '</strong><p>' + escapeHtml(item.extracted_text || item.practical_implication || '-') + '</p></div>';
        }).join('') : '<div class="empty-copy">' + escapeHtml(t('module.contract.no_findings', 'No contract findings are available yet.')) + '</div>') +
      '</div>' +
      (outputs.length ? '<div class="inline-actions" style="margin-top:16px;">' + outputs.join('') + '</div>' : '');

    var extra = [
      '<button class="btn btn-secondary" data-module-analyze type="button">' + escapeHtml(t('module.contract.analyze', 'Analyze current matter')) + '</button>'
    ];
    if(mode === 'builder'){
      extra.unshift('<button class="btn btn-primary" data-module-generate-draft type="button">' + escapeHtml(t('module.contract.generate_draft', 'Generate improved draft')) + '</button>');
    }
    renderDefaultActions(extra);
  }

  function renderVenue(record){
    var detail = q('[data-module-detail]');
    if(!detail){ return; }
    var analysis = record && record.jurisdiction_analysis ? record.jurisdiction_analysis : null;
    if(!analysis){
      detail.innerHTML = '<div class="empty-copy">' + escapeHtml(t('module.venue.empty', 'Process the active matter to compute venue support.')) + '</div>';
      renderDefaultActions();
      return;
    }
    var forum = analysis.recommended_forum || {};
    var reasons = Array.isArray(analysis.reason_summary) ? analysis.reason_summary : [analysis.reason_summary].filter(Boolean);
    detail.innerHTML =
      '<div class="summary-grid">' +
        infoCard(t('module.venue.recommended_forum', 'Recommended forum'), forum.label || forum.forum_state || '-') +
        infoCard(t('module.venue.county', 'Venue county'), (record.extracted_case_data && record.extracted_case_data.venue && record.extracted_case_data.venue.venue_county) || '-') +
        infoCard(t('module.venue.court_level', 'Court level'), (record.extracted_case_data && record.extracted_case_data.florida_court && record.extracted_case_data.florida_court.court_level) || '-') +
        infoCard(t('module.venue.service_address', 'Service address'), (record.extracted_case_data && record.extracted_case_data.service_address) || '-') +
      '</div>' +
      '<div class="module-list-block"><h3>' + escapeHtml(t('module.venue.reasons', 'Reason summary')) + '</h3>' + listItems(reasons, t('module.venue.no_reasons', 'No venue reasons are available yet.')) + '</div>';
    renderDefaultActions();
  }

  function renderEntity(record){
    var detail = q('[data-module-detail]');
    if(!detail){ return; }
    var verification = record && record.entity_verification ? record.entity_verification : null;
    var sunbiz = record && record.sunbiz_lookup ? record.sunbiz_lookup : null;
    detail.innerHTML =
      '<div class="summary-grid">' +
        infoCard(t('module.entity.name', 'Entity name'), (record.extracted_case_data && record.extracted_case_data.defendant_entity && record.extracted_case_data.defendant_entity.party_name) || '-') +
        infoCard(t('module.entity.status', 'Verification status'), compactStatus((verification && verification.status) || (sunbiz && sunbiz.status) || t('module.entity.not_run', 'Not run'))) +
        infoCard(t('module.entity.provider', 'Provider'), (verification && verification.provider) || 'SunBiz') +
        infoCard(t('module.entity.state', 'State'), (verification && verification.state) || '-') +
      '</div>' +
      '<div class="module-list-block"><h3>' + escapeHtml(t('module.entity.notes', 'Provider notes')) + '</h3>' +
        listItems((verification && verification.provider_limitations) || (sunbiz && sunbiz.provider_limitations) || [], t('module.entity.no_notes', 'No provider notes yet.')) +
      '</div>';
    renderDefaultActions([
      '<button class="btn btn-secondary" data-module-verify-entity type="button">' + escapeHtml(t('module.entity.run_verify', 'Run verification')) + '</button>',
      '<button class="btn btn-secondary" data-module-run-sunbiz type="button">' + escapeHtml(t('module.entity.run_sunbiz', 'Run SunBiz')) + '</button>'
    ]);
  }

  function renderEvidence(record){
    var detail = q('[data-module-detail]');
    if(!detail){ return; }
    var snapshot = record && record.client_snapshot ? record.client_snapshot : null;
    detail.innerHTML =
      '<div class="module-columns">' +
        '<section><h3>' + escapeHtml(t('module.evidence.blockers', 'Blockers')) + '</h3>' + listItems(snapshot && snapshot.blockers, t('module.evidence.no_blockers', 'No blockers are currently recorded.')) + '</section>' +
        '<section><h3>' + escapeHtml(t('module.evidence.warnings', 'Warnings')) + '</h3>' + listItems(snapshot && snapshot.warnings, t('module.evidence.no_warnings', 'No warnings are currently recorded.')) + '</section>' +
      '</div>';
    renderDefaultActions();
  }

  function renderDamages(record){
    var detail = q('[data-module-detail]');
    if(!detail){ return; }
    var extraction = record && record.extracted_case_data ? record.extracted_case_data : {};
    var reconciliation = extraction.amount_reconciliation || {};
    var lineItems = extraction.invoice_summary && Array.isArray(extraction.invoice_summary.line_items) ? extraction.invoice_summary.line_items : [];
    var approvedTotal = reconciliation.approved_reconciled_total != null ? reconciliation.approved_reconciled_total : reconciliation.approved_total;
    detail.innerHTML =
      '<div class="summary-grid">' +
        infoCard(t('module.damages.approved', 'Approved total'), moneyOrPlaceholder(approvedTotal, t('module.damages.pending_total', 'Pending review'))) +
        infoCard(t('module.damages.case_total', 'Case summary total'), moneyOrPlaceholder(reconciliation.case_summary_total, t('module.damages.pending_total', 'Pending review'))) +
        infoCard(t('module.damages.status', 'Reconciliation status'), compactStatus(reconciliation.status || '-')) +
        infoCard(t('module.damages.lines', 'Invoice rows'), String(lineItems.length || 0)) +
      '</div>' +
      '<div class="module-list-block"><h3>' + escapeHtml(t('module.damages.ledger_preview', 'Ledger preview')) + '</h3>' +
        (lineItems.length ? '<div class="stack-list">' + lineItems.slice(0, 8).map(function(item){
          return '<div><strong>' + escapeHtml(item.invoice_number || item.source_filename || '-') + '</strong><p>' + escapeHtml(moneyOrPlaceholder(item.balance_due, t('module.damages.line_pending', 'Pending review'))) + '</p></div>';
        }).join('') + '</div>' : '<div class="empty-copy">' + escapeHtml(t('module.damages.no_lines', 'No invoice rows are available yet.')) + '</div>') +
      '</div>';
    renderDefaultActions();
  }

  function templateList(registry){
    return Array.isArray(registry && registry.templates) ? registry.templates : [];
  }

  function renderForms(record, registry){
    var detail = q('[data-module-detail]');
    if(!detail){ return; }
    var templates = templateList(registry);
    detail.innerHTML =
      '<div class="stack-list">' +
        (templates.length ? templates.map(function(item){
          return '<div><strong>' + escapeHtml(item.display_name || item.document_type) + '</strong><p>' + escapeHtml(compactStatus(item.generation_state || item.status || '-')) + '</p></div>';
        }).join('') : '<div class="empty-copy">' + escapeHtml(t('module.forms.no_templates', 'No template registry is available yet.')) + '</div>') +
      '</div>';
    renderDefaultActions([
      '<button class="btn btn-primary" data-module-generate-all type="button">' + escapeHtml(t('module.forms.generate_all', 'Generate all supported outputs')) + '</button>'
    ]);
  }

  function renderPreSuit(record, registry, packet){
    var detail = q('[data-module-detail]');
    if(!detail){ return; }
    var summary = packet && packet.summary ? packet.summary : {};
    var outputs = packet && Array.isArray(packet.outputs) ? packet.outputs : [];
    var missing = packet && Array.isArray(packet.missing_documents) ? packet.missing_documents : [];
    var nextStep = packet && packet.next_step ? compactStatus(packet.next_step) : '-';
    var supportedBalance = summary.supported_balance != null ? summary.supported_balance : (record && record.client_snapshot ? record.client_snapshot.display_amount : null);
    var linkedOutputs = outputs.filter(function(item){ return !!item.download_url; }).map(function(item){
      return '<a class="btn btn-secondary btn-sm" href="' + escapeHtml(api.toDownloadUrl(item.download_url)) + '">' + escapeHtml(item.label || item.type || 'Output') + '</a>';
    });
    detail.innerHTML =
      '<div class="summary-grid">' +
        infoCard(t('module.pre_suit.amount', 'Supported balance'), moneyOrPlaceholder(supportedBalance, t('module.pre_suit.amount_pending', 'Pending review'))) +
        infoCard(t('module.pre_suit.invoices', 'Invoices found'), String(summary.invoice_count || 0)) +
        infoCard(t('module.pre_suit.gaps', 'Evidence gaps'), String(summary.evidence_gap_count || missing.length || 0)) +
        infoCard(t('module.pre_suit.next_step', 'Recommended next step'), nextStep) +
      '</div>' +
      '<div class="module-columns">' +
        '<section><h3>' + escapeHtml(t('module.pre_suit.notes', 'Missing or weak evidence')) + '</h3>' +
          listItems(missing, t('module.pre_suit.no_blockers', 'No major evidence gaps are currently flagged.')) +
        '</section>' +
        '<section><h3>' + escapeHtml(t('module.pre_suit.outputs', 'Recovery outputs')) + '</h3>' +
          (linkedOutputs.length ? '<div class="inline-actions">' + linkedOutputs.join('') + '</div>' : listItems(outputs.map(function(item){ return (item.label || item.type || 'Output') + ' - ' + compactStatus(item.status || 'available'); }), t('module.pre_suit.outputs_empty', 'Build the recovery packet to create the output set.'))) +
        '</section>' +
      '</div>';
    renderDefaultActions([
      '<button class="btn btn-primary" data-module-generate-demand type="button">' + escapeHtml(t('module.pre_suit.generate', 'Build recovery packet')) + '</button>'
    ]);
  }

  function renderTemplateLibrary(registry){
    var detail = q('[data-module-detail]');
    if(!detail){ return; }
    var templates = templateList(registry);
    var missing = Array.isArray(registry && registry.missing_templates) ? registry.missing_templates : [];
    var cards = templates.length ? templates.map(function(item){
      var source = item.source === 'case_admin_override' ? 'Admin override' : 'System library';
      var status = item.available ? 'Available' : 'Missing';
      return '<div class="detail-row template-library-card">' +
        '<strong>' + escapeHtml(item.display_name || item.document_type) + '</strong>' +
        '<span>' + escapeHtml(item.document_type || '-') + '</span>' +
        '<span>Source: ' + escapeHtml(source) + '</span>' +
        '<span>Status: ' + escapeHtml(status) + '</span>' +
      '</div>';
    }).join('') : '<div class="empty-copy">' + escapeHtml(t('module.template_library.empty', 'No templates are loaded.')) + '</div>';
    detail.innerHTML =
      '<div class="inline-alert is-info"><strong>System library only</strong><span>Template coverage is shown from the controlled library. Unrelated case uploads do not appear here automatically.</span></div>' +
      (missing.length
        ? '<div class="inline-alert is-warning"><strong>Missing templates</strong><span>' + escapeHtml(missing.join(', ')) + '</span></div>'
        : '<div class="inline-alert is-info"><strong>Coverage status</strong><span>All listed templates are currently present in the controlled library.</span></div>') +
      '<div class="template-library-grid">' + cards + '</div>';
    renderDefaultActions([
      '<a class="btn btn-secondary" href="/app/services/">Browse services</a>'
    ]);
  }

  function renderOcrSourceMap(record){
    var detail = q('[data-module-detail]');
    if(!detail){ return; }
    var files = Array.isArray(record && record.source_files) ? record.source_files : [];
    detail.innerHTML =
      '<div class="stack-list">' +
        (files.length ? files.map(function(item){
          var excerpt = item.extracted_text ? item.extracted_text.slice(0, 260) : t('module.ocr.no_excerpt', 'No extracted text preview is available.');
          return '<div><strong>' + escapeHtml(item.original_filename || item.filename || '-') + '</strong><p>' + escapeHtml(excerpt) + '</p></div>';
        }).join('') : '<div class="empty-copy">' + escapeHtml(t('module.ocr.empty', 'No source files are available yet.')) + '</div>') +
      '</div>';
    renderDefaultActions();
  }

  function renderHumanReview(record){
    var detail = q('[data-module-detail]');
    if(!detail){ return; }
    var extraction = record && record.extracted_case_data ? record.extracted_case_data : {};
    detail.innerHTML =
      '<form class="stack-form" data-module-review-form>' +
        '<label><span>' + escapeHtml(t('module.review.plaintiff', 'Plaintiff')) + '</span><input name="plaintiff_name" value="' + escapeHtml((extraction.plaintiff && extraction.plaintiff.party_name) || '') + '"></label>' +
        '<label><span>' + escapeHtml(t('module.review.defendant', 'Defendant')) + '</span><input name="defendant_name" value="' + escapeHtml((extraction.defendant_entity && extraction.defendant_entity.party_name) || '') + '"></label>' +
        '<label><span>' + escapeHtml(t('module.review.venue', 'Venue county')) + '</span><input name="venue_county" value="' + escapeHtml((extraction.venue && extraction.venue.venue_county) || '') + '"></label>' +
        '<label><span>' + escapeHtml(t('module.review.amount', 'Amount in controversy')) + '</span><input name="amount_in_controversy" value="' + escapeHtml((extraction.amount_reconciliation && extraction.amount_reconciliation.case_summary_total) || extraction.amount_in_controversy || '') + '"></label>' +
        '<div class="inline-actions"><button class="btn btn-primary" type="submit">' + escapeHtml(t('module.review.save', 'Save review updates')) + '</button></div>' +
      '</form>';
    renderDefaultActions();
  }

  function bindModuleActions(slug, record, registry){
    var caseId = currentCaseId();
    var status = q('[data-module-status]');

    function setStatus(message){
      if(status){ status.textContent = message; }
    }

    var analyze = q('[data-module-analyze]');
    if(analyze){
      analyze.addEventListener('click', async function(){
        if(!caseId){ return; }
        setStatus(t('module.contract.analyzing', 'Analyzing current matter contracts...'));
        try {
          await api.analyzeContractReview(caseId);
          await boot();
          setStatus(t('module.contract.analyzed', 'Contract analysis completed.'));
        } catch (error){
          setStatus(error.message || t('module.error.generic', 'This action could not be completed.'));
        }
      });
    }

    var generateDraft = q('[data-module-generate-draft]');
    if(generateDraft){
      generateDraft.addEventListener('click', async function(){
        if(!caseId){ return; }
        setStatus(t('module.contract.generating_draft', 'Generating improved draft...'));
        try {
          await api.generateContractDraft(caseId);
          await boot();
          setStatus(t('module.contract.generated_draft', 'Improved draft outputs are ready.'));
        } catch (error){
          setStatus(error.message || t('module.error.generic', 'This action could not be completed.'));
        }
      });
    }

    var verifyEntity = q('[data-module-verify-entity]');
    if(verifyEntity){
      verifyEntity.addEventListener('click', async function(){
        if(!caseId){ return; }
        setStatus(t('module.entity.verifying', 'Running entity verification...'));
        try {
          await api.verifyEntity(caseId);
          await boot();
          setStatus(t('module.entity.verified', 'Entity verification completed.'));
        } catch (error){
          setStatus(error.message || t('module.error.generic', 'This action could not be completed.'));
        }
      });
    }

    var runSunbiz = q('[data-module-run-sunbiz]');
    if(runSunbiz){
      runSunbiz.addEventListener('click', async function(){
        if(!caseId){ return; }
        setStatus(t('module.entity.sunbiz_running', 'Running SunBiz lookup...'));
        try {
          await api.runSunbiz(caseId);
          await boot();
          setStatus(t('module.entity.sunbiz_done', 'SunBiz lookup completed.'));
        } catch (error){
          setStatus(error.message || t('module.error.generic', 'This action could not be completed.'));
        }
      });
    }

    var generateAll = q('[data-module-generate-all]');
    if(generateAll){
      generateAll.addEventListener('click', async function(){
        if(!caseId){ return; }
        var allowed = templateList(registry).filter(function(item){ return item.generation_allowed !== false; }).map(function(item){ return item.document_type; });
        setStatus(t('module.forms.generating', 'Generating supported outputs...'));
        try {
          await api.startGeneration(caseId, allowed, true);
          setStatus(t('module.forms.generated', 'Supported outputs were generated for the active matter.'));
        } catch (error){
          setStatus(error.message || t('module.error.generic', 'This action could not be completed.'));
        }
      });
    }

    var generateDemand = q('[data-module-generate-demand]');
    if(generateDemand){
      generateDemand.addEventListener('click', async function(){
        if(!caseId){ return; }
        setStatus(t('module.pre_suit.generating', 'Building recovery packet...'));
        try {
          await api.buildActionPacket(caseId);
          await boot();
          setStatus(t('module.pre_suit.generated', 'Recovery packet generated. Review the outputs and downloads.'));
        } catch (error){
          setStatus(error.message || t('module.error.generic', 'This action could not be completed.'));
        }
      });
    }

    var reviewForm = q('[data-module-review-form]');
    if(reviewForm){
      reviewForm.addEventListener('submit', async function(event){
        event.preventDefault();
        if(!caseId){ return; }
        setStatus(t('module.review.saving', 'Saving review updates...'));
        try {
          var formData = new FormData(reviewForm);
          await api.reviewCase(caseId, {
            plaintiff_name: formData.get('plaintiff_name') || '',
            defendant_name: formData.get('defendant_name') || '',
            venue_county: formData.get('venue_county') || '',
            amount_in_controversy: formData.get('amount_in_controversy') || ''
          });
          await boot();
          setStatus(t('module.review.saved', 'Review updates were saved.'));
        } catch (error){
          setStatus(error.message || t('module.error.generic', 'This action could not be completed.'));
        }
      });
    }
  }

  async function boot(){
    var resolved = moduleConfig();
    if(!resolved.config){ return; }
    setHeader(resolved.config);
    renderGuide(resolved.slug);
    var caseId = currentCaseId();
    var record = null;
    var registry = null;
    var packet = null;
    if(caseId){
      try { record = await api.getCase(caseId); } catch (error){ record = null; }
    }
    if(resolved.config.loadRegistry){
      try {
        registry = resolved.slug === 'template_library' ? await api.getTemplateRegistry() : (caseId ? await api.getTemplateRegistry(caseId) : null);
      } catch (error){
        registry = null;
      }
    }
    if(resolved.slug === 'pre_suit_demand' && caseId){
      try { packet = await api.buildActionPacket(caseId); } catch (error){ packet = null; }
    }
    if(!record && resolved.slug !== 'template_library'){
      renderEmpty(resolved.config);
      return;
    }

    renderMatterSummary(record);
    var status = q('[data-module-status]');
    if(status){
      status.textContent = resolved.slug === 'template_library'
        ? 'Showing the controlled system template library. Case files stay isolated unless you open a specific matter.'
        : (caseId ? t('module.status.ready', 'Using the active matter and current upload set.') : t('module.current_matter.none', 'No active matter'));
    }

    switch (resolved.slug){
      case 'contract_intelligence':
        renderContractReview(record, 'analysis');
        break;
      case 'best_contract_builder':
        renderContractReview(record, 'builder');
        break;
      case 'venue_engine':
        renderVenue(record);
        break;
      case 'entity_verification':
        renderEntity(record);
        break;
      case 'evidence_audit':
        renderEvidence(record);
        break;
      case 'damages_calculator':
        renderDamages(record);
        break;
      case 'forms_autofill':
        renderForms(record, registry);
        break;
      case 'pre_suit_demand':
        renderPreSuit(record, registry, packet);
        break;
      case 'template_library':
        renderLibrarySummary(registry);
        renderTemplateLibrary(registry);
        break;
      case 'ocr_source_map':
        renderOcrSourceMap(record);
        break;
      case 'human_review':
        renderHumanReview(record);
        break;
      default:
        renderEmpty(resolved.config);
        return;
    }

    bindModuleActions(resolved.slug, record, registry);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  document.addEventListener('vcx:i18n:change', boot);
})();
