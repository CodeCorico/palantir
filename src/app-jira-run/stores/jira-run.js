import axios from 'axios';

const name = 'JiraRun';

const api = (appId) => axios.get(`/api/jira-run?appId=${appId}`);

const store = {
  namespaced: true,
  state: {
    velocity: {},
    sprints: { labels: [], stories: [], debts: [] },
    activeSprint: { labels: [], values: [] },
  },
  mutations: {
    clear(state) {
      state.velocity = {};
      state.sprints = { labels: [], stories: [], debts: [] };
      state.activeSprint = { labels: [], values: [] };
    },
    mutateVelocity: (state, velocity) => {
      state.velocity = velocity;
    },
    mutateSprints: (state, sprints) => {
      state.sprints = sprints.reduce((prev, sprint) => ({
        labels: prev.labels.concat(sprint.name),
        stories: prev.stories.concat([sprint.estimate.done]),
        debts: prev.debts.concat([sprint.tracking.percentSpent]),
      }), { labels: [], stories: [], debts: [] });
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
