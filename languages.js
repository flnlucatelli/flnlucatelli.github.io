(() => {
  'use strict';
  const locale = document.documentElement.lang.split('-')[0];
  const messages = {
    en: { result: 'result', results: 'results', all: n => `Showing all ${n} works.`, works: (n,t) => `Showing ${n} of ${t} works`, with: 'with ', solo: 'sole-authored' },
    nl: { result: 'resultaat', results: 'resultaten', all: n => n === 1 ? 'De enige publicatie wordt weergegeven.' : `Alle ${n} publicaties worden weergegeven.`, works: (n,t) => `${n} van ${t} ${t === 1 ? 'publicatie' : 'publicaties'} weergegeven`, with: 'met ', solo: 'zonder coauteurs' },
    fr: { result: 'résultat', results: 'résultats', all: n => n === 1 ? 'Le seul travail est affiché.' : `Les ${n} travaux sont affichés.`, works: (n,t) => `${n} ${n === 1 ? 'travail' : 'travaux'} sur ${t}`, with: 'avec ', solo: 'sans coauteur' },
    de: { result: 'Ergebnis', results: 'Ergebnisse', all: n => `Alle ${n} Arbeiten werden angezeigt.`, works: (n,t) => `${n} von ${t} Arbeiten`, with: 'mit ', solo: 'allein verfasst' },
    it: { result: 'risultato', results: 'risultati', all: n => n === 1 ? 'È visualizzato l’unico lavoro.' : `Sono visualizzati tutti i ${n} lavori.`, works: (n,t) => `${n} ${n === 1 ? 'lavoro' : 'lavori'} su ${t}`, with: 'con ', solo: 'senza coautori' },
    pt: { result: 'resultado', results: 'resultados', all: n => `A mostrar todos os ${n} trabalhos.`, works: (n,t) => `A mostrar ${n} de ${t} trabalhos`, with: 'com ', solo: 'autoria individual' }
  };
  window.siteMessages = messages[locale] || messages.en;
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.language-menu').forEach(menu => {
      menu.querySelectorAll('a[data-language]').forEach(link => {
        link.addEventListener('click', () => {
          if (location.hash) link.hash = location.hash;
        });
      });
      document.addEventListener('click', event => {
        if (!menu.contains(event.target)) menu.open = false;
      });
      menu.addEventListener('keydown', event => {
        if (event.key === 'Escape') { menu.open = false; menu.querySelector('summary').focus(); }
      });
    });
  });
})();

