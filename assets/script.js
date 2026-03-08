(function(){
  const topbar = document.querySelector('.topbar');
  const toggle = document.querySelector('.nav-toggle');
  if(toggle && topbar){
    toggle.addEventListener('click', ()=> topbar.classList.toggle('open'));
  }
  document.querySelectorAll('[data-copy-text]').forEach(btn=>{
    btn.addEventListener('click', async ()=>{
      const target = document.querySelector(btn.getAttribute('data-copy-text'));
      if(!target) return;
      try{ await navigator.clipboard.writeText(target.innerText.trim()); btn.textContent='Copied'; setTimeout(()=>btn.textContent='Copy summary', 1600);}catch(e){}
    });
  });
  const form = document.getElementById('intakeForm');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const fd = new FormData(form);
      const service = (fd.get('service') || '').toString();
      const urgency = (fd.get('urgency') || '').toString();
      const docs = (fd.get('docs') || '').toString();
      const budget = (fd.get('budget') || '').toString();
      let score = 35;
      if(service === 'Corporate Paralegal Support') score += 22;
      if(service === 'Patient Net Recovery / Pre-Collection') score += 24;
      if(urgency === 'Immediate') score += 15; else if(urgency === '30 days') score += 10; else score += 6;
      if(docs === 'Most documents ready') score += 18; else if(docs === 'Partial file available') score += 12; else score += 6;
      if(budget === '$5k+') score += 14; else if(budget === '$2k-$5k') score += 10; else score += 6;
      score = Math.min(score, 100);
      let path = 'Structured intake + scoping call';
      if(service === 'Patient Net Recovery / Pre-Collection') path = 'CFO scoping call + pilot diagnostic';
      if(service === 'Corporate Paralegal Support') path = 'File review + support-model proposal';
      const summary = `Lead: ${fd.get('name') || ''}
Company: ${fd.get('company') || ''}
Email: ${fd.get('email') || ''}
Phone: ${fd.get('phone') || ''}
Service path: ${service}
Urgency: ${urgency}
Documents: ${docs}
Budget: ${budget}

Matter summary:
${fd.get('summary') || ''}

Qualification score: ${score}/100
Recommended path: ${path}`;
      const box = document.getElementById('intakeResult');
      const summaryEl = document.getElementById('resultSummary');
      const scoreEl = document.getElementById('resultScore');
      const pathEl = document.getElementById('resultPath');
      const mail = document.getElementById('resultMail');
      if(scoreEl) scoreEl.textContent = score + '/100';
      if(pathEl) pathEl.textContent = path;
      if(summaryEl) summaryEl.textContent = summary;
      if(mail) mail.href = 'mailto:VitaCoreX2025@gmail.com?subject=' + encodeURIComponent('VitaCoreX Intake - ' + service) + '&body=' + encodeURIComponent(summary);
      if(box) box.hidden = false;
      box.scrollIntoView({behavior:'smooth', block:'start'});
    });
  }
})();