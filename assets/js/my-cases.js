(function(){
  var api = window.DocketMintApi;
  if(!api){ return; }

  var state = {
    history: null,
    selectedCaseId: '',
    selectedCase: null,
    selectedDownloads: null,
    selectedCaseIds: {},
    selectedHistoryIds: {},
    boundActions: false,
    filters: {
      serviceSlug: '',
      ownerId: ''
    }
  };

  function q(selector){ return document.querySelector(selector); }
  function escapeHtml(value){
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  function formatDate(value){
    if(!value){ return '-'; }
    try { return new Date(value).toLocaleString(); }
    catch (error){ return String(value); }
  }
  function setSelectedCase(caseId){
    state.selectedCaseId = caseId || '';
    if(caseId && api.setActiveCaseId){ api.setActiveCaseId(caseId); }
  }
  function caseIdsSelected(){
    return Object.keys(state.selectedCaseIds).filter(function(id){ return !!state.selectedCaseIds[id]; });
  }
  function historySelections(){
    var outputs = (state.history && state.history.outputs) || [];
    return outputs.filter(function(item){ return !!state.selectedHistoryIds[item.id]; }).map(function(item){
      return {
        id: item.id,
        scope_kind: item.scope_kind,
        owner_kind: item.owner_kind,
        owner_id: item.owner_id,
        service_slug: item.service_slug
      };
    });
  }

  function filteredOutputs(){
    var items = (state.history && state.history.outputs) || [];
    return items.filter(function(item){
      if(state.filters.serviceSlug && item.service_slug !== state.filters.serviceSlug){ return false; }
      if(state.filters.ownerId && item.owner_id !== state.filters.ownerId){ return false; }
      return true;
    });
  }

  async function loadCaseDetail(){
    if(!state.selectedCaseId){
      state.selectedCase = null;
      state.selectedDownloads = null;
      renderCaseDetail();
      return;
    }
    try {
      state.selectedCase = await api.getCase(state.selectedCaseId);
      state.selectedDownloads = await api.getDownloads(state.selectedCaseId);
    } catch (error){
      state.selectedCase = null;
      state.selectedDownloads = null;
    }
    renderCaseDetail();
  }

  function renderFilters(){
    var serviceSelect = q('[data-history-service-filter]');
    var ownerSelect = q('[data-history-owner-filter]');
    var filters = (state.history && state.history.filters) || {};
    if(serviceSelect){
      var services = filters.services || [];
      serviceSelect.innerHTML = '<option value="">All services</option>' + services.map(function(item){
        return '<option value="' + escapeHtml(item.slug) + '"' + (state.filters.serviceSlug === item.slug ? ' selected' : '') + '>' + escapeHtml(item.label) + '</option>';
      }).join('');
      serviceSelect.onchange = function(){
        state.filters.serviceSlug = serviceSelect.value || '';
        renderOutputsHistory();
      };
    }
    if(ownerSelect){
      var owners = filters.owners || [];
      ownerSelect.innerHTML = '<option value="">All matters and sessions</option>' + owners.map(function(item){
        return '<option value="' + escapeHtml(item.id) + '"' + (state.filters.ownerId === item.id ? ' selected' : '') + '>' + escapeHtml(item.label) + '</option>';
      }).join('');
      ownerSelect.onchange = function(){
        state.filters.ownerId = ownerSelect.value || '';
        renderOutputsHistory();
      };
    }
  }

  function renderCaseList(){
    var root = q('[data-case-history-list]');
    var summary = q('[data-case-selection-summary]');
    if(!root){ return; }
    var items = (state.history && state.history.cases) || [];
    if(summary){
      summary.textContent = caseIdsSelected().length + ' selected';
    }
    if(!items.length){
      root.innerHTML = '<div class="empty-copy">No cases yet.</div>';
      return;
    }
    root.innerHTML = items.map(function(item){
      var checked = state.selectedCaseIds[item.id] ? ' checked' : '';
      return '<article class="history-row' + (item.id === state.selectedCaseId ? ' is-active' : '') + '">' +
        '<div class="inline-actions">' +
          '<label><input type="checkbox" data-case-select="' + escapeHtml(item.id) + '"' + checked + '> Select</label>' +
        '</div>' +
        '<button class="btn btn-secondary btn-sm" type="button" data-case-row="' + escapeHtml(item.id) + '">Open</button>' +
        '<strong>' + escapeHtml(item.title) + '</strong>' +
        '<span>' + escapeHtml((item.issue_category || 'matter') + ' | ' + (item.current_stage || item.status || 'draft') + ' | ' + formatDate(item.updated_at)) + '</span>' +
      '</article>';
    }).join('');
    Array.prototype.slice.call(root.querySelectorAll('[data-case-select]')).forEach(function(input){
      input.addEventListener('change', function(){
        state.selectedCaseIds[input.getAttribute('data-case-select')] = !!input.checked;
        renderCaseList();
      });
    });
    Array.prototype.slice.call(root.querySelectorAll('[data-case-row]')).forEach(function(button){
      button.addEventListener('click', function(){
        setSelectedCase(button.getAttribute('data-case-row'));
        renderCaseList();
        loadCaseDetail();
      });
    });
  }

  function renderStandaloneSessions(){
    var root = q('[data-session-history-list]');
    if(!root){ return; }
    var items = (state.history && state.history.sessions) || [];
    if(!items.length){
      root.innerHTML = '<div class="empty-copy">No standalone sessions yet.</div>';
      return;
    }
    root.innerHTML = items.map(function(item){
      return '<article class="dashboard-list-item">' +
        '<div><strong>' + escapeHtml(item.service_label || item.title) + '</strong><p>' + escapeHtml(item.title + ' | ' + item.status) + '</p></div>' +
        '<div class="inline-actions">' +
          '<a class="btn btn-secondary btn-sm" href="' + escapeHtml(item.route) + '">Open</a>' +
          '<button class="btn btn-secondary btn-sm" type="button" data-session-delete="' + escapeHtml(item.service_slug + ':' + item.id) + '">Delete</button>' +
        '</div>' +
      '</article>';
    }).join('');
    Array.prototype.slice.call(root.querySelectorAll('[data-session-delete]')).forEach(function(button){
      button.addEventListener('click', async function(){
        var parts = String(button.getAttribute('data-session-delete') || '').split(':');
        var serviceSlug = parts[0] || '';
        var sessionId = parts[1] || '';
        if(!window.confirm('Delete this standalone session and its generated files?')){ return; }
        try {
          if(serviceSlug === 'contract_intelligence' || serviceSlug === 'contract_risk'){ await api.deleteContractIntelligenceSession(sessionId); }
          else if(serviceSlug === 'immigration_forms'){ await api.deleteImmigrationSession(sessionId); }
          else if(serviceSlug === 'dealer_contract_check' || serviceSlug === 'auto_deal_integrity'){ await api.deleteDealerContractSession(sessionId); }
          await boot();
        } catch (error){
          window.alert(error.message || 'Could not delete the standalone session.');
        }
      });
    });
  }

  function renderOutputsHistory(){
    var root = q('[data-recent-output-history]');
    var summary = q('[data-history-selection-summary]');
    if(!root){ return; }
    var items = filteredOutputs();
    if(summary){
      summary.textContent = historySelections().length + ' history items selected';
    }
    if(!items.length){
      root.innerHTML = '<div class="empty-copy">No outputs match the current filters.</div>';
      return;
    }
    root.innerHTML = items.map(function(item){
      var checked = state.selectedHistoryIds[item.id] ? ' checked' : '';
      var href = item.download_url ? api.toDownloadUrl(item.download_url) : item.route;
      return '<article class="dashboard-list-item">' +
        '<div class="inline-actions"><label><input type="checkbox" data-history-select="' + escapeHtml(item.id) + '"' + checked + '> Select</label></div>' +
        '<div><strong>' + escapeHtml(item.title) + '</strong><p>' + escapeHtml((item.service_label || item.service_slug || 'output') + ' | ' + (item.owner_label || item.context || '') + ' | ' + formatDate(item.updated_at)) + '</p></div>' +
        '<div class="inline-actions"><a class="btn btn-secondary btn-sm" href="' + escapeHtml(href) + '">Open</a></div>' +
      '</article>';
    }).join('');
    Array.prototype.slice.call(root.querySelectorAll('[data-history-select]')).forEach(function(input){
      input.addEventListener('change', function(){
        state.selectedHistoryIds[input.getAttribute('data-history-select')] = !!input.checked;
        renderOutputsHistory();
      });
    });
  }

  function renderCaseDetail(){
    var title = q('[data-case-detail-title]');
    var status = q('[data-case-detail-status]');
    var summary = q('[data-case-detail-summary]');
    var sources = q('[data-case-source-list]');
    var outputs = q('[data-case-output-list]');
    var actions = q('[data-case-detail-actions]');
    var record = state.selectedCase;
    if(!record){
      if(title){ title.textContent = 'Select a case'; }
      if(status){ status.textContent = 'Choose a matter to manage its source files and outputs.'; }
      if(summary){ summary.innerHTML = '<div class="empty-copy">Case detail appears here.</div>'; }
      if(sources){ sources.innerHTML = '<div class="empty-copy">No case selected.</div>'; }
      if(outputs){ outputs.innerHTML = '<div class="empty-copy">No case selected.</div>'; }
      if(actions){ actions.innerHTML = ''; }
      return;
    }
    if(title){ title.textContent = record.title || record.reference || record.id; }
    if(status){ status.textContent = (record.issue_category || 'matter') + ' | ' + (record.current_stage || record.status || 'draft'); }
    if(summary){
      var snapshot = record.client_snapshot || {};
      summary.innerHTML =
        '<div class="summary-grid">' +
          '<div class="summary-item"><span>Source files</span><strong>' + escapeHtml(snapshot.source_file_count || 0) + '</strong></div>' +
          '<div class="summary-item"><span>Outputs</span><strong>' + escapeHtml(snapshot.generated_document_count || 0) + '</strong></div>' +
          '<div class="summary-item"><span>Blockers</span><strong>' + escapeHtml(snapshot.blocker_count || 0) + '</strong></div>' +
          '<div class="summary-item"><span>Warnings</span><strong>' + escapeHtml(snapshot.warning_count || 0) + '</strong></div>' +
        '</div>';
    }
    if(actions){
      actions.innerHTML =
        '<a class="btn btn-secondary btn-sm" href="/app/action-center/?case=' + escapeHtml(record.id) + '">Open Action Center</a>' +
        '<a class="btn btn-secondary btn-sm" href="/app/workspace/?case=' + escapeHtml(record.id) + '">Open workspace</a>' +
        '<button class="btn btn-secondary btn-sm" type="button" data-case-delete>Delete case</button>';
      var deleteButton = actions.querySelector('[data-case-delete]');
      if(deleteButton){
        deleteButton.addEventListener('click', async function(){
          if(!window.confirm('Delete this case, its source files, and its outputs?')){ return; }
          try {
            await api.deleteCase(record.id, true);
            setSelectedCase('');
            await boot();
          } catch (error){
            window.alert(error.message || 'Could not delete the case.');
          }
        });
      }
    }
    if(sources){
      var files = record.source_files || [];
      sources.innerHTML = files.length ? files.map(function(item){
        return '<article class="dashboard-list-item">' +
          '<div><strong>' + escapeHtml(item.original_filename || item.filename) + '</strong><p>' + escapeHtml((item.file_type || 'file') + ' | ' + formatDate(item.uploaded_at)) + '</p></div>' +
          '<div class="inline-actions"><button class="btn btn-secondary btn-sm" type="button" data-source-delete="' + escapeHtml(item.id) + '">Remove file</button></div>' +
        '</article>';
      }).join('') : '<div class="empty-copy">No source files in this matter.</div>';
      Array.prototype.slice.call(sources.querySelectorAll('[data-source-delete]')).forEach(function(button){
        button.addEventListener('click', async function(){
          if(!window.confirm('Remove this uploaded file from the matter?')){ return; }
          try {
            await api.removeSourceFile(record.id, button.getAttribute('data-source-delete'));
            await loadCaseDetail();
            await refreshHistory();
          } catch (error){
            window.alert(error.message || 'Could not remove the source file.');
          }
        });
      });
    }
    if(outputs){
      var entries = (state.selectedDownloads && state.selectedDownloads.entries) || [];
      outputs.innerHTML = entries.length ? entries.map(function(item){
        return '<article class="dashboard-list-item">' +
          '<div><strong>' + escapeHtml(item.file_name) + '</strong><p>' + escapeHtml((item.category || 'output') + ' | ' + formatDate(item.generated_at)) + '</p></div>' +
          '<div class="inline-actions">' +
            (item.download_url ? '<a class="btn btn-secondary btn-sm" href="' + escapeHtml(api.toDownloadUrl(item.download_url)) + '">Download</a>' : '') +
            '<button class="btn btn-secondary btn-sm" type="button" data-output-delete="' + escapeHtml(item.id) + '">Remove output</button>' +
          '</div>' +
        '</article>';
      }).join('') : '<div class="empty-copy">No generated outputs in this matter.</div>';
      Array.prototype.slice.call(outputs.querySelectorAll('[data-output-delete]')).forEach(function(button){
        button.addEventListener('click', async function(){
          if(!window.confirm('Remove this generated output from the matter?')){ return; }
          try {
            await api.removeCaseOutput(record.id, button.getAttribute('data-output-delete'));
            await loadCaseDetail();
            await refreshHistory();
          } catch (error){
            window.alert(error.message || 'Could not remove the generated output.');
          }
        });
      });
    }
  }

  async function refreshHistory(){
    state.history = await api.getPlatformHistory({
      service_slug: state.filters.serviceSlug || '',
      owner_id: state.filters.ownerId || ''
    });
    var availableCases = (state.history && state.history.cases) || [];
    if(!state.selectedCaseId && availableCases.length){
      setSelectedCase(availableCases[0].id);
    } else if(state.selectedCaseId && !availableCases.some(function(item){ return item.id === state.selectedCaseId; })){
      setSelectedCase(availableCases.length ? availableCases[0].id : '');
    }
    renderFilters();
    renderCaseList();
    renderStandaloneSessions();
    renderOutputsHistory();
  }

  function bindActions(){
    if(state.boundActions){ return; }
    state.boundActions = true;
    var deleteSelected = q('[data-case-delete-selected]');
    var deleteAll = q('[data-case-delete-all]');
    var clearSelectedHistory = q('[data-clear-selected-history]');
    var clearHistory = q('[data-clear-history]');

    if(deleteSelected){
      deleteSelected.addEventListener('click', async function(){
        var ids = caseIdsSelected();
        if(!ids.length){
          window.alert('Select at least one case first.');
          return;
        }
        if(!window.confirm('Delete the selected cases and all files inside them?')){ return; }
        await api.bulkDeleteCases({ case_ids: ids, hard: true });
        state.selectedCaseIds = {};
        await boot();
      });
    }
    if(deleteAll){
      deleteAll.addEventListener('click', async function(){
        if(!window.confirm('Delete all visible cases in this account?')){ return; }
        await api.bulkDeleteCases({ delete_all: true, hard: true });
        state.selectedCaseIds = {};
        await boot();
      });
    }
    if(clearSelectedHistory){
      clearSelectedHistory.addEventListener('click', async function(){
        var items = historySelections();
        if(!items.length){
          window.alert('Select at least one history item first.');
          return;
        }
        if(!window.confirm('Clear the selected output history items?')){ return; }
        await api.clearSelectedHistory({ items: items });
        state.selectedHistoryIds = {};
        await refreshHistory();
        await loadCaseDetail();
      });
    }
    if(clearHistory){
      clearHistory.addEventListener('click', async function(){
        if(!window.confirm('Clear the current output history view?')){ return; }
        await api.clearHistory({
          clear_all: true,
          service_slug: state.filters.serviceSlug || null,
          owner_id: state.filters.ownerId || null
        });
        state.selectedHistoryIds = {};
        await refreshHistory();
        await loadCaseDetail();
      });
    }
  }

  async function boot(){
    try {
      bindActions();
      await refreshHistory();
      await loadCaseDetail();
    } catch (error){
      var banner = q('[data-cases-error]');
      if(banner){
        banner.hidden = false;
        banner.textContent = error.message || 'Could not load case history.';
      }
    }
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

