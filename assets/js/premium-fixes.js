/* premium-fixes.js — Minimal behavioral fixes only.
   Original 98KB file replaced: it was overriding the hero,
   translating to RU/ES, and adding .vcx-premium-polish class
   that triggered 214 !important CSS overrides. */
(function() {
  'use strict';
  /* Lock English on public release */
  document.documentElement.lang = 'en';
  try { localStorage.setItem('vcx_lang', 'en'); } catch(e) {}
})();
