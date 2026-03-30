(function(){
  var api = window.DocketMintApi;
  if(!api){ return; }

  function params(){
    try { return new URLSearchParams(window.location.search || ''); }
    catch (error){ return new URLSearchParams(''); }
  }

  function createCaptureInput(){
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf';
    input.multiple = true;
    input.setAttribute('capture', 'environment');
    return input;
  }

  function pageScreen(){
    return (document.body && document.body.getAttribute('data-app-screen')) || '';
  }

  function currentCategory(){
    return params().get('category') || '';
  }

  function currentWorkflow(){
    return params().get('workflow') || '';
  }

  function buildNewCaseCaptureUrl(){
    var query = new URLSearchParams();
    query.set('capture', '1');
    if(currentCategory()){
      query.set('category', currentCategory());
    }
    return '/app/new-case/?' + query.toString();
  }

  function buildCaseIntakeCaptureUrl(){
    var query = new URLSearchParams();
    query.set('capture', '1');
    if(currentWorkflow()){
      query.set('workflow', currentWorkflow());
    }
    if(currentCategory()){
      query.set('category', currentCategory());
    }
    return '/app/case-intake/?' + query.toString();
  }

  function buildWorkspaceCaptureUrl(caseId){
    var query = new URLSearchParams();
    query.set('case', caseId);
    query.set('capture', '1');
    query.set('return', 'action-center');
    if(currentCategory()){
      query.set('category', currentCategory());
    }
    return '/app/workspace/?' + query.toString();
  }

  function canCreateCases(){
    return !window.DocketMintAuth || !window.DocketMintAuth.canCreateCases || window.DocketMintAuth.canCreateCases();
  }

  function createLockMessage(){
    if(window.DocketMintAuth && window.DocketMintAuth.createLockMessage){
      return window.DocketMintAuth.createLockMessage();
    }
    return 'Only admin users can create recovery matters in this environment.';
  }

  async function createMatterAndCapture(){
    if(!canCreateCases()){
      window.alert(createLockMessage());
      return;
    }
    var created = await api.createCase({
      reference: null,
      matter_name: null,
      plaintiff_name: null,
      defendant_name: null,
      notes: null
    });
    api.setActiveCaseId(created.id);
    window.location.href = buildWorkspaceCaptureUrl(created.id);
  }

  function openWorkspaceCapture(){
    var upload = window.DocketMintWorkspaceUploadSourceFiles;
    if(typeof upload !== 'function'){
      return;
    }
    var input = createCaptureInput();
    input.addEventListener('change', function(){
      var files = Array.prototype.slice.call(input.files || []);
      if(files.length){
        upload(files);
      }
    });
    input.click();
  }

  async function handleCameraTrigger(){
    var screen = pageScreen();
    if(screen === 'workspace'){
      openWorkspaceCapture();
      return;
    }
    if(screen === 'new-case'){
      if(!canCreateCases()){
        window.location.href = buildCaseIntakeCaptureUrl();
        return;
      }
      await createMatterAndCapture();
      return;
    }
    window.location.href = buildCaseIntakeCaptureUrl();
  }

  function bindTriggers(){
    Array.prototype.slice.call(document.querySelectorAll('[data-camera-trigger]') || []).forEach(function(button){
      button.addEventListener('click', function(event){
        event.preventDefault();
        handleCameraTrigger().catch(function(){});
      });
    });
  }

  function maybeAutoCapture(){
    if(params().get('capture') !== '1'){
      return;
    }
    if(pageScreen() === 'workspace' && typeof window.DocketMintWorkspaceUploadSourceFiles === 'function'){
      window.setTimeout(function(){ openWorkspaceCapture(); }, 180);
    }
    if(pageScreen() === 'new-case'){
      window.setTimeout(function(){
        handleCameraTrigger().catch(function(){});
      }, 160);
    }
  }

  function boot(){
    bindTriggers();
    maybeAutoCapture();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
