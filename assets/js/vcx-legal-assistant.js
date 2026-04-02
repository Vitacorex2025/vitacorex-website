/**
 * VCX Legal Assistant — Chat UI for the public legal-topic assistant.
 * Posts to /api/legal-chat/message and /api/legal-chat/escalate.
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

  function appendMessage(role, text, payload) {
    payload = payload || {};
    const wrapper = document.createElement('div');
    wrapper.className = 'la-message la-message-' + role;

    let html = '<span class="la-message-meta">' + (role === 'assistant' ? 'Assistant' : 'You') + '</span>';
    html += '<div>' + esc(text).replaceAll('\n', '<br>') + '</div>';

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

      if (!res.ok) throw new Error('HTTP ' + res.status);

      const data = await res.json();
      chatState.sessionId = data.session_id;
      if (data.topic) setTopic(data.topic);
      if (data.state) chatState.jurisdiction = data.state;
      sessionStateEl.textContent = chatState.sessionId || 'new';
      jurisdictionStateEl.textContent = data.state || stateInput.value.trim() || 'not set';
      appendMessage('assistant', data.answer, data);
    } catch (err) {
      appendMessage('assistant', 'The assistant API is not responding. Please try again or use structured intake.', {});
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

  // Initial greeting
  appendMessage(
    'assistant',
    'Tell me which area you need: contracts, immigration packet organization, auto deal review, or Florida official-source routing.',
    { suggestions: ['Contract question', 'Immigration packet question', 'Auto deal question', 'Florida portal question'] }
  );
})();
