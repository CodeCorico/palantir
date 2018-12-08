const name = 'Tasks';

const store = {
  namespaced: true,
  state: {
    needConfig: true,
    tasks: {},
  },
  mutations: {
    config: (state, payload) => {
      state.tasks = payload.tasks;
    },
  },
  actions: {
    config({ commit }, payload) {
      commit('config', payload);
    },
  }
};

export default { name, store };
