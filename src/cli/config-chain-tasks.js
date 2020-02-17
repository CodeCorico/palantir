const findIndex = (tasks, id) => tasks.reduce((value, task, i) => (task.id === id ? i : value), -1);

const TaskSource = (ConfigSource, AppsSource, AppSource, config, appId, id) => {
  const passConfig = { ...config };
  const { tasks } = passConfig.apps[appId];
  const index = findIndex(tasks, id);

  return {
    options: (newOptions) => {
      tasks[index] = { id, ...newOptions };

      return TaskSource(ConfigSource, AppsSource, AppSource, passConfig, appId, id);
    },
    tapOptions: (fn) => {
      tasks[index] = fn(tasks[index]);

      return AppSource(ConfigSource, passConfig, id);
    },
    getOptions: () => tasks[index],
    // eslint-disable-next-line no-use-before-define
    end: () => TasksSource(ConfigSource, AppsSource, AppSource, passConfig, appId),
  };
};

const TasksSource = (ConfigSource, AppsSource, AppSource, config, appId) => {
  const passConfig = { ...config };
  passConfig.apps[appId].tasks = passConfig.apps[appId].tasks || [];
  const { tasks } = passConfig.apps[appId];

  return {
    use: (id) => {
      const index = findIndex(tasks, id);

      tasks[index > -1 ? index : tasks.length] = index > -1 ? tasks[index] : { id };

      return TaskSource(ConfigSource, AppsSource, AppSource, passConfig, appId, id);
    },
    remove: (id) => {
      passConfig.apps[appId].tasks = passConfig.apps[appId].tasks.filter((task) => task.id !== id);

      return TasksSource(ConfigSource, AppsSource, AppSource, passConfig, appId);
    },
    end: () => AppSource(ConfigSource, AppsSource, passConfig, appId),
  };
};

module.exports = TasksSource;
