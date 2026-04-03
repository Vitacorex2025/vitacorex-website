/**
 * VCX Legal Assistant — Chat UI for the public assistant.
 * Posts to /api/legal-chat/message and /api/legal-chat/escalate.
 *
 * Phase 1: Initial chat UI with topic chips and escalation form.
 * Phase 4C: Escalation link rendering, stronger boundary UX,
 *           improved error handling, out-of-scope visual treatment.
 * Phase 5A: Broader conversation support, mode-aware rendering,
 *           legal-mode visual indicators, no UI redesign.
 */
(() => {
  'use strict';

  const API_BASE = window.VCX_API_BASE || '';

  const messagesEl = document.getElementById('messages');
  const chatForm = document.getElementById('chatForm');
  const escalationForm = document.getElementById('escalationForm');
  const messageInput = document.getElementById('messageInput');
  const stateInput = document.getElementById('stateInput');
  const sessionStateEl = document.getElementById('sessionState');
  const jurisdictionStateEl = document.getElementById('jurisdictionState');
  const leadResultEl = document.getElementById('leadResult');
  const topicChips = Array.from(document.querySelectorAll('.topic-chip'));

  const chatState = {
    sessionId: null,
    topic: null,
    jurisdiction: null,
    mode: null, // Phase 5A: track current mode
    escalation: null, // Phase 6A: { name, email, phone } from escalation form
  };

  function setTopic(topic) {
    chatState.topic = topic;
    topicChips.forEach((chip) => {
      chip.classList.toggle('is-active', chip.dataset.topic === topic);
    });
  }

  function esc(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  // Phase 4C + 5A: Determine if response is a boundary/escalation response
  function isBoundaryResponse(status, mode) {
    if (status === 'escalate') return true;
    if (mode === 'high_risk') return true;
    return false;
  }

  // Phase 5A: Mode badge text
  function modeBadge(mode) {
    if (mode === 'legal_information') return '<span class="la-mode-badge la-mode-legal">Legal Info</span>';
    if (mode === 'vcx_routing') return '<span class="la-mode-badge la-mode-routing">Service Guide</span>';
    if (mode === 'high_risk') return '<span class="la-mode-badge la-mode-escalate">Escalation</span>';
    return '';
  }

  function appendMessage(role, text, payload) {
    payload = payload || {};
    var wrapper = document.createElement('div');
    wrapper.className = 'la-message la-message-' + role;

    // Phase 4C: Add boundary class for escalation responses
    if (role === 'assistant' && isBoundaryResponse(payload.status, payload.mode)) {
      wrapper.classList.add('la-message-boundary');
    }

    // Phase 5A: Add mode-specific class
    if (role === 'assistant' && payload.mode) {
      wrapper.classList.add('la-mode-' + payload.mode.replace(/_/g, '-'));
    }

    var html = '<span class="la-message-meta">';
    if (role === 'assistant') {
      html += 'Assistant ' + modeBadge(payload.mode);
    } else {
      html += 'You';
    }
    html += '</span>';
    html += '<div>' + esc(text).replaceAll('\n', '<br>') + '</div>';

    // Phase 4C: Render escalation links as actionable buttons
    if (payload.escalation_links && payload.escalation_links.length) {
      html += '<div class="la-escalation-links">';
      payload.escalation_links.forEach(function (link) {
        html += '<a class="la-escalation-link" href="' + esc(link.url) + '">';
        html += '<span class="la-escalation-label">' + esc(link.label) + '</span>';
        if (link.description) {
          html += '<span class="la-escalation-desc">' + esc(link.description) + '</span>';
        }
        html += '</a>';
      });
      html += '</div>';
    }

    if (payload.suggestions && payload.suggestions.length) {
      html += '<div class="la-message-suggestions">';
      payload.suggestions.forEach(function (item) {
        html += '<button type="button" class="suggestion-chip" data-suggestion="' + esc(item) + '">' + esc(item) + '</button>';
      });
      html += '</div>';
    }

    if (payload.sources && payload.sources.length) {
      html += '<div class="la-message-sources">Sources: ' + payload.sources.map(esc).join(', ') + '</div>';
    }

    if (payload.next_step) {
      html += '<div class="la-message-sources">Next step: ' + esc(payload.next_step) + '</div>';
    }

    wrapper.innerHTML = html;
    messagesEl.appendChild(wrapper);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  async function sendMessage(message) {
    appendMessage('user', message);

    var payload = {
      session_id: chatState.sessionId,
      message: message,
      topic: chatState.topic,
      state: stateInput.value.trim() || null,
      language: 'en',
    };

    try {
      var res = await fetch(API_BASE + '/api/legal-chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // Phase 4C: Better error differentiation
      if (res.status === 429) {
        appendMessage('assistant', 'Too many requests. Please wait a moment before sending another message.', {
          status: 'rate_limited',
          escalation_links: [
            { label: 'Open Structured Intake', url: '/structured-case-intake.html', description: 'Submit your question directly instead.' }
          ]
        });
        return;
      }

      if (!res.ok) throw new Error('HTTP ' + res.status);

      var data = await res.json();
      chatState.sessionId = data.session_id;
      chatState.mode = data.mode || null; // Phase 5A: track mode
      if (data.topic) setTopic(data.topic);
      if (data.state) chatState.jurisdiction = data.state;
      sessionStateEl.textContent = chatState.sessionId || 'new';
      jurisdictionStateEl.textContent = data.state || stateInput.value.trim() || 'not set';
      appendMessage('assistant', data.answer, data);
    } catch (err) {
      appendMessage('assistant', 'The assistant is not responding. You can submit your question through Structured Intake instead.', {
        status: 'error',
        escalation_links: [
          { label: 'Open Structured Intake', url: '/structured-case-intake.html', description: 'Submit your matter for private review.' },
          { label: 'Call (888) 794-8292', url: 'tel:+18887948292', description: 'Speak with someone directly.' }
        ]
      });
      console.error('[VCX Legal Assistant]', err);
    }
  }

  if (chatForm) {
    chatForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      var message = messageInput.value.trim();
      if (!message) return;
      await sendMessage(message);
      messageInput.value = '';
    });
  }

  if (messagesEl) {
    messagesEl.addEventListener('click', async function (e) {
      var target = e.target;
      if (!(target instanceof HTMLElement)) return;
      if (!target.classList.contains('suggestion-chip')) return;
      var suggestion = target.dataset.suggestion;
      if (!suggestion) return;
      await sendMessage(suggestion);
    });
  }

  topicChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      setTopic(chip.dataset.topic || null);
      var prompts = {
        contracts: 'I have a contract question.',
        immigration_packets: 'I need help organizing an immigration packet.',
        auto_deal_review: 'I want to review an auto deal before signing.',
        florida_official_sources: 'I need the right Florida official portal.',
      };
      messageInput.value = prompts[chatState.topic] || '';
      messageInput.focus();
    });
  });

  if (escalationForm) {
    escalationForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      leadResultEl.textContent = 'Submitting...';

      var payload = {
        session_id: chatState.sessionId,
        name: document.getElementById('leadName').value.trim(),
        email: document.getElementById('leadEmail').value.trim(),
        phone: document.getElementById('leadPhone').value.trim() || null,
        notes: document.getElementById('leadNotes').value.trim() || null,
      };

      try {
        var res = await fetch(API_BASE + '/api/legal-chat/escalate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        var data = await res.json();
        leadResultEl.textContent = 'Your request has been submitted. A team member will follow up shortly.';
        leadResultEl.style.color = 'var(--vcx-success,#2F6B57)';

        // Phase 6A: Store escalation data and show intake CTA
        chatState.escalation = { name: payload.name, email: payload.email, phone: payload.phone };
        _showIntakeCTA();

        escalationForm.reset();
      } catch (err) {
        leadResultEl.textContent = 'Could not submit. Please try again or call (888) 794-8292.';
        leadResultEl.style.color = '#8B4348';
        console.error('[VCX Legal Assistant]', err);
      }
    });
  }

  // ── Phase 6A+6B: Convert-to-Intake helpers ─────────────────────────

  function _showIntakeCTA() {
    if (document.getElementById('vcx-intake-cta')) return;

    // Phase 6B: Richer CTA with context about what was detected
    var detectedParts = [];
    if (chatState.topic) {
      var topicLabels = {
        contracts: 'Contract Review', immigration_packets: 'Immigration Packet',
        auto_deal_review: 'Auto Deal Review', florida_official_sources: 'Florida Portal'
      };
      detectedParts.push(topicLabels[chatState.topic] || chatState.topic);
    }
    if (chatState.jurisdiction) detectedParts.push(chatState.jurisdiction);

    var detectedLine = detectedParts.length
      ? '<span class="la-intake-cta-detected">Detected: ' + esc(detectedParts.join(' \u00b7 ')) + '</span>'
      : '';

    var cta = document.createElement('div');
    cta.id = 'vcx-intake-cta';
    cta.className = 'la-intake-cta';
    cta.innerHTML =
      '<p class="la-intake-cta-text">' +
      'Ready to move forward? Convert this conversation into a structured intake.' +
      '</p>' +
      detectedLine +
      '<div class="la-intake-cta-steps">' +
      '<span>1. Review prefilled details</span>' +
      '<span>2. Upload any documents</span>' +
      '<span>3. Submit for advisor review</span>' +
      '</div>' +
      '<button type="button" class="la-intake-cta-btn" id="convertToIntakeBtn">' +
      'Continue to Structured Intake</button>';

    if (leadResultEl && leadResultEl.parentNode) {
      leadResultEl.parentNode.insertBefore(cta, leadResultEl.nextSibling);
    }

    var btn = document.getElementById('convertToIntakeBtn');
    if (btn) btn.addEventListener('click', _convertToIntake);
  }

  async function _convertToIntake() {
    var btn = document.getElementById('convertToIntakeBtn');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Preparing intake\u2026';
    }

    var payload = {
      session_id: chatState.sessionId,
      name: chatState.escalation ? chatState.escalation.name : null,
      email: chatState.escalation ? chatState.escalation.email : null,
      phone: chatState.escalation ? chatState.escalation.phone : null,
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
      }
    } catch (err) {
      console.error('[VCX Legal Assistant] Convert to intake failed:', err);
      // Fallback: redirect with whatever data we have client-side
      var params = new URLSearchParams();
      params.set('vcx_from', 'chat');
      if (chatState.sessionId) params.set('vcx_session', chatState.sessionId);
      if (chatState.escalation) {
        if (chatState.escalation.name) params.set('vcx_name', chatState.escalation.name);
        if (chatState.escalation.email) params.set('vcx_email', chatState.escalation.email);
        if (chatState.escalation.phone) params.set('vcx_phone', chatState.escalation.phone);
      }
      if (chatState.topic) params.set('vcx_topic', chatState.topic);
      if (chatState.jurisdiction) params.set('vcx_state', chatState.jurisdiction);
      window.location.href = '/structured-case-intake.html?' + params.toString();
    }
  }

  // Phase 5A: Broader greeting — assistant can handle any topic
  appendMessage(
    'assistant',
    'Welcome to the VitaCoreX assistant. I can help with:\n\n' +
    '- Legal topics: contracts, immigration packets, auto deals, Florida portals\n' +
    '- VitaCoreX services: intake, contract review, recovery pilot, client portal\n' +
    '- General questions and conversation\n\n' +
    'For legal topics, I provide structured information, issue spotting, and preparation checklists. ' +
    'I do not provide legal advice or representation.\n\n' +
    'Select a topic below or type your question.',
    {
      mode: 'general_chat',
      suggestions: [
        'I have a legal question',
        'Tell me about VitaCoreX services',
        'Contract review question',
        'Immigration packet question',
        'Auto deal question',
        'Florida portal question'
      ],
      escalation_links: [
        { label: 'Open Structured Intake', url: '/structured-case-intake.html', description: 'For matters requiring private advisor review.' }
      ]
    }
  );
})();
