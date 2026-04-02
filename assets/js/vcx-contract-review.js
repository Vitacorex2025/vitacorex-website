/* ==========================================================
   VCX Contract Review  --  vcx-contract-review.js
   Upload + pattern-based clause analysis with risk scoring.
   Phase 3: Wired to /api/contracts/analyze endpoint.
   ========================================================== */
(function () {
  'use strict';

  var API_BASE = window.VCX_API_BASE || '';

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
    if (uploadZone) uploadZone.style.borderColor = 'var(--vcx-brand-primary,#173A63)';
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

    fetch(API_BASE + '/api/contracts/analyze', {
      method: 'POST',
      body: formData
    })
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
    var statusColor = data.status === 'reviewed' ? 'var(--vcx-accent-gold,#B08A57)' : 'var(--vcx-ink-muted,#5E6C7B)';
    html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:8px;">';
    html += '<div>';
    html += '<span style="font-size:.78rem;text-transform:uppercase;letter-spacing:.1em;color:' + statusColor + ';font-weight:600;">' + escapeHtml(data.status || 'unknown') + '</span>';
    html += '<span style="font-size:.82rem;color:var(--vcx-ink-muted,#5E6C7B);margin-left:12px;">' + escapeHtml(data.filename || '') + '</span>';
    html += '</div>';
    if (data.review_id) {
      html += '<span style="font-size:.75rem;color:var(--vcx-ink-muted,#5E6C7B);">ID: ' + escapeHtml(data.review_id.substring(0, 8)) + '...</span>';
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
      html += '<div style="height:8px;background:rgba(15,27,45,.06);border-radius:4px;overflow:hidden;">';
      html += '<div style="height:100%;width:' + Math.min(data.risk_score, 100) + '%;background:' + scoreColor + ';border-radius:4px;transition:width .5s;"></div>';
      html += '</div>';
      html += '</div>';
    }

    // Risk summary
    if (data.risk_summary) {
      html += '<div style="background:rgba(15,27,45,.03);border-radius:8px;padding:16px;margin-bottom:24px;font-size:.88rem;line-height:1.6;color:var(--vcx-ink-body,#243548);">';
      html += escapeHtml(data.risk_summary);
      html += '</div>';
    }

    // Clause list
    var clauses = data.clauses || [];
    if (clauses.length > 0) {
      html += '<h3 style="font-size:1rem;margin:0 0 14px;color:var(--vcx-brand-primary,#173A63);">Detected Clauses (' + clauses.length + ')</h3>';

      for (var i = 0; i < clauses.length; i++) {
        var c = clauses[i];
        var riskBg = 'rgba(15,27,45,.04)';
        var riskColor = 'var(--vcx-ink-muted,#5E6C7B)';
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

        html += '<div style="background:' + riskBg + ';border:1px solid rgba(15,27,45,.06);border-radius:8px;padding:14px 16px;margin-bottom:10px;">';
        html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;flex-wrap:wrap;gap:4px;">';
        html += '<span style="font-size:.82rem;font-weight:600;color:var(--vcx-brand-primary,#173A63);text-transform:capitalize;">' + escapeHtml((c.clause_type || '').replace(/_/g, ' ')) + '</span>';
        html += '<span style="font-size:.72rem;font-weight:700;color:' + riskColor + ';text-transform:uppercase;letter-spacing:.08em;">' + riskLabel + '</span>';
        html += '</div>';
        if (c.excerpt) {
          html += '<p style="font-size:.82rem;line-height:1.5;color:var(--vcx-ink-body,#243548);margin:0 0 6px;font-style:italic;">"' + escapeHtml(c.excerpt.substring(0, 200)) + '"</p>';
        }
        if (c.note) {
          html += '<p style="font-size:.78rem;color:var(--vcx-ink-muted,#5E6C7B);margin:0;">' + escapeHtml(c.note) + '</p>';
        }
        if (c.confidence) {
          html += '<div style="margin-top:4px;font-size:.72rem;color:var(--vcx-ink-muted,#5E6C7B);">Confidence: ' + (c.confidence * 100).toFixed(0) + '%</div>';
        }
        html += '</div>';
      }
    } else {
      html += '<p style="font-size:.9rem;color:var(--vcx-ink-muted,#5E6C7B);">No clauses detected. The document may need manual review, or try uploading a .txt file for best results.</p>';
    }

    // View full report link
    if (lastReviewId) {
      html += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid rgba(15,27,45,.08);text-align:center;">';
      html += '<button type="button" id="vcxViewReport" style="background:none;border:1px solid var(--vcx-brand-primary,#173A63);color:var(--vcx-brand-primary,#173A63);border-radius:6px;padding:8px 20px;font-size:.85rem;cursor:pointer;">View Full Report</button>';
      html += '</div>';
    }

    // Disclaimer
    html += '<p style="font-size:.75rem;color:var(--vcx-ink-muted,#5E6C7B);margin-top:16px;">This is an automated preliminary scan. It does not constitute legal advice. Consult licensed counsel before acting on these findings.</p>';

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
              : 'var(--vcx-ink-muted,#5E6C7B)';
    resultPanel.innerHTML = '<p style="color:' + color + ';font-size:.9rem;">' + escapeHtml(msg) + '</p>';
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // --- Public namespace ------------------------------------
  window.VCX_ContractReview = {
    analyze: analyze,
    loadReport: loadReport
  };
})();
