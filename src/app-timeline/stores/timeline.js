import axios from 'axios';

const name = 'Timeline';

const store = {
  namespaced: true,
  state: {
    dateFilter: '',
    domainFilter: '',
    lastWarnings: {},
    domains: [],
    datesColumns: [],
    datesEvents: [],
  },
  mutations: {
    clear(state) {
      state.dateFilter = '';
      state.domainFilter = '';
      state.lastWarnings = {};
      state.domains = [];
      state.datesColumns = [];
      state.datesEvents = [];
    },
    updateFilter(state, { type, value }) {
      state[`${type}Filter`] = value;
    },
    updateDates: (state, dates) => {
      state.dates = dates;
    },
    computeStore(state) {
      const lastWarnings = {};
      const domains = [];
      const datesColumns = [];
      const datesEvents = [];

      let dateIndex = -1;

      state.dates.forEach((date) => {
        if (!date.title) {
          return;
        }

        if (state.dateFilter) {
          const reg = new RegExp(state.dateFilter.replace('.', '\\.').replace('*', '.*'), 'i');

          if (!date.title.match(reg)) {
            return;
          }
        }

        dateIndex += 1;

        const datesColumn = {
          title: date.title,
          subtitle: date.subtitle || null,
        };

        datesColumns.push(datesColumn);

        const events = [];

        if (!date.events) {
          datesEvents.push({ title: date.title, events, content: date.content });

          return;
        }

        Object.keys(date.events).forEach((key) => {
          const domain = key.trim().toLowerCase();
          const event = date.events[key];

          if (state.domainFilter) {
            const reg = new RegExp(state.domainFilter.replace('.', '\\.').replace('*', '.*'), 'i');

            if (!domain.match(reg)) {
              return;
            }
          }

          if (domains.indexOf(domain) < 0) {
            domains.push(domain);
          }

          const eventKeys = Object.keys(event);
          const types = [];
          const texts = [];
          let isSingle = false;

          if (eventKeys.length === 1 && event[eventKeys[0]].length === 1) {
            isSingle = true;
            types.push(eventKeys[0]);
            texts.push(event[eventKeys[0]][0]);
          } else {
            ['idle', 'success', 'warning', 'perf'].forEach((eventState) => {
              if (!event[eventState]) {
                return;
              }

              types.push(eventState);
              texts.push(event[eventState].length);
            });
          }

          if (types.indexOf('idle') > -1) {
            datesColumn.isIdle = true;
          }

          let lastWarning = -1;

          if (typeof lastWarnings[domain] !== 'undefined') {
            lastWarning = lastWarnings[domain];

            delete lastWarnings[domain];
          }

          events.push({
            dateIndex,
            domain,
            types,
            type: types.join('-'),
            texts,
            isSingle,
            lastWarning,
            warningOnly: types.indexOf('warning') > -1 && types.length === 1,
          });

          if (types.indexOf('warning') > -1) {
            lastWarnings[domain] = dateIndex;
          }
        });

        events.sort((a, b) => {
          const status = a.domain > b.domain ? 1 : 0;
          return status || (a.domain < b.domain ? -1 : 0);
        });

        datesEvents.push({ title: date.title, events, content: date.content });
      });

      domains.sort();

      state.lastWarnings = lastWarnings;
      state.domains = domains;
      state.datesColumns = datesColumns;
      state.datesEvents = datesEvents;
    },
  },
  actions: {
    async load({ commit }, url, reset = true) {
      const { data } = await axios.get(url);

      if (reset) {
        commit('updateFilter', { type: 'date', value: '' });
        commit('updateFilter', { type: 'domain', value: '' });
      }

      commit('updateDates', data.dates);
      commit('computeStore');
    },
    filter({ commit }, { type, value }) {
      commit('updateFilter', { type, value });
      commit('computeStore');
    },
    clear({ commit }) {
      commit('clear');
    },
  },
};

export default { name, store };
