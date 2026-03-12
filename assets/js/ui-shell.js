
(function(){
  if(window.__VCX_SHELL_V216__) return;
  window.__VCX_SHELL_V216__ = true;

  const doc = document;
  const root = document.documentElement;
  const common = window.SITE_I18N || {};
  const pageData = window.PAGE_DATA || {};

  const safeOn = (el, type, handler, opts) => {
    if(!el) return;
    el.addEventListener(type, handler, opts);
  };

  function currentLang(){
    try{
      const stored = localStorage.getItem('vcx_lang');
      return ['en','ru','es'].includes(stored) ? stored : 'en';
    }catch(_){
      return 'en';
    }
  }

  function textForCommon(lang, key){
    return (common[lang] && common[lang][key]) || (common.en && common.en[key]) || '';
  }

  function textForPage(lang, key){
    return (pageData[lang] && pageData[lang][key]) || (pageData.en && pageData.en[key]) || '';
  }

  function applyText(lang){
    doc.querySelectorAll('[data-common]').forEach((el)=>{
      const value = textForCommon(lang, el.getAttribute('data-common'));
      if(value) el.textContent = value;
    });
    doc.querySelectorAll('[data-page]').forEach((el)=>{
      const value = textForPage(lang, el.getAttribute('data-page'));
      if(value) el.textContent = value;
    });
    doc.querySelectorAll('.lang-btn').forEach((btn)=>{
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
  }

  function initLangButtons(){
    const buttons = Array.from(doc.querySelectorAll('.lang-btn'));
    if(!buttons.length) return;
    buttons.forEach((btn)=>{
      if(btn.dataset.vcxBound) return;
      btn.dataset.vcxBound = '1';
      btn.addEventListener('click', ()=>{
        try{ localStorage.setItem('vcx_lang', btn.dataset.lang || 'en'); }catch(_){}
        applyText(currentLang());
      });
    });
    applyText(currentLang());
  }

  function initClocks(){
    const fmt = (date, tz) => new Intl.DateTimeFormat([], {
      hour:'2-digit',
      minute:'2-digit',
      hour12:false,
      timeZone:tz
    }).format(date);

    function tick(){
      const now = new Date();
      const local = new Intl.DateTimeFormat([], {hour:'2-digit', minute:'2-digit', hour12:false}).format(now);
      doc.querySelectorAll('.clock-vcx').forEach((el)=>{ el.textContent = fmt(now, 'America/New_York'); });
      doc.querySelectorAll('.clock-local').forEach((el)=>{ el.textContent = local; });
    }
    tick();
    setInterval(tick, 1000);
  }

  function initMobileMenu(){
    const header = doc.querySelector('.vcx-header');
    const mobileWrap = doc.querySelector('.vcx-header-mobile');
    const btn = doc.querySelector('.vcx-menu-btn');
    const nav = doc.getElementById('vcxMobileNav');
    const mq = window.matchMedia('(max-width: 900px)');
    if(!btn || !nav || !mobileWrap) return;

    function setOpen(open){
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      nav.hidden = !open;
      mobileWrap.classList.toggle('is-open', open);
      root.classList.toggle('vcx-mobile-menu-open', open);
      if(header){
        header.classList.remove('is-hidden');
        header.classList.toggle('is-compact', open || (window.scrollY || 0) > 24);
      }
    }

    setOpen(false);

    if(!btn.dataset.vcxBound){
      btn.dataset.vcxBound = '1';
      btn.addEventListener('click', (event)=>{
        event.preventDefault();
        event.stopPropagation();
        if(!mq.matches) return;
        setOpen(nav.hidden);
      }, {passive:false});
    }

    nav.querySelectorAll('a').forEach((link)=>{
      if(link.dataset.vcxBound) return;
      link.dataset.vcxBound = '1';
      link.addEventListener('click', ()=> setOpen(false));
    });

    safeOn(document, 'click', (event)=>{
      if(!mq.matches || nav.hidden) return;
      const target = event.target;
      if(!(target instanceof Element)) return;
      if(target.closest('.vcx-header-mobile')) return;
      setOpen(false);
    });

    safeOn(document, 'keydown', (event)=>{
      if(event.key === 'Escape') setOpen(false);
    });

    if(!mq.__vcxBound){
      mq.__vcxBound = true;
      mq.addEventListener('change', ()=>{
        if(!mq.matches) setOpen(false);
      });
    }
  }

  function initHeaderScroll(){
    const header = doc.querySelector('.vcx-header');
    if(!header) return;
    let lastY = window.scrollY || 0;

    function onScroll(){
      const y = window.scrollY || 0;
      const menuOpen = root.classList.contains('vcx-mobile-menu-open');
      header.classList.toggle('is-compact', y > 24 || menuOpen);
      if(menuOpen){
        header.classList.remove('is-hidden');
        lastY = y;
        return;
      }
      if(y > 170 && y > lastY + 6){
        header.classList.add('is-hidden');
      } else if(y < 64 || y < lastY - 8){
        header.classList.remove('is-hidden');
      }
      lastY = y;
    }
    onScroll();
    window.addEventListener('scroll', onScroll, {passive:true});
  }

  function money(n){
    const safe = Number.isFinite(n) ? n : 0;
    return '$' + Math.max(0, safe).toLocaleString(undefined, {maximumFractionDigits:0});
  }

  function bindInputCalc(ids, compute){
    const inputs = ids.map((id)=>doc.getElementById(id)).filter(Boolean);
    if(!inputs.length) return;
    const run = ()=> compute();
    inputs.forEach((input)=>{
      if(input.dataset.vcxCalcBound) return;
      input.dataset.vcxCalcBound = '1';
      input.addEventListener('input', run);
      input.addEventListener('change', run);
    });
    run();
  }

  function initExecutiveCalculators(){
    bindInputCalc(['leakRevenue','leakResponsibility','leakLeakage'], ()=>{
      const revenue = +(doc.getElementById('leakRevenue')?.value || 0);
      const responsibility = +(doc.getElementById('leakResponsibility')?.value || 0) / 100;
      const leakage = +(doc.getElementById('leakLeakage')?.value || 0) / 100;
      const output = doc.getElementById('leakOutput');
      if(output) output.textContent = money(revenue * responsibility * leakage);
    });

    bindInputCalc(['dsoRevenue','dsoCurrent','dsoTarget'], ()=>{
      const revenue = +(doc.getElementById('dsoRevenue')?.value || 0);
      const current = +(doc.getElementById('dsoCurrent')?.value || 0);
      const target = +(doc.getElementById('dsoTarget')?.value || 0);
      const delta = Math.max(0, current - target);
      const released = (delta / 365) * revenue;
      const output = doc.getElementById('dsoOutput');
      const deltaOut = doc.getElementById('dsoDelta');
      if(output) output.textContent = money(released);
      if(deltaOut) deltaOut.textContent = `${delta} days`;
    });

    bindInputCalc(['roi90Portfolio','roiImprove','roiCost'], ()=>{
      const portfolio = +(doc.getElementById('roi90Portfolio')?.value || 0);
      const improve = +(doc.getElementById('roiImprove')?.value || 0) / 100;
      const cost = +(doc.getElementById('roiCost')?.value || 0);
      const additional = portfolio * improve;
      const multiple = cost > 0 ? additional / cost : 0;
      const out = doc.getElementById('roiOutput');
      const mult = doc.getElementById('roiMultiple');
      if(out) out.textContent = money(additional);
      if(mult) mult.textContent = `${multiple.toFixed(1)}x`;
    });

    bindInputCalc(['impactRevenue','impactPortfolio','impactRecovery'], ()=>{
      const revenue = +(doc.getElementById('impactRevenue')?.value || 0);
      const portfolio = +(doc.getElementById('impactPortfolio')?.value || 0);
      const rate = +(doc.getElementById('impactRecovery')?.value || 0);
      const improved = Math.min(100, rate + 8);
      const additional = portfolio * ((improved - rate) / 100);
      const avoided = additional * .30;
      const dso = revenue > 0 ? Math.max(1, Math.round((additional / revenue) * 365)) : 0;
      const out1 = doc.getElementById('impactAdditional');
      const out2 = doc.getElementById('impactAvoided');
      const out3 = doc.getElementById('impactLift');
      if(out1) out1.textContent = money(additional);
      if(out2) out2.textContent = money(avoided);
      if(out3) out3.textContent = `${Math.max(0, improved - rate).toFixed(0)}%`;
      const dsoEl = doc.getElementById('impactDso');
      if(dsoEl) dsoEl.textContent = `${dso} days`;
    });

    const roiBtn = doc.getElementById('roiCalculate');
    const roiRun = ()=>{
      const revenue = +(doc.getElementById('roiRevenue')?.value || 0);
      const portfolio = +(doc.getElementById('roiPortfolio')?.value || 0);
      const rate = +(doc.getElementById('roiRate')?.value || 0);
      const fee = +(doc.getElementById('roiAgencyFee')?.value || 0) / 100;
      const improved = Math.min(100, rate + 10);
      const additional = portfolio * ((improved - rate) / 100);
      const avoided = additional * fee;
      const dso = revenue > 0 ? Math.max(1, Math.round((additional / revenue) * 365)) : 0;
      const addOut = doc.getElementById('roiAdditional');
      const avoidOut = doc.getElementById('roiAvoided');
      const dsoOut = doc.getElementById('roiDso');
      const baseBar = doc.getElementById('roiBaseBar');
      const improvedBar = doc.getElementById('roiImprovedBar');
      if(addOut) addOut.textContent = money(additional);
      if(avoidOut) avoidOut.textContent = money(avoided);
      if(dsoOut) dsoOut.textContent = `${dso} days`;
      if(baseBar) baseBar.style.width = `${Math.max(10, Math.min(100, rate))}%`;
      if(improvedBar) improvedBar.style.width = `${Math.max(12, Math.min(100, improved))}%`;
    };
    ['roiRevenue','roiPortfolio','roiRate','roiAgencyFee'].forEach((id)=>{
      const input = doc.getElementById(id);
      if(input && !input.dataset.vcxCalcBound){
        input.dataset.vcxCalcBound = '1';
        input.addEventListener('input', roiRun);
        input.addEventListener('change', roiRun);
      }
    });
    if(roiBtn && !roiBtn.dataset.vcxCalcBound){
      roiBtn.dataset.vcxCalcBound = '1';
      roiBtn.addEventListener('click', roiRun);
    }
    roiRun();
  }

  function initRevenueWorkflowCalc(){
    const form = doc.getElementById('cfoCalc');
    if(!form) return;
    const inputs = Array.from(form.querySelectorAll('input'));
    const run = ()=>{
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
      const a = doc.getElementById('calcAgency');
      const b = doc.getElementById('calcPre');
      const c = doc.getElementById('calcLift');
      const d = doc.getElementById('calcLiftPct');
      if(a) a.textContent = money(agency);
      if(b) b.textContent = money(structured);
      if(c) c.textContent = (lift >= 0 ? '+' : '-') + money(Math.abs(lift));
      if(d) d.textContent = `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`;
    };
    inputs.forEach((input)=>{
      if(input.dataset.vcxCalcBound) return;
      input.dataset.vcxCalcBound = '1';
      input.addEventListener('input', run);
      input.addEventListener('change', run);
    });
    run();
  }

  function initLegalCalculators(){
    const costBtn = doc.getElementById('legalCalc');
    const costRun = ()=>{
      const files = +(doc.getElementById('legalFiles')?.value || 0);
      const rate = +(doc.getElementById('legalRate')?.value || 0);
      const hours = +(doc.getElementById('legalHours')?.value || 0);
      const exposure = files * rate * hours;
      const totalHours = files * hours;
      const out = doc.getElementById('legalExposure');
      const hoursOut = doc.getElementById('legalExposureHours');
      if(out) out.textContent = money(exposure);
      if(hoursOut) hoursOut.textContent = `${Math.round(totalHours).toLocaleString()} hrs`;
    };
    ['legalFiles','legalRate','legalHours'].forEach((id)=>{
      const el = doc.getElementById(id);
      if(el && !el.dataset.vcxCalcBound){
        el.dataset.vcxCalcBound = '1';
        el.addEventListener('input', costRun);
        el.addEventListener('change', costRun);
      }
    });
    if(costBtn && !costBtn.dataset.vcxCalcBound){
      costBtn.dataset.vcxCalcBound = '1';
      costBtn.addEventListener('click', costRun);
    }
    costRun();

    const dragRun = ()=>{
      const matters = +(doc.getElementById('legalMatters')?.value || 0);
      const hours = +(doc.getElementById('legalDragHours')?.value || 0);
      const rate = +(doc.getElementById('legalDragRate')?.value || 0);
      const annual = matters * hours * rate * 12;
      const out = doc.getElementById('legalDragOutput');
      if(out) out.textContent = money(annual);
    };
    ['legalMatters','legalDragHours','legalDragRate'].forEach((id)=>{
      const el = doc.getElementById(id);
      if(el && !el.dataset.vcxCalcBound){
        el.dataset.vcxCalcBound = '1';
        el.addEventListener('input', dragRun);
        el.addEventListener('change', dragRun);
      }
    });
    dragRun();

    const readyRun = ()=>{
      const values = ['readyChronology','readyExhibits','readySupport','readyEscalation']
        .map((id)=> +(doc.getElementById(id)?.value || 0))
        .filter((n)=> Number.isFinite(n));
      if(!values.length) return;
      const score = values.reduce((a,b)=>a+b,0) / values.length;
      const fill = doc.getElementById('readyMeterFill');
      const out1 = doc.getElementById('readyScoreOutput');
      const out2 = doc.getElementById('readyStatusOutput');
      if(fill) fill.style.width = `${score}%`;
      if(out1) out1.textContent = `${Math.round(score)}%`;
      if(out2){
        out2.textContent = score >= 80 ? 'Litigation-ready' : score >= 65 ? 'Structured but improvable' : 'Needs file reconstruction';
      }
    };
    ['readyChronology','readyExhibits','readySupport','readyEscalation'].forEach((id)=>{
      const el = doc.getElementById(id);
      if(el && !el.dataset.vcxCalcBound){
        el.dataset.vcxCalcBound = '1';
        el.addEventListener('input', readyRun);
        el.addEventListener('change', readyRun);
      }
    });
    readyRun();
  }

  function renderIntakeOutput(){
    const boxes = Array.from(doc.querySelectorAll('#intakeOutput'));
    if(!boxes.length) return;
    boxes.forEach((box)=>{
      box.innerHTML = `
        <ul class="vcx-output-list">
          <li class="vcx-output-item"><div><strong>Recommended service line</strong></div><span>Structured intake review</span></li>
          <li class="vcx-output-item"><div><strong>Routing confidence</strong></div><span>Assigned after the required fields are complete</span></li>
          <li class="vcx-output-item"><div><strong>What to send now</strong></div><span>Contract, invoice, payment history, screenshots, and any prior notices</span></li>
          <li class="vcx-output-item"><div><strong>Response window</strong></div><span>24–48 business hours after a complete intake</span></li>
          <li class="vcx-output-item"><div><strong>Recommended next step</strong></div><span>Routing review, document gap check, and consultation handoff</span></li>
        </ul>
        <p class="small-note">This summary becomes more specific as the intake is completed. It is not legal advice.</p>
      `;
    });
  }

  function init(){
    initLangButtons();
    initClocks();
    initMobileMenu();
    initHeaderScroll();
    initExecutiveCalculators();
    initRevenueWorkflowCalc();
    initLegalCalculators();
    renderIntakeOutput();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init, {once:true});
  } else {
    init();
  }
})();
