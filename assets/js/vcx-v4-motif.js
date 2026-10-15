/* VitaCoreX design v4: guilloche generator + pointer details. No dependencies.
   Works as a deferred browser script (window.vxDesign) and in Node (require) for build-time prerender. */
(function (g) {
  'use strict';
  var T = Math.PI * 2, mm = g.matchMedia ? function (q) { return g.matchMedia(q).matches; } : function () { return false; };
  var reduce = function () { return mm('(prefers-reduced-motion: reduce)'); };
  var fine = function () { return mm('(hover: hover) and (pointer: fine)'); };
  var f = function (n) { return Math.round(n * 10) / 10; };
  var uid = 0;

  // Rose-engine ring: r(t) = R + A*sin(k*t) + B*sin(m*t). Copies are rotations of ONE path (<use>), so the file stays small.
  function ring(R, A, k, B, m, n) {
    for (var d = '', i = 0, t, r; i <= n; i++) {
      t = T * i / n; r = R + A * Math.sin(k * t) + B * Math.sin(m * t);
      d += (i ? 'L' : 'M') + f(r * Math.cos(t)) + ' ' + f(r * Math.sin(t));
    }
    return d + 'Z';
  }
  // Hypotrochoid (spirograph) for the medallion centre; closes after r/gcd(R,r) laps.
  function troch(R, r, d, n) {
    var gcd = function (a, b) { return b ? gcd(b, a % b) : a; }, laps = r / gcd(R, r), N = n * laps, k = (R - r) / r, s = '', i, t;
    for (i = 0; i <= N; i++) { t = T * laps * i / N; s += (i ? 'L' : 'M') + f((R - r) * Math.cos(t) + d * Math.cos(k * t)) + ' ' + f((R - r) * Math.sin(t) - d * Math.sin(k * t)); }
    return s;
  }
  // Presets: rings [R, A, k, B, m, copies]; copies are spread over one lobe (360/k deg) so the lattice is even.
  // o = plain hairline circles between rings; c = spirograph core [R, r, d]. Tuned visually on 2026-10-14.
  // The hero is split into two layers (A outer, B inner) that share a 640-unit viewBox, so CSS can turn them in opposite
  // directions as whole composited <svg> layers (cheap moire) instead of repainting rings inside one SVG.
  var P = {
    heroA: { s: 320, rings: [[290, 10, 40, 3, 120, 5]], o: [266], c: 0 },
    heroB: { s: 320, rings: [[226, 40, 10, 12, 30, 10], [146, 26, 8, 0, 0, 9]], o: [180], c: [60, 21, 28] },
    seal: { s: 120, rings: [[106, 5, 36, 2, 108, 4], [80, 14, 10, 4, 30, 8]], o: [94, 60], c: [36, 14, 16] },
    card: { s: 120, rings: [[100, 10, 12, 0, 0, 8], [64, 14, 8, 0, 0, 8]], o: [84], c: 0 }
  };
  function rosette(name, steps) {
    var p = P[name] || P.card, s = p.s, id = 'vxg' + (++uid), defs = '', body = '';
    steps = steps || 360;
    p.rings.forEach(function (q, j) {
      var step = 360 / q[2] / q[5], uses = '';
      defs += '<path id="' + id + j + '" pathLength="1" d="' + ring(q[0], q[1], q[2], q[3], q[4], steps) + '"/>';
      for (var i = 0; i < q[5]; i++) uses += '<use href="#' + id + j + '" transform="rotate(' + f(i * step) + ')"/>';
      body += '<g class="vx-gl__ring" style="--i:' + j + '">' + uses + '</g>';
    });
    (p.o || []).forEach(function (r) { body += '<circle class="vx-gl__rule" pathLength="1" r="' + r + '"/>'; });
    if (p.c) body += '<path class="vx-gl__core" pathLength="1" d="' + troch(p.c[0], p.c[1], p.c[2], 90) + '"/>';
    return '<svg class="vx-gl" viewBox="' + -s + ' ' + -s + ' ' + 2 * s + ' ' + 2 * s + '" aria-hidden="true" focusable="false"><defs>' + defs + '</defs>' + body + '</svg>';
  }
  var api = { rosette: rosette, presets: P };
  // Node (build time): require() this file and call rosette() to prerender; the divider band generator is in the research doc §3.2.
  if (typeof module === 'object' && module.exports) { module.exports = api; return; }
  var doc = g.document;

  // 1. Hydrate decorative rosettes that were not prerendered at build time.
  function hydrate() {
    doc.querySelectorAll('[data-vx-guilloche]').forEach(function (el) {
      if (!el.querySelector('svg')) el.insertAdjacentHTML('beforeend', rosette(el.getAttribute('data-vx-guilloche'), el.getAttribute('data-vx-steps') | 0));
      el.classList.add('is-ready');
    });
  }
  // 2. Spotlight: one delegated listener writes --mx/--my on the hovered .vx-spot (fine pointers only).
  function spotlight() {
    if (!fine()) return;
    var raf = 0, ev;
    doc.addEventListener('pointermove', function (e) {
      ev = e; if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0; var el = ev.target.closest && ev.target.closest('.vx-spot'); if (!el) return;
        var b = el.getBoundingClientRect();
        el.style.setProperty('--mx', f(ev.clientX - b.left) + 'px'); el.style.setProperty('--my', f(ev.clientY - b.top) + 'px');
      });
    }, { passive: true });
  }
  // 3. Magnetic pull, max 6px, only .vx-magnet, fine pointer, no reduced motion.
  function magnet() {
    if (!fine() || reduce()) return;
    doc.querySelectorAll('.vx-magnet').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var b = el.getBoundingClientRect(), c = function (v) { return Math.max(-6, Math.min(6, v * 0.16)); };
        el.style.setProperty('--tx', f(c(e.clientX - b.left - b.width / 2)) + 'px'); el.style.setProperty('--ty', f(c(e.clientY - b.top - b.height / 2)) + 'px');
      });
      el.addEventListener('pointerleave', function () { el.style.setProperty('--tx', '0px'); el.style.setProperty('--ty', '0px'); });
    });
  }
  // 4. Reveal fallback where scroll-driven animations are missing (Firefox): only content below the fold is held back.
  function reveal() {
    if ((g.CSS && CSS.supports('animation-timeline: view()')) || reduce() || !('IntersectionObserver' in g)) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.removeAttribute('data-vx-pending'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    doc.querySelectorAll('.vx-reveal').forEach(function (el) {
      if (el.getBoundingClientRect().top > g.innerHeight) { el.setAttribute('data-vx-pending', ''); io.observe(el); }
    });
    doc.documentElement.classList.add('vx-io');
  }
  // 5. Number ticker for estimator totals. Final value is written at once under reduced motion.
  function tick(el, to, ms) {
    // en-US in every language: the catalog shows prices as "$1,999" on EN, RU and ES pages alike.
    var from = +el.getAttribute('data-vx-val') || 0, t0;
    var dp = to % 1 ? 2 : 0, fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: dp, maximumFractionDigits: dp });
    el.setAttribute('data-vx-val', to);
    if (reduce() || from === to) { el.textContent = fmt.format(to); return; }
    requestAnimationFrame(function step(now) {
      t0 = t0 || now; var p = Math.min(1, (now - t0) / (ms || 320)), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt.format(p < 1 ? Math.round(from + (to - from) * e) : to);
      if (p < 1) requestAnimationFrame(step);
    });
  }
  // 6. Same-document view transition for the in-place language switch (Chrome 111+, Safari 18+, Firefox 144+).
  function swap(update) { return doc.startViewTransition && !reduce() ? doc.startViewTransition(update) : update(); }

  api.tick = tick; api.swap = swap;
  g.vxDesign = api;
  var go = function () { hydrate(); spotlight(); magnet(); reveal(); };
  doc.readyState === 'loading' ? doc.addEventListener('DOMContentLoaded', go) : go();
})(typeof window !== 'undefined' ? window : globalThis);
