const path = require('path');
const fs = require('fs');
const { log, logError } = require(path.resolve(__dirname, 'command-console-format'));

let configData = {};

const throwError = (message) => {
  logError(message);

  throw new Error(message);
};

const findIndex = (arr, attr, value) => {
  let index = -1;

  for (let i = 0; i <arr.length; i++) {
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

const load = (file) => {
  const fileReal = palantirFile(file);

  if (!fs.existsSync(fileReal)) {
    logError(`File "${fileReal}" doesn't exist\n`);

    throwError(`File "${fileReal}" doesn't exist`);
  }

  configData = JSON.parse(fs.readFileSync(fileReal, 'utf8'));

  return base();
};

const save = (indent, file) => {
  const fileReal = palantirFile(file);

  const indentArgs = indent ? [null, 2] : [];

  fs.writeFileSync(fileReal, JSON.stringify(configData, ...indentArgs));
};

const display = () => {
  log(configData);

  return base();
};


// ----- VARIABLES

const variables = {
  get: name => base({
    value: configData.variables ? configData.variables[name] : configData.variables
  }),
  set: (name, value) => {
    configData.variables = configData.variables || {};
    configData.variables[name] = value;

    return base({
      value: configData.variables[name],
    });
  },
};

// ----- APPS

const apps = {
  get: id => app(id),
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

    return app(id);
  },
  remove: id => app(id).remove(),
};

const app = (id) => {
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

      return app(id);
    },
    removeConfig: () => {
      if (!configData.apps || !configData.apps[id]) {
        throwError(`The app "${id}" doesn't exist`);
      }

      delete configData.apps[id].config;

      return app(id);
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

const task = (appId, id) => {
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

      return app(appId);
    },
    setConfig: (config) => {
      const index = findTaskIndex();

      if (!config.id) {
        const { id } = configData.apps[appId].tasks[index];
        config.id = id;
      }

      configData.apps[appId].tasks[index] = config;

      return app(appId, id);
    },
  });
};

// ----- MENU

const menu = {
  get: id => menuItem(id),
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

    return menuItem(id);
  },
  remove: id => menuItem(id).remove(),
};

const menuItem = (id) => {
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

      return menuItem(id);
    },
    getSection: sectionId => menuSection(id, sectionId),
    addSection: (sectionId, sectionTitle) => {
      const index = findMenuIndex();

      configData.menu[index].sections = configData.menu[index].sections || [];
      configData.menu[index].sections.push({
        id: sectionId,
        title: sectionTitle,
      });

      return menuSection(id, sectionId);
    },
    removeSection: sectionId => menuSection(id, sectionId).remove(),
  });
};

const menuSection = (menuItemId, id) => {
  const findMenuIndex = () => findIndex(
    configData.menu, 'id', menuItemId, `The menu item "${id}" doesn't exist`
  );

  const findMenuSectionIndex = () => findIndex(
    configData.menu[findMenuIndex()].sections, 'id', id, `The menu section "${id}" doesn't exist`
  );

  const findMenuSection = () => configData.menu[findMenuIndex()].sections[findMenuSectionIndex()];

  if (!findMenuSection()) {
    throwError(`The menu section "${id}" doesn't exist`);
  }

  return base({
    remove: () => {
      const sections = configData.menu[findMenuIndex()].sections;

      sections.splice(findMenuSectionIndex(), 1);

      return base(menuItem(menuItemId));
    },
    setTitle: (title) => {
      findMenuSection().title = title;

      return menuSection(menuItemId, id);
    },
    getLink: linkId => menuSection(menuItemId, id, linkId),
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

      return menuLink(menuItemId, id, linkId);
    },
  });
};

const menuLink = (menuItemId, sectionId, id) => {
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
    throwError(`The menu link "${id}" doesn't exist`);
  }

  return base({
    remove: () => {
      const links = configData.menu[findMenuIndex()].sections[findMenuSectionIndex()];

      links.splice(findMenuLinkIndex(), 1);

      return base(menuSection(menuItemId, sectionId));
    },
    setTitle: (value) => {
      findMenuLink().title = value;

      return menuLink(menuItemId, sectionId, id);
    },
    setIcon: (value) => {
      findMenuLink().icon = value;

      return menuLink(menuItemId, sectionId, id);
    },
    setApp: (value) => {
      findMenuLink().app = value;
      delete findMenuLink().url;

      return menuLink(menuItemId, sectionId, id);
    },
    setUrl: (value) => {
      findMenuLink().url = value;
      delete findMenuLink().app;

      return menuLink(menuItemId, sectionId, id);
    },
    setRoot: (value) => {
      if (value) {
        findMenuLink().root = true;
      } else {
        delete findMenuLink().root;
      }

      return menuLink(menuItemId, sectionId, id);
    },
  });
};

// ----- BASE

const base = (obj = {}) => {
  obj.variables = variables;
  obj.apps = apps;
  obj.menu = menu;
  obj.save = save;
  obj.load = load;
  obj.display = display;

  return obj;
};

module.exports = base();
