/* eslint-disable import/no-extraneous-dependencies */
import axios from 'axios';

const name = 'Config';

let loaded = false;

const store = {
  namespaced: true,
  state: {
    config: {},
  },
  mutations: {
    config: (state, payload) => {
      state.config = payload;
    },
  },
  actions: {
    async load({ commit, dispatch, rootState }) {
      if (loaded) {
        return;
      }

      loaded = true;

      const { data } = await axios.get('/palantir.json');
      const { variables = {} } = data;

      const config = JSON.parse(JSON
        .stringify(data)
        .replace(/#{(.*?)}/g, (match, key) => variables[key] || ''));

      const { apps = [] } = config;

      Object.keys(apps).forEach((key) => {
        apps[key].url = `/app/${key}`;
      });

      commit('config', config);

      Object.keys(rootState).forEach((namespace) => {
        if (!rootState[namespace].needConfig) {
          return;
        }

        dispatch(`${namespace}/config`, config, { root: true });
      });
    },
  },
};

export default { name, store };
