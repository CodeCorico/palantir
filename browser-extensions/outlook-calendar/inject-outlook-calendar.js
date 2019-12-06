(function() {
  'use strict';

  let repeatTimeout = null;

  const message = (name, data) =>
    window.top.postMessage(Object.assign({ name }, data || {}), 'http://localhost:3000');

  const repeat = (validator, func) => (data, times) => {
    clearTimeout(repeatTimeout);

    times = (times || 0) + 1;

    if (validator(data, times)) {
      func(data);

      return;
    }

    repeatTimeout = setTimeout(() => repeat(validator, func)(data, times), 20);
  };

  const EventsFunctor = (events, colors) => ({
    events,
    registerColors: fn => EventsFunctor(events, fn()),
    map: fn => EventsFunctor(fn(events, colors)),
  });

  const consumeRules = [
    [/^événement du du \w+ \d+ .*? \d+ (.*?) à (.*?) (.*?) emplacement (.*?) organisateur .*$/i, [1, 2, 3, 4]],
    [/^événement du du \w+ \d+ .*? \d+ (.*?) à (.*?) (.*?) emplacement (.*?) périodique$/i, [1, 2, 3, 4]],
    [/^événement du du \w+ \d+ .*? \d+ (.*?) à (.*?) (.*?) emplacement (.*?)$/i, [1, 2, 3, 4]],
    [/^événement du du \w+ \d+ .*? \d+ (.*?) à (.*?) (.*?) organisateur .*?$/i, [1, 2, 3]],
    [/^événement du du \w+ \d+ .*? \d+ (.*?) à (.*?) (.*?) périodique$/i, [1, 2, 3]],
    [/^événement du du \w+ \d+ .*? \d+ (.*?) à (.*?) (.*?)$/i, [1, 2, 3]],
  ];

  const usersColors = () => {
    const colors = {};

    document.querySelectorAll('[role="complementary"] [role="listbox"] [role="option"][aria-selected="true"]')
      .forEach((el) => {
        const colorEl = el.querySelector('i');
        const userEl = el.querySelector('div');

        if (!colorEl || !userEl) {
          return;
        }

        colors[colorEl.style.backgroundColor] = userEl.textContent;
      });

    return colors;
  };

  const calendarEvents = (originEvents, colors) => {
    const events = [];

    document.querySelectorAll('[role="main"] [draggable="true"] [role="button"]').forEach((el) => {
      const label = (el.getAttribute('aria-label') || '').trim();
      const colorEl = el.querySelector('div');
      const event = {
        color: colorEl && colorEl.style.borderColor || null,
      };

      consumeRules.forEach((rule) => {
        if (event.from) {
          return;
        }

        const values = label.match(rule[0]);

        if (!values) {
          return;
        }

        const keys = rule[1];

        event.from = keys[0] ? values[keys[0]] : null;
        event.to = keys[1] ? values[keys[1]] : null;
        event.summary = keys[2] ? values[keys[2]] : null;
        event.location = keys[3] ? values[keys[3]] : null;
        event.user = event.color ? colors[event.color] : null;
      });

      if (event.from && !event.summary.match(/^(annulé|canceled):/i)) {
        events.push(event);
      }
    });

    return originEvents.concat(events);
  };

  const actions = {};

  actions.consume = () => {
    const { events } = EventsFunctor([])
      .registerColors(usersColors)
      .map(calendarEvents);

    message('events', { events });
  };

  window.addEventListener('message', (event) => {
    if (event.data.name && event.data.name === 'action') {
      actions[event.data.action](event.data);
    }
  }, false);

  repeat(() => {
    const flag = document.querySelector('[role="main"]')
      && document.querySelector('[role="complementary"] [role="listbox"]');

    return flag;
  }, () => setTimeout(() => {
    message('ready');
  }, 3000))();

})();
