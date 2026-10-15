/* Home hero: crossfade the existing Tampa aerial clips (Pexels licence, already in repo).
   Respects prefers-reduced-motion and Save-Data; pauses when the hero is off-screen. */
(function () {
  'use strict';
  var a = document.getElementById('vxHeroA'), b = document.getElementById('vxHeroB');
  if (!a || !b) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var saveData = navigator.connection && navigator.connection.saveData;
  if (reduce || saveData) { a.removeAttribute('autoplay'); a.pause(); a.removeAttribute('src'); a.load(); return; }
  /* Lighter clips only (tampa-4/5/6 are 34–93 MB). Phones loop one 5.7 MB clip, no rotation. */
  if (window.matchMedia('(max-width: 45em)').matches) { a.loop = true; var pm = a.play(); if (pm && pm.catch) pm.catch(function () {}); b.remove(); return; }
  var clips = ['/assets/video/tampa-1.mp4', '/assets/video/tampa-3.mp4', '/assets/video/tampa-2.mp4'];
  var vids = [a, b], visible = 0, next = 1, timer = null, onScreen = true;
  b.src = clips[next]; b.preload = 'auto';
  function tick() {
    if (!onScreen || document.hidden) return;
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
      vids[visible][onScreen ? 'play' : 'pause']();
    }).observe(a.parentNode);
  }
})();
