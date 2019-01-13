import axios from 'axios';

const name = 'Pages';

const unescapeHtml = (text) => {
  var map = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': '\'',
  };

  return text.replace(/&[#0-9a-z]+;/gi, m => map[m]);
}

const sortTree = (tree) => {
  tree.sort((a, b) => {
    return a.file && b.path ? 1 : a.path && b.file ? -1 : 0;
  });

  tree.forEach((obj) => {
    if (obj.tree) {
      sortTree(obj.tree);
    }
  });

  return tree;
};

const store = {
  namespaced: true,
  state: {
    appRoute: '',
    base: '',
    content: '',
    summary: [],
    glossary: [],
  },
  mutations: {
    clear(state) {
      state.appRoute = '';
      state.base = '';
      state.content = '';
      state.summary = [];
      state.glossary = [];
    },
    updateAppRoute: (state, appRoute) => {
      state.appRoute = (appRoute || '').replace(/\/$/, '');
    },
    updateBase: (state, base) => {
      state.base = (base || '').replace(/\/$/, '');
    },
    updateContent: (state, content) => {
      state.content = content.replace(/<a\s+href="(.*?)"\s*>/g, (link, match) => {
        if (!match.match(/.mm?d$/i) || match.match(/^http/i)) {
          return `<a href="${match}" target="_blank">`;
        }

        let newUrl = match.replace(/.md/i, '.html');
        if (!newUrl.match(/^\./)) {
          newUrl = `${state.appRoute}/${newUrl}`;
        }

        return `<a local="router-link" href="${newUrl}">`;
      });

      state.summary = [];

      (content.match(/<h[1-4].*?>.*?<\/h[1-4]>/gi) || []).forEach((h) => {
        let text = h.match(/<h([1-4]).*?>(.*?)<\/h[1-4]>/i);
        if (!text) {
          return;
        }

        const level = text[1];
        text = unescapeHtml(text[2].replace(/<(?:.|\n)*?>/g, ''));

        let id = h.match(/<h[1-4].*?id="(.*?)">(.*?)<\/h[1-4]>/i);
        id = id ? id[1] : text;

        state.summary.push({ id, text, level });
      });
    },
    updateGlossary: (state, glossary) => {
      state.glossary = sortTree(glossary);
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
    async loadGlossary({ commit, state }) {
      try {
        const payload = await axios.get(`${state.base}/glossary.json`);

        if (!payload.headers['content-type'].match('application/json')) {
          throw new Error('No Glossary');
        }

        const { data } = payload;

        commit('updateGlossary', data);
      } catch (err) {
        commit('updateGlossary', []);
      }
    },
    clear({ commit }) {
      commit('clear');
    },
  },
};

export default { name, store };
