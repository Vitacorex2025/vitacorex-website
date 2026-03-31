
(function(){
  const doc = document;
  function initMenu(){
    const btn = doc.querySelector('[data-menu-toggle]');
    const menu = doc.querySelector('[data-mobile-menu]');
    if(!btn || !menu) return;
    function setOpen(open){
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menu.hidden = !open;
    }
    setOpen(false);
    btn.addEventListener('click', function(){ setOpen(menu.hidden); });
    menu.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click', function(){ setOpen(false); });
    });
    window.addEventListener('resize', function(){ if(window.innerWidth > 1100){ setOpen(false); } });
  }
  function initYear(){
    doc.querySelectorAll('[data-year]').forEach(function(el){ el.textContent = String(new Date().getFullYear()); });
  }
  function initFileLabels(){
    doc.querySelectorAll('input[type="file"][data-file-list]').forEach(function(input){
      const target = doc.querySelector(input.getAttribute('data-file-list'));
      if(!target) return;
      function sync(){
        const files = Array.from(input.files || []);
        target.textContent = files.length ? files.map(function(file){ return file.name; }).join(', ') : 'No files selected.';
      }
      input.addEventListener('change', sync);
      sync();
    });
  }
  function initFormReplyTo(){
    doc.querySelectorAll('form[data-demo-form]').forEach(function(form){
      const email = form.querySelector('input[name="email"]');
      const replyField = form.querySelector('input[name="_replyto"]');
      const submitBtn = form.querySelector('[type="submit"]');
      const nextField = form.querySelector('input[name="_next"]');
      if(nextField && window.location && window.location.origin){
        nextField.value = window.location.origin.replace(/\/$/, '') + '/thank-you.html';
      }
      if(email && replyField){
        const sync = function(){ replyField.value = email.value.trim(); };
        email.addEventListener('input', sync);
        email.addEventListener('change', sync);
        sync();
      }
      form.addEventListener('submit', function(){
        if(submitBtn){
          submitBtn.disabled = true;
          submitBtn.textContent = 'Sending...';
        }
      });
    });
  }
  initMenu();
  initYear();
  initFileLabels();
  initFormReplyTo();
})();
