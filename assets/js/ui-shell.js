
(() => {
  if (window.__VCX_SHELL_BOOTED__) return;
  window.__VCX_SHELL_BOOTED__ = true;

  const doc = document;
  const root = doc.documentElement;
  const body = doc.body;

  const q = (s, c = doc) => c.querySelector(s);
  const qa = (s, c = doc) => Array.from(c.querySelectorAll(s));

  function money(value){
    const n = Number(value) || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(n);
  }

  function restoreNativeScroll(){
    if (!body) return;
    if (!body.classList.contains('modal-open')) {
      body.classList.remove('vcx-lock-scroll');
      body.style.overflow = '';
      body.style.overflowY = 'auto';
      body.style.position = '';
      body.style.top = '';
      body.style.width = '';
      root.style.overflow = '';
      root.style.overflowY = 'auto';
      root.style.position = '';
      root.style.top = '';
      root.style.height = '';
    }
  }

  function bindCalc(ids, run){
    const nodes = ids.map((id) => doc.getElementById(id)).filter(Boolean);
    if (!nodes.length) return;
    nodes.forEach((node) => {
      if (node.dataset.vcxCalcBound === '1') return;
      node.dataset.vcxCalcBound = '1';
      node.addEventListener('input', run);
      node.addEventListener('change', run);
    });
    run();
  }

  function initClocks(){
    const vcx = qa('.clock-vcx');
    const local = qa('.clock-local');
    if (!vcx.length && !local.length) return;
    if (window.__vcxClockTimer) window.clearInterval(window.__vcxClockTimer);

    const fmtVcx = new Intl.DateTimeFormat([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'America/New_York'
    });
    const fmtLocal = new Intl.DateTimeFormat([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    const tick = () => {
      const now = new Date();
      const ny = fmtVcx.format(now);
      const here = fmtLocal.format(now);
      vcx.forEach((el) => el.textContent = ny);
      local.forEach((el) => el.textContent = here);
    };
    tick();
    window.__vcxClockTimer = window.setInterval(tick, 1000);
  }

  function initStatusRibbon(){
    const tracks = qa('.vcx-status-track');
    if (!tracks.length) return;
    const item = 'Recovery readiness';
    tracks.forEach((track) => {
      const first = track.querySelector('.vcx-status-item');
      if (first) first.textContent = item;
    });
  }

  function reorderMobileHeader(){
    const mobile = q('.vcx-header-mobile');
    if (!mobile) return;
    const meta = q('.vcx-mobile-meta', mobile);
    const row = q('.vcx-mobile-row', mobile);
    const ribbon = q('.vcx-status-ribbon-mobile', mobile);
    const nav = q('.vcx-mobile-nav', mobile);
    if (meta && row && ribbon && nav) {
      mobile.append(meta, row, ribbon, nav);
    }
  }

  function initMobileMenu(){
    const header = q('.vcx-header');
    const wrap = q('.vcx-header-mobile');
    const btn = q('.vcx-menu-btn');
    const nav = q('#vcxMobileNav');
    const mq = window.matchMedia('(max-width: 900px)');
    if (!wrap || !btn || !nav) return;

    const setOpen = (open) => {
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      nav.hidden = !open;
      wrap.classList.toggle('is-open', open);
      root.classList.toggle('vcx-mobile-menu-open', open);
      if (header) {
        header.classList.remove('is-hidden');
        header.classList.toggle('is-compact', open || window.scrollY > 24);
      }
      if (!open) restoreNativeScroll();
    };

    setOpen(false);

    if (btn.dataset.vcxBound !== '1') {
      btn.dataset.vcxBound = '1';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!mq.matches) return;
        setOpen(nav.hidden);
      });
    }

    qa('a', nav).forEach((link) => {
      if (link.dataset.vcxBound === '1') return;
      link.dataset.vcxBound = '1';
      link.addEventListener('click', () => setOpen(false));
    });

    if (doc.documentElement.dataset.vcxMenuDocBound !== '1') { doc.documentElement.dataset.vcxMenuDocBound = '1'; doc.addEventListener('click', (e) => {
      if (!mq.matches || nav.hidden) return;
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (target.closest('.vcx-header-mobile')) return;
      setOpen(false);
    }); }

    if (doc.documentElement.dataset.vcxMenuKeyBound !== '1') { doc.documentElement.dataset.vcxMenuKeyBound = '1'; doc.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setOpen(false);
    }); }

    if (!btn.dataset.vcxMqBound) { btn.dataset.vcxMqBound = '1'; mq.addEventListener('change', () => {
      if (!mq.matches) setOpen(false);
    }); }
  }

  function initHeaderScroll(){
    const header = q('.vcx-header');
    if (!header) return;

    const desktopMq = window.matchMedia('(min-width: 901px)');
    let lastY = window.scrollY || 0;

    const update = () => {
      const y = window.scrollY || 0;
      const menuOpen = root.classList.contains('vcx-mobile-menu-open');
      const compact = y > 18 || menuOpen;
      header.classList.toggle('is-compact', compact);

      if (menuOpen || !desktopMq.matches) {
        header.classList.remove('is-hidden');
        lastY = y;
        return;
      }

      const goingDown = y > lastY + 14;
      const goingUp = y < lastY - 14;

      if (y > 260 && goingDown) header.classList.add('is-hidden');
      if (y < 120 || goingUp) header.classList.remove('is-hidden');

      lastY = y;
    };

    update();
    if (!window.__vcxHeaderScrollBound) {
      window.__vcxHeaderScrollBound = true;
      window.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update, { passive: true });
      desktopMq.addEventListener('change', update);
    }
  }

  function initExecutiveCalculators(){
    bindCalc(['leakRevenue','leakResponsibility','leakLeakage'], () => {
      const revenue = +(q('#leakRevenue')?.value || 0);
      const responsibility = +(q('#leakResponsibility')?.value || 0) / 100;
      const leakage = +(q('#leakLeakage')?.value || 0) / 100;
      const out = q('#leakOutput');
      if (out) out.textContent = money(revenue * responsibility * leakage);
    });

    bindCalc(['dsoRevenue','dsoCurrent','dsoTarget'], () => {
      const revenue = +(q('#dsoRevenue')?.value || 0);
      const current = +(q('#dsoCurrent')?.value || 0);
      const target = +(q('#dsoTarget')?.value || 0);
      const delta = Math.max(0, current - target);
      const released = (delta / 365) * revenue;
      const out1 = q('#dsoOutput');
      const out2 = q('#dsoDelta');
      if (out1) out1.textContent = money(released);
      if (out2) out2.textContent = `${delta} days`;
    });

    bindCalc(['roi90Portfolio','roiImprove','roiCost'], () => {
      const portfolio = +(q('#roi90Portfolio')?.value || 0);
      const improve = +(q('#roiImprove')?.value || 0) / 100;
      const cost = +(q('#roiCost')?.value || 0);
      const additional = portfolio * improve;
      const multiple = cost > 0 ? additional / cost : 0;
      const out1 = q('#roiOutput');
      const out2 = q('#roiMultiple');
      if (out1) out1.textContent = money(additional);
      if (out2) out2.textContent = `${multiple.toFixed(1)}x`;
    });

    bindCalc(['impactRevenue','impactPortfolio','impactRecovery'], () => {
      const revenue = +(q('#impactRevenue')?.value || 0);
      const portfolio = +(q('#impactPortfolio')?.value || 0);
      const rate = +(q('#impactRecovery')?.value || 0);
      const improved = Math.min(100, rate + 8);
      const additional = portfolio * ((improved - rate) / 100);
      const avoided = additional * 0.3;
      const dso = revenue > 0 ? Math.max(1, Math.round((additional / revenue) * 365)) : 0;
      const out1 = q('#impactAdditional');
      const out2 = q('#impactAvoided');
      const out3 = q('#impactLift');
      const out4 = q('#impactDso');
      if (out1) out1.textContent = money(additional);
      if (out2) out2.textContent = money(avoided);
      if (out3) out3.textContent = `${Math.max(0, improved - rate).toFixed(0)}%`;
      if (out4) out4.textContent = `${dso} days`;
    });

    const roiBtn = q('#roiCalculate');
    const roiRun = () => {
      const revenue = +(q('#roiRevenue')?.value || 0);
      const portfolio = +(q('#roiPortfolio')?.value || 0);
      const rate = +(q('#roiRate')?.value || 0);
      const fee = +(q('#roiAgencyFee')?.value || 0) / 100;
      const improved = Math.min(100, rate + 10);
      const additional = portfolio * ((improved - rate) / 100);
      const avoided = additional * fee;
      const dso = revenue > 0 ? Math.max(1, Math.round((additional / revenue) * 365)) : 0;
      const addOut = q('#roiAdditional');
      const avoidOut = q('#roiAvoided');
      const dsoOut = q('#roiDso');
      const baseBar = q('#roiBaseBar');
      const improvedBar = q('#roiImprovedBar');
      const result = q('#roiResult');
      if (addOut) addOut.textContent = money(additional);
      if (avoidOut) avoidOut.textContent = money(avoided);
      if (dsoOut) dsoOut.textContent = `${dso} days`;
      if (result) {
        const p = result.querySelector('p');
        if (p) p.textContent = `Additional recovered cash ${money(additional)}, avoided contingency fees ${money(avoided)}, and an estimated ${dso}-day DSO gain.`;
      }
      if (baseBar) baseBar.style.width = `${Math.max(10, Math.min(100, rate))}%`;
      if (improvedBar) improvedBar.style.width = `${Math.max(18, Math.min(100, improved))}%`;
    };
    if (roiBtn && roiBtn.dataset.vcxCalcBound !== '1') {
      roiBtn.dataset.vcxCalcBound = '1';
      roiBtn.addEventListener('click', (e) => {
        e.preventDefault();
        roiRun();
      });
    }
    bindCalc(['roiRevenue','roiPortfolio','roiRate','roiAgencyFee'], roiRun);
  }

  function initRevenueWorkflowCalc(){
    const form = q('#cfoCalc');
    if (!form) return;
    const run = () => {
      const principal = +(form.querySelector('[name="principal"]')?.value || 0);
      const gross = +(form.querySelector('[name="gross"]')?.value || 0) / 100;
      const fee = +(form.querySelector('[name="fee"]')?.value || 0) / 100;
      const accept = +(form.querySelector('[name="accept"]')?.value || 0) / 100;
      const complete = +(form.querySelector('[name="complete"]')?.value || 0) / 100;
      const recovery = +(form.querySelector('[name="recovery"]')?.value || 0) / 100;
      const setup = +(form.querySelector('[name="setup"]')?.value || 0);
      const agency = principal * gross * (1 - fee);
      const structured = principal * (accept * complete * recovery) + (principal * (1 - accept * complete)) * (gross * (1 - fee)) - setup;
      const lift = structured - agency;
      const pct = agency > 0 ? (lift / agency) * 100 : 0;
      const a = q('#calcAgency'), b = q('#calcPre'), c = q('#calcLift'), d = q('#calcLiftPct');
      if (a) a.textContent = money(agency);
      if (b) b.textContent = money(structured);
      if (c) c.textContent = (lift >= 0 ? '+' : '-') + money(Math.abs(lift));
      if (d) d.textContent = `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`;
    };
    qa('input', form).forEach((input) => {
      if (input.dataset.vcxCalcBound === '1') return;
      input.dataset.vcxCalcBound = '1';
      input.addEventListener('input', run);
      input.addEventListener('change', run);
    });
    run();
  }

  function initLegalCalculators(){
    const costRun = () => {
      const files = +(q('#legalFiles')?.value || 0);
      const rate = +(q('#legalRate')?.value || 0);
      const hours = +(q('#legalHours')?.value || 0);
      const exposure = files * rate * hours;
      const totalHours = files * hours;
      const out = q('#legalExposure');
      const hrs = q('#legalExposureHours');
      if (out) out.textContent = money(exposure);
      if (hrs) hrs.textContent = `${Math.round(totalHours).toLocaleString()} hrs`;
    };
    bindCalc(['legalFiles','legalRate','legalHours'], costRun);

    bindCalc(['legalMatters','legalDragHours','legalDragRate'], () => {
      const matters = +(q('#legalMatters')?.value || 0);
      const hours = +(q('#legalDragHours')?.value || 0);
      const rate = +(q('#legalDragRate')?.value || 0);
      const annual = matters * hours * rate * 12;
      const out = q('#legalDragOutput');
      if (out) out.textContent = money(annual);
    });

    bindCalc(['readyChronology','readyExhibits','readySupport','readyEscalation'], () => {
      const ids = ['readyChronology','readyExhibits','readySupport','readyEscalation'];
      const values = ids.map((id) => +(q('#' + id)?.value || 0)).filter((n) => Number.isFinite(n));
      if (!values.length) return;
      const score = values.reduce((a,b) => a+b, 0) / values.length;
      const fill = q('#readyMeterFill');
      const out1 = q('#readyScoreOutput');
      const out2 = q('#readyStatusOutput');
      if (fill) fill.style.width = `${score}%`;
      if (out1) out1.textContent = `${Math.round(score)}%`;
      if (out2) out2.textContent = score >= 80 ? 'Litigation-ready' : score >= 65 ? 'Structured but improvable' : 'Needs file reconstruction';
    });
  }

  function renderIntakeOutput(){
    qa('#intakeOutput').forEach((box) => {
      if (box.dataset.vcxFilled === '1') return;
      const hasStructured = box.querySelector('.vcx-output-list');
      const current = box.textContent.replace(/\s+/g, ' ').trim();
      if (hasStructured || current.length > 120) return;
      box.dataset.vcxFilled = '1';
      box.innerHTML = `
        <ul class="vcx-output-list">
          <li class="vcx-output-item"><div><strong>Recommended service line</strong></div><span>Structured intake review matched to the route and urgency selected in the form.</span></li>
          <li class="vcx-output-item"><div><strong>Routing confidence</strong></div><span>Updated after the required fields, service type, and urgency are complete.</span></li>
          <li class="vcx-output-item"><div><strong>What to send now</strong></div><span>Contract, invoice, payment history, screenshots, notices, and any file references already available.</span></li>
          <li class="vcx-output-item"><div><strong>Response window</strong></div><span>24–48 business hours after a complete intake and usable supporting material.</span></li>
          <li class="vcx-output-item"><div><strong>Recommended next step</strong></div><span>Routing review, document gap check, and consultation handoff to the correct workstream.</span></li>
        </ul>
        <p class="small-note">This summary becomes more specific as the intake is completed. It is not legal advice.</p>
      `;
    });
  }

  function markSingleHero(){
    qa('.hero-grid').forEach((grid) => {
      const side = q('.hero-side', grid);
      if (!side) {
        grid.classList.add('hero-grid-single');
        return;
      }
      const useful = side.querySelector('button,input,select,textarea,.widget-card,.card,.chart,.output-panel,.kpi-board,.kpi-card,.glass-card,.metric-card');
      if (!useful) {
        grid.classList.add('hero-grid-single');
        side.remove();
      }
    });
  }

  function boot(){
    if (window.__vcxShellBooted) return;
    window.__vcxShellBooted = true;
    restoreNativeScroll();
    initClocks();
    initStatusRibbon();
    reorderMobileHeader();
    initMobileMenu();
    initHeaderScroll();
    initExecutiveCalculators();
    initRevenueWorkflowCalc();
    initLegalCalculators();
    renderIntakeOutput();
    markSingleHero();
    window.addEventListener('pageshow', restoreNativeScroll, { passive: true });
    window.addEventListener('focus', restoreNativeScroll, { passive: true });
    window.addEventListener('resize', restoreNativeScroll, { passive: true });
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) restoreNativeScroll();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
