/* ============================================================
   VCX CENTRALIZED TRANSLATION CATALOG
   Single source of truth for EN / RU / ES
   Usage: window.VCX_I18N[lang][key]
   ============================================================ */
;(function(w){
'use strict';

/* ─── GLOSSARY (canonical terms) ──────────────────────────────
   These must be used consistently across all pages.
   Do not use different translations of the same concept.
   ──────────────────────────────────────────────────────────── */
w.VCX_GLOSSARY = {
  en: {
    'Revenue Recovery Infrastructure':    'Revenue Recovery Infrastructure',
    'Corporate Legal File Control':        'Corporate Legal File Control',
    'Structured Case Intake':              'Structured Case Intake',
    'Private Consultation':                'Private Consultation',
    'Private Client Services':             'Private Client Services',
    'Selected Individual Support':         'Selected Individual Support',
    'Advisor review':                      'Advisor review',
    'Manual review':                       'Manual review',
    'Structured pre-check':                'Structured pre-check',
    'Recovery leakage':                    'Recovery leakage',
    'File readiness':                      'File readiness',
    'Handoff quality':                     'Handoff quality',
    'Executive consulting':                'Executive consulting',
    'Intake':                              'Intake',
  },
  ru: {
    'Revenue Recovery Infrastructure':    'Инфраструктура возврата выручки',
    'Corporate Legal File Control':        'Контроль корпоративного юридического документооборота',
    'Structured Case Intake':              'Структурированный первичный разбор',
    'Private Consultation':                'Конфиденциальная консультация',
    'Private Client Services':             'Услуги для частных клиентов',
    'Selected Individual Support':         'Избранная поддержка физлиц',
    'Advisor review':                      'Проверка советником',
    'Manual review':                       'Ручная проверка',
    'Structured pre-check':                'Структурированная предварительная проверка',
    'Recovery leakage':                    'Утечка recovery-маржи',
    'File readiness':                      'Готовность файла',
    'Handoff quality':                     'Качество передачи',
    'Executive consulting':                'Руководящий консалтинг',
    'Intake':                              'Первичный приём',
  },
  es: {
    'Revenue Recovery Infrastructure':    'Infraestructura de recuperación de ingresos',
    'Corporate Legal File Control':        'Control de expediente legal corporativo',
    'Structured Case Intake':              'Admisión estructurada de casos',
    'Private Consultation':                'Consulta privada',
    'Private Client Services':             'Servicios para clientes privados',
    'Selected Individual Support':         'Apoyo individual seleccionado',
    'Advisor review':                      'Revisión por asesor',
    'Manual review':                       'Revisión manual',
    'Structured pre-check':                'Verificación preliminar estructurada',
    'Recovery leakage':                    'Fuga de recuperación',
    'File readiness':                      'Preparación del expediente',
    'Handoff quality':                     'Calidad de traspaso',
    'Executive consulting':                'Consultoría ejecutiva',
    'Intake':                              'Admisión',
  }
};

/* ─── COMMON STRINGS (shared across pages) ────────────────── */
w.VCX_I18N = {
  en: {
    // Brand
    brand_name:     'VitaCoreX LLC',
    brand_tag:      'Revenue recovery and documentation infrastructure',
    brand_city:     'Tampa, Florida, U.S.',

    // Navigation
    nav_home:       'Home',
    nav_file:       'Corporate Legal File Control',
    nav_recovery:   'Revenue Recovery Infrastructure',
    nav_intake:     'Structured Case Intake',
    nav_resources:  'Executive Briefs & Proof',
    nav_services:   'Private Client Services',
    nav_careers:    'Careers',
    nav_contact:    'Private Consultation',

    // Clock
    clock_vcx:      'VitaCoreX Time',
    clock_local:    'Your Time',
    clock_local_sub:'Local',

    // Footer
    footer_est:     'Established 2025',
    footer_ein:     'EIN: 41-4399148',
    footer_phone:   'Private consultation line: (888) 794-8292',
    footer_disc:    'VitaCoreX LLC is a Florida-registered company providing remote administrative, workflow, documentation, and file-control support across the United States where permitted by applicable law. VitaCoreX is not a law firm, does not provide legal advice, is not a licensed collection agency, does not collect debts, and does not represent clients in court or before government agencies. State-specific court, collection, privacy, immigration, and unauthorized-practice-of-law rules are confirmed before engagement.',
    footer_forms:   'Public forms are designed for general business documents and non-regulated materials. For highly sensitive or regulated records, request secure coordination first.',
    footer_trust_line: 'Florida-registered LLC \u00b7 U.S.-wide remote support where permitted \u00b7 Not a law firm \u00b7 Not a collection agency \u00b7 No legal advice \u00b7 No debt collection \u00b7 Scope confirmed at intake',
    footer_copy:    '© 2025 VitaCoreX LLC. All rights reserved.',
    footer_col1:    'COMPANY & SOLUTIONS',
    footer_col2:    'REVIEW, PRIVACY & CONTACT',

    // CTA
    cta_consult:    'Request confidential review',
    cta_intake:     'Open structured intake',
    cta_book:       'Book consultation',
    cta_back:       '← Private Client Services',

    // Tool — contract scanner
    tool_ci_eyebrow:  'Private Client Tool',
    tool_ci_title:    'Contract Scanner',
    tool_ci_subtitle: 'Upload a contract or agreement. Get a pattern-based pre-check of key clauses — payment terms, renewal, termination, liability, IP ownership, and more.',
    tool_ci_upload:   'Upload your contract',
    tool_ci_hint:     'PDF, Word, or text file. Best results with .txt or text-based PDFs.',
    tool_ci_btn:      'Choose file',
    tool_ci_scan:     'Analyze contract',
    tool_ci_scanning: 'Analyzing…',
    tool_ci_reset:    'Analyze another',
    tool_ci_disc:     'Pattern-based detection only — not legal advice. Review all findings with licensed counsel before signing.',

    // Tool — immigration
    tool_imm_eyebrow:  'Private Client Tool',
    tool_imm_title:    'Immigration Packet Helper',
    tool_imm_subtitle: 'Upload your immigration form or packet. Get a pattern-based pre-check for form type identification and completeness indicators.',
    tool_imm_upload:   'Upload your form or packet',
    tool_imm_hint:     'Text-based PDF, Word, or .txt. Form type detected automatically where possible.',
    tool_imm_btn:      'Choose file',
    tool_imm_scan:     'Analyze packet',
    tool_imm_scanning: 'Analyzing…',
    tool_imm_reset:    'Analyze another',
    tool_imm_disc:     'Pattern-based pre-check only — not legal advice. USCIS requirements vary by case. Consult qualified immigration counsel before filing.',

    // Tool — dealer
    tool_dealer_eyebrow:  'Private Client Tool',
    tool_dealer_title:    'Auto Deal Check',
    tool_dealer_subtitle: 'Enter your deal numbers to check fees, add-on pricing, and financing terms against typical ranges.',
    tool_dealer_scan:     'Check deal numbers',
    tool_dealer_reset:    'Check another deal',
    tool_dealer_disc:     'Client-side calculation based on numbers you entered. Not legal or financial advice. Confirm all figures with the dealer in writing.',

    // Florida Lookup
    tool_fl_eyebrow:  'Private Client Services',
    tool_fl_title:    'Private Obligation Lookup',
    tool_fl_subtitle: 'Check Florida toll obligations, traffic citations, and public court records. Results link to official government sources.',
    gate_label:       'Private Session Access',
    gate_free:        'Free',
    gate_note:        'No charge. Government payments go to official portals only.',
    gate_btn:         'Start Private Lookup',
    session_active:   'Private session active',
    session_remaining:'lookups remaining',
    tab_tolls:        'Unpaid Tolls',
    tab_traffic:      'Traffic / Fines',
    tab_courts:       'Court Cases',

    // Legal notices
    not_a_law_firm:   'VitaCoreX LLC is not a law firm and does not provide legal advice or legal representation. All services are administrative and documentation support. Consult qualified legal counsel for legal strategy and advice.',
    not_financial:    'This tool provides illustrative calculations only. Not financial advice. Verify all figures with qualified professionals.',
  },

  ru: {
    brand_name:     'VitaCoreX LLC',
    brand_tag:      'Инфраструктура возврата выручки и контроля документации',
    brand_city:     'Тампа, Флорида, США',

    nav_home:       'Главная',
    nav_file:       'Контроль юридического документооборота',
    nav_recovery:   'Инфраструктура возврата выручки',
    nav_intake:     'Структурированный первичный разбор',
    nav_resources:  'Материалы для руководства',
    nav_services:   'Услуги для частных клиентов',
    nav_careers:    'Сотрудничество',
    nav_contact:    'Конфиденциальная консультация',

    clock_vcx:      'Время VitaCoreX',
    clock_local:    'Ваше время',
    clock_local_sub:'Локально',

    footer_est:     'Работает с 2025 года',
    footer_ein:     'EIN: 41-4399148',
    footer_phone:   'Частная линия: (888) 794-8292',
    footer_disc:    'VitaCoreX LLC — компания, зарегистрированная во Флориде, оказывающая удалённую административную, операционную, документарную поддержку и услуги по контролю досье на территории США там, где это разрешено применимым законодательством. VitaCoreX не является юридической фирмой, не даёт юридических советов, не является лицензированным коллекторским агентством, не взыскивает долги и не представляет клиентов в суде или перед государственными органами. Правила конкретного штата по судам, взысканию, конфиденциальности, иммиграции и неавторизованной юридической практике подтверждаются до начала работы.',
    footer_forms:   'Публичные формы предназначены для общих деловых документов и нерегулируемых материалов. Для особо чувствительных или регулируемых данных сначала запросите защищённую координацию.',
    footer_trust_line: 'LLC, зарегистрированная во Флориде \u00b7 Удалённая поддержка по США там, где разрешено \u00b7 Не юридическая фирма \u00b7 Не коллекторское агентство \u00b7 Без юридических советов \u00b7 Без взыскания долгов \u00b7 Объём подтверждается на приёме',
    footer_copy:    '© 2025 VitaCoreX LLC. Все права защищены.',
    footer_col1:    'КОМПАНИЯ И РЕШЕНИЯ',
    footer_col2:    'РАЗБОР, КОНФИДЕНЦИАЛЬНОСТЬ И КОНТАКТЫ',

    cta_consult:    'Запросить конфиденциальный разбор',
    cta_intake:     'Открыть первичный приём',
    cta_book:       'Записаться на консультацию',
    cta_back:       '← Услуги для частных клиентов',

    tool_ci_eyebrow:  'Инструмент для частных клиентов',
    tool_ci_title:    'Сканер договора',
    tool_ci_subtitle: 'Загрузите договор или соглашение. Получите предварительную проверку ключевых пунктов: условия оплаты, автопродление, ответственность, ИС и другие.',
    tool_ci_upload:   'Загрузить договор',
    tool_ci_hint:     'PDF, Word или текстовый файл. Лучший результат — с .txt или текстовыми PDF.',
    tool_ci_btn:      'Выбрать файл',
    tool_ci_scan:     'Анализировать договор',
    tool_ci_scanning: 'Анализ…',
    tool_ci_reset:    'Анализировать другой',
    tool_ci_disc:     'Только поиск по шаблонам — не юридическая консультация. Проверьте все результаты с лицензированным адвокатом перед подписанием.',

    tool_imm_eyebrow:  'Инструмент для частных клиентов',
    tool_imm_title:    'Помощник по иммиграционным документам',
    tool_imm_subtitle: 'Загрузите иммиграционную форму или пакет. Получите предварительную проверку типа формы и полноты документа.',
    tool_imm_upload:   'Загрузить форму или пакет',
    tool_imm_hint:     'Текстовый PDF, Word или .txt.',
    tool_imm_btn:      'Выбрать файл',
    tool_imm_scan:     'Проверить пакет',
    tool_imm_scanning: 'Проверка…',
    tool_imm_reset:    'Проверить другой',
    tool_imm_disc:     'Только предварительная проверка — не юридическая консультация. Требования USCIS варьируются. Проконсультируйтесь с иммиграционным адвокатом.',

    tool_dealer_eyebrow:  'Инструмент для частных клиентов',
    tool_dealer_title:    'Проверка автосделки',
    tool_dealer_subtitle: 'Введите цифры вашей сделки для проверки сборов, надбавок и условий финансирования.',
    tool_dealer_scan:     'Проверить цифры сделки',
    tool_dealer_reset:    'Проверить другую сделку',
    tool_dealer_disc:     'Расчёт на основе введённых данных. Не является финансовой или юридической консультацией.',

    tool_fl_eyebrow:  'Услуги для частных клиентов',
    tool_fl_title:    'Поиск частных обязательств',
    tool_fl_subtitle: 'Проверьте дорожные сборы, штрафы и судебные записи Флориды. Результаты ведут к официальным государственным источникам.',
    gate_label:       'Доступ к частной сессии',
    gate_free:        'Бесплатно',
    gate_note:        'Без оплаты. Государственные платежи направляются на официальные порталы.',
    gate_btn:         'Начать поиск',
    session_active:   'Частная сессия активна',
    session_remaining:'запросов осталось',
    tab_tolls:        'Неоплаченные сборы',
    tab_traffic:      'Штрафы / Нарушения',
    tab_courts:       'Судебные дела',

    not_a_law_firm:   'VitaCoreX LLC не является юридической фирмой и не оказывает юридическую консультацию или представительство. Все услуги носят административный и документарный характер. Обратитесь к квалифицированному адвокату за юридической стратегией и советом.',
    not_financial:    'Данный инструмент предоставляет только иллюстративные расчёты. Не является финансовой консультацией.',
  },

  es: {
    brand_name:     'VitaCoreX LLC',
    brand_tag:      'Infraestructura de recuperación de ingresos y control de documentación',
    brand_city:     'Tampa, Florida, EE.UU.',

    nav_home:       'Inicio',
    nav_file:       'Control de expediente legal corporativo',
    nav_recovery:   'Infraestructura de recuperación de ingresos',
    nav_intake:     'Admisión estructurada de casos',
    nav_resources:  'Informes ejecutivos y pruebas',
    nav_services:   'Servicios para clientes privados',
    nav_careers:    'Carreras',
    nav_contact:    'Consulta privada',

    clock_vcx:      'Hora VitaCoreX',
    clock_local:    'Tu hora',
    clock_local_sub:'Local',

    footer_est:     'Establecida en 2025',
    footer_ein:     'EIN: 41-4399148',
    footer_phone:   'Línea privada: (888) 794-8292',
    footer_disc:    'VitaCoreX LLC es una empresa registrada en Florida que ofrece soporte remoto administrativo, de flujo de trabajo, documental y de control de expedientes en todo Estados Unidos donde lo permita la ley aplicable. VitaCoreX no es un bufete de abogados, no brinda asesoramiento legal, no es una agencia de cobro con licencia, no cobra deudas y no representa a clientes ante tribunales ni agencias gubernamentales. Las reglas específicas de cada estado sobre tribunales, cobro, privacidad, inmigración y práctica no autorizada del derecho se confirman antes de iniciar la colaboración.',
    footer_forms:   'Los formularios públicos están diseñados para documentos comerciales generales y materiales no regulados. Para registros altamente sensibles o regulados, solicite coordinación segura primero.',
    footer_trust_line: 'LLC registrada en Florida \u00b7 Soporte remoto en EE. UU. donde esté permitido \u00b7 No es bufete de abogados \u00b7 No es agencia de cobros \u00b7 Sin asesoramiento legal \u00b7 Sin cobro de deudas \u00b7 Alcance confirmado en la admisión',
    footer_copy:    '© 2025 VitaCoreX LLC. Todos los derechos reservados.',
    footer_col1:    'EMPRESA Y SOLUCIONES',
    footer_col2:    'REVISIÓN, PRIVACIDAD Y CONTACTO',

    cta_consult:    'Solicitar revisión confidencial',
    cta_intake:     'Abrir admisión estructurada',
    cta_book:       'Reservar consulta',
    cta_back:       '← Servicios para clientes privados',

    tool_ci_eyebrow:  'Herramienta para clientes privados',
    tool_ci_title:    'Escáner de contratos',
    tool_ci_subtitle: 'Cargue un contrato o acuerdo. Obtenga una verificación previa de cláusulas clave: términos de pago, renovación, responsabilidad, propiedad intelectual y más.',
    tool_ci_upload:   'Cargar su contrato',
    tool_ci_hint:     'PDF, Word o archivo de texto. Mejores resultados con .txt o PDFs basados en texto.',
    tool_ci_btn:      'Elegir archivo',
    tool_ci_scan:     'Analizar contrato',
    tool_ci_scanning: 'Analizando…',
    tool_ci_reset:    'Analizar otro',
    tool_ci_disc:     'Solo detección de patrones — no es asesoramiento legal. Revise todos los hallazgos con un abogado autorizado antes de firmar.',

    tool_imm_eyebrow:  'Herramienta para clientes privados',
    tool_imm_title:    'Ayudante de documentos de inmigración',
    tool_imm_subtitle: 'Cargue su formulario de inmigración o paquete. Obtenga una verificación previa del tipo de formulario e indicadores de completitud.',
    tool_imm_upload:   'Cargar formulario o paquete',
    tool_imm_hint:     'PDF basado en texto, Word o .txt.',
    tool_imm_btn:      'Elegir archivo',
    tool_imm_scan:     'Verificar paquete',
    tool_imm_scanning: 'Verificando…',
    tool_imm_reset:    'Verificar otro',
    tool_imm_disc:     'Solo verificación previa de patrones — no es asesoramiento legal. Los requisitos de USCIS varían. Consulte con un abogado de inmigración calificado antes de presentar.',

    tool_dealer_eyebrow:  'Herramienta para clientes privados',
    tool_dealer_title:    'Verificación de trato automotriz',
    tool_dealer_subtitle: 'Ingrese los números de su trato para verificar tarifas, cargos adicionales y términos de financiamiento.',
    tool_dealer_scan:     'Verificar números del trato',
    tool_dealer_reset:    'Verificar otro trato',
    tool_dealer_disc:     'Cálculo basado en los números ingresados. No es asesoramiento legal ni financiero.',

    tool_fl_eyebrow:  'Servicios para clientes privados',
    tool_fl_title:    'Búsqueda de obligaciones privadas',
    tool_fl_subtitle: 'Consulte peajes, multas de tráfico y registros judiciales de Florida. Los resultados enlazan a fuentes gubernamentales oficiales.',
    gate_label:       'Acceso a sesión privada',
    gate_free:        'Gratis',
    gate_note:        'Sin cargo. Los pagos gubernamentales se dirigen a portales oficiales.',
    gate_btn:         'Iniciar búsqueda',
    session_active:   'Sesión privada activa',
    session_remaining:'consultas restantes',
    tab_tolls:        'Peajes impagados',
    tab_traffic:      'Multas de tráfico',
    tab_courts:       'Casos judiciales',

    not_a_law_firm:   'VitaCoreX LLC no es un bufete de abogados y no proporciona asesoramiento legal ni representación. Todos los servicios son de apoyo administrativo y de documentación. Consulte con abogado calificado para estrategia y asesoramiento legal.',
    not_financial:    'Esta herramienta proporciona solo cálculos ilustrativos. No es asesoramiento financiero.',
  }
};

/* ─── vcxCurrentLang — respects localStorage preference ──── */
w.vcxCurrentLang = function() {
  try {
    var s = localStorage.getItem('vcx_lang');
    if (s && (s === 'en' || s === 'ru' || s === 'es')) return s;
  } catch(e) {}
  return 'en';
};

/* ─── t() — translation lookup helper ───────────────────────
   Usage: t('key') or t('key', 'fallback')
   ──────────────────────────────────────────────────────────── */
w.vcxT = function(key, fallback) {
  var lang = w.vcxCurrentLang();
  var d = w.VCX_I18N;
  if(d && d[lang] && d[lang][key] !== undefined) return d[lang][key];
  if(d && d.en && d.en[key] !== undefined) return d.en[key];
  return fallback !== undefined ? fallback : key;
};

/* ─── setLang — apply language to entire page ────────────────
   Call this on lang button click and on DOMContentLoaded
   ──────────────────────────────────────────────────────────── */
w.vcxSetLang = function(lang) {
  var supported = ['en', 'ru', 'es'];
  if (supported.indexOf(lang) === -1) lang = 'en';
  try { localStorage.setItem('vcx_lang', lang); } catch(e) {}
  document.documentElement.lang = lang;
  document.documentElement.setAttribute('lang', lang);

  // Update all data-common attributes (SITE_I18N system)
  var d = (w.SITE_I18N && w.SITE_I18N[lang]) || {};
  document.querySelectorAll('[data-common]').forEach(function(el) {
    var k = el.getAttribute('data-common');
    if(d[k] !== undefined) el.textContent = d[k];
    else if(w.VCX_I18N && w.VCX_I18N[lang] && w.VCX_I18N[lang][k] !== undefined) el.textContent = w.VCX_I18N[lang][k];
  });

  // Update all data-tx attributes
  document.querySelectorAll('[data-tx]').forEach(function(el) {
    var k = el.getAttribute('data-tx');
    if(d[k] !== undefined) el.textContent = d[k];
    else if(w.VCX_I18N && w.VCX_I18N[lang] && w.VCX_I18N[lang][k] !== undefined) el.textContent = w.VCX_I18N[lang][k];
  });

  // Update placeholders
  document.querySelectorAll('[data-placeholder]').forEach(function(el) {
    var k = el.getAttribute('data-placeholder');
    var v = (w.VCX_I18N && w.VCX_I18N[lang] && w.VCX_I18N[lang][k]);
    if(v) el.placeholder = v;
  });

  // Update lang button active state
  document.querySelectorAll('.lang-btn, [data-lang]').forEach(function(btn) {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    btn.setAttribute('aria-pressed', btn.getAttribute('data-lang') === lang ? 'true' : 'false');
  });

  // Dispatch event for page-specific handlers
  document.dispatchEvent(new CustomEvent('vcx:lang-change', {detail:{lang:lang}}));
};

/* ─── Init on DOMContentLoaded ───────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  // Apply saved language preference (or default 'en')
  var lang = w.vcxCurrentLang ? w.vcxCurrentLang() : 'en';
  w.vcxSetLang(lang);

  // Wire lang buttons (EN / RU / ES) on all pages
  document.querySelectorAll('.lang-btn, [data-lang]').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      var l = btn.getAttribute('data-lang');
      if (l) w.vcxSetLang(l);
    });
  });
});

})(window);
