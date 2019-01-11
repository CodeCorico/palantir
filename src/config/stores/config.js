import axios from 'axios';

const name = 'Config';

let loaded = false;

const itemsValidation = (tree, namespace, subTrees, validFunc, subTree = namespace) => {
  if (!tree) {
    return;
  }

  Object.keys(tree).forEach((key) => {
    const el = tree[key];
    const treeNamespace = `${namespace}[${key}]`;

    validFunc({ el, tree, key, treeNamespace, namespace, subTrees, subTree });

    if (subTrees && subTrees.length) {
      const nextSubtrees = subTrees.slice(0);
      const nextSubTree = nextSubtrees.shift();
      itemsValidation(el[nextSubTree], `${treeNamespace}[${nextSubTree}]`, nextSubtrees, validFunc, nextSubTree);
    }
  });
};

const configValidation = (config) => {
  const errs = [];

  if (!config || Object.keys(config).length === 0) {
    errs.push(`The "palantir.json" file is empty`);
  }

  const apps = [];

  if (!config.apps || !Object.keys(config.apps).length) {
    errs.push(`At least one app is required in the "palantir.json" config file`);
  } else {
    itemsValidation(config.apps, 'apps', ['tasks'], ({ el, key, treeNamespace, subTree }) => {
      if (subTree === 'apps') {
        apps.push(key);
      }

      if (subTree === 'tasks' && !el.id) {
        errs.push(`No "id" key in ${treeNamespace}`);
      }
    });
  }

  if (!config.menu || !config.menu.length) {
    errs.push(`A menu is required in the "palantir.json" config file`);
  } else {
    itemsValidation(config.menu, 'menu', ['sections', 'links'], ({ el, treeNamespace, subTree }) => {
      if (!el.id) {
        errs.push(`No "id" key in ${treeNamespace}`);
      }

      if (subTree === 'links' && !el.app && !el.url) {
        errs.push(`An attribute "app" or "url" is missing in ${treeNamespace}`);
      } else if (subTree === 'links' && el.app && el.url) {
        errs.push(`A menu link can't have an "app" and an "url" in ${treeNamespace}`);
      } else if (subTree === 'links' && el.app && apps.indexOf(el.app) < 0) {
        errs.push(`The app "${el.app}" doesn't exist in ${treeNamespace}`);
      }
    });
  }

  return errs.length ? `Invalid "palantir.json" description:\n- ${errs.join('\n- ')}\n` : null;
};

const errorConfig = (data, err) => {
  data = data || {};
  data.apps = data.apps || {};
  data.menu = data.menu || [];

  data.apps.$error = {
    type: 'error',
    config: {
      error: err,
    },
  };

  if (err) {
    data.menu = [{
      id: '$error-menu',
      title: 'Error',
      sections: [{
        id: '$error-section',
        title: 'Error',
        links: [{
          root: true,
          id: '$error-link',
          title: 'Error',
          icon: 'fas fa-exclamation-circle',
          app: '$error',
        }],
      }],
    }];
  }
};

const store = {
  namespaced: true,
  state: {
    config: {},
    variables: {},
  },
  mutations: {
    updateVariables: (state, variables) => {
      state.variables = variables;
    },
    updateConfig: (state, payload) => {
      state.config = payload;
    },
  },
  actions: {
    async load({ commit, dispatch, rootState }) {
      if (loaded) {
        return;
      }

      loaded = true;

      let data = null;
      let err = null;

      try {
        const payload = await axios.get('/palantir.json');
        data = payload.data;
      } catch(ex) {
        err = `Impossible to load the "palantir.json" description file.`;
      }

      err = err || configValidation(data);

      errorConfig(data, err);

      const { variables = {} } = data;

      const config = JSON.parse(JSON
        .stringify(data)
        .replace(/#{(.*?)}/g, (match, key) => variables[key] || ''));

      const { apps = [] } = config;

      Object.keys(apps).forEach((key) => {
        apps[key].url = `/app/${key}`;
      });

      commit('updateVariables', variables);
      commit('updateConfig', config);

      Object.keys(rootState).forEach((namespace) => {
        if (!rootState[namespace].hasConfig) {
          return;
        }

        dispatch(`${namespace}/config`, config, { root: true });
      });
    },
  },
};

export default { name, store };
