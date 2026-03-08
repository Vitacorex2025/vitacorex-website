
(()=>{
  const $=(s,el=document)=>el.querySelector(s), $$=(s,el=document)=>Array.from(el.querySelectorAll(s));
  const data = document.body.dataset.pageI18n ? JSON.parse(document.body.dataset.pageI18n) : {};
  const globalI18n = window.SITE_I18N || {};
  const endpoint = (window.VCX_CONFIG && window.VCX_CONFIG.leadEndpoint) || "";
  const langButtons = $$('.lang-btn');
  const menuBtn = $('.menu-btn'); const mobilePanel = $('.mobile-panel');
  if(menuBtn) menuBtn.addEventListener('click',()=> mobilePanel.classList.toggle('open'));

  function applyLang(lang){
    const g = globalI18n[lang] || globalI18n.en || {};
    localStorage.setItem('vcx_lang', lang);
    document.documentElement.lang = lang;
    langButtons.forEach(b=>b.classList.toggle('active', b.dataset.lang===lang));
    $$('[data-i18n]').forEach(el=>{ const key = el.dataset.i18n; if(g[key]) el.textContent = g[key]; });
    $$('[data-page-i18n]').forEach(el=>{ const key = el.dataset.pageI18n; if(data[key] && data[key][lang]) el.textContent = data[key][lang]; });
    if(data.title && data.title[lang]) document.title = data.title[lang];
    const md = $('meta[name="description"]'); if(md && data.meta_desc && data.meta_desc[lang]) md.setAttribute('content', data.meta_desc[lang]);
  }
  const initialLang = ['en','ru','es'].includes(localStorage.getItem('vcx_lang')) ? localStorage.getItem('vcx_lang') : 'en';
  applyLang(initialLang);
  langButtons.forEach(btn=>btn.addEventListener('click',()=> applyLang(btn.dataset.lang)));

  // reveal
  const io = new IntersectionObserver(entries=> entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target);} }), {threshold:.14});
  $$('.reveal').forEach(el=>io.observe(el));

  // gate logic
  const gateModal = $('#gateModal'); const gateForm = $('#gateForm'); const gateState = $('#gateState');
  const gateAsset = $('#gateAsset'); const gateAssetLabel = $('#gateAssetLabel');
  let exitShown = sessionStorage.getItem('vcx_exit_shown') === '1';
  function openGate(asset,label){
    if(!gateModal) return;
    gateAsset.value = asset || (window.VCX_CONFIG && window.VCX_CONFIG.defaultAsset) || '';
    gateAssetLabel.value = label || (window.VCX_CONFIG && window.VCX_CONFIG.defaultAssetLabel) || 'Resource';
    gateState.textContent = '';
    gateModal.classList.add('open'); gateModal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden';
    setTimeout(()=> gateForm?.querySelector('input[name="name"]')?.focus(), 30);
  }
  function closeGate(){ if(!gateModal) return; gateModal.classList.remove('open'); gateModal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; }
  $('.modal-close')?.addEventListener('click', closeGate); $('.modal-cancel')?.addEventListener('click', closeGate);
  gateModal?.addEventListener('click', e=>{ if(e.target === gateModal) closeGate(); });
  $$('.gated-resource,.exit-open').forEach(a=> a.addEventListener('click', e=>{ e.preventDefault(); openGate(a.dataset.asset, a.dataset.assetLabel); $('#exitPrompt')?.setAttribute('hidden','hidden'); }));
  gateForm?.addEventListener('submit', async e=>{
    e.preventDefault();
    const fd = new FormData(gateForm); const payload = {timestamp:new Date().toISOString(), name:(fd.get('name')||'').toString().trim(), phone:(fd.get('phone')||'').toString().trim(), email:(fd.get('email')||'').toString().trim(), source_page:document.body.dataset.page || location.pathname, asset_name:(fd.get('assetLabel')||'').toString().trim(), asset:(fd.get('asset')||'').toString().trim()};
    if(!payload.name || !payload.phone || !payload.email){ gateState.textContent='Please complete all required fields.'; return; }
    localStorage.setItem('vcx_last_lead', JSON.stringify(payload));
    window.dataLayer = window.dataLayer || []; dataLayer.push({event:'pdf_gate_submit', asset:payload.asset_name, page:payload.source_page});
    if(endpoint){
      try{ await fetch(endpoint,{method:'POST',mode:'cors',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});}catch(err){}
    }
    closeGate();
    if(payload.asset){ window.open(payload.asset, '_blank', 'noopener'); }
  });

  // exit intent: desktop mouseleave, mobile scroll depth after engagement
  const exitPrompt = $('#exitPrompt');
  function showExit(){ if(exitShown || gateModal?.classList.contains('open') || !exitPrompt) return; exitPrompt.hidden = false; exitShown = true; sessionStorage.setItem('vcx_exit_shown','1'); }
  let entered = false; setTimeout(()=> entered = true, 12000);
  document.addEventListener('mouseout', e=>{ if(entered && !exitShown && e.clientY <= 0){ showExit(); } });
  let mobilePrompted = false; window.addEventListener('scroll', ()=>{
    const depth = (window.scrollY + window.innerHeight) / Math.max(document.body.scrollHeight,1);
    if(!mobilePrompted && entered && depth > .62 && window.innerWidth < 900){ mobilePrompted = true; showExit(); }
    const steps = [0.25,0.5,0.75,1]; window.__depthState = window.__depthState || {}; steps.forEach(step=>{ if(depth >= step && !window.__depthState[step]){ window.__depthState[step] = true; window.dataLayer = window.dataLayer || []; dataLayer.push({event:'scroll_depth', depth:Math.round(step*100)}); } });
  }, {passive:true});
  $('.modal-mini-close')?.addEventListener('click', ()=> exitPrompt.hidden = true);

  // CTA tracking
  $$('a.btn, button.btn').forEach(el=> el.addEventListener('click', ()=>{ window.dataLayer = window.dataLayer || []; dataLayer.push({event:'cta_click', label:(el.textContent||'').trim(), page:document.body.dataset.page || location.pathname}); }));

  // intake form
  const form = $('#intakeForm');
  if(form){ form.addEventListener('submit', e=>{
      e.preventDefault();
      const fd = new FormData(form); const email = (fd.get('email')||'').toString().trim();
      if(!email){ $('#intakeError').hidden = false; $('#intakeError').textContent = 'Email is required.'; return; }
      $('#intakeError').hidden = true;
      const service = (fd.get('service')||'').toString(), urgency=(fd.get('urgency')||'').toString(), docs=(fd.get('docs')||'').toString(), budget=(fd.get('budget')||'').toString();
      let score = 35; if(/Corporate|Pre-Collection/.test(service)) score += 24; if(urgency==='Immediate') score += 15; else if(urgency==='30 days') score += 10; else score += 6; if(docs==='Most documents ready') score += 18; else if(docs==='Partial file available') score += 12; else score += 6; if(budget==='$5k+') score += 14; else if(budget==='$2k-$5k') score += 10; else score += 6; score = Math.min(score,100);
      let path = 'Structured intake + scoping call'; if(service==='Pre-Collection Architecture') path = 'Recovery architecture review + pilot discussion'; if(service==='Corporate Legal Support Package') path = 'File review + support package proposal';
      const summary = `Lead: ${fd.get('name')||''}
Company: ${fd.get('company')||''}
Email: ${email}
Phone: ${fd.get('phone')||''}
Service path: ${service}
Urgency: ${urgency}
Documents: ${docs}
Budget: ${budget}

Matter summary:
${fd.get('summary')||''}

Qualification score: ${score}/100
Recommended path: ${path}`;
      $('#resultScore').textContent = `${score}/100`; $('#resultPath').textContent = path; $('#resultSummary').textContent = summary; $('#resultMail').href = 'mailto:VitaCoreX2025@gmail.com?subject=' + encodeURIComponent('VitaCoreX Intake - ' + service) + '&body=' + encodeURIComponent(summary); $('#intakeResult').hidden = false; $('#intakeResult').scrollIntoView({behavior:'smooth', block:'start'});
      window.dataLayer = window.dataLayer || []; dataLayer.push({event:'intake_submit', service, score});
  }); }

  // careers
  const careerForm = $('#careerForm');
  careerForm?.addEventListener('submit', e=>{ e.preventDefault(); const fd = new FormData(careerForm); $('#careerState').textContent = 'Thank you. Please review your email draft or send directly if prompted.'; const body = encodeURIComponent(`Name: ${fd.get('name')||''}\nEmail: ${fd.get('email')||''}\n\nBackground:\n${fd.get('summary')||''}`); window.location.href = `mailto:VitaCoreX2025@gmail.com?subject=Career%20Interest&body=${body}`; });
})();
