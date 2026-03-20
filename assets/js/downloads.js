(function(){
  var api = window.DocketMintApi;
  var i18n = window.VCXI18n;
  if(!api){ return; }

  function q(sel){ return document.querySelector(sel); }
  function params(){ try { return new URLSearchParams(window.location.search || ''); } catch (e){ return new URLSearchParams(''); } }
  function esc(value){
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }
  function t(key, fallback){
    return i18n ? i18n.t(key, fallback) : (fallback || key);
  }

  function humanLabel(value, fallback){
    var text = String(value == null ? '' : value).trim();
    if(!text){ return fallback || '-'; }
    return text.replace(/_/g, ' ');
  }

  function canReviewPackets(){
    return !window.DocketMintAuth || !window.DocketMintAuth.canGeneratePackets || window.DocketMintAuth.canGeneratePackets();
  }

  var state = {
    caseId: params().get('case') || (api.getActiveCaseId ? api.getActiveCaseId() : '') || '',
    payload: null,
    caseTitle: ''
  };

  var els = {
    title: q('[data-download-case-title]'),
    status: q('[data-download-status]'),
    refresh: q('[data-download-refresh]'),
    ledger: q('[data-download-ledger]'),
    archive: q('[data-packet-archive]')
  };

  function rewriteLinks(){
    Array.prototype.slice.call(document.querySelectorAll('[data-preserve-case]')).forEach(function(link){
      var href = link.getAttribute('href') || '';
      try {
        var url = new URL(href, window.location.origin);
        if(state.caseId){ url.searchParams.set('case', state.caseId); }
        link.setAttribute('href', url.pathname + url.search + url.hash);
      } catch (e){}
    });
  }

  function setStatus(message){
    if(els.status){ els.status.textContent = message; }
  }

  function setCaseTitle(value){
    if(els.title){ els.title.textContent = value || t('downloads.select_case', 'Select a case'); }
  }

  function renderLedger(){
    if(!els.ledger){ return; }
    var entries = (state.payload && state.payload.entries) || [];
    if(!entries.length){
      els.ledger.innerHTML = '<p class="empty-state">' + esc(t('downloads.empty', 'No generated outputs available.')) + '</p>';
      return;
    }
    els.ledger.innerHTML = entries.map(function(item){
      var link = item.download_url ? api.toDownloadUrl(item.download_url) : '#';
      return '<article class="card">' +
        '<p><strong>' + esc(item.file_name) + '</strong></p>' +
        '<p>' + esc(t('downloads.generated', 'Generated')) + ': ' + esc(item.generated_at || t('downloads.unknown', 'Unknown')) + '</p>' +
        '<p>' + esc(t('downloads.downloaded', 'Downloaded')) + ': ' + esc(item.downloaded_at || t('downloads.not_yet', 'No download recorded')) + '</p>' +
        '<p><a class="btn btn-secondary" data-ledger-id="' + esc(item.id) + '" href="' + esc(link) + '">' + esc(t('downloads.redownload', 'Download again')) + '</a></p>' +
      '</article>';
    }).join('');
    Array.prototype.slice.call(els.ledger.querySelectorAll('[data-ledger-id]')).forEach(function(link){
      link.addEventListener('click', function(){
        var ledgerId = link.getAttribute('data-ledger-id');
        api.markDownload(state.caseId, ledgerId).catch(function(){});
      });
    });
  }

  function renderPacketArchive(){
    if(!els.archive){ return; }
    var entries = (state.payload && state.payload.packet_archive) || [];
    if(!entries.length){
      els.archive.innerHTML = '<p class="empty-state">No packet versions available.</p>';
      return;
    }
    els.archive.innerHTML = entries.map(function(item){
      var zipLink = item.zip_download_url ? api.toDownloadUrl(item.zip_download_url) : '';
      var reviewButtons = canReviewPackets()
        ? '<div class="stack-inline">' +
            '<button class="btn btn-secondary btn-sm" data-archive-id="' + esc(item.id) + '" data-release-state="ready_for_review" type="button">Ready for review</button>' +
            '<button class="btn btn-secondary btn-sm" data-archive-id="' + esc(item.id) + '" data-release-state="approved_for_release" type="button">Approve for release</button>' +
          '</div>'
        : '';
      return '<article class="card">' +
        '<p><strong>Packet v' + esc(item.version_number || 0) + '</strong></p>' +
        '<p>QA status: ' + esc(humanLabel(item.generation_qa_status, 'ready for review')) + '</p>' +
        '<p>Release state: ' + esc(humanLabel(item.release_state, 'ready for review')) + '</p>' +
        '<p>Outputs: ' + esc(String(item.document_count || 0)) + ' | Review required: ' + esc(item.review_required ? 'yes' : 'no') + '</p>' +
        '<p>Generated: ' + esc(item.created_at || t('downloads.unknown', 'Unknown')) + '</p>' +
        (zipLink ? '<p><a class="btn btn-secondary" href="' + esc(zipLink) + '" target="_blank" rel="noopener">Download ZIP packet</a></p>' : '') +
        reviewButtons +
      '</article>';
    }).join('');
    Array.prototype.slice.call(els.archive.querySelectorAll('[data-archive-id]')).forEach(function(button){
      button.addEventListener('click', async function(){
        try {
          await api.updatePacketArchiveReleaseState(
            state.caseId,
            button.getAttribute('data-archive-id'),
            button.getAttribute('data-release-state')
          );
          await refresh();
          setStatus('Packet archive updated.');
        } catch (error){
          setStatus(error.message || 'Could not update packet review state.');
        }
      });
    });
  }

  async function refresh(){
    rewriteLinks();
    if(!state.caseId){
      state.payload = null;
      state.caseTitle = '';
      setCaseTitle('');
      setStatus(t('downloads.case_required', 'Open this page with an active case.'));
      renderLedger();
      renderPacketArchive();
      return;
    }
    setStatus(t('downloads.loading', 'Loading downloads ledger...'));
    try {
      var record = await api.getCase(state.caseId);
      state.caseTitle = record.title || record.reference || record.id || '';
      setCaseTitle(state.caseTitle);
      state.payload = await api.getDownloads(state.caseId);
      renderLedger();
      renderPacketArchive();
      setStatus(t('downloads.current', 'Downloads ledger is current.'));
    } catch (error){
      state.payload = null;
      renderLedger();
      renderPacketArchive();
      setStatus(error.message || t('downloads.load_failed', 'Could not load downloads.'));
    }
  }

  if(els.refresh){
    els.refresh.addEventListener('click', refresh);
  }

  document.addEventListener('vcx:i18n:change', function(){
    setCaseTitle(state.caseTitle);
    renderLedger();
    renderPacketArchive();
    if(state.caseId && state.payload){
      setStatus(t('downloads.current', 'Downloads ledger is current.'));
    } else if(!state.caseId){
      setStatus(t('downloads.case_required', 'Open this page with an active case.'));
    }
  });

  refresh();
})();
