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

// ── Elements ──────────────────────────────────────────────────────────────
function el(id){ return document.getElementById(id); }

var payGate    = el('vcxPayGate');
var payBtn     = el('vcxPayBtn');
var tabBar     = el('vcxTabBar');
var tabPanels  = el('vcxTabPanels');
var sessionBar = el('vcxSessionBar');
var sessionTxt = el('vcxSessionText');
var resultArea = el('vcxResultArea');
var statusLine = el('vcxLookupStatus');

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

// ── Fetch config ─────────────────────────────────────────────────────────
async function loadConfig(){
  try {
    var r = await fetch(API + '/config');
    if(r.ok) config = await r.json();
  } catch(e){}
}

// ── Session state ─────────────────────────────────────────────────────────
function showSession(){
  if(!sessionToken) return;
  payGate.style.display = 'none';
  tabBar.style.display = 'flex';
  tabPanels.style.display = 'block';
  sessionBar.classList.add('active');
  sessionTxt.textContent = t('tool_session_active', {n: lookupsRemaining});
  enableSubmitButtons();
  fireEvent('private_tool_view', {tab: currentTab});
}

function enableSubmitButtons(){
  ['vcxTollsSubmit','vcxTrafficSubmit','vcxCourtsSubmit'].forEach(function(id){
    var btn = el(id);
    if(btn) btn.disabled = false;
  });
  checkConsentGates();
}

function checkConsentGates(){
  [['tollConsent','vcxTollsSubmit'],['trafficConsent','vcxTrafficSubmit'],['courtsConsent','vcxCourtsSubmit']].forEach(function(pair){
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
    b.classList.toggle('active', b.dataset.tab === tabName);
  });
  document.querySelectorAll('.vcx-tab-panel').forEach(function(p){
    p.classList.toggle('active', p.dataset.panel === tabName);
  });
  resultArea.style.display = 'none';
  resultArea.innerHTML = '';
  setStatus('');
  fireEvent('private_tool_tab_selected', {tab: tabName});
}

// ── Payment flow ──────────────────────────────────────────────────────────
async function startPayment(){
  if(isLoading) return;
  isLoading = true;
  payBtn.disabled = true;
  setStatus(t('tool_status_loading'));

  try {
    var r = await fetch(API + '/session', {method:'POST', headers:{'Content-Type':'application/json'}});
    if(!r.ok) throw new Error('session_error');
    var data = await r.json();

    if(data.stripe_enabled && data.checkout_url){
      window.location.href = data.checkout_url;
    } else {
      // Dev mode: no Stripe, verify immediately
      await verifyPayment(null, data.pre_session_id);
    }
  } catch(e){
    setStatus('Unable to start session. Please try again or contact support.');
    payBtn.disabled = false;
  }
  isLoading = false;
}

async function verifyPayment(stripeSessionId, preSessionId){
  try {
    var body = { pre_session_id: preSessionId };
    if(stripeSessionId) body.stripe_session_id = stripeSessionId;

    var r = await fetch(API + '/verify-payment', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(body)
    });

    if(!r.ok){
      var err = await r.json().catch(function(){ return {}; });
      throw new Error(err.detail || 'payment_verify_failed');
    }
    var data = await r.json();
    sessionToken = data.session_token;
    lookupsRemaining = data.lookup_count || 3;

    // Clean URL
    if(window.history && window.history.replaceState){
      window.history.replaceState({}, '', window.location.pathname);
    }

    showSession();
    setStatus('');
    fireEvent('private_tool_payment_verified', {lookups: lookupsRemaining});
  } catch(e){
    setStatus('Payment verification failed: ' + (e.message || 'unknown error') + '. Please contact support.');
  }
}

// ── Lookup ─────────────────────────────────────────────────────────────────
async function runLookup(tab){
  if(isLoading || lookupsRemaining <= 0 || !sessionToken) return;
  isLoading = true;
  setStatus('<span class="vcx-spinner"></span> ' + t('tool_status_loading'));
  resultArea.style.display = 'none';

  var btn = el('vcx' + tab.charAt(0).toUpperCase() + tab.slice(1) + 'Submit');
  if(btn) btn.disabled = true;

  var payload = { session_token: sessionToken, tab: tab };

  if(tab === 'tolls'){
    payload.tolls = {
      state: el('tollState') ? el('tollState').value : 'FL',
      toll_system: el('tollSystem') ? el('tollSystem').value : '',
      plate_number: el('tollPlate') ? el('tollPlate').value.trim() : '',
      plate_state: el('tollPlateState') ? el('tollPlateState').value : 'FL',
      zip_code: el('tollZip') ? el('tollZip').value.trim() : ''
    };
  } else if(tab === 'traffic'){
    payload.traffic = {
      state: el('trafficState') ? el('trafficState').value : 'FL',
      county: el('trafficCounty') ? el('trafficCounty').value : '',
      citation_number: el('trafficCitation') ? el('trafficCitation').value.trim() : ''
    };
  } else if(tab === 'courts'){
    payload.courts = {
      state: el('courtsState') ? el('courtsState').value : 'FL',
      county: el('courtsCounty') ? el('courtsCounty').value : '',
      full_name: el('courtsName') ? el('courtsName').value.trim() : '',
      case_number: el('courtsCase') ? el('courtsCase').value.trim() : '',
      role: el('courtsRole') ? el('courtsRole').value : ''
    };
  }

  fireEvent('private_tool_lookup_submitted', {tab: tab});

  try {
    var r = await fetch(API + '/lookup', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });

    if(r.status === 401){
      setStatus('Session expired. Please purchase a new session.');
      sessionToken = null; lookupsRemaining = 0;
      payGate.style.display = 'block';
      tabBar.style.display = 'none';
      tabPanels.style.display = 'none';
      sessionBar.classList.remove('active');
      isLoading = false;
      return;
    }
    if(!r.ok){
      var err = await r.json().catch(function(){ return {}; });
      throw new Error(err.detail || 'lookup_failed');
    }

    var data = await r.json();
    lookupsRemaining = data.lookup_count_remaining;
    sessionTxt.textContent = t('tool_session_active', {n: lookupsRemaining});

    renderResults(data);

    var event = data.results && data.results.length > 0 ? 'private_tool_lookup_success' : 'private_tool_lookup_empty';
    fireEvent(event, {tab: tab, count: data.results ? data.results.length : 0});

  } catch(e){
    setStatus('');
    resultArea.style.display = 'block';
    resultArea.innerHTML = '<div class="vcx-result-error">Lookup error: ' + escapeHtml(e.message || 'unexpected error') + '. Please try again.</div>';
    fireEvent('private_tool_lookup_blocked', {tab: tab, error: e.message});
  }

  isLoading = false;
  checkConsentGates();
}

// ── Render results ─────────────────────────────────────────────────────────
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
  if(statusLine) statusLine.innerHTML = html || '';
}

// ── Event bindings ─────────────────────────────────────────────────────────
document.querySelectorAll('.vcx-tab-btn').forEach(function(b){
  b.addEventListener('click', function(){ switchTab(b.dataset.tab); });
});

if(payBtn) payBtn.addEventListener('click', function(){ startPayment(); });
if(el('vcxTollsSubmit')) el('vcxTollsSubmit').addEventListener('click', function(){ runLookup('tolls'); });
if(el('vcxTrafficSubmit')) el('vcxTrafficSubmit').addEventListener('click', function(){ runLookup('traffic'); });
if(el('vcxCourtsSubmit')) el('vcxCourtsSubmit').addEventListener('click', function(){ runLookup('courts'); });

// ── Init ──────────────────────────────────────────────────────────────────
async function init(){
  await loadConfig();
  fireEvent('private_tool_view', {tab: 'gate'});

  // Check if returning from Stripe
  var stripeSessionId = getUrlParam('session_id');
  var preId = getUrlParam('pre');

  if(stripeSessionId && preId){
    setStatus('<span class="vcx-spinner"></span> Verifying payment...');
    await verifyPayment(stripeSessionId, preId);
  } else {
    checkConsentGates();
  }
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', init, {once:true});
} else {
  init();
}

})();
