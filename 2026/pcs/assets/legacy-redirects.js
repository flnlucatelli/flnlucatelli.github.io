/* Keep previously shared PCS URLs usable after the conference-folder move. */
(() => {
  'use strict';

  const path = window.location.pathname;
  const base = '/2026/pcs/';
  let destination = null;

  if (/^\/2026\/pcs\.html(?:\/|\/index\.html)?$/.test(path)) {
    destination = base;
  } else if (/^(?:\/2026\/pcs\.html)?\/Photos(?:\/|\/index\.html)?$/.test(path)) {
    destination = base + 'Photos/';
  } else if (/^\/Photos\/PCS-2026-group-photo-[12]\.jpg$/.test(path)) {
    destination = base + path.slice(1);
  } else if (/^\/2026\/(?:abstracts|assets|downloads)\/.+/.test(path)) {
    destination = base + path.slice('/2026/'.length);
  } else if (/^\/2026\/(?:programme|practical-information|registration|support|now-next|now-next-in|now-next-tv)\.html\/?$/.test(path)) {
    destination = base + path.slice('/2026/'.length).replace(/\/$/, '');
  }

  if (!destination) return;

  destination += window.location.search + window.location.hash;
  document.title = 'Page moved · Fernando Lucatelli Nunes';
  document.getElementById('page-title').textContent = 'This page has moved';
  document.getElementById('page-status').textContent = 'Opening its new address…';
  const link = document.getElementById('destination-link');
  link.href = destination;
  link.textContent = 'Continue to the new address';
  window.location.replace(destination);
})();
