const name = 'Menu';

const store = {
  namespaced: true,
  state: {
    hasConfig: true,
    menu: [],
  },
  mutations: {
    config: (state, payload) => {
      const { menu = [], apps = {} } = payload;

      state.menu = menu.map((category) => {
        (category.sections || []).forEach((section) => {
          (section.links || []).forEach((link) => {
            if (link.url && !link.app && !link.root) {
              link.external = true;
            }

            if (!link.root && !link.app) {
              return;
            }

            link.url = link.root ? '/' : apps[link.app].url;
          });
        });

        return category;
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
