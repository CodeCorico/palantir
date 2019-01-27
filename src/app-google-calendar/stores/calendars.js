const name = 'GoogleCalendar';

const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

const gapi = window.gapi;

const initGApi = ({ apiClient, apiKey, calendars, commit }) => new Promise((resolve, reject) => {
  gapi.load('client:auth2', async () => {
    try {
      await gapi.client.init({
        apiKey: apiKey,
        clientId: apiClient,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
      });
    } catch (err) {
      reject(err);

      return;
    }

    gapi.auth2.getAuthInstance().isSignedIn.listen((signed) => {
      commit('mutateSigned', signed);

      if (signed) {
        loadCalendars({ calendars, commit });
      } else {
        commit('clear');
      }
    });

    const signed = gapi.auth2.getAuthInstance().isSignedIn.get();

    commit('mutateSigned', signed);

    resolve(signed);
  });
});

const fetchCalendar = async (id) => {
  let timeMin = new Date();
  timeMin.setHours(0, 0, 0, 0);
  let timeMax = new Date();
  timeMax.setHours(23, 59, 59, 999);

  const response = await gapi.client.calendar.events.list({
    calendarId: id,
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
    showDeleted: false,
  });

  return response.result.items.map((item) => {
    item.calendarId = id;

    return item;
  });
};

const loadCalendars = async ({ calendars, commit }) => {
  const calendarsEvents = await Promise.all(calendars.map(id => fetchCalendar(id)));

  const eventsObj = {};
  calendarsEvents.forEach((calendarEvents) => {
    calendarEvents.forEach((event) => {
      if (event.visibility === 'private' || event.status === 'cancelled') {
        return;
      }

      eventsObj[event.id] = eventsObj[event.id] || event;
      const dateStart = new Date(event.start.dateTime || event.start.date);
      const dateEnd = new Date(event.end.dateTime || event.end.date);

      let hours = dateStart.getHours();
      let minutes = dateStart.getMinutes();
      const totalStart = (hours * 60) + minutes;
      const total = ((dateEnd.getHours() * 60) + dateEnd.getMinutes()) - totalStart;
      eventsObj[event.id].pTime = {
        hours: Math.floor(total / 60),
        minutes: Math.round(total % 60),
        fullMinutes: totalStart,
        durationMinutes: total,
      };
      hours = hours < 10 ? `0${hours}` : hours;
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      eventsObj[event.id].pStart = { hours, minutes };
    });
  });

  const events = Object.keys(eventsObj).map((id) => eventsObj[id]);

  commit('mutateEvents', events);
};

const store = {
  namespaced: true,
  state: {
    signed: false,
    taskId: null,
    events: [],
  },
  mutations: {
    clear(state) {
      state.events = [];
    },
    mutateTaskId: (state, taskId) => {
      state.taskId = taskId;
    },
    mutateSigned: (state, signed) => {
      state.signed = signed;
    },
    mutateEvents: (state, events) => {
      let lastEventString = null;

      state.events = events
        .sort((a, b) => a.pTime.fullMinutes - b.pTime.fullMinutes)
        // Remove duplicates
        .filter((event) => {
          const eventString = `
            ${event.summary}||${event.pStart.hours}||${event.pStart.minutes}||
            ${event.pTime.hours}||${event.pTime.minutes}||${event.location}
          `;

          if (eventString === lastEventString) {
            return false;
          }

          lastEventString = eventString;

          return true;
        });
    },
  },
  actions: {
    async reload({ commit, state }, task) {
      const apiClient = task.config['api-client'];
      const apiKey = task.config['api-key'];
      const { calendars } = task.config;

      let { signed } = state;

      if (state.taskId !== task.id) {
        commit('mutateTaskId', task.id);

        signed = await initGApi({ apiClient, apiKey, calendars, commit });
      }

      if (signed) {
        loadCalendars({ calendars, commit });
      }
    },
    signin() {
      gapi.auth2.getAuthInstance().signIn();
    },
    signout() {
      gapi.auth2.getAuthInstance().signOut();
    },
    clear({ commit }) {
      commit('clear');
    },
  },
};

export default { name, store };
