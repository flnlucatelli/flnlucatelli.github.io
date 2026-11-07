/* Optional presentation controls; programme data stays in the shared renderer. */
(function () {
  'use strict';
  const controls = document.querySelector('.display-controls');
  const button = document.querySelector('.display-fullscreen');
  const status = document.querySelector('.display-status');
  if (!controls || !button) return;
  let idleTimer, wakeLock, requestingWakeLock = false;
  function showControls() {
    clearTimeout(idleTimer);
    document.body.classList.remove('display-idle');
    idleTimer = setTimeout(() => document.body.classList.add('display-idle'), 4000);
  }
  async function keepAwake() {
    if (!('wakeLock' in navigator) || document.hidden || wakeLock || requestingWakeLock) return;
    requestingWakeLock = true;
    try {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => { wakeLock = null; });
    } catch (_) {
      // The display continues normally when the browser cannot keep the screen awake.
    } finally { requestingWakeLock = false; }
  }
  async function toggleFullscreen() {
    status.textContent = '';
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
      else status.textContent = 'Use your browser’s full-screen option.';
      keepAwake();
    } catch (_) { status.textContent = 'Use your browser’s full-screen option.'; }
    // A mouse click should not leave an idle control permanently visible.
    if (document.activeElement === button && button.matches(':focus:not(:focus-visible)')) button.blur();
    showControls();
  }
  controls.hidden = false;
  button.addEventListener('click', toggleFullscreen);
  document.addEventListener('fullscreenchange', () => {
    const active = Boolean(document.fullscreenElement);
    button.firstChild.textContent = active ? 'Exit full screen ' : 'Full screen ';
    button.setAttribute('aria-label', active ? 'Exit full screen' : 'Enter full screen');
    button.title = active ? 'Exit full screen (F or Esc)' : 'Full screen (F)';
    showControls();
    keepAwake();
  });
  document.addEventListener('keydown', event => {
    showControls();
    if (event.key.toLowerCase() === 'f' && !event.repeat && !event.ctrlKey && !event.metaKey && !event.altKey && !event.target.closest('input, textarea, select, [contenteditable]')) {
      event.preventDefault();
      toggleFullscreen();
    }
  });
  document.addEventListener('pointermove', showControls, { passive: true });
  document.addEventListener('pointerdown', showControls, { passive: true });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) keepAwake(); });
  showControls();
  keepAwake();
}());
