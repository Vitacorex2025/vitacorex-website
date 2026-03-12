
(() => {
  if (window.__VCX_LEGACY_SHELL_NEUTRALIZED__) return;
  window.__VCX_LEGACY_SHELL_NEUTRALIZED__ = true;
  function prune() {
    [
      '.vcx-recovery-shell','.vcx-recovery-dock','.vcx-header-desktop','.vcx-header-mobile',
      '.vcx-dock-desktop','.vcx-dock-mobile','.vcx-shell-wrap','.vcx-shell-bar'
    ].forEach((sel) => {
      document.querySelectorAll(sel).forEach((node) => node.remove());
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', prune, { once: true });
  } else {
    prune();
  }
})();
