/**
 * VitaCoreX Cybercore hero scene — vanilla JS port of the React component.
 *
 * Replaces the <video> tag inside .vcx-hero-2__bg with a fully animated
 * CSS scene (grid floor + central column + N randomized rising beams).
 * See vcx-hero-cybercore.css for the accompanying styles.
 *
 * Contract:
 *   - Looks for the first .vcx-hero-2__bg on the page
 *   - If already transformed (has .vcx-cybercore-scene child), bails out
 *   - Removes any existing <video> to stop its network/CPU cost
 *   - Generates a scene with `data-beam-count` attr (defaults: 70 desktop / 40 mobile)
 *   - Honors prefers-reduced-motion: renders scene, skips random beams
 *
 * Runs after DOMContentLoaded. Safe to re-run (idempotent).
 */
(function () {
  'use strict';

  var DEFAULT_BEAM_COUNT = 70;
  var MOBILE_BEAM_COUNT  = 40;

  function getBeamCount(bgEl) {
    var attr = bgEl.getAttribute('data-beam-count');
    if (attr) {
      var n = parseInt(attr, 10);
      if (!isNaN(n) && n > 0) return n;
    }
    return (window.innerWidth < 720) ? MOBILE_BEAM_COUNT : DEFAULT_BEAM_COUNT;
  }

  function buildScene(bgEl) {
    if (!bgEl || bgEl.querySelector('.vcx-cybercore-scene')) return;

    // Retire the video — stop its decoding cost and free the slot
    var video = bgEl.querySelector('video');
    if (video) {
      try { video.pause(); } catch (e) { /* noop */ }
      video.remove();
    }

    var scene = document.createElement('div');
    scene.className = 'vcx-cybercore-scene';
    scene.setAttribute('role', 'img');
    scene.setAttribute('aria-label', 'Animated brand atmosphere — teal grid and rising light beams');

    var floor = document.createElement('div');
    floor.className = 'vcx-cybercore-floor';
    scene.appendChild(floor);

    var column = document.createElement('div');
    column.className = 'vcx-cybercore-column';
    scene.appendChild(column);

    var beamContainer = document.createElement('div');
    beamContainer.className = 'vcx-cybercore-beams';
    scene.appendChild(beamContainer);

    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion) {
      var count = getBeamCount(bgEl);
      var frag = document.createDocumentFragment();
      for (var i = 0; i < count; i++) {
        var beam = document.createElement('div');
        var isSecondary = Math.random() < 0.15;
        beam.className = 'vcx-cybercore-beam' + (isSecondary ? ' secondary' : '');
        var riseDur = (Math.random() * 3 + 5).toFixed(2); // 5–8s
        var fadeDur = riseDur;                            // sync fade
        var delay   = (Math.random() * 6).toFixed(2);     // 0–6s stagger
        var width   = Math.floor(Math.random() * 2) + 1;  // 1–2px
        beam.style.left = (Math.random() * 100).toFixed(2) + '%';
        beam.style.width = width + 'px';
        beam.style.setProperty('--vcx-cc-rise', riseDur + 's');
        beam.style.setProperty('--vcx-cc-fade', fadeDur + 's');
        beam.style.animationDelay = delay + 's, ' + delay + 's';
        frag.appendChild(beam);
      }
      beamContainer.appendChild(frag);
    }

    bgEl.appendChild(scene);
  }

  function init() {
    // Only the main home-hero carries .vcx-hero-2__bg today; if other
    // pages adopt the same hero shell later, they pick this up for free.
    var bgs = document.querySelectorAll('.vcx-hero-2__bg');
    if (!bgs.length) return;
    for (var i = 0; i < bgs.length; i++) buildScene(bgs[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
