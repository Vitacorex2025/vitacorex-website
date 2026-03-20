(function(){
  var runtime = window.DocketMintRuntime || { apiBaseUrl: '/api', apiBaseCandidates: ['/api'], backendOrigin: '' };
  var resolvedBasePromise = null;
  var activeCaseStorage = null;

  function isSameOriginOnlyMode(){
    return Boolean(runtime && (runtime.enforceSameOriginApi || runtime.publicProxyMode || runtime.authSameOriginOnly));
  }

  function safeStorageSet(key, value){
    if(isSameOriginOnlyMode()){ return; }
    try { if(window.localStorage){ window.localStorage.setItem(key, value); } } catch (error){}
  }

  function safeStorageRemove(key){
    try { if(window.localStorage){ window.localStorage.removeItem(key); } } catch (error){}
  }

  function getActiveCaseStorage(){
    if(activeCaseStorage !== null){
      return activeCaseStorage;
    }
    try {
      activeCaseStorage = window.sessionStorage || null;
      return activeCaseStorage;
    } catch (error){
      activeCaseStorage = null;
      return activeCaseStorage;
    }
  }

  function getActiveCaseId(){
    try {
      var storage = getActiveCaseStorage();
      return storage ? (storage.getItem('docketmint.activeCaseId') || '') : '';
    }
    catch (error){ return ''; }
  }

  function setActiveCaseId(value){
    if(!value){ clearActiveCaseId(); return ''; }
    try {
      var storage = getActiveCaseStorage();
      if(storage){ storage.setItem('docketmint.activeCaseId', String(value)); }
    } catch (error){}
    return String(value);
  }

  function clearActiveCaseId(){
    try {
      var storage = getActiveCaseStorage();
      if(storage){ storage.removeItem('docketmint.activeCaseId'); }
    } catch (error){}
    return '';
  }

  function isMissingCaseError(error){
    var status = Number(error && error.status || 0);
    var detail = error && error.detail;
    var message = String(
      (error && error.message)
      || (typeof detail === 'string' ? detail : '')
      || (detail && detail.message)
      || ''
    ).toLowerCase();
    return status === 404 && message.indexOf('does not exist') !== -1;
  }

  async function ensureValidActiveCaseId(){
    var caseId = getActiveCaseId();
    if(!caseId){ return ''; }
    try {
      await request('/cases/' + encodeURIComponent(caseId));
      return caseId;
    } catch (error){
      if(isMissingCaseError(error)){
        clearActiveCaseId();
        return '';
      }
      throw error;
    }
  }


  function normalizeBase(url){
    if(!url){ return ''; }
    return String(url).trim().replace(/\/$/, '');
  }

  function unique(values){
    var seen = {};
    return (values || []).map(function(value){ return normalizeBase(value); }).filter(function(value){
      if(!value || seen[value]){ return false; }
      seen[value] = true;
      return true;
    });
  }

  function timeoutAfter(ms, message){
    return new Promise(function(_, reject){
      window.setTimeout(function(){
        reject({ status: 0, message: message || 'Request timed out.', detail: null, raw: null, url: '' });
      }, ms);
    });
  }

  function joinUrl(base, path){
    var normalizedBase = String(base || '').replace(/\/$/, '');
    if(/^https?:\/\//i.test(path)){ return path; }
    if(path.charAt(0) === '/'){ return normalizedBase + path; }
    return normalizedBase + '/' + path;
  }

  function backendOriginFromBase(base){
    base = normalizeBase(base);
    if(/^https?:\/\//i.test(base)){
      return base.replace(/\/api$/i, '').replace(/\/$/, '');
    }
    return window.location.origin.replace(/\/$/, '');
  }

  function buildUrlFromBase(base, path){
    var normalizedBase = normalizeBase(base);
    if(/^https?:\/\//i.test(path)){ return path; }
    if(normalizedBase.charAt(0) === '/'){
      return joinUrl(window.location.origin, normalizedBase + path);
    }
    return joinUrl(normalizedBase, path);
  }

  function activeApiBase(){
    if(isSameOriginOnlyMode()){
      return '/api';
    }
    return normalizeBase(runtime.resolvedApiBaseUrl || runtime.apiBaseUrl || '/api');
  }

  function activeAuthApiBase(){
    if(isSameOriginOnlyMode()){
      safeStorageRemove('docketmint.apiBaseUrl');
      runtime.savedApiBaseUrl = '';
      runtime.canonicalAuthApiBase = '/api';
      runtime.apiBaseCandidates = ['/api'];
      return '/api';
    }
    return normalizeBase(runtime.canonicalAuthApiBase || activeApiBase() || '/api');
  }

  function activeBackendOrigin(){
    if(isSameOriginOnlyMode()){
      return window.location.origin.replace(/\/$/, '');
    }
    return (runtime.resolvedBackendOrigin || runtime.backendOrigin || window.location.origin).replace(/\/$/, '');
  }

  async function parseResponse(response){
    var contentType = response.headers.get('content-type') || '';
    if(contentType.indexOf('application/json') !== -1){
      return response.json();
    }
    return response.text();
  }

  function inferDeploymentMessage(payload, response, url){
    var contentType = (response && response.headers && response.headers.get('content-type')) || '';
    var textPayload = typeof payload === 'string' ? payload : '';
    if(contentType.indexOf('text/html') !== -1 || /^\s*</.test(textPayload || '')){
      return 'API route returned HTML instead of JSON. The workspace is loading, but this origin is not serving FastAPI for ' + url + '.';
    }
    if(response && response.status === 404){
      return 'API route not found at ' + url + '. This usually means the frontend is deployed without the FastAPI backend or the reverse proxy is not forwarding /api.';
    }
    if(response && response.status >= 500){
      return 'Backend error at ' + url + '. Check FastAPI startup logs and storage/template initialization.';
    }
    return 'Request failed.';
  }

  function normalizeError(payload, response, url){
    var status = response ? response.status : 0;
    if(payload && typeof payload === 'object'){
      if(payload.error && typeof payload.error === 'object'){
        if(payload.error.detail && typeof payload.error.detail === 'object'){
          return {
            status: status,
            message: payload.error.message || payload.error.detail.message || inferDeploymentMessage(payload, response, url),
            detail: payload.error.detail,
            raw: payload,
            url: url
          };
        }
        if(payload.error.message){
          return {
            status: status,
            message: payload.error.message,
            detail: payload.error.detail || payload.error,
            raw: payload,
            url: url
          };
        }
      }
      if(payload.detail){
        if(typeof payload.detail === 'string'){
          return { status: status, message: payload.detail, detail: payload.detail, raw: payload, url: url };
        }
        if(payload.detail.message){
          return { status: status, message: payload.detail.message, detail: payload.detail, raw: payload, url: url };
        }
        return { status: status, message: payload.message || inferDeploymentMessage(payload, response, url), detail: payload.detail, raw: payload, url: url };
      }
      if(payload.message){
        return { status: status, message: payload.message, detail: payload, raw: payload, url: url };
      }
    }
    return {
      status: status,
      message: inferDeploymentMessage(payload, response, url),
      detail: payload || null,
      raw: payload,
      url: url
    };
  }

  function shouldTryAlternateBase(error){
    return !error || error.status === 0 || error.status === 404 || /returned HTML/i.test(error.message || '');
  }

  function pathRequiresSameOriginAuth(path){
    var normalized = String(path || '');
    return /^\/(?:auth\/(?:session|login|signup|logout|diagnostics)(?:\?|$)|me(?:\/|\?|$))/i.test(normalized);
  }


  function preferredBaseFromStatus(candidateBase, systemStatus){
    var fallback = normalizeBase(candidateBase);
    if(!systemStatus || typeof systemStatus !== 'object'){
      return fallback;
    }
    var canonical = normalizeBase(systemStatus.canonical_api_base || systemStatus.public_api_url || '');
    if(canonical){
      return canonical;
    }
    return fallback;
  }

  function setResolvedBase(base, systemStatus){
    var normalized = preferredBaseFromStatus(base, systemStatus);
    runtime.apiBaseUrl = normalized;
    runtime.resolvedApiBaseUrl = normalized;
    if(isSameOriginOnlyMode() || normalized === '/api'){
      runtime.canonicalAuthApiBase = '/api';
    } else if(!runtime.canonicalAuthApiBase){
      runtime.canonicalAuthApiBase = normalized;
    }
    runtime.backendOrigin = backendOriginFromBase(normalized);
    runtime.resolvedBackendOrigin = runtime.backendOrigin;
    runtime.sameOriginMode = normalized.charAt(0) === '/';
    runtime.backendStatus = systemStatus || runtime.backendStatus || null;
  }

  function syncSavedBase(resolvedBase){
    if(isSameOriginOnlyMode()){
      safeStorageRemove('docketmint.apiBaseUrl');
      runtime.savedApiBaseUrl = '';
      return;
    }
    var normalizedResolved = normalizeBase(resolvedBase);
    if(!normalizedResolved){ return; }
    if(normalizedResolved === '/api'){
      safeStorageRemove('docketmint.apiBaseUrl');
      runtime.savedApiBaseUrl = '';
      return;
    }
    var savedBase = normalizeBase(runtime.savedApiBaseUrl || '');
    if(savedBase === normalizedResolved){ return; }
    safeStorageSet('docketmint.apiBaseUrl', normalizedResolved);
    runtime.savedApiBaseUrl = normalizedResolved;
  }

  async function probeBase(base){
    var url = buildUrlFromBase(base, '/system-status');
    try {
      var response = await fetch(url, { headers: { 'Accept': 'application/json' } });
      var payload = await parseResponse(response);
      if(response.ok && payload && typeof payload === 'object' && payload.status === 'ok'){
        return { ok: true, base: normalizeBase(base), payload: payload };
      }
      return { ok: false, error: normalizeError(payload, response, url) };
    } catch (error){
      return {
        ok: false,
        error: {
          status: 0,
          message: 'Could not reach the DocketMint backend at ' + normalizeBase(base) + '.',
          detail: null,
          raw: error,
          url: url
        }
      };
    }
  }

  async function ensureResolvedBase(force){
    if(isSameOriginOnlyMode()){
      setResolvedBase('/api', runtime.backendStatus);
      runtime.canonicalAuthApiBase = '/api';
      syncSavedBase('/api');
      return '/api';
    }
    if(!force && runtime.resolvedApiBaseUrl){
      return runtime.resolvedApiBaseUrl;
    }
    if(!force && resolvedBasePromise){
      return resolvedBasePromise;
    }

    resolvedBasePromise = (async function(){
      var candidates = unique([runtime.apiBaseUrl].concat(runtime.apiBaseCandidates || []));
      var lastError = null;
      for(var index = 0; index < candidates.length; index += 1){
        var candidate = candidates[index];
        var probe = await probeBase(candidate);
        if(probe.ok){
          var preferredBase = preferredBaseFromStatus(probe.base, probe.payload);
          setResolvedBase(preferredBase, probe.payload);
          syncSavedBase(preferredBase);
          return preferredBase;
        }
        lastError = probe.error;
      }
      throw lastError || {
        status: 0,
        message: 'Could not resolve a working DocketMint API base.',
        detail: { candidates: candidates },
        url: ''
      };
    })();

    try {
      return await resolvedBasePromise;
    } finally {
      resolvedBasePromise = null;
    }
  }

  async function requestAgainstBase(base, path, options){
    var config = options || {};
    var headers = Object.assign({ 'Accept': 'application/json' }, config.headers || {});
    var init = {
      method: config.method || 'GET',
      headers: headers,
      credentials: 'include'
    };

    if(config.body instanceof FormData){
      init.body = config.body;
      delete init.headers['Content-Type'];
    } else if(typeof config.body !== 'undefined'){
      init.body = JSON.stringify(config.body);
      init.headers['Content-Type'] = 'application/json';
    }

    var url = buildUrlFromBase(base, path);
    var response = await fetch(url, init);
    var payload = await parseResponse(response);
    if(!response.ok){
      throw normalizeError(payload, response, url);
    }
    return payload;
  }

  async function request(path, options){
    if(isSameOriginOnlyMode()){
      setResolvedBase('/api', runtime.backendStatus);
      syncSavedBase('/api');
      return requestAgainstBase('/api', path, options);
    }

    var candidates = [];

    if(runtime.sameOriginMode && pathRequiresSameOriginAuth(path)){
      candidates = [activeAuthApiBase()];
    } else {
      try {
        candidates.push(await ensureResolvedBase(false));
      } catch (initialError){
        var fallbackList = unique((runtime.apiBaseCandidates || []).concat([runtime.apiBaseUrl]));
        if(!fallbackList.length){
          throw initialError;
        }
        candidates = fallbackList;
      }

      candidates = unique(candidates.concat(runtime.apiBaseCandidates || []));
    }
    var lastError = null;

    for(var index = 0; index < candidates.length; index += 1){
      var candidate = candidates[index];
      try {
        var payload = await requestAgainstBase(candidate, path, options);
        setResolvedBase(candidate, runtime.backendStatus);
        syncSavedBase(runtime.resolvedApiBaseUrl || candidate);
        return payload;
      } catch (error){
        lastError = error;
        if(index === candidates.length - 1 || !shouldTryAlternateBase(error) || pathRequiresSameOriginAuth(path)){
          break;
        }
      }
    }

    if(lastError){ throw lastError; }
    throw { status: 0, message: 'Could not reach the DocketMint backend.', detail: null, raw: null, url: '' };
  }

  function toDownloadUrl(downloadUrl){
    if(!downloadUrl){ return ''; }
    if(/^https?:\/\//i.test(downloadUrl)){ return downloadUrl; }
    if(downloadUrl.charAt(0) === '/'){
      return activeBackendOrigin() + downloadUrl;
    }
    return joinUrl(activeBackendOrigin(), downloadUrl);
  }

  function uploadFiles(path, files, fieldNames, extraFields){
    var form = new FormData();
    Array.prototype.forEach.call(files || [], function(file, index){
      var fieldName = Array.isArray(fieldNames) && fieldNames[index] ? fieldNames[index] : 'files';
      form.append(fieldName, file);
    });
    Object.keys(extraFields || {}).forEach(function(key){
      var value = extraFields[key];
      if(value !== undefined && value !== null){ form.append(key, value); }
    });
    return request(path, { method: 'POST', body: form });
  }

  function xhrUploadFiles(path, files, callbacks){
    callbacks = callbacks || {};
    return ensureResolvedBase(false).then(function(base){
      var normalizedFiles = Array.prototype.slice.call(files || []);
      var totalBytes = normalizedFiles.reduce(function(sum, file){ return sum + Number(file && file.size || 0); }, 0) || 1;
      var completedBytes = 0;
      var storedFiles = [];
      var currentIndex = 0;

      return new Promise(function(resolve, reject){
        function notify(name, payload){
          if(typeof callbacks[name] === 'function'){
            try { callbacks[name](payload); } catch (error){}
          }
        }

        function uploadNext(){
          if(currentIndex >= normalizedFiles.length){
            notify('onOverallProgress', {
              loaded: totalBytes,
              total: totalBytes,
              percent: 100,
              speedBps: 0,
              etaSeconds: 0,
              complete: true
            });
            resolve({ storedFiles: storedFiles, totalBytes: totalBytes });
            return;
          }

          var file = normalizedFiles[currentIndex];
          var startedAt = Date.now();
          var xhr = new XMLHttpRequest();
          var form = new FormData();
          form.append('files', file);

          notify('onFileStatus', { file: file, status: 'uploading', percent: 0, loaded: 0, total: Number(file.size || 0) });

          xhr.open('POST', buildUrlFromBase(base, path), true);
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.withCredentials = true;

          xhr.upload.onprogress = function(event){
            if(!event.lengthComputable){ return; }
            var elapsedSeconds = Math.max(0.25, (Date.now() - startedAt) / 1000);
            var speedBps = event.loaded / elapsedSeconds;
            var remaining = Math.max(0, event.total - event.loaded);
            var etaSeconds = speedBps > 0 ? remaining / speedBps : null;
            var overallLoaded = completedBytes + event.loaded;
            notify('onFileProgress', {
              file: file,
              status: 'uploading',
              loaded: event.loaded,
              total: event.total,
              percent: Math.min(99, Math.round((event.loaded / Math.max(1, event.total)) * 100)),
              speedBps: speedBps,
              etaSeconds: etaSeconds
            });
            notify('onOverallProgress', {
              loaded: overallLoaded,
              total: totalBytes,
              percent: Math.min(99, Math.round((overallLoaded / Math.max(1, totalBytes)) * 100)),
              speedBps: speedBps,
              etaSeconds: speedBps > 0 ? Math.max(0, totalBytes - overallLoaded) / speedBps : null
            });
          };

          xhr.onerror = function(){
            notify('onFileStatus', { file: file, status: 'failed', percent: 0, loaded: 0, total: Number(file.size || 0), message: 'Network error while uploading.' });
            reject({ status: 0, message: 'Network error while uploading ' + file.name + '.', detail: null, url: buildUrlFromBase(base, path) });
          };

          xhr.onload = function(){
            var contentType = xhr.getResponseHeader('content-type') || '';
            var payload = xhr.responseText;
            if(contentType.indexOf('application/json') !== -1){
              try { payload = JSON.parse(xhr.responseText || '{}'); } catch (error){}
            }
            if(xhr.status >= 200 && xhr.status < 300){
              completedBytes += Number(file.size || 0);
              if(payload && payload.stored_files && payload.stored_files.length){
                storedFiles = storedFiles.concat(payload.stored_files);
              }
              notify('onFileStatus', {
                file: file,
                status: 'uploaded',
                percent: 100,
                loaded: Number(file.size || 0),
                total: Number(file.size || 0),
                stored: payload
              });
              notify('onOverallProgress', {
                loaded: completedBytes,
                total: totalBytes,
                percent: Math.round((completedBytes / Math.max(1, totalBytes)) * 100),
                speedBps: 0,
                etaSeconds: 0
              });
              currentIndex += 1;
              uploadNext();
              return;
            }
            var error = normalizeError(payload, { status: xhr.status, headers: { get: function(){ return contentType; } } }, buildUrlFromBase(base, path));
            notify('onFileStatus', { file: file, status: 'failed', percent: 0, loaded: 0, total: Number(file.size || 0), message: error.message });
            reject(error);
          };

          xhr.send(form);
        }

        normalizedFiles.forEach(function(file){
          notify('onFileStatus', { file: file, status: 'queued', percent: 0, loaded: 0, total: Number(file && file.size || 0) });
        });
        uploadNext();
      });
    });
  }

  async function health(){
    await ensureResolvedBase(false);
    return request('/health');
  }

  async function integrationCheck(){
    var systemStatus = await request('/system-status');
    var healthPayload = await request('/health');
    var casesPayload = null;
    try {
      casesPayload = await Promise.race([
        request('/cases?limit=1'),
        timeoutAfter(3000, 'Case probe timed out.')
      ]);
    } catch (error){
      casesPayload = null;
    }
    return {
      status: 'ok',
      environment: healthPayload.environment || 'unknown',
      health: healthPayload,
      systemStatus: systemStatus,
      caseProbeCount: Array.isArray(casesPayload) ? casesPayload.length : null,
      apiBase: activeApiBase(),
      backendOrigin: activeBackendOrigin(),
      candidates: unique((runtime.apiBaseCandidates || []).concat([runtime.apiBaseUrl]))
    };
  }

  async function getSystemStatus(){
    return request('/system-status');
  }

  window.DocketMintApi = {
    getActiveCaseId: getActiveCaseId,
    setActiveCaseId: setActiveCaseId,
    clearActiveCaseId: clearActiveCaseId,
    health: health,
    integrationCheck: integrationCheck,
    getSystemStatus: getSystemStatus,
    getAuthDiagnostics: function(){ return request('/auth/diagnostics'); },
    getSession: function(){ return request('/auth/session'); },
    login: function(payload){ return request('/auth/login', { method: 'POST', body: payload || {} }); },
    signup: function(payload){ return request('/auth/signup', { method: 'POST', body: payload || {} }); },
    logout: function(){ return request('/auth/logout', { method: 'POST' }); },
    getMe: function(){ return request('/me'); },
    updateProfile: function(payload){ return request('/me/profile', { method: 'PATCH', body: payload || {} }); },
    getTemplateRegistry: function(caseId){
      var suffix = caseId ? ('?case_id=' + encodeURIComponent(caseId)) : '';
      return request('/templates/registry' + suffix);
    },
    listCases: function(limit){ return request('/cases?limit=' + encodeURIComponent(limit || 20)); },
    createCase: function(payload){ return request('/cases', { method: 'POST', body: payload }); },
    getCase: function(caseId){
      return request('/cases/' + encodeURIComponent(caseId)).catch(function(error){
        if(caseId && caseId === getActiveCaseId() && isMissingCaseError(error)){
          clearActiveCaseId();
        }
        throw error;
      });
    },
    deleteCase: function(caseId, hard){
      var suffix = '?hard=' + encodeURIComponent(hard !== false);
      return request('/cases/' + encodeURIComponent(caseId) + suffix, { method: 'DELETE' });
    },
    bulkDeleteCases: function(payload){ return request('/cases/bulk-delete', { method: 'POST', body: payload || {} }); },
    getCaseActivity: function(caseId, limit){ return request('/cases/' + encodeURIComponent(caseId) + '/activity?limit=' + encodeURIComponent(limit || 80)); },
    getCaseCommunications: function(caseId, limit){ return request('/cases/' + encodeURIComponent(caseId) + '/communications?limit=' + encodeURIComponent(limit || 60)); },
    addCaseCommunication: function(caseId, payload){ return request('/cases/' + encodeURIComponent(caseId) + '/communications', { method: 'POST', body: payload || {} }); },
    processCase: function(caseId){ return request('/cases/' + encodeURIComponent(caseId) + '/process', { method: 'POST' }); },
    classifyCase: function(caseId){ return request('/cases/' + encodeURIComponent(caseId) + '/classify', { method: 'POST' }); },
    getCaseDeadlines: function(caseId){ return request('/cases/' + encodeURIComponent(caseId) + '/deadlines'); },
    saveDeadlineOverride: function(caseId, payload){ return request('/cases/' + encodeURIComponent(caseId) + '/deadlines/override', { method: 'POST', body: payload || {} }); },
    routeCase: function(caseId, payload){ return request('/cases/' + encodeURIComponent(caseId) + '/route', { method: 'POST', body: payload || {} }); },
    buildActionPacket: function(caseId){ return request('/cases/' + encodeURIComponent(caseId) + '/action-packet', { method: 'POST' }); },
    getOfficialContacts: function(caseId){ return request('/cases/' + encodeURIComponent(caseId) + '/official-contacts'); },
    getSettlementTracker: function(caseId){ return request('/cases/' + encodeURIComponent(caseId) + '/settlement-tracker'); },
    saveSettlementTracker: function(caseId, payload){ return request('/cases/' + encodeURIComponent(caseId) + '/settlement-tracker', { method: 'POST', body: payload || {} }); },
    updateCaseStage: function(caseId, stage){ return request('/cases/' + encodeURIComponent(caseId) + '/stage', { method: 'POST', body: { stage: stage } }); },
    reviewCase: function(caseId, payload){ return request('/cases/' + encodeURIComponent(caseId) + '/review', { method: 'PATCH', body: payload }); },
    uploadSourceFiles: function(caseId, files){ return uploadFiles('/cases/' + encodeURIComponent(caseId) + '/source-files', files); },
    uploadSourceFilesWithProgress: function(caseId, files, callbacks){ return xhrUploadFiles('/cases/' + encodeURIComponent(caseId) + '/source-files', files, callbacks); },
    removeSourceFile: function(caseId, fileId){ return request('/cases/' + encodeURIComponent(caseId) + '/source-files/' + encodeURIComponent(fileId), { method: 'DELETE' }); },
    setSourceFileActive: function(caseId, fileId, active, reason){ return request('/cases/' + encodeURIComponent(caseId) + '/source-files/' + encodeURIComponent(fileId), { method: 'PATCH', body: { active: !!active, reason: reason || '' } }); },
    splitCaseByDebtor: function(caseId){ return request('/cases/' + encodeURIComponent(caseId) + '/split-by-debtor', { method: 'POST' }); },
    uploadTemplateFiles: function(caseId, files){ return uploadFiles('/cases/' + encodeURIComponent(caseId) + '/template-files', files); },
    removeTemplateFile: function(caseId, fileId){ return request('/cases/' + encodeURIComponent(caseId) + '/template-files/' + encodeURIComponent(fileId), { method: 'DELETE' }); },
    runSunbiz: function(caseId, entityName){
      var suffix = entityName ? ('?entity_name=' + encodeURIComponent(entityName)) : '';
      return request('/sunbiz/cases/' + encodeURIComponent(caseId) + '/lookup' + suffix, { method: 'POST' });
    },
    verifyEntity: function(caseId, entityName, stateHint){
      var query = [];
      if(entityName){ query.push('entity_name=' + encodeURIComponent(entityName)); }
      if(stateHint){ query.push('state_hint=' + encodeURIComponent(stateHint)); }
      var suffix = query.length ? ('?' + query.join('&')) : '';
      return request('/entity-registry/cases/' + encodeURIComponent(caseId) + '/verify' + suffix, { method: 'POST' });
    },
    getDownloads: function(caseId){ return request('/downloads/cases/' + encodeURIComponent(caseId)); },
    markDownload: function(caseId, ledgerId){ return request('/downloads/cases/' + encodeURIComponent(caseId) + '/' + encodeURIComponent(ledgerId) + '/mark-downloaded', { method: 'POST' }); },
    removeCaseOutput: function(caseId, ledgerId){ return request('/downloads/cases/' + encodeURIComponent(caseId) + '/' + encodeURIComponent(ledgerId), { method: 'DELETE' }); },
    updatePacketArchiveReleaseState: function(caseId, archiveEntryId, releaseState){ return request('/downloads/cases/' + encodeURIComponent(caseId) + '/packet-archive/' + encodeURIComponent(archiveEntryId), { method: 'PATCH', body: { release_state: releaseState } }); },
    analyzeContractReview: function(caseId){ return request('/contract-review/cases/' + encodeURIComponent(caseId) + '/analyze', { method: 'POST' }); },
    generateContractDraft: function(caseId){ return request('/contract-review/cases/' + encodeURIComponent(caseId) + '/generate-draft', { method: 'POST' }); },
    getSunbizPdfUrl: function(caseId){ return toDownloadUrl('/api/sunbiz/cases/' + encodeURIComponent(caseId) + '/report.pdf'); },
    startGeneration: function(caseId, selectedDocumentTypes, wait){
      var suffix = wait ? '?wait=true' : '';
      return request('/generate/' + encodeURIComponent(caseId) + suffix, {
        method: 'POST',
        body: { selected_document_types: selectedDocumentTypes || [] }
      });
    },
    getGenerationProgress: function(caseId){ return request('/generate/' + encodeURIComponent(caseId) + '/progress'); },

    createImmigrationSession: function(formFile, supportingFiles){
      var files = [formFile].concat(supportingFiles || []);
      var fieldNames = ['form_file'].concat((supportingFiles || []).map(function(){ return 'supporting_files'; }));
      return uploadFiles('/immigration/forms/sessions', files, fieldNames);
    },
    listImmigrationSessions: function(limit){ return request('/immigration/forms/sessions?limit=' + encodeURIComponent(limit || 20)); },
    getImmigrationSession: function(sessionId){ return request('/immigration/forms/sessions/' + encodeURIComponent(sessionId)); },
    generateImmigrationPdf: function(sessionId, values){
      return request('/immigration/forms/sessions/' + encodeURIComponent(sessionId) + '/generate', {
        method: 'POST',
        body: { values: values || {} }
      });
    },
    deleteImmigrationSession: function(sessionId){ return request('/immigration/forms/sessions/' + encodeURIComponent(sessionId), { method: 'DELETE' }); },


    createDealerContractSession: function(contractFiles, supportingFiles, vin, mileage, zipCode, askingPrice, dealerUrl, dealerPriceManual, stateHint){
      var files = [].concat(contractFiles || []).concat(supportingFiles || []);
      var fieldNames = (contractFiles || []).map(function(){ return 'contract_files'; }).concat((supportingFiles || []).map(function(){ return 'supporting_files'; }));
      var extraFields = {
        vin: vin || '',
        mileage: mileage || '',
        zip_code: zipCode || '',
        asking_price: askingPrice || '',
        dealer_url: dealerUrl || '',
        dealer_price_manual: dealerPriceManual || '',
        state_hint: stateHint || ''
      };
      return uploadFiles('/dealer-contract-check/sessions', files, fieldNames, extraFields);
    },
    listDealerContractSessions: function(limit){ return request('/dealer-contract-check/sessions?limit=' + encodeURIComponent(limit || 20)); },
    getDealerContractSession: function(sessionId){ return request('/dealer-contract-check/sessions/' + encodeURIComponent(sessionId)); },
    rerunDealerContractSession: function(sessionId, payload){
      return request('/dealer-contract-check/sessions/' + encodeURIComponent(sessionId) + '/rerun', { method: 'POST', body: payload || {} });
    },
    generateDealerContractReport: function(sessionId){
      return request('/dealer-contract-check/sessions/' + encodeURIComponent(sessionId) + '/generate-report', { method: 'POST' });
    },
    deleteDealerContractSession: function(sessionId){ return request('/dealer-contract-check/sessions/' + encodeURIComponent(sessionId), { method: 'DELETE' }); },

    createContractIntelligenceSession: function(contractFiles, supportingFiles){
      var files = [].concat(contractFiles || []).concat(supportingFiles || []);
      var fieldNames = (contractFiles || []).map(function(){ return 'contract_files'; }).concat((supportingFiles || []).map(function(){ return 'supporting_files'; }));
      return uploadFiles('/contract-intelligence/sessions', files, fieldNames);
    },
    listContractIntelligenceSessions: function(limit){ return request('/contract-intelligence/sessions?limit=' + encodeURIComponent(limit || 20)); },
    getContractIntelligenceSession: function(sessionId){ return request('/contract-intelligence/sessions/' + encodeURIComponent(sessionId)); },
    analyzeContractIntelligenceSession: function(sessionId){ return request('/contract-intelligence/sessions/' + encodeURIComponent(sessionId) + '/analyze', { method: 'POST' }); },
    generateContractIntelligenceDraft: function(sessionId){ return request('/contract-intelligence/sessions/' + encodeURIComponent(sessionId) + '/generate-draft', { method: 'POST' }); },
    deleteContractIntelligenceSession: function(sessionId){ return request('/contract-intelligence/sessions/' + encodeURIComponent(sessionId), { method: 'DELETE' }); },

    createRecoveryIntakeSession: function(entryWorkflow, title, files){
      var uploads = [].concat(files || []);
      var fieldNames = uploads.map(function(){ return 'files'; });
      return uploadFiles('/recovery-intake/sessions', uploads, fieldNames, {
        entry_workflow: entryWorkflow || '',
        title: title || ''
      });
    },
    getRecoveryIntakeSession: function(sessionId){ return request('/recovery-intake/sessions/' + encodeURIComponent(sessionId)); },
    uploadRecoveryIntakeFiles: function(sessionId, files){
      return uploadFiles('/recovery-intake/sessions/' + encodeURIComponent(sessionId) + '/source-files', files || []);
    },
    promoteRecoveryIntakeSession: function(sessionId){
      return request('/recovery-intake/sessions/' + encodeURIComponent(sessionId) + '/promote', { method: 'POST' });
    },

    getPlatformServices: function(caseId){
      var suffix = caseId ? ('?case_id=' + encodeURIComponent(caseId)) : '';
      return request('/platform/services' + suffix).catch(function(error){
        if(caseId && caseId === getActiveCaseId() && isMissingCaseError(error)){
          clearActiveCaseId();
          return request('/platform/services');
        }
        throw error;
      });
    },
    getRecommendedServices: function(caseId){ return this.getPlatformServices(caseId); },
    getPlatformDashboard: function(){ return request('/platform/dashboard'); },
    getPlatformCommercial: function(){ return request('/platform/commercial'); },
    getPlatformHistory: function(filters){
      filters = filters || {};
      var query = [];
      if(filters.service_slug){ query.push('service_slug=' + encodeURIComponent(filters.service_slug)); }
      if(filters.owner_id){ query.push('owner_id=' + encodeURIComponent(filters.owner_id)); }
      return request('/platform/history' + (query.length ? ('?' + query.join('&')) : ''));
    },
    trackPlatformUsageEvent: function(payload){ return request('/platform/usage-events', { method: 'POST', body: payload || {} }); },
    clearSelectedHistory: function(payload){ return request('/platform/history/clear-selected', { method: 'POST', body: payload || {} }); },
    clearHistory: function(payload){ return request('/platform/history/clear', { method: 'POST', body: payload || {} }); },
    getClientRuntimeDiagnostics: function(){
      return {
        apiBaseUrl: runtime.apiBaseUrl,
        canonicalAuthApiBase: runtime.canonicalAuthApiBase || '',
        apiBaseCandidates: (runtime.apiBaseCandidates || []).slice(),
        resolvedApiBaseUrl: runtime.resolvedApiBaseUrl,
        resolvedBackendOrigin: runtime.resolvedBackendOrigin || '',
        sameOriginMode: runtime.sameOriginMode,
        publicProxyMode: Boolean(runtime.publicProxyMode),
        enforceSameOriginApi: Boolean(runtime.enforceSameOriginApi),
        authSameOriginOnly: Boolean(runtime.authSameOriginOnly),
        directApiFallbackBaseUrl: runtime.directApiFallbackBaseUrl || ''
      };
    },
    request: request,
    toDownloadUrl: toDownloadUrl,
    ensureResolvedBase: ensureResolvedBase,
    ensureValidActiveCaseId: ensureValidActiveCaseId,
    runtime: runtime
  };
})();
