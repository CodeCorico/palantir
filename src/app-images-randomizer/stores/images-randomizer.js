const name = 'ImagesRandomizer';

const store = {
  namespaced: true,
  state: {
    id: null,
    icon: null,
    title: null,
    selectedText: null,
    images: null,
    fixedTime: null,
    sounds: null,
  },
  mutations: {
    updateRandomizer: (state, payload) => {
      state.id = payload.id || null;
      state.icon = payload.icon || null;
      state.title = payload.title || null;
      state.selectedText = payload.selectedText || null;
      state.images = payload.images || null;
      state.fixedTime = payload.fixedTime || null;
      state.sounds = payload.sounds || null;
    },
  },
  actions: {
    start({ commit }, task) {
      commit('updateRandomizer', {});
      setTimeout(() => {
        commit('updateRandomizer', { id: task.id, ...task.config });
      });
    },
    stop({ commit }) {
      commit('updateRandomizer', {});
    },
  },
};

export default { name, store };
