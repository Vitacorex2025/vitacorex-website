/* VitaCoreX v7 "Assembly" — lab layer (owner review). Runs after the v2 i18n engine.
   Timeline (desktop, ms): guides 0–560 · baseline rules 160–640 · H1 lines rise 200–840 · slope line 600–1200 ·
   "in order" settles 820–1380 · full stop 1240–1360 · window opens 1100–2000 · guides hand over + ruler sweep 1500–1900.
   The final state is the no-JS / reduced-motion state; any key, click or wheel finishes the intro at once. */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  var hero = d.querySelector('.vx6-hero');
  if (!hero || !d.body.classList.contains('vx7')) return;
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
  function anim(el, kf, o) { if (!el || !el.animate) return null; var a = el.animate(kf, Object.assign({ fill: 'both' }, o)); running.push(a); return a; }
  /* write the final values inline and drop the animations, so later layout (resize, language) owns the styles again */
  function settle() { running.forEach(function (a) { try { a.finish(); if (a.commitStyles) a.commitStyles(); a.cancel(); } catch (e) { /* element gone */ } }); running = []; }
  function finishAll() { settle(); endIntro(); }
  function endIntro() { root.classList.remove('vx7-intro'); }
  function px(n) { return Math.round(n * 10) / 10 + 'px'; }

  /* ---------- geometry: the 12-column grid of the hero ---------- */
  function grid() {
    var hr = hero.getBoundingClientRect(), wrap = hero.querySelector('.vx6-hero__inner'), cs = getComputedStyle(wrap), wr = wrap.getBoundingClientRect();
    var x0 = wr.left - hr.left + parseFloat(cs.paddingLeft), W = wr.width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    var cw = (W - 11 * GAP) / 12, bar = hero.querySelector('.vx6-hero__bar');
    var yB = bar ? bar.getBoundingClientRect().top - hr.top : hr.height;
    var hdr = d.querySelector('.vx-hdr'), top = hdr ? Math.max(0, hdr.getBoundingClientRect().bottom - hr.top) : 0;
    return { w: hr.width, h: hr.height, x0: x0, cw: cw, mod: cw + GAP, yB: yB, top: top, col: function (n) { return x0 + (n - 1) * (cw + GAP); } };
  }

  /* ---------- 1. H1: wrap set lines, red words, the full stop; baseline rules ---------- */
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
  function placeRules(h) {
    h.querySelectorAll('.vx7-ln').forEach(function (ln) {
      var inn = ln.querySelector('.vx7-ln__in'), bl = ln.querySelector('.vx7-bl'), r = ln.querySelector('.vx7-rule');
      if (!r) { r = d.createElement('i'); r.className = 'vx7-rule'; r.setAttribute('aria-hidden', 'true'); ln.appendChild(r); }
      var lr = ln.getBoundingClientRect(), br = bl.getBoundingClientRect(), fs = parseFloat(getComputedStyle(h).fontSize);
      r.style.top = px(br.top - lr.top);
      r.style.width = px(inn.getBoundingClientRect().width + .3 * fs);
    });
  }

  /* ---------- 2. guides ---------- */
  function guides(g) {
    var el = hero.querySelector('.vx7-guides');
    if (!el) {
      el = d.createElement('div'); el.className = 'vx7-guides'; el.setAttribute('aria-hidden', 'true');
      el.innerHTML = '<div class="vx-wrap">' + new Array(13).join('<i></i>') + '</div>';
      hero.insertBefore(el, hero.querySelector('.vx6-hero__inner'));
    }
    el.style.setProperty('--vx7-gtop', px(g.top)); el.style.setProperty('--vx7-gh', px(Math.max(0, g.yB - g.top)));
    return el;
  }

  /* ---------- 3. window on the 17:22 slope ---------- */
  var veil, lines;
  function windowGeom(g) {
    var A = [g.col(7), 0], D = [g.col(12), g.yB], dx = D[0] - A[0];
    A[1] = g.yB - dx * 22 / 17;
    return { A: A, D: D, B: [g.w, A[1]], C: [g.w, g.yB] };
  }
  function poly(g, A, B, C, D) {
    var p = function (q) { return px(q[0]) + ' ' + px(q[1]); };
    return 'polygon(evenodd, 0 0, ' + px(g.w) + ' 0, ' + px(g.w) + ' ' + px(g.h) + ', 0 ' + px(g.h) + ', 0 0, ' + p(A) + ', ' + p(B) + ', ' + p(C) + ', ' + p(D) + ', ' + p(A) + ', 0 0)';
  }
  function windowBuild(g) {
    var media = hero.querySelector('.vx6-hero__media'); if (!media) return null;
    if (!veil) { veil = d.createElement('div'); veil.className = 'vx7-veil'; media.appendChild(veil); }
    if (!lines) { lines = d.createElementNS('http://www.w3.org/2000/svg', 'svg'); lines.setAttribute('class', 'vx7-lines'); lines.setAttribute('aria-hidden', 'true'); lines.setAttribute('focusable', 'false'); media.appendChild(lines); }
    var big = window.innerWidth >= 1280;
    veil.classList.toggle('is-full', !big);
    if (!big) { veil.style.clipPath = ''; return null; }
    var w = windowGeom(g), u = [w.D[0] - w.A[0], w.D[1] - w.A[1]], len = Math.hypot(u[0], u[1]); u = [u[0] / len, u[1] / len];
    var s0 = [w.A[0] - u[0] * GAP, w.A[1] - u[1] * GAP], s1 = [w.D[0] + u[0] * GAP, w.D[1] + u[1] * GAP];
    lines.setAttribute('viewBox', '0 0 ' + g.w + ' ' + g.h);
    lines.innerHTML = '<path class="s" pathLength="1" d="M' + s0.join(' ') + 'L' + s1.join(' ') + '"/>' +
      '<path class="h" pathLength="1" d="M' + (w.A[0] - GAP) + ' ' + w.A[1] + 'H' + g.w + '"/>';
    veil.style.clipPath = poly(g, w.A, w.B, w.C, w.D);
    return w;
  }

  /* ---------- 4. ruler + marker ---------- */
  var marker;
  function ruler(g) {
    var bar = hero.querySelector('.vx6-hero__bar'); if (!bar) return null;
    var r = bar.querySelector('.vx7-ruler');
    if (!r) { r = d.createElement('span'); r.className = 'vx7-ruler'; r.setAttribute('aria-hidden', 'true'); bar.appendChild(r);
      marker = d.createElement('i'); marker.className = 'vx7-marker'; marker.setAttribute('aria-hidden', 'true'); bar.appendChild(marker); }
    bar.style.setProperty('--vx7-x0', px(g.x0)); bar.style.setProperty('--vx7-mod', px(g.mod));
    return r;
  }
  function wireMarker() {
    if (!marker || !fine) return;
    var bar = hero.querySelector('.vx6-hero__bar'), cells = bar.querySelectorAll('.vx6-ticker a'), pending = false, lastX = 0, inCell = false;
    function snap() {
      pending = false; if (inCell) return;
      var g = grid(), n = Math.round((lastX - g.x0) / g.mod); n = Math.max(0, Math.min(11, n));
      marker.style.width = '24px'; marker.style.setProperty('--vx7-mx', px(g.x0 + n * g.mod)); marker.classList.add('is-on');
    }
    hero.addEventListener('pointermove', function (e) { lastX = e.clientX - hero.getBoundingClientRect().left; if (!pending) { pending = true; requestAnimationFrame(snap); } }, { passive: true });
    hero.addEventListener('pointerleave', function () { marker.classList.remove('is-on'); });
    cells.forEach(function (a) {
      var on = function () {
        inCell = true; var hr = hero.getBoundingClientRect(), ar = a.getBoundingClientRect();
        marker.style.setProperty('--vx7-mx', px(ar.left - hr.left)); marker.style.width = px(ar.width - 16); marker.classList.add('is-on');
      };
      var off = function () { inCell = false; };
      a.addEventListener('pointerenter', on); a.addEventListener('focus', on); a.addEventListener('pointerleave', off); a.addEventListener('blur', off);
    });
  }

  /* ---------- 5. smart alignment guides on the home price list ---------- */
  function alignGuides() {
    var sec = d.querySelector('#services'); if (!sec || window.innerWidth < 1024) return;
    var groups = sec.querySelectorAll('.vx5-ix'); if (!groups.length) return;
    var first = groups[0], last = groups[groups.length - 1];
    var rows = first.querySelector('.vx5-ix__rows'), act = first.querySelector('.vx5-ix__act'); if (!rows || !act) return;
    if (getComputedStyle(sec).position === 'static') sec.style.position = 'relative';
    var sr = sec.getBoundingClientRect(), top = first.getBoundingClientRect().top - sr.top, bottom = last.getBoundingClientRect().bottom - sr.top;
    var xs = [rows.getBoundingClientRect().right - sr.left, act.getBoundingClientRect().left - sr.left];
    var made = sec.querySelectorAll('.vx7-align');
    var els = made.length ? Array.prototype.slice.call(made) : xs.map(function () { var i = d.createElement('i'); i.className = 'vx7-align'; i.setAttribute('aria-hidden', 'true'); sec.appendChild(i); return i; });
    els.forEach(function (i, k) { i.style.left = px(xs[k] - .5); i.style.top = px(top); i.style.height = px(bottom - top); });
    if (!sec.__vx7) {
      sec.__vx7 = true;
      groups.forEach(function (gr) {
        gr.addEventListener('pointerenter', function () { els.forEach(function (i) { i.classList.add('is-hint'); }); });
        gr.addEventListener('pointerleave', function () { els.forEach(function (i) { i.classList.remove('is-hint'); }); });
        gr.addEventListener('focusin', function () { els.forEach(function (i) { i.classList.add('is-hint'); }); });
        gr.addEventListener('focusout', function () { els.forEach(function (i) { i.classList.remove('is-hint'); }); });
      });
      if (!reduce && 'IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (en) {
          if (!en[0].isIntersecting) return; io.disconnect();
          els.forEach(function (i, k) {
            i.animate([{ opacity: 1, transform: 'scaleY(0)' }, { opacity: 1, transform: 'scaleY(1)', offset: .55 }, { opacity: 1, transform: 'scaleY(1)', offset: .8 }, { opacity: 0, transform: 'scaleY(1)' }],
              { duration: 1300, delay: k * 120, easing: E_DRAW });
          });
        }, { threshold: .15 });
        io.observe(first);
      }
    }
  }

  /* ---------- 6. focus registration frame ---------- */
  function wireFocus() {
    var f = d.createElement('div'); f.className = 'vx7-focus'; f.setAttribute('aria-hidden', 'true'); d.body.appendChild(f);
    var cur = null, DARK = '.vx-hdr, .vx-ftr, .vx6-hero, .vx-band, .vx-mega, .vx-drawer, .vx5-ix--b2b, .vx-phero, .vx-strip';
    function place() {
      if (!cur || !cur.isConnected) { f.classList.remove('is-on'); return; }
      var r = cur.getBoundingClientRect(), o = 6;
      f.style.left = px(r.left - o); f.style.top = px(r.top - o); f.style.width = px(r.width + 2 * o); f.style.height = px(r.height + 2 * o);
    }
    d.addEventListener('focusin', function (e) {
      var el = e.target; var vis = false; try { vis = el.matches(':focus-visible'); } catch (x) { vis = true; }
      if (!vis || el === d.body) { cur = null; f.classList.remove('is-on'); return; }
      cur = el; f.classList.toggle('is-dark', !!el.closest(DARK)); place(); f.classList.add('is-on');
    });
    d.addEventListener('focusout', function () { cur = null; f.classList.remove('is-on'); });
    window.addEventListener('scroll', function () { if (cur) place(); }, { passive: true });
    window.addEventListener('resize', function () { if (cur) place(); });
  }

  /* ---------- 7. live Tampa line ---------- */
  var clockTimer;
  function clock() {
    var cred = hero.querySelector('.vx6-hero__cred'); if (!cred) return;
    var s = cred.querySelector('.vx7-clock');
    if (!s) { s = d.createElement('span'); s.className = 'vx7-clock'; cred.appendChild(s); }
    var time = '';
    try { time = new Intl.DateTimeFormat(t('loc'), { hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York' }).format(new Date()); } catch (e) { return; }
    s.textContent = '· ' + t('tampa') + ' ' + time + ' ET';
    clearTimeout(clockTimer); clockTimer = setTimeout(clock, (60 - new Date().getSeconds()) * 1000 + 50);
  }

  /* ---------- 8. footer title block (true values only) ---------- */
  function titleBlock() {
    var ftr = d.querySelector('.vx-ftr'); if (!ftr) return;
    var host = ftr.querySelector('.vx7-title');
    if (!host) { host = d.createElement('dl'); host.className = 'vx-wrap vx7-title'; ftr.appendChild(host); }
    var b = d.body, fmt = function (iso) { try { return new Intl.DateTimeFormat(t('loc'), { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(iso + 'T12:00:00Z')); } catch (e) { return iso; } };
    var cells = [[t('doc'), t('home')], [t('lang'), t('name')], [t('rev'), fmt(b.getAttribute('data-vx7-rev'))], [t('prices'), fmt(b.getAttribute('data-vx7-prices'))],
      [t('office'), t('city')], [t('coords'), '27.9506° N · 82.4572° W'], [t('licence'), 'Florida Notary Public'], [t('phone'), '(888) 794-8292']];
    host.innerHTML = cells.map(function (c) { return '<div><dt>' + c[0] + '</dt><dd>' + c[1] + '</dd></div>'; }).join('');
  }

  /* ---------- replay control (lab only) ---------- */
  var replayBtn;
  function replay() {
    if (!replayBtn) {
      replayBtn = d.createElement('button'); replayBtn.type = 'button'; replayBtn.className = 'vx7-replay';
      replayBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'auto' }); play(true); });
      d.body.appendChild(replayBtn);
    }
    replayBtn.innerHTML = '<b aria-hidden="true">↻</b><span>' + t('replay') + '</span>'; replayBtn.setAttribute('aria-label', t('replay'));
    replayBtn.hidden = reduce;
  }

  /* ---------- the intro ---------- */
  function layoutAll() {
    var h = wrapH1(), g = grid();
    if (h) placeRules(h);
    guides(g); windowBuild(g); ruler(g); alignGuides(); clock(); titleBlock(); replay();
    return { h: h, g: g };
  }
  function play(force) {
    running.forEach(function (a) { try { a.cancel(); } catch (e) { /* noop */ } }); running = [];
    var s = layoutAll(), h = s.h, g = s.g;
    if (reduce) { endIntro(); return; }
    if (force) root.classList.add('vx7-intro');
    if (!root.classList.contains('vx7-intro')) return;
    root.classList.add('vx7-run');
    var phone = window.innerWidth < 768, rise = phone ? 520 : 640, step = phone ? 70 : 90;

    /* guides */
    var gs = hero.querySelectorAll('.vx7-guides i'), gEl = hero.querySelector('.vx7-guides');
    gs.forEach(function (i, k) { anim(i, [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], { duration: phone ? 400 : 560, delay: k * 20, easing: E_DRAW }); });
    anim(gEl, [{ opacity: 1 }, { opacity: 0 }], { duration: 400, delay: 1500, easing: 'ease' });

    /* H1 */
    if (h) {
      var lns = h.querySelectorAll('.vx7-ln');
      lns.forEach(function (ln, k) {
        anim(ln.querySelector('.vx7-ln__in'), [{ transform: 'translateY(1.35em)' }, { transform: 'none' }], { duration: rise, delay: 200 + k * step, easing: E_OUT });
        var r = ln.querySelector('.vx7-rule'), last = k === lns.length - 1;
        anim(r, [{ transform: 'scaleX(0)', opacity: 1 }, { transform: 'scaleX(1)', opacity: 1, offset: .3 }, { transform: 'scaleX(1)', opacity: 1, offset: .82 }, { transform: 'scaleX(1)', opacity: last ? .43 : 0 }],
          { duration: 1640, delay: 160 + k * step, easing: E_DRAW });
      });
      var ws = h.querySelectorAll('em .vx7-w');
      var from = [['translate(0, .09em) rotate(-1.5deg)'], ['translate(.03em, -.07em) rotate(1.2deg)']];
      ws.forEach(function (w, k) { anim(w, [{ transform: (from[k] || from[1])[0] }, { transform: 'none' }], { duration: 560, delay: 820 + k * 60, easing: E_SET }); });
      anim(h.querySelector('.vx7-stop'), [{ opacity: 0 }, { opacity: 1 }], { duration: 120, delay: 1240, easing: 'linear' });
    }

    /* window */
    var w = windowGeom(g);
    if (veil && lines && window.innerWidth >= 1280) {
      var closed = poly(g, w.A, w.A, w.D, w.D), open = poly(g, w.A, w.B, w.C, w.D);
      anim(veil, [{ clipPath: closed }, { clipPath: open }], { duration: 900, delay: 1100, easing: E_OUT });
      var ps = lines.querySelectorAll('path');
      ps.forEach(function (p) { p.style.strokeDasharray = '1'; });
      anim(ps[0], [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 600, delay: 600, easing: E_DRAW });
      if (ps[1]) anim(ps[1], [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 500, delay: 1300, easing: E_DRAW });
    }

    /* ruler sweep */
    var r = hero.querySelector('.vx7-ruler');
    anim(r, [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], { duration: 400, delay: 1500, easing: E_DRAW });

    var end = setTimeout(function () { settle(); endIntro(); root.classList.remove('vx7-run'); }, 2100);
    var stop = function () { clearTimeout(end); finishAll(); root.classList.remove('vx7-run'); off(); };
    var off = function () { ['keydown', 'pointerdown', 'wheel', 'touchstart'].forEach(function (ev) { window.removeEventListener(ev, stop, true); }); };
    ['keydown', 'pointerdown', 'wheel', 'touchstart'].forEach(function (ev) { window.addEventListener(ev, stop, { capture: true, passive: true }); });
    setTimeout(off, 2200);
  }

  var started = false;
  function start() { if (started) return; started = true; wireFocus(); play(false); wireMarker(); }
  /* wait for the language strings (vx:ready) and the web fonts, so lines are measured once, in their final shape */
  var ready = new Promise(function (res) { d.addEventListener('vx:ready', res, { once: true }); setTimeout(res, 900); });
  var fonts = d.fonts && d.fonts.ready ? Promise.race([d.fonts.ready, new Promise(function (r) { setTimeout(r, 700); })]) : Promise.resolve();
  Promise.all([ready, fonts]).then(start);
  /* language switch replaces the H1 and the credential line: rebuild without animation */
  d.addEventListener('vx:lang', function () { setTimeout(function () { settle(); endIntro(); layoutAll(); }, 0); });
  /* if the strings arrive after the fallback start, the H1 is rewritten: wrap it again */
  d.addEventListener('vx:ready', function () { setTimeout(function () { var h = hero.querySelector('.vx6-hero__h1'); if (started && h && !h.querySelector('.vx7-ln')) { settle(); endIntro(); layoutAll(); } }, 0); });
  var rz; window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(function () { settle(); endIntro(); layoutAll(); }, 120); });
})();
