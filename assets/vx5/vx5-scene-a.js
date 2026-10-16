/* VitaCoreX v5 — the Fold, "Full" tier (WebGL2, no dependencies, ~4 KB gzip).
   Same geometry as the CSS 3D tier: the plane table, rig rotation, perspective and perspective-origin are read
   from the stage's data-vx5-planes and projected exactly like CSS transforms (px space, y down). It adds only what
   ART_DIRECTION_V5 §3.2 allows: contact shading at the hinge and a thin edge specular that follows the pointer.
   API: VX5SceneA.mount(host, { data, pointerHost, intro, pointer, onLost, capture, forceSize })
        -> { pause, resume, destroy, settle, snapshot(type, q), stats, canvas }
   - draws only while something moves (intro, pointer ease); idle otherwise; stops 1 s after the last input
   - pauses when the tab is hidden or the hero is off-screen; resumes without a time jump
   - webglcontextlost -> destroys itself and calls onLost(); the page falls back to the CSS tier / poster */
(function () {
  'use strict';
  if (window.VX5SceneA) return;
  var D2R = Math.PI / 180;
  var SCATTER = { L3: -52, L2: -8, L1: -30, C: 9, R1: 26, R2: 4, R3: 49 };
  var ORDER = { C: 0, L1: 1, R1: 1, L2: 2, R2: 2, L3: 3, R3: 3 };

  var VS = '#version 300 es\n' +
    'in vec2 aUv;\n' +
    'uniform vec3 uO, uU, uV;\n' +           /* plane origin and edge vectors in CSS px space (already rotated) */
    'uniform vec4 uView;\n' +                /* W, H, perspective d */
    'uniform vec2 uPO;\n' +                  /* perspective-origin in px */
    'out vec2 vUv;\n' +
    'void main(){\n' +
    '  vec3 p = uO + uU * aUv.x + uV * aUv.y;\n' +
    '  float w = (uView.z - p.z) / uView.z;\n' +
    '  vec2 s = uPO * w + p.xy - uPO;\n' +
    '  gl_Position = vec4(2.0 * s.x / uView.x - w, w - 2.0 * s.y / uView.y, -p.z / 2000.0 * w, w);\n' +
    '  vUv = aUv;\n' +
    '}';
  var FS = '#version 300 es\nprecision highp float;\n' +
    'in vec2 vUv;\n' +
    'uniform vec2 uA;\n' +                   /* alpha at the hinge (bottom), alpha at the top */
    'uniform float uEdge, uKey, uHgt, uLight, uSweep, uSpec;\n' +
    'uniform float uLines[6];\n' +
    'out vec4 o;\n' +
    'void main(){\n' +
    '  vec3 paper = vec3(214., 236., 240.) / 255.;\n' +
    '  float v = vUv.y;\n' +                 /* 0 = top edge, 1 = hinge */
    '  float a = mix(uA.y, uA.x, v);\n' +
    '  vec3 c = paper * (0.92 + 0.16 * uLight);\n' +
    '  float contact = smoothstep(0.78, 1.0, v);\n' +          /* where the planes meet: denser and darker */
    '  a *= 1.0 + 0.6 * contact; c *= 1.0 - 0.35 * contact;\n' +
    '  float px = 1.0 / uHgt;\n' +
    '  if (uKey > 0.5) {\n' +                /* keystone: 6 text lines, 1 px, 22 px pitch from 36 px */
    '    for (int i = 0; i < 6; i++) {\n' +
    '      float y = (36.0 + 22.0 * float(i)) * px;\n' +
    '      float on = (1.0 - smoothstep(0.0, px * 1.1, abs(v - y))) * step(0.08, vUv.x) * step(vUv.x, 0.08 + uLines[i]);\n' +
    '      c = mix(c, vec3(10., 37., 48.) / 255., on * 0.6); a = max(a, on * 0.28);\n' +
    '    }\n' +
    '  }\n' +
    '  float ew = (uKey > 0.5 ? 2.0 : 1.0) * px;\n' +
    '  float edge = 1.0 - smoothstep(ew * 0.6, ew * 1.4, v);\n' +
    '  vec3 ec = uKey > 0.5 ? vec3(124., 210., 222.) / 255. : vec3(169., 228., 236.) / 255.;\n' +
    '  float ea = uKey > 0.5 ? 1.0 : uEdge;\n' +
    '  float spec = pow(max(0.0, 1.0 - abs(vUv.x - uSpec) * 2.2), 6.0) * 0.55;\n' +   /* thin catch-light on the top edge */
    '  c = mix(c, ec + spec, edge); a = mix(a, ea, edge);\n' +
    '  float sw = max(0.0, 1.0 - abs((vUv.x - (1.0 - v) * 0.18) - uSweep) * 9.0) * 0.18;\n' + /* M01 light sweep */
    '  c += sw; a = clamp(a + sw * 0.5, 0.0, 1.0);\n' +
    '  o = vec4(c * a, a);\n' +
    '}';

  function sh(gl, type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS) && !gl.isContextLost()) throw new Error('[vx5-scene] ' + gl.getShaderInfoLog(s)); return s; }

  /* CSS-convention rotations (y down, z toward the viewer) */
  function rx(p, a) { var c = Math.cos(a), s = Math.sin(a); return [p[0], c * p[1] - s * p[2], s * p[1] + c * p[2]]; }
  function ry(p, a) { var c = Math.cos(a), s = Math.sin(a); return [c * p[0] + s * p[2], p[1], -s * p[0] + c * p[2]]; }
  function rz(p, a) { var c = Math.cos(a), s = Math.sin(a); return [c * p[0] - s * p[1], s * p[0] + c * p[1], p[2]]; }
  function ease(t) { return 1 - Math.pow(1 - t, 4); }
  function clamp01(t) { return t < 0 ? 0 : t > 1 ? 1 : t; }

  function mount(host, opts) {
    opts = opts || {};
    var data = opts.data || {}, rig = data.rig, planes = data.planes || [], lines = data.lines || [.62, .7, .48, .66, .54, .4];
    if (!rig || !planes.length) return null;
    var canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    var gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: true, depth: false, preserveDrawingBuffer: !!opts.capture, powerPreference: 'low-power' });
    if (!gl) { if (opts.onLost) opts.onLost('unavailable'); return null; }
    var prog, u = {};
    try {
      prog = gl.createProgram();
      gl.attachShader(prog, sh(gl, gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl, gl.FRAGMENT_SHADER, FS));
      gl.bindAttribLocation(prog, 0, 'aUv'); gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    } catch (e) { if (window.console) console.error(e); if (opts.onLost) opts.onLost('shader'); return null; }
    ['uO', 'uU', 'uV', 'uView', 'uPO', 'uA', 'uEdge', 'uKey', 'uHgt', 'uLight', 'uSweep', 'uSpec', 'uLines'].forEach(function (n) { u[n] = gl.getUniformLocation(prog, n); });
    host.appendChild(canvas);
    var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW);
    var vao = gl.createVertexArray(); gl.bindVertexArray(vao); gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    var W = rig.w, H = rig.h, L = [-0.55, -0.75, 0.35];
    var st = { t: opts.intro ? 0 : 99, tx: 0, ty: 0, cx: 0, cy: 0, last: 0, lastIn: 0, raf: 0, paused: false, visible: true, dead: false, dpr: 1, frames: 0 };

    function size() {
      var r = host.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = opts.forceSize ? opts.forceSize[0] : Math.max(1, Math.round(r.width * dpr)), h = opts.forceSize ? opts.forceSize[1] : Math.max(1, Math.round(r.height * dpr));
      st.dpr = opts.forceSize ? w / W : dpr;
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    }
    function plane(p, i) {
      /* M01: scattered phi and y +/-24 px -> settled, 900 ms, 40 ms stagger from the keystone outward */
      var k = ease(clamp01((st.t * 1000 - ORDER[p.id] * 40) / 900));
      var phi = (SCATTER[p.id] + (p.phi - SCATTER[p.id]) * k) * D2R, dy = (i % 2 ? -24 : 24) * (1 - k);
      var ax = (rig.rx - st.cy * 2) * D2R, ay = (rig.ry + st.cx * 3) * D2R;       /* M02: +/-3 deg yaw, +/-2 deg pitch */
      function T(q) { q = ry(q, 90 * D2R); q = rz(q, phi); q = [q[0], q[1] + dy, q[2]]; q = ry(q, ay); q = rx(q, ax); return [q[0] + rig.x * W, q[1] + rig.y * H, q[2]]; }
      var o = T([-p.D / 2, -p.A, 0]), ux = T([p.D / 2, -p.A, 0]), vy = T([-p.D / 2, 0, 0]);
      var n = rx(ry(rz(ry([0, 0, 1], 90 * D2R), phi), ay), ax);
      return { p: p, o: o, U: [ux[0] - o[0], ux[1] - o[1], ux[2] - o[2]], V: [vy[0] - o[0], vy[1] - o[1], vy[2] - o[2]], z: (o[2] + ux[2] + vy[2]) / 3, light: Math.abs(n[0] * L[0] + n[1] * L[1] + n[2] * L[2]) };
    }
    function draw() {
      if (st.dead || gl.isContextLost()) return;
      size();
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.useProgram(prog); gl.bindVertexArray(vao);
      gl.uniform4f(u.uView, W, H, rig.persp, 0); gl.uniform2f(u.uPO, rig.px * W, rig.py * H);
      gl.uniform1fv(u.uLines, lines);
      var sweepT = (st.t * 1000 - 900) / 1200;
      planes.map(plane).sort(function (a, b) { return a.z - b.z; }).forEach(function (q) {
        gl.uniform3fv(u.uO, q.o); gl.uniform3fv(u.uU, q.U); gl.uniform3fv(u.uV, q.V);
        gl.uniform2f(u.uA, q.p.a0, q.p.a1); gl.uniform1f(u.uEdge, q.p.e); gl.uniform1f(u.uKey, q.p.id === 'C' ? 1 : 0);
        gl.uniform1f(u.uHgt, q.p.A); gl.uniform1f(u.uLight, q.light);
        var ss = sweepT - ORDER[q.p.id] * .04;
        gl.uniform1f(u.uSweep, ss > 0 && ss < 1 ? -0.3 + ss * 1.6 : -9.0);
        gl.uniform1f(u.uSpec, 0.5 + st.cx * 0.45);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      });
    }
    function step(now) {
      st.raf = 0;
      if (st.dead || st.paused || !st.visible) return;
      var dt = st.last ? Math.min(0.05, (now - st.last) / 1000) : 0.016; st.last = now;
      var busy = false;
      if (st.t < 2.2) { st.t += dt; busy = true; }
      st.cx += (st.tx - st.cx) * 0.08; st.cy += (st.ty - st.cy) * 0.08;
      if (now - st.lastIn < 1000 || Math.abs(st.tx - st.cx) > 0.001 || Math.abs(st.ty - st.cy) > 0.001) busy = true;
      draw(); st.frames++;
      if (busy) st.raf = requestAnimationFrame(step); else st.last = 0;
    }
    function kick() { if (!st.raf && !st.paused && st.visible && !st.dead) st.raf = requestAnimationFrame(step); }

    var ph = opts.pointerHost || host;
    function onMove(e) {
      if (e.pointerType !== 'mouse') return;
      var r = ph.getBoundingClientRect();
      st.tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1)); st.ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
      st.lastIn = performance.now(); kick();
    }
    function onLeave() { st.tx = st.ty = 0; st.lastIn = performance.now(); kick(); }
    if (opts.pointer !== false) { ph.addEventListener('pointermove', onMove, { passive: true }); ph.addEventListener('pointerleave', onLeave, { passive: true }); }
    function onVis() { if (document.hidden) api.pause(); else api.resume(); }
    document.addEventListener('visibilitychange', onVis);
    var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) { st.visible = es[0].isIntersecting; if (st.visible) kick(); }) : null;
    if (io) io.observe(host);
    var ro = 'ResizeObserver' in window ? new ResizeObserver(function () { if (!st.raf) draw(); }) : null;
    if (ro) ro.observe(host);
    function onLost(e) { e.preventDefault(); api.destroy(); if (opts.onLost) opts.onLost('lost'); }
    canvas.addEventListener('webglcontextlost', onLost);

    var api = {
      canvas: canvas,
      pause: function () { st.paused = true; if (st.raf) cancelAnimationFrame(st.raf); st.raf = 0; st.last = 0; },
      resume: function () { if (!st.dead) { st.paused = false; kick(); } },
      settle: function () { st.t = 99; st.cx = st.cy = st.tx = st.ty = 0; draw(); },
      snapshot: function (type, q) { api.settle(); return canvas.toDataURL(type || 'image/webp', q || .9); },
      stats: function () { return { w: canvas.width, h: canvas.height, dpr: +st.dpr.toFixed(2), frames: st.frames }; },
      destroy: function () {
        if (st.dead) return; st.dead = true; if (st.raf) cancelAnimationFrame(st.raf);
        ph.removeEventListener('pointermove', onMove); ph.removeEventListener('pointerleave', onLeave);
        document.removeEventListener('visibilitychange', onVis); canvas.removeEventListener('webglcontextlost', onLost);
        if (io) io.disconnect(); if (ro) ro.disconnect();
        if (!gl.isContextLost()) { gl.deleteBuffer(buf); gl.deleteVertexArray(vao); gl.deleteProgram(prog); }
        canvas.remove();
      }
    };
    draw(); kick();
    return api;
  }
  window.VX5SceneA = { mount: mount, version: '5.1.0' };
})();
