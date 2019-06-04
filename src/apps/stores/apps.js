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
    tasksNumbers: 0,
    activeApp: null,
  },
  mutations: {
    config: (state, payload) => {
      const { menu = [], apps = {}, root = false } = payload;

      state.appRoot = root;
      state.apps = apps;

      state.tasks = [];

      Object.keys(apps).forEach((appId) => {
        const app = apps[appId];

        (app.tasks || []).forEach((task) => {
          state.tasksNumbers++;

          const disabled = !(tasksTypes[app.type] && tasksTypes[app.type].static);

          task.number = state.tasksNumbers < 10 ? `0${state.tasksNumbers}` : state.tasksNumbers;
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
    updateActiveApp: (state, id) => {
      let appId = id || state.appRoot;

      if (!appId || !state.apps[appId]) {
        appId = '$error';
        state.apps[appId].config.error = 'No app found';
      }

      state.activeApp = state.apps[appId];

      (state.activeApp.tasks || []).forEach((task) => {
        task.disabled = false;
        task.status = 'idle';

        cron.update(task.id, {
          disabled: task.disabled,
          status: task.status,
        });
      });

      const apps = {};

      Object.keys(state.apps).forEach((id) => {
        const app = state.apps[id];

        const isStatic = tasksTypes[app.type] && tasksTypes[app.type].static;

        if (id !== appId && !isStatic) {
          (app.tasks || []).forEach((task) => {
            task.disabled = true;
            task.status = 'disabled';

            cron.update(task.id, {
              disabled: task.disabled,
              status: task.status,
            });
          });
        }

        apps[id] = app;
      });

      state.apps = apps;

      state.tasks = state.tasks.map(task => task);
    },
    mutateTasksEnable: (state, { appsIds, enable }) => {
      Object.keys(state.apps).forEach((id) => {
        const app = state.apps[id];

        if (appsIds.indexOf(id) > -1) {
          (app.tasks || []).forEach((task) => {
            task.disabled = !enable;
            task.status = enable ? 'idle' : 'disabled';

            cron.update(task.id, {
              disabled: task.disabled,
              status: task.status,
            });
          });
        }
      });
    },
  },
  actions: {
    config({ commit }, payload) {
      commit('config', payload);
    },
    activeApp({ commit }, appId) {
      commit('updateActiveApp', appId);
    },
    switchTasks({ commit }, { appsIds, enable }) {
      commit('mutateTasksEnable', { appsIds, enable });
    },
  }
};

export default { name, store };
