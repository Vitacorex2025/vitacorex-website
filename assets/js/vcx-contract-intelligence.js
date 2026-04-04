/**
 * VCX Contract Intelligence — API Bridge
 * Phase 4B: Wires the existing contract-intelligence page to the backend
 * analysis endpoints. Falls back to client-side analysis if API unreachable.
 *
 * Overrides: window.vcxScanContract, window.vcxHandleFile
 * Preserves: all existing client-side features (stronger clauses, download, etc.)
 */
(function () {
  'use strict';

  var API_BASE = window.VCX_API_BASE || '';

  // Save originals for fallback
  var _origScanContract = window.vcxScanContract;
  var _origHandleFile = window.vcxHandleFile;

  // Helpers
  function el(id) { return document.getElementById(id); }
  function escHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ── Override vcxHandleFile to update file notices for server-side extraction ──

  window.vcxHandleFile = function (input) {
    // Call original to preserve selectedFile and existing behavior
    if (_origHandleFile) _origHandleFile(input);

    var file = input.files && input.files[0];
    if (!file) return;

    var ext = file.name.split('.').pop().toLowerCase();
    var noticeEl = el('vcxFileNotice');
    if (noticeEl) {
      if (ext === 'pdf') {
        noticeEl.textContent = 'PDF detected \u2014 server-side text extraction available. Scanned or image-only PDFs may still yield limited results.';
        noticeEl.className = 'vcx-file-notice vcx-notice-success';
        noticeEl.hidden = false;
      } else if (ext === 'docx') {
        noticeEl.textContent = 'Word document detected \u2014 server-side text extraction available.';
        noticeEl.className = 'vcx-file-notice vcx-notice-success';
        noticeEl.hidden = false;
      } else if (ext === 'doc') {
        noticeEl.textContent = 'Legacy .doc format \u2014 limited support. For best results, save as .docx or .txt.';
        noticeEl.className = 'vcx-file-notice vcx-notice-warning';
        noticeEl.hidden = false;
      }
      // For .txt/.md, the original handler already sets the correct notice
    }
  };

  // ── Override vcxScanContract to use server API ────────────────────────

  window.vcxScanContract = function () {
    var fileInput = el('vcxContractFile');
    var file = fileInput && fileInput.files && fileInput.files[0];
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    var scanBtn = el('vcxScanBtn');
    var resultsArea = el('vcxResultsArea');
    if (!resultsArea) return;

    // Loading state
    if (scanBtn) {
      scanBtn.disabled = true;
      scanBtn.textContent = 'Analyzing\u2026';
    }

    // Collect questionnaire data
    var contractType = (el('vcxContractType') || {}).value || '';
    var negotiated = (el('vcxNegotiated') || {}).value || '';
    var deadline = (el('vcxDeadline') || {}).value || '';
    var concerns = [];
    document.querySelectorAll('input[name="vcxConcern"]:checked').forEach(function (cb) {
      concerns.push(cb.value);
    });

    // Build FormData
    var fd = new FormData();
    fd.append('file', file);
    if (contractType) fd.append('contract_type', contractType);
    if (concerns.length > 0) fd.append('concerns', concerns.join(','));
    if (negotiated) fd.append('negotiated', negotiated);
    if (deadline) fd.append('deadline', deadline);

    // Call API
    fetch(API_BASE + '/api/contracts/analyze', {
      method: 'POST',
      body: fd,
    })
      .then(function (res) {
        if (res.status === 429) {
          throw { code: 429, message: 'Too many requests. Please wait a moment and try again.' };
        }
        if (res.status === 413) {
          throw { code: 413, message: 'File is too large. Maximum upload size is 25 MB.' };
        }
        if (res.status === 400) {
          return res.json().then(function (data) {
            throw { code: 400, message: data.detail || 'Invalid file or request.' };
          });
        }
        if (!res.ok) {
          throw { code: res.status, message: 'Server error (' + res.status + ').' };
        }
        return res.json();
      })
      .then(function (data) {
        // Render server results
        renderServerResults(data, resultsArea);
        resultsArea.hidden = false;
        resultsArea.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Bridge to client-side stronger clauses feature
        bridgeAnalysisForStrongerClauses(data);

        // Show advisor review section
        showAdvisorSection(data);

        // Reset button
        if (scanBtn) {
          scanBtn.disabled = false;
          scanBtn.textContent = 'Analyze contract';
        }
      })
      .catch(function (err) {
        // Network error or TypeError = API unreachable → fallback
        if (err instanceof TypeError || (err && !err.code)) {
          console.warn('[VCX] API unreachable, falling back to client-side analysis:', err);
          if (_origScanContract) {
            _origScanContract();
          }
          return;
        }

        // Known error from API
        resultsArea.innerHTML = renderErrorResult(
          err.message || 'Analysis failed. Please try again or use the manual review route below.'
        );
        resultsArea.hidden = false;
        if (scanBtn) {
          scanBtn.disabled = false;
          scanBtn.textContent = 'Analyze contract';
        }
      });
  };

  // ── Render server analysis results ────────────────────────────────

  function renderServerResults(data, container) {
    var html = '<div class="vcx-analysis-result" role="region" aria-label="Contract analysis">';

    // --- Summary banner ---
    var clauseCount = (data.clauses || []).length;
    var missingCount = (data.missing_protections || []).length;
    var highMissing = (data.missing_protections || []).filter(function (m) { return m.severity === 'high'; });
    var severity = highMissing.length > 0 ? 'high' : missingCount > 0 ? 'medium' : 'low';
    var summaryText = {
      high: highMissing.length + ' high-priority protection' + (highMissing.length > 1 ? 's' : '') + ' not found in document',
      medium: missingCount + ' protection' + (missingCount > 1 ? 's' : '') + ' to verify',
      low: 'No major gaps identified'
    };
    var summaryIcon = severity === 'high' ? '&#9888;' : severity === 'medium' ? '&#8594;' : '&#10003;';

    html += '<div class="vcx-result-summary vcx-summary-' + severity + '">';
    html += '<div class="vcx-summary-icon">' + summaryIcon + '</div>';
    html += '<div><h2 class="vcx-summary-title">' + summaryText[severity] + '</h2>';
    html += '<p class="vcx-summary-meta">Analyzed: <strong>' + escHtml(data.filename) + '</strong>';
    if (data.word_count) html += ' &middot; ' + data.word_count.toLocaleString() + ' words';
    if (data.extraction_method) html += ' &middot; Extraction: ' + escHtml(data.extraction_method);
    html += ' &middot; ' + clauseCount + ' clause' + (clauseCount !== 1 ? 's' : '') + ' identified';
    if (data.risk_score != null) html += ' &middot; Risk score: ' + data.risk_score + '/100';
    html += '</p></div></div>';

    // --- Issue buckets (Phase 4B primary output) ---
    if (data.issue_buckets && data.issue_buckets.length > 0) {
      data.issue_buckets.forEach(function (bucket) {
        var bucketClass = bucket.severity === 'high' ? 'vcx-critical' : bucket.severity === 'medium' ? 'vcx-flag' : 'vcx-found';
        html += '<div class="vcx-result-section">';
        html += '<h3 class="vcx-section-title ' + bucketClass + '">' + escHtml(bucket.bucket) + ' (' + bucket.items.length + ')</h3>';
        if (bucket.severity === 'high') {
          html += '<p class="vcx-section-note">These items require review with counsel before signing.</p>';
        }
        html += '<ul class="vcx-clause-list">';
        bucket.items.forEach(function (item) {
          var dotClass = item.type === 'missing_protection' ? 'vcx-clause-missing' : (
            bucket.severity === 'high' ? 'vcx-clause-missing' :
              bucket.severity === 'medium' ? 'vcx-clause-verify' : 'vcx-clause-found'
          );
          var dot = item.type === 'missing_protection' ? '!' :
            (bucket.severity === 'low' ? '&#10003;' : '&#8594;');
          html += '<li class="vcx-clause-item ' + dotClass + '">';
          html += '<span class="vcx-clause-dot">' + dot + '</span>';
          html += '<div>';
          html += '<strong>' + escHtml(item.label) + '</strong>';
          if (item.type === 'missing_protection') {
            html += ' <span style="font-size:.75rem;opacity:.6;">(not found)</span>';
          } else if (item.confidence) {
            html += ' <span style="font-size:.75rem;opacity:.6;">(' + Math.round(item.confidence * 100) + '% match)</span>';
          }
          if (item.note) {
            html += '<p style="font-size:.82rem;color:#7BAE9E;margin:4px 0 0;">' + escHtml(item.note) + '</p>';
          }
          if (item.excerpt && item.type !== 'missing_protection') {
            html += '<p style="font-size:.78rem;color:#8A98A8;margin:4px 0 0;font-style:italic;">&ldquo;' + escHtml(item.excerpt.substring(0, 150)) + (item.excerpt.length > 150 ? '&hellip;' : '') + '&rdquo;</p>';
          }
          html += '</div></li>';
        });
        html += '</ul></div>';
      });
    }

    // --- Missing protections summary ---
    if (data.missing_protections && data.missing_protections.length > 0) {
      html += '<div class="vcx-result-section">';
      html += '<h3 class="vcx-section-title vcx-critical">Missing Protections (' + data.missing_protections.length + ')</h3>';
      html += '<p class="vcx-section-note">These protections are commonly expected for this contract type but were not detected.</p>';
      html += '<ul class="vcx-clause-list">';
      data.missing_protections.forEach(function (mp) {
        var cls = mp.severity === 'high' ? 'vcx-clause-missing' : 'vcx-clause-verify';
        var dot = mp.severity === 'high' ? '!' : '&#8594;';
        html += '<li class="vcx-clause-item ' + cls + '">';
        html += '<span class="vcx-clause-dot">' + dot + '</span>';
        html += '<div><strong>' + escHtml(mp.label) + '</strong>';
        html += '<p style="font-size:.82rem;color:#7BAE9E;margin:4px 0 0;">' + escHtml(mp.recommendation) + '</p>';
        html += '</div></li>';
      });
      html += '</ul></div>';
    }

    // --- Suggested questions for counsel ---
    if (data.suggested_questions && data.suggested_questions.length > 0) {
      html += '<div class="vcx-result-section">';
      html += '<h3 class="vcx-section-title" style="color:#4A6B62;">Questions for Counsel (' + data.suggested_questions.length + ')</h3>';
      html += '<p class="vcx-section-note">Bring these questions to your attorney before signing.</p>';
      html += '<ul class="vcx-clause-list">';
      data.suggested_questions.forEach(function (sq) {
        var icon = sq.context === 'missing' ? '!' : '?';
        var cls = sq.context === 'missing' ? 'vcx-clause-verify' : 'vcx-clause-found';
        html += '<li class="vcx-clause-item ' + cls + '">';
        html += '<span class="vcx-clause-dot" style="font-size:.85rem;">' + icon + '</span>';
        html += '<div><span style="font-size:.78rem;font-weight:600;color:#7BAE9E;text-transform:uppercase;letter-spacing:.03em;">' + escHtml(sq.category) + '</span>';
        html += '<p style="font-size:.88rem;color:#243D36;margin:3px 0 0;">' + escHtml(sq.question) + '</p>';
        html += '</div></li>';
      });
      html += '</ul></div>';
    }

    // --- Extraction quality notice ---
    if (data.word_count != null && data.word_count < 200 && data.word_count > 0) {
      html += '<div class="vcx-result-notice vcx-notice-info"><strong>Limited text extracted.</strong> This file may be partially image-based, scanned, or encrypted. Some clauses may have been missed. For scanned contracts, use the manual review route below.</div>';
    } else if (data.word_count === 0 || !data.word_count) {
      html += '<div class="vcx-result-notice vcx-notice-warning"><strong>No text could be extracted.</strong> This file may be image-based or encrypted. Please use a text-based PDF, .docx, or .txt file, or request manual review.</div>';
    }

    // --- CTA ---
    html += '<div class="vcx-result-cta">';
    html += '<p class="vcx-result-lead">This is a pattern-based pre-check. Findings depend on clause wording and document quality. An advisor review provides full interpretation.</p>';
    html += '<a class="vcx-cta-btn" href="https://calendly.com/vitacorex2025/30min" target="_blank" rel="noopener">Schedule contract review call &#8594;</a>';
    html += '<span style="display:inline-block;margin:0 12px;color:#7BAE9E;">or</span>';
    html += '<a class="vcx-cta-btn" href="/structured-case-intake.html?service=contract-review" style="background:rgba(47,107,87,.1);border-color:rgba(47,107,87,.3);color:#2F6B57;">Submit to Structured Intake &#8594;</a>';
    if (data.word_count && data.word_count > 50) {
      html += '<br style="display:block;content:\'\';margin-top:12px;">';
      html += '<button class="vcx-cta-btn" type="button" onclick="vcxGenerateStronger()" style="margin-top:12px;cursor:pointer;">View Stronger Clause Suggestions &#8594;</button>';
      html += '<p style="font-size:.78rem;color:#7BAE9E;margin:8px 0 0;">Pre-written template clauses for review with counsel. Not AI-generated.</p>';
    }
    html += '</div>';

    // --- Review ID reference ---
    if (data.review_id) {
      html += '<p style="font-size:.75rem;color:#8A98A8;margin-top:16px;">Review reference: ' + escHtml(data.review_id.substring(0, 8)) + '</p>';
    }

    // --- Disclaimer ---
    html += '<p class="vcx-disc">' + escHtml(data.disclaimer || 'Pattern-based detection only \u2014 not legal advice. Review all findings with licensed counsel before signing.') + '</p>';
    html += '</div>';

    container.innerHTML = html;
  }


  // ── Error result rendering ────────────────────────────────────────

  function renderErrorResult(message) {
    return '<div class="vcx-analysis-result">' +
      '<div class="vcx-result-notice vcx-notice-warning">' +
      '<strong>Analysis could not be completed.</strong> ' + escHtml(message) +
      '</div>' +
      '<div class="vcx-result-cta">' +
      '<a class="vcx-cta-btn" href="https://calendly.com/vitacorex2025/30min" target="_blank" rel="noopener">Request manual review &#8594;</a>' +
      '<span style="display:inline-block;margin:0 12px;color:#7BAE9E;">or</span>' +
      '<a class="vcx-cta-btn" href="/structured-case-intake.html?service=contract-review" style="background:rgba(47,107,87,.1);border-color:rgba(47,107,87,.3);color:#2F6B57;">Submit to Structured Intake &#8594;</a>' +
      '</div></div>';
  }


  // ── Bridge: convert server response to client-side analysis format ──
  // This allows the existing vcxGenerateStronger() to work with server results.

  function bridgeAnalysisForStrongerClauses(data) {
    // Build the format expected by generateStrongerClauses():
    //   { found: {key: {key, label}}, missing: [{key, label}], wordCount, hasText }
    var CLAUSE_LABELS = {
      'payment_terms': 'Payment Terms',
      'auto_renewal': 'Auto-Renewal',
      'termination': 'Termination',
      'termination_for_cause': 'Termination',
      'liability_limitation': 'Limitation of Liability',
      'liability_cap': 'Limitation of Liability',
      'liability_exclusion': 'Consequential Damages Exclusion',
      'indemnification': 'Indemnification',
      'indemnity': 'Indemnification',
      'ip_ownership': 'IP / Work Product',
      'confidentiality': 'Confidentiality / NDA',
      'arbitration': 'Dispute Resolution',
      'dispute': 'Dispute Resolution',
      'governing_law': 'Governing Law',
      'warranty': 'Warranty / Disclaimer',
      'assignment': 'Assignment',
      'non_compete': 'Non-Compete',
      'non_solicitation': 'Non-Solicitation',
      'force_majeure': 'Force Majeure',
      'notice': 'Notice Requirements',
      'exclusivity': 'Exclusivity',
      'late_fees': 'Late Fees / Interest'
    };

    // Map server clause_types to client-side keys
    var SERVER_TO_CLIENT = {
      'termination': 'termination',
      'termination_for_cause': 'termination',
      'indemnification': 'indemnity',
      'liability_limitation': 'liability_cap',
      'liability_exclusion': 'liability_cap',
      'auto_renewal': 'auto_renewal',
      'non_compete': 'exclusivity',
      'non_solicitation': 'exclusivity',
      'confidentiality': 'confidentiality',
      'governing_law': 'governing_law',
      'assignment': 'assignment',
      'payment_terms': 'payment_terms',
      'force_majeure': 'notice',
      'ip_ownership': 'ip_ownership',
      'warranty': 'warranty',
      'arbitration': 'dispute'
    };

    // All client-side clause keys
    var ALL_CLIENT_KEYS = [
      'payment_terms', 'auto_renewal', 'termination', 'liability_cap',
      'indemnity', 'ip_ownership', 'confidentiality', 'dispute',
      'warranty', 'assignment', 'notice', 'exclusivity', 'late_fees', 'governing_law'
    ];

    var found = {};
    var foundKeys = {};
    (data.clauses || []).forEach(function (c) {
      var clientKey = SERVER_TO_CLIENT[c.clause_type] || c.clause_type;
      if (!foundKeys[clientKey]) {
        foundKeys[clientKey] = true;
        found[clientKey] = {
          key: clientKey,
          label: CLAUSE_LABELS[clientKey] || c.clause_type.replace(/_/g, ' ')
        };
      }
    });

    var missing = [];
    ALL_CLIENT_KEYS.forEach(function (k) {
      if (!foundKeys[k]) {
        missing.push({
          key: k,
          label: CLAUSE_LABELS[k] || k.replace(/_/g, ' ')
        });
      }
    });

    var bridgedAnalysis = {
      found: found,
      missing: missing,
      wordCount: data.word_count || 0,
      hasText: (data.word_count || 0) > 50
    };

    // Expose to the IIFE via window setter (if available) or direct window vars
    if (typeof window._vcxSetAnalysis === 'function') {
      window._vcxSetAnalysis(bridgedAnalysis, data.filename);
    }
  }


  // ── Show advisor review section ───────────────────────────────────

  function showAdvisorSection(data) {
    var section = el('vcxAdvisorReviewSection');
    if (!section) return;

    var summary = 'File: ' + data.filename;
    if (data.word_count) summary += ' | Words: ' + data.word_count;
    if (data.risk_score != null) summary += ' | Risk Score: ' + data.risk_score + '/100';
    summary += ' | Clauses: ' + (data.clauses || []).length;
    if (data.missing_protections) summary += ' | Missing protections: ' + data.missing_protections.length;
    if (data.review_id) summary += ' | Review ID: ' + data.review_id;

    var sf = el('vcxAdvisorSummary');
    if (sf) sf.value = summary;
    section.removeAttribute('hidden');
  }

})();
