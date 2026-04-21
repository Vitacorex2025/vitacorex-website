
/* ── Global pinch-zoom prevention (iOS Safari) ────────────────── */
document.addEventListener('touchmove', function(e) {
  if (e.touches && e.touches.length > 1) e.preventDefault();
}, { passive: false });
document.addEventListener('gesturestart', function(e) { e.preventDefault(); }, { passive: false });
document.addEventListener('gesturechange', function(e) { e.preventDefault(); }, { passive: false });

(function(){
  const shell = {
    en: {
      brand_tag: 'Revenue recovery, documentation control, and client workspaces.',
      home: 'Home',
      file: 'Corporate Legal File Control',
      recovery: 'Revenue Recovery Infrastructure',
      intake: 'Structured Case Intake',
      resources: 'Executive Briefs & Proof',
      additional: 'Private Client Services',
      careers: 'Careers',
      contact: 'Private Consultation',
      clock_vcx: 'VitaCoreX Time',
      clock_local: 'Your Time',
      clock_local_sub: 'Local',
      cta_intake: 'Request a confidential review',
      cta_briefs: 'Review executive briefs',
      cta_workflow: 'View workflow',
      cta_deliverables: 'View deliverables',
      cta_contact: 'Contact the director',
      cta_apply: 'Apply by email',
      cta_email: 'Email instead',
      order_services: 'Request service',
      footer_est: 'Established 2025',
      footer_ein: 'EIN: 41-4399148',
      footer_phone: 'Phone (call/text): (888) 794-8292',
      footer_disc: 'VitaCoreX LLC is a Florida-registered company providing remote administrative, workflow, documentation, and file-control support across the United States where permitted by applicable law. VitaCoreX is not a law firm, does not provide legal advice, is not a licensed collection agency, does not collect debts, and does not represent clients in court or before government agencies. State-specific court, collection, privacy, immigration, and unauthorized-practice-of-law rules are confirmed before engagement.',
      footer_trust_line: 'Florida-registered LLC \u00b7 U.S.-wide remote support where permitted \u00b7 Not a law firm \u00b7 Not a collection agency \u00b7 No legal advice \u00b7 No debt collection \u00b7 Scope confirmed at intake',
      footer_copy: '© 2025 VitaCoreX LLC. All rights reserved.',
      metric_bar_full: 'Structured Intake \u2022 Recovery Systems \u2022 Legal File Control',
      metric_bar_short: 'Structured Intake \u2022 File Control'
    },
    ru: {
      brand_tag: 'Возврат выручки, контроль документации и клиентские рабочие пространства.',
      home: 'Главная',
      file: 'Контроль корпоративной юридической документации',
      recovery: 'Инфраструктура возврата выручки',
      intake: 'Структурированный первичный разбор',
      resources: 'Материалы для руководства',
      additional: 'Услуги для частных клиентов',
      careers: 'Сотрудничество',
      contact: 'Конфиденциальная консультация',
      clock_vcx: 'Время VitaCoreX',
      clock_local: 'Ваше время',
      clock_local_sub: 'Локально',
      cta_intake: 'Запросить конфиденциальный разбор',
      cta_briefs: 'Открыть материалы для руководства',
      cta_workflow: 'Посмотреть процесс',
      cta_deliverables: 'Посмотреть состав работ',
      cta_contact: 'Связаться с директором',
      cta_apply: 'Откликнуться по email',
      cta_email: 'Написать по email',
      order_services: 'Отправить запрос',
      footer_est: 'Работает с 2025 года',
      footer_ein: 'EIN: 41-4399148',
      footer_phone: 'Телефон (звонок / SMS): (888) 794-8292',
      footer_disc: 'VitaCoreX LLC — компания, зарегистрированная во Флориде, оказывающая удалённую административную, операционную, документарную поддержку и услуги по контролю досье на территории США там, где это разрешено применимым законодательством. VitaCoreX не является юридической фирмой, не даёт юридических советов, не является лицензированным коллекторским агентством, не взыскивает долги и не представляет клиентов в суде или перед государственными органами. Правила конкретного штата по судам, взысканию, конфиденциальности, иммиграции и неавторизованной юридической практике подтверждаются до начала работы.',
      footer_trust_line: 'LLC, зарегистрированная во Флориде \u00b7 Удалённая поддержка по США там, где разрешено \u00b7 Не юридическая фирма \u00b7 Не коллекторское агентство \u00b7 Без юридических советов \u00b7 Без взыскания долгов \u00b7 Объём подтверждается на приёме',
      footer_copy: '© 2025 VitaCoreX LLC. Все права защищены.',
      metric_bar_full: 'Структурированный приём \u2022 Системы возврата \u2022 Контроль документов',
      metric_bar_short: 'Приём \u2022 Контроль документов'
    },
    es: {
      brand_tag: 'Recuperación de ingresos, control de documentación y espacios de trabajo para clientes.',
      home: 'Inicio',
      file: 'Control corporativo de archivos legales',
      recovery: 'Infraestructura de recuperación de ingresos',
      intake: 'Evaluación inicial estructurada',
      resources: 'Material ejecutivo y respaldo documental',
      additional: 'Servicios para clientes privados',
      careers: 'Carreras',
      contact: 'Consulta privada',
      clock_vcx: 'Hora VitaCoreX',
      clock_local: 'Tu hora',
      clock_local_sub: 'Local',
      cta_intake: 'Solicitar revisión confidencial',
      cta_briefs: 'Revisar material ejecutivo',
      cta_workflow: 'Ver flujo',
      cta_deliverables: 'Ver entregables',
      cta_contact: 'Contactar al director',
      cta_apply: 'Postular por email',
      cta_email: 'Escribir por email',
      order_services: 'Solicitar servicio',
      footer_est: 'Establecida en 2025',
      footer_ein: 'EIN: 41-4399148',
      footer_phone: 'Teléfono (llamada / texto): (888) 794-8292',
      footer_disc: 'VitaCoreX LLC es una empresa registrada en Florida que ofrece soporte remoto administrativo, de flujo de trabajo, documental y de control de expedientes en todo Estados Unidos donde lo permita la ley aplicable. VitaCoreX no es un bufete de abogados, no brinda asesoramiento legal, no es una agencia de cobro con licencia, no cobra deudas y no representa a clientes ante tribunales ni agencias gubernamentales. Las reglas específicas de cada estado sobre tribunales, cobro, privacidad, inmigración y práctica no autorizada del derecho se confirman antes de iniciar la colaboración.',
      footer_trust_line: 'LLC registrada en Florida \u00b7 Soporte remoto en EE. UU. donde esté permitido \u00b7 No es bufete de abogados \u00b7 No es agencia de cobros \u00b7 Sin asesoramiento legal \u00b7 Sin cobro de deudas \u00b7 Alcance confirmado en la admisión',
      footer_copy: '© 2025 VitaCoreX LLC. Todos los derechos reservados.',
      metric_bar_full: 'Admisión estructurada \u2022 Sistemas de recuperación \u2022 Control documental',
      metric_bar_short: 'Admisión \u2022 Control documental'
    }
  };
  function merge(target, source){
    Object.keys(source || {}).forEach((lang)=>{
      target[lang] = target[lang] || {};
      Object.keys(source[lang] || {}).forEach((key)=>{
        if(target[lang][key] == null || target[lang][key] === '') target[lang][key] = source[lang][key];
      });
    });
    return target;
  }
  window.SITE_I18N = merge(window.SITE_I18N || {}, shell);
})();
