/* VitaCoreX v7 "Assembly" layer (site-wide since 2026-10-15; loaded after vcx-v2.js).
   Home hero, once per visit (the head script sets html.vx7-intro): column guides 0–560 · baseline rules 160–640 ·
   H1 lines rise 200–840 · slope line 600–1200 · "in order" settles 820–1380 · full stop 1240–1360 · window opens 1100–2000 ·
   guides hand over to the price bar 1500–1900. The final state is the no-JS / reduced-motion state;
   any key, click, wheel or touch finishes the intro at once.
   Every page: alignment guides on price lists, focus registration marks, the footer title block. No numbering anywhere. */
(function () {
  'use strict';
  var d = document, root = d.documentElement, body = d.body;
  if (!body || !body.classList.contains('vx7')) return;
  var hero = d.querySelector('.vx6-hero');
  var lab = body.classList.contains('vx7-lab');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && matchMedia('(pointer: fine)').matches;
  var E_DRAW = 'cubic-bezier(.65,0,.35,1)', E_OUT = 'cubic-bezier(.16,1,.3,1)', E_SET = 'cubic-bezier(.2,.8,.2,1)';
  var GAP = 32, running = [];

  var L = {
    en: { replay: 'Replay the assembly', doc: 'Document', lang: 'Language', rev: 'Revised', prices: 'Prices checked', office: 'Office', coords: 'Coordinates', licence: 'Licence', phone: 'Phone', home: 'Home', name: 'English', city: 'Tampa, Florida', tampa: 'Tampa', loc: 'en-US' },
    ru: { replay: 'Повторить сборку', doc: 'Документ', lang: 'Язык', rev: 'Редакция', prices: 'Цены проверены', office: 'Офис', coords: 'Координаты', licence: 'Лицензия', phone: 'Телефон', home: 'Главная', name: 'Русский', city: 'Тампа, Флорида', tampa: 'Тампа', loc: 'ru-RU' },
    es: { replay: 'Repetir el montaje', doc: 'Documento', lang: 'Idioma', rev: 'Revisado', prices: 'Precios revisados', office: 'Oficina', coords: 'Coordenadas', licence: 'Licencia', phone: 'Teléfono', home: 'Inicio', name: 'Español', city: 'Tampa, Florida', tampa: 'Tampa', loc: 'es-US' }
  };
  function lang() { var l = (root.getAttribute('lang') || 'en').slice(0, 2); return L[l] ? l : 'en'; }
  function t(k) { return L[lang()][k]; }
  function px(n) { return Math.round(n * 10) / 10 + 'px'; }
  function anim(el, kf, o) { if (!el || !el.animate) return null; var a = el.animate(kf, Object.assign({ fill: 'both' }, o)); running.push(a); return a; }
  /* write the final values inline and drop the animations, so later layout (resize, language) owns the styles again */
  function settle() { running.forEach(function (a) { try { a.finish(); if (a.commitStyles) a.commitStyles(); a.cancel(); } catch (e) { /* element gone */ } }); running = []; }
  function endIntro() { root.classList.remove('vx7-intro'); root.classList.remove('vx7-run'); }

  /* ================= home hero ================= */
  function grid() {
    var hr = hero.getBoundingClientRect(), wrap = hero.querySelector('.vx6-hero__inner'), cs = getComputedStyle(wrap), wr = wrap.getBoundingClientRect();
    var x0 = wr.left - hr.left + parseFloat(cs.paddingLeft), W = wr.width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    var cw = (W - 11 * GAP) / 12, bar = hero.querySelector('.vx6-hero__bar');
    var yB = bar ? bar.getBoundingClientRect().top - hr.top : hr.height;
    var hdr = d.querySelector('.vx-hdr'), top = hdr ? Math.max(0, hdr.getBoundingClientRect().bottom - hr.top) : 0;
    return { w: hr.width, h: hr.height, x0: x0, cw: cw, mod: cw + GAP, yB: yB, top: top, col: function (n) { return x0 + (n - 1) * (cw + GAP); } };
  }

  /* H1: set lines in slots, red words as units, the full stop on its own; baseline rules */
  function wrapH1() {
    var h = hero.querySelector('.vx6-hero__h1'); if (!h) return null;
    if (h.querySelector('.vx7-ln')) return h;
    var full = h.textContent.replace(/\s+/g, ' ').trim();
    var lines = h.innerHTML.split(/<br\s*\/?>/i).map(function (p, i, all) {
      p = p.trim();
      p = p.replace(/<em>([\s\S]*?)<\/em>/i, function (m, inner) {
        return '<em>' + inner.trim().split(/\s+/).map(function (w) { return '<span class="vx7-w">' + w + '</span>'; }).join(' ') + '</em>';
      });
      if (i === all.length - 1) p = p.replace(/\.\s*$/, '<span class="vx7-stop">.</span>');
      return '<span class="vx7-ln"><span class="vx7-ln__in">' + p + '<i class="vx7-bl"></i></span></span>';
    });
    h.innerHTML = '<span class="vx-sr">' + full + '</span><span aria-hidden="true">' + lines.join('') + '</span>';
    return h;
  }
  /* bottom of the painted glyph boxes of a line (font descent included), viewport px */
  function inkBottom(inn) {
    var b = -Infinity, tw = d.createTreeWalker(inn, NodeFilter.SHOW_TEXT), n, rg = d.createRange();
    while ((n = tw.nextNode())) {
      if (!n.nodeValue.trim()) continue;
      rg.selectNodeContents(n);
      Array.prototype.forEach.call(rg.getClientRects(), function (rc) { if (rc.bottom > b) b = rc.bottom; });
    }
    return b;
  }
  function placeRules(h) {
    var fs = parseFloat(getComputedStyle(h).fontSize), lns = h.querySelectorAll('.vx7-ln');
    lns.forEach(function (ln, k) {
      var inn = ln.querySelector('.vx7-ln__in'), bl = ln.querySelector('.vx7-bl'), r = ln.querySelector('.vx7-rule');
      if (!r) { r = d.createElement('i'); r.className = 'vx7-rule'; r.setAttribute('aria-hidden', 'true'); ln.appendChild(r); }
      var lr = ln.getBoundingClientRect(), y = bl.getBoundingClientRect().top;
      /* the last line keeps its rule at rest: it runs under the descenders (р, д, g, y), never through them */
      if (k === lns.length - 1) y = Math.max(y, inkBottom(inn) + 2);
      r.style.top = px(y - lr.top);
      r.style.width = px(inn.getBoundingClientRect().width + .3 * fs);
    });
  }
  function guides(g) {
    var el = hero.querySelector('.vx7-guides');
    if (!el) {
      el = d.createElement('div'); el.className = 'vx7-guides'; el.setAttribute('aria-hidden', 'true');
      el.innerHTML = '<div class="vx-wrap">' + new Array(13).join('<i></i>') + '</div>';
      hero.insertBefore(el, hero.querySelector('.vx6-hero__inner'));
    }
    el.style.setProperty('--vx7-gtop', px(g.top)); el.style.setProperty('--vx7-gh', px(Math.max(0, g.yB - g.top)));
  }
  var veil, lines;
  /* the window ends 28 px above the price bar, so its bottom corner reads as a crop mark (owner liked the v6 corner) */
  var LIFT = 28;
  function windowGeom(g) {
    var yD = g.yB - LIFT, A = [g.col(7), 0], D = [g.col(12), yD];
    A[1] = yD - (D[0] - A[0]) * 22 / 17;                            /* the 17:22 brand slope, corners on columns 7 and 12 */
    return { A: A, D: D, B: [g.w, A[1]], C: [g.w, yD] };
  }
  function poly(g, A, B, C, D) {
    var p = function (q) { return px(q[0]) + ' ' + px(q[1]); };
    return 'polygon(evenodd, 0 0, ' + px(g.w) + ' 0, ' + px(g.w) + ' ' + px(g.h) + ', 0 ' + px(g.h) + ', 0 0, ' + p(A) + ', ' + p(B) + ', ' + p(C) + ', ' + p(D) + ', ' + p(A) + ', 0 0)';
  }
  function windowBuild(g) {
    var media = hero.querySelector('.vx6-hero__media'); if (!media) return;
    if (!veil) { veil = d.createElement('div'); veil.className = 'vx7-veil'; media.appendChild(veil); }
    if (!lines) { lines = d.createElementNS('http://www.w3.org/2000/svg', 'svg'); lines.setAttribute('class', 'vx7-lines'); lines.setAttribute('aria-hidden', 'true'); lines.setAttribute('focusable', 'false'); media.appendChild(lines); }
    var big = window.innerWidth >= 1100;   /* measured: from 1100 px the slope keeps ≥ 88 px from every text line (EN/RU/ES) */
    veil.classList.toggle('is-full', !big);
    if (!big) { veil.style.clipPath = ''; lines.innerHTML = ''; return; }
    var w = windowGeom(g), u = [w.D[0] - w.A[0], w.D[1] - w.A[1]], len = Math.hypot(u[0], u[1]); u = [u[0] / len, u[1] / len];
    var s0 = [w.A[0] - u[0] * GAP, w.A[1] - u[1] * GAP], s1 = [w.D[0] + u[0] * (LIFT - 4) / u[1], w.D[1] + (LIFT - 4)];  /* below the corner the slope stops 4 px above the bar */
    lines.setAttribute('viewBox', '0 0 ' + g.w + ' ' + g.h);
    lines.innerHTML = '<path class="s" pathLength="1" d="M' + s0.join(' ') + 'L' + s1.join(' ') + '"/>' +
      '<path class="h" pathLength="1" d="M' + (w.A[0] - GAP) + ' ' + w.A[1] + 'H' + g.w + '"/>' +
      '<path class="h" pathLength="1" d="M' + (w.D[0] - 36) + ' ' + w.D[1] + 'H' + g.w + '"/>';
    veil.style.clipPath = poly(g, w.A, w.B, w.C, w.D);
  }
  var clockTimer;
  function clock() {
    var cred = hero.querySelector('.vx6-hero__cred'); if (!cred) return;
    var s = cred.querySelector('.vx7-clock');
    if (!s) { s = d.createElement('span'); s.className = 'vx7-clock'; cred.appendChild(s); }
    var time;
    try { time = new Intl.DateTimeFormat(t('loc'), { hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York' }).format(new Date()); } catch (e) { s.remove(); return; }
    s.textContent = '· ' + t('tampa') + ' ' + time + ' ET';
    clearTimeout(clockTimer); clockTimer = setTimeout(clock, (60 - new Date().getSeconds()) * 1000 + 50);
  }
  var replayBtn;
  function replay() {
    if (!lab) return;
    if (!replayBtn) {
      replayBtn = d.createElement('button'); replayBtn.type = 'button'; replayBtn.className = 'vx7-replay';
      replayBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'auto' }); play(true); });
      body.appendChild(replayBtn);
    }
    replayBtn.innerHTML = '<b aria-hidden="true">↻</b><span>' + t('replay') + '</span>'; replayBtn.setAttribute('aria-label', t('replay'));
    replayBtn.hidden = reduce;
  }
  function heroLayout() {
    if (!hero) return null;
    var h = wrapH1(), g = grid();
    if (h) placeRules(h);
    guides(g); windowBuild(g); clock(); replay();
    return { h: h, g: g };
  }
  function play(force) {
    running.forEach(function (a) { try { a.cancel(); } catch (e) { /* noop */ } }); running = [];
    var s = heroLayout(); if (!s) { endIntro(); return; }
    if (reduce) { endIntro(); return; }
    if (force) root.classList.add('vx7-intro');
    if (!root.classList.contains('vx7-intro')) return;
    root.classList.add('vx7-run');
    var h = s.h, g = s.g, phone = window.innerWidth < 768, rise = phone ? 520 : 640, step = phone ? 70 : 90;

    hero.querySelectorAll('.vx7-guides i').forEach(function (i, k) { anim(i, [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], { duration: phone ? 400 : 560, delay: k * 20, easing: E_DRAW }); });
    anim(hero.querySelector('.vx7-guides'), [{ opacity: 1 }, { opacity: 0 }], { duration: 400, delay: 1500, easing: 'ease' });
    if (h) {
      var lns = h.querySelectorAll('.vx7-ln');
      lns.forEach(function (ln, k) {
        anim(ln.querySelector('.vx7-ln__in'), [{ transform: 'translateY(1.35em)' }, { transform: 'none' }], { duration: rise, delay: 200 + k * step, easing: E_OUT });
        /* upper lines land on their baseline rules, which then fade before the line has settled; the last rule stays */
        var last = k === lns.length - 1;
        anim(ln.querySelector('.vx7-rule'), [{ transform: 'scaleX(0)', opacity: 1 }, { transform: 'scaleX(1)', opacity: 1, offset: .3 }, { transform: 'scaleX(1)', opacity: last ? 1 : 0, offset: last ? .82 : .5 }, { transform: 'scaleX(1)', opacity: last ? .43 : 0 }],
          { duration: 1640, delay: 160 + k * step, easing: E_DRAW });
      });
      var from = ['translate(0, .09em) rotate(-1.5deg)', 'translate(.03em, -.07em) rotate(1.2deg)'];
      h.querySelectorAll('em .vx7-w').forEach(function (w, k) { anim(w, [{ transform: from[k] || from[1] }, { transform: 'none' }], { duration: 560, delay: 820 + k * 60, easing: E_SET }); });
      anim(h.querySelector('.vx7-stop'), [{ opacity: 0 }, { opacity: 1 }], { duration: 120, delay: 1240, easing: 'linear' });
    }
    if (veil && lines && window.innerWidth >= 1100) {
      var w = windowGeom(g);
      anim(veil, [{ clipPath: poly(g, w.A, w.A, w.D, w.D) }, { clipPath: poly(g, w.A, w.B, w.C, w.D) }], { duration: 900, delay: 1100, easing: E_OUT });
      var ps = lines.querySelectorAll('path');
      ps.forEach(function (p) { p.style.strokeDasharray = '1'; });
      anim(ps[0], [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 600, delay: 600, easing: E_DRAW });
      if (ps[1]) anim(ps[1], [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 500, delay: 1300, easing: E_DRAW });
      if (ps[2]) anim(ps[2], [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 400, delay: 1400, easing: E_DRAW });
    }

    var evs = ['keydown', 'pointerdown', 'wheel', 'touchstart'];
    var stop = function () { clearTimeout(end); settle(); endIntro(); off(); };
    var off = function () { evs.forEach(function (ev) { window.removeEventListener(ev, stop, true); }); };
    var end = setTimeout(function () { settle(); endIntro(); off(); }, 2100);
    evs.forEach(function (ev) { window.addEventListener(ev, stop, { capture: true, passive: true }); });
  }

  /* ================= every page ================= */
  /* alignment guides: the shared price edge and the action edge of a price list, drawn once on entry, back on hover / focus */
  /* edges() returns [[x, side], …]: side −1 = the guide sits 6 px left of the edge, +1 = 6 px right, so it never touches a glyph;
     span() returns the first and last element the guides run between (rows, not headings), or a list of such pairs —
     one segment per table or group, so a guide never runs through the captions and headings between them */
  /* turned off 2026-10-16 (owner: «мне не нравятся эти вертикальные полосы при наведении мышкой. лучше убрать»):
     no vertical guide is drawn anywhere; the code stays so the decision can be reversed in one line */
  var ALIGN_GUIDES = false;
  function alignSet(host, groups, edges, span) {
    if (!ALIGN_GUIDES) return;
    if (!host || !groups.length || window.innerWidth < 1024) return;
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    var hr = host.getBoundingClientRect(), sp = span ? span() : [groups[0], groups[groups.length - 1]];
    var segs = (Array.isArray(sp[0]) ? sp : [sp]).filter(function (sg) { return sg && sg[0] && sg[1]; });
    if (!segs.length) return;
    var xs = edges().map(function (e) { return e[0] + e[1] * 6 - hr.left; }).filter(function (x) { return x > 0; });
    /* lists re-rendered by script drop our guides: make them again */
    var els = host.__vx7a && host.__vx7a.length && host.__vx7a[0].isConnected ? host.__vx7a : [];
    while (els.length < segs.length * 2) { var g = d.createElement('i'); g.className = 'vx7-align'; g.setAttribute('aria-hidden', 'true'); host.appendChild(g); els.push(g); }
    host.__vx7a = els;
    els.forEach(function (i, n) {
      var sg = segs[n >> 1], k = n & 1;
      if (!sg || xs[k] == null) { i.hidden = true; return; }
      var top = sg[0].getBoundingClientRect().top - hr.top, bottom = sg[1].getBoundingClientRect().bottom - hr.top;
      /* a guide that would touch a glyph or a button anywhere on its run is not drawn at all */
      if (bottom - top < 8 || touches(host, xs[k] + hr.left, top + hr.top, bottom + hr.top)) { i.hidden = true; return; }
      i.hidden = false; i.style.left = px(xs[k] - .5); i.style.top = px(top); i.style.height = px(bottom - top);
    });
    if (host.__vx7w === groups[0]) return;
    host.__vx7w = groups[0];
    var hint = function (v) { return function () { (host.__vx7a || []).forEach(function (i) { i.classList.toggle('is-hint', v); }); }; };
    Array.prototype.forEach.call(groups, function (gr) { gr.addEventListener('pointerenter', hint(true)); gr.addEventListener('pointerleave', hint(false)); gr.addEventListener('focusin', hint(true)); gr.addEventListener('focusout', hint(false)); });
    if (!reduce && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (en) {
        if (!en[0].isIntersecting) return; io.disconnect();
        (host.__vx7a || []).forEach(function (i, n) {
          if (i.hidden) return;
          i.animate([{ opacity: 1, transform: 'scaleY(0)' }, { opacity: 1, transform: 'scaleY(1)', offset: .55 }, { opacity: 1, transform: 'scaleY(1)', offset: .8 }, { opacity: 0, transform: 'scaleY(1)' }],
            { duration: 1300, delay: (n & 1) * 120, easing: E_DRAW });
        });
      }, { threshold: .15 });
      io.observe(groups[0]);
    }
  }
  /* true when the vertical line x (viewport px) from top to bottom comes within 3 px of text or a control inside host */
  function touches(host, x, top, bottom) {
    var near = function (r) { return r.width > 1 && r.height > 1 && r.bottom > top && r.top < bottom && x > r.left - 3 && x < r.right + 3; };
    var ctl = host.querySelectorAll('.vx-btn, button, input, select, textarea');
    for (var c = 0; c < ctl.length; c++) if (ctl[c].offsetWidth && (!ctl[c].checkVisibility || ctl[c].checkVisibility({ checkVisibilityCSS: true })) && near(ctl[c].getBoundingClientRect())) return true;
    var tw = d.createTreeWalker(host, NodeFilter.SHOW_TEXT), n, rg = d.createRange(), el;
    while ((n = tw.nextNode())) {
      el = n.parentElement;
      /* painted text only: not inside a closed panel, not a screen-reader label */
      if (!n.nodeValue.trim() || !el || !el.offsetWidth || el.closest('.vx-sr, .vx5-sr, .sr-only')) continue;
      if (el.checkVisibility && !el.checkVisibility({ checkVisibilityCSS: true })) continue;
      rg.selectNodeContents(n);
      var rs = rg.getClientRects();
      for (var k = 0; k < rs.length; k++) if (near(rs[k])) return true;
    }
    return false;
  }
  function minLeft(els, pad) {
    var m = Infinity;
    Array.prototype.forEach.call(els, function (el) { if (!el.offsetWidth) return; var l = el.getBoundingClientRect().left + (pad ? parseFloat(getComputedStyle(el).paddingLeft) || 0 : 0); if (l < m) m = l; });
    return m === Infinity ? null : m;
  }
  function alignGuides() {
    /* home price list: right edge of the prices, left edge of the actions */
    var sec = d.querySelector('#services.vx5-ix-sec');
    if (sec) alignSet(sec, sec.querySelectorAll('.vx5-ix'), function () {
      var g = sec.querySelector('.vx5-ix'), r = g && g.querySelector('.vx5-ix__rows'), a = g && g.querySelector('.vx5-ix__act');
      return r && a ? [[r.getBoundingClientRect().right, 1], [a.getBoundingClientRect().left, -1]] : [];
    });
    /* services index: left edge of the price column, left edge of the actions (visible groups only) */
    var list = d.querySelector('.vx-index__list');
    if (list) {
      var vis = Array.prototype.filter.call(list.querySelectorAll('.vx-index__group'), function (gr) { return !gr.hidden && gr.offsetHeight > 0; });
      var shown = function (root) { return Array.prototype.filter.call(root.querySelectorAll('.vx-irow'), function (r) { return !r.hidden && r.offsetHeight > 0; }); };
      alignSet(list, vis, function () {
        var rows = shown(list), q = function (sel) { return rows.map(function (r) { return r.querySelector(sel); }).filter(Boolean); };
        var p = minLeft(q('.vx-irow__price')), a = minLeft(q('.vx-irow__go'));
        return p != null && a != null ? [[p, -1], [a, -1]] : [];
      }, function () {
        /* one segment per visible group: the group titles between them stay clear */
        return vis.map(function (gr) { var vr = shown(gr); return [vr[0], vr[vr.length - 1]]; });
      });
    }
    /* pricing tables share one set of columns: the same two guides run through each table (header to last row) —
       left edge of the price text, left edge of the action buttons; captions between the tables stay clear */
    var byParent = new Map();
    d.querySelectorAll('.vx-ptable:not(.vx-ptable--fees)').forEach(function (tb) { var p = tb.parentElement; if (!byParent.has(p)) byParent.set(p, []); byParent.get(p).push(tb); });
    byParent.forEach(function (tbs, host) {
      alignSet(host, tbs, function () {
        /* leftmost edge over every row of every table, so no wider price or label ever reaches across the line */
        var all = function (sel) { var a = []; tbs.forEach(function (tb) { a.push.apply(a, tb.querySelectorAll(sel)); }); return a; };
        var c = minLeft(all('tbody tr td.vx-ptable__price'), true), b = minLeft(all('tbody tr td.vx-ptable__go .vx-btn'));
        if (c == null) return [];
        var out = [[c, -1]];
        if (b != null) out.push([b, -1]);
        return out;
      }, function () { return tbs.map(function (tb) { return [tb.tHead || tb, tb]; }); });
    });
  }

  /* focus registration frame: one floating element, so buttons keep their own ::before / ::after */
  function wireFocus() {
    var f = d.createElement('div'); f.className = 'vx7-focus'; f.setAttribute('aria-hidden', 'true'); body.appendChild(f);
    var cur = null, DARK = '.vx-hdr, .vx-ftr, .vx6-hero, .vx-band, .vx-mega, .vx-drawer, .vx5-ix--b2b, .vx-phero, .vx-strip, .vx-consent';
    function place() {
      if (!cur || !cur.isConnected) { f.classList.remove('is-on'); return; }
      var r = cur.getBoundingClientRect(), o = 6;
      f.style.left = px(r.left - o); f.style.top = px(r.top - o); f.style.width = px(r.width + 2 * o); f.style.height = px(r.height + 2 * o);
    }
    /* visually hidden radios/checkboxes (segmented choices, toggles) frame the box the reader sees, not a stray 1 px square */
    function proxy(el) {
      if (el.tagName !== 'INPUT' || !/^(radio|checkbox)$/.test(el.type)) return el;
      var r = el.getBoundingClientRect(); if (r.width >= 8 && r.height >= 8 && getComputedStyle(el).opacity !== '0') return el;
      var n = el.nextElementSibling, nr = n && n.getBoundingClientRect();
      if (nr && nr.width && nr.height) return n;
      return el.closest('label') || el;
    }
    d.addEventListener('focusin', function (e) {
      var el = e.target, vis;
      try { vis = el.matches(':focus-visible'); } catch (x) { vis = true; }
      if (!vis || el === body) { cur = null; f.classList.remove('is-on'); return; }
      cur = proxy(el); f.classList.toggle('is-dark', !!el.closest(DARK)); place(); f.classList.add('is-on');
    });
    d.addEventListener('focusout', function () { cur = null; f.classList.remove('is-on'); });
    window.addEventListener('scroll', function () { if (cur) place(); }, { passive: true });
    window.addEventListener('resize', function () { if (cur) place(); });
  }

  /* footer title block: true values only (page, language, site revision, date prices were checked, office, licence, phone) */
  function titleBlock() {
    var ftr = d.querySelector('.vx-ftr'); if (!ftr) return;
    var host = ftr.querySelector('.vx7-title');
    if (!host) { host = d.createElement('dl'); host.className = 'vx-wrap vx7-title'; ftr.appendChild(host); }
    var fmt = function (iso) { if (!iso) return ''; try { return new Intl.DateTimeFormat(t('loc'), { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(iso + 'T12:00:00Z')); } catch (e) { return iso; } };
    var h1 = d.querySelector('main h1, h1'), name = hero ? t('home') : (h1 ? h1.textContent.replace(/\s+/g, ' ').trim() : t('home'));
    if (name.length > 64) name = name.slice(0, 62).replace(/\s+\S*$/, '') + '…';
    var cells = [[t('doc'), name], [t('lang'), t('name')], [t('rev'), fmt(body.getAttribute('data-vx7-rev'))], [t('prices'), fmt(body.getAttribute('data-vx7-prices'))],
      [t('office'), t('city')], [t('coords'), '27.9506° N · 82.4572° W'], [t('licence'), 'Florida Notary Public'], [t('phone'), '<a href="tel:+18887948292">(888) 794-8292</a>']];
    host.innerHTML = cells.filter(function (c) { return c[1]; }).map(function (c) { return '<div><dt>' + c[0] + '</dt><dd>' + c[1] + '</dd></div>'; }).join('');
  }

  function everyPage() { alignGuides(); titleBlock(); }

  var started = false;
  function start() {
    if (started) return; started = true;
    wireFocus();
    if (hero) play(false); else endIntro();
    everyPage();
  }
  var ready = new Promise(function (res) { d.addEventListener('vx:ready', res, { once: true }); setTimeout(res, 900); });
  var fonts = d.fonts && d.fonts.ready ? Promise.race([d.fonts.ready, new Promise(function (r) { setTimeout(r, 700); })]) : Promise.resolve();
  Promise.all([ready, fonts]).then(start);
  function relayout() { if (!started) return; settle(); endIntro(); heroLayout(); everyPage(); }
  /* language switch rewrites the H1, the credential line and the price lists: rebuild without animation */
  d.addEventListener('vx:lang', function () { setTimeout(relayout, 0); });
  d.addEventListener('vx:ready', function () { setTimeout(function () { var h = hero && hero.querySelector('.vx6-hero__h1'); if (h && !h.querySelector('.vx7-ln')) relayout(); }, 0); });
  var rz; window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(relayout, 140); });
  /* lists rendered and filtered by script (services index) change height: re-measure the guides */
  if ('MutationObserver' in window) {
    var mt, mo = new MutationObserver(function (recs) {
      /* our own guides (added, shown, hidden) never trigger a re-measure */
      var own = function (n) { return n.classList && n.classList.contains('vx7-align'); };
      if (recs.every(function (r) { return r.type === 'attributes' ? own(r.target) : Array.prototype.every.call(r.addedNodes, own) && !r.removedNodes.length; })) return;
      clearTimeout(mt); mt = setTimeout(function () { if (started) alignGuides(); }, 80);
    });
    d.querySelectorAll('.vx-index__list, [data-vx-render="pricing"]').forEach(function (el) { mo.observe(el, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'open'] }); });
  }
})();
