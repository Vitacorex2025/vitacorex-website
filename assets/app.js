
(function(){
  const dataLayer = window.dataLayer = window.dataLayer || [];
  const track = (event, meta={}) => {
    dataLayer.push({event, ...meta, ts:new Date().toISOString()});
    try{
      const stored = JSON.parse(localStorage.getItem('vitacorex_events') || '[]');
      stored.push({event, ...meta, ts:new Date().toISOString()});
      localStorage.setItem('vitacorex_events', JSON.stringify(stored.slice(-200)));
    }catch(e){}
  };

  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  if(toggle && header){
    toggle.addEventListener('click', ()=>header.classList.toggle('open'));
  }

  document.querySelectorAll('a, button').forEach(el=>{
    el.addEventListener('click', ()=>{
      track('cta_click',{text:(el.innerText||'').trim().slice(0,80), href:el.getAttribute('href')||'', id:el.id||''});
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
      if(/Corporate|Корпоратив|corporativo/i.test(service)) score += 22;
      if(/Pre|Recovery|коллек|cobro/i.test(service)) score += 24;
      if(urgency === 'Immediate') score += 15; else if(urgency === '30 days') score += 10; else score += 6;
      if(docs === 'Most documents ready') score += 18; else if(docs === 'Partial file available') score += 12; else score += 6;
      if(budget === '$5k+') score += 14; else if(budget === '$2k-$5k') score += 10; else score += 6;
      score = Math.min(score, 100);
      let path = 'Structured intake + scoping call';
      if(/Pre|Recovery|коллек|cobro/i.test(service)) path = 'CFO scoping call + pilot diagnostic';
      if(/Corporate|Корпоратив|corporativo/i.test(service)) path = 'Corporate legal support package review';
      document.getElementById('qualification_score').value = score;
      document.getElementById('recommended_route').value = path;
      const summary = `Lead: ${fd.get('name') || ''}\nCompany: ${fd.get('company') || ''}\nEmail: ${fd.get('email') || ''}\nPhone: ${fd.get('phone') || ''}\nService path: ${service}\nUrgency: ${urgency}\nDocuments: ${docs}\nBudget: ${budget}\n\nMatter summary:\n${fd.get('summary') || ''}\n\nQualification score: ${score}/100\nRecommended path: ${path}`;
      const box = document.getElementById('intakeResult');
      const scoreEl = document.getElementById('resultScore');
      const pathEl = document.getElementById('resultPath');
      const summaryEl = document.getElementById('resultSummary');
      const mailEl = document.getElementById('resultMail');
      if(box && scoreEl && pathEl && summaryEl && mailEl){
        scoreEl.textContent = score + '/100';
        pathEl.textContent = path;
        summaryEl.textContent = summary;
        mailEl.href = 'mailto:VitaCoreX2025@gmail.com?subject=' + encodeURIComponent('VitaCoreX Intake - ' + service) + '&body=' + encodeURIComponent(summary);
        box.hidden = false;
        box.scrollIntoView({behavior:'smooth'});
      }
      track('intake_scored',{score, path, service});
      setTimeout(()=> form.submit(), 500);
    });
  }

  let sent25=false,sent50=false,sent75=false;
  window.addEventListener('scroll', ()=>{
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const pct = Math.round((window.scrollY / max) * 100);
    if(pct>=25 && !sent25){sent25=true; track('scroll_depth',{percent:25});}
    if(pct>=50 && !sent50){sent50=true; track('scroll_depth',{percent:50});}
    if(pct>=75 && !sent75){sent75=true; track('scroll_depth',{percent:75});}
  }, {passive:true});

  const exit = document.getElementById('exitPopup');
  if(exit){
    let shown = false;
    const showExit = () => {
      if(shown) return;
      shown = true;
      exit.hidden = false;
      track('exit_popup_shown');
    };
    setTimeout(showExit, 25000);
    document.addEventListener('mouseout', (e)=>{
      if(e.clientY <= 0) showExit();
    });
    const closeBtn = exit.querySelector('.exit-close');
    if(closeBtn){
      closeBtn.addEventListener('click', ()=> exit.hidden = true);
    }
    exit.addEventListener('click', (e)=>{
      if(e.target === exit) exit.hidden = true;
    });
  }

  document.querySelectorAll('form').forEach(f=>{
    f.addEventListener('submit', ()=> track('form_submit',{form_action:f.action || '', page:document.body.dataset.page || ''}));
  });

  track('page_view',{page:document.body.dataset.page || '', title:document.title});
})();
