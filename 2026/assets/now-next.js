/* Read the published programme so session times and titles have one source. */
(function () {
  'use strict';
  const zone = 'Europe/Lisbon';
  const dayFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit' });
  const dateFormatter = new Intl.DateTimeFormat('en-GB', { timeZone: zone, weekday: 'short', day: 'numeric', month: 'short' });
  const timeFormatter = new Intl.DateTimeFormat('en-GB', { timeZone: zone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  function dayKey(time) { return dayFormatter.format(new Date(time)); }
  function countdownParts(start, now) {
    const seconds = Math.max(0, Math.ceil((start - now) / 1000));
    return {
      days: Math.floor(seconds / 86400),
      hours: Math.floor(seconds / 3600) % 24,
      minutes: Math.floor(seconds / 60) % 60,
      seconds: seconds % 60
    };
  }
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
  if (typeof module !== 'undefined' && module.exports) module.exports = { selectState, parseProgramme, dayKey, countdownParts };
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
      current.append(element('p', 'now-next-label', state.phase === 'before' ? 'Countdown' : 'Now'));
      let message;
      if (state.phase === 'before') {
        message = 'The event begins on ' + dateFormatter.format(events[0].start) + ' at ' + timeFormatter.format(events[0].start) + ' in Coimbra.';
        current.append(element('h3', '', 'The event begins in'));
        const countdown = element('div', 'now-next-start-countdown');
        countdown.setAttribute('role', 'timer');
        countdown.setAttribute('aria-label', 'Time until the event begins');
        // The timer is readable on demand, without announcing every second.
        countdown.setAttribute('aria-live', 'off');
        for (const unit of ['days', 'hours', 'minutes', 'seconds']) {
          const part = element('div', 'now-next-countdown-part');
          const value = element('span', 'now-next-countdown-value');
          value.dataset.countdownUnit = unit;
          part.append(value, element('span', 'now-next-countdown-unit', unit));
          countdown.append(part);
        }
        current.append(countdown, element('p', 'now-next-meta', dateFormatter.format(events[0].start) + ' · ' + timeFormatter.format(events[0].start) + ' in Coimbra'));
        current.append(element('p', 'now-next-detail', 'We look forward to welcoming you.'));
      } else if (state.current) {
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
        message = state.phase === 'ended' ? 'The seminar has concluded.' : state.phase === 'talks-ended' ? 'The talks have concluded.' : 'No session is scheduled right now.';
        current.append(element('h3', '', message));
        const detail = state.phase === 'ended' ? 'Thank you for joining us in Coimbra.' : state.phase === 'talks-ended' ? 'Thank you for taking part in the XVI Portuguese Category Seminar.' : 'See what is coming up next in the programme.';
        current.append(element('p', 'now-next-detail', detail));
        if (state.untimed) {
          const note = element('p', 'now-next-detail');
          const link = element('a', '', state.untimed.heading + ' · scheduled from ' + timeFormatter.format(state.untimed.start));
          link.href = state.untimed.url;
          note.append(link);
          current.append(note);
          if (state.untimed.detail) current.append(element('p', 'now-next-detail', state.untimed.detail));
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
      announcement.textContent = (state.phase === 'before' ? '' : 'Now: ') + message + (state.upcoming[0] ? ' Next: ' + state.upcoming[0].heading + ', ' + eventTime(state.upcoming[0]) + '.' : '');
    }
    if (state.phase === 'before') {
      const remaining = countdownParts(events[0].start, now);
      content.querySelectorAll('[data-countdown-unit]').forEach(node => {
        const value = String(remaining[node.dataset.countdownUnit]).padStart(2, '0');
        if (node.textContent !== value) node.textContent = value;
      });
    }
    if (state.current) {
      const progress = content.querySelector('progress');
      progress.value = 100 * (now - state.current.start) / (state.current.end - state.current.start);
      const minutes = Math.ceil((state.current.end - now) / 60000);
      content.querySelector('.now-next-countdown').textContent = 'Scheduled to finish in ' + minutes + (minutes === 1 ? ' minute' : ' minutes');
    }
    // Count down each second; once started, keep the live programme's minute cadence.
    // Always switch at the next scheduled boundary, using the current wall clock.
    const boundaries = events.flatMap(event => [event.start, event.end]).filter(time => time !== null && time > now);
    const cadence = state.phase === 'before' ? 1000 : 60000;
    const delay = Math.min(cadence - now % cadence, ...boundaries.map(time => time - now));
    timer = setTimeout(render, Math.max(1, delay));
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



