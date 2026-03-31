(function(){
  var api = window.DocketMintApi;
  var i18n = window.VCXI18n;
  if(!api){ return; }

  var state = { session: null };

  function q(selector){ return document.querySelector(selector); }
  function t(key, fallback){ return i18n ? i18n.t(key, fallback) : (fallback || key); }
  function params(){
    try { return new URLSearchParams(window.location.search || ''); }
    catch (error){ return new URLSearchParams(''); }
  }
  function currentLocale(){
    var locale = i18n && i18n.getLocale ? i18n.getLocale() : 'en';
    if(locale === 'ru'){ return 'ru-RU'; }
    if(locale === 'es'){ return 'es-ES'; }
    return 'en-US';
  }

  function money(value){
    if(value === null || value === undefined || value === ''){ return '-'; }
    var num = Number(value);
    if(!isFinite(num)){ return '-'; }
    try {
      return new Intl.NumberFormat(currentLocale(), {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(num);
    } catch (error){
      return '$' + num.toFixed(2);
    }
  }

  function text(selector, value){
    var node = q(selector);
    if(node){
      node.textContent = (value === null || value === undefined || value === '') ? '-' : String(value);
    }
  }

  function htmlEscape(value){
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function render(){
    var session = state.session;
    var analysis = (session && session.analysis) || {};
    var vehicle = ((session && session.vin_report) || {}).vehicle || {};

    text('[data-vin-value]', session ? session.vin : '-');
    text('[data-vehicle-value]', [vehicle.year, vehicle.make, vehicle.model, vehicle.trim].filter(Boolean).join(' ') || '-');
    text('[data-mileage-value]', session ? (session.mileage == null ? '-' : session.mileage) : '-');
    text('[data-asking-price-value]', money(session ? session.asking_price : null));
    text('[data-contract-price]', money(analysis.contract_vehicle_price));
    text('[data-dealer-list-price]', money(analysis.dealer_listing_price));
    text('[data-recommended-price]', money(analysis.recommended_possible_price));
    text('[data-possible-savings]', money(analysis.possible_savings_vs_contract_vehicle_price));
    text('[data-addon-total]', money(analysis.optional_add_ons_total));
    text('[data-estimate-mid]', money(analysis.estimated_market_value));
    text('[data-estimate-confidence]', analysis.estimate_confidence || '-');
    text('[data-estimate-method]', analysis.estimate_method || '-');
    text(
      '[data-estimate-range]',
      analysis.estimated_market_range_low && analysis.estimated_market_range_high
        ? money(analysis.estimated_market_range_low) + ' - ' + money(analysis.estimated_market_range_high)
        : '-'
    );
    text(
      '[data-estimate-disclaimer]',
      analysis.estimate_disclaimer || t('dealer.estimate.pending', 'Internal estimate details appear here after the dealer check runs.')
    );

    var addOns = (session && session.extracted && session.extracted.add_ons) || [];
    text('[data-addon-count]', addOns.length || 0);

    var providerRoot = q('[data-provider-status-list]');
    if(providerRoot){
      var sources = analysis.source_references || [];
      providerRoot.innerHTML = sources.length
        ? sources.map(function(item){
            var pricing = item.price_mid != null ? (' | ' + money(item.price_mid)) : '';
            return '<div class="contact-card"><strong>' + htmlEscape(item.label || item.slug || 'Source') + '</strong><span>' + htmlEscape((item.status || 'review') + pricing) + '</span><p>' + htmlEscape(item.notes || '') + '</p></div>';
          }).join('')
        : '<div class="empty-copy">' + htmlEscape(t('dealer.empty.providers', 'Run the deal audit to load provider status.')) + '</div>';
    }

    var tbody = q('[data-addon-table]');
    if(tbody){
      if(!addOns.length){
        tbody.innerHTML = '<tr><td colspan="4" class="empty-copy">' + htmlEscape(t('dealer.empty.addons', 'No add-ons detected yet.')) + '</td></tr>';
      } else {
        tbody.innerHTML = addOns.map(function(item){
          return '<tr>' +
            '<td>' + htmlEscape(item.label || item.slug || 'Add-on') + '</td>' +
            '<td>' + htmlEscape(money(item.amount)) + '</td>' +
            '<td>' + htmlEscape(item.status || 'review') + '</td>' +
            '<td>' + htmlEscape(item.line_text || '') + '</td>' +
          '</tr>';
        }).join('');
      }
    }

    var issuesRoot = q('[data-issues-list]');
    if(issuesRoot){
      var issues = (analysis.issues || []).concat(analysis.legal_notes || []);
      issuesRoot.innerHTML = issues.length
        ? issues.map(function(item){ return '<div class="stack-row">' + htmlEscape(item) + '</div>'; }).join('')
        : '<div class="empty-copy">' + htmlEscape(t('dealer.empty.issues', 'No review issues yet.')) + '</div>';
    }

    var vinWarnings = (((session && session.vin_report) || {}).warnings || []).concat((((session && session.dealer_listing) || {}).warnings || []));
    var warningNode = q('[data-vin-warning]');
    if(warningNode){ warningNode.textContent = vinWarnings.join(' '); }

    var nhtsa = q('[data-nhtsa-link]');
    if(nhtsa && session && session.vin){
      nhtsa.href = 'https://vpic.nhtsa.dot.gov/decoder/Decoder?VIN=' + encodeURIComponent(session.vin);
    }

    var recalls = q('[data-recalls-link]');
    if(recalls){
      recalls.href = 'https://www.nhtsa.gov/recalls';
    }

    var reportBtn = q('[data-generate-report]');
    if(reportBtn){ reportBtn.disabled = !session; }

    var reportLink = q('[data-report-download]');
    if(reportLink){
      if(session && session.report_pdf_url){
        reportLink.hidden = false;
        reportLink.href = api.toDownloadUrl(session.report_pdf_url);
      } else {
        reportLink.hidden = true;
        reportLink.removeAttribute('href');
      }
    }

    var status = q('[data-session-status]');
    if(status){
      status.textContent = session
        ? t('dealer.status.ready', 'Dealer review ready. Confirm the VIN, pricing, estimated range, and flagged add-ons before signing.')
        : t('dealer.status.idle', 'Upload a contract or photo to begin.');
    }

    var reportStatus = q('[data-report-status]');
    if(reportStatus && !session && !reportStatus.getAttribute('data-has-runtime-status')){
      reportStatus.textContent = t('dealer.report.idle', 'Run a dealer check first.');
    }
  }

  async function runSession(event){
    event.preventDefault();
    var contractFiles = Array.prototype.slice.call((q('[data-contract-files]') || {}).files || []);
    var supportingFiles = Array.prototype.slice.call((q('[data-support-files]') || {}).files || []);
    if(!contractFiles.length){
      alert(t('dealer.upload_required', 'Upload at least one dealer contract, worksheet, buyer order, or photo.'));
      return;
    }

    q('[data-session-status]').textContent = t('dealer.status.running', 'Running dealer contract check...');
    try {
      state.session = await api.createDealerContractSession(
        contractFiles,
        supportingFiles,
        (q('[data-vin-input]') || {}).value || '',
        (q('[data-mileage-input]') || {}).value || '',
        (q('[data-zip-input]') || {}).value || '',
        (q('[data-asking-price]') || {}).value || '',
        (q('[data-dealer-url]') || {}).value || '',
        (q('[data-dealer-price]') || {}).value || '',
        (q('[data-state-hint]') || {}).value || ''
      );
      try { window.sessionStorage.setItem('docketmint.dealerSessionId', state.session.id); } catch (error){}
      q('[data-report-status]').setAttribute('data-has-runtime-status', 'true');
      q('[data-report-status]').textContent = t('dealer.report.ready', 'Review ready. Generate the PDF summary when you are done.');
      render();
    } catch (error){
      q('[data-session-status]').textContent = error.message || t('dealer.status.failed', 'Dealer contract check failed.');
    }
  }

  async function generateReport(){
    if(!state.session){ return; }
    q('[data-report-status]').setAttribute('data-has-runtime-status', 'true');
    q('[data-report-status]').textContent = t('dealer.report.generating', 'Generating review PDF...');
    try {
      state.session = await api.generateDealerContractReport(state.session.id);
      q('[data-report-status]').textContent = t('dealer.report.generated', 'Review PDF is ready to download.');
      render();
    } catch (error){
      q('[data-report-status]').textContent = error.message || t('dealer.report.failed', 'Could not generate the review PDF.');
    }
  }

  function bind(){
    var form = q('[data-dealer-form]');
    if(form){ form.addEventListener('submit', runSession); }
    var report = q('[data-generate-report]');
    if(report){ report.addEventListener('click', generateReport); }
    var sessionId = params().get('session') || '';
    if(sessionId){
      try { window.sessionStorage.setItem('docketmint.dealerSessionId', sessionId); } catch (error){}
      api.getDealerContractSession(sessionId).then(function(session){
        state.session = session;
        render();
      }).catch(function(){ render(); });
      return;
    }
    try {
      var stored = window.sessionStorage.getItem('docketmint.dealerSessionId') || '';
      if(stored){
        api.getDealerContractSession(stored).then(function(session){
          state.session = session;
          render();
        }).catch(function(){ render(); });
        return;
      }
    } catch (error){}
    render();
  }

  document.addEventListener('vcx:i18n:change', render);

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();
