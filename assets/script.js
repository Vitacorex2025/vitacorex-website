(function(){
  const $ = (s,p=document)=>p.querySelector(s);
  const $$ = (s,p=document)=>Array.from(p.querySelectorAll(s));
  const pageData = document.body.dataset.pageI18n ? JSON.parse(document.body.dataset.pageI18n) : {};
  const site = window.SITE_I18N || {};
  const menuBtn = $('.menu-btn');
  const mobilePanel = $('.mobile-panel');
  if(menuBtn && mobilePanel){menuBtn.addEventListener('click',()=>mobilePanel.classList.toggle('open'));}

  function applyLang(lang){
    const global = site[lang] || site.en || {};
    const current = pageData || {};
    $$('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(global[k]) el.textContent=global[k];});
    $$('[data-i18n-placeholder]').forEach(el=>{const k=el.dataset.i18nPlaceholder;if(global[k]) el.placeholder=global[k];});
    $$('[data-page-i18n]').forEach(el=>{const k=el.dataset.pageI18n; if(current[k] && current[k][lang]) el.textContent=current[k][lang];});
    $$('.lang-btn').forEach(btn=>btn.classList.toggle('active', btn.dataset.lang===lang));
    document.documentElement.lang = lang==='ru' ? 'ru' : (lang==='es' ? 'es' : 'en');
    localStorage.setItem('vcx_lang', lang);
  }
  const startLang = localStorage.getItem('vcx_lang') || 'en';
  applyLang(startLang);
  $$('.lang-btn').forEach(btn=>btn.addEventListener('click',()=>applyLang(btn.dataset.lang)));

  const revealObserver = new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting) e.target.classList.add('visible');});},{threshold:.18});
  $$('.reveal').forEach(el=>revealObserver.observe(el));

  const gate = $('#resourceGate'), gateForm = $('#gateForm'), gateTarget = $('#gateTarget'), gateError = $('#gateError');
  let exitShown = sessionStorage.getItem('vcx_exit_shown') === '1';
  function openGate(resource){ if(!gate) return; gateTarget.value = resource || ''; gate.classList.add('open'); gate.setAttribute('aria-hidden','false'); }
  function closeGate(){ if(!gate) return; gate.classList.remove('open'); gate.setAttribute('aria-hidden','true'); }
  $$('[data-close-modal]').forEach(btn=>btn.addEventListener('click', closeGate));
  if(gate){ gate.addEventListener('click', e=>{ if(e.target===gate) closeGate(); }); }
  $$('.gated-resource').forEach(btn=>btn.addEventListener('click',()=>openGate(btn.dataset.resource)));
  if(gateForm){
    gateForm.addEventListener('submit', e=>{
      e.preventDefault();
      gateError.textContent='';
      const name = $('#gateName').value.trim();
      const phone = $('#gatePhone').value.trim();
      const email = $('#gateEmail').value.trim();
      const target = gateTarget.value;
      if(!name || !phone || !email){gateError.textContent='Please complete all fields.'; return;}
      if(!/^\S+@\S+\.\S+$/.test(email)){gateError.textContent='Please enter a valid email.'; return;}
      const lead = {name, phone, email, target, ts: new Date().toISOString(), page: location.pathname};
      const existing = JSON.parse(localStorage.getItem('vcx_leads') || '[]'); existing.push(lead); localStorage.setItem('vcx_leads', JSON.stringify(existing));
      window.dataLayer = window.dataLayer || []; window.dataLayer.push({event:'pdf_unlock', resource: target});
      closeGate();
      if(target) window.open(target, '_blank');
    });
  }

  const exitPrompt = $('#exitPrompt');
  const exitPromptOpen = $('#exitPromptOpen');
  const exitPromptClose = $('#exitPromptClose');
  if(exitPromptOpen) exitPromptOpen.addEventListener('click', ()=>{ exitPrompt.hidden=true; openGate('assets/healthcare-cfo-brief.pdf'); });
  if(exitPromptClose) exitPromptClose.addEventListener('click', ()=>{ exitPrompt.hidden=true; exitShown=true; sessionStorage.setItem('vcx_exit_shown','1'); });

  let engaged = false;
  setTimeout(()=>{ engaged = true; }, 12000);
  document.addEventListener('mouseleave', e=>{
    if(window.innerWidth <= 900) return;
    if(!engaged || exitShown || e.clientY > 8) return;
    exitShown = true; sessionStorage.setItem('vcx_exit_shown','1'); if(exitPrompt) exitPrompt.hidden = false;
  });
  let mobileExitReady = false;
  window.addEventListener('scroll', ()=>{
    const doc = document.documentElement;
    const pct = (window.scrollY / (doc.scrollHeight - window.innerHeight || 1)) * 100;
    if(window.innerWidth <= 900 && !exitShown && engaged && pct > 55 && !mobileExitReady){
      mobileExitReady = true; setTimeout(()=>{ if(!exitShown && exitPrompt){ exitPrompt.hidden = false; exitShown = true; sessionStorage.setItem('vcx_exit_shown','1'); }}, 1200);
    }
    window.dataLayer = window.dataLayer || [];
    if(pct>25 && !window._q25){window._q25=true; dataLayer.push({event:'scroll_depth', depth:25});}
    if(pct>50 && !window._q50){window._q50=true; dataLayer.push({event:'scroll_depth', depth:50});}
    if(pct>75 && !window._q75){window._q75=true; dataLayer.push({event:'scroll_depth', depth:75});}
  }, {passive:true});

  $$('.btn, .nav-link').forEach(el=>el.addEventListener('click', ()=>{ window.dataLayer = window.dataLayer || []; dataLayer.push({event:'cta_click', label:(el.textContent||'').trim(), href:el.getAttribute('href')||''}); }));
  $$('[data-copy-text]').forEach(btn=>btn.addEventListener('click', async ()=>{ const target=$(btn.dataset.copyText); if(!target) return; try{ await navigator.clipboard.writeText(target.innerText.trim()); btn.textContent='Copied'; setTimeout(()=>btn.textContent='Copy summary', 1400);}catch(e){} }));

  const intakeForm = $('#intakeForm');
  if(intakeForm){
    intakeForm.addEventListener('submit', e=>{
      e.preventDefault();
      const fd = new FormData(intakeForm);
      const email = (fd.get('email')||'').toString().trim();
      if(!/^\S+@\S+\.\S+$/.test(email)){ $('#intakeError').textContent='Please enter a valid email.'; return; }
      $('#intakeError').textContent='';
      const service=(fd.get('service')||'').toString();
      const urgency=(fd.get('urgency')||'').toString();
      const docs=(fd.get('docs')||'').toString();
      const budget=(fd.get('budget')||'').toString();
      let score=35; if(service.includes('Corporate')) score+=22; if(service.includes('Pre-Collection')) score+=24; score += urgency==='Immediate'?15:urgency==='30 days'?10:6; score += docs==='Most documents ready'?18:docs==='Partial file available'?12:6; score += budget==='$5k+'?14:budget==='$2k-$5k'?10:6; score=Math.min(score,100);
      let path='Structured intake + scoping call'; if(service.includes('Pre-Collection')) path='Executive review + pilot diagnostic'; if(service.includes('Corporate')) path='File review + support package proposal';
      const summary=`Lead: ${fd.get('name')||''}\nCompany: ${fd.get('company')||''}\nEmail: ${email}\nPhone: ${fd.get('phone')||''}\nService path: ${service}\nUrgency: ${urgency}\nDocuments: ${docs}\nBudget: ${budget}\n\nMatter summary:\n${fd.get('summary')||''}\n\nQualification score: ${score}/100\nRecommended path: ${path}`;
      $('#resultScore').textContent = score + '/100'; $('#resultPath').textContent = path; $('#resultSummary').textContent = summary; $('#resultMail').href = 'mailto:VitaCoreX2025@gmail.com?subject=' + encodeURIComponent('VitaCoreX Intake - ' + service) + '&body=' + encodeURIComponent(summary); $('#intakeResult').hidden = false; $('#intakeResult').scrollIntoView({behavior:'smooth', block:'start'});
      window.dataLayer = window.dataLayer || []; dataLayer.push({event:'intake_submit', service, score});
    });
  }
})();
