/* ==========================================================
   VCX Recovery Pilot  --  vcx-recovery-pilot.js
   Multi-step wizard wired to /api/recovery endpoints.
   Phase 3: Full 5-step wizard with API integration.
   ========================================================== */
(function () {
  'use strict';

  var API_BASE = window.VCX_API_BASE || '';

  // --- Wizard state ----------------------------------------
  var state = {
    step: 1,
    totalSteps: 5,
    pilotId: null,
    data: {}
  };

  // --- DOM refs (match HTML data-panel / data-step) --------
  var wizardContainer = document.getElementById('vcxPilotWizard');
  var resultsPanel    = document.getElementById('vcxPilotResults');
  var analysisPanel   = document.getElementById('vcxAnalysisResults');
  var briefPanel      = document.getElementById('vcxBriefResults');

  function getPanels() {
    if (!wizardContainer) return [];
    return wizardContainer.querySelectorAll('.vcx-wizard-panel');
  }

  function getStepIndicators() {
    if (!wizardContainer) return [];
    return wizardContainer.querySelectorAll('.vcx-step');
  }

  // --- Show a specific step --------------------------------
  function showStep(n) {
    if (n < 1 || n > state.totalSteps) return;
    state.step = n;

    var panels = getPanels();
    for (var i = 0; i < panels.length; i++) {
      var panelNum = parseInt(panels[i].getAttribute('data-panel'), 10);
      panels[i].style.display = (panelNum === n) ? 'block' : 'none';
    }

    var indicators = getStepIndicators();
    for (var j = 0; j < indicators.length; j++) {
      var stepNum = parseInt(indicators[j].getAttribute('data-step'), 10);
      if (stepNum === n) {
        indicators[j].style.background = 'var(--vcx-brand-primary,#2E4F46)';
        indicators[j].style.color = '#fff';
      } else if (stepNum < n) {
        indicators[j].style.background = 'var(--vcx-accent-gold,#5BBAA7)';
        indicators[j].style.color = '#fff';
      } else {
        indicators[j].style.background = 'rgba(26,47,42,.06)';
        indicators[j].style.color = 'var(--vcx-ink-muted,#7BAE9E)';
      }
    }
  }

  // --- Validate current step fields ------------------------
  function validateCurrentStep() {
    var panels = getPanels();
    var currentPanel = null;
    for (var i = 0; i < panels.length; i++) {
      if (parseInt(panels[i].getAttribute('data-panel'), 10) === state.step) {
        currentPanel = panels[i];
        break;
      }
    }
    if (!currentPanel) return true;

    var fields = currentPanel.querySelectorAll('[required]');
    for (var j = 0; j < fields.length; j++) {
      if (!fields[j].value || !fields[j].value.trim()) {
        fields[j].focus();
        fields[j].style.borderColor = 'var(--vcx-status-danger,#E63757)';
        setTimeout(function(f) { f.style.borderColor = ''; }.bind(null, fields[j]), 2000);
        return false;
      }
    }
    return true;
  }

  // --- Collect fields from current step --------------------
  function collectStepData() {
    var panels = getPanels();
    var currentPanel = null;
    for (var i = 0; i < panels.length; i++) {
      if (parseInt(panels[i].getAttribute('data-panel'), 10) === state.step) {
        currentPanel = panels[i];
        break;
      }
    }
    if (!currentPanel) return;

    var inputs = currentPanel.querySelectorAll('input, select, textarea');
    for (var j = 0; j < inputs.length; j++) {
      var name = inputs[j].name || inputs[j].id;
      if (name && inputs[j].value) {
        state.data[name] = inputs[j].value;
      }
    }
  }

  // --- Create pilot (Step 1 -> 2) --------------------------
  function createPilot() {
    return fetch(API_BASE + '/api/recovery/pilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company_name: state.data.company_name || '',
        industry: state.data.industry || '',
        employee_count: parseInt(state.data.employee_count, 10) || 0,
        annual_revenue: parseFloat(state.data.annual_revenue) || 0
      })
    })
    .then(function (res) {
      if (!res.ok) throw new Error('Server returned ' + res.status);
      return res.json();
    })
    .then(function (data) {
      state.pilotId = data.pilot_id || null;
      return data;
    });
  }

  // --- Update pilot (PATCH for steps 2-5) ------------------
  function updatePilot(targetStep) {
    if (!state.pilotId) {
      return Promise.reject(new Error('No pilot ID. Please start from Step 1.'));
    }

    return fetch(API_BASE + '/api/recovery/pilot/' + state.pilotId, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wizard_step: targetStep,
        baseline_data: state.data
      })
    })
    .then(function (res) {
      if (!res.ok) throw new Error('Server returned ' + res.status);
      return res.json();
    });
  }

  // --- Get pilot detail (for analysis + brief) -------------
  function getPilotDetail() {
    if (!state.pilotId) {
      return Promise.reject(new Error('No pilot ID.'));
    }

    return fetch(API_BASE + '/api/recovery/pilot/' + state.pilotId)
    .then(function (res) {
      if (!res.ok) throw new Error('Server returned ' + res.status);
      return res.json();
    });
  }

  // --- Generate brief --------------------------------------
  function generateBrief() {
    if (!state.pilotId) {
      return Promise.reject(new Error('No pilot ID.'));
    }

    return fetch(API_BASE + '/api/recovery/pilot/' + state.pilotId + '/brief', {
      method: 'POST'
    })
    .then(function (res) {
      if (!res.ok) throw new Error('Server returned ' + res.status);
      return res.json();
    });
  }

  // --- Navigate to next step -------------------------------
  function goNext(targetStep) {
    if (!validateCurrentStep()) return;
    collectStepData();

    // Step 1 -> 2: create the pilot
    if (state.step === 1 && !state.pilotId) {
      createPilot()
        .then(function () { showStep(targetStep); })
        .catch(function (err) { showStepError(err.message); });
      return;
    }

    // Step 3 -> 4: update with all data, trigger analysis
    if (targetStep === 4) {
      updatePilot(4)
        .then(function () {
          showStep(4);
          loadAnalysis();
        })
        .catch(function (err) { showStepError(err.message); });
      return;
    }

    // Step 4 -> 5: generate brief
    if (targetStep === 5) {
      generateBrief()
        .then(function (data) {
          showStep(5);
          renderBrief(data.brief || {});
        })
        .catch(function (err) { showStepError(err.message); });
      return;
    }

    // Steps 2 -> 3: just update + navigate
    if (state.pilotId) {
      updatePilot(targetStep)
        .then(function () { showStep(targetStep); })
        .catch(function (err) { showStepError(err.message); });
    } else {
      showStep(targetStep);
    }
  }

  // --- Load analysis results (Step 4) ----------------------
  function loadAnalysis() {
    if (!analysisPanel) return;
    analysisPanel.innerHTML = '<p style="font-size:.9rem;color:var(--vcx-ink-muted,#7BAE9E);">Computing analysis...</p>';

    getPilotDetail()
      .then(function (data) {
        renderAnalysis(data.analysis_data || null, data.baseline_data || {});
      })
      .catch(function (err) {
        analysisPanel.innerHTML = '<p style="color:var(--vcx-status-danger,#E63757);">Analysis failed: ' + escapeHtml(err.message) + '</p>';
      });
  }

  // --- Render analysis results -----------------------------
  function renderAnalysis(analysis, baseline) {
    if (!analysisPanel) return;

    if (!analysis || !analysis.baseline) {
      analysisPanel.innerHTML = '<p>No analysis data available. Ensure all fields are filled in.</p>';
      return;
    }

    var b = analysis.baseline;
    var p = analysis.projections || {};
    var html = '';

    // Baseline KPIs
    html += '<h3 style="font-size:1rem;margin:0 0 16px;color:var(--vcx-brand-primary,#2E4F46);">Current Baseline KPIs</h3>';
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:28px;">';
    html += kpiCard('AR Outstanding', '$' + formatNum(b.ar_outstanding));
    html += kpiCard('AR Over 90 Days', '$' + formatNum(b.ar_over_90));
    html += kpiCard('AR Ratio', b.ar_ratio_pct + '%');
    html += kpiCard('Aging Severity', b.aging_severity_pct + '%');
    html += kpiCard('Current DSO', b.avg_dso + ' days');
    html += kpiCard('Recovery Rate', b.current_recovery_rate_pct + '%');
    html += kpiCard('Collection Cost', b.collection_cost_pct + '%');
    html += kpiCard('Net Recovery', b.net_recovery_pct + '%');
    html += kpiCard('Annual Leakage', '$' + formatNum(b.annual_leakage_estimate));
    html += '</div>';

    // Projections
    html += '<h3 style="font-size:1rem;margin:0 0 16px;color:var(--vcx-brand-primary,#2E4F46);">Recovery Projections</h3>';
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-bottom:16px;">';

    var scenarios = ['conservative', 'moderate', 'aggressive'];
    var labels = { conservative: 'Conservative', moderate: 'Moderate', aggressive: 'Aggressive' };
    var colors = { conservative: '#7BAE9E', moderate: '#2E4F46', aggressive: '#5BBAA7' };

    for (var i = 0; i < scenarios.length; i++) {
      var key = scenarios[i];
      var s = p[key];
      if (!s) continue;
      html += '<div style="background:rgba(26,47,42,.03);border:1px solid rgba(26,47,42,.08);border-radius:8px;padding:16px;">';
      html += '<h4 style="font-size:.9rem;margin:0 0 10px;color:' + colors[key] + ';">' + labels[key] + '</h4>';
      html += '<div style="font-size:.82rem;line-height:1.7;color:var(--vcx-ink-body,#243D36);">';
      html += 'Recovery Rate: <strong>' + s.new_recovery_rate_pct + '%</strong><br/>';
      html += 'New DSO: <strong>' + s.new_dso + ' days</strong><br/>';
      html += 'Collection Cost: <strong>' + s.new_cost_pct + '%</strong><br/>';
      html += 'Incremental Recovery: <strong>$' + formatNum(s.incremental_recovery) + '</strong><br/>';
      html += 'Net Annual Benefit: <strong>$' + formatNum(s.net_annual_benefit) + '</strong><br/>';
      html += 'DSO Cash Freed: <strong>$' + formatNum(s.dso_cash_freed) + '</strong><br/>';
      html += '<span style="font-weight:700;color:var(--vcx-brand-primary,#2E4F46);">Total Year 1 Impact: $' + formatNum(s.total_first_year_impact) + '</span>';
      html += '</div></div>';
    }
    html += '</div>';

    html += '<p style="font-size:.78rem;color:var(--vcx-ink-muted,#7BAE9E);margin-top:12px;">These projections are estimates based on the data you provided. Actual results may vary. This does not constitute financial advice.</p>';

    analysisPanel.innerHTML = html;
  }

  // --- Render executive brief ------------------------------
  function renderBrief(brief) {
    if (!briefPanel) return;

    if (!brief || !brief.baseline_kpis) {
      briefPanel.innerHTML = '<p>Brief data not available. Please complete the analysis step first.</p>';
      return;
    }

    var company = brief.company || {};
    var outline = brief.pilot_outline || {};
    var phases = outline.phases || [];
    var targets = outline.target_kpis || {};
    var html = '';

    // Company header
    html += '<div style="background:var(--vcx-brand-primary,#2E4F46);color:#fff;border-radius:8px;padding:20px 24px;margin-bottom:24px;">';
    html += '<h3 style="font-size:1.1rem;margin:0 0 4px;">Recovery Pilot Brief</h3>';
    html += '<p style="font-size:.9rem;margin:0;opacity:.85;">' + escapeHtml(company.name || 'Your Company') + '</p>';
    if (company.industry) html += '<p style="font-size:.82rem;margin:4px 0 0;opacity:.7;">' + escapeHtml(company.industry) + '</p>';
    html += '</div>';

    // Pilot overview
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:24px;">';
    html += kpiCard('Priority', (outline.priority || 'standard').toUpperCase());
    html += kpiCard('Duration', (outline.recommended_duration_weeks || 8) + ' weeks');
    if (targets.recovery_rate_improvement) html += kpiCard('Rate Target', targets.recovery_rate_improvement);
    if (targets.dso_reduction) html += kpiCard('DSO Target', targets.dso_reduction);
    if (targets.projected_first_year_benefit) html += kpiCard('Year 1 Benefit', targets.projected_first_year_benefit);
    html += '</div>';

    // Phases
    if (phases.length > 0) {
      html += '<h3 style="font-size:1rem;margin:0 0 16px;color:var(--vcx-brand-primary,#2E4F46);">Engagement Phases</h3>';
      for (var i = 0; i < phases.length; i++) {
        var phase = phases[i];
        html += '<div style="background:rgba(26,47,42,.03);border-left:3px solid var(--vcx-brand-primary,#2E4F46);border-radius:0 8px 8px 0;padding:16px 20px;margin-bottom:12px;">';
        html += '<h4 style="font-size:.92rem;margin:0 0 4px;">' + escapeHtml(phase.name || '') + ' <span style="font-weight:400;font-size:.82rem;color:var(--vcx-ink-muted,#7BAE9E);">(Weeks ' + escapeHtml(phase.weeks || '') + ')</span></h4>';
        html += '<p style="font-size:.85rem;margin:0 0 8px;color:var(--vcx-ink-body,#243D36);">' + escapeHtml(phase.focus || '') + '</p>';
        if (phase.deliverables && phase.deliverables.length > 0) {
          html += '<ul style="margin:0;padding-left:18px;font-size:.82rem;color:var(--vcx-ink-muted,#7BAE9E);">';
          for (var d = 0; d < phase.deliverables.length; d++) {
            html += '<li>' + escapeHtml(phase.deliverables[d]) + '</li>';
          }
          html += '</ul>';
        }
        html += '</div>';
      }
    }

    // Disclaimer
    html += '<p style="font-size:.78rem;color:var(--vcx-ink-muted,#7BAE9E);margin-top:20px;padding-top:16px;border-top:1px solid rgba(26,47,42,.08);">' + escapeHtml(brief.disclaimer || 'This executive brief contains estimates based on client-provided data. Actual results may vary.') + '</p>';

    briefPanel.innerHTML = html;
  }

  // --- Helpers ---------------------------------------------
  function kpiCard(label, value) {
    return '<div style="background:#fff;border:1px solid rgba(26,47,42,.08);border-radius:8px;padding:14px 16px;text-align:center;">' +
      '<div style="font-size:1.15rem;font-weight:700;color:var(--vcx-brand-primary,#2E4F46);margin-bottom:4px;">' + escapeHtml(String(value)) + '</div>' +
      '<div style="font-size:.78rem;color:var(--vcx-ink-muted,#7BAE9E);">' + escapeHtml(label) + '</div>' +
    '</div>';
  }

  function formatNum(n) {
    if (n === null || n === undefined) return '0';
    return Number(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  function showStepError(msg) {
    var el = wizardContainer && wizardContainer.querySelector('.vcx-wizard-panel[data-panel="' + state.step + '"]');
    if (!el) return;
    var existing = el.querySelector('.vcx-step-error');
    if (existing) existing.remove();
    var div = document.createElement('div');
    div.className = 'vcx-step-error';
    div.style.cssText = 'color:var(--vcx-status-danger,#E63757);font-size:.88rem;margin-top:12px;padding:10px;background:rgba(230,55,87,.06);border-radius:6px;';
    div.textContent = msg;
    el.appendChild(div);
    setTimeout(function () { if (div.parentNode) div.remove(); }, 6000);
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // --- Bind navigation buttons -----------------------------
  function bindNavButtons() {
    if (!wizardContainer) return;

    var nextBtns = wizardContainer.querySelectorAll('.vcx-wizard-next');
    for (var i = 0; i < nextBtns.length; i++) {
      nextBtns[i].addEventListener('click', (function (btn) {
        return function () {
          var target = parseInt(btn.getAttribute('data-next'), 10);
          goNext(target);
        };
      })(nextBtns[i]));
    }

    var prevBtns = wizardContainer.querySelectorAll('.vcx-wizard-prev');
    for (var j = 0; j < prevBtns.length; j++) {
      prevBtns[j].addEventListener('click', (function (btn) {
        return function () {
          var target = parseInt(btn.getAttribute('data-prev'), 10);
          showStep(target);
        };
      })(prevBtns[j]));
    }
  }

  // --- Boot ------------------------------------------------
  function init() {
    showStep(1);
    bindNavButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // --- Public namespace ------------------------------------
  window.VCX_RecoveryPilot = {
    goNext: goNext,
    showStep: showStep,
    getState: function () { return state; }
  };
})();
