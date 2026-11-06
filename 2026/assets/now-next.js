/* Read the published programme so session times and titles have one source. */
(function () {
  'use strict';
  const zone = 'Europe/Lisbon';
  const dayFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit' });
  const dateFormatter = new Intl.DateTimeFormat('en-GB', { timeZone: zone, weekday: 'short', day: 'numeric', month: 'short' });
  const timeFormatter = new Intl.DateTimeFormat('en-GB', { timeZone: zone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  function dayKey(time) { return dayFormatter.format(new Date(time)); }
  function selectState(events, now) {
    const current = events.find(event => event.start <= now && event.end !== null && now < event.end);
    const upcoming = events.filter(event => event.start > now).slice(0, 2);
    // A start time alone is not evidence that an event is still taking place.
    const untimed = events.filter(event => event.end === null && event.start <= now && dayKey(event.start) === dayKey(now)).at(-1);
    const phase = current ? 'current' : now < events[0].start ? 'before' : upcoming.length ? 'gap' : untimed ? 'talks-ended' : 'ended';
    return { phase, current, upcoming, untimed };
  }
  function parseProgramme(doc, baseURL) {
    const clean = node => {
      if (!node) return '';
      const copy = node.cloneNode(true);
      copy.querySelectorAll('[aria-hidden="true"]').forEach(child => child.remove());
      return copy.textContent.replace(/\s+/g, ' ').trim();
    };
    const events = [...doc.querySelectorAll('.programme-day .agenda > li')].map((row, index) => {
      const times = [...row.querySelectorAll('.slot-time time[datetime]')];
      if (!times.length) return null;
      const start = Date.parse(times[0].getAttribute('datetime'));
      const end = times[1] ? Date.parse(times[1].getAttribute('datetime')) : null;
      if (!Number.isFinite(start) || (end !== null && (!Number.isFinite(end) || end <= start))) throw new Error('Invalid programme time');
      const talk = row.classList.contains('agenda-talk');
      const heading = clean(row.querySelector('h3'));
      if (!heading) throw new Error('Missing programme heading');
      const destination = row.id ? '#' + row.id : row.querySelector('h3 a')?.getAttribute('href') || '#' + row.closest('.programme-day').id;
      const url = new URL(destination, baseURL);
      if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Invalid programme link');
      return {
        key: String(index), start, end, heading,
        title: clean(row.querySelector('.talk-title')),
        detail: talk ? 'Sala Pedro Nunes · First floor' : row.classList.contains('coffee') ? 'Coffee break · Second floor' : clean(row.querySelector('.event-body p')),
        url: url.href
      };
    }).filter(Boolean).sort((a, b) => a.start - b.start);
    if (!events.length) throw new Error('Programme unavailable');
    return events;
  }
  // Export the time logic for boundary checks without starting a browser widget.
  if (typeof module !== 'undefined' && module.exports) module.exports = { selectState, parseProgramme, dayKey };
  if (typeof document === 'undefined') return;
  const section = document.getElementById('now-next');
  if (!section) return;
  const content = section.querySelector('[data-live-content]');
  const clock = section.querySelector('[data-live-clock]');
  const fallback = section.querySelector('[data-live-fallback]');
  const announcement = section.querySelector('[data-live-announcement]');
  const programmeURL = new URL('programme.html', document.baseURI);
  let events = [], lastView = '', timer, loading = false;
  function element(tag, className, value) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (value) node.textContent = value;
    return node;
  }
  function eventTime(event) {
    return dateFormatter.format(event.start) + ' · ' + (event.end === null ? 'from ' : '') + timeFormatter.format(event.start) + (event.end === null ? '' : '–' + timeFormatter.format(event.end));
  }
  function eventHeading(event) {
    const heading = element('h3');
    const link = element('a', '', event.heading);
    link.href = event.url;
    heading.append(link);
    return heading;
  }
  function render() {
    clearTimeout(timer);
    if (!events.length) return;
    const now = Date.now();
    const state = selectState(events, now);
    const clockText = dateFormatter.format(now) + ' · ' + timeFormatter.format(now) + ' in Coimbra';
    if (clock.textContent !== clockText) clock.textContent = clockText;
    clock.hidden = false;
    const signature = JSON.stringify([state.phase, state.current, state.upcoming, state.untimed]);
    if (signature !== lastView) {
      lastView = signature;
      content.dataset.state = state.phase;
      const current = element('div', 'now-next-current');
      current.append(element('p', 'now-next-label', 'Now'));
      let message;
      if (state.current) {
        message = state.current.heading;
        current.append(eventHeading(state.current));
        if (state.current.title) current.append(element('p', 'now-next-title', state.current.title));
        current.append(element('p', 'now-next-meta', eventTime(state.current)));
        if (state.current.detail) current.append(element('p', 'now-next-detail', state.current.detail));
        const progress = element('progress', 'now-next-progress');
        progress.max = 100;
        progress.setAttribute('aria-label', 'Scheduled session progress');
        current.append(progress, element('p', 'now-next-countdown'));
      } else {
        message = state.phase === 'before' ? 'The seminar has not started yet.' : state.phase === 'ended' ? 'The seminar has concluded.' : state.phase === 'talks-ended' ? 'The talks have concluded.' : 'No session is scheduled right now.';
        current.append(element('h3', '', message));
        const detail = state.phase === 'before' ? 'We look forward to welcoming you to Coimbra, 12–14 November.' : state.phase === 'ended' ? 'Thank you for joining us in Coimbra.' : state.phase === 'talks-ended' ? 'Thank you for taking part in the XVI Portuguese Category Seminar.' : 'See what is coming up next in the programme.';
        current.append(element('p', 'now-next-detail', detail));
        if (state.untimed) {
          const note = element('p', 'now-next-detail');
          const link = element('a', '', state.untimed.heading + ' · scheduled from ' + timeFormatter.format(state.untimed.start));
          link.href = state.untimed.url;
          note.append(link);
          current.append(note);
        }
      }
      const upcoming = element('div', 'now-next-upcoming');
      const list = element('ol');
      list.setAttribute('aria-label', 'Upcoming programme');
      state.upcoming.forEach((event, index) => {
        const item = element('li');
        item.append(element('p', 'now-next-label', index ? 'Then' : 'Next'), element('p', 'now-next-meta', eventTime(event)), eventHeading(event));
        if (event.title) item.append(element('p', 'now-next-title', event.title));
        list.append(item);
      });
      if (state.upcoming.length) upcoming.append(list);
      else upcoming.append(element('p', 'now-next-label', 'Next'), element('p', 'now-next-detail', 'No further sessions are scheduled.'));
      content.replaceChildren(current, upcoming);
      content.hidden = false;
      fallback.hidden = true;
      announcement.textContent = 'Now: ' + message + (state.upcoming[0] ? ' Next: ' + state.upcoming[0].heading + ', ' + eventTime(state.upcoming[0]) + '.' : '');
    }
    if (state.current) {
      const progress = content.querySelector('progress');
      progress.value = 100 * (now - state.current.start) / (state.current.end - state.current.start);
      const minutes = Math.ceil((state.current.end - now) / 60000);
      content.querySelector('.now-next-countdown').textContent = 'Scheduled to finish in ' + minutes + (minutes === 1 ? ' minute' : ' minutes');
    }
    // Refresh at each minute and exactly at the next scheduled boundary.
    const boundaries = events.flatMap(event => [event.start, event.end]).filter(time => time !== null && time > now);
    const delay = Math.min(60000 - now % 60000, ...boundaries.map(time => time - now));
    timer = setTimeout(render, Math.max(50, delay));
  }
  async function refreshProgramme() {
    if (loading) return;
    loading = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(programmeURL.href, { cache: 'no-cache', signal: controller.signal });
      if (!response.ok) throw new Error('Programme request failed');
      const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
      events = parseProgramme(doc, programmeURL.href);
      render();
    } catch (_) {
      if (!events.length) {
        fallback.replaceChildren(document.createTextNode('The live programme is temporarily unavailable. '));
        const link = element('a', '', 'View the full programme');
        link.href = programmeURL.href;
        fallback.append(link, document.createTextNode('.'));
      }
    } finally {
      clearTimeout(timeout);
      loading = false;
    }
  }
  refreshProgramme();
  setInterval(() => { if (!document.hidden) refreshProgramme(); }, 300000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) { render(); refreshProgramme(); } });
  window.addEventListener('pageshow', render);
}());
