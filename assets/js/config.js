(function(){
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

  function safeStorageGet(key){
    try {
      return window.localStorage ? window.localStorage.getItem(key) : '';
    } catch (error){
      return '';
    }
  }

  function safeStorageRemove(key){
    try {
      if(window.localStorage){ window.localStorage.removeItem(key); }
    } catch (error){}
  }

  function queryApiBase(){
    try {
      var params = new URLSearchParams(window.location.search || '');
      return params.get('apiBase') || params.get('api') || params.get('backend') || '';
    } catch (error){
      return '';
    }
  }

  function backendOriginFromBase(base){
    base = normalizeBase(base);
    if(/^https?:\/\//i.test(base)){
      return base.replace(/\/api$/i, '').replace(/\/$/, '');
    }
    if(base.charAt(0) === '/' && window.location && /^https?:$/i.test(window.location.protocol)){
      return window.location.origin.replace(/\/$/, '');
    }
    return 'http://127.0.0.1:8000';
  }

  var config = window.DOCKETMINT_CONFIG || {};
  var metaTag = document.querySelector('meta[name="docketmint-api-base"]');
  var metaBase = metaTag ? metaTag.getAttribute('content') : '';
  var explicitBase = config.apiBaseUrl || '';
  var publicApiBase = config.publicApiUrl || '';
  var renderApiBase = config.renderApiBaseUrl || '';
  var queryBase = queryApiBase();
  var savedBase = safeStorageGet('docketmint.apiBaseUrl');
  var configuredCandidates = Array.isArray(config.apiBaseCandidates) ? config.apiBaseCandidates.slice() : [];
  var splitOriginMode = Boolean(config.splitOriginMode);
  var isBrowserHttp = window.location && /^https?:$/i.test(window.location.protocol || '');
  var publicProxyMode = Boolean(config.publicProxyMode || config.enforceSameOriginApi || config.authSameOriginOnly);

  var defaultBase = isBrowserHttp ? '/api' : 'http://127.0.0.1:8000/api';
  var canonicalAuthBase = normalizeBase(config.canonicalAuthApiBase || (publicProxyMode ? defaultBase : (explicitBase || publicApiBase || defaultBase))) || defaultBase;
  if(publicProxyMode){
    safeStorageRemove('docketmint.apiBaseUrl');
    window.DocketMintRuntime = {
      apiBaseUrl: defaultBase,
      canonicalAuthApiBase: defaultBase,
      apiBaseCandidates: [defaultBase],
      backendOrigin: backendOriginFromBase(defaultBase),
      resolvedApiBaseUrl: defaultBase,
      resolvedBackendOrigin: backendOriginFromBase(defaultBase),
      sameOriginMode: true,
      hasExplicitOverride: false,
      host: (window.location && window.location.hostname) ? window.location.hostname.toLowerCase() : '',
      backendStatus: null,
      savedApiBaseUrl: '',
      splitOriginMode: false,
      publicProxyMode: true,
      enforceSameOriginApi: true,
      authSameOriginOnly: true,
      directApiFallbackBaseUrl: ''
    };
    return;
  }

  var candidates = unique(
    [queryBase, metaBase, explicitBase, publicApiBase, renderApiBase]
      .concat(configuredCandidates)
      .concat(splitOriginMode ? [savedBase] : [])
      .concat([defaultBase])
  );
  var selectedBase = normalizeBase(queryBase || metaBase || explicitBase || publicApiBase || renderApiBase || savedBase || defaultBase);
  window.DocketMintRuntime = {
    apiBaseUrl: selectedBase,
    canonicalAuthApiBase: canonicalAuthBase,
    apiBaseCandidates: candidates.length ? candidates : [defaultBase],
    backendOrigin: backendOriginFromBase(selectedBase),
    resolvedApiBaseUrl: '',
    resolvedBackendOrigin: '',
    sameOriginMode: selectedBase.charAt(0) === '/',
    hasExplicitOverride: Boolean(explicitBase || publicApiBase || renderApiBase || queryBase || metaBase),
    host: (window.location && window.location.hostname) ? window.location.hostname.toLowerCase() : '',
    backendStatus: null,
    savedApiBaseUrl: normalizeBase(savedBase),
    splitOriginMode: splitOriginMode,
    publicProxyMode: publicProxyMode,
    enforceSameOriginApi: publicProxyMode,
    authSameOriginOnly: publicProxyMode,
    directApiFallbackBaseUrl: normalizeBase(renderApiBase)
  };
})();
