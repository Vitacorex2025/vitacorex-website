/* ==========================================================
   VCX Intake Dashboard  --  vcx-intake.js
   Intake landing / redirect logic (NOT intake-api functionality)
   ========================================================== */
(function () {
  'use strict';

  /**
   * On load, check for ?matter= and ?token= query params.
   * If both are present the visitor is returning from a magic-link
   * email -- redirect them straight to the matter-status page.
   * Otherwise the 3-card landing view (already in the HTML) is shown
   * as-is; no additional rendering is required.
   */
  function init() {
    var params = new URLSearchParams(window.location.search);
    var matterId = params.get('matter');
    var token    = params.get('token');

    if (matterId && token) {
      window.location.href =
        '/app/matter-status/?matter=' +
        encodeURIComponent(matterId) +
        '&token=' +
        encodeURIComponent(token);
      return;
    }

    // Landing cards are rendered server-side -- nothing to do here.
  }

  // --- Boot -------------------------------------------------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // --- Public namespace (scaffold) --------------------------
  window.VCX_Intake = {};
})();
