(function () {
  if (window.__VCX_EXIT_INTENT__) return;
  window.__VCX_EXIT_INTENT__ = true;

  var STORAGE_KEY = 'vcx_exit_intent_seen';
  var SESSION_KEY = 'vcx_exit_intent_session';
  var COOL_DOWN_DAYS = 14;

  function shouldSkip() {
    if (window.sessionStorage && sessionStorage.getItem(SESSION_KEY) === '1') return true;
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      var data = JSON.parse(raw);
      if (data.status === 'converted') return true;
      if (data.status === 'dismissed' && data.ts) {
        var ageDays = (Date.now() - data.ts) / (1000 * 60 * 60 * 24);
        if (ageDays < COOL_DOWN_DAYS) return true;
      }
    } catch (e) {}
    return false;
  }

  function persist(status) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ status: status, ts: Date.now() }));
    } catch (e) {}
  }

  function injectStyles() {
    if (document.getElementById('vcx-exit-intent-styles')) return;
    var s = document.createElement('style');
    s.id = 'vcx-exit-intent-styles';
    s.textContent = [
      '.vcx-exit-backdrop{position:fixed;inset:0;background:rgba(11,31,48,.72);z-index:2147483640;display:flex;align-items:center;justify-content:center;padding:20px;animation:vcxExitFade .2s ease-out;}',
      '.vcx-exit-modal{background:#EEF6F5;color:#0B1F30;max-width:520px;width:100%;border-radius:14px;box-shadow:0 24px 60px rgba(0,0,0,.35);overflow:hidden;position:relative;animation:vcxExitRise .25s ease-out;}',
      '.vcx-exit-head{background:#1A4F4A;color:#EEF6F5;padding:20px 24px;position:relative;}',
      '.vcx-exit-head h3{margin:0 0 4px;font-size:1.15rem;font-weight:700;color:#EEF6F5 !important;line-height:1.3;}',
      '.vcx-exit-head p{margin:0;font-size:.82rem;opacity:.92;color:#EEF6F5 !important;line-height:1.45;}',
      '.vcx-exit-close{position:absolute;top:14px;right:14px;background:transparent;border:0;color:#EEF6F5;font-size:1.5rem;cursor:pointer;line-height:1;padding:4px 8px;border-radius:4px;}',
      '.vcx-exit-close:hover{background:rgba(255,255,255,.12);}',
      '.vcx-exit-body{padding:22px 24px 24px;}',
      '.vcx-exit-body p{margin:0 0 14px;font-size:.92rem;line-height:1.5;}',
      '.vcx-exit-form{display:flex;flex-direction:column;gap:10px;margin:14px 0 10px;}',
      '.vcx-exit-form input{padding:11px 14px;border:1px solid rgba(26,79,74,.28);border-radius:8px;font-size:.95rem;font-family:inherit;background:#fff;color:#0B1F30;}',
      '.vcx-exit-form input:focus{outline:none;border-color:#2D8A82;box-shadow:0 0 0 3px rgba(45,138,130,.18);}',
      '.vcx-exit-btn{background:#2D8A82;color:#fff;border:0;padding:12px 18px;font-weight:700;border-radius:8px;cursor:pointer;font-size:.92rem;letter-spacing:.02em;transition:background .15s;}',
      '.vcx-exit-btn:hover{background:#1F6B64;}',
      '.vcx-exit-btn:disabled{opacity:.6;cursor:not-allowed;}',
      '.vcx-exit-meta{font-size:.72rem;color:#5E6C7B;margin-top:10px;line-height:1.4;}',
      '.vcx-exit-success{text-align:center;padding:12px 0;}',
      '.vcx-exit-success .vcx-exit-checkmark{font-size:2rem;color:#2D8A82;margin-bottom:8px;}',
      '@keyframes vcxExitFade{from{opacity:0}to{opacity:1}}',
      '@keyframes vcxExitRise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}',
      '@media (max-width:520px){.vcx-exit-head h3{font-size:1rem}.vcx-exit-body{padding:18px 18px 20px}}'
    ].join('');
    document.head.appendChild(s);
  }

  function buildModal() {
    var wrap = document.createElement('div');
    wrap.className = 'vcx-exit-backdrop';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.setAttribute('aria-labelledby', 'vcxExitTitle');
    wrap.innerHTML =
      '<div class="vcx-exit-modal">' +
      '<div class="vcx-exit-head">' +
      '<button class="vcx-exit-close" type="button" aria-label="Close">×</button>' +
      '<h3 id="vcxExitTitle">Before you go — get the executive brief</h3>' +
      '<p>17-page CFO-level analysis: where revenue leaks, what recovery curves look like, and how to benchmark.</p>' +
      '</div>' +
      '<div class="vcx-exit-body">' +
      '<p>We send the <strong>Healthcare Revenue Leakage Brief</strong> (and three companion PDFs) plus a short follow-up sequence. No sales calls unless you ask.</p>' +
      '<form class="vcx-exit-form" novalidate>' +
      '<input type="email" name="email" placeholder="Work email" required autocomplete="email" aria-label="Work email"/>' +
      '<input type="text" name="company" placeholder="Company (optional)" autocomplete="organization" aria-label="Company"/>' +
      '<button type="submit" class="vcx-exit-btn">Send me the brief</button>' +
      '</form>' +
      '<p class="vcx-exit-meta">We process your email under our <a href="privacy-policy.html" style="color:#2D8A82">Privacy Policy</a>. Unsubscribe anytime. VitaCoreX LLC is not a law firm.</p>' +
      '</div>' +
      '</div>';
    return wrap;
  }

  function showSuccess(modal) {
    var body = modal.querySelector('.vcx-exit-body');
    body.innerHTML =
      '<div class="vcx-exit-success">' +
      '<div class="vcx-exit-checkmark">✓</div>' +
      '<h4 style="margin:0 0 6px;font-size:1.05rem;">Check your inbox.</h4>' +
      '<p style="font-size:.88rem;margin:0 0 14px;">The executive brief is on its way. You can also download directly below.</p>' +
      '<a class="vcx-exit-btn" href="assets/pdf/lead-magnet-healthcare.pdf" download style="text-decoration:none;display:inline-block;">Download PDF now</a>' +
      '</div>';
  }

  function close(wrap, reason) {
    if (!wrap || !wrap.parentNode) return;
    wrap.parentNode.removeChild(wrap);
    if (reason === 'dismiss') {
      persist('dismissed');
    }
    if (window.gtag) {
      window.gtag('event', 'exit_intent_' + (reason || 'close'));
    }
  }

  function attemptSubmit(wrap, form) {
    var email = (form.querySelector('[name=email]').value || '').trim();
    var company = (form.querySelector('[name=company]').value || '').trim();
    if (!email || email.indexOf('@') < 1) {
      form.querySelector('[name=email]').focus();
      return;
    }
    var btn = form.querySelector('.vcx-exit-btn');
    btn.disabled = true;
    btn.textContent = 'Sending…';

    var apiBase = window.VCX_API_BASE || '';
    var payload = {
      email: email,
      company: company,
      source: 'exit_intent',
      page: location.pathname,
      lead_magnet: 'healthcare-revenue-leakage-brief'
    };

    var done = function () {
      persist('converted');
      if (window.gtag) {
        window.gtag('event', 'exit_intent_submit', { source: 'exit_intent' });
      }
      showSuccess(wrap.querySelector('.vcx-exit-modal'));
    };

    if (apiBase) {
      try {
        fetch(apiBase + '/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).then(done).catch(done);
      } catch (e) { done(); }
    } else {
      done();
    }
  }

  function show() {
    if (shouldSkip()) return;
    if (document.querySelector('.vcx-exit-backdrop')) return;
    injectStyles();
    var wrap = buildModal();
    document.body.appendChild(wrap);
    try { sessionStorage.setItem(SESSION_KEY, '1'); } catch (e) {}
    if (window.gtag) window.gtag('event', 'exit_intent_shown', { page: location.pathname });

    var closeBtn = wrap.querySelector('.vcx-exit-close');
    closeBtn.addEventListener('click', function () { close(wrap, 'dismiss'); });
    wrap.addEventListener('click', function (e) {
      if (e.target === wrap) close(wrap, 'backdrop');
    });
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { close(wrap, 'dismiss'); document.removeEventListener('keydown', esc); }
    });

    var form = wrap.querySelector('form');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      attemptSubmit(wrap, form);
    });

    setTimeout(function () {
      var input = wrap.querySelector('[name=email]');
      if (input) input.focus();
    }, 120);
  }

  function bind() {
    if (shouldSkip()) return;

    var armed = false;
    var firstInteracted = false;
    var onInteract = function () { firstInteracted = true; };
    document.addEventListener('mousemove', onInteract, { once: true, passive: true });
    document.addEventListener('scroll', onInteract, { once: true, passive: true });

    setTimeout(function () { armed = true; }, 6000);

    document.addEventListener('mouseout', function (e) {
      if (!armed || !firstInteracted) return;
      if (e.relatedTarget) return;
      if (e.clientY > 0) return;
      show();
    });

    var history = 0;
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') history++;
      if (history >= 1 && armed && firstInteracted) {
        setTimeout(function () {
          if (document.visibilityState === 'visible') show();
        }, 800);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();
