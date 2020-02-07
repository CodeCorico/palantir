import axios from 'axios';

const name = 'JiraRun';

const api = appId => axios.get(`/api/jira-run?appId=${appId}`);

const store = {
  namespaced: true,
  state: {
    velocity: {},
    sprints: { labels: [], values: [] },
    activeSprint: { labels: [], values: [] },
  },
  mutations: {
    clear(state) {
      state.velocity = {};
      state.sprints = { labels: [], values: [] };
      state.activeSprint = { labels: [], values: [] };
    },
    mutateVelocity: (state, velocity) => {
      state.velocity = velocity;
    },
    mutateSprints: (state, sprints) => {
      const sprintsSplitted = { labels: [], values: [] };

      sprints.forEach((sprint) => {
        sprintsSplitted.labels.push(sprint.name);
        sprintsSplitted.values.push(sprint.estimate.done);
      });

      state.sprints = sprintsSplitted;
    },
    mutateActiveSprint: (state, activeSprint) => {
      state.activeSprint = {
        name: activeSprint.name,
        values: [
          activeSprint.estimate.todo,
          activeSprint.estimate.doing,
          activeSprint.estimate.done,
        ],
      };
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

      commit('mutateVelocity', data.velocity);
      commit('mutateSprints', data.sprints);
      commit('mutateActiveSprint', data.activeSprint);
    },
    clear({ commit }) {
      commit('clear');
    },
  },
};

export default { name, store };
