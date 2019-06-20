const path = require('path');
const fs = require('fs');
const { log, logError } = require(path.resolve(__dirname, 'command-console-format'));

const throwError = (message) => {
  logError(message);

  throw new Error(message);
};

const findIndex = (arr, attr, value) => {
  let index = -1;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i][attr] === value) {
      index = i;

      break;
    }
  }

  return index;
}

// ----- CONFIG

const palantirFile =
  file => file ? path.resolve(file) : `${process.env.SERVER_STATICS}/palantir.json`;

const load = (file) => (configData) => {
  const fileReal = palantirFile(file);

  if (!fs.existsSync(fileReal)) {
    logError(`File "${fileReal}" doesn't exist\n`);

    throwError(`File "${fileReal}" doesn't exist`);
  }

  return {
    ...configData,
    ...JSON.parse(fs.readFileSync(fileReal, 'utf8'))
  };
};

const save = (indent, file) => (configData) => {
  const fileReal = palantirFile(file);

  const indentArgs = indent ? [null, 2] : [];

  fs.writeFileSync(fileReal, JSON.stringify(configData, ...indentArgs));

  return configData;
};

const reset = () => {
  return {}
};

// ----- VARIABLES

const getVariables = name => configData => ({
  ...configData,
  value: configData.variables ? configData.variables[name] : configData.variables
});

const setVariables = (name, value) => configData => ({
  ...configData,
  variables: {
    ...configData.variables,
    [name]: value,
  },
  value
});

// ----- APPS

const apps = (configData) => ({
  get: id => app(id)(configData),
  add: (id, type, config = null, tasks = null) => {
    if (!id || !type) {
      throwError(`The "id" and the "type" are needed to create an app`);
    }

    configData.apps = configData.apps || {};

    configData.apps[id] = { type };
    if (config) {
      configData.apps[id].config = config;
    }
    if (tasks) {
      configData.apps[id].tasks = tasks;
    }

    return app(id)(configData);
  },
  remove: id => app(id)(configData).remove(),
});

const app = (id) => (configData) => {
  if (!configData.apps || !configData.apps[id]) {
    throwError(`The app "${id}" doesn't exist`);
  }

  return base({
    remove: () => {
      if (!configData.apps) {
        return base(apps);
      }

      delete configData.apps[id];

      return base(apps);
    },
    setConfig: (config) => {
      if (!configData.apps || !configData.apps[id]) {
        throwError(`The app "${id}" doesn't exist`);
      }

      configData.apps[id].config = config;

      return app(id)(configData);
    },
    removeConfig: () => {
      if (!configData.apps || !configData.apps[id]) {
        throwError(`The app "${id}" doesn't exist`);
      }

      delete configData.apps[id].config;

      return app(id)(configData);
    },
    getTask: taskId => task(id, taskId),
    addTask: (taskId, config = {}) => {
      if (!configData.apps || !configData.apps[id]) {
        throwError(`The app "${id}" doesn't exist`);
      }

      config.id = taskId;

      configData.apps[id].tasks = configData.apps[id].tasks || [];
      configData.apps[id].tasks.push(config);

      return task(id, taskId);
    },
    removeTask: taskId => task(id, taskId).remove(),
  });
};

// ----- TASKS

const task = (appId, id) => configData => {
  if (!configData.apps || !configData.apps[appId]) {
    throwError(`The app "${id}" doesn't exist`);
  }
  if (!configData.apps[appId].tasks) {
    throwError(`The task "${id}" of the app "${appId}" doesn't exist`);
  }

  let isExist = false;
  configData.apps[appId].tasks.forEach((taskConfig) => {
    isExist = taskConfig.id === id ? true : isExist;
  });

  if (!isExist) {
    throwError(`The task "${id}" of the app "${appId}" doesn't exist`);
  }

  const findTaskIndex = () => findIndex(
    configData.apps[appId], 'id', id, `The task "${id}" of the app "${appId}" doesn't exist`
  );

  return base({
    remove: () => {
      configData.apps[appId].tasks.splice(findTaskIndex(), 1);

      return app(appId)(configData);
    },
    setConfig: (config) => {
      const index = findTaskIndex();

      if (!config.id) {
        const { id } = configData.apps[appId].tasks[index];
        config.id = id;
      }

      configData.apps[appId].tasks[index] = config;

      return app(appId, id)(configData);
    },
  });
};

// ----- MENU

const menu = configData => ({
  get: id => menuItem(id)(configData),
  add: (id, title, sections = null) => {
    if (!id || !title) {
      throwError(`The "id" and the "title" are needed to create a menu item`);
    }

    configData.menu = configData.menu || [];

    const item = { id, title };
    if (sections) {
      item.sections = sections;
    }

    configData.menu.push(item);

    return menuItem(id)(configData);
  },
  remove: id => menuItem(id)(configData).remove(),
});

const menuItem = (id) => configData => {
  if (!configData.menu) {
    throwError(`The menu item "${id}" doesn't exist`);
  }

  let isExist = false;
  configData.menu.forEach((menuItem) => {
    isExist = menuItem.id === id ? true : isExist;
  });

  if (!isExist) {
    throwError(`The menu item "${id}" doesn't exist`);
  }

  const findMenuIndex = () => findIndex(
    configData.menu, 'id', id, `The menu item "${id}" doesn't exist`
  );

  return base({
    remove: () => {
      configData.menu.splice(findMenuIndex(), 1);

      return base(menu);
    },
    setTitle: (title) => {
      configData.menu[findMenuIndex()].title = title;

      return menuItem(id)(configData);
    },
    getSection: sectionId => menuSection(id, sectionId)(configData),
    addSection: (sectionId, sectionTitle) => {
      const index = findMenuIndex();

      configData.menu[index].sections = configData.menu[index].sections || [];
      configData.menu[index].sections.push({
        id: sectionId,
        title: sectionTitle,
      });

      return menuSection(id, sectionId)(configData);
    },
    removeSection: sectionId => menuSection(id, sectionId)(configData).remove(),
  });
};

const menuSection = (menuItemId, id) => configData => {
  const findMenuIndex = () => findIndex(
    configData.menu, 'id', menuItemId, `The menu item "${id}" doesn't exist`
  );

  const findMenuSectionIndex = () => findIndex(
    configData.menu[findMenuIndex()].sections, 'id', id, `The menu section "${id}" doesn't exist`
  );

  const findMenuSection = () => configData.menu[findMenuIndex()].sections[findMenuSectionIndex()];

  if (!findMenuSection()) {
    throwError(`The menu section "${id}" doesn't exist in "${menuItemId}"`);
  }

  return base({
    remove: () => {
      const sections = configData.menu[findMenuIndex()].sections;

      sections.splice(findMenuSectionIndex(), 1);

      return base(menuItem(menuItemId)(configData));
    },
    setTitle: (title) => {
      findMenuSection().title = title;

      return menuSection(menuItemId, id)(configData);
    },
    getLink: linkId => menuSection(menuItemId, id, linkId)(configData),
    addLink: (linkId, title, icon, app = null, url = null, root = false) => {
      if ((!title || !icon) || (!app && !url)) {
        throwError(`
          The "title" and "icon" are needed to create a menu item.
          The "app" or the "url" is needed.
        `);
      }

      const section = findMenuSection();

      const link = {
        id: linkId,
        title,
        icon,
      };

      if (app) {
        link.app = app;
      }

      if (url) {
        link.link = url;
      }

      if (root) {
        link.root = root;
      }

      section.links = section.links || [];
      section.links.push(link);

      return menuLink(menuItemId, id, linkId)(configData);
    },
  });
};

const menuLink = (menuItemId, sectionId, id) => configData => {
  const findMenuIndex = () => findIndex(
    configData.menu, 'id', menuItemId, `The menu item "${id}" doesn't exist`
  );

  const findMenuSectionIndex = () => findIndex(
    configData.menu[findMenuIndex()].sections, 'id', sectionId,
    `The menu section "${id}" doesn't exist`
  );

  const findMenuLinkIndex = () => findIndex(
    configData.menu[findMenuIndex()].sections[findMenuSectionIndex()].links,
    'id', id, `The menu link "${id}" doesn't exist`
  );

  const findMenuLink = () => configData
    .menu[findMenuIndex()]
    .sections[findMenuSectionIndex()]
    .links[findMenuLinkIndex()];

  if (!findMenuLink()) {
    throwError(`The menu link "${id}" doesn't exist in "${sectionId}" from "${menuItemId}"`);
  }

  return base({
    remove: () => {
      const links = configData.menu[findMenuIndex()].sections[findMenuSectionIndex()];

      links.splice(findMenuLinkIndex(), 1);

      return base(menuSection(menuItemId, sectionId)(configData));
    },
    setTitle: (value) => {
      findMenuLink().title = value;

      return menuLink(menuItemId, sectionId, id)(configData);
    },
    setIcon: (value) => {
      findMenuLink().icon = value;

      return menuLink(menuItemId, sectionId, id)(configData);
    },
    setApp: (value) => {
      findMenuLink().app = value;
      delete findMenuLink().url;

      return menuLink(menuItemId, sectionId, id)(configData);
    },
    setUrl: (value) => {
      findMenuLink().url = value;
      delete findMenuLink().app;

      return menuLink(menuItemId, sectionId, id)(configData);
    },
    setRoot: (value) => {
      if (value) {
        findMenuLink().root = true;
      } else {
        delete findMenuLink().root;
      }

      return menuLink(menuItemId, sectionId, id)(configData);
    },
  });
};

const Just = (value) => ({
  map: fn => Just(fn(value)),
  chain: fn => fn(value),
  ap: monad => monad.map(value),
  get: () => value,
})

const configDataMonad = Just({});

const base = (obj) => ({
  ...obj,
  load: file => configDataMonad.map(load(file)),
  save: (indent, file) => configDataMonad.map(save(indent, file)),
  reset: () => configDataMonad.map(reset),
  data: configDataMonad.get,
  display: () => log(configDataMonad.get()),
  variables: {
    get: name => configDataMonad.map(getVariables(name)),
    set: (name, value) => configDataMonad.map(setVariables(name, value))
  },
  value: configDataMonad.get().value,
  apps: () => configDataMonad.chain(apps),
  task: () => configDataMonad.chain(task),
  menu: () => configDataMonad.chain(menu)
});

module.exports = base();