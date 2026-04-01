
(function(){
  var api = window.DocketMintApi;
  if(!api){ return; }

  function q(sel){ return document.querySelector(sel); }
  function params(){ try { return new URLSearchParams(window.location.search || ''); } catch (e){ return new URLSearchParams(''); } }
  function esc(value){
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  var caseId = params().get('case') || '';
  var els = {
    title: q('[data-contract-case-title]'),
    status: q('[data-contract-status]'),
    findings: q('[data-contract-findings]'),
    outputs: q('[data-contract-outputs]'),
    analyze: q('[data-contract-analyze]'),
    generate: q('[data-contract-generate]')
  };

  function rewriteLinks(){
    Array.prototype.slice.call(document.querySelectorAll('[data-preserve-case]')).forEach(function(link){
      var href = link.getAttribute('href') || '';
      try {
        var url = new URL(href, window.location.origin);
        if(caseId){ url.searchParams.set('case', caseId); }
        link.setAttribute('href', url.pathname + url.search + url.hash);
      } catch (e){}
    });
  }

  function setStatus(message){ if(els.status){ els.status.textContent = message; } }

  function renderFindings(review){
    var findings = (review && review.findings) || [];
    if(!els.findings){ return; }
    if(!findings.length){
      els.findings.innerHTML = '<p class="empty-state">No findings yet.</p>';
      return;
    }
    els.findings.innerHTML = findings.map(function(item){
      return '<article class="card">'+
        '<div class="stack-inline"><strong>' + esc(item.title) + '</strong><span class="badge">' + esc(item.risk_severity || 'info') + '</span></div>'+
        '<p><strong>Source:</strong> ' + esc(item.source_file || 'unknown') + '</p>'+
        '<p><strong>Extracted text:</strong> ' + esc(item.extracted_text || 'n/a') + '</p>'+
        '<p><strong>Implication:</strong> ' + esc(item.practical_implication || 'Review required.') + '</p>'+
        '<p><strong>Recommended correction:</strong> ' + esc(item.recommended_correction || 'Review required.') + '</p>'+
      '</article>';
    }).join('');
  }

  function renderOutputs(review){
    if(!els.outputs){ return; }
    var rows = [];
    if(review && review.revised_contract_download_url){
      rows.push('<p><a class="btn btn-secondary" href="' + esc(api.toDownloadUrl(review.revised_contract_download_url)) + '">Download revised DOCX</a></p>');
    }
    if(review && review.change_memo_download_url){
      rows.push('<p><a class="btn btn-secondary" href="' + esc(api.toDownloadUrl(review.change_memo_download_url)) + '">Download change memo</a></p>');
    }
    els.outputs.innerHTML = rows.length ? rows.join('') : '<p class="empty-state">No revised contract has been generated yet.</p>';
  }

  async function loadCase(){
    if(!caseId){
      setStatus('Open this page with a ?case=case_xxx parameter.');
      return;
    }
    try {
      var record = await api.getCase(caseId);
      if(els.title){ els.title.textContent = record.title || record.reference || record.id; }
      if(record.contract_review){
        renderFindings(record.contract_review);
        renderOutputs(record.contract_review);
      }
      setStatus('Ready for contract analysis.');
    } catch (error){
      setStatus(error.message || 'Could not load case.');
    }
  }

  if(els.analyze){
    els.analyze.addEventListener('click', async function(){
      if(!caseId){ return; }
      setStatus('Analyzing uploaded contract files…');
      try {
        var payload = await api.analyzeContractReview(caseId);
        renderFindings(payload.contract_review);
        renderOutputs(payload.contract_review);
        setStatus('Contract analysis completed.');
      } catch (error){
        setStatus(error.message || 'Analysis failed.');
      }
    });
  }

  if(els.generate){
    els.generate.addEventListener('click', async function(){
      if(!caseId){ return; }
      setStatus('Generating revised draft…');
      try {
        var payload = await api.generateContractDraft(caseId);
        renderFindings(payload.contract_review);
        renderOutputs(payload.contract_review);
        setStatus('Revised contract outputs generated.');
      } catch (error){
        setStatus(error.message || 'Draft generation failed.');
      }
    });
  }

  rewriteLinks();
  loadCase();
})();
