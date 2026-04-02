/**
 * VCX Intake API Client
 * Replaces FormSubmit.co for the structured-case-intake form.
 * Sends to POST /api/intakes and renders the matter result inline.
 */
(function () {
  'use strict';

  var API_BASE = window.VCX_API_BASE || '';

  /**
   * Submit the intake form via the VCX API.
   * @param {HTMLFormElement} form
   */
  async function submitIntake(form) {
    var submitBtn = form.querySelector('#intakeSubmitBtn');
    var statusEl = form.querySelector('.form-status') || form.querySelector('#intakeFormStatus');
    var resultPanel = document.getElementById('intakeResult');

    // Loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add('is-loading');
      submitBtn.textContent = 'Submitting…';
    }
    if (statusEl) statusEl.textContent = '';

    try {
      var fd = new FormData(form);
      var res = await fetch(API_BASE + '/api/intakes', {
        method: 'POST',
        body: fd,
      });

      if (!res.ok) {
        var errText = await res.text();
        throw new Error('Server error ' + res.status + ': ' + errText);
      }

      var data = await res.json();

      // Hide the form, show the result
      form.style.display = 'none';

      if (resultPanel) {
        resultPanel.style.display = 'block';
        resultPanel.innerHTML = buildResultHTML(data);
        resultPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

    } catch (err) {
      console.error('[VCX Intake]', err);
      if (statusEl) {
        statusEl.textContent =
          'Submission failed. Please email vitacorexllc@gmail.com or call (888) 794-8292.';
        statusEl.style.color = '#8B4348';
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('is-loading');
        submitBtn.textContent = 'Request structured intake';
      }
    }
  }

  /**
   * Build the post-submit result HTML.
   */
  function buildResultHTML(data) {
    var items = (data.checklist || [])
      .map(function (c) {
        var icon = c.is_complete ? '&#10004;' : '&#9744;';
        return '<li style="padding:6px 0;">' + icon + ' ' + escHTML(c.label) + '</li>';
      })
      .join('');

    return (
      '<div class="reveal" style="animation:fadeIn .4s ease">' +
      '<span class="eyebrow" style="color:var(--vcx-success,#2F6B57);">Matter Created</span>' +
      '<h2 style="margin:.4em 0 .3em;font-size:1.5rem;">Matter ' +
      escHTML(data.matter_id) +
      '</h2>' +
      '<p style="font-size:.95rem;line-height:1.6;max-width:580px;margin-bottom:16px;">' +
      escHTML(data.next_step) +
      '</p>' +
      '<div style="background:var(--vcx-bg-surface,#FBF8F3);border:1px solid rgba(15,27,45,.08);border-radius:10px;padding:20px 24px;margin-bottom:20px;">' +
      '<h3 style="font-size:.9rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;margin-bottom:12px;color:var(--vcx-brand-primary,#173A63);">Your Checklist</h3>' +
      '<ul style="list-style:none;padding:0;margin:0;">' +
      items +
      '</ul>' +
      '</div>' +
      '<div style="background:rgba(212,175,55,.06);border:1px solid rgba(212,175,55,.25);border-radius:8px;padding:16px 20px;margin-bottom:20px;">' +
      '<p style="font-size:.9rem;margin:0 0 8px;font-weight:600;">Secure Status Page</p>' +
      '<p style="font-size:.85rem;margin:0 0 10px;color:var(--vcx-ink-muted,#5E6C7B);">Bookmark this link to check your matter status and upload additional documents.</p>' +
      '<a href="' +
      escHTML(data.magic_link) +
      '" style="word-break:break-all;color:var(--vcx-brand-primary,#173A63);font-size:.85rem;">' +
      escHTML(data.magic_link) +
      '</a>' +
      '</div>' +
      '<p style="font-size:.8rem;color:var(--vcx-ink-muted,#5E6C7B);">Triage priority: ' +
      data.triage_score +
      '/100</p>' +
      '</div>'
    );
  }

  function escHTML(s) {
    var d = document.createElement('div');
    d.textContent = s || '';
    return d.innerHTML;
  }

  // Expose for site.js integration
  window.VCX_IntakeAPI = {
    submit: submitIntake,
  };
})();
