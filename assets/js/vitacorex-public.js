(function () {
  if (window.__VCX_PUBLIC_SHELL__) {
    return;
  }

  var doc = document;
  var root = doc.documentElement;
  var body = doc.body;

  if (!body) {
    return;
  }

  var LOCALE_KEY = 'docketmint.locale';
  var CONSENT_KEY = 'vitacorex-consent';
  var ATTRIBUTION_KEY = 'vitacorex.attribution';
  var SUPPORTED_LOCALES = ['en', 'ru', 'es'];
  var ATTRIBUTION_FIELDS = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'gclid',
    'fbclid',
    'msclkid',
    'li_fat_id'
  ];
  var apiBase = body.getAttribute('data-api-base') || '/api';

  var SHELL_COPY = {
    en: {
      'shell.skip': 'Skip to content',
      'shell.subtitle': 'Operator advisory and documentation control',
      'shell.menu': 'Menu',
      'shell.language_label': 'Language',
      'shell.primary_label': 'Primary navigation',
      'shell.mobile_label': 'Mobile menu',
      'shell.breadcrumbs_label': 'Breadcrumbs',
      'shell.nav.home': 'Home',
      'shell.nav.solutions': 'Solutions',
      'shell.nav.industries': 'Industries',
      'shell.nav.proof': 'Proof',
      'shell.nav.review': 'Review',
      'shell.nav.about': 'About',
      'shell.nav.private': 'Private Client Services',
      'shell.nav.signin': 'Sign in',
      'shell.nav.careers': 'Careers',
      'shell.policy.privacy': 'Privacy Policy',
      'shell.policy.terms': 'Terms of Use',
      'shell.policy.cookies': 'Cookie Policy',
      'shell.city': 'Tampa, Florida, U.S.',
      'shell.boundary': 'VitaCoreX is not a law firm. The public site describes advisory, documentation, and intake control services only.',
      'shell.footer.brand': 'VitaCoreX LLC',
      'shell.footer.copy': 'Premium operator advisory for revenue recovery design, legal file control, and structured intake before outside cost expands.',
      'shell.footer.services': 'Core service lines',
      'shell.footer.firm': 'Firm posture',
      'shell.footer.secondary': 'Secondary routes',
      'shell.footer.boundary': 'Legal boundary',
      'shell.contact.line': 'Private consultation line: (888) 794-8292',
      'shell.cta.review': 'Request confidential review',
      'shell.cta.proof': 'Review executive brief',
      'shell.cta.service': 'Request service',
      'shell.cta.careers': 'Submit application',
      'shell.cta.call': 'Call private line',
      'shell.cta.book': 'Book consultation'
    },
    ru: {
      'shell.skip': 'Перейти к содержанию',
      'shell.subtitle': 'Операционный консалтинг и контроль документации',
      'shell.menu': 'Меню',
      'shell.language_label': 'Выбор языка',
      'shell.primary_label': 'Основная навигация',
      'shell.mobile_label': 'Мобильное меню',
      'shell.breadcrumbs_label': 'Навигационная цепочка',
      'shell.nav.home': 'Главная',
      'shell.nav.solutions': 'Решения',
      'shell.nav.industries': 'Отрасли',
      'shell.nav.proof': 'Материалы',
      'shell.nav.review': 'Разбор',
      'shell.nav.about': 'О компании',
      'shell.nav.private': 'Частные услуги',
      'shell.nav.signin': 'Войти',
      'shell.nav.careers': 'Карьера',
      'shell.policy.privacy': 'Политика конфиденциальности',
      'shell.policy.terms': 'Условия использования',
      'shell.policy.cookies': 'Политика файлов cookie',
      'shell.city': 'Тампа, Флорида, США',
      'shell.boundary': 'VitaCoreX не является юридической фирмой. Публичный сайт описывает только консультационные услуги, контроль документации и структурированную обработку обращений.',
      'shell.footer.brand': 'VitaCoreX LLC',
      'shell.footer.copy': 'Премиальный операционный консалтинг по проектированию возврата выручки, контролю юридического файла и структурированной обработке обращений до роста внешних затрат.',
      'shell.footer.services': 'Ключевые сервисные направления',
      'shell.footer.firm': 'Позиция фирмы',
      'shell.footer.secondary': 'Дополнительные разделы',
      'shell.footer.boundary': 'Правовые границы',
      'shell.contact.line': 'Частная линия для консультаций: (888) 794-8292',
      'shell.cta.review': 'Запросить конфиденциальный разбор',
      'shell.cta.proof': 'Запросить обзор для руководства',
      'shell.cta.service': 'Запросить услугу',
      'shell.cta.careers': 'Отправить заявку',
      'shell.cta.call': 'Позвонить на частную линию',
      'shell.cta.book': 'Записаться на консультацию'
    },
    es: {
      'shell.skip': 'Saltar al contenido',
      'shell.subtitle': 'Asesoría operativa y control documental',
      'shell.menu': 'Menú',
      'shell.language_label': 'Idioma',
      'shell.primary_label': 'Navegación principal',
      'shell.mobile_label': 'Menú móvil',
      'shell.breadcrumbs_label': 'Ruta de navegación',
      'shell.nav.home': 'Inicio',
      'shell.nav.solutions': 'Soluciones',
      'shell.nav.industries': 'Industrias',
      'shell.nav.proof': 'Materiales',
      'shell.nav.review': 'Evaluación',
      'shell.nav.about': 'Nosotros',
      'shell.nav.private': 'Servicios privados',
      'shell.nav.signin': 'Ingresar',
      'shell.nav.careers': 'Carreras',
      'shell.policy.privacy': 'Política de privacidad',
      'shell.policy.terms': 'Términos de uso',
      'shell.policy.cookies': 'Política de cookies',
      'shell.city': 'Tampa, Florida, EE. UU.',
      'shell.boundary': 'VitaCoreX no es un bufete de abogados. El sitio público describe únicamente servicios de asesoría, control documental y admisión estructurada.',
      'shell.footer.brand': 'VitaCoreX LLC',
      'shell.footer.copy': 'Asesoría premium para operadores sobre diseño de recuperación de ingresos, control del expediente legal y admisión estructurada antes de que aumente el costo externo.',
      'shell.footer.services': 'Líneas centrales de servicio',
      'shell.footer.firm': 'Postura de la firma',
      'shell.footer.secondary': 'Rutas secundarias',
      'shell.footer.boundary': 'Límite legal',
      'shell.contact.line': 'Línea privada de consulta: (888) 794-8292',
      'shell.cta.review': 'Solicitar evaluación confidencial',
      'shell.cta.proof': 'Solicitar resumen ejecutivo',
      'shell.cta.service': 'Solicitar servicio',
      'shell.cta.careers': 'Enviar postulación',
      'shell.cta.call': 'Llamar a la línea privada',
      'shell.cta.book': 'Reservar consulta'
    }
  };

  var PURPOSE_MESSAGES = {
    en: {
      company_review: {
        title: 'Confidential review request received.',
        body: 'A structured operator review is now queued. If the inquiry fits the public company lane, VitaCoreX will respond with the next step and any document requests within one business day.'
      },
      individual_request: {
        title: 'Private-client request received.',
        body: 'Your request is now in the secondary private-client queue. VitaCoreX will confirm fit, timing, and the preferred next step before asking for anything unnecessary.'
      },
      executive_brief: {
        title: 'Executive brief request received.',
        body: 'The brief request has been logged with the related attribution and company context. If a download was released, it should open automatically before this page loads.'
      },
      careers_application: {
        title: 'Application received.',
        body: 'Your application is in the reviewed queue. VitaCoreX uses a selective process and will only follow up when there is a concrete match.'
      },
      default_title: 'Your request is in.',
      default_body: 'The next step has been queued with the context captured from the page you used.',
      pending: 'Sending secure request...',
      error: 'The request could not be completed right now. Please review the required fields or try again shortly.',
      required_fields_missing: 'Some required fields are still missing. Please complete the form and try again.',
      spam_blocked: 'The request was blocked by spam protection. Please remove hidden or automated data and try again.',
      timing_blocked: 'The form was submitted too quickly to verify safely. Please wait a moment and resubmit.',
      rate_limited: 'Too many requests were sent from this source. Please wait and try again shortly.',
      unsupported_file_type: 'That file type is not supported for this intake. Please upload one of the listed formats.',
      file_too_large: 'One of the files exceeds the allowed upload size. Please reduce the file size and retry.',
      consent_title: 'Privacy and measurement settings',
      consent_body: 'VitaCoreX stores essential preferences for routing, language, and submission integrity. Optional measurement can be enabled without affecting access.',
      essential: 'Essential only',
      analytics: 'Allow measurement'
    },
    ru: {
      company_review: {
        title: 'Запрос на конфиденциальный разбор получен.',
        body: 'Структурированный разбор операционной модели поставлен в очередь. Если запрос соответствует корпоративному направлению, VitaCoreX ответит следующим шагом и при необходимости запросит документы в течение одного рабочего дня.'
      },
      individual_request: {
        title: 'Запрос частного клиента получен.',
        body: 'Ваш запрос поступил во вторичную очередь частных услуг. VitaCoreX сначала подтвердит релевантность, сроки и следующий шаг, не запрашивая лишнего.'
      },
      executive_brief: {
        title: 'Запрос на обзор для руководства получен.',
        body: 'Запрос сохранен вместе с источником обращения и контекстом компании. Если загрузка была открыта, она уже должна была начаться до перехода на эту страницу.'
      },
      careers_application: {
        title: 'Заявка получена.',
        body: 'Заявка помещена в очередь на рассмотрение. VitaCoreX использует выборочный подход и связывается только при наличии конкретного совпадения.'
      },
      default_title: 'Запрос принят.',
      default_body: 'Следующий шаг поставлен в очередь вместе с контекстом страницы, с которой был отправлен запрос.',
      pending: 'Отправляем защищенный запрос...',
      error: 'Сейчас не удалось завершить отправку. Проверьте обязательные поля или повторите попытку позже.',
      required_fields_missing: 'Не все обязательные поля заполнены. Проверьте форму и повторите отправку.',
      spam_blocked: 'Запрос был остановлен защитой от спама. Удалите скрытые или автоматические данные и попробуйте снова.',
      timing_blocked: 'Форма была отправлена слишком быстро для безопасной проверки. Подождите немного и отправьте повторно.',
      rate_limited: 'С этого источника поступило слишком много запросов. Подождите немного и повторите попытку позже.',
      unsupported_file_type: 'Такой тип файла не поддерживается для этой формы. Загрузите один из указанных форматов.',
      file_too_large: 'Один из файлов превышает допустимый размер. Уменьшите файл и повторите попытку.',
      consent_title: 'Настройки конфиденциальности и аналитики',
      consent_body: 'VitaCoreX хранит только необходимые настройки для маршрутизации, языка и целостности отправки. Дополнительную аналитику можно включить отдельно.',
      essential: 'Только необходимое',
      analytics: 'Разрешить аналитику'
    },
    es: {
      company_review: {
        title: 'Solicitud de evaluación confidencial recibida.',
        body: 'La evaluación estructurada del modelo operativo ya está en cola. Si la consulta encaja con la vía corporativa, VitaCoreX responderá con el siguiente paso y cualquier solicitud documental dentro de un día hábil.'
      },
      individual_request: {
        title: 'Solicitud privada recibida.',
        body: 'La solicitud ya está en la cola secundaria de servicios privados. VitaCoreX confirmará primero el encaje, el plazo y el siguiente paso antes de pedir información innecesaria.'
      },
      executive_brief: {
        title: 'Solicitud de resumen ejecutivo recibida.',
        body: 'La solicitud quedó registrada con el canal de origen y el contexto corporativo. Si se liberó una descarga, debería haberse abierto antes de llegar a esta página.'
      },
      careers_application: {
        title: 'Postulación recibida.',
        body: 'La postulación está en la cola de revisión. VitaCoreX mantiene un proceso selectivo y solo responde cuando existe un encaje concreto.'
      },
      default_title: 'La solicitud fue registrada.',
      default_body: 'El siguiente paso quedó en cola con el contexto capturado desde la página utilizada.',
      pending: 'Enviando solicitud segura...',
      error: 'No fue posible completar el envío ahora mismo. Revise los campos obligatorios o inténtelo de nuevo en breve.',
      required_fields_missing: 'Todavía faltan campos obligatorios. Complete el formulario y vuelva a enviarlo.',
      spam_blocked: 'La solicitud fue bloqueada por la protección contra spam. Quite los datos ocultos o automatizados y vuelva a intentarlo.',
      timing_blocked: 'El formulario se envió demasiado rápido para validarlo con seguridad. Espere un momento y vuelva a enviarlo.',
      rate_limited: 'Se enviaron demasiadas solicitudes desde este origen. Espere un momento y vuelva a intentarlo.',
      unsupported_file_type: 'Ese tipo de archivo no está admitido para esta admisión. Cargue uno de los formatos indicados.',
      file_too_large: 'Uno de los archivos supera el tamaño permitido. Reduzca el archivo y vuelva a intentarlo.',
      consent_title: 'Configuración de privacidad y analítica',
      consent_body: 'VitaCoreX guarda solo preferencias esenciales para el enrutamiento, el idioma y la integridad de la entrega. La analítica opcional puede habilitarse por separado.',
      essential: 'Solo esencial',
      analytics: 'Permitir analítica'
    }
  };

  function normalizeLang(value) {
    var normalized = String(value || '').trim().toLowerCase().slice(0, 2);
    return SUPPORTED_LOCALES.indexOf(normalized) >= 0 ? normalized : 'en';
  }

  function safeLocalGet(key) {
    try {
      return window.localStorage.getItem(key) || '';
    } catch (error) {
      return '';
    }
  }

  function safeLocalSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      // Ignore storage failures.
    }
  }

  function safeSessionGet(key) {
    try {
      return JSON.parse(window.sessionStorage.getItem(key) || '{}');
    } catch (error) {
      return {};
    }
  }

  function safeSessionSet(key, value) {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // Ignore storage failures.
    }
  }

  function lookup(map, key) {
    return Object.prototype.hasOwnProperty.call(map, key) ? map[key] : '';
  }

  var lang = normalizeLang(body.getAttribute('data-shell-lang') || root.lang || safeLocalGet(LOCALE_KEY) || 'en');

  function copy() {
    return SHELL_COPY[lang] || SHELL_COPY.en;
  }

  function messages() {
    return PURPOSE_MESSAGES[lang] || PURPOSE_MESSAGES.en;
  }

  function readParam(name) {
    return new URLSearchParams(window.location.search).get(name) || '';
  }

  function currentSlug() {
    return body.getAttribute('data-shell-slug') || '';
  }

  function localizedShellHref(link) {
    var href = (link.getAttribute('href') || '').trim();
    if (!href) {
      return href;
    }
    if (currentSlug() !== 'thank-you' || !window.location.search) {
      return href;
    }
    try {
      var next = new URL(href, window.location.origin);
      var current = new URL(window.location.href);
      current.searchParams.forEach(function (value, key) {
        if (!next.searchParams.has(key)) {
          next.searchParams.set(key, value);
        }
      });
      return next.pathname + next.search + next.hash;
    } catch (error) {
      return href;
    }
  }

  function resolveFormError(payload, text) {
    var detail = payload && payload.detail && typeof payload.detail === 'object' ? payload.detail : null;
    var code = String((detail && detail.code) || payload.code || '').trim();
    if (code && text[code]) {
      return text[code];
    }
    if (detail && typeof detail.message === 'string' && detail.message.trim()) {
      return detail.message.trim();
    }
    if (payload && typeof payload.message === 'string' && payload.message.trim()) {
      return payload.message.trim();
    }
    return text.error;
  }

  function captureAttribution() {
    var attribution = safeSessionGet(ATTRIBUTION_KEY);
    if (!attribution.landing_page) {
      attribution.landing_page = window.location.href;
    }
    if (!attribution.referrer && doc.referrer) {
      attribution.referrer = doc.referrer;
    }
    ATTRIBUTION_FIELDS.forEach(function (field) {
      var value = readParam(field);
      if (value && !attribution[field]) {
        attribution[field] = value;
      }
    });
    safeSessionSet(ATTRIBUTION_KEY, attribution);
    return attribution;
  }

  function currentAttribution() {
    return captureAttribution();
  }

  function setField(form, name, value) {
    var field = form.querySelector('[name="' + name + '"]');
    if (field) {
      field.value = value || '';
    }
  }

  function markReady() {
    var boot = window.__VCX_PUBLIC_BOOT__ || {};
    if (boot.readyTimer) {
      window.clearTimeout(boot.readyTimer);
      boot.readyTimer = 0;
    }
    root.setAttribute('data-vcx-shell', 'ready');
  }

  function applyShellCopy() {
    var shell = copy();
    root.lang = lang;
    body.setAttribute('data-shell-lang', lang);

    doc.querySelectorAll('[data-shell-key]').forEach(function (node) {
      var value = lookup(shell, node.getAttribute('data-shell-key'));
      if (value) {
        node.textContent = value;
      }
    });

    doc.querySelectorAll('[data-shell-aria-key]').forEach(function (node) {
      var value = lookup(shell, node.getAttribute('data-shell-aria-key'));
      if (value) {
        node.setAttribute('aria-label', value);
      }
    });
  }

  function initLocalePersistence() {
    safeLocalSet(LOCALE_KEY, lang);
    doc.querySelectorAll('[data-shell-locale]').forEach(function (link) {
      link.href = localizedShellHref(link);
      link.addEventListener('click', function () {
        var next = normalizeLang(link.getAttribute('data-shell-locale'));
        safeLocalSet(LOCALE_KEY, next);
      });
    });
  }

  function setYear() {
    doc.querySelectorAll('[data-current-year], [data-year]').forEach(function (node) {
      node.textContent = String(new Date().getFullYear());
    });
  }

  function initMenu() {
    var toggle = doc.querySelector('[data-public-menu-toggle], [data-menu-toggle]');
    var panel = doc.querySelector('[data-public-menu-panel], [data-mobile-menu]');

    if (!toggle || !panel) {
      return;
    }

    var shell = toggle.closest('.site-header');
    var open = false;
    var desktopQuery = window.matchMedia ? window.matchMedia('(min-width: 1101px)') : null;
    var focusSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

    function focusables() {
      return Array.from(panel.querySelectorAll(focusSelector)).filter(function (node) {
        return !node.hidden && node.offsetParent !== null;
      });
    }

    function setOpen(next, reason) {
      var normalized = Boolean(next);
      if (open === normalized) {
        return;
      }
      open = normalized;
      toggle.setAttribute('aria-expanded', normalized ? 'true' : 'false');
      panel.hidden = !normalized;
      panel.setAttribute('aria-hidden', normalized ? 'false' : 'true');
      body.classList.toggle('vcx-menu-open', normalized);
      if (shell) {
        shell.setAttribute('data-menu-open', normalized ? 'true' : 'false');
      }
      if (normalized) {
        var first = focusables()[0];
        if (first) {
          window.requestAnimationFrame(function () {
            try {
              first.focus();
            } catch (error) {
              // Ignore focus issues.
            }
          });
        }
      } else if (reason && reason !== 'init' && reason !== 'pageshow') {
        try {
          toggle.focus();
        } catch (error) {
          // Ignore focus issues.
        }
      }
    }

    setOpen(false, 'init');

    toggle.addEventListener('click', function (event) {
      event.preventDefault();
      setOpen(!open, 'toggle');
    });

    panel.addEventListener('click', function (event) {
      var link = event.target.closest('a[href]');
      if (link) {
        setOpen(false, 'navigate');
      }
    });

    var outsideEvent = window.PointerEvent ? 'pointerdown' : 'mousedown';
    doc.addEventListener(outsideEvent, function (event) {
      if (!open) {
        return;
      }
      var target = event.target;
      if (toggle.contains(target) || panel.contains(target)) {
        return;
      }
      setOpen(false, 'outside');
    }, true);

    if (!window.PointerEvent) {
      doc.addEventListener('touchstart', function (event) {
        if (!open) {
          return;
        }
        var target = event.target;
        if (toggle.contains(target) || panel.contains(target)) {
          return;
        }
        setOpen(false, 'outside');
      }, { capture: true, passive: true });
    }

    doc.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        setOpen(false, 'escape');
        return;
      }
      if (!open || event.key !== 'Tab') {
        return;
      }
      var items = focusables();
      if (!items.length) {
        event.preventDefault();
        try {
          toggle.focus();
        } catch (error) {
          // Ignore focus issues.
        }
        return;
      }
      var first = items[0];
      var last = items[items.length - 1];
      if (event.shiftKey && doc.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && doc.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }, true);

    if (desktopQuery) {
      var onViewportChange = function (event) {
        if (event.matches) {
          setOpen(false, 'viewport');
        }
      };
      if (desktopQuery.addEventListener) {
        desktopQuery.addEventListener('change', onViewportChange);
      } else {
        desktopQuery.addListener(onViewportChange);
      }
    } else {
      window.addEventListener('resize', function () {
        if (window.innerWidth > 1100) {
          setOpen(false, 'resize');
        }
      });
    }

    window.addEventListener('pageshow', function () {
      setOpen(false, 'pageshow');
    });
  }

  function trackEvent(name, detail) {
    var payload = detail || {};
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: name, ...payload });
    window.dispatchEvent(new CustomEvent('vitacorex:track', {
      detail: {
        name: name,
        payload: payload
      }
    }));
  }

  window.trackEvent = trackEvent;
  window.gtag = window.gtag || function () {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(arguments);
  };

  function initConsent() {
    var banner = doc.querySelector('[data-consent-banner]');
    if (!banner) {
      return;
    }

    var saved = safeLocalGet(CONSENT_KEY);
    if (saved) {
      banner.hidden = true;
      return;
    }

    var text = messages();
    var title = banner.querySelector('[data-consent-title]');
    var bodyNode = banner.querySelector('[data-consent-body]');
    var essential = banner.querySelector('[data-consent-essential]');
    var analytics = banner.querySelector('[data-consent-analytics]');

    if (title) {
      title.textContent = text.consent_title;
    }
    if (bodyNode) {
      bodyNode.textContent = text.consent_body;
    }
    if (essential) {
      essential.textContent = text.essential;
    }
    if (analytics) {
      analytics.textContent = text.analytics;
    }

    function save(value) {
      safeLocalSet(CONSENT_KEY, value);
      banner.hidden = true;
      trackEvent('consent_updated', {
        consent_choice: value,
        language: lang
      });
    }

    banner.hidden = false;

    if (essential) {
      essential.addEventListener('click', function () {
        save('essential');
      });
    }
    if (analytics) {
      analytics.addEventListener('click', function () {
        save('analytics');
      });
    }
  }

  function initFileLabels() {
    doc.querySelectorAll('input[type="file"][data-file-list]').forEach(function (input) {
      if (input.dataset.vcxFileListBound === 'true') {
        return;
      }
      var target = doc.querySelector(input.getAttribute('data-file-list'));
      if (!target) {
        return;
      }
      input.dataset.vcxFileListBound = 'true';

      function sync() {
        var files = Array.from(input.files || []);
        target.textContent = files.length
          ? files.map(function (file) { return file.name; }).join(', ')
          : (target.getAttribute('data-empty-label') || 'No file selected.');
      }

      input.addEventListener('change', sync);
      sync();
    });
  }

  function hydrateContext(form) {
    var attribution = currentAttribution();

    setField(form, 'page_path', window.location.pathname);
    setField(form, 'page_url', window.location.href);
    setField(form, 'page_title', doc.title);
    setField(form, 'landing_page', attribution.landing_page || window.location.href);
    setField(form, 'referrer', attribution.referrer || doc.referrer || '');
    setField(form, 'lang', lang);

    ATTRIBUTION_FIELDS.forEach(function (field) {
      setField(form, field, attribution[field] || readParam(field));
    });

    setField(form, 'submitted_after_ms', String(Date.now() - Number(form.dataset.loadedAt || Date.now())));
  }

  async function parseJson(response) {
    try {
      return await response.json();
    } catch (error) {
      return {};
    }
  }

  function initForms() {
    doc.querySelectorAll('[data-intake-form]').forEach(function (form) {
      if (form.dataset.vcxBound === 'true') {
        return;
      }

      form.dataset.vcxBound = 'true';
      form.dataset.loadedAt = String(Date.now());

      var status = form.querySelector('[data-form-status]');
      var submit = form.querySelector('[type="submit"]');

      function resetStatus() {
        if (!status || (submit && submit.disabled)) {
          return;
        }
        status.textContent = '';
        delete status.dataset.state;
      }

      form.addEventListener('input', resetStatus);
      form.addEventListener('change', resetStatus);

      form.addEventListener('submit', async function (event) {
        event.preventDefault();
        if (!form.reportValidity()) {
          return;
        }

        hydrateContext(form);

        var text = messages();
        var formData = new FormData(form);

        if (status) {
          status.textContent = text.pending;
          status.dataset.state = 'pending';
        }
        if (submit) {
          submit.disabled = true;
        }

        try {
          var response = await fetch(apiBase + '/vitacorex/intake', {
            method: 'POST',
            body: formData,
            credentials: 'same-origin'
          });
          var payload = await parseJson(response);

          if (!response.ok || !payload.ok) {
            throw new Error(resolveFormError(payload, text));
          }

          trackEvent('public_form_submitted', {
            purpose: payload.purpose,
            lead_id: payload.lead_id,
            pipeline_stage: payload.pipeline_stage,
            language: lang
          });

          if (payload.download_url) {
            window.open(payload.download_url, '_blank', 'noopener');
          }

          var thankYouField = form.querySelector('[name="thank_you_path"]');
          var localThankYou = thankYouField && thankYouField.value ? thankYouField.value : '';
          window.location.href = payload.thank_you_url || localThankYou || form.getAttribute('action') || window.location.href;
        } catch (error) {
          if (status) {
            status.textContent = error && error.message ? error.message : text.error;
            status.dataset.state = 'error';
          }
          if (submit) {
            submit.disabled = false;
          }
        }
      });
    });
  }

  function initThankYou() {
    var titleNode = doc.querySelector('[data-thankyou-title]');
    var bodyNode = doc.querySelector('[data-thankyou-body]');
    if (!titleNode || !bodyNode) {
      return;
    }

    var text = messages();
    var purpose = readParam('purpose');
    var lead = readParam('lead');
    var block = text[purpose] || {
      title: text.default_title,
      body: text.default_body
    };

    titleNode.textContent = block.title;
    bodyNode.textContent = block.body;

    var leadNode = doc.querySelector('[data-thankyou-lead]');
    var leadRow = doc.querySelector('[data-thankyou-lead-row]');
    if (leadNode && lead) {
      leadNode.textContent = lead;
      if (leadRow) {
        leadRow.hidden = false;
      }
    } else if (leadRow) {
      leadRow.hidden = true;
    }
  }

  window.__VCX_PUBLIC_SHELL__ = {
    version: 'step-03',
    lang: lang,
    markReady: markReady,
    syncLegacy: setYear,
    trackEvent: trackEvent
  };

  captureAttribution();
  applyShellCopy();
  initLocalePersistence();
  setYear();
  initMenu();
  initConsent();
  initFileLabels();
  initForms();
  initThankYou();
  markReady();
})();
