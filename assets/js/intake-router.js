(function(){
  var api = window.DocketMintApi;
  if(!api){ return; }

  function q(selector){ return document.querySelector(selector); }
  function qa(selector){ return Array.prototype.slice.call(document.querySelectorAll(selector) || []); }
  function escapeHtml(value){
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function bindEntryCards(){
    qa('[data-entry]').forEach(function(button){
      button.addEventListener('click', function(){
        var entry = button.getAttribute('data-entry') || '';
        var workflow = entry === 'evidence' ? 'evidence_review' : (entry === 'handoff' ? 'demand_pack' : 'recovery_diagnostic');
        window.location.href = '/app/case-intake/?workflow=' + encodeURIComponent(workflow);
      });
    });
  }

  function bindPrimaryButtons(){
    var uploadButton = q('[data-home-upload]');
    if(uploadButton){
      uploadButton.addEventListener('click', function(){
        window.location.href = '/app/case-intake/?workflow=recovery_diagnostic';
      });
    }
  }

  async function loadPopularWorkflows(){
    var shell = q('[data-popular-workflows]');
    if(!shell){ return; }
    try {
      var payload = await api.getRecommendedServices('');
      var services = ((payload && payload.services) || []).filter(function(item){
        return item && item.enabled !== false && item.entry_mode !== 'case_bound';
      });
      shell.innerHTML = services.slice(0, 6).map(function(item){
        return '<a class="workflow-card" href="' + escapeHtml(item.route) + '">' +
          '<strong>' + escapeHtml(item.name) + '</strong>' +
          '<span>' + escapeHtml(item.description) + '</span>' +
        '</a>';
      }).join('');
    } catch (error){
      shell.innerHTML = '<p class="empty-copy">No live workflows are pinned yet.</p>';
    }
  }

  function boot(){
    bindEntryCards();
    bindPrimaryButtons();
    loadPopularWorkflows();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
