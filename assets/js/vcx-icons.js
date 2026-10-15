/* Inline line-icon set (24px, 1.6 stroke) — replaced at runtime: <span data-icon="globe"></span>.
   Kept tiny and dependency-free; icons inherit currentColor. */
(function () {
  'use strict';
  var P = {
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.7 3.9 5.7 3.9 9s-1.3 6.3-3.9 9c-2.6-2.7-3.9-5.7-3.9-9S9.4 5.7 12 3Z"/>',
    seal: '<circle cx="12" cy="10" r="6"/><path d="m9 15.2-1.5 5.8L12 19l4.5 2-1.5-5.8"/><path d="m9.6 10 1.6 1.6 3.2-3.2"/>',
    lock: '<rect x="4.5" y="10.5" width="15" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/><path d="M12 14.5v2.5"/>',
    translate: '<path d="M4 5h9M8.5 3v2M6 5c.5 3 2.5 5.5 5.5 7M11 5c-.6 3.4-2.8 6.3-6.5 8"/><path d="m13 21 4-10 4 10M14.5 17.5h5"/>',
    sign: '<path d="M4 20h16"/><path d="M14.5 4.5 19 9l-9 9H5.5v-4.5l9-9Z"/><path d="m12.5 6.5 4.5 4.5"/>',
    stamp: '<path d="M9.5 3.5h5l-1 6h2.5a3 3 0 0 1 3 3V15H5v-2.5a3 3 0 0 1 3-3h2.5l-1-6Z"/><path d="M5 18.5h14"/>',
    receipt: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
    message: '<path d="M4 5h16v11H9l-5 4V5Z"/><path d="M8 9.5h8M8 12.5h5"/>',
    tag: '<path d="M3.5 12.5 12 4h7.5v7.5L11 20 3.5 12.5Z"/><circle cx="16" cy="8" r="1.5"/>',
    card: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3 9.5h18M7 15h3"/>',
    check: '<path d="M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8L14 3Z"/><path d="M14 3v5h5"/><path d="m9 14 2 2 4-4"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="m9.5 15 1.8 1.8 3.4-3.4"/>',
    building: '<path d="M4 21V5.5L12 3v18M12 8.5h8V21"/><path d="M7 8h2M7 12h2M7 16h2M15 12h2M15 16h2M2.5 21h19"/>',
    scale: '<path d="M12 4v16M7 20h10M5 7h14"/><path d="m5 7-2.5 6a2.8 2.8 0 0 0 5 0L5 7ZM19 7l-2.5 6a2.8 2.8 0 0 0 5 0L19 7Z"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    phone: '<path d="M21 16.5v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 2.5 5.2 2 2 0 0 1 4.5 3h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.4 2.1L8.6 10.8a16 16 0 0 0 4.6 4.6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2.1Z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    shield: '<path d="M12 3 4.5 6v5.5c0 4.5 3.2 8.2 7.5 9.5 4.3-1.3 7.5-5 7.5-9.5V6L12 3Z"/><path d="m9 12 2 2 4-4"/>',
    pause: '<path d="M9 6v12M15 6v12"/>',
    play: '<path d="M8 5.5v13l10.5-6.5L8 5.5Z"/>'
  };
  function draw(root) {
    (root || document).querySelectorAll('[data-icon]:not([data-icon-done])').forEach(function (el) {
      var d = P[el.getAttribute('data-icon')]; if (!d) return;
      el.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + d + '</svg>';
      el.setAttribute('data-icon-done', '1');
    });
  }
  window.VXIcons = { draw: draw };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { draw(); }); else draw();
})();
