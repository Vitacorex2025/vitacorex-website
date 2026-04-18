/* ==========================================================================
   vcx-noise-scoped.js
   Injects film-grain canvas into every section marked [data-vcx-texture].

   Adapted from the React `Noise` component — same pattern, but:
   - Scoped per-section (not viewport-fixed).
   - Lazy: canvases don't animate unless the section is near the viewport
     (IntersectionObserver), so off-screen sections don't burn CPU.
   - Respects prefers-reduced-motion (skips canvas entirely).
   - Skips low-end devices (<4 logical cores) for the scoped layer — the
     static radial gradient still shows so the section doesn't look bare.
   - Shares the shared SIZE/ALPHA tuning with vcx-noise-bg.js for visual
     consistency between the global backdrop and the scoped sections.
   ========================================================================== */
(function () {
  'use strict';

  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // Reduced-motion users opt out of any canvas grain. Gradient still renders.
  var REDUCE_MOTION = window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Very low-end device guard — still inject the gradient layer so the
  // section doesn't look flat, but skip the animated canvas.
  var LOW_END_DEVICE = false;
  try {
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      LOW_END_DEVICE = true;
    }
  } catch (_) { /* noop */ }

  // Tuning — scoped sections sit on a LIGHT teal-tinted backdrop (#F4FBF8),
  // so grain is DARK (0..55) with mix-blend-mode:multiply in the CSS. This
  // matches the global noise-bg tuning and keeps the film-grain effect
  // subtle on white-ish surfaces without washing out the teal spotlights.
  var SIZE = 512;
  var REFRESH_EVERY = 3;     // paint every 3rd frame
  var PATTERN_ALPHA = 18;    // alpha per grain pixel
  var GRAIN_CHANNEL_MIN = 0;
  var GRAIN_CHANNEL_MAX = 55; // dark speckle on light bg

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  function init() {
    var sections = document.querySelectorAll('[data-vcx-texture]');
    if (!sections.length) return;

    sections.forEach(function (section) {
      if (section.dataset.vcxTextureReady === '1') return;
      section.dataset.vcxTextureReady = '1';

      // Build the texture layer: gradient div + canvas.
      var layer = document.createElement('div');
      layer.className = 'vcx-bg-texture';
      layer.setAttribute('aria-hidden', 'true');

      var gradient = document.createElement('div');
      gradient.className = 'vcx-bg-texture__gradient';
      layer.appendChild(gradient);

      // Skip the canvas for reduced-motion / low-end devices — gradient only.
      if (!REDUCE_MOTION && !LOW_END_DEVICE) {
        var canvas = document.createElement('canvas');
        canvas.className = 'vcx-bg-texture__noise';
        canvas.setAttribute('aria-hidden', 'true');
        layer.appendChild(canvas);
        bindCanvas(canvas, section);
      }

      // Insert BEFORE other children so content naturally stacks above.
      section.insertBefore(layer, section.firstChild);
    });
  }

  function bindCanvas(canvas, section) {
    var ctx = canvas.getContext && canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    var imgData = null;
    var frame = 0;
    var rafId = 0;
    var running = false;
    var visible = false;

    function ensureBuffer() {
      if (canvas.width !== SIZE || canvas.height !== SIZE) {
        canvas.width = SIZE;
        canvas.height = SIZE;
      }
      if (!imgData) {
        imgData = ctx.createImageData(SIZE, SIZE);
      }
    }

    function drawGrain() {
      ensureBuffer();
      var data = imgData.data;
      var len = data.length;
      var span = GRAIN_CHANNEL_MAX - GRAIN_CHANNEL_MIN;
      for (var i = 0; i < len; i += 4) {
        var v = GRAIN_CHANNEL_MIN + Math.random() * span;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = PATTERN_ALPHA;
      }
      ctx.putImageData(imgData, 0, 0);
    }

    function loop() {
      if (!running) return;
      if (frame % REFRESH_EVERY === 0) drawGrain();
      frame++;
      rafId = window.requestAnimationFrame(loop);
    }

    function start() {
      if (running) return;
      running = true;
      loop();
    }

    function stop() {
      running = false;
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
    }

    // Only animate while the section is visible in the viewport.
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          visible = entry.isIntersecting;
          if (visible && !document.hidden) start();
          else stop();
        });
      }, { rootMargin: '100px' });
      io.observe(section);
    } else {
      // Fallback — no IntersectionObserver, just run.
      start();
    }

    // Global pause when the tab is hidden.
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop();
      else if (visible) start();
    });

    window.addEventListener('pagehide', stop);

    // Prime the canvas once so the section never shows a blank frame.
    drawGrain();
  }
})();
