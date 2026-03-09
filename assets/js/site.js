
(() => {
  const $=(s,e=document)=>e.querySelector(s), $$=(s,e=document)=>Array.from(e.querySelectorAll(s));
  const common=window.SITE_I18N||{};
  const page=window.PAGE_DATA||{};
  let lang=['en','ru','es'].includes(localStorage.getItem('vcx_lang'))?localStorage.getItem('vcx_lang'):'en';
  const hard={
    en:{order_services:'Order Services',request_service:'Request Service',primary_need:'Primary need',urgency:'Urgency',doc_readiness:'Document readiness',attachment_ref:'Attachment reference',brief_summary:'Brief situation summary',ph_attach:'Contract, invoice, screenshots, packet',ph_summary:'Describe the matter, the business context, and the decision that is blocked.',ready:'Core documents are ready',partial:'Only partial material is ready',standard:'Standard',high:'High',services_for_individuals:'Services for individuals'},
    ru:{order_services:'Заказать услуги',request_service:'Оставить заявку',primary_need:'Основная задача',urgency:'Срочность',doc_readiness:'Готовность документов',attachment_ref:'Ориентир по вложениям',brief_summary:'Краткое описание ситуации',ph_attach:'Договор, счёт, скриншоты, пакет документов',ph_summary:'Опишите задачу, деловой контекст и решение, которое сейчас заблокировано.',ready:'Основные документы готовы',partial:'Готова только часть материалов',standard:'Стандартная',high:'Высокая',services_for_individuals:'Услуги для физических лиц'},
    es:{order_services:'Solicitar servicios',request_service:'Solicitar servicio',primary_need:'Necesidad principal',urgency:'Urgencia',doc_readiness:'Disponibilidad de documentos',attachment_ref:'Referencia de adjuntos',brief_summary:'Resumen breve de la situación',ph_attach:'Contrato, factura, capturas, paquete',ph_summary:'Describa el asunto, el contexto empresarial y la decisión que está bloqueada.',ready:'Los documentos principales están listos',partial:'Solo parte del material está listo',standard:'Estándar',high:'Alta',services_for_individuals:'Servicios para particulares'}
  };
  function pageText(key){ return (page[lang]&&page[lang][key]) || (page.en&&page.en[key]) || ''; }
  function commonText(key){ return (common[lang]&&common[lang][key]) || (common.en&&common.en[key]) || ''; }
  function applyText(){
    document.documentElement.lang=lang;
    $$('.lang-btn').forEach(b=>b.classList.toggle('active', b.dataset.lang===lang));
    $$('[data-common]').forEach(el=>{ const v=commonText(el.dataset.common); if(v) el.textContent=v; });
    $$('[data-page]').forEach(el=>{ const v=pageText(el.dataset.page); if(v) el.textContent=v; });
    $$('[data-hard]').forEach(el=>{ const v=(hard[lang]||hard.en)[el.dataset.hard]; if(!v) return; if(el.matches('input,textarea')) el.placeholder=v; else el.textContent=v; });
    if(page[lang]?.title) document.title=page[lang].title;
    const meta=$('meta[name="description"]'); if(meta && page[lang]?.desc) meta.setAttribute('content', page[lang].desc);
    const need=$('#intakeForm select[name="need"]');
    if(need){ const vals=[pageText('svc1_t')||'Revenue Recovery Workflow Design', pageText('svc2_t')||'Corporate Legal File Control', pageText('svc3_t')||'Structured Case Intake & Packet Build']; [...need.options].forEach((o,i)=>{ if(vals[i]) o.textContent=vals[i]; }); }
    const urg=$('#intakeForm select[name="urgency"]'); if(urg){ if(urg.options[0]) urg.options[0].textContent=(hard[lang]||hard.en).standard; if(urg.options[1]) urg.options[1].textContent=(hard[lang]||hard.en).high; }
    const docs=$('#intakeForm select[name="docs"]'); if(docs){ if(docs.options[0]) docs.options[0].textContent=(hard[lang]||hard.en).ready; if(docs.options[1]) docs.options[1].textContent=(hard[lang]||hard.en).partial; }
  }
  applyText();
  $$('.lang-btn').forEach(b=>b.addEventListener('click',()=>{ lang=b.dataset.lang; localStorage.setItem('vcx_lang',lang); applyText(); }));

  const menuBtn=$('.menu-btn'), mobileNav=$('.mobile-nav');
  if(menuBtn) menuBtn.addEventListener('click',()=>mobileNav?.classList.toggle('open'));

  const header=$('.site-header');
  const compactHeader=()=>{ if(header) header.classList.toggle('compact', window.scrollY>72); };
  compactHeader(); window.addEventListener('scroll', compactHeader, {passive:true});

  function fmt(date,tz){ return new Intl.DateTimeFormat([], {hour:'2-digit',minute:'2-digit',hour12:false,timeZone:tz}).format(date); }
  function clocks(){ const d=new Date(); const vcx=fmt(d,'America/New_York'); const local=new Intl.DateTimeFormat([], {hour:'2-digit',minute:'2-digit',hour12:false}).format(d); $$('.clock-vcx').forEach(el=>el.textContent=vcx+' Tampa'); $$('.clock-local').forEach(el=>el.textContent=local); }
  clocks(); setInterval(clocks,1000);

  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target);} }), {threshold:.14});
  $$('.reveal').forEach(el=>io.observe(el));
  $$('.bar-fill').forEach(el=>{ const w=(el.dataset.width||0)+'%'; const ob=new IntersectionObserver(es=>{ if(es[0].isIntersecting){ el.style.width=w; ob.disconnect(); }}); ob.observe(el); });
  $$('[data-count-to]').forEach(el=>{ const target=parseFloat(el.dataset.countTo||'0'); const suffix=el.dataset.suffix||''; const ob=new IntersectionObserver(es=>{ if(!es[0].isIntersecting) return; let start; const dur=1200; const step=(ts)=>{ if(!start) start=ts; const p=Math.min((ts-start)/dur,1); const val=target*p; el.textContent=(Number.isInteger(target)?Math.round(val):val.toFixed(1))+suffix; if(p<1) requestAnimationFrame(step); }; requestAnimationFrame(step); ob.disconnect();}); ob.observe(el); });

  function goIntake(service){ const target=$('#intake') || $('#intakeForm') || document.getElementById('home'); if(target) target.scrollIntoView({behavior:'smooth', block:'start'}); const select=$('#intakeForm select[name="need"]'); if(select && service){ if(/Revenue Recovery/i.test(service)) select.value='recovery'; else if(/Corporate Legal/i.test(service)) select.value='file'; else select.value='intake'; } }
  $$('#orderServicesBtn, .header-cta, .service-request').forEach(btn=>btn.addEventListener('click',()=>goIntake(btn.dataset.service||'')));
  $('#openIntake')?.addEventListener('click',()=>goIntake('Structured Case Intake & Packet Build'));
  $('#seeProof')?.addEventListener('click',()=>$('#proof')?.scrollIntoView({behavior:'smooth'}));

  const gate=$('#pdfGate');
  function openGate(asset,label){ if(!gate) return; gate.classList.add('open'); gate.setAttribute('aria-hidden','false'); document.body.classList.add('modal-open'); gate.querySelector('[name="asset"]').value=asset||''; gate.querySelector('.gate-asset').textContent=label||'PDF'; }
  function closeGate(){ if(!gate) return; gate.classList.remove('open'); gate.setAttribute('aria-hidden','true'); document.body.classList.remove('modal-open'); }
  $$('[data-gated-asset], .resource-open').forEach(btn=>btn.addEventListener('click',e=>{ e.preventDefault(); openGate(btn.dataset.gatedAsset||btn.dataset.asset, btn.dataset.gatedLabel||btn.dataset.label); }));
  $$('.modal-close,.modal-cancel').forEach(btn=>btn.addEventListener('click', closeGate));
  gate?.addEventListener('click',e=>{ if(e.target===gate) closeGate(); });
  $('#gateForm')?.addEventListener('submit',e=>{ e.preventDefault(); const fd=new FormData(e.currentTarget); const required=['full_name','company','phone','email']; const ok=required.every(k=>String(fd.get(k)||'').trim()); const st=$('#gateState'); if(!ok){ st.textContent=lang==='ru'?'Заполните все обязательные поля.':lang==='es'?'Complete todos los campos obligatorios.':'Please complete all required fields.'; return; } const asset=String(fd.get('asset')||''); localStorage.setItem('vcx_gate', JSON.stringify(Object.fromEntries(fd.entries()))); closeGate(); if(asset) window.open(asset,'_blank','noopener'); });
  let exitShown=false, armed=false; setTimeout(()=>armed=true,10000);
  function triggerExit(){ if(exitShown) return; const first=$('[data-gated-asset], .resource-open'); if(first){ exitShown=true; openGate(first.dataset.gatedAsset||first.dataset.asset, first.dataset.gatedLabel||first.dataset.label); } }
  document.addEventListener('mouseout',e=>{ if(armed && !exitShown && e.clientY<=0 && window.innerWidth>900) triggerExit(); });
  window.addEventListener('scroll',()=>{ const depth=(window.scrollY+window.innerHeight)/Math.max(document.body.scrollHeight,1); if(armed && !exitShown && window.innerWidth<=900 && depth>.72) triggerExit(); },{passive:true});

  $('#intakeForm')?.addEventListener('submit',e=>{ e.preventDefault(); const fd=new FormData(e.currentTarget); const email=String(fd.get('email')||'').trim(); const result=$('#intakeOutput'); if(!result) return; if(!email){ result.innerHTML='<p class="small-note">'+(lang==='ru'?'Нужен email.':lang==='es'?'Se requiere email.':'Email is required.')+'</p>'; return; } const idx=lang==='ru'?1:lang==='es'?2:0; const serviceMap={ recovery:['Revenue Recovery Workflow Design','Система возврата дебиторной выручки','Diseño del flujo de recuperación de ingresos'], file:['Corporate Legal File Control','Контроль юридического документооборота компании','Control de archivos legales corporativos'], intake:['Structured Case Intake & Packet Build','Структурированный первичный разбор и сбор пакета','Evaluación inicial estructurada y armado del paquete']}; const service=serviceMap[fd.get('need')||'intake'][idx]; const fit=fd.get('urgency')==='high' ? (lang==='ru'?'Высокий приоритет':lang==='es'?'Alta prioridad':'High priority') : (lang==='ru'?'Стандартный приоритет':lang==='es'?'Prioridad estándar':'Standard priority'); const docs=fd.get('docs')==='ready' ? (lang==='ru'?'Отправьте договоры, счета, переписку и текущую хронологию.':lang==='es'?'Envíe contratos, facturas, correos y la cronología actual.':'Send contracts, invoices, emails, and the current chronology.') : (lang==='ru'?'Начните с краткого описания и 2–3 ключевых документов.':lang==='es'?'Empiece con un resumen breve y 2–3 documentos clave.':'Start with a short summary and 2–3 key documents.'); const next=lang==='ru'?'Мы рассмотрим intake и предложим первый рабочий пакет.':lang==='es'?'Revisaremos el intake y propondremos el primer paquete de trabajo.':'We will review the intake and propose the first work product.'; result.innerHTML=`<div class="out-row"><span>${commonText('out_service')}</span><strong>${service}</strong></div><div class="out-row"><span>${commonText('out_fit')}</span><strong>${fit}</strong></div><div class="out-row"><span>${commonText('out_docs')}</span><strong>${docs}</strong></div><div class="out-row"><span>${commonText('out_window')}</span><strong>${fd.get('urgency')==='high'?'24–48h':'2–4 business days'}</strong></div><div class="out-row"><span>${commonText('out_next')}</span><strong>${next}</strong></div><p class="small-note">${commonText('out_disc')}</p>`; });

  const careersModal=$('#careersMobileModal');
  $('#careersMobileOpen')?.addEventListener('click',e=>{ if(window.innerWidth<=900 && careersModal){ e.preventDefault(); careersModal.classList.add('open'); document.body.classList.add('modal-open'); }});
  careersModal?.addEventListener('click',e=>{ if(e.target===careersModal){ careersModal.classList.remove('open'); document.body.classList.remove('modal-open'); }});
  $$('.careers-close').forEach(btn=>btn.addEventListener('click',()=>{ careersModal?.classList.remove('open'); document.body.classList.remove('modal-open'); }));
})();
