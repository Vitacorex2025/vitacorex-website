
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
order_services:'Order Services',clock_local_sub:'Local',services_individuals_title:'Selected Individual Services',services_individuals_intro:'Selected private-client matters remain available on a limited basis. Corporate advisory remains the primary VitaCoreX platform.',request_review:'Request review',see_all_individuals:'Review selected individual services',res1_title:'Healthcare leakage brief',res1_desc:'Operator-facing summary of leakage points, DSO drag, and early agency fee compression.',res1_tag:'Operator brief',res2_title:'Healthcare CFO brief',res2_desc:'Finance-facing brief for owners, CFOs, and operator leadership.',res2_tag:'CFO decision brief',res3_title:'Dental institutional deck',res3_desc:'Institutional framing with pilot economics, sequencing logic, and executive review.',res3_tag:'Institutional deck',res4_title:'Pre-collection executive review',res4_desc:'Framework logic, controlled escalation, and economics for pre-agency sequencing.',res4_tag:'Executive review',counter_quality:'Packet quality signal',counter_clarity:'Handoff clarity signal',counter_control:'Recovery control signal',counter_pressure:'Illustrative leakage pressure',counter_adoption:'ALSP operating adoption',counter_window:'Pilot design window',ind1_title:'Contracts & Documentation',ind1_desc:'Administrative support for contract drafting, document review, business forms, demand letters, and structured support packets.',ind1_b1:'Contract drafting',ind1_b2:'Document review',ind1_b3:'Business forms',ind1_b4:'Demand letters',ind1_b5:'Support packets',ind2_title:'Immigration Documents',ind2_desc:'Packet organization, form guidance, submission-readiness review, and evidence structuring for personal filing support.',ind2_b1:'Packet organization',ind2_b2:'Form guidance',ind2_b3:'Submission review',ind2_b4:'Evidence structuring',ind2_b5:'Administrative support',ind3_title:'Auto Purchase Review',ind3_desc:'Buyer-side review before signing, with fee analysis, payment-structure clarity, and negotiation support.',ind3_b1:'Dealer contract review',ind3_b2:'Fee analysis',ind3_b3:'Payment review',ind3_b4:'Negotiation support',ind3_b5:'Risk summary',ind4_title:'Business Plans',ind4_desc:'Executive summary, investor narrative, launch plan, financial framing, and pitch support.',ind4_b1:'Executive summary',ind4_b2:'Investor narrative',ind4_b3:'Launch plan',ind4_b4:'Financial framing',ind4_b5:'Pitch support',ind5_title:'Company Formation',ind5_desc:'Structured support for opening companies, entity setup, filing packets, and launch-readiness documents.',ind5_b1:'Entity formation support',ind5_b2:'Opening packages',ind5_b3:'Filing support',ind5_b4:'Business setup packet',ind5_b5:'Launch checklist',ind6_title:'Translation & Localization',ind6_desc:'Translation support, bilingual document cleanup, and structured localization for business or filing materials.',ind6_b1:'Document translation support',ind6_b2:'Bilingual cleanup',ind6_b3:'Localization review',ind6_b4:'Evidence translation pack',ind6_b5:'Administrative coordination',field_phone_careers:'Phone',field_role:'Role of interest',select_role:'Select role',role_ops:'Operations support',role_docs:'Documentation support',role_intake:'Intake support',role_translation:'Translation support',role_admin:'Admin support',role_client:'Client coordination',field_background:'Short background',careers_placeholder:'Short introduction, role of interest, and the kind of work you can support.',careers_helper:'Complete all required fields to route the application for review.',careers_who_title:'Who we look for',careers_apply_title:'How to apply',careers_t1:'Disciplined candidates who can work in a documentation-first operating model.',careers_t2:'Strong and confident English.',careers_t3:'Verifiable recommendations strongly preferred.',careers_t4:'Preference for Russian-speaking candidates with excellent English.',field_need:'Primary need',field_urgency:'Urgency',field_docs:'Document readiness',field_company_context:'Company / matter context',field_company_context_ph:'Company, packet, contract, invoice',intake_placeholder:'Describe the matter, the business context, and the decision that is blocked.',attach_materials:'Attach materials',attach_helper:'Add contracts, invoices, screenshots, exhibits, or packet drafts.',need_recovery:'Revenue Recovery Workflow Design',need_file:'Corporate Legal File Control',need_intake:'Structured Case Intake & Packet Build',urgency_standard:'Standard',urgency_high:'High',docs_ready:'Core documents are ready',docs_partial:'Only partial material is ready',next_standard:'We will review the intake and propose the first clean work product.',next_fast:'We will prioritize the intake and route the next-step memo first'},
 ru:{order_services:'Заказать услуги',clock_local_sub:'Локально',services_individuals_title:'Услуги для физических лиц',services_individuals_intro:'Избранные private-client запросы остаются доступными в ограниченном формате. Корпоративный advisory остаётся основной платформой VitaCoreX.',request_review:'Запросить разбор',see_all_individuals:'Смотреть все услуги для физических лиц',res1_title:'Обзор точек утечки в healthcare',res1_desc:'Краткий материал для операторов о точках утечки, давлении на DSO и раннем сжатии комиссии агентств.',res1_tag:'Материал для операторов',res2_title:'CFO brief для healthcare',res2_desc:'Материал для owners, CFOs и операционного руководства с финансовым ракурсом.',res2_tag:'Материал для CFO',res3_title:'Институциональный deck для dental',res3_desc:'Институциональная подача с логикой пилота, sequencing и executive review.',res3_tag:'Институциональный deck',res4_title:'Executive review по pre-collection',res4_desc:'Логика controlled escalation и экономика pre-agency sequencing.',res4_tag:'Executive review',counter_quality:'Сигнал качества пакета',counter_clarity:'Сигнал ясности handoff',counter_control:'Сигнал контроля возврата',counter_pressure:'Иллюстративное давление утечек',counter_adoption:'Операционный сигнал adoption',counter_window:'Окно проектирования пилота',ind1_title:'Договоры и документы',ind1_desc:'Административная поддержка по подготовке договоров, проверке документов, бизнес-форм и demand letters.',ind1_b1:'Подготовка договоров',ind1_b2:'Проверка документов',ind1_b3:'Бизнес-формы',ind1_b4:'Demand letters',ind1_b5:'Пакеты поддержки',ind2_title:'Иммиграционные документы',ind2_desc:'Организация пакета, сопровождение по формам, проверка готовности к подаче и структурирование доказательств.',ind2_b1:'Организация пакета',ind2_b2:'Сопровождение по формам',ind2_b3:'Проверка готовности к подаче',ind2_b4:'Структурирование доказательств',ind2_b5:'Административная поддержка',ind3_title:'Проверка покупки автомобиля',ind3_desc:'Проверка сделки до подписания: анализ fee, логики платежей и поддержка переговоров.',ind3_b1:'Проверка дилерского контракта',ind3_b2:'Анализ fee',ind3_b3:'Проверка платежной структуры',ind3_b4:'Поддержка переговоров',ind3_b5:'Краткое резюме рисков',ind4_title:'Бизнес-планы',ind4_desc:'Executive summary, investor narrative, launch plan, финансовая рамка и поддержка pitch.',ind4_b1:'Executive summary',ind4_b2:'Investor narrative',ind4_b3:'План запуска',ind4_b4:'Финансовая рамка',ind4_b5:'Поддержка pitch',ind5_title:'Открытие компаний',ind5_desc:'Структурированная помощь по запуску компании, пакетам открытия, filing и стартовым документам.',ind5_b1:'Поддержка по формированию компании',ind5_b2:'Пакеты открытия',ind5_b3:'Поддержка filing',ind5_b4:'Стартовый бизнес-пакет',ind5_b5:'Launch checklist',ind6_title:'Перевод и локализация',ind6_desc:'Поддержка перевода документов, билингвальная вычитка и локализация материалов для бизнеса и подачи.',ind6_b1:'Поддержка перевода документов',ind6_b2:'Билингвальная вычитка',ind6_b3:'Проверка локализации',ind6_b4:'Пакет перевода доказательств',ind6_b5:'Административная координация',field_phone_careers:'Телефон',field_role:'Интересующая роль',select_role:'Выберите роль',role_ops:'Операционная поддержка',role_docs:'Документационная поддержка',role_intake:'Поддержка intake',role_translation:'Поддержка перевода',role_admin:'Административная поддержка',role_client:'Координация с клиентами',field_background:'Краткая информация о вас',careers_placeholder:'Коротко представьтесь, укажите интересующую роль и чем именно вы можете быть полезны.',careers_helper:'Заполните все обязательные поля, чтобы направить заявку на рассмотрение.',careers_who_title:'Кого мы ищем',careers_apply_title:'Как откликнуться',careers_t1:'Дисциплинированных кандидатов, способных работать в documentation-first модели.',careers_t2:'Уверенный английский.',careers_t3:'Подтверждаемые рекомендации крайне желательны.',careers_t4:'Предпочтение кандидатам с русским языком и сильным английским.',field_need:'Основной запрос',field_urgency:'Срочность',field_docs:'Готовность документов',field_company_context:'Компания / контекст задачи',field_company_context_ph:'Компания, пакет, договор, счёт',intake_placeholder:'Опишите задачу, деловой контекст и решение, которое сейчас заблокировано.',
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
 es:{order_services:'Solicitar servicio',clock_local_sub:'Local',services_individuals_title:'Servicios para individuos',services_individuals_intro:'Los asuntos privados seleccionados siguen disponibles de forma limitada. La asesoría corporativa sigue siendo la plataforma principal de VitaCoreX.',request_review:'Solicitar revisión',see_all_individuals:'Ver todos los servicios para individuos',res1_title:'Brief de fugas en healthcare',res1_desc:'Resumen para operadores sobre puntos de fuga, presión sobre DSO y compresión temprana de comisiones de agencia.',res1_tag:'Brief para operadores',res2_title:'Brief para CFO en healthcare',res2_desc:'Documento con enfoque financiero para owners, CFOs y liderazgo operativo.',res2_tag:'Brief para CFO',res3_title:'Deck institucional dental',res3_desc:'Presentación institucional con economía del piloto, lógica de secuencia y revisión ejecutiva.',res3_tag:'Deck institucional',res4_title:'Revisión ejecutiva pre-collection',res4_desc:'Lógica de escalación controlada y economía para secuencia pre-agencia.',res4_tag:'Revisión ejecutiva',counter_quality:'Señal de calidad del paquete',counter_clarity:'Señal de claridad del handoff',counter_control:'Señal de control de recuperación',counter_pressure:'Presión ilustrativa de fugas',counter_adoption:'Adopción operativa ALSP',counter_window:'Ventana de diseño del piloto',ind1_title:'Contratos y documentación',ind1_desc:'Soporte administrativo para redacción de contratos, revisión documental, formularios de negocio y cartas de demanda.',ind1_b1:'Redacción de contratos',ind1_b2:'Revisión de documentos',ind1_b3:'Formularios de negocio',ind1_b4:'Cartas de demanda',ind1_b5:'Paquetes de soporte',ind2_title:'Documentos migratorios',ind2_desc:'Organización del paquete, guía de formularios, revisión previa a la presentación y estructuración de evidencia.',ind2_b1:'Organización del paquete',ind2_b2:'Guía de formularios',ind2_b3:'Revisión previa a envío',ind2_b4:'Estructuración de evidencia',ind2_b5:'Soporte administrativo',ind3_title:'Revisión de compra de auto',ind3_desc:'Revisión del lado del comprador antes de firmar, con análisis de cargos, pagos y apoyo de negociación.',ind3_b1:'Revisión de contrato del dealer',ind3_b2:'Análisis de cargos',ind3_b3:'Revisión de pagos',ind3_b4:'Apoyo de negociación',ind3_b5:'Resumen de riesgos',ind4_title:'Planes de negocio',ind4_desc:'Resumen ejecutivo, narrativa para inversionistas, plan de lanzamiento, marco financiero y apoyo para pitch.',ind4_b1:'Resumen ejecutivo',ind4_b2:'Narrativa para inversionistas',ind4_b3:'Plan de lanzamiento',ind4_b4:'Marco financiero',ind4_b5:'Apoyo para pitch',ind5_title:'Formación de empresas',ind5_desc:'Soporte estructurado para abrir compañías, paquetes de constitución, filings y documentos de lanzamiento.',ind5_b1:'Soporte de formación',ind5_b2:'Paquetes de apertura',ind5_b3:'Soporte de filing',ind5_b4:'Paquete de puesta en marcha',ind5_b5:'Checklist de lanzamiento',ind6_title:'Traducción y localización',ind6_desc:'Soporte de traducción documental, limpieza bilingüe y localización estructurada para materiales de negocio o filing.',ind6_b1:'Soporte de traducción documental',ind6_b2:'Limpieza bilingüe',ind6_b3:'Revisión de localización',ind6_b4:'Paquete de traducción de evidencia',ind6_b5:'Coordinación administrativa',field_phone_careers:'Teléfono',field_role:'Rol de interés',select_role:'Selecciona un rol',role_ops:'Soporte operativo',role_docs:'Soporte documental',role_intake:'Soporte de intake',role_translation:'Soporte de traducción',role_admin:'Soporte administrativo',role_client:'Coordinación con clientes',field_background:'Breve experiencia',careers_placeholder:'Preséntate brevemente, indica el rol de interés y el tipo de trabajo que puedes apoyar.',careers_helper:'Completa todos los campos obligatorios para enviar la postulación a revisión.',careers_who_title:'A quién buscamos',careers_apply_title:'Cómo aplicar',careers_t1:'Candidatos disciplinados que puedan trabajar en un modelo centrado en la documentación.',careers_t2:'Inglés sólido y seguro.',careers_t3:'Referencias verificables fuertemente preferidas.',careers_t4:'Preferencia por candidatos rusohablantes con excelente inglés.',field_need:'Necesidad principal',field_urgency:'Urgencia',field_docs:'Estado de documentos',field_company_context:'Empresa / contexto del asunto',field_company_context_ph:'Empresa, paquete, contrato, factura',intake_placeholder:'Describe el asunto, el contexto del negocio y la decisión que hoy está bloqueada.',
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
Object.assign(extra.en, {
 nav_companies:'For Companies',
 nav_recovery:'Revenue Recovery',
 nav_brief:'Executive Brief',
 nav_individuals:'For Individuals',
 nav_confidential:'Confidential Review',
 footer_companies_title:'For Companies',
 footer_individuals_title:'For Individuals',
 footer_careers_link:'Careers',
 cta_confidential_review:'Request confidential review',
 cta_strategy_call:'Schedule strategy call',
 cta_review_brief:'Review executive brief',
 cta_request_service:'Request service',
 cta_start_intake:'Start structured intake',
 dock_brief:'Executive Brief',
 dock_strategy:'Strategy Call',
 dock_companies:'Companies',
 dock_individuals:'Individuals',
 client_company:'Company',
 client_individual:'Individual',
 request_review:'Start structured intake',
 cta_briefs:'Review executive brief',
 footer_copy:'© 2026 VitaCoreX LLC. All rights reserved.',
 company_band_eyebrow:'For Companies',
 company_band_title:'Move from file uncertainty to a controlled next step.',
 company_band_body:'Use a confidential review to define the right workstream, the right packet, and the right executive action before outside cost expands.',
 individual_band_eyebrow:'For Individuals',
 individual_band_title:'Selected individual matters follow a separate structured path.',
 individual_band_body:'Use the individual-service intake when you need a selective private-client engagement without overtaking the corporate platform.',
 intake_company_eyebrow:'Confidential company review',
 intake_company_title:'Route the company matter into the right workstream before outside cost expands.',
 intake_company_lead:'Use this company review to identify the correct service line, the immediate document gaps, and the next executive step.',
 intake_company_side_title:'Company review output',
 intake_company_side_body:'Service line, file readiness, response window, and next-step routing are generated after submission.',
 intake_company_button:'Request confidential review',
 intake_individual_eyebrow:'Structured service request',
 intake_individual_title:'Start the selected individual-service intake with a cleaner first packet.',
 intake_individual_lead:'Use this intake to route the matter correctly, confirm what should be sent now, and keep the private-client path structured.',
 intake_individual_side_title:'Individual service output',
 intake_individual_side_body:'Service fit, document needs, response window, and next-step routing are updated as the intake is completed.',
 intake_individual_button:'Start structured intake',
 thank_company_cta:'Schedule strategy call',
 thank_individual_cta:'Start structured intake'
});
Object.assign(extra.ru, {
 nav_companies:'For Companies',
 nav_recovery:'Revenue Recovery',
 nav_brief:'Executive Brief',
 nav_individuals:'For Individuals',
 nav_confidential:'Confidential Review',
 footer_companies_title:'For Companies',
 footer_individuals_title:'For Individuals',
 footer_careers_link:'Careers',
 cta_confidential_review:'Request confidential review',
 cta_strategy_call:'Schedule strategy call',
 cta_review_brief:'Review executive brief',
 cta_request_service:'Request service',
 cta_start_intake:'Start structured intake',
 dock_brief:'Executive Brief',
 dock_strategy:'Strategy Call',
 dock_companies:'Companies',
 dock_individuals:'Individuals',
 client_company:'Company',
 client_individual:'Individual',
 request_review:'Start structured intake',
 cta_briefs:'Review executive brief',
 company_band_eyebrow:'For Companies',
 company_band_title:'Move from file uncertainty to a controlled next step.',
 company_band_body:'Use a confidential review to define the right workstream, the right packet, and the right executive action before outside cost expands.',
 individual_band_eyebrow:'For Individuals',
 individual_band_title:'Selected individual matters follow a separate structured path.',
 individual_band_body:'Use the individual-service intake when you need a selective private-client engagement without overtaking the corporate platform.',
 intake_company_eyebrow:'Confidential company review',
 intake_company_title:'Route the company matter into the right workstream before outside cost expands.',
 intake_company_lead:'Use this company review to identify the correct service line, the immediate document gaps, and the next executive step.',
 intake_company_side_title:'Company review output',
 intake_company_side_body:'Service line, file readiness, response window, and next-step routing are generated after submission.',
 intake_company_button:'Request confidential review',
 intake_individual_eyebrow:'Structured service request',
 intake_individual_title:'Start the selected individual-service intake with a cleaner first packet.',
 intake_individual_lead:'Use this intake to route the matter correctly, confirm what should be sent now, and keep the private-client path structured.',
 intake_individual_side_title:'Individual service output',
 intake_individual_side_body:'Service fit, document needs, response window, and next-step routing are updated as the intake is completed.',
 intake_individual_button:'Start structured intake',
 thank_company_cta:'Schedule strategy call',
 thank_individual_cta:'Start structured intake'
});
Object.assign(extra.es, {
 nav_companies:'For Companies',
 nav_recovery:'Revenue Recovery',
 nav_brief:'Executive Brief',
 nav_individuals:'For Individuals',
 nav_confidential:'Confidential Review',
 footer_companies_title:'For Companies',
 footer_individuals_title:'For Individuals',
 footer_careers_link:'Careers',
 cta_confidential_review:'Request confidential review',
 cta_strategy_call:'Schedule strategy call',
 cta_review_brief:'Review executive brief',
 cta_request_service:'Request service',
 cta_start_intake:'Start structured intake',
 dock_brief:'Executive Brief',
 dock_strategy:'Strategy Call',
 dock_companies:'Companies',
 dock_individuals:'Individuals',
 client_company:'Company',
 client_individual:'Individual',
 request_review:'Start structured intake',
 cta_briefs:'Review executive brief',
 company_band_eyebrow:'For Companies',
 company_band_title:'Move from file uncertainty to a controlled next step.',
 company_band_body:'Use a confidential review to define the right workstream, the right packet, and the right executive action before outside cost expands.',
 individual_band_eyebrow:'For Individuals',
 individual_band_title:'Selected individual matters follow a separate structured path.',
 individual_band_body:'Use the individual-service intake when you need a selective private-client engagement without overtaking the corporate platform.',
 intake_company_eyebrow:'Confidential company review',
 intake_company_title:'Route the company matter into the right workstream before outside cost expands.',
 intake_company_lead:'Use this company review to identify the correct service line, the immediate document gaps, and the next executive step.',
 intake_company_side_title:'Company review output',
 intake_company_side_body:'Service line, file readiness, response window, and next-step routing are generated after submission.',
 intake_company_button:'Request confidential review',
 intake_individual_eyebrow:'Structured service request',
 intake_individual_title:'Start the selected individual-service intake with a cleaner first packet.',
 intake_individual_lead:'Use this intake to route the matter correctly, confirm what should be sent now, and keep the private-client path structured.',
 intake_individual_side_title:'Individual service output',
 intake_individual_side_body:'Service fit, document needs, response window, and next-step routing are updated as the intake is completed.',
 intake_individual_button:'Start structured intake',
 thank_company_cta:'Schedule strategy call',
 thank_individual_cta:'Start structured intake'
});
Object.assign(extra.en, {
 brand_tag:'Corporate revenue recovery and documentation control',
 footer_secondary_title:'Secondary',
 footer_operator_note:'Tampa, Florida / U.S. operator advisory',
 footer_scope_note:'Documentation-first reviews for revenue recovery infrastructure, corporate legal file control, and executive materials.',
 footer_email:'Email',
 footer_copy:'© 2026 VitaCoreX LLC. All rights reserved.',
 header_metric_full:'Documentation Control / Revenue Recovery / Executive Briefs',
 header_metric_mobile:'Companies / Individuals',
 menu_label:'Menu',
 resources_band_eyebrow:'For Companies',
 resources_band_title:'Move from executive material to a confidential review.',
 resources_band_body:'Use the executive brief to align leadership, then route the matter into a confidential company review or a strategy call.',
 careers_band_eyebrow:'Company path',
 careers_band_title:'Client evaluation remains the primary VitaCoreX path.',
 careers_band_body:'Careers stay secondary to the advisory platform. If you are evaluating services, move to the company review or executive brief path.',
 thank_received:'Submission received',
 thank_company_meta_title:'Confidential Review Received | VitaCoreX LLC',
 thank_company_meta_desc:'Your confidential review request has been received. VitaCoreX will review the submission and route the next step.',
 thank_individual_meta_title:'Service Request Received | VitaCoreX LLC',
 thank_individual_meta_desc:'Your structured service request has been received. VitaCoreX will review the submission and route the next step.',
 out_fit_company:'Company review is in scope once the required details are complete.',
 out_fit_individual:'Service routing becomes more precise as the intake is completed.',
 out_docs_company:'Current agreements, invoices, payment history, notices, and any existing file references.',
 out_docs_individual:'Relevant contracts, filings, screenshots, identity documents, and any packet drafts already available.',
 out_window_company:'24-48 business hours after a complete company submission.',
 out_window_individual:'24-48 business hours after a complete individual intake.',
 out_next_company:'Confidential review, document-gap check, and next-step memo.',
 out_next_individual:'Structured service review, document check, and follow-up routing.',
 service_confidential_review:'Confidential company review',
 service_selected_individual:'Selected individual service request',
 urgency_same_day:'Same day',
 field_state:'State *',
 field_state_ph:'State',
 details_toggle:'Additional company details (optional)',
 field_company_size:'Company size',
 ph_company_size:'Company size',
 field_revenue_range:'Annual revenue range',
 ph_revenue_range:'Annual revenue range',
 field_ar_size:'Accounts receivable / portfolio size',
 ph_ar_size:'Accounts receivable / portfolio size',
 field_agency_usage:'Current agency usage',
 select_agency_usage:'Select current setup',
 agency_none:'No agency in use',
 agency_light:'Limited agency use',
 agency_primary:'Primary recovery partner in place',
 attachment_note_company:'Attachment is optional. On iPhone, PDF and document uploads are supported through Files / Browse.',
 attachment_note_individual:'Attachment is optional. Add a file only if it helps us review the request faster.',
 output_note:'This summary becomes more specific as the intake is completed. It is not legal advice.',
 intake_company_meta_title:'Confidential Review | VitaCoreX LLC',
 intake_company_meta_desc:'Request a confidential company review for revenue recovery infrastructure, legal file control, or executive material routing.',
 intake_individual_meta_title:'Structured Service Request | VitaCoreX LLC',
 intake_individual_meta_desc:'Start a structured service request for a selected individual matter and prepare a cleaner first packet.',
 field_service_type:'Service line',
 select_service_type:'Select service line',
 service_recovery:'Revenue recovery infrastructure',
 service_file:'Corporate legal file control',
 service_intake:'Structured intake and packet build',
 service_briefs:'Executive brief request',
 service_individuals:'Selected individual services',
 field_attachment:'Supporting file',
 intake_attachment_note:'Attach the most relevant file, packet draft, or reference document.',
 field_message:'Situation summary',
 intake_message_ph:'Describe the matter, the business context, and the decision that needs to move.',
 gate_title:'Unlock the executive brief',
 gate_copy:'Enter your details to access the PDF and keep follow-up organized.',
 gate_success:'Access granted. Opening the resource now.',
 gate_failure:'Submission failed. Please try again or use email.',
 readiness_foundational:'Foundational cleanup required',
 readiness_improvable:'Structured but improvable',
 readiness_ready:'Counsel-ready trajectory',
 litigation_ready:'Litigation-ready',
 needs_reconstruction:'Needs file reconstruction',
 corporate_estimator_eyebrow:'Attorney cost exposure',
 corporate_estimator_title:'Estimate how much high-cost cleanup is being absorbed before counsel can move.',
 corporate_estimator_intro:'This directional estimator highlights the operating cost of weak chronology, incomplete exhibits, and inconsistent documentation control before outside review begins.',
 corporate_engine_pill:'Estimator',
 corporate_engine_title:'Attorney cleanup exposure',
 corporate_engine_label_files:'Number of active files',
 corporate_engine_label_rate:'Attorney hourly rate',
 corporate_engine_label_hours:'Cleanup hours per file',
 corporate_engine_button:'Estimate cost exposure',
 corporate_impact_pill:'Impact view',
 corporate_impact_title:'Estimated annual exposure',
 corporate_result_label:'Directional exposure',
 corporate_result_body:'Use the estimator to quantify how much high-cost attorney time may be consumed by administrative file preparation.',
 corporate_metric_exposure:'Annual cleanup exposure',
 corporate_metric_hours:'Hours absorbed',
 legal_result_template:'At the current assumptions, administrative file cleanup may absorb <b>{exposure}</b> in annual attorney time across approximately <b>{hours}</b>. Stronger documentation infrastructure can reduce this burden before outside review begins.',
 revenue_patent_title:'Built for controlled deployment',
 revenue_patent_body:'Designed for disciplined U.S. deployment, documentation control, and executive review.',
 revenue_framework_title:'Framework components',
 revenue_markers_title:'Decision criteria',
 revenue_calc_note:'Directional planning only.',
 revenue_output_title:'Planning outputs',
 revenue_out_agency:'Net cash under immediate agency path',
 revenue_out_pre:'Net cash under pre-collection plus agency-for-failures path',
 revenue_out_lift:'Estimated lift ($)',
 revenue_out_lift_pct:'Estimated lift (%)',
 revenue_components_body:'FDCPA, Regulation F, Florida FCCPA, E-SIGN, and Florida UETA are referenced as workflow guardrails for documentation control and escalation structure. VitaCoreX LLC is not a law firm and not a licensed collection agency.',
 revenue_examples_eyebrow:'Operator archetypes',
 revenue_examples_title:'Representative operating scenarios',
 revenue_examples_intro:'These examples describe the types of operator situations suited for a pilot or workflow redesign. They are not client claims or testimonials.',
 revenue_case1_label:'Dental group',
 revenue_case1_note:'Focus on promise-to-pay discipline, autopay conversion, and cleaner escalation thresholds.',
 revenue_case2_label:'Healthcare operator',
 revenue_case2_note:'Focus on aging visibility, payment-plan documentation, and weekly executive reporting.',
 revenue_case3_label:'Subscription platform',
 revenue_case3_note:'Focus on exception routing, documented offers, and cleaner agency handoff rules.'
});
Object.assign(extra.ru, {
 brand_tag:'Контроль корпоративной выручки и документации',
 nav_companies:'Для компаний',
 nav_recovery:'Возврат выручки',
 nav_brief:'Материал для руководства',
 nav_individuals:'Для частных клиентов',
 nav_confidential:'Конфиденциальный разбор',
 footer_companies_title:'Для компаний',
 footer_individuals_title:'Для частных клиентов',
 footer_careers_link:'Сотрудничество',
 footer_secondary_title:'Дополнительно',
 footer_operator_note:'Тампа, Флорида / операторская advisory-платформа по США',
 footer_scope_note:'Разборы на базе документов для инфраструктуры возврата выручки, контроля корпоративной юридической документации и executive-материалов.',
 footer_email:'Email',
 footer_copy:'© 2026 VitaCoreX LLC. Все права защищены.',
 header_metric_full:'Контроль документации / Возврат выручки / Материал для руководства',
 header_metric_mobile:'Компании / Частные клиенты',
 menu_label:'Меню',
 cta_confidential_review:'Запросить конфиденциальный разбор',
 cta_strategy_call:'Назначить стратегический звонок',
 cta_review_brief:'Открыть материал для руководства',
 cta_request_service:'Запросить услугу',
 cta_start_intake:'Начать структурированный разбор',
 dock_brief:'Материал',
 dock_strategy:'Стратегия',
 dock_companies:'Компании',
 dock_individuals:'Клиенты',
 client_company:'Компания',
 client_individual:'Частное лицо',
 resources_band_eyebrow:'Для компаний',
 resources_band_title:'Перейдите от executive-материала к конфиденциальному разбору.',
 resources_band_body:'Используйте материал для руководства, чтобы выровнять внутреннюю позицию, а затем перевести вопрос в конфиденциальный разбор компании или стратегический звонок.',
 careers_band_eyebrow:'Корпоративный путь',
 careers_band_title:'Оценка услуг остаётся основным путём VitaCoreX.',
 careers_band_body:'Раздел сотрудничества вторичен по отношению к advisory-платформе. Если вы оцениваете услуги, переходите в корпоративный разбор или к материалу для руководства.',
 thank_received:'Запрос получен',
 thank_company_meta_title:'Запрос на конфиденциальный разбор получен | VitaCoreX LLC',
 thank_company_meta_desc:'Ваш запрос на конфиденциальный разбор получен. VitaCoreX рассмотрит материалы и направит следующий шаг.',
 thank_individual_meta_title:'Запрос на услугу получен | VitaCoreX LLC',
 thank_individual_meta_desc:'Ваш структурированный запрос на услугу получен. VitaCoreX рассмотрит материалы и направит следующий шаг.',
 out_fit_company:'Корпоративный разбор уместен после заполнения обязательных данных.',
 out_fit_individual:'Маршрут частной услуги уточняется по мере заполнения intake.',
 out_docs_company:'Текущие договоры, счета, история оплат, уведомления и существующие ссылки на файл.',
 out_docs_individual:'Релевантные договоры, формы, скриншоты, удостоверяющие документы и имеющиеся черновики пакета.',
 out_window_company:'24-48 рабочих часов после полной корпоративной подачи.',
 out_window_individual:'24-48 рабочих часов после полного индивидуального intake.',
 out_next_company:'Конфиденциальный разбор, проверка пробелов в документах и memo со следующим шагом.',
 out_next_individual:'Разбор услуги, проверка документов и дальнейшая маршрутизация.',
 service_confidential_review:'Конфиденциальный корпоративный разбор',
 service_selected_individual:'Запрос по выбранной частной услуге',
 urgency_same_day:'В тот же день',
 field_state:'Штат *',
 field_state_ph:'Штат',
 details_toggle:'Дополнительные сведения о компании (необязательно)',
 field_company_size:'Размер компании',
 ph_company_size:'Размер компании',
 field_revenue_range:'Диапазон годовой выручки',
 ph_revenue_range:'Диапазон годовой выручки',
 field_ar_size:'Объём дебиторской задолженности / портфеля',
 ph_ar_size:'Объём дебиторской задолженности / портфеля',
 field_agency_usage:'Текущая работа с агентством',
 select_agency_usage:'Выберите текущую модель',
 agency_none:'Агентство не используется',
 agency_light:'Ограниченное использование агентства',
 agency_primary:'Есть основной recovery-партнёр',
 attachment_note_company:'Приложение необязательно. На iPhone загрузка PDF и документов поддерживается через Files / Browse.',
 attachment_note_individual:'Приложение необязательно. Добавляйте файл только если он ускорит разбор запроса.',
 output_note:'Это резюме уточняется по мере заполнения intake. Оно не является юридической консультацией.',
 intake_company_meta_title:'Конфиденциальный разбор | VitaCoreX LLC',
 intake_company_meta_desc:'Запросите конфиденциальный корпоративный разбор по инфраструктуре возврата выручки, legal file control или маршрутизации executive-материалов.',
 intake_individual_meta_title:'Структурированный запрос на услугу | VitaCoreX LLC',
 intake_individual_meta_desc:'Начните структурированный запрос по выбранному частному вопросу и подготовьте более чистый первый пакет.',
 field_service_type:'Сервисная линия',
 select_service_type:'Выберите сервисную линию',
 service_recovery:'Инфраструктура возврата выручки',
 service_file:'Контроль корпоративной юридической документации',
 service_intake:'Структурированный разбор и сбор пакета',
 service_briefs:'Запрос executive-материала',
 service_individuals:'Избранные частные услуги',
 field_attachment:'Поддерживающий файл',
 intake_attachment_note:'Прикрепите самый важный файл, черновик пакета или опорный документ.',
 field_message:'Краткое описание ситуации',
 intake_message_ph:'Опишите вопрос, деловой контекст и решение, которое нужно сдвинуть с места.',
 gate_title:'Открыть материал для руководства',
 gate_copy:'Оставьте данные, чтобы открыть PDF и сохранить аккуратную логику дальнейшего контакта.',
 gate_success:'Доступ открыт. Ресурс открывается.',
 gate_failure:'Не удалось отправить форму. Попробуйте ещё раз или используйте email.',
 readiness_foundational:'Требуется базовая очистка',
 readiness_improvable:'Структура есть, но её нужно усилить',
 readiness_ready:'Траектория готовности для counsel',
 litigation_ready:'Готово к правовой передаче',
 needs_reconstruction:'Нужна реконструкция файла'
});
Object.assign(extra.es, {
 brand_tag:'Control corporativo de recuperacion de ingresos y documentacion',
 nav_companies:'Para empresas',
 nav_recovery:'Recuperacion de ingresos',
 nav_brief:'Informe ejecutivo',
 nav_individuals:'Para particulares',
 nav_confidential:'Revision confidencial',
 footer_companies_title:'Para empresas',
 footer_individuals_title:'Para particulares',
 footer_careers_link:'Carreras',
 footer_secondary_title:'Secundario',
 footer_operator_note:'Tampa, Florida / plataforma operativa para EE. UU.',
 footer_scope_note:'Revisiones basadas en documentacion para infraestructura de recuperacion de ingresos, control corporativo de archivos legales y materiales ejecutivos.',
 footer_email:'Email',
 footer_copy:'© 2026 VitaCoreX LLC. Todos los derechos reservados.',
 header_metric_full:'Control documental / Recuperacion de ingresos / Informe ejecutivo',
 header_metric_mobile:'Empresas / Particulares',
 menu_label:'Menu',
 cta_confidential_review:'Solicitar revision confidencial',
 cta_strategy_call:'Agendar llamada estrategica',
 cta_review_brief:'Revisar informe ejecutivo',
 cta_request_service:'Solicitar servicio',
 cta_start_intake:'Iniciar evaluacion estructurada',
 dock_brief:'Informe',
 dock_strategy:'Estrategia',
 dock_companies:'Empresas',
 dock_individuals:'Particulares',
 client_company:'Empresa',
 client_individual:'Particular',
 resources_band_eyebrow:'Para empresas',
 resources_band_title:'Pase del material ejecutivo a una revision confidencial.',
 resources_band_body:'Use el informe ejecutivo para alinear a la direccion y luego llevar el asunto a una revision confidencial o a una llamada estrategica.',
 careers_band_eyebrow:'Ruta corporativa',
 careers_band_title:'La evaluacion de servicios sigue siendo la ruta principal de VitaCoreX.',
 careers_band_body:'Carreras queda en segundo plano frente a la plataforma de asesoria. Si esta evaluando servicios, avance a la revision corporativa o al informe ejecutivo.',
 thank_received:'Solicitud recibida',
 thank_company_meta_title:'Revision confidencial recibida | VitaCoreX LLC',
 thank_company_meta_desc:'Su solicitud de revision confidencial fue recibida. VitaCoreX revisara el envio y definira el siguiente paso.',
 thank_individual_meta_title:'Solicitud de servicio recibida | VitaCoreX LLC',
 thank_individual_meta_desc:'Su solicitud estructurada de servicio fue recibida. VitaCoreX revisara el envio y definira el siguiente paso.',
 out_fit_company:'La revision corporativa es adecuada una vez completados los datos requeridos.',
 out_fit_individual:'La ruta del servicio se vuelve mas precisa a medida que se completa el intake.',
 out_docs_company:'Acuerdos vigentes, facturas, historial de pagos, avisos y cualquier referencia documental ya disponible.',
 out_docs_individual:'Contratos, formularios, capturas, documentos de identidad y borradores de paquete que ya esten disponibles.',
 out_window_company:'24-48 horas habiles despues de un envio corporativo completo.',
 out_window_individual:'24-48 horas habiles despues de un intake individual completo.',
 out_next_company:'Revision confidencial, verificacion de vacios documentales y memo de siguiente paso.',
 out_next_individual:'Revision del servicio, control documental y enrutamiento posterior.',
 service_confidential_review:'Revision confidencial corporativa',
 service_selected_individual:'Solicitud de servicio individual seleccionado',
 urgency_same_day:'Mismo dia',
 field_state:'Estado *',
 field_state_ph:'Estado',
 details_toggle:'Detalles adicionales de la empresa (opcional)',
 field_company_size:'Tamano de la empresa',
 ph_company_size:'Tamano de la empresa',
 field_revenue_range:'Rango de ingresos anuales',
 ph_revenue_range:'Rango de ingresos anuales',
 field_ar_size:'Cuentas por cobrar / tamano del portafolio',
 ph_ar_size:'Cuentas por cobrar / tamano del portafolio',
 field_agency_usage:'Uso actual de agencia',
 select_agency_usage:'Seleccione la estructura actual',
 agency_none:'Sin agencia activa',
 agency_light:'Uso limitado de agencia',
 agency_primary:'Socio principal de recuperacion ya activo',
 attachment_note_company:'El archivo adjunto es opcional. En iPhone, los PDF y documentos pueden cargarse desde Files / Browse.',
 attachment_note_individual:'El archivo adjunto es opcional. Agreguelo solo si acelera la revision del caso.',
 output_note:'Este resumen se vuelve mas preciso a medida que se completa el intake. No constituye asesoramiento legal.',
 intake_company_meta_title:'Revision confidencial | VitaCoreX LLC',
 intake_company_meta_desc:'Solicite una revision confidencial para infraestructura de recuperacion, control de archivo legal o enrutamiento de material ejecutivo.',
 intake_individual_meta_title:'Solicitud estructurada de servicio | VitaCoreX LLC',
 intake_individual_meta_desc:'Inicie una solicitud estructurada para un asunto individual seleccionado y prepare un primer paquete mas limpio.',
 field_service_type:'Linea de servicio',
 select_service_type:'Seleccione la linea de servicio',
 service_recovery:'Infraestructura de recuperacion de ingresos',
 service_file:'Control corporativo de archivos legales',
 service_intake:'Evaluacion estructurada y armado del paquete',
 service_briefs:'Solicitud de informe ejecutivo',
 service_individuals:'Servicios individuales seleccionados',
 field_attachment:'Archivo de soporte',
 intake_attachment_note:'Adjunte el archivo mas relevante, un borrador de paquete o un documento de referencia.',
 field_message:'Resumen de la situacion',
 intake_message_ph:'Describa el asunto, el contexto del negocio y la decision que necesita avanzar.',
 gate_title:'Desbloquear el informe ejecutivo',
 gate_copy:'Ingrese sus datos para acceder al PDF y mantener ordenado el seguimiento.',
 gate_success:'Acceso concedido. Abriendo el recurso.',
 gate_failure:'No se pudo enviar. Intente otra vez o use el correo.',
 readiness_foundational:'Se requiere limpieza de base',
 readiness_improvable:'Hay estructura, pero debe fortalecerse',
 readiness_ready:'Trayectoria lista para counsel',
 litigation_ready:'Listo para handoff legal',
 needs_reconstruction:'Necesita reconstruccion del expediente'
});
const pageCopy={};
const staticCopy={};
Object.assign(pageCopy, {
 home:{
  en:{
   title:'VitaCoreX LLC | Confidential Advisory for Revenue Recovery and Documentation Control',
   desc:'Tampa-based advisory firm for operators that need disciplined revenue recovery infrastructure, corporate legal file control, and confidential executive review.',
   hero_eyebrow:'Confidential U.S. operator advisory',
   hero_title:'Documentation control and revenue recovery discipline for operators who cannot afford a loose handoff.',
   hero_lead:'VitaCoreX supports corporate operators with confidential diagnostic reviews, documentation-first recovery design, and counsel-ready file control. Selected individual matters remain available, but the firm is built for institutional work.',
   leaks_eyebrow:'Where value leaks first',
   leaks_title:'Most losses start before formal escalation.',
   leaks_intro:'The premium mandate is not generic support. It is control over the operating layer that determines whether balances, files, and decisions stay usable.',
   services_eyebrow:'Core service lines',
   svc_h:'Three controlled mandates anchor the platform.',
   svc_i:'Each line is scoped to protect cash performance, documentation quality, and a cleaner handoff to outside counsel when needed.',
   svc_card_1_h:'Revenue recovery infrastructure',
   svc_card_2_h:'Corporate legal file control',
   pilot_eyebrow:'Diagnose to scale',
   pilot_title:'A serious advisory sale needs a visible operating path.',
   pilot_intro:'Engagements begin with diagnostic control, move through a contained pilot when appropriate, and scale only after the operating case is clear.',
   step_1:'Diagnose',
   step_2:'Pilot',
   step_3:'Scale',
   proof_stat_1:'Revenue leakage areas',
   proof_stat_2:'Primary operator paths',
   proof_stat_3:'Decision-ready narrative',
   why_eyebrow:'Engagement paths',
   why_title:'Corporate buyers lead. Individual matters remain secondary.',
   why_intro:'VitaCoreX is positioned first for corporate operators and portfolio-backed decision makers. Selected individual services remain available through a separate, lower-prominence path.',
   b2b_badge:'For companies',
   b2b_title:'Institutional advisory for operators that need cleaner execution before legal and agency costs escalate.',
   b2b_intro:'Built for organizations that want structured operating control, stronger documentation, and a more credible handoff model before outside legal cost expands.',
   b2b_b1:'Revenue recovery infrastructure',
   b2b_b2:'Corporate legal file control',
   b2b_b3:'Diagnostic review, pilot structure, and controlled rollout logic',
   b2b_cta:'Request confidential review',
   ind_badge:'For individuals',
   ind_title:'Selected private-client services remain available on a limited basis.',
   ind_intro:'Private-client support is offered selectively, through a separate intake path and in a secondary position to the corporate advisory platform.',
   ind_b1:'Contracts and documentation support',
   ind_b2:'Immigration packet organization',
   ind_b3:'Auto purchase review',
   ind_b4:'Business plan and launch support',
   cta_eyebrow:'Confidential next step',
   cta_title:'Use the first review to decide whether VitaCoreX should diagnose, clean up, or structure a pilot.',
   cta_intro:'Confidential reviews are designed for serious buyers who need an operational answer, a clearer file position, or a disciplined path before outside legal cost grows.',
   cta_primary:'Request confidential review',
   home_note_pill:'Private review standard',
   home_note_title:'Built for owners, CFOs, operators, and counsel-facing teams.',
   home_note_body:'The first conversation is structured around leakage exposure, documentation readiness, and whether the mandate belongs in diagnosis, a pilot, or file-control cleanup.',
   home_note_1:'Tampa, Florida operator base with U.S. service coverage',
   home_note_2:'Documentation-first operating model before outside cost expands',
   home_note_3:'Not a law firm; legal advice remains with licensed counsel',
   trust_1_pill:'Tampa / U.S.',
   trust_1_body:'Tampa-based operator with U.S. business-support engagements.',
   trust_2_pill:'Documentation-first',
   trust_2_body:'Recovery design and file control begin with clean records, not improvisation.',
   trust_3_pill:'Response discipline',
   trust_3_body:'Inbound reviews are routed, documented, and answered through a controlled intake path.',
   trust_4_pill:'Legal boundary',
   trust_4_body:'VitaCoreX is not a law firm and does not provide legal representation.',
   leak_1_h:'Aging without sequence',
   leak_1_p:'Outreach, payment logic, and follow-up drift by team, location, or operator.',
   leak_2_h:'Weak documentation control',
   leak_2_p:'Critical records live in inboxes, disconnected folders, or incomplete packets.',
   leak_3_h:'Margin lost too early',
   leak_3_p:'Accounts move outward before internal conversion options are designed and measured.',
   leak_4_h:'No executive visibility',
   leak_4_p:'Leadership sees volume, but not where leakage, friction, and handoff risk are actually forming.',
   svc_card_1_p:'Design pre-agency recovery systems that convert balances into documented commitments before margin is surrendered.',
   svc_card_2_p:'Bring chronology, exhibits, and supporting records into a counsel-ready structure that can withstand internal review.',
   svc_card_3_h:'Structured intake and packet build',
   svc_card_3_p:'Route matters correctly, define the first work product, and begin with a disciplined document request instead of loose back-and-forth.',
   step_1_p:'Review workflow drag, file condition, escalation logic, and where cash leakage begins.',
   step_2_p:'Run a limited scope with reporting, document control, and a decision standard for what merits expansion.',
   step_3_p:'Extend the model only after leadership can see a repeatable operating gain.',
   pilot_outcome_pill:'What leadership receives',
   pilot_outcome_title:'The output is a cleaner decision, not a vague advisory memo.',
   pilot_outcome_body:'Each step is designed to leave management with a clearer operating choice and cleaner supporting records.',
   pilot_outcome_1:'Leakage and documentation diagnosis',
   pilot_outcome_2:'Pilot scope or file-control work plan',
   pilot_outcome_3:'Implementation view for finance, operations, and counsel',
   proof_eyebrow:'Executive materials',
   proof_title:'Controlled briefs that help a decision move.',
   proof_intro:'The public layer is intentionally selective: brief enough for internal forwarding, detailed enough to support a real next conversation.'
  },
  ru:{
   title:'VitaCoreX LLC | Конфиденциальный advisory по возврату выручки и контролю документации',
   desc:'Advisory-платформа из Тампы для операторов, которым нужна дисциплина в инфраструктуре возврата выручки, контроле корпоративной юридической документации и конфиденциальном executive-review.',
   hero_eyebrow:'Конфиденциальный advisory для операторов в США',
   hero_title:'Контроль документации и дисциплина возврата выручки для операторов, которые не могут позволить себе слабый handoff.',
   hero_lead:'VitaCoreX поддерживает корпоративных операторов через конфиденциальный диагностический разбор, documentation-first дизайн recovery и более чистый counsel-ready file control. Частные вопросы остаются доступны выборочно, но платформа построена для институциональной работы.',
   leaks_eyebrow:'Где сначала уходит ценность',
   leaks_title:'Большинство потерь начинается до формальной эскалации.',
   leaks_intro:'Премиальный мандат VitaCoreX - не общий support, а контроль над операционным слоем, от которого зависит, останутся ли балансы, файлы и решения пригодными для действия.',
   services_eyebrow:'Ключевые сервисные линии',
   svc_h:'Платформу держат три контролируемых мандата.',
   svc_i:'Каждое направление строится вокруг защиты cash performance, качества документации и более чистой передачи внешнему юристу, когда это потребуется.',
   svc_card_1_h:'Инфраструктура возврата выручки',
   svc_card_2_h:'Контроль корпоративной юридической документации',
   pilot_eyebrow:'От диагноза к масштабу',
   pilot_title:'Серьёзная advisory-продажа требует видимого операционного пути.',
   pilot_intro:'Работа начинается с диагностического контроля, при необходимости проходит через ограниченный пилот и масштабируется только после того, как операционный кейс становится очевидным.',
   step_1:'Диагностика',
   step_2:'Пилот',
   step_3:'Масштабирование',
   proof_stat_1:'Зоны утечки выручки',
   proof_stat_2:'Основные operator-пути',
   proof_stat_3:'Нарратив для решения',
   why_eyebrow:'Пути покупки',
   why_title:'Корпоративные покупатели - первыми. Частные запросы - вторичны.',
   why_intro:'VitaCoreX в первую очередь позиционируется для корпоративных операторов и решений уровня owners, CFO и portfolio-backed команд. Избранные частные услуги остаются доступны через отдельный путь с меньшим приоритетом.',
   b2b_badge:'Для компаний',
   b2b_title:'Институциональный advisory для операторов, которым нужна более чистая исполнение до роста legal и agency cost.',
   b2b_intro:'Подходит организациям, которым нужен структурированный операционный контроль, более сильная документация и более убедительная handoff-модель до расширения внешних legal cost.',
   b2b_b1:'Инфраструктура возврата выручки',
   b2b_b2:'Контроль корпоративного юридического файла',
   b2b_b3:'Диагностический разбор, структура пилота и контролируемая логика внедрения',
   b2b_cta:'Запросить конфиденциальный разбор',
   ind_badge:'Для частных клиентов',
   ind_title:'Избранные private-client услуги остаются доступны в ограниченном формате.',
   ind_intro:'Поддержка частных клиентов предлагается выборочно, по отдельному intake-пути и во вторичной роли по отношению к корпоративной advisory-платформе.',
   ind_b1:'Поддержка по договорам и документам',
   ind_b2:'Организация иммиграционного пакета',
   ind_b3:'Проверка покупки автомобиля',
   ind_b4:'Поддержка бизнес-плана и запуска',
   cta_eyebrow:'Конфиденциальный следующий шаг',
   cta_title:'Используйте первый разбор, чтобы понять, нужен ли VitaCoreX диагноз, file cleanup или структура пилота.',
   cta_intro:'Конфиденциальные разборы созданы для серьёзных покупателей, которым нужен операционный ответ, более чистая позиция по файлу или дисциплинированный путь до роста внешних расходов.',
   cta_primary:'Запросить конфиденциальный разбор'
  },
  es:{
   title:'VitaCoreX LLC | Asesoria confidencial para recuperacion de ingresos y control documental',
   desc:'Firma de Tampa para operadores que necesitan disciplina en infraestructura de recuperacion de ingresos, control corporativo de archivos legales y revision ejecutiva confidencial.',
   hero_eyebrow:'Asesoria confidencial para operadores en EE. UU.',
   hero_title:'Control documental y disciplina de recuperacion para operadores que no pueden permitirse un handoff debil.',
   hero_lead:'VitaCoreX apoya a operadores corporativos con revisiones diagnosticas confidenciales, diseno de recuperacion basado en documentacion y control de expedientes listo para counsel. Los asuntos individuales siguen disponibles de forma selectiva, pero la firma esta construida para trabajo institucional.',
   leaks_eyebrow:'Donde empieza la fuga de valor',
   leaks_title:'La mayor parte de la perdida comienza antes de la escalacion formal.',
   leaks_intro:'La posicion premium de VitaCoreX no es soporte generico. Es control sobre la capa operativa que determina si los saldos, expedientes y decisiones siguen siendo utilizables.',
   services_eyebrow:'Lineas centrales de servicio',
   svc_h:'Tres mandatos controlados sostienen la plataforma.',
   svc_i:'Cada linea se diseña para proteger el rendimiento de caja, la calidad documental y un handoff mas limpio hacia counsel externo cuando haga falta.',
   svc_card_1_h:'Infraestructura de recuperacion de ingresos',
   svc_card_2_h:'Control corporativo de archivos legales',
   pilot_eyebrow:'Del diagnostico a la escala',
   pilot_title:'Una venta consultiva seria necesita un camino operativo visible.',
   pilot_intro:'El trabajo comienza con control diagnostico, pasa por un piloto contenido cuando corresponde y solo escala despues de que el caso operativo queda claro.',
   step_1:'Diagnostico',
   step_2:'Piloto',
   step_3:'Escalar',
   proof_stat_1:'Areas de fuga de ingresos',
   proof_stat_2:'Rutas principales del operador',
   proof_stat_3:'Narrativa lista para decision',
   why_eyebrow:'Rutas de compra',
   why_title:'El comprador corporativo va primero. Los asuntos individuales quedan en segundo plano.',
   why_intro:'VitaCoreX se posiciona primero para operadores corporativos y responsables de decision respaldados por capital. Los servicios individuales seleccionados siguen disponibles por una via separada y de menor protagonismo.',
   b2b_badge:'Para empresas',
   b2b_title:'Asesoria institucional para operadores que necesitan una ejecucion mas limpia antes de que escalen los costos legales y de agencia.',
   b2b_intro:'Creado para organizaciones que desean mayor control operativo, documentacion mas solida y un modelo de handoff mas creible antes de que aumente el costo legal externo.',
   b2b_b1:'Infraestructura de recuperacion de ingresos',
   b2b_b2:'Control corporativo del expediente legal',
   b2b_b3:'Revision diagnostica, estructura de piloto y logica de despliegue controlado',
   b2b_cta:'Solicitar revision confidencial',
   ind_badge:'Para particulares',
   ind_title:'Algunos servicios privados siguen disponibles de forma limitada.',
   ind_intro:'El soporte privado se ofrece de forma selectiva, por una via de intake separada y en posicion secundaria frente a la plataforma corporativa.',
   ind_b1:'Soporte en contratos y documentacion',
   ind_b2:'Organizacion de paquete migratorio',
   ind_b3:'Revision de compra de auto',
   ind_b4:'Apoyo en plan de negocio y lanzamiento',
   cta_eyebrow:'Siguiente paso confidencial',
   cta_title:'Use la primera revision para decidir si VitaCoreX debe diagnosticar, ordenar el expediente o estructurar un piloto.',
   cta_intro:'Las revisiones confidenciales estan pensadas para compradores serios que necesitan una respuesta operativa, una posicion documental mas limpia o una ruta disciplinada antes de que crezcan los costos externos.',
   cta_primary:'Solicitar revision confidencial'
  }
 },
 resources:{
  en:{
   title:'Executive Briefs | VitaCoreX LLC',
   desc:'Lead-controlled executive briefs and proof documents designed for internal forwarding and executive review.',
   hero_eyebrow:'Executive briefs',
   hero_title:'Controlled executive material for owners, CFOs, operators, and counsel.',
   hero_lead:'Use the resource layer to frame the problem, support internal discussions, and prepare a cleaner first consultation.',
   resources_side_title:'What each resource gives',
   resources_side_body:'Fast internal forwarding material for partners, founders, CFOs, and operators who need a concise executive frame before a call.',
   resources_tag_1:'Executive brief',
   resources_tag_2:'CFO brief',
   resources_tag_3:'Institutional deck',
   resources_tag_4:'Executive review'
  },
  ru:{
   title:'Материалы для руководства | VitaCoreX LLC',
   desc:'Контролируемые материалы для руководства и подтверждающие документы, созданные для внутренней пересылки и executive-review.',
   hero_eyebrow:'Материалы для руководства',
   hero_title:'Контролируемые материалы для owners, CFO, операторов и counsel.',
   hero_lead:'Используйте этот слой материалов, чтобы корректно сформулировать вопрос, поддержать внутреннее обсуждение и подготовить более чистую первую консультацию.',
   resources_side_title:'Что даёт каждый материал',
   resources_side_body:'Краткие материалы для внутренней пересылки партнёрам, founders, CFO и операторам, которым нужна компактная executive-рамка до звонка.',
   resources_tag_1:'Материал для руководства',
   resources_tag_2:'Материал для CFO',
   resources_tag_3:'Институциональный deck',
   resources_tag_4:'Executive-review'
  },
  es:{
   title:'Informes ejecutivos | VitaCoreX LLC',
   desc:'Informes ejecutivos controlados y documentos de respaldo diseñados para reenvio interno y revision ejecutiva.',
   hero_eyebrow:'Informes ejecutivos',
   hero_title:'Material controlado para owners, CFOs, operadores y counsel.',
   hero_lead:'Use esta capa de recursos para enmarcar el problema, apoyar conversaciones internas y preparar una primera consulta mas limpia.',
   resources_side_title:'Que aporta cada recurso',
   resources_side_body:'Material breve para reenvio interno dirigido a socios, founders, CFOs y operadores que necesitan un marco ejecutivo conciso antes de una llamada.',
   resources_tag_1:'Informe ejecutivo',
   resources_tag_2:'Brief para CFO',
   resources_tag_3:'Deck institucional',
   resources_tag_4:'Revision ejecutiva'
  }
 },
 'individual-services':{
  en:{
   title:'Selected Individual Services | VitaCoreX LLC',
   desc:'Selected individual-service support for contracts, immigration documents, auto purchase review, company setup, and translation support.',
   hero_eyebrow:'Selected individual services',
   hero_title:'Selected support for private-client and one-off matters.',
   hero_lead:'These matters remain available on a selective basis, while VitaCoreX continues to lead with corporate advisory engagements.',
   individual_side_title:'Selective private-client access',
   individual_side_body:'Private-client matters remain available through structured intake, while corporate engagements stay primary across the platform.'
  },
  ru:{
   title:'Избранные частные услуги | VitaCoreX LLC',
   desc:'Избранные private-client услуги: договоры, иммиграционные документы, проверка покупки автомобиля, запуск компании и перевод.',
   hero_eyebrow:'Избранные частные услуги',
   hero_title:'Избранная поддержка для private-client и разовых запросов.',
   hero_lead:'Эти вопросы остаются доступны выборочно, при этом VitaCoreX по-прежнему ведёт платформу через корпоративные advisory engagements.',
   individual_side_title:'Выборочный доступ для private-client',
   individual_side_body:'Частные вопросы остаются доступны через структурированный intake, а корпоративные engagements сохраняют первичный статус по всей платформе.'
  },
  es:{
   title:'Servicios individuales seleccionados | VitaCoreX LLC',
   desc:'Servicios seleccionados para particulares: contratos, documentos migratorios, revision de compra de auto, constitucion de empresa y traduccion.',
   hero_eyebrow:'Servicios individuales seleccionados',
   hero_title:'Soporte seleccionado para asuntos privados y puntuales.',
   hero_lead:'Estos asuntos siguen disponibles de forma selectiva, mientras VitaCoreX mantiene el liderazgo con compromisos de asesoria corporativa.',
   individual_side_title:'Acceso privado selectivo',
   individual_side_body:'Los asuntos privados siguen disponibles mediante intake estructurado, mientras los compromisos corporativos continúan como la via principal de la plataforma.'
  }
 },
 careers:{
  en:{
   title:'Careers | VitaCoreX LLC',
   desc:'Careers page for disciplined candidates who can operate inside a documentation-first environment.',
   hero_eyebrow:'Careers',
   hero_title:'Work with structure, clarity, and disciplined execution.',
   hero_lead:'We look for people who can support documentation-first operations with strong writing, judgment, reliability, and consistency.',
   careers_side_title:'Preferred profile',
   careers_side_body:'Strong English, clear business writing, verifiable recommendations preferred, and prior experience in documentation, operations, client support, legal support, or litigation support.'
  },
  ru:{
   title:'Сотрудничество | VitaCoreX LLC',
   desc:'Страница сотрудничества для дисциплинированных кандидатов, способных работать в документационно-ориентированной среде.',
   hero_eyebrow:'Сотрудничество',
   hero_title:'Работа со структурой, ясностью и дисциплиной исполнения.',
   hero_lead:'Мы ищем людей, которые могут поддерживать documentation-first operations за счёт сильного письма, суждения, надёжности и стабильности.',
   careers_side_title:'Предпочтительный профиль',
   careers_side_body:'Сильный английский, ясное деловое письмо, подтверждаемые рекомендации как плюс и опыт в документации, operations, клиентской поддержке, legal support или litigation support.'
  },
  es:{
   title:'Carreras | VitaCoreX LLC',
   desc:'Pagina de carreras para candidatos disciplinados capaces de trabajar en un entorno basado en documentacion.',
   hero_eyebrow:'Carreras',
   hero_title:'Trabaje con estructura, claridad y ejecucion disciplinada.',
   hero_lead:'Buscamos personas que puedan apoyar operaciones centradas en documentacion con buena redaccion, criterio, confiabilidad y consistencia.',
   careers_side_title:'Perfil preferido',
   careers_side_body:'Ingles solido, escritura empresarial clara, referencias verificables preferidas y experiencia previa en documentacion, operaciones, soporte al cliente, soporte legal o litigation support.'
  }
 },
 'corporate-legal':{
  en:{
   title:'Corporate Legal File Control | VitaCoreX LLC',
   desc:'Reduce attorney waste by fixing chronology, exhibits, issue framing, packet quality, and escalation logic before outside review begins.',
   hero_eyebrow:'Corporate legal file control',
   hero_title:'Corporate legal file control for operators that need counsel-ready files, cleaner escalation, and less attorney-rate cleanup.',
   hero_lead:'VitaCoreX structures chronology, exhibits, payment support, issue mapping, and escalation records so outside counsel receives a disciplined file instead of an expensive cleanup project.',
   who_h:'Where this fits',
   who_b:'Best for organizations with recurring contractual matters, recovery files, or dispute packets that need stronger preparation before outside review begins.',
   problem_h:'Why the economics matter',
   problem_b:'When chronology, exhibits, authorizations, and escalation records arrive fragmented, attorney time is consumed by administrative reconstruction instead of legal judgment.',
   deliver_h:'Typical control outputs',
   w1_h:'First-week work product',
   timeline_h:'Typical engagement rhythm',
   price_h:'Commercial structure',
   visuals_eyebrow:'Control architecture',
   visuals_title:'Visualize file quality, attorney-rate drag, and handoff readiness.',
   visuals_intro:'These tools help leadership teams measure file quality, attorney-rate drag, and handoff readiness in practical financial terms.',
   corporate_deliver_1:'Matter chronology cleanup',
   corporate_deliver_2:'Exhibit ordering logic',
   corporate_deliver_3:'Issue summary memo',
   corporate_deliver_4:'File map',
   corporate_deliver_5:'Counsel-ready packet',
   corporate_deliver_6:'Questions and gaps log',
   corporate_deliver_7:'Structured handoff notes',
   corporate_week1_body:'Initial issue map, first chronology pass, document request list, key gaps memo, and defined next-step routing.',
   corporate_timeline_body:'Most first-phase engagements are framed as a short sprint with a first work product in the first week and a structured review immediately after.',
   corporate_price_body:'Fixed-scope or staged pricing after intake and document review. No billable-hour surprise logic for first-stage cleanup work.'
  },
  ru:{
   title:'Контроль корпоративных юридических файлов | VitaCoreX LLC',
   desc:'Снижайте потери на ставке адвоката за счёт более чистой хронологии, приложений, качества пакета и логики эскалации ещё до внешнего review.',
   hero_eyebrow:'Контроль корпоративной юридической документации',
   hero_title:'Контроль корпоративной юридической документации для операторов, которым нужны файлы, готовые для counsel, более чистая эскалация и меньше дорогой юридической доработки.',
   hero_lead:'VitaCoreX выстраивает хронологию, приложения, платёжные подтверждения, карту вопросов и записи по эскалации так, чтобы внешний counsel получал дисциплинированный файл, а не дорогой проект по его очистке.',
   who_h:'Где это применяется',
   who_b:'Подходит организациям с повторяющимися договорными вопросами, recovery-файлами и спорными пакетами, которые нужно лучше подготовить до внешнего рассмотрения.',
   problem_h:'Почему это важно экономически',
   problem_b:'Когда хронология, приложения, авторизации и записи по эскалации поступают фрагментарно, время адвоката уходит на административную реконструкцию вместо правового анализа.',
   deliver_h:'Типичные результаты контроля',
   w1_h:'Результат первой недели',
   timeline_h:'Типичный ритм работы',
   price_h:'Коммерческая модель',
   visuals_eyebrow:'Архитектура контроля',
   visuals_title:'Оцените качество файла, потери на ставке counsel и готовность к передаче.',
   visuals_intro:'Эти инструменты помогают руководству измерять качество файла, потери на ставке counsel и готовность к передаче в практических финансовых терминах.',
   corporate_deliver_1:'Очистка хронологии дела',
   corporate_deliver_2:'Логика порядка приложений',
   corporate_deliver_3:'Memo по ключевым вопросам',
   corporate_deliver_4:'Карта файла',
   corporate_deliver_5:'Пакет, готовый для counsel',
   corporate_deliver_6:'Журнал вопросов и пробелов',
   corporate_deliver_7:'Структурированные handoff-заметки',
   corporate_week1_body:'Первичная карта вопросов, первый проход по хронологии, список запрашиваемых документов, memo по ключевым пробелам и определённая логика следующего шага.',
   corporate_timeline_body:'Большинство первых этапов оформляется как короткий спринт: первый рабочий результат в течение первой недели и структурированный review сразу после него.',
   corporate_price_body:'Фиксированный scope или поэтапное ценообразование после intake и review документов. Без сюрпризов с почасовой логикой на первом этапе cleanup.'
  },
  es:{
   title:'Control de archivos legales corporativos | VitaCoreX LLC',
   desc:'Reduzca el desperdicio legal corrigiendo cronologia, anexos, calidad del paquete y logica de escalacion antes de la revision externa.',
   hero_eyebrow:'Control corporativo de archivos legales',
   hero_title:'Control corporativo de archivos legales para operadores que necesitan expedientes listos para counsel, escalacion mas limpia y menos limpieza facturada a tarifa legal.',
   hero_lead:'VitaCoreX estructura cronologias, anexos, soporte de pago, mapas de issues y registros de escalacion para que el counsel externo reciba un expediente disciplinado y no un proyecto costoso de limpieza administrativa.',
   who_h:'Donde encaja',
   who_b:'Ideal para organizaciones con asuntos contractuales recurrentes, expedientes de recovery o paquetes de disputa que necesitan mejor preparacion antes de la revision externa.',
   problem_h:'Por que importa la economia',
   problem_b:'Cuando la cronologia, los anexos, las autorizaciones y los registros de escalacion llegan fragmentados, el tiempo del abogado se consume en reconstruccion administrativa en lugar de criterio legal.',
   deliver_h:'Resultados tipicos de control',
   w1_h:'Entregable de la primera semana',
   timeline_h:'Ritmo tipico de trabajo',
   price_h:'Estructura comercial',
   visuals_eyebrow:'Arquitectura de control',
   visuals_title:'Visualice la calidad del expediente, el drag a tarifa legal y la preparacion para handoff.',
   visuals_intro:'Estas herramientas ayudan al liderazgo a medir la calidad del expediente, el drag a tarifa legal y la preparacion para handoff en terminos financieros practicos.',
   corporate_deliver_1:'Limpieza de cronologia del asunto',
   corporate_deliver_2:'Logica de orden de anexos',
   corporate_deliver_3:'Memo de resumen de issues',
   corporate_deliver_4:'Mapa del expediente',
   corporate_deliver_5:'Paquete listo para counsel',
   corporate_deliver_6:'Registro de preguntas y vacios',
   corporate_deliver_7:'Notas estructuradas de handoff',
   corporate_week1_body:'Mapa inicial de issues, primera pasada de cronologia, lista documental, memo de vacios clave y enrutamiento del siguiente paso.',
   corporate_timeline_body:'La mayoria de los primeros compromisos se estructura como un sprint corto con un primer entregable dentro de la primera semana y una revision estructurada inmediatamente despues.',
   corporate_price_body:'Precio por alcance fijo o por etapas despues del intake y la revision documental. Sin sorpresas de horas facturables en la primera fase de limpieza.'
  }
 },
 'revenue-recovery':{
  en:{
   title:'Revenue Recovery Infrastructure | VitaCoreX LLC',
   desc:'Structured pre-collection infrastructure: segmentation, controlled offers, documented agreements, autopay discipline, escalation governance, and CFO-grade reporting.',
   hero_eyebrow:'Revenue recovery infrastructure',
   hero_title:'Revenue recovery infrastructure',
   hero_lead:'Institutional workflow design for operators that need stronger cash conversion, cleaner documentation, and less contingency leakage before agency escalation or outside legal spend expands.',
   exec_h:'Executive framing',
   exec_i:'This is a margin-protection, documentation-control, and cash-velocity system, not a traditional collections pitch.',
   calc_h:'Directional planning model',
   comp_h:'Typical operating components',
   revenue_framework_1:'Behavioral segmentation',
   revenue_framework_2:'Conditional offer conversion',
   revenue_framework_3:'Guarantor activation',
   revenue_framework_4:'ACH-first discipline',
   revenue_framework_5:'Litigation-ready documentation',
   revenue_framework_6:'90-day pilot',
   revenue_framework_7:'KPI dashboard',
   revenue_marker_1:'Recovery uplift',
   revenue_marker_2:'DSO improvement',
   revenue_marker_3:'Roll-to-agency reduction'
  },
  ru:{
   title:'Инфраструктура возврата выручки | VitaCoreX LLC',
   desc:'Структурированная pre-collection инфраструктура: сегментация, контролируемые предложения, документированные соглашения, дисциплина autopay, governance эскалации и отчётность уровня CFO.',
   hero_eyebrow:'Инфраструктура возврата выручки',
   hero_title:'Инфраструктура возврата выручки',
   hero_lead:'Институциональный дизайн workflow для операторов, которым нужны более сильная конверсия в кэш, более чистая документация и меньше contingency leakage до передачи в агентство или внешнего legal spend.',
   exec_h:'Executive-рамка',
   exec_i:'Это система защиты маржи, контроля документации и cash-velocity, а не обычный collections pitch.',
   calc_h:'Иллюстративная экономика',
   comp_h:'Типовые элементы operating-модели',
   revenue_framework_1:'Поведенческая сегментация',
   revenue_framework_2:'Конверсия условных предложений',
   revenue_framework_3:'Активация гаранта',
   revenue_framework_4:'Дисциплина ACH-first',
   revenue_framework_5:'Документация, готовая для litigation',
   revenue_framework_6:'90-дневный пилот',
   revenue_framework_7:'KPI-dashboard',
   revenue_marker_1:'Рост recovery',
   revenue_marker_2:'Улучшение DSO',
   revenue_marker_3:'Снижение передач в агентство'
  },
  es:{
   title:'Infraestructura de recuperacion de ingresos | VitaCoreX LLC',
   desc:'Infraestructura pre-cobranza estructurada: segmentacion, ofertas controladas, acuerdos documentados, disciplina de autopay, gobierno de escalacion y reporte de nivel CFO.',
   hero_eyebrow:'Infraestructura de recuperacion de ingresos',
   hero_title:'Infraestructura de recuperacion de ingresos',
   hero_lead:'Diseno institucional de flujos para operadores que necesitan mejor conversion a caja, documentacion mas limpia y menor fuga por contingencia antes de escalar a agencia o aumentar el costo legal externo.',
   exec_h:'Enfoque ejecutivo',
   exec_i:'Es un sistema de proteccion de margen, control documental y velocidad de caja, no un pitch tradicional de cobranza.',
   calc_h:'Economia ilustrativa',
   comp_h:'Componentes operativos tipicos',
   revenue_framework_1:'Segmentacion conductual',
   revenue_framework_2:'Conversion de ofertas condicionadas',
   revenue_framework_3:'Activacion de garante',
   revenue_framework_4:'Disciplina ACH-first',
   revenue_framework_5:'Documentacion lista para litigio',
   revenue_framework_6:'Piloto de 90 dias',
   revenue_framework_7:'Panel KPI',
   revenue_marker_1:'Mejora de recuperacion',
   revenue_marker_2:'Mejora de DSO',
   revenue_marker_3:'Reduccion de envios a agencia'
  }
 }
});
Object.assign(staticCopy, {
 home:[
  {selector:'.vcx-home-hero-note .pill', key:'home_note_pill'},
  {selector:'.vcx-home-hero-note h3', key:'home_note_title'},
  {selector:'.vcx-home-hero-note p', key:'home_note_body'},
  {selector:'.vcx-home-hero-note li:nth-child(1)', key:'home_note_1'},
  {selector:'.vcx-home-hero-note li:nth-child(2)', key:'home_note_2'},
  {selector:'.vcx-home-hero-note li:nth-child(3)', key:'home_note_3'},
  {selector:'.vcx-home-trust .vcx-trust-item:nth-child(1) .pill', key:'trust_1_pill'},
  {selector:'.vcx-home-trust .vcx-trust-item:nth-child(1) p', key:'trust_1_body'},
  {selector:'.vcx-home-trust .vcx-trust-item:nth-child(2) .pill', key:'trust_2_pill'},
  {selector:'.vcx-home-trust .vcx-trust-item:nth-child(2) p', key:'trust_2_body'},
  {selector:'.vcx-home-trust .vcx-trust-item:nth-child(3) .pill', key:'trust_3_pill'},
  {selector:'.vcx-home-trust .vcx-trust-item:nth-child(3) p', key:'trust_3_body'},
  {selector:'.vcx-home-trust .vcx-trust-item:nth-child(4) .pill', key:'trust_4_pill'},
  {selector:'.vcx-home-trust .vcx-trust-item:nth-child(4) p', key:'trust_4_body'},
  {selector:'.leak-grid .lux-card:nth-child(1) h3', key:'leak_1_h'},
  {selector:'.leak-grid .lux-card:nth-child(1) p', key:'leak_1_p'},
  {selector:'.leak-grid .lux-card:nth-child(2) h3', key:'leak_2_h'},
  {selector:'.leak-grid .lux-card:nth-child(2) p', key:'leak_2_p'},
  {selector:'.leak-grid .lux-card:nth-child(3) h3', key:'leak_3_h'},
  {selector:'.leak-grid .lux-card:nth-child(3) p', key:'leak_3_p'},
  {selector:'.leak-grid .lux-card:nth-child(4) h3', key:'leak_4_h'},
  {selector:'.leak-grid .lux-card:nth-child(4) p', key:'leak_4_p'},
  {selector:'.vcx-service-grid .vcx-service-card:nth-child(1) p', key:'svc_card_1_p'},
  {selector:'.vcx-service-grid .vcx-service-card:nth-child(2) p', key:'svc_card_2_p'},
  {selector:'.vcx-service-grid .vcx-service-card:nth-child(3) h3', key:'svc_card_3_h'},
  {selector:'.vcx-service-grid .vcx-service-card:nth-child(3) p', key:'svc_card_3_p'},
  {selector:'.pilot-layout .timeline-item:nth-child(1) p', key:'step_1_p'},
  {selector:'.pilot-layout .timeline-item:nth-child(2) p', key:'step_2_p'},
  {selector:'.pilot-layout .timeline-item:nth-child(3) p', key:'step_3_p'},
  {selector:'.vcx-pilot-outcome .pill', key:'pilot_outcome_pill'},
  {selector:'.vcx-pilot-outcome h3', key:'pilot_outcome_title'},
  {selector:'.vcx-pilot-outcome p', key:'pilot_outcome_body'},
  {selector:'.vcx-pilot-outcome li:nth-child(1)', key:'pilot_outcome_1'},
  {selector:'.vcx-pilot-outcome li:nth-child(2)', key:'pilot_outcome_2'},
  {selector:'.vcx-pilot-outcome li:nth-child(3)', key:'pilot_outcome_3'},
  {selector:'.proof-band .eyebrow', key:'proof_eyebrow'},
  {selector:'.proof-band h2', key:'proof_title'},
  {selector:'.proof-band .section-intro', key:'proof_intro'}
 ],
 resources:[
  {selector:'.hero-side h3', key:'resources_side_title'},
  {selector:'.hero-side p', key:'resources_side_body'},
  {selector:'.resource-grid .resource-card:nth-child(1) h3', key:'res1_title'},
  {selector:'.resource-grid .resource-card:nth-child(1) p', key:'res1_desc'},
  {selector:'.resource-grid .resource-card:nth-child(1) .meta .pill:nth-child(2)', key:'resources_tag_1'},
  {selector:'.resource-grid .resource-card:nth-child(2) h3', key:'res2_title'},
  {selector:'.resource-grid .resource-card:nth-child(2) p', key:'res2_desc'},
  {selector:'.resource-grid .resource-card:nth-child(2) .meta .pill:nth-child(2)', key:'resources_tag_2'},
  {selector:'.resource-grid .resource-card:nth-child(3) h3', key:'res3_title'},
  {selector:'.resource-grid .resource-card:nth-child(3) p', key:'res3_desc'},
  {selector:'.resource-grid .resource-card:nth-child(3) .meta .pill:nth-child(2)', key:'resources_tag_3'},
  {selector:'.resource-grid .resource-card:nth-child(4) h3', key:'res4_title'},
  {selector:'.resource-grid .resource-card:nth-child(4) p', key:'res4_desc'},
  {selector:'.resource-grid .resource-card:nth-child(4) .meta .pill:nth-child(2)', key:'resources_tag_4'}
 ],
 'individual-services':[
  {selector:'.hero-side h3', key:'individual_side_title'},
  {selector:'.hero-side p', key:'individual_side_body'}
 ],
 careers:[
  {selector:'.hero-side h3', key:'careers_side_title'},
  {selector:'.hero-side p', key:'careers_side_body'}
 ],
 'corporate-legal':[
  {selector:'.grid-2.vcx-stack-desktop .card:nth-child(1) li:nth-child(1)', key:'corporate_deliver_1'},
  {selector:'.grid-2.vcx-stack-desktop .card:nth-child(1) li:nth-child(2)', key:'corporate_deliver_2'},
  {selector:'.grid-2.vcx-stack-desktop .card:nth-child(1) li:nth-child(3)', key:'corporate_deliver_3'},
  {selector:'.grid-2.vcx-stack-desktop .card:nth-child(1) li:nth-child(4)', key:'corporate_deliver_4'},
  {selector:'.grid-2.vcx-stack-desktop .card:nth-child(1) li:nth-child(5)', key:'corporate_deliver_5'},
  {selector:'.grid-2.vcx-stack-desktop .card:nth-child(1) li:nth-child(6)', key:'corporate_deliver_6'},
  {selector:'.grid-2.vcx-stack-desktop .card:nth-child(1) li:nth-child(7)', key:'corporate_deliver_7'},
  {selector:'.grid-2.vcx-stack-desktop .card:nth-child(2) p:nth-of-type(1)', key:'corporate_week1_body'},
  {selector:'.grid-2.vcx-stack-desktop .card:nth-child(2) p:nth-of-type(2)', key:'corporate_timeline_body'},
  {selector:'.grid-2.vcx-stack-desktop .card:nth-child(2) p:nth-of-type(3)', key:'corporate_price_body'},
  {selector:'.legal-estimator-section .section-head .eyebrow', key:'corporate_estimator_eyebrow'},
  {selector:'.legal-estimator-section .section-head h2', key:'corporate_estimator_title'},
  {selector:'.legal-estimator-section .section-head .section-intro', key:'corporate_estimator_intro'},
  {selector:'.legal-estimator-section .engine-card:nth-child(1) .pill', key:'corporate_engine_pill'},
  {selector:'.legal-estimator-section .engine-card:nth-child(1) h3', key:'corporate_engine_title'},
  {selector:'.legal-estimator-section .engine-card:nth-child(1) label:nth-of-type(1)', key:'corporate_engine_label_files'},
  {selector:'.legal-estimator-section .engine-card:nth-child(1) label:nth-of-type(2)', key:'corporate_engine_label_rate'},
  {selector:'.legal-estimator-section .engine-card:nth-child(1) label:nth-of-type(3)', key:'corporate_engine_label_hours'},
  {selector:'.legal-estimator-section .engine-card:nth-child(1) button', key:'corporate_engine_button'},
  {selector:'.legal-estimator-section .engine-card:nth-child(2) .pill', key:'corporate_impact_pill'},
  {selector:'.legal-estimator-section .engine-card:nth-child(2) h3', key:'corporate_impact_title'},
  {selector:'#legalResult strong', key:'corporate_result_label'},
  {selector:'#legalResult p', key:'corporate_result_body'},
  {selector:'.legal-estimator-section .engine-card:nth-child(2) .metric-card:nth-child(1) .metric-label', key:'corporate_metric_exposure'},
  {selector:'.legal-estimator-section .engine-card:nth-child(2) .metric-card:nth-child(2) .metric-label', key:'corporate_metric_hours'}
 ],
 'revenue-recovery':[
  {selector:'.hero-side .problem-item:nth-child(2) h3', key:'revenue_patent_title'},
  {selector:'.hero-side .problem-item:nth-child(2) p', key:'revenue_patent_body'},
  {selector:'.grid-2.vcx-flow-wide-left .card:nth-child(1) h2', key:'revenue_framework_title'},
  {selector:'.grid-2.vcx-flow-wide-left .card:nth-child(1) li:nth-child(1)', key:'revenue_framework_1'},
  {selector:'.grid-2.vcx-flow-wide-left .card:nth-child(1) li:nth-child(2)', key:'revenue_framework_2'},
  {selector:'.grid-2.vcx-flow-wide-left .card:nth-child(1) li:nth-child(3)', key:'revenue_framework_3'},
  {selector:'.grid-2.vcx-flow-wide-left .card:nth-child(1) li:nth-child(4)', key:'revenue_framework_4'},
  {selector:'.grid-2.vcx-flow-wide-left .card:nth-child(1) li:nth-child(5)', key:'revenue_framework_5'},
  {selector:'.grid-2.vcx-flow-wide-left .card:nth-child(1) li:nth-child(6)', key:'revenue_framework_6'},
  {selector:'.grid-2.vcx-flow-wide-left .card:nth-child(1) li:nth-child(7)', key:'revenue_framework_7'},
  {selector:'.grid-2.vcx-flow-wide-left .chart h2', key:'revenue_markers_title'},
  {selector:'.grid-2.vcx-flow-wide-left .chart .row:nth-child(1) span', key:'revenue_marker_1'},
  {selector:'.grid-2.vcx-flow-wide-left .chart .row:nth-child(2) span', key:'revenue_marker_2'},
  {selector:'.grid-2.vcx-flow-wide-left .chart .row:nth-child(3) span', key:'revenue_marker_3'},
  {selector:'#calc .small-note', key:'revenue_calc_note'},
  {selector:'#calc .card:nth-child(2) h3', key:'revenue_output_title'},
  {selector:'#calc .out-row:nth-child(1) span', key:'revenue_out_agency'},
  {selector:'#calc .out-row:nth-child(2) span', key:'revenue_out_pre'},
  {selector:'#calc .out-row:nth-child(3) span', key:'revenue_out_lift'},
  {selector:'#calc .out-row:nth-child(4) span', key:'revenue_out_lift_pct'},
  {selector:'h2[data-page="comp_h"] + p', key:'revenue_components_body'},
  {selector:'#vcxKpiCharts .section-head .eyebrow', key:'revenue_examples_eyebrow'},
  {selector:'#vcxKpiCharts .section-head h2', key:'revenue_examples_title'},
  {selector:'#vcxKpiCharts .section-head .section-intro', key:'revenue_examples_intro'},
  {selector:'#vcxKpiCharts .kpi-card:nth-child(1) .kpi-label', key:'revenue_case1_label'},
  {selector:'#vcxKpiCharts .kpi-card:nth-child(1) .small-note', key:'revenue_case1_note'},
  {selector:'#vcxKpiCharts .kpi-card:nth-child(2) .kpi-label', key:'revenue_case2_label'},
  {selector:'#vcxKpiCharts .kpi-card:nth-child(2) .small-note', key:'revenue_case2_note'},
  {selector:'#vcxKpiCharts .kpi-card:nth-child(3) .kpi-label', key:'revenue_case3_label'},
  {selector:'#vcxKpiCharts .kpi-card:nth-child(3) .small-note', key:'revenue_case3_note'}
 ]
});
Object.assign(extra.en, {
 company_band_eyebrow:'For Companies',
 company_band_title:'Move from uncertainty to a controlled operating decision.',
 company_band_body:'Use a confidential review to confirm the right workstream, the right documentation package, and the right next executive step before outside cost expands.',
 individual_band_eyebrow:'For Individuals',
 individual_band_title:'Selected individual matters follow a separate intake path.',
 individual_band_body:'Use the structured individual intake when a private-client matter needs orderly routing without overtaking the corporate platform.',
 thank_company_title:'Thank you. Your confidential review request is in queue.',
 thank_company_lead:'VitaCoreX received your company review request and placed it in the confidential review queue. An acknowledgement will follow after the initial screening.',
 thank_individual_title:'Thank you. Your service request is in queue.',
 thank_individual_lead:'VitaCoreX received your individual-service request and placed it in the structured intake queue. An acknowledgement will follow after the initial screening.',
 thank_window_company:'Acknowledgement within 24 business hours',
 thank_window_individual:'Acknowledgement within one business day',
 intake_company_eyebrow:'Confidential company review',
 intake_company_title:'Route the company matter into the right workstream before outside cost expands.',
 intake_company_lead:'Use this review to identify the correct service line, the immediate document gaps, and the next executive step.',
 intake_company_side_title:'Company review output',
 intake_company_side_body:'Service line, file readiness, response window, and next-step routing are generated after submission.',
 intake_company_button:'Request confidential review',
 intake_individual_eyebrow:'Structured service request',
 intake_individual_title:'Start the selected individual-service intake with a cleaner first packet.',
 intake_individual_lead:'Use this intake to route the matter correctly, confirm what should be sent now, and keep the private-client path structured.',
 intake_individual_side_title:'Individual service output',
 intake_individual_side_body:'Service fit, document needs, response window, and next-step routing are updated as the intake is completed.',
 intake_individual_button:'Start structured intake',
 services_individuals_title:'Selected individual services',
 services_individuals_intro:'Selected private-client matters remain available on a limited basis. Corporate advisory remains the primary VitaCoreX platform.',
 ind1_title:'Contracts and documentation',
 ind1_desc:'Administrative support for contract drafting, document review, business forms, demand letters, and organized support packets.',
 ind1_b1:'Contract drafting support',
 ind1_b2:'Document review support',
 ind1_b3:'Business forms',
 ind1_b4:'Demand letters',
 ind1_b5:'Support packets',
 ind2_title:'Immigration documents',
 ind2_desc:'Packet organization, form guidance, submission-readiness review, and evidence structuring for personal filing support.',
 ind2_b1:'Packet organization',
 ind2_b2:'Form guidance',
 ind2_b3:'Submission-readiness review',
 ind2_b4:'Evidence structuring',
 ind2_b5:'Administrative support',
 ind3_title:'Auto purchase review',
 ind3_desc:'Buyer-side review before signing, including fee analysis, payment-structure clarity, and negotiation support.',
 ind3_b1:'Dealer contract review',
 ind3_b2:'Fee analysis',
 ind3_b3:'Payment review',
 ind3_b4:'Negotiation support',
 ind3_b5:'Risk summary',
 ind4_title:'Business plans',
 ind4_desc:'Executive summary, investor narrative, launch plan, financial framing, and pitch support.',
 ind4_b1:'Executive summary',
 ind4_b2:'Investor narrative',
 ind4_b3:'Launch plan',
 ind4_b4:'Financial framing',
 ind4_b5:'Pitch support',
 ind5_title:'Company formation support',
 ind5_desc:'Structured support for entity launch, filing packets, and launch-readiness documentation.',
 ind5_b1:'Entity formation support',
 ind5_b2:'Opening packages',
 ind5_b3:'Filing support',
 ind5_b4:'Business setup packet',
 ind5_b5:'Launch checklist',
 ind6_title:'Translation and localization',
 ind6_desc:'Translation support, bilingual document cleanup, and structured localization for business or filing materials.',
 ind6_b1:'Document translation support',
 ind6_b2:'Bilingual cleanup',
 ind6_b3:'Localization review',
 ind6_b4:'Evidence translation pack',
 ind6_b5:'Administrative coordination',
 field_phone_careers:'Phone',
 field_role:'Role of interest',
 select_role:'Select role',
 role_ops:'Operations support',
 role_docs:'Documentation support',
 role_intake:'Intake support',
 role_translation:'Translation support',
 role_admin:'Administrative support',
 role_client:'Client coordination',
 role_bizdocs:'Business documentation support',
 field_background:'Short background',
 careers_placeholder:'Briefly introduce yourself, note the role you want, and describe the work you can support.',
 careers_helper:'Complete all required fields to route the application for review.',
 careers_who_title:'Who we look for',
 careers_apply_title:'How to apply',
 careers_t1:'Disciplined people who can work inside a documentation-first operating model.',
 careers_t2:'Strong written and spoken English.',
 careers_t3:'Verifiable recommendations are strongly preferred.',
 careers_t4:'Russian-speaking candidates with excellent English receive priority.',
 careers_mobile_title:'Careers - mobile application',
 careers_mobile_body:'We look for disciplined, reliable people who can support documentation-first operations. Strong English is required. Verifiable recommendations are strongly preferred. In your application, include your full name, phone number, city and state, role of interest, a short introduction, and your resume or CV.',
 careers_mobile_button2:'Open application form'
});
Object.assign(extra.ru, {
 company_band_eyebrow:'Для компаний',
 company_band_title:'Переведите неопределённость в управляемое операционное решение.',
 company_band_body:'Конфиденциальный разбор помогает подтвердить правильный поток работ, нужный пакет документов и следующий шаг для руководства до роста внешних расходов.',
 individual_band_eyebrow:'Для частных клиентов',
 individual_band_title:'Избранные частные запросы идут по отдельному intake-пути.',
 individual_band_body:'Используйте структурированный intake для частного запроса, когда вопрос нужно аккуратно направить, не смещая корпоративную платформу.',
 thank_company_title:'Спасибо. Ваш запрос на конфиденциальный разбор поставлен в очередь.',
 thank_company_lead:'VitaCoreX получил ваш корпоративный запрос и поставил его в очередь на конфиденциальный разбор. После первичного скрининга будет отправлено подтверждение.',
 thank_individual_title:'Спасибо. Ваш запрос на услугу поставлен в очередь.',
 thank_individual_lead:'VitaCoreX получил ваш запрос по частной услуге и поставил его в очередь на структурированный разбор. После первичного скрининга будет отправлено подтверждение.',
 thank_window_company:'Подтверждение в течение 24 рабочих часов',
 thank_window_individual:'Подтверждение в течение одного рабочего дня',
 intake_company_eyebrow:'Конфиденциальный корпоративный разбор',
 intake_company_title:'Направьте корпоративный вопрос в правильный поток работ до роста внешних расходов.',
 intake_company_lead:'Этот разбор помогает определить нужное направление работ, ближайшие пробелы в документах и следующий шаг для руководства.',
 intake_company_side_title:'Результат корпоративного разбора',
 intake_company_side_body:'После отправки определяется сервисная линия, готовность файла, окно ответа и дальнейшая маршрутизация.',
 intake_company_button:'Запросить конфиденциальный разбор',
 intake_individual_eyebrow:'Структурированный запрос на услугу',
 intake_individual_title:'Начните разбор выбранной частной услуги с более чистого первого пакета.',
 intake_individual_lead:'Этот intake помогает правильно направить вопрос, подтвердить, что нужно отправить сейчас, и сохранить частный путь структурированным.',
 intake_individual_side_title:'Результат по частной услуге',
 intake_individual_side_body:'По мере заполнения intake уточняются соответствие услуги, потребность в документах, окно ответа и следующий шаг.',
 intake_individual_button:'Начать структурированный разбор',
 services_individuals_title:'Избранные частные услуги',
 services_individuals_intro:'Избранные private-client запросы остаются доступны в ограниченном формате. Корпоративный advisory остаётся основной платформой VitaCoreX.',
 ind1_title:'Договоры и документы',
 ind1_desc:'Административная поддержка по подготовке договоров, проверке документов, бизнес-форм и структурированных пакетов.',
 ind1_b1:'Поддержка подготовки договоров',
 ind1_b2:'Проверка документов',
 ind1_b3:'Бизнес-формы',
 ind1_b4:'Письма-требования',
 ind1_b5:'Пакеты поддержки',
 ind2_title:'Иммиграционные документы',
 ind2_desc:'Организация пакета, сопровождение по формам, проверка готовности к подаче и структурирование доказательств.',
 ind2_b1:'Организация пакета',
 ind2_b2:'Сопровождение по формам',
 ind2_b3:'Проверка готовности к подаче',
 ind2_b4:'Структурирование доказательств',
 ind2_b5:'Административная поддержка',
 ind3_title:'Проверка покупки автомобиля',
 ind3_desc:'Проверка условий до подписания, анализ сборов, ясность по платежной структуре и поддержка переговоров.',
 ind3_b1:'Проверка дилерского договора',
 ind3_b2:'Анализ сборов',
 ind3_b3:'Проверка платежной структуры',
 ind3_b4:'Поддержка переговоров',
 ind3_b5:'Краткий риск-обзор',
 ind4_title:'Бизнес-планы',
 ind4_desc:'Executive summary, narrative для инвестора, план запуска, финансовая рамка и поддержка презентации.',
 ind4_b1:'Executive summary',
 ind4_b2:'Narrative для инвестора',
 ind4_b3:'План запуска',
 ind4_b4:'Финансовая рамка',
 ind4_b5:'Поддержка презентации',
 ind5_title:'Поддержка открытия компании',
 ind5_desc:'Структурированная помощь по запуску юрлица, filing-пакетам и стартовой документации.',
 ind5_b1:'Поддержка по созданию юрлица',
 ind5_b2:'Пакеты открытия',
 ind5_b3:'Поддержка filing',
 ind5_b4:'Стартовый бизнес-пакет',
 ind5_b5:'Чек-лист запуска',
 ind6_title:'Перевод и локализация',
 ind6_desc:'Поддержка перевода документов, двуязычная вычитка и структурированная локализация для бизнес- или filing-материалов.',
 ind6_b1:'Поддержка перевода документов',
 ind6_b2:'Двуязычная вычитка',
 ind6_b3:'Проверка локализации',
 ind6_b4:'Пакет перевода доказательств',
 ind6_b5:'Административная координация',
 field_phone_careers:'Телефон',
 field_role:'Интересующая роль',
 select_role:'Выберите роль',
 role_ops:'Операционная поддержка',
 role_docs:'Поддержка документации',
 role_intake:'Поддержка intake',
 role_translation:'Поддержка перевода',
 role_admin:'Административная поддержка',
 role_client:'Координация с клиентами',
 role_bizdocs:'Поддержка бизнес-документации',
 field_background:'Краткая информация о вас',
 careers_placeholder:'Коротко представьтесь, укажите интересующую роль и опишите, какую работу можете поддерживать.',
 careers_helper:'Заполните все обязательные поля, чтобы направить заявку на рассмотрение.',
 careers_who_title:'Кого мы ищем',
 careers_apply_title:'Как откликнуться',
 careers_t1:'Дисциплинированных людей, способных работать в документационно-ориентированной операционной модели.',
 careers_t2:'Сильный письменный и разговорный английский.',
 careers_t3:'Подтверждаемые рекомендации крайне желательны.',
 careers_t4:'Русскоязычные кандидаты с отличным английским получают приоритет.',
 careers_mobile_title:'Сотрудничество - мобильная заявка',
 careers_mobile_body:'Мы ищем дисциплинированных и надёжных людей для поддержки документационно-ориентированных операций. Требуется сильный английский. Подтверждаемые рекомендации крайне желательны. В заявке укажите ФИО, телефон, город и штат, интересующую роль, короткое представление и приложите резюме или CV.',
 careers_mobile_button2:'Открыть форму заявки'
});
Object.assign(extra.es, {
 company_band_eyebrow:'Para empresas',
 company_band_title:'Convierta la incertidumbre en una decision operativa controlada.',
 company_band_body:'La revision confidencial confirma la linea de trabajo correcta, el paquete documental adecuado y el siguiente paso ejecutivo antes de que crezca el costo externo.',
 individual_band_eyebrow:'Para particulares',
 individual_band_title:'Los asuntos individuales seleccionados siguen una via de intake separada.',
 individual_band_body:'Use la evaluacion estructurada para asuntos privados cuando necesite orden y claridad sin desplazar la plataforma corporativa.',
 thank_company_title:'Gracias. Su solicitud de revision confidencial esta en cola.',
 thank_company_lead:'VitaCoreX recibio su solicitud corporativa y la coloco en la cola de revision confidencial. La confirmacion llegara despues del filtro inicial.',
 thank_individual_title:'Gracias. Su solicitud de servicio esta en cola.',
 thank_individual_lead:'VitaCoreX recibio su solicitud individual y la coloco en la cola de evaluacion estructurada. La confirmacion llegara despues del filtro inicial.',
 thank_window_company:'Confirmacion dentro de 24 horas habiles',
 thank_window_individual:'Confirmacion dentro de un dia habil',
 intake_company_eyebrow:'Revision confidencial corporativa',
 intake_company_title:'Encamine el asunto corporativo al flujo correcto antes de que crezca el costo externo.',
 intake_company_lead:'Esta revision ayuda a identificar la linea de servicio correcta, las brechas documentales inmediatas y el siguiente paso ejecutivo.',
 intake_company_side_title:'Resultado de la revision corporativa',
 intake_company_side_body:'Despues del envio se define la linea de servicio, la preparacion del expediente, la ventana de respuesta y el siguiente enrutamiento.',
 intake_company_button:'Solicitar revision confidencial',
 intake_individual_eyebrow:'Solicitud estructurada de servicio',
 intake_individual_title:'Inicie el intake del servicio individual seleccionado con un primer paquete mas limpio.',
 intake_individual_lead:'Este intake ayuda a encaminar correctamente el asunto, confirmar que debe enviarse ahora y mantener la ruta privada en orden.',
 intake_individual_side_title:'Resultado del servicio individual',
 intake_individual_side_body:'A medida que se completa el intake se actualizan el encaje del servicio, la necesidad documental, la ventana de respuesta y el siguiente paso.',
 intake_individual_button:'Iniciar evaluacion estructurada',
 services_individuals_title:'Servicios individuales seleccionados',
 services_individuals_intro:'Algunos asuntos privados siguen disponibles de forma limitada. La asesoria corporativa sigue siendo la plataforma principal de VitaCoreX.',
 ind1_title:'Contratos y documentacion',
 ind1_desc:'Soporte administrativo para redaccion de contratos, revision documental, formularios de negocio y paquetes organizados.',
 ind1_b1:'Apoyo en redaccion contractual',
 ind1_b2:'Revision de documentos',
 ind1_b3:'Formularios de negocio',
 ind1_b4:'Cartas de requerimiento',
 ind1_b5:'Paquetes de soporte',
 ind2_title:'Documentos migratorios',
 ind2_desc:'Organizacion del paquete, guia de formularios, revision de preparacion para envio y estructura de evidencia.',
 ind2_b1:'Organizacion del paquete',
 ind2_b2:'Guia de formularios',
 ind2_b3:'Revision previa al envio',
 ind2_b4:'Estructura de evidencia',
 ind2_b5:'Soporte administrativo',
 ind3_title:'Revision de compra de auto',
 ind3_desc:'Revision del lado del comprador antes de firmar, con analisis de cargos, claridad de pagos y apoyo de negociacion.',
 ind3_b1:'Revision de contrato del dealer',
 ind3_b2:'Analisis de cargos',
 ind3_b3:'Revision de pagos',
 ind3_b4:'Apoyo de negociacion',
 ind3_b5:'Resumen de riesgos',
 ind4_title:'Planes de negocio',
 ind4_desc:'Resumen ejecutivo, narrativa para inversionistas, plan de lanzamiento, marco financiero y apoyo de pitch.',
 ind4_b1:'Resumen ejecutivo',
 ind4_b2:'Narrativa para inversionistas',
 ind4_b3:'Plan de lanzamiento',
 ind4_b4:'Marco financiero',
 ind4_b5:'Apoyo de pitch',
 ind5_title:'Soporte para formacion de empresa',
 ind5_desc:'Apoyo estructurado para constituir la entidad, preparar paquetes de filing y organizar documentos de lanzamiento.',
 ind5_b1:'Soporte de constitucion',
 ind5_b2:'Paquetes de apertura',
 ind5_b3:'Soporte de filing',
 ind5_b4:'Paquete de puesta en marcha',
 ind5_b5:'Checklist de lanzamiento',
 ind6_title:'Traduccion y localizacion',
 ind6_desc:'Soporte de traduccion documental, revision bilingue y localizacion estructurada para materiales de negocio o filing.',
 ind6_b1:'Soporte de traduccion documental',
 ind6_b2:'Revision bilingue',
 ind6_b3:'Revision de localizacion',
 ind6_b4:'Paquete de traduccion de evidencia',
 ind6_b5:'Coordinacion administrativa',
 field_phone_careers:'Telefono',
 field_role:'Rol de interes',
 select_role:'Seleccione un rol',
 role_ops:'Soporte operativo',
 role_docs:'Soporte documental',
 role_intake:'Soporte de intake',
 role_translation:'Soporte de traduccion',
 role_admin:'Soporte administrativo',
 role_client:'Coordinacion con clientes',
 role_bizdocs:'Soporte de documentacion comercial',
 field_background:'Breve trayectoria',
 careers_placeholder:'Preséntese brevemente, indique el rol que busca y describa el trabajo que puede apoyar.',
 careers_helper:'Complete todos los campos obligatorios para enviar la postulacion a revision.',
 careers_who_title:'A quien buscamos',
 careers_apply_title:'Como postular',
 careers_t1:'Personas disciplinadas capaces de trabajar dentro de un modelo operativo basado en documentacion.',
 careers_t2:'Ingles solido, escrito y hablado.',
 careers_t3:'Las referencias verificables son muy valoradas.',
 careers_t4:'Los candidatos rusohablantes con excelente ingles reciben prioridad.',
 careers_mobile_title:'Carreras - solicitud movil',
 careers_mobile_body:'Buscamos personas disciplinadas y confiables para apoyar operaciones basadas en documentacion. Se requiere ingles solido. Las referencias verificables son muy valoradas. En su postulacion incluya nombre completo, telefono, ciudad y estado, rol de interes, una breve presentacion y su CV.',
 careers_mobile_button2:'Abrir formulario de solicitud'
});
Object.assign(extra.en, {
 footer_copy:'© 2026 VitaCoreX LLC. All rights reserved.',
 services_individuals_title:'Selected individual services',
 services_individuals_intro:'Selected individual-service matters remain available on a limited basis. Corporate advisory remains the primary VitaCoreX path.',
 see_all_individuals:'Review selected individual services',
 individual_band_body:'Use the individual-service intake when a private matter needs a disciplined secondary path without diluting the corporate platform.',
 intake_individual_title:'Start the selected individual-service request with a cleaner first packet.',
 intake_individual_lead:'Use this request to route the matter correctly, confirm what should be sent now, and keep the individual-service path structured.'
});
Object.assign(extra.ru, {
 brand_tag:'Исполнительная инфраструктура возврата выручки и контроля документации',
 home:'Главная',
 file:'Контроль корпоративного юридического досье',
 recovery:'Инфраструктура возврата выручки',
 intake:'Структурированный первичный разбор',
 resources:'Материалы для руководства',
 additional:'Избранные частные услуги',
 careers:'Сотрудничество',
 contact:'Запросить консультацию',
 cta_intake:'Запросить конфиденциальный разбор',
 cta_briefs:'Открыть материал для руководства',
 order_services:'Запросить услугу',
 cta_email:'Написать по email',
 cta_apply:'Откликнуться по email',
 clock_vcx:'Время VitaCoreX',
 clock_local:'Ваше время',
 clock_local_sub:'Локально',
 market_pulse:'Рыночный ориентир',
 market_note:'Справочная лента по акциям США, золоту и нефти.',
 gate_title:'Открыть материал для руководства',
 gate_copy:'Оставьте данные, чтобы открыть PDF и сохранить аккуратную логику дальнейшего контакта.',
 gate_submit:'Открыть PDF',
 gate_cancel:'Отмена',
 gate_success:'Доступ открыт. Материал открывается.',
 gate_failure:'Не удалось отправить форму. Попробуйте ещё раз или напишите на email.',
 footer_disc:'VitaCoreX LLC оказывает административную, документационную, операционную и бизнес-поддержку. Компания не является юридической фирмой и не осуществляет юридическое представительство. Правовая стратегия и юридические советы относятся к компетенции лицензированного адвоката.',
 footer_copy:'© 2026 VitaCoreX LLC. Все права защищены.',
 footer_operator_note:'Тампа, Флорида / операционная консультационная фирма с покрытием по США',
 footer_scope_note:'Разборы на базе документов для инфраструктуры возврата выручки, контроля корпоративного юридического досье и материалов для руководства.',
 footer_email:'Электронная почта',
 nav_companies:'Для компаний',
 nav_recovery:'Возврат выручки',
 nav_brief:'Материал для руководства',
 nav_individuals:'Для частных клиентов',
 nav_confidential:'Конфиденциальный разбор',
 footer_companies_title:'Для компаний',
 footer_individuals_title:'Для частных клиентов',
 footer_careers_link:'Сотрудничество',
 cta_confidential_review:'Запросить конфиденциальный разбор',
 cta_strategy_call:'Назначить стратегический звонок',
 cta_review_brief:'Открыть материал для руководства',
 cta_request_service:'Запросить услугу',
 cta_start_intake:'Начать структурированный разбор',
 dock_brief:'Материал',
 dock_strategy:'Стратегия',
 dock_companies:'Компании',
 dock_individuals:'Частные клиенты',
 client_company:'Компания',
 client_individual:'Частное лицо',
 request_review:'Начать структурированный разбор',
 company_band_eyebrow:'Для компаний',
 company_band_title:'Переведите неопределённость по файлу в управляемое следующее решение.',
 company_band_body:'Конфиденциальный разбор помогает подтвердить правильное направление работ, нужный пакет документов и следующий шаг для руководства до роста внешних расходов.',
 individual_band_eyebrow:'Для частных клиентов',
 individual_band_title:'Избранные частные запросы проходят по отдельному структурированному маршруту.',
 individual_band_body:'Используйте структурированный запрос на услугу, когда частный вопрос нужно аккуратно направить, не смещая корпоративную платформу.',
 intake_company_eyebrow:'Конфиденциальный разбор компании',
 intake_company_title:'Направьте корпоративный вопрос в нужную сервисную линию до роста внешних расходов.',
 intake_company_lead:'Этот разбор помогает определить нужное направление работ, ближайшие пробелы в документах и следующий шаг для руководства.',
 intake_company_side_title:'Результат корпоративного разбора',
 intake_company_side_body:'После отправки уточняются сервисная линия, готовность файла, окно ответа и дальнейшая маршрутизация.',
 intake_company_button:'Запросить конфиденциальный разбор',
 intake_individual_eyebrow:'Структурированный запрос на услугу',
 intake_individual_title:'Начните запрос по выбранной частной услуге с более чистого первого пакета.',
 intake_individual_lead:'Используйте эту форму, чтобы правильно направить вопрос, подтвердить, что нужно отправить сейчас, и сохранить частный маршрут структурированным.',
 intake_individual_side_title:'Результат запроса по услуге',
 intake_individual_side_body:'По мере заполнения формы уточняются соответствие услуги, перечень документов, окно ответа и следующий шаг.',
 intake_individual_button:'Начать структурированный разбор',
 thank_company_cta:'Назначить стратегический звонок',
 thank_individual_cta:'Начать структурированный разбор',
 services_individuals_title:'Избранные частные услуги',
 services_individuals_intro:'Избранные частные запросы доступны в ограниченном формате. Корпоративное направление остаётся основной платформой VitaCoreX.',
 see_all_individuals:'Смотреть избранные частные услуги',
 ind1_title:'Договоры и документация',
 ind1_desc:'Административная поддержка по подготовке договоров, проверке документов, деловым формам, письмам-требованиям и структурированным пакетам материалов.',
 ind1_b1:'Подготовка договоров',
 ind1_b2:'Проверка документов',
 ind1_b3:'Деловые формы',
 ind1_b4:'Письма-требования',
 ind1_b5:'Пакеты поддержки',
 ind2_desc:'Организация пакета, сопровождение по формам, проверка готовности к подаче и структурирование доказательств.',
 ind3_desc:'Проверка сделки до подписания: анализ комиссий, логики платежей и поддержка переговоров.',
 ind3_b2:'Анализ комиссий',
 ind4_desc:'Резюме проекта, логика для инвестора, план запуска, финансовая рамка и поддержка презентации.',
 ind4_b1:'Резюме проекта',
 ind4_b2:'Логика для инвестора',
 ind4_b5:'Поддержка презентации',
 ind5_desc:'Структурированная помощь по запуску компании, пакетам регистрации, подаче документов и стартовой документации.',
 ind5_b3:'Поддержка подачи документов',
 ind5_b5:'Контрольный список запуска',
 ind6_desc:'Поддержка перевода документов, двуязычная редактура и структурированная локализация материалов для бизнеса или подачи.',
 role_intake:'Поддержка первичного разбора',
 careers_t1:'Дисциплинированные кандидаты, умеющие работать в операционной модели, основанной на документах.',
 careers_t2:'Сильный письменный и разговорный английский.',
 careers_t3:'Подтверждаемые рекомендации крайне желательны.',
 careers_t4:'Русскоязычные кандидаты с отличным английским получают приоритет.',
 careers_mobile_title:'Сотрудничество - мобильная заявка',
 careers_mobile_body:'Мы ищем дисциплинированных и надёжных людей для поддержки операций, основанных на документах. Требуется сильный английский. Подтверждаемые рекомендации крайне желательны. В заявке укажите ФИО, телефон, город и штат, интересующую роль, короткое представление и приложите резюме или CV.',
 service_recovery:'Инфраструктура возврата выручки',
 service_file:'Контроль корпоративного юридического досье',
 service_intake:'Структурированный первичный разбор и сборка пакета',
 service_briefs:'Запрос на материал для руководства'
});
Object.assign(extra.es, {
 brand_tag:'Infraestructura ejecutiva de recuperación de ingresos y control documental',
 home:'Inicio',
 file:'Control del expediente legal corporativo',
 recovery:'Infraestructura de recuperación de ingresos',
 intake:'Evaluación inicial estructurada',
 resources:'Material ejecutivo',
 additional:'Servicios individuales seleccionados',
 careers:'Carreras',
 contact:'Solicitar consulta',
 cta_intake:'Solicitar revisión confidencial',
 cta_briefs:'Ver informe ejecutivo',
 order_services:'Solicitar servicio',
 cta_email:'Enviar por correo',
 cta_apply:'Postular por correo',
 clock_vcx:'Hora de VitaCoreX',
 clock_local:'Su hora',
 clock_local_sub:'Local',
 market_pulse:'Pulso de mercado',
 market_note:'Referencia para renta variable de EE. UU., oro y petróleo.',
 gate_title:'Abrir el informe ejecutivo',
 gate_copy:'Comparta sus datos para abrir el PDF y mantener ordenada la secuencia de seguimiento.',
 gate_submit:'Abrir PDF',
 gate_cancel:'Cancelar',
 gate_success:'Acceso concedido. El material se está abriendo.',
 gate_failure:'No se pudo enviar el formulario. Inténtelo otra vez o use el correo.',
 footer_disc:'VitaCoreX LLC ofrece soporte administrativo, documental, operativo y empresarial. No es un bufete jurídico ni presta representación legal. La estrategia legal y el asesoramiento jurídico siguen siendo responsabilidad de abogados con licencia.',
 footer_copy:'© 2026 VitaCoreX LLC. Todos los derechos reservados.',
 footer_operator_note:'Tampa, Florida / firma operativa con cobertura en EE. UU.',
 footer_scope_note:'Revisiones basadas en documentación para infraestructura de recuperación de ingresos, control del expediente legal corporativo y materiales ejecutivos.',
 footer_email:'Correo electrónico',
 nav_companies:'Para empresas',
 nav_recovery:'Recuperación',
 nav_brief:'Informe ejecutivo',
 nav_individuals:'Para particulares',
 nav_confidential:'Revisión confidencial',
 footer_companies_title:'Para empresas',
 footer_individuals_title:'Para particulares',
 footer_careers_link:'Carreras',
 cta_confidential_review:'Solicitar revisión confidencial',
 cta_strategy_call:'Programar llamada estratégica',
 cta_review_brief:'Ver informe ejecutivo',
 cta_request_service:'Solicitar servicio',
 cta_start_intake:'Iniciar evaluación estructurada',
 dock_brief:'Informe',
 dock_strategy:'Estrategia',
 dock_companies:'Empresas',
 dock_individuals:'Particulares',
 client_company:'Empresa',
 client_individual:'Particular',
 request_review:'Iniciar evaluación estructurada',
 company_band_eyebrow:'Para empresas',
 company_band_title:'Convierta la incertidumbre del expediente en un siguiente paso controlado.',
 company_band_body:'La revisión confidencial ayuda a confirmar la línea de trabajo adecuada, el paquete documental correcto y el siguiente paso ejecutivo antes de que aumente el costo externo.',
 individual_band_eyebrow:'Para particulares',
 individual_band_title:'Los asuntos individuales seleccionados siguen una vía estructurada aparte.',
 individual_band_body:'Use la solicitud estructurada cuando un asunto particular necesite orden y claridad sin desplazar la plataforma corporativa.',
 intake_company_eyebrow:'Revisión confidencial corporativa',
 intake_company_title:'Encamine el asunto corporativo hacia la línea de trabajo correcta antes de que aumente el costo externo.',
 intake_company_lead:'Esta revisión ayuda a definir la línea de servicio adecuada, las brechas documentales inmediatas y el siguiente paso ejecutivo.',
 intake_company_side_title:'Resultado de la revisión corporativa',
 intake_company_side_body:'Tras el envío se precisan la línea de servicio, la preparación del expediente, la ventana de respuesta y la ruta siguiente.',
 intake_company_button:'Solicitar revisión confidencial',
 intake_individual_eyebrow:'Solicitud estructurada de servicio',
 intake_individual_title:'Inicie la solicitud del servicio individual seleccionado con un primer paquete más limpio.',
 intake_individual_lead:'Use esta solicitud para encaminar bien el asunto, confirmar qué debe enviarse ahora y mantener ordenada la vía individual.',
 intake_individual_side_title:'Resultado de la solicitud',
 intake_individual_side_body:'A medida que se completa la solicitud se precisan el encaje del servicio, los documentos necesarios, la ventana de respuesta y el siguiente paso.',
 intake_individual_button:'Iniciar evaluación estructurada',
 thank_company_cta:'Programar llamada estratégica',
 thank_individual_cta:'Iniciar evaluación estructurada',
 services_individuals_title:'Servicios individuales seleccionados',
 services_individuals_intro:'Los asuntos individuales seleccionados siguen disponibles de forma limitada. La práctica corporativa sigue siendo la plataforma principal de VitaCoreX.',
 see_all_individuals:'Ver servicios individuales seleccionados',
 ind1_desc:'Soporte administrativo para redacción de contratos, revisión documental, formularios empresariales, cartas de requerimiento y paquetes de apoyo.',
 ind2_desc:'Organización del paquete, guía de formularios, revisión previa a la presentación y estructuración de evidencia.',
 ind3_desc:'Revisión del lado del comprador antes de firmar, con análisis de cargos, estructura de pago y apoyo en la negociación.',
 ind3_b1:'Revisión del contrato del concesionario',
 ind4_desc:'Resumen ejecutivo, narrativa para inversionistas, plan de lanzamiento, marco financiero y apoyo para la presentación.',
 ind5_desc:'Soporte estructurado para constitución de empresas, paquetes de registro, presentación de documentos y documentación de arranque.',
 ind5_b3:'Apoyo para la presentación de documentos',
 ind5_b5:'Lista de control de lanzamiento',
 ind6_desc:'Apoyo de traducción documental, revisión bilingüe y localización estructurada para materiales de negocio o expedientes de presentación.',
 role_intake:'Soporte de evaluación inicial',
 careers_t1:'Personas disciplinadas capaces de trabajar dentro de un modelo operativo centrado en la documentación.',
 careers_t2:'Inglés sólido, escrito y hablado.',
 careers_t3:'Las referencias verificables son muy valoradas.',
 careers_t4:'Los candidatos rusohablantes con excelente inglés reciben prioridad.',
 careers_mobile_title:'Carreras - solicitud móvil',
 careers_mobile_body:'Buscamos personas disciplinadas y confiables para apoyar operaciones centradas en la documentación. Se requiere inglés sólido. Las referencias verificables son muy valoradas. En su postulación incluya nombre completo, teléfono, ciudad y estado, rol de interés, una breve presentación y su CV.',
 service_recovery:'Infraestructura de recuperación de ingresos',
 service_file:'Control del expediente legal corporativo',
 service_intake:'Evaluación inicial estructurada y armado del paquete',
 service_briefs:'Solicitud de informe ejecutivo'
});
Object.assign(pageCopy['individual-services'].en, {
 hero_title:'Selected support for individual and one-off matters.',
 hero_lead:'These matters remain available on a selective basis, while VitaCoreX continues to lead with corporate advisory mandates.',
 individual_side_title:'Selective individual access',
 individual_side_body:'Individual matters remain available through structured intake, while corporate mandates stay primary across the platform.'
});
Object.assign(pageCopy['individual-services'].ru, {
 title:'Избранные частные услуги | VitaCoreX LLC',
 desc:'Избранная поддержка по частным услугам: договоры, иммиграционные документы, проверка покупки автомобиля, запуск компании и перевод документов.',
 hero_eyebrow:'Избранные частные услуги',
 hero_title:'Избранная поддержка по частным и разовым запросам.',
 hero_lead:'Эти вопросы остаются доступны выборочно, при этом VitaCoreX сохраняет корпоративное направление в качестве основной платформы.',
 individual_side_title:'Выборочный доступ для частных клиентов',
 individual_side_body:'Частные вопросы остаются доступны через структурированный запрос, а корпоративные проекты сохраняют основной статус по всей платформе.'
});
Object.assign(pageCopy['individual-services'].es, {
 title:'Servicios individuales seleccionados | VitaCoreX LLC',
 desc:'Servicios individuales seleccionados para contratos, documentos migratorios, revisión de compra de auto, constitución de empresa y traducción.',
 hero_eyebrow:'Servicios individuales seleccionados',
 hero_title:'Soporte seleccionado para asuntos individuales y puntuales.',
 hero_lead:'Estos asuntos siguen disponibles de forma selectiva, mientras VitaCoreX mantiene la práctica corporativa como vía principal.',
 individual_side_title:'Acceso individual selectivo',
 individual_side_body:'Los asuntos individuales siguen disponibles mediante solicitud estructurada, mientras la práctica corporativa mantiene el papel principal en toda la plataforma.'
});
Object.assign(pageCopy.careers.ru, {
 title:'Сотрудничество | VitaCoreX LLC',
 desc:'Страница сотрудничества для дисциплинированных кандидатов, способных работать в среде, основанной на документах.',
 hero_eyebrow:'Сотрудничество',
 hero_title:'Работа со структурой, ясностью и дисциплиной исполнения.',
 hero_lead:'Мы ищем людей, которые умеют поддерживать операции, основанные на документах, за счёт сильного письма, суждения, надёжности и стабильности.',
 careers_side_title:'Предпочтительный профиль',
 careers_side_body:'Сильный английский, ясное деловое письмо, подтверждаемые рекомендации как плюс и опыт в документации, операционной поддержке, клиентском сервисе или сопровождении материалов.'
});
Object.assign(pageCopy.careers.es, {
 title:'Carreras | VitaCoreX LLC',
 desc:'Página de carreras para candidatos disciplinados capaces de trabajar en un entorno centrado en la documentación.',
 hero_eyebrow:'Carreras',
 hero_title:'Trabaje con estructura, claridad y ejecución disciplinada.',
 hero_lead:'Buscamos personas capaces de apoyar operaciones centradas en la documentación con buena redacción, criterio, confiabilidad y consistencia.',
 careers_side_title:'Perfil preferido',
 careers_side_body:'Inglés sólido, escritura empresarial clara, referencias verificables muy valoradas y experiencia previa en documentación, operaciones, soporte al cliente o apoyo documental.'
});
Object.assign(pageCopy.home.ru, {
 home_note_pill:'Стандарт закрытого разбора',
 home_note_title:'Для owners, CFO, операторов и команд, работающих на counsel-facing уровне.',
 home_note_body:'Первый разговор строится вокруг утечек, готовности документации и того, относится ли мандат к диагностике, пилоту или cleanup юридического файла.',
 home_note_1:'Операторская база в Тампе с покрытием по США',
 home_note_2:'Documentation-first модель до роста внешних расходов',
 home_note_3:'Компания не является юридической фирмой; юридические советы остаются у лицензированного адвоката',
 trust_1_pill:'Тампа / США',
 trust_1_body:'Операторская advisory-платформа из Тампы с бизнес-поддержкой по США.',
 trust_2_pill:'Сначала документация',
 trust_2_body:'Recovery-дизайн и file control начинаются с чистых записей, а не с импровизации.',
 trust_3_pill:'Дисциплина ответа',
 trust_3_body:'Входящие разборы маршрутизируются, документируются и получают ответ через контролируемый intake-путь.',
 trust_4_pill:'Юридическая граница',
 trust_4_body:'VitaCoreX не является юридической фирмой и не предоставляет юридическое представительство.',
 leak_1_h:'Старение баланса без последовательности',
 leak_1_p:'Контакт, логика оплаты и follow-up расходятся по командам, локациям и операторам.',
 leak_2_h:'Слабый контроль документации',
 leak_2_p:'Критичные записи живут в почте, разрозненных папках или неполных пакетах.',
 leak_3_h:'Маржа теряется слишком рано',
 leak_3_p:'Счета уходят наружу до того, как внутренние сценарии конверсии спроектированы и измерены.',
 leak_4_h:'Нет executive-видимости',
 leak_4_p:'Руководство видит объём, но не понимает, где фактически формируются утечки, трение и риск handoff.',
 svc_card_1_p:'Проектируйте pre-agency системы возврата, которые превращают балансы в задокументированные обязательства до потери маржи.',
 svc_card_2_p:'Собирайте хронологию, приложения и опорные записи в counsel-ready структуру, выдерживающую внутренний review.',
 svc_card_3_h:'Структурированный intake и сбор пакета',
 svc_card_3_p:'Правильно маршрутизируйте вопрос, определяйте первый рабочий продукт и начинайте с дисциплинированного списка документов, а не с хаотичной переписки.',
 step_1_p:'Проверьте workflow drag, состояние файла, логику эскалации и место начала утечки кэша.',
 step_2_p:'Запустите ограниченный scope с отчётностью, document control и стандартом решения о расширении.',
 step_3_p:'Масштабируйте модель только после того, как руководство увидит повторяемый операционный выигрыш.',
 pilot_outcome_pill:'Что получает руководство',
 pilot_outcome_title:'На выходе - более чистое решение, а не размытый advisory memo.',
 pilot_outcome_body:'Каждый этап оставляет менеджменту более ясный операционный выбор и более чистые supporting records.',
 pilot_outcome_1:'Диагноз утечки и состояния документации',
 pilot_outcome_2:'План пилота или file-control работы',
 pilot_outcome_3:'Вид внедрения для finance, operations и counsel',
 proof_eyebrow:'Executive-материалы',
 proof_title:'Контролируемые briefs, которые двигают решение.',
 proof_intro:'Публичный слой intentionally selective: достаточно краткий для внутренней пересылки и достаточно содержательный для реального следующего разговора.'
});
Object.assign(pageCopy.home.es, {
 home_note_pill:'Estandar de revision privada',
 home_note_title:'Pensado para owners, CFOs, operadores y equipos que trabajan de cara a counsel.',
 home_note_body:'La primera conversacion se estructura alrededor de la exposicion a fuga, la preparacion documental y la decision de si el mandato pertenece a diagnostico, piloto o limpieza del expediente.',
 home_note_1:'Base operativa en Tampa con cobertura de servicio en Estados Unidos',
 home_note_2:'Modelo documentation-first antes de que crezca el costo externo',
 home_note_3:'No es un bufete juridico; el asesoramiento legal sigue en manos de counsel con licencia',
 trust_1_pill:'Tampa / EE. UU.',
 trust_1_body:'Plataforma operativa desde Tampa con compromisos de soporte empresarial en todo Estados Unidos.',
 trust_2_pill:'Primero la documentacion',
 trust_2_body:'El diseno de recuperacion y el control del expediente comienzan con registros limpios, no con improvisacion.',
 trust_3_pill:'Disciplina de respuesta',
 trust_3_body:'Las revisiones entrantes se enrutan, documentan y responden mediante una via de intake controlada.',
 trust_4_pill:'Limite legal',
 trust_4_body:'VitaCoreX no es un bufete juridico y no ofrece representacion legal.',
 leak_1_h:'Antiguedad sin secuencia',
 leak_1_p:'El outreach, la logica de pago y el seguimiento se desordenan entre equipos, ubicaciones y operadores.',
 leak_2_h:'Control documental debil',
 leak_2_p:'Los registros criticos viven en correos, carpetas desconectadas o paquetes incompletos.',
 leak_3_h:'Margen perdido demasiado pronto',
 leak_3_p:'Las cuentas salen demasiado pronto antes de que las opciones internas de conversion sean diseñadas y medidas.',
 leak_4_h:'Sin visibilidad ejecutiva',
 leak_4_p:'La direccion ve volumen, pero no donde realmente se forman la fuga, la friccion y el riesgo de handoff.',
 svc_card_1_p:'Diseñe sistemas pre-agencia que conviertan saldos en compromisos documentados antes de ceder margen.',
 svc_card_2_p:'Lleve cronologia, anexos y registros de soporte a una estructura lista para counsel y capaz de resistir revision interna.',
 svc_card_3_h:'Intake estructurado y armado del paquete',
 svc_card_3_p:'Encamine bien los asuntos, defina el primer entregable y empiece con una solicitud documental disciplinada en lugar de ida y vuelta desordenada.',
 step_1_p:'Revise el drag operativo, la condicion del expediente, la logica de escalacion y donde comienza la fuga de caja.',
 step_2_p:'Ejecute un alcance limitado con reporte, control documental y un criterio claro para decidir si debe ampliarse.',
 step_3_p:'Escale el modelo solo despues de que la direccion vea una mejora operativa repetible.',
 pilot_outcome_pill:'Lo que recibe la direccion',
 pilot_outcome_title:'El resultado es una decision mas limpia, no un memo consultivo vago.',
 pilot_outcome_body:'Cada fase esta diseñada para dejar a la direccion con una decision operativa mas clara y mejores registros de soporte.',
 pilot_outcome_1:'Diagnostico de fuga y documentacion',
 pilot_outcome_2:'Plan de piloto o de control del expediente',
 pilot_outcome_3:'Vista de implementacion para finanzas, operaciones y counsel',
 proof_eyebrow:'Material ejecutivo',
 proof_title:'Briefs controlados que ayudan a mover una decision.',
 proof_intro:'La capa publica es selectiva por diseno: lo bastante breve para reenviarse internamente y lo bastante solida para sostener la siguiente conversacion.'
});
Object.assign(extra.ru, {
 footer_disc:'VitaCoreX LLC оказывает административную, документационную, операционную и бизнес-поддержку. Компания не является юридической фирмой и не осуществляет юридическое представительство. Правовая стратегия и юридические советы относятся к компетенции лицензированного адвоката.',
 footer_operator_note:'Тампа, Флорида / операционная консультационная фирма с покрытием по США',
 footer_scope_note:'Разборы на базе документов для инфраструктуры возврата выручки, контроля юридического досье компании и материалов для руководства.',
 footer_email:'Электронная почта',
 resources_band_title:'Перейдите от материала для руководства к конфиденциальному разбору.',
 resources_band_body:'Используйте материал для руководства, чтобы согласовать внутреннюю позицию, а затем перевести вопрос в конфиденциальный разбор компании или на стратегический звонок.',
 careers_band_title:'Оценка услуг остаётся основным маршрутом VitaCoreX.',
 careers_band_body:'Раздел сотрудничества вторичен по отношению к консультационной платформе. Если вы оцениваете услуги, переходите в корпоративный разбор или к материалу для руководства.',
 company_band_title:'Переведите неопределённость по файлу в управляемое следующее решение.',
 company_band_body:'Конфиденциальный разбор помогает подтвердить правильное направление работ, нужный пакет документов и следующий шаг для руководства до роста внешних расходов.',
 individual_band_title:'Избранные частные запросы проходят по отдельному структурированному маршруту.',
 individual_band_body:'Используйте структурированный первичный разбор для частного запроса, когда вопрос нужно аккуратно направить, не смещая корпоративную платформу.',
 thank_window_company:'Первичный корпоративный разбор после отправки',
 thank_window_individual:'Первичный разбор частной услуги после отправки',
 out_next_company:'Конфиденциальный разбор, проверка пробелов в документах и записка со следующим шагом.',
 output_note:'Это резюме уточняется по мере заполнения формы. Оно не является юридической консультацией.',
 intake_company_title:'Направьте корпоративный вопрос в нужную сервисную линию до роста внешних расходов.',
 intake_company_lead:'Этот конфиденциальный разбор помогает определить нужную сервисную линию, ближайшие пробелы в документах и следующий шаг для руководства.',
 intake_company_side_body:'После отправки уточняются сервисная линия, готовность файла, окно ответа и дальнейшая маршрутизация.',
 intake_individual_lead:'Этот первичный разбор помогает правильно направить вопрос, подтвердить, что нужно отправить сейчас, и сохранить частный маршрут структурированным.',
 intake_company_meta_desc:'Запросите конфиденциальный корпоративный разбор по инфраструктуре возврата выручки, контролю юридического досье компании или маршрутизации материалов для руководства.',
 intake_individual_meta_desc:'Начните структурированный запрос по выбранной частной услуге и подготовьте более чистый первый пакет документов.',
 services_individuals_intro:'Избранные запросы частных клиентов остаются доступны в ограниченном формате. Корпоративное направление остаётся основной платформой VitaCoreX.',
 res3_desc:'Институциональная подача с логикой пилота, последовательностью запуска и материалом для руководства.',
 res4_title:'Разбор pre-collection для руководства',
 res4_desc:'Логика контролируемой эскалации и экономика до передачи агентству.',
 res4_tag:'Материал для руководства',
 ind4_desc:'Резюме проекта, логика для инвестора, план запуска, финансовая рамка и поддержка презентации.',
 ind4_b1:'Резюме проекта',
 ind4_b2:'Логика для инвестора',
 ind5_desc:'Структурированная помощь по запуску юридического лица, пакетам регистрации и стартовой документации.',
 ind5_b3:'Поддержка регистрационной подачи',
 ind6_desc:'Поддержка перевода документов, двуязычная редактура и структурированная локализация для деловых материалов или пакета подачи.',
 role_intake:'Поддержка первичного разбора',
 careers_t1:'Дисциплинированных людей, способных работать в операционной модели, основанной на документах.',
 careers_mobile_body:'Мы ищем дисциплинированных и надёжных людей для поддержки операций, основанных на документах. Требуется сильный английский. Подтверждаемые рекомендации крайне желательны. В заявке укажите ФИО, телефон, город и штат, интересующую роль, короткое представление и приложите резюме или CV.',
 service_recovery:'Инфраструктура возврата выручки',
 service_file:'Контроль юридического досье компании',
 service_intake:'Структурированный первичный разбор и сборка пакета',
 service_briefs:'Запрос на материал для руководства',
 cta_review_brief:'Открыть материал для руководства',
 dock_brief:'Материал',
 cta_start_intake:'Начать структурированный разбор'
});
Object.assign(extra.es, {
 footer_disc:'VitaCoreX LLC ofrece soporte administrativo, documental, operativo y de negocio. No es un bufete jurídico y no presta representación legal. La estrategia legal y el asesoramiento jurídico siguen siendo responsabilidad de abogados con licencia.',
 footer_operator_note:'Tampa, Florida / firma operativa con cobertura en EE. UU.',
 footer_scope_note:'Revisiones basadas en documentación para infraestructura de recuperación de ingresos, control del expediente legal corporativo e informes ejecutivos.',
 footer_email:'Correo electrónico',
 resources_band_title:'Pase del informe ejecutivo a una revisión confidencial.',
 resources_band_body:'Use el informe ejecutivo para alinear la posición interna y luego llevar el asunto a una revisión confidencial corporativa o a una llamada estratégica.',
 careers_band_title:'La evaluación de servicios sigue siendo la vía principal de VitaCoreX.',
 careers_band_body:'La sección de carreras queda en segundo plano frente a la plataforma de asesoría. Si está evaluando servicios, avance hacia la revisión corporativa o el informe ejecutivo.',
 company_band_title:'Convierta la incertidumbre del expediente en un siguiente paso controlado.',
 company_band_body:'La revisión confidencial confirma la línea de trabajo adecuada, el paquete documental correcto y el siguiente paso ejecutivo antes de que aumente el costo externo.',
 individual_band_title:'Los asuntos privados seleccionados siguen una vía estructurada aparte.',
 individual_band_body:'Use la evaluación inicial estructurada para asuntos privados cuando necesite orden y claridad sin desplazar la plataforma corporativa.',
 thank_window_company:'Revisión corporativa inicial tras el envío',
 thank_window_individual:'Revisión inicial del servicio tras el envío',
 out_title:'Resultado preliminar de la evaluación',
 out_next_company:'Revisión confidencial, verificación de brechas documentales y nota con el siguiente paso.',
 output_note:'Este resumen se vuelve más preciso a medida que se completa la evaluación. No constituye asesoramiento legal.',
 intake_company_title:'Encamine el asunto corporativo hacia la línea de trabajo correcta antes de que aumente el costo externo.',
 intake_company_lead:'Esta revisión confidencial ayuda a definir la línea de servicio adecuada, las brechas documentales inmediatas y el siguiente paso ejecutivo.',
 intake_company_side_body:'Tras el envío se precisan la línea de servicio, la preparación del expediente, la ventana de respuesta y la ruta siguiente.',
 intake_individual_lead:'Esta evaluación inicial ayuda a encaminar bien el asunto, confirmar qué debe enviarse ahora y mantener ordenada la vía privada.',
 intake_company_meta_desc:'Solicite una revisión confidencial corporativa sobre infraestructura de recuperación de ingresos, control del expediente legal corporativo o derivación de informes ejecutivos.',
 intake_individual_meta_desc:'Inicie una solicitud estructurada para un asunto privado seleccionado y prepare un primer paquete documental más limpio.',
 services_individuals_intro:'Los asuntos privados seleccionados siguen disponibles de forma limitada. La práctica corporativa sigue siendo la plataforma principal de VitaCoreX.',
 ind4_desc:'Resumen del proyecto, narrativa para inversionistas, plan de lanzamiento, marco financiero y apoyo para la presentación.',
 ind5_desc:'Apoyo estructurado para la constitución de la entidad, los paquetes de registro y la documentación de arranque.',
 ind5_b3:'Apoyo para la presentación registral',
 ind6_desc:'Apoyo de traducción documental, revisión bilingüe y localización estructurada para materiales de negocio o expedientes de presentación.',
 role_intake:'Soporte de evaluación inicial',
 careers_t1:'Personas disciplinadas capaces de trabajar dentro de un modelo operativo centrado en la documentación.',
 careers_mobile_body:'Buscamos personas disciplinadas y confiables para apoyar operaciones centradas en la documentación. Se requiere inglés sólido. Las referencias verificables son muy valoradas. En su postulación incluya nombre completo, teléfono, ciudad y estado, rol de interés, una breve presentación y su CV.',
 service_recovery:'Infraestructura de recuperación de ingresos',
 service_file:'Control del expediente legal corporativo',
 service_intake:'Evaluación inicial estructurada y armado del paquete',
 service_briefs:'Solicitud de informe ejecutivo',
 cta_strategy_call:'Programar llamada estratégica',
 cta_review_brief:'Ver informe ejecutivo',
 dock_brief:'Informe',
 cta_start_intake:'Iniciar evaluación estructurada',
 thank_company_cta:'Programar llamada estratégica'
});
Object.assign(pageCopy.home.ru, {
 hero_eyebrow:'Конфиденциальная операционная консультация для операторов США',
 home_note_title:'Для собственников, CFO, операторов и команд, работающих на стыке с внешним юристом.',
 home_note_body:'Первый разговор строится вокруг масштаба утечек, готовности документов и решения о том, нужен ли диагностический разбор, пилот или приведение юридического досье в порядок.',
 home_note_2:'Документы приводятся в порядок до роста внешних расходов',
 title:'VitaCoreX LLC | Конфиденциальная консультационная фирма по возврату выручки и контролю документации',
 hero_title:'Контроль документации и дисциплина возврата выручки для операторов, которым нужен надёжный следующий шаг.',
 hero_lead:'VitaCoreX поддерживает корпоративных операторов конфиденциальным диагностическим разбором, проектированием процесса возврата на базе документов и более чистым контролем юридического досье. Частные вопросы остаются доступны выборочно, но платформа построена для институциональной работы.',
 trust_1_body:'Операционная консультационная фирма из Тампы с сопровождением клиентов по США.',
 trust_2_body:'Дизайн процесса возврата и контроль юридического досье начинаются с чистых документов, а не с импровизации.',
 trust_3_body:'Каждый входящий запрос маршрутизируется, фиксируется и получает ответ через контролируемый путь первичного разбора.',
 leak_1_p:'Коммуникация, логика оплат и последующие действия расходятся по командам, локациям и операторам.',
 leak_4_h:'Нет управленческой видимости',
 leak_4_p:'Руководство видит объём, но не понимает, где именно формируются утечки, трение и риск некачественной передачи дальше.',
 svc_card_1_p:'Проектируйте доагентские системы возврата, которые превращают задолженность в подтверждённые обязательства до потери маржи.',
 svc_card_2_p:'Собирайте хронологию, приложения и подтверждающие материалы в структуру, удобную для внутреннего разбора и дальнейшей передачи внешнему юристу.',
 svc_card_3_h:'Структурированный первичный разбор и сборка пакета',
 b2b_title:'Институциональная поддержка для операторов, которым нужна более чистая операционная модель до роста внешних юридических и агентских расходов.',
 b2b_intro:'Подходит организациям, которым нужны структурированный операционный контроль, более сильная документация и более убедимая модель передачи материалов до роста внешних юридических расходов.',
 ind_intro:'Поддержка частных клиентов предлагается выборочно, по отдельному пути первичного разбора и во вторичной роли по отношению к корпоративной платформе.',
 cta_title:'Используйте первый разбор, чтобы понять, нужен ли VitaCoreX диагноз, приведение файла в порядок или структура пилота.',
 cta_intro:'Конфиденциальные разборы созданы для серьёзных покупателей, которым нужен операционный ответ, более чистая позиция по файлу или дисциплинированный путь до роста внешних юридических расходов.',
 pilot_title:'Серьёзный консультационный мандат требует понятного операционного пути.',
 step_1_p:'Проверьте текущий процесс, состояние файла, логику эскалации и место начала утечки кэша.',
 step_2_p:'Запустите ограниченный пилот с отчётностью, контролем документов и чётким критерием решения о расширении.',
 pilot_outcome_title:'Результат - более чистое управленческое решение, а не размытая консультационная записка.',
 pilot_outcome_body:'Каждый этап должен оставить руководству более ясный операционный выбор и более аккуратный комплект подтверждающих материалов.',
 pilot_outcome_3:'План внедрения для финансов, операций и внешнего юриста',
 proof_eyebrow:'Материалы для руководства',
 proof_title:'Контролируемые материалы, которые помогают принять решение.',
 proof_intro:'Публичный слой намеренно сдержан: его достаточно, чтобы переслать материал внутри компании и перейти к предметному следующему разговору.'
});
Object.assign(pageCopy.home.es, {
 title:'VitaCoreX LLC | Asesoría confidencial para recuperación de ingresos y control documental',
 home_note_title:'Pensado para propietarios, CFOs, operadores y equipos que trabajan junto a asesoría externa.',
 home_note_body:'La primera conversación se organiza alrededor de la fuga de valor, la preparación documental y la decisión de si el mandato requiere diagnóstico, piloto o saneamiento del expediente legal.',
 home_note_2:'La documentación se ordena antes de que aumente el costo externo',
 home_note_3:'No es un bufete jurídico; el asesoramiento legal sigue siendo responsabilidad de abogados con licencia',
 hero_title:'Control documental y disciplina de recuperación para operadores que necesitan una derivación fiable.',
 trust_1_body:'Firma operativa con base en Tampa y cobertura de servicio en Estados Unidos.',
 trust_2_body:'El diseño de recuperación y el control del expediente legal comienzan con documentación limpia, no con improvisación.',
 trust_3_body:'Cada revisión entrante se encamina, se documenta y recibe respuesta por una vía controlada de evaluación inicial.',
 hero_lead:'VitaCoreX acompaña a operadores corporativos con revisiones diagnósticas confidenciales, diseño de recuperación basado en documentación y control de expedientes listo para revisión externa. Los asuntos individuales siguen disponibles de forma selectiva, pero la firma está construida para trabajo institucional.',
 svc_i:'Cada línea se diseña para proteger el rendimiento de caja, la calidad documental y una derivación más limpia hacia asesoría externa cuando haga falta.',
 leak_1_p:'El contacto, la lógica de pago y el seguimiento se dispersan entre equipos, ubicaciones y operadores.',
 leak_4_p:'La dirección ve volumen, pero no identifica con claridad dónde se forman la fuga, la fricción y el riesgo de una derivación deficiente.',
 svc_card_2_p:'Lleve cronología, anexos y registros de soporte a una estructura lista para revisión interna y para una eventual derivación a asesoría externa.',
 svc_card_3_h:'Evaluación inicial estructurada y armado del paquete',
 b2b_intro:'Creado para organizaciones que desean mayor control operativo, documentación más sólida y un modelo de derivación más creíble antes de que aumente el costo legal externo.',
 ind_intro:'El soporte privado se ofrece de forma selectiva, por una vía separada de evaluación inicial y en posición secundaria frente a la plataforma corporativa.',
 cta_title:'Use la primera revisión para decidir si VitaCoreX debe diagnosticar, ordenar el expediente o estructurar un piloto.',
 step_1_p:'Revise el proceso actual, la condición del expediente, la lógica de escalamiento y el punto donde comienza la fuga de caja.',
 step_2_p:'Ejecute un piloto acotado con reporte, control documental y un criterio claro para decidir si debe ampliarse.',
 pilot_outcome_title:'El resultado es una decisión de gestión más limpia, no una nota consultiva vaga.',
 pilot_outcome_body:'Cada fase debe dejar a la dirección con una decisión operativa más clara y un conjunto de soportes mejor ordenado.',
 pilot_outcome_3:'Plan de implementación para finanzas, operaciones y asesoría externa',
 proof_title:'Materiales controlados que ayudan a mover una decisión.',
 proof_intro:'La capa pública es deliberadamente contenida: ofrece lo suficiente para circular internamente y pasar a una conversación sustantiva.'
});
Object.assign(pageCopy.resources.ru, {
 hero_title:'Контролируемые материалы для собственников, CFO, операторов и команд, работающих с внешними юристами.',
 hero_lead:'Используйте этот слой материалов, чтобы корректно сформулировать вопрос, поддержать внутреннее обсуждение и подготовить более чистую первую консультацию.',
 resources_side_title:'Что даёт каждый материал',
 resources_side_body:'Краткий материал для партнёров, основателей, CFO и операторов, которым нужна сжатая управленческая рамка до звонка.'
});
Object.assign(pageCopy.resources.es, {
 hero_title:'Material controlado para propietarios, CFOs, operadores y equipos que trabajan con asesoría externa.',
 hero_lead:'Use esta capa de recursos para enmarcar el problema, apoyar conversaciones internas y preparar una primera consulta más limpia.',
 resources_side_title:'Qué aporta cada recurso',
 resources_side_body:'Material breve para socios, fundadores, CFOs y operadores que necesitan un marco ejecutivo conciso antes de la llamada.'
});
Object.assign(extra.en, {
 footer_copy:'© 2026 VitaCoreX LLC. All rights reserved.',
 services_individuals_title:'Selected individual services',
 services_individuals_intro:'Selected individual-service matters remain available on a limited basis. Corporate advisory remains the primary VitaCoreX path.',
 see_all_individuals:'Review selected individual services',
 individual_band_body:'Use the individual-service intake when a private matter needs a disciplined secondary path without diluting the corporate platform.',
 intake_individual_title:'Start the selected individual-service request with a cleaner first packet.',
 intake_individual_lead:'Use this request to route the matter correctly, confirm what should be sent now, and keep the individual-service path structured.'
});
Object.assign(extra.ru, {
 brand_tag:'Исполнительная инфраструктура возврата выручки и контроля документации',
 home:'Главная',
 file:'Контроль корпоративного юридического досье',
 recovery:'Инфраструктура возврата выручки',
 intake:'Структурированный первичный разбор',
 resources:'Материалы для руководства',
 additional:'Избранные частные услуги',
 careers:'Сотрудничество',
 contact:'Запросить консультацию',
 cta_intake:'Запросить конфиденциальный разбор',
 cta_briefs:'Открыть материал для руководства',
 order_services:'Запросить услугу',
 cta_email:'Написать по email',
 cta_apply:'Откликнуться по email',
 clock_vcx:'Время VitaCoreX',
 clock_local:'Ваше время',
 clock_local_sub:'Локально',
 market_pulse:'Рыночный ориентир',
 market_note:'Справочная лента по акциям США, золоту и нефти.',
 gate_title:'Открыть материал для руководства',
 gate_copy:'Оставьте данные, чтобы открыть PDF и сохранить аккуратную логику дальнейшего контакта.',
 gate_submit:'Открыть PDF',
 gate_cancel:'Отмена',
 gate_success:'Доступ открыт. Материал открывается.',
 gate_failure:'Не удалось отправить форму. Попробуйте ещё раз или напишите на email.',
 footer_disc:'VitaCoreX LLC оказывает административную, документационную, операционную и бизнес-поддержку. Компания не является юридической фирмой и не осуществляет юридическое представительство. Правовая стратегия и юридические советы относятся к компетенции лицензированного адвоката.',
 footer_copy:'© 2026 VitaCoreX LLC. Все права защищены.',
 footer_operator_note:'Тампа, Флорида / операционная консультационная фирма с покрытием по США',
 footer_scope_note:'Разборы на базе документов для инфраструктуры возврата выручки, контроля корпоративного юридического досье и материалов для руководства.',
 footer_email:'Электронная почта',
 nav_companies:'Для компаний',
 nav_recovery:'Возврат выручки',
 nav_brief:'Материал для руководства',
 nav_individuals:'Для частных клиентов',
 nav_confidential:'Конфиденциальный разбор',
 footer_companies_title:'Для компаний',
 footer_individuals_title:'Для частных клиентов',
 footer_careers_link:'Сотрудничество',
 cta_confidential_review:'Запросить конфиденциальный разбор',
 cta_strategy_call:'Назначить стратегический звонок',
 cta_review_brief:'Открыть материал для руководства',
 cta_request_service:'Запросить услугу',
 cta_start_intake:'Начать структурированный разбор',
 dock_brief:'Материал',
 dock_strategy:'Стратегия',
 dock_companies:'Компании',
 dock_individuals:'Частные клиенты',
 client_company:'Компания',
 client_individual:'Частное лицо',
 request_review:'Начать структурированный разбор',
 company_band_eyebrow:'Для компаний',
 company_band_title:'Переведите неопределённость по файлу в управляемое следующее решение.',
 company_band_body:'Конфиденциальный разбор помогает подтвердить правильное направление работ, нужный пакет документов и следующий шаг для руководства до роста внешних расходов.',
 individual_band_eyebrow:'Для частных клиентов',
 individual_band_title:'Избранные частные запросы проходят по отдельному структурированному маршруту.',
 individual_band_body:'Используйте структурированный запрос на услугу, когда частный вопрос нужно аккуратно направить, не смещая корпоративную платформу.',
 intake_company_eyebrow:'Конфиденциальный разбор компании',
 intake_company_title:'Направьте корпоративный вопрос в нужную сервисную линию до роста внешних расходов.',
 intake_company_lead:'Этот разбор помогает определить нужное направление работ, ближайшие пробелы в документах и следующий шаг для руководства.',
 intake_company_side_title:'Результат корпоративного разбора',
 intake_company_side_body:'После отправки уточняются сервисная линия, готовность файла, окно ответа и дальнейшая маршрутизация.',
 intake_company_button:'Запросить конфиденциальный разбор',
 intake_individual_eyebrow:'Структурированный запрос на услугу',
 intake_individual_title:'Начните запрос по выбранной частной услуге с более чистого первого пакета.',
 intake_individual_lead:'Используйте эту форму, чтобы правильно направить вопрос, подтвердить, что нужно отправить сейчас, и сохранить частный маршрут структурированным.',
 intake_individual_side_title:'Результат запроса по услуге',
 intake_individual_side_body:'По мере заполнения формы уточняются соответствие услуги, перечень документов, окно ответа и следующий шаг.',
 intake_individual_button:'Начать структурированный разбор',
 thank_company_cta:'Назначить стратегический звонок',
 thank_individual_cta:'Начать структурированный разбор',
 services_individuals_title:'Избранные частные услуги',
 services_individuals_intro:'Избранные частные запросы доступны в ограниченном формате. Корпоративное направление остаётся основной платформой VitaCoreX.',
 see_all_individuals:'Смотреть избранные частные услуги',
 ind1_title:'Договоры и документация',
 ind1_desc:'Административная поддержка по подготовке договоров, проверке документов, деловым формам, письмам-требованиям и структурированным пакетам материалов.',
 ind1_b1:'Подготовка договоров',
 ind1_b2:'Проверка документов',
 ind1_b3:'Деловые формы',
 ind1_b4:'Письма-требования',
 ind1_b5:'Пакеты поддержки',
 ind2_desc:'Организация пакета, сопровождение по формам, проверка готовности к подаче и структурирование доказательств.',
 ind3_desc:'Проверка сделки до подписания: анализ комиссий, логики платежей и поддержка переговоров.',
 ind3_b2:'Анализ комиссий',
 ind4_desc:'Резюме проекта, логика для инвестора, план запуска, финансовая рамка и поддержка презентации.',
 ind4_b1:'Резюме проекта',
 ind4_b2:'Логика для инвестора',
 ind4_b5:'Поддержка презентации',
 ind5_desc:'Структурированная помощь по запуску компании, пакетам регистрации, подаче документов и стартовой документации.',
 ind5_b3:'Поддержка подачи документов',
 ind5_b5:'Контрольный список запуска',
 ind6_desc:'Поддержка перевода документов, двуязычная редактура и структурированная локализация материалов для бизнеса или подачи.',
 role_intake:'Поддержка первичного разбора',
 careers_t1:'Дисциплинированные кандидаты, умеющие работать в операционной модели, основанной на документах.',
 careers_t2:'Сильный письменный и разговорный английский.',
 careers_t3:'Подтверждаемые рекомендации крайне желательны.',
 careers_t4:'Русскоязычные кандидаты с отличным английским получают приоритет.',
 careers_mobile_title:'Сотрудничество - мобильная заявка',
 careers_mobile_body:'Мы ищем дисциплинированных и надёжных людей для поддержки операций, основанных на документах. Требуется сильный английский. Подтверждаемые рекомендации крайне желательны. В заявке укажите ФИО, телефон, город и штат, интересующую роль, короткое представление и приложите резюме или CV.',
 service_recovery:'Инфраструктура возврата выручки',
 service_file:'Контроль корпоративного юридического досье',
 service_intake:'Структурированный первичный разбор и сборка пакета',
 service_briefs:'Запрос на материал для руководства'
});
Object.assign(extra.es, {
 brand_tag:'Infraestructura ejecutiva de recuperación de ingresos y control documental',
 home:'Inicio',
 file:'Control del expediente legal corporativo',
 recovery:'Infraestructura de recuperación de ingresos',
 intake:'Evaluación inicial estructurada',
 resources:'Material ejecutivo',
 additional:'Servicios individuales seleccionados',
 careers:'Carreras',
 contact:'Solicitar consulta',
 cta_intake:'Solicitar revisión confidencial',
 cta_briefs:'Ver informe ejecutivo',
 order_services:'Solicitar servicio',
 cta_email:'Enviar por correo',
 cta_apply:'Postular por correo',
 clock_vcx:'Hora de VitaCoreX',
 clock_local:'Su hora',
 clock_local_sub:'Local',
 market_pulse:'Pulso de mercado',
 market_note:'Referencia para renta variable de EE. UU., oro y petróleo.',
 gate_title:'Abrir el informe ejecutivo',
 gate_copy:'Comparta sus datos para abrir el PDF y mantener ordenada la secuencia de seguimiento.',
 gate_submit:'Abrir PDF',
 gate_cancel:'Cancelar',
 gate_success:'Acceso concedido. El material se está abriendo.',
 gate_failure:'No se pudo enviar el formulario. Inténtelo otra vez o use el correo.',
 footer_disc:'VitaCoreX LLC ofrece soporte administrativo, documental, operativo y empresarial. No es un bufete jurídico ni presta representación legal. La estrategia legal y el asesoramiento jurídico siguen siendo responsabilidad de abogados con licencia.',
 footer_copy:'© 2026 VitaCoreX LLC. Todos los derechos reservados.',
 footer_operator_note:'Tampa, Florida / firma operativa con cobertura en EE. UU.',
 footer_scope_note:'Revisiones basadas en documentación para infraestructura de recuperación de ingresos, control del expediente legal corporativo y materiales ejecutivos.',
 footer_email:'Correo electrónico',
 nav_companies:'Para empresas',
 nav_recovery:'Recuperación',
 nav_brief:'Informe ejecutivo',
 nav_individuals:'Para particulares',
 nav_confidential:'Revisión confidencial',
 footer_companies_title:'Para empresas',
 footer_individuals_title:'Para particulares',
 footer_careers_link:'Carreras',
 cta_confidential_review:'Solicitar revisión confidencial',
 cta_strategy_call:'Programar llamada estratégica',
 cta_review_brief:'Ver informe ejecutivo',
 cta_request_service:'Solicitar servicio',
 cta_start_intake:'Iniciar evaluación estructurada',
 dock_brief:'Informe',
 dock_strategy:'Estrategia',
 dock_companies:'Empresas',
 dock_individuals:'Particulares',
 client_company:'Empresa',
 client_individual:'Particular',
 request_review:'Iniciar evaluación estructurada',
 company_band_eyebrow:'Para empresas',
 company_band_title:'Convierta la incertidumbre del expediente en un siguiente paso controlado.',
 company_band_body:'La revisión confidencial ayuda a confirmar la línea de trabajo adecuada, el paquete documental correcto y el siguiente paso ejecutivo antes de que aumente el costo externo.',
 individual_band_eyebrow:'Para particulares',
 individual_band_title:'Los asuntos individuales seleccionados siguen una vía estructurada aparte.',
 individual_band_body:'Use la solicitud estructurada cuando un asunto particular necesite orden y claridad sin desplazar la plataforma corporativa.',
 intake_company_eyebrow:'Revisión confidencial corporativa',
 intake_company_title:'Encamine el asunto corporativo hacia la línea de trabajo correcta antes de que aumente el costo externo.',
 intake_company_lead:'Esta revisión ayuda a definir la línea de servicio adecuada, las brechas documentales inmediatas y el siguiente paso ejecutivo.',
 intake_company_side_title:'Resultado de la revisión corporativa',
 intake_company_side_body:'Tras el envío se precisan la línea de servicio, la preparación del expediente, la ventana de respuesta y la ruta siguiente.',
 intake_company_button:'Solicitar revisión confidencial',
 intake_individual_eyebrow:'Solicitud estructurada de servicio',
 intake_individual_title:'Inicie la solicitud del servicio individual seleccionado con un primer paquete más limpio.',
 intake_individual_lead:'Use esta solicitud para encaminar bien el asunto, confirmar qué debe enviarse ahora y mantener ordenada la vía individual.',
 intake_individual_side_title:'Resultado de la solicitud',
 intake_individual_side_body:'A medida que se completa la solicitud se precisan el encaje del servicio, los documentos necesarios, la ventana de respuesta y el siguiente paso.',
 intake_individual_button:'Iniciar evaluación estructurada',
 thank_company_cta:'Programar llamada estratégica',
 thank_individual_cta:'Iniciar evaluación estructurada',
 services_individuals_title:'Servicios individuales seleccionados',
 services_individuals_intro:'Los asuntos individuales seleccionados siguen disponibles de forma limitada. La práctica corporativa sigue siendo la plataforma principal de VitaCoreX.',
 see_all_individuals:'Ver servicios individuales seleccionados',
 ind1_desc:'Soporte administrativo para redacción de contratos, revisión documental, formularios empresariales, cartas de requerimiento y paquetes de apoyo.',
 ind2_desc:'Organización del paquete, guía de formularios, revisión previa a la presentación y estructuración de evidencia.',
 ind3_desc:'Revisión del lado del comprador antes de firmar, con análisis de cargos, estructura de pago y apoyo en la negociación.',
 ind3_b1:'Revisión del contrato del concesionario',
 ind4_desc:'Resumen ejecutivo, narrativa para inversionistas, plan de lanzamiento, marco financiero y apoyo para la presentación.',
 ind5_desc:'Soporte estructurado para constitución de empresas, paquetes de registro, presentación de documentos y documentación de arranque.',
 ind5_b3:'Apoyo para la presentación de documentos',
 ind5_b5:'Lista de control de lanzamiento',
 ind6_desc:'Apoyo de traducción documental, revisión bilingüe y localización estructurada para materiales de negocio o expedientes de presentación.',
 role_intake:'Soporte de evaluación inicial',
 careers_t1:'Personas disciplinadas capaces de trabajar dentro de un modelo operativo centrado en la documentación.',
 careers_t2:'Inglés sólido, escrito y hablado.',
 careers_t3:'Las referencias verificables son muy valoradas.',
 careers_t4:'Los candidatos rusohablantes con excelente inglés reciben prioridad.',
 careers_mobile_title:'Carreras - solicitud móvil',
 careers_mobile_body:'Buscamos personas disciplinadas y confiables para apoyar operaciones centradas en la documentación. Se requiere inglés sólido. Las referencias verificables son muy valoradas. En su postulación incluya nombre completo, teléfono, ciudad y estado, rol de interés, una breve presentación y su CV.',
 service_recovery:'Infraestructura de recuperación de ingresos',
 service_file:'Control del expediente legal corporativo',
 service_intake:'Evaluación inicial estructurada y armado del paquete',
 service_briefs:'Solicitud de informe ejecutivo'
});
Object.assign(pageCopy['individual-services'].en, {
 hero_title:'Selected support for individual and one-off matters.',
 hero_lead:'These matters remain available on a selective basis, while VitaCoreX continues to lead with corporate advisory mandates.',
 individual_side_title:'Selective individual access',
 individual_side_body:'Individual matters remain available through structured intake, while corporate mandates stay primary across the platform.'
});
Object.assign(pageCopy['individual-services'].ru, {
 title:'Избранные частные услуги | VitaCoreX LLC',
 desc:'Избранная поддержка по частным услугам: договоры, иммиграционные документы, проверка покупки автомобиля, запуск компании и перевод документов.',
 hero_eyebrow:'Избранные частные услуги',
 hero_title:'Избранная поддержка по частным и разовым запросам.',
 hero_lead:'Эти вопросы остаются доступны выборочно, при этом VitaCoreX сохраняет корпоративное направление в качестве основной платформы.',
 individual_side_title:'Выборочный доступ для частных клиентов',
 individual_side_body:'Частные вопросы остаются доступны через структурированный запрос, а корпоративные проекты сохраняют основной статус по всей платформе.'
});
Object.assign(pageCopy['individual-services'].es, {
 title:'Servicios individuales seleccionados | VitaCoreX LLC',
 desc:'Servicios individuales seleccionados para contratos, documentos migratorios, revisión de compra de auto, constitución de empresa y traducción.',
 hero_eyebrow:'Servicios individuales seleccionados',
 hero_title:'Soporte seleccionado para asuntos individuales y puntuales.',
 hero_lead:'Estos asuntos siguen disponibles de forma selectiva, mientras VitaCoreX mantiene la práctica corporativa como vía principal.',
 individual_side_title:'Acceso individual selectivo',
 individual_side_body:'Los asuntos individuales siguen disponibles mediante solicitud estructurada, mientras la práctica corporativa mantiene el papel principal en toda la plataforma.'
});
Object.assign(pageCopy.careers.ru, {
 title:'Сотрудничество | VitaCoreX LLC',
 desc:'Страница сотрудничества для дисциплинированных кандидатов, способных работать в среде, основанной на документах.',
 hero_eyebrow:'Сотрудничество',
 hero_title:'Работа со структурой, ясностью и дисциплиной исполнения.',
 hero_lead:'Мы ищем людей, которые умеют поддерживать операции, основанные на документах, за счёт сильного письма, суждения, надёжности и стабильности.',
 careers_side_title:'Предпочтительный профиль',
 careers_side_body:'Сильный английский, ясное деловое письмо, подтверждаемые рекомендации как плюс и опыт в документации, операционной поддержке, клиентском сервисе или сопровождении материалов.'
});
Object.assign(pageCopy.careers.es, {
 title:'Carreras | VitaCoreX LLC',
 desc:'Página de carreras para candidatos disciplinados capaces de trabajar en un entorno centrado en la documentación.',
 hero_eyebrow:'Carreras',
 hero_title:'Trabaje con estructura, claridad y ejecución disciplinada.',
 hero_lead:'Buscamos personas capaces de apoyar operaciones centradas en la documentación con buena redacción, criterio, confiabilidad y consistencia.',
 careers_side_title:'Perfil preferido',
 careers_side_body:'Inglés sólido, escritura empresarial clara, referencias verificables muy valoradas y experiencia previa en documentación, operaciones, soporte al cliente o apoyo documental.'
});
Object.assign(pageCopy.home.ru, {
 home_note_pill:'Стандарт закрытого разбора',
 home_note_title:'Для собственников, CFO, операторов и команд, работающих с внешним юридическим контуром.',
 home_note_body:'Первый разговор строится вокруг масштаба утечек, готовности документов и решения о том, нужен ли диагностический разбор, пилот или наведение порядка в досье.',
 home_note_2:'Документы приводятся в порядок до роста внешних расходов',
 trust_2_pill:'Сначала документация'
});
Object.assign(pageCopy.home.es, {
 hero_eyebrow:'Asesoría confidencial para operadores en EE. UU.',
 home_note_pill:'Estándar de revisión privada',
 home_note_title:'Pensado para propietarios, CFOs, operadores y equipos que trabajan junto a asesoría externa.',
 home_note_body:'La primera conversación se estructura alrededor de la fuga de valor, la preparación documental y la decisión de si el mandato requiere diagnóstico, piloto o saneamiento del expediente.',
 home_note_2:'Modelo centrado en la documentación antes de que aumente el costo externo',
 trust_2_pill:'Primero la documentación',
 trust_4_pill:'Límite legal',
 proof_intro:'La capa pública es selectiva por diseño: lo bastante breve para reenviarse internamente y lo bastante sólida para sostener la siguiente conversación.'
});
Object.assign(extra.en, {menu_label:'Menu'});
Object.assign(extra.ru, {menu_label:'Меню'});
Object.assign(extra.es, {menu_label:'Menú'});
if(Array.isArray(staticCopy.resources)){
 staticCopy.resources = [
  {selector:'.hero-side h3', key:'resources_side_title'},
  {selector:'.hero-side p', key:'resources_side_body'},
  ...staticCopy.resources
 ];
}
function preferredLangValue(){
 const explicit=new URLSearchParams(window.location.search).get('lang');
 if(['en','ru','es'].includes(explicit)) return explicit;
 const saved=localStorage.getItem('vcx_lang');
 if(['en','ru','es'].includes(saved)) return saved;
 const rootLang=document.documentElement.getAttribute('lang');
 return ['en','ru','es'].includes(rootLang)?rootLang:'en';
}
function pageText(key, locale=lang){
 const pageKey=currentPageKey();
 return (pageCopy[pageKey] && pageCopy[pageKey][locale] && pageCopy[pageKey][locale][key])
  || (pageCopy[pageKey] && pageCopy[pageKey].en && pageCopy[pageKey].en[key])
  || '';
}
function applyStaticCopy(){
 const entries=staticCopy[currentPageKey()];
 if(!entries || !entries.length) return;
 entries.forEach(entry=>{
  const el=document.querySelector(entry.selector);
  if(!el) return;
  const value=pageText(entry.key) || tr(entry.key);
  if(!value) return;
  if(el.matches('label') && el.querySelector('input,select,textarea')){
   const control=el.querySelector('input,select,textarea');
   Array.from(el.childNodes).forEach(node=>{
    if(node===control) return;
    if(node.nodeType===3 || (node.nodeType===1 && !node.matches('input,select,textarea'))) node.remove();
   });
   el.insertBefore(document.createTextNode(value + ' '), control);
   return;
  }
  el.textContent=value;
 });
}
function applyLocalizedFormChrome(){
 const form=document.getElementById('intakeForm');
 if(!form) return;
 const pageKey=currentPageKey();
 if(pageKey!=='contact' && pageKey!=='structured-intake') return;
 const state=form.querySelector('[name="state"]');
 if(state){
  const label=state.closest('.field')?.querySelector('label');
  if(label) label.textContent=tr('field_state');
  state.setAttribute('placeholder', tr('field_state_ph'));
 }
 const details=form.querySelector('.business-details');
 if(details){
  const summary=details.querySelector('summary');
  if(summary) summary.textContent=tr('details_toggle');
  const companySize=form.querySelector('[name="company_size"]');
  if(companySize){
   const label=companySize.closest('.field')?.querySelector('label');
   if(label) label.textContent=tr('field_company_size');
   companySize.setAttribute('placeholder', tr('ph_company_size'));
  }
  const revenue=form.querySelector('[name="annual_revenue"]');
  if(revenue){
   const label=revenue.closest('.field')?.querySelector('label');
   if(label) label.textContent=tr('field_revenue_range');
   revenue.setAttribute('placeholder', tr('ph_revenue_range'));
  }
  const receivable=form.querySelector('[name="accounts_receivable"]');
  if(receivable){
   const label=receivable.closest('.field')?.querySelector('label');
   if(label) label.textContent=tr('field_ar_size');
   receivable.setAttribute('placeholder', tr('ph_ar_size'));
  }
  const agency=form.querySelector('[name="agency_usage"]');
  if(agency){
   const label=agency.closest('.field')?.querySelector('label');
   if(label) label.textContent=tr('field_agency_usage');
   if(agency.options[0]) agency.options[0].textContent=tr('select_agency_usage');
   if(agency.options[1]) agency.options[1].textContent=tr('agency_none');
   if(agency.options[2]) agency.options[2].textContent=tr('agency_light');
   if(agency.options[3]) agency.options[3].textContent=tr('agency_primary');
  }
 }
 const fileNote=form.querySelector('.file-note');
 if(fileNote) fileNote.textContent=tr(pageKey==='contact' ? 'attachment_note_company' : 'attachment_note_individual');
 const outputNote=document.querySelector('.vcx-flow-form-output .small-note:last-of-type');
 if(outputNote && /legal advice/i.test(outputNote.textContent || '')) outputNote.textContent=tr('output_note');
}
function formatTemplate(template, values){
 return String(template||'').replace(/\{(\w+)\}/g, (_, key)=>values[key] ?? '');
}
let lang=preferredLangValue();
let lastOutput=null;
function tr(key){return pageText(key) || (extra[lang]&&extra[lang][key]) || (page[lang]&&page[lang][key]) || (common[lang]&&common[lang][key]) || pageText(key,'en') || (extra.en&&extra.en[key]) || (page.en&&page.en[key]) || (common.en&&common.en[key]) || '';}
function statusText(key, fallback){ return tr(key) || fallback || ''; }
function setStatus(el, type, message){
  if(!el) return;
  el.textContent = message || '';
  el.className = 'form-status small-note' + (type ? ' ' + type : '');
}
const COMPANY_REVIEW_URL='contact.html?audience=company';
const INDIVIDUAL_INTAKE_URL='structured-case-intake.html?audience=individual';
const INDIVIDUAL_SERVICES_URL='additional-services.html';
const STRATEGY_CALL_URL='https://calendly.com/vitacorex2025/30min';
const EXECUTIVE_BRIEF_URL='resources.html';
const VCX_THANK_YOU_BASE='https://vitacorexllc.com/thank-you.html';
const STEP08_COPY={
 en:{
  footer_legal_title:'Legal boundary',
  footer_companies_note:'Primary path for operators, finance leaders, and counsel-facing teams.',
  footer_individuals_note:'Selected individual matters remain available only through structured intake.',
  footer_secondary_note:'Careers and general contact stay clearly secondary to client routing.',
  engagement_eyebrow:'How engagements are structured',
  engagement_title:'Each engagement moves through a compact decision sequence.',
  engagement_intro:'The work begins with a confidential review, narrows to the most useful packet or pilot scope, and expands only when the operating case is clear.',
  engagement_step_1_title:'1. Confidential review',
  engagement_step_1_body:'We review the operating issue, the current file condition, and the decision pressure behind the request.',
  engagement_step_2_title:'2. Defined work product',
  engagement_step_2_body:'VitaCoreX scopes the first packet, file-control sprint, or pilot design around what leadership actually needs next.',
  engagement_step_3_title:'3. Executive checkpoint',
  engagement_step_3_body:'Leadership receives a cleaner file, clearer options, and a recommendation on whether to hold, hand off, or scale.',
  trust_tampa_title:'Tampa / U.S. operator base',
  trust_tampa_body:'Company reviews are led from Tampa for U.S. buyers who want calm routing and disciplined documentation.',
  trust_docs_title:'Documentation-first',
  trust_docs_body:'The work starts with chronology, exhibits, file order, and handoff quality before outside cost grows.',
  trust_response_title:'Response discipline',
  trust_response_body:'Qualified submissions are routed with a defined response window and a clear next-step doctrine.',
  trust_legal_title:'Not a law firm',
  trust_legal_body:'VitaCoreX provides advisory, documentation, and workflow support; legal advice remains with licensed counsel.',
  home_evidence_eyebrow:'Evidence architecture',
  home_evidence_title:'Proof surfaces designed to move an internal decision.',
  home_evidence_intro:'Instead of broad claims, the public layer shows how VitaCoreX frames risk, packet quality, and next-step structure.',
  evidence_brief_title:'Executive brief',
  evidence_brief_body:'A concise decision memo for owners, finance leaders, operators, and internal stakeholders.',
  evidence_packet_title:'Packet example',
  evidence_packet_body:'Sample packet logic showing chronology, exhibits, payment support, and open issues in one controlled file.',
  evidence_structure_title:'Engagement structure',
  evidence_structure_body:'A compact explanation of how diagnostic review, pilot scope, and scale decisions are sequenced.',
  evidence_example_title:'Operator example',
  evidence_example_body:'Representative operating scenarios describe the type of problem, packet, and decision path without inventing logos or testimonials.',
  resources_hero_note_title:'What the resource layer is for',
  resources_hero_note_body:'These materials help leadership teams align internally, circulate a concise frame, and decide whether a confidential review is warranted.',
  resources_system_eyebrow:'Executive asset system',
  resources_system_title:'Executive materials, packet logic, and process clarity in one controlled layer.',
  resources_system_intro:'Each asset is designed to support a specific internal conversation: finance review, operator diagnosis, investment discussion, or escalation planning.',
  resources_use_1_title:'Executive briefs',
  resources_use_1_body:'Short decision documents for owners, finance leadership, operators, and internal forwarding.',
  resources_use_2_title:'Operator examples',
  resources_use_2_body:'Representative scenarios that show where workflow design or file control becomes valuable.',
  resources_use_3_title:'Packet examples',
  resources_use_3_body:'Controlled examples of chronology, exhibit order, and support material expected in a cleaner first review.',
  resources_use_4_title:'Process clarity',
  resources_use_4_body:'A clear view of what happens after the brief: confidential review, scoped work product, and leadership checkpoint.',
  resources_conf_note:'Representative materials are shared for executive review. Live client files, legal strategy, and confidential operating details remain private.',
  resources_card_1_body:'Operator-facing scan of leakage sources, sequencing friction, and margin loss from early outside escalation.',
  resources_card_1_tag:'Operator brief',
  resources_card_2_body:'Finance-facing brief for recovery drag, DSO pressure, and internal reporting logic.',
  resources_card_2_tag:'Finance brief',
  resources_card_3_body:'Board and investment framing for pilot economics, operating controls, and rollout logic.',
  resources_card_3_tag:'Institutional deck',
  resources_card_4_body:'Executive note on pre-agency sequencing, escalation discipline, and packet readiness.',
  resources_card_4_tag:'Escalation review',
  corporate_strip_eyebrow:'Trust and clarity',
  corporate_strip_title:'What premium buyers should understand before legal handoff begins.',
  corporate_strip_intro:'This route is built for file order, packet quality, and counsel support. It does not replace legal judgment.',
  corporate_card_1_title:'Counsel-ready packet example',
  corporate_card_1_body:'Chronology, issue memo, exhibits map, payment support, authorization record, and gap log prepared in one disciplined structure.',
  corporate_card_2_title:'Planning tools, not promises',
  corporate_card_2_body:'The drag estimator and readiness index are directional planning tools for leadership, not guarantees of legal or financial outcome.',
  corporate_card_3_title:'Legal boundary',
  corporate_card_3_body:'VitaCoreX is not a law firm. Legal strategy, legal advice, and representation stay with licensed counsel.',
  corporate_packet_pill:'Packet example',
  corporate_packet_title:'What a cleaner first handoff contains',
  corporate_packet_intro:'The first work product is built to help leadership and outside counsel see the same file in the same order.',
  corporate_packet_item_1:'Chronology and issue summary',
  corporate_packet_item_2:'Exhibit index and supporting documents',
  corporate_packet_item_3:'Payment, authorization, and escalation support',
  corporate_packet_item_4:'Open questions, gaps, and next-action note',
  corporate_plan_pill:'Engagement structure',
  corporate_plan_title:'How file-control work is usually scoped',
  corporate_plan_intro:'Most mandates begin with a contained cleanup sprint and an executive checkpoint before any broader rollout.',
  corporate_estimator_eyebrow:'Directional planning model',
  corporate_estimator_title:'Model the cost of cleanup before counsel can focus on judgment.',
  corporate_estimator_body:'Use the estimator to frame staffing and handoff logic. It is a planning model, not a claim of outcome.',
  corporate_result_title:'Directional exposure',
  corporate_result_body:'Use the estimator to quantify how much high-cost legal time may be consumed by administrative file preparation.',
  revenue_safe_title:'Built for controlled deployment',
  revenue_safe_body:'Designed for U.S. operator workflows that need disciplined documentation, escalation guardrails, and executive reporting.',
  revenue_markers_title:'Decision criteria',
  revenue_markers_intro:'Leadership should judge the opportunity by workflow control, documentation quality, and escalation discipline, not vanity metrics.',
  revenue_marker_1_title:'Balance segmentation',
  revenue_marker_1_body:'Which accounts can convert earlier with better cadence, payment options, and documentation.',
  revenue_marker_2_title:'Commitment quality',
  revenue_marker_2_body:'Whether payment promises, authorizations, and follow-up logic hold up under real operating pressure.',
  revenue_marker_3_title:'Escalation governance',
  revenue_marker_3_body:'Whether agency or counsel handoff happens only after the internal route has been used correctly.',
  revenue_model_title:'Directional planning model',
  revenue_model_note:'Directional planning only. Actual performance depends on balance mix, payment behavior, documentation quality, and execution discipline.',
  revenue_outputs_title:'Planning outputs',
  revenue_examples_eyebrow:'Operator archetypes',
  revenue_examples_title:'Representative operating scenarios',
  revenue_examples_intro:'These examples show the types of situations suited for a pilot or workflow redesign. They are not client claims or testimonials.',
  revenue_example_1_title:'Multi-site dental operator',
  revenue_example_1_value:'Patient-balance sequencing',
  revenue_example_1_body:'Focus on promise-to-pay discipline, autopay conversion, and cleaner escalation thresholds.',
  revenue_example_2_title:'Healthcare platform',
  revenue_example_2_value:'Portfolio reporting',
  revenue_example_2_body:'Focus on aging visibility, payment-plan documentation, and weekly executive reporting.',
  revenue_example_3_title:'Subscription portfolio',
  revenue_example_3_value:'Exception routing',
  revenue_example_3_body:'Focus on failed-payment recovery, account segmentation, and documented handoff rules.',
  revenue_example_4_title:'Contract-heavy service operator',
  revenue_example_4_value:'Dispute and notice control',
  revenue_example_4_body:'Focus on evidence structure, notice cadence, and pre-agency decision logic.'
 },
 ru:{
  footer_legal_title:'Правовая граница',
  footer_companies_note:'Основной маршрут для операторов, финансовых руководителей и команд, работающих с внешними юридическими советниками.',
  footer_individuals_note:'Выбранные частные запросы принимаются только через структурированную заявку.',
  footer_secondary_note:'Раздел карьеры и общие контакты остаются явно вторичными по отношению к маршрутизации клиентов.',
  engagement_eyebrow:'Как структурируется работа',
  engagement_title:'Каждый мандат проходит короткую последовательность решений.',
  engagement_intro:'Работа начинается с конфиденциального разбора, затем сужается до наиболее полезного пакета или пилотного контура и расширяется только тогда, когда операционная логика подтверждена.',
  engagement_step_1_title:'1. Конфиденциальный разбор',
  engagement_step_1_body:'Мы оцениваем операционную проблему, текущее состояние досье и управленческое решение, которое нужно принять.',
  engagement_step_2_title:'2. Определённый первый результат',
  engagement_step_2_body:'VitaCoreX определяет первый пакет, спринт по упорядочиванию досье или пилотный контур под тот следующий шаг, который действительно нужен руководству.',
  engagement_step_3_title:'3. Управленческая контрольная точка',
  engagement_step_3_body:'Руководство получает более чистое досье, понятные варианты действий и рекомендацию: удерживать, передавать дальше или масштабировать.',
  trust_tampa_title:'Тампа / сигнал присутствия в США',
  trust_tampa_body:'Корпоративные разборы ведутся из Тампы для покупателей в США, которым нужна спокойная маршрутизация и дисциплина в документах.',
  trust_docs_title:'Подход от документов',
  trust_docs_body:'Работа начинается с хронологии, приложений, порядка в файле и качества передачи ещё до роста внешних затрат.',
  trust_response_title:'Дисциплина ответа',
  trust_response_body:'Квалифицированные обращения маршрутизируются с понятным окном ответа и чётким следующим действием.',
  trust_legal_title:'Не юридическая фирма',
  trust_legal_body:'VitaCoreX оказывает консультационную, документационную и операционную поддержку; правовые советы остаются за лицензированным адвокатом.',
  home_evidence_eyebrow:'Архитектура доказательности',
  home_evidence_title:'Поверхность доверия, которая помогает продвинуть внутреннее решение.',
  home_evidence_intro:'Вместо расплывчатых обещаний и театра престижа публичный слой показывает, как VitaCoreX оформляет риск, качество пакета и логику следующего шага.',
  evidence_brief_title:'Материал для руководства',
  evidence_brief_body:'Краткая записка для собственников, финансового руководства, операторов и внутренних согласований.',
  evidence_packet_title:'Пример пакета',
  evidence_packet_body:'Логика примерного пакета с хронологией, приложениями, платёжными подтверждениями и открытыми вопросами в одном контролируемом файле.',
  evidence_structure_title:'Структура работы',
  evidence_structure_body:'Короткое объяснение того, как выстраиваются диагностический разбор, пилотный объём и решение о масштабировании.',
  evidence_example_title:'Пример операционного сценария',
  evidence_example_body:'Репрезентативные сценарии показывают тип проблемы, пакет и путь решения без вымышленных логотипов и отзывов.',
  resources_hero_note_title:'Для чего нужен этот слой материалов',
  resources_hero_note_body:'Эти материалы помогают руководству согласовать позицию внутри компании, переслать краткую рамку и понять, нужен ли конфиденциальный разбор.',
  resources_system_eyebrow:'Система executive-материалов',
  resources_system_title:'Материалы для руководства, логика пакета и ясность процесса в одном контролируемом слое.',
  resources_system_intro:'Каждый материал поддерживает конкретный внутренний разговор: финансовый review, операционную диагностику, инвестиционное обсуждение или планирование эскалации.',
  resources_use_1_title:'Материалы для руководства',
  resources_use_1_body:'Короткие документы для собственников, финансового руководства, операторов и внутреннего пересыла.',
  resources_use_2_title:'Операционные сценарии',
  resources_use_2_body:'Репрезентативные ситуации, показывающие, где ценность создают дизайн workflow и контроль досье.',
  resources_use_3_title:'Примеры пакетов',
  resources_use_3_body:'Контролируемые примеры хронологии, порядка приложений и состава материалов для более чистого первого review.',
  resources_use_4_title:'Ясность процесса',
  resources_use_4_body:'Понятная логика того, что происходит после материала: конфиденциальный разбор, определённый объём работы и контрольная точка для руководства.',
  resources_conf_note:'Публично показываются только репрезентативные материалы для управленческого review. Реальные клиентские файлы, правовая стратегия и конфиденциальные операционные детали остаются закрытыми.',
  resources_card_1_body:'Материал для операторов по источникам утечки, сбоям в последовательности и потере маржи из-за ранней внешней эскалации.',
  resources_card_1_tag:'Материал для операторов',
  resources_card_2_body:'Материал для финансового руководства о давлении на возврат, DSO и логике внутренней отчётности.',
  resources_card_2_tag:'Финансовый материал',
  resources_card_3_body:'Подача для совета и инвесткомитета по экономике пилота, операционному контролю и логике rollout.',
  resources_card_3_tag:'Институциональный deck',
  resources_card_4_body:'Краткая записка по pre-agency sequencing, дисциплине эскалации и готовности пакета.',
  resources_card_4_tag:'Разбор эскалации',
  corporate_strip_eyebrow:'Доверие и ясность',
  corporate_strip_title:'Что премиальный покупатель должен понять до передачи вопроса юристу.',
  corporate_strip_intro:'Этот маршрут построен вокруг порядка в досье, качества пакета и поддержки внешнего юриста. Он не заменяет юридическое суждение.',
  corporate_card_1_title:'Пример пакета для внешнего юриста',
  corporate_card_1_body:'Хронология, карта вопросов, схема приложений, платёжные подтверждения, авторизации и журнал пробелов, собранные в одной дисциплинированной структуре.',
  corporate_card_2_title:'Инструменты планирования, а не обещания',
  corporate_card_2_body:'Оценка потерь на ставке юриста и индекс готовности нужны руководству для планирования, а не как обещание правового или финансового результата.',
  corporate_card_3_title:'Правовая граница',
  corporate_card_3_body:'VitaCoreX не является юридической фирмой. Правовая стратегия, юридические советы и представительство остаются за лицензированным адвокатом.',
  corporate_packet_pill:'Пример пакета',
  corporate_packet_title:'Из чего состоит более чистая первая передача',
  corporate_packet_intro:'Первый результат выстраивается так, чтобы руководство и внешний юрист видели один и тот же файл в одном и том же порядке.',
  corporate_packet_item_1:'Хронология и краткое описание вопроса',
  corporate_packet_item_2:'Индекс приложений и подтверждающих документов',
  corporate_packet_item_3:'Платёжные, авторизационные и эскалационные материалы',
  corporate_packet_item_4:'Открытые вопросы, пробелы и записка со следующим действием',
  corporate_plan_pill:'Структура мандата',
  corporate_plan_title:'Как обычно выстраивается работа по корпоративному досье',
  corporate_plan_intro:'Большинство мандатов начинается с ограниченного спринта по очистке файла и управленческой контрольной точки до любого более широкого rollout.',
  corporate_estimator_eyebrow:'Направляющая модель планирования',
  corporate_estimator_title:'Смоделируйте стоимость очистки до того, как юрист сможет заняться суждением по сути.',
  corporate_estimator_body:'Используйте оценку для кадрового и handoff-планирования. Это модель планирования, а не обещание результата.',
  corporate_result_title:'Ориентировочная нагрузка',
  corporate_result_body:'Используйте модель, чтобы понять, сколько дорогого юридического времени может уходить на административную подготовку файла.',
  revenue_safe_title:'Создано для контролируемого внедрения',
  revenue_safe_body:'Подход рассчитан на операционные процессы в США, где нужны дисциплина в документации, guardrails для эскалации и executive-отчётность.',
  revenue_markers_title:'Критерии решения',
  revenue_markers_intro:'Руководству следует оценивать потенциал по качеству процесса, документации и дисциплине эскалации, а не по витринным метрикам.',
  revenue_marker_1_title:'Сегментация балансов',
  revenue_marker_1_body:'Какие счета могут конвертироваться раньше за счёт более точного касания, вариантов оплаты и документального контроля.',
  revenue_marker_2_title:'Качество обязательств',
  revenue_marker_2_body:'Насколько обещания оплаты, авторизации и логика follow-up выдерживают реальное операционное давление.',
  revenue_marker_3_title:'Управление эскалацией',
  revenue_marker_3_body:'Передаётся ли вопрос в агентство или к юристу только после корректного использования внутреннего маршрута.',
  revenue_model_title:'Направляющая модель планирования',
  revenue_model_note:'Только для планирования. Фактический результат зависит от состава портфеля, поведения плательщиков, качества документов и дисциплины исполнения.',
  revenue_outputs_title:'Планировочные выходы',
  revenue_examples_eyebrow:'Операционные архетипы',
  revenue_examples_title:'Репрезентативные рабочие сценарии',
  revenue_examples_intro:'Эти примеры показывают типы ситуаций, для которых подходит пилот или redesign workflow. Это не клиентские заявления и не testimonials.',
  revenue_example_1_title:'Сеть стоматологических точек',
  revenue_example_1_value:'Последовательность patient-balance',
  revenue_example_1_body:'Фокус на дисциплине promise-to-pay, переводе в autopay и более чистых порогах эскалации.',
  revenue_example_2_title:'Платформа в healthcare',
  revenue_example_2_value:'Отчётность по портфелю',
  revenue_example_2_body:'Фокус на видимости aging, документации payment plan и еженедельной управленческой отчётности.',
  revenue_example_3_title:'Подписочный портфель',
  revenue_example_3_value:'Маршрутизация исключений',
  revenue_example_3_body:'Фокус на восстановлении failed payments, сегментации аккаунтов и документированной логике handoff.',
  revenue_example_4_title:'Сервисный оператор с тяжёлой договорной базой',
  revenue_example_4_value:'Контроль споров и уведомлений',
  revenue_example_4_body:'Фокус на структуре доказательств, cadence уведомлений и предагентской логике решения.'
 },
 es:{
  footer_legal_title:'Limite legal',
  footer_companies_note:'Ruta principal para operadores, lideres financieros y equipos que trabajan junto a asesoria externa.',
  footer_individuals_note:'Los asuntos individuales seleccionados siguen disponibles solo mediante intake estructurado.',
  footer_secondary_note:'Carreras y el contacto general quedan claramente subordinados a la ruta de clientes.',
  engagement_eyebrow:'Como se estructuran los engagements',
  engagement_title:'Cada engagement sigue una secuencia breve de decisiones.',
  engagement_intro:'El trabajo comienza con una revision confidencial, se concentra en el paquete o piloto mas util y solo se amplia cuando el caso operativo queda claro.',
  engagement_step_1_title:'1. Revision confidencial',
  engagement_step_1_body:'Revisamos el problema operativo, el estado actual del expediente y la presion de decision detras de la solicitud.',
  engagement_step_2_title:'2. Entregable definido',
  engagement_step_2_body:'VitaCoreX delimita el primer paquete, sprint de control de expediente o diseno de piloto en funcion de lo que la direccion necesita de inmediato.',
  engagement_step_3_title:'3. Punto de control ejecutivo',
  engagement_step_3_body:'La direccion recibe un expediente mas limpio, opciones mas claras y una recomendacion sobre si conviene sostener, escalar o hacer handoff.',
  trust_tampa_title:'Tampa / senal operativa en EE. UU.',
  trust_tampa_body:'Las revisiones corporativas se dirigen desde Tampa para compradores en EE. UU. que valoran una ruta serena y disciplina documental.',
  trust_docs_title:'Documentacion primero',
  trust_docs_body:'El trabajo empieza por cronologia, anexos, orden del expediente y calidad de handoff antes de que crezca el costo externo.',
  trust_response_title:'Disciplina de respuesta',
  trust_response_body:'Las solicitudes calificadas se enrutan con una ventana de respuesta definida y un siguiente paso claro.',
  trust_legal_title:'No es un bufete juridico',
  trust_legal_body:'VitaCoreX presta soporte de asesoria, documentacion y flujo operativo; el consejo legal sigue en manos de abogados con licencia.',
  home_evidence_eyebrow:'Arquitectura de evidencia',
  home_evidence_title:'Superficies de prueba pensadas para mover una decision interna.',
  home_evidence_intro:'En lugar de afirmaciones vagas o teatro de prestigio, la capa publica muestra como VitaCoreX ordena riesgo, calidad de paquete y estructura del siguiente paso.',
  evidence_brief_title:'Informe ejecutivo',
  evidence_brief_body:'Una nota breve de decision para propietarios, liderazgo financiero, operadores y circulacion interna.',
  evidence_packet_title:'Ejemplo de paquete',
  evidence_packet_body:'Logica de paquete que muestra cronologia, anexos, soporte de pago y preguntas abiertas en un solo expediente controlado.',
  evidence_structure_title:'Estructura del engagement',
  evidence_structure_body:'Explicacion compacta de como se secuencian la revision diagnostica, el alcance del piloto y la decision de escala.',
  evidence_example_title:'Ejemplo operativo',
  evidence_example_body:'Escenarios representativos muestran el tipo de problema, paquete y ruta de decision sin inventar logos ni testimonios.',
  resources_hero_note_title:'Para que sirve esta capa de recursos',
  resources_hero_note_body:'Estos materiales ayudan al liderazgo a alinearse internamente, circular un marco conciso y decidir si procede una revision confidencial.',
  resources_system_eyebrow:'Sistema de activos ejecutivos',
  resources_system_title:'Material ejecutivo, logica de paquete y claridad de proceso en una sola capa controlada.',
  resources_system_intro:'Cada activo esta pensado para una conversacion interna distinta: revision financiera, diagnostico operativo, discusion de inversion o planificacion de escalacion.',
  resources_use_1_title:'Informes ejecutivos',
  resources_use_1_body:'Documentos breves de decision para propietarios, liderazgo financiero, operadores y reenvio interno.',
  resources_use_2_title:'Escenarios operativos',
  resources_use_2_body:'Situaciones representativas que muestran donde el diseno del workflow o el control del expediente generan valor.',
  resources_use_3_title:'Ejemplos de paquete',
  resources_use_3_body:'Ejemplos controlados de cronologia, orden de anexos y material de soporte esperable en una primera revision mas limpia.',
  resources_use_4_title:'Claridad del proceso',
  resources_use_4_body:'Una vista clara de lo que ocurre despues del informe: revision confidencial, entregable delimitado y punto de control ejecutivo.',
  resources_conf_note:'Se comparten materiales representativos para revision ejecutiva. Los expedientes reales, la estrategia legal y los detalles operativos confidenciales permanecen privados.',
  resources_card_1_body:'Revision orientada a operadores sobre fuentes de fuga, friccion de secuencia y perdida de margen por escalacion externa temprana.',
  resources_card_1_tag:'Informe operativo',
  resources_card_2_body:'Informe para liderazgo financiero sobre freno de recuperacion, presion sobre DSO y logica de reporting interno.',
  resources_card_2_tag:'Informe financiero',
  resources_card_3_body:'Planteamiento para consejo e inversion sobre economia del piloto, controles operativos y logica de despliegue.',
  resources_card_3_tag:'Deck institucional',
  resources_card_4_body:'Nota ejecutiva sobre secuencia pre-agencia, disciplina de escalacion y preparacion del paquete.',
  resources_card_4_tag:'Revision de escalacion',
  corporate_strip_eyebrow:'Confianza y claridad',
  corporate_strip_title:'Lo que un comprador premium debe entender antes de iniciar el handoff legal.',
  corporate_strip_intro:'Esta ruta esta pensada para orden del expediente, calidad del paquete y apoyo a counsel externo. No sustituye el criterio legal.',
  corporate_card_1_title:'Ejemplo de paquete listo para counsel',
  corporate_card_1_body:'Cronologia, memo de issues, mapa de anexos, soporte de pago, registro de autorizaciones y lista de vacios dentro de una sola estructura disciplinada.',
  corporate_card_2_title:'Herramientas de planificacion, no promesas',
  corporate_card_2_body:'El estimador de drag y el indice de preparacion son herramientas de liderazgo para planificar, no garantias de resultado legal o financiero.',
  corporate_card_3_title:'Limite legal',
  corporate_card_3_body:'VitaCoreX no es un bufete juridico. La estrategia legal, el asesoramiento legal y la representacion permanecen con abogados autorizados.',
  corporate_packet_pill:'Ejemplo de paquete',
  corporate_packet_title:'Que contiene un primer handoff mas limpio',
  corporate_packet_intro:'El primer entregable se construye para que la direccion y el counsel externo lean el mismo expediente en el mismo orden.',
  corporate_packet_item_1:'Cronologia y resumen del asunto',
  corporate_packet_item_2:'Indice de anexos y documentos de soporte',
  corporate_packet_item_3:'Soporte de pago, autorizacion y escalacion',
  corporate_packet_item_4:'Preguntas abiertas, vacios y nota de siguiente accion',
  corporate_plan_pill:'Estructura del engagement',
  corporate_plan_title:'Como suele delimitarse el trabajo de control del expediente',
  corporate_plan_intro:'La mayoria de los mandatos comienza con un sprint acotado de limpieza y un punto de control ejecutivo antes de cualquier despliegue mayor.',
  corporate_estimator_eyebrow:'Modelo direccional de planificacion',
  corporate_estimator_title:'Modele el costo de limpieza antes de que counsel pueda concentrarse en el juicio legal.',
  corporate_estimator_body:'Use el estimador para definir staffing y logica de handoff. Es un modelo de planificacion, no una promesa de resultado.',
  corporate_result_title:'Exposicion direccional',
  corporate_result_body:'Use el modelo para estimar cuanto tiempo juridico de alto costo puede absorber hoy la preparacion administrativa del expediente.',
  revenue_safe_title:'Pensado para un despliegue controlado',
  revenue_safe_body:'Disenado para workflows de operadores en EE. UU. que necesitan disciplina documental, guardrails de escalacion y reporting ejecutivo.',
  revenue_markers_title:'Criterios de decision',
  revenue_markers_intro:'La direccion debe evaluar la oportunidad por control del workflow, calidad documental y disciplina de escalacion, no por metricas de escaparate.',
  revenue_marker_1_title:'Segmentacion de saldos',
  revenue_marker_1_body:'Que cuentas pueden convertir antes con mejor cadencia, opciones de pago y soporte documental.',
  revenue_marker_2_title:'Calidad del compromiso',
  revenue_marker_2_body:'Si las promesas de pago, autorizaciones y la logica de seguimiento resisten la presion operativa real.',
  revenue_marker_3_title:'Gobernanza de la escalacion',
  revenue_marker_3_body:'Si el handoff a agencia o counsel ocurre solo despues de haber utilizado correctamente la ruta interna.',
  revenue_model_title:'Modelo direccional de planificacion',
  revenue_model_note:'Solo para planificacion. El resultado real depende de la mezcla del portafolio, el comportamiento de pago, la calidad documental y la disciplina de ejecucion.',
  revenue_outputs_title:'Salidas de planificacion',
  revenue_examples_eyebrow:'Arquetipos operativos',
  revenue_examples_title:'Escenarios operativos representativos',
  revenue_examples_intro:'Estos ejemplos muestran el tipo de situaciones aptas para un piloto o rediseño de workflow. No son afirmaciones de clientes ni testimonios.',
  revenue_example_1_title:'Operador dental multisitio',
  revenue_example_1_value:'Secuencia de saldos de pacientes',
  revenue_example_1_body:'Foco en disciplina de promesa de pago, conversion a autopay y umbrales de escalacion mas limpios.',
  revenue_example_2_title:'Plataforma de salud',
  revenue_example_2_value:'Reporting del portafolio',
  revenue_example_2_body:'Foco en visibilidad de aging, documentacion de planes de pago y reporting ejecutivo semanal.',
  revenue_example_3_title:'Portafolio de suscripcion',
  revenue_example_3_value:'Enrutamiento de excepciones',
  revenue_example_3_body:'Foco en recuperacion de pagos fallidos, segmentacion de cuentas y reglas documentadas de handoff.',
  revenue_example_4_title:'Operador de servicios con base contractual intensa',
  revenue_example_4_value:'Control de disputa y notificaciones',
  revenue_example_4_body:'Foco en estructura de evidencia, cadencia de avisos y logica de decision previa a agencia.'
 }
};
Object.assign(STEP08_COPY.ru, {
 footer_legal_title:'Правовая граница',
 corporate_card_3_title:'Правовая граница'
});
Object.assign(STEP08_COPY.es, {
 footer_legal_title:'Límite legal',
 corporate_card_3_title:'Límite legal'
});
function step08(key){
 const pack=STEP08_COPY[lang] || STEP08_COPY.en;
 return pack[key] || STEP08_COPY.en[key] || tr(key) || '';
}
const FORM_ROUTE_COPY={
 en:{
  route_context_label:'Routing note',
  route_followup_label:'Response window',
  route_company_review_label:'Confidential company review',
  route_company_review_form:'Confidential Review',
  route_company_review_subject:'VitaCoreX Confidential Review',
  route_company_review_body:'Built for owners, operators, finance leaders, and counsel-adjacent teams. Page, language, service, and source context travel with the submission.',
  route_company_review_window:'Acknowledgement within 24 business hours after a complete submission.',
  route_company_review_pending:'Routing your confidential review now.',
  route_company_review_error:'We could not route the confidential review right now. Please try again or contact VitaCoreX directly.',
  route_individual_request_label:'Structured service request',
  route_individual_request_form:'Structured Service Request',
  route_individual_request_subject:'VitaCoreX Structured Service Request',
  route_individual_request_body:'Use this path for selected individual matters that need orderly intake, clean documentation, and a defined next step.',
  route_individual_request_window:'Acknowledgement within one business day after a complete request.',
  route_individual_request_pending:'Routing your service request now.',
  route_individual_request_error:'We could not route the service request right now. Please try again or contact VitaCoreX directly.',
  route_executive_brief_unlock_label:'Executive brief unlock',
  route_executive_brief_unlock_form:'Executive Brief Unlock',
  route_executive_brief_unlock_subject:'VitaCoreX Executive Brief Unlock',
  route_executive_brief_unlock_body:'Asset access opens immediately. Request context is logged so VitaCoreX can follow up without restarting the conversation.',
  route_executive_brief_unlock_window:'Immediate asset access. Follow-up within one business day when warranted.',
  route_executive_brief_unlock_pending:'Unlocking the executive brief now.',
  route_executive_brief_unlock_success:'Executive brief unlocked. If follow-up is warranted, VitaCoreX will respond within one business day.',
  route_executive_brief_unlock_error:'We could not unlock the brief right now. Please try again or contact VitaCoreX directly.',
  route_careers_application_label:'Careers application',
  route_careers_application_form:'Careers Application',
  route_careers_application_subject:'VitaCoreX Careers Application',
  route_careers_application_body:'Applications are reviewed in batches for writing discipline, reliability, and fit with a documentation-first operating model.',
  route_careers_application_window:'Initial review within three business days.',
  route_careers_application_pending:'Routing your application now.',
  route_careers_application_success:'Application received. If there is alignment, VitaCoreX will reply with next-step instructions within three business days.',
  route_careers_application_error:'We could not route the application right now. Please try again or contact VitaCoreX directly.',
  thank_track_label:'Review track',
  thank_track_company:'Company confidential review',
  thank_track_individual:'Selected individual services',
  thank_track_careers:'Careers application',
  thank_track_brief:'Executive material request',
  thank_company_title:'Thank you. Your confidential review is in queue.',
  thank_company_lead:'VitaCoreX received your company review request and routed it to the company review track. An acknowledgement will follow after the initial screening.',
  thank_individual_title:'Thank you. Your service request is in queue.',
  thank_individual_lead:'VitaCoreX received your selected individual-service request and routed it to the appropriate intake track. An acknowledgement will follow after the initial screening.',
  thank_careers_title:'Thank you. Your application is in queue.',
  thank_careers_lead:'Your application has been routed for review. If there is alignment, VitaCoreX will reply with next-step instructions.',
  thank_brief_title:'Thank you. Your executive material request is logged.',
  thank_brief_lead:'The request was captured and the executive-material route is open. If follow-up is warranted, VitaCoreX will respond within one business day.',
  thank_window_company:'Acknowledgement within 24 business hours',
  thank_window_individual:'Acknowledgement within one business day',
  thank_window_careers:'Initial review within three business days',
  thank_window_brief:'Immediate asset access; follow-up within one business day when warranted',
  thank_individual_cta:'Review selected services',
  thank_careers_cta:'For Companies',
  thank_brief_cta:'Request confidential review',
  thank_careers_meta_title:'Application Received | VitaCoreX LLC',
  thank_careers_meta_desc:'Your VitaCoreX application has been received and routed for review.',
  thank_brief_meta_title:'Executive Material Request Received | VitaCoreX LLC',
  thank_brief_meta_desc:'Your executive material request has been received and routed.'
 },
 ru:{
  route_context_label:'\u041b\u043e\u0433\u0438\u043a\u0430 \u043c\u0430\u0440\u0448\u0440\u0443\u0442\u0438\u0437\u0430\u0446\u0438\u0438',
  route_followup_label:'\u041e\u043a\u043d\u043e \u043e\u0442\u0432\u0435\u0442\u0430',
  route_company_review_label:'\u041a\u043e\u043d\u0444\u0438\u0434\u0435\u043d\u0446\u0438\u0430\u043b\u044c\u043d\u044b\u0439 \u043a\u043e\u0440\u043f\u043e\u0440\u0430\u0442\u0438\u0432\u043d\u044b\u0439 \u0440\u0430\u0437\u0431\u043e\u0440',
  route_company_review_form:'\u041a\u043e\u043d\u0444\u0438\u0434\u0435\u043d\u0446\u0438\u0430\u043b\u044c\u043d\u044b\u0439 \u0440\u0430\u0437\u0431\u043e\u0440',
  route_company_review_subject:'VitaCoreX \u2014 \u043a\u043e\u043d\u0444\u0438\u0434\u0435\u043d\u0446\u0438\u0430\u043b\u044c\u043d\u044b\u0439 \u0440\u0430\u0437\u0431\u043e\u0440',
  route_company_review_body:'\u041f\u0443\u0442\u044c \u0434\u043b\u044f \u0432\u043b\u0430\u0434\u0435\u043b\u044c\u0446\u0435\u0432, \u043e\u043f\u0435\u0440\u0430\u0442\u043e\u0440\u043e\u0432, \u0444\u0438\u043d\u0430\u043d\u0441\u043e\u0432\u043e\u0433\u043e \u0440\u0443\u043a\u043e\u0432\u043e\u0434\u0441\u0442\u0432\u0430 \u0438 \u043a\u043e\u043c\u0430\u043d\u0434, \u0440\u0430\u0431\u043e\u0442\u0430\u044e\u0449\u0438\u0445 \u0440\u044f\u0434\u043e\u043c \u0441 counsel. \u0421 \u0437\u0430\u043f\u0440\u043e\u0441\u043e\u043c \u0441\u043e\u0445\u0440\u0430\u043d\u044f\u044e\u0442\u0441\u044f \u043a\u043e\u043d\u0442\u0435\u043a\u0441\u0442 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u044b, \u044f\u0437\u044b\u043a, \u043d\u0443\u0436\u043d\u0430\u044f \u0443\u0441\u043b\u0443\u0433\u0430 \u0438 \u0438\u0441\u0442\u043e\u0447\u043d\u0438\u043a.',
  route_company_review_window:'\u041f\u043e\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043d\u0438\u0435 \u0432 \u0442\u0435\u0447\u0435\u043d\u0438\u0435 24 \u0440\u0430\u0431\u043e\u0447\u0438\u0445 \u0447\u0430\u0441\u043e\u0432 \u043f\u043e\u0441\u043b\u0435 \u043f\u043e\u043b\u043d\u043e\u0439 \u043e\u0442\u043f\u0440\u0430\u0432\u043a\u0438.',
  route_company_review_pending:'\u041d\u0430\u043f\u0440\u0430\u0432\u043b\u044f\u0435\u043c \u0432\u0430\u0448 \u043a\u043e\u043d\u0444\u0438\u0434\u0435\u043d\u0446\u0438\u0430\u043b\u044c\u043d\u044b\u0439 \u0440\u0430\u0437\u0431\u043e\u0440.',
  route_company_review_error:'Сейчас не удалось направить запрос. Попробуйте еще раз или свяжитесь с VitaCoreX напрямую.',
  route_individual_request_label:'\u0421\u0442\u0440\u0443\u043a\u0442\u0443\u0440\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u044b\u0439 \u0437\u0430\u043f\u0440\u043e\u0441 \u043d\u0430 \u0443\u0441\u043b\u0443\u0433\u0443',
  route_individual_request_form:'\u0421\u0442\u0440\u0443\u043a\u0442\u0443\u0440\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u044b\u0439 \u0437\u0430\u043f\u0440\u043e\u0441 \u043d\u0430 \u0443\u0441\u043b\u0443\u0433\u0443',
  route_individual_request_subject:'VitaCoreX \u2014 \u0441\u0442\u0440\u0443\u043a\u0442\u0443\u0440\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u044b\u0439 \u0437\u0430\u043f\u0440\u043e\u0441 \u043d\u0430 \u0443\u0441\u043b\u0443\u0433\u0443',
  route_individual_request_body:'\u042d\u0442\u043e\u0442 \u043f\u0443\u0442\u044c \u043f\u0440\u0435\u0434\u043d\u0430\u0437\u043d\u0430\u0447\u0435\u043d \u0434\u043b\u044f \u0438\u0437\u0431\u0440\u0430\u043d\u043d\u044b\u0445 \u0447\u0430\u0441\u0442\u043d\u044b\u0445 \u0437\u0430\u0434\u0430\u0447, \u0433\u0434\u0435 \u043d\u0443\u0436\u043d\u044b \u043f\u043e\u0440\u044f\u0434\u043e\u043a, \u043f\u043e\u043d\u044f\u0442\u043d\u044b\u0439 \u043f\u0430\u043a\u0435\u0442 \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u043e\u0432 \u0438 \u0447\u0435\u0442\u043a\u0438\u0439 \u0441\u043b\u0435\u0434\u0443\u044e\u0449\u0438\u0439 \u0448\u0430\u0433.',
  route_individual_request_window:'\u041f\u043e\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043d\u0438\u0435 \u0432 \u0442\u0435\u0447\u0435\u043d\u0438\u0435 \u043e\u0434\u043d\u043e\u0433\u043e \u0440\u0430\u0431\u043e\u0447\u0435\u0433\u043e \u0434\u043d\u044f \u043f\u043e\u0441\u043b\u0435 \u043f\u043e\u043b\u043d\u043e\u0433\u043e \u0437\u0430\u043f\u0440\u043e\u0441\u0430.',
  route_individual_request_pending:'\u041d\u0430\u043f\u0440\u0430\u0432\u043b\u044f\u0435\u043c \u0432\u0430\u0448 \u0437\u0430\u043f\u0440\u043e\u0441 \u043d\u0430 \u0443\u0441\u043b\u0443\u0433\u0443.',
  route_individual_request_error:'Сейчас не удалось направить запрос. Попробуйте еще раз или свяжитесь с VitaCoreX напрямую.',
  route_executive_brief_unlock_label:'\u0417\u0430\u043f\u0440\u043e\u0441 \u043d\u0430 \u043e\u0442\u043a\u0440\u044b\u0442\u0438\u0435 executive brief',
  route_executive_brief_unlock_form:'Executive Brief Unlock',
  route_executive_brief_unlock_subject:'VitaCoreX \u2014 \u0434\u043e\u0441\u0442\u0443\u043f \u043a executive brief',
  route_executive_brief_unlock_body:'\u041c\u0430\u0442\u0435\u0440\u0438\u0430\u043b \u043e\u0442\u043a\u0440\u044b\u0432\u0430\u0435\u0442\u0441\u044f \u0441\u0440\u0430\u0437\u0443. \u041a\u043e\u043d\u0442\u0435\u043a\u0441\u0442 \u0437\u0430\u043f\u0440\u043e\u0441\u0430 \u0441\u043e\u0445\u0440\u0430\u043d\u044f\u0435\u0442\u0441\u044f, \u0447\u0442\u043e\u0431\u044b VitaCoreX \u043c\u043e\u0433 \u043f\u0440\u043e\u0434\u043e\u043b\u0436\u0438\u0442\u044c \u0434\u0438\u0430\u043b\u043e\u0433 \u0431\u0435\u0437 \u043f\u043e\u0442\u0435\u0440\u0438 \u0432\u0445\u043e\u0434\u043d\u043e\u0433\u043e \u043a\u043e\u043d\u0442\u0435\u043a\u0441\u0442\u0430.',
  route_executive_brief_unlock_window:'\u041c\u0433\u043d\u043e\u0432\u0435\u043d\u043d\u044b\u0439 \u0434\u043e\u0441\u0442\u0443\u043f \u043a \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u0443. \u0415\u0441\u043b\u0438 \u043d\u0443\u0436\u0435\u043d \u0434\u0438\u0430\u043b\u043e\u0433, \u043e\u0442\u0432\u0435\u0442 \u043f\u043e\u0441\u043b\u0435\u0434\u0443\u0435\u0442 \u0432 \u0442\u0435\u0447\u0435\u043d\u0438\u0435 \u043e\u0434\u043d\u043e\u0433\u043e \u0440\u0430\u0431\u043e\u0447\u0435\u0433\u043e \u0434\u043d\u044f.',
  route_executive_brief_unlock_pending:'\u041e\u0442\u043a\u0440\u044b\u0432\u0430\u0435\u043c executive brief.',
  route_executive_brief_unlock_success:'Executive brief \u043e\u0442\u043a\u0440\u044b\u0442. \u0415\u0441\u043b\u0438 \u043d\u0443\u0436\u043d\u0430 \u0434\u0430\u043b\u044c\u043d\u0435\u0439\u0448\u0430\u044f \u0441\u0432\u044f\u0437\u044c, VitaCoreX \u043e\u0442\u0432\u0435\u0442\u0438\u0442 \u0432 \u0442\u0435\u0447\u0435\u043d\u0438\u0435 \u043e\u0434\u043d\u043e\u0433\u043e \u0440\u0430\u0431\u043e\u0447\u0435\u0433\u043e \u0434\u043d\u044f.',
  route_executive_brief_unlock_error:'Сейчас не удалось открыть материал. Попробуйте еще раз или свяжитесь с VitaCoreX напрямую.',
  route_careers_application_label:'\u0417\u0430\u044f\u0432\u043a\u0430 \u043d\u0430 \u0441\u043e\u0442\u0440\u0443\u0434\u043d\u0438\u0447\u0435\u0441\u0442\u0432\u043e',
  route_careers_application_form:'\u0417\u0430\u044f\u0432\u043a\u0430 \u043d\u0430 \u0441\u043e\u0442\u0440\u0443\u0434\u043d\u0438\u0447\u0435\u0441\u0442\u0432\u043e',
  route_careers_application_subject:'VitaCoreX \u2014 \u0437\u0430\u044f\u0432\u043a\u0430 \u043d\u0430 \u0441\u043e\u0442\u0440\u0443\u0434\u043d\u0438\u0447\u0435\u0441\u0442\u0432\u043e',
  route_careers_application_body:'\u0417\u0430\u044f\u0432\u043a\u0438 \u043f\u0440\u043e\u0441\u043c\u0430\u0442\u0440\u0438\u0432\u0430\u044e\u0442\u0441\u044f \u043f\u0430\u043a\u0435\u0442\u0430\u043c\u0438 \u0441 \u0444\u043e\u043a\u0443\u0441\u043e\u043c \u043d\u0430 \u043a\u0430\u0447\u0435\u0441\u0442\u0432\u043e \u043f\u0438\u0441\u044c\u043c\u0430, \u043d\u0430\u0434\u0435\u0436\u043d\u043e\u0441\u0442\u044c \u0438 \u0441\u043e\u043e\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0438\u0435 documentation-first \u043c\u043e\u0434\u0435\u043b\u0438.',
  route_careers_application_window:'\u041f\u0435\u0440\u0432\u0438\u0447\u043d\u044b\u0439 \u0440\u0430\u0437\u0431\u043e\u0440 \u0432 \u0442\u0435\u0447\u0435\u043d\u0438\u0435 \u0442\u0440\u0435\u0445 \u0440\u0430\u0431\u043e\u0447\u0438\u0445 \u0434\u043d\u0435\u0439.',
  route_careers_application_pending:'\u041d\u0430\u043f\u0440\u0430\u0432\u043b\u044f\u0435\u043c \u0432\u0430\u0448\u0443 \u0437\u0430\u044f\u0432\u043a\u0443.',
  route_careers_application_success:'\u0417\u0430\u044f\u0432\u043a\u0430 \u043f\u043e\u043b\u0443\u0447\u0435\u043d\u0430. \u0415\u0441\u043b\u0438 \u0435\u0441\u0442\u044c \u0441\u043e\u0432\u043f\u0430\u0434\u0435\u043d\u0438\u0435, VitaCoreX \u043e\u0442\u0432\u0435\u0442\u0438\u0442 \u0441 \u0434\u0430\u043b\u044c\u043d\u0435\u0439\u0448\u0438\u043c\u0438 \u0448\u0430\u0433\u0430\u043c\u0438 \u0432 \u0442\u0435\u0447\u0435\u043d\u0438\u0435 \u0442\u0440\u0435\u0445 \u0440\u0430\u0431\u043e\u0447\u0438\u0445 \u0434\u043d\u0435\u0439.',
  route_careers_application_error:'Сейчас не удалось направить заявку. Попробуйте еще раз или свяжитесь с VitaCoreX напрямую.',
  thank_track_label:'\u0422\u0440\u0435\u043a \u0440\u0430\u0437\u0431\u043e\u0440\u0430',
  thank_track_company:'\u041a\u043e\u0440\u043f\u043e\u0440\u0430\u0442\u0438\u0432\u043d\u044b\u0439 \u043a\u043e\u043d\u0444\u0438\u0434\u0435\u043d\u0446\u0438\u0430\u043b\u044c\u043d\u044b\u0439 \u0440\u0430\u0437\u0431\u043e\u0440',
  thank_track_individual:'\u0418\u0437\u0431\u0440\u0430\u043d\u043d\u044b\u0435 \u0443\u0441\u043b\u0443\u0433\u0438 \u0434\u043b\u044f \u0447\u0430\u0441\u0442\u043d\u044b\u0445 \u043a\u043b\u0438\u0435\u043d\u0442\u043e\u0432',
  thank_track_careers:'\u0417\u0430\u044f\u0432\u043a\u0430 \u043d\u0430 \u0441\u043e\u0442\u0440\u0443\u0434\u043d\u0438\u0447\u0435\u0441\u0442\u0432\u043e',
  thank_track_brief:'\u0417\u0430\u043f\u0440\u043e\u0441 \u043d\u0430 executive material',
  thank_company_title:'\u0421\u043f\u0430\u0441\u0438\u0431\u043e. \u0412\u0430\u0448 \u043a\u043e\u043d\u0444\u0438\u0434\u0435\u043d\u0446\u0438\u0430\u043b\u044c\u043d\u044b\u0439 \u0440\u0430\u0437\u0431\u043e\u0440 \u0432 \u043e\u0447\u0435\u0440\u0435\u0434\u0438.',
  thank_company_lead:'VitaCoreX \u043f\u043e\u043b\u0443\u0447\u0438\u043b \u0432\u0430\u0448 \u043a\u043e\u0440\u043f\u043e\u0440\u0430\u0442\u0438\u0432\u043d\u044b\u0439 \u0437\u0430\u043f\u0440\u043e\u0441 \u0438 \u043d\u0430\u043f\u0440\u0430\u0432\u0438\u043b \u0435\u0433\u043e \u0432 \u0442\u0440\u0435\u043a \u043a\u043e\u043d\u0444\u0438\u0434\u0435\u043d\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0433\u043e \u0440\u0430\u0437\u0431\u043e\u0440\u0430. \u041f\u043e\u0441\u043b\u0435 \u043f\u0435\u0440\u0432\u0438\u0447\u043d\u043e\u0433\u043e \u0441\u043a\u0440\u0438\u043d\u0438\u043d\u0433\u0430 \u043f\u043e\u0441\u043b\u0435\u0434\u0443\u0435\u0442 \u043f\u043e\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043d\u0438\u0435.',
  thank_individual_title:'\u0421\u043f\u0430\u0441\u0438\u0431\u043e. \u0412\u0430\u0448 \u0437\u0430\u043f\u0440\u043e\u0441 \u043d\u0430 \u0443\u0441\u043b\u0443\u0433\u0443 \u0432 \u043e\u0447\u0435\u0440\u0435\u0434\u0438.',
  thank_individual_lead:'VitaCoreX получил ваш запрос по выбранной частной услуге и направил его в соответствующий трек разбора. После первичного скрининга последует подтверждение.',
  thank_careers_title:'\u0421\u043f\u0430\u0441\u0438\u0431\u043e. \u0412\u0430\u0448\u0430 \u0437\u0430\u044f\u0432\u043a\u0430 \u0432 \u043e\u0447\u0435\u0440\u0435\u0434\u0438.',
  thank_careers_lead:'\u0412\u0430\u0448\u0430 \u0437\u0430\u044f\u0432\u043a\u0430 \u043d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0430 \u043d\u0430 \u0440\u0430\u0437\u0431\u043e\u0440. \u0415\u0441\u043b\u0438 \u0435\u0441\u0442\u044c \u0441\u043e\u0432\u043f\u0430\u0434\u0435\u043d\u0438\u0435, VitaCoreX \u043f\u0440\u0438\u0448\u043b\u0435\u0442 \u0441\u043b\u0435\u0434\u0443\u044e\u0449\u0438\u0435 \u0448\u0430\u0433\u0438.',
  thank_brief_title:'\u0421\u043f\u0430\u0441\u0438\u0431\u043e. \u0417\u0430\u043f\u0440\u043e\u0441 \u043d\u0430 executive material \u0437\u0430\u0444\u0438\u043a\u0441\u0438\u0440\u043e\u0432\u0430\u043d.',
  thank_brief_lead:'\u0417\u0430\u043f\u0440\u043e\u0441 \u043f\u0440\u0438\u043d\u044f\u0442, \u0438 \u0442\u0440\u0435\u043a executive material \u0443\u0436\u0435 \u043e\u0442\u043a\u0440\u044b\u0442. \u0415\u0441\u043b\u0438 \u043f\u043e\u043d\u0430\u0434\u043e\u0431\u0438\u0442\u0441\u044f \u0434\u0430\u043b\u044c\u043d\u0435\u0439\u0448\u0430\u044f \u0441\u0432\u044f\u0437\u044c, VitaCoreX \u043e\u0442\u0432\u0435\u0442\u0438\u0442 \u0432 \u0442\u0435\u0447\u0435\u043d\u0438\u0435 \u043e\u0434\u043d\u043e\u0433\u043e \u0440\u0430\u0431\u043e\u0447\u0435\u0433\u043e \u0434\u043d\u044f.',
  thank_window_company:'\u041f\u043e\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043d\u0438\u0435 \u0432 \u0442\u0435\u0447\u0435\u043d\u0438\u0435 24 \u0440\u0430\u0431\u043e\u0447\u0438\u0445 \u0447\u0430\u0441\u043e\u0432',
  thank_window_individual:'\u041f\u043e\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043d\u0438\u0435 \u0432 \u0442\u0435\u0447\u0435\u043d\u0438\u0435 \u043e\u0434\u043d\u043e\u0433\u043e \u0440\u0430\u0431\u043e\u0447\u0435\u0433\u043e \u0434\u043d\u044f',
  thank_window_careers:'\u041f\u0435\u0440\u0432\u0438\u0447\u043d\u044b\u0439 \u0440\u0430\u0437\u0431\u043e\u0440 \u0432 \u0442\u0435\u0447\u0435\u043d\u0438\u0435 \u0442\u0440\u0435\u0445 \u0440\u0430\u0431\u043e\u0447\u0438\u0445 \u0434\u043d\u0435\u0439',
  thank_window_brief:'\u0414\u043e\u0441\u0442\u0443\u043f \u043a \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u0443 \u0441\u0440\u0430\u0437\u0443; \u043f\u0440\u0438 \u043d\u0435\u043e\u0431\u0445\u043e\u0434\u0438\u043c\u043e\u0441\u0442\u0438 \u043e\u0442\u0432\u0435\u0442 \u0432 \u0442\u0435\u0447\u0435\u043d\u0438\u0435 \u043e\u0434\u043d\u043e\u0433\u043e \u0440\u0430\u0431\u043e\u0447\u0435\u0433\u043e \u0434\u043d\u044f',
  thank_individual_cta:'\u041f\u043e\u0441\u043c\u043e\u0442\u0440\u0435\u0442\u044c \u0438\u0437\u0431\u0440\u0430\u043d\u043d\u044b\u0435 \u0443\u0441\u043b\u0443\u0433\u0438',
  thank_careers_cta:'\u0414\u043b\u044f \u043a\u043e\u043c\u043f\u0430\u043d\u0438\u0439',
  thank_brief_cta:'\u0417\u0430\u043f\u0440\u043e\u0441\u0438\u0442\u044c \u043a\u043e\u043d\u0444\u0438\u0434\u0435\u043d\u0446\u0438\u0430\u043b\u044c\u043d\u044b\u0439 \u0440\u0430\u0437\u0431\u043e\u0440',
  thank_careers_meta_title:'\u0417\u0430\u044f\u0432\u043a\u0430 \u043f\u043e\u043b\u0443\u0447\u0435\u043d\u0430 | VitaCoreX LLC',
  thank_careers_meta_desc:'\u0412\u0430\u0448\u0430 \u0437\u0430\u044f\u0432\u043a\u0430 VitaCoreX \u043f\u043e\u043b\u0443\u0447\u0435\u043d\u0430 \u0438 \u043d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0430 \u043d\u0430 \u0440\u0430\u0437\u0431\u043e\u0440.',
  thank_brief_meta_title:'\u0417\u0430\u043f\u0440\u043e\u0441 \u043d\u0430 executive material \u043f\u043e\u043b\u0443\u0447\u0435\u043d | VitaCoreX LLC',
  thank_brief_meta_desc:'\u0412\u0430\u0448 \u0437\u0430\u043f\u0440\u043e\u0441 \u043d\u0430 executive material \u043f\u043e\u043b\u0443\u0447\u0435\u043d \u0438 \u043d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d.'
 },
 es:{
  route_context_label:'Nota de enrutamiento',
  route_followup_label:'Ventana de respuesta',
  route_company_review_label:'Revision confidencial corporativa',
  route_company_review_form:'Revision Confidencial',
  route_company_review_subject:'VitaCoreX Revision Confidencial',
  route_company_review_body:'Disenado para owners, operadores, lideres financieros y equipos que trabajan junto a asesoria externa. El contexto de pagina, idioma, servicio y origen viaja con el envio.',
  route_company_review_window:'Confirmacion dentro de 24 horas habiles despues de un envio completo.',
  route_company_review_pending:'Enrutando su revision confidencial.',
  route_company_review_error:'No pudimos enrutar la revision confidencial ahora. Intente otra vez o contacte directamente a VitaCoreX.',
  route_individual_request_label:'Solicitud estructurada de servicio',
  route_individual_request_form:'Solicitud Estructurada de Servicio',
  route_individual_request_subject:'VitaCoreX Solicitud Estructurada de Servicio',
  route_individual_request_body:'Use esta ruta para asuntos individuales seleccionados que requieren orden, documentacion clara y un siguiente paso definido.',
  route_individual_request_window:'Confirmacion dentro de un dia habil despues de una solicitud completa.',
  route_individual_request_pending:'Enrutando su solicitud de servicio.',
  route_individual_request_error:'No pudimos enrutar la solicitud ahora. Intente otra vez o contacte directamente a VitaCoreX.',
  route_executive_brief_unlock_label:'Acceso al brief ejecutivo',
  route_executive_brief_unlock_form:'Executive Brief Unlock',
  route_executive_brief_unlock_subject:'VitaCoreX Acceso al Brief Ejecutivo',
  route_executive_brief_unlock_body:'El material se abre de inmediato. El contexto del pedido queda registrado para que VitaCoreX pueda dar seguimiento sin reiniciar la conversacion.',
  route_executive_brief_unlock_window:'Acceso inmediato al material. Seguimiento dentro de un dia habil cuando corresponda.',
  route_executive_brief_unlock_pending:'Abriendo el brief ejecutivo.',
  route_executive_brief_unlock_success:'Brief ejecutivo desbloqueado. Si corresponde seguimiento, VitaCoreX respondera dentro de un dia habil.',
  route_executive_brief_unlock_error:'No pudimos abrir el brief ahora. Intente otra vez o contacte directamente a VitaCoreX.',
  route_careers_application_label:'Solicitud de carrera',
  route_careers_application_form:'Solicitud de Carrera',
  route_careers_application_subject:'VitaCoreX Solicitud de Carrera',
  route_careers_application_body:'Las postulaciones se revisan por tandas con foco en disciplina de escritura, confiabilidad y ajuste a un modelo documentation-first.',
  route_careers_application_window:'Revision inicial dentro de tres dias habiles.',
  route_careers_application_pending:'Enrutando su postulacion.',
  route_careers_application_success:'Postulacion recibida. Si existe alineacion, VitaCoreX respondera con los siguientes pasos dentro de tres dias habiles.',
  route_careers_application_error:'No pudimos enrutar la postulacion ahora. Intente otra vez o contacte directamente a VitaCoreX.',
  thank_track_label:'Carril de revision',
  thank_track_company:'Revision confidencial corporativa',
  thank_track_individual:'Servicios individuales seleccionados',
  thank_track_careers:'Postulacion',
  thank_track_brief:'Solicitud de material ejecutivo',
  thank_company_title:'Gracias. Su revision confidencial esta en cola.',
  thank_company_lead:'VitaCoreX recibio su solicitud corporativa y la enruto al carril de revision confidencial. La confirmacion llegara despues del filtro inicial.',
  thank_individual_title:'Gracias. Su solicitud de servicio esta en cola.',
  thank_individual_lead:'VitaCoreX recibio su solicitud individual seleccionada y la enruto al carril de evaluacion correspondiente. La confirmacion llegara despues del filtro inicial.',
  thank_careers_title:'Gracias. Su postulacion esta en cola.',
  thank_careers_lead:'Su postulacion fue enviada a revision. Si existe alineacion, VitaCoreX respondera con los siguientes pasos.',
  thank_brief_title:'Gracias. Su solicitud de material ejecutivo quedo registrada.',
  thank_brief_lead:'La solicitud fue registrada y el carril de material ejecutivo ya esta abierto. Si corresponde seguimiento, VitaCoreX respondera dentro de un dia habil.',
  thank_window_company:'Confirmacion dentro de 24 horas habiles',
  thank_window_individual:'Confirmacion dentro de un dia habil',
  thank_window_careers:'Revision inicial dentro de tres dias habiles',
  thank_window_brief:'Acceso inmediato al material; seguimiento dentro de un dia habil cuando corresponda',
  thank_individual_cta:'Revisar servicios seleccionados',
  thank_careers_cta:'Para empresas',
  thank_brief_cta:'Solicitar revision confidencial',
  thank_careers_meta_title:'Postulacion Recibida | VitaCoreX LLC',
  thank_careers_meta_desc:'Su postulacion a VitaCoreX fue recibida y enviada a revision.',
  thank_brief_meta_title:'Solicitud de Material Ejecutivo Recibida | VitaCoreX LLC',
  thank_brief_meta_desc:'Su solicitud de material ejecutivo fue recibida y enviada a revision.'
 }
};
Object.keys(FORM_ROUTE_COPY).forEach(locale=>{
 extra[locale]=Object.assign(extra[locale]||{}, FORM_ROUTE_COPY[locale]);
});
const INDIVIDUAL_SERVICE_MAP={
  contracts:'Contracts & Documentation',
  immigration:'Immigration Documents',
  auto:'Auto Purchase Review',
  plans:'Business Plans',
  formation:'Company Formation',
  translation:'Translation & Localization'
};
const COMPANY_SERVICE_MAP={
  recovery:'Revenue Recovery Workflow Design',
  file:'Corporate Legal File Control',
  intake:'Structured Case Intake & Packet Build',
  brief:'Executive Briefs / Proof Request'
};
function syncCareerMailto(){
  const link=document.querySelector('[data-careers-mailto]');
  if(!link) return;
  link.setAttribute('href','mailto:VitaCoreXllc@gmail.com?subject='+encodeURIComponent('VitaCoreX Careers Application'));
}
function currentPageKey(){
  const explicit=document.body?.dataset?.vcxPage;
  if(explicit) return explicit;
  const path=(window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const map={
    'index.html':'home',
    '':'home',
    'corporate-legal-file-control.html':'corporate-legal',
    'revenue-recovery-workflow.html':'revenue-recovery',
    'resources.html':'resources',
    'additional-services.html':'individual-services',
    'contact.html':'contact',
    'structured-case-intake.html':'structured-intake',
    'careers.html':'careers',
    'thank-you.html':'thank-you'
  };
  return map[path] || explicit || 'home';
}
function currentAudience(){
  const params=new URLSearchParams(window.location.search);
  const explicit=params.get('audience');
  if(explicit==='company' || explicit==='individual') return explicit;
  const pageKey=currentPageKey();
  const form=$('#intakeForm');
  const datasetMode=form?.dataset?.clientMode;
  if(datasetMode==='company' || datasetMode==='individual') return datasetMode;
  if(pageKey==='contact') return 'company';
  if(pageKey==='structured-intake' || pageKey==='individual-services') return 'individual';
  const inputMode=form?.querySelector('[name="client_type"]')?.value;
  if(inputMode==='company' || inputMode==='individual') return inputMode;
  return 'company';
}
const VCX_LOCALE_MAP={en:'en_US',ru:'ru_RU',es:'es_ES'};
const VCX_TICKER_LOCALE_MAP={en:'en',ru:'ru',es:'es'};
const VCX_MARKET_TICKER_SRC='https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
const VCX_MARKET_SYMBOLS=[
  {proName:'AMEX:SPY', title:'SPY'},
  {proName:'NASDAQ:QQQ', title:'QQQ'},
  {proName:'NASDAQ:AAPL', title:'AAPL'},
  {proName:'NASDAQ:MSFT', title:'MSFT'},
  {proName:'TVC:GOLD', title:'Gold'},
  {proName:'TVC:USOIL', title:'Oil'}
];
function baseCanonicalHref(){
  const canonical=document.querySelector('link[rel="canonical"]');
  const href=canonical?.getAttribute('href');
  if(href) return href;
  const url=new URL(window.location.href);
  url.search='';
  url.hash='';
  return url.toString();
}
function visibleHrefForLanguage(targetLang=lang){
  const url=new URL(window.location.href);
  if(targetLang && targetLang!=='en'){
    url.searchParams.set('lang', targetLang);
  } else {
    url.searchParams.delete('lang');
  }
  return url.toString();
}
function setMetaContent(selector, value){
  if(!value) return;
  const node=document.querySelector(selector);
  if(node) node.setAttribute('content', value);
}
function syncLanguageQueryParam(){
  const nextHref=visibleHrefForLanguage(lang);
  if(nextHref!==window.location.href){
    window.history.replaceState({},'',nextHref);
  }
}
function syncSeoState(nextTitle, nextDesc){
  const descMeta=document.querySelector('meta[name="description"]');
  const title=nextTitle || document.title || '';
  const desc=nextDesc || descMeta?.getAttribute('content') || '';
  if(title) document.title=title;
  if(descMeta && desc) descMeta.setAttribute('content', desc);
  setMetaContent('meta[property="og:title"]', title);
  setMetaContent('meta[property="og:description"]', desc);
  setMetaContent('meta[name="twitter:title"]', title);
  setMetaContent('meta[name="twitter:description"]', desc);
  setMetaContent('meta[property="og:url"]', visibleHrefForLanguage(lang));
  setMetaContent('meta[property="og:locale"]', VCX_LOCALE_MAP[lang] || VCX_LOCALE_MAP.en);
  const canonical=document.querySelector('link[rel="canonical"]');
  if(canonical) canonical.setAttribute('href', baseCanonicalHref());
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(link=>{
    const code=(link.getAttribute('hreflang') || '').toLowerCase();
    if(code==='x-default'){
      link.setAttribute('href', visibleHrefForLanguage('en'));
      return;
    }
    if(['en','ru','es'].includes(code)){
      link.setAttribute('href', visibleHrefForLanguage(code));
    }
  });
}
function normalizedMarketTickerConfig(rawConfig){
  const config=rawConfig && typeof rawConfig==='object' ? {...rawConfig} : {};
  config.symbols=Array.isArray(config.symbols) && config.symbols.length ? config.symbols : VCX_MARKET_SYMBOLS.map(item=>({...item}));
  config.showSymbolLogo=!!config.showSymbolLogo;
  config.isTransparent=config.isTransparent!==false;
  config.displayMode=config.displayMode || 'adaptive';
  config.colorTheme=config.colorTheme || 'light';
  config.locale=VCX_TICKER_LOCALE_MAP[lang] || VCX_TICKER_LOCALE_MAP.en;
  return config;
}
function loadVcxMarketTicker(force=false){
  document.querySelectorAll('[data-vcx-market-ticker="1"]').forEach(container=>{
    const widgetHost=container.querySelector('.tradingview-widget-container__widget');
    if(!widgetHost) return;
    const configNode=container.querySelector('.vcx-market-config');
    let parsedConfig={};
    if(configNode && configNode.textContent.trim()){
      try{
        parsedConfig=JSON.parse(configNode.textContent);
      }catch(_error){
        parsedConfig={};
      }
    }
    const config=normalizedMarketTickerConfig(parsedConfig);
    const nextLocale=config.locale || 'en';
    const hasLiveWidget=!!widgetHost.querySelector('iframe');
    if(!force && container.dataset.vcxTickerLocale===nextLocale && hasLiveWidget) return;
    widgetHost.innerHTML='';
    container.querySelectorAll('script[data-vcx-market-script="1"]').forEach(node=>node.remove());
    const embed=document.createElement('script');
    embed.src=VCX_MARKET_TICKER_SRC;
    embed.async=true;
    embed.type='text/javascript';
    embed.dataset.vcxMarketScript='1';
    embed.text=JSON.stringify(config);
    container.appendChild(embed);
    container.dataset.vcxTickerLocale=nextLocale;
  });
}
function setPageMeta(title, desc){
  syncSeoState(title, desc);
}
function shellActive(kind){
  const pageKey=currentPageKey();
  const audience=currentAudience();
  if(kind==='home') return pageKey==='home';
  if(kind==='companies') return ['corporate-legal','revenue-recovery','resources','contact'].includes(pageKey) && audience!=='individual';
  if(kind==='recovery') return pageKey==='revenue-recovery';
  if(kind==='brief') return pageKey==='resources';
  if(kind==='individuals') return pageKey==='individual-services' || pageKey==='structured-intake' || audience==='individual';
  if(kind==='confidential') return pageKey==='contact' && audience!=='individual';
  return false;
}
function navLink(href, label, classes, active){
  const className=[classes, active?'active':''].filter(Boolean).join(' ');
  return `<a class="${className}" href="${href}">${label}</a>`;
}
function buildShellNav(){
  return [
    navLink('index.html', tr('home') || 'Home', '', shellActive('home')),
    navLink('corporate-legal-file-control.html', tr('nav_companies'), 'vcx-nav-company', shellActive('companies')),
    navLink('revenue-recovery-workflow.html', tr('nav_recovery'), 'is-long', shellActive('recovery')),
    navLink('resources.html', tr('nav_brief'), 'vcx-nav-brief', shellActive('brief')),
    navLink('additional-services.html', tr('nav_individuals'), 'vcx-nav-individual', shellActive('individuals')),
    navLink(COMPANY_REVIEW_URL, tr('nav_confidential'), 'vcx-nav-action', shellActive('confidential'))
  ].join('');
}
function buildFooterMarkup(){
  return `<div class="wrap footer-grid footer-grid-refined">
    <div class="footer-group footer-company">
      <div class="footer-brand-block">
        <h3>VitaCoreX LLC</h3>
        <div class="footer-meta">
          <p class="small-note">${tr('footer_operator_note')}</p>
          <p class="small-note">${tr('footer_scope_note')}</p>
        </div>
      </div>
      <div class="footer-legal-card">
        <strong>${step08('footer_legal_title')}</strong>
        <p class="small-note">${tr('footer_disc')}</p>
      </div>
      <p class="small-note footer-copy-note">${tr('footer_copy')}</p>
    </div>
    <div class="footer-group footer-track footer-track-primary">
      <div>
        <h3>${tr('footer_companies_title')}</h3>
        <p class="small-note footer-group-note">${step08('footer_companies_note')}</p>
      </div>
      <nav class="footer-links" aria-label="For Companies">
        <a href="corporate-legal-file-control.html">${tr('nav_companies')}</a>
        <a href="revenue-recovery-workflow.html">${tr('nav_recovery')}</a>
        <a href="resources.html">${tr('cta_review_brief')}</a>
        <a href="${COMPANY_REVIEW_URL}">${tr('cta_confidential_review')}</a>
        <a href="${STRATEGY_CALL_URL}" rel="noopener" target="_blank">${tr('cta_strategy_call')}</a>
      </nav>
    </div>
    <div class="footer-group footer-track footer-track-secondary">
      <div>
        <h3>${tr('footer_individuals_title')}</h3>
        <p class="small-note footer-group-note">${step08('footer_individuals_note')}</p>
      </div>
      <nav class="footer-links" aria-label="For Individuals">
        <a href="additional-services.html">${tr('nav_individuals')}</a>
        <a href="${INDIVIDUAL_INTAKE_URL}">${tr('cta_start_intake')}</a>
        <a href="structured-case-intake.html?audience=individual&service=contracts">${tr('cta_request_service')}</a>
      </nav>
      <div class="vcx-footer-follow">
        <strong>${tr('footer_secondary_title')}</strong>
        <p class="small-note footer-group-note footer-group-note-secondary">${step08('footer_secondary_note')}</p>
        <nav class="footer-links" aria-label="Secondary">
          <a href="careers.html">${tr('footer_careers_link')}</a>
          <a href="mailto:VitaCoreXllc@gmail.com">${tr('footer_email')}</a>
        </nav>
      </div>
    </div>
  </div>`;
}
function structureGridMarkup(){
  return `<div class="vcx-structure-grid">
    <article class="vcx-structure-card">
      <span class="pill">${step08('engagement_step_1_title')}</span>
      <p>${step08('engagement_step_1_body')}</p>
    </article>
    <article class="vcx-structure-card">
      <span class="pill">${step08('engagement_step_2_title')}</span>
      <p>${step08('engagement_step_2_body')}</p>
    </article>
    <article class="vcx-structure-card">
      <span class="pill">${step08('engagement_step_3_title')}</span>
      <p>${step08('engagement_step_3_body')}</p>
    </article>
  </div>`;
}
function miniStepsMarkup(){
  return `<div class="vcx-mini-steps">
    <div class="vcx-mini-step">
      <strong>${step08('engagement_step_1_title')}</strong>
      <p>${step08('engagement_step_1_body')}</p>
    </div>
    <div class="vcx-mini-step">
      <strong>${step08('engagement_step_2_title')}</strong>
      <p>${step08('engagement_step_2_body')}</p>
    </div>
    <div class="vcx-mini-step">
      <strong>${step08('engagement_step_3_title')}</strong>
      <p>${step08('engagement_step_3_body')}</p>
    </div>
  </div>`;
}
function buildStructureSectionMarkup(extraNote){
  return `<div class="wrap">
    <div class="section-head">
      <span class="eyebrow">${step08('engagement_eyebrow')}</span>
      <h2>${step08('engagement_title')}</h2>
      <p class="section-intro">${step08('engagement_intro')}</p>
    </div>
    ${structureGridMarkup()}
    ${extraNote ? `<p class="small-note vcx-proof-note">${extraNote}</p>` : ''}
  </div>`;
}
function upsertSectionBeforeAnchor(id, className, anchor, html){
  const target=typeof anchor==='string' ? document.querySelector(anchor) : anchor;
  if(!target || !target.parentNode) return null;
  let section=document.getElementById(id);
  if(!section){
    section=document.createElement('section');
    section.id=id;
    target.parentNode.insertBefore(section, target);
  }
  section.className=className;
  section.innerHTML=html;
  return section;
}
function sectionAnchor(){
  return document.getElementById('vcxNextBand') || document.querySelector('footer.footer, footer') || document.querySelector('.vcx-dock');
}
function applyHomeTrustAndProofUpgrade(){
  const trustMap=[
    ['trust_tampa_title','trust_tampa_body'],
    ['trust_docs_title','trust_docs_body'],
    ['trust_response_title','trust_response_body'],
    ['trust_legal_title','trust_legal_body']
  ];
  document.querySelectorAll('.vcx-trust-item').forEach((card, index)=>{
    const titleKey=trustMap[index]?.[0];
    const bodyKey=trustMap[index]?.[1];
    if(!titleKey || !bodyKey) return;
    const pill=card.querySelector('.pill');
    const body=card.querySelector('p');
    if(pill) pill.textContent=step08(titleKey);
    if(body) body.textContent=step08(bodyKey);
  });

  const band=document.querySelector('.proof-band');
  if(band){
    band.classList.add('vcx-evidence-band');
    band.innerHTML=`<div class="vcx-evidence-copy">
      <span class="eyebrow">${step08('home_evidence_eyebrow')}</span>
      <h2>${step08('home_evidence_title')}</h2>
      <p class="section-intro">${step08('home_evidence_intro')}</p>
    </div>
    <div class="vcx-evidence-grid">
      <article class="vcx-evidence-card">
        <h3>${step08('evidence_brief_title')}</h3>
        <p>${step08('evidence_brief_body')}</p>
      </article>
      <article class="vcx-evidence-card">
        <h3>${step08('evidence_packet_title')}</h3>
        <p>${step08('evidence_packet_body')}</p>
      </article>
      <article class="vcx-evidence-card">
        <h3>${step08('evidence_structure_title')}</h3>
        <p>${step08('evidence_structure_body')}</p>
      </article>
    </div>`;
  }

  const finalSection=document.querySelector('section.vcx-home-final');
  if(finalSection){
    upsertSectionBeforeAnchor(
      'vcxHomeStructureSection',
      'section band vcx-structure-section',
      finalSection,
      buildStructureSectionMarkup('')
    );
  }
}
function applyResourcesTrustAndProofUpgrade(){
  const heroCard=document.querySelector('.hero-side .problem-item');
  if(heroCard){
    const title=heroCard.querySelector('h3');
    const body=heroCard.querySelector('p');
    if(title) title.textContent=step08('resources_hero_note_title');
    if(body) body.textContent=step08('resources_hero_note_body');
  }

  const cardCopy=[
    ['resources_card_1_body','resources_card_1_tag'],
    ['resources_card_2_body','resources_card_2_tag'],
    ['resources_card_3_body','resources_card_3_tag'],
    ['resources_card_4_body','resources_card_4_tag']
  ];
  document.querySelectorAll('.resource-grid .resource-card').forEach((card, index)=>{
    const bodyKey=cardCopy[index]?.[0];
    const tagKey=cardCopy[index]?.[1];
    const body=card.querySelector('p');
    const pills=card.querySelectorAll('.pill');
    if(body && bodyKey) body.textContent=step08(bodyKey);
    if(pills[1] && tagKey) pills[1].textContent=step08(tagKey);
  });

  const anchor=sectionAnchor();
  if(anchor){
    upsertSectionBeforeAnchor(
      'vcxResourcesSystemSection',
      'section band vcx-proof-system-section',
      anchor,
      `<div class="wrap">
        <div class="section-head">
          <span class="eyebrow">${step08('resources_system_eyebrow')}</span>
          <h2>${step08('resources_system_title')}</h2>
          <p class="section-intro">${step08('resources_system_intro')}</p>
        </div>
        <div class="vcx-evidence-grid vcx-evidence-grid-wide">
          <article class="vcx-evidence-card">
            <h3>${step08('resources_use_1_title')}</h3>
            <p>${step08('resources_use_1_body')}</p>
          </article>
          <article class="vcx-evidence-card">
            <h3>${step08('resources_use_2_title')}</h3>
            <p>${step08('resources_use_2_body')}</p>
          </article>
          <article class="vcx-evidence-card">
            <h3>${step08('resources_use_3_title')}</h3>
            <p>${step08('resources_use_3_body')}</p>
          </article>
          <article class="vcx-evidence-card">
            <h3>${step08('resources_use_4_title')}</h3>
            <p>${step08('resources_use_4_body')}</p>
          </article>
        </div>
        <p class="small-note vcx-proof-note">${step08('resources_conf_note')}</p>
      </div>`
    );
    upsertSectionBeforeAnchor(
      'vcxResourcesStructureSection',
      'section vcx-structure-section',
      anchor,
      buildStructureSectionMarkup('')
    );
  }
}
function applyCorporateTrustAndProofUpgrade(){
  const visualsAnchor=document.querySelector('.legal-ops-visuals') || sectionAnchor();
  if(visualsAnchor){
    upsertSectionBeforeAnchor(
      'vcxCorporateTrustSection',
      'section vcx-proof-system-section',
      visualsAnchor,
      `<div class="wrap">
        <div class="section-head">
          <span class="eyebrow">${step08('corporate_strip_eyebrow')}</span>
          <h2>${step08('corporate_strip_title')}</h2>
          <p class="section-intro">${step08('corporate_strip_intro')}</p>
        </div>
        <div class="vcx-evidence-grid">
          <article class="vcx-evidence-card">
            <h3>${step08('corporate_card_1_title')}</h3>
            <p>${step08('corporate_card_1_body')}</p>
          </article>
          <article class="vcx-evidence-card">
            <h3>${step08('corporate_card_2_title')}</h3>
            <p>${step08('corporate_card_2_body')}</p>
          </article>
          <article class="vcx-evidence-card">
            <h3>${step08('corporate_card_3_title')}</h3>
            <p>${step08('corporate_card_3_body')}</p>
          </article>
        </div>
      </div>`
    );
  }

  const chartCards=document.querySelectorAll('.legal-chart-grid .legal-chart-card');
  if(chartCards[0]){
    chartCards[0].innerHTML=`<div class="widget-head">
      <span class="pill">${step08('corporate_packet_pill')}</span>
      <h3>${step08('corporate_packet_title')}</h3>
    </div>
    <p class="small-note legal-widget-intro">${step08('corporate_packet_intro')}</p>
    <ul class="authority-list vcx-detail-list">
      <li>${step08('corporate_packet_item_1')}</li>
      <li>${step08('corporate_packet_item_2')}</li>
      <li>${step08('corporate_packet_item_3')}</li>
      <li>${step08('corporate_packet_item_4')}</li>
    </ul>`;
  }
  if(chartCards[1]){
    chartCards[1].innerHTML=`<div class="widget-head">
      <span class="pill">${step08('corporate_plan_pill')}</span>
      <h3>${step08('corporate_plan_title')}</h3>
    </div>
    <p class="small-note legal-widget-intro">${step08('corporate_plan_intro')}</p>
    ${miniStepsMarkup()}`;
  }

  const estimatorHead=document.querySelector('.legal-estimator-section .section-head');
  if(estimatorHead){
    const eyebrow=estimatorHead.querySelector('.eyebrow');
    const title=estimatorHead.querySelector('h2');
    const body=estimatorHead.querySelector('.section-intro');
    if(eyebrow) eyebrow.textContent=step08('corporate_estimator_eyebrow');
    if(title) title.textContent=step08('corporate_estimator_title');
    if(body) body.textContent=step08('corporate_estimator_body');
  }
  const resultBox=document.getElementById('legalResult');
  if(resultBox){
    resultBox.innerHTML=`<strong>${step08('corporate_result_title')}</strong><p>${step08('corporate_result_body')}</p>`;
  }
}
function applyRevenueTrustAndProofUpgrade(){
  const heroCards=document.querySelectorAll('.hero-side .problem-item');
  if(heroCards[1]){
    const title=heroCards[1].querySelector('h3');
    const body=heroCards[1].querySelector('p');
    if(title) title.textContent=step08('revenue_safe_title');
    if(body) body.textContent=step08('revenue_safe_body');
  }

  const markersCard=document.querySelector('.vcx-flow-wide-left .chart.card');
  if(markersCard){
    markersCard.innerHTML=`<h2>${step08('revenue_markers_title')}</h2>
      <p class="small-note">${step08('revenue_markers_intro')}</p>
      <div class="vcx-mini-steps vcx-mini-steps-tight">
        <div class="vcx-mini-step">
          <strong>${step08('revenue_marker_1_title')}</strong>
          <p>${step08('revenue_marker_1_body')}</p>
        </div>
        <div class="vcx-mini-step">
          <strong>${step08('revenue_marker_2_title')}</strong>
          <p>${step08('revenue_marker_2_body')}</p>
        </div>
        <div class="vcx-mini-step">
          <strong>${step08('revenue_marker_3_title')}</strong>
          <p>${step08('revenue_marker_3_body')}</p>
        </div>
      </div>`;
  }

  const calcHeading=document.querySelector('#calc h2[data-page="calc_h"]');
  const calcNote=document.querySelector('#calc .card .small-note');
  const outputHeading=document.querySelector('#calc .grid-2 > .card:nth-child(2) h3');
  if(calcHeading) calcHeading.textContent=step08('revenue_model_title');
  if(calcNote) calcNote.textContent=step08('revenue_model_note');
  if(outputHeading) outputHeading.textContent=step08('revenue_outputs_title');

  const kpiPanel=document.querySelector('#vcxKpiCharts .vcx-case-study-panel');
  if(kpiPanel){
    kpiPanel.innerHTML=`<div class="section-head">
      <span class="eyebrow">${step08('revenue_examples_eyebrow')}</span>
      <h2>${step08('revenue_examples_title')}</h2>
      <p class="section-intro">${step08('revenue_examples_intro')}</p>
    </div>
    <div class="kpi-grid">
      <div class="kpi-card glass-card">
        <div class="kpi-label">${step08('revenue_example_1_title')}</div>
        <div class="kpi-value">${step08('revenue_example_1_value')}</div>
        <div class="small-note">${step08('revenue_example_1_body')}</div>
      </div>
      <div class="kpi-card glass-card">
        <div class="kpi-label">${step08('revenue_example_2_title')}</div>
        <div class="kpi-value">${step08('revenue_example_2_value')}</div>
        <div class="small-note">${step08('revenue_example_2_body')}</div>
      </div>
      <div class="kpi-card glass-card">
        <div class="kpi-label">${step08('revenue_example_3_title')}</div>
        <div class="kpi-value">${step08('revenue_example_3_value')}</div>
        <div class="small-note">${step08('revenue_example_3_body')}</div>
      </div>
      <div class="kpi-card glass-card">
        <div class="kpi-label">${step08('revenue_example_4_title')}</div>
        <div class="kpi-value">${step08('revenue_example_4_value')}</div>
        <div class="small-note">${step08('revenue_example_4_body')}</div>
      </div>
    </div>`;
  }

  const anchor=sectionAnchor();
  if(anchor){
    upsertSectionBeforeAnchor(
      'vcxRevenueStructureSection',
      'section band vcx-structure-section',
      anchor,
      buildStructureSectionMarkup('')
    );
  }
}
function applyStep08TrustLayer(){
  const pageKey=currentPageKey();
  if(pageKey==='home') applyHomeTrustAndProofUpgrade();
  if(pageKey==='resources') applyResourcesTrustAndProofUpgrade();
  if(pageKey==='corporate-legal') applyCorporateTrustAndProofUpgrade();
  if(pageKey==='revenue-recovery') applyRevenueTrustAndProofUpgrade();
}
function dockIcon(label, short, href, extraClass, targetBlank){
  const attrs=targetBlank ? ' rel="noopener" target="_blank"' : '';
  return `<a class="vcx-dock-icon ${extraClass||''}" href="${href}"${attrs}><span class="vcx-dock-iconbox">${short}</span><span class="vcx-dock-text">${label}</span></a>`;
}
function dockChip(label, short, href, extraClass){
  return `<a class="vcx-dock-chip ${extraClass||''}" href="${href}"><span class="vcx-dock-chipicon">${short}</span><span class="vcx-dock-text">${label}</span></a>`;
}
function buildDockMarkup(){
  return `<div class="vcx-dock-shell">
    <div class="vcx-dock-desktop">
      <a aria-label="${tr('cta_confidential_review')}" class="vcx-dock-pilot" href="${COMPANY_REVIEW_URL}">${tr('cta_confidential_review')}</a>
      ${dockIcon(tr('home') || 'Home','H','index.html','is-home')}
      ${dockIcon(tr('dock_strategy'),'S',STRATEGY_CALL_URL,'is-strategy',true)}
      ${dockChip(tr('dock_brief'),'B',EXECUTIVE_BRIEF_URL,'is-brief')}
      ${dockChip(tr('dock_companies'),'C','corporate-legal-file-control.html','is-companies')}
      ${dockChip(tr('dock_individuals'),'I','additional-services.html','is-individuals')}
    </div>
    <div class="vcx-dock-mobile">
      <div class="vcx-dock-mobile-row vcx-dock-mobile-row-pilot">
        <a aria-label="${tr('cta_confidential_review')}" class="vcx-dock-pilot" href="${COMPANY_REVIEW_URL}">${tr('cta_confidential_review')}</a>
      </div>
      <div class="vcx-dock-mobile-row vcx-dock-mobile-row-icons">
        ${dockIcon(tr('home') || 'Home','H','index.html','is-home')}
        ${dockIcon(tr('dock_strategy'),'S',STRATEGY_CALL_URL,'is-strategy',true)}
      </div>
      <div class="vcx-dock-mobile-row vcx-dock-mobile-row-services">
        ${dockChip(tr('dock_brief'),'B',EXECUTIVE_BRIEF_URL,'is-brief')}
        ${dockChip(tr('dock_companies'),'C','corporate-legal-file-control.html','is-companies')}
        ${dockChip(tr('dock_individuals'),'I','additional-services.html','is-individuals')}
      </div>
    </div>
  </div>`;
}
function bindShellMobileNav(){
  const mobileNav=$('#vcxMobileNav');
  const menuButton=$('.vcx-menu-btn');
  const mobileHeader=$('.vcx-header-mobile');
  if(!mobileNav) return;
  mobileNav.querySelectorAll('a').forEach(link=>{
    if(link.dataset.vcxShellBound) return;
    link.dataset.vcxShellBound='1';
    link.addEventListener('click', ()=>{
      mobileNav.hidden=true;
      if(menuButton) menuButton.setAttribute('aria-expanded','false');
      if(mobileHeader) mobileHeader.classList.remove('is-open');
      document.documentElement.classList.remove('vcx-mobile-menu-open');
    });
  });
}
function renderSiteShell(){
  const pageKey=currentPageKey();
  if(document.body) document.body.dataset.vcxPage=pageKey;
  $$('.vcx-main-nav').forEach(nav=>{ nav.innerHTML=buildShellNav(); });
  const mobileNav=$('#vcxMobileNav');
  if(mobileNav){
    mobileNav.innerHTML=buildShellNav();
    mobileNav.hidden=true;
  }
  $$('.vcx-metric-text-full').forEach(el=>{ el.textContent=tr('header_metric_full'); });
  $$('.vcx-metric-text-mobile').forEach(el=>{ el.textContent=tr('header_metric_mobile'); });
  $$('.vcx-menu-text').forEach(el=>{ el.textContent=tr('menu_label'); });
  $$('.vcx-menu-icon').forEach(el=>{ el.innerHTML='&#9776;'; });
  $$('.modal-close').forEach(el=>{ el.innerHTML='&times;'; });

  let footer=document.querySelector('footer.footer, footer');
  if(!footer){
    footer=document.createElement('footer');
    footer.className='footer';
    const dock=document.querySelector('.vcx-dock');
    if(dock && dock.parentNode) dock.parentNode.insertBefore(footer, dock);
    else document.body.appendChild(footer);
  }
  footer.classList.add('footer');
  footer.innerHTML=buildFooterMarkup();

  const dock=document.querySelector('.vcx-dock');
  if(dock){
    dock.dataset.vcxDock='step03';
    dock.innerHTML=buildDockMarkup();
  }
  bindShellMobileNav();
}
function setButton(link, label, href){
  if(!link) return;
  if(label) link.textContent=label;
  if(href) link.setAttribute('href', href);
  if(href && !/\.pdf($|\?)/i.test(href)){
    link.removeAttribute('data-gated-asset');
    link.removeAttribute('data-gated-label');
  }
}
function setRowButtons(row, primary, secondary){
  if(!row) return;
  const links=row.querySelectorAll('a');
  if(links[0]) setButton(links[0], primary?.label, primary?.href);
  if(links[1]) setButton(links[1], secondary?.label, secondary?.href);
  if(primary?.external && links[0]){
    links[0].setAttribute('target','_blank');
    links[0].setAttribute('rel','noopener');
  } else if(links[0]){
    links[0].removeAttribute('target');
    links[0].removeAttribute('rel');
  }
  if(secondary?.external && links[1]){
    links[1].setAttribute('target','_blank');
    links[1].setAttribute('rel','noopener');
  } else if(links[1]){
    links[1].removeAttribute('target');
    links[1].removeAttribute('rel');
  }
}
function ensureNextBand(config){
  const existing=document.getElementById('vcxNextBand');
  if(!config){
    if(existing) existing.remove();
    return;
  }
  let band=existing;
  if(!band){
    band=document.createElement('section');
    band.id='vcxNextBand';
    band.className='section vcx-next-band';
    const footer=document.querySelector('footer.footer, footer');
    const dock=document.querySelector('.vcx-dock');
    const anchor=footer || dock;
    if(anchor && anchor.parentNode) anchor.parentNode.insertBefore(band, anchor);
    else document.body.appendChild(band);
  }
  const actionMarkup=(config.actions||[]).map(action=>{
    const attrs=action.external ? ' rel="noopener" target="_blank"' : '';
    return `<a class="btn ${action.className || 'btn-secondary'}" href="${action.href}"${attrs}>${action.label}</a>`;
  }).join('');
  band.innerHTML=`<div class="wrap"><div class="vcx-next-panel ${config.kind==='individual' ? 'is-individual' : 'is-company'}">
    <div>
      <span class="eyebrow">${config.eyebrow}</span>
      <h2>${config.title}</h2>
      <p class="section-intro">${config.body}</p>
    </div>
    <div class="vcx-next-actions">${actionMarkup}</div>
  </div></div>`;
}
function normalizeExecutiveBriefButtons(scope=document){
  scope.querySelectorAll('a[data-common="cta_briefs"], a[data-gated-asset], .resource-card a.btn').forEach(link=>{
    if(link.closest('.footer-links')) return;
    link.textContent=tr('cta_review_brief');
  });
}
function updateOutputLanguage(){
  const output=$('#intakeOutput');
  if(!output) return;
  const audience=currentAudience();
  const serviceField=$('#intakeForm [name="service_type"]');
  const serviceMap={
    'Revenue Recovery Workflow Design':'service_recovery',
    'Corporate Legal File Control':'service_file',
    'Structured Case Intake & Packet Build':'service_intake',
    'Executive Briefs / Proof Request':'service_briefs',
    'Services for Individuals':'service_individuals',
    'Other':'service_other'
  };
  const rawService=(serviceField && serviceField.value) || '';
  const serviceLabel=rawService ? (tr(serviceMap[rawService]) || rawService) : tr(audience==='company' ? 'service_confidential_review' : 'service_selected_individual');
  const summary=lastOutput || {};
  const fitText=summary.fitKey ? tr(summary.fitKey) : tr(audience==='company' ? 'out_fit_company' : 'out_fit_individual');
  const docsText=audience==='company' ? tr('out_docs_company') : tr('out_docs_individual');
  const windowMap={'Standard':tr('urgency_standard2'),'48 hours':tr('urgency_48'),'24 hours':tr('urgency_24'),'Same day / urgent':tr('urgency_same'),'Same day':tr('urgency_same_day')};
  const windowText=(summary.windowText && (windowMap[summary.windowText] || summary.windowText)) || tr(audience==='company' ? 'out_window_company' : 'out_window_individual');
  const nextText=summary.nextKey
    ? tr(summary.nextKey)
    : tr(audience==='company' ? 'out_next_company' : 'out_next_individual');
  output.innerHTML=`<ul class="vcx-output-list">
    <li class="vcx-output-item"><div><strong>${tr('out_service') || 'Recommended service line'}</strong></div><span>${serviceLabel}</span></li>
    <li class="vcx-output-item"><div><strong>${tr('out_fit') || 'Estimated fit'}</strong></div><span>${fitText}</span></li>
    <li class="vcx-output-item"><div><strong>${tr('out_docs') || 'What to send now'}</strong></div><span>${docsText}</span></li>
    <li class="vcx-output-item"><div><strong>${tr('out_window') || 'Expected response window'}</strong></div><span>${windowText}</span></li>
    <li class="vcx-output-item"><div><strong>${tr('out_next') || 'Recommended next step'}</strong></div><span>${nextText}</span></li>
  </ul>
  <p class="small-note">${tr('output_note') || tr('out_disc') || 'This output is not legal advice.'}</p>`;
}
function configureHomeExperience(){
  const heroRow=document.querySelector('.vcx-home-hero .cta-row');
  setRowButtons(heroRow,
    {label:tr('cta_confidential_review'), href:COMPANY_REVIEW_URL},
    {label:tr('cta_review_brief'), href:EXECUTIVE_BRIEF_URL}
  );
  const companyCta=document.querySelector('.vcx-path-card-corporate .cta-row a');
  setButton(companyCta, tr('cta_confidential_review'), COMPANY_REVIEW_URL);
  const individualCta=document.querySelector('.vcx-path-card-individual .cta-row a');
  setButton(individualCta, tr('cta_start_intake'), INDIVIDUAL_INTAKE_URL);
  const finalRow=document.querySelector('.vcx-home-final .cta-row');
  setRowButtons(finalRow,
    {label:tr('cta_confidential_review'), href:COMPANY_REVIEW_URL},
    {label:tr('cta_review_brief'), href:EXECUTIVE_BRIEF_URL}
  );
  normalizeExecutiveBriefButtons(document);
  ensureNextBand(null);
}
function configureCorporateExperience(){
  normalizeExecutiveBriefButtons(document);
  setRowButtons(document.querySelector('.hero .cta-row'),
    {label:tr('cta_confidential_review'), href:COMPANY_REVIEW_URL},
    {label:tr('cta_review_brief'), href:EXECUTIVE_BRIEF_URL}
  );
  ensureNextBand({
    kind:'company',
    eyebrow:tr('company_band_eyebrow'),
    title:tr('company_band_title'),
    body:tr('company_band_body'),
    actions:[
      {label:tr('cta_confidential_review'), href:COMPANY_REVIEW_URL, className:'btn-primary'},
      {label:tr('cta_strategy_call'), href:STRATEGY_CALL_URL, className:'btn-secondary', external:true}
    ]
  });
}
function configureRevenueExperience(){
  normalizeExecutiveBriefButtons(document);
  setRowButtons(document.querySelector('.hero .cta-row'),
    {label:tr('cta_confidential_review'), href:COMPANY_REVIEW_URL},
    {label:tr('cta_review_brief'), href:EXECUTIVE_BRIEF_URL}
  );
  ensureNextBand({
    kind:'company',
    eyebrow:tr('company_band_eyebrow'),
    title:tr('company_band_title'),
    body:tr('company_band_body'),
    actions:[
      {label:tr('cta_confidential_review'), href:COMPANY_REVIEW_URL, className:'btn-primary'},
      {label:tr('cta_strategy_call'), href:STRATEGY_CALL_URL, className:'btn-secondary', external:true}
    ]
  });
}
function configureResourcesExperience(){
  normalizeExecutiveBriefButtons(document);
  const note=document.querySelector('.confidentiality-card');
  if(note) note.remove();
  ensureNextBand({
    kind:'company',
    eyebrow:tr('resources_band_eyebrow'),
    title:tr('resources_band_title'),
    body:tr('resources_band_body'),
    actions:[
      {label:tr('cta_confidential_review'), href:COMPANY_REVIEW_URL, className:'btn-primary'},
      {label:tr('cta_strategy_call'), href:STRATEGY_CALL_URL, className:'btn-secondary', external:true}
    ]
  });
}
function configureIndividualServicesExperience(){
  document.querySelectorAll('a[href*="structured-case-intake.html?service="]').forEach(link=>{
    const raw=(link.getAttribute('href') || '').split('service=')[1] || '';
    const slug=raw.split('&')[0];
    link.setAttribute('href', `${INDIVIDUAL_INTAKE_URL}&service=${slug}`);
    link.textContent=tr('cta_start_intake');
  });
  ensureNextBand({
    kind:'individual',
    eyebrow:tr('individual_band_eyebrow'),
    title:tr('individual_band_title'),
    body:tr('individual_band_body'),
    actions:[
      {label:tr('cta_start_intake'), href:INDIVIDUAL_INTAKE_URL, className:'btn-primary'},
      {label:tr('cta_request_service'), href:INDIVIDUAL_INTAKE_URL, className:'btn-secondary'}
    ]
  });
}
function configureCareersExperience(){
  ensureNextBand({
    kind:'company',
    eyebrow:tr('careers_band_eyebrow'),
    title:tr('careers_band_title'),
    body:tr('careers_band_body'),
    actions:[
      {label:tr('cta_confidential_review'), href:COMPANY_REVIEW_URL, className:'btn-primary'},
      {label:tr('cta_review_brief'), href:EXECUTIVE_BRIEF_URL, className:'btn-secondary'}
    ]
  });
}
function configureThankYouExperience(){
  const purpose=currentThankYouPurpose();
  const purposeConfig={
    company_review:{
      titleKey:'thank_company_title',
      leadKey:'thank_company_lead',
      windowKey:'thank_window_company',
      trackKey:'thank_track_company',
      ctaKey:'thank_company_cta',
      ctaHref:STRATEGY_CALL_URL,
      ctaExternal:true,
      metaTitleKey:'thank_company_meta_title',
      metaDescKey:'thank_company_meta_desc'
    },
    individual_request:{
      titleKey:'thank_individual_title',
      leadKey:'thank_individual_lead',
      windowKey:'thank_window_individual',
      trackKey:'thank_track_individual',
      ctaKey:'thank_individual_cta',
      ctaHref:INDIVIDUAL_SERVICES_URL,
      ctaExternal:false,
      metaTitleKey:'thank_individual_meta_title',
      metaDescKey:'thank_individual_meta_desc'
    },
    careers_application:{
      titleKey:'thank_careers_title',
      leadKey:'thank_careers_lead',
      windowKey:'thank_window_careers',
      trackKey:'thank_track_careers',
      ctaKey:'thank_careers_cta',
      ctaHref:'corporate-legal-file-control.html',
      ctaExternal:false,
      metaTitleKey:'thank_careers_meta_title',
      metaDescKey:'thank_careers_meta_desc'
    },
    executive_brief_unlock:{
      titleKey:'thank_brief_title',
      leadKey:'thank_brief_lead',
      windowKey:'thank_window_brief',
      trackKey:'thank_track_brief',
      ctaKey:'thank_brief_cta',
      ctaHref:COMPANY_REVIEW_URL,
      ctaExternal:false,
      metaTitleKey:'thank_brief_meta_title',
      metaDescKey:'thank_brief_meta_desc'
    }
  };
  const config=purposeConfig[purpose] || purposeConfig.company_review;
  const heroEyebrow=document.querySelector('[data-page="eyebrow"]');
  const title=document.querySelector('[data-page="title"]');
  const lead=document.querySelector('[data-page="lead"]');
  const trackLabel=document.querySelector('[data-page="track_label"]');
  const trackValue=document.querySelector('[data-page="track_value"]');
  const windowValue=document.querySelector('[data-page="window_value"]');
  const ctas=document.querySelectorAll('main .cta-row a');
  if(heroEyebrow) heroEyebrow.textContent=tr('thank_received');
  if(title) title.textContent=tr(config.titleKey);
  if(lead) lead.textContent=tr(config.leadKey);
  if(trackLabel) trackLabel.textContent=tr('thank_track_label');
  if(trackValue) trackValue.textContent=tr(config.trackKey);
  if(windowValue) windowValue.textContent=tr(config.windowKey);
  if(ctas[0]) setButton(ctas[0], tr('home') || 'Home', 'index.html');
  if(ctas[1]){
    setButton(ctas[1], tr(config.ctaKey), config.ctaHref);
    if(config.ctaExternal){
      ctas[1].setAttribute('target','_blank');
      ctas[1].setAttribute('rel','noopener');
    } else {
      ctas[1].removeAttribute('target');
      ctas[1].removeAttribute('rel');
    }
  }
  setPageMeta(tr(config.metaTitleKey), tr(config.metaDescKey));
  ensureNextBand(null);
}
function configureIntakePage(){
  const audience=currentAudience();
  const eyebrow=document.querySelector('.hero-copy .eyebrow');
  const title=document.querySelector('.hero-copy h1');
  const lead=document.querySelector('.hero-copy .lead');
  const sideTitle=document.querySelector('.hero-side h3');
  const sideBody=document.querySelector('.hero-side p');
  const submitBtn=$('#intakeSubmitBtn');
  const emailField=document.querySelector('#intakeForm [name="email"]');
  if(audience==='company'){
    if(eyebrow) eyebrow.textContent=tr('intake_company_eyebrow');
    if(title) title.textContent=tr('intake_company_title');
    if(lead) lead.textContent=tr('intake_company_lead');
    if(sideTitle) sideTitle.textContent=tr('intake_company_side_title');
    if(sideBody) sideBody.textContent=tr('intake_company_side_body');
    if(submitBtn) submitBtn.textContent=tr('intake_company_button');
    if(emailField) emailField.setAttribute('placeholder','name@company.com');
    setPageMeta(tr('intake_company_meta_title'), tr('intake_company_meta_desc'));
  } else {
    if(eyebrow) eyebrow.textContent=tr('intake_individual_eyebrow');
    if(title) title.textContent=tr('intake_individual_title');
    if(lead) lead.textContent=tr('intake_individual_lead');
    if(sideTitle) sideTitle.textContent=tr('intake_individual_side_title');
    if(sideBody) sideBody.textContent=tr('intake_individual_side_body');
    if(submitBtn) submitBtn.textContent=tr('intake_individual_button');
    if(emailField) emailField.setAttribute('placeholder','name@email.com');
    setPageMeta(tr('intake_individual_meta_title'), tr('intake_individual_meta_desc'));
  }
  ensureNextBand(null);
  updateOutputLanguage();
}
function configurePageExperience(){
  const pageKey=currentPageKey();
  if(pageKey==='home') return configureHomeExperience();
  if(pageKey==='corporate-legal') return configureCorporateExperience();
  if(pageKey==='revenue-recovery') return configureRevenueExperience();
  if(pageKey==='resources') return configureResourcesExperience();
  if(pageKey==='individual-services') return configureIndividualServicesExperience();
  if(pageKey==='contact' || pageKey==='structured-intake') return configureIntakePage();
  if(pageKey==='careers') return configureCareersExperience();
  if(pageKey==='thank-you') return configureThankYouExperience();
  ensureNextBand(null);
}
function applyText(){
 document.documentElement.lang=lang;
 $$('.lang-btn').forEach(b=>b.classList.toggle('active', b.dataset.lang===lang));
 $$('[data-common]').forEach(el=>{ const v=(extra[lang]&&extra[lang][el.dataset.common]) || (common[lang]&&common[lang][el.dataset.common]) || extra.en?.[el.dataset.common] || common.en?.[el.dataset.common]; if(v!==undefined) el.textContent=v; });
 $$('[data-page]').forEach(el=>{ const v=tr(el.dataset.page); if(v) el.textContent=v; });
 $$('[data-tx]').forEach(el=>{ const v=tr(el.dataset.tx); if(v) el.textContent=v; });
 $$('[data-tx-placeholder]').forEach(el=>{ const v=tr(el.dataset.txPlaceholder); if(v) el.setAttribute('placeholder',v); });
 $$('[data-tx-title]').forEach(el=>{ const v=tr(el.dataset.txTitle); if(v) el.setAttribute('title',v); });
 $$('[data-tx-value]').forEach(el=>{ const v=tr(el.dataset.txValue); if(v) el.setAttribute('value',v); });
 const title=pageText('title') || page[lang]?.title || page.en?.title;
 const desc=pageText('desc') || page[lang]?.desc || page.en?.desc;
 syncSeoState(title, desc);
}
function ensureFooterContactActions(){
  document.querySelectorAll('.footer-group').forEach(group=>{
    const nav=group.querySelector('.footer-links');
    if(!nav) return;
    const links=[...nav.querySelectorAll('a')];
    const isCompanyGroup=links.some(link=>/contact\.html\?audience=company/i.test(link.getAttribute('href') || ''));
    if(isCompanyGroup){
      let directorLink=nav.querySelector('.vcx-director-link');
      if(!directorLink){
        directorLink=document.createElement('a');
        directorLink.className='vcx-director-link';
        directorLink.href='mailto:VitaCoreXllc@gmail.com?subject='+encodeURIComponent('VitaCoreX Director Contact');
        nav.appendChild(directorLink);
      }
      directorLink.textContent=tr('cta_contact') || 'Contact the director';
    }
  });

  document.querySelectorAll('.vcx-footer-follow .footer-links').forEach(nav=>{
    let phoneLink=nav.querySelector('.vcx-phone-link');
    if(!phoneLink){
      phoneLink=document.createElement('a');
      phoneLink.className='vcx-phone-link';
      phoneLink.href='tel:+18139194242';
      nav.insertBefore(phoneLink, nav.firstChild);
    }
    phoneLink.textContent=tr('footer_phone') || 'Phone (call/text): (813) 919-4242';
  });
}
function refreshPageExperience(){
  syncLanguageQueryParam();
  applyText();
  renderSiteShell();
  configurePageExperience();
  applyStaticCopy();
  applyLocalizedFormChrome();
  updateOutputLanguage();
  syncCareerMailto();
  ensureFooterContactActions();
  applyStep08TrustLayer();
  syncSeoState();
  loadVcxMarketTicker(false);
}
refreshPageExperience();
$$('.lang-btn').forEach(b=>b.addEventListener('click',()=>{
  const nextLang=b.dataset.lang;
  const previousLang=lang;
  if(window.trackEvent && nextLang && nextLang!==previousLang){
    window.trackEvent('language_switch', {
      from_language:previousLang,
      to_language:nextLang,
      switch_surface:b.closest('.vcx-header-mobile') ? 'mobile_header' : 'desktop_header'
    });
  }
  lang=nextLang;
  localStorage.setItem('vcx_lang',lang);
  refreshPageExperience();
  loadVcxMarketTicker(true);
}));
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
function openPdfAsset(asset){
  const rawUrl=normalizeAssetUrl(asset);
  if(!rawUrl) throw new Error('missing_pdf_asset');
  const absoluteUrl=new URL(rawUrl, window.location.href).href;
  if(window.trackEvent){
    window.trackEvent('pdf_download', {
      asset_name:absoluteUrl.split('/').pop() || rawUrl,
      asset_url:absoluteUrl,
      access_type:'gated'
    });
  }
  if(isAppleMobileContext()){
    window.location.assign(absoluteUrl);
    return;
  }
  const opened=window.open(absoluteUrl,'_blank','noopener');
  if(!opened){
    window.location.assign(absoluteUrl);
  }
}
$$('[data-gated-asset]').forEach(btn=>btn.addEventListener('click',e=>{
  e.preventDefault();
  const asset=btn.dataset.gatedAsset || btn.getAttribute('href') || '';
  openGate(asset, btn.dataset.gatedLabel);
}));
$$('.modal-close,.modal-cancel').forEach(btn=>btn.addEventListener('click',closeGate));
gate && gate.addEventListener('click',e=>{ if(e.target===gate) closeGate(); });
const gateForm=$('#gateForm');
if(false && gateForm){
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
    if(!asset){
      setStatus(gateState,'error',statusText('gate_failure','The PDF link is unavailable. Please try again or use email.'));
      return;
    }
    if(gateSubmitBtn){
      gateSubmitBtn.disabled=true;
      gateSubmitBtn.classList.add('is-loading');
    }
    try{
      await submitViaFormSubmitAjax(gateForm, {
        subject:'New Website PDF Access Request — Executive Brief',
        replyTo:String(fd.get('email')||'').trim(),
        formUrl: window.location.href,
        extraFields:{
          'Form': 'Executive Brief PDF Access',
          'Source': String(fd.get('Source')||'executive_brief_request').trim(),
          'Submission type': 'website_pdf_access_request',
          'Requested asset': asset,
          'Asset label': String((gate.querySelector('.gate-asset') && gate.querySelector('.gate-asset').textContent) || '').trim(),
          'File uploaded': 'No'
        }
      });
      localStorage.setItem('vcx_gate', JSON.stringify(Object.fromEntries(fd.entries())));
      setStatus(gateState,'success',statusText('gate_success','Access granted. Opening the resource now.'));
      closeGate();
      openPdfAsset(asset);
      gateForm.reset();
    }catch(err){
      console.error('PDF gate submission failed:', err);
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
const VCX_ATTRIBUTION_STORAGE_KEY='vcx_attribution_v1';
const VCX_ATTRIBUTION_TTL_MS=90 * 24 * 60 * 60 * 1000;
const VCX_SESSION_STORAGE_KEY='vcx_session_id';
function safeParseJson(value){
  if(!value) return null;
  try{
    return JSON.parse(value);
  }catch(_error){
    return null;
  }
}
function getQueryAttribution(){
  const params=new URLSearchParams(window.location.search);
  const keys=['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','fbclid','msclkid','li_fat_id'];
  const result={};
  let hasValue=false;
  keys.forEach(key=>{
    const value=String(params.get(key) || '').trim();
    result[key]=value;
    if(value) hasValue=true;
  });
  return hasValue ? result : null;
}
function readStoredAttribution(){
  const stored=safeParseJson(localStorage.getItem(VCX_ATTRIBUTION_STORAGE_KEY));
  if(!stored || !stored.updated_at) return null;
  const updatedAt=Date.parse(stored.updated_at);
  if(!updatedAt || (Date.now() - updatedAt) > VCX_ATTRIBUTION_TTL_MS){
    localStorage.removeItem(VCX_ATTRIBUTION_STORAGE_KEY);
    return null;
  }
  return stored;
}
function persistAttributionContext(){
  const nowIso=new Date().toISOString();
  const currentPath=window.location.pathname || '/';
  const currentUrl=window.location.href;
  const currentReferrer=document.referrer || 'Direct';
  const language=preferredLangValue();
  const queryAttribution=getQueryAttribution();
  const stored=readStoredAttribution() || {};
  const payload=Object.assign({}, stored);

  if(!payload.first_touch_at){
    payload.first_touch_at=nowIso;
    payload.first_page=currentPath;
    payload.first_url=currentUrl;
    payload.first_referrer=currentReferrer;
    payload.first_language=language;
  }

  payload.last_touch_at=nowIso;
  payload.last_page=currentPath;
  payload.last_url=currentUrl;
  payload.last_referrer=currentReferrer;
  payload.last_language=language;
  payload.updated_at=nowIso;

  if(queryAttribution){
    if(!payload.first_campaign_at){
      payload.first_campaign_at=nowIso;
      payload.first_utm=Object.assign({}, queryAttribution);
    }
    payload.last_campaign_at=nowIso;
    payload.last_utm=Object.assign({}, queryAttribution);
  }else{
    payload.first_utm=payload.first_utm || {};
    payload.last_utm=payload.last_utm || payload.first_utm || {};
  }

  localStorage.setItem(VCX_ATTRIBUTION_STORAGE_KEY, JSON.stringify(payload));
  return payload;
}
function getAttributionContext(){
  const stored=readStoredAttribution() || persistAttributionContext() || {};
  const currentQuery=getQueryAttribution();
  const activeUtm=currentQuery || stored.last_utm || stored.first_utm || {};
  return {
    landing_page:stored.first_page || (window.location.pathname || '/'),
    landing_url:stored.first_url || window.location.href,
    first_touch_at:stored.first_touch_at || '',
    last_touch_at:stored.last_touch_at || '',
    referrer:stored.last_referrer || document.referrer || 'Direct',
    first_referrer:stored.first_referrer || '',
    utm_source:activeUtm.utm_source || '',
    utm_medium:activeUtm.utm_medium || '',
    utm_campaign:activeUtm.utm_campaign || '',
    utm_term:activeUtm.utm_term || '',
    utm_content:activeUtm.utm_content || '',
    gclid:activeUtm.gclid || '',
    fbclid:activeUtm.fbclid || '',
    msclkid:activeUtm.msclkid || '',
    li_fat_id:activeUtm.li_fat_id || ''
  };
}
function getVisitorSessionId(){
  let sessionId=String(sessionStorage.getItem(VCX_SESSION_STORAGE_KEY) || '').trim();
  if(sessionId) return sessionId;
  sessionId=`vcx-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,10)}`;
  sessionStorage.setItem(VCX_SESSION_STORAGE_KEY, sessionId);
  return sessionId;
}
persistAttributionContext();
const OWNER_NOTIFICATION_EMAIL='vitacorexllc@gmail.com';
const FORM_ENDPOINT=`https://formsubmit.co/${OWNER_NOTIFICATION_EMAIL}`;
const FORM_AJAX_ENDPOINT=`https://formsubmit.co/ajax/${OWNER_NOTIFICATION_EMAIL}`;
const FILE_UPLOAD_NOTIFICATION_ENDPOINT=FORM_ENDPOINT;
const FORM_ROUTE_CONTEXT_LABELS={
  route_key:'Route key',
  route_label:'Route label',
  page_path:'Page path',
  page_url:'Page URL',
  page_title:'Page title',
  language:'Language',
  service_line:'Service line',
  client_type:'Client type',
  service_detail:'Service detail',
  asset_requested:'Asset requested',
  asset_label:'Asset label',
  landing_page:'Landing page',
  landing_url:'Landing URL',
  first_touch_at:'First touch at',
  last_touch_at:'Last touch at',
  referrer:'Referrer',
  first_referrer:'First referrer',
  utm_source:'UTM source',
  utm_medium:'UTM medium',
  utm_campaign:'UTM campaign',
  utm_term:'UTM term',
  utm_content:'UTM content',
  gclid:'Google click ID',
  fbclid:'Meta click ID',
  msclkid:'Microsoft click ID',
  li_fat_id:'LinkedIn click ID',
  session_id:'Session ID',
  submitted_at:'Submitted at',
  browser_device:'Browser / Device'
};
const FORM_ROUTE_DEFS={
  company_review:{
    transport:'direct',
    audience:'company',
    purpose:'company_review',
    source:'company_confidential_review',
    submissionType:'company_confidential_review',
    labelKey:'route_company_review_label',
    formNameKey:'route_company_review_form',
    subjectKey:'route_company_review_subject',
    bodyKey:'route_company_review_body',
    responseWindowKey:'route_company_review_window',
    pendingKey:'route_company_review_pending',
    errorKey:'route_company_review_error'
  },
  individual_request:{
    transport:'direct',
    audience:'individual',
    purpose:'individual_request',
    source:'individual_service_request',
    submissionType:'individual_service_request',
    labelKey:'route_individual_request_label',
    formNameKey:'route_individual_request_form',
    subjectKey:'route_individual_request_subject',
    bodyKey:'route_individual_request_body',
    responseWindowKey:'route_individual_request_window',
    pendingKey:'route_individual_request_pending',
    errorKey:'route_individual_request_error'
  },
  executive_brief_unlock:{
    transport:'ajax',
    audience:'company',
    purpose:'executive_brief_unlock',
    source:'executive_brief_unlock',
    submissionType:'executive_brief_unlock',
    labelKey:'route_executive_brief_unlock_label',
    formNameKey:'route_executive_brief_unlock_form',
    subjectKey:'route_executive_brief_unlock_subject',
    bodyKey:'route_executive_brief_unlock_body',
    responseWindowKey:'route_executive_brief_unlock_window',
    pendingKey:'route_executive_brief_unlock_pending',
    successKey:'route_executive_brief_unlock_success',
    errorKey:'route_executive_brief_unlock_error'
  },
  careers_application:{
    transport:'ajax',
    audience:'careers',
    purpose:'careers_application',
    source:'careers_application',
    submissionType:'careers_application',
    labelKey:'route_careers_application_label',
    formNameKey:'route_careers_application_form',
    subjectKey:'route_careers_application_subject',
    bodyKey:'route_careers_application_body',
    responseWindowKey:'route_careers_application_window',
    pendingKey:'route_careers_application_pending',
    successKey:'route_careers_application_success',
    errorKey:'route_careers_application_error'
  }
};
function ensureHiddenField(form, name, value){
  let el=form.querySelector(`input[name="${name}"]`);
  if(!el){ el=document.createElement('input'); el.type='hidden'; el.name=name; form.appendChild(el); }
  el.value=value;
  return el;
}
function configureDirectFormSubmission(form, config){
  form.setAttribute('action', config.endpoint || FORM_ENDPOINT);
  form.setAttribute('method', 'POST');
  form.setAttribute('enctype', config.enctype || 'multipart/form-data');
  form.setAttribute('accept-charset','UTF-8');
  form.removeAttribute('target');
  ensureHiddenField(form,'_captcha','false');
  ensureHiddenField(form,'_template','table');
  ensureHiddenField(form,'_subject', config.subject || 'VitaCoreX Website Submission');
  ensureHiddenField(form,'_next', config.next || VCX_THANK_YOU_BASE);
  ensureHiddenField(form,'_url', config.formUrl || window.location.href);
  if(config.replyTo) ensureHiddenField(form,'_replyto', String(config.replyTo||'').trim());
  ensureHiddenField(form,'Timestamp', new Date().toISOString());
  ensureHiddenField(form,'Browser / Device', detectDevice());
  if(config.extraFields){
    Object.entries(config.extraFields).forEach(([name, value])=>ensureHiddenField(form, name, value));
  }
}

async function submitViaFormSubmitAjax(form, config){
  const formData = new FormData(form);
  formData.set('_captcha', 'false');
  formData.set('_template', 'table');
  formData.set('_subject', config.subject || 'VitaCoreX Website Submission');
  formData.set('_url', config.formUrl || window.location.href);
  formData.set('Timestamp', new Date().toISOString());
  formData.set('Browser / Device', detectDevice());
  if(config.replyTo) formData.set('_replyto', String(config.replyTo || '').trim());
  if(config.extraFields){
    Object.entries(config.extraFields).forEach(([name, value])=>formData.set(name, value == null ? '' : String(value)));
  }

  const response = await fetch(config.endpoint || FORM_AJAX_ENDPOINT, {
    method:'POST',
    body:formData,
    headers:{'Accept':'application/json'}
  });

  const contentType = response.headers.get('content-type') || '';
  let payload = null;
  if(contentType.includes('application/json')){
    payload = await response.json().catch(()=>null);
  }else{
    const text = await response.text().catch(()=>'');
    payload = { message:text };
  }

  const message = String((payload && payload.message) || '').trim();
  const successValue = payload && Object.prototype.hasOwnProperty.call(payload, 'success') ? payload.success : true;
  const success = successValue === true || successValue === 'true' || /success/i.test(message);

  if(!response.ok || !success){
    const err = new Error(message || `formsubmit_${response.status}`);
    err.payload = payload;
    err.status = response.status;
    throw err;
  }

  return payload || { success:true };
}

async function submitViaWebhook(form, routeKey, context){
  const route=resolveFormRoute(routeKey);
  if(!route.webhookEndpoint) return false;
  const formData=new FormData(form);
  const extraFields=buildRouteExtraFields(form, routeKey, context);
  Object.entries(extraFields).forEach(([name, value])=>formData.set(name, value == null ? '' : String(value)));
  const response=await fetch(route.webhookEndpoint, {
    method:route.webhookMethod || 'POST',
    body:formData,
    headers:Object.assign({ Accept:'application/json' }, route.webhookHeaders || {})
  });
  if(!response.ok){
    throw new Error(`webhook_${response.status}`);
  }
  return true;
}
function resolveFormRoute(routeKey){
  const base=FORM_ROUTE_DEFS[routeKey] || {};
  const override=(window.VCX_FORM_ROUTING && window.VCX_FORM_ROUTING[routeKey]) || {};
  return Object.assign({}, base, override, { routeKey });
}
function getInputValue(form, name){
  return String((new FormData(form)).get(name) || '').trim();
}
function currentFormRouteKey(form){
  if(!form) return '';
  if(form.id==='gateForm') return 'executive_brief_unlock';
  if(form.id==='careersForm') return 'careers_application';
  if(form.id==='intakeForm'){
    return String(form.querySelector('[name="client_type"]')?.value || '').trim()==='individual'
      ? 'individual_request'
      : 'company_review';
  }
  return form.dataset.formRoute || '';
}
function buildThankYouUrl(routeKey, context={}){
  const route=resolveFormRoute(routeKey);
  const url=new URL(VCX_THANK_YOU_BASE);
  if(route.purpose) url.searchParams.set('purpose', route.purpose);
  if(context.client_type || route.audience) url.searchParams.set('audience', context.client_type || route.audience);
  if(context.language) url.searchParams.set('lang', context.language);
  return url.toString();
}
function currentThankYouPurpose(){
  const params=new URLSearchParams(window.location.search);
  const purpose=params.get('purpose');
  if(purpose) return purpose;
  return currentAudience()==='individual' ? 'individual_request' : 'company_review';
}
function routeServiceLine(form, routeKey){
  if(routeKey==='careers_application'){
    return getInputValue(form,'role') || tr('route_careers_application_label');
  }
  if(routeKey==='executive_brief_unlock'){
    return tr('route_executive_brief_unlock_label');
  }
  const requestedDetail=getInputValue(form,'Requested service detail');
  const serviceType=getInputValue(form,'service_type');
  if(routeKey==='individual_request') return requestedDetail || serviceType || tr('route_individual_request_label');
  return serviceType || tr('route_company_review_label');
}
function collectSubmissionContext(form, routeKey, overrides={}){
  const route=resolveFormRoute(routeKey);
  const assetRequested=overrides.asset_requested || getInputValue(form,'asset');
  const assetLabel=overrides.asset_label || String(gate?.querySelector('.gate-asset')?.textContent || '').trim();
  const attribution=getAttributionContext();
  return {
    route_key:routeKey,
    route_label:tr(route.labelKey) || routeKey,
    page_path:window.location.pathname || '/',
    page_url:window.location.href,
    page_title:document.title,
    language:preferredLangValue(),
    service_line:routeServiceLine(form, routeKey),
    client_type:overrides.client_type || getInputValue(form,'client_type') || route.audience || '',
    service_detail:getInputValue(form,'Requested service detail'),
    asset_requested:assetRequested,
    asset_label:assetLabel,
    landing_page:attribution.landing_page || '',
    landing_url:attribution.landing_url || '',
    first_touch_at:attribution.first_touch_at || '',
    last_touch_at:attribution.last_touch_at || '',
    referrer:attribution.referrer || 'Direct',
    first_referrer:attribution.first_referrer || '',
    utm_source:attribution.utm_source || '',
    utm_medium:attribution.utm_medium || '',
    utm_campaign:attribution.utm_campaign || '',
    utm_term:attribution.utm_term || '',
    utm_content:attribution.utm_content || '',
    gclid:attribution.gclid || '',
    fbclid:attribution.fbclid || '',
    msclkid:attribution.msclkid || '',
    li_fat_id:attribution.li_fat_id || '',
    session_id:getVisitorSessionId(),
    submitted_at:new Date().toISOString(),
    browser_device:detectDevice()
  };
}
function syncUploadMetadata(form){
  const attachmentInput=form.querySelector('[name="attachment"]');
  const file=attachmentInput && attachmentInput.files && attachmentInput.files[0];
  const hasUpload=attachmentInput ? 'Yes' : 'No';
  ensureHiddenField(form,'Has file upload',hasUpload);
  ensureHiddenField(form,'File field name',attachmentInput ? 'attachment' : '');
  ensureHiddenField(form,'File uploaded', file ? 'Yes' : 'No');
  ensureHiddenField(form,'Uploaded file name', file && file.name ? file.name : 'No file attached');
}
function buildRouteExtraFields(form, routeKey, context){
  const route=resolveFormRoute(routeKey);
  const fields={
    Form:tr(route.formNameKey) || routeKey,
    Source:route.source || routeKey,
    'Submission type':route.submissionType || routeKey
  };
  Object.entries(FORM_ROUTE_CONTEXT_LABELS).forEach(([key, label])=>{
    fields[label]=context[key] == null ? '' : String(context[key]);
  });
  if(form.querySelector('[name="attachment"]')) syncUploadMetadata(form);
  const fileUploaded=getInputValue(form,'Uploaded file name');
  fields['Has file upload']=getInputValue(form,'Has file upload') || 'No';
  fields['File field name']=getInputValue(form,'File field name');
  fields['File uploaded']=fileUploaded && fileUploaded!=='No file attached' ? 'Yes' : getInputValue(form,'File uploaded') || 'No';
  fields['Uploaded file name']=fileUploaded || 'No file attached';
  return fields;
}
function applyRouteHiddenFields(form, routeKey, context){
  const route=resolveFormRoute(routeKey);
  const replyTo=getInputValue(form,'email');
  ensureHiddenField(form,'_captcha','false');
  ensureHiddenField(form,'_template','table');
  ensureHiddenField(form,'_subject', tr(route.subjectKey) || 'VitaCoreX Website Submission');
  ensureHiddenField(form,'_next', buildThankYouUrl(routeKey, context));
  ensureHiddenField(form,'_url', context.page_url);
  ensureHiddenField(form,'Timestamp', context.submitted_at);
  ensureHiddenField(form,'Browser / Device', context.browser_device);
  if(replyTo) ensureHiddenField(form,'_replyto', replyTo);
  Object.entries(buildRouteExtraFields(form, routeKey, context)).forEach(([name, value])=>ensureHiddenField(form, name, value));
}
function setFormBusy(form, button, busy){
  if(form) form.dataset.submitting=busy ? '1' : '0';
  if(form) form.setAttribute('aria-busy', busy ? 'true' : 'false');
  if(button){
    button.disabled=busy;
    button.classList.toggle('is-loading', busy);
    button.setAttribute('aria-busy', busy ? 'true' : 'false');
  }
}
function syncControlValidity(control){
  if(!control || !control.willValidate) return;
  const touched=control.dataset.touched==='1' || control.form?.dataset.submitting==='1';
  control.classList.toggle('is-invalid', touched && !control.validity.valid);
}
function bindValidationChrome(form){
  form.querySelectorAll('input,select,textarea').forEach(control=>{
    if(!control.willValidate) return;
    ['blur','change','input'].forEach(eventName=>control.addEventListener(eventName, ()=>{
      if(eventName!=='input') control.dataset.touched='1';
      syncControlValidity(control);
    }));
  });
}
function getStatusElement(form){
  return form.querySelector('#intakeFormStatus')
    || form.querySelector('#careersFormStatus')
    || form.querySelector('#gateState')
    || form.querySelector('.form-status');
}
function ensureFormAssurance(form, routeKey){
  const route=resolveFormRoute(routeKey);
  if(!route.bodyKey || !route.responseWindowKey) return;
  let block=form.querySelector('.form-assurance');
  if(!block){
    block=document.createElement('div');
    block.className='form-assurance';
    const statusEl=getStatusElement(form);
    const anchor=statusEl?.closest('.field') || statusEl;
    if(anchor) form.insertBefore(block, anchor);
    else form.appendChild(block);
  }
  block.innerHTML='';
  [
    { title:tr('route_context_label'), body:tr(route.bodyKey) },
    { title:tr('route_followup_label'), body:tr(route.responseWindowKey) }
  ].forEach(entry=>{
    const item=document.createElement('div');
    item.className='form-assurance-item';
    const strong=document.createElement('strong');
    strong.textContent=entry.title;
    const span=document.createElement('span');
    span.textContent=entry.body;
    item.appendChild(strong);
    item.appendChild(span);
    block.appendChild(item);
  });
}
function refreshLeadFormRoute(form){
  if(!form) return { routeKey:'', context:{} };
  const routeKey=currentFormRouteKey(form);
  if(!routeKey) return { routeKey:'', context:{} };
  if(form.querySelector('[name="attachment"]')) syncUploadMetadata(form);
  const context=collectSubmissionContext(form, routeKey);
  applyRouteHiddenFields(form, routeKey, context);
  ensureFormAssurance(form, routeKey);
  if(form.id==='intakeForm') fillOutputFromIntake(form);
  return { routeKey, context };
}
window.VCX_refreshLeadForm=refreshLeadFormRoute;
function submitDirectRoute(form, routeKey, context){
  const route=resolveFormRoute(routeKey);
  configureDirectFormSubmission(form, {
    endpoint:route.directEndpoint || FORM_ENDPOINT,
    subject:tr(route.subjectKey) || 'VitaCoreX Website Submission',
    replyTo:getInputValue(form,'email'),
    enctype:'multipart/form-data',
    next:buildThankYouUrl(routeKey, context),
    formUrl:context.page_url,
    extraFields:buildRouteExtraFields(form, routeKey, context)
  });
  HTMLFormElement.prototype.submit.call(form);
}
async function submitAjaxRoute(form, routeKey, context){
  const route=resolveFormRoute(routeKey);
  if(route.webhookEndpoint){
    try{
      await submitViaWebhook(form, routeKey, context);
      return;
    }catch(err){
      console.warn(`Webhook route failed for ${routeKey}; falling back to site transport.`, err);
    }
  }
  await submitViaFormSubmitAjax(form, {
    endpoint:route.ajaxEndpoint || FORM_AJAX_ENDPOINT,
    subject:tr(route.subjectKey) || 'VitaCoreX Website Submission',
    replyTo:getInputValue(form,'email'),
    formUrl:context.page_url,
    extraFields:buildRouteExtraFields(form, routeKey, context)
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
  ensureFileNameMirror(form, 'attachment', 'Uploaded file name');
  const attachmentInput=form.querySelector('[name="attachment"]');
  const syncUploadMetadata=()=>{
    const file=attachmentInput && attachmentInput.files && attachmentInput.files[0];
    ensureHiddenField(form,'Has file upload','Yes');
    ensureHiddenField(form,'File field name','attachment');
    ensureHiddenField(form,'File uploaded', file ? 'Yes' : 'No');
    ensureHiddenField(form,'Uploaded file name', file && file.name ? file.name : 'No file attached');
  };
  if(attachmentInput){
    attachmentInput.addEventListener('change', syncUploadMetadata);
    syncUploadMetadata();
  }
  const status=form.querySelector('#intakeFormStatus') || form.querySelector('.form-status');
  const submitBtn=form.querySelector('#intakeSubmitBtn') || form.querySelector('button[type="submit"]');
  form.addEventListener('submit', e=>{
    if(!form.checkValidity()){
      e.preventDefault();
      form.reportValidity();
      setStatus(status,'error',statusText('intake_validation','Please complete all fields before submitting.'));
      return;
    }
    syncUploadMetadata();
    const fd=new FormData(form);
    const formName=String(fd.get('form_name') || 'Structured Intake').trim();
    const source=String(fd.get('Source') || 'structured_case_intake').trim();
    configureDirectFormSubmission(form, {
      endpoint: FILE_UPLOAD_NOTIFICATION_ENDPOINT,
      subject:`New Website File Upload Submission — ${formName}`,
      replyTo:String(fd.get('email')||'').trim(),
      enctype:'multipart/form-data',
      extraFields:{
        'Form': formName,
        'Source': source,
        'Submission type': 'website_file_upload_submission',
        'Has file upload': 'Yes',
        'File field name': 'attachment',
        'File uploaded': String(fd.get('Uploaded file name')||'').trim() && String(fd.get('Uploaded file name')).trim()!=='No file attached' ? 'Yes' : 'No'
      }
    });
    if(submitBtn){ submitBtn.disabled=true; submitBtn.classList.add('is-loading'); }
    setStatus(status,'success','Submitting request…');
  });
}
// Legacy intake binding disabled in favor of the shared route layer.

const careersForm=$('#careersForm');
if(false && careersForm){
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

function bindLeadForm(form){
  if(!form || form.dataset.vcxLeadBound==='1') return;
  form.dataset.vcxLeadBound='1';
  bindValidationChrome(form);
  if(form.querySelector('[name="attachment"]')){
    ensureFileNameMirror(form, 'attachment', 'Uploaded file name');
    syncUploadMetadata(form);
  }
  form.querySelectorAll('input,select,textarea').forEach(control=>{
    ['input','change'].forEach(eventName=>control.addEventListener(eventName, ()=>{
      syncControlValidity(control);
      refreshLeadFormRoute(form);
    }));
  });
  form.addEventListener('vcx:routechange', ()=>refreshLeadFormRoute(form));
  refreshLeadFormRoute(form);
  const status=getStatusElement(form);
  const submitBtn=form.querySelector('button[type="submit"]');
  form.addEventListener('submit', async e=>{
    e.preventDefault();
    const routeKey=currentFormRouteKey(form);
    const route=resolveFormRoute(routeKey);
    const controls=[...form.querySelectorAll('input,select,textarea')].filter(control=>control.willValidate);
    controls.forEach(control=>{
      control.dataset.touched='1';
      syncControlValidity(control);
    });
    if(routeKey==='executive_brief_unlock' && !getInputValue(form,'asset')){
      setStatus(status,'error',tr(route.errorKey));
      return;
    }
    if(!form.checkValidity()){
      form.reportValidity();
      setStatus(status,'error',statusText('intake_validation','Please complete all required fields before submitting.'));
      return;
    }
    const active=refreshLeadFormRoute(form);
    const routeEventMap={
      company_review:'company_intake_submit',
      individual_request:'individual_service_request_submit',
      executive_brief_unlock:'executive_brief_submit',
      careers_application:'careers_submit'
    };
    const routeEventName=routeEventMap[active.routeKey];
    if(routeEventName && window.trackEvent){
      window.trackEvent(routeEventName, {
        service_line:active.context.service_line || '',
        client_type:active.context.client_type || '',
        asset_requested:active.context.asset_requested || '',
        route_key:active.context.route_key || active.routeKey
      });
    }
    setFormBusy(form, submitBtn, true);
    setStatus(status,'pending',tr(route.pendingKey));
    try{
      if(route.transport==='direct'){
        submitDirectRoute(form, active.routeKey, active.context);
        return;
      }
      await submitAjaxRoute(form, active.routeKey, active.context);
      if(active.routeKey==='executive_brief_unlock'){
        localStorage.setItem('vcx_gate', JSON.stringify(active.context));
        setStatus(status,'success',tr(route.successKey));
        openPdfAsset(active.context.asset_requested);
        setTimeout(()=>closeGate(), 320);
        form.reset();
        refreshLeadFormRoute(form);
      }else{
        if(route.successKey) setStatus(status,'success',tr(route.successKey));
        window.location.assign(buildThankYouUrl(active.routeKey, active.context));
      }
    }catch(err){
      console.error(`Lead form submission failed for ${routeKey}:`, err);
      setStatus(status,'error',tr(route.errorKey));
    }finally{
      if(route.transport!=='direct'){
        setFormBusy(form, submitBtn, false);
      }
    }
  });
}
bindLeadForm($('#gateForm'));
bindLeadForm($('#intakeForm'));
bindLeadForm($('#careersForm'));

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
  if(!form || form.dataset.vcxClientModeBound==='1') return;
  form.dataset.vcxClientModeBound='1';
  const pageKey=currentPageKey();
  const params=new URLSearchParams(window.location.search);
  const modeInput=form.querySelector('[name="client_type"]');
  const companyField=form.querySelector('[name="company"]');
  const serviceField=form.querySelector('[name="service_type"]');
  const nextField=form.querySelector('[name="_next"]');
  const sourceField=form.querySelector('[name="Source"]');
  const formNameField=form.querySelector('[name="form_name"]');
  const subjectField=form.querySelector('[name="_subject"]');
  const companyBlocks=$$('.company-only', form);
  const buttons=$$('.client-mode-btn', form);
  const companyBtn=buttons.find(btn=>btn.dataset.mode==='company');
  const individualBtn=buttons.find(btn=>btn.dataset.mode==='individual');
  const attachment=form.querySelector('[name="attachment"]');
  const serviceDetailField=ensureHiddenField(form,'Requested service detail','');
  if(attachment) attachment.removeAttribute('required');
  if(companyBtn && individualBtn && companyBtn.parentNode===individualBtn.parentNode){
    companyBtn.parentNode.insertBefore(companyBtn, individualBtn);
  }
  if(companyBtn) companyBtn.textContent=tr('client_company');
  if(individualBtn) individualBtn.textContent=tr('client_individual');

  const setMode=(mode, detail='')=>{
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
    if(serviceField){
      if(mode==='individual'){
        const opt=[...serviceField.options].find(o=>/Services for Individuals/i.test((o.value||'') + ' ' + (o.textContent||'')));
        if(opt) serviceField.value=opt.value;
      } else if(/services for individuals/i.test(serviceField.value || '')){
        serviceField.value='';
      }
    }
    serviceDetailField.value=detail || '';
    const activeRouteKey=mode==='company' ? 'company_review' : 'individual_request';
    const activeRoute=resolveFormRoute(activeRouteKey);
    const activeContext=collectSubmissionContext(form, activeRouteKey, { client_type:mode });
    if(nextField) nextField.value=buildThankYouUrl(activeRouteKey, activeContext);
    if(sourceField) sourceField.value=activeRoute.source || activeRouteKey;
    if(formNameField) formNameField.value=tr(activeRoute.formNameKey);
    if(subjectField) subjectField.value=tr(activeRoute.subjectKey);
    renderSiteShell();
    configurePageExperience();
    updateOutputLanguage();
    form.dispatchEvent(new Event('vcx:routechange'));
  };

  buttons.forEach(btn=>btn.addEventListener('click',()=>setMode(btn.dataset.mode, btn.dataset.mode==='individual' ? serviceDetailField.value : '')));
  serviceField && serviceField.addEventListener('change',()=>{
    const isIndividuals=/services for individuals/i.test(serviceField.value || '');
    if(isIndividuals) setMode('individual', serviceDetailField.value);
    else if(serviceField.value) setMode('company', '');
  });

  let initialMode=pageKey==='contact' ? 'company' : 'individual';
  const audienceParam=params.get('audience');
  const serviceParam=params.get('service');
  const companyServiceParam=params.get('company_service');
  if(audienceParam==='company' || audienceParam==='individual') initialMode=audienceParam;
  if(serviceParam && INDIVIDUAL_SERVICE_MAP[serviceParam]){
    initialMode='individual';
    serviceDetailField.value=INDIVIDUAL_SERVICE_MAP[serviceParam];
  }
  if(companyServiceParam && COMPANY_SERVICE_MAP[companyServiceParam]){
    initialMode='company';
    serviceDetailField.value=COMPANY_SERVICE_MAP[companyServiceParam];
  }

  setMode(initialMode, serviceDetailField.value);

  if(serviceField){
    if(serviceParam && INDIVIDUAL_SERVICE_MAP[serviceParam]){
      const opt=[...serviceField.options].find(o=>/Services for Individuals/i.test((o.value||'') + ' ' + (o.textContent||'')));
      if(opt) serviceField.value=opt.value;
    }
    if(companyServiceParam && COMPANY_SERVICE_MAP[companyServiceParam]){
      const opt=[...serviceField.options].find(o=>(o.value||'')===COMPANY_SERVICE_MAP[companyServiceParam]);
      if(opt) serviceField.value=opt.value;
    }
  }
}
initClientMode();

function buildCookieBanner(){
  if(document.querySelector('.cookie-banner')) return;
  const saved=normalizeConsentLevel(localStorage.getItem('vcx_cookie_consent'));
  if(saved){
    document.body?.classList.remove('vcx-consent-open');
    applyConsent(saved);
    return;
  }
  const banner=document.createElement('section');
  banner.className='cookie-banner';
  const cookieCopy={
    en:{
      title:'Privacy settings',
      body:'Essential storage keeps language preference, intake continuity, and attribution context available. Analytics and remarketing load only after consent.',
      all:'Accept all',
      analytics:'Analytics only',
      essential:'Essential only',
      meta:'Vendors available after consent: Google Analytics 4, Microsoft Clarity, Meta Pixel, and LinkedIn Insight Tag.'
    },
    ru:{
      title:'Настройки конфиденциальности',
      body:'Необходимое хранение сохраняет язык, непрерывность формы и контекст атрибуции. Аналитика и ремаркетинг подключаются только после согласия.',
      all:'Принять все',
      analytics:'Только аналитика',
      essential:'Только необходимое',
      meta:'После согласия могут подключаться Google Analytics 4, Microsoft Clarity, Meta Pixel и LinkedIn Insight Tag.'
    },
    es:{
      title:'Configuración de privacidad',
      body:'El almacenamiento esencial conserva el idioma, la continuidad del formulario y el contexto de atribución. La analítica y el remarketing solo se cargan después del consentimiento.',
      all:'Aceptar todo',
      analytics:'Solo analítica',
      essential:'Solo lo esencial',
      meta:'Tras el consentimiento pueden cargarse Google Analytics 4, Microsoft Clarity, Meta Pixel y LinkedIn Insight Tag.'
    }
  };
  const copy=cookieCopy[preferredLangValue()] || cookieCopy.en;
  banner.innerHTML=`<strong>${copy.title}</strong>
    <p>${copy.body}</p>
    <div class="cookie-actions">
      <button class="cookie-btn primary" data-consent="all" type="button">${copy.all}</button>
      <button class="cookie-btn" data-consent="analytics" type="button">${copy.analytics}</button>
      <button class="cookie-btn secondary" data-consent="essential" type="button">${copy.essential}</button>
    </div>
    <div class="cookie-meta">${copy.meta}</div>`;
  document.body.appendChild(banner);
  document.body?.classList.add('vcx-consent-open');
  banner.querySelectorAll('[data-consent]').forEach(btn=>btn.addEventListener('click',()=>{
    const consent=normalizeConsentLevel(btn.dataset.consent);
    localStorage.setItem('vcx_cookie_consent', consent);
    banner.hidden=true;
    document.body?.classList.remove('vcx-consent-open');
    applyConsent(consent);
  }));
}
const VCX_TRACKING_DEFAULTS={
  ga4:'G-E08EE1KSQQ',
  clarity:'',
  metaPixel:'',
  linkedInPartner:'',
  linkedInConversions:{}
};
const VCX_TRACKING_STATE=window.__VCX_TRACKING_STATE || (window.__VCX_TRACKING_STATE={
  scripts:{},
  gaReady:false,
  clarityReady:false,
  metaReady:false,
  linkedinReady:false,
  pageViewSent:false
});
function normalizeConsentLevel(value){
  return ['essential','analytics','all'].includes(value) ? value : '';
}
function trackingIds(){
  const runtime=window.VCX_TRACKING_IDS || {};
  return {
    ga4:String(runtime.ga4 ?? VCX_TRACKING_DEFAULTS.ga4 ?? '').trim(),
    clarity:String(runtime.clarity ?? VCX_TRACKING_DEFAULTS.clarity ?? '').trim(),
    metaPixel:String(runtime.metaPixel ?? VCX_TRACKING_DEFAULTS.metaPixel ?? '').trim(),
    linkedInPartner:String(runtime.linkedInPartner ?? VCX_TRACKING_DEFAULTS.linkedInPartner ?? '').trim(),
    linkedInConversions:Object.assign({}, VCX_TRACKING_DEFAULTS.linkedInConversions || {}, runtime.linkedInConversions || {})
  };
}
function sanitizeAnalyticsValue(value){
  if(value == null) return '';
  if(typeof value==='number' || typeof value==='boolean') return value;
  if(Array.isArray(value)) return value.map(item=>sanitizeAnalyticsValue(item)).join(', ').slice(0,200);
  if(typeof value==='object') return JSON.stringify(value).slice(0,200);
  return String(value).replace(/\s+/g,' ').trim().slice(0,200);
}
function sanitizeAnalyticsPayload(payload){
  const clean={};
  Object.entries(payload || {}).forEach(([key, value])=>{
    const normalizedKey=String(key || '').replace(/[^a-zA-Z0-9_]/g,'_').replace(/^_+/,'').slice(0,40);
    if(!normalizedKey) return;
    const normalizedValue=sanitizeAnalyticsValue(value);
    if(normalizedValue === '') return;
    clean[normalizedKey]=normalizedValue;
  });
  return clean;
}
function trackingContext(){
  const attribution=getAttributionContext();
  return {
    page_name:currentPageKey(),
    page_path:window.location.pathname || '/',
    page_url:window.location.href,
    page_title:document.title,
    language:preferredLangValue(),
    audience:currentAudience(),
    session_id:getVisitorSessionId(),
    landing_page:attribution.landing_page || '',
    utm_source:attribution.utm_source || '',
    utm_medium:attribution.utm_medium || '',
    utm_campaign:attribution.utm_campaign || ''
  };
}
function loadScriptOnce(key, src, onload){
  if(!src) return;
  const existingState=VCX_TRACKING_STATE.scripts[key];
  if(existingState && existingState.loaded){
    if(onload) onload();
    return;
  }
  if(existingState){
    if(onload) existingState.callbacks.push(onload);
    return;
  }
  const callbacks=onload ? [onload] : [];
  VCX_TRACKING_STATE.scripts[key]={ loaded:false, callbacks };
  let script=document.querySelector(`script[data-vcx-script="${key}"]`);
  if(!script){
    script=document.createElement('script');
    script.src=src;
    script.async=true;
    script.dataset.vcxScript=key;
    document.head.appendChild(script);
  }
  script.addEventListener('load', ()=>{
    const state=VCX_TRACKING_STATE.scripts[key];
    if(!state || state.loaded) return;
    state.loaded=true;
    state.callbacks.splice(0).forEach(fn=>{
      try{
        fn();
      }catch(_error){
      }
    });
  }, { once:true });
}
function initGa4Tracker(id){
  if(!id || VCX_TRACKING_STATE.gaReady) return;
  window.dataLayer=window.dataLayer || [];
  window.gtag=window.gtag || function(){ window.dataLayer.push(arguments); };
  loadScriptOnce('ga4', 'https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(id));
  window.gtag('js', new Date());
  window.gtag('config', id, {
    anonymize_ip:true,
    send_page_view:false
  });
  VCX_TRACKING_STATE.gaReady=true;
}
function initClarityTracker(id){
  if(!id || VCX_TRACKING_STATE.clarityReady) return;
  window.clarity=window.clarity || function(){ (window.clarity.q=window.clarity.q || []).push(arguments); };
  loadScriptOnce('clarity', 'https://www.clarity.ms/tag/'+encodeURIComponent(id));
  VCX_TRACKING_STATE.clarityReady=true;
}
function initMetaPixel(id){
  if(!id || VCX_TRACKING_STATE.metaReady) return;
  window.fbq=window.fbq || function(){
    if(window.fbq.callMethod){
      window.fbq.callMethod.apply(window.fbq, arguments);
      return;
    }
    window.fbq.queue=window.fbq.queue || [];
    window.fbq.queue.push(arguments);
  };
  if(!window._fbq) window._fbq=window.fbq;
  window.fbq.push=window.fbq;
  window.fbq.loaded=true;
  window.fbq.version='2.0';
  window.fbq.queue=window.fbq.queue || [];
  loadScriptOnce('meta-pixel', 'https://connect.facebook.net/en_US/fbevents.js');
  window.fbq('init', id);
  window.fbq('track', 'PageView');
  VCX_TRACKING_STATE.metaReady=true;
}
function initLinkedInInsight(partnerId){
  if(!partnerId || VCX_TRACKING_STATE.linkedinReady) return;
  window._linkedin_data_partner_ids=window._linkedin_data_partner_ids || [];
  if(!window._linkedin_data_partner_ids.includes(partnerId)){
    window._linkedin_data_partner_ids.push(partnerId);
  }
  window.lintrk=window.lintrk || function(action, payload){
    window.lintrk.q=window.lintrk.q || [];
    window.lintrk.q.push([action, payload]);
  };
  loadScriptOnce('linkedin-insight', 'https://snap.licdn.com/li.lms-analytics/insight.min.js');
  VCX_TRACKING_STATE.linkedinReady=true;
}
function fireAnalyticsPageView(){
  if(VCX_TRACKING_STATE.pageViewSent) return;
  if(!VCX_TRACKING_STATE.gaReady && !VCX_TRACKING_STATE.clarityReady) return;
  const payload=sanitizeAnalyticsPayload(Object.assign({}, trackingContext(), {
    page_location:window.location.href
  }));
  if(window.gtag && VCX_TRACKING_STATE.gaReady){
    window.gtag('event', 'page_view', payload);
  }
  if(window.clarity && VCX_TRACKING_STATE.clarityReady){
    try{
      window.clarity('set', 'page_language', preferredLangValue());
    }catch(_error){
    }
  }
  VCX_TRACKING_STATE.pageViewSent=true;
}
function trackEvent(eventName, payload={}){
  const consent=normalizeConsentLevel(window.vcxConsent);
  if(!eventName || !consent || consent==='essential') return false;
  const eventPayload=sanitizeAnalyticsPayload(Object.assign({}, trackingContext(), payload));
  if(window.gtag && VCX_TRACKING_STATE.gaReady){
    window.gtag('event', eventName, eventPayload);
  }
  if(window.clarity && VCX_TRACKING_STATE.clarityReady){
    try{
      window.clarity('event', eventName);
    }catch(_error){
    }
  }
  if(consent==='all'){
    if(window.fbq && VCX_TRACKING_STATE.metaReady){
      window.fbq('trackCustom', eventName, eventPayload);
    }
    const conversionId=trackingIds().linkedInConversions[eventName];
    if(window.lintrk && VCX_TRACKING_STATE.linkedinReady && conversionId){
      try{
        window.lintrk('track', { conversion_id:conversionId });
      }catch(_error){
      }
    }
  }
  return true;
}
window.trackEvent=trackEvent;
function applyConsent(consent){
  const normalized=normalizeConsentLevel(consent) || 'essential';
  const ids=trackingIds();
  window.vcxConsent=normalized;
  document.body?.setAttribute('data-vcx-consent', normalized);
  document.body?.classList.remove('vcx-consent-open');
  if(normalized==='analytics' || normalized==='all'){
    initGa4Tracker(ids.ga4);
    initClarityTracker(ids.clarity);
  }
  if(normalized==='all'){
    initMetaPixel(ids.metaPixel);
    initLinkedInInsight(ids.linkedInPartner);
  }
  fireAnalyticsPageView();
}
function elementTrackingLabel(target){
  return String(target.getAttribute('aria-label') || target.textContent || '').replace(/\s+/g,' ').trim().slice(0,120);
}
function clickSurface(target){
  const scope=target.closest('section, header, footer, .vcx-dock, .modal, .hero, .vcx-home-hero');
  if(!scope) return 'page';
  if(scope.id) return scope.id.slice(0,60);
  const firstClass=[...scope.classList].find(Boolean);
  return firstClass || scope.tagName.toLowerCase();
}
function bindTracking(){
  if(document.documentElement.dataset.vcxTrackingBound==='1') return;
  document.documentElement.dataset.vcxTrackingBound='1';

  document.addEventListener('click', event=>{
    const target=event.target instanceof Element ? event.target.closest('a,button') : null;
    if(!target) return;
    const href=String(target.getAttribute('href') || '').trim();
    const label=elementTrackingLabel(target);
    const surface=clickSurface(target);

    if(target.matches('[data-gated-asset]')){
      trackEvent('executive_brief_unlock_open', {
        surface:surface,
        label:label,
        asset_requested:target.dataset.gatedAsset || href,
        asset_label:target.dataset.gatedLabel || label
      });
      return;
    }

    if(target.matches('.vcx-home-hero .btn-primary[href*="contact.html?audience=company"]')){
      trackEvent('hero_primary_cta_click', {
        surface:'home_hero',
        label:label,
        href:href
      });
    }

    if(target.matches('a[href*="contact.html?audience=company"]')){
      trackEvent('confidential_review_click', {
        surface:surface,
        label:label,
        href:href
      });
    }

    if(target.matches('.vcx-director-link')){
      trackEvent('contact_director_click', {
        surface:surface,
        label:label,
        href:href
      });
      return;
    }

    if(target.matches('a[href^="tel:"]')){
      trackEvent('phone_click', {
        surface:surface,
        label:label,
        phone_number:href.replace(/^tel:/i,'')
      });
      return;
    }

    if(target.matches('a[href^="mailto:"]:not(.vcx-director-link)')){
      trackEvent('email_click', {
        surface:surface,
        label:label,
        email_address:href.replace(/^mailto:/i,'').split('?')[0]
      });
      return;
    }

    if(/calendly\.com/i.test(href)){
      trackEvent('strategy_call_click', {
        surface:surface,
        label:label,
        href:href
      });
      return;
    }

    if(target.matches('a[href$=".pdf"], a[href*=".pdf?"]')){
      trackEvent('pdf_download', {
        surface:surface,
        label:label,
        asset_name:href.split('/').pop() || href,
        asset_url:new URL(href, window.location.href).href,
        access_type:'direct'
      });
    }
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
        trackEvent(map[id] || 'calculator_use', { calculator_id:id });
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
  if(window.Chart){
    draw();
    return;
  }
  let script=document.querySelector('script[data-vcx-chartjs="1"]');
  if(script){
    script.addEventListener('load', draw, {once:true});
    return;
  }
  script=document.createElement('script');
  script.src='https://cdn.jsdelivr.net/npm/chart.js';
  script.async=true;
  script.dataset.vcxChartjs='1';
  script.addEventListener('load', draw, {once:true});
  document.head.appendChild(script);
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
    const explicit = new URLSearchParams(window.location.search).get('lang');
    if(['en','ru','es'].includes(explicit)) return explicit;
    const saved = localStorage.getItem('vcx_lang');
    if(['en','ru','es'].includes(saved)) return saved;
    const rootLang = document.documentElement.getAttribute('lang');
    return ['en','ru','es'].includes(rootLang) ? rootLang : 'en';
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
          ['Executive utility','Decision-grade tools','Present the engagement like a controlled operating platform rather than a generic services page.'],
          ['Lead quality','Self-qualification before consultation','Better inputs, stronger calls, fewer weak inquiries.'],
          ['Trust','Metrics-led credibility','Clear economics and operating indicators support confident decision-making.']
        ],
        kpis:['Net recovery improvement','Agency fee avoidance','Pilot validation window'],
        module:['Corporate advisory structure','Built for operators who require structured execution before legal and recovery costs escalate.','Request strategic review','Review service lines']
      }
    },
    ru: {
      marketFallback: 'Рыночный блок временно недоступен. Возврат выручки остаётся одним из самых управляемых драйверов кэша для сетевых операторов.',
      widgets: {
        eyebrow: 'Инструменты для руководства',
        title: 'Интерактивные инструменты, которые делают предложение понятным, убедительным и удобным для оценки.',
        intro: 'Эти блоки помогают операторам, CFO и руководителям быстро оценить масштаб утечек, влияние на оборотный капитал и экономику пилота до отправки запроса.',
        cards: [
          { pill:'CFO', title:'Калькулятор потери выручки', labels:['Годовая выручка','Доля ответственности пациента / клиента %','Процент потери возврата %'], metrics:['Оценка скрытого кэша','Использование для руководства'] },
          { pill:'Скорость кэша', title:'Симулятор влияния на DSO', labels:['Годовая выручка','Текущий DSO','Целевой DSO'], metrics:['Высвобождение оборотного капитала','Снижение DSO'] },
          { pill:'ROI пилота', title:'Экономика 90-дневного пилота', labels:['Дебиторский портфель в охвате','Ожидаемое улучшение %','Стоимость пилота'], metrics:['Дополнительный кэш','Коэффициент ROI'] }
        ],
        benefits: [
          ['Практическая ценность','Инструменты для решений руководства','Подают предложение как управляемую операционную платформу, а не как обычный сервисный сайт.'],
          ['Качество лидов','Самоквалификация до консультации','Лучше вводные данные, сильнее звонки, меньше слабых заявок.'],
          ['Доверие','Доверие через измеримые показатели','Ясная экономика и операционные показатели помогают уверенному решению.']
        ],
        kpis:['Цель по чистому возврату','Снижение агентских комиссий','Окно подтверждения пилота'],
        module:['Корпоративная консультационная структура','Для операторов, которым нужно навести порядок до роста внешних расходов.','Запросить операционный разбор','Открыть материалы для руководства']
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
          { pill:'ROI piloto', title:'Economía del piloto de 90 días', labels:['Cartera por cobrar en alcance','Mejora esperada %','Costo del piloto'], metrics:['Caja adicional','Múltiplo de ROI'] }
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
    const explicit = new URLSearchParams(window.location.search).get('lang');
    if(['en','ru','es'].includes(explicit)) return explicit;
    const saved = localStorage.getItem('vcx_lang');
    if(['en','ru','es'].includes(saved)) return saved;
    const rootLang = document.documentElement.getAttribute('lang');
    return ['en','ru','es'].includes(rootLang) ? rootLang : 'en';
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
      calc_metric_3:'Modeled recovery lift range',
      case_pill:'Representative operating scenario',
      case_title:'How an institutional advisory engagement is framed',
      case_stat_1:'Annual revenue operator',
      case_stat_2:'Receivable portfolio',
      case_stat_3:'Modeled DSO improvement range',
      case_1:'Recovery improvement target aligned to pilot economics and workflow discipline.',
      case_2:'Agency placements reduced through earlier structured conversion and better file control.',
      case_3:'External counsel receives cleaner, more usable documentation when escalation is warranted.',
      case_cta:'Review your operating model'
    },
    ru:{
      eyebrow:'Институциональный уровень',
      title:'Консультационная инфраструктура для возврата выручки, контроля юридического досье и дисциплинированного исполнения.',
      intro:'Секция для сложных операторов, которым нужны более сильная документация, более чистые пути эскалации и более убедительная операционная модель до роста внешних юридических и агентских расходов.',
      profiles_pill:'Профили операторов',
      profiles_title:'Где работает VitaCoreX',
      profiles_intro:'Мы поддерживаем организации, управляющие сложными контрактными потоками в разных операционных средах.',
      profile_1:'Операторы здравоохранения',
      profile_2:'Программы автопарков и топливных карт',
      profile_3:'Подписочные платформы',
      profile_4:'Сетевые сервисные компании',
      profile_5:'Коммерческие портфели на договорной основе',
      governance_pill:'Управление',
      governance_title:'Контроль документации для финансов, комплаенса и внешнего юриста',
      governance_intro:'VitaCoreX структурирует файлы, платёжную документацию и записи по эскалации так, чтобы юридическая стратегия не тратилась на административное наведение порядка.',
      gov_1:'Аудируемая структура файлов и упаковка доказательств',
      gov_2:'Контроль документации и авторизаций по планам оплат',
      gov_3:'Подготовка уровня паралигалов в рамках консультационного мандата',
      gov_4:'Более чистая передача внешнему юристу, когда эскалация действительно нужна',
      calc_pill:'Управленческий эффект',
      calc_title:'Оцените потенциальный эффект для возврата выручки',
      calc_label_1:'Годовая выручка',
      calc_label_2:'Портфель дебиторской задолженности в охвате',
      calc_label_3:'Текущий уровень возврата %',
      calc_metric_1:'Потенциальный дополнительный кэш',
      calc_metric_2:'Оценка избежанных комиссий успеха',
      calc_metric_3:'Иллюстративный прирост возврата',
      case_pill:'Иллюстративный кейс оператора',
      case_title:'Как выглядит институциональный консультационный мандат',
      case_stat_1:'Оператор с годовой выручкой',
      case_stat_2:'Портфель дебиторки',
      case_stat_3:'Иллюстративное улучшение DSO',
      case_1:'Цель по возврату привязана к экономике пилота и дисциплине процесса.',
      case_2:'Передача в агентство снижается за счёт более ранней структурированной конверсии и лучшего контроля досье.',
      case_3:'Внешний юрист получает более чистую и пригодную документацию, когда эскалация действительно нужна.',
      case_cta:'Разобрать вашу операционную модель'
    },
    es:{
      eyebrow:'Autoridad institucional',
      title:'Infraestructura de asesoría para recuperación de ingresos, control del expediente legal y ejecución disciplinada.',
      intro:'Diseñado para operadores complejos que necesitan documentación más sólida, rutas de escalamiento más limpias y un modelo operativo más creíble antes de que aumenten los costos legales y de agencias.',
      profiles_pill:'Perfiles de operador',
      profiles_title:'Dónde opera VitaCoreX',
      profiles_intro:'Apoyamos a organizaciones que gestionan complejidad contractual en múltiples entornos operativos.',
      profile_1:'Operadores de salud',
      profile_2:'Programas de flotas y tarjetas de combustible',
      profile_3:'Plataformas de suscripción',
      profile_4:'Redes de servicios multi-sede',
      profile_5:'Portafolios comerciales basados en contratos',
      governance_pill:'Gobernanza',
      governance_title:'Control documental que respalda finanzas, cumplimiento y asesoría externa',
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
    let status = tr('readiness_foundational');
    if(rounded >= 80) status = tr('readiness_ready');
    else if(rounded >= 65) status = tr('readiness_improvable');
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
        box.innerHTML='<strong>Directional impact view</strong><p>Based on the inputs provided, a structured recovery layer could directionally improve retained cash by <b>'+money(additional)+'</b>, reduce approximately <b>'+money(avoided)+'</b> in contingency leakage, and support a potential <b>'+dsoGain+'-day</b> improvement in cash velocity. Use a pilot to test actual portfolio performance.</p>';
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
        box.innerHTML='<strong>'+tr('corporate_result_label')+'</strong><p>'+formatTemplate(tr('legal_result_template'), {
          exposure: money(exposure),
          hours: Math.round(totalHours).toLocaleString() + ' hrs'
        })+'</p>';
      }
    });
  }
})();
