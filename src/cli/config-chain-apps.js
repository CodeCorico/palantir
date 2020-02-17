const TasksSource = require('./config-chain-tasks');

const AppSource = (ConfigSource, config, id) => {
  const passConfig = { ...config };

  return {
    type: (newType) => {
      passConfig.apps[id].type = newType;

      return AppSource(ConfigSource, passConfig, id);
    },
    tapType: (fn) => {
      passConfig.apps[id].type = fn(passConfig.apps[id].type || '');

      return AppSource(ConfigSource, passConfig, id);
    },
    getType: () => config.apps[id].type,
    secrets: (newSecrets) => {
      passConfig.apps[id].secrets = newSecrets;

      return AppSource(ConfigSource, passConfig, id);
    },
    tapSecrets: (fn) => {
      passConfig.apps[id].secrets = fn(passConfig.apps[id].secrets || {});

      return AppSource(ConfigSource, passConfig, id);
    },
    getSecrets: () => config.apps[id].secrets,
    removeSecrets: () => {
      delete passConfig.apps[id].secrets;

      return AppSource(ConfigSource, passConfig, id);
    },
    config: (newConfig) => {
      passConfig.apps[id].config = newConfig;

      return AppSource(ConfigSource, passConfig, id);
    },
    tapConfig: (fn) => {
      passConfig.apps[id].config = fn(passConfig.apps[id].config || {});

      return AppSource(ConfigSource, passConfig, id);
    },
    getConfig: () => passConfig.apps[id].config,
    removeConfig: () => {
      delete passConfig.apps[id].config;

      return AppSource(ConfigSource, passConfig, id);
    },
    // eslint-disable-next-line no-use-before-define
    tasks: TasksSource(ConfigSource, AppsSource, AppSource, passConfig, id),
    // eslint-disable-next-line no-use-before-define
    end: () => AppsSource(ConfigSource, passConfig),
  };
};

const AppsSource = (ConfigSource, config) => {
  const passConfig = { ...config, apps: config.apps || {} };

  return {
    use: (id) => {
      passConfig.apps[id] = passConfig.apps[id] || {};

      return AppSource(ConfigSource, passConfig, id);
    },
    remove: (id) => {
      delete passConfig.apps[id];

      return AppsSource(ConfigSource, passConfig);
    },
    end: () => ConfigSource(passConfig),
  };
};

module.exports = AppsSource;
