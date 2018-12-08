const name = 'Apps';

const store = {
  namespaced: true,
  state: {
    needConfig: true,
    menu: {},
  },
  mutations: {
    config: (state, payload) => {
      const { menu = [], apps = {} } = payload;

      state.appRoot = null;
      state.apps = apps;

      state.menu = menu.forEach((category) => {
        (category.sections || []).forEach((section) => {
          (section.links || []).forEach((link) => {
            if (link.root && link.app) {
              state.appRoot = link.app;
            }
          });
        });
      });
    },
  },
  actions: {
    config({ commit }, payload) {
      commit('config', payload);
    },
  }
};

export default { name, store };
