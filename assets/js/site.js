
(function(){
const $=(s,e=document)=>e.querySelector(s), $$=(s,e=document)=>Array.from(e.querySelectorAll(s));
const common=window.SITE_I18N||{}; const page=window.PAGE_DATA||{};
const extra={
 en:{
  intake_docs_status_label:'Core documents status',
  intake_attachment_label:'Attachment reference',
  intake_summary_label:'Brief situation summary',
  intake_select_placeholder:'Select status',
  intake_docs_ready:'Most documents ready',
  intake_docs_partial:'Partial file available',
  intake_docs_need_help:'Need help building file',
  intake_attachment_placeholder:'Contract, invoice, screenshots, or folder reference',
  intake_summary_placeholder:'Briefly describe the matter, the business context, and what needs to be reviewed.',
  intake_success:'Intake request sent successfully. Our team will review the materials.',
  intake_failure:'Submission failed. Please use the Email option.',
  intake_validation:'Please complete all fields before submitting.',
order_services:'Order Services',clock_local_sub:'Local',services_individuals_title:'Services for Individuals',services_individuals_intro:'Services for individuals and specialized one-off matters remain fully available, while the primary VitaCoreX focus stays on corporate B2B operating support.',request_review:'Request review',see_all_individuals:'See all services for individuals',res1_title:'Healthcare leakage brief',res1_desc:'Operator-facing summary of leakage points, DSO drag, and early agency fee compression.',res1_tag:'Operator brief',res2_title:'Healthcare CFO brief',res2_desc:'Finance-facing brief for owners, CFOs, and operator leadership.',res2_tag:'CFO decision brief',res3_title:'Dental institutional deck',res3_desc:'Institutional framing with pilot economics, sequencing logic, and executive positioning.',res3_tag:'Institutional deck',res4_title:'Pre-collection executive review',res4_desc:'Framework logic, controlled escalation, and economics for pre-agency sequencing.',res4_tag:'Executive review',counter_quality:'Packet quality signal',counter_clarity:'Handoff clarity signal',counter_control:'Recovery control signal',counter_pressure:'Illustrative leakage pressure',counter_adoption:'ALSP operating adoption',counter_window:'Pilot design window',ind1_title:'Contracts & Documentation',ind1_desc:'Administrative support for contract drafting, document review, business forms, demand letters, and structured support packets.',ind1_b1:'Contract drafting',ind1_b2:'Document review',ind1_b3:'Business forms',ind1_b4:'Demand letters',ind1_b5:'Support packets',ind2_title:'Immigration Documents',ind2_desc:'Packet organization, form guidance, submission-readiness review, and evidence structuring for personal filing support.',ind2_b1:'Packet organization',ind2_b2:'Form guidance',ind2_b3:'Submission review',ind2_b4:'Evidence structuring',ind2_b5:'Administrative support',ind3_title:'Auto Purchase Review',ind3_desc:'Buyer-side review before signing, with fee analysis, payment-structure clarity, and negotiation support.',ind3_b1:'Dealer contract review',ind3_b2:'Fee analysis',ind3_b3:'Payment review',ind3_b4:'Negotiation support',ind3_b5:'Risk summary',ind4_title:'Business Plans',ind4_desc:'Executive summary, investor narrative, launch plan, financial framing, and pitch support.',ind4_b1:'Executive summary',ind4_b2:'Investor narrative',ind4_b3:'Launch plan',ind4_b4:'Financial framing',ind4_b5:'Pitch support',ind5_title:'Company Formation',ind5_desc:'Structured support for opening companies, entity setup, filing packets, and launch-readiness documents.',ind5_b1:'Entity formation support',ind5_b2:'Opening packages',ind5_b3:'Filing support',ind5_b4:'Business setup packet',ind5_b5:'Launch checklist',ind6_title:'Translation & Localization',ind6_desc:'Translation support, bilingual document cleanup, and structured localization for business or filing materials.',ind6_b1:'Document translation support',ind6_b2:'Bilingual cleanup',ind6_b3:'Localization review',ind6_b4:'Evidence translation pack',ind6_b5:'Administrative coordination',field_phone_careers:'Phone',field_role:'Role of interest',select_role:'Select role',role_ops:'Operations support',role_docs:'Documentation support',role_intake:'Intake support',role_translation:'Translation support',role_admin:'Admin support',role_client:'Client coordination',field_background:'Short background',careers_placeholder:'Short introduction, role of interest, and the kind of work you can support.',careers_helper:'Complete all required fields to activate the application email.',careers_who_title:'Who we look for',careers_apply_title:'How to apply',careers_t1:'Disciplined candidates who can work in a documentation-first operating model.',careers_t2:'Strong and confident English.',careers_t3:'Verifiable recommendations strongly preferred.',careers_t4:'Preference for Russian-speaking candidates with excellent English.',field_need:'Primary need',field_urgency:'Urgency',field_docs:'Document readiness',field_company_context:'Company / matter context',field_company_context_ph:'Company, packet, contract, invoice',intake_placeholder:'Describe the matter, the business context, and the decision that is blocked.',attach_materials:'Attach materials',attach_helper:'Add contracts, invoices, screenshots, exhibits, or packet drafts.',need_recovery:'Revenue Recovery Workflow Design',need_file:'Corporate Legal File Control',need_intake:'Structured Case Intake & Packet Build',urgency_standard:'Standard',urgency_high:'High',docs_ready:'Core documents are ready',docs_partial:'Only partial material is ready',next_standard:'We will review the intake and propose the first clean work product.',next_fast:'We will prioritize the intake and route the next-step memo first'},
 ru:{order_services:'Заказать услуги',clock_local_sub:'Локально',services_individuals_title:'Услуги для физических лиц',services_individuals_intro:'Услуги для физических лиц и разовых специализированных задач полностью доступны, при этом основной фокус VitaCoreX остаётся на корпоративной B2B-операционной поддержке.',request_review:'Запросить разбор',see_all_individuals:'Смотреть все услуги для физических лиц',res1_title:'Обзор точек утечки в healthcare',res1_desc:'Краткий материал для операторов о точках утечки, давлении на DSO и раннем сжатии комиссии агентств.',res1_tag:'Материал для операторов',res2_title:'CFO brief для healthcare',res2_desc:'Материал для owners, CFOs и операционного руководства с финансовым ракурсом.',res2_tag:'Материал для CFO',res3_title:'Институциональный deck для dental',res3_desc:'Институциональная подача с логикой пилота, sequencing и executive framing.',res3_tag:'Институциональный deck',res4_title:'Executive review по pre-collection',res4_desc:'Логика controlled escalation и экономика pre-agency sequencing.',res4_tag:'Executive review',counter_quality:'Сигнал качества пакета',counter_clarity:'Сигнал ясности handoff',counter_control:'Сигнал контроля возврата',counter_pressure:'Иллюстративное давление утечек',counter_adoption:'Операционный сигнал adoption',counter_window:'Окно проектирования пилота',ind1_title:'Договоры и документы',ind1_desc:'Административная поддержка по подготовке договоров, проверке документов, бизнес-форм и demand letters.',ind1_b1:'Подготовка договоров',ind1_b2:'Проверка документов',ind1_b3:'Бизнес-формы',ind1_b4:'Demand letters',ind1_b5:'Пакеты поддержки',ind2_title:'Иммиграционные документы',ind2_desc:'Организация пакета, сопровождение по формам, проверка готовности к подаче и структурирование доказательств.',ind2_b1:'Организация пакета',ind2_b2:'Сопровождение по формам',ind2_b3:'Проверка готовности к подаче',ind2_b4:'Структурирование доказательств',ind2_b5:'Административная поддержка',ind3_title:'Проверка покупки автомобиля',ind3_desc:'Проверка сделки до подписания: анализ fee, логики платежей и поддержка переговоров.',ind3_b1:'Проверка дилерского контракта',ind3_b2:'Анализ fee',ind3_b3:'Проверка платежной структуры',ind3_b4:'Поддержка переговоров',ind3_b5:'Краткое резюме рисков',ind4_title:'Бизнес-планы',ind4_desc:'Executive summary, investor narrative, launch plan, финансовая рамка и поддержка pitch.',ind4_b1:'Executive summary',ind4_b2:'Investor narrative',ind4_b3:'План запуска',ind4_b4:'Финансовая рамка',ind4_b5:'Поддержка pitch',ind5_title:'Открытие компаний',ind5_desc:'Структурированная помощь по запуску компании, пакетам открытия, filing и стартовым документам.',ind5_b1:'Поддержка по формированию компании',ind5_b2:'Пакеты открытия',ind5_b3:'Поддержка filing',ind5_b4:'Стартовый бизнес-пакет',ind5_b5:'Launch checklist',ind6_title:'Перевод и локализация',ind6_desc:'Поддержка перевода документов, билингвальная вычитка и локализация материалов для бизнеса и подачи.',ind6_b1:'Поддержка перевода документов',ind6_b2:'Билингвальная вычитка',ind6_b3:'Проверка локализации',ind6_b4:'Пакет перевода доказательств',ind6_b5:'Административная координация',field_phone_careers:'Телефон',field_role:'Интересующая роль',select_role:'Выберите роль',role_ops:'Операционная поддержка',role_docs:'Документационная поддержка',role_intake:'Поддержка intake',role_translation:'Поддержка перевода',role_admin:'Административная поддержка',role_client:'Координация с клиентами',field_background:'Краткая информация о вас',careers_placeholder:'Коротко представьтесь, укажите интересующую роль и чем именно вы можете быть полезны.',careers_helper:'Заполните все обязательные поля, чтобы активировать письмо для отклика.',careers_who_title:'Кого мы ищем',careers_apply_title:'Как откликнуться',careers_t1:'Дисциплинированных кандидатов, способных работать в documentation-first модели.',careers_t2:'Уверенный английский.',careers_t3:'Подтверждаемые рекомендации крайне желательны.',careers_t4:'Предпочтение кандидатам с русским языком и сильным английским.',field_need:'Основной запрос',field_urgency:'Срочность',field_docs:'Готовность документов',field_company_context:'Компания / контекст задачи',field_company_context_ph:'Компания, пакет, договор, счёт',intake_placeholder:'Опишите задачу, деловой контекст и решение, которое сейчас заблокировано.',attach_materials:'Прикрепить материалы',attach_helper:'Добавьте договоры, счета, скриншоты, exhibits или draft-пакеты.',need_recovery:'Система возврата дебиторной выручки',need_file:'Контроль юридического документооборота компании',need_intake:'Структурированный первичный разбор и сбор пакета',urgency_standard:'Стандартно',urgency_high:'Высокий приоритет',docs_ready:'Основные документы готовы',docs_partial:'Готова только часть материалов',next_standard:'Мы рассмотрим intake и предложим первый аккуратный рабочий пакет.',next_fast:'Мы приоритизируем intake и сначала направим next-step memo.'},
 es:{order_services:'Solicitar servicio',clock_local_sub:'Local',services_individuals_title:'Servicios para individuos',services_individuals_intro:'Los servicios para individuos y asuntos especializados de una sola vez siguen totalmente disponibles, mientras el foco principal de VitaCoreX permanece en soporte operativo B2B corporativo.',request_review:'Solicitar revisión',see_all_individuals:'Ver todos los servicios para individuos',res1_title:'Brief de fugas en healthcare',res1_desc:'Resumen para operadores sobre puntos de fuga, presión sobre DSO y compresión temprana de comisiones de agencia.',res1_tag:'Brief para operadores',res2_title:'Brief para CFO en healthcare',res2_desc:'Documento con enfoque financiero para owners, CFOs y liderazgo operativo.',res2_tag:'Brief para CFO',res3_title:'Deck institucional dental',res3_desc:'Presentación institucional con economía del piloto, lógica de secuencia y posicionamiento ejecutivo.',res3_tag:'Deck institucional',res4_title:'Revisión ejecutiva pre-collection',res4_desc:'Lógica de escalación controlada y economía para secuencia pre-agencia.',res4_tag:'Revisión ejecutiva',counter_quality:'Señal de calidad del paquete',counter_clarity:'Señal de claridad del handoff',counter_control:'Señal de control de recuperación',counter_pressure:'Presión ilustrativa de fugas',counter_adoption:'Adopción operativa ALSP',counter_window:'Ventana de diseño del piloto',ind1_title:'Contratos y documentación',ind1_desc:'Soporte administrativo para redacción de contratos, revisión documental, formularios de negocio y cartas de demanda.',ind1_b1:'Redacción de contratos',ind1_b2:'Revisión de documentos',ind1_b3:'Formularios de negocio',ind1_b4:'Cartas de demanda',ind1_b5:'Paquetes de soporte',ind2_title:'Documentos migratorios',ind2_desc:'Organización del paquete, guía de formularios, revisión previa a la presentación y estructuración de evidencia.',ind2_b1:'Organización del paquete',ind2_b2:'Guía de formularios',ind2_b3:'Revisión previa a envío',ind2_b4:'Estructuración de evidencia',ind2_b5:'Soporte administrativo',ind3_title:'Revisión de compra de auto',ind3_desc:'Revisión del lado del comprador antes de firmar, con análisis de cargos, pagos y apoyo de negociación.',ind3_b1:'Revisión de contrato del dealer',ind3_b2:'Análisis de cargos',ind3_b3:'Revisión de pagos',ind3_b4:'Apoyo de negociación',ind3_b5:'Resumen de riesgos',ind4_title:'Planes de negocio',ind4_desc:'Resumen ejecutivo, narrativa para inversionistas, plan de lanzamiento, marco financiero y apoyo para pitch.',ind4_b1:'Resumen ejecutivo',ind4_b2:'Narrativa para inversionistas',ind4_b3:'Plan de lanzamiento',ind4_b4:'Marco financiero',ind4_b5:'Apoyo para pitch',ind5_title:'Formación de empresas',ind5_desc:'Soporte estructurado para abrir compañías, paquetes de constitución, filings y documentos de lanzamiento.',ind5_b1:'Soporte de formación',ind5_b2:'Paquetes de apertura',ind5_b3:'Soporte de filing',ind5_b4:'Paquete de puesta en marcha',ind5_b5:'Checklist de lanzamiento',ind6_title:'Traducción y localización',ind6_desc:'Soporte de traducción documental, limpieza bilingüe y localización estructurada para materiales de negocio o filing.',ind6_b1:'Soporte de traducción documental',ind6_b2:'Limpieza bilingüe',ind6_b3:'Revisión de localización',ind6_b4:'Paquete de traducción de evidencia',ind6_b5:'Coordinación administrativa',field_phone_careers:'Teléfono',field_role:'Rol de interés',select_role:'Selecciona un rol',role_ops:'Soporte operativo',role_docs:'Soporte documental',role_intake:'Soporte de intake',role_translation:'Soporte de traducción',role_admin:'Soporte administrativo',role_client:'Coordinación con clientes',field_background:'Breve experiencia',careers_placeholder:'Preséntate brevemente, indica el rol de interés y el tipo de trabajo que puedes apoyar.',careers_helper:'Completa todos los campos obligatorios para activar el correo de aplicación.',careers_who_title:'A quién buscamos',careers_apply_title:'Cómo aplicar',careers_t1:'Candidatos disciplinados que puedan trabajar en un modelo centrado en la documentación.',careers_t2:'Inglés sólido y seguro.',careers_t3:'Referencias verificables fuertemente preferidas.',careers_t4:'Preferencia por candidatos rusohablantes con excelente inglés.',field_need:'Necesidad principal',field_urgency:'Urgencia',field_docs:'Estado de documentos',field_company_context:'Empresa / contexto del asunto',field_company_context_ph:'Empresa, paquete, contrato, factura',intake_placeholder:'Describe el asunto, el contexto del negocio y la decisión que hoy está bloqueada.',attach_materials:'Adjuntar materiales',attach_helper:'Agrega contratos, facturas, capturas, anexos o borradores de paquete.',need_recovery:'Diseño del flujo de recuperación de ingresos',need_file:'Control de archivos legales corporativos',need_intake:'Evaluación inicial estructurada y armado del paquete',urgency_standard:'Estándar',urgency_high:'Alta',docs_ready:'Los documentos principales están listos',docs_partial:'Solo parte del material está lista',next_standard:'Revisaremos el intake y propondremos el primer paquete de trabajo limpio.',next_fast:'Priorizaremos el intake y primero enviaremos el memo del siguiente paso.'}
};
let lang=['en','ru','es'].includes(localStorage.getItem('vcx_lang'))?localStorage.getItem('vcx_lang'):'en';
function tr(key){return (extra[lang]&&extra[lang][key]) || (page[lang]&&page[lang][key]) || (common[lang]&&common[lang][key]) || (extra.en&&extra.en[key]) || (page.en&&page.en[key]) || (common.en&&common.en[key]) || '';}
function applyText(){
 document.documentElement.lang=lang;
 $$('.lang-btn').forEach(b=>b.classList.toggle('active', b.dataset.lang===lang));
 $$('[data-common]').forEach(el=>{ const v=(common[lang]&&common[lang][el.dataset.common]) || (extra[lang]&&extra[lang][el.dataset.common]) || common.en?.[el.dataset.common] || extra.en?.[el.dataset.common]; if(v!==undefined) el.textContent=v; });
 $$('[data-page]').forEach(el=>{ const v=tr(el.dataset.page); if(v) el.textContent=v; });
 $$('[data-tx]').forEach(el=>{ const v=tr(el.dataset.tx); if(v) el.textContent=v; });
 $$('[data-tx-placeholder]').forEach(el=>{ const v=tr(el.dataset.txPlaceholder); if(v) el.setAttribute('placeholder',v); });
 if(page[lang]?.title) document.title=page[lang].title;
 const md=$('meta[name="description"]'); if(md && page[lang]?.desc) md.setAttribute('content',page[lang].desc);
}
applyText();
$$('.lang-btn').forEach(b=>b.addEventListener('click',()=>{ lang=b.dataset.lang; localStorage.setItem('vcx_lang',lang); applyText(); syncCareerMailto(); updateOutputLanguage(); }));
const menuBtn=$('.menu-btn'), mobileNav=$('.mobile-nav'); if(menuBtn) menuBtn.addEventListener('click',()=>mobileNav.classList.toggle('open'));
const header=$('.site-header');
function onScrollCompact(){ if(!header) return; header.classList.toggle('header-compact', window.scrollY>30); }
onScrollCompact(); window.addEventListener('scroll', onScrollCompact, {passive:true});
function fmt(date,tz){ return new Intl.DateTimeFormat([], {hour:'2-digit',minute:'2-digit',hour12:false,timeZone:tz}).format(date); }
function clocks(){ const d=new Date(); $$('.clock-vcx').forEach(el=>el.textContent=fmt(d,'America/New_York')); const local=new Intl.DateTimeFormat([], {hour:'2-digit',minute:'2-digit',hour12:false}).format(d); $$('.clock-local').forEach(el=>el.textContent=local); }
clocks(); setInterval(clocks,1000);
const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); } }), {threshold:.14}); $$('.reveal').forEach(el=>io.observe(el));
$$('.bar-fill').forEach(el=>{ const w=el.dataset.width||0; const ob=new IntersectionObserver(es=>{ if(es[0].isIntersecting){ el.style.width=w+'%'; ob.disconnect(); }}); ob.observe(el); });
$$('[data-count-to]').forEach(el=>{ const target=parseFloat(el.dataset.countTo), suffix=el.dataset.suffix||''; const ob=new IntersectionObserver(es=>{ if(es[0].isIntersecting){ let start=null; const dur=1300; const step=ts=>{ if(!start) start=ts; const p=Math.min((ts-start)/dur,1); const val=target*p; el.textContent=(Number.isInteger(target)?Math.round(val):val.toFixed(1))+suffix; if(p<1) requestAnimationFrame(step); }; requestAnimationFrame(step); ob.disconnect(); }}); ob.observe(el); });
// resource gate
const gate=$('#pdfGate'); function openGate(asset,label){ if(!gate) return; gate.classList.add('open'); gate.setAttribute('aria-hidden','false'); document.body.classList.add('modal-open'); gate.querySelector('[name="asset"]').value=asset||''; gate.querySelector('.gate-asset').textContent=label||'PDF'; }
function closeGate(){ if(!gate) return; gate.classList.remove('open'); gate.setAttribute('aria-hidden','true'); document.body.classList.remove('modal-open'); }
$$('[data-gated-asset]').forEach(btn=>btn.addEventListener('click',e=>{ e.preventDefault(); openGate(btn.dataset.gatedAsset, btn.dataset.gatedLabel); }));
$$('.modal-close,.modal-cancel').forEach(btn=>btn.addEventListener('click',closeGate)); gate && gate.addEventListener('click',e=>{ if(e.target===gate) closeGate(); });
const gateForm=$('#gateForm'); if(gateForm){ gateForm.addEventListener('submit',e=>{ e.preventDefault(); const fd=new FormData(gateForm); const required=['full_name','company','phone','email']; const ok=required.every(k=>String(fd.get(k)||'').trim()); const st=$('#gateState'); if(!ok){ st.textContent = lang==='ru'?'Заполните все обязательные поля.':lang==='es'?'Complete todos los campos obligatorios.':'Please complete all required fields.'; return; } localStorage.setItem('vcx_gate', JSON.stringify(Object.fromEntries(fd.entries()))); const asset=String(fd.get('asset')||''); closeGate(); if(asset) window.open(asset,'_blank','noopener'); }); }
// Exit intent only on gated resources
let exitShown=false, armed=false; setTimeout(()=>armed=true,12000); function triggerExit(){ if(exitShown) return; const first=$('[data-gated-asset]'); if(first){ exitShown=true; openGate(first.dataset.gatedAsset, first.dataset.gatedLabel); } }
document.addEventListener('mouseout',e=>{ if(armed && !exitShown && e.clientY<=0 && window.innerWidth>900) triggerExit(); });
window.addEventListener('scroll',()=>{ const depth=(window.scrollY+window.innerHeight)/Math.max(document.body.scrollHeight,1); if(armed && !exitShown && window.innerWidth<=900 && depth>.72) triggerExit(); }, {passive:true});
// CFO calc
const calc=$('#cfoCalc'); if(calc){ const out={a:$('#calcAgency'),b:$('#calcPre'),c:$('#calcLift'),d:$('#calcLiftPct')}; const recompute=()=>{ const principal=+calc.principal.value||0, gross=(+calc.gross.value||0)/100, fee=(+calc.fee.value||0)/100, accept=(+calc.accept.value||0)/100, complete=(+calc.complete.value||0)/100, recovery=(+calc.recovery.value||0)/100, setup=+calc.setup.value||0; const agency=principal*gross*(1-fee); const pre=principal*(accept*complete*recovery)+(principal*(1-accept*complete))*(gross*(1-fee))-setup; const lift=pre-agency; const pct=agency?(lift/agency*100):0; out.a.textContent='$'+agency.toLocaleString(undefined,{maximumFractionDigits:0}); out.b.textContent='$'+pre.toLocaleString(undefined,{maximumFractionDigits:0}); out.c.textContent=(lift>=0?'+':'-')+'$'+Math.abs(lift).toLocaleString(undefined,{maximumFractionDigits:0}); out.d.textContent=(pct>=0?'+':'')+pct.toLocaleString(undefined,{maximumFractionDigits:1})+'%'; }; $$('input',calc).forEach(i=>i.addEventListener('input',recompute)); recompute(); }
// Intake
const intake=$('#intakeForm');
let lastOutput=null;
function serviceName(key){ const map={recovery:'need_recovery',file:'need_file',intake:'need_intake'}; return tr(map[key]||'need_intake'); }
function updateOutputLanguage(){ if(!lastOutput) return; const result=$('#intakeOutput'); if(!result) return; const {service,fitKey,docsKey,windowText,nextKey,score} = lastOutput; result.innerHTML=`<div class="out-row"><span>${tr('out_service')}</span><strong>${serviceName(service)}</strong></div><div class="out-row"><span>${tr('out_fit')}</span><strong>${tr(fitKey)} · ${score}% AI routing confidence</strong></div><div class="out-row"><span>${tr('out_docs')}</span><strong>${tr(docsKey)}</strong></div><div class="out-row"><span>${tr('out_window')}</span><strong>${windowText}</strong></div><div class="out-row"><span>${tr('out_next')}</span><strong>${tr(nextKey)}</strong></div><p class="small-note">${tr('out_disc')}</p>`; }
function buildIntakeMailto(){
  const form=$('#intakeForm');
  if(!form) return 'mailto:VitaCoreXllc@gmail.com?subject='+encodeURIComponent('VitaCoreX Intake Request');
  const fd=new FormData(form);
  const body=`Core documents status:
${String(fd.get('core_documents_status')||'').trim()}

Attachment reference:
${String(fd.get('attachment_reference')||'').trim()}

Brief situation summary:
${String(fd.get('brief_situation_summary')||'').trim()}

User browser:
${navigator.userAgent}

Timestamp:
${new Date().toISOString()}`;
  return 'mailto:VitaCoreXllc@gmail.com?subject='+encodeURIComponent('VitaCoreX Intake Request')+'&body='+encodeURIComponent(body);
}
if(intake){
  const emailFallback=$('#intakeEmailInstead');
  const status=$('#intakeFormStatus');
  const submitBtn=$('#intakeSubmitBtn');
  const syncMailto=()=>{ if(emailFallback) emailFallback.href=buildIntakeMailto(); };
  syncMailto();
  intake.addEventListener('input', syncMailto);
  intake.addEventListener('change', syncMailto);
  intake.addEventListener('submit', async e=>{
    e.preventDefault();
    const fd=new FormData(intake);
    const docs=String(fd.get('core_documents_status')||'').trim();
    const attachment=String(fd.get('attachment_reference')||'').trim();
    const summary=String(fd.get('brief_situation_summary')||'').trim();
    if(!docs || !attachment || !summary){
      status.textContent=tr('intake_validation');
      status.classList.remove('success');
      status.classList.add('error');
      return;
    }
    const browser=navigator.userAgent;
    const timestamp=new Date().toISOString();
    const body=`Core documents status:
${docs}

Attachment reference:
${attachment}

Brief situation summary:
${summary}

User browser:
${browser}

Timestamp:
${timestamp}`;
    const payload={
      _subject:'VitaCoreX Intake Request',
      _captcha:'false',
      _template:'table',
      message:body,
      'Core documents status':docs,
      'Attachment reference':attachment,
      'Brief situation summary':summary,
      'User browser':browser,
      Timestamp:timestamp
    };
    status.textContent='';
    status.classList.remove('success','error');
    submitBtn.disabled=true;
    submitBtn.classList.add('is-loading');
    try{
      const response=await fetch('https://formsubmit.co/ajax/VitaCoreXllc@gmail.com',{
        method:'POST',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        body:JSON.stringify(payload)
      });
      const data=await response.json().catch(()=>({}));
      if(!response.ok || data.success==='false'){ throw new Error('submit_failed'); }
      status.textContent=tr('intake_success');
      status.classList.add('success');
      intake.reset();
      syncMailto();
      lastOutput={service:'intake',fitKey:'urgency_standard',docsKey:'docs_partial',windowText:'1–2 business days',nextKey:'next_standard',score:91};
      updateOutputLanguage();
    }catch(err){
      status.textContent=tr('intake_failure');
      status.classList.add('error');
    }finally{
      submitBtn.disabled=false;
      submitBtn.classList.remove('is-loading');
    }
  });
}
// Careers form mailto validation
const careersForm=$('#careersForm'), applyBtn=$('#applyByEmail');
function syncCareerMailto(){ if(!careersForm || !applyBtn) return; const fd=new FormData(careersForm); const required=['full_name','email','phone','role','background']; const ok=required.every(k=>String(fd.get(k)||'').trim()); applyBtn.classList.toggle('btn-disabled', !ok); applyBtn.setAttribute('aria-disabled', ok?'false':'true'); if(!ok){ applyBtn.href='#'; return; } const body=(lang==='ru'?'ФИО':'Full Name')+': '+fd.get('full_name')+'\n'+(lang==='ru'?'Email':'Email')+': '+fd.get('email')+'\n'+(lang==='ru'?'Телефон':'Phone')+': '+fd.get('phone')+'\n'+(lang==='ru'?'Роль':'Role')+': '+fd.get('role')+'\n\n'+(lang==='ru'?'Краткая информация':'Background')+':\n'+fd.get('background'); applyBtn.href='mailto:VitaCoreXllc@gmail.com?subject='+encodeURIComponent('VitaCoreX Careers Application')+'&body='+encodeURIComponent(body); }
if(careersForm && applyBtn){ careersForm.addEventListener('input', syncCareerMailto); careersForm.addEventListener('change', syncCareerMailto); syncCareerMailto(); }
})();
