/* VitaCoreX v2 request form (request.html and the B2B case check on small-claims-documentation.html).
   - Conditional fields per catalog service (catalog.fields + subtypes)
   - Client validation with localized messages; server is authoritative (vcx-api /api/v2/requests)
   - Idempotency key per draft, so a double click or retry never creates a second request
   - Language switch re-labels the form in place; typed values are never lost
   - Only non-sensitive draft fields are kept in sessionStorage (never contact data or free text)
   - Checkout: amount is computed by the server from the catalog; the browser never sends a price */
(function () {
  'use strict';
  var form = document.getElementById('vx-req-form');
  if (!form) return;
  var MODE = form.getAttribute('data-mode') || 'private';
  var DRAFT_KEY = 'vx_req_draft_' + MODE;
  var STATES = [['AL', 'Alabama'], ['AK', 'Alaska'], ['AZ', 'Arizona'], ['AR', 'Arkansas'], ['CA', 'California'], ['CO', 'Colorado'], ['CT', 'Connecticut'], ['DE', 'Delaware'], ['DC', 'District of Columbia'], ['FL', 'Florida'], ['GA', 'Georgia'], ['HI', 'Hawaii'], ['ID', 'Idaho'], ['IL', 'Illinois'], ['IN', 'Indiana'], ['IA', 'Iowa'], ['KS', 'Kansas'], ['KY', 'Kentucky'], ['LA', 'Louisiana'], ['ME', 'Maine'], ['MD', 'Maryland'], ['MA', 'Massachusetts'], ['MI', 'Michigan'], ['MN', 'Minnesota'], ['MS', 'Mississippi'], ['MO', 'Missouri'], ['MT', 'Montana'], ['NE', 'Nebraska'], ['NV', 'Nevada'], ['NH', 'New Hampshire'], ['NJ', 'New Jersey'], ['NM', 'New Mexico'], ['NY', 'New York'], ['NC', 'North Carolina'], ['ND', 'North Dakota'], ['OH', 'Ohio'], ['OK', 'Oklahoma'], ['OR', 'Oregon'], ['PA', 'Pennsylvania'], ['RI', 'Rhode Island'], ['SC', 'South Carolina'], ['SD', 'South Dakota'], ['TN', 'Tennessee'], ['TX', 'Texas'], ['UT', 'Utah'], ['VT', 'Vermont'], ['VA', 'Virginia'], ['WA', 'Washington'], ['WV', 'West Virginia'], ['WI', 'Wisconsin'], ['WY', 'Wyoming']];
  var thisYear = new Date().getFullYear();
  var TAX_YEARS = [thisYear - 1, thisYear - 2, thisYear - 3, thisYear - 4].map(String);

  /* field definitions: type, i18n keys, options (value -> i18n key or literal) */
  var FIELDS = {
    source_language: { type: 'text', label: 'fld.source_language', hint: 'fld.language_hint', max: 60 },
    target_language: { type: 'text', label: 'fld.target_language', hint: 'fld.language_hint', max: 60 },
    document_type: { type: 'text', label: 'fld.document_type', hint: 'fld.document_type_hint', max: 120 },
    approx_words: { type: 'select', label: 'fld.approx_words', options: ['lt250', '250_1250', '1250_5000', 'gt5000', 'unsure'], optKey: 'opt.words.' },
    deadline: { type: 'date', label: 'fld.deadline' },
    signer_count: { type: 'select', label: 'fld.signer_count', options: ['1', '2', '3plus'], optKey: 'opt.signers.' },
    signer_location: { type: 'select', label: 'fld.signer_location', options: ['us', 'abroad'], optKey: 'opt.location.' },
    has_photo_id: { type: 'select', label: 'fld.has_photo_id', options: ['yes', 'no', 'unsure'], optKey: 'opt.yn.' },
    preferred_time: { type: 'text', label: 'fld.preferred_time', hint: 'fld.preferred_time_hint', max: 120 },
    issuing_state: { type: 'select', label: 'fld.issuing_state', options: 'states+fed', optKey: 'opt.' },
    destination_country: { type: 'text', label: 'fld.destination_country', max: 80 },
    has_original: { type: 'select', label: 'fld.has_original', options: ['yes', 'no', 'unsure'], optKey: 'opt.yn.' },
    tax_year: { type: 'select', label: 'fld.tax_year', options: 'taxyears', optKey: 'opt.' },
    tax_state: { type: 'select', label: 'fld.tax_state', options: 'states+none', optKey: 'opt.' },
    jurisdiction_state: { type: 'select', label: 'fld.jurisdiction_state', options: 'states+unsure', optKey: 'opt.' },
    desired_outcome: { type: 'text', label: 'fld.desired_outcome', hint: 'fld.desired_outcome_hint', max: 200 },
    form_number: { type: 'text', label: 'fld.form_number', hint: 'fld.form_number_hint', max: 40 },
    formation_state: { type: 'select', label: 'fld.formation_state', options: 'states', optKey: 'opt.' },
    entity_type: { type: 'select', label: 'fld.entity_type', options: ['llc', 'corporation', 'unsure'], optKey: 'opt.entity.' },
    company_name_idea: { type: 'text', label: 'fld.company_name_idea', max: 120 },
    plan_purpose: { type: 'select', label: 'fld.plan_purpose', options: ['lender', 'investor', 'visa', 'internal', 'other'], optKey: 'opt.plan.' },
    company: { type: 'text', label: 'fld.company', max: 160, autocomplete: 'organization' },
    b2b_state: { type: 'select', label: 'fld.b2b_state', options: 'states', optKey: 'opt.' },
    county_court: { type: 'text', label: 'fld.county_court', hint: 'fld.county_court_hint', max: 120 },
    entity_type_b2b: { type: 'select', label: 'fld.entity_type_b2b', options: ['llc', 'corporation', 'partnership', 'sole_prop', 'other'], optKey: 'opt.entity.' },
    claim_amount: { type: 'number', label: 'fld.claim_amount', hint: 'fld.claim_amount_hint', min: 1, max: 10000000 },
    party_role: { type: 'select', label: 'fld.party_role', options: ['claimant', 'defendant'], optKey: 'opt.role.' },
    has_existing_case: { type: 'select', label: 'fld.has_existing_case', options: ['no', 'yes'], optKey: 'opt.yn.' },
    authorized_rep: { type: 'select', label: 'fld.authorized_rep', options: ['yes', 'no', 'unsure'], optKey: 'opt.yn.' },
    existing_client_reference: { type: 'text', label: 'fld.existing_client_reference', max: 60 }
  };
  /* which fields are required per family (others optional) */
  var REQUIRED = {
    translation: ['source_language', 'target_language', 'document_type', 'approx_words'],
    notary: ['document_type', 'signer_location', 'has_photo_id'],
    apostille: ['issuing_state', 'document_type', 'destination_country'],
    tax: ['tax_year'],
    immigration: ['form_number'],
    formation: ['formation_state', 'entity_type'],
    business_plan: ['plan_purpose'],
    b2b: ['company', 'b2b_state', 'claim_amount', 'party_role', 'authorized_rep'],
    b2b_optional: ['company', 'existing_client_reference']
  };
  var SUMMARY_REQUIRED = ['contracts', 'inquiry'];

  var $ = function (id) { return document.getElementById(id); };
  var el = function (tag, attrs, text) { var e = document.createElement(tag); if (attrs) Object.keys(attrs).forEach(function (k) { if (attrs[k] != null) e.setAttribute(k, attrs[k]); }); if (text != null) e.textContent = text; return e; };
  var T = function (k, p) { return window.VX ? window.VX.t(k, p) : k; };
  var errors = {}; /* field -> error code */
  var current = null; /* service id */
  var busy = false;

  function uuid() { return (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16); }); }
  function ss(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); if (v === null) sessionStorage.removeItem(k); else sessionStorage.setItem(k, v); } catch (e) { return null; } }
  function idemKey() { var k = ss(DRAFT_KEY + '_idem'); if (!k) { k = uuid(); ss(DRAFT_KEY + '_idem', k); } return k; }

  function eligibleServices() {
    var cat = VX.catalog(), ids = [];
    cat.groups.forEach(function (g) { if ((MODE === 'b2b') === (g.lane === 'business')) g.services.forEach(function (id) { ids.push(id); }); });
    return ids;
  }

  function optionsFor(def) {
    var o = def.options;
    if (Array.isArray(o)) return o.map(function (v) { return [v, def.optKey + v]; });
    var base = STATES.map(function (s) { return [s[0], null, s[1]]; });
    if (o === 'states') return base;
    if (o === 'states+fed') return base.concat([['FEDERAL', 'opt.federal'], ['FOREIGN', 'opt.foreign'], ['UNSURE', 'opt.unsure']]);
    if (o === 'states+none') return [['NONE', 'opt.no_state']].concat(base, [['UNSURE', 'opt.unsure']]);
    if (o === 'states+unsure') return base.concat([['UNSURE', 'opt.unsure']]);
    if (o === 'taxyears') return TAX_YEARS.map(function (y) { return [y, null, y]; }).concat([['EARLIER', 'opt.earlier_year']]);
    return [];
  }

  function buildField(name, required) {
    var def = FIELDS[name]; if (!def) return null;
    var id = 'f-' + name, wrap = el('div', { 'class': 'vx-field', 'data-field': 'details.' + name });
    var lab = el('label', { 'for': id });
    lab.appendChild(el('span', { 'data-t': def.label }, T(def.label)));
    if (!required) { lab.appendChild(document.createTextNode(' ')); lab.appendChild(el('span', { 'class': 'vx-opt', 'data-t': 'form.optional' }, T('form.optional'))); }
    wrap.appendChild(lab);
    var hintId = null;
    if (def.hint) { hintId = id + '-hint'; wrap.appendChild(el('p', { 'class': 'vx-hint', id: hintId, 'data-t': def.hint }, T(def.hint))); }
    var input;
    if (def.type === 'select') {
      input = el('select', { id: id, name: name });
      input.appendChild(el('option', { value: '', 'data-t': 'form.choose' }, T('form.choose')));
      optionsFor(def).forEach(function (o) { var op = el('option', { value: o[0] }); if (o[1]) { op.setAttribute('data-t', o[1]); op.textContent = T(o[1]); } else op.textContent = o[2]; input.appendChild(op); });
    } else {
      input = el('input', { id: id, name: name, type: def.type === 'number' ? 'number' : (def.type === 'date' ? 'date' : 'text'), maxlength: def.max || null, min: def.min || null, max: def.type === 'number' ? def.max : null, autocomplete: def.autocomplete || 'off', inputmode: def.type === 'number' ? 'decimal' : null });
    }
    if (required) { input.required = true; input.setAttribute('aria-required', 'true'); }
    if (hintId) input.setAttribute('aria-describedby', hintId);
    wrap.appendChild(input);
    return wrap;
  }

  function renderService(id, keepValues) {
    var s = VX.svc(id); if (!s) return;
    current = id;
    var saved = keepValues ? collectDetails() : readDraftDetails(id);
    /* subtypes */
    var subWrap = $('vx-subtype-wrap'), sub = $('f-subtype'); sub.innerHTML = '';
    var subs = s.subtypes || [];
    if (subs.length > 1) {
      subWrap.hidden = false;
      var pre = new URLSearchParams(location.search).get('subtype') || saved.__subtype;
      subs.forEach(function (st, i) {
        var lbl = el('label', { 'class': 'vx-choice' });
        var r = el('input', { type: 'radio', name: 'subtype', value: st, id: 'st-' + st });
        if (pre ? pre === st : false) r.checked = true;
        lbl.appendChild(r);
        var span = el('span'); span.appendChild(el('b', { 'data-t': 'subtype.' + st }, T('subtype.' + st)));
        lbl.appendChild(span); sub.appendChild(lbl);
      });
    } else subWrap.hidden = true;
    /* details */
    var box = $('vx-details-fields'); box.innerHTML = '';
    var req = REQUIRED[s.family] || [];
    var fields = (s.fields || []).filter(function (f) { return FIELDS[f]; });
    $('vx-details').hidden = fields.length === 0;
    fields.forEach(function (f) { var w = buildField(f, req.indexOf(f) !== -1); if (w) box.appendChild(w); });
    Object.keys(saved).forEach(function (k) { var inp = form.elements[k]; if (inp && k !== '__subtype' && saved[k] != null) inp.value = saved[k]; });
    /* summary requirement + referral consent */
    var sumReq = SUMMARY_REQUIRED.indexOf(s.family) !== -1;
    $('f-summary').required = sumReq;
    $('f-summary-label').setAttribute('data-t', sumReq ? 'form.summary_required' : 'form.summary');
    $('vx-referral-wrap').hidden = !(s.family === 'inquiry' || s.family === 'contracts');
    renderSummary();
    updateSubmitLabel();
    nyCheck();
    VX.apply(form);
    if (MODE === 'private') { var u = new URL(location.href); u.searchParams.set('service', id); history.replaceState(null, '', u); }
  }

  function renderSummary() {
    var s = VX.svc(current); if (!s || !$('vx-summary')) return;
    $('vx-sum-name').textContent = VX.loc(s.name);
    $('vx-sum-price').innerHTML = VX.priceHTML(current);
    var list = function (k) { return ((s[k] && (s[k][VX.lang()] || s[k].en)) || []).map(function (x) { return '<li>' + VX.esc(x) + '</li>'; }).join(''); };
    $('vx-sum-included').innerHTML = list('included');
    $('vx-sum-extra').innerHTML = list('extra');
    $('vx-sum-next').textContent = VX.loc(s.next);
    var n = $('vx-sum-notice'); n.innerHTML = '';
    if ((s.notices || []).indexOf('immigration') !== -1) n.innerHTML = '<div class="vx-pnotice vx-pnotice--compact"><h2>' + VX.esc(T('notice.imm.title')) + '</h2><p lang="en">I AM NOT AN ATTORNEY LICENSED TO PRACTICE LAW AND MAY NOT GIVE LEGAL ADVICE OR ACCEPT FEES FOR LEGAL ADVICE. I AM NOT ACCREDITED TO REPRESENT YOU IN IMMIGRATION MATTERS.</p></div>';
  }

  function updateSubmitLabel() {
    var s = VX.svc(current), btn = $('vx-req-submit'), note = $('vx-req-paynote');
    if (!s || !btn) return;
    var payNow = s.action === 'book_pay' || s.action === 'order';
    btn.setAttribute('data-t', payNow ? 'req.submit_pay' : (MODE === 'b2b' ? 'req.submit_b2b' : 'action.submit'));
    btn.textContent = T(btn.getAttribute('data-t'));
    note.hidden = !payNow;
    if (payNow) { note.setAttribute('data-t', 'req.paynote'); note.textContent = T('req.paynote'); }
  }

  function nyCheck() {
    if (MODE !== 'b2b') return false;
    var st = form.elements.b2b_state, box = $('vx-ny');
    var isNY = st && st.value === 'NY';
    if (box) box.hidden = !isNY;
    $('vx-req-submit').disabled = !!isNY;
    return isNY;
  }

  function collectDetails() {
    var out = {}; var s = VX.svc(current); if (!s) return out;
    (s.fields || []).forEach(function (f) { var inp = form.elements[f]; if (inp && String(inp.value).trim() !== '') out[f] = String(inp.value).trim(); });
    var r = form.querySelector('input[name="subtype"]:checked'); if (r) out.__subtype = r.value;
    return out;
  }
  function saveDraft() {
    if (!current) return;
    var d = collectDetails(); /* non-sensitive structured fields only */
    ['company', 'claim_amount', 'company_name_idea', 'county_court', 'existing_client_reference', 'desired_outcome'].forEach(function (k) { delete d[k]; });
    ss(DRAFT_KEY, JSON.stringify({ service: current, details: d }));
  }
  function readDraftDetails(id) { try { var d = JSON.parse(ss(DRAFT_KEY) || '{}'); return d.service === id ? (d.details || {}) : {}; } catch (e) { return {}; } }

  /* ---------------- validation ---------------- */
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var SSN = /\b\d{3}-?\d{2}-?\d{4}\b/;
  function validate() {
    errors = {};
    var name = form.elements.name.value.trim(), email = form.elements.email.value.trim(), phone = form.elements.phone.value.trim();
    if (!name) errors['contact.name'] = 'required';
    if (email && !EMAIL.test(email)) errors['contact.email'] = 'invalid_email';
    if (!email && !phone) errors['contact.email'] = 'contact_required';
    if (phone && phone.replace(/\D/g, '').length < 7) errors['contact.phone'] = 'invalid_phone';
    var s = VX.svc(current); if (!s) errors.service_id = 'required';
    if (s && (s.subtypes || []).length > 1 && !form.querySelector('input[name="subtype"]:checked')) errors.subtype = 'choose_one';
    if (s) (REQUIRED[s.family] || []).forEach(function (f) { if ((s.fields || []).indexOf(f) !== -1) { var i = form.elements[f]; if (i && !String(i.value).trim()) errors['details.' + f] = 'required'; } });
    var amt = form.elements.claim_amount; if (amt && amt.value && !(Number(amt.value) > 0)) errors['details.claim_amount'] = 'invalid_number';
    var dl = form.elements.deadline; if (dl && dl.value && isNaN(Date.parse(dl.value))) errors['details.deadline'] = 'invalid_date';
    if ($('f-summary').required && !form.elements.summary.value.trim()) errors.summary = 'required';
    var all = form.elements.summary.value + ' ' + JSON.stringify(collectDetails());
    if (SSN.test(all)) errors.summary = 'sensitive_data';
    if (!form.elements.consent.checked) errors['consent.privacy'] = 'consent_required';
    if (nyCheck()) errors['details.b2b_state'] = 'ny_excluded';
    return Object.keys(errors).length === 0;
  }
  function showErrors(serverFields) {
    qsaAll('.vx-field[data-invalid]').forEach(function (f) { f.removeAttribute('data-invalid'); var m = f.querySelector('.vx-field__err'); if (m) m.remove(); var i = f.querySelector('input,select,textarea'); if (i) { i.removeAttribute('aria-invalid'); var d = (i.getAttribute('aria-describedby') || '').split(' ').filter(function (x) { return x.indexOf('-err') === -1; }).join(' '); if (d) i.setAttribute('aria-describedby', d); else i.removeAttribute('aria-describedby'); } });
    if (serverFields) Object.keys(serverFields).forEach(function (k) { errors[k] = serverFields[k]; });
    var box = $('vx-req-errors'), keys = Object.keys(errors);
    if (!keys.length) { box.hidden = true; return; }
    var items = [];
    keys.forEach(function (k) {
      var wrap = form.querySelector('[data-field="' + k + '"]') || (k === 'subtype' ? $('vx-subtype-wrap') : null);
      var msg = T('err.' + errors[k]) || T('err.invalid');
      var target = wrap && wrap.querySelector('input:not([type=hidden]),select,textarea');
      if (wrap) {
        wrap.setAttribute('data-invalid', 'true');
        var eid = 'err-' + k.replace(/\W/g, '-');
        var p = el('p', { 'class': 'vx-field__err', id: eid, 'data-err': errors[k] }, msg); wrap.appendChild(p);
        if (target) { target.setAttribute('aria-invalid', 'true'); target.setAttribute('aria-describedby', ((target.getAttribute('aria-describedby') || '') + ' ' + eid).trim()); }
      }
      var label = wrap ? (wrap.querySelector('label, .vx-label') || {}).textContent : k;
      items.push('<li><a href="#' + (target ? target.id : 'vx-req-form') + '">' + VX.esc((label || '').replace(/\s+/g, ' ').trim()) + ': ' + VX.esc(msg) + '</a></li>');
    });
    box.innerHTML = '<h2>' + VX.esc(T('err.summary_title', { count: keys.length })) + '</h2><ul>' + items.join('') + '</ul>';
    box.hidden = false; box.focus();
  }
  function qsaAll(sel) { return Array.prototype.slice.call(form.querySelectorAll(sel)); }
  function relabelErrors() { /* language change: re-render messages from stored codes */
    qsaAll('.vx-field__err').forEach(function (p) { p.textContent = T('err.' + p.getAttribute('data-err')); });
    if (!$('vx-req-errors').hidden) showErrors();
  }

  /* ---------------- submit ---------------- */
  function payload() {
    var d = collectDetails(); var sub = d.__subtype || ((VX.svc(current).subtypes || []).length === 1 ? VX.svc(current).subtypes[0] : null); delete d.__subtype;
    return {
      idempotency_key: idemKey(), service_id: current, subtype: sub, locale: VX.lang(), source_channel: 'web',
      contact: { name: form.elements.name.value.trim(), email: form.elements.email.value.trim() || null, phone: form.elements.phone.value.trim() || null },
      details: d, summary: form.elements.summary.value.trim() || null,
      consent: { privacy: !!form.elements.consent.checked, notice_version: 'general-2026-10-14', referral: !!(form.elements.referral && form.elements.referral.checked && !$('vx-referral-wrap').hidden) },
      hp: form.elements.website.value
    };
  }
  function setBusy(v) { busy = v; var b = $('vx-req-submit'); b.disabled = v; b.setAttribute('aria-busy', v ? 'true' : 'false'); if (v) b.textContent = T('status.sending'); else updateSubmitLabel(); }

  function submit(e) {
    e.preventDefault();
    if (busy) return;
    if (!validate()) { showErrors(); return; }
    showErrors();
    var api = VX.apiBase();
    setBusy(true);
    fetch(api + '/api/v2/requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload()) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { status: r.status, body: j }; }); })
      .then(function (res) {
        setBusy(false);
        if (res.status === 201 || res.status === 200) return success(res.body);
        if (res.status === 202) return success({ request_id: null, dropped: true });
        var b = res.body || {};
        if (b.error === 'validation') { var f = b.fields || {}; Object.keys(f).forEach(function (k) { var key = (k === 'contact') ? 'contact.email' : k; errors[key] = f[k] === 'email_or_phone_required' ? 'contact_required' : f[k]; }); showErrors(); return; }
        if (b.error === 'sensitive_data') { errors.summary = 'sensitive_data'; showErrors(); return; }
        if (b.error === 'jurisdiction_excluded') { errors['details.b2b_state'] = 'ny_excluded'; showErrors(); return; }
        if (b.error === 'unknown_service') { errors.service_id = 'required'; showErrors(); return; }
        if (res.status === 429) { generic('err.rate_limited'); return; }
        generic('err.network');
      })
      .catch(function () { setBusy(false); generic('err.network'); });
  }
  function generic(key) {
    var box = $('vx-req-errors');
    box.innerHTML = '<h2>' + VX.esc(T('err.not_sent_title')) + '</h2><p>' + VX.esc(T(key)) + '</p><p><a href="tel:+18887948292">(888) 794-8292</a> · <a href="mailto:info@vitacorexllc.com">info@vitacorexllc.com</a></p>';
    box.hidden = false; box.focus();
  }

  function success(r) {
    if (r.dropped) { form.hidden = true; $('vx-req-result').hidden = false; $('vx-req-result').innerHTML = '<div class="vx-alert vx-alert--ok"><h2>' + VX.esc(T('status.received')) + '</h2></div>'; return; }
    ss(DRAFT_KEY, null); ss(DRAFT_KEY + '_idem', null);
    try { sessionStorage.setItem('vx_last_request', JSON.stringify({ r: r.request_id, t: r.access_token })); } catch (e) { /* ignore */ }
    var s = VX.svc(r.service_id) || VX.svc(current);
    var pay = r.next_action === 'checkout' || r.next_action === 'book_checkout';
    var out = $('vx-req-result');
    out.innerHTML =
      '<div class="vx-receipt" tabindex="-1" id="vx-receipt">' +
      '<p class="vx-eyebrow" data-t="status.received">' + VX.esc(T('status.received')) + '</p>' +
      '<h2 class="vx-h2" data-t="' + (r.duplicate ? 'status.duplicate_title' : 'status.thanks') + '">' + VX.esc(T(r.duplicate ? 'status.duplicate_title' : 'status.thanks')) + '</h2>' +
      '<dl><dt data-t="status.ref_label">' + VX.esc(T('status.ref_label')) + '</dt><dd class="vx-ref">' + VX.esc(r.request_id) + '</dd>' +
      '<dt data-t="form.service">' + VX.esc(T('form.service')) + '</dt><dd>' + VX.esc(VX.loc(s.name)) + (r.subtype ? ' — <span data-t="subtype.' + VX.esc(r.subtype) + '">' + VX.esc(T('subtype.' + r.subtype)) + '</span>' : '') + '</dd>' +
      '<dt data-t="status.payment_label">' + VX.esc(T('status.payment_label')) + '</dt><dd data-t="status.no_payment">' + VX.esc(T('status.no_payment')) + '</dd>' +
      '<dt data-t="status.next_label">' + VX.esc(T('status.next_label')) + '</dt><dd data-t="next.' + VX.esc(r.next_action) + '">' + VX.esc(T('next.' + r.next_action)) + '</dd></dl>' +
      (pay ? '<div class="vx-pay"><p data-t="status.pay_intro">' + VX.esc(T('status.pay_intro')) + '</p><div id="vx-pay-price"></div><button type="button" class="vx-btn vx-btn--accent vx-btn--lg" id="vx-pay-btn"><span data-t="status.pay_btn">' + VX.esc(T('status.pay_btn')) + '</span></button><p class="vx-hint" data-t="status.pay_hint">' + VX.esc(T('status.pay_hint')) + '</p></div>' : '') +
      '<p class="vx-hint" data-t="status.email_note">' + VX.esc(T('status.email_note')) + '</p>' +
      '</div>';
    form.hidden = true; out.hidden = false; $('vx-req-errors').hidden = true;
    if (pay) {
      $('vx-pay-price').innerHTML = VX.priceHTML(r.service_id);
      $('vx-pay-btn').addEventListener('click', function () { startCheckout(r); });
    }
    var rc = $('vx-receipt'); rc.focus(); rc.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function startCheckout(r) {
    var btn = $('vx-pay-btn'); if (btn.disabled) return;
    btn.disabled = true; btn.setAttribute('aria-busy', 'true');
    var key = ss('vx_pay_idem_' + r.request_id); if (!key) { key = uuid(); ss('vx_pay_idem_' + r.request_id, key); }
    fetch(VX.apiBase() + '/api/v2/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ request_id: r.request_id, access_token: r.access_token, idempotency_key: key }) })
      .then(function (res) { return res.json().then(function (j) { return { s: res.status, b: j }; }); })
      .then(function (x) {
        if (x.s === 200 || x.s === 201) { if (x.b.checkout_url && /^https?:\/\//.test(x.b.checkout_url)) { location.href = x.b.checkout_url; return; } }
        btn.disabled = false; btn.removeAttribute('aria-busy');
        var e2 = x.b && x.b.error; var key2 = e2 === 'quote_expired' ? 'err.quote_expired' : (e2 === 'not_payable' || e2 === 'payments_not_configured' || e2 === 'live_key_refused') ? 'err.unavailable' : 'err.network';
        var p = el('p', { 'class': 'vx-field__err', role: 'alert' }, T(key2)); btn.parentNode.appendChild(p);
      })
      .catch(function () { btn.disabled = false; btn.removeAttribute('aria-busy'); var p = el('p', { 'class': 'vx-field__err', role: 'alert' }, T('err.network')); btn.parentNode.appendChild(p); });
  }

  function populateServiceSelect() {
    var sel = $('f-service'); var cur = sel.value; sel.innerHTML = '';
    var cat = VX.catalog();
    cat.groups.forEach(function (g) {
      var ids = g.services.filter(function (id) { return eligibleServices().indexOf(id) !== -1; }); if (!ids.length) return;
      var og = el('optgroup', { label: VX.loc(g.name) });
      ids.forEach(function (id) { var o = el('option', { value: id }, VX.loc(cat.services[id].name) + ' — ' + VX.priceInfo(id).short); og.appendChild(o); });
      sel.appendChild(og);
    });
    if (cur) sel.value = cur;
  }

  function init() {
    var ids = eligibleServices();
    populateServiceSelect();
    var q = new URLSearchParams(location.search).get('service') || form.getAttribute('data-service');
    var draft = {}; try { draft = JSON.parse(ss(DRAFT_KEY) || '{}'); } catch (e) { /* ignore */ }
    var start = (q && ids.indexOf(q) !== -1) ? q : (draft.service && ids.indexOf(draft.service) !== -1 ? draft.service : (MODE === 'b2b' ? 'b2b_small_claims_packet' : 'legal_request'));
    $('f-service').value = start;
    renderService(start, false);
    $('f-service').addEventListener('change', function () { saveDraft(); renderService(this.value, false); });
    form.addEventListener('change', function (e) { if (e.target.name === 'b2b_state') nyCheck(); saveDraft(); });
    form.addEventListener('submit', submit);
    document.addEventListener('vx:lang', function () { populateServiceSelect(); $('f-service').value = current; renderSummary(); updateSubmitLabel(); VX.apply(form); relabelErrors(); var res = $('vx-req-result'); if (!res.hidden) VX.apply(res); });
  }
  if (window.VX && window.VX.ready) window.VX.ready.then(init); else document.addEventListener('vx:ready', init);
})();
