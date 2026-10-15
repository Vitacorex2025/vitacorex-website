/* VitaCoreX v5 — motion controller. One orchestration layer: native CSS transitions + Web Animations API.
   Quality point: html[data-vx5-mode] = full | lite | still   (absent = no JS -> designed stills)
     full  : desktop Fold in WebGL (same geometry as CSS), else CSS 3D; video crossfade; kit build; result motion
     lite  : Save-Data / low memory / few cores -> CSS 3D Fold (desktop) or poster (phone), one video clip
     still : prefers-reduced-motion, "Pause effects" -> posters, no video, instant state changes
   Contracts (AD §10): text and CTAs are never hidden waiting for JS; state comes from data attributes, never
   from animationend; reduced motion is read at load and on change; RAF loops stop when idle, hidden or off-screen.
   Public: window.VX5 = { mode(), force(m), webgl(on), pause(on), glState(), scene(), on(fn) } */
(function () {
  'use strict';
  if (window.VX5 && window.VX5.version) return;

  var root = document.documentElement;
  var base = (function () { var s = document.currentScript && document.currentScript.src; return s ? s.replace(/[^/]*$/, '') : '/assets/vx5/'; })();
  function mq(q) { return window.matchMedia ? window.matchMedia(q) : { matches: false, addEventListener: function () { } }; }
  var mqReduce = mq('(prefers-reduced-motion: reduce)'), mqDesk = mq('(min-width: 64em)'), mqFine = mq('(hover: hover) and (pointer: fine)'), mqPhone = mq('(max-width: 47.99em)');
  var STORE = 'vx5_fx';
  function sget(k, ss) { try { return (ss ? sessionStorage : localStorage).getItem(k); } catch (e) { return null; } }
  function sset(k, v, ss) { try { var st = ss ? sessionStorage : localStorage; if (v == null) st.removeItem(k); else st.setItem(k, v); } catch (e) { /* private mode */ } }
  function qsa(sel, r) { return Array.prototype.slice.call((r || document).querySelectorAll(sel)); }
  /* strings only after vcx-v2.js has loaded the dictionaries (earlier calls would log missing keys); fallbacks until then */
  function t(key, fb, p) { if (!document.documentElement.classList.contains('vx-ready')) return fb; try { var v = window.VX && window.VX.t ? window.VX.t(key, p) : ''; return v || fb; } catch (e) { return fb; } }
  function anim(el, frames, o) { if (!el || !el.animate) return null; try { return el.animate(frames, o); } catch (e) { return null; } }
  var OUT = 'cubic-bezier(.16,1,.3,1)';

  var INIT = window.VX5_INIT || {};
  var S = { force: /^(full|lite|still)$/.test(INIT.mode || '') ? INIT.mode : null, userPaused: sget(STORE) === 'off', gl: INIT.webgl !== false, glLost: false, mode: null, fns: [], api: {} };

  function detect() {
    if (S.force) return S.force;
    if (mqReduce.matches || S.userPaused) return 'still';
    var c = navigator.connection;
    if ((c && c.saveData) || (navigator.deviceMemory && navigator.deviceMemory <= 2) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2)) return 'lite';
    return 'full';
  }
  function apply(forceEmit) {
    var m = detect();
    if (m === S.mode && !forceEmit) return;
    var prev = S.mode; S.mode = m;
    root.setAttribute('data-vx5-mode', m);
    S.fns.forEach(function (fn) { try { fn(m, prev); } catch (e) { if (window.console) console.error('[vx5]', e); } });
    syncPause();
  }
  if (mqReduce.addEventListener) mqReduce.addEventListener('change', function () { apply(); });

  /* ---------------- "Pause effects" (44×44 icon button, AD §4.1) ---------------- */
  function syncPause() {
    qsa('[data-vx5-fx]').forEach(function (b) {
      b.hidden = mqReduce.matches && !S.force;
      b.setAttribute('aria-pressed', S.userPaused ? 'true' : 'false');
      var lbl = S.userPaused ? t('v5.fx.play', 'Play effects') : t('v5.fx.pause', 'Pause effects');
      b.setAttribute('aria-label', lbl); b.title = lbl;
      var s = b.querySelector('[data-vx5-fx-label]'); if (s) s.textContent = lbl;
    });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-vx5-fx]'); if (!b) return;
    S.userPaused = !S.userPaused; sset(STORE, S.userPaused ? 'off' : null); apply(); syncPause();
  });
  ['vx:lang', 'vx:ready', 'vx5:strings'].forEach(function (ev) { document.addEventListener(ev, syncPause); });

  function loadScript(src) {
    return new Promise(function (res, rej) {
      var ex = document.querySelector('script[data-vx5-src="' + src + '"]');
      if (ex) { if (ex.getAttribute('data-loaded')) res(); else { ex.addEventListener('load', res); ex.addEventListener('error', rej); } return; }
      var s = document.createElement('script'); s.src = src; s.async = true; s.setAttribute('data-vx5-src', src);
      s.onload = function () { s.setAttribute('data-loaded', '1'); res(); }; s.onerror = rej; document.head.appendChild(s);
    });
  }
  function inView(el, cb, opts) {
    if (!('IntersectionObserver' in window)) { cb(true); return null; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { cb(e.isIntersecting, e); }); }, opts || { threshold: 0 });
    io.observe(el); return io;
  }

  /* ---------------- hero video: the muted Tampa clips ---------------- */
  function heroVideo(hero) {
    var a = hero.querySelector('video[data-vx5-video]'); if (!a) return;
    var clips = (a.getAttribute('data-clips') || '').split(',').filter(Boolean);
    var b = null, vis = 0, next = 1, timer = 0, onScreen = true, started = false;
    a.muted = true;
    function play(v) { var p = v && v.play(); if (p && p.catch) p.catch(function () { }); }
    function cur() { return [a, b][vis] || a; }
    function stopAll() { clearInterval(timer); timer = 0; [a, b].forEach(function (v) { if (v) v.pause(); }); }
    function start(mode) {
      stopAll();
      if (mode === 'still' || !clips.length || (mode === 'lite' && mqPhone.matches)) return;   /* AD §4.4: phone + Save-Data -> poster only */
      if (!started) { a.src = clips[0]; a.preload = 'auto'; started = true; }
      var single = mode === 'lite' || mqPhone.matches || clips.length < 2;
      a.loop = single;
      if (onScreen) play(cur());
      if (single) return;
      if (!b) { b = a.cloneNode(false); b.removeAttribute('data-vx5-video'); b.classList.remove('is-on'); b.removeAttribute('poster'); b.loop = false; b.muted = true; b.src = clips[next]; b.preload = 'auto'; a.parentNode.insertBefore(b, a.nextSibling); }
      timer = setInterval(function () {
        if (!onScreen || document.hidden || S.mode !== 'full') return;
        var hv = [a, b][1 - vis], vv = [a, b][vis];
        try { hv.currentTime = 0; } catch (e) { /* iOS */ }
        play(hv); hv.classList.add('is-on'); vv.classList.remove('is-on');
        setTimeout(function () { vv.pause(); next = (next + 1) % clips.length; vv.src = clips[next]; vv.load(); }, 900);
        vis = 1 - vis;
      }, 7000);
    }
    requestAnimationFrame(function () { a.classList.add('is-on'); });          /* M01: the video fades in from ink */
    inView(hero, function (v) { onScreen = v; if (!started || S.mode === 'still') return; if (v) play(cur()); else cur().pause(); });
    document.addEventListener('visibilitychange', function () { if (!started) return; if (document.hidden) cur().pause(); else if (onScreen && S.mode !== 'still') play(cur()); });
    S.fns.push(start);
    start(S.mode);
  }

  /* ---------------- Variant A: the Fold ---------------- */
  var SCATTER = { L3: -52, L2: -8, L1: -30, C: 9, R1: 26, R2: 4, R3: 49 };  /* AD §10 M01 */
  var ORDER = { C: 0, L1: 1, R1: 1, L2: 2, R2: 2, L3: 3, R3: 3 };
  function foldIntro(stage) {
    qsa('.vx5-plane', stage).forEach(function (p, i) {
      var id = p.getAttribute('data-p'), phi = getComputedStyle(p).getPropertyValue('--phi').trim();
      var dy = (i % 2 ? -24 : 24);
      anim(p, [{ transform: 'translateY(' + dy + 'px) rotateZ(' + SCATTER[id] + 'deg) rotateY(90deg)' }, { transform: 'translateY(0) rotateZ(' + phi + ') rotateY(90deg)' }],
        { duration: 900, delay: ORDER[id] * 40, easing: OUT, fill: 'backwards' });
      anim(p, [{ opacity: 0, transform: 'translateX(-100%)' }, { opacity: 1, offset: .5 }, { opacity: 0, transform: 'translateX(100%)' }], { duration: 1200, delay: 900 + ORDER[id] * 40, easing: 'linear', pseudoElement: '::after' });
    });
    qsa('.vx5-fold__hinge path', stage).forEach(function (h) { anim(h, [{ strokeDasharray: '1 1', strokeDashoffset: 1 }, { strokeDasharray: '1 1', strokeDashoffset: 0 }], { duration: 600, delay: 500, easing: OUT, fill: 'backwards' }); });
  }
  function heroA(hero) {
    var stageD = hero.querySelector('[data-vx5-fold-stage="d"]'), stageM = hero.querySelector('[data-vx5-fold-stage="m"]');
    if (!stageD) return;
    var rig = stageD.querySelector('.vx5-fold__rig'), glHost = stageD.querySelector('.vx5-fold__gl');
    var scene = null, loading = false, visible = false, playIntro = !sget('vx5_m01', true);
    var data = {}; try { data = JSON.parse(stageD.getAttribute('data-vx5-planes')); } catch (e) { /* static */ }

    /* M02 for the CSS tier: rig rotateY(-12 +/- 3), rotateX(-24 +/- 2), lerp .08, stops 1 s after the last input */
    var tx = 0, ty = 0, cx = 0, cy = 0, raf = 0, last = 0;
    function loop(now) {
      raf = 0;
      if (document.hidden || !visible) return;
      cx += (tx - cx) * .08; cy += (ty - cy) * .08;
      rig.style.setProperty('--pry', (cx * 3).toFixed(3) + 'deg'); rig.style.setProperty('--prx', (-cy * 2).toFixed(3) + 'deg');
      if (now - last < 1000 || Math.abs(tx - cx) > .001 || Math.abs(ty - cy) > .001) raf = requestAnimationFrame(loop);
    }
    function onMove(e) {
      if (e.pointerType !== 'mouse' || !mqFine.matches || scene || S.mode === 'still') return;
      var r = hero.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1)); ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
      last = performance.now(); if (!raf) raf = requestAnimationFrame(loop);
    }
    function onLeave() { tx = 0; ty = 0; last = performance.now(); if (!raf) raf = requestAnimationFrame(loop); }
    hero.addEventListener('pointermove', onMove, { passive: true });
    hero.addEventListener('pointerleave', onLeave, { passive: true });

    function drop() { if (scene) { scene.destroy(); scene = null; } stageD.removeAttribute('data-gl'); }
    function wantGL() { return S.mode === 'full' && S.gl && !S.glLost && mqDesk.matches && !!glHost; }
    function ensure() {
      if (scene || loading || !visible || !wantGL()) return;
      loading = true;
      loadScript(base + 'vx5-scene-a.js').then(function () {
        loading = false;
        if (scene || !wantGL() || !window.VX5SceneA) return;
        scene = window.VX5SceneA.mount(glHost, {
          data: data, pointerHost: hero, intro: playIntro, pointer: mqFine.matches,
          onLost: function (why) { scene = null; S.glLost = true; stageD.removeAttribute('data-gl'); stageD.setAttribute('data-gl-lost', why || 'lost'); if (window.console) console.warn('[vx5] WebGL ' + (why || 'lost') + ' -> CSS 3D tier'); }
        });
        if (scene) { playIntro = false; stageD.setAttribute('data-gl', 'on'); }
      }).catch(function () { loading = false; S.glLost = true; });
    }
    inView(hero, function (v) { visible = v; if (v) ensure(); });
    function sync(m) {
      if (wantGL()) ensure(); else drop();
      if (m === 'still') { rig.style.removeProperty('--pry'); rig.style.removeProperty('--prx'); }
    }
    S.fns.push(sync);
    sync(S.mode);
    /* M01, once per session; the GL tier plays its own intro */
    if (playIntro && S.mode !== 'still') {
      sset('vx5_m01', '1', true);
      if (!wantGL()) { foldIntro(mqPhone.matches ? stageM : stageD); playIntro = false; }
      else qsa('.vx5-fold__hinge path', stageD).forEach(function (h) { anim(h, [{ strokeDasharray: '1 1', strokeDashoffset: 1 }, { strokeDasharray: '1 1', strokeDashoffset: 0 }], { duration: 600, delay: 500, easing: OUT, fill: 'backwards' }); });
    }
    if (mqDesk.addEventListener) mqDesk.addEventListener('change', function () { sync(S.mode); });
    S.api.scene = function () { return scene; };
  }

  /* ---------------- Variant B: the kit builds itself once (AD §5.1, about 1.6 s) ---------------- */
  function heroB(hero) {
    var kit = hero.querySelector('[data-vx5-kit]'); if (!kit) return;
    /* sheets slide in from x -40 (600 ms, 120 ms stagger), the flap closes 37.69 deg -> 0 (500 ms), the band slides in
       (300 ms). Once per session; phones keep the static kit; still / no JS shows the finished frame. */
    var once = !!sget('vx5_m01b', true);
    inView(kit, function (v) {
      if (!v || once || S.mode === 'still' || mqPhone.matches) return; once = true; sset('vx5_m01b', '1', true);
      qsa('.vx5-k-sheet', kit).forEach(function (s, i) { anim(s, [{ transform: 'translateX(-40px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 600, delay: i * 120, easing: OUT, fill: 'backwards' }); });
      anim(kit.querySelector('.vx5-k-flap'), [{ transform: 'rotate(-37.69deg)', opacity: 0 }, { opacity: 1, offset: .3 }, { transform: 'none', opacity: 1 }], { duration: 500, delay: 600, easing: OUT, fill: 'backwards' });
      anim(kit.querySelector('.vx5-k-band'), [{ transform: 'translateX(-40px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 300, delay: 1100, easing: OUT, fill: 'backwards' });
    }, { threshold: .3 });
  }

  /* ---------------- typographic glue: keep set phrases on one line per language (e.g. RU H1 B "ваши документы") ---------------- */
  function glue() {
    qsa('[data-vx5-glue]').forEach(function (el) {
      var map = {}; try { map = JSON.parse(el.getAttribute('data-vx5-glue')); } catch (e) { return; }
      var list = map[root.getAttribute('lang')] || []; if (!list.length) return;
      var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), n;
      while ((n = w.nextNode())) list.forEach(function (ph) { if (n.nodeValue.indexOf(ph) > -1) n.nodeValue = n.nodeValue.split(ph).join(ph.replace(/ /g, ' ')); });
    });
  }
  ['vx:ready', 'vx:lang'].forEach(function (ev) { document.addEventListener(ev, glue); });

  /* ---------------- tabs helper (arrow keys, Home/End, roving tabindex) ---------------- */
  function tablist(list, onSelect, vertical) {
    var tabs = qsa('[role="tab"]', list);
    list.addEventListener('keydown', function (e) {
      var i = tabs.indexOf(document.activeElement); if (i < 0) return;
      var k = e.key, n = -1;
      if (k === 'ArrowRight' || (vertical && k === 'ArrowDown')) n = (i + 1) % tabs.length;
      else if (k === 'ArrowLeft' || (vertical && k === 'ArrowUp')) n = (i - 1 + tabs.length) % tabs.length;
      else if (k === 'Home') n = 0; else if (k === 'End') n = tabs.length - 1;
      if (n < 0) return;
      e.preventDefault(); tabs[n].focus(); onSelect(tabs[n], true);
    });
    tabs.forEach(function (tb) { tb.addEventListener('click', function () { onSelect(tb, true); }); });
    return function select(tb) { tabs.forEach(function (x) { var on = x === tb; x.setAttribute('aria-selected', on ? 'true' : 'false'); x.tabIndex = on ? 0 : -1; }); };
  }

  /* ---------------- result module (AD §8, M07) ---------------- */
  function result(el) {
    var box = el.querySelector('[data-step-box]'); if (!box) return;
    var kits = el.querySelector('[data-vx5-kits]'), steps = el.querySelector('.vx5-steps'), panel = el.querySelector('[role="tabpanel"]');
    var meta = el.querySelector('[data-vx5-step-of]'), playBtn = el.querySelector('[data-vx5-rs-play]');
    var step = +(el.getAttribute('data-step') || 3), kit = el.getAttribute('data-kit') || 'translation', timer = 0;

    function setStep(n) {
      step = Math.max(1, Math.min(3, n));
      box.setAttribute('data-step', String(step)); el.setAttribute('data-step', String(step));
      selStep(steps.querySelector('[data-vx5-step="' + step + '"]'));
      if (meta) meta.textContent = t('v5.rs.step_of', 'Step ' + step + ' of 3', { n: step });
    }
    var selStep = tablist(steps, function (tb, user) { if (user) stop(); setStep(+tb.getAttribute('data-vx5-step')); }, true);
    var selKit = tablist(kits, function (tb, user) { setKit(tb.getAttribute('data-kit'), user); }, false);
    function setKit(k, user) {
      kit = k; el.setAttribute('data-kit', k);
      var tb = kits.querySelector('[data-kit="' + k + '"]'); selKit(tb);
      if (panel && tb) panel.setAttribute('aria-labelledby', tb.id);
      /* the static triptych follows the selected kit (instant) */
      var src = box.querySelector('[data-kit-group="' + k + '"]');
      qsa('.vx5-rs__trip .vx5-rs__box', el).forEach(function (fb, i) {
        var c = src.cloneNode(true); var band = c.querySelector('.vx5-kit__band'); if (band) band.classList.toggle('vx5-kit__band--gold', i === 2);
        fb.innerHTML = ''; fb.appendChild(c);
      });
      if (user && history.replaceState) history.replaceState(null, '', location.pathname + location.search + '#kit-' + k);
    }
    function lbl() { var s = playBtn && playBtn.querySelector('[data-vx5-play-label]'); if (s) s.textContent = playBtn.getAttribute('aria-pressed') === 'true' ? t('v5.rs.pause', 'Pause') : t('v5.rs.play', 'Play'); }
    function stop() { clearTimeout(timer); timer = 0; if (playBtn) { playBtn.setAttribute('aria-pressed', 'false'); lbl(); } }
    function play() {
      setStep(1); playBtn.setAttribute('aria-pressed', 'true'); lbl();
      (function tick() { timer = setTimeout(function () { setStep(step + 1); if (step < 3) tick(); else stop(); }, 3200); })();
    }
    if (playBtn) playBtn.addEventListener('click', function () { if (playBtn.getAttribute('aria-pressed') === 'true') stop(); else play(); });
    var prev = el.querySelector('[data-vx5-rs-prev]'), next = el.querySelector('[data-vx5-rs-next]');
    if (prev) prev.addEventListener('click', function () { stop(); setStep(step - 1); });
    if (next) next.addEventListener('click', function () { stop(); setStep(step + 1); });
    inView(el, function (v) { if (!v && timer) stop(); });                      /* Play only while in view */
    S.fns.push(function (m) { if (m === 'still') stop(); });
    ['vx:ready', 'vx:lang', 'vx5:strings'].forEach(function (ev) { document.addEventListener(ev, function () { setStep(step); lbl(); }); });
    var h = (location.hash.match(/^#kit-(translation|apostille|claims)$/) || [])[1];
    setKit(h || kit, false); setStep(step);
  }

  /* ---------------- init ---------------- */
  function init() {
    apply(true);
    qsa('[data-vx5-hero]').forEach(function (h) {
      if (h.hidden) return;
      heroVideo(h);
      if (h.getAttribute('data-vx5-hero') === 'a') heroA(h); else heroB(h);
    });
    qsa('[data-vx5-rs]').forEach(result);
    syncPause(); glue();
  }

  window.VX5 = {
    version: '5.1.0',
    mode: function () { return S.mode; },
    force: function (m) { S.force = /^(full|lite|still)$/.test(m || '') ? m : null; apply(); },
    webgl: function (on) { S.gl = !!on; if (on) S.glLost = false; apply(true); },
    pause: function (v) { S.userPaused = !!v; sset(STORE, v ? 'off' : null); apply(); },
    glState: function () { return { allowed: S.gl, lost: S.glLost }; },
    scene: function () { return S.api.scene ? S.api.scene() : null; },
    on: function (fn) { S.fns.push(fn); }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
