/**
 * VitaCoreX hero fluid particles — vanilla JS port of the React
 * FluidParticlesBackground component (canvas-based Perlin-noise flow
 * field). Replaces the cybercore rays scene.
 *
 * Contract:
 *   - Targets the first .vcx-hero-2__bg on the page.
 *   - Removes any prior scene (legacy video, cybercore scene, cloud
 *     parallax) before mounting the canvas.
 *   - Marks parent <section class="vcx-hero-2"> with
 *     data-hero-scene="cybercore" so existing content-cascade CSS
 *     (fade-slide-in) keeps firing.
 *   - Honors prefers-reduced-motion by dropping particle count.
 *   - Idempotent: bails out if the canvas is already present.
 *
 * Visual tuning (user direction: "чёрный фон + сине-зеленый мятный"):
 *   - Background: near-black (#030507) filled with rgba(0,0,0,0.12)
 *     per frame to create gentle motion trails.
 *   - Particles: mint-teal rgba(126, 216, 195, opacity) with a light
 *     Perlin noise (simplex3) flow field driving heading.
 */
(function () {
  'use strict';

  var DESKTOP_COUNT = 1500;
  var MOBILE_COUNT  = 600;
  var NOISE_SCALE   = 0.003;    // lower = smoother flow (wider swirls)
  var TIME_SCALE    = 0.00012;  // noise time evolution speed
  var SPEED         = 1.4;      // px per frame at noise |value| = 1
  var PARTICLE_MIN_SIZE = 0.6;
  var PARTICLE_MAX_SIZE = 2.0;

  /* Classic Ken Perlin permutation (length 256). */
  var PERM = [
    151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,
    142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,
    219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,
    68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,
    133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,
    73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,
    109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,
    85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,
    152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,
    108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,
    238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,
    31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,
    205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180
  ];

  function buildSimplex() {
    var p = new Array(512);
    for (var i = 0; i < 256; i++) p[256 + i] = p[i] = PERM[i];

    function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
    function lerp(t, a, b) { return a + t * (b - a); }
    function grad(hash, x, y, z) {
      var h = hash & 15;
      var u = h < 8 ? x : y;
      var v = h < 4 ? y : (h === 12 || h === 14 ? x : z);
      return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }

    return function simplex3(x, y, z) {
      var X = Math.floor(x) & 255;
      var Y = Math.floor(y) & 255;
      var Z = Math.floor(z) & 255;
      x -= Math.floor(x);
      y -= Math.floor(y);
      z -= Math.floor(z);
      var u = fade(x), v = fade(y), w = fade(z);
      var A  = p[X] + Y,   AA = p[A] + Z,     AB = p[A + 1] + Z;
      var B  = p[X+1] + Y, BA = p[B] + Z,     BB = p[B + 1] + Z;
      return lerp(w,
        lerp(v,
          lerp(u, grad(p[AA],   x,   y,   z),   grad(p[BA],   x-1, y,   z)),
          lerp(u, grad(p[AB],   x,   y-1, z),   grad(p[BB],   x-1, y-1, z))
        ),
        lerp(v,
          lerp(u, grad(p[AA+1], x,   y,   z-1), grad(p[BA+1], x-1, y,   z-1)),
          lerp(u, grad(p[AB+1], x,   y-1, z-1), grad(p[BB+1], x-1, y-1, z-1))
        )
      );
    };
  }

  function initHero(bgEl) {
    if (!bgEl || bgEl.querySelector('.vcx-particles-canvas')) return;

    // Retire any prior video + legacy animation layers
    var video = bgEl.querySelector('video');
    if (video) { try { video.pause(); } catch (e) { /* noop */ } video.remove(); }

    var heroSection = bgEl.closest('.vcx-hero-2');
    if (heroSection) {
      heroSection.setAttribute('data-hero-scene', 'cybercore');
      var stale = heroSection.querySelectorAll(
        ':scope > .vcx-leaf-container, :scope > .vcx-hero-canvas, ' +
        '.vcx-hero-2__bg .hero-cloud-layer, ' +
        '.vcx-hero-2__bg .vcx-cybercore-scene'
      );
      for (var i = 0; i < stale.length; i++) stale[i].remove();
    }

    bgEl.style.backgroundColor = '#030507';

    var canvas = document.createElement('canvas');
    canvas.className = 'vcx-particles-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    bgEl.appendChild(canvas);

    var ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    var simplex3 = buildSimplex();
    var state = { w: 0, h: 0, dpr: 1 };

    function resize() {
      var rect = bgEl.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = Math.max(1, rect.width);
      var h = Math.max(1, rect.height);
      state.w = w; state.h = h; state.dpr = dpr;
      canvas.width  = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width  = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var count = (window.innerWidth < 720 ? MOBILE_COUNT : DESKTOP_COUNT);
    if (reduceMotion) count = Math.floor(count / 3);

    var particles = new Array(count);
    for (var j = 0; j < count; j++) {
      particles[j] = {
        x: Math.random() * state.w,
        y: Math.random() * state.h,
        size: Math.random() * (PARTICLE_MAX_SIZE - PARTICLE_MIN_SIZE) + PARTICLE_MIN_SIZE,
        vx: 0, vy: 0,
        life:    Math.random() * 100,
        maxLife: 100 + Math.random() * 50
      };
    }

    var running = true;
    function frame() {
      if (!running) return;
      // Semi-transparent trail fill — same principle as the React
      // component (canvas.fillStyle with ~12% alpha bg per frame).
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      ctx.fillRect(0, 0, state.w, state.h);

      var t = Date.now() * TIME_SCALE;
      for (var k = 0; k < particles.length; k++) {
        var pt = particles[k];
        pt.life += 1;
        if (pt.life > pt.maxLife) {
          pt.life = 0;
          pt.x = Math.random() * state.w;
          pt.y = Math.random() * state.h;
        }

        // Life sine → opacity 0 → peak 0.45 → 0 (brighter than the
        // React 0.15 because our particles are mint-teal on near-black,
        // not white on white).
        var opacity = Math.sin((pt.life / pt.maxLife) * Math.PI) * 0.45;

        var n = simplex3(pt.x * NOISE_SCALE, pt.y * NOISE_SCALE, t);
        var angle = n * Math.PI * 4;
        pt.vx = Math.cos(angle) * SPEED;
        pt.vy = Math.sin(angle) * SPEED;
        pt.x += pt.vx;
        pt.y += pt.vy;

        if (pt.x < 0) pt.x = state.w;
        else if (pt.x > state.w) pt.x = 0;
        if (pt.y < 0) pt.y = state.h;
        else if (pt.y > state.h) pt.y = 0;

        // Mint-teal particle (#7ED8C3) — user direction: blue-green mint
        ctx.fillStyle = 'rgba(126, 216, 195, ' + opacity + ')';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    // Debounced resize — rescale particle positions so they stay
    // visible after a viewport change instead of clustering in the
    // top-left corner.
    var resizeT;
    window.addEventListener('resize', function () {
      clearTimeout(resizeT);
      resizeT = setTimeout(function () {
        var prevW = state.w, prevH = state.h;
        resize();
        var sx = state.w / prevW || 1;
        var sy = state.h / prevH || 1;
        for (var m = 0; m < particles.length; m++) {
          particles[m].x *= sx;
          particles[m].y *= sy;
        }
      }, 150);
    });

    // Pause when the page is hidden to save battery/CPU.
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        running = false;
      } else if (!running) {
        running = true;
        requestAnimationFrame(frame);
      }
    });
  }

  function init() {
    var bgs = document.querySelectorAll('.vcx-hero-2__bg');
    for (var i = 0; i < bgs.length; i++) initHero(bgs[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
