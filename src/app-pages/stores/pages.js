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
    appLocalRoute: '',
    base: '',
    content: '',
    summary: [],
    glossary: [],
  },
  mutations: {
    clear(state) {
      state.appRoute = '';
      state.appLocalRoute = '';
      state.base = '';
      state.content = '';
      state.summary = [];
      state.glossary = [];
    },
    updateAppRoute: (state, { appRoute, appLocalRoute }) => {
      state.appRoute = (appRoute || '').replace(/\/$/, '');
      state.appLocalRoute = (appLocalRoute || '').replace(/\/$/, '');
    },
    updateBase: (state, base) => {
      state.base = (base || '').replace(/\/$/, '');
    },
    updateContent: (state, content) => {
      const imgBase = state.base ? `${state.base}/` : '';
      let imgRoute = '';
      if (state.appLocalRoute && state.appLocalRoute.indexOf('/') > -1) {
        imgRoute = state.appLocalRoute.split('/');
        imgRoute.pop();
        imgRoute = `${imgRoute.join('/')}/`;
      }

      state.content = content
        .replace(/<a.*?href="(.*?)".*?>/g, (link, match) => {
          if (!match.match(/.mm?d.html$/i) || match.match(/^http/i)) {
            return `<a href="${match}" target="_blank">`;
          }

          let url = window.location.pathname;
          if (url.match(/.html$/)) {
            const split = url.split('/');
            split.pop();
            url = split.join('/');
          }
          url = !url.match(/\/$/) ? `${url}/` : url;

          return `<a local="router-link" href="${url}${match}">`;
        })
        .replace(/<img.*?src="(.*?)".*?>/g, (img, match) => {
          if (match.match(/^http/i)) {
            return img;
          }

          return img.replace(match, `${imgBase}${imgRoute}${match}`);
        });

      state.summary = [];

      (content.match(/<h[1-4].*?>.*?<\/h[1-4]>/gi) || []).forEach((h) => {
        let text = h.match(/<h([1-4]).*?>(.*?)<\/h[1-4]>/i);
        if (!text) {
          return;
        }

        if (h.match(/summary="false"/i)) {
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
    changeAppRoute({ commit }, { appRoute, appLocalRoute }) {
      commit('updateAppRoute', { appRoute, appLocalRoute });
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
