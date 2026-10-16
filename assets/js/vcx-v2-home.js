/* Home hero: crossfade the existing Tampa aerial clips (Pexels licence, already in repo).
   Respects prefers-reduced-motion and Save-Data; pauses when the hero is off-screen. */
(function () {
  'use strict';
  var a = document.getElementById('vxHeroA'), b = document.getElementById('vxHeroB');
  if (!a || !b) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var saveData = navigator.connection && navigator.connection.saveData;
  if (reduce || saveData) { a.removeAttribute('autoplay'); a.pause(); a.removeAttribute('src'); a.load(); return; }
  /* Lighter clips only (tampa-4/5/6 are 34–93 MB); tampa-1/2/3 re-encoded to 720p H.264 (1.6–3.5 MB). Phones loop one clip, no rotation. */
  if (window.matchMedia('(max-width: 45em)').matches) { a.loop = true; var pm = a.play(); if (pm && pm.catch) pm.catch(function () {}); b.remove(); return; }
  var clips = ['/assets/video/hero-01-downtown.mp4', '/assets/video/hero-02-gulf-coast.mp4', '/assets/video/hero-03-pier.mp4', '/assets/video/hero-04-twilight.mp4'];  /* graded segments, media-curation 2026-10-15 */
  var vids = [a, b], visible = 0, next = 1, timer = null, onScreen = true, paused = false;
  var pauseBtn = document.getElementById('vxHeroPause');
  var ICON = { pause: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M9 6v12M15 6v12"/></svg>', play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5L8 5.5Z"/></svg>' };
  function setPaused(v) {
    paused = v; if (!pauseBtn) return;
    pauseBtn.removeAttribute('aria-pressed'); /* the label carries the state (Pause/Play) */
    pauseBtn.setAttribute('aria-label', window.VX ? VX.t(v ? 'h3.play' : 'h3.pause') : (v ? 'Play background video' : 'Pause background video'));
    pauseBtn.innerHTML = v ? ICON.play : ICON.pause;
    vids.forEach(function (x) { if (v) x.pause(); });
    if (!v) { var pp = vids[visible].play(); if (pp && pp.catch) pp.catch(function () {}); }
  }
  if (pauseBtn) { pauseBtn.addEventListener('click', function () { setPaused(!paused); }); document.addEventListener('vx:lang', function () { setPaused(paused); }); }
  b.src = clips[next]; b.preload = 'auto';
  function tick() {
    if (!onScreen || document.hidden || paused) return;
    var hv = vids[1 - visible], vv = vids[visible];
    try { hv.currentTime = 0; } catch (e) { /* iOS */ }
    var p = hv.play(); if (p && p.catch) p.catch(function () {});
    hv.classList.add('is-on'); vv.classList.remove('is-on');
    setTimeout(function () { vv.pause(); next = (next + 1) % clips.length; vv.src = clips[next]; vv.load(); }, 650);
    visible = 1 - visible;
  }
  var p0 = a.play(); if (p0 && p0.catch) p0.catch(function () {});
  timer = setInterval(tick, 6000);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      onScreen = es[0].isIntersecting;
      if (!paused) vids[visible][onScreen ? 'play' : 'pause']();
    }).observe(a.parentNode);
  }
})();
