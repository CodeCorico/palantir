import axios from 'axios';

const name = 'JiraCapacity';

const API_URL = '/api/jira-capacity';

const api = (path, appId) => axios.get(`${API_URL}/${path}?appId=${appId}`);

const store = {
  namespaced: true,
  state: {
    velocity: {},
    sprints: { labels: [], values: [] },
    activeSprint: { labels: [], values: [] },
    epics: { labels: [], values: {} },
    epicsDetails: [],
  },
  mutations: {
    clear(state) {
      state.velocity = {};
      state.sprints = { labels: [], values: [] };
      state.activeSprint = { labels: [], values: [] };
      state.epics = { labels: [], values: {} };
      state.epicsDetails = [];
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
    mutateEpics: (state, epics) => {
      const epicsSplitted = {
        labels: [],
        values: { todo: [], doing: [], done: [] },
      };

      state.epicsDetails = epics.map((epic) => {
        epicsSplitted.labels.push(epic.name);
        epicsSplitted.values.todo.push(epic.estimate.todo);
        epicsSplitted.values.doing.push(epic.estimate.doing);
        epicsSplitted.values.done.push(epic.estimate.done);

        return {
          id: epic.id,
          todo: epic.estimate.todo,
          unestimatedPercent: Math.round(epic.estimate.unestimatedPercent),
        };
      });

      state.epics = epicsSplitted;
    },
  },
  actions: {
    async reload({ commit }, task) {
      api('sprints', task.appId).then(({ data }) => {
        if (data.error) {
          // eslint-disable-next-line no-console
          console.error(data.error);

          return;
        }

        commit('mutateVelocity', data.velocity);
        commit('mutateSprints', data.sprints);
        commit('mutateActiveSprint', data.activeSprint);
      });

      api('epics', task.appId).then(({ data }) => {
        if (data.error) {
          // eslint-disable-next-line no-console
          console.error(data.error);

          return;
        }

        commit('mutateEpics', data.epics);
      });
    },
    clear({ commit }) {
      commit('clear');
    },
  },
};

export default { name, store };