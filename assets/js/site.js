
(function(){
const $=(s,e=document)=>e.querySelector(s), $$=(s,e=document)=>Array.from(e.querySelectorAll(s));
const common=window.SITE_I18N||{}; const page=window.PAGE_DATA||{}; let lang=['en','ru','es'].includes(localStorage.getItem('vcx_lang'))?localStorage.getItem('vcx_lang'):'en';
function t(key){ return (page[lang]&&page[lang][key]) || (common[lang]&&common[lang][key]) || (page.en&&page.en[key]) || (common.en&&common.en[key]) || ''; }
function applyText(){ document.documentElement.lang=lang; $$('.lang-btn').forEach(b=>b.classList.toggle('active', b.dataset.lang===lang)); $$('[data-common]').forEach(el=>{ const v=common[lang]?.[el.dataset.common] || common.en?.[el.dataset.common]; if(v) el.textContent=v; }); $$('[data-page]').forEach(el=>{ const v=t(el.dataset.page); if(v) el.textContent=v; }); if(page[lang]?.title) document.title=page[lang].title; const md=$('meta[name="description"]'); if(md && page[lang]?.desc) md.setAttribute('content',page[lang].desc); }
applyText();
$$('.lang-btn').forEach(b=>b.addEventListener('click',()=>{ lang=b.dataset.lang; localStorage.setItem('vcx_lang',lang); applyText(); }));
const menuBtn=$('.menu-btn'), mobileNav=$('.mobile-nav'); if(menuBtn) menuBtn.addEventListener('click',()=>mobileNav.classList.toggle('open'));
function fmt(date,tz){ return new Intl.DateTimeFormat([], {hour:'2-digit',minute:'2-digit',hour12:false,timeZone:tz}).format(date); }
function clocks(){ const d=new Date(); $$('.clock-vcx').forEach(el=>el.textContent=fmt(d,'America/New_York')); const local=new Intl.DateTimeFormat([], {hour:'2-digit',minute:'2-digit',hour12:false}).format(d); $$('.clock-local').forEach(el=>el.textContent=local); }
clocks(); setInterval(clocks,1000);
const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); } }), {threshold:.14}); $$('.reveal').forEach(el=>io.observe(el));
$$('.bar-fill').forEach(el=>{ const w=el.dataset.width||0; const ob=new IntersectionObserver(es=>{ if(es[0].isIntersecting){ el.style.width=w+'%'; ob.disconnect(); }}); ob.observe(el); });
$$('[data-count-to]').forEach(el=>{ const target=parseFloat(el.dataset.countTo), suffix=el.dataset.suffix||''; const ob=new IntersectionObserver(es=>{ if(es[0].isIntersecting){ let start=null; const dur=1200; const step=ts=>{ if(!start) start=ts; const p=Math.min((ts-start)/dur,1); const val=target*p; el.textContent=(Number.isInteger(target)?Math.round(val):val.toFixed(1))+suffix; if(p<1) requestAnimationFrame(step); }; requestAnimationFrame(step); ob.disconnect(); }}); ob.observe(el); });
const gate=$('#pdfGate'); function openGate(asset,label){ if(!gate) return; gate.classList.add('open'); gate.setAttribute('aria-hidden','false'); document.body.classList.add('modal-open'); gate.querySelector('[name="asset"]').value=asset||''; gate.querySelector('.gate-asset').textContent=label||'PDF'; }
function closeGate(){ if(!gate) return; gate.classList.remove('open'); gate.setAttribute('aria-hidden','true'); document.body.classList.remove('modal-open'); }
$$('[data-gated-asset]').forEach(btn=>btn.addEventListener('click',e=>{ e.preventDefault(); openGate(btn.dataset.gatedAsset, btn.dataset.gatedLabel); }));
$$('.modal-close,.modal-cancel').forEach(btn=>btn.addEventListener('click',closeGate)); gate && gate.addEventListener('click',e=>{ if(e.target===gate) closeGate(); });
const gateForm=$('#gateForm'); if(gateForm){ gateForm.addEventListener('submit',e=>{ e.preventDefault(); const fd=new FormData(gateForm); const required=['full_name','company','phone','email']; const ok=required.every(k=>String(fd.get(k)||'').trim()); const st=$('#gateState'); if(!ok){ st.textContent = lang==='ru'?'Заполните все обязательные поля.':lang==='es'?'Complete todos los campos obligatorios.':'Please complete all required fields.'; return; } localStorage.setItem('vcx_gate', JSON.stringify(Object.fromEntries(fd.entries()))); const asset=String(fd.get('asset')||''); closeGate(); if(asset) window.open(asset,'_blank','noopener'); }); }
let exitShown=false, armed=false; setTimeout(()=>armed=true,12000); function triggerExit(){ if(exitShown) return; const first=$('[data-gated-asset]'); if(first){ exitShown=true; openGate(first.dataset.gatedAsset, first.dataset.gatedLabel); } }
document.addEventListener('mouseout',e=>{ if(armed && !exitShown && e.clientY<=0 && window.innerWidth>900) triggerExit(); });
window.addEventListener('scroll',()=>{ const depth=(window.scrollY+window.innerHeight)/Math.max(document.body.scrollHeight,1); if(armed && !exitShown && window.innerWidth<=900 && depth>.68) triggerExit(); }, {passive:true});
const calc=$('#cfoCalc'); if(calc){ const out={a:$('#calcAgency'),b:$('#calcPre'),c:$('#calcLift'),d:$('#calcLiftPct')}; const recompute=()=>{ const principal=+calc.principal.value||0, gross=(+calc.gross.value||0)/100, fee=(+calc.fee.value||0)/100, accept=(+calc.accept.value||0)/100, complete=(+calc.complete.value||0)/100, recovery=(+calc.recovery.value||0)/100, setup=+calc.setup.value||0; const agency=principal*gross*(1-fee); const pre=principal*(accept*complete*recovery)+(principal*(1-accept*complete))*(gross*(1-fee))-setup; const lift=pre-agency; const pct=agency?(lift/agency*100):0; out.a.textContent='$'+agency.toLocaleString(undefined,{maximumFractionDigits:0}); out.b.textContent='$'+pre.toLocaleString(undefined,{maximumFractionDigits:0}); out.c.textContent=(lift>=0?'+':'-')+'$'+Math.abs(lift).toLocaleString(undefined,{maximumFractionDigits:0}); out.d.textContent=(pct>=0?'+':'')+pct.toLocaleString(undefined,{maximumFractionDigits:1})+'%'; }; $$('input',calc).forEach(i=>i.addEventListener('input',recompute)); recompute(); }
const intake=$('#intakeForm'); if(intake){ intake.addEventListener('submit',e=>{ e.preventDefault(); const fd=new FormData(intake); const email=String(fd.get('email')||'').trim(); const result=$('#intakeOutput'); if(!email){ result.innerHTML='<p class="small-note">'+(lang==='ru'?'Нужен email.':lang==='es'?'Se requiere email.':'Email is required.')+'</p>'; return; } const serviceMap={recovery:['Revenue Recovery Workflow Design','Система возврата дебиторной выручки','Diseño del flujo de recuperación de ingresos'],file:['Corporate Legal File Control','Контроль юридического документооборота компании','Control de archivos legales corporativos'],intake:['Structured Case Intake & Packet Build','Структурированный первичный разбор и сбор пакета','Evaluación inicial estructurada y armado del paquete']}; const idx=lang==='ru'?1:lang==='es'?2:0; const service=serviceMap[fd.get('need')||'intake'][idx]; const fit=fd.get('urgency')==='high' ? (lang==='ru'?'Высокий приоритет':lang==='es'?'Alta prioridad':'High priority') : (lang==='ru'?'Стандартный приоритет':lang==='es'?'Prioridad estándar':'Standard priority'); const docs=fd.get('docs')==='ready' ? (lang==='ru'?'Отправьте договоры, счета, переписку и текущую хронологию.':lang==='es'?'Envíe contratos, facturas, correos y la cronología actual.':'Send contracts, invoices, emails, and the current chronology.') : (lang==='ru'?'Начните с краткого описания и 2–3 ключевых документов.':lang==='es'?'Empiece con un resumen breve y 2–3 documentos clave.':'Start with a short summary and 2–3 key documents.'); const next=lang==='ru'?'Мы рассмотрим intake и предложим первый рабочий пакет.':lang==='es'?'Revisaremos el intake y propondremos el primer paquete de trabajo.':'We will review the intake and propose the first work product.'; result.innerHTML=`<div class="out-row"><span>${common[lang].out_service}</span><strong>${service}</strong></div><div class="out-row"><span>${common[lang].out_fit}</span><strong>${fit}</strong></div><div class="out-row"><span>${common[lang].out_docs}</span><strong>${docs}</strong></div><div class="out-row"><span>${common[lang].out_window}</span><strong>${fd.get('urgency')==='high'?'24–48h':'2–4 business days'}</strong></div><div class="out-row"><span>${common[lang].out_next}</span><strong>${next}</strong></div><p class="small-note">${common[lang].out_disc}</p>`; }); }
const careersOpen=$('#careersMobileOpen'), careersModal=$('#careersMobileModal'); if(careersOpen && careersModal){ careersOpen.addEventListener('click',e=>{ if(window.innerWidth<=900){ e.preventDefault(); careersModal.classList.add('open'); document.body.classList.add('modal-open'); } }); careersModal.addEventListener('click',e=>{ if(e.target===careersModal){ careersModal.classList.remove('open'); document.body.classList.remove('modal-open'); }}); $$('.careers-close').forEach(b=>b.addEventListener('click',()=>{ careersModal.classList.remove('open'); document.body.classList.remove('modal-open'); })); }
})();

// v25 enhancements
(function(){
  const qs=new URLSearchParams(location.search);
  const orderText={en:'Order Services',ru:'Заказать услуги',es:'Solicitar servicios'};
  const reqText={en:'Request Service',ru:'Запросить услугу',es:'Solicitar servicio'};
  const menuText={en:'Menu',ru:'Меню',es:'Menú'};
  const nav=document.querySelector('.main-nav');
  if(nav && !document.querySelector('.order-services-btn')){
    const a=document.createElement('a');
    a.href='structured-case-intake.html';
    a.className='btn btn-primary order-services-btn';
    a.textContent=orderText[lang]||orderText.en;
    nav.parentNode.insertBefore(a, nav.nextSibling);
  }
  function syncDynText(){
    const b=document.querySelector('.order-services-btn'); if(b) b.textContent=orderText[lang]||orderText.en;
    document.querySelectorAll('.service-request-link').forEach(el=>el.textContent=reqText[lang]||reqText.en);
    const m=document.querySelector('.menu-btn'); if(m) m.setAttribute('aria-label', menuText[lang]||menuText.en);
  }
  syncDynText();
  document.querySelectorAll('.lang-btn').forEach(b=>b.addEventListener('click',()=>setTimeout(syncDynText,0)));
  // compact header on scroll
  const header=document.querySelector('.site-header');
  const onScroll=()=>{ if(!header) return; header.classList.toggle('compact', window.scrollY>70); };
  onScroll(); window.addEventListener('scroll', onScroll, {passive:true});
  // query param preselect for intake/service pages
  const serviceParam=qs.get('service');
  const need=document.querySelector('#intakeForm [name="need"]');
  if(serviceParam && need){
    const map={contracts:'file',immigration:'intake',auto:'intake',plans:'intake'};
    if(map[serviceParam]) need.value=map[serviceParam];
  }
  // careers gated mailto
  const cf=document.getElementById('careersForm');
  const cl=document.getElementById('careersApplyLink');
  if(cf && cl){
    const update=()=>{
      const fd=new FormData(cf);
      const name=(fd.get('full_name')||'').toString().trim();
      const email=(fd.get('email')||'').toString().trim();
      const background=(fd.get('background')||'').toString().trim();
      const ok = name && email && background;
      cl.classList.toggle('is-disabled', !ok);
      cl.setAttribute('aria-disabled', ok?'false':'true');
      if(ok){
        const subject=encodeURIComponent('VitaCoreX Careers Application');
        const body=encodeURIComponent('Full Name: '+name+'\nEmail: '+email+'\n\nBackground:\n'+background);
        cl.href='mailto:VitaCoreXllc@gmail.com?subject='+subject+'&body='+body;
      } else {
        cl.href='#';
      }
    };
    cf.addEventListener('input', update); update();
    cl.addEventListener('click', e=>{ if(cl.classList.contains('is-disabled')) e.preventDefault(); });
  }
})();
