import axios from 'axios';

const name = 'Pages';

const store = {
  namespaced: true,
  state: {
    appRoute: '',
    base: '',
    content: '',
  },
  mutations: {
    updateAppRoute: (state, appRoute) => {
      state.appRoute = (appRoute || '').replace(/\/$/, '');
    },
    updateBase: (state, base) => {
      state.base = (base || '').replace(/\/$/, '');
    },
    updateContent: (state, content) => {
      state.content = content.replace(/<a\s+href="(.*?)"\s*>/g, (link, match) => {
        if (!match.match(/.md$/i) || match.match(/^http/i)) {
          return `<a href="${match}" target="_blank">`;
        }

        let newUrl = match.replace(/.md/i, '.html');
        if (!newUrl.match(/^\./)) {
          newUrl = `${state.appRoute}/${newUrl}`;
        }

        return `<a local="router-link" href="${newUrl}">`;
      });
    },
  },
  actions: {
    changeAppRoute({ commit }, appRoute) {
      commit('updateAppRoute', appRoute);
    },
    changeBase({ commit }, base) {
      commit('updateBase', base);
    },
    async load({ commit, state }, url) {
      const { data } = await axios.get(`${state.base}/${url}`);

      commit('updateContent', data);
    },
  },
};

export default { name, store };
