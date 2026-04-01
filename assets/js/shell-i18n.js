
(function(){
  const shell = {
    en: {
      brand_tag: 'Revenue recovery and documentation infrastructure',
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
      footer_disc: 'VitaCoreX LLC provides administrative, documentation, workflow, and business-support services. It is not a law firm and does not provide legal representation. Legal strategy and legal advice remain the responsibility of licensed counsel.',
      footer_copy: '© 2026 VitaCoreX LLC. All rights reserved.'
    },
    ru: {
      brand_tag: 'Инфраструктура возврата выручки и контроля документации',
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
      footer_disc: 'VitaCoreX LLC оказывает административную, документарную, операционную и бизнес-поддержку. Компания не является юридической фирмой и не оказывает юридическое представительство. Правовая стратегия и юридические советы относятся к компетенции лицензированного адвоката.',
      footer_copy: '© 2026 VitaCoreX LLC. Все права защищены.'
    },
    es: {
      brand_tag: 'Infraestructura de recuperación de ingresos y control documental',
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
      footer_disc: 'VitaCoreX LLC ofrece soporte administrativo, documental, operativo y de negocio. No es un bufete jurídico y no presta representación legal. La estrategia legal y el asesoramiento jurídico siguen siendo responsabilidad de abogados con licencia.',
      footer_copy: '© 2026 VitaCoreX LLC. Todos los derechos reservados.'
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
