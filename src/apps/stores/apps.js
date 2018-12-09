import cron from '@/services/cron';
// eslint-disable-next-line import/no-unresolved, import/extensions
import * as tasksDefinitions from '../../*/tasks.js';

const tasksTypes = {};

Object.keys(tasksDefinitions).forEach((key) => {
  Object.keys(tasksDefinitions[key]).forEach((type) => {
    tasksTypes[type] = tasksDefinitions[key][type];
  });
});

const name = 'Apps';

const store = {
  namespaced: true,
  state: {
    hasConfig: true,
    appRoot: null,
    apps: {},
    tasks: [],
    tasksIds: 0,
    activeApp: null,
  },
  mutations: {
    config: (state, payload) => {
      const { menu = [], apps = {} } = payload;

      state.appRoot = null;
      state.apps = apps;

      state.tasks = [];

      Object.keys(apps).forEach((appId) => {
        const app = apps[appId];

        (app.tasks || []).forEach((task) => {
          state.tasksIds++;

          const disabled = !(tasksTypes[app.type] && tasksTypes[app.type].static);

          task.id = state.tasksIds < 10 ? `0${state.tasksIds}` : state.tasksIds;
          task.disabled = disabled;

          if (!tasksTypes[app.type] || !tasksTypes[app.type][task.trigger]) {
            task.status = 'error';
          }
          else {
            task.status = disabled ? 'disabled' : 'idle';
            task.dispatch = tasksTypes[app.type][task.trigger];
            task.config = app.config;
          }

          cron.register(task);

          state.tasks.push(task);
        });
      });

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
    activeApp: (state, id) => {
      const appId = id || state.appRoot;

      if (!state.apps || !state.apps[appId]) {
        throw new Error(`No app with the id "${appId}"`);
      }

      state.activeApp = state.apps[appId];

      (state.activeApp.tasks || []).forEach((task) => {
        task.disabled = false;
        task.status = 'idle';

        cron.update(task);
      });

      const apps = {};

      Object.keys(state.apps).forEach((id) => {
        const app = state.apps[id];

        const isStatic = tasksTypes[app.type] && tasksTypes[app.type].static;

        if (id !== appId && !isStatic) {
          (app.tasks || []).forEach((task) => {
            task.disabled = true;
            task.status = 'disabled';
          });
        }

        apps[id] = app;
      });

      state.apps = apps;

      state.tasks = state.tasks.map(task => task);
    },
  },
  actions: {
    config({ commit }, payload) {
      commit('config', payload);
    },
    activeApp({ commit }, appId) {
      commit('activeApp', appId);
    },
  }
};

export default { name, store };
