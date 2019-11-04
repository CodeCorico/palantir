const name = 'Freshteam';

const store = {
  namespaced: true,
  state: {
    consume: false,
    taskReady: false,
    frameReady: false,
    requests: [],
  },
  mutations: {
    clear(state) {
      state.consume = false;
      state.taskReady = false;
      state.frameReady = false;
      state.requests = [];
    },
    mutateReady(state, type) {
      state[`${type}Ready`] = true;
    },
    mutateConsume(state, value) {
      state.consume = value;
    },
    mutateRequests(state, requests) {
      state.requests = requests;
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
    collectRequests({ commit }, requests) {
      commit('mutateRequests', requests);
    },
    clear({ commit }) {
      commit('clear');
    },
  },
};

export default { name, store };
