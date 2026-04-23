/* =============================================================================
   VCX Private Intake — Google Ads attribution capture
   Captures gclid / gbraid / wbraid / utm_* params from landing URL,
   persists in sessionStorage, and injects hidden inputs into any form
   with id starting with "intake" on the page.
   Also fires GA4 'form_submit' + 'generate_lead' on submit with service metadata.
   ============================================================================= */
(function(){
  'use strict';

  var ATTRIB_KEYS = ['gclid','gbraid','wbraid','utm_source','utm_medium','utm_campaign','utm_content','utm_term','msclkid','fbclid'];

  function readAttrib(){
    var params;
    try{ params = new URLSearchParams(window.location.search); }catch(e){ return {}; }
    var stored = {};
    try{ stored = JSON.parse(sessionStorage.getItem('vcx_attrib')||'{}'); }catch(e){}
    var out = Object.assign({}, stored);
    ATTRIB_KEYS.forEach(function(k){
      var v = params.get(k);
      if(v) out[k] = v;
    });
    try{ sessionStorage.setItem('vcx_attrib', JSON.stringify(out)); }catch(e){}
    return out;
  }

  function injectHidden(form, name, value){
    if(!value) return;
    // Don't inject if already present
    if(form.querySelector('input[name="'+name+'"]')) return;
    var input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }

  function attachToForm(form){
    if(!form || form.dataset.vcxAttribBound === '1') return;
    form.dataset.vcxAttribBound = '1';

    var attrib = readAttrib();
    ATTRIB_KEYS.forEach(function(k){ injectHidden(form, k, attrib[k]); });
    injectHidden(form, 'landing_page', location.pathname);
    injectHidden(form, 'referrer', document.referrer || 'direct');

    // Fire GA4 generate_lead on submit (in addition to the auto-form_submit from site.js)
    form.addEventListener('submit', function(){
      try{
        var serviceInput = form.querySelector('input[name="Service"]');
        var service = serviceInput ? serviceInput.value : 'private_client';
        if(typeof window.gtag === 'function'){
          window.gtag('event', 'generate_lead', {
            currency: 'USD',
            value: 1.0,
            service: service,
            form_id: form.id || 'private_intake'
          });
          window.gtag('event', 'private_client_lead', {
            service: service,
            form_id: form.id || 'private_intake'
          });
        }
      }catch(e){ if(window.console) console.warn('[vcx-attrib] gtag emit failed', e); }
    }, {capture:true});
  }

  function init(){
    var forms = document.querySelectorAll('form[id^="intake"], form[data-vcx-private-intake]');
    forms.forEach(attachToForm);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  }else{
    init();
  }
})();
