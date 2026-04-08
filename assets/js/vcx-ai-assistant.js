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

  /* ── Knowledge Base — conversational style ── */
  var KB = [
    { patterns: [/contract/i, /agreement/i, /nda/i, /договор/i, /контракт/i],
      answer: 'Sure! We handle contract review and document preparation \u2014 everything from scanning clauses for red flags to organizing demand-letter packets. What specifically do you need help with? A new contract, or reviewing an existing one?',
      suggestions: ['New contract review', 'Existing contract issue', 'What does it cost?'],
      links: [] },
    { patterns: [/immigra/i, /visa/i, /uscis/i, /green\s*card/i, /иммигр/i, /виза/i],
      answer: 'We help with immigration packet organization \u2014 sorting forms, cleaning up evidence checklists, and making sure everything is submission-ready. What type of case are you working on? Family-based, employment, or something else?',
      suggestions: ['Family petition', 'Employment visa', 'General question'],
      links: [] },
    { patterns: [/auto\s*deal/i, /car\s*(deal|buy|purchase)/i, /dealer/i, /авто/i, /машин/i],
      answer: 'Our Auto Deal Check helps you verify dealer fees and financing terms before you sign. Are you looking at a specific deal right now, or just want to understand what to watch out for?',
      suggestions: ['Check a specific deal', 'General tips'],
      links: [] },
    { patterns: [/toll/i, /traffic/i, /citation/i, /court/i, /florida/i, /штраф/i, /суд/i],
      answer: 'I can point you to the right Florida portal \u2014 tolls (SunPass, CFX), traffic citations, or court records. Which one do you need?',
      suggestions: ['Toll issue', 'Traffic citation', 'Court records'],
      links: [] },
    { patterns: [/recover/i, /revenue/i, /collection/i, /debt/i, /возврат/i, /долг/i, /взыскан/i],
      answer: 'Revenue Recovery is one of our core services. We build pre-agency infrastructure \u2014 segmentation, outreach timing, payment plans, and escalation logic. Usually starts with a 90-day pilot. Would you like to know more about how it works, or are you ready to discuss your situation?',
      suggestions: ['How does it work?', 'Book a consultation', 'What does it cost?'],
      links: [] },
    { patterns: [/file\s*control/i, /legal\s*file/i, /document/i, /packet/i, /документ/i, /файл/i],
      answer: 'Legal File Control is about getting your documents organized and counsel-ready \u2014 chronologies, exhibits, memos, the whole packet. Do you have an active case that needs organizing, or is this more of a general workflow question?',
      suggestions: ['Active case', 'General question', 'What does it cost?'],
      links: [] },
    { patterns: [/service/i, /what\s*(do|can)/i, /help/i, /услуг/i, /помо[гж]/i, /чем\s*(заним|помо|можете)/i],
      answer: 'VitaCoreX does three main things:\n\n1. Revenue Recovery \u2014 building the infrastructure to get your money back before it goes to collections.\n2. Legal File Control \u2014 organizing documents so they\'re ready for counsel.\n3. Structured Intake \u2014 routing your matter to the right workflow from day one.\n\nWe also have private tools for contracts, immigration, and auto deals. What interests you most?',
      suggestions: ['Revenue Recovery', 'File Control', 'Contract help', 'Book consultation'],
      links: [] },
    { patterns: [/price|cost|pricing|how\s*much|fee|цен|стои/i],
      answer: 'We do fixed-scope pricing \u2014 no billable-hour surprises. The exact cost depends on your situation, but we can scope it out in a quick consultation. Want me to help you set that up?',
      suggestions: ['Yes, book consultation', 'What services do you offer first?'],
      links: [] },
    { patterns: [/consult|call|phone|book|appointment|записа|звон|консульт/i],
      answer: 'Absolutely! You can reach us at (888) 794-8292 \u2014 call or text. Or if you prefer, submit your details through our intake form and we\'ll get back within 1\u20132 business days. What works better for you?',
      suggestions: ['I\'ll call', 'Open intake form'],
      links: [{ label: 'Call (888) 794-8292', url: 'tel:+18887948292' }] },
    { patterns: [/career|job|hiring|work|hire|вакан|работ|сотрудн/i],
      answer: 'We\'re hiring! Looking for organized, detail-oriented people with strong English. Russian speakers with excellent English get preference. Roles include operations, documentation, intake coordination, and admin support. Want to see the full careers page?',
      suggestions: ['View careers page', 'What are the requirements?'],
      links: [{ label: 'Careers', url: '/careers.html' }] },
    { patterns: [/calendar|deadline|event|schedule|календар|дедлайн|событ/i],
      answer: 'Our Deadline Calendar tracks important dates \u2014 hearings, payments, filing deadlines, follow-ups. It prioritizes by risk so you never miss what matters. Want to open it?',
      suggestions: ['Open calendar', 'Tell me more'],
      links: [{ label: 'Open Calendar', url: '/app/deadline-calendar/' }] },
    { patterns: [/привет|здравств|добрый/i],
      answer: '\u041f\u0440\u0438\u0432\u0435\u0442! \u0414\u043e\u0431\u0440\u043e \u043f\u043e\u0436\u0430\u043b\u043e\u0432\u0430\u0442\u044c \u0432 VitaCoreX. \u0427\u0435\u043c \u043c\u043e\u0433\u0443 \u043f\u043e\u043c\u043e\u0447\u044c? \u041c\u044b \u0437\u0430\u043d\u0438\u043c\u0430\u0435\u043c\u0441\u044f \u0432\u043e\u0437\u0432\u0440\u0430\u0442\u043e\u043c \u0434\u043e\u043b\u0433\u043e\u0432, \u043a\u043e\u043d\u0442\u0440\u0430\u043a\u0442\u0430\u043c\u0438, \u0438\u043c\u043c\u0438\u0433\u0440\u0430\u0446\u0438\u043e\u043d\u043d\u044b\u043c\u0438 \u043f\u0430\u043a\u0435\u0442\u0430\u043c\u0438 \u0438 \u043e\u0440\u0433\u0430\u043d\u0438\u0437\u0430\u0446\u0438\u0435\u0439 \u044e\u0440\u0438\u0434\u0438\u0447\u0435\u0441\u043a\u0438\u0445 \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u043e\u0432.',
      suggestions: ['\u0423\u0441\u043b\u0443\u0433\u0438', '\u041a\u043e\u043d\u0442\u0440\u0430\u043a\u0442\u044b', '\u041a\u043e\u043d\u0441\u0443\u043b\u044c\u0442\u0430\u0446\u0438\u044f'],
      links: [] },
    { patterns: [/hello|hi\b|hey/i],
      answer: 'Hey! Welcome to VitaCoreX. I\'m here to help \u2014 whether it\'s about revenue recovery, contracts, immigration packets, or anything else. What\'s on your mind?',
      suggestions: ['What do you do?', 'I have a contract question', 'Book consultation'],
      links: [] },
    { patterns: [/спасибо|thanks|thank\s*you|благодар/i],
      answer: 'Happy to help! Feel free to ask anything else, or call us directly at (888) 794-8292.',
      suggestions: ['Another question'],
      links: [] },
    { patterns: [/how\s*(are|r)\s*you|как\s*(дел|у тебя)/i],
      answer: 'Doing great, thanks for asking! Ready to help you with whatever you need. What can I do for you?',
      suggestions: ['What services do you offer?', 'Book consultation'],
      links: [] },
    { patterns: [/who\s*(are|r)\s*you|кто\s*ты/i],
      answer: 'I\'m the VitaCoreX assistant. I can answer questions about our services, help you find the right tool, or connect you with our team. We\'re a business services company based in Tampa, FL \u2014 revenue recovery, legal file organization, contract review, and more.',
      suggestions: ['What services?', 'Where are you located?', 'Book consultation'],
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
      answer: 'Good question! I\'m not sure I understood exactly what you\'re looking for. Could you tell me a bit more? I can help with contracts, immigration, revenue recovery, legal file organization, or just point you in the right direction.',
      suggestions: ['What services do you offer?', 'Contract question', 'Book consultation'],
      links: []
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
