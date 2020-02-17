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
              // eslint-disable-next-line no-param-reassign
              link.external = true;
            }

            if (!link.root && !link.app) {
              return;
            }

            // eslint-disable-next-line no-param-reassign
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
  },
};

export default { name, store };
