/* ==========================================================================
   vcx-noise-bg.js
   Canvas-based film-grain noise overlay, tuned for VitaCoreX light theme.

   Behaviour:
   - Respects prefers-reduced-motion (skips animation entirely).
   - Skips devices reporting < 4 logical cores (older phones) to avoid jank.
   - Paints every Nth frame to a small offscreen canvas, scaled to viewport.
   - Pauses rendering when the tab is hidden to save CPU.

   Tuning notes for light theme:
   - Uses DARK grain (channel values 0-55) rather than white so it actually
     shows up on cream #F6F2EA via mix-blend-mode: multiply from the CSS.
   - patternAlpha is low (16) so the grain is subtle; CSS opacity (0.55)
     caps it further so cards always stay legible.
   ========================================================================== */
(function () {
  'use strict';

  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // Reduced-motion users opt out entirely.
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // Very low-end device guard — skip noise entirely to preserve UX.
  try {
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      // Still apply the CSS class so the radial spotlight renders,
      // but do not create the animated canvas.
      document.addEventListener('DOMContentLoaded', function () {
        document.body.classList.add('vcx-bg-noise');
      });
      return;
    }
  } catch (_) { /* noop */ }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  function init() {
    var body = document.body;
    if (!body) return;

    // Idempotency — don't double-initialise if the script is loaded twice.
    if (body.classList.contains('vcx-bg-noise')) return;
    body.classList.add('vcx-bg-noise');

    var canvas = document.createElement('canvas');
    canvas.className = 'vcx-noise-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    // Insert at the very top of body so z-index stacking works predictably.
    body.insertBefore(canvas, body.firstChild);

    var ctx = canvas.getContext && canvas.getContext('2d', { alpha: true });
    if (!ctx) {
      // Older browser without canvas — leave the radial spotlight as fallback.
      return;
    }

    // Internal grain texture size. Small for perf; CSS scales to viewport.
    var SIZE = 512;
    var REFRESH_EVERY = 3;   // paint every 3rd frame (~20fps of actual redraws at 60fps)
    var PATTERN_ALPHA = 16;  // alpha per pixel (0-255)
    var GRAIN_CHANNEL_MAX = 55; // dark grain — values 0..55 on light bg

    var frame = 0;
    var rafId = 0;
    var running = false;
    var imgData = null;

    function resize() {
      canvas.width = SIZE;
      canvas.height = SIZE;
      imgData = ctx.createImageData(SIZE, SIZE);
    }

    function drawGrain() {
      if (!imgData) return;
      var data = imgData.data;
      var len = data.length;
      for (var i = 0; i < len; i += 4) {
        var v = Math.random() * GRAIN_CHANNEL_MAX; // dark pixel value
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

    // Pause when tab is not visible — saves CPU when user is elsewhere.
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop();
      else start();
    });

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pagehide', stop);

    resize();
    start();
  }
})();
