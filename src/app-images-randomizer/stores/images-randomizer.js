const name = 'ImagesRandomizer';

const store = {
  namespaced: true,
  state: {
    started: false,
    icon: null,
    title: null,
    selectedText: null,
    images: null,
    fixedTime: null,
  },
  mutations: {
    randomizer: (state, { started, icon, title, selectedText, images, fixedTime }) => {
      state.started = started || false;
      state.icon = icon || null;
      state.title = title || null;
      state.selectedText = selectedText || null;
      state.images = images || null;
      state.fixedTime = fixedTime || null;
    },
  },
  actions: {
    start({ commit }, task) {
      commit('randomizer', Object.assign({
        started: true,
      }, task.config));
    },
    stop({ commit }) {
      commit('randomizer', {});
    }
  },
};

export default { name, store };
