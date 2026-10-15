/* VitaCoreX service index (services.html): catalog rows grouped by section, filter chips,
   "pay online now" toggle and FLIP reflow. Markup is pre-rendered in English by scripts/vx-shell.mjs
   (serviceIndexEN) and re-rendered here on language change; both use the same row template. */
(function () {
  'use strict';
  function ready(fn) { if (window.VX && window.VX.ready) window.VX.ready.then(fn); else document.addEventListener('vx:ready', fn); }
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function rowHTML(id) {
    var s = VX.svc(id); if (!s) return '';
    var pi = VX.priceInfo(id), page = s.page && s.page.indexOf('/request.html') !== 0 ? s.page : null;
    var href = s.action === 'b2b' ? '/small-claims-documentation.html#check' : '/request.html?service=' + encodeURIComponent(id);
    var list = function (k) { return ((s[k] && (s[k][VX.lang()] || s[k].en)) || []).map(function (x) { return '<li>' + VX.esc(x) + '</li>'; }).join(''); };
    var name = page ? '<a href="' + VX.esc(page) + '">' + VX.esc(VX.loc(s.name)) + '</a>' : VX.esc(VX.loc(s.name));
    return '<article class="vx-irow" data-service="' + VX.esc(id) + '" data-pay="' + (s.action === 'order' || s.action === 'book_pay' ? '1' : '0') + '">' +
      '<div class="vx-irow__main"><h3>' + name + '</h3><p>' + VX.esc(VX.loc(s.short)) + '</p></div>' +
      '<div class="vx-irow__price"><span class="vx-irow__amount"><span class="vx-pmark vx-pmark--' + pi.tagClass.replace('vx-tag--', '') + '" aria-hidden="true"></span>' + VX.esc(pi.short) + '<span class="vx-sr"> (' + VX.esc(pi.tag) + ')</span></span><span class="vx-irow__unit">' + VX.esc(pi.unit) + '</span></div>' +
      '<div class="vx-irow__go"><a class="vx-btn vx-btn--line" href="' + VX.esc(href) + '">' + VX.esc(VX.t('action.' + s.action)) + '</a></div>' +
      '<details class="vx-irow__more"><summary>' + VX.esc(VX.t('ix.more')) + '</summary><div class="vx-irow__lists">' +
      '<div><h4>' + VX.esc(VX.t('scope.included')) + '</h4><ul>' + list('included') + '</ul></div>' +
      '<div><h4>' + VX.esc(VX.t('scope.extra')) + '</h4><ul>' + list('extra') + '</ul></div></div></details></article>';
  }
  function render(list) {
    var cat = VX.catalog();
    list.innerHTML = cat.groups.filter(function (g) { return g.lane === 'private'; }).map(function (g) {
      return '<section class="vx-index__group" id="' + g.id + '" data-group="' + g.id + '" aria-labelledby="ix-' + g.id + '"><h2 class="vx-index__gtitle" id="ix-' + g.id + '">' + VX.esc(VX.loc(g.name)) + '</h2>' +
        g.services.map(rowHTML).join('') + '</section>';
    }).join('');
  }

  function init() {
    var root = document.querySelector('[data-vx-index]'); if (!root) return;
    var list = root.querySelector('[data-vx-render="service-index"]'), count = root.querySelector('[data-index-count]');
    var chips = Array.prototype.slice.call(root.querySelectorAll('[data-filter]')), pay = root.querySelector('[data-filter-pay]');
    var empty = root.querySelector('[data-index-empty]');
    var state = { group: 'all', pay: false };
    try { var saved = JSON.parse(sessionStorage.getItem('vx_index') || 'null'); if (saved) state = saved; } catch (e) { /* storage blocked */ }
    var fromHash = (location.hash || '').replace('#', ''); if (fromHash && root.querySelector('[data-filter="' + fromHash + '"]')) state.group = fromHash;

    function countText(n) {
      var cat = 'other'; try { cat = new Intl.PluralRules(VX.lang()).select(n); } catch (e) { /* old browser */ }
      return VX.t('ix.count_' + (['one', 'few', 'many'].indexOf(cat) !== -1 ? cat : 'other'), { n: n });
    }
    function apply(animate) {
      var rows = Array.prototype.slice.call(list.querySelectorAll('.vx-irow'));
      var first = new Map(); if (animate) rows.forEach(function (r) { if (!r.hidden) first.set(r, r.getBoundingClientRect()); });
      var shown = 0;
      list.querySelectorAll('.vx-index__group').forEach(function (g) {
        var gOn = state.group === 'all' || state.group === g.getAttribute('data-group'), any = 0;
        g.querySelectorAll('.vx-irow').forEach(function (r) {
          var on = gOn && (!state.pay || r.getAttribute('data-pay') === '1'); r.hidden = !on; if (on) { any++; shown++; }
        });
        g.hidden = !any;
      });
      chips.forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-filter') === state.group ? 'true' : 'false'); });
      if (pay) pay.checked = !!state.pay;
      if (count) count.textContent = countText(shown);
      if (empty) empty.hidden = shown > 0;
      try { sessionStorage.setItem('vx_index', JSON.stringify(state)); } catch (e) { /* storage blocked */ }
      if (!animate || reduce || !Element.prototype.animate) return;
      rows.forEach(function (r) {
        if (r.hidden) return;
        var a = first.get(r), b = r.getBoundingClientRect();
        if (a) { var dx = a.left - b.left, dy = a.top - b.top; if (dx || dy) r.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }], { duration: 360, easing: 'cubic-bezier(.16,1,.3,1)' }); }
        else r.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 300, easing: 'cubic-bezier(.16,1,.3,1)' });
      });
    }
    chips.forEach(function (c) { c.addEventListener('click', function () { state.group = c.getAttribute('data-filter'); apply(true); }); });
    if (pay) pay.addEventListener('change', function () { state.pay = pay.checked; apply(true); });
    document.addEventListener('vx:lang', function () { render(list); apply(false); });
    render(list); apply(false); root.classList.add('is-ready');
  }
  ready(init);
})();
