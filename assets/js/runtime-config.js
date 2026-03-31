(function () {
  function normalize(url){
    return String(url || '').trim().replace(/\/$/, '');
  }

  function pushUnique(list, value){
    value = normalize(value);
    if(!value || list.indexOf(value) !== -1){ return; }
    list.push(value);
  }

  var existing = window.DOCKETMINT_CONFIG || {};
  var host = (window.location && window.location.hostname) ? window.location.hostname.toLowerCase() : '';
  var isBrowserHttp = window.location && /^https?:$/i.test(window.location.protocol || '');
  var defaultBase = isBrowserHttp ? '/api' : 'http://127.0.0.1:8000/api';
  var explicitBase = normalize(existing.apiBaseUrl || existing.publicApiUrl || '');
  var renderApiBase = normalize(
    existing.renderApiBaseUrl ||
    ((host === 'docketmint.app' || host === 'www.docketmint.app' || host === 'docketmint.vercel.app') ? 'https://docketmint.onrender.com/api' : '')
  );
  var isPublicAppHost = /^(docketmint\.app|www\.docketmint\.app|docketmint\.vercel\.app)$/i.test(host);
  var canonicalAuthBase = explicitBase || defaultBase;
  var apiCandidates = [];

  if(isPublicAppHost){
    window.DOCKETMINT_CONFIG = Object.assign(
      {},
      existing,
      {
        apiBaseUrl: defaultBase,
        publicApiUrl: defaultBase,
        canonicalAuthApiBase: defaultBase,
        apiBaseCandidates: [defaultBase],
        renderApiBaseUrl: '',
        directApiFallbackBaseUrl: '',
        splitOriginMode: false,
        runtimeHost: host,
        publicProxyMode: true,
        enforceSameOriginApi: true,
        authSameOriginOnly: true,
        adminTemplateMode: false
      }
    );
    return;
  }

  pushUnique(apiCandidates, explicitBase);
  pushUnique(apiCandidates, defaultBase);
  pushUnique(apiCandidates, renderApiBase);
  (existing.apiBaseCandidates || []).forEach(function(item){ pushUnique(apiCandidates, item); });

  window.DOCKETMINT_CONFIG = Object.assign(
    {},
    existing,
    {
      apiBaseUrl: explicitBase || defaultBase,
      publicApiUrl: explicitBase || defaultBase,
      canonicalAuthApiBase: canonicalAuthBase,
      apiBaseCandidates: apiCandidates.length ? apiCandidates : [defaultBase],
      renderApiBaseUrl: renderApiBase,
      directApiFallbackBaseUrl: renderApiBase,
      splitOriginMode: Boolean(existing.splitOriginMode || renderApiBase),
      runtimeHost: host,
      publicProxyMode: false,
      enforceSameOriginApi: false,
      authSameOriginOnly: false,
      adminTemplateMode: false
    }
  );
})();
