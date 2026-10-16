/* Visitor counter for the owner's daily report (owner 2026-10-16: «сколько человек посетили сайт и как долго там были»).
   One ping when a page opens and one with the visible time when it is hidden or closed. No cookies, nothing stored in the
   browser, no personal data; browsers with Global Privacy Control or Do Not Track send nothing. */
(function () {
  'use strict';
  var n = navigator;
  if (n.globalPrivacyControl === true || n.doNotTrack === '1' || window.doNotTrack === '1' || n.webdriver) return;
  var base = '';
  try { base = (window.VX && window.VX.apiBase && window.VX.apiBase()) || ''; } catch (e) { /* no API on this page */ }
  if (!base || !window.fetch) return;
  var pv = '', shown = 0, since = document.visibilityState === 'visible' ? Date.now() : 0, last = -1;
  var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', rnd = new Uint8Array(16);
  (window.crypto || window.msCrypto).getRandomValues(rnd);
  for (var i = 0; i < rnd.length; i++) pv += chars[rnd[i] % chars.length];
  function send(body) {
    try {
      fetch(base + '/api/v2/stats/hit', { method: 'POST', keepalive: true, headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(body) }).catch(function () {});
    } catch (e) { /* counting is best effort */ }
  }
  function seconds() { return Math.round((shown + (since ? Date.now() - since : 0)) / 1000); }
  send({ t: 'v', pv: pv, path: location.pathname, ref: document.referrer || '', lang: (document.documentElement.lang || 'en').slice(0, 2) });
  function leave() {
    var s = seconds();
    if (since) { shown += Date.now() - since; since = 0; }
    if (s !== last) { last = s; send({ t: 'e', pv: pv, s: s }); }
  }
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') leave(); else if (!since) since = Date.now();
  });
  window.addEventListener('pagehide', leave);
})();
