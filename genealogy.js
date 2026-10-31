(() => {
  'use strict';
  const panel = document.querySelector('.genealogy-panel');
  if (!panel) return;
  const viewport = panel.querySelector('.genealogy-viewport');
  const image = panel.querySelector('.genealogy-chart');
  const toolbar = panel.querySelector('.genealogy-toolbar');
  const output = panel.querySelector('.genealogy-zoom');
  const help = panel.querySelector('.genealogy-help');
  const fullscreen = panel.querySelector('[data-action="fullscreen"]');
  const controls = [...panel.querySelectorAll('[data-view]')];
  if (!viewport || !image || !toolbar || !output) return;
  const messages = {
    en: { help: 'Drag to explore. Use + and − to zoom, or pinch on a touch screen. Arrow keys move the chart.', expand: 'Open chart in full screen', collapse: 'Exit full screen' },
    nl: { help: 'Sleep om de stamboom te verkennen. Zoom met + en − of met twee vingers op een aanraakscherm. Verplaats de kaart met de pijltjestoetsen.', expand: 'Stamboom op volledig scherm openen', collapse: 'Volledig scherm verlaten' },
    fr: { help: 'Faites glisser pour explorer. Zoomez avec + et − ou avec deux doigts sur un écran tactile. Les flèches du clavier déplacent le schéma.', expand: 'Afficher le schéma en plein écran', collapse: 'Quitter le plein écran' },
    de: { help: 'Zum Erkunden ziehen. Mit + und − oder zwei Fingern auf einem Touchscreen zoomen. Die Pfeiltasten verschieben die Darstellung.', expand: 'Stammbaum im Vollbild öffnen', collapse: 'Vollbild verlassen' },
    it: { help: 'Trascina per esplorare. Usa + e − per ingrandire o ridurre, oppure due dita su uno schermo tattile. I tasti freccia spostano il diagramma.', expand: 'Apri il diagramma a schermo intero', collapse: 'Esci dallo schermo intero' },
    pt: { help: 'Arraste para explorar. Use + e − para ampliar ou reduzir, ou dois dedos num ecrã tátil. As teclas de seta deslocam o diagrama.', expand: 'Abrir o diagrama em ecrã inteiro', collapse: 'Sair do ecrã inteiro' }
  };
  const wording = messages[document.documentElement.lang.split('-')[0]] || messages.en;
  const points = new Map();
  let scale = 1, x = 0, y = 0, preset = 'recent', ready = false;
  const bounds = { all: [0, 0, 2556, 2556], recent: [1310, 2295, 420, 250] };
  const clampScale = value => Math.max(Math.min(viewport.clientWidth, viewport.clientHeight) / 2556 * .8, Math.min(10, value));
  function render() {
    image.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    output.value = `${Math.round(scale * 100)}%`;
  }
  function setPreset(name) {
    preset = name;
    const [bx, by, bw, bh] = bounds[name];
    scale = Math.min(viewport.clientWidth / bw, viewport.clientHeight / bh) * .92;
    x = (viewport.clientWidth - bw * scale) / 2 - bx * scale;
    y = (viewport.clientHeight - bh * scale) / 2 - by * scale;
    controls.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.view === name)));
    render();
  }
  function freeView() {
    preset = null;
    controls.forEach(button => button.setAttribute('aria-pressed', 'false'));
  }
  function zoom(factor, cx = viewport.clientWidth / 2, cy = viewport.clientHeight / 2) {
    const next = clampScale(scale * factor);
    x = cx - (cx - x) * next / scale;
    y = cy - (cy - y) * next / scale;
    scale = next;
    freeView();
    render();
  }
  function init() {
    if (ready || !image.naturalWidth) return;
    ready = true;
    panel.classList.add('is-interactive');
    toolbar.hidden = false;
    if (help) help.textContent = wording.help;
    if (!panel.requestFullscreen) fullscreen.hidden = true;
    setPreset('recent');
  }
  image.addEventListener('load', init, { once: true });
  if (image.complete) init();
  controls.forEach(button => button.addEventListener('click', () => setPreset(button.dataset.view)));
  panel.querySelector('[data-action="zoom-in"]').addEventListener('click', () => zoom(1.35));
  panel.querySelector('[data-action="zoom-out"]').addEventListener('click', () => zoom(1 / 1.35));
  fullscreen.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement === panel) await document.exitFullscreen();
      else await panel.requestFullscreen();
    } catch (_) { /* The chart remains usable when full screen is unavailable. */ }
  });
  document.addEventListener('fullscreenchange', () => {
    const expanded = document.fullscreenElement === panel;
    fullscreen.setAttribute('aria-label', expanded ? wording.collapse : wording.expand);
    fullscreen.title = expanded ? wording.collapse : wording.expand;
    if (ready) setPreset(preset || 'recent');
  });
  viewport.addEventListener('pointerdown', event => {
    if (!ready || event.button !== 0) return;
    const rect = viewport.getBoundingClientRect();
    points.set(event.pointerId, { x: event.clientX - rect.left, y: event.clientY - rect.top });
    viewport.setPointerCapture(event.pointerId);
    viewport.classList.add('is-dragging');
  });
  viewport.addEventListener('pointermove', event => {
    if (!points.has(event.pointerId)) return;
    const previous = [...points.values()];
    const rect = viewport.getBoundingClientRect();
    const point = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    const old = points.get(event.pointerId);
    points.set(event.pointerId, point);
    if (points.size === 1) {
      x += point.x - old.x; y += point.y - old.y;
    } else if (points.size === 2) {
      const current = [...points.values()];
      const centre = ps => ({ x: (ps[0].x + ps[1].x) / 2, y: (ps[0].y + ps[1].y) / 2 });
      const dist = ps => Math.hypot(ps[0].x - ps[1].x, ps[0].y - ps[1].y);
      const a = centre(previous), b = centre(current);
      const next = clampScale(scale * dist(current) / Math.max(1, dist(previous)));
      x = b.x - (a.x - x) * next / scale;
      y = b.y - (a.y - y) * next / scale;
      scale = next;
    }
    freeView(); render();
  });
  function release(event) {
    points.delete(event.pointerId);
    if (!points.size) viewport.classList.remove('is-dragging');
  }
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(name => viewport.addEventListener(name, release));
  viewport.addEventListener('wheel', event => {
    if (!ready || (!event.ctrlKey && !event.metaKey)) return;
    event.preventDefault();
    const rect = viewport.getBoundingClientRect();
    zoom(Math.exp(-event.deltaY * .004), event.clientX - rect.left, event.clientY - rect.top);
  }, { passive: false });
  viewport.addEventListener('keydown', event => {
    if (!ready) return;
    if (event.key === '+' || event.key === '=') zoom(1.35);
    else if (event.key === '-') zoom(1 / 1.35);
    else if (event.key === 'Home') setPreset('recent');
    else if (event.key === 'ArrowLeft') { x += 60; freeView(); render(); }
    else if (event.key === 'ArrowRight') { x -= 60; freeView(); render(); }
    else if (event.key === 'ArrowUp') { y += 60; freeView(); render(); }
    else if (event.key === 'ArrowDown') { y -= 60; freeView(); render(); }
    else return;
    event.preventDefault();
  });
  new ResizeObserver(entries => {
    if (!ready) return;
    if (preset) setPreset(preset);
    else render();
  }).observe(viewport);
})();
