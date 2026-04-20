/**
 * VitaCoreX hero media card — play/pause toggle for the <video>
 * embedded in [data-hero-media]. Mirrors the NavbarHero React
 * component behavior without any framework cost:
 *
 *   - First click on the button: video.play(), figure gets
 *     [data-playing="true"], poster fades out (via CSS transition),
 *     button icon swaps play → pause.
 *   - Subsequent click while playing: video.pause(), figure gets
 *     [data-paused="true"], icon swaps pause → play.
 *   - Click again while paused: video.play(), [data-paused] removed.
 *   - On 'ended' event: figure resets ([data-playing] + [data-paused]
 *     cleared), poster fades back in, icon returns to play.
 *
 * Idempotent: binds once per button via a data flag. Safe to run
 * before or after DOMContentLoaded.
 */
(function () {
  'use strict';

  function bind(figure) {
    if (!figure || figure.dataset.heroMediaBound === 'true') return;
    var video = figure.querySelector('.vcx-hero-2__media-video');
    var btn = figure.querySelector('[data-hero-media-btn]');
    if (!video || !btn) return;

    figure.dataset.heroMediaBound = 'true';

    function reset() {
      figure.removeAttribute('data-playing');
      figure.removeAttribute('data-paused');
      btn.setAttribute('aria-label', 'Play video');
    }

    btn.addEventListener('click', function () {
      var playing = figure.getAttribute('data-playing') === 'true';
      var paused  = figure.getAttribute('data-paused')  === 'true';

      if (!playing) {
        // First play — show video, hide poster
        var p = video.play();
        if (p && typeof p.catch === 'function') {
          p.catch(function () { /* autoplay blocked / user gesture missing */ });
        }
        figure.setAttribute('data-playing', 'true');
        figure.removeAttribute('data-paused');
        btn.setAttribute('aria-label', 'Pause video');
      } else if (!paused) {
        // Currently playing — pause
        video.pause();
        figure.setAttribute('data-paused', 'true');
        btn.setAttribute('aria-label', 'Resume video');
      } else {
        // Currently paused — resume
        var r = video.play();
        if (r && typeof r.catch === 'function') {
          r.catch(function () { /* noop */ });
        }
        figure.removeAttribute('data-paused');
        btn.setAttribute('aria-label', 'Pause video');
      }
    });

    video.addEventListener('ended', reset);
  }

  function init() {
    var figures = document.querySelectorAll('[data-hero-media]');
    for (var i = 0; i < figures.length; i++) bind(figures[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
