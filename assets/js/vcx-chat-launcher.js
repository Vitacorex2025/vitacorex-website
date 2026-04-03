/**
 * VCX Floating Chat Launcher — Phase 7A
 *
 * Site-wide floating chat widget that opens a conservative drawer panel.
 * Reuses the legal-assistant backend (POST /api/legal-chat/message,
 * /escalate, /convert-to-intake).
 *
 * Self-contained: loads its own CSS, builds its own DOM.
 * Hidden on the dedicated legal-assistant page (data-vcx-page="legal-assistant").
 */
(function () {
  'use strict';

  /* ── Guard: skip if full legal-assistant page is active ──────────── */
  if (document.body && document.body.getAttribute('data-vcx-page') === 'legal-assistant') return;

  /* ── Config ──────────────────────────────────────────────────────── */
  var API_BASE = window.VCX_API_BASE || '';
  var STORAGE_KEY = 'vcx_cw_session';
  var STATE_KEY = 'vcx_cw_open';
  var ALLOWED_EXT = ['.pdf','.doc','.docx','.txt','.md','.jpg','.jpeg','.png','.gif','.csv','.xlsx','.xls'];
  var MAX_FILE_MB = 25;

  /* ── SVG Icons (inline, no external assets) ─────────────────────── */
  var ICON_CHAT = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/></svg>';
  var ICON_CLOSE = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';
  var ICON_SEND = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>';
  var ICON_ATTACH = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 015 0v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6h-1.5v9.5a2.5 2.5 0 005 0V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6H16.5z"/></svg>';
  var ICON_CAMERA = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 15.2a3.2 3.2 0 100-6.4 3.2 3.2 0 000 6.4z"/><path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>';
  var ICON_FILE = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/></svg>';
  var ICON_IMAGE = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>';

  /* ── Phase 7B: Attachment category helpers ───────────────────────── */
  var IMAGE_EXT = ['.jpg', '.jpeg', '.png', '.gif'];

  function isImageFile(name) {
    var ext = fileExtension(name);
    return IMAGE_EXT.indexOf(ext) !== -1;
  }

  function humanFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  /* ── State ───────────────────────────────────────────────────────── */
  var state = {
    sessionId: null,
    topic: null,
    jurisdiction: null,
    mode: null,
    escalation: null,
    attachments: [],
    messageCount: 0,
  };

  /* Restore session from sessionStorage */
  try {
    var saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      var parsed = JSON.parse(saved);
      state.sessionId = parsed.sessionId || null;
      state.topic = parsed.topic || null;
      state.jurisdiction = parsed.jurisdiction || null;
    }
  } catch (e) { /* ignore */ }

  /* ── Helpers ─────────────────────────────────────────────────────── */

  function esc(v) {
    return String(v)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function saveState() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        sessionId: state.sessionId,
        topic: state.topic,
        jurisdiction: state.jurisdiction,
      }));
    } catch (e) { /* ignore */ }
  }

  function generateSessionId() {
    return 'cw_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 8);
  }

  function fileExtension(name) {
    var dot = name.lastIndexOf('.');
    return dot > 0 ? name.substring(dot).toLowerCase() : '';
  }

  /* ── Self-inject CSS ─────────────────────────────────────────────── */
  var cssLink = document.createElement('link');
  cssLink.rel = 'stylesheet';
  cssLink.href = '/assets/css/vcx-chat-launcher.css';
  document.head.appendChild(cssLink);

  /* ── Build DOM ───────────────────────────────────────────────────── */

  function build() {
    /* Launcher FAB */
    var fab = document.createElement('button');
    fab.className = 'vcx-cw-launcher';
    fab.setAttribute('aria-label', 'Open chat');
    fab.setAttribute('type', 'button');
    fab.innerHTML =
      '<span class="vcx-cw-icon-chat">' + ICON_CHAT + '</span>' +
      '<span class="vcx-cw-icon-close">' + ICON_CLOSE + '</span>';

    /* Panel */
    var panel = document.createElement('div');
    panel.className = 'vcx-cw-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Chat with VitaCoreX');

    panel.innerHTML =
      /* Header */
      '<div class="vcx-cw-header">' +
        '<span class="vcx-cw-header-dot"></span>' +
        '<span class="vcx-cw-header-title">VitaCoreX Assistant</span>' +
        '<button class="vcx-cw-header-close" type="button" aria-label="Close chat">' +
          ICON_CLOSE +
        '</button>' +
      '</div>' +
      /* Messages */
      '<div class="vcx-cw-messages" id="vcxCwMessages"></div>' +
      /* Input bar */
      '<div class="vcx-cw-input-bar">' +
        '<div class="vcx-cw-attach-group">' +
          '<button class="vcx-cw-btn-attach" type="button" aria-label="Attach file" title="Attach file">' + ICON_ATTACH + '</button>' +
          '<button class="vcx-cw-btn-camera" type="button" aria-label="Take photo" title="Take photo">' + ICON_CAMERA + '</button>' +
        '</div>' +
        '<div class="vcx-cw-input-wrap">' +
          '<textarea class="vcx-cw-input" placeholder="Type a message\u2026" rows="1"></textarea>' +
        '</div>' +
        '<button class="vcx-cw-btn-send" type="button" aria-label="Send" disabled>' + ICON_SEND + '</button>' +
      '</div>' +
      /* Hidden file inputs */
      '<input type="file" class="vcx-cw-file-input" id="vcxCwFileInput" accept=".pdf,.doc,.docx,.txt,.md,.jpg,.jpeg,.png,.gif,.csv,.xlsx,.xls">' +
      '<input type="file" class="vcx-cw-file-input" id="vcxCwCameraInput" accept="image/*" capture="environment">';

    document.body.appendChild(fab);
    document.body.appendChild(panel);
    document.body.classList.add('vcx-cw-active');

    return { fab: fab, panel: panel };
  }

  /* ── Wait for DOMContentLoaded ───────────────────────────────────── */

  function init() {
    /* Second guard — body might not have data-vcx-page yet at script parse time */
    if (document.body.getAttribute('data-vcx-page') === 'legal-assistant') return;

    var dom = build();
    var fab = dom.fab;
    var panel = dom.panel;
    var messages = panel.querySelector('.vcx-cw-messages');
    var input = panel.querySelector('.vcx-cw-input');
    var btnSend = panel.querySelector('.vcx-cw-btn-send');
    var btnAttach = panel.querySelector('.vcx-cw-btn-attach');
    var btnCamera = panel.querySelector('.vcx-cw-btn-camera');
    var fileInput = panel.querySelector('#vcxCwFileInput');
    var cameraInput = panel.querySelector('#vcxCwCameraInput');
    var closeBtn = panel.querySelector('.vcx-cw-header-close');
    var isOpen = false;

    /* ── Ensure session ──────────────────────────────────────────── */
    if (!state.sessionId) {
      state.sessionId = generateSessionId();
      saveState();
    }

    /* ── Open / Close ────────────────────────────────────────────── */

    function openPanel() {
      isOpen = true;
      panel.classList.add('vcx-cw-visible');
      fab.classList.add('vcx-cw-open');
      fab.setAttribute('aria-label', 'Close chat');
      input.focus();
      try { sessionStorage.setItem(STATE_KEY, '1'); } catch (e) { /* */ }
    }

    function closePanel() {
      isOpen = false;
      panel.classList.remove('vcx-cw-visible');
      fab.classList.remove('vcx-cw-open');
      fab.setAttribute('aria-label', 'Open chat');
      try { sessionStorage.setItem(STATE_KEY, '0'); } catch (e) { /* */ }
    }

    fab.addEventListener('click', function () {
      if (isOpen) closePanel(); else openPanel();
    });

    closeBtn.addEventListener('click', closePanel);

    /* Close on Escape key */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) closePanel();
    });

    /* ── Message rendering ───────────────────────────────────────── */

    function modeBadge(mode) {
      if (mode === 'legal_information') return '<span class="vcx-cw-mode-badge vcx-cw-mode-legal">Legal Info</span>';
      if (mode === 'vcx_routing') return '<span class="vcx-cw-mode-badge vcx-cw-mode-routing">Service Guide</span>';
      if (mode === 'high_risk') return '<span class="vcx-cw-mode-badge vcx-cw-mode-escalate">Escalation</span>';
      return '';
    }

    function isBoundary(status, mode) {
      return status === 'escalate' || mode === 'high_risk';
    }

    function appendMessage(role, text, payload) {
      payload = payload || {};
      var bubble = document.createElement('div');
      bubble.className = 'vcx-cw-bubble vcx-cw-bubble-' + role;

      if (role === 'bot' && isBoundary(payload.status, payload.mode)) {
        bubble.classList.add('vcx-cw-bubble-boundary');
      }

      var html = '<span class="vcx-cw-bubble-meta">';
      html += role === 'bot' ? 'Assistant ' + modeBadge(payload.mode) : 'You';
      html += '</span>';
      html += '<div>' + esc(text).replace(/\n/g, '<br>') + '</div>';

      /* Escalation links */
      if (payload.escalation_links && payload.escalation_links.length) {
        html += '<div class="vcx-cw-escalation-links">';
        payload.escalation_links.forEach(function (link) {
          html += '<a class="vcx-cw-escalation-link" href="' + esc(link.url) + '">';
          html += '<span class="vcx-cw-escalation-label">' + esc(link.label) + '</span>';
          if (link.description) {
            html += '<span class="vcx-cw-escalation-desc">' + esc(link.description) + '</span>';
          }
          html += '</a>';
        });
        html += '</div>';
      }

      /* Suggestions */
      if (payload.suggestions && payload.suggestions.length) {
        html += '<div class="vcx-cw-suggestions">';
        payload.suggestions.forEach(function (s) {
          html += '<button type="button" class="vcx-cw-suggestion" data-suggestion="' + esc(s) + '">' + esc(s) + '</button>';
        });
        html += '</div>';
      }

      /* Sources */
      if (payload.sources && payload.sources.length) {
        html += '<div class="vcx-cw-sources">Sources: ' + payload.sources.map(esc).join(', ') + '</div>';
      }

      /* Next step */
      if (payload.next_step) {
        html += '<div class="vcx-cw-sources">Next step: ' + esc(payload.next_step) + '</div>';
      }

      /* Intake CTA when status is escalate and we have escalation data */
      if (payload.status === 'escalate' && state.escalation) {
        html += '<div class="vcx-cw-intake-cta">';
        html += '<p>Ready to move forward? Convert this into a structured intake.</p>';
        html += '<button type="button" class="vcx-cw-intake-btn vcx-cw-convert-btn">Continue to Structured Intake</button>';
        html += '</div>';
      }

      bubble.innerHTML = html;
      messages.appendChild(bubble);
      messages.scrollTop = messages.scrollHeight;
      state.messageCount++;
    }

    function showTyping() {
      var el = document.createElement('div');
      el.className = 'vcx-cw-typing';
      el.id = 'vcxCwTyping';
      el.innerHTML = '<span class="vcx-cw-typing-dot"></span><span class="vcx-cw-typing-dot"></span><span class="vcx-cw-typing-dot"></span>';
      messages.appendChild(el);
      messages.scrollTop = messages.scrollHeight;
    }

    function hideTyping() {
      var el = document.getElementById('vcxCwTyping');
      if (el) el.remove();
    }

    /* ── Send message ────────────────────────────────────────────── */

    async function sendMessage(text) {
      appendMessage('user', text);
      showTyping();

      var payload = {
        session_id: state.sessionId,
        message: text,
        topic: state.topic,
        state: state.jurisdiction,
        language: 'en',
      };

      try {
        var res = await fetch(API_BASE + '/api/legal-chat/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        hideTyping();

        if (res.status === 429) {
          appendMessage('bot', 'Too many requests. Please wait a moment.', {
            status: 'rate_limited',
            escalation_links: [
              { label: 'Open Structured Intake', url: '/structured-case-intake.html', description: 'Submit your question directly.' }
            ]
          });
          return;
        }

        if (!res.ok) throw new Error('HTTP ' + res.status);

        var data = await res.json();
        state.sessionId = data.session_id;
        state.mode = data.mode || null;
        if (data.topic) state.topic = data.topic;
        if (data.state) state.jurisdiction = data.state;
        saveState();

        appendMessage('bot', data.answer, data);

      } catch (err) {
        hideTyping();
        appendMessage('bot', 'The assistant is not responding. You can submit your question through Structured Intake instead.', {
          status: 'error',
          escalation_links: [
            { label: 'Open Structured Intake', url: '/structured-case-intake.html', description: 'Submit your matter for private review.' },
            { label: 'Call (888) 794-8292', url: 'tel:+18887948292', description: 'Speak with someone directly.' }
          ]
        });
        console.error('[VCX Chat Widget]', err);
      }
    }

    /* ── Input handling ───────────────────────────────────────────── */

    function updateSendState() {
      btnSend.disabled = !input.value.trim();
    }

    input.addEventListener('input', function () {
      updateSendState();
      /* Auto-resize textarea */
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 80) + 'px';
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        submitInput();
      }
    });

    btnSend.addEventListener('click', submitInput);

    function submitInput() {
      var text = input.value.trim();
      if (!text) return;
      input.value = '';
      input.style.height = 'auto';
      updateSendState();
      sendMessage(text);
    }

    /* Suggestion chip clicks */
    messages.addEventListener('click', function (e) {
      var target = e.target;
      if (!(target instanceof HTMLElement)) return;

      if (target.classList.contains('vcx-cw-suggestion')) {
        var suggestion = target.getAttribute('data-suggestion');
        if (suggestion) sendMessage(suggestion);
        return;
      }

      if (target.classList.contains('vcx-cw-convert-btn')) {
        convertToIntake(target);
        return;
      }
    });

    /* ── File upload ──────────────────────────────────────────────── */

    btnAttach.addEventListener('click', function () { fileInput.click(); });
    btnCamera.addEventListener('click', function () { cameraInput.click(); });

    fileInput.addEventListener('change', function () { handleFileSelect(this); });
    cameraInput.addEventListener('change', function () { handleFileSelect(this); });

    function handleFileSelect(inputEl) {
      if (!inputEl.files || !inputEl.files.length) return;
      var file = inputEl.files[0];
      inputEl.value = ''; /* reset for re-select */

      /* Phase 7B: Enhanced client-side validation with clear errors */
      var ext = fileExtension(file.name);

      if (!ext) {
        appendMessage('bot', 'This file has no extension. Please rename it with the correct extension (e.g., .pdf, .jpg) and try again.', {});
        return;
      }

      if (ALLOWED_EXT.indexOf(ext) === -1) {
        var isImg = isImageFile(file.name);
        appendMessage('bot',
          'File type "' + esc(ext) + '" is not supported.\n\n' +
          'Accepted documents: .pdf, .doc, .docx, .txt, .md, .csv, .xlsx, .xls\n' +
          'Accepted images: .jpg, .jpeg, .png, .gif\n\n' +
          'Maximum file size: ' + MAX_FILE_MB + ' MB.',
          {}
        );
        return;
      }

      if (file.size === 0) {
        appendMessage('bot', 'This file appears to be empty. Please select a different file.', {});
        return;
      }

      if (file.size > MAX_FILE_MB * 1024 * 1024) {
        appendMessage('bot',
          'File too large (' + humanFileSize(file.size) + '). Maximum allowed: ' + MAX_FILE_MB + ' MB.\n\n' +
          'Try compressing the file or uploading a smaller version.',
          {}
        );
        return;
      }

      uploadFile(file);
    }

    async function uploadFile(file) {
      /* Phase 7B: Category-aware upload bubble with image preview */
      var isImg = isImageFile(file.name);
      var bubble = document.createElement('div');
      bubble.className = 'vcx-cw-bubble vcx-cw-bubble-user';

      var pillIcon = isImg ? ICON_IMAGE : ICON_FILE;
      var categoryLabel = isImg ? 'Image' : 'Document';
      var html =
        '<span class="vcx-cw-bubble-meta">You</span>' +
        '<div class="vcx-cw-file-pill">' + pillIcon +
        '<span>' + esc(file.name) + ' (' + humanFileSize(file.size) + ')</span>' +
        '<span class="vcx-cw-file-category vcx-cw-cat-' + (isImg ? 'image' : 'document') + '">' + categoryLabel + '</span>' +
        '</div>';

      /* Image preview thumbnail */
      if (isImg) {
        try {
          var objectUrl = URL.createObjectURL(file);
          html += '<div class="vcx-cw-img-preview-wrap">' +
            '<img class="vcx-cw-img-preview" src="' + objectUrl + '" alt="' + esc(file.name) + '" ' +
            'onload="URL.revokeObjectURL(this.src)">' +
            '</div>';
        } catch (e) { /* preview not critical */ }
      }

      bubble.innerHTML = html;
      messages.appendChild(bubble);
      messages.scrollTop = messages.scrollHeight;

      /* Show uploading status */
      showTyping();

      /* Upload to server */
      var formData = new FormData();
      formData.append('session_id', state.sessionId);
      formData.append('file', file);

      try {
        var res = await fetch(API_BASE + '/api/legal-chat/upload', {
          method: 'POST',
          body: formData,
        });

        hideTyping();

        if (res.status === 413) {
          appendMessage('bot', 'The server rejected this file as too large. Maximum: ' + MAX_FILE_MB + ' MB.', {});
          return;
        }

        if (res.status === 400) {
          var errData = null;
          try { errData = await res.json(); } catch (e) { /* */ }
          var detail = errData && errData.detail ? errData.detail : 'File validation failed.';
          appendMessage('bot', detail, {});
          return;
        }

        if (!res.ok) throw new Error('HTTP ' + res.status);

        var data = await res.json();
        state.attachments.push({
          file_id: data.file_id,
          filename: data.filename,
          category: data.category || (isImg ? 'image' : 'document'),
        });

        /* Phase 7B: Use server acknowledgment (category-aware, honest fallback) */
        if (data.acknowledgment) {
          appendMessage('bot', data.acknowledgment, {
            escalation_links: data.category === 'document' ? [
              { label: 'Contract Review', url: '/app/vcx-contract-review/', description: 'Upload for detailed contract analysis.' }
            ] : []
          });
        } else {
          appendMessage('bot', 'File received: ' + esc(data.filename) + '.', {});
        }

      } catch (err) {
        hideTyping();
        /* Graceful degradation: file upload might not be available yet */
        appendMessage('bot',
          'Upload could not be completed right now. You can attach this file on the intake form instead.',
          {
            escalation_links: [
              { label: 'Open Structured Intake', url: '/structured-case-intake.html', description: 'Upload and submit with your intake.' }
            ]
          }
        );
        console.warn('[VCX Chat Widget] Upload failed:', err.message);
      }
    }

    /* ── Convert to Intake ───────────────────────────────────────── */

    async function convertToIntake(btn) {
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Preparing\u2026';
      }

      var payload = {
        session_id: state.sessionId,
        name: state.escalation ? state.escalation.name : null,
        email: state.escalation ? state.escalation.email : null,
        phone: state.escalation ? state.escalation.phone : null,
        urgency: 'Standard',
      };

      try {
        var res = await fetch(API_BASE + '/api/legal-chat/convert-to-intake', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error('HTTP ' + res.status);
        var data = await res.json();

        if (data.prefill_url) {
          window.location.href = data.prefill_url;
          return;
        }
      } catch (err) {
        console.warn('[VCX Chat Widget] Convert failed, falling back:', err.message);
      }

      /* Fallback redirect */
      var params = new URLSearchParams();
      params.set('vcx_from', 'chat');
      if (state.sessionId) params.set('vcx_session', state.sessionId);
      if (state.topic) params.set('vcx_topic', state.topic);
      if (state.jurisdiction) params.set('vcx_state', state.jurisdiction);
      if (state.escalation) {
        if (state.escalation.name) params.set('vcx_name', state.escalation.name);
        if (state.escalation.email) params.set('vcx_email', state.escalation.email);
        if (state.escalation.phone) params.set('vcx_phone', state.escalation.phone);
      }
      window.location.href = '/structured-case-intake.html?' + params.toString();
    }

    /* ── Welcome message ─────────────────────────────────────────── */

    appendMessage('bot',
      'Welcome to VitaCoreX. I can help with:\n\n' +
      '\u2022 Legal topics: contracts, immigration, auto deals, Florida portals\n' +
      '\u2022 VitaCoreX services: intake, contract review, recovery, portal\n' +
      '\u2022 General questions\n\n' +
      'I provide information and workflow guidance, not legal advice.\n' +
      'Type your question or select a topic below.',
      {
        mode: 'general_chat',
        suggestions: [
          'Contract question',
          'Immigration packet',
          'Auto deal review',
          'VitaCoreX services',
        ]
      }
    );

    /* ── Restore open state if previously open ────────────────────── */
    try {
      if (sessionStorage.getItem(STATE_KEY) === '1') {
        openPanel();
      }
    } catch (e) { /* ignore */ }
  }

  /* ── Boot ────────────────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
