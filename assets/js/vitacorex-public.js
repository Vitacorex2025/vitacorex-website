(function () {
  const doc = document;
  const body = doc.body;
  const lang = (doc.documentElement.lang || "en").toLowerCase();
  const apiBase = (body && body.getAttribute("data-api-base")) || "/api";
  const purposeMessages = {
    en: {
      company_review: {
        title: "Confidential review request received.",
        body: "A structured operator review is now queued. If the inquiry fits the public company lane, VitaCoreX will respond with the next step and any document requests within one business day.",
      },
      individual_request: {
        title: "Private-client request received.",
        body: "Your request is now in the secondary private-client queue. VitaCoreX will confirm fit, timing, and the preferred next step before asking for anything unnecessary.",
      },
      executive_brief: {
        title: "Executive brief request received.",
        body: "The brief request has been logged with the related attribution and company context. If a download was released, it should open automatically before this page loads.",
      },
      careers_application: {
        title: "Application received.",
        body: "Your application is in the reviewed queue. VitaCoreX uses a selective process and will only follow up when there is a concrete match.",
      },
      default_title: "Your request is in.",
      default_body: "The next step has been queued with the context captured from the page you used.",
      pending: "Sending secure request...",
      error: "The request could not be completed right now. Please review the required fields or try again shortly.",
      consent_title: "Privacy and measurement settings",
      consent_body: "VitaCoreX stores essential preferences for routing, language, and submission integrity. Optional measurement can be enabled without affecting access.",
      essential: "Essential only",
      analytics: "Allow measurement",
    },
    ru: {
      company_review: {
        title: "Запрос на конфиденциальный обзор получен.",
        body: "Структурированный обзор операционной модели поставлен в очередь. Если запрос соответствует корпоративному направлению, VitaCoreX ответит следующим шагом и возможным списком документов в течение одного рабочего дня.",
      },
      individual_request: {
        title: "Запрос частного клиента получен.",
        body: "Ваш запрос поступил во вторичную очередь частных услуг. VitaCoreX сначала подтвердит релевантность, сроки и следующий шаг, не запрашивая лишнего.",
      },
      executive_brief: {
        title: "Запрос на executive brief получен.",
        body: "Запрос сохранен вместе с атрибуцией и контекстом компании. Если файл был открыт, загрузка уже должна была начаться до перехода на эту страницу.",
      },
      careers_application: {
        title: "Заявка получена.",
        body: "Заявка попала в очередь на рассмотрение. VitaCoreX использует выборочный подход и связывается только при наличии конкретного совпадения.",
      },
      default_title: "Запрос принят.",
      default_body: "Следующий шаг поставлен в очередь вместе с контекстом страницы, с которой был отправлен запрос.",
      pending: "Отправляем защищенный запрос...",
      error: "Сейчас не удалось завершить отправку. Проверьте обязательные поля или повторите попытку позже.",
      consent_title: "Настройки приватности и измерения",
      consent_body: "VitaCoreX хранит только необходимые настройки для маршрутизации, языка и целостности отправки. Дополнительное измерение можно включить отдельно.",
      essential: "Только необходимое",
      analytics: "Разрешить измерение",
    },
    es: {
      company_review: {
        title: "Solicitud de revisión confidencial recibida.",
        body: "La revisión estructurada del modelo operativo ya está en cola. Si la consulta encaja con la vía corporativa, VitaCoreX responderá con el siguiente paso y cualquier solicitud documental dentro de un día hábil.",
      },
      individual_request: {
        title: "Solicitud privada recibida.",
        body: "La solicitud ya está en la cola secundaria de servicios privados. VitaCoreX confirmará primero el encaje, el plazo y el siguiente paso antes de pedir información innecesaria.",
      },
      executive_brief: {
        title: "Solicitud de executive brief recibida.",
        body: "La solicitud quedó registrada con la atribución y el contexto corporativo. Si se liberó una descarga, debería haberse abierto antes de llegar a esta página.",
      },
      careers_application: {
        title: "Postulación recibida.",
        body: "La postulación está en la cola de revisión. VitaCoreX mantiene un proceso selectivo y solo responde cuando existe un encaje concreto.",
      },
      default_title: "La solicitud fue registrada.",
      default_body: "El siguiente paso quedó en cola con el contexto capturado desde la página utilizada.",
      pending: "Enviando solicitud segura...",
      error: "No fue posible completar el envío ahora mismo. Revise los campos obligatorios o inténtelo de nuevo en breve.",
      consent_title: "Configuración de privacidad y medición",
      consent_body: "VitaCoreX guarda solo preferencias esenciales para el enrutamiento, el idioma y la integridad de la entrega. La medición opcional puede habilitarse por separado.",
      essential: "Solo esencial",
      analytics: "Permitir medición",
    },
  };

  function messages() {
    return purposeMessages[lang] || purposeMessages.en;
  }

  function setYear() {
    doc.querySelectorAll("[data-current-year]").forEach(function (node) {
      node.textContent = String(new Date().getFullYear());
    });
  }

  function initMenu() {
    const toggle = doc.querySelector("[data-menu-toggle]");
    const menu = doc.querySelector("[data-mobile-menu]");
    if (!toggle || !menu) return;

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      menu.hidden = !open;
    }

    setOpen(false);
    toggle.addEventListener("click", function () {
      setOpen(menu.hidden);
    });
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setOpen(false);
      });
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 1100) {
        setOpen(false);
      }
    });
  }

  function trackEvent(name, detail) {
    const payload = detail || {};
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: name, ...payload });
    window.dispatchEvent(new CustomEvent("vitacorex:track", { detail: { name: name, payload: payload } }));
  }

  function setField(form, name, value) {
    const field = form.querySelector('[name="' + name + '"]');
    if (field) field.value = value;
  }

  function readParam(name) {
    return new URLSearchParams(window.location.search).get(name) || "";
  }

  function hydrateContext(form) {
    setField(form, "page_path", window.location.pathname);
    setField(form, "page_url", window.location.href);
    setField(form, "page_title", doc.title);
    setField(form, "referrer", doc.referrer || "");
    setField(form, "lang", lang);
    setField(form, "utm_source", readParam("utm_source"));
    setField(form, "utm_medium", readParam("utm_medium"));
    setField(form, "utm_campaign", readParam("utm_campaign"));
    setField(form, "utm_term", readParam("utm_term"));
    setField(form, "utm_content", readParam("utm_content"));
    setField(form, "gclid", readParam("gclid"));
    setField(form, "fbclid", readParam("fbclid"));
    setField(form, "submitted_after_ms", String(Date.now() - Number(form.dataset.loadedAt || Date.now())));
  }

  function initConsent() {
    const banner = doc.querySelector("[data-consent-banner]");
    if (!banner) return;

    const storeKey = "vitacorex-consent";
    const saved = window.localStorage.getItem(storeKey);
    if (saved) {
      banner.hidden = true;
      return;
    }

    const copy = messages();
    const title = banner.querySelector("[data-consent-title]");
    const bodyNode = banner.querySelector("[data-consent-body]");
    const essential = banner.querySelector("[data-consent-essential]");
    const analytics = banner.querySelector("[data-consent-analytics]");
    if (title) title.textContent = copy.consent_title;
    if (bodyNode) bodyNode.textContent = copy.consent_body;
    if (essential) essential.textContent = copy.essential;
    if (analytics) analytics.textContent = copy.analytics;

    function save(value) {
      window.localStorage.setItem(storeKey, value);
      banner.hidden = true;
      trackEvent("consent_updated", { consent_choice: value, language: lang });
    }

    banner.hidden = false;
    essential && essential.addEventListener("click", function () { save("essential"); });
    analytics && analytics.addEventListener("click", function () { save("analytics"); });
  }

  function initFileLabels() {
    doc.querySelectorAll('input[type="file"][data-file-list]').forEach(function (input) {
      const target = doc.querySelector(input.getAttribute("data-file-list"));
      if (!target) return;
      function sync() {
        const files = Array.from(input.files || []);
        target.textContent = files.length
          ? files.map(function (file) { return file.name; }).join(", ")
          : (target.getAttribute("data-empty-label") || "No file selected.");
      }
      input.addEventListener("change", sync);
      sync();
    });
  }

  function initForms() {
    doc.querySelectorAll("[data-intake-form]").forEach(function (form) {
      form.dataset.loadedAt = String(Date.now());
      const status = form.querySelector("[data-form-status]");
      const submit = form.querySelector('[type="submit"]');

      form.addEventListener("submit", async function (event) {
        event.preventDefault();
        if (!form.reportValidity()) return;
        hydrateContext(form);

        const copy = messages();
        const formData = new FormData(form);
        if (status) {
          status.textContent = copy.pending;
          status.dataset.state = "pending";
        }
        if (submit) submit.disabled = true;

        try {
          const response = await fetch(apiBase + "/vitacorex/intake", {
            method: "POST",
            body: formData,
            credentials: "same-origin",
          });
          const payload = await response.json();
          if (!response.ok || !payload.ok) {
            throw new Error((payload.detail && payload.detail.message) || copy.error);
          }

          trackEvent("public_form_submitted", {
            purpose: payload.purpose,
            lead_id: payload.lead_id,
            pipeline_stage: payload.pipeline_stage,
            language: lang,
          });

          if (payload.download_url) {
            window.open(payload.download_url, "_blank", "noopener");
          }
          window.location.href = payload.thank_you_url || form.getAttribute("action") || window.location.href;
        } catch (error) {
          if (status) {
            status.textContent = error && error.message ? error.message : copy.error;
            status.dataset.state = "error";
          }
          if (submit) submit.disabled = false;
        }
      });
    });
  }

  function initThankYou() {
    const titleNode = doc.querySelector("[data-thankyou-title]");
    const bodyNode = doc.querySelector("[data-thankyou-body]");
    if (!titleNode || !bodyNode) return;
    const copy = messages();
    const purpose = readParam("purpose");
    const lead = readParam("lead");
    const block = copy[purpose] || { title: copy.default_title, body: copy.default_body };
    titleNode.textContent = block.title;
    bodyNode.textContent = block.body;

    const leadNode = doc.querySelector("[data-thankyou-lead]");
    if (leadNode && lead) {
      leadNode.textContent = lead;
    }
  }

  setYear();
  initMenu();
  initConsent();
  initFileLabels();
  initForms();
  initThankYou();
})();
