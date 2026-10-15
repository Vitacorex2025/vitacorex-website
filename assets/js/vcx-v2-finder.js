/* VitaCoreX service finder ("What do you need done?").
   ARIA combobox + listbox, type-ahead over catalog names/short texts/keywords in EN/RU/ES,
   prices from the catalog, full keyboard support. The typed text never leaves the page. */
(function () {
  'use strict';
  function ready(fn) { if (window.VX && window.VX.ready) window.VX.ready.then(fn); else document.addEventListener('vx:ready', fn); }
  var norm = function (s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ё/g, 'е').replace(/[^\p{L}\p{N}\s-]/gu, ' ').replace(/\s+/g, ' ').trim(); };

  function init() {
    document.querySelectorAll('[data-vx-finder]').forEach(function (root) {
      var input = root.querySelector('input'), list = root.querySelector('[role="listbox"]');
      if (!input || !list) return;
      var active = -1, items = [], index = null;

      function buildIndex() {
        var cat = VX.catalog(); index = [];
        Object.keys(cat.services).forEach(function (id) {
          var s = cat.services[id], parts = [];
          ['en', 'ru', 'es'].forEach(function (l) {
            parts.push({ t: norm(s.name[l]), w: 4 });
            parts.push({ t: norm(s.short && s.short[l]), w: 1 });
            ((s.keywords && s.keywords[l]) || []).forEach(function (k) { parts.push({ t: norm(k), w: 3 }); });
          });
          index.push({ id: id, parts: parts });
        });
      }
      function score(entry, q) {
        var terms = q.split(' ').filter(function (x) { return x.length > 1; }); if (!terms.length) return 0;
        var total = 0;
        terms.forEach(function (term) {
          var best = 0;
          entry.parts.forEach(function (p) {
            if (!p.t) return;
            if (p.t === term) best = Math.max(best, p.w * 3);
            else if ((' ' + p.t).indexOf(' ' + term) !== -1) best = Math.max(best, p.w * 2);
            else if (term.length > 3 && p.t.indexOf(term.slice(0, Math.max(4, term.length - 2))) !== -1) best = Math.max(best, p.w);
          });
          total += best;
        });
        return total;
      }
      function hrefFor(id) { var s = VX.svc(id); if (!s) return '/services.html'; if (s.action === 'b2b') return '/small-claims-documentation.html#check'; return s.page && s.page.indexOf('/request.html') !== 0 ? s.page : '/request.html?service=' + encodeURIComponent(id); }
      function render(q) {
        if (!index) buildIndex();
        var nq = norm(q);
        if (nq.length < 2) { close(); return; }
        var ranked = index.map(function (e) { return { id: e.id, sc: score(e, nq) }; }).filter(function (x) { return x.sc > 0; })
          .sort(function (a, b) { return b.sc - a.sc; }).slice(0, 5);
        items = ranked.map(function (r) { return { id: r.id, href: hrefFor(r.id) }; });
        items.push({ id: 'legal_request', href: '/request.html?service=legal_request', fallback: true });
        list.innerHTML = items.map(function (it, i) {
          var s = VX.svc(it.id), pi = VX.priceInfo(it.id);
          var label = it.fallback ? VX.t('finder.fallback') : VX.loc(s.name);
          var meta = it.fallback ? VX.t('finder.fallback_meta') : pi.short;
          return '<li role="option" id="' + root.id + '-opt-' + i + '" class="vx-finder__opt' + (it.fallback ? ' is-fallback' : '') + '" aria-selected="false" data-i="' + i + '"><span class="vx-finder__name">' + VX.esc(label) + '</span><span class="vx-finder__meta">' + VX.esc(meta) + '</span></li>';
        }).join('');
        list.hidden = false; input.setAttribute('aria-expanded', 'true'); setActive(ranked.length ? 0 : items.length - 1);
        var live = root.querySelector('[data-vx-finder-live]');
        if (live) live.textContent = VX.t('finder.count', { n: ranked.length });
      }
      function setActive(i) {
        active = i;
        Array.prototype.forEach.call(list.children, function (li, k) { li.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
        if (i >= 0 && list.children[i]) { input.setAttribute('aria-activedescendant', list.children[i].id); list.children[i].scrollIntoView({ block: 'nearest' }); }
        else input.removeAttribute('aria-activedescendant');
      }
      function close() { list.hidden = true; list.innerHTML = ''; input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant'); active = -1; items = []; }
      function go(i) { if (items[i]) location.href = items[i].href; }

      input.addEventListener('input', function () { render(input.value); });
      input.addEventListener('focus', function () { if (input.value) render(input.value); });
      input.addEventListener('keydown', function (e) {
        if (list.hidden) { if (e.key === 'ArrowDown' && input.value) { render(input.value); e.preventDefault(); } return; }
        if (e.key === 'ArrowDown') { e.preventDefault(); setActive((active + 1) % items.length); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((active - 1 + items.length) % items.length); }
        else if (e.key === 'Enter') { e.preventDefault(); go(active < 0 ? 0 : active); }
        else if (e.key === 'Escape') { close(); }
      });
      list.addEventListener('mousedown', function (e) { var li = e.target.closest('[data-i]'); if (li) { e.preventDefault(); go(+li.getAttribute('data-i')); } });
      list.addEventListener('mousemove', function (e) { var li = e.target.closest('[data-i]'); if (li) setActive(+li.getAttribute('data-i')); });
      document.addEventListener('click', function (e) { if (!root.contains(e.target)) close(); });
      document.addEventListener('vx:lang', function () { index = null; if (!list.hidden) render(input.value); });
      /* rotating example placeholder; stops for good once the visitor interacts */
      var rot = (input.getAttribute('data-vx-rotate') || '').split('|').filter(Boolean), ri = 0, rotTimer = null;
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      function stopRot() { if (rotTimer) { clearInterval(rotTimer); rotTimer = null; } }
      if (rot.length > 1 && !reduce) {
        rotTimer = setInterval(function () { if (document.activeElement === input || input.value) return; ri = (ri + 1) % rot.length; input.setAttribute('placeholder', VX.t(rot[ri])); }, 3200);
        input.addEventListener('focus', stopRot); input.addEventListener('pointerenter', stopRot);
      }
      /* "/" focuses the finder (unless typing in another field) */
      document.addEventListener('keydown', function (e) {
        if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
        var t = e.target; if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
        e.preventDefault(); input.focus();
      });
      var form = root.querySelector('form'); if (form) form.addEventListener('submit', function (e) { e.preventDefault(); if (input.value) { render(input.value); go(active < 0 ? 0 : active); } });
    });
  }
  ready(init);
})();
