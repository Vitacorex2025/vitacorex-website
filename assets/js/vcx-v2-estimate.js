/* VitaCoreX full-cost estimator (court name change).
   Our fee comes from the catalog price; every government or provider fee is a separate row
   with its payee, so nothing is folded into the service fee. Data: catalog service.third_party_fees. */
(function () {
  'use strict';
  function ready(fn) { if (window.VX && window.VX.ready) window.VX.ready.then(fn); else document.addEventListener('vx:ready', fn); }

  function init() {
    document.querySelectorAll('[data-vx-estimate]').forEach(function (root) {
      var id = root.getAttribute('data-vx-estimate'), s = VX.svc(id);
      if (!s || !s.third_party_fees) return;
      var F = s.third_party_fees, q = function (k) { return root.querySelector('[data-est="' + k + '"]'); };
      var county = q('county'), rows = q('rows'), total = q('total'), out = q('copies'), payNote = q('paynote');
      var copies = F.default_copies || 3;

      function range(min, max) { return min === max ? VX.money(min) : VX.money(min) + '–' + VX.money(max); }
      function fillCounties() {
        var keep = county.value || F.counties[0].id;
        county.innerHTML = F.counties.map(function (c) {
          var label = c.name ? c.name : VX.t('nc.est.county_other');
          return '<option value="' + c.id + '">' + VX.esc(label) + '</option>';
        }).join('');
        county.value = keep;
      }
      function row(item, payee, amount, muted) {
        return '<tr' + (muted ? ' class="is-muted"' : '') + '><th scope="row">' + VX.esc(item) + '</th><td>' + VX.esc(payee) + '</td><td class="vx-est__num">' + VX.esc(amount) + '</td></tr>';
      }
      function render() {
        var c = F.counties.filter(function (x) { return x.id === county.value; })[0] || F.counties[0];
        var restore = (root.querySelector('input[name="est-case"]:checked') || {}).value === 'restore';
        var fee = s.price.amount_cents, min = fee, max = fee, html = '';
        html += row(VX.t('nc.est.r_ours'), 'VitaCoreX', VX.money(fee));
        var fmin = c.filing_cents != null ? c.filing_cents : c.filing_min_cents, fmax = c.filing_cents != null ? c.filing_cents : c.filing_max_cents;
        var famount = range(fmin, fmax); if (!c.verified && fmin === fmax) famount = VX.t('nc.est.about', { amount: famount });
        html += row(VX.t('nc.est.r_filing'), VX.t('nc.est.p_clerk'), famount); min += fmin; max += fmax;
        if (restore) {
          html += row(VX.t('nc.est.r_both'), VX.t('nc.est.p_fdle'), VX.t('nc.est.not_needed'), true);
        } else {
          html += row(VX.t('nc.est.r_check'), VX.t('nc.est.p_fdle'), VX.money(F.background_check_cents)); min += F.background_check_cents; max += F.background_check_cents;
          html += row(VX.t('nc.est.r_prints'), VX.t('nc.est.p_vendor'), range(F.fingerprint_service_min_cents, F.fingerprint_service_max_cents));
          min += F.fingerprint_service_min_cents; max += F.fingerprint_service_max_cents;
        }
        var cc = F.certified_copy_cents * copies;
        html += row(VX.t('nc.est.r_copies', { n: copies }), VX.t('nc.est.p_clerk'), VX.money(cc)); min += cc; max += cc;
        rows.innerHTML = html;
        total.textContent = VX.t('nc.est.about', { amount: range(min, max) });
        if (out) out.textContent = String(copies);
        if (payNote) payNote.textContent = VX.t('nc.est.paynote', { ours: VX.money(fee), rest: range(min - fee, max - fee) });
        var minus = q('minus'), plus = q('plus');
        if (minus) minus.disabled = copies <= 1; if (plus) plus.disabled = copies >= 10;
      }
      county.addEventListener('change', render);
      root.querySelectorAll('input[name="est-case"]').forEach(function (r) { r.addEventListener('change', render); });
      var minus = q('minus'), plus = q('plus');
      if (minus) minus.addEventListener('click', function () { if (copies > 1) { copies--; render(); } });
      if (plus) plus.addEventListener('click', function () { if (copies < 10) { copies++; render(); } });
      document.addEventListener('vx:lang', function () { fillCounties(); render(); });
      fillCounties(); render(); root.classList.add('is-ready');
    });
  }
  ready(init);
})();
