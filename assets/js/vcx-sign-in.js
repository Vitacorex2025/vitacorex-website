/**
 * VCX Sign-In Page — Request portal access link via email.
 * Posts to /api/portal/request-access, shows success/error messaging.
 *
 * Phase 4A: New file.
 */
(function () {
  'use strict';

  var API_BASE = window.VCX_API_BASE || '';
  var form = document.getElementById('vcxSignInForm');
  var emailInput = document.getElementById('vcxSignInEmail');
  var submitBtn = document.getElementById('vcxSignInBtn');
  var statusDiv = document.getElementById('vcxSignInStatus');

  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    var email = emailInput ? emailInput.value.trim() : '';
    if (!email || email.indexOf('@') === -1) {
      showStatus('error', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);
    clearStatus();

    try {
      var res = await fetch(API_BASE + '/api/portal/request-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email }),
      });

      if (res.status === 429) {
        showStatus('error', 'Too many requests. Please wait a moment and try again.');
        return;
      }
      if (res.status === 400) {
        var err400 = await res.json().catch(function () { return {}; });
        showStatus('error', err400.detail || 'Please enter a valid email address.');
        return;
      }
      if (!res.ok) {
        throw new Error('Server error ' + res.status);
      }

      var data = await res.json();

      // Show success message
      showStatus('success',
        'If this email is associated with an active matter, you will receive a secure access link shortly. Please check your inbox.'
      );

      // Dev mode: show link directly if returned (SMTP not configured)
      if (data.dev_link) {
        showDevLink(data.dev_link);
      }

      // Disable form to prevent re-submission
      if (emailInput) emailInput.disabled = true;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Link Sent';
      }

    } catch (err) {
      if (err.name === 'TypeError') {
        showStatus('error', 'Cannot reach the server. Please check your connection and try again.');
      } else {
        showStatus('error', 'Something went wrong. Please try again or call (888) 794-8292.');
      }
    } finally {
      setLoading(false);
    }
  });

  function setLoading(loading) {
    if (submitBtn && !submitBtn.disabled) {
      submitBtn.textContent = loading ? 'Sending\u2026' : 'Send Access Link';
    }
  }

  function showStatus(type, message) {
    if (!statusDiv) return;
    var color = type === 'error' ? 'var(--vcx-status-danger,#E63757)' : 'var(--vcx-success,#2F6B57)';
    var bg = type === 'error' ? 'rgba(230,55,87,.06)' : 'rgba(47,107,87,.06)';
    statusDiv.innerHTML =
      '<div style="padding:14px 20px;border-radius:8px;background:' + bg +
      ';border:1px solid ' + (type === 'error' ? 'rgba(230,55,87,.15)' : 'rgba(47,107,87,.15)') +
      ';margin-top:4px;">' +
      '<p style="margin:0;font-size:.9rem;color:' + color + ';">' + escapeHtml(message) + '</p>' +
      '</div>';
  }

  function showDevLink(link) {
    if (!statusDiv) return;
    statusDiv.innerHTML +=
      '<div style="margin-top:12px;padding:14px 20px;background:rgba(91,186,167,.06);border:1px solid rgba(91,186,167,.25);border-radius:8px;">' +
      '<p style="margin:0 0 6px;font-size:.82rem;font-weight:600;color:var(--vcx-accent-gold,#5BBAA7);">Dev Mode: SMTP not configured</p>' +
      '<a href="' + escapeHtml(link) + '" style="color:var(--vcx-brand-primary,#2E4F46);font-size:.85rem;word-break:break-all;">' + escapeHtml(link) + '</a>' +
      '</div>';
  }

  function clearStatus() {
    if (statusDiv) statusDiv.innerHTML = '';
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str || ''));
    return div.innerHTML;
  }
})();
