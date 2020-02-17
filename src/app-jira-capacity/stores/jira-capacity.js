import axios from 'axios';

const name = 'JiraCapacity';

const api = (appId) => axios.get(`/api/jira-capacity?appId=${appId}`);

const store = {
  namespaced: true,
  state: {
    epics: { labels: [], values: {} },
    epicsDetails: [],
  },
  mutations: {
    clear(state) {
      state.epics = { labels: [], values: {} };
      state.epicsDetails = [];
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
      const { data } = await api(task.appId);

      if (data.error) {
        // eslint-disable-next-line no-console
        console.error(data.error);

        return;
      }

      commit('mutateEpics', data.epics);
    },
    clear({ commit }) {
      commit('clear');
    },
  },
};

export default { name, store };
