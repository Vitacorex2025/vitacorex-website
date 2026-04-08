/**
 * VCX AI Assistant — New UI + Old Functionality
 * Uses the new floating assistant HTML (vcx-ai-wrap)
 * with full backend API, session management, KB fallback,
 * suggestions, escalation links from vcx-chat-launcher.
 */
(function () {
  'use strict';

  /* ── Guard: skip on legal-assistant page ── */
  if (document.body && document.body.getAttribute('data-vcx-page') === 'legal-assistant') return;

  /* ── Config ── */
  var LOCAL_API = (function () {
    var port = location.port;
    if (port === '8080' || port === '8765' || port === '8090' || port === '3000')
      return 'http://' + location.hostname + ':8787';
    return '';
  })();
  var PROD_API = 'https://vcx-api.onrender.com';
  var API_BASE = window.VCX_API_BASE || LOCAL_API || PROD_API;
  var STORAGE_KEY = 'vcx_ai_session';
  var HEALTHZ_TIMEOUT = 4000;

  /* ── State ── */
  var state = {
    sessionId: null,
    topic: null,
    jurisdiction: 'FL',
    mode: null,
    backendReady: false,
    sending: false
  };

  try {
    var saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      var p = JSON.parse(saved);
      state.sessionId = p.sessionId || null;
      state.topic = p.topic || null;
      state.jurisdiction = p.jurisdiction || 'FL';
    }
  } catch (e) {}

  function saveState() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        sessionId: state.sessionId,
        topic: state.topic,
        jurisdiction: state.jurisdiction
      }));
    } catch (e) {}
  }

  function genSessionId() {
    return 'ai_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 8);
  }

  function esc(v) {
    return String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ── Knowledge Base (from old chat launcher) ── */
  var KB = [
    { patterns: [/contract/i, /agreement/i, /nda/i, /договор/i, /контракт/i],
      answer: 'For contract questions, VitaCoreX provides administrative contract review, document organization, and demand-letter packet preparation.\n\nYou can use our Contract Scanner tool for a free pattern-based pre-check of key clauses.\n\nFor deeper analysis, open our Contract Review Desk.',
      suggestions: ['Try Contract Scanner', 'Open structured intake', 'What services do you offer?'],
      links: [{ label: 'Contract Scanner', url: '/contracts.html' }, { label: 'Structured Intake', url: '/structured-case-intake.html' }] },
    { patterns: [/immigra/i, /visa/i, /uscis/i, /green\s*card/i, /иммигр/i, /виза/i],
      answer: 'VitaCoreX offers immigration packet organization services:\n\n\u2022 Form packet organization\n\u2022 Evidence checklist cleanup\n\u2022 Submission-readiness review\n\nWe do not provide legal advice. Use our Immigration Packet Helper for a free pre-check.',
      suggestions: ['Try Immigration Helper', 'Open structured intake'],
      links: [{ label: 'Immigration Helper', url: '/immigration-documents.html' }, { label: 'Structured Intake', url: '/structured-case-intake.html' }] },
    { patterns: [/auto\s*deal/i, /car\s*(deal|buy|purchase)/i, /dealer/i, /авто/i, /машин/i],
      answer: 'Our Auto Deal Check tool helps you verify dealer fees, add-on pricing, and financing terms before signing.\n\n\u2022 Fee threshold check (doc fee, GAP, warranty)\n\u2022 Monthly payment calculator with APR\n\u2022 Negotiation points summary',
      suggestions: ['Try Auto Deal Check', 'Open structured intake'],
      links: [{ label: 'Auto Deal Check', url: '/auto-purchase.html' }] },
    { patterns: [/toll/i, /traffic/i, /citation/i, /court/i, /florida/i, /штраф/i, /суд/i],
      answer: 'Our Florida Official Source Locator routes you to the correct government portals:\n\n\u2022 SunPass, CFX, and county toll portals\n\u2022 County clerk traffic citation portals\n\u2022 Florida Courts and PACER portals\n\nWe do not retrieve records directly \u2014 we point you to official sources.',
      suggestions: ['Start Portal Locator', 'What else can you help with?'],
      links: [{ label: 'Florida Lookup', url: '/additional-services.html' }] },
    { patterns: [/recover/i, /revenue/i, /collection/i, /debt/i, /возврат/i, /долг/i, /взыскан/i],
      answer: 'VitaCoreX provides Revenue Recovery Infrastructure \u2014 pre-agency workflow design for:\n\n\u2022 Behavioral segmentation and outreach timing\n\u2022 Payment-plan structure and autopay logic\n\u2022 Escalation control and pilot economics\n\u2022 90-day pilot with KPI dashboard\n\nThis is operating-control infrastructure, not collections.',
      suggestions: ['Learn more about recovery', 'Open structured intake'],
      links: [{ label: 'Recovery Infrastructure', url: '/revenue-recovery-workflow.html' }, { label: 'Structured Intake', url: '/structured-case-intake.html' }] },
    { patterns: [/file\s*control/i, /legal\s*file/i, /document/i, /packet/i, /документ/i, /файл/i],
      answer: 'Corporate Legal File Control helps operators prepare counsel-ready files:\n\n\u2022 Matter chronology cleanup\n\u2022 Exhibit ordering logic\n\u2022 Issue summary memo\n\u2022 Counsel-ready packet assembly\n\u2022 Structured handoff notes',
      suggestions: ['Open structured intake', 'What industries do you serve?'],
      links: [{ label: 'File Control', url: '/corporate-legal-file-control.html' }] },
    { patterns: [/service/i, /what\s*(do|can)/i, /help/i, /услуг/i, /помо[гж]/i, /чем\s*(заним|помо|можете)/i],
      answer: 'VitaCoreX provides three core service lines:\n\n1. Revenue Recovery Infrastructure \u2014 Pre-agency workflow design for cash conversion.\n\n2. Corporate Legal File Control \u2014 Chronology cleanup, packet standards, counsel-ready files.\n\n3. Structured Intake & Packet Build \u2014 Routing, first-packet cleanup, workstream identification.\n\nPlus private client tools: Contract Scanner, Immigration Helper, Auto Deal Check, and Florida Lookup.',
      suggestions: ['Revenue Recovery', 'File Control', 'Private client tools', 'Book consultation'],
      links: [{ label: 'Solutions Overview', url: '/solutions.html' }] },
    { patterns: [/price|cost|pricing|how\s*much|fee|цен|стои/i],
      answer: 'VitaCoreX offers fixed-scope or staged pricing after intake and document review. No billable-hour surprise logic for first-stage work.\n\nFor a consultation, call (888) 794-8292 or submit through Structured Intake.',
      suggestions: ['Open structured intake', 'Book consultation'],
      links: [{ label: 'Contact', url: '/contact.html' }] },
    { patterns: [/consult|call|phone|book|appointment|записа|звон|консульт/i],
      answer: 'You can reach VitaCoreX through:\n\n\u2022 Phone: (888) 794-8292 (call or text)\n\u2022 Structured Intake: for document-ready matters\n\u2022 Private Consultation: for scoping and strategic recommendations\n\nResponse window: 1\u20132 business days after a complete request.',
      suggestions: ['Open structured intake', 'Book consultation'],
      links: [{ label: 'Call Now', url: 'tel:+18887948292' }, { label: 'Contact Page', url: '/contact.html' }] },
    { patterns: [/career|job|hiring|work|hire|вакан|работ|сотрудн/i],
      answer: 'VitaCoreX is looking for disciplined candidates:\n\n\u2022 Strong and confident English required\n\u2022 Verifiable recommendations preferred\n\u2022 Preference for Russian-speaking candidates with excellent English\n\nRoles: Operations, Documentation, Intake, Translation, Admin, Client Coordination support.',
      suggestions: ['View careers page'],
      links: [{ label: 'Careers', url: '/careers.html' }] },
    { patterns: [/calendar|deadline|event|schedule|календар|дедлайн|событ/i],
      answer: 'The Deadline Calendar is a risk-first deadline tracker for legal cases, payments, hearings, and follow-ups.\n\nFeatures: AI-assisted event creation, day notes, completion tracking, and priority management.',
      suggestions: ['Open calendar', 'What else can you help with?'],
      links: [{ label: 'Open Calendar', url: '/app.html?tool=calendar' }] },
    { patterns: [/привет|здравств|добрый|hello|hi\b|hey/i],
      answer: 'Hello! Welcome to VitaCoreX. I can help with:\n\n\u2022 Revenue recovery infrastructure\n\u2022 Contract review & document organization\n\u2022 Immigration packet preparation\n\u2022 Auto deal verification\n\u2022 Legal file control\n\nWhat can I help you with today?',
      suggestions: ['What services do you offer?', 'Revenue recovery', 'Contract question', 'Book consultation'],
      links: [] },
    { patterns: [/спасибо|thanks|thank\s*you|благодар/i],
      answer: 'You\'re welcome! If you need anything else, feel free to ask. You can also reach us directly at (888) 794-8292.',
      suggestions: ['Ask another question', 'Open structured intake'],
      links: [] },
  ];

  function localAnswer(text) {
    var lower = (text || '').toLowerCase();
    for (var i = 0; i < KB.length; i++) {
      for (var j = 0; j < KB[i].patterns.length; j++) {
        if (KB[i].patterns[j].test(lower)) return KB[i];
      }
    }
    return {
      answer: 'I can help with:\n\n\u2022 Contract review \u2014 scanner, document cleanup, demand-letter packets\n\u2022 Immigration packets \u2014 form organization, evidence checklists\n\u2022 Auto deals \u2014 fee check, payment calculator\n\u2022 Revenue recovery \u2014 pre-agency workflow design\n\u2022 Legal file control \u2014 counsel-ready packet preparation\n\nAsk about any of these, or call (888) 794-8292 for direct assistance.',
      suggestions: ['Contract question', 'Immigration packet', 'What services do you offer?', 'Book consultation'],
      links: [{ label: 'Open Structured Intake', url: '/structured-case-intake.html' }, { label: 'Call (888) 794-8292', url: 'tel:+18887948292' }]
    };
  }

  /* ── Health Check ── */
  function checkBackend() {
    var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, HEALTHZ_TIMEOUT);
    fetch(API_BASE + '/healthz', { method: 'GET', signal: ctrl ? ctrl.signal : undefined })
      .then(function (r) { clearTimeout(timer); if (r.ok) state.backendReady = true; })
      .catch(function () { clearTimeout(timer); });
  }

  /* ── DOM refs ── */
  var wrap, fab, msgs, inp, sendBtn;

  function initDOM() {
    wrap = document.getElementById('vcx-ai-assistant');
    fab = document.getElementById('vcxAiFab');
    msgs = document.getElementById('vcxAiMessages');
    inp = document.getElementById('vcxAiInput');
    sendBtn = document.getElementById('vcxAiSend');
    if (!wrap || !fab || !msgs || !inp || !sendBtn) return false;
    return true;
  }

  /* ── Toggle ── */
  function setupToggle() {
    fab.addEventListener('click', function () {
      wrap.classList.toggle('vcx-ai--open');
      if (wrap.classList.contains('vcx-ai--open')) inp.focus();
    });
    document.addEventListener('mousedown', function (e) {
      if (wrap.classList.contains('vcx-ai--open') && !wrap.contains(e.target))
        wrap.classList.remove('vcx-ai--open');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && wrap.classList.contains('vcx-ai--open'))
        wrap.classList.remove('vcx-ai--open');
    });
  }

  /* ── Message rendering ── */
  function addMsg(html, type) {
    var div = document.createElement('div');
    div.className = 'vcx-ai-msg vcx-ai-msg--' + type;
    div.innerHTML = html;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    return div;
  }

  function renderBotMessage(data) {
    var text = data.answer || data.response || '';
    var html = esc(text).replace(/\n/g, '<br>');

    /* Suggestions */
    if (data.suggestions && data.suggestions.length) {
      html += '<div class="vcx-ai-suggestions">';
      data.suggestions.forEach(function (s) {
        html += '<button type="button" class="vcx-ai-suggestion" data-suggest="' + esc(s) + '">' + esc(s) + '</button>';
      });
      html += '</div>';
    }

    /* Links */
    var links = data.links || data.escalation_links;
    if (links && links.length) {
      html += '<div class="vcx-ai-links">';
      links.forEach(function (l) {
        html += '<a class="vcx-ai-link" href="' + esc(l.url) + '">' + esc(l.label) + '</a>';
      });
      html += '</div>';
    }

    var el = addMsg(html, 'bot');

    /* Suggestion click handlers */
    el.querySelectorAll('.vcx-ai-suggestion').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var q = btn.getAttribute('data-suggest');
        if (q) { inp.value = q; sendMessage(); }
      });
    });
  }

  function showTyping() {
    var div = document.createElement('div');
    div.className = 'vcx-ai-msg vcx-ai-msg--typing';
    div.id = 'vcxAiTyping';
    div.innerHTML = '<span class="vcx-ai-typing-dot"></span><span class="vcx-ai-typing-dot"></span><span class="vcx-ai-typing-dot"></span>';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function hideTyping() {
    var t = document.getElementById('vcxAiTyping');
    if (t) t.remove();
  }

  /* ── Send message ── */
  function sendMessage() {
    var text = inp.value.trim();
    if (!text || state.sending) return;
    state.sending = true;
    inp.value = '';
    inp.style.height = 'auto';
    sendBtn.disabled = true;

    addMsg(esc(text), 'user');
    showTyping();

    if (!state.sessionId) {
      state.sessionId = genSessionId();
      saveState();
    }

    var payload = {
      session_id: state.sessionId,
      message: text,
      topic: state.topic,
      state: state.jurisdiction,
      language: 'en'
    };
    var body = JSON.stringify(payload);
    var hdrs = { 'Content-Type': 'application/json' };

    function onSuccess(data) {
      hideTyping();
      state.sessionId = data.session_id || state.sessionId;
      state.mode = data.mode || null;
      if (data.topic) state.topic = data.topic;
      if (data.state) state.jurisdiction = data.state;
      saveState();
      renderBotMessage(data);
      state.sending = false;
      sendBtn.disabled = false;
    }

    function onFail(originalText) {
      hideTyping();
      var local = localAnswer(originalText);
      renderBotMessage({ answer: local.answer, suggestions: local.suggestions, links: local.links });
      state.sending = false;
      sendBtn.disabled = false;
    }

    function tryApi(url) {
      return fetch(url + '/api/legal-chat/message', { method: 'POST', headers: hdrs, body: body })
        .then(function (r) {
          if (r.status === 429) {
            hideTyping();
            renderBotMessage({
              answer: 'Too many requests. Please wait a moment and try again.',
              links: [{ label: 'Open Structured Intake', url: '/structured-case-intake.html' }]
            });
            state.sending = false;
            sendBtn.disabled = false;
            throw new Error('rate_limited');
          }
          if (!r.ok) throw new Error('HTTP ' + r.status);
          return r.json();
        });
    }

    /* Cascade: local dev API → production → KB fallback */
    if (LOCAL_API && LOCAL_API !== API_BASE) {
      tryApi(LOCAL_API).then(onSuccess).catch(function (e) {
        if (e.message === 'rate_limited') return;
        tryApi(PROD_API).then(onSuccess).catch(function (e2) {
          if (e2.message === 'rate_limited') return;
          onFail(text);
        });
      });
    } else {
      tryApi(API_BASE).then(onSuccess).catch(function (e) {
        if (e.message === 'rate_limited') return;
        onFail(text);
      });
    }
  }

  /* ── Input handling ── */
  function setupInput() {
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });
    sendBtn.addEventListener('click', sendMessage);
    inp.addEventListener('input', function () {
      inp.style.height = 'auto';
      inp.style.height = Math.min(inp.scrollHeight, 80) + 'px';
      sendBtn.disabled = !inp.value.trim();
    });
  }

  /* ── Init ── */
  function init() {
    if (!initDOM()) return;
    setupToggle();
    setupInput();
    checkBackend();
    sendBtn.disabled = true;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
