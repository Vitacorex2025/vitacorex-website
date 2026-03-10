
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
  intake_submit:'Request structured intake',
  field_location:'State / City / ZIP Code',
  intake_location_ph:'State / City / ZIP Code',
  field_urgency2:'Urgency',
  select_urgency:'Select urgency',
  urgency_standard2:'Standard',
  urgency_48:'48 hours',
  urgency_24:'24 hours',
  urgency_same:'Same day / urgent',
  field_service_type:'Service Type',
  select_service_type:'Select service type',
  service_recovery:'Revenue Recovery Workflow Design',
  service_file:'Corporate Legal File Control',
  service_intake:'Structured Case Intake & Packet Build',
  service_briefs:'Executive Briefs / Proof Request',
  service_individuals:'Services for Individuals',
  service_other:'Other',
  field_attachment:'File Attachment',
  intake_attachment_note:'Attach the most relevant file or packet draft.',
  field_message:'Message / Situation Summary',
  intake_message_ph:'Describe the matter, the business context, and what needs to be reviewed.',
  intake_success:'Request sent successfully. Our team will review your submission.',
  intake_failure:'Submission failed. Please try again.',
  careers_submit:'Submit application',
  careers_success:'Application sent successfully. We will review your information.',
  careers_failure:'Submission failed. Please try again.',
  field_linkedin:'LinkedIn',
  field_linkedin_ph:'https://www.linkedin.com/in/...',
  careers_mobile_button2:'Open application form',gate_success:'Access granted. Opening the resource now.',gate_failure:'Submission failed. Please try again or use email.',
  role_bizdocs:'Business documentation support',
order_services:'Order Services',clock_local_sub:'Local',services_individuals_title:'Services for Individuals',services_individuals_intro:'Services for individuals and specialized one-off matters remain fully available, while the primary VitaCoreX focus stays on corporate B2B operating support.',request_review:'Request review',see_all_individuals:'See all services for individuals',res1_title:'Healthcare leakage brief',res1_desc:'Operator-facing summary of leakage points, DSO drag, and early agency fee compression.',res1_tag:'Operator brief',res2_title:'Healthcare CFO brief',res2_desc:'Finance-facing brief for owners, CFOs, and operator leadership.',res2_tag:'CFO decision brief',res3_title:'Dental institutional deck',res3_desc:'Institutional framing with pilot economics, sequencing logic, and executive positioning.',res3_tag:'Institutional deck',res4_title:'Pre-collection executive review',res4_desc:'Framework logic, controlled escalation, and economics for pre-agency sequencing.',res4_tag:'Executive review',counter_quality:'Packet quality signal',counter_clarity:'Handoff clarity signal',counter_control:'Recovery control signal',counter_pressure:'Illustrative leakage pressure',counter_adoption:'ALSP operating adoption',counter_window:'Pilot design window',ind1_title:'Contracts & Documentation',ind1_desc:'Administrative support for contract drafting, document review, business forms, demand letters, and structured support packets.',ind1_b1:'Contract drafting',ind1_b2:'Document review',ind1_b3:'Business forms',ind1_b4:'Demand letters',ind1_b5:'Support packets',ind2_title:'Immigration Documents',ind2_desc:'Packet organization, form guidance, submission-readiness review, and evidence structuring for personal filing support.',ind2_b1:'Packet organization',ind2_b2:'Form guidance',ind2_b3:'Submission review',ind2_b4:'Evidence structuring',ind2_b5:'Administrative support',ind3_title:'Auto Purchase Review',ind3_desc:'Buyer-side review before signing, with fee analysis, payment-structure clarity, and negotiation support.',ind3_b1:'Dealer contract review',ind3_b2:'Fee analysis',ind3_b3:'Payment review',ind3_b4:'Negotiation support',ind3_b5:'Risk summary',ind4_title:'Business Plans',ind4_desc:'Executive summary, investor narrative, launch plan, financial framing, and pitch support.',ind4_b1:'Executive summary',ind4_b2:'Investor narrative',ind4_b3:'Launch plan',ind4_b4:'Financial framing',ind4_b5:'Pitch support',ind5_title:'Company Formation',ind5_desc:'Structured support for opening companies, entity setup, filing packets, and launch-readiness documents.',ind5_b1:'Entity formation support',ind5_b2:'Opening packages',ind5_b3:'Filing support',ind5_b4:'Business setup packet',ind5_b5:'Launch checklist',ind6_title:'Translation & Localization',ind6_desc:'Translation support, bilingual document cleanup, and structured localization for business or filing materials.',ind6_b1:'Document translation support',ind6_b2:'Bilingual cleanup',ind6_b3:'Localization review',ind6_b4:'Evidence translation pack',ind6_b5:'Administrative coordination',field_phone_careers:'Phone',field_role:'Role of interest',select_role:'Select role',role_ops:'Operations support',role_docs:'Documentation support',role_intake:'Intake support',role_translation:'Translation support',role_admin:'Admin support',role_client:'Client coordination',field_background:'Short background',careers_placeholder:'Short introduction, role of interest, and the kind of work you can support.',careers_helper:'Complete all required fields to activate the application email.',careers_who_title:'Who we look for',careers_apply_title:'How to apply',careers_t1:'Disciplined candidates who can work in a documentation-first operating model.',careers_t2:'Strong and confident English.',careers_t3:'Verifiable recommendations strongly preferred.',careers_t4:'Preference for Russian-speaking candidates with excellent English.',field_need:'Primary need',field_urgency:'Urgency',field_docs:'Document readiness',field_company_context:'Company / matter context',field_company_context_ph:'Company, packet, contract, invoice',intake_placeholder:'Describe the matter, the business context, and the decision that is blocked.',attach_materials:'Attach materials',attach_helper:'Add contracts, invoices, screenshots, exhibits, or packet drafts.',need_recovery:'Revenue Recovery Workflow Design',need_file:'Corporate Legal File Control',need_intake:'Structured Case Intake & Packet Build',urgency_standard:'Standard',urgency_high:'High',docs_ready:'Core documents are ready',docs_partial:'Only partial material is ready',next_standard:'We will review the intake and propose the first clean work product.',next_fast:'We will prioritize the intake and route the next-step memo first'},
 ru:{order_services:'Заказать услуги',clock_local_sub:'Локально',services_individuals_title:'Услуги для физических лиц',services_individuals_intro:'Услуги для физических лиц и разовых специализированных задач полностью доступны, при этом основной фокус VitaCoreX остаётся на корпоративной B2B-операционной поддержке.',request_review:'Запросить разбор',see_all_individuals:'Смотреть все услуги для физических лиц',res1_title:'Обзор точек утечки в healthcare',res1_desc:'Краткий материал для операторов о точках утечки, давлении на DSO и раннем сжатии комиссии агентств.',res1_tag:'Материал для операторов',res2_title:'CFO brief для healthcare',res2_desc:'Материал для owners, CFOs и операционного руководства с финансовым ракурсом.',res2_tag:'Материал для CFO',res3_title:'Институциональный deck для dental',res3_desc:'Институциональная подача с логикой пилота, sequencing и executive framing.',res3_tag:'Институциональный deck',res4_title:'Executive review по pre-collection',res4_desc:'Логика controlled escalation и экономика pre-agency sequencing.',res4_tag:'Executive review',counter_quality:'Сигнал качества пакета',counter_clarity:'Сигнал ясности handoff',counter_control:'Сигнал контроля возврата',counter_pressure:'Иллюстративное давление утечек',counter_adoption:'Операционный сигнал adoption',counter_window:'Окно проектирования пилота',ind1_title:'Договоры и документы',ind1_desc:'Административная поддержка по подготовке договоров, проверке документов, бизнес-форм и demand letters.',ind1_b1:'Подготовка договоров',ind1_b2:'Проверка документов',ind1_b3:'Бизнес-формы',ind1_b4:'Demand letters',ind1_b5:'Пакеты поддержки',ind2_title:'Иммиграционные документы',ind2_desc:'Организация пакета, сопровождение по формам, проверка готовности к подаче и структурирование доказательств.',ind2_b1:'Организация пакета',ind2_b2:'Сопровождение по формам',ind2_b3:'Проверка готовности к подаче',ind2_b4:'Структурирование доказательств',ind2_b5:'Административная поддержка',ind3_title:'Проверка покупки автомобиля',ind3_desc:'Проверка сделки до подписания: анализ fee, логики платежей и поддержка переговоров.',ind3_b1:'Проверка дилерского контракта',ind3_b2:'Анализ fee',ind3_b3:'Проверка платежной структуры',ind3_b4:'Поддержка переговоров',ind3_b5:'Краткое резюме рисков',ind4_title:'Бизнес-планы',ind4_desc:'Executive summary, investor narrative, launch plan, финансовая рамка и поддержка pitch.',ind4_b1:'Executive summary',ind4_b2:'Investor narrative',ind4_b3:'План запуска',ind4_b4:'Финансовая рамка',ind4_b5:'Поддержка pitch',ind5_title:'Открытие компаний',ind5_desc:'Структурированная помощь по запуску компании, пакетам открытия, filing и стартовым документам.',ind5_b1:'Поддержка по формированию компании',ind5_b2:'Пакеты открытия',ind5_b3:'Поддержка filing',ind5_b4:'Стартовый бизнес-пакет',ind5_b5:'Launch checklist',ind6_title:'Перевод и локализация',ind6_desc:'Поддержка перевода документов, билингвальная вычитка и локализация материалов для бизнеса и подачи.',ind6_b1:'Поддержка перевода документов',ind6_b2:'Билингвальная вычитка',ind6_b3:'Проверка локализации',ind6_b4:'Пакет перевода доказательств',ind6_b5:'Административная координация',field_phone_careers:'Телефон',field_role:'Интересующая роль',select_role:'Выберите роль',role_ops:'Операционная поддержка',role_docs:'Документационная поддержка',role_intake:'Поддержка intake',role_translation:'Поддержка перевода',role_admin:'Административная поддержка',role_client:'Координация с клиентами',field_background:'Краткая информация о вас',careers_placeholder:'Коротко представьтесь, укажите интересующую роль и чем именно вы можете быть полезны.',careers_helper:'Заполните все обязательные поля, чтобы активировать письмо для отклика.',careers_who_title:'Кого мы ищем',careers_apply_title:'Как откликнуться',careers_t1:'Дисциплинированных кандидатов, способных работать в documentation-first модели.',careers_t2:'Уверенный английский.',careers_t3:'Подтверждаемые рекомендации крайне желательны.',careers_t4:'Предпочтение кандидатам с русским языком и сильным английским.',field_need:'Основной запрос',field_urgency:'Срочность',field_docs:'Готовность документов',field_company_context:'Компания / контекст задачи',field_company_context_ph:'Компания, пакет, договор, счёт',intake_placeholder:'Опишите задачу, деловой контекст и решение, которое сейчас заблокировано.',
  intake_submit:'Отправить структурированный запрос',
  field_location:'Штат / город / ZIP-код',
  intake_location_ph:'Штат / город / ZIP-код',
  field_urgency2:'Срочность',
  select_urgency:'Выберите срочность',
  urgency_standard2:'Стандартно',
  urgency_48:'48 часов',
  urgency_24:'24 часа',
  urgency_same:'В тот же день / срочно',
  field_service_type:'Тип услуги',
  select_service_type:'Выберите тип услуги',
  service_recovery:'Система возврата дебиторной выручки',
  service_file:'Контроль юридического документооборота компании',
  service_intake:'Структурированный первичный разбор и сборка пакета',
  service_briefs:'Запрос executive briefs / proof',
  service_individuals:'Услуги для физических лиц',
  service_other:'Другое',
  field_attachment:'Прикрепление файла',
  intake_attachment_note:'Прикрепите самый важный файл или черновик пакета.',
  field_message:'Сообщение / краткое описание ситуации',
  intake_message_ph:'Опишите задачу, деловой контекст и то, что нужно проверить.',
  intake_success:'Запрос успешно отправлен. Наша команда рассмотрит вашу заявку.',
  intake_failure:'Отправка не удалась. Попробуйте ещё раз.',
  careers_submit:'Отправить заявку',
  careers_success:'Заявка успешно отправлена. Мы рассмотрим вашу информацию.',
  careers_failure:'Отправка не удалась. Попробуйте ещё раз.',
  field_linkedin:'LinkedIn',
  field_linkedin_ph:'https://www.linkedin.com/in/...',
  careers_mobile_button2:'Открыть форму заявки',gate_success:'Доступ открыт. Ресурс открывается.',gate_failure:'Не удалось отправить форму. Попробуйте ещё раз или напишите на email.',
  role_bizdocs:'Поддержка бизнес-документации',attach_materials:'Прикрепить материалы',attach_helper:'Добавьте договоры, счета, скриншоты, exhibits или draft-пакеты.',need_recovery:'Система возврата дебиторной выручки',need_file:'Контроль юридического документооборота компании',need_intake:'Структурированный первичный разбор и сбор пакета',urgency_standard:'Стандартно',urgency_high:'Высокий приоритет',docs_ready:'Основные документы готовы',docs_partial:'Готова только часть материалов',next_standard:'Мы рассмотрим intake и предложим первый аккуратный рабочий пакет.',next_fast:'Мы приоритизируем intake и сначала направим next-step memo.'},
 es:{order_services:'Solicitar servicio',clock_local_sub:'Local',services_individuals_title:'Servicios para individuos',services_individuals_intro:'Los servicios para individuos y asuntos especializados de una sola vez siguen totalmente disponibles, mientras el foco principal de VitaCoreX permanece en soporte operativo B2B corporativo.',request_review:'Solicitar revisión',see_all_individuals:'Ver todos los servicios para individuos',res1_title:'Brief de fugas en healthcare',res1_desc:'Resumen para operadores sobre puntos de fuga, presión sobre DSO y compresión temprana de comisiones de agencia.',res1_tag:'Brief para operadores',res2_title:'Brief para CFO en healthcare',res2_desc:'Documento con enfoque financiero para owners, CFOs y liderazgo operativo.',res2_tag:'Brief para CFO',res3_title:'Deck institucional dental',res3_desc:'Presentación institucional con economía del piloto, lógica de secuencia y posicionamiento ejecutivo.',res3_tag:'Deck institucional',res4_title:'Revisión ejecutiva pre-collection',res4_desc:'Lógica de escalación controlada y economía para secuencia pre-agencia.',res4_tag:'Revisión ejecutiva',counter_quality:'Señal de calidad del paquete',counter_clarity:'Señal de claridad del handoff',counter_control:'Señal de control de recuperación',counter_pressure:'Presión ilustrativa de fugas',counter_adoption:'Adopción operativa ALSP',counter_window:'Ventana de diseño del piloto',ind1_title:'Contratos y documentación',ind1_desc:'Soporte administrativo para redacción de contratos, revisión documental, formularios de negocio y cartas de demanda.',ind1_b1:'Redacción de contratos',ind1_b2:'Revisión de documentos',ind1_b3:'Formularios de negocio',ind1_b4:'Cartas de demanda',ind1_b5:'Paquetes de soporte',ind2_title:'Documentos migratorios',ind2_desc:'Organización del paquete, guía de formularios, revisión previa a la presentación y estructuración de evidencia.',ind2_b1:'Organización del paquete',ind2_b2:'Guía de formularios',ind2_b3:'Revisión previa a envío',ind2_b4:'Estructuración de evidencia',ind2_b5:'Soporte administrativo',ind3_title:'Revisión de compra de auto',ind3_desc:'Revisión del lado del comprador antes de firmar, con análisis de cargos, pagos y apoyo de negociación.',ind3_b1:'Revisión de contrato del dealer',ind3_b2:'Análisis de cargos',ind3_b3:'Revisión de pagos',ind3_b4:'Apoyo de negociación',ind3_b5:'Resumen de riesgos',ind4_title:'Planes de negocio',ind4_desc:'Resumen ejecutivo, narrativa para inversionistas, plan de lanzamiento, marco financiero y apoyo para pitch.',ind4_b1:'Resumen ejecutivo',ind4_b2:'Narrativa para inversionistas',ind4_b3:'Plan de lanzamiento',ind4_b4:'Marco financiero',ind4_b5:'Apoyo para pitch',ind5_title:'Formación de empresas',ind5_desc:'Soporte estructurado para abrir compañías, paquetes de constitución, filings y documentos de lanzamiento.',ind5_b1:'Soporte de formación',ind5_b2:'Paquetes de apertura',ind5_b3:'Soporte de filing',ind5_b4:'Paquete de puesta en marcha',ind5_b5:'Checklist de lanzamiento',ind6_title:'Traducción y localización',ind6_desc:'Soporte de traducción documental, limpieza bilingüe y localización estructurada para materiales de negocio o filing.',ind6_b1:'Soporte de traducción documental',ind6_b2:'Limpieza bilingüe',ind6_b3:'Revisión de localización',ind6_b4:'Paquete de traducción de evidencia',ind6_b5:'Coordinación administrativa',field_phone_careers:'Teléfono',field_role:'Rol de interés',select_role:'Selecciona un rol',role_ops:'Soporte operativo',role_docs:'Soporte documental',role_intake:'Soporte de intake',role_translation:'Soporte de traducción',role_admin:'Soporte administrativo',role_client:'Coordinación con clientes',field_background:'Breve experiencia',careers_placeholder:'Preséntate brevemente, indica el rol de interés y el tipo de trabajo que puedes apoyar.',careers_helper:'Completa todos los campos obligatorios para activar el correo de aplicación.',careers_who_title:'A quién buscamos',careers_apply_title:'Cómo aplicar',careers_t1:'Candidatos disciplinados que puedan trabajar en un modelo centrado en la documentación.',careers_t2:'Inglés sólido y seguro.',careers_t3:'Referencias verificables fuertemente preferidas.',careers_t4:'Preferencia por candidatos rusohablantes con excelente inglés.',field_need:'Necesidad principal',field_urgency:'Urgencia',field_docs:'Estado de documentos',field_company_context:'Empresa / contexto del asunto',field_company_context_ph:'Empresa, paquete, contrato, factura',intake_placeholder:'Describe el asunto, el contexto del negocio y la decisión que hoy está bloqueada.',
  intake_submit:'Enviar intake estructurado',
  field_location:'Estado / Ciudad / Código ZIP',
  intake_location_ph:'Estado / Ciudad / Código ZIP',
  field_urgency2:'Urgencia',
  select_urgency:'Selecciona urgencia',
  urgency_standard2:'Estándar',
  urgency_48:'48 horas',
  urgency_24:'24 horas',
  urgency_same:'Mismo día / urgente',
  field_service_type:'Tipo de servicio',
  select_service_type:'Selecciona el tipo de servicio',
  service_recovery:'Diseño del flujo de recuperación de ingresos',
  service_file:'Control de archivos legales corporativos',
  service_intake:'Evaluación inicial estructurada y armado del paquete',
  service_briefs:'Solicitud de executive briefs / proof',
  service_individuals:'Servicios para personas físicas',
  service_other:'Otro',
  field_attachment:'Archivo adjunto',
  intake_attachment_note:'Adjunta el archivo más relevante o un borrador del paquete.',
  field_message:'Mensaje / resumen de la situación',
  intake_message_ph:'Describe el asunto, el contexto del negocio y lo que debe revisarse.',
  intake_success:'Solicitud enviada correctamente. Nuestro equipo revisará tu envío.',
  intake_failure:'El envío falló. Inténtalo de nuevo.',
  careers_submit:'Enviar solicitud',
  careers_success:'Solicitud enviada correctamente. Revisaremos tu información.',
  careers_failure:'El envío falló. Inténtalo de nuevo.',
  field_linkedin:'LinkedIn',
  field_linkedin_ph:'https://www.linkedin.com/in/...',
  careers_mobile_button2:'Abrir formulario de solicitud',gate_success:'Acceso concedido. Abriendo el recurso.',gate_failure:'No se pudo enviar. Inténtelo otra vez o use el correo.',
  role_bizdocs:'Soporte de documentación comercial',attach_materials:'Adjuntar materiales',attach_helper:'Agrega contratos, facturas, capturas, anexos o borradores de paquete.',need_recovery:'Diseño del flujo de recuperación de ingresos',need_file:'Control de archivos legales corporativos',need_intake:'Evaluación inicial estructurada y armado del paquete',urgency_standard:'Estándar',urgency_high:'Alta',docs_ready:'Los documentos principales están listos',docs_partial:'Solo parte del material está lista',next_standard:'Revisaremos el intake y propondremos el primer paquete de trabajo limpio.',next_fast:'Priorizaremos el intake y primero enviaremos el memo del siguiente paso.'}
};
let lang=['en','ru','es'].includes(localStorage.getItem('vcx_lang'))?localStorage.getItem('vcx_lang'):'en';
function tr(key){return (extra[lang]&&extra[lang][key]) || (page[lang]&&page[lang][key]) || (common[lang]&&common[lang][key]) || (extra.en&&extra.en[key]) || (page.en&&page.en[key]) || (common.en&&common.en[key]) || '';}
function statusText(key, fallback){ return tr(key) || fallback || ''; }
function setStatus(el, type, message){
  if(!el) return;
  el.textContent = message || '';
  el.className = 'form-status small-note' + (type ? ' ' + type : '');
}
function applyText(){
 document.documentElement.lang=lang;
 $$('.lang-btn').forEach(b=>b.classList.toggle('active', b.dataset.lang===lang));
 $$('[data-common]').forEach(el=>{ const v=(common[lang]&&common[lang][el.dataset.common]) || (extra[lang]&&extra[lang][el.dataset.common]) || common.en?.[el.dataset.common] || extra.en?.[el.dataset.common]; if(v!==undefined) el.textContent=v; });
 $$('[data-page]').forEach(el=>{ const v=tr(el.dataset.page); if(v) el.textContent=v; });
 $$('[data-tx]').forEach(el=>{ const v=tr(el.dataset.tx); if(v) el.textContent=v; });
 $$('[data-tx-placeholder]').forEach(el=>{ const v=tr(el.dataset.txPlaceholder); if(v) el.setAttribute('placeholder',v); });
 $$('[data-tx-title]').forEach(el=>{ const v=tr(el.dataset.txTitle); if(v) el.setAttribute('title',v); });
 $$('[data-tx-value]').forEach(el=>{ const v=tr(el.dataset.txValue); if(v) el.setAttribute('value',v); });
 if(page[lang]?.title) document.title=page[lang].title;
 const md=$('meta[name="description"]'); if(md && page[lang]?.desc) md.setAttribute('content',page[lang].desc);
}
applyText();
$$('.lang-btn').forEach(b=>b.addEventListener('click',()=>{ lang=b.dataset.lang; localStorage.setItem('vcx_lang',lang); applyText(); syncCareerMailto(); updateOutputLanguage(); }));
const menuBtn=$('.menu-btn'), mobileNav=$('.mobile-nav');
if(menuBtn && mobileNav){
  menuBtn.addEventListener('click',()=>mobileNav.classList.toggle('open'));
  mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>mobileNav.classList.remove('open')));
}
const header=$('.site-header');
function onScrollCompact(){ if(!header) return; header.classList.toggle('header-compact', window.scrollY>30); }
onScrollCompact(); window.addEventListener('scroll', onScrollCompact, {passive:true});
function fmt(date,tz){ return new Intl.DateTimeFormat([], {hour:'2-digit',minute:'2-digit',hour12:false,timeZone:tz}).format(date); }
function clocks(){ const d=new Date(); $$('.clock-vcx').forEach(el=>el.textContent=fmt(d,'America/New_York')); const local=new Intl.DateTimeFormat([], {hour:'2-digit',minute:'2-digit',hour12:false}).format(d); $$('.clock-local').forEach(el=>el.textContent=local); }
clocks(); setInterval(clocks,1000);
const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); } }), {threshold:.14}); $$('.reveal').forEach(el=>io.observe(el));
$$('.bar-fill').forEach(el=>{ const w=el.dataset.width||0; const ob=new IntersectionObserver(es=>{ if(es[0].isIntersecting){ el.style.width=w+'%'; ob.disconnect(); }}); ob.observe(el); });
$$('[data-count-to]').forEach(el=>{ const target=parseFloat(el.dataset.countTo), suffix=el.dataset.suffix||''; const ob=new IntersectionObserver(es=>{ if(es[0].isIntersecting){ let start=null; const dur=1300; const step=ts=>{ if(!start) start=ts; const p=Math.min((ts-start)/dur,1); const val=target*p; el.textContent=(Number.isInteger(target)?Math.round(val):val.toFixed(1))+suffix; if(p<1) requestAnimationFrame(step); }; requestAnimationFrame(step); ob.disconnect(); }}); ob.observe(el); });
$$('.tilt-card').forEach(card=>{
  const reset=()=>card.style.transform='';
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`perspective(900px) rotateX(${(-y*4).toFixed(2)}deg) rotateY(${(x*5).toFixed(2)}deg) translateY(-2px)`;
  });
  card.addEventListener('mouseleave',reset);
});
// resource gate
const gate=$('#pdfGate'); function openGate(asset,label){ if(!gate) return; gate.classList.add('open'); gate.setAttribute('aria-hidden','false'); document.body.classList.add('modal-open'); gate.querySelector('[name="asset"]').value=asset||''; gate.querySelector('.gate-asset').textContent=label||'PDF'; }
function closeGate(){ if(!gate) return; gate.classList.remove('open'); gate.setAttribute('aria-hidden','true'); document.body.classList.remove('modal-open'); }
$$('[data-gated-asset]').forEach(btn=>btn.addEventListener('click',e=>{ e.preventDefault(); openGate(btn.dataset.gatedAsset, btn.dataset.gatedLabel); }));
$$('.modal-close,.modal-cancel').forEach(btn=>btn.addEventListener('click',closeGate)); gate && gate.addEventListener('click',e=>{ if(e.target===gate) closeGate(); });
const gateForm=$('#gateForm');
if(gateForm){
  const gateState=$('#gateState');
  const gateSubmitBtn=gateForm.querySelector('button[type="submit"]');
  gateForm.addEventListener('submit', async e=>{
    e.preventDefault();
    const fd=new FormData(gateForm);
    const required=['full_name','company','phone','email'];
    const ok=required.every(k=>String(fd.get(k)||'').trim());
    if(!ok){
      setStatus(gateState,'error',statusText('intake_validation','Please complete all required fields.'));
      return;
    }
    if(gateSubmitBtn){ gateSubmitBtn.disabled=true; gateSubmitBtn.classList.add('is-loading'); }
    try{
      await submitViaHiddenIframe(gateForm, {
        subject:'VitaCoreX Resource Access',
        replyTo:String(fd.get('email')||'').trim(),
        enctype:'application/x-www-form-urlencoded',
        extraFields:{Asset: String(fd.get('asset')||'')}
      });
      localStorage.setItem('vcx_gate', JSON.stringify(Object.fromEntries(fd.entries())));
      setStatus(gateState,'success',statusText('gate_success','Access granted. Opening the resource now.'));
      const asset=String(fd.get('asset')||'');
      closeGate();
      if(asset) window.open(asset,'_blank','noopener');
      gateForm.reset();
    }catch(err){
      setStatus(gateState,'error',statusText('gate_failure','Submission failed. Please try again or use email.'));
    }finally{
      if(gateSubmitBtn){ gateSubmitBtn.disabled=false; gateSubmitBtn.classList.remove('is-loading'); }
    }
  });
}
// Exit intent only on gated resources
let exitShown=false, armed=false; setTimeout(()=>armed=true,12000); function triggerExit(){ if(exitShown) return; const first=$('[data-gated-asset]'); if(first){ exitShown=true; openGate(first.dataset.gatedAsset, first.dataset.gatedLabel); } }
document.addEventListener('mouseout',e=>{ if(armed && !exitShown && e.clientY<=0 && window.innerWidth>900) triggerExit(); });
window.addEventListener('scroll',()=>{ const depth=(window.scrollY+window.innerHeight)/Math.max(document.body.scrollHeight,1); if(armed && !exitShown && window.innerWidth<=900 && depth>.72) triggerExit(); }, {passive:true});
// CFO calc
const calc=$('#cfoCalc'); if(calc){ const out={a:$('#calcAgency'),b:$('#calcPre'),c:$('#calcLift'),d:$('#calcLiftPct')}; const recompute=()=>{ const principal=+calc.principal.value||0, gross=(+calc.gross.value||0)/100, fee=(+calc.fee.value||0)/100, accept=(+calc.accept.value||0)/100, complete=(+calc.complete.value||0)/100, recovery=(+calc.recovery.value||0)/100, setup=+calc.setup.value||0; const agency=principal*gross*(1-fee); const pre=principal*(accept*complete*recovery)+(principal*(1-accept*complete))*(gross*(1-fee))-setup; const lift=pre-agency; const pct=agency?(lift/agency*100):0; out.a.textContent='$'+agency.toLocaleString(undefined,{maximumFractionDigits:0}); out.b.textContent='$'+pre.toLocaleString(undefined,{maximumFractionDigits:0}); out.c.textContent=(lift>=0?'+':'-')+'$'+Math.abs(lift).toLocaleString(undefined,{maximumFractionDigits:0}); out.d.textContent=(pct>=0?'+':'')+pct.toLocaleString(undefined,{maximumFractionDigits:1})+'%'; }; $$('input',calc).forEach(i=>i.addEventListener('input',recompute)); recompute(); }

// Intake + Careers submission
function detectDevice(){ return navigator.userAgent || 'Unknown device'; }
function upsertHidden(form, name, value){
  let el = form.querySelector(`input[name="${name}"]`);
  if(!el){
    el = document.createElement('input');
    el.type = 'hidden';
    el.name = name;
    form.appendChild(el);
  }
  el.value = value;
  return el;
}
function ensureFileNameMirror(form, fileFieldName, mirrorFieldName){
  const fileInput = form.querySelector(`[name="${fileFieldName}"]`);
  if(!fileInput) return;
  const sync = ()=>{
    const file = fileInput.files && fileInput.files[0];
    upsertHidden(form, mirrorFieldName, file && file.name ? file.name : 'No file attached');
  };
  fileInput.addEventListener('change', sync);
  sync();
}
const FORM_ENDPOINT='https://formsubmit.co/VitaCoreXllc@gmail.com';
function submitViaHiddenIframe(form, config){
  return new Promise((resolve,reject)=>{
    const iframeName = `vcx_submit_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const iframe = document.createElement('iframe');
    iframe.name = iframeName;
    iframe.title = 'hidden submission target';
    iframe.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;border:0;opacity:0;pointer-events:none;';
    document.body.appendChild(iframe);

    const previous = {
      action: form.getAttribute('action') || '',
      method: form.getAttribute('method') || '',
      enctype: form.getAttribute('enctype') || '',
      target: form.getAttribute('target') || ''
    };

    const temp = [];
    const addHidden = (name, value)=>{
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value;
      form.appendChild(input);
      temp.push(input);
    };

    addHidden('_subject', config.subject);
    addHidden('_captcha', 'false');
    addHidden('_template', 'table');
    addHidden('_replyto', String(config.replyTo || ''));
    addHidden('Timestamp', new Date().toISOString());
    addHidden('Browser / Device', detectDevice());
    if(config.extraFields){
      Object.entries(config.extraFields).forEach(([name, value])=>addHidden(name, value));
    }

    let done = false;
    const cleanup = ()=>{
      if(previous.action) form.setAttribute('action', previous.action); else form.removeAttribute('action');
      if(previous.method) form.setAttribute('method', previous.method); else form.removeAttribute('method');
      if(previous.enctype) form.setAttribute('enctype', previous.enctype); else form.removeAttribute('enctype');
      if(previous.target) form.setAttribute('target', previous.target); else form.removeAttribute('target');
      temp.forEach(el=>el.remove());
      setTimeout(()=>iframe.remove(), 300);
    };

    const timer = setTimeout(()=>{
      if(done) return;
      done = true;
      cleanup();
      reject(new Error('submit_timeout'));
    }, 25000);

    const optimisticSuccess = setTimeout(()=>{
      if(done) return;
      done = true;
      clearTimeout(timer);
      cleanup();
      resolve();
    }, 1800);

    iframe.addEventListener('load', ()=>{
      if(done) return;
      done = true;
      clearTimeout(timer);
      clearTimeout(optimisticSuccess);
      cleanup();
      resolve();
    }, {once:true});

    form.setAttribute('action', FORM_ENDPOINT);
    form.setAttribute('method', 'POST');
    form.setAttribute('enctype', config.enctype || 'multipart/form-data');
    form.setAttribute('target', iframeName);
    try {
      form.submit();
    } catch (err) {
      if(done) return;
      done = true;
      clearTimeout(timer);
      clearTimeout(optimisticSuccess);
      cleanup();
      reject(err);
    }
  });
}
function fillOutputFromIntake(form){
  const fd=new FormData(form);
  const service=String(fd.get('service_type')||'');
  const urgency=String(fd.get('urgency')||'Standard');
  const serviceMap={
    'Revenue Recovery Workflow Design':'recovery',
    'Corporate Legal File Control':'file',
    'Structured Case Intake & Packet Build':'intake',
    'Executive Briefs / Proof Request':'intake',
    'Services for Individuals':'intake',
    'Other':'intake'
  };
  lastOutput={
    service:serviceMap[service]||'intake',
    fitKey: urgency==='Same day / urgent' ? 'urgency_high' : 'urgency_standard',
    docsKey:'docs_partial',
    windowText: urgency==='Same day / urgent' ? 'Same day' : urgency,
    nextKey: urgency==='Same day / urgent' ? 'next_fast' : 'next_standard',
    score: urgency==='Same day / urgent' ? 96 : 91
  };
  updateOutputLanguage();
}
function bindIntakeForm(form){
  if(!form) return;
  ensureFileNameMirror(form, 'attachment', 'Attachment');
  const status=form.querySelector('#intakeFormStatus') || form.querySelector('.form-status');
  const submitBtn=form.querySelector('#intakeSubmitBtn') || form.querySelector('button[type="submit"]');
  form.addEventListener('submit', async e=>{
    e.preventDefault();
    if(!form.checkValidity()){
      form.reportValidity();
      setStatus(status,'error',statusText('careers_failure','Submission failed. Please try again.'));
      return;
    }
    const fd=new FormData(form);
    const email = String(fd.get('email')||'').trim();
    const file=fd.get('attachment');
    const fileLabel=file && typeof file.name==='string' && file.name ? file.name : 'No file attached';
    setStatus(status,'', '');
    if(submitBtn){ submitBtn.disabled=true; submitBtn.classList.add('is-loading'); }
    try{
      await submitViaHiddenIframe(form, {
        subject:'VitaCoreX Intake Request',
        replyTo: email,
        enctype:'multipart/form-data',
        extraFields:{'Attachment': fileLabel}
      });
      setStatus(status,'success',statusText('intake_success','Request sent successfully. Our team will review your submission.'));
      fillOutputFromIntake(form);
      form.reset();
      ensureFileNameMirror(form, 'attachment', 'Attachment');
    }catch(err){
      setStatus(status,'error',statusText('careers_failure','Submission failed. Please try again.'));
    }finally{
      if(submitBtn){ submitBtn.disabled=false; submitBtn.classList.remove('is-loading'); }
    }
  });
}
// disabled custom handler to allow direct formsubmit


const careersForm=$('#careersForm');
if(careersForm){
  const status=$('#careersFormStatus');
  const submitBtn=$('#careersSubmitBtn') || careersForm.querySelector('button[type="submit"]');
  careersForm.addEventListener('submit', async e=>{
    e.preventDefault();
    if(!careersForm.checkValidity()){
      careersForm.reportValidity();
      setStatus(status,'error',statusText('intake_failure','Submission failed. Please try again.'));
      return;
    }
    const fd=new FormData(careersForm);
    setStatus(status,'', '');
    if(submitBtn){ submitBtn.disabled=true; submitBtn.classList.add('is-loading'); }
    try{
      await submitViaHiddenIframe(careersForm, {
        subject:'VitaCoreX Careers Application',
        replyTo: String(fd.get('email')||'').trim(),
        enctype:'application/x-www-form-urlencoded'
      });
      setStatus(status,'success',statusText('careers_success','Application sent successfully. We will review your information.'));
      careersForm.reset();
    }catch(err){
      setStatus(status,'error',statusText('intake_failure','Submission failed. Please try again.'));
    }finally{
      if(submitBtn){ submitBtn.disabled=false; submitBtn.classList.remove('is-loading'); }
    }
  });
}
const careersMobileBtn=$('#careersMobileModal a.btn');
if(careersMobileBtn){
 careersMobileBtn.addEventListener('click',e=>{
   e.preventDefault();
   const modal=$('#careersMobileModal');
   if(modal){ modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); document.body.classList.remove('modal-open'); }
   const target=$('#careersForm'); if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
 });
}
})();
