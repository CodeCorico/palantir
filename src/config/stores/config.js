/* eslint-disable import/no-extraneous-dependencies */
import axios from 'axios';

const name = 'Config';

let loaded = false;

const store = {
  namespaced: true,
  state: {
    apps: {},
    appRoot: null,
    tasks: [],
    categories: [],
  },
  mutations: {
    mutateConfig: (state, data) => {
      const { variables = {} } = data;

      const { apps = [], tasks = [], categories = []} = JSON.parse(JSON
        .stringify(data)
        .replace(/#{(.*?)}/g, (match, key) => variables[key] || ''));


      const appsObj = [];

      apps.forEach((app) => {
        app.url = `/app/${app.id}`;

        appsObj[app.id] = app;
      });

      state.appRoot = null;
      state.apps = appsObj;
      state.tasks = tasks;
      state.categories = categories.map((category) => {
        (category.sections || []).forEach((section) => {
          (section.links || []).forEach((link) => {
            if (link.url && !link.app && !link.root) {
              link.external = true;
            }

            if (link.root) {
              link.url = '/';

              if (link.app) {
                state.appRoot = link.app;
              }
            } else if (link.app) {
              link.url = appsObj[link.app].url;
            }
          });
        });

        return category;
      });

      // .map((category) => {
      //   (category.sections || []).forEach((section) => {
      //     (section.apps || []).forEach((app) => {
      //       (app.selectors || []).forEach((selector) => {
      //         section.selectors = section.selectors || [];

      //         if (section.selectors.indexOf(selector) < 0) {
      //           section.selectors.push(selector);
      //         }
      //       });
      //     });
      //   });

      //   return category;
      // });
    },
  },
  actions: {
    async load({ commit }) {
      if (loaded) {
        return;
      }

      loaded = true;

      const { data } = await axios.get('/palantir.json');

      commit('mutateConfig', data);
    },
  },
};

export default { name, store };
