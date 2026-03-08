
(function(){
  const commonI18n = JSON.parse(document.getElementById('common-i18n').textContent);
  const pageI18nEl = document.getElementById('page-i18n');
  const pageI18n = pageI18nEl ? JSON.parse(pageI18nEl.textContent) : {};
  const pageMetaEl = document.getElementById('page-meta');
  const pageMeta = pageMetaEl ? JSON.parse(pageMetaEl.textContent) : {};
  const storageLang = localStorage.getItem('vcx_lang') || 'en';
  let currentLang = ['en','ru','es'].includes(storageLang) ? storageLang : 'en';
  const dataLayer = window.dataLayer = window.dataLayer || [];
  const leadEndpoint = window.VCX_LEAD_ENDPOINT || '';
  function track(event, payload){
    const item = Object.assign({event, ts: new Date().toISOString(), page: location.pathname}, payload||{});
    dataLayer.push(item);
    try{
      const history = JSON.parse(localStorage.getItem('vcx_behavior') || '[]');
      history.push(item); if(history.length>250) history.shift();
      localStorage.setItem('vcx_behavior', JSON.stringify(history));
    }catch(e){}
  }
  function tx(path){
    const langSet = pageI18n[currentLang] || {};
    const parts = path.split('.');
    let node = langSet;
    for(const p of parts){ if(node && Object.prototype.hasOwnProperty.call(node,p)){ node = node[p]; } else { node = null; break; } }
    if(node == null){
      node = commonI18n[currentLang] && commonI18n[currentLang][path];
    }
    if(node == null){
      node = commonI18n.en && commonI18n.en[path];
    }
    return node;
  }
  function applyLanguage(lang){
    currentLang = lang; localStorage.setItem('vcx_lang', lang);
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el=>{ const value = tx(el.dataset.i18n); if(value!=null) el.innerHTML = value; });
    document.querySelectorAll('[data-i18n-common]').forEach(el=>{ const key = el.dataset.i18nCommon; const value = commonI18n[currentLang][key] || commonI18n.en[key]; if(value!=null) el.textContent = value; });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{ const value = tx(el.dataset.i18nPlaceholder); if(value!=null) el.setAttribute('placeholder', value); });
    document.querySelectorAll('[data-i18n-placeholder-common]').forEach(el=>{ const key = el.dataset.i18nPlaceholderCommon; const value = commonI18n[currentLang][key] || commonI18n.en[key]; if(value!=null) el.setAttribute('placeholder', value); });
    if(pageMeta[currentLang]){
      document.title = pageMeta[currentLang].title;
      const desc = document.querySelector('meta[name="description"]'); if(desc) desc.setAttribute('content', pageMeta[currentLang].description);
      const ogt = document.querySelector('meta[property="og:title"]'); if(ogt) ogt.setAttribute('content', pageMeta[currentLang].title);
      const ogd = document.querySelector('meta[property="og:description"]'); if(ogd) ogd.setAttribute('content', pageMeta[currentLang].description);
    }
    document.querySelectorAll('.lang-btn').forEach(btn=>btn.classList.toggle('active', btn.dataset.lang===lang));
  }
  document.querySelectorAll('.lang-btn').forEach(btn=>btn.addEventListener('click', ()=>{ applyLanguage(btn.dataset.lang); track('language_switch',{lang:btn.dataset.lang}); }));
  applyLanguage(currentLang);

  const mobileToggle = document.getElementById('mobileToggle');
  const headerActions = document.getElementById('headerActions');
  if(mobileToggle && headerActions) mobileToggle.addEventListener('click', ()=> headerActions.classList.toggle('open'));

  document.querySelectorAll('.reveal').forEach(el=>{
    const io = new IntersectionObserver(entries=>{ entries.forEach(entry=>{ if(entry.isIntersecting){ entry.target.classList.add('visible'); io.unobserve(entry.target); } }); }, {threshold: .12});
    io.observe(el);
  });

  document.querySelectorAll('[data-track]').forEach(el=>el.addEventListener('click', ()=>track('cta_click',{label:el.dataset.track})));

  const detailButtons = document.querySelectorAll('[data-toggle-detail]');
  detailButtons.forEach(btn=>btn.addEventListener('click', ()=>{
    const panel = document.getElementById(btn.dataset.toggleDetail);
    if(panel){
      const open = panel.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      track('detail_toggle',{panel:btn.dataset.toggleDetail,open});
    }
  }));

  document.querySelectorAll('.accordion button').forEach(btn=>btn.addEventListener('click', ()=>{
    const id = btn.dataset.panel;
    const panel = document.getElementById(id);
    if(panel) panel.classList.toggle('open');
  }));

  let gatePdf = '';
  const gateModal = document.getElementById('gateModal');
  const gateForm = document.getElementById('gateForm');
  function openGate(pdf){ gatePdf = pdf; if(gateModal) gateModal.hidden = false; track('gate_open',{pdf}); }
  function closeGate(){ if(gateModal) gateModal.hidden = true; }
  document.querySelectorAll('.open-gate').forEach(btn=>btn.addEventListener('click', (e)=>{ e.preventDefault(); openGate(btn.dataset.pdf); }));
  document.querySelectorAll('[data-close-gate]').forEach(el=>el.addEventListener('click', closeGate));
  if(gateForm){ gateForm.addEventListener('submit', async function(e){
      e.preventDefault();
      const fd = new FormData(gateForm);
      const payload = Object.fromEntries(fd.entries());
      payload.pdf = gatePdf; payload.lang = currentLang;
      track('resource_unlock', payload);
      if(leadEndpoint){
        try{ await fetch(leadEndpoint,{method:'POST',mode:'no-cors',body:new URLSearchParams(payload)}); }catch(err){}
      }
      closeGate();
      window.open(gatePdf, '_blank');
      gateForm.reset();
  }); }

  const exitPopup = document.getElementById('exitPopup');
  let exitSeen = sessionStorage.getItem('vcx_exit_seen');
  function showExit(){ if(exitPopup && !exitSeen){ exitPopup.hidden = false; exitSeen='1'; sessionStorage.setItem('vcx_exit_seen','1'); track('exit_popup_show'); } }
  document.querySelectorAll('[data-close-exit]').forEach(el=>el.addEventListener('click', ()=>{ if(exitPopup) exitPopup.hidden = true; }));
  document.addEventListener('mouseout', (e)=>{ if(e.clientY < 12) showExit(); });
  setTimeout(()=> showExit(), 18000);

  const form = document.getElementById('intakeForm');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const fd = new FormData(form);
      const service = String(fd.get('service')||'');
      const urgency = String(fd.get('urgency')||'');
      const docs = String(fd.get('docs')||'');
      const budget = String(fd.get('budget')||'');
      let score = 35;
      if(service.includes('Corporate')) score += 24;
      if(service.includes('Pre-Collection') || service.includes('Recovery')) score += 22;
      if(urgency === 'Immediate') score += 15; else if(urgency === '30 days') score += 10; else score += 6;
      if(docs === 'Most documents ready') score += 18; else if(docs === 'Partial file available') score += 12; else score += 6;
      if(budget === '$5k+') score += 14; else if(budget === '$2k-$5k') score += 10; else score += 6;
      score = Math.min(score, 100);
      let path = 'Structured intake + scoping call';
      if(service.includes('Pre-Collection') || service.includes('Recovery')) path = 'CFO scoping call + control review';
      if(service.includes('Corporate')) path = 'File review + legal support package proposal';
      const summary = `Lead: ${fd.get('name')||''}\nCompany: ${fd.get('company')||''}\nEmail: ${fd.get('email')||''}\nPhone: ${fd.get('phone')||''}\nService path: ${service}\nUrgency: ${urgency}\nDocuments: ${docs}\nBudget: ${budget}\n\nMatter summary:\n${fd.get('summary')||''}\n\nQualification score: ${score}/100\nRecommended path: ${path}`;
      const result = document.getElementById('intakeResult');
      if(result){
        result.classList.add('show');
        document.getElementById('resultScore').textContent = score + '/100';
        document.getElementById('resultPath').textContent = path;
        document.getElementById('resultSummary').textContent = summary;
        const mail = document.getElementById('resultMail');
        if(mail) mail.href = 'mailto:VitaCoreX2025@gmail.com?subject=' + encodeURIComponent('VitaCoreX Intake - ' + service) + '&body=' + encodeURIComponent(summary);
        result.scrollIntoView({behavior:'smooth', block:'start'});
      }
      track('intake_submit',{service, score});
    });
  }
  document.querySelectorAll('[data-copy-text]').forEach(btn=>btn.addEventListener('click', async ()=>{
    const el = document.querySelector(btn.dataset.copyText);
    if(!el) return;
    await navigator.clipboard.writeText(el.textContent.trim());
    track('copy_summary');
  }));

  const checkpoints = [25,50,75,100];
  const fired = {};
  window.addEventListener('scroll', ()=>{
    const h = document.documentElement;
    const pct = Math.round((h.scrollTop/(h.scrollHeight-h.clientHeight))*100);
    checkpoints.forEach(cp=>{ if(pct>=cp && !fired[cp]){ fired[cp]=true; track('scroll_depth',{percent:cp}); } });
  }, {passive:true});
})();
