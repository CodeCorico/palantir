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
    configLoaded: false,
    appRoot: null,
    apps: {},
    tasks: [],
    tasksNumbers: 0,
    activeAppId: null,
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

        (app.tasks || []).forEach((appTask) => {
          const task = { ...appTask };
          state.tasksNumbers += 1;

          const disabled = !(tasksTypes[app.type] && tasksTypes[app.type].static);

          task.appId = appId;
          task.number = state.tasksNumbers < 10 ? `0${state.tasksNumbers}` : state.tasksNumbers;
          task.disabled = disabled;

          if (!tasksTypes[app.type] || !tasksTypes[app.type][task.trigger]) {
            task.status = 'error';
          } else {
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

      state.configLoaded = true;
    },
    updateActiveApp: (state, id) => {
      let appId = id || state.appRoot;
      state.activeAppId = appId;

      if (!state.configLoaded) {
        return;
      }

      if (!appId || !state.apps[appId]) {
        appId = '$error';
        state.apps[appId] = {
          type: 'error',
          config: {
            error: 'No app found',
          },
        };
      }

      state.activeApp = state.apps[appId];

      (state.activeApp.tasks || []).forEach((task) => {
        // eslint-disable-next-line no-param-reassign
        task.disabled = false;
        // eslint-disable-next-line no-param-reassign
        task.status = 'idle';

        cron.update(task.id, {
          disabled: task.disabled,
          status: task.status,
        });
      });

      const apps = {};

      Object.keys(state.apps).forEach((stateAppId) => {
        const app = state.apps[stateAppId];

        const isStatic = tasksTypes[app.type] && tasksTypes[app.type].static;

        if (stateAppId !== appId && !isStatic) {
          (app.tasks || []).forEach((task) => {
            // eslint-disable-next-line no-param-reassign
            task.disabled = true;
            // eslint-disable-next-line no-param-reassign
            task.status = 'disabled';

            cron.update(task.id, {
              disabled: task.disabled,
              status: task.status,
            });
          });
        }

        apps[stateAppId] = app;
      });

      state.apps = apps;

      state.tasks = state.tasks.map((task) => task);
    },
    mutateTasksEnable: (state, { appsIds, enable }) => {
      Object.keys(state.apps).forEach((id) => {
        const app = state.apps[id];

        if (appsIds.indexOf(id) > -1) {
          (app.tasks || []).forEach((task) => {
            // eslint-disable-next-line no-param-reassign
            task.disabled = !enable;
            // eslint-disable-next-line no-param-reassign
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
    config({ commit, state }, payload) {
      commit('config', payload);
      commit('updateActiveApp', state.activeAppId);
    },
    activeApp({ commit }, appId) {
      commit('updateActiveApp', appId);
    },
    switchTasks({ commit }, { appsIds, enable }) {
      commit('mutateTasksEnable', { appsIds, enable });
    },
  },
};

export default { name, store };
