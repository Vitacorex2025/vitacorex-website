(function(){
  var api = window.DocketMintApi;
  var i18n = window.VCXI18n;
  if(!api){ return; }

  var state = { session: null };

  function q(selector){ return document.querySelector(selector); }
  function t(key, fallback){ return i18n ? i18n.t(key, fallback) : (fallback || key); }
  function params(){
    try { return new URLSearchParams(window.location.search || ''); }
    catch (error){ return new URLSearchParams(''); }
  }
  function escapeHtml(value){
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function setText(selector, value){
    var node = q(selector);
    if(node){ node.textContent = value == null || value === '' ? t('immigration.output.na', '-') : String(value); }
  }

  function formFields(session){
    var suggested = (session && session.suggested_fields) || [];
    var manual = (session && session.manual_values) || {};
    var hints = (session && session.supporting_hints) || {};
    var merged = [];
    suggested.forEach(function(name){
      if(merged.indexOf(name) === -1){ merged.push(name); }
    });
    Object.keys(hints).forEach(function(name){
      if(merged.indexOf(name) === -1){ merged.push(name); }
    });
    Object.keys(manual).forEach(function(name){
      if(merged.indexOf(name) === -1){ merged.push(name); }
    });
    if(!merged.length){
      merged = ['given_name', 'family_name', 'middle_name', 'a_number', 'uscis_online_account_number', 'date_of_birth', 'city', 'country', 'email', 'phone'];
    }
    return merged;
  }

  function renderTagList(list){
    var root = q('[data-suggested-fields]');
    if(!root){ return; }
    if(!list.length){
      root.innerHTML = '<span class="empty-copy">' + escapeHtml(t('immigration.empty.fields', 'Upload a form to inspect fields.')) + '</span>';
      return;
    }
    root.innerHTML = list.map(function(item){
      return '<span class="tag-chip">' + escapeHtml(item) + '</span>';
    }).join('');
  }

  function renderHints(hints){
    var root = q('[data-support-hints]');
    if(!root){ return; }
    var keys = Object.keys(hints || {});
    if(!keys.length){
      root.innerHTML = '<p class="empty-copy">' + escapeHtml(t('immigration.empty.hints', 'No supporting hints yet.')) + '</p>';
      return;
    }
    root.innerHTML = keys.map(function(key){
      return '<div class="detail-row"><strong>' + escapeHtml(key) + '</strong><span>' + escapeHtml(hints[key]) + '</span></div>';
    }).join('');
  }

  function renderMissingAndEvidence(session){
    var missingRoot = q('[data-missing-fields]');
    var evidenceRoot = q('[data-evidence-prompts]');
    var missing = (session && session.missing_fields) || [];
    var evidence = (session && session.evidence_prompts) || [];
    if(missingRoot){
      missingRoot.innerHTML = missing.length
        ? missing.map(function(item){ return '<div class="detail-row"><strong>' + escapeHtml(item) + '</strong><span>Still needed</span></div>'; }).join('')
        : '<p class="empty-copy">' + escapeHtml(t('immigration.empty.missing', 'No required fields are currently missing from the guided intake.')) + '</p>';
    }
    if(evidenceRoot){
      evidenceRoot.innerHTML = evidence.length
        ? evidence.map(function(item){ return '<div class="detail-row"><strong>' + escapeHtml(item) + '</strong><span>Review before filing</span></div>'; }).join('')
        : '<p class="empty-copy">' + escapeHtml(t('immigration.empty.evidence', 'No evidence prompts available yet.')) + '</p>';
    }
  }

  function renderValuesForm(session){
    var root = q('[data-immigration-values-form]');
    if(!root){ return; }
    var manual = (session && session.manual_values) || {};
    var hints = (session && session.supporting_hints) || {};
    var fields = formFields(session);
    root.innerHTML = fields.map(function(name){
      var value = manual[name] || hints[name] || '';
      return '<label><span class="field-label">' + escapeHtml(name) + '</span><input data-field-name="' + escapeHtml(name) + '" value="' + escapeHtml(value) + '" placeholder="' + escapeHtml(t('immigration.value_prefix', 'Enter ') + name.replace(/_/g, ' ')) + '"></label>';
    }).join('');
  }

  function collectValues(){
    var values = {};
    Array.prototype.slice.call(document.querySelectorAll('[data-field-name]')).forEach(function(input){
      var name = input.getAttribute('data-field-name') || '';
      if(name && input.value.trim()){ values[name] = input.value.trim(); }
    });
    return values;
  }

  function renderSession(session){
    state.session = session || null;
    setText('[data-session-id]', session ? session.session_id : t('immigration.output.na', '-'));
    setText('[data-form-fillable]', session ? (session.form && session.form.is_fillable ? t('immigration.output.fillable_yes', 'Yes') : t('immigration.output.fillable_no', 'No, overlay used')) : t('immigration.output.na', '-'));
    setText('[data-form-field-count]', session ? ((session.form && session.form.field_names || []).length) : 0);
    setText('[data-support-count]', session ? ((session.supporting_files || []).length) : 0);
    setText('[data-review-notice]', session ? (session.review_notice || t('immigration.review_notice', 'Human review is required before filing.')) : t('immigration.review_notice', 'Human review is required before filing.'));
    setText('[data-output-status]', session ? (session.status || t('immigration.output.draft', 'Draft')) : t('immigration.output.draft', 'Draft'));
    var outputFillable = session && session.generated_output ? (session.generated_output.used_fillable_pdf_fields ? t('immigration.output.fillable_yes', 'Yes') : t('immigration.output.fillable_no', 'No, overlay used')) : t('immigration.output.na', '-');
    setText('[data-output-fillable]', outputFillable);
    renderTagList(formFields(session));
    renderHints((session && session.supporting_hints) || {});
    renderMissingAndEvidence(session);
    renderValuesForm(session);
    var generateBtn = q('[data-immigration-generate]');
    if(generateBtn){ generateBtn.disabled = !session; }
    var outputLink = q('[data-output-download]');
    if(outputLink){
      if(session && session.generated_output && session.generated_output.download_url){
        outputLink.hidden = false;
        outputLink.href = api.toDownloadUrl(session.generated_output.download_url);
      } else {
        outputLink.hidden = true;
        outputLink.removeAttribute('href');
      }
    }
  }

  function sessionStorageRef(){
    try { return window.sessionStorage || null; }
    catch (error){ return null; }
  }

  function currentSessionId(){
    var explicit = params().get('session') || '';
    if(explicit){
      setCurrentSessionId(explicit);
      return explicit;
    }
    try {
      var storage = sessionStorageRef();
      return storage ? (storage.getItem('docketmint.immigrationSessionId') || '') : '';
    }
    catch (error){ return ''; }
  }

  function setCurrentSessionId(value){
    try {
      var storage = sessionStorageRef();
      if(storage){
        if(value){ storage.setItem('docketmint.immigrationSessionId', value); }
        else { storage.removeItem('docketmint.immigrationSessionId'); }
      }
    } catch (error){}
  }

  async function refreshCurrentSession(){
    var sessionId = currentSessionId();
    if(!sessionId){
      renderSession(null);
      return;
    }
    try {
      var session = await api.getImmigrationSession(sessionId);
      renderSession(session);
    } catch (error){
      renderSession(null);
    }
  }

  async function createSession(){
    var formInput = q('#immigrationFormFile');
    var supportInput = q('#immigrationSupportFiles');
    var status = q('[data-immigration-upload-status]');
    var formFile = formInput && formInput.files && formInput.files[0];
    var supportFiles = supportInput && supportInput.files ? Array.prototype.slice.call(supportInput.files) : [];
    if(!formFile){
      if(status){ status.textContent = t('immigration.status.upload_required', 'Upload the immigration form PDF first.'); }
      return;
    }
    if(status){ status.textContent = t('immigration.status.uploading', 'Uploading and analyzing the form...'); }
    try {
      var session = await api.createImmigrationSession(formFile, supportFiles);
      setCurrentSessionId(session.session_id);
      renderSession(session);
      if(status){ status.textContent = t('immigration.status.created', 'Form session created. Review the detected fields and complete the values.'); }
      var gen = q('[data-immigration-generate-status]');
      if(gen){ gen.textContent = t('immigration.generate.ready', 'Ready to generate a filled draft PDF.'); }
    } catch (error){
      if(status){ status.textContent = (error && (error.message || error.detail)) || t('immigration.status.failed', 'Upload failed.'); }
    }
  }

  async function generatePdf(){
    var status = q('[data-immigration-generate-status]');
    if(!state.session){
      if(status){ status.textContent = t('immigration.generate.start', 'Upload and analyze a form first.'); }
      return;
    }
    if(status){ status.textContent = t('immigration.generate.running', 'Generating filled PDF...'); }
    try {
      var session = await api.generateImmigrationPdf(state.session.session_id, collectValues());
      renderSession(session);
      if(status){ status.textContent = t('immigration.generate.success', 'Filled draft PDF generated successfully.'); }
    } catch (error){
      if(status){ status.textContent = (error && (error.message || error.detail)) || t('immigration.generate.failed', 'Generation failed.'); }
    }
  }

  function bind(){
    var uploadBtn = q('[data-immigration-create]');
    if(uploadBtn){ uploadBtn.addEventListener('click', createSession); }
    var genBtn = q('[data-immigration-generate]');
    if(genBtn){ genBtn.addEventListener('click', generatePdf); }
    refreshCurrentSession();
  }

  document.addEventListener('vcx:i18n:change', function(){
    renderSession(state.session);
    if(!state.session){
      var uploadStatus = q('[data-immigration-upload-status]');
      if(uploadStatus){ uploadStatus.textContent = t('immigration.status.idle', 'No form session created yet.'); }
      var generateStatus = q('[data-immigration-generate-status]');
      if(generateStatus){ generateStatus.textContent = t('immigration.generate.disabled', 'Generation is disabled until a form session exists.'); }
    }
  });

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', bind);
  } else { bind(); }
})();
