(function(){
  window.trackEvent = window.trackEvent || function(){};

  function hasScript(fragment){
    return Array.from(document.scripts).some((script)=>{
      const src = script.getAttribute('src') || '';
      return src.indexOf(fragment) !== -1;
    });
  }

  function appendScript(src){
    if(hasScript(src)) return;
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    document.head.appendChild(script);
  }

  function boot(){
    appendScript('assets/js/site.js');
    appendScript('assets/js/ui-shell.js');
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot, { once:true });
  }else{
    boot();
  }
})();
