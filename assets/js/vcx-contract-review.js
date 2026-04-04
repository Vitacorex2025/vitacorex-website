/* ==========================================================
   VCX Contract Review  --  vcx-contract-review.js
   Upload + pattern-based clause analysis with risk scoring.
   Phase 3: Wired to /api/contracts/analyze endpoint.
   ========================================================== */
(function () {
  'use strict';

  var API_BASE = (function () {
    if (window.VCX_API_BASE) return window.VCX_API_BASE;
    var port = location.port;
    if (port === '8080') return 'http://' + location.hostname + ':8787';
    return '';
  })();

  // --- DOM refs (match HTML element IDs) -------------------
  var uploadZone  = document.getElementById('vcxContractUpload');
  var fileInput   = document.getElementById('vcxContractFile');
  var analyzeBtn  = document.getElementById('vcxContractAnalyzeBtn');
  var resultPanel = document.getElementById('vcxContractResult');

  // --- State -----------------------------------------------
  var lastReviewId = null;

  // --- Drag-and-drop handlers ------------------------------
  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    if (uploadZone) uploadZone.style.borderColor = 'var(--vcx-brand-primary,#2E4F46)';
  }

  function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    if (uploadZone) uploadZone.style.borderColor = '';
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    if (uploadZone) uploadZone.style.borderColor = '';

    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (fileInput) {
        fileInput.files = e.dataTransfer.files;
        updateFileName();
      }
    }
  }

  if (uploadZone) {
    uploadZone.addEventListener('dragover',  handleDragOver);
    uploadZone.addEventListener('dragleave', handleDragLeave);
    uploadZone.addEventListener('drop',      handleDrop);
  }

  if (fileInput) {
    fileInput.addEventListener('change', updateFileName);
  }

  function updateFileName() {
    if (!fileInput || !fileInput.files || !fileInput.files[0]) return;
    var name = fileInput.files[0].name;
    var sizeKB = (fileInput.files[0].size / 1024).toFixed(1);
    var label = uploadZone && uploadZone.querySelector('p');
    if (label) {
      label.textContent = name + ' (' + sizeKB + ' KB) — ready to analyze';
    }
  }

  // --- Analysis --------------------------------------------
  function analyze() {
    var file = fileInput && fileInput.files && fileInput.files[0];

    if (!file) {
      showMessage('Please select or drop a contract file before analyzing.', 'warn');
      return;
    }

    var formData = new FormData();
    formData.append('file', file);

    showMessage('Analyzing contract...', 'info');
    if (analyzeBtn) {
      analyzeBtn.disabled = true;
      analyzeBtn.textContent = 'Analyzing...';
    }

    var analyzeOpts = {
      method: 'POST',
      body: formData
    };
    if (typeof AbortSignal !== 'undefined' && AbortSignal.timeout) {
      analyzeOpts.signal = AbortSignal.timeout(60000);
    }

    fetch(API_BASE + '/api/contracts/analyze', analyzeOpts)
      .then(function (res) {
        if (!res.ok) throw new Error('Server returned ' + res.status);
        return res.json();
      })
      .then(function (data) {
        lastReviewId = data.review_id || null;
        renderResults(data);
      })
      .catch(function (err) {
        showMessage('Analysis failed: ' + err.message, 'error');
      })
      .finally(function () {
        if (analyzeBtn) {
          analyzeBtn.disabled = false;
          analyzeBtn.textContent = 'Analyze Contract';
        }
      });
  }

  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', analyze);
  }

  // --- Render full results ---------------------------------
  function renderResults(data) {
    if (!resultPanel) return;
    resultPanel.style.display = 'block';

    var html = '';

    // Status header
    var statusColor = data.status === 'reviewed' ? 'var(--vcx-accent-gold,#5BBAA7)' : 'var(--vcx-ink-muted,#7BAE9E)';
    html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:8px;">';
    html += '<div>';
    html += '<span style="font-size:.78rem;text-transform:uppercase;letter-spacing:.1em;color:' + statusColor + ';font-weight:600;">' + escapeHtml(data.status || 'unknown') + '</span>';
    html += '<span style="font-size:.82rem;color:var(--vcx-ink-muted,#7BAE9E);margin-left:12px;">' + escapeHtml(data.filename || '') + '</span>';
    html += '</div>';
    if (data.review_id) {
      html += '<span style="font-size:.75rem;color:var(--vcx-ink-muted,#7BAE9E);">ID: ' + escapeHtml(data.review_id.substring(0, 8)) + '...</span>';
    }
    html += '</div>';

    // Risk score bar
    if (data.risk_score !== null && data.risk_score !== undefined) {
      var scoreColor = data.risk_score >= 50 ? '#E63757' : data.risk_score >= 25 ? '#F5A623' : '#38B249';
      html += '<div style="margin-bottom:20px;">';
      html += '<div style="display:flex;justify-content:space-between;margin-bottom:6px;">';
      html += '<span style="font-size:.85rem;font-weight:600;">Risk Score</span>';
      html += '<span style="font-size:1.1rem;font-weight:700;color:' + scoreColor + ';">' + data.risk_score + '/100</span>';
      html += '</div>';
      html += '<div style="height:8px;background:rgba(26,47,42,.06);border-radius:4px;overflow:hidden;">';
      html += '<div style="height:100%;width:' + Math.min(data.risk_score, 100) + '%;background:' + scoreColor + ';border-radius:4px;transition:width .5s;"></div>';
      html += '</div>';
      html += '</div>';
    }

    // Risk summary
    if (data.risk_summary) {
      html += '<div style="background:rgba(26,47,42,.03);border-radius:8px;padding:16px;margin-bottom:24px;font-size:.88rem;line-height:1.6;color:var(--vcx-ink-body,#243D36);">';
      html += escapeHtml(data.risk_summary);
      html += '</div>';
    }

    // Clause list
    var clauses = data.clauses || [];
    if (clauses.length > 0) {
      html += '<h3 style="font-size:1rem;margin:0 0 14px;color:var(--vcx-brand-primary,#2E4F46);">Detected Clauses (' + clauses.length + ')</h3>';

      for (var i = 0; i < clauses.length; i++) {
        var c = clauses[i];
        var riskBg = 'rgba(26,47,42,.04)';
        var riskColor = 'var(--vcx-ink-muted,#7BAE9E)';
        var riskLabel = c.risk_level || 'neutral';

        if (riskLabel === 'high_risk') {
          riskBg = 'rgba(230,55,87,.06)';
          riskColor = '#E63757';
          riskLabel = 'HIGH RISK';
        } else if (riskLabel === 'caution') {
          riskBg = 'rgba(245,166,35,.06)';
          riskColor = '#F5A623';
          riskLabel = 'CAUTION';
        } else {
          riskLabel = 'STANDARD';
        }

        html += '<div style="background:' + riskBg + ';border:1px solid rgba(26,47,42,.06);border-radius:8px;padding:14px 16px;margin-bottom:10px;">';
        html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;flex-wrap:wrap;gap:4px;">';
        html += '<span style="font-size:.82rem;font-weight:600;color:var(--vcx-brand-primary,#2E4F46);text-transform:capitalize;">' + escapeHtml((c.clause_type || '').replace(/_/g, ' ')) + '</span>';
        html += '<span style="font-size:.72rem;font-weight:700;color:' + riskColor + ';text-transform:uppercase;letter-spacing:.08em;">' + riskLabel + '</span>';
        html += '</div>';
        if (c.excerpt) {
          html += '<p style="font-size:.82rem;line-height:1.5;color:var(--vcx-ink-body,#243D36);margin:0 0 6px;font-style:italic;">"' + escapeHtml(c.excerpt.substring(0, 200)) + '"</p>';
        }
        if (c.note) {
          html += '<p style="font-size:.78rem;color:var(--vcx-ink-muted,#7BAE9E);margin:0;">' + escapeHtml(c.note) + '</p>';
        }
        if (c.confidence) {
          html += '<div style="margin-top:4px;font-size:.72rem;color:var(--vcx-ink-muted,#7BAE9E);">Confidence: ' + (c.confidence * 100).toFixed(0) + '%</div>';
        }
        html += '</div>';
      }
    } else {
      html += '<p style="font-size:.9rem;color:var(--vcx-ink-muted,#7BAE9E);">No clauses detected. The document may need manual review, or try uploading a .txt file for best results.</p>';
    }

    // --- Issue Buckets (Phase 11: severity-tiered issue grouping) ---
    var buckets = data.issue_buckets || [];
    if (buckets.length > 0) {
      html += '<div style="margin-top:28px;">';
      html += '<h3 style="font-size:1rem;margin:0 0 14px;color:var(--vcx-brand-primary,#2E4F46);">Issue Summary</h3>';
      for (var b = 0; b < buckets.length; b++) {
        var bkt = buckets[b];
        var bktColor = bkt.severity === 'high' ? '#E63757' : bkt.severity === 'medium' ? '#F5A623' : 'var(--vcx-ink-muted,#7BAE9E)';
        var bktBg = bkt.severity === 'high' ? 'rgba(230,55,87,.06)' : bkt.severity === 'medium' ? 'rgba(245,166,35,.06)' : 'rgba(26,47,42,.03)';
        html += '<div style="background:' + bktBg + ';border:1px solid rgba(26,47,42,.06);border-radius:8px;padding:16px;margin-bottom:12px;">';
        html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">';
        html += '<span style="font-size:.88rem;font-weight:700;color:var(--vcx-ink-body,#243D36);">' + escapeHtml(bkt.bucket) + '</span>';
        html += '<span style="font-size:.72rem;font-weight:700;color:' + bktColor + ';text-transform:uppercase;letter-spacing:.08em;">' + escapeHtml(bkt.severity) + '</span>';
        html += '</div>';
        var bItems = bkt.items || [];
        for (var bi = 0; bi < bItems.length; bi++) {
          var bItem = bItems[bi];
          html += '<div style="padding:8px 0;' + (bi > 0 ? 'border-top:1px solid rgba(26,47,42,.06);' : '') + '">';
          html += '<div style="font-size:.82rem;font-weight:600;color:var(--vcx-ink-body,#243D36);margin-bottom:3px;">' + escapeHtml(bItem.label) + '</div>';
          if (bItem.excerpt) {
            html += '<p style="font-size:.78rem;color:var(--vcx-ink-muted,#7BAE9E);margin:0 0 3px;font-style:italic;">&ldquo;' + escapeHtml(bItem.excerpt.substring(0, 150)) + '&rdquo;</p>';
          }
          if (bItem.note) {
            html += '<p style="font-size:.78rem;color:var(--vcx-ink-muted,#7BAE9E);margin:0;">' + escapeHtml(bItem.note) + '</p>';
          }
          html += '</div>';
        }
        html += '</div>';
      }
      html += '</div>';
    }

    // --- Missing Protections (Phase 11: gap detection with recommendations) ---
    var missingProt = data.missing_protections || [];
    if (missingProt.length > 0) {
      html += '<div style="margin-top:28px;">';
      html += '<h3 style="font-size:1rem;margin:0 0 14px;color:var(--vcx-brand-primary,#2E4F46);">Missing Protections (' + missingProt.length + ')</h3>';
      for (var mp = 0; mp < missingProt.length; mp++) {
        var prot = missingProt[mp];
        var protColor = prot.severity === 'high' ? '#E63757' : '#F5A623';
        var protBg = prot.severity === 'high' ? 'rgba(230,55,87,.06)' : 'rgba(245,166,35,.06)';
        html += '<div style="background:' + protBg + ';border:1px solid rgba(26,47,42,.06);border-radius:8px;padding:14px 16px;margin-bottom:10px;">';
        html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;flex-wrap:wrap;gap:4px;">';
        html += '<span style="font-size:.82rem;font-weight:600;color:var(--vcx-brand-primary,#2E4F46);">' + escapeHtml(prot.label) + '</span>';
        html += '<span style="font-size:.72rem;font-weight:700;color:' + protColor + ';text-transform:uppercase;letter-spacing:.08em;">' + escapeHtml(prot.severity) + '</span>';
        html += '</div>';
        if (prot.recommendation) {
          html += '<p style="font-size:.82rem;color:var(--vcx-ink-body,#243D36);margin:0;line-height:1.5;">' + escapeHtml(prot.recommendation) + '</p>';
        }
        html += '</div>';
      }
      html += '</div>';
    }

    // --- Suggested Questions for Counsel (Phase 11: context-specific questions) ---
    var suggestedQ = data.suggested_questions || [];
    if (suggestedQ.length > 0) {
      html += '<div style="margin-top:28px;">';
      html += '<h3 style="font-size:1rem;margin:0 0 14px;color:var(--vcx-brand-primary,#2E4F46);">Questions for Counsel (' + suggestedQ.length + ')</h3>';
      html += '<div style="background:rgba(46,79,70,.03);border:1px solid rgba(26,47,42,.06);border-radius:8px;padding:16px;">';
      var prevCat = '';
      for (var qi = 0; qi < suggestedQ.length; qi++) {
        var sq = suggestedQ[qi];
        if (sq.category !== prevCat) {
          if (prevCat !== '') html += '</ul>';
          html += '<div style="font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--vcx-ink-muted,#7BAE9E);margin:' + (prevCat ? '14px' : '0') + ' 0 8px;">' + escapeHtml(sq.category) + '</div>';
          html += '<ul style="margin:0 0 4px;padding-left:18px;list-style:disc;">';
          prevCat = sq.category;
        }
        var ctxTag = sq.context === 'missing' ? ' <span style="font-size:.68rem;color:#E63757;font-weight:600;margin-left:4px;">MISSING</span>' : '';
        html += '<li style="font-size:.82rem;line-height:1.5;color:var(--vcx-ink-body,#243D36);margin-bottom:4px;">' + escapeHtml(sq.question) + ctxTag + '</li>';
      }
      if (prevCat !== '') html += '</ul>';
      html += '</div>';
      html += '</div>';
    }

    // View full report link
    if (lastReviewId) {
      html += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid rgba(26,47,42,.08);text-align:center;">';
      html += '<button type="button" id="vcxViewReport" style="background:none;border:1px solid var(--vcx-brand-primary,#2E4F46);color:var(--vcx-brand-primary,#2E4F46);border-radius:6px;padding:8px 20px;font-size:.85rem;cursor:pointer;">View Full Report</button>';
      html += '</div>';
    }

    // Disclaimer
    html += '<p style="font-size:.75rem;color:var(--vcx-ink-muted,#7BAE9E);margin-top:16px;">This is an automated preliminary scan. It does not constitute legal advice. Consult licensed counsel before acting on these findings.</p>';

    resultPanel.innerHTML = html;

    // Bind report button
    var reportBtn = document.getElementById('vcxViewReport');
    if (reportBtn) {
      reportBtn.addEventListener('click', function () { loadReport(lastReviewId); });
    }
  }

  // --- Load full report ------------------------------------
  function loadReport(reviewId) {
    fetch(API_BASE + '/api/contracts/' + encodeURIComponent(reviewId) + '/report')
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to load report');
        return res.json();
      })
      .then(function (data) {
        renderResults({
          status: data.status,
          filename: 'Full Report',
          review_id: data.review_id,
          risk_score: data.risk_score,
          risk_summary: data.risk_summary,
          clauses: (data.clauses || []).map(function (c) {
            return {
              clause_type: c.clause_type,
              excerpt: c.excerpt,
              risk_level: c.risk_level,
              note: c.note,
              confidence: c.confidence
            };
          })
        });
      })
      .catch(function (err) {
        showMessage('Failed to load report: ' + err.message, 'error');
      });
  }

  // --- Helpers ---------------------------------------------
  function showMessage(msg, level) {
    if (!resultPanel) return;
    resultPanel.style.display = 'block';
    var color = level === 'error' ? '#E63757'
              : level === 'warn'  ? '#F5A623'
              : 'var(--vcx-ink-muted,#7BAE9E)';
    resultPanel.innerHTML = '<p style="color:' + color + ';font-size:.9rem;">' + escapeHtml(msg) + '</p>';
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // ==========================================================
  //  Phase 9: Contract Generator — questionnaire + DOCX download
  // ==========================================================

  var analyzeSection  = document.getElementById('vcxAnalyzeSection');
  var generateSection = document.getElementById('vcxGenerateSection');
  var modeTabs        = document.getElementById('vcxModeTabs');
  var typeGrid        = document.getElementById('vcxTypeGrid');
  var genForm         = document.getElementById('vcxGenForm');
  var genFields       = document.getElementById('vcxGenFields');
  var genBtn          = document.getElementById('vcxGenBtn');
  var genBackBtn      = document.getElementById('vcxGenBackBtn');
  var genResult       = document.getElementById('vcxGenResult');

  var genState = {
    selectedType: null,
    typeLabel: ''
  };

  // --- Field definitions per contract type --------------------
  var COMMON_FIELDS = [
    { name: 'party_a_name',    label: 'Party A (Your Company)',   type: 'text',  placeholder: 'e.g. Acme Corp', required: true },
    { name: 'party_b_name',    label: 'Party B (Other Party)',    type: 'text',  placeholder: 'e.g. Widget Inc', required: true },
    { name: 'effective_date',  label: 'Effective Date',           type: 'date',  placeholder: '' },
    { name: 'governing_state', label: 'Governing State',          type: 'text',  placeholder: 'e.g. Florida' },
    { name: 'term_months',     label: 'Term (Months)',            type: 'number', placeholder: 'e.g. 12' },
    { name: 'notice_days',     label: 'Notice Period (Days)',     type: 'number', placeholder: 'e.g. 30' }
  ];

  var TYPE_FIELDS = {
    nda: [
      { name: 'purpose', label: 'Purpose of Disclosure', type: 'textarea', placeholder: 'Describe what confidential information will be shared and why', full: true }
    ],
    service: [
      { name: 'scope_of_services', label: 'Scope of Services', type: 'textarea', placeholder: 'Describe the services to be performed', full: true },
      { name: 'payment_amount',    label: 'Payment Amount',     type: 'text',     placeholder: 'e.g. $5,000/month' },
      { name: 'payment_schedule',  label: 'Payment Schedule',   type: 'text',     placeholder: 'e.g. Monthly' },
      { name: 'payment_net_days',  label: 'Payment Net Days',   type: 'text',     placeholder: 'e.g. 30' },
      { name: 'ip_owner',          label: 'IP Ownership',       type: 'text',     placeholder: 'e.g. Party A retains all IP', full: true }
    ],
    employment: [
      { name: 'job_title',               label: 'Job Title',               type: 'text',     placeholder: 'e.g. Senior Developer' },
      { name: 'job_duties',              label: 'Job Duties',              type: 'textarea',  placeholder: 'Describe primary responsibilities', full: true },
      { name: 'salary',                  label: 'Annual Salary',           type: 'text',     placeholder: 'e.g. $85,000' },
      { name: 'pay_schedule',            label: 'Pay Schedule',            type: 'text',     placeholder: 'e.g. Bi-weekly' },
      { name: 'non_compete_months',      label: 'Non-Compete (Months)',    type: 'number',   placeholder: 'e.g. 12' },
      { name: 'non_compete_geography',   label: 'Non-Compete Geography',   type: 'text',     placeholder: 'e.g. State of Florida' },
      { name: 'non_solicit_months',      label: 'Non-Solicitation (Months)', type: 'number', placeholder: 'e.g. 12' }
    ],
    contractor: [
      { name: 'scope_of_services',       label: 'Scope of Services',       type: 'textarea', placeholder: 'Describe the contracted work', full: true },
      { name: 'contractor_rate',          label: 'Contractor Rate',         type: 'text',     placeholder: 'e.g. $150/hour' },
      { name: 'payment_net_days',         label: 'Payment Net Days',        type: 'text',     placeholder: 'e.g. 30' },
      { name: 'ip_owner',                 label: 'IP Ownership',            type: 'text',     placeholder: 'e.g. Party A retains all IP', full: true },
      { name: 'non_compete_months',       label: 'Non-Compete (Months)',    type: 'number',   placeholder: 'e.g. 6' },
      { name: 'non_compete_geography',    label: 'Non-Compete Geography',   type: 'text',     placeholder: 'e.g. 50-mile radius' }
    ]
  };

  // --- Tab switching -----------------------------------------
  if (modeTabs) {
    modeTabs.addEventListener('click', function (e) {
      var btn = e.target.closest('.cr-mode-tab');
      if (!btn) return;
      var mode = btn.getAttribute('data-mode');
      var allTabs = modeTabs.querySelectorAll('.cr-mode-tab');
      for (var i = 0; i < allTabs.length; i++) {
        allTabs[i].classList.toggle('cr-mode-tab--active', allTabs[i] === btn);
      }
      if (analyzeSection)  analyzeSection.style.display  = (mode === 'analyze')  ? '' : 'none';
      if (generateSection) generateSection.style.display = (mode === 'generate') ? '' : 'none';
    });
  }

  // --- Type card selection -----------------------------------
  if (typeGrid) {
    typeGrid.addEventListener('click', function (e) {
      var card = e.target.closest('.cr-gen-type-card');
      if (!card) return;
      var type = card.getAttribute('data-type');
      selectType(type, card.querySelector('strong') ? card.querySelector('strong').textContent : type);
    });
  }

  function selectType(type, label) {
    genState.selectedType = type;
    genState.typeLabel = label;

    // Highlight card
    var cards = typeGrid ? typeGrid.querySelectorAll('.cr-gen-type-card') : [];
    for (var i = 0; i < cards.length; i++) {
      cards[i].classList.toggle('cr-gen-type-card--selected', cards[i].getAttribute('data-type') === type);
    }

    // Build form fields
    buildFormFields(type);

    // Show form, hide result
    if (genForm)   genForm.style.display = '';
    if (genResult) genResult.style.display = 'none';
  }

  // --- Build dynamic form fields ----------------------------
  function buildFormFields(type) {
    if (!genFields) return;

    var fields = COMMON_FIELDS.concat(TYPE_FIELDS[type] || []);
    var html = '<p style="font-size:.78rem;color:var(--vcx-ink-muted,#7BAE9E);margin:0 0 16px;grid-column:1/-1;">Fields marked * are recommended. All others use standard defaults if left blank.</p>';

    for (var i = 0; i < fields.length; i++) {
      var f = fields[i];
      var cls = 'cr-gen-field' + (f.full ? ' cr-gen-field--full' : '');
      var req = f.required ? ' *' : '';

      html += '<div class="' + cls + '">';
      html += '<label for="vcxGen_' + f.name + '">' + escapeHtml(f.label) + req + '</label>';

      if (f.type === 'textarea') {
        html += '<textarea id="vcxGen_' + f.name + '" name="' + f.name + '" placeholder="' + escapeHtml(f.placeholder || '') + '" rows="3"></textarea>';
      } else {
        html += '<input type="' + f.type + '" id="vcxGen_' + f.name + '" name="' + f.name + '" placeholder="' + escapeHtml(f.placeholder || '') + '"' + (f.required ? ' required' : '') + '/>';
      }

      html += '</div>';
    }

    genFields.innerHTML = html;
  }

  // --- Back to type picker -----------------------------------
  if (genBackBtn) {
    genBackBtn.addEventListener('click', function () {
      genState.selectedType = null;
      genState.typeLabel = '';
      if (genForm) genForm.style.display = 'none';
      if (genResult) genResult.style.display = 'none';
      var cards = typeGrid ? typeGrid.querySelectorAll('.cr-gen-type-card') : [];
      for (var i = 0; i < cards.length; i++) {
        cards[i].classList.remove('cr-gen-type-card--selected');
      }
    });
  }

  // --- Generate contract submission --------------------------
  if (genForm) {
    genForm.addEventListener('submit', function (e) {
      e.preventDefault();
      generateContract();
    });
  }

  function generateContract() {
    if (!genState.selectedType) return;

    // --- Client-side validation ---
    var errors = [];
    var partyAInput = genForm ? genForm.querySelector('[name="party_a_name"]') : null;
    var partyBInput = genForm ? genForm.querySelector('[name="party_b_name"]') : null;
    if (partyAInput && !partyAInput.value.trim()) errors.push('Party A (Your Company) is required.');
    if (partyBInput && !partyBInput.value.trim()) errors.push('Party B (Other Party) is required.');

    var numInputs = genForm ? genForm.querySelectorAll('input[type="number"]') : [];
    for (var n = 0; n < numInputs.length; n++) {
      var nVal = numInputs[n].value.trim();
      if (nVal && (isNaN(parseInt(nVal, 10)) || parseInt(nVal, 10) < 0)) {
        var fieldLabel = numInputs[n].name.replace(/_/g, ' ');
        errors.push(fieldLabel.charAt(0).toUpperCase() + fieldLabel.slice(1) + ' must be a positive number.');
      }
    }

    if (errors.length > 0) {
      renderGenError(errors.join(' '));
      return;
    }

    var payload = { contract_type: genState.selectedType };

    // Collect form values
    var inputs = genForm ? genForm.querySelectorAll('input, textarea, select') : [];
    for (var i = 0; i < inputs.length; i++) {
      var val = inputs[i].value.trim();
      if (val) {
        var name = inputs[i].name;
        if (inputs[i].type === 'number') {
          payload[name] = parseInt(val, 10);
        } else {
          payload[name] = val;
        }
      }
    }

    // UI loading state
    if (genBtn) {
      genBtn.disabled = true;
      genBtn.classList.add('cr-gen-submit--loading');
      genBtn.textContent = 'Generating...';
    }

    var genOpts = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    };
    if (typeof AbortSignal !== 'undefined' && AbortSignal.timeout) {
      genOpts.signal = AbortSignal.timeout(30000);
    }

    fetch(API_BASE + '/api/contracts/generate', genOpts)
      .then(function (res) {
        if (!res.ok) {
          return res.json().then(function (d) {
            throw new Error(d.detail || 'Generation failed (HTTP ' + res.status + ')');
          });
        }
        return res.json();
      })
      .then(function (data) {
        renderGenResult(data);
      })
      .catch(function (err) {
        renderGenError(err.message);
      })
      .finally(function () {
        if (genBtn) {
          genBtn.disabled = false;
          genBtn.classList.remove('cr-gen-submit--loading');
          genBtn.textContent = 'Generate Contract';
        }
      });
  }

  // --- Render generation success -----------------------------
  function renderGenResult(data) {
    if (!genResult) return;
    genResult.style.display = '';

    var downloadUrl = API_BASE + data.download_url;

    var html = '<div class="cr-gen-result">';
    html += '<div class="cr-gen-result-icon">&#128196;</div>';
    html += '<h3>' + escapeHtml(data.contract_label) + ' Generated</h3>';
    html += '<p>Your ' + escapeHtml(data.filename) + ' (' + (data.size_bytes / 1024).toFixed(1) + ' KB) is ready for download. Open it in Microsoft Word or any compatible editor to review and customize.</p>';
    html += '<a class="cr-gen-download-btn" href="' + escapeHtml(downloadUrl) + '" download="' + escapeHtml(data.filename) + '">';
    html += '<svg viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>';
    html += 'Download DOCX';
    html += '</a>';
    html += '<div class="cr-gen-actions">';
    html += '<button type="button" class="cr-gen-another" id="vcxGenAnother">Generate Another</button>';
    html += '</div>';
    html += '<p class="cr-gen-disclaimer">' + escapeHtml(data.disclaimer) + '</p>';
    html += '</div>';

    genResult.innerHTML = html;

    // Bind "Generate Another" button
    var anotherBtn = document.getElementById('vcxGenAnother');
    if (anotherBtn) {
      anotherBtn.addEventListener('click', function () {
        genResult.style.display = 'none';
        if (genForm) {
          genForm.reset();
          genForm.style.display = 'none';
        }
        genState.selectedType = null;
        genState.typeLabel = '';
        var resetCards = typeGrid ? typeGrid.querySelectorAll('.cr-gen-type-card') : [];
        for (var rc = 0; rc < resetCards.length; rc++) {
          resetCards[rc].classList.remove('cr-gen-type-card--selected');
        }
      });
    }
  }

  // --- Render generation error -------------------------------
  function renderGenError(message) {
    if (!genResult) return;
    genResult.style.display = '';

    var html = '<div class="cr-gen-result">';
    html += '<div class="cr-gen-result-icon">&#9888;&#65039;</div>';
    html += '<h3>Generation Failed</h3>';
    html += '<p style="color:#E63757;">' + escapeHtml(message) + '</p>';
    html += '<p style="font-size:.82rem;color:var(--vcx-ink-muted,#7BAE9E);">Check that the backend is running and try again. If the issue persists, contact support.</p>';
    html += '</div>';

    genResult.innerHTML = html;
  }

  // --- Public namespace ------------------------------------
  window.VCX_ContractReview = {
    analyze: analyze,
    loadReport: loadReport,
    generateContract: generateContract
  };
})();
