(function () {
  if (window.__VCX_ROI_CALC__) return;
  window.__VCX_ROI_CALC__ = true;

  var fmt = function (n) {
    return '$' + Math.round(n).toLocaleString('en-US');
  };

  var industryMult = {
    healthcare: { low: 0.38, high: 0.55 },
    dental: { low: 0.40, high: 0.58 },
    fleet: { low: 0.34, high: 0.50 },
    contract: { low: 0.32, high: 0.48 },
    subscription: { low: 0.42, high: 0.60 },
    other: { low: 0.33, high: 0.50 }
  };

  function agingCurve(days) {
    if (days <= 60) return 0.92;
    if (days <= 90) return 0.80;
    if (days <= 120) return 0.62;
    if (days <= 180) return 0.48;
    if (days <= 365) return 0.28;
    return 0.18;
  }

  function agencyNet(balance, days) {
    var rate = agingCurve(days) * 0.35;
    var commission = 0.40;
    return balance * rate * (1 - commission);
  }

  function compute(ar, days, industry) {
    var mult = industryMult[industry] || industryMult.other;
    var curve = agingCurve(days);
    var low = ar * mult.low * curve;
    var high = ar * mult.high * curve;
    var mid = (low + high) / 2;
    var agency = agencyNet(ar, days);
    var lift = mid - agency;
    var liftPct = agency > 0 ? ((mid / agency) - 1) * 100 : 0;

    var pilotFee = 25500;
    var roi = (mid - pilotFee) / pilotFee;

    return {
      lowRecovery: low,
      midRecovery: mid,
      highRecovery: high,
      agencyNet: agency,
      liftAbsolute: lift,
      liftPct: liftPct,
      pilotRoiX: Math.max(0, 1 + roi)
    };
  }

  function renderResult(el, r) {
    el.innerHTML =
      '<div class="roi-result-card">' +
      '<div class="roi-result-head">Projected 90-day outcome</div>' +
      '<div class="roi-result-range">' + fmt(r.lowRecovery) + ' – ' + fmt(r.highRecovery) + '</div>' +
      '<div class="roi-result-label">VitaCoreX recovery range (low–high)</div>' +
      '<div class="roi-result-grid">' +
      '<div><span class="roi-val">' + fmt(r.agencyNet) + '</span><span class="roi-meta">Net via traditional agency (after 40% commission)</span></div>' +
      '<div><span class="roi-val roi-val-accent">+' + fmt(r.liftAbsolute) + '</span><span class="roi-meta">Estimated lift vs agency placement</span></div>' +
      '<div><span class="roi-val">' + r.pilotRoiX.toFixed(1) + 'x</span><span class="roi-meta">Indicative pilot ROI (90-day)</span></div>' +
      '</div>' +
      '<p class="roi-disclaimer">Estimates use industry recovery-rate benchmarks and the aging-curve multiplier. Actual outcomes depend on workflow deployment, industry specifics, and the state of your AR at pilot start. Figures are illustrative, not guaranteed. VitaCoreX LLC is not a law firm and not a licensed collection agency.</p>' +
      '<div class="roi-result-cta"><a class="btn btn-primary" href="contact.html">Request a confidential review</a> <a class="btn btn-secondary" href="solutions.html#engagement-tiers">See engagement tiers</a></div>' +
      '</div>';
  }

  function init() {
    var form = document.getElementById('vcxRoiCalc');
    if (!form) return;
    var out = document.getElementById('vcxRoiResult');
    if (!out) return;

    function run() {
      var ar = parseFloat(form.querySelector('[name=ar]').value) || 0;
      var days = parseInt(form.querySelector('[name=days]').value, 10) || 60;
      var industry = form.querySelector('[name=industry]').value || 'other';
      if (ar <= 0) {
        out.innerHTML = '<p class="roi-hint">Enter an outstanding AR balance above $1,000 to see the estimate.</p>';
        return;
      }
      renderResult(out, compute(ar, days, industry));
      if (window.gtag) {
        window.gtag('event', 'roi_calculator_run', {
          ar_bucket: ar < 50000 ? 'under_50k' : ar < 250000 ? '50k_250k' : ar < 1000000 ? '250k_1m' : 'over_1m',
          aging_days: days,
          industry: industry
        });
      }
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      run();
    });
    form.addEventListener('input', function () {
      if (form.dataset.liveComputed === 'true') run();
    });

    var sampleBtn = form.querySelector('[data-roi-sample]');
    if (sampleBtn) {
      sampleBtn.addEventListener('click', function () {
        form.querySelector('[name=ar]').value = 500000;
        form.querySelector('[name=days]').value = 90;
        form.querySelector('[name=industry]').value = 'healthcare';
        form.dataset.liveComputed = 'true';
        run();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
