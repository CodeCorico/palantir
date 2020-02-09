import axios from 'axios';

const name = 'JiraRoadmap';

const api = appId => axios.get(`/api/jira-roadmap?appId=${appId}`);

const store = {
  namespaced: true,
  state: {
    events: [],
    sprints: [],
    epics: [],
  },
  mutations: {
    clear(state) {
      state.events = [];
      state.sprints = [];
      state.epics = [];
    },
    mutateEvents: (state, events) => {
      state.events = events;
    },
    mutateSprints: (state, sprints) => {
      state.sprints = sprints;
    },
    mutateEpics: (state, epics) => {
      state.epics = epics;
    },
  },
  actions: {
    async reload({ commit }, task) {
      const { data } = await api(task.appId);

      if (data.error) {
        // eslint-disable-next-line no-console
        console.error(data.error);

        return;
      }

      console.log(data);

      // const sprints = [];
      // const epics = [];

      // [6, 7, 8, 9, 10, 11, 12, 13].forEach((key) => {
      //   sprints.push(`Sublime Sprint ${key} (55pt)`);
      //   epics.push({
      //     title: `Epic ${key} bla bla bla bla bla bla bla bla bla bla bla bla`,
      //     todo: { value: 5, percent: 33 },
      //     done: { value: 10, percent: 66 },
      //     unestimated: { percent: 20 },
      //     sprints: [{
      //       title: 'Sublime Sprint 6',
      //     }, {
      //       title: 'Sublime Sprint 7',
      //       startAt: 20,
      //       value: 50,
      //       percent: 40,
      //     }, {
      //       title: 'Sublime Sprint 8',
      //       startAt: 0,
      //       value: 10,
      //       percent: 10,
      //     }, {
      //       title: 'Sublime Sprint 9',
      //     }]
      //   });
      // });

      // const data2 = {
      //   events: [],
      //   sprints,
      //   epics,
      // };

      commit('mutateEvents', data.events);
      commit('mutateSprints', data.sprints);
      commit('mutateEpics', data.epics);
    },
    clear({ commit }) {
      commit('clear');
    },
  },
};

export default { name, store };
