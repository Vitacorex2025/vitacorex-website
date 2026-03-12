(function(){
  if(window.__vcxUiShellV212) return;
  window.__vcxUiShellV212 = true;

  const menuBtn = document.querySelector('.vcx-menu-btn');
  const mobileNav = document.getElementById('vcxMobileNav');
  const mq = window.matchMedia('(max-width: 900px)');

  if(!menuBtn || !mobileNav) return;

  function setOpen(open){
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    mobileNav.hidden = !open;
    document.documentElement.classList.toggle('vcx-mobile-menu-open', open);
    if(open){
      document.documentElement.classList.remove('vcx-scroll-hide');
      document.documentElement.classList.add('vcx-scroll-compact');
    }
  }

  function closeMenu(){
    setOpen(false);
  }

  function toggleMenu(event){
    if(event) event.preventDefault();
    if(!mq.matches) return;
    setOpen(mobileNav.hidden);
  }

  setOpen(false);
  menuBtn.addEventListener('click', toggleMenu, {passive:false});
  mobileNav.querySelectorAll('a').forEach((link)=>{
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (event)=>{
    if(!mq.matches || mobileNav.hidden) return;
    const target = event.target;
    if(!(target instanceof Element)) return;
    if(target.closest('.vcx-header-mobile')) return;
    closeMenu();
  });

  document.addEventListener('keydown', (event)=>{
    if(event.key === 'Escape') closeMenu();
  });

  function sync(){
    if(!mq.matches){
      closeMenu();
    }
  }

  mq.addEventListener('change', sync);
  window.addEventListener('orientationchange', sync, {passive:true});

  let lastY = window.scrollY || 0;
  function syncScroll(){
    const y = window.scrollY || 0;
    const mobileOpen = document.documentElement.classList.contains('vcx-mobile-menu-open');
    const compact = y > 34;
    const shouldHide = !mobileOpen && y > 150 && y > lastY + 7;
    const shouldShow = y < 34 || y < lastY - 10 || mobileOpen;

    document.documentElement.classList.toggle('vcx-scroll-compact', compact || mobileOpen);

    if(shouldHide){
      document.documentElement.classList.add('vcx-scroll-hide');
    } else if(shouldShow){
      document.documentElement.classList.remove('vcx-scroll-hide');
    }

    lastY = y;
  }

  window.addEventListener('scroll', syncScroll, {passive:true});
  syncScroll();
})();

(function(){
  if(window.__vcxCalcRecoveryV213) return;
  window.__vcxCalcRecoveryV213 = true;

  const money = (n)=>{
    const value = Number.isFinite(n) ? n : 0;
    return '$' + Math.max(0, value).toLocaleString(undefined, {maximumFractionDigits:0});
  };

  function bindInputGroup(ids, handler){
    const nodes = ids.map((id)=>document.getElementById(id)).filter(Boolean);
    if(!nodes.length) return false;
    nodes.forEach((node)=>{
      if(node.dataset.vcxCalcBound === '1') return;
      node.addEventListener('input', handler);
      node.addEventListener('change', handler);
      node.dataset.vcxCalcBound = '1';
    });
    handler();
    return true;
  }

  function initExecutiveTools(){
    bindInputGroup(['leakRevenue','leakResponsibility','leakLeakage'], ()=>{
      const revenue = +(document.getElementById('leakRevenue') || {}).value || 0;
      const responsibility = (+(document.getElementById('leakResponsibility') || {}).value || 0) / 100;
      const leakage = (+(document.getElementById('leakLeakage') || {}).value || 0) / 100;
      const output = document.getElementById('leakOutput');
      if(output) output.textContent = money(revenue * responsibility * leakage);
    });

    bindInputGroup(['dsoRevenue','dsoCurrent','dsoTarget'], ()=>{
      const revenue = +(document.getElementById('dsoRevenue') || {}).value || 0;
      const current = +(document.getElementById('dsoCurrent') || {}).value || 0;
      const target = +(document.getElementById('dsoTarget') || {}).value || 0;
      const delta = Math.max(0, current - target);
      const released = (delta / 365) * revenue;
      const output = document.getElementById('dsoOutput');
      const badge = document.getElementById('dsoDelta');
      if(output) output.textContent = money(released);
      if(badge) badge.textContent = `${delta} days`;
    });

    bindInputGroup(['roiPortfolio','roiImprove','roiCost'], ()=>{
      const portfolio = +(document.getElementById('roiPortfolio') || {}).value || 0;
      const improve = (+(document.getElementById('roiImprove') || {}).value || 0) / 100;
      const cost = +(document.getElementById('roiCost') || {}).value || 0;
      const addCash = portfolio * improve;
      const multiple = cost > 0 ? (addCash / cost) : 0;
      const output = document.getElementById('roiOutput');
      const badge = document.getElementById('roiMultiple');
      if(output) output.textContent = money(addCash);
      if(badge) badge.textContent = `${multiple.toFixed(1)}x`;
    });
  }

  function initCfoCalc(){
    const form = document.getElementById('cfoCalc');
    if(!form || form.dataset.vcxCalcBound === '1') return;
    const fields = Array.from(form.querySelectorAll('input'));
    const out = {
      agency: document.getElementById('calcAgency'),
      pre: document.getElementById('calcPre'),
      lift: document.getElementById('calcLift'),
      pct: document.getElementById('calcLiftPct')
    };
    const recalc = ()=>{
      const principal = +((form.principal || {}).value) || 0;
      const gross = (+((form.gross || {}).value) || 0) / 100;
      const fee = (+((form.fee || {}).value) || 0) / 100;
      const accept = (+((form.accept || {}).value) || 0) / 100;
      const complete = (+((form.complete || {}).value) || 0) / 100;
      const recovery = (+((form.recovery || {}).value) || 0) / 100;
      const setup = +((form.setup || {}).value) || 0;
      const agency = principal * gross * (1 - fee);
      const pre = principal * (accept * complete * recovery) + (principal * (1 - accept * complete)) * (gross * (1 - fee)) - setup;
      const lift = pre - agency;
      const pct = agency ? (lift / agency * 100) : 0;
      if(out.agency) out.agency.textContent = money(agency);
      if(out.pre) out.pre.textContent = money(pre);
      if(out.lift) out.lift.textContent = (lift >= 0 ? '+' : '-') + money(Math.abs(lift));
      if(out.pct) out.pct.textContent = (pct >= 0 ? '+' : '') + pct.toLocaleString(undefined, {maximumFractionDigits:1}) + '%';
    };
    fields.forEach((field)=>{
      field.addEventListener('input', recalc);
      field.addEventListener('change', recalc);
    });
    form.dataset.vcxCalcBound = '1';
    recalc();
  }

  function initAll(){
    initExecutiveTools();
    initCfoCalc();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initAll, {once:true});
  } else {
    initAll();
  }

  document.addEventListener('click', (event)=>{
    const target = event.target;
    if(target instanceof Element && target.closest('.lang-btn')){
      setTimeout(initAll, 30);
    }
  });
})();



(function(){
  if(window.__vcxUiRepairV214) return;
  window.__vcxUiRepairV214 = true;

  const money = (n)=>{
    const value = Number.isFinite(Number(n)) ? Number(n) : 0;
    return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(Math.max(0, value));
  };

  function onReady(fn){
    if(document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', fn, {once:true});
    } else {
      fn();
    }
  }

  function bindFields(fields, handler){
    const nodes = fields.filter(Boolean);
    if(!nodes.length) return;
    nodes.forEach((node)=>{
      node.addEventListener('input', handler);
      node.addEventListener('change', handler);
    });
    handler();
  }

  function initCalculators(){
    // Revenue leakage calculator
    const leakRevenue = document.getElementById('leakRevenue');
    const leakResp = document.getElementById('leakResponsibility');
    const leakLeak = document.getElementById('leakLeakage');
    const leakOut = document.getElementById('leakOutput');
    if(leakRevenue && leakResp && leakLeak && leakOut){
      bindFields([leakRevenue, leakResp, leakLeak], ()=>{
        const revenue = +leakRevenue.value || 0;
        const responsibility = (+leakResp.value || 0) / 100;
        const leakage = (+leakLeak.value || 0) / 100;
        leakOut.textContent = money(revenue * responsibility * leakage);
      });
    }

    // DSO impact simulator
    const dsoRevenue = document.getElementById('dsoRevenue');
    const dsoCurrent = document.getElementById('dsoCurrent');
    const dsoTarget = document.getElementById('dsoTarget');
    const dsoOutput = document.getElementById('dsoOutput');
    const dsoDelta = document.getElementById('dsoDelta');
    if(dsoRevenue && dsoCurrent && dsoTarget && dsoOutput && dsoDelta){
      bindFields([dsoRevenue, dsoCurrent, dsoTarget], ()=>{
        const revenue = +dsoRevenue.value || 0;
        const current = +dsoCurrent.value || 0;
        const target = +dsoTarget.value || 0;
        const delta = Math.max(0, current - target);
        dsoOutput.textContent = money((delta / 365) * revenue);
        dsoDelta.textContent = delta + ' days';
      });
    }

    // 90-day pilot economics
    const roi90Portfolio = document.getElementById('roi90Portfolio');
    const roiImprove = document.getElementById('roiImprove');
    const roiCost = document.getElementById('roiCost');
    const roiOutput = document.getElementById('roiOutput');
    const roiMultiple = document.getElementById('roiMultiple');
    if(roi90Portfolio && roiImprove && roiCost && roiOutput && roiMultiple){
      bindFields([roi90Portfolio, roiImprove, roiCost], ()=>{
        const portfolio = +roi90Portfolio.value || 0;
        const improve = (+roiImprove.value || 0) / 100;
        const cost = +roiCost.value || 0;
        const addCash = portfolio * improve;
        const multiple = cost > 0 ? addCash / cost : 0;
        roiOutput.textContent = money(addCash);
        roiMultiple.textContent = multiple.toFixed(1) + 'x';
      });
    }

    // Estimate your revenue recovery impact
    const impactRevenue = document.getElementById('impactRevenue');
    const impactPortfolio = document.getElementById('impactPortfolio');
    const impactRecovery = document.getElementById('impactRecovery');
    const impactAdditional = document.getElementById('impactAdditional');
    const impactAvoided = document.getElementById('impactAvoided');
    const impactLift = document.getElementById('impactLift');
    if(impactRevenue && impactPortfolio && impactRecovery && impactAdditional && impactAvoided && impactLift){
      bindFields([impactRevenue, impactPortfolio, impactRecovery], ()=>{
        const revenue = +impactRevenue.value || 0;
        const portfolio = +impactPortfolio.value || 0;
        const rate = Math.min(100, Math.max(0, +impactRecovery.value || 0)) / 100;
        const uplift = rate >= 0.5 ? 0.06 : 0.13;
        const additional = portfolio * uplift;
        const avoided = additional * 0.30;
        impactAdditional.textContent = money(additional);
        impactAvoided.textContent = money(avoided);
        impactLift.textContent = Math.round(uplift * 100) + '%';
        if(revenue && portfolio > revenue * 0.6){
          impactPortfolio.value = Math.round(revenue * 0.13);
        }
      });
    }

    // Revenue recovery impact model
    const roiRevenue = document.getElementById('roiRevenue');
    const roiModelPortfolio = document.querySelector('#roiRevenue') ? document.querySelector('input#roiPortfolio') : null;
    const roiRate = document.getElementById('roiRate');
    const roiAgencyFee = document.getElementById('roiAgencyFee');
    const roiCalculate = document.getElementById('roiCalculate');
    const roiAdditional = document.getElementById('roiAdditional');
    const roiAvoided = document.getElementById('roiAvoided');
    const roiDso = document.getElementById('roiDso');
    const roiBaseBar = document.getElementById('roiBaseBar');
    const roiImprovedBar = document.getElementById('roiImprovedBar');
    const roiResult = document.getElementById('roiResult');
    function runImpactModel(){
      if(!(roiRevenue && roiModelPortfolio && roiRate && roiAgencyFee && roiAdditional && roiAvoided && roiDso && roiBaseBar && roiImprovedBar && roiResult)) return;
      const revenue = +roiRevenue.value || 0;
      const portfolio = +roiModelPortfolio.value || 0;
      const currentRate = Math.min(100, Math.max(0, +roiRate.value || 0)) / 100;
      const agencyFee = Math.min(100, Math.max(0, +roiAgencyFee.value || 0)) / 100;
      const uplift = 0.13;
      const improvedRate = Math.min(currentRate + uplift, 0.92);
      const baselineCash = portfolio * currentRate;
      const improvedCash = portfolio * improvedRate;
      const additional = Math.max(improvedCash - baselineCash, 0);
      const avoided = additional * agencyFee;
      const dsoGain = Math.max(3, Math.min(12, Math.round((portfolio / Math.max(revenue, 1)) * 28)));
      roiAdditional.textContent = money(additional);
      roiAvoided.textContent = money(avoided);
      roiDso.textContent = dsoGain + ' days';
      roiBaseBar.style.width = Math.max(12, currentRate * 100) + '%';
      roiImprovedBar.style.width = Math.max(18, improvedRate * 100) + '%';
      roiResult.innerHTML = '<strong>Illustrative impact</strong><p>Based on the inputs provided, a structured recovery layer could directionally improve retained cash by <b>' + money(additional) + '</b>, avoid approximately <b>' + money(avoided) + '</b> in contingency leakage, and support a potential <b>' + dsoGain + '-day</b> improvement in cash velocity.</p>';
    }
    if(roiRevenue && roiModelPortfolio && roiRate && roiAgencyFee){
      bindFields([roiRevenue, roiModelPortfolio, roiRate, roiAgencyFee], runImpactModel);
      if(roiCalculate && !roiCalculate.dataset.vcxBound){
        roiCalculate.addEventListener('click', runImpactModel);
        roiCalculate.dataset.vcxBound = '1';
      }
    }

    // Diagnostic recommender
    const diagIndustry = document.getElementById('diagIndustry');
    const diagComplexity = document.getElementById('diagComplexity');
    const diagDocs = document.getElementById('diagDocs');
    const diagPain = document.getElementById('diagPain');
    const diagEvaluate = document.getElementById('diagEvaluate');
    const diagResult = document.getElementById('diagResult');
    function runDiagnostic(){
      if(!(diagIndustry && diagComplexity && diagDocs && diagPain && diagResult)) return;
      const industry = diagIndustry.value;
      const complexity = diagComplexity.value;
      const docs = diagDocs.value;
      const pain = diagPain.value;
      let recommendation = 'Begin with recovery infrastructure review.';
      if((docs === 'weak' && pain === 'counsel') || (docs === 'weak' && complexity !== 'standard')){
        recommendation = 'Begin with corporate legal file control and documentation governance.';
      } else if((pain === 'recovery' && complexity !== 'standard') || pain === 'agency'){
        recommendation = 'Begin with revenue recovery infrastructure and a tightly scoped 90-day pilot.';
      }
      diagResult.innerHTML = '<strong>Recommended engagement path</strong><p><b>' + recommendation + '</b> This reflects the current combination of documentation quality, operational complexity, and recovery pressure selected in the diagnostic.</p>';
    }
    if(diagIndustry && diagComplexity && diagDocs && diagPain && diagResult){
      bindFields([diagIndustry, diagComplexity, diagDocs, diagPain], runDiagnostic);
      if(diagEvaluate && !diagEvaluate.dataset.vcxBound){
        diagEvaluate.addEventListener('click', runDiagnostic);
        diagEvaluate.dataset.vcxBound = '1';
      }
    }
  }

  function initCharts(){
    const recoveryChart = document.getElementById('recoveryChart');
    const velocityChart = document.getElementById('velocityChart');
    const kpiWrap = document.getElementById('vcxKpiCharts');
    if(!recoveryChart && !velocityChart) return;

    const draw = ()=>{
      if(!window.Chart) return false;
      if(recoveryChart && !recoveryChart.dataset.vcxReady){
        recoveryChart.dataset.vcxReady = '1';
        new Chart(recoveryChart.getContext('2d'), {
          type:'line',
          data:{
            labels:['0-30','30-60','60-90','90-120','120+'],
            datasets:[{label:'Recovery probability',data:[90,70,50,30,15],borderColor:'#6ee7c8',backgroundColor:'rgba(110,231,200,.14)',fill:true,tension:.35}]
          },
          options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,max:100},x:{grid:{display:false}}}}
        });
      }
      if(velocityChart && !velocityChart.dataset.vcxReady){
        velocityChart.dataset.vcxReady = '1';
        new Chart(velocityChart.getContext('2d'), {
          type:'bar',
          data:{
            labels:['Baseline','Target'],
            datasets:[{label:'DSO',data:[52,44],backgroundColor:['rgba(255,255,255,.28)','rgba(110,231,200,.78)'],borderRadius:10}]
          },
          options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true}}}
        });
      }
      return true;
    };

    if(draw()) return;
    window.addEventListener('load', ()=>{ 
      if(!draw() && kpiWrap){
        kpiWrap.classList.add('vcx-kpi-empty');
      }
    }, {once:true});
  }

  onReady(()=>{
    initCalculators();
    initCharts();
  });

  document.addEventListener('click', (event)=>{
    const t = event.target;
    if(t instanceof Element && t.closest('.lang-btn')){
      setTimeout(()=>{
        initCalculators();
        initCharts();
      }, 40);
    }
  });
})();
