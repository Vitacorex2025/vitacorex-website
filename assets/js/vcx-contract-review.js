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
        // After pattern results, request AI-enhanced analysis
        requestAIAnalysis(file, data);
      })
      .catch(function () {
        analyzeLocal(file, true);
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

  // --- AI-enhanced analysis (calls /api/ai/contract/analyze) ---
  function requestAIAnalysis(file, patternData) {
    var aiPanel = document.getElementById('vcxAIPanel');
    if (!aiPanel) {
      // Create AI panel below results
      aiPanel = document.createElement('div');
      aiPanel.id = 'vcxAIPanel';
      aiPanel.style.cssText = 'margin-top:24px;';
      if (resultPanel) resultPanel.appendChild(aiPanel);
    }
    aiPanel.innerHTML = '<div style="background:linear-gradient(135deg,rgba(45,138,130,.08),rgba(91,186,167,.06));border:1px solid rgba(45,138,130,.15);border-radius:10px;padding:18px 20px;"><div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;"><span style="font-size:1.1rem;">&#129302;</span><span style="font-size:.88rem;font-weight:700;color:#2D8A82;">AI Analysis</span><span class="vcx-ai-dot" style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#5BBAA7;animation:vcxPulse 1.2s infinite;"></span></div><p style="font-size:.82rem;color:rgba(36,61,54,.6);margin:0;">Requesting AI-powered deep analysis...</p></div>';

    var fd = new FormData();
    fd.append('file', file);

    var aiOpts = { method: 'POST', body: fd };
    if (typeof AbortSignal !== 'undefined' && AbortSignal.timeout) {
      aiOpts.signal = AbortSignal.timeout(45000);
    }

    fetch(API_BASE + '/api/ai/contract/analyze', aiOpts)
      .then(function (res) {
        if (!res.ok) throw new Error('AI HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        if (data.ok && data.ai_powered && data.analysis) {
          renderAIPanel(aiPanel, data.analysis, true);
          // Also offer AI improvement
          aiPanel.innerHTML += '<div style="text-align:center;margin-top:14px;"><button type="button" id="vcxAIImproveBtn" style="background:#2D8A82;color:#fff;border:none;border-radius:8px;padding:10px 24px;font-size:.85rem;font-weight:600;cursor:pointer;">Generate Stronger Clauses with AI</button></div>';
          var improveBtn = document.getElementById('vcxAIImproveBtn');
          if (improveBtn) {
            improveBtn.addEventListener('click', function () {
              improveBtn.disabled = true;
              improveBtn.textContent = 'Generating...';
              requestAIImprove(file);
            });
          }
        } else {
          renderAIPanel(aiPanel, data.error || 'AI analysis not available. Pattern-based results shown above.', false);
        }
      })
      .catch(function () {
        renderAIPanel(aiPanel, 'AI service is warming up. Pattern-based analysis is shown above. Try again in a minute for AI-enhanced results.', false);
      });
  }

  function requestAIImprove(file) {
    var improvePanel = document.getElementById('vcxAIImprovePanel');
    if (!improvePanel) {
      improvePanel = document.createElement('div');
      improvePanel.id = 'vcxAIImprovePanel';
      improvePanel.style.cssText = 'margin-top:16px;';
      var aiPanel = document.getElementById('vcxAIPanel');
      if (aiPanel) aiPanel.appendChild(improvePanel);
    }
    improvePanel.innerHTML = '<p style="font-size:.82rem;color:#2D8A82;">Generating improved clause suggestions...</p>';

    var fd = new FormData();
    fd.append('file', file);

    fetch(API_BASE + '/api/ai/contract/improve', { method: 'POST', body: fd })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.ok && data.analysis) {
          renderAIPanel(improvePanel, data.analysis, true, 'AI Improvement Suggestions');
        } else {
          improvePanel.innerHTML = '<p style="font-size:.82rem;color:#F5A623;">Could not generate improvements. ' + (data.error || '') + '</p>';
        }
      })
      .catch(function () {
        improvePanel.innerHTML = '<p style="font-size:.82rem;color:#F5A623;">AI improvement service unavailable.</p>';
      });
  }

  function renderAIPanel(container, content, isSuccess, title) {
    var bg = isSuccess ? 'linear-gradient(135deg,rgba(45,138,130,.08),rgba(91,186,167,.06))' : 'rgba(245,166,35,.06)';
    var border = isSuccess ? 'rgba(45,138,130,.15)' : 'rgba(245,166,35,.15)';
    var icon = isSuccess ? '&#129302;' : '&#9888;';
    var heading = title || 'AI Analysis';
    var badge = isSuccess ? '<span style="font-size:.65rem;background:#2D8A82;color:#fff;border-radius:4px;padding:2px 6px;margin-left:6px;">GPT-4o</span>' : '';

    // Convert markdown-like formatting to HTML
    var html = escapeHtml(content)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/^### (.+)$/gm, '<h4 style="font-size:.88rem;color:#2D8A82;margin:14px 0 6px;">$1</h4>')
      .replace(/^## (.+)$/gm, '<h3 style="font-size:.95rem;color:#2E4F46;margin:16px 0 8px;">$1</h3>')
      .replace(/^- (.+)$/gm, '<li style="font-size:.82rem;margin-bottom:3px;">$1</li>')
      .replace(/\n/g, '<br>');

    // Wrap consecutive <li> in <ul>
    html = html.replace(/((?:<li[^>]*>.*?<\/li>(?:<br>)?)+)/g, '<ul style="margin:4px 0 8px;padding-left:18px;">$1</ul>');
    html = html.replace(/<br><\/ul>/g, '</ul>');

    container.innerHTML = '<div style="background:' + bg + ';border:1px solid ' + border + ';border-radius:10px;padding:18px 20px;">' +
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">' +
      '<span style="font-size:1.1rem;">' + icon + '</span>' +
      '<span style="font-size:.88rem;font-weight:700;color:#2D8A82;">' + heading + '</span>' + badge +
      '</div>' +
      '<div style="font-size:.84rem;line-height:1.7;color:var(--vcx-ink-body,#243D36);">' + html + '</div>' +
      '</div>';
  }

  // --- Client-side fallback analysis -----------------------
  var CLAUSE_PATTERNS = [
    { type: 'confidentiality',    rx: /\b(confidential|non-disclosure|nda|proprietary\s+information|trade\s+secret)/gi, risk: 'caution', note: 'Contains confidentiality provisions — verify scope and duration.' },
    { type: 'indemnification',    rx: /\b(indemnif|hold\s+harmless|defend\s+and\s+indemnify)/gi, risk: 'high_risk', note: 'Indemnification clause detected — review scope of liability assumed.' },
    { type: 'limitation_of_liability', rx: /\b(limitation\s+of\s+liability|consequential\s+damages|aggregate\s+liability|cap\s+on\s+damages)/gi, risk: 'caution', note: 'Liability cap provision — verify amount and exclusions.' },
    { type: 'termination',        rx: /\b(terminat|cancel|expir|right\s+to\s+terminate)/gi, risk: 'neutral', note: 'Termination provisions detected.' },
    { type: 'non_compete',        rx: /\b(non-compete|noncompete|non-competition|restrictive\s+covenant)/gi, risk: 'high_risk', note: 'Non-compete clause — must comply with F.S. 542.335 in Florida.' },
    { type: 'non_solicitation',   rx: /\b(non-solicitation|nonsolicit|shall\s+not\s+solicit)/gi, risk: 'caution', note: 'Non-solicitation restriction detected.' },
    { type: 'governing_law',      rx: /\b(governing\s+law|governed\s+by|laws\s+of\s+the\s+state)/gi, risk: 'neutral', note: 'Governing law clause identified.' },
    { type: 'arbitration',        rx: /\b(arbitrat|mediat|dispute\s+resolution|binding\s+arbitration)/gi, risk: 'caution', note: 'Alternative dispute resolution clause — may waive jury trial rights.' },
    { type: 'payment_terms',      rx: /\b(payment|compensation|fee|invoice|net\s+\d+|billing)/gi, risk: 'neutral', note: 'Payment terms detected.' },
    { type: 'intellectual_property', rx: /\b(intellectual\s+property|work\s+product|copyright|patent|trademark|work\s+for\s+hire)/gi, risk: 'caution', note: 'IP ownership provisions — verify who retains rights to work product.' },
    { type: 'force_majeure',      rx: /\b(force\s+majeure|act\s+of\s+god|unforeseeable|pandemic|natural\s+disaster)/gi, risk: 'neutral', note: 'Force majeure clause detected.' },
    { type: 'assignment',         rx: /\b(assign|transfer|successor|delegate)/gi, risk: 'neutral', note: 'Assignment provisions present.' },
    { type: 'warranty',           rx: /\b(warrant|represent|guarantee|as-is|disclaimer)/gi, risk: 'caution', note: 'Warranty or disclaimer provisions — review carefully.' },
    { type: 'severability',       rx: /\b(severab|invalid\s+provision|unenforceable)/gi, risk: 'neutral', note: 'Severability clause detected.' },
    { type: 'entire_agreement',   rx: /\b(entire\s+agreement|integration|supersed|merger\s+clause)/gi, risk: 'neutral', note: 'Integration clause — prior agreements may be voided.' },
    { type: 'attorneys_fees',     rx: /\b(attorney.?s?\s+fees|prevailing\s+party|legal\s+costs|f\.s\.\s+57)/gi, risk: 'caution', note: 'Attorney\'s fees provision — check if prevailing party recovers costs.' },
    { type: 'auto_renewal',       rx: /\b(auto.?renew|automatic\s+renewal|evergreen|shall\s+renew)/gi, risk: 'high_risk', note: 'Auto-renewal clause — may lock in obligations without active consent.' },
    { type: 'liquidated_damages', rx: /\b(liquidated\s+damages|penalty|forfeiture)/gi, risk: 'high_risk', note: 'Liquidated damages provision — verify enforceability and reasonableness.' }
  ];

  var MISSING_CHECKS = [
    { label: 'Data Protection / Privacy',   rx: /\b(data\s+protection|privacy|gdpr|ccpa|personal\s+data)/gi, severity: 'high', rec: 'Consider adding data protection and privacy compliance terms.' },
    { label: 'Insurance Requirements',      rx: /\b(insurance|coverage|policy\s+limits)/gi, severity: 'medium', rec: 'Consider requiring proof of insurance.' },
    { label: 'Notice Provisions',           rx: /\b(notice|written\s+notice|certified\s+mail)/gi, severity: 'medium', rec: 'Add formal notice requirements with method and address.' },
    { label: 'Amendment Clause',            rx: /\b(amend|modif|written\s+consent)/gi, severity: 'low', rec: 'Add clause requiring written amendments only.' },
    { label: 'Waiver Provision',            rx: /\b(waiver|failure\s+to\s+enforce)/gi, severity: 'low', rec: 'Add clause stating failure to enforce does not waive rights.' },
    { label: 'Electronic Signatures',       rx: /\b(electronic\s+signature|e-sign|f\.s\.\s+668)/gi, severity: 'low', rec: 'Consider adding electronic signature validity clause (F.S. 668.50).' }
  ];

  function extractTextFromFile(file, cb) {
    var reader = new FileReader();
    reader.onload = function() {
      var text = reader.result;
      if (file.name.toLowerCase().endsWith('.pdf')) {
        var chunks = [];
        var matches = text.match(/\(([^)]{2,})\)/g);
        if (matches) {
          matches.forEach(function(m) {
            var clean = m.slice(1, -1).replace(/\\n/g, '\n').replace(/\\\\/g, '\\').replace(/\\[()]/g, '');
            if (clean.length > 3 && /[a-zA-Z]/.test(clean)) chunks.push(clean);
          });
        }
        var ascii = text.replace(/[^\x20-\x7E\n]/g, ' ').replace(/\s{3,}/g, ' ');
        chunks.push(ascii);
        cb(chunks.join(' '));
      } else {
        cb(text);
      }
    };
    reader.onerror = function() { cb(''); };
    if (file.name.toLowerCase().endsWith('.pdf')) {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsText(file);
    }
  }

  function analyzeLocal(file, skipAI) {
    showMessage('Server unavailable — running local pattern analysis...', 'info');
    extractTextFromFile(file, function(text) {
      if (!text || text.length < 20) {
        showMessage('Could not extract text from file. Try uploading a .txt or .md file for best results.', 'warn');
        return;
      }
      var clauses = [];
      var riskPoints = 0;
      CLAUSE_PATTERNS.forEach(function(pat) {
        var matches = text.match(pat.rx);
        if (matches && matches.length > 0) {
          var idx = text.search(pat.rx);
          var start = Math.max(0, idx - 40);
          var end = Math.min(text.length, idx + 120);
          var excerpt = text.slice(start, end).replace(/\s+/g, ' ').trim();
          if (start > 0) excerpt = '...' + excerpt;
          if (end < text.length) excerpt = excerpt + '...';
          var conf = Math.min(0.95, 0.5 + (matches.length * 0.1));
          clauses.push({ clause_type: pat.type, excerpt: excerpt, risk_level: pat.risk, note: pat.note + ' (Found ' + matches.length + ' reference' + (matches.length > 1 ? 's' : '') + ')', confidence: conf });
          if (pat.risk === 'high_risk') riskPoints += 15;
          else if (pat.risk === 'caution') riskPoints += 5;
        }
      });
      var missing = [];
      MISSING_CHECKS.forEach(function(chk) {
        if (!chk.rx.test(text)) {
          missing.push({ label: chk.label, severity: chk.severity, recommendation: chk.rec });
          if (chk.severity === 'high') riskPoints += 10;
          else if (chk.severity === 'medium') riskPoints += 5;
        }
      });
      var riskScore = Math.min(100, riskPoints);
      var highRisk = clauses.filter(function(c) { return c.risk_level === 'high_risk'; });
      var summary = 'Local analysis detected ' + clauses.length + ' clause types in ' + file.name + '. ';
      if (highRisk.length > 0) summary += highRisk.length + ' high-risk provisions found. ';
      if (missing.length > 0) summary += missing.length + ' potentially missing protections identified.';
      renderResults({
        status: 'local-scan', filename: file.name,
        review_id: 'local-' + Date.now().toString(36),
        risk_score: riskScore, risk_summary: summary,
        clauses: clauses, missing_protections: missing,
        suggested_questions: highRisk.length > 0 ? [
          { category: 'High Risk', question: 'Are the indemnification and liability terms acceptable?', context: 'detected' },
          { category: 'High Risk', question: 'Have non-compete restrictions been reviewed for enforceability under Florida law (F.S. 542.335)?', context: 'detected' },
          { category: 'General', question: 'Has qualified counsel reviewed this agreement before execution?', context: 'missing' }
        ] : [{ category: 'General', question: 'Has qualified counsel reviewed this agreement before execution?', context: 'missing' }]
      });
      // Also try AI analysis even when server pattern-analysis failed
      if (!skipAI) requestAIAnalysis(file, null);
    });
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
    html += '<div id="vcxGenAITips" style="margin:16px 0;"></div>';
    html += '<div class="cr-gen-actions">';
    html += '<button type="button" class="cr-gen-another" id="vcxGenAnother">Generate Another</button>';
    html += '</div>';
    html += '<p class="cr-gen-disclaimer">' + escapeHtml(data.disclaimer) + '</p>';
    html += '</div>';

    genResult.innerHTML = html;

    // Request AI tips for the generated contract
    requestAIContractTips(data);

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

  // --- AI tips for generated contracts ----------------------
  function requestAIContractTips(genData) {
    var tipsEl = document.getElementById('vcxGenAITips');
    if (!tipsEl) return;
    tipsEl.innerHTML = '<div style="background:linear-gradient(135deg,rgba(45,138,130,.08),rgba(91,186,167,.06));border:1px solid rgba(45,138,130,.15);border-radius:10px;padding:14px 16px;"><div style="display:flex;align-items:center;gap:8px;"><span>&#129302;</span><span style="font-size:.82rem;font-weight:600;color:#2D8A82;">Getting AI review tips...</span><span class="vcx-ai-dot" style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#5BBAA7;animation:vcxPulse 1.2s infinite;"></span></div></div>';

    // Download the generated file and send to AI for review
    fetch(API_BASE + genData.download_url)
      .then(function (res) { return res.blob(); })
      .then(function (blob) {
        var fd = new FormData();
        fd.append('file', blob, genData.filename);
        fd.append('contract_type', genData.contract_type);
        return fetch(API_BASE + '/api/ai/contract/analyze', { method: 'POST', body: fd });
      })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.ok && data.ai_powered && data.analysis) {
          renderAIPanel(tipsEl, data.analysis, true, 'AI Review of Generated Contract');
        } else {
          tipsEl.innerHTML = '<div style="background:rgba(45,138,130,.06);border:1px solid rgba(45,138,130,.12);border-radius:8px;padding:12px 16px;font-size:.82rem;color:#2D8A82;">&#128161; Tip: Upload this DOCX to the Analyze tab for AI-powered clause review.</div>';
        }
      })
      .catch(function () {
        tipsEl.innerHTML = '<div style="background:rgba(45,138,130,.06);border:1px solid rgba(45,138,130,.12);border-radius:8px;padding:12px 16px;font-size:.82rem;color:#2D8A82;">&#128161; Tip: Upload this DOCX to the Analyze tab for AI-powered clause review.</div>';
      });
  }

  // --- Public namespace ------------------------------------
  window.VCX_ContractReview = {
    analyze: analyze,
    loadReport: loadReport,
    generateContract: generateContract
  };
})();
