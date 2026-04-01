/* VitaCoreX Private Lookup Tool — v1.0
   Connects to /api/private-lookup/* (FastAPI backend)
   Payment gate via Stripe Checkout session
   Analytics: additive events via window.trackEvent / dataLayer
*/
(function(){
'use strict';

var API = '/api/private-lookup';
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
  var lang = (localStorage.getItem('vcx_lang') || 'en');
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

// ── Check for return from Stripe ─────────────────────────────────────────
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

// ── Lookup ─────────────────────────────────────────────────────────────────
async function runLookup(tab){
  if(isLoading || lookupsRemaining <= 0 || !sessionToken) return;
  isLoading = true;
  setStatus('<span class="vcx-spinner"></span> ' + t('tool_status_loading'));
  if(resultArea){ resultArea.setAttribute('hidden',''); resultArea.innerHTML = ''; }

  var btn = el('vcx' + tab.charAt(0).toUpperCase() + tab.slice(1) + 'Submit');
  if(btn) btn.disabled = true;

  var payload = { session_token: sessionToken, tab: tab };

  if(tab === 'tolls'){
    payload.tolls = {
      plate_number: el('tolls_plate_number') ? el('tolls_plate_number').value.trim() : '',
      plate_state:  el('tolls_plate_state')  ? el('tolls_plate_state').value  : 'FL',
      invoice_number: el('tolls_invoice_number') ? el('tolls_invoice_number').value.trim() : ''
    };
  } else if(tab === 'traffic'){
    payload.traffic = {
      fl_county: el('traffic_fl_county') ? el('traffic_fl_county').value : '',
      citation_number: el('traffic_citation_number') ? el('traffic_citation_number').value.trim() : ''
    };
  } else if(tab === 'courts'){
    payload.courts = {
      full_name:   el('courts_full_name')   ? el('courts_full_name').value.trim()  : '',
      state:       el('courts_state')       ? el('courts_state').value             : 'FL',
      county:      el('courts_county')      ? el('courts_county').value            : '',
      case_number: el('courts_case_number') ? el('courts_case_number').value.trim(): '',
      role_filter: el('courts_role_filter') ? el('courts_role_filter').value       : 'any'
    };
  }

  fireEvent('private_tool_lookup_submitted', {tab: tab});

  // Direct official portal handoff — no backend required
  await new Promise(function(r){ setTimeout(r, 900); });

  lookupsRemaining = Math.max(0, lookupsRemaining - 1);
  var remEl = el('vcx-lookups-remaining');
  if(remEl) remEl.textContent = lookupsRemaining;
  var pluralEl = el('vcx-lookups-plural');
  if(pluralEl) pluralEl.textContent = lookupsRemaining === 1 ? '' : 's';

  // Build official portal results based on tab and user input
  var officialResults = [];

  if(tab === 'tolls'){
    var plate = payload.tolls.plate_number || '';
    var state  = payload.tolls.plate_state || 'FL';
    officialResults = [
      { source:'SunPass — Florida Toll System', obligation_type:'Unpaid Toll Obligations',
        status:'Check directly at official portal',
        official_url:'https://www.sunpass.com/en/home.shtml',
        action_url:'https://www.sunpass.com/en/home.shtml', action_type:'pay',
        note: plate ? 'Search for plate: ' + escapeHtml(plate) + ' (' + escapeHtml(state) + ')' : 'Enter your plate number at the portal' },
      { source:'Florida DHSMV — Toll Enforcement', obligation_type:'DHSMV Toll Suspensions',
        status:'Check driver license status',
        official_url:'https://services.flhsmv.gov/',
        note:'Unpaid tolls can result in license suspension — verify here' }
    ];
  } else if(tab === 'traffic'){
    var county  = payload.traffic.county || '';
    var citation = payload.traffic.citation_number || '';
    var countyUrls = {
      'Hillsborough':'https://hcclerk.org/traffic/',
      'Miami-Dade':'https://www.miami-dadeclerk.com/coc/index.asp',
      'Broward':'https://www.browardclerk.org/',
      'Orange':'https://myeclerk.myorangeclerk.com/',
      'Pinellas':'https://www.pinellasclerk.org/',
      'Duval':'https://www.duvalclerk.com/',
      'Palm Beach':'https://www.mypalmbeachclerk.com/',
      'Seminole':'https://www.seminoleclerk.org/',
      'Polk':'https://www.polkcountyclerk.net/',
      'Lee':'https://www.leeclerk.org/',
      'Collier':'https://www.collierclerk.com/'
    };
    var clerkUrl = (county && countyUrls[county]) ? countyUrls[county] : 'https://www.flcourts.org/Public-Access-Courts/Clerks-of-Court';
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
    officialResults = [
      { source:'Florida Courts E-Filing Portal', obligation_type:'Statewide Court Search',
        status: name ? 'Search: ' + escapeHtml(name) : 'Search by party name',
        official_url:'https://efactspr.flcourts.org/', note:'Appellate and circuit court records statewide' },
      { source:'Hillsborough County Clerk', obligation_type:'County Court Records (direct search)',
        status: caseNum ? 'Case: ' + escapeHtml(caseNum) : 'Search by name or case number',
        official_url:'https://hcclerk.org/', note:'Hillsborough direct court records access' },
      { source:'PACER — Federal Courts', obligation_type:'Federal Court Records',
        status:'Requires free PACER account',
        official_url:'https://www.pacer.gov/', note:'Free account registration required at pacer.gov' }
    ];
  }

  renderOfficialResults(officialResults, tab);

  setStatus('');
  isLoading = false;
  checkConsentGates();
}

// ── Render official portal results ─────────────────────────────────────────
function renderOfficialResults(results, tab){
  if(resultArea){ resultArea.removeAttribute('hidden'); }
  setStatus('');

  if(!results || !results.length){
    resultArea.innerHTML = '<div class="vcx-result-empty">No official sources found for this search. <a href="https://calendly.com/vitacorex2025/30min" target="_blank" rel="noopener">Book a consultation</a> for manual assistance.</div>';
    return;
  }

  var html = '';
  html += '<p style="font-size:.82rem;color:rgba(255,255,255,.45);margin-bottom:18px;line-height:1.5;">These are official Florida government portals. VitaCoreX routes you to the authoritative source only. Results shown in this session are not stored.</p>';

  results.forEach(function(r){
    html += '<div class="vcx-result-card" style="margin-bottom:14px;">';
    html += '<h4 style="margin:0 0 10px;font-size:1rem;">' + escapeHtml(r.obligation_type || r.source || 'Official Record') + '</h4>';
    if(r.source) html += resultRow('Source', escapeHtml(r.source));
    if(r.status) html += resultRow('Status', '<strong>' + escapeHtml(r.status) + '</strong>');
    if(r.note) html += resultRow('Note', escapeHtml(r.note));

    var actions = [];
    if(r.official_url){
      actions.push('<button class="vcx-btn-secondary" style="font-size:.85rem;" onclick="window.open(' + JSON.stringify(r.official_url) + ',\'_blank\');window.trackEvent&&window.trackEvent(\'private_tool_view_official_source\',{tab:\'' + tab + '\'});">Open official portal</button>');
    }
    if(r.action_url && r.action_type === 'pay' && r.action_url !== r.official_url){
      actions.push('<button class="vcx-btn-secondary" style="font-size:.85rem;" onclick="window.open(' + JSON.stringify(r.action_url) + ',\'_blank\');">Pay officially</button>');
    }
    if(actions.length) html += '<div class="vcx-lookup-actions" style="margin-top:12px;flex-wrap:wrap;gap:8px;">' + actions.join('') + '</div>';
    html += '</div>';
  });

  html += '<div style="margin-top:22px;padding:18px;background:rgba(212,175,55,.06);border:1px solid rgba(212,175,55,.2);border-radius:8px;">';
  html += '<p style="font-size:.88rem;color:rgba(255,255,255,.7);margin:0 0 12px;line-height:1.5;">Need help interpreting results or navigating the official portals? A VitaCoreX advisor can review your specific situation.</p>';
  html += '<a href="https://calendly.com/vitacorex2025/30min" target="_blank" rel="noopener" class="vcx-btn-secondary" style="display:inline-block;font-size:.9rem;">Book private consultation</a>';
  html += '</div>';

  html += '<div class="vcx-lookup-actions" style="margin-top:14px;"><button class="vcx-btn-secondary" id="vcxNewSearch" style="font-size:.85rem;">New search</button></div>';
  resultArea.innerHTML = html;

  var ns = el('vcxNewSearch');
  if(ns) ns.addEventListener('click', function(){
    resultArea.style.display = 'none';
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
      var lang2 = localStorage.getItem('vcx_lang') || 'en';
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
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', init, {once:true});
} else {
  init();
}

})();
