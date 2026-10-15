/* VitaCoreX v2 page helpers: translation estimate (catalog arithmetic, display only — the
   server recomputes every payable amount), order status after checkout, quote acceptance. */
(function () {
  'use strict';
  function ready(fn) { if (window.VX && window.VX.ready) window.VX.ready.then(fn); else document.addEventListener('vx:ready', fn); }
  var $ = function (id) { return document.getElementById(id); };
  function E(s) { return window.VX.esc(s); }

  /* ---------- translation estimate ---------- */
  function initEstimate() {
    var form = $('vx-tr-est'); if (!form) return;
    form.addEventListener('submit', function (e) { e.preventDefault(); });
    var words = $('est-words'), out = $('est-out'), basis = $('est-basis');
    function calc() {
      var kind = (form.querySelector('input[name="est-kind"]:checked') || {}).value || 'translation_certified';
      var s = VX.svc(kind), p = s.price, n = Math.max(1, Math.floor(Number(words.value) || 0)), cents, note;
      if (p.display === 'per_unit') {
        var units = Math.max(p.minimum_units || 1, Math.ceil(n / (p.unit_words || 250)));
        cents = units * p.amount_cents;
        note = VX.t('tr.est.basis_units', { units: units, words: p.unit_words, amount: VX.money(p.amount_cents) });
      } else {
        cents = Math.max(p.minimum_cents || 0, Math.round(n * p.amount_cents));
        note = VX.t('tr.est.basis_words', { amount: VX.money(p.amount_cents), min: VX.money(p.minimum_cents || 0) });
      }
      out.textContent = VX.money(cents);
      basis.textContent = note + ' ' + VX.t('tr.est.not_final');
    }
    form.addEventListener('input', calc); form.addEventListener('change', calc);
    document.addEventListener('vx:lang', calc); calc();
  }

  /* ---------- order status (return from checkout) ---------- */
  function initStatus() {
    var box = $('vx-status'); if (!box) return;
    var q = new URLSearchParams(location.search), r = q.get('r'), tok = q.get('t'), cancelled = q.get('c') === '1';
    if (!r || !tok) { try { var l = JSON.parse(sessionStorage.getItem('vx_last_request') || '{}'); r = r || l.r; tok = tok || l.t; } catch (e) { /* ignore */ } }
    if (!r || !tok) { render({ missing: true }); return; }
    /* drop the access token from the address bar (it is a bearer secret) but keep it for this tab */
    try { sessionStorage.setItem('vx_last_request', JSON.stringify({ r: r, t: tok })); history.replaceState(null, '', location.pathname + (cancelled ? '?c=1' : '')); } catch (e) { /* ignore */ }
    var tries = 0, last = null;
    function poll() {
      fetch(VX.apiBase() + '/api/v2/requests/' + encodeURIComponent(r) + '?t=' + encodeURIComponent(tok))
        .then(function (res) { if (!res.ok) throw new Error(String(res.status)); return res.json(); })
        .then(function (d) {
          last = d; render(d);
          var pending = d.payment_status === 'PENDING' || d.payment_status === 'PROCESSING';
          if (pending && !cancelled && ++tries < 20) setTimeout(poll, tries < 5 ? 1500 : 4000);
        })
        .catch(function () { render({ error: true }); });
    }
    function render(d) {
      var t = VX.t, h = '';
      if (d.missing) { box.innerHTML = '<div class="vx-alert vx-alert--warn"><h2>' + E(t('st.missing_title')) + '</h2><p>' + E(t('st.missing_text')) + '</p></div>'; return; }
      if (d.error) { box.innerHTML = '<div class="vx-alert vx-alert--err"><h2>' + E(t('st.error_title')) + '</h2><p>' + E(t('st.error_text')) + '</p></div>'; return; }
      var s = VX.svc(d.service_id) || { name: { en: d.service_id }, action: '' };
      var ps = d.payment_status, cls = 'vx-alert--info', title = t('st.pay.' + ps) || ps, text = t('st.pay_text.' + ps) || '';
      if (ps === 'PAID') cls = 'vx-alert--ok';
      else if (ps === 'FAILED' || ps === 'EXPIRED') cls = 'vx-alert--err';
      else if (cancelled) { cls = 'vx-alert--warn'; title = t('st.cancelled'); text = t('st.cancelled_text'); }
      h += '<div class="vx-alert ' + cls + '" role="status"><h2>' + E(title) + '</h2><p>' + E(text) + '</p></div>';
      h += '<div class="vx-receipt"><dl><dt>' + E(t('status.ref_label')) + '</dt><dd class="vx-ref">' + E(d.request_id) + '</dd>' +
        '<dt>' + E(t('form.service')) + '</dt><dd>' + E(VX.loc(s.name)) + '</dd>' +
        (d.amount_cents ? '<dt>' + E(t('st.amount')) + '</dt><dd>' + E(VX.money(d.amount_cents)) + '</dd>' : '') +
        '<dt>' + E(t('status.payment_label')) + '</dt><dd>' + E(t('st.pay.' + ps) || ps) + '</dd></dl>';
      if (ps === 'PAID' && s.action === 'book_pay') h += '<div class="vx-pay"><p>' + E(t('st.book_text')) + '</p><a class="vx-btn vx-btn--accent vx-btn--lg" href="https://calendly.com/vitacorex2025/30min" target="_blank" rel="noopener">' + E(t('st.book_btn')) + '</a><p class="vx-hint">' + E(t('st.book_hint')) + '</p></div>';
      if (ps !== 'PAID' && (cancelled || ps === 'FAILED' || ps === 'EXPIRED')) h += '<div class="vx-pay"><a class="vx-btn vx-btn--line" href="/request.html?service=' + encodeURIComponent(d.service_id) + '">' + E(t('st.retry')) + '</a></div>';
      h += '</div>';
      box.innerHTML = h;
    }
    document.addEventListener('vx:lang', function () { if (last) render(last); });
    poll();
  }

  /* ---------- quote view / acceptance ---------- */
  function initQuote() {
    var box = $('vx-quote'); if (!box) return;
    var q = new URLSearchParams(location.search), id = q.get('q'), tok = q.get('t'), data = null;
    if (!id || !tok) { box.innerHTML = '<div class="vx-alert vx-alert--warn"><p>' + E(VX.t('qt.missing')) + '</p></div>'; return; }
    function load() {
      fetch(VX.apiBase() + '/api/v2/quotes/' + encodeURIComponent(id) + '?t=' + encodeURIComponent(tok))
        .then(function (r) { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
        .then(function (d) { data = d; render(); })
        .catch(function () { box.innerHTML = '<div class="vx-alert vx-alert--err"><p>' + E(VX.t('st.error_text')) + '</p></div>'; });
    }
    function render() {
      var d = data, t = VX.t, s = VX.svc(d.service_id) || { name: { en: d.service_id } };
      var expired = d.status === 'EXPIRED' || (d.expires_at && Date.parse(d.expires_at) < Date.now());
      var h = '<div class="vx-receipt"><p class="vx-eyebrow">' + E(t('qt.eyebrow')) + '</p><h2 class="vx-h2">' + E(VX.loc(s.name)) + '</h2><dl>' +
        '<dt>' + E(t('status.ref_label')) + '</dt><dd class="vx-ref">' + E(d.request_id) + '</dd>' +
        '<dt>' + E(t('qt.number')) + '</dt><dd>' + E(d.quote_id) + ' · ' + E(t('qt.revision', { n: d.revision })) + '</dd>' +
        '<dt>' + E(t('qt.amount')) + '</dt><dd>' + E(VX.money(d.amount_cents)) + '</dd>' +
        (d.scope_text ? '<dt>' + E(t('scope.included')) + '</dt><dd>' + E(d.scope_text) + '</dd>' : '') +
        (d.external_costs_text ? '<dt>' + E(t('scope.extra')) + '</dt><dd>' + E(d.external_costs_text) + '</dd>' : '') +
        '<dt>' + E(t('qt.valid_until')) + '</dt><dd>' + E(d.expires_at ? new Date(d.expires_at).toLocaleDateString(VX.lang()) : '—') + '</dd></dl>';
      if (expired) h += '<div class="vx-alert vx-alert--err"><p>' + E(t('err.quote_expired')) + '</p></div>';
      else if (d.status === 'PAID') h += '<div class="vx-alert vx-alert--ok"><p>' + E(t('st.pay.PAID')) + '</p></div>';
      else h += '<div class="vx-pay"><label class="vx-check"><input type="checkbox" id="qt-ok"> <span>' + E(t('qt.accept_check')) + '</span></label><button class="vx-btn vx-btn--accent vx-btn--lg" id="qt-pay" type="button" disabled>' + E(t('qt.accept_btn', { amount: VX.money(d.amount_cents) })) + '</button><p class="vx-hint">' + E(t('status.pay_hint')) + '</p></div>';
      h += '</div>';
      box.innerHTML = h;
      var ok = $('qt-ok'), pay = $('qt-pay');
      if (ok) { ok.addEventListener('change', function () { pay.disabled = !ok.checked; }); pay.addEventListener('click', accept); }
    }
    function accept() {
      var pay = $('qt-pay'); pay.disabled = true;
      var key = null; try { key = sessionStorage.getItem('vx_qt_idem_' + id); } catch (e) { /* ignore */ }
      if (!key) { key = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + Math.random(); try { sessionStorage.setItem('vx_qt_idem_' + id, key); } catch (e) { /* ignore */ } }
      fetch(VX.apiBase() + '/api/v2/quotes/' + encodeURIComponent(id) + '/accept', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ access_token: tok }) })
        .then(function (r) { return r.json().then(function (j) { return { s: r.status, b: j }; }); })
        .then(function (x) {
          if (x.s >= 300) throw x;
          return fetch(VX.apiBase() + '/api/v2/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ request_id: data.request_id, access_token: tok, idempotency_key: key, quote_id: id }) });
        })
        .then(function (r) { return r.json().then(function (j) { return { s: r.status, b: j }; }); })
        .then(function (x) { if (x.s < 300 && /^https?:\/\//.test(x.b.checkout_url || '')) location.href = x.b.checkout_url; else throw x; })
        .catch(function (x) {
          pay.disabled = false;
          var code = x && x.b && x.b.error;
          var p = document.createElement('p'); p.className = 'vx-field__err'; p.setAttribute('role', 'alert');
          p.textContent = VX.t(code === 'quote_expired' ? 'err.quote_expired' : 'err.network'); pay.parentNode.appendChild(p);
        });
    }
    document.addEventListener('vx:lang', function () { if (data) render(); });
    load();
  }

  ready(function () { initEstimate(); initStatus(); initQuote(); });
})();
