
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
order_services:'Order Services',clock_local_sub:'Local',services_individuals_title:'Services for Individuals',services_individuals_intro:'Services for individuals and specialized one-off matters remain fully available, while the primary VitaCoreX focus stays on corporate B2B operating support.',request_review:'Request review',see_all_individuals:'See all services for individuals',res1_title:'Healthcare leakage brief',res1_desc:'Operator-facing summary of leakage points, DSO drag, and early agency fee compression.',res1_tag:'Operator brief',res2_title:'Healthcare CFO brief',res2_desc:'Finance-facing brief for owners, CFOs, and operator leadership.',res2_tag:'CFO decision brief',res3_title:'Dental institutional deck',res3_desc:'Institutional framing with pilot economics, sequencing logic, and executive positioning.',res3_tag:'Institutional deck',res4_title:'Pre-collection executive review',res4_desc:'Framework logic, controlled escalation, and economics for pre-agency sequencing.',res4_tag:'Executive review',counter_quality:'Packet quality signal',counter_clarity:'Handoff clarity signal',counter_control:'Recovery control signal',counter_pressure:'Illustrative leakage pressure',counter_adoption:'ALSP operating adoption',counter_window:'Pilot design window',ind1_title:'Contracts & Documentation',ind1_desc:'Administrative support for contract drafting, document review, business forms, demand letters, and structured support packets.',ind1_b1:'Contract drafting',ind1_b2:'Document review',ind1_b3:'Business forms',ind1_b4:'Demand letters',ind1_b5:'Support packets',ind2_title:'Immigration Documents',ind2_desc:'Packet organization, form guidance, submission-readiness review, and evidence structuring for personal filing support.',ind2_b1:'Packet organization',ind2_b2:'Form guidance',ind2_b3:'Submission review',ind2_b4:'Evidence structuring',ind2_b5:'Administrative support',ind3_title:'Auto Purchase Review',ind3_desc:'Buyer-side review before signing, with fee analysis, payment-structure clarity, and negotiation support.',ind3_b1:'Dealer contract review',ind3_b2:'Fee analysis',ind3_b3:'Payment review',ind3_b4:'Negotiation support',ind3_b5:'Risk summary',ind4_title:'Business Plans',ind4_desc:'Executive summary, investor narrative, launch plan, financial framing, and pitch support.',ind4_b1:'Executive summary',ind4_b2:'Investor narrative',ind4_b3:'Launch plan',ind4_b4:'Financial framing',ind4_b5:'Pitch support',ind5_title:'Company Formation',ind5_desc:'Structured support for opening companies, entity setup, filing packets, and launch-readiness documents.',ind5_b1:'Entity formation support',ind5_b2:'Opening packages',ind5_b3:'Filing support',ind5_b4:'Business setup packet',ind5_b5:'Launch checklist',ind6_title:'Translation & Localization',ind6_desc:'Translation support, bilingual document cleanup, and structured localization for business or filing materials.',ind6_b1:'Document translation support',ind6_b2:'Bilingual cleanup',ind6_b3:'Localization review',ind6_b4:'Evidence translation pack',ind6_b5:'Administrative coordination',field_phone_careers:'Phone',field_role:'Role of interest',select_role:'Select role',role_ops:'Operations support',role_docs:'Documentation support',role_intake:'Intake support',role_translation:'Translation support',role_admin:'Admin support',role_client:'Client coordination',field_background:'Short background',careers_placeholder:'Short introduction, role of interest, and the kind of work you can support.',careers_helper:'Complete all required fields to activate the application email.',careers_who_title:'Who we look for',careers_apply_title:'How to apply',careers_t1:'Disciplined candidates who can work in a documentation-first operating model.',careers_t2:'Strong and confident English.',careers_t3:'Verifiable recommendations strongly preferred.',careers_t4:'Preference for Russian-speaking candidates with excellent English.',field_need:'Primary need',field_urgency:'Urgency',field_docs:'Document readiness',field_company_context:'Company / matter context',field_company_context_ph:'Company, packet, contract, invoice',intake_placeholder:'Describe the matter, the business context, and the decision that is blocked.',attach_materials:'Attach materials',attach_helper:'Add contracts, invoices, screenshots, exhibits, or packet drafts.',need_recovery:'Revenue Recovery Workflow Design',need_file:'Corporate Legal File Control',need_intake:'Structured Case Intake & Packet Build',urgency_standard:'Standard',urgency_high:'High',docs_ready:'Core documents are ready',docs_partial:'Only partial material is ready',next_standard:'We will review the intake and propose the first clean work product.',next_fast:'We will prioritize the intake and route the next-step memo first',web_project_cta:'Request a Web Site Project',web_project_title:'Request a Web Site Project',web_project_intro:'Tell us about your website project and budget. We will review the request and contact you with the next step.',web_project_field_name:'Name',web_project_field_company:'Company',web_project_field_phone:'Phone',web_project_field_email:'Email',web_project_field_budget:'Budget',web_project_budget_placeholder:'Select budget',web_project_budget_more:'More than 40',web_project_notes_label:'Project Notes (optional)',web_project_notes_placeholder:'Briefly describe the type of website or project you want.',web_project_submit:'Submit Request',web_project_success:'Thank you. Your request has been received. We will review it and contact you.',web_project_error:'Something went wrong. Please try again.',web_project_validation:'Please complete all required fields before submitting.'},
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
  role_bizdocs:'Поддержка бизнес-документации',attach_materials:'Прикрепить материалы',attach_helper:'Добавьте договоры, счета, скриншоты, exhibits или draft-пакеты.',need_recovery:'Система возврата дебиторной выручки',need_file:'Контроль юридического документооборота компании',need_intake:'Структурированный первичный разбор и сбор пакета',urgency_standard:'Стандартно',urgency_high:'Высокий приоритет',docs_ready:'Основные документы готовы',docs_partial:'Готова только часть материалов',next_standard:'Мы рассмотрим intake и предложим первый аккуратный рабочий пакет.',next_fast:'Мы приоритизируем intake и сначала направим next-step memo.',web_project_cta:'Заказать проект сайта',web_project_title:'Заказать проект сайта',web_project_intro:'Опишите ваш проект сайта и бюджет. Мы рассмотрим заявку и свяжемся с вами по следующему шагу.',web_project_field_name:'Имя',web_project_field_company:'Компания',web_project_field_phone:'Телефон',web_project_field_email:'Email',web_project_field_budget:'Бюджет',web_project_budget_placeholder:'Выберите бюджет',web_project_budget_more:'Больше 40',web_project_notes_label:'Комментарий по проекту (необязательно)',web_project_notes_placeholder:'Кратко опишите, какой сайт или проект вы хотите.',web_project_submit:'Отправить заявку',web_project_success:'Спасибо. Ваша заявка получена. Мы рассмотрим ее и свяжемся с вами.',web_project_error:'Что-то пошло не так. Пожалуйста, попробуйте еще раз.',web_project_validation:'Пожалуйста, заполните все обязательные поля перед отправкой.'},
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
  role_bizdocs:'Soporte de documentación comercial',attach_materials:'Adjuntar materiales',attach_helper:'Agrega contratos, facturas, capturas, anexos o borradores de paquete.',need_recovery:'Diseño del flujo de recuperación de ingresos',need_file:'Control de archivos legales corporativos',need_intake:'Evaluación inicial estructurada y armado del paquete',urgency_standard:'Estándar',urgency_high:'Alta',docs_ready:'Los documentos principales están listos',docs_partial:'Solo parte del material está lista',next_standard:'Revisaremos el intake y propondremos el primer paquete de trabajo limpio.',next_fast:'Priorizaremos el intake y primero enviaremos el memo del siguiente paso.',web_project_cta:'Solicitar un proyecto de sitio web',web_project_title:'Solicitar un proyecto de sitio web',web_project_intro:'Cuéntenos sobre su proyecto de sitio web y presupuesto. Revisaremos la solicitud y nos pondremos en contacto con usted con el siguiente paso.',web_project_field_name:'Nombre',web_project_field_company:'Empresa',web_project_field_phone:'Teléfono',web_project_field_email:'Correo electrónico',web_project_field_budget:'Presupuesto',web_project_budget_placeholder:'Seleccione el presupuesto',web_project_budget_more:'Más de 40',web_project_notes_label:'Notas del proyecto (opcional)',web_project_notes_placeholder:'Describa brevemente el tipo de sitio web o proyecto que desea.',web_project_submit:'Enviar solicitud',web_project_success:'Gracias. Su solicitud ha sido recibida. La revisaremos y nos pondremos en contacto con usted.',web_project_error:'Algo salió mal. Por favor, inténtelo de nuevo.',web_project_validation:'Por favor, complete todos los campos obligatorios antes de enviar.'}
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
let lastScrollY=window.scrollY||0;
function onScrollCompact(){
  if(!header) return;
  const current=window.scrollY||0;
  header.classList.toggle('header-compact', current>26);
  const shouldHide=current>140 && current>lastScrollY+6;
  const shouldShow=current<72 || current<lastScrollY-10;
  if(shouldHide) header.classList.add('header-hidden');
  if(shouldShow) header.classList.remove('header-hidden');
  lastScrollY=current;
}
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
const gate=$('#pdfGate');
function openGate(asset,label){
  if(!gate) return;
  gate.classList.add('open');
  gate.setAttribute('aria-hidden','false');
  document.body.classList.add('modal-open');
  const assetField=gate.querySelector('[name="asset"]');
  const assetLabel=gate.querySelector('.gate-asset');
  if(assetField) assetField.value=asset||'';
  if(assetLabel) assetLabel.textContent=label||'PDF';
}
function closeGate(){
  if(!gate) return;
  gate.classList.remove('open');
  gate.setAttribute('aria-hidden','true');
  document.body.classList.remove('modal-open');
}
function normalizeAssetUrl(asset){
  return String(asset||'').trim();
}
function isAppleMobileContext(){
  const ua=navigator.userAgent||'';
  return /iPhone|iPad|iPod/i.test(ua) || (navigator.platform==='MacIntel' && (navigator.maxTouchPoints||0)>1);
}
function openPdfAsset(asset, pendingWindow){
  const url=normalizeAssetUrl(asset);
  if(!url) return;
  if(isAppleMobileContext()){
    window.location.assign(url);
    return;
  }
  if(pendingWindow && !pendingWindow.closed){
    try{
      pendingWindow.opener=null;
      pendingWindow.location.href=url;
      return;
    }catch(err){}
  }
  const tempLink=document.createElement('a');
  tempLink.href=url;
  tempLink.target='_blank';
  tempLink.rel='noopener';
  tempLink.click();
}
$$('[data-gated-asset]').forEach(btn=>btn.addEventListener('click',e=>{
  e.preventDefault();
  const asset=btn.dataset.gatedAsset || btn.getAttribute('href') || '';
  openGate(asset, btn.dataset.gatedLabel);
}));
$$('.modal-close,.modal-cancel').forEach(btn=>btn.addEventListener('click',closeGate));
gate && gate.addEventListener('click',e=>{ if(e.target===gate) closeGate(); });
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
    const asset=String(fd.get('asset')||'').trim();
    const sameTab=isAppleMobileContext();
    let pendingWindow=null;
    if(asset && !sameTab){
      pendingWindow=window.open('about:blank','_blank','noopener');
      if(pendingWindow){
        try{ pendingWindow.opener=null; }catch(err){}
      }
    }
    if(gateSubmitBtn){
      gateSubmitBtn.disabled=true;
      gateSubmitBtn.classList.add('is-loading');
    }
    try{
      await submitViaHiddenIframe(gateForm, {
        subject:'VitaCoreX Resource Access',
        replyTo:String(fd.get('email')||'').trim(),
        enctype:'application/x-www-form-urlencoded',
        extraFields:{Asset: asset}
      });
      localStorage.setItem('vcx_gate', JSON.stringify(Object.fromEntries(fd.entries())));
      setStatus(gateState,'success',statusText('gate_success','Access granted. Opening the resource now.'));
      closeGate();
      openPdfAsset(asset, pendingWindow);
      gateForm.reset();
    }catch(err){
      if(pendingWindow && !pendingWindow.closed){
        try{ pendingWindow.close(); }catch(closeErr){}
      }
      setStatus(gateState,'error',statusText('gate_failure','Submission failed. Please try again or use email.'));
    }finally{
      if(gateSubmitBtn){
        gateSubmitBtn.disabled=false;
        gateSubmitBtn.classList.remove('is-loading');
      }
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
function ensureHiddenField(form, name, value){
  let el=form.querySelector(`input[name="${name}"]`);
  if(!el){ el=document.createElement('input'); el.type='hidden'; el.name=name; form.appendChild(el); }
  el.value=value;
  return el;
}
function configureDirectFormSubmission(form, config){
  form.setAttribute('action', FORM_ENDPOINT);
  form.setAttribute('method', 'POST');
  form.setAttribute('enctype', config.enctype || 'multipart/form-data');
  form.setAttribute('accept-charset','UTF-8');
  form.removeAttribute('target');
  ensureHiddenField(form,'_captcha','false');
  ensureHiddenField(form,'_template','table');
  ensureHiddenField(form,'_subject', config.subject || 'VitaCoreX Website Submission');
  ensureHiddenField(form,'_next','https://vitacorexllc.com/thank-you.html');
  if(config.replyTo) ensureHiddenField(form,'_replyto', String(config.replyTo||'').trim());
  ensureHiddenField(form,'Timestamp', new Date().toISOString());
  ensureHiddenField(form,'Browser / Device', detectDevice());
}

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

    form.setAttribute('action', config.endpoint || FORM_ENDPOINT);
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
  form.addEventListener('submit', e=>{
    if(!form.checkValidity()){
      e.preventDefault();
      form.reportValidity();
      setStatus(status,'error',statusText('intake_validation','Please complete all fields before submitting.'));
      return;
    }
    const fd=new FormData(form);
    configureDirectFormSubmission(form, {
      subject:'VitaCoreX Intake Request',
      replyTo:String(fd.get('email')||'').trim(),
      enctype:'multipart/form-data'
    });
    if(submitBtn){ submitBtn.disabled=true; submitBtn.classList.add('is-loading'); }
    setStatus(status,'success','Submitting request…');
  });
}
bindIntakeForm($('#intakeForm'));

const WEB_PROJECT_FORM_ENDPOINT='https://formsubmit.co/Vitacorexllc@mail.com';
function bindWebProjectModal(){
  const modal=$('#webProjectModal');
  if(!modal) return;
  const form=$('#webProjectForm');
  const status=$('#webProjectStatus');
  const submitBtn=form ? (form.querySelector('#webProjectSubmitBtn') || form.querySelector('button[type="submit"]')) : null;
  const closeBtns=Array.from(modal.querySelectorAll('.modal-close,[data-web-project-close]'));
  const triggers=$$('[data-web-project-open]');
  const firstField=form ? form.querySelector('input[name="name"]') : null;
  let lastTrigger=null;

  function openWebProjectModal(trigger){
    lastTrigger=trigger || document.activeElement || null;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.body.classList.add('modal-open');
    modal.classList.remove('web-project-success');
    if(status) setStatus(status,'','');
    setTimeout(()=>{ if(firstField) firstField.focus(); }, 40);
  }

  function closeWebProjectModal(){
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    document.body.classList.remove('modal-open');
    if(lastTrigger && typeof lastTrigger.focus==='function'){
      try{ lastTrigger.focus(); }catch(err){}
    }
  }

  triggers.forEach((btn)=>{
    btn.addEventListener('click', (e)=>{
      e.preventDefault();
      openWebProjectModal(btn);
    });
  });

  closeBtns.forEach((btn)=>btn.addEventListener('click', closeWebProjectModal));
  modal.addEventListener('click', (e)=>{ if(e.target===modal) closeWebProjectModal(); });
  document.addEventListener('keydown', (e)=>{
    if(e.key==='Escape' && modal.classList.contains('open')) closeWebProjectModal();
  });

  if(form){
    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      if(!form.checkValidity()){
        form.reportValidity();
        if(status) setStatus(status,'error',statusText('web_project_validation','Please complete all required fields before submitting.'));
        return;
      }
      const fd=new FormData(form);
      if(submitBtn){
        submitBtn.disabled=true;
        submitBtn.classList.add('is-loading');
      }
      if(status) setStatus(status,'','');
      try{
        await submitViaHiddenIframe(form, {
          endpoint: WEB_PROJECT_FORM_ENDPOINT,
          subject:'VitaCoreX Web Site Project Request',
          replyTo:String(fd.get('email')||'').trim(),
          enctype:'application/x-www-form-urlencoded'
        });
        form.reset();
        modal.classList.add('web-project-success');
        if(status) setStatus(status,'success',statusText('web_project_success','Thank you. Your request has been received. We will review it and contact you.'));
      }catch(err){
        if(status) setStatus(status,'error',statusText('web_project_error','Something went wrong. Please try again.'));
      }finally{
        if(submitBtn){
          submitBtn.disabled=false;
          submitBtn.classList.remove('is-loading');
        }
      }
    });
  }
}
bindWebProjectModal();


const careersForm=$('#careersForm');
if(careersForm){
  const status=$('#careersFormStatus');
  const submitBtn=$('#careersSubmitBtn') || careersForm.querySelector('button[type="submit"]');
  careersForm.addEventListener('submit', e=>{
    if(!careersForm.checkValidity()){
      e.preventDefault();
      careersForm.reportValidity();
      setStatus(status,'error',statusText('careers_failure','Submission failed. Please try again.'));
      return;
    }
    const fd=new FormData(careersForm);
    configureDirectFormSubmission(careersForm, {
      subject:'VitaCoreX Careers Application',
      replyTo:String(fd.get('email')||'').trim(),
      enctype:'multipart/form-data'
    });
    if(submitBtn){ submitBtn.disabled=true; submitBtn.classList.add('is-loading'); }
    setStatus(status,'success','Submitting application…');
  });
}

function injectHeroClouds(){
  const heroVideo=$('.hero-video');
  if(!heroVideo || heroVideo.querySelector('.hero-cloud-layer')) return;
  const layer1=document.createElement('div');
  layer1.className='hero-cloud-layer layer-1';
  const layer2=document.createElement('div');
  layer2.className='hero-cloud-layer layer-2';
  heroVideo.appendChild(layer1);
  heroVideo.appendChild(layer2);
  const parallax=()=>{
    const y=window.scrollY||0;
    layer1.style.transform=`translate3d(${(-y*0.01).toFixed(2)}px, ${(y*0.03).toFixed(2)}px, 0)`;
    layer2.style.transform=`translate3d(${(-y*0.005).toFixed(2)}px, ${(y*0.018).toFixed(2)}px, 0)`;
  };
  parallax();
  window.addEventListener('scroll',parallax,{passive:true});
}
injectHeroClouds();

function initClientMode(){
  const form=$('#intakeForm');
  if(!form) return;
  const modeInput=form.querySelector('[name="client_type"]');
  const companyField=form.querySelector('[name="company"]');
  const serviceField=form.querySelector('[name="service_type"]');
  const companyBlocks=$$('.company-only', form);
  const buttons=$$('.client-mode-btn', form);
  const attachment=form.querySelector('[name="attachment"]');
  if(attachment) attachment.removeAttribute('required');

  const setMode=(mode)=>{
    if(modeInput) modeInput.value=mode;
    form.dataset.clientMode=mode;
    form.classList.toggle('is-company-mode', mode==='company');
    form.classList.toggle('is-individual-mode', mode!=='company');
    buttons.forEach(btn=>btn.classList.toggle('active', btn.dataset.mode===mode));
    companyBlocks.forEach(el=>el.classList.toggle('is-hidden', mode!=='company'));
    if(companyField){
      companyField.required = mode==='company';
      if(mode!=='company') companyField.value='';
    }
    if(serviceField && mode==='individual'){
      const opt=[...serviceField.options].find(o=>/Services for Individuals/i.test(o.value||o.textContent||''));
      if(opt) serviceField.value=opt.value;
    }
  };

  buttons.forEach(btn=>btn.addEventListener('click',()=>setMode(btn.dataset.mode)));
  serviceField && serviceField.addEventListener('change',()=>{
    const isIndividuals=/services for individuals/i.test(serviceField.value);
    if(isIndividuals) setMode('individual');
  });
  setMode(modeInput && modeInput.value==='company' ? 'company' : 'individual');
}
initClientMode();

function buildCookieBanner(){
  if(document.querySelector('.cookie-banner')) return;
  const saved=localStorage.getItem('vcx_cookie_consent');
  if(saved) return applyConsent(saved);
  const banner=document.createElement('section');
  banner.className='cookie-banner';
  banner.innerHTML=`<strong>Privacy & analytics settings</strong>
    <p>We use essential cookies plus optional analytics and marketing trackers to understand visits, improve performance, and measure campaigns. Optional trackers load only after consent.</p>
    <div class="cookie-actions">
      <button class="cookie-btn primary" data-consent="all" type="button">Accept all</button>
      <button class="cookie-btn" data-consent="analytics" type="button">Analytics only</button>
      <button class="cookie-btn secondary" data-consent="essential" type="button">Essential only</button>
    </div>
    <div class="cookie-meta">Tracker-ready slots: Google Analytics 4, Google Tag Manager, Microsoft Clarity, Hotjar, Meta Pixel, LinkedIn Insight Tag.</div>`;
  document.body.appendChild(banner);
  banner.querySelectorAll('[data-consent]').forEach(btn=>btn.addEventListener('click',()=>{
    const consent=btn.dataset.consent;
    localStorage.setItem('vcx_cookie_consent', consent);
    banner.hidden=true;
    applyConsent(consent);
  }));
}
function loadScript(src){
  if(!src || document.querySelector(`script[src="${src}"]`)) return;
  const s=document.createElement('script');
  s.src=src; s.async=true; document.head.appendChild(s);
}
function applyConsent(consent){
  const ids=window.VCX_TRACKING_IDS||{};
  window.dataLayer=window.dataLayer||[];
  window.vcxConsent=consent;
  if(consent==='essential') return;
  if(ids.gtm){
    window.dataLayer.push({'event':'consent_update','vcx_consent':consent});
    const gtmSrc='https://www.googletagmanager.com/gtm.js?id='+encodeURIComponent(ids.gtm);
    loadScript(gtmSrc);
  }
  if(ids.ga4){
    loadScript('https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(ids.ga4));
    window.gtag=window.gtag||function(){dataLayer.push(arguments);};
    gtag('js', new Date());
    gtag('config', ids.ga4, {anonymize_ip:true});
  }
  if(ids.apolloAppId){
    loadApolloTracker(ids.apolloAppId);
  }
  if(ids.clarity){
    (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", ids.clarity);
  }
  if(ids.hotjarSiteId){
    (function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};h._hjSettings={hjid:ids.hotjarSiteId,hjsv:ids.hotjarVersion||6};a=o.getElementsByTagName('head')[0];r=o.createElement('script');r.async=1;r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;a.appendChild(r);})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
  }
  if(consent==='all'){
    if(ids.metaPixel){
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', ids.metaPixel); fbq('track', 'PageView');
    }
    if(ids.linkedInPartner){
      window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];
      window._linkedin_data_partner_ids.push(ids.linkedInPartner);
      loadScript('https://snap.licdn.com/li.lms-analytics/insight.min.js');
    }
  }
}

function bindTracking(){
  document.querySelectorAll('a[href$=".pdf"], a[href*=".pdf?"]').forEach(a=>{
    a.addEventListener('click', ()=>{
      trackEvent('pdf_download', {
        asset_name:(a.getAttribute('href')||'').split('/').pop(),
        link_text:(a.textContent||'').trim().slice(0,80)
      });
    });
  });

  document.querySelectorAll('a, button').forEach(el=>{
    const text=(el.textContent||'').trim().toLowerCase();
    const href=(el.getAttribute('href')||'').toLowerCase();
    const label=(el.textContent||el.getAttribute('aria-label')||'').trim().slice(0,80);
    if(href.includes('calendly.com') || text.includes('consult') || text.includes('book meeting') || text.includes('request intake') || text.includes('order services')){
      el.addEventListener('click', ()=>{
        trackEvent('consultation_click', {label: label, href: href || ''});
      });
    }
  });

  document.querySelectorAll('form').forEach(form=>{
    form.addEventListener('submit', ()=>{
      const formName=form.getAttribute('id') || form.getAttribute('name') || 'site_form';
      trackEvent('form_submit', {form_name: formName});
      if(/intake|contact/i.test(formName)){
        trackEvent('contact_form_submit', {form_name: formName});
        trackEvent('consultation_request', {form_name: formName});
      }
      if(/gate/i.test(formName)){
        trackEvent('pdf_gate_submit', {form_name: formName});
      }
    }, {capture:true});
  });

  ['leakRevenue','dsoRevenue','roiPortfolio'].forEach(id=>{
    const el=document.getElementById(id);
    if(el && !el.dataset.vcxTracked){
      el.dataset.vcxTracked='1';
      el.addEventListener('change', ()=>{
        const map={
          leakRevenue:'revenue_calculator_use',
          dsoRevenue:'dso_calculator_use',
          roiPortfolio:'roi_calculator_use'
        };
        trackEvent(map[id] || 'calculator_use', {calculator_id:id});
      });
    }
  });
}
bindTracking();

buildCookieBanner();

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

function initVcxCharts(){
  const hasRecovery=document.getElementById('recoveryChart');
  const hasVelocity=document.getElementById('velocityChart');
  if(!hasRecovery && !hasVelocity) return;
  const draw=()=>{
    if(!window.Chart) return;
    const rc=document.getElementById('recoveryChart');
    if(rc && !rc.dataset.ready){
      rc.dataset.ready='1';
      new Chart(rc.getContext('2d'),{type:'line',data:{labels:['0-30','30-60','60-90','90-120','120+'],datasets:[{label:'Recovery probability',data:[90,70,50,30,15],borderColor:'#91f0d1',backgroundColor:'rgba(145,240,209,.18)',fill:true,tension:.35}]},options:{plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,max:100},x:{grid:{display:false}}}}});
    }
    const vc=document.getElementById('velocityChart');
    if(vc && !vc.dataset.ready){
      vc.dataset.ready='1';
      new Chart(vc.getContext('2d'),{type:'bar',data:{labels:['Baseline','Target'],datasets:[{label:'DSO',data:[52,44],backgroundColor:['rgba(255,255,255,.36)','rgba(145,240,209,.72)']}]},options:{plugins:{legend:{display:false}},scales:{y:{beginAtZero:true}}}});
    }
  };
  if(window.Chart) draw();
}
initVcxCharts();


function initExecutiveWidgets(){
  const currency=(n)=>'$'+Math.max(0,n||0).toLocaleString(undefined,{maximumFractionDigits:0});
  const leakageRevenue=document.getElementById('leakRevenue');
  if(leakageRevenue){
    const recalcLeak=()=>{
      const revenue=+document.getElementById('leakRevenue').value||0;
      const responsibility=(+document.getElementById('leakResponsibility').value||0)/100;
      const leakage=(+document.getElementById('leakLeakage').value||0)/100;
      document.getElementById('leakOutput').textContent=currency(revenue*responsibility*leakage);
    };
    ['leakRevenue','leakResponsibility','leakLeakage'].forEach(id=>{
      const el=document.getElementById(id);
      if(el) el.addEventListener('input', recalcLeak);
    });
    recalcLeak();
  }

  const dsoRevenue=document.getElementById('dsoRevenue');
  if(dsoRevenue){
    const recalcDso=()=>{
      const revenue=+document.getElementById('dsoRevenue').value||0;
      const current=+document.getElementById('dsoCurrent').value||0;
      const target=+document.getElementById('dsoTarget').value||0;
      const delta=Math.max(0,current-target);
      const released=(delta/365)*revenue;
      document.getElementById('dsoOutput').textContent=currency(released);
      document.getElementById('dsoDelta').textContent=`${delta} days`;
    };
    ['dsoRevenue','dsoCurrent','dsoTarget'].forEach(id=>{
      const el=document.getElementById(id);
      if(el) el.addEventListener('input', recalcDso);
    });
    recalcDso();
  }

  const roiPortfolio=document.getElementById('roiPortfolio');
  if(roiPortfolio){
    const recalcRoi=()=>{
      const portfolio=+document.getElementById('roiPortfolio').value||0;
      const improve=(+document.getElementById('roiImprove').value||0)/100;
      const cost=+document.getElementById('roiCost').value||0;
      const addCash=portfolio*improve;
      const multiple=cost>0?(addCash/cost):0;
      document.getElementById('roiOutput').textContent=currency(addCash);
      document.getElementById('roiMultiple').textContent=`${multiple.toFixed(1)}x`;
    };
    ['roiPortfolio','roiImprove','roiCost'].forEach(id=>{
      const el=document.getElementById(id);
      if(el) el.addEventListener('input', recalcRoi);
    });
    recalcRoi();
  }
}
initExecutiveWidgets();

function improveMobileFileInput(){
  const input=document.querySelector('#intakeForm input[name="attachment"]');
  if(!input) return;
  input.addEventListener('change', ()=>{
    const help=document.getElementById('attachmentHelp');
    const file=input.files && input.files[0];
    if(help && file && /pdf|word|officedocument|image/i.test(file.type || file.name)){
      help.textContent=`Selected: ${file.name}`;
    } else if(help && file){
      help.textContent=`Selected: ${file.name}. Supported on iPhone through Files / Browse.`;
    }
  });
}
improveMobileFileInput();


(function(){
  function vcxCurrentLang(){
    const saved = localStorage.getItem('vcx_lang');
    return ['en','ru','es'].includes(saved) ? saved : 'en';
  }

  const hardCopy = {
    en: {
      marketFallback: 'Market signal temporarily unavailable. Revenue recovery remains one of the largest controllable cash drivers for multi-location operators.',
      widgets: {
        eyebrow: 'Executive tools',
        title: 'Interactive tools that make the offer clearer, more credible, and easier to evaluate.',
        intro: 'These tools help operators, CFOs, and decision-makers quantify leakage, working-capital impact, and pilot economics before requesting a consultation.',
        cards: [
          { pill:'CFO', title:'Revenue leakage calculator', labels:['Annual revenue','Patient / client responsibility %','Recovery leakage %'], metrics:['Estimated hidden cash','Executive use'] },
          { pill:'Cash velocity', title:'DSO impact simulator', labels:['Annual revenue','Current DSO','Target DSO'], metrics:['Working capital released','DSO reduction'] },
          { pill:'Pilot ROI', title:'90-day pilot economics', labels:['AR / portfolio in scope','Expected improvement %','Pilot cost'], metrics:['Additional cash','ROI multiple'] }
        ],
        benefits: [
          ['Executive utility','Decision-grade tools','Present the offer like a finance-led operating system rather than a generic service brochure.'],
          ['Lead quality','Self-qualification before consultation','Better inputs, stronger calls, fewer weak inquiries.'],
          ['Trust','Metrics-led positioning','Signals that VitaCoreX thinks in controls, economics, and implementation outcomes.']
        ],
        kpis:['Net recovery improvement','Agency fee avoidance','Pilot validation window'],
        module:['B2B consulting structure','Built for operators who require structured execution before legal and recovery costs escalate.','Request strategic review','Review service lines']
      }
    },
    ru: {
      marketFallback: 'Рыночный блок временно недоступен. Возврат выручки остаётся одним из самых управляемых драйверов кэша для сетевых операторов.',
      widgets: {
        eyebrow: 'Executive-инструменты',
        title: 'Интерактивные инструменты, которые делают предложение понятнее, убедительнее и полезнее.',
        intro: 'Эти блоки помогают операторам, CFO и руководителям быстро оценить масштаб утечек, влияние на оборотный капитал и экономику пилота до отправки запроса.',
        cards: [
          { pill:'CFO', title:'Калькулятор потери выручки', labels:['Годовая выручка','Доля ответственности пациента / клиента %','Процент потери возврата %'], metrics:['Оценка скрытого кэша','Использование для руководства'] },
          { pill:'Скорость кэша', title:'Симулятор влияния на DSO', labels:['Годовая выручка','Текущий DSO','Целевой DSO'], metrics:['Высвобождение оборотного капитала','Снижение DSO'] },
          { pill:'ROI пилота', title:'Экономика 90-дневного пилота', labels:['AR / портфель в scope','Ожидаемое улучшение %','Стоимость пилота'], metrics:['Дополнительный кэш','Мультипликатор ROI'] }
        ],
        benefits: [
          ['Практическая ценность','Инструменты для executive-решений','Подают предложение как finance-led operating system, а не как обычный сервисный сайт.'],
          ['Качество лидов','Самоквалификация до консультации','Лучше вводные данные, сильнее звонки, меньше слабых заявок.'],
          ['Доверие','Позиционирование через метрики','Показывает, что VitaCoreX мыслит через контроль, экономику и результаты внедрения.']
        ],
        kpis:['Цель по чистому возврату','Снижение agency fees','Окно доказательств пилота'],
        module:['B2B-консалтинговая структура','Для операторов, которым нужно навести порядок до роста внешних расходов.','Запросить операционный разбор','Открыть материалы для руководства']
      }
    },
    es: {
      marketFallback: 'El bloque de mercado no está disponible temporalmente. La recuperación de ingresos sigue siendo uno de los mayores impulsores de caja controlables para operadores multi-sede.',
      widgets: {
        eyebrow: 'Herramientas ejecutivas',
        title: 'Herramientas interactivas que vuelven la oferta más clara, creíble y fácil de evaluar.',
        intro: 'Estos módulos ayudan a operadores, CFOs y decisores a cuantificar fuga, impacto en capital de trabajo y economía del piloto antes de solicitar una consulta.',
        cards: [
          { pill:'CFO', title:'Calculadora de fuga de ingresos', labels:['Ingresos anuales','Responsabilidad del paciente / cliente %','Porcentaje de fuga de recuperación %'], metrics:['Caja oculta estimada','Uso ejecutivo'] },
          { pill:'Velocidad de caja', title:'Simulador de impacto en DSO', labels:['Ingresos anuales','DSO actual','DSO objetivo'], metrics:['Capital de trabajo liberado','Reducción de DSO'] },
          { pill:'ROI piloto', title:'Economía del piloto de 90 días', labels:['AR / cartera en alcance','Mejora esperada %','Costo del piloto'], metrics:['Caja adicional','Múltiplo ROI'] }
        ],
        benefits: [
          ['Utilidad ejecutiva','Herramientas para decisión','Presentan la oferta como un sistema operativo guiado por finanzas y no como un folleto genérico.'],
          ['Calidad del lead','Auto-calificación antes de la consulta','Mejores inputs, llamadas más sólidas y menos consultas débiles.'],
          ['Confianza','Posicionamiento guiado por métricas','Demuestra que VitaCoreX piensa en controles, economía y resultados de implementación.']
        ],
        kpis:['Objetivo de recuperación neta','Evasión de fees de agencia','Ventana de evidencia del piloto'],
        module:['Estructura consultiva B2B','Para operadores que necesitan una ejecución más limpia antes de que crezca el costo externo.','Solicitar revisión operativa','Ver material ejecutivo']
      }
    }
  };

  function applyHardCopy(){
    const lang = vcxCurrentLang();
    const copy = hardCopy[lang] || hardCopy.en;
    const section = document.querySelector('.premium-widgets-section');
    if(section){
      const eyebrow = section.querySelector('.section-head .eyebrow');
      const title = section.querySelector('.section-head h2');
      const intro = section.querySelector('.section-head .section-intro');
      if(eyebrow) eyebrow.textContent = copy.widgets.eyebrow;
      if(title) title.textContent = copy.widgets.title;
      if(intro) intro.textContent = copy.widgets.intro;

      section.querySelectorAll('.widget-card').forEach((card, idx)=>{
        const cfg = copy.widgets.cards[idx];
        if(!cfg) return;
        const pill = card.querySelector('.pill');
        const h3 = card.querySelector('h3');
        if(pill) pill.textContent = cfg.pill;
        if(h3) h3.textContent = cfg.title;
        card.querySelectorAll('.widget-form label').forEach((labelEl, lidx)=>{
          const input = labelEl.querySelector('input');
          if(input){
            const labelText = cfg.labels[lidx] || labelEl.childNodes[0]?.textContent || '';
            labelEl.childNodes[0].textContent = labelText;
          }
        });
        card.querySelectorAll('.metric-card span').forEach((span, midx)=>{ span.textContent = cfg.metrics[midx] || span.textContent; });
      });

      section.querySelectorAll('.benefit-card').forEach((card, idx)=>{
        const cfg = copy.widgets.benefits[idx];
        if(!cfg) return;
        const kicker = card.querySelector('.benefit-kicker');
        const strong = card.querySelector('strong');
        const p = card.querySelector('p');
        if(kicker) kicker.textContent = cfg[0];
        if(strong) strong.textContent = cfg[1];
        if(p) p.textContent = cfg[2];
      });
    }

    document.querySelectorAll('#luxuryMetrics .kpi-label').forEach((el, idx)=>{
      el.textContent = copy.widgets.kpis[idx] || el.textContent;
    });

    const module = document.querySelector('.premium-module');
    if(module){
      const eyebrow = module.querySelector('.eyebrow');
      const title = module.querySelector('h2');
      const buttons = module.querySelectorAll('.cta-row a');
      if(eyebrow) eyebrow.textContent = copy.widgets.module[0];
      if(title) title.textContent = copy.widgets.module[1];
      if(buttons[0]) buttons[0].textContent = copy.widgets.module[2];
      if(buttons[1]) buttons[1].textContent = copy.widgets.module[3];
    }

  }

  function ensureTradingViewFallback(){
    const lang = vcxCurrentLang();
    const copy = hardCopy[lang] || hardCopy.en;
    const target = document.querySelector('.tradingview-widget-container__widget');
    if(!target) return;
    setTimeout(()=>{
      const hasRenderableChild = Array.from(target.children).some(el => !(el.classList && el.classList.contains('widget-fallback')));
      const hasIframe = !!target.querySelector('iframe');
      if(hasRenderableChild || hasIframe) return;
      if(target.querySelector('.widget-fallback')) return;
      const msg = document.createElement('div');
      msg.className = 'widget-fallback';
      msg.textContent = copy.marketFallback;
      target.appendChild(msg);
      target.setAttribute("aria-live","polite");
    }, 2200);
  }

  function bindLangRefresh(){
    document.querySelectorAll('.lang-btn').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        setTimeout(()=>{
          applyHardCopy();
          ensureTradingViewFallback();
        }, 20);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    applyHardCopy();
    ensureTradingViewFallback();
    bindLangRefresh();
  });
})();


(function(){
  function currentLang(){
    const saved = localStorage.getItem('vcx_lang');
    return ['en','ru','es'].includes(saved) ? saved : 'en';
  }
  const v52Copy = {
    en:{
      eyebrow:'Institutional authority',
      title:'Operator advisory infrastructure for revenue recovery, legal file control, and disciplined execution.',
      intro:'Designed for complex operators that need stronger documentation, cleaner escalation pathways, and a more credible operating model before outside legal and agency cost expands.',
      profiles_pill:'Operator profiles',
      profiles_title:'Where VitaCoreX operates',
      profiles_intro:'We support organizations managing contractual complexity across multiple operating environments.',
      profile_1:'Healthcare operators',
      profile_2:'Fleet and fuel-card programs',
      profile_3:'Subscription platforms',
      profile_4:'Multi-location service networks',
      profile_5:'Contract-based commercial portfolios',
      governance_pill:'Governance',
      governance_title:'Documentation control that supports finance, compliance, and external counsel',
      governance_intro:'VitaCoreX structures files, payment documentation, and escalation records so legal strategy is not burdened with administrative cleanup.',
      gov_1:'Auditable file structure and evidence packaging',
      gov_2:'Payment-plan documentation and authorization control',
      gov_3:'Paralegal-grade preparation under consulting engagements',
      gov_4:'Cleaner handoff to outside counsel when escalation is necessary',
      calc_pill:'Executive impact',
      calc_title:'Estimate your revenue recovery impact',
      calc_label_1:'Annual revenue',
      calc_label_2:'Receivable portfolio in scope',
      calc_label_3:'Current recovery rate %',
      calc_metric_1:'Potential additional cash recovered',
      calc_metric_2:'Estimated contingency fees avoided',
      calc_metric_3:'Illustrative recovery lift',
      case_pill:'Illustrative operator case',
      case_title:'How an institutional advisory engagement is framed',
      case_stat_1:'Annual revenue operator',
      case_stat_2:'Receivable portfolio',
      case_stat_3:'Illustrative DSO improvement',
      case_1:'Recovery improvement target aligned to pilot economics and workflow discipline.',
      case_2:'Agency placements reduced through earlier structured conversion and better file control.',
      case_3:'External counsel receives cleaner, more usable documentation when escalation is warranted.',
      case_cta:'Review your operating model'
    },
    ru:{
      eyebrow:'Институциональный уровень',
      title:'Advisory-инфраструктура для возврата выручки, управления legal files и дисциплинированного исполнения.',
      intro:'Секция для сложных операторов, которым нужны более сильная документация, более чистые пути эскалации и более убедительная operating model до роста внешних юридических и agency-расходов.',
      profiles_pill:'Профили операторов',
      profiles_title:'Где работает VitaCoreX',
      profiles_intro:'Мы поддерживаем организации, управляющие сложными контрактными потоками в разных операционных средах.',
      profile_1:'Healthcare-операторы',
      profile_2:'Fleet и fuel-card программы',
      profile_3:'Subscription-платформы',
      profile_4:'Сетевые сервисные компании',
      profile_5:'Коммерческие портфели на договорной основе',
      governance_pill:'Governance',
      governance_title:'Контроль документации для finance, compliance и внешнего counsel',
      governance_intro:'VitaCoreX структурирует файлы, платёжную документацию и records по эскалации так, чтобы юридическая стратегия не тратилась на административный cleanup.',
      gov_1:'Аудируемая структура файлов и packaging доказательств',
      gov_2:'Контроль документации payment plans и authorizations',
      gov_3:'Paralegal-level подготовка в рамках consulting engagements',
      gov_4:'Более чистый handoff внешнему counsel при необходимости эскалации',
      calc_pill:'Executive impact',
      calc_title:'Оцените потенциальный эффект для возврата выручки',
      calc_label_1:'Годовая выручка',
      calc_label_2:'Портфель дебиторки в scope',
      calc_label_3:'Текущий recovery rate %',
      calc_metric_1:'Потенциальный дополнительный кэш',
      calc_metric_2:'Оценка избежанных contingency fees',
      calc_metric_3:'Иллюстративный прирост recovery',
      case_pill:'Иллюстративный кейс оператора',
      case_title:'Как выглядит institutional advisory engagement',
      case_stat_1:'Оператор с годовой выручкой',
      case_stat_2:'Портфель дебиторки',
      case_stat_3:'Иллюстративное улучшение DSO',
      case_1:'Цель по recovery привязана к экономике пилота и дисциплине workflow.',
      case_2:'Передача в agency снижается за счёт более ранней структурированной конверсии и лучшего file control.',
      case_3:'Внешний counsel получает более чистую и пригодную документацию, когда эскалация действительно нужна.',
      case_cta:'Разобрать вашу operating model'
    },
    es:{
      eyebrow:'Autoridad institucional',
      title:'Infraestructura advisory para recuperación de ingresos, control de expedientes legales y ejecución disciplinada.',
      intro:'Diseñado para operadores complejos que necesitan documentación más sólida, rutas de escalamiento más limpias y un modelo operativo más creíble antes de que aumenten los costos legales y de agencias.',
      profiles_pill:'Perfiles de operador',
      profiles_title:'Dónde opera VitaCoreX',
      profiles_intro:'Apoyamos a organizaciones que gestionan complejidad contractual en múltiples entornos operativos.',
      profile_1:'Operadores de salud',
      profile_2:'Programas de flota y fuel-card',
      profile_3:'Plataformas de suscripción',
      profile_4:'Redes de servicios multi-sede',
      profile_5:'Portafolios comerciales basados en contratos',
      governance_pill:'Gobernanza',
      governance_title:'Control documental que respalda finanzas, compliance y asesoría externa',
      governance_intro:'VitaCoreX estructura expedientes, documentación de pago y registros de escalamiento para que la estrategia legal no se cargue con limpieza administrativa.',
      gov_1:'Estructura auditable de expedientes y paquetes de evidencia',
      gov_2:'Control de documentación y autorizaciones de planes de pago',
      gov_3:'Preparación tipo paralegal bajo contratos de consultoría',
      gov_4:'Transferencia más limpia a abogados externos cuando el escalamiento es necesario',
      calc_pill:'Impacto ejecutivo',
      calc_title:'Estime su impacto de recuperación de ingresos',
      calc_label_1:'Ingresos anuales',
      calc_label_2:'Portafolio de cuentas por cobrar en alcance',
      calc_label_3:'Tasa actual de recuperación %',
      calc_metric_1:'Caja adicional potencial recuperada',
      calc_metric_2:'Comisiones de contingencia evitadas estimadas',
      calc_metric_3:'Mejora ilustrativa de recuperación',
      case_pill:'Caso ilustrativo de operador',
      case_title:'Cómo se estructura un engagement de advisory institucional',
      case_stat_1:'Operador de ingresos anuales',
      case_stat_2:'Portafolio de cuentas por cobrar',
      case_stat_3:'Mejora ilustrativa de DSO',
      case_1:'La mejora de recuperación se alinea con la economía del piloto y la disciplina del flujo de trabajo.',
      case_2:'Las derivaciones a agencia se reducen mediante conversión estructurada temprana y mejor control de expedientes.',
      case_3:'La asesoría externa recibe documentación más limpia y utilizable cuando el escalamiento lo justifica.',
      case_cta:'Revisar su modelo operativo'
    }
  };

  function applyV52Copy(){
    const lang = currentLang();
    const copy = v52Copy[lang] || v52Copy.en;
    document.querySelectorAll('[data-v52]').forEach(el=>{
      const key = el.getAttribute('data-v52');
      if(copy[key]) el.textContent = copy[key];
      if(el.tagName === 'LABEL'){
        const input = el.querySelector('input');
        if(input && el.firstChild && el.firstChild.nodeType === Node.TEXT_NODE){
          el.firstChild.textContent = copy[key] || el.firstChild.textContent;
        }
      }
    });
  }

  function fmtUSD(num){
    const n = Number(num) || 0;
    return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
  }

  
function initFloatingDockBehavior(){
  const dock=document.querySelector('.floating-contact-dock');
  if(!dock) return;
  let lastY=window.scrollY||0;
  const update=()=>{
    const y=window.scrollY||0;
    if(window.innerWidth<=900){
      dock.classList.toggle('dock-compact', y>220);
      dock.classList.toggle('dock-hidden', y<80);
    } else {
      dock.classList.remove('dock-compact','dock-hidden');
    }
    lastY=y;
  };
  update();
  window.addEventListener('scroll', update, {passive:true});
  window.addEventListener('resize', update);
}

function initV52ImpactCalc(){
    const revenue = document.getElementById('impactRevenue');
    const portfolio = document.getElementById('impactPortfolio');
    const recovery = document.getElementById('impactRecovery');
    const outAdditional = document.getElementById('impactAdditional');
    const outAvoided = document.getElementById('impactAvoided');
    const outLift = document.getElementById('impactLift');
    if(!revenue || !portfolio || !recovery || !outAdditional || !outAvoided || !outLift) return;
    const calc = ()=>{
      const rev = Math.max(0, Number(revenue.value) || 0);
      const port = Math.max(0, Number(portfolio.value) || 0);
      const base = Math.min(100, Math.max(0, Number(recovery.value) || 0))/100;
      const uplift = 0.13;
      const additional = Math.max(0, port * uplift);
      const avoided = Math.max(0, additional * 0.30);
      outAdditional.textContent = fmtUSD(additional);
      outAvoided.textContent = fmtUSD(avoided);
      outLift.textContent = Math.round(uplift * 100) + '%';
      if(rev && port > rev*0.6){
        portfolio.value = Math.round(rev*0.13);
      }
      if(base > 0.5){
        outLift.textContent = '6%';
      }
    };
    [revenue,portfolio,recovery].forEach(el=>{
      el.addEventListener('input', calc);
      el.addEventListener('change', calc);
    });
    calc();
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    applyV52Copy();
    initV52ImpactCalc();
    document.querySelectorAll('.lang-btn').forEach(btn=>{
      btn.addEventListener('click', ()=>setTimeout(applyV52Copy,20));
    });
  });

  initFloatingDockBehavior();
})();


(function(){
  const nfUsd = new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0});
  const matters = document.getElementById('legalMatters');
  const hours = document.getElementById('legalHours');
  const rate = document.getElementById('legalRate');
  const dragOut = document.getElementById('legalDragOutput');
  function calcLegalDrag(){
    if(!matters || !hours || !rate || !dragOut) return;
    const m = parseFloat(matters.value || 0);
    const h = parseFloat(hours.value || 0);
    const r = parseFloat(rate.value || 0);
    const annual = m * h * r * 12;
    dragOut.textContent = nfUsd.format(isFinite(annual)?annual:0);
  }
  [matters,hours,rate].forEach(el=>el && el.addEventListener('input',calcLegalDrag));
  calcLegalDrag();

  const readyInputs = ['readyChronology','readyExhibits','readySupport','readyEscalation']
    .map(id=>document.getElementById(id))
    .filter(Boolean);
  const readyScoreOut = document.getElementById('readyScoreOutput');
  const readyStatusOut = document.getElementById('readyStatusOutput');
  const readyFill = document.getElementById('readyMeterFill');
  function calcReadiness(){
    if(!readyInputs.length || !readyScoreOut || !readyStatusOut || !readyFill) return;
    const score = readyInputs.reduce((a,el)=>a + parseFloat(el.value || 0), 0) / readyInputs.length;
    const rounded = Math.round(score);
    readyScoreOut.textContent = rounded + '%';
    readyFill.style.width = rounded + '%';
    let status = 'Foundational cleanup required';
    if(rounded >= 80) status = 'Counsel-ready trajectory';
    else if(rounded >= 65) status = 'Structured but improvable';
    readyStatusOut.textContent = status;
  }
  readyInputs.forEach(el=>el.addEventListener('input',calcReadiness));
  calcReadiness();
})();


(function(){
  const btn=document.getElementById('liEvaluate');
  const box=document.getElementById('liResult');
  if(!btn || !box) return;
  btn.addEventListener('click', function(){
    const revenue=Number((document.getElementById('liRevenue')||{}).value||1);
    const portfolio=Number((document.getElementById('liPortfolio')||{}).value||1);
    const pain=((document.getElementById('liPain')||{}).value)||'workflow';
    const industry=((document.getElementById('liIndustry')||{}).value)||'services';
    let score = revenue + portfolio + (pain==='counsel' || pain==='agency' ? 2 : 1);
    let tier = score >= 8 ? 'High-priority operator review' : score >= 6 ? 'Structured diagnostic review' : 'Initial workflow assessment';
    let focus = {
      workflow:'workflow sequencing, outreach cadence, and KPI visibility',
      docs:'documentation governance, chronology, and file readiness',
      agency:'pre-agency control, fee leakage reduction, and escalation logic',
      counsel:'file-control infrastructure, attorney cleanup reduction, and counsel support'
    }[pain];
    let sector = {
      healthcare:'Healthcare and dental operators usually benefit from earlier payment commitment conversion and cleaner patient-balance controls.',
      fleet:'Fleet and fuel portfolios usually benefit from guaranty discipline, ACH control, and faster escalation governance.',
      subscription:'Subscription platforms usually benefit from stronger documentation, autopay discipline, and cleaner exception handling.',
      services:'Multi-location service operators usually benefit from standardized workflows and location-level governance.'
    }[industry];
    box.innerHTML = '<strong>'+tier+'</strong><p>Suggested focus: <b>'+focus+'</b>. '+sector+' Recommended next step: schedule a strategy consultation and review the current portfolio, file condition, and implementation scope.</p>';
  });
})();


(function(){
  const money=(n)=>'$'+Math.round(n).toLocaleString();
  const byId=(id)=>document.getElementById(id);

  const roiBtn=byId('roiCalculate');
  if(roiBtn){
    roiBtn.addEventListener('click', function(){
      const revenue=parseFloat(byId('roiRevenue').value||0);
      const portfolio=parseFloat(byId('roiPortfolio').value||0);
      const currentRate=parseFloat(byId('roiRate').value||0)/100;
      const agencyFee=parseFloat(byId('roiAgencyFee').value||0)/100;

      const uplift=0.13;
      const improvedRate=Math.min(currentRate + uplift, 0.92);
      const baselineCash=portfolio*currentRate;
      const improvedCash=portfolio*improvedRate;
      const additional=Math.max(improvedCash-baselineCash,0);
      const avoided=additional*agencyFee;
      const dsoGain=Math.max(3, Math.min(12, Math.round((portfolio/(Math.max(revenue,1)))*28)));

      byId('roiAdditional').textContent=money(additional);
      byId('roiAvoided').textContent=money(avoided);
      byId('roiDso').textContent=dsoGain+' days';
      byId('roiBaseBar').style.width=Math.max(12,currentRate*100)+'%';
      byId('roiImprovedBar').style.width=Math.max(18,improvedRate*100)+'%';
      const box=byId('roiResult');
      if(box){
        box.innerHTML='<strong>Illustrative impact</strong><p>Based on the inputs provided, a structured recovery layer could directionally improve retained cash by <b>'+money(additional)+'</b>, avoid approximately <b>'+money(avoided)+'</b> in contingency leakage, and support a potential <b>'+dsoGain+'-day</b> improvement in cash velocity. Use a pilot to validate actual portfolio performance.</p>';
      }
    });
  }

  const diagBtn=byId('diagEvaluate');
  if(diagBtn){
    diagBtn.addEventListener('click', function(){
      const industry=byId('diagIndustry').value;
      const complexity=byId('diagComplexity').value;
      const docs=byId('diagDocs').value;
      const pain=byId('diagPain').value;
      let recommendation='Begin with recovery infrastructure review.';
      if((docs==='weak' && pain==='counsel') || (docs==='weak' && complexity!=='standard')){
        recommendation='Begin with corporate legal file control and documentation governance.';
      }
      if((pain==='recovery' && complexity!=='standard' && docs!=='structured') || (pain==='agency' && complexity==='critical')){
        recommendation='Run a combined 90-day pilot covering recovery workflow and legal file control.';
      }
      const sectorMap={
        healthcare:'Healthcare and dental operators usually benefit from earlier patient-balance conversion, cleaner payment documentation, and stronger escalation discipline.',
        fleet:'Fleet, fuel, and logistics operators usually benefit from guaranty discipline, ACH governance, and faster contract-file readiness.',
        subscription:'Subscription platforms usually benefit from cleaner autopay logic, exception routing, and stronger documentation before enforcement.',
        services:'Multi-location service operators usually benefit from standardized workflows and file governance across locations.'
      };
      const box=byId('diagResult');
      if(box){
        box.innerHTML='<strong>'+recommendation+'</strong><p>'+sectorMap[industry]+' This profile suggests prioritizing '+(pain==='counsel'?'documentation control and counsel support':'cash-conversion workflow discipline')+' before external costs escalate further.</p>';
      }
    });
  }

  const legalBtn=byId('legalCalc');
  if(legalBtn){
    legalBtn.addEventListener('click', function(){
      const files=parseFloat(byId('legalFiles').value||0);
      const rate=parseFloat(byId('legalRate').value||0);
      const hours=parseFloat(byId('legalHours').value||0);
      const exposure=files*rate*hours;
      const totalHours=files*hours;
      byId('legalExposure').textContent=money(exposure);
      byId('legalExposureHours').textContent=Math.round(totalHours).toLocaleString()+' hrs';
      const box=byId('legalResult');
      if(box){
        box.innerHTML='<strong>Illustrative exposure</strong><p>At the current assumptions, administrative file cleanup may absorb <b>'+money(exposure)+'</b> in annual attorney time across approximately <b>'+Math.round(totalHours).toLocaleString()+' hours</b>. Stronger documentation infrastructure can reduce this burden before outside review begins.</p>';
      }
    });
  }
})();
