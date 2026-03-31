/**
 * VitaCoreX — Private Lookup Tool
 * Vanilla ES6 IIFE — no build step required.
 *
 * Privacy rules enforced here:
 *   - No PII sent to analytics (only tab names, status codes, click events)
 *   - Session token stored in sessionStorage only (cleared on tab close)
 *   - No personal data in URL params after payment return
 *   - Result area is never indexed (noindex on page)
 */
(function () {
  'use strict';

  /* ── Config ────────────────────────────────────────────────────────────── */
  var CONFIG = {
    apiBase: '/api',
    stripe_publishable_key: '',
    lookup_price: 14,
    action_memo_price: 39,
    monitoring_price: 19,
    stripe_enabled: false,
    booking_url: 'https://calendly.com/vitacorex2025/30min',
    lookup_access_enabled: true,
  };

  /* ── State ─────────────────────────────────────────────────────────────── */
  var sessionToken = sessionStorage.getItem('vcx_lookup_token') || null;
  var lookupsRemaining = parseInt(sessionStorage.getItem('vcx_lookup_remaining') || '3', 10);
  var activeTab = 'tolls';
  var isSubmitting = false;
  var extractionResult = null;

  /* ── Analytics (no PII) ────────────────────────────────────────────────── */
  function track(event, props) {
    try {
      var safe = Object.assign({ event_category: 'private_lookup' }, props || {});
      if (typeof window.trackEvent === 'function') window.trackEvent(event, safe);
      if (typeof window.gtag === 'function') window.gtag('event', event, safe);
    } catch (e) { /* never throw */ }
  }

  /* ── DOM helpers ────────────────────────────────────────────────────────── */
  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }
  function show(el) { if (el) { el.hidden = false; } }
  function hide(el) { if (el) { el.hidden = true; } }
  function setText(el, t) { if (el) el.textContent = t; }
  function setHTML(el, h) { if (el) el.innerHTML = h; }

  /* ── Load config from API ──────────────────────────────────────────────── */
  async function loadConfig() {
    try {
      var res = await fetch(CONFIG.apiBase + '/private-lookup/config');
      if (res.ok) {
        var data = await res.json();
        Object.assign(CONFIG, data);
        // Update price displays
        var priceEls = qsa('[data-vcx-lookup-price]');
        priceEls.forEach(function (el) { el.textContent = '$' + CONFIG.lookup_price; });
        var priceDisplay = qs('#vcx-price-display');
        if (priceDisplay) priceDisplay.textContent = '$' + CONFIG.lookup_price;
      }
    } catch (e) { /* use defaults */ }
  }

  /* ── Tab switching ─────────────────────────────────────────────────────── */
  function initTabs() {
    var tabBtns = qsa('.vcx-tab-btn');
    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tab = btn.dataset.tab;
        if (tab) switchTab(tab);
      });
      btn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          var tab = btn.dataset.tab;
          if (tab) switchTab(tab);
        }
      });
    });
  }

  function switchTab(tab) {
    activeTab = tab;
    // Update buttons
    qsa('.vcx-tab-btn').forEach(function (btn) {
      var isActive = btn.dataset.tab === tab;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    // Update panels
    qsa('.vcx-tab-panel').forEach(function (panel) {
      panel.hidden = panel.id !== ('vcx-panel-' + tab);
    });
    // Clear results when switching tab
    var resultArea = qs('#vcx-result-area');
    if (resultArea) hide(resultArea);
    track('tool_tab_selected', { tab: tab });
  }

  /* ── Payment gate ──────────────────────────────────────────────────────── */
  async function initGate() {
    // Check if already have valid session in sessionStorage
    if (sessionToken) {
      unlockTool();
      return;
    }

    // Check URL params for returning from Stripe
    var params = new URLSearchParams(window.location.search);
    var stripeSessionId = params.get('session_id');
    var preSessionId = params.get('pre');
    var cancelled = params.get('cancelled');

    // Clean URL params (no PII in URL)
    if (stripeSessionId || preSessionId || cancelled) {
      var cleanUrl = window.location.pathname;
      window.history.replaceState({}, '', cleanUrl);
    }

    if (cancelled) {
      showGateMessage('Payment cancelled. Click below to try again.', 'info');
      return;
    }

    if (stripeSessionId && preSessionId) {
      await verifyPayment(stripeSessionId, preSessionId);
      return;
    }

    // Show gate
    var unlockBtn = qs('#vcx-unlock-btn');
    if (unlockBtn) {
      unlockBtn.addEventListener('click', handleUnlockClick);
    }

    // Dev mode label
    if (!CONFIG.stripe_enabled) {
      var devNotice = qs('#vcx-dev-notice');
      if (devNotice) show(devNotice);
    }
  }

  function showGateMessage(msg, type) {
    var gate = qs('#vcx-gate');
    if (!gate) return;
    var existing = qs('.vcx-gate-msg', gate);
    if (existing) existing.remove();
    var el = document.createElement('p');
    el.className = 'vcx-gate-msg vcx-gate-msg--' + (type || 'info');
    el.textContent = msg;
    gate.appendChild(el);
  }

  async function handleUnlockClick() {
    var btn = qs('#vcx-unlock-btn');
    var loading = qs('#vcx-gate-loading');
    if (btn) btn.disabled = true;
    if (loading) show(loading);
    track('paid_lookup_checkout_start');

    try {
      var res = await fetch(CONFIG.apiBase + '/private-lookup/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        var err = await res.json().catch(function () { return {}; });
        throw new Error(err.detail || 'Could not start session.');
      }
      var data = await res.json();

      if (data.stripe_enabled && data.checkout_url) {
        // Redirect to Stripe Checkout
        window.location.href = data.checkout_url;
      } else {
        // Dev mode or Stripe not configured — verify immediately
        await verifyPayment(null, data.pre_session_id);
      }
    } catch (e) {
      if (loading) hide(loading);
      if (btn) btn.disabled = false;
      showGateMessage(e.message || 'Could not start session. Please try again.', 'error');
    }
  }

  async function verifyPayment(stripeSessionId, preSessionId) {
    var loading = qs('#vcx-gate-loading');
    if (loading) show(loading);

    try {
      var body = { pre_session_id: preSessionId };
      if (stripeSessionId) body.stripe_session_id = stripeSessionId;

      var res = await fetch(CONFIG.apiBase + '/private-lookup/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        var err = await res.json().catch(function () { return {}; });
        throw new Error(err.detail || 'Payment verification failed.');
      }

      var data = await res.json();
      sessionToken = data.session_token;
      lookupsRemaining = data.lookup_count || 3;
      sessionStorage.setItem('vcx_lookup_token', sessionToken);
      sessionStorage.setItem('vcx_lookup_remaining', String(lookupsRemaining));

      track('paid_lookup_checkout_success');
      unlockTool();
    } catch (e) {
      if (loading) hide(loading);
      showGateMessage(e.message || 'Verification failed. Please contact support.', 'error');
    }
  }

  function unlockTool() {
    hide(qs('#vcx-gate'));
    show(qs('#vcx-lookup-tool'));
    updateSessionInfo(lookupsRemaining);
    track('private_client_tool_view', { state: 'unlocked' });
    // Scroll to tool
    var tool = qs('#vcx-lookup-tool');
    if (tool) tool.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ── Session info ──────────────────────────────────────────────────────── */
  function updateSessionInfo(remaining) {
    lookupsRemaining = remaining;
    sessionStorage.setItem('vcx_lookup_remaining', String(remaining));
    var el = qs('#vcx-lookups-remaining');
    if (el) el.textContent = remaining;
    var plural = qs('#vcx-lookups-plural');
    if (plural) plural.textContent = remaining === 1 ? '' : 's';
    if (remaining <= 0) {
      var sessionBar = qs('#vcx-session-info');
      if (sessionBar) {
        sessionBar.classList.add('vcx-session-info--exhausted');
        var lbl = qs('.vcx-session-label', sessionBar);
        if (lbl) lbl.textContent = 'Session lookups used';
      }
    }
  }

  /* ── Form validation ───────────────────────────────────────────────────── */
  function clearErrors(formEl) {
    qsa('.vcx-field-error', formEl).forEach(function (el) { el.textContent = ''; });
    qsa('.vcx-field.is-error', formEl).forEach(function (el) { el.classList.remove('is-error'); });
  }

  function setFieldError(formEl, fieldName, msg) {
    var field = qs('[name="' + fieldName + '"]', formEl);
    if (field) {
      var wrapper = field.closest('.vcx-field');
      if (wrapper) {
        wrapper.classList.add('is-error');
        var errEl = qs('.vcx-field-error', wrapper);
        if (errEl) errEl.textContent = msg;
      }
    }
  }

  function validateTolls(form) {
    var plate = (qs('[name="plate_number"]', form) || {}).value || '';
    var state = (qs('[name="plate_state"]', form) || {}).value || '';
    var invoice = (qs('[name="invoice_number"]', form) || {}).value || '';
    var consent = (qs('[name="consent_acknowledged"]', form) || {}).checked;
    var errors = {};

    if (!plate.trim() && !invoice.trim()) {
      errors.plate_number = 'Enter a plate number or invoice number.';
    }
    if (plate.trim() && !state) {
      errors.plate_state = 'Select a plate state.';
    }
    if (!consent) errors.consent_acknowledged = 'Please acknowledge the consent notice.';
    return errors;
  }

  function validateTraffic(form) {
    var county = (qs('[name="fl_county"]', form) || {}).value || '';
    var citation = (qs('[name="citation_number"]', form) || {}).value || '';
    var consent = (qs('[name="consent_acknowledged"]', form) || {}).checked;
    var errors = {};
    if (!county) errors.fl_county = 'Select a Florida county.';
    if (!citation.trim()) errors.citation_number = 'Enter a citation number.';
    if (!consent) errors.consent_acknowledged = 'Please acknowledge the consent notice.';
    return errors;
  }

  function validateCourts(form) {
    var name = (qs('[name="full_name"]', form) || {}).value || '';
    var consent = (qs('[name="consent_acknowledged"]', form) || {}).checked;
    var errors = {};
    if (!name.trim()) errors.full_name = 'Enter a full legal name.';
    if (name.trim().length < 2) errors.full_name = 'Name must be at least 2 characters.';
    if (!consent) errors.consent_acknowledged = 'Please acknowledge the consent notice.';
    return errors;
  }

  function getConsentError(tab) {
    return {
      tolls: '#tolls-consent-error',
      traffic: '#traffic-consent-error',
      courts: '#courts-consent-error',
    }[tab] || null;
  }

  /* ── Build lookup payload ──────────────────────────────────────────────── */
  function buildLookupPayload(tab, form) {
    var payload = {
      tab: tab,
      session_token: sessionToken,
      consent_acknowledged: true,
    };

    if (tab === 'tolls') {
      payload.tolls = {
        plate_number: (qs('[name="plate_number"]', form) || {}).value || null,
        plate_state: (qs('[name="plate_state"]', form) || {}).value || null,
        zip_code: null,
        invoice_number: (qs('[name="invoice_number"]', form) || {}).value || null,
      };
      // Normalise empty strings to null
      Object.keys(payload.tolls).forEach(function (k) {
        if (payload.tolls[k] === '') payload.tolls[k] = null;
      });
    } else if (tab === 'traffic') {
      payload.traffic = {
        fl_county: (qs('[name="fl_county"]', form) || {}).value || '',
        citation_number: (qs('[name="citation_number"]', form) || {}).value || '',
      };
    } else if (tab === 'courts') {
      payload.courts = {
        full_name: (qs('[name="full_name"]', form) || {}).value || '',
        state: (qs('[name="state"]', form) || {}).value || 'FL',
        county: (qs('[name="county"]', form) || {}).value || null,
        case_number: (qs('[name="case_number"]', form) || {}).value || null,
        role_filter: (qs('[name="role_filter"]', form) || {}).value || 'any',
      };
      if (payload.courts.county === '') payload.courts.county = null;
      if (payload.courts.case_number === '') payload.courts.case_number = null;
    }

    return payload;
  }

  /* ── Submit lookup ─────────────────────────────────────────────────────── */
  async function submitLookup(tab, form) {
    if (isSubmitting) return;
    if (!sessionToken) {
      showGateMessage('Session not found. Please unlock access first.', 'error');
      return;
    }
    if (lookupsRemaining <= 0) {
      showResultError('Lookup limit reached for this session. Purchase a new session to continue.');
      return;
    }

    clearErrors(form);
    var errors = tab === 'tolls' ? validateTolls(form)
               : tab === 'traffic' ? validateTraffic(form)
               : validateCourts(form);

    if (Object.keys(errors).length) {
      Object.keys(errors).forEach(function (k) {
        if (k === 'consent_acknowledged') {
          var errSel = getConsentError(tab);
          if (errSel) {
            var errEl = qs(errSel);
            if (errEl) errEl.textContent = errors[k];
          }
        } else {
          setFieldError(form, k, errors[k]);
        }
      });
      return;
    }

    isSubmitting = true;
    setSubmitLoading(tab, true);
    showLoadingState();
    track('lookup_submitted', { tab: tab });

    try {
      var payload = buildLookupPayload(tab, form);
      var res = await fetch(CONFIG.apiBase + '/private-lookup/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        sessionStorage.removeItem('vcx_lookup_token');
        sessionStorage.removeItem('vcx_lookup_remaining');
        showResultError('Session expired. Please purchase a new lookup session.');
        return;
      }

      if (!res.ok) {
        var err = await res.json().catch(function () { return {}; });
        throw new Error(err.detail || 'Lookup failed. Please try again.');
      }

      var data = await res.json();
      updateSessionInfo(data.lookup_count_remaining);
      renderResults(data);

      // Track result state
      data.results.forEach(function (r) {
        track('source_lookup_' + r.result_state.replace(/-/g, '_'), {
          source: r.source_type,
          tab: tab,
        });
      });

    } catch (e) {
      showResultError(e.message || 'An error occurred. Please try again.');
      track('source_lookup_error', { tab: tab });
    } finally {
      isSubmitting = false;
      setSubmitLoading(tab, false);
    }
  }

  function setSubmitLoading(tab, loading) {
    var btn = qs('#vcx-submit-' + tab);
    if (!btn) return;
    btn.disabled = loading;
    var text = qs('.vcx-btn-text', btn);
    var loader = qs('.vcx-btn-loading', btn);
    if (text) text.hidden = loading;
    if (loader) loader.hidden = !loading;
  }

  function showLoadingState() {
    var resultArea = qs('#vcx-result-area');
    var loadingState = qs('#vcx-loading-state');
    var resultsList = qs('#vcx-results-list');
    var upsellStrip = qs('#vcx-upsell-strip');
    if (resultArea) show(resultArea);
    if (loadingState) show(loadingState);
    if (resultsList) setHTML(resultsList, '');
    if (upsellStrip) hide(upsellStrip);
    if (resultArea) resultArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function showResultError(msg) {
    var resultArea = qs('#vcx-result-area');
    var loadingState = qs('#vcx-loading-state');
    var resultsList = qs('#vcx-results-list');
    if (resultArea) show(resultArea);
    if (loadingState) hide(loadingState);
    if (resultsList) {
      resultsList.innerHTML = '<div class="vcx-result-card vcx-result-card--error">' +
        '<p class="vcx-result-summary">' + escHtml(msg) + '</p></div>';
    }
  }

  /* ── Result rendering ──────────────────────────────────────────────────── */
  function renderResults(response) {
    var loadingState = qs('#vcx-loading-state');
    var resultsList = qs('#vcx-results-list');
    var upsellStrip = qs('#vcx-upsell-strip');

    if (loadingState) hide(loadingState);
    if (!resultsList) return;

    setHTML(resultsList, '');

    if (!response.results || response.results.length === 0) {
      resultsList.innerHTML = '<div class="vcx-result-card vcx-result-card--empty">' +
        '<p class="vcx-result-summary">No results returned. Please verify your input and try again.</p></div>';
    } else {
      response.results.forEach(function (result) {
        resultsList.appendChild(buildResultCard(result));
      });
    }

    // Upsell strip
    if (upsellStrip) {
      renderUpsellStrip(upsellStrip, response);
      show(upsellStrip);
    }
  }

  var STATE_LABEL = {
    found: 'Record Found',
    empty: 'No Record Found',
    official_handoff: 'Official Source Available',
    official_routing: 'Official Routing',
    blocked: 'Source Unavailable',
    error: 'Error',
    pending_payment: 'Payment Required',
  };

  var STATE_CSS = {
    found: 'vcx-result-card--found',
    empty: 'vcx-result-card--empty',
    official_handoff: 'vcx-result-card--official-handoff',
    official_routing: 'vcx-result-card--official-routing',
    blocked: 'vcx-result-card--blocked',
    error: 'vcx-result-card--error',
    pending_payment: 'vcx-result-card--blocked',
  };

  function buildResultCard(result) {
    var card = document.createElement('article');
    card.className = 'vcx-result-card ' + (STATE_CSS[result.result_state] || '');

    var stateLabel = STATE_LABEL[result.result_state] || result.result_state;

    var html = '<div class="vcx-result-card-header">' +
      '<span class="vcx-source-badge">' + escHtml(result.source_name) + '</span>' +
      '<span class="vcx-status-pill vcx-status-pill--' + escHtml(result.result_state) + '">' + escHtml(stateLabel) + '</span>' +
      '</div>';

    // Meta row
    var meta = [];
    if (result.jurisdiction) meta.push('<span>' + escHtml(result.jurisdiction) + '</span>');
    if (result.case_number) meta.push('<span>Ref: ' + escHtml(result.case_number) + '</span>');
    if (result.role) meta.push('<span>Role: ' + escHtml(result.role) + '</span>');
    if (result.amount_due) meta.push('<span class="vcx-amount-due">' + escHtml(result.amount_due) + '</span>');
    if (result.due_date) meta.push('<span>Due: ' + escHtml(result.due_date) + '</span>');
    if (meta.length) {
      html += '<div class="vcx-result-meta">' + meta.join('') + '</div>';
    }

    html += '<p class="vcx-result-summary">' + escHtml(result.summary) + '</p>';

    // Action buttons
    html += '<div class="vcx-result-actions">';

    if (result.official_record_url) {
      html += '<a class="vcx-official-link" href="' + escAttr(result.official_record_url) +
        '" target="_blank" rel="noopener noreferrer" data-track="official_source_click">View Official Source ↗</a>';
    }

    if (result.official_payment_url && result.result_state !== 'blocked') {
      html += '<a class="vcx-pay-link" href="' + escAttr(result.official_payment_url) +
        '" target="_blank" rel="noopener noreferrer" data-track="official_pay_click">Pay Officially ↗</a>';
    }

    html += '<button type="button" class="vcx-consult-btn" data-track="private_consult_cta_click">' +
      'Book Private Consultation</button>';

    html += '</div>';

    card.innerHTML = html;

    // Bind consult button
    var consultBtn = qs('.vcx-consult-btn', card);
    if (consultBtn) {
      consultBtn.addEventListener('click', function () {
        track('private_consult_cta_click', { state: result.result_state });
        window.open(CONFIG.booking_url, '_blank', 'noopener');
      });
    }

    // Bind official link tracking
    qsa('[data-track]', card).forEach(function (el) {
      el.addEventListener('click', function () {
        track(el.dataset.track, { source: result.source_type, tab: activeTab });
      });
    });

    return card;
  }

  /* ── Upsell strip ──────────────────────────────────────────────────────── */
  function renderUpsellStrip(container, response) {
    var items = [
      {
        title: 'Full Action Memo',
        price: '$' + CONFIG.action_memo_price,
        desc: 'Detailed next-step memo with analysis of your result and recommended actions.',
        cta: 'Order Action Memo',
        track: 'action_memo_cta_click',
        action: 'action_memo',
      },
      {
        title: 'Private Consultation',
        price: 'From $125',
        desc: 'One-on-one consultation with a VitaCoreX advisor to review your situation.',
        cta: 'Book Consultation',
        track: 'private_consult_cta_click',
        action: 'consult',
      },
      {
        title: 'Document Packet Prep',
        price: 'From $199',
        desc: 'Professional preparation of your documentation packet for submission or review.',
        cta: 'Request Packet Prep',
        track: 'packet_prep_cta_click',
        action: 'packet_prep',
      },
      {
        title: 'Monitoring & Reminders',
        price: '$' + CONFIG.monitoring_price + '/mo',
        desc: 'Ongoing monitoring for new obligations and timely reminders for key deadlines.',
        cta: 'Subscribe',
        track: 'reminders_cta_click',
        action: 'monitoring',
      },
    ];

    var html = '<h3 class="vcx-upsell-heading">VitaCoreX Private Services</h3>' +
      '<div class="vcx-upsell-grid">';

    items.forEach(function (item) {
      html += '<div class="vcx-upsell-card">' +
        '<div class="vcx-upsell-card-header">' +
        '<span class="vcx-upsell-title">' + escHtml(item.title) + '</span>' +
        '<span class="vcx-upsell-price">' + escHtml(item.price) + '</span>' +
        '</div>' +
        '<p class="vcx-upsell-desc">' + escHtml(item.desc) + '</p>' +
        '<button type="button" class="vcx-upsell-btn" data-action="' + escAttr(item.action) +
        '" data-track="' + escAttr(item.track) + '">' + escHtml(item.cta) + '</button>' +
        '</div>';
    });

    html += '</div>';
    container.innerHTML = html;

    qsa('.vcx-upsell-btn', container).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var action = btn.dataset.action;
        var trackEvent = btn.dataset.track;
        track(trackEvent);
        handleUpsellAction(action);
      });
    });
  }

  function handleUpsellAction(action) {
    if (action === 'consult') {
      window.open(CONFIG.booking_url, '_blank', 'noopener');
    } else if (action === 'packet_prep') {
      // Scroll to the contact form on additional-services page or open contact
      window.location.href = '/additional-services.html#vcx-form';
    } else if (action === 'monitoring') {
      // For now, route to contact form; full subscription flow in a later step
      window.location.href = '/contact.html';
    } else if (action === 'action_memo') {
      // Route to contact for now; direct Stripe checkout available when price ID configured
      window.location.href = '/contact.html';
    }
  }

  /* ── Upload flow ───────────────────────────────────────────────────────── */
  function initUploadZone() {
    var zone = qs('#vcx-upload-zone');
    var fileInput = qs('#vcx-file-input');
    if (!zone || !fileInput) return;

    zone.addEventListener('dragover', function (e) {
      e.preventDefault();
      zone.classList.add('dragover');
    });

    zone.addEventListener('dragleave', function () {
      zone.classList.remove('dragover');
    });

    zone.addEventListener('drop', function (e) {
      e.preventDefault();
      zone.classList.remove('dragover');
      var files = e.dataTransfer && e.dataTransfer.files;
      if (files && files[0]) uploadDocument(files[0]);
    });

    fileInput.addEventListener('change', function () {
      if (fileInput.files && fileInput.files[0]) {
        uploadDocument(fileInput.files[0]);
      }
    });

    // Use extraction result
    var useBtn = qs('#vcx-use-extracted');
    if (useBtn) {
      useBtn.addEventListener('click', function () {
        applyExtractedFields();
      });
    }

    var discardBtn = qs('#vcx-discard-extracted');
    if (discardBtn) {
      discardBtn.addEventListener('click', function () {
        hide(qs('#vcx-extraction-confirm'));
        extractionResult = null;
        switchTab('tolls'); // default
      });
    }
  }

  async function uploadDocument(file) {
    if (!sessionToken) {
      showGateMessage('Please unlock access before uploading documents.', 'error');
      return;
    }

    var idle = qs('#vcx-upload-idle');
    var loading = qs('#vcx-upload-loading');
    var confirm = qs('#vcx-extraction-confirm');

    if (idle) hide(idle);
    if (loading) show(loading);
    if (confirm) hide(confirm);

    track('document_upload_started', { type: file.type });

    try {
      var formData = new FormData();
      formData.append('file', file);

      var res = await fetch(CONFIG.apiBase + '/private-lookup/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        var err = await res.json().catch(function () { return {}; });
        throw new Error(err.detail || 'Upload failed.');
      }

      var data = await res.json();
      extractionResult = data;

      if (loading) hide(loading);
      if (idle) show(idle);

      showExtractionConfirmation(data);

      track('document_upload_success', {
        extracted: data.extraction_successful,
        suggested_tab: data.suggested_tab || 'unknown',
      });

    } catch (e) {
      if (loading) hide(loading);
      if (idle) show(idle);
      alert('Upload error: ' + (e.message || 'Please try again.'));
    }
  }

  function showExtractionConfirmation(data) {
    var confirm = qs('#vcx-extraction-confirm');
    var msgEl = qs('#vcx-extraction-message');
    var fieldsEl = qs('#vcx-extracted-fields');
    if (!confirm || !fieldsEl) return;

    if (msgEl) msgEl.textContent = data.message || '';

    var html = '';
    (data.extracted_fields || []).forEach(function (f) {
      var confPct = Math.round((f.confidence || 0) * 100);
      html += '<div class="vcx-extracted-field' + (f.requires_confirmation ? ' needs-confirm' : '') + '">' +
        '<label>' +
        '<span class="vcx-field-name">' + escHtml(humanizeFieldName(f.field_name)) + '</span>' +
        '<input type="text" class="vcx-extracted-input" data-field="' + escAttr(f.field_name) +
        '" value="' + escAttr(f.value) + '">' +
        '</label>' +
        '<span class="vcx-confidence">' + confPct + '% confidence' +
        (f.requires_confirmation ? ' — please confirm' : '') + '</span>' +
        '</div>';
    });

    if (!html) {
      html = '<p class="vcx-no-fields">No fields could be extracted. Please enter information manually.</p>';
    }

    fieldsEl.innerHTML = html;
    show(confirm);
  }

  function humanizeFieldName(key) {
    var names = {
      invoice_number: 'Invoice / Citation Number',
      plate_number: 'License Plate',
      citation_number: 'Citation Number',
      case_number: 'Case Number',
      fl_county: 'County',
      amount_due: 'Amount Due',
    };
    return names[key] || key.replace(/_/g, ' ');
  }

  function applyExtractedFields() {
    if (!extractionResult) return;
    var fieldsEl = qs('#vcx-extracted-fields');
    var inputs = qsa('.vcx-extracted-input', fieldsEl);
    var tab = extractionResult.suggested_tab || 'tolls';

    inputs.forEach(function (input) {
      var fieldName = input.dataset.field;
      var value = input.value;

      // Map to the correct form field
      var targetId = {
        invoice_number: 'tolls_invoice_number',
        plate_number: 'tolls_plate_number',
        citation_number: 'traffic_citation_number',
        case_number: 'courts_case_number',
        fl_county: 'traffic_fl_county',
      }[fieldName];

      if (targetId) {
        var target = qs('#' + targetId);
        if (target) target.value = value;
      }
    });

    hide(qs('#vcx-extraction-confirm'));
    extractionResult = null;
    switchTab(tab);

    track('extraction_confirmed', { tab: tab });
  }

  /* ── New search ────────────────────────────────────────────────────────── */
  function resetSearch() {
    var resultArea = qs('#vcx-result-area');
    if (resultArea) hide(resultArea);
    qsa('.vcx-lookup-form').forEach(function (form) { form.reset(); });
    updateSessionInfo(lookupsRemaining);
    track('new_search_started');
  }

  /* ── Security helpers ──────────────────────────────────────────────────── */
  function escHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escAttr(str) {
    return escHtml(str);
  }

  /* ── Bind form submits ─────────────────────────────────────────────────── */
  function bindFormEvents() {
    ['tolls', 'traffic', 'courts'].forEach(function (tab) {
      var form = qs('#vcx-form-' + tab);
      if (!form) return;
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        submitLookup(tab, form);
      });
    });

    var newSearchBtn = qs('#vcx-new-search');
    if (newSearchBtn) {
      newSearchBtn.addEventListener('click', resetSearch);
    }
  }

  /* ── Init ──────────────────────────────────────────────────────────────── */
  async function init() {
    if (!qs('[data-vcx-private-lookup]')) return;

    await loadConfig();
    initTabs();
    initUploadZone();
    bindFormEvents();
    await initGate();

    track('private_client_tool_view', { state: sessionToken ? 'returning' : 'gate' });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
