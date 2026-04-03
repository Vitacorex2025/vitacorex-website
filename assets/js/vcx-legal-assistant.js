/**
 * VCX Legal Assistant — Chat UI for the public legal-topic assistant.
 * Posts to /api/legal-chat/message and /api/legal-chat/escalate.
 *
 * Phase 1: Initial chat UI with topic chips and escalation form.
 * Phase 4C: Escalation link rendering, stronger boundary UX,
 *           improved error handling, out-of-scope visual treatment.
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

  // Phase 4C: Determine if response is a boundary/escalation response
  function isBoundaryResponse(status) {
    return status === 'out_of_scope' || status === 'escalate' || status === 'no_topic';
  }

  function appendMessage(role, text, payload) {
    payload = payload || {};
    const wrapper = document.createElement('div');
    wrapper.className = 'la-message la-message-' + role;

    // Phase 4C: Add boundary class for out-of-scope / escalation responses
    if (role === 'assistant' && isBoundaryResponse(payload.status)) {
      wrapper.classList.add('la-message-boundary');
    }

    let html = '<span class="la-message-meta">' + (role === 'assistant' ? 'Assistant' : 'You') + '</span>';
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
      payload.suggestions.forEach((item) => {
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

    const payload = {
      session_id: chatState.sessionId,
      message: message,
      topic: chatState.topic,
      state: stateInput.value.trim() || null,
      language: 'en',
    };

    try {
      const res = await fetch(API_BASE + '/api/legal-chat/message', {
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

      const data = await res.json();
      chatState.sessionId = data.session_id;
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
    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const message = messageInput.value.trim();
      if (!message) return;
      await sendMessage(message);
      messageInput.value = '';
    });
  }

  if (messagesEl) {
    messagesEl.addEventListener('click', async (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      if (!target.classList.contains('suggestion-chip')) return;
      const suggestion = target.dataset.suggestion;
      if (!suggestion) return;
      await sendMessage(suggestion);
    });
  }

  topicChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      setTopic(chip.dataset.topic || null);
      const prompts = {
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
    escalationForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      leadResultEl.textContent = 'Submitting...';

      const payload = {
        session_id: chatState.sessionId,
        name: document.getElementById('leadName').value.trim(),
        email: document.getElementById('leadEmail').value.trim(),
        phone: document.getElementById('leadPhone').value.trim() || null,
        notes: document.getElementById('leadNotes').value.trim() || null,
      };

      try {
        const res = await fetch(API_BASE + '/api/legal-chat/escalate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        leadResultEl.textContent = 'Your request has been submitted. A team member will follow up shortly.';
        leadResultEl.style.color = 'var(--vcx-success,#2F6B57)';
        escalationForm.reset();
      } catch (err) {
        leadResultEl.textContent = 'Could not submit. Please try again or call (888) 794-8292.';
        leadResultEl.style.color = '#8B4348';
        console.error('[VCX Legal Assistant]', err);
      }
    });
  }

  // Phase 4C: Improved initial greeting with clear scope boundaries
  appendMessage(
    'assistant',
    'Welcome. This assistant handles four specific topics only:\n\n' +
    '1. Contracts — clause review, document checklists, signing questions\n' +
    '2. Immigration packets — form organization, evidence categories\n' +
    '3. Auto deal review — fee verification, APR check, dealer sheets\n' +
    '4. Florida official sources — toll portals, traffic citations, court records\n\n' +
    'Select a topic below or type your question. If your matter falls outside these areas, use Structured Intake for private review.',
    {
      suggestions: ['Contract question', 'Immigration packet question', 'Auto deal question', 'Florida portal question'],
      escalation_links: [
        { label: 'Open Structured Intake', url: '/structured-case-intake.html', description: 'For matters outside these four topics.' }
      ]
    }
  );
})();
