/* VitaCoreX Private Lookup Tool — v1.0
   Client-side only. Routes users to official FL government portals.
   No backend API. No Stripe. Analytics via dataLayer only.
*/
(function(){
'use strict';

// client-side only — no API calls made
var sessionToken = null;
var lookupsRemaining = 0;
var currentTab = 'tolls';
var config = null;
var isLoading = false;

// ── Elements — matched to rebuilt private-lookup/index.html ──────────────
function el(id){ return document.getElementById(id); }

var payGate    = el('vcx-gate');           // gate card inside hero section
var payBtn     = el('vcxPayBtn');          // "Start Private Lookup" button
var toolSection= el('vcx-lookup-tool');   // entire tool section (hidden until session)
var sessionBar = el('vcx-session-info');   // session info bar
var resultArea = el('vcx-result-area');    // result area
var statusLine = null;                     // no dedicated status element — use resultArea

if(!payBtn) return; // tool not on this page

// ── i18n helper ──────────────────────────────────────────────────────────
function t(key, vars){
  var lang = 'en';
  var val = '';
  try {
    var si = window.SITE_I18N;
    val = (si && si[lang] && si[lang][key]) || (si && si.en && si.en[key]) || key;
  } catch(e){ val = key; }
  if(vars) Object.keys(vars).forEach(function(k){ val = val.replace('{'+k+'}', vars[k]); });
  return val;
}

// ── GA4/dataLayer event ──────────────────────────────────────────────────
function fireEvent(eventName, params){
  try {
    if(typeof window.trackEvent === 'function') window.trackEvent(eventName, params);
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: eventName, vcx_tool: params || {} });
  } catch(e){}
}

// ── URL param helper ──────────────────────────────────────────────────────
function getUrlParam(name){
  var match = window.location.search.match(new RegExp('[?&]'+name+'=([^&]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

// ── Config (no backend required) ─────────────────────────────────────────
async function loadConfig(){
  config = { stripe_enabled: false, lookup_count: 3 };
}

// ── Session state ─────────────────────────────────────────────────────────
function showSession(){
  if(!sessionToken) return;
  // Hide gate / hero, show tool section
  var hero = el('vcx-lookup-hero');
  if(hero) hero.style.display = 'none';
  if(toolSection){ toolSection.removeAttribute('hidden'); toolSection.style.display = 'block'; }
  if(sessionBar){
    sessionBar.style.display = 'flex';
    var rem = el('vcx-lookups-remaining');
    if(rem) rem.textContent = lookupsRemaining;
  }
  switchTab(currentTab);
  enableSubmitButtons();
  fireEvent('private_tool_view', {tab: currentTab});
}

function enableSubmitButtons(){
  ['vcx-submit-tolls','vcx-submit-traffic','vcx-submit-courts'].forEach(function(id){
    var btn = el(id);
    if(btn) btn.disabled = false;
  });
  checkConsentGates();
}

function checkConsentGates(){
  [['tolls_consent','vcx-submit-tolls'],
   ['traffic_consent','vcx-submit-traffic'],
   ['courts_consent','vcx-submit-courts']].forEach(function(pair){
    var cb = el(pair[0]), btn = el(pair[1]);
    if(!cb || !btn) return;
    function update(){ btn.disabled = !cb.checked || lookupsRemaining <= 0 || isLoading; }
    if(!cb._vcxBound){ cb._vcxBound=true; cb.addEventListener('change', update); }
    update();
  });
}

// ── Tab switching ─────────────────────────────────────────────────────────
function switchTab(tabName){
  currentTab = tabName;
  document.querySelectorAll('.vcx-tab-btn').forEach(function(b){
    var isActive = b.dataset.tab === tabName;
    b.classList.toggle('active', isActive);
    b.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });
  document.querySelectorAll('.vcx-tab-panel').forEach(function(p){
    var panelId = p.id; // e.g. vcx-panel-tolls
    var isActive = panelId === 'vcx-panel-' + tabName;
    p.classList.toggle('is-active', isActive);
    p.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    if(isActive){ p.removeAttribute('hidden'); }
    else { p.setAttribute('hidden',''); }
  });
  if(resultArea){ resultArea.setAttribute('hidden',''); resultArea.innerHTML = ''; }
  setStatus('');
  fireEvent('private_tool_tab_selected', {tab: tabName});
}

// ── Session start (no backend required — direct official portal handoff) ──
async function startPayment(){
  if(isLoading) return;
  isLoading = true;
  payBtn.disabled = true;
  setStatus('<span class="vcx-spinner"></span> Starting session\u2026');

  // Brief loading delay then open tool directly — no API needed
  await new Promise(function(r){ setTimeout(r, 800); });

  sessionToken = 'local_' + Date.now();
  lookupsRemaining = 3;
  setStatus('');
  showSession();
  fireEvent('private_tool_session_start', {mode: 'direct'});
  isLoading = false;
}

// ── Validation helpers ────────────────────────────────────────────────────
function showFieldError(fieldId, msg){
  var field = el(fieldId);
  if(!field) return;
  var errEl = field.closest('.vcx-field');
  if(errEl){
    errEl.classList.add('is-error');
    var err = errEl.querySelector('.vcx-field-error');
    if(err) err.textContent = msg;
  }
}
function clearFieldErrors(formId){
  var form = el(formId);
  if(!form) return;
  form.querySelectorAll('.is-error').forEach(function(f){ f.classList.remove('is-error'); });
  form.querySelectorAll('.vcx-field-error').forEach(function(e){ e.textContent = ''; });
}

// ── Lookup ─────────────────────────────────────────────────────────────────
async function runLookup(tab){
  if(isLoading || lookupsRemaining <= 0 || !sessionToken) return;

  var payload = { session_token: sessionToken, tab: tab };
  var valid = true;

  if(tab === 'tolls'){
    clearFieldErrors('vcx-form-tolls');
    var plate = el('tolls_plate_number') ? el('tolls_plate_number').value.trim() : '';
    var invoice = el('tolls_invoice_number') ? el('tolls_invoice_number').value.trim() : '';
    payload.tolls = {
      plate_number: plate,
      plate_state:  el('tolls_plate_state') ? el('tolls_plate_state').value : 'FL',
      invoice_number: invoice
    };
    // Tolls: at least plate OR invoice required
    if(!plate && !invoice){
      showFieldError('tolls_plate_number', 'Enter a plate number or invoice number below');
      valid = false;
    }
  } else if(tab === 'traffic'){
    clearFieldErrors('vcx-form-traffic');
    var county = el('traffic_fl_county') ? el('traffic_fl_county').value : '';
    payload.traffic = {
      fl_county: county,
      citation_number: el('traffic_citation_number') ? el('traffic_citation_number').value.trim() : ''
    };
    // Traffic: county required for routing
    if(!county){
      showFieldError('traffic_fl_county', 'Select a county to find the correct clerk portal');
      valid = false;
    }
  } else if(tab === 'courts'){
    clearFieldErrors('vcx-form-courts');
    var fullName = el('courts_full_name') ? el('courts_full_name').value.trim() : '';
    var caseNum = el('courts_case_number') ? el('courts_case_number').value.trim() : '';
    payload.courts = {
      full_name:   fullName,
      state:       el('courts_state')       ? el('courts_state').value             : 'FL',
      county:      el('courts_county')      ? el('courts_county').value            : '',
      case_number: caseNum,
      role_filter: el('courts_role_filter') ? el('courts_role_filter').value       : 'any'
    };
    // Courts: name or case number required
    if(!fullName && !caseNum){
      showFieldError('courts_full_name', 'Enter a name or case number below');
      valid = false;
    }
  }

  if(!valid){
    fireEvent('private_tool_validation_error', {tab: tab});
    return;
  }

  isLoading = true;
  setStatus('<span class="vcx-spinner"></span> ' + t('tool_status_loading'));
  if(resultArea){ resultArea.setAttribute('hidden',''); resultArea.innerHTML = ''; }

  var btn = el('vcx' + tab.charAt(0).toUpperCase() + tab.slice(1) + 'Submit');
  if(btn) btn.disabled = true;

  fireEvent('private_tool_lookup_submitted', {tab: tab});

  // Brief visual transition — portal routing, no data retrieval
  await new Promise(function(r){ setTimeout(r, 300); });

  lookupsRemaining = Math.max(0, lookupsRemaining - 1);
  var remEl = el('vcx-lookups-remaining');
  if(remEl) remEl.textContent = lookupsRemaining;
  var pluralEl = el('vcx-lookups-plural');
  if(pluralEl) pluralEl.textContent = lookupsRemaining === 1 ? '' : 's';
  // Note: counter tracks routing sessions, not data lookups

  // Build official portal results based on tab and user input
  var officialResults = [];

  if(tab === 'tolls'){
    var plate = payload.tolls.plate_number || '';
    var state  = payload.tolls.plate_state || 'FL';
    officialResults = [
      { source:'SunPass — Florida Toll System', obligation_type:'Unpaid Toll Obligations',
        status:'Check directly at official portal',
        official_url:'https://www.sunpass.com/',
        action_url:'https://www.sunpass.com/', action_type:'pay',
        note: plate ? 'Search for plate: ' + escapeHtml(plate) + ' (' + escapeHtml(state) + ')' : 'Enter your plate number at the portal' },
      { source:'Florida DHSMV — Toll Enforcement', obligation_type:'DHSMV Toll Suspensions',
        status:'Check driver license status',
        official_url:'https://services.flhsmv.gov/',
        note:'Unpaid tolls can result in license suspension — verify here' }
    ];
  } else if(tab === 'traffic'){
    var county  = payload.traffic.fl_county || '';
    var citation = payload.traffic.citation_number || '';
    var countyUrls = {
      'Hillsborough':'https://www.hillsclerk.com/',
      'Miami-Dade':'https://www.miamidadeclerk.gov/',
      'Broward':'https://www.browardclerk.org/',
      'Orange':'https://myeclerk.myorangeclerk.com/',
      'Pinellas':'https://www.mypinellasclerk.gov/',
      'Duval':'https://www.duvalclerk.com/',
      'Palm Beach':'https://www.mypalmbeachclerk.com/',
      'Seminole':'https://www.seminoleclerk.org/',
      'Polk':'https://www.polkclerkfl.gov/',
      'Lee':'https://www.leeclerk.org/',
      'Collier':'https://www.collierclerk.com/',
      'Volusia':'https://www.clerk.org/',
      'Brevard':'https://www.brevardclerk.us/',
      'Pasco':'https://www.pascoclerk.com/',
      'Sarasota':'https://www.sarasotaclerk.com/',
      'Manatee':'https://www.manateeclerk.com/',
      'Leon':'https://www.leoncountyfl.gov/clerk/',
      'Alachua':'https://alachuaclerk.org/',
      'Escambia':'https://www.escambiaclerk.com/',
      'Hernando':'https://www.hernandoclerk.com/'
    };
    var clerkUrl = (county && countyUrls[county]) ? countyUrls[county] : 'https://www.flcourts.gov/Clerks-Jud-Circuits';
    officialResults = [
      { source: (county||'Florida') + ' County Clerk', obligation_type:'Traffic Citation Status',
        status: citation ? 'Citation #: ' + escapeHtml(citation) : 'Search by citation number',
        official_url: clerkUrl, action_url: clerkUrl, action_type:'pay',
        note:'Pay or contest through your county clerk\u2019s official portal only' },
      { source:'Florida DHSMV', obligation_type:'License Status & Points',
        status:'Verify no suspension from this citation',
        official_url:'https://services.flhsmv.gov/', note:'' }
    ];
  } else if(tab === 'courts'){
    var name = payload.courts.full_name || '';
    var caseNum = payload.courts.case_number || '';
    var courtsCounty = payload.courts.county || '';
    // Reuse county clerk URL map for court records routing
    var courtCountyUrls = {
      'Hillsborough':'https://www.hillsclerk.com/',
      'Miami-Dade':'https://www.miamidadeclerk.gov/',
      'Broward':'https://www.browardclerk.org/',
      'Orange':'https://myeclerk.myorangeclerk.com/',
      'Pinellas':'https://www.mypinellasclerk.gov/',
      'Duval':'https://www.duvalclerk.com/',
      'Palm Beach':'https://www.mypalmbeachclerk.com/',
      'Seminole':'https://www.seminoleclerk.org/',
      'Polk':'https://www.polkclerkfl.gov/',
      'Lee':'https://www.leeclerk.org/',
      'Collier':'https://www.collierclerk.com/',
      'Volusia':'https://www.clerk.org/',
      'Brevard':'https://www.brevardclerk.us/',
      'Pasco':'https://www.pascoclerk.com/',
      'Sarasota':'https://www.sarasotaclerk.com/',
      'Manatee':'https://www.manateeclerk.com/',
      'Leon':'https://www.leoncountyfl.gov/clerk/',
      'Alachua':'https://alachuaclerk.org/',
      'Escambia':'https://www.escambiaclerk.com/',
      'Hernando':'https://www.hernandoclerk.com/'
    };
    var courtClerkUrl = (courtsCounty && courtCountyUrls[courtsCounty]) ? courtCountyUrls[courtsCounty] : '';
    officialResults = [
      { source:'Florida Courts — Official Portal', obligation_type:'Statewide Court Search',
        status: name ? 'Search: ' + escapeHtml(name) : 'Search by party name',
        official_url:'https://www.flcourts.gov/', note:'Statewide court information and resources' }
    ];
    // Add county-specific clerk link if a supported county was selected
    if(courtClerkUrl){
      officialResults.push({ source: escapeHtml(courtsCounty) + ' County Clerk', obligation_type:'County Court Records',
        status: caseNum ? 'Case: ' + escapeHtml(caseNum) : 'Search by name or case number',
        official_url: courtClerkUrl, note: escapeHtml(courtsCounty) + ' County clerk of court — direct record search' });
    } else {
      officialResults.push({ source:'Find Your County Clerk', obligation_type:'County Court Records',
        status:'Locate your county clerk for direct record search',
        official_url:'https://www.flcourts.gov/Clerks-Jud-Circuits', note:'Florida Clerk of Courts directory' });
    }
    officialResults.push({ source:'PACER — Federal Courts', obligation_type:'Federal Court Records',
      status:'Requires free PACER account',
      official_url:'https://pacer.uscourts.gov/', note:'Free account registration required at pacer.gov' });
  }

  // Build typed data object for new card renderer
  var cardData = {};
  if(tab === 'tolls'){
    cardData.plate   = payload.tolls.plate_number || '';
    cardData.invoice = payload.tolls.invoice_number || '';
  } else if(tab === 'traffic'){
    cardData.county   = county;
    cardData.citation = citation;
  } else if(tab === 'courts'){
    cardData.name    = payload.courts.full_name || '';
    cardData.casenum = payload.courts.case_number || '';
    cardData.county  = payload.courts.county || '';
  }
  renderOfficialResults(tab, cardData);

  setStatus('');
  isLoading = false;
  checkConsentGates();
}

// ── Render official portal results ─────────────────────────────────────────
function renderOfficialResults(type, data){
  if(!resultArea) return;

  var html = '';
  if(type === 'tolls') {
    var plate = (data && data.plate) ? data.plate.toUpperCase() : '';
    var invoice = (data && data.invoice) ? data.invoice : '';
    var ref = plate || invoice || 'your vehicle';
    html = '<div class="vcx-result-card">' +
      '<div class="vcx-result-header"><span class="vcx-result-icon">🔍</span>' +
      '<h3>Toll Obligation Check — Official Sources</h3></div>' +
      '<p class="vcx-result-intro">The official Florida toll agencies below can provide authoritative records for <strong>' + escapeHtml(ref) + '</strong>. Use these links to check and pay directly.</p>' +
      '<div class="vcx-portal-links">' +
      '<a class="vcx-portal-link vcx-portal-primary" href="https://www.sunpass.com" target="_blank" rel="noopener">' +
        '<span class="vcx-portal-name">SunPass — Official FL Toll Authority</span>' +
        '<span class="vcx-portal-desc">Check account balance, unpaid tolls, and pay online</span>' +
      '</a>' +
      '<a class="vcx-portal-link" href="https://www.platepass.com" target="_blank" rel="noopener">' +
        '<span class="vcx-portal-name">PlatePass — Rental Vehicle Tolls</span>' +
        '<span class="vcx-portal-desc">For rental car toll obligations</span>' +
      '</a>' +
      '<a class="vcx-portal-link" href="https://www.cfxway.com" target="_blank" rel="noopener">' +
        '<span class="vcx-portal-name">CFX — Central Florida Expressway</span>' +
        '<span class="vcx-portal-desc">407 Express, 408, 414, 417, 429, 528</span>' +
      '</a>' +
      '<a class="vcx-portal-link" href="https://www.leegov.com/tolls" target="_blank" rel="noopener">' +
        '<span class="vcx-portal-name">LeeWay — Lee County Tolls</span>' +
        '<span class="vcx-portal-desc">Lee County toll road accounts and payments</span>' +
      '</a>' +
      '<a class="vcx-portal-link" href="https://gmx-way.com/" target="_blank" rel="noopener">' +
        '<span class="vcx-portal-name">GMX — Miami-Dade Expressways</span>' +
        '<span class="vcx-portal-desc">SR 112, 836, 874, 878, 924 — Miami-Dade toll roads</span>' +
      '</a>' +
      '<a class="vcx-portal-link" href="https://www.tampa-xway.com/" target="_blank" rel="noopener">' +
        '<span class="vcx-portal-name">THEA — Selmon Expressway</span>' +
        '<span class="vcx-portal-desc">Tampa-Hillsborough Expressway Authority</span>' +
      '</a>' +
      '</div>' +
      '<div class="vcx-result-cta">' +
      '<p class="vcx-result-disc">VitaCoreX does not access toll records. These are direct links to official Florida toll agencies. For dispute assistance or documentation help, book a consultation.</p>' +
      '<a class="vcx-cta-link" href="https://calendly.com/vitacorex2025/30min" target="_blank" rel="noopener">Book consultation →</a>' +
      '</div></div>';
  } else if(type === 'traffic') {
    var county2 = (data && data.county) ? data.county : 'Your county';
    var citation2 = (data && data.citation) ? data.citation : '';
    html = '<div class="vcx-result-card">' +
      '<div class="vcx-result-header"><span class="vcx-result-icon">🚦</span>' +
      '<h3>Traffic Citation — Official Court Portal</h3></div>' +
      '<p class="vcx-result-intro">Florida traffic citations are handled by county clerks. ' + escapeHtml(county2) + ' County clerk portal below.</p>' +
      '<div class="vcx-portal-links">' +
      '<a class="vcx-portal-link vcx-portal-primary" href="https://www.flcourts.gov/" target="_blank" rel="noopener">' +
        '<span class="vcx-portal-name">Florida Courts — Official Portal</span>' +
        '<span class="vcx-portal-desc">Statewide court information and clerk directory</span>' +
      '</a>' +
      '<a class="vcx-portal-link" href="https://www.flhsmv.gov/driver-licenses-id-cards/traffic-citations/" target="_blank" rel="noopener">' +
        '<span class="vcx-portal-name">DHSMV — Traffic Citations</span>' +
        '<span class="vcx-portal-desc">Florida Dept of Highway Safety & Motor Vehicles</span>' +
      '</a>' +
      '<a class="vcx-portal-link" href="https://www.flcourts.gov/Clerks-Jud-Circuits" target="_blank" rel="noopener">' +
        '<span class="vcx-portal-name">Find Your County Clerk</span>' +
        '<span class="vcx-portal-desc">Locate your county clerk of court to pay citations</span>' +
      '</a>' +
      '</div>' +
      (citation2 ? '<p class="vcx-result-ref">Citation reference: <strong>' + escapeHtml(citation2) + '</strong></p>' : '') +
      '<div class="vcx-result-cta">' +
      '<p class="vcx-result-disc">For documentation support or dispute packet preparation, book a consultation.</p>' +
      '<a class="vcx-cta-link" href="https://calendly.com/vitacorex2025/30min" target="_blank" rel="noopener">Book consultation →</a>' +
      '</div></div>';
  } else if(type === 'courts') {
    var name2 = (data && data.name) ? data.name : '';
    var casenum2 = (data && data.casenum) ? data.casenum : '';
    var courtsCounty2 = (data && data.county) ? data.county : '';
    // County clerk URL map for court records routing
    var courtClerkUrls = {
      'Hillsborough':'https://www.hillsclerk.com/',
      'Miami-Dade':'https://www.miamidadeclerk.gov/',
      'Broward':'https://www.browardclerk.org/',
      'Orange':'https://myeclerk.myorangeclerk.com/',
      'Pinellas':'https://www.mypinellasclerk.gov/',
      'Duval':'https://www.duvalclerk.com/',
      'Palm Beach':'https://www.mypalmbeachclerk.com/',
      'Seminole':'https://www.seminoleclerk.org/',
      'Polk':'https://www.polkclerkfl.gov/',
      'Lee':'https://www.leeclerk.org/',
      'Collier':'https://www.collierclerk.com/',
      'Volusia':'https://www.clerk.org/',
      'Brevard':'https://www.brevardclerk.us/',
      'Pasco':'https://www.pascoclerk.com/',
      'Sarasota':'https://www.sarasotaclerk.com/',
      'Manatee':'https://www.manateeclerk.com/',
      'Leon':'https://www.leoncountyfl.gov/clerk/',
      'Alachua':'https://alachuaclerk.org/',
      'Escambia':'https://www.escambiaclerk.com/',
      'Hernando':'https://www.hernandoclerk.com/'
    };
    var courtClerkUrl2 = (courtsCounty2 && courtClerkUrls[courtsCounty2]) ? courtClerkUrls[courtsCounty2] : '';
    // Build county-specific or generic clerk link
    var countyClerkHtml = '';
    if(courtClerkUrl2){
      countyClerkHtml =
      '<a class="vcx-portal-link vcx-portal-primary" href="' + courtClerkUrl2 + '" target="_blank" rel="noopener">' +
        '<span class="vcx-portal-name">' + escapeHtml(courtsCounty2) + ' County Clerk of Court</span>' +
        '<span class="vcx-portal-desc">Direct access to ' + escapeHtml(courtsCounty2) + ' County court records search</span>' +
      '</a>';
    } else {
      countyClerkHtml =
      '<a class="vcx-portal-link" href="https://www.flcourts.gov/Clerks-Jud-Circuits" target="_blank" rel="noopener">' +
        '<span class="vcx-portal-name">Find Your County Clerk</span>' +
        '<span class="vcx-portal-desc">Florida Clerk of Courts directory — locate your county</span>' +
      '</a>';
    }
    html = '<div class="vcx-result-card">' +
      '<div class="vcx-result-header"><span class="vcx-result-icon">\u2696\uFE0F</span>' +
      '<h3>Florida Court Records — Official Sources</h3></div>' +
      '<p class="vcx-result-intro">Florida court records are searchable through official state portals.' + (name2 ? ' Searching for: <strong>' + escapeHtml(name2) + '</strong>' : '') + '</p>' +
      '<div class="vcx-portal-links">' +
      countyClerkHtml +
      '<a class="vcx-portal-link" href="https://www.flcourts.gov/Resources-Services/Court-Fines-Fees" target="_blank" rel="noopener">' +
        '<span class="vcx-portal-name">Florida Courts — Records &amp; Fees</span>' +
        '<span class="vcx-portal-desc">Statewide court records search and fee information</span>' +
      '</a>' +
      '<a class="vcx-portal-link" href="https://pacer.uscourts.gov/" target="_blank" rel="noopener">' +
        '<span class="vcx-portal-name">PACER — Federal Court Records</span>' +
        '<span class="vcx-portal-desc">For federal court cases in Florida districts</span>' +
      '</a>' +
      '</div>' +
      (casenum2 ? '<p class="vcx-result-ref">Case reference: <strong>' + escapeHtml(casenum2) + '</strong></p>' : '') +
      '<div class="vcx-result-cta">' +
      '<p class="vcx-result-disc">VitaCoreX does not access court records. These are direct links to official sources. For case documentation support, book a consultation.</p>' +
      '<a class="vcx-cta-link" href="https://calendly.com/vitacorex2025/30min" target="_blank" rel="noopener">Book consultation \u2192</a>' +
      '</div></div>';
  }

  html += '<div style="margin-top:14px;"><button class="vcx-btn-secondary" id="vcxNewSearch" style="font-size:.85rem;">New search</button></div>';
  resultArea.innerHTML = html;
  resultArea.removeAttribute('hidden');
  resultArea.setAttribute('aria-live', 'polite');
  resultArea.setAttribute('tabindex', '-1');
  resultArea.scrollIntoView({behavior:'smooth', block:'start'});
  resultArea.focus();

  var ns = el('vcxNewSearch');
  if(ns) ns.addEventListener('click', function(){
    resultArea.setAttribute('hidden', '');
    resultArea.innerHTML = '';
    setStatus('');
    checkConsentGates();
  });
}

// ── Legacy render (kept for reference) ─────────────────────────────────────
function renderResults(data){
  resultArea.style.display = 'block';
  setStatus('');

  if(!data.results || data.results.length === 0){
    resultArea.innerHTML = '<div class="vcx-result-empty">' + t('tool_status_empty') + '</div>';
    return;
  }

  var html = '';
  data.results.forEach(function(r){
    if(r.state === 'blocked'){
      html += '<div class="vcx-result-blocked">' + t('tool_status_blocked') + '</div>';
      return;
    }
    html += '<div class="vcx-result-card">';
    html += '<h4>' + escapeHtml(r.obligation_type || r.source || 'Record') + '</h4>';

    if(r.source) html += resultRow(t('tool_result_source'), escapeHtml(r.source));
    if(r.status) html += resultRow(t('tool_result_status'), '<strong>' + escapeHtml(r.status) + '</strong>');
    if(r.amount_due) html += resultRow(t('tool_result_amount'), escapeHtml(String(r.amount_due)));
    if(r.date) html += resultRow(t('tool_result_date'), escapeHtml(r.date));
    if(r.court) html += resultRow(t('tool_result_court'), escapeHtml(r.court));
    if(r.case_no) html += resultRow(t('tool_result_case'), escapeHtml(r.case_no));
    if(r.role) html += resultRow(t('tool_result_role'), escapeHtml(r.role));

    var actions = [];
    if(r.official_url){
      actions.push('<button class="vcx-btn-secondary" onclick="window.open(' + JSON.stringify(r.official_url) + ',\'_blank\');window.trackEvent&&window.trackEvent(\'private_tool_view_official_source\',{tab:\'' + currentTab + '\'});" data-tx="tool_btn_official">View official source</button>');
    }
    if(r.action_url && r.action_type === 'pay'){
      actions.push('<button class="vcx-btn-secondary" onclick="window.open(' + JSON.stringify(r.action_url) + ',\'_blank\');window.trackEvent&&window.trackEvent(\'private_tool_pay_officially_click\',{tab:\'' + currentTab + '\'});" data-tx="tool_btn_pay">Pay officially</button>');
    }
    actions.push('<button class="vcx-btn-secondary" onclick="window.open(\'https://calendly.com/vitacorex2025/30min\',\'_blank\');window.trackEvent&&window.trackEvent(\'private_tool_book_consult_click\',{});return false;" data-tx="tool_btn_consult">Book private consultation</button>');

    if(actions.length) html += '<div class="vcx-lookup-actions" style="margin-top:14px;">' + actions.join('') + '</div>';
    html += '</div>';
  });

  html += '<div class="vcx-lookup-actions" style="margin-top:10px;"><button class="vcx-btn-secondary" id="vcxNewSearch" data-tx="tool_btn_new">New search</button></div>';
  resultArea.innerHTML = html;

  // Re-apply translations to newly rendered buttons
  if(window.SITE_I18N){
    try {
      var lang2 = 'en';
      resultArea.querySelectorAll('[data-tx]').forEach(function(e2){
        var v = window.SITE_I18N[lang2] && window.SITE_I18N[lang2][e2.dataset.tx];
        if(v) e2.textContent = v;
      });
    } catch(e){}
  }

  var ns = el('vcxNewSearch');
  if(ns) ns.addEventListener('click', function(){
    resultArea.style.display = 'none';
    resultArea.innerHTML = '';
    setStatus('');
    checkConsentGates();
  });
}

function resultRow(label, val){
  return '<div class="vcx-result-row"><span class="vcx-result-label">' + label + '</span><span class="vcx-result-value">' + val + '</span></div>';
}

function escapeHtml(str){
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function setStatus(html){
  // Status displayed in the loading state within the pay gate
  var gateLoading = el('vcx-gate-loading');
  if(gateLoading){
    if(html){ gateLoading.removeAttribute('hidden'); gateLoading.innerHTML = html; }
    else { gateLoading.setAttribute('hidden',''); gateLoading.innerHTML = ''; }
  }
  // Also update result area if it has a status
  if(resultArea && !html){
    // status cleared — nothing to do
  }
}

// ── Tab keyboard navigation ────────────────────────────────────────────────
function initTabKeyboard() {
  var tabs = document.querySelectorAll('.vcx-tab-btn[role="tab"]');
  tabs.forEach(function(tab, index) {
    tab.addEventListener('keydown', function(e) {
      var next;
      if(e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        next = tabs[index + 1] || tabs[0];
        next.focus(); next.click(); e.preventDefault();
      } else if(e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        next = tabs[index - 1] || tabs[tabs.length - 1];
        next.focus(); next.click(); e.preventDefault();
      } else if(e.key === 'Home') {
        tabs[0].focus(); tabs[0].click(); e.preventDefault();
      } else if(e.key === 'End') {
        tabs[tabs.length-1].focus(); tabs[tabs.length-1].click(); e.preventDefault();
      }
    });
  });
}

// ── Event bindings ─────────────────────────────────────────────────────────
document.querySelectorAll('.vcx-tab-btn').forEach(function(b){
  b.addEventListener('click', function(){ switchTab(b.dataset.tab); });
});

if(payBtn) payBtn.addEventListener('click', function(){ startPayment(); });

// Form submit bindings — use form submit event to support Enter key
['vcx-form-tolls','vcx-form-traffic','vcx-form-courts'].forEach(function(formId){
  var form = el(formId);
  var tab  = formId.replace('vcx-form-','');
  if(form) form.addEventListener('submit', function(e){
    e.preventDefault();
    runLookup(tab);
  });
});

// Also wire up the submit buttons directly as fallback
if(el('vcx-submit-tolls'))   el('vcx-submit-tolls').addEventListener('click', function(){ runLookup('tolls'); });
if(el('vcx-submit-traffic')) el('vcx-submit-traffic').addEventListener('click', function(){ runLookup('traffic'); });
if(el('vcx-submit-courts'))  el('vcx-submit-courts').addEventListener('click', function(){ runLookup('courts'); });

// ── Init ──────────────────────────────────────────────────────────────────
async function init(){
  fireEvent('private_tool_view', {tab: 'gate'});
  checkConsentGates();
  initTabKeyboard();
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', init, {once:true});
} else {
  init();
}

})();
