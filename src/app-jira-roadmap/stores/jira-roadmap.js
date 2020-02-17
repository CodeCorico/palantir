import axios from 'axios';

const name = 'JiraRoadmap';

const api = (appId) => axios.get(`/api/jira-roadmap?appId=${appId}`);

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
