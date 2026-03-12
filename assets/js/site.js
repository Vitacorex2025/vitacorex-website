
(() => {
  if (window.__VCX_SITE_BOOTED__) return;
  window.__VCX_SITE_BOOTED__ = true;

  const doc = document;
  const root = doc.documentElement;
  const body = doc.body;
  const $ = (s, e = doc) => e.querySelector(s);
  const $$ = (s, e = doc) => Array.from(e.querySelectorAll(s));
  const common = window.SITE_I18N || {};
  const page = window.PAGE_DATA || {};
  const defaultLang = localStorage.getItem('vcx_lang') || 'en';

  function unlockScroll() {
    if (!body || !root) return;
    if (body.classList.contains('modal-open')) return;
    body.style.overflow = '';
    body.style.overflowY = 'auto';
    body.style.position = '';
    body.style.top = '';
    body.style.width = '';
    root.style.overflow = '';
    root.style.overflowY = 'auto';
    root.style.height = '';
  }

  function formatMoney(value) {
    return '$' + (Number(value) || 0).toLocaleString(undefined, { maximumFractionDigits: 0 });
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function setTextFromMap(selector, attr, map) {
    $$(selector).forEach((node) => {
      const key = node.getAttribute(attr);
      if (!key || !(key in map)) return;
      if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA') {
        node.placeholder = map[key];
      } else {
        node.textContent = map[key];
      }
    });
  }

  function applyLanguage(lang) {
    const safeLang = common[lang] ? lang : 'en';
    localStorage.setItem('vcx_lang', safeLang);

    setTextFromMap('[data-common]', 'data-common', common[safeLang] || {});
    setTextFromMap('[data-page]', 'data-page', page[safeLang] || {});
    setTextFromMap('[data-tx]', 'data-tx', common[safeLang] || {});
    setTextFromMap('[data-v52]', 'data-v52', common[safeLang] || {});
    doc.documentElement.lang = safeLang;
    $$('[data-lang]').forEach((button) => {
      button.classList.toggle('active', button.dataset.lang === safeLang);
    });
  }

  function initLanguage() {
    applyLanguage(defaultLang);
    $$('[data-lang]').forEach((button) => {
      if (button.dataset.bound === '1') return;
      button.dataset.bound = '1';
      button.addEventListener('click', () => applyLanguage(button.dataset.lang));
    });
  }

  function initGate() {
    const gate = $('#pdfGate');
    if (!gate) return;
    const openGate = (asset, label) => {
      gate.classList.add('open');
      gate.setAttribute('aria-hidden', 'false');
      body.classList.add('modal-open');
      const assetField = gate.querySelector('[name="asset"]');
      const labelEl = gate.querySelector('.gate-asset');
      if (assetField) assetField.value = asset || '';
      if (labelEl) labelEl.textContent = label || 'PDF';
    };
    const closeGate = () => {
      gate.classList.remove('open');
      gate.setAttribute('aria-hidden', 'true');
      body.classList.remove('modal-open');
      unlockScroll();
    };
    $$('[data-gated-asset]').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        openGate(button.dataset.gatedAsset, button.dataset.gatedLabel);
      });
    });
    $$('.modal-close,.modal-cancel').forEach((button) => {
      button.addEventListener('click', closeGate);
    });
    gate.addEventListener('click', (event) => {
      if (event.target === gate) closeGate();
    });
    doc.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeGate();
    });
  }

  function bindCalc(id, eventName, fn) {
    const inputs = id.map((x) => $('#'+x)).filter(Boolean);
    if (!inputs.length) return;
    const run = () => fn();
    inputs.forEach((input) => input.addEventListener(eventName, run, { passive: true }));
    run();
  }

  function initCalculators() {
    const leakRevenue = $('#leakRevenue');
    const leakResp = $('#leakResponsibility');
    const leakLeak = $('#leakLeakage');
    const leakOutput = $('#leakOutput');
    if (leakRevenue && leakResp && leakLeak && leakOutput) {
      const run = () => {
        const revenue = Number(leakRevenue.value) || 0;
        const responsibility = (Number(leakResp.value) || 0) / 100;
        const leakage = (Number(leakLeak.value) || 0) / 100;
        leakOutput.textContent = formatMoney(revenue * responsibility * leakage);
      };
      [leakRevenue, leakResp, leakLeak].forEach((el) => el.addEventListener('input', run, { passive: true }));
      run();
    }

    const dsoRevenue = $('#dsoRevenue');
    const dsoCurrent = $('#dsoCurrent');
    const dsoTarget = $('#dsoTarget');
    const dsoOutput = $('#dsoOutput');
    const dsoDelta = $('#dsoDelta');
    if (dsoRevenue && dsoCurrent && dsoTarget && dsoOutput && dsoDelta) {
      const run = () => {
        const revenue = Number(dsoRevenue.value) || 0;
        const current = Number(dsoCurrent.value) || 0;
        const target = Number(dsoTarget.value) || 0;
        const delta = Math.max(current - target, 0);
        dsoOutput.textContent = formatMoney((revenue / 365) * delta);
        dsoDelta.textContent = `${delta} days`;
      };
      [dsoRevenue, dsoCurrent, dsoTarget].forEach((el) => el.addEventListener('input', run, { passive: true }));
      run();
    }

    const roi90Portfolio = $('#roi90Portfolio');
    const roiImprove = $('#roiImprove');
    const roiCost = $('#roiCost');
    const roiOutput = $('#roiOutput');
    const roiMultiple = $('#roiMultiple');
    if (roi90Portfolio && roiImprove && roiCost && roiOutput && roiMultiple) {
      const run = () => {
        const portfolio = Number(roi90Portfolio.value) || 0;
        const improve = (Number(roiImprove.value) || 0) / 100;
        const cost = Number(roiCost.value) || 0;
        const additional = portfolio * improve;
        const multiple = cost > 0 ? additional / cost : 0;
        roiOutput.textContent = formatMoney(additional);
        roiMultiple.textContent = `${multiple.toLocaleString(undefined, { maximumFractionDigits: 1 })}x`;
      };
      [roi90Portfolio, roiImprove, roiCost].forEach((el) => el.addEventListener('input', run, { passive: true }));
      run();
    }

    const impactRevenue = $('#impactRevenue');
    const impactPortfolio = $('#impactPortfolio');
    const impactRecovery = $('#impactRecovery');
    const impactAdditional = $('#impactAdditional');
    const impactAvoided = $('#impactAvoided');
    const impactLift = $('#impactLift');
    if (impactRevenue && impactPortfolio && impactRecovery && impactAdditional && impactAvoided && impactLift) {
      const run = () => {
        const revenue = Number(impactRevenue.value) || 0;
        const portfolio = Number(impactPortfolio.value) || 0;
        const recovery = (Number(impactRecovery.value) || 0) / 100;
        const improvedRate = clamp(recovery + 0.12, 0, 1);
        const additional = portfolio * Math.max(improvedRate - recovery, 0);
        const avoided = additional * 0.3;
        const lift = recovery > 0 ? ((improvedRate - recovery) / recovery) * 100 : 0;
        impactAdditional.textContent = formatMoney(additional);
        impactAvoided.textContent = formatMoney(avoided);
        impactLift.textContent = `${lift.toLocaleString(undefined, { maximumFractionDigits: 0 })}%`;
      };
      [impactRevenue, impactPortfolio, impactRecovery].forEach((el) => el.addEventListener('input', run, { passive: true }));
      run();
    }

    const liEvaluate = $('#liEvaluate');
    const liIndustry = $('#liIndustry');
    const liRevenue = $('#liRevenue');
    const liPortfolio = $('#liPortfolio');
    const liPain = $('#liPain');
    const liResult = $('#liResult');
    if (liEvaluate && liIndustry && liRevenue && liPortfolio && liPain && liResult) {
      liEvaluate.addEventListener('click', (event) => {
        event.preventDefault();
        const pain = liPain.value;
        let text = 'Start with a structured operator review and map the highest-leverage pilot scope.';
        if (pain === 'docs' || pain === 'counsel') text = 'Start with Corporate Legal File Control and packet readiness review.';
        if (pain === 'agency') text = 'Start with Revenue Recovery Infrastructure and pre-agency sequencing review.';
        liResult.innerHTML = `<strong>Recommended next step</strong><p>${text}</p>`;
      });
    }

    const roiRevenue = $('#roiRevenue');
    const roiPortfolio = $('#roiPortfolio');
    const roiRate = $('#roiRate');
    const roiAgencyFee = $('#roiAgencyFee');
    const roiCalculate = $('#roiCalculate');
    const roiAdditional = $('#roiAdditional');
    const roiAvoided = $('#roiAvoided');
    const roiDso = $('#roiDso');
    const roiBaseBar = $('#roiBaseBar');
    const roiImprovedBar = $('#roiImprovedBar');
    if (roiRevenue && roiPortfolio && roiRate && roiAgencyFee && roiCalculate && roiAdditional && roiAvoided && roiDso) {
      const run = () => {
        const revenue = Number(roiRevenue.value) || 0;
        const portfolio = Number(roiPortfolio.value) || 0;
        const rate = (Number(roiRate.value) || 0) / 100;
        const fee = (Number(roiAgencyFee.value) || 0) / 100;
        const improvedRate = clamp(rate + 0.12, 0, 1);
        const additional = portfolio * Math.max(improvedRate - rate, 0);
        const avoided = additional * fee;
        const dso = Math.max(Math.round((portfolio / Math.max(revenue, 1)) * 365 * 0.08), 0);
        roiAdditional.textContent = formatMoney(additional);
        roiAvoided.textContent = formatMoney(avoided);
        roiDso.textContent = `${dso} days`;
        if (roiBaseBar) roiBaseBar.style.width = `${Math.max(rate * 100, 12)}%`;
        if (roiImprovedBar) roiImprovedBar.style.width = `${Math.max(improvedRate * 100, 18)}%`;
      };
      roiCalculate.addEventListener('click', (event) => { event.preventDefault(); run(); });
      [roiRevenue, roiPortfolio, roiRate, roiAgencyFee].forEach((el) => el.addEventListener('input', run, { passive: true }));
      run();
    }

    const calcForm = $('#cfoCalc');
    if (calcForm) {
      const calcAgency = $('#calcAgency');
      const calcPre = $('#calcPre');
      const calcLift = $('#calcLift');
      const calcLiftPct = $('#calcLiftPct');
      const run = () => {
        const principal = Number(calcForm.principal?.value) || 0;
        const gross = (Number(calcForm.gross?.value) || 0) / 100;
        const fee = (Number(calcForm.fee?.value) || 0) / 100;
        const accept = (Number(calcForm.accept?.value) || 0) / 100;
        const complete = (Number(calcForm.complete?.value) || 0) / 100;
        const recovery = (Number(calcForm.recovery?.value) || 0) / 100;
        const setup = Number(calcForm.setup?.value) || 0;
        const agency = principal * gross * (1 - fee);
        const pre = principal * (accept * complete * recovery) + (principal * (1 - accept * complete)) * (gross * (1 - fee)) - setup;
        const lift = pre - agency;
        const pct = agency ? (lift / agency) * 100 : 0;
        if (calcAgency) calcAgency.textContent = formatMoney(agency);
        if (calcPre) calcPre.textContent = formatMoney(pre);
        if (calcLift) calcLift.textContent = `${lift >= 0 ? '+' : '-'}${formatMoney(Math.abs(lift))}`;
        if (calcLiftPct) calcLiftPct.textContent = `${pct >= 0 ? '+' : ''}${pct.toLocaleString(undefined, { maximumFractionDigits: 1 })}%`;
      };
      $$('input', calcForm).forEach((el) => el.addEventListener('input', run, { passive: true }));
      run();
    }

    const legalMatters = $('#legalMatters');
    const legalDragHours = $('#legalDragHours');
    const legalDragRate = $('#legalDragRate');
    const legalDragOutput = $('#legalDragOutput');
    if (legalMatters && legalDragHours && legalDragRate && legalDragOutput) {
      const run = () => {
        const matters = Number(legalMatters.value) || 0;
        const hours = Number(legalDragHours.value) || 0;
        const rate = Number(legalDragRate.value) || 0;
        legalDragOutput.textContent = formatMoney(matters * hours * rate * 1.2);
      };
      [legalMatters, legalDragHours, legalDragRate].forEach((el) => el.addEventListener('input', run, { passive: true }));
      run();
    }

    const readyChronology = $('#readyChronology');
    const readyExhibits = $('#readyExhibits');
    const readySupport = $('#readySupport');
    const readyEscalation = $('#readyEscalation');
    const readyScoreOutput = $('#readyScoreOutput');
    const readyStatusOutput = $('#readyStatusOutput');
    if (readyChronology && readyExhibits && readySupport && readyEscalation && readyScoreOutput && readyStatusOutput) {
      const run = () => {
        const avg = (Number(readyChronology.value) + Number(readyExhibits.value) + Number(readySupport.value) + Number(readyEscalation.value)) / 4;
        readyScoreOutput.textContent = `${Math.round(avg)}%`;
        readyStatusOutput.textContent = avg >= 80 ? 'Counsel-ready' : avg >= 65 ? 'Structured but improvable' : 'Requires file cleanup';
      };
      [readyChronology, readyExhibits, readySupport, readyEscalation].forEach((el) => el.addEventListener('input', run, { passive: true }));
      run();
    }

    const legalFiles = $('#legalFiles');
    const legalRate = $('#legalRate');
    const legalHours = $('#legalHours');
    const legalCalc = $('#legalCalc');
    const legalExposure = $('#legalExposure');
    const legalExposureHours = $('#legalExposureHours');
    if (legalFiles && legalRate && legalHours && legalCalc && legalExposure && legalExposureHours) {
      const run = () => {
        const files = Number(legalFiles.value) || 0;
        const rate = Number(legalRate.value) || 0;
        const hours = Number(legalHours.value) || 0;
        const totalHours = files * hours;
        legalExposure.textContent = formatMoney(totalHours * rate);
        legalExposureHours.textContent = `${totalHours.toLocaleString(undefined, { maximumFractionDigits: 0 })} hrs`;
      };
      legalCalc.addEventListener('click', (event) => { event.preventDefault(); run(); });
      [legalFiles, legalRate, legalHours].forEach((el) => el.addEventListener('input', run, { passive: true }));
      run();
    }
  }

  function initSimpleDialogs() {
    const careersBtn = $('#careersMobileModal a.btn');
    if (careersBtn) {
      careersBtn.addEventListener('click', (event) => {
        event.preventDefault();
        const modal = $('#careersMobileModal');
        if (modal) {
          modal.classList.remove('open');
          modal.setAttribute('aria-hidden', 'true');
          body.classList.remove('modal-open');
          unlockScroll();
        }
        const target = $('#careersForm');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  function boot() {
    unlockScroll();
    initLanguage();
    initGate();
    initCalculators();
    initSimpleDialogs();
    window.addEventListener('pageshow', unlockScroll, { passive: true });
    window.addEventListener('focus', unlockScroll, { passive: true });
    doc.addEventListener('visibilitychange', () => {
      if (!doc.hidden) unlockScroll();
    });
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
