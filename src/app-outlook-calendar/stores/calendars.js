const name = 'OutlookCalendar';

const digestEvents = (events) => {
  let filteredEvents = {};

  return events
    .map((eventRaw) => {
      const event = Object.assign({}, eventRaw);

      const from = event.from.split(':');
      const dateStart = new Date();
      dateStart.setHours(parseInt(from[0], 10));
      dateStart.setMinutes(parseInt(from[1], 10));
      dateStart.setSeconds(0);

      const to = event.to.split(':');
      const dateEnd = new Date();
      dateEnd.setHours(parseInt(to[0], 10));
      dateEnd.setMinutes(parseInt(to[1], 10));
      dateEnd.setSeconds(0);

      let hours = dateStart.getHours();
      let minutes = dateStart.getMinutes();
      const totalStart = (hours * 60) + minutes;
      const total = dateEnd.getDate() !== dateStart.getDate()
        ? (23 * 60) + 59 - totalStart
        : ((dateEnd.getHours() * 60) + dateEnd.getMinutes()) - totalStart;
        event.pTime = {
        hours: Math.floor(total / 60),
        minutes: Math.round(total % 60),
        fullMinutes: totalStart,
        durationMinutes: total,
      };
      hours = hours < 10 ? `0${hours}` : hours;
      minutes = minutes < 10 ? `0${minutes}` : minutes;

      event.pStart = { hours, minutes };

      event.attendees = [{
        email: event.user,
        responseStatus: 'accepted',
      }];

      event.id = [
        `${event.summary}||${event.pStart.hours}||${event.pStart.minutes}||`,
        `${event.pTime.hours}||${event.pTime.minutes}||${event.location}`,
      ].join('');

      return event;
    })
    .sort((a, b) => a.pTime.fullMinutes - b.pTime.fullMinutes)
    // Remove duplicates
    .filter((event) => {
      if (filteredEvents[event.id]) {
        if (filteredEvents[event.id].attendeesEmails.indexOf(event.user) < 0) {
          filteredEvents[event.id].attendeesEmails.push(event.email);

          filteredEvents[event.id].event.attendees.push({
            email: event.user,
            responseStatus: 'accepted',
          });
        }

        return false;
      }

      filteredEvents[event.id] = {
        event,
        attendeesEmails: [event.user],
      };

      return true;
    });
};

const store = {
  namespaced: true,
  state: {
    consume: false,
    taskReady: false,
    frameReady: false,
    events: [],
  },
  mutations: {
    clear(state) {
      state.consume = false;
      state.taskReady = false;
      state.frameReady = false;
      state.events = [];
    },
    mutateReady(state, type) {
      state[`${type}Ready`] = true;
    },
    mutateConsume(state, value) {
      state.consume = value;
    },
    mutateEvents(state, events) {
      state.events = events;
    },
  },
  actions: {
    async reload({ dispatch, commit }) {
      commit('mutateReady', 'task');

      dispatch('consume');
    },
    frameReady({ dispatch, commit }) {
      commit('mutateReady', 'frame');

      dispatch('consume');
    },
    consume({ commit, state }) {
      if (state.taskReady && state.frameReady) {
        commit('mutateConsume', true);

        setTimeout(() => commit('mutateConsume', false));
      }
    },
    collectEvents({ commit }, events) {
      commit('mutateEvents', digestEvents(events));
    },
    clear({ commit }) {
      commit('clear');
    },
  },
};

export default { name, store };
