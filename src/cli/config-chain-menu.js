const findIndex = (items, id) => items.reduce((value, item, i) => (item.id === id ? i : value), -1);

const LinkSource = (ConfigSource, config, menuId, menuIndex, sectionId, sectionIndex, id) => {
  const passConfig = { ...config };
  const { links } = passConfig.menu[menuIndex].sections[sectionIndex];
  const index = findIndex(links, id);

  return {
    options: (newOptions) => {
      links[index] = { id, ...newOptions };

      return LinkSource(ConfigSource, config, menuId, menuIndex, sectionId, sectionIndex, id);
    },
    tapOptions: (fn) => {
      links[index] = fn(links[index]);

      return LinkSource(ConfigSource, config, menuId, menuIndex, sectionId, sectionIndex, id);
    },
    getOptions: () => links[index],
    // eslint-disable-next-line no-use-before-define
    end: () => LinksSource(ConfigSource, config, menuId, menuIndex, sectionId, sectionIndex),
  };
};

const LinksSource = (ConfigSource, config, menuId, menuIndex, sectionId, sectionIndex) => {
  const passConfig = { ...config };
  const { links } = passConfig.menu[menuIndex].sections[sectionIndex];

  return {
    use: (id) => {
      const index = findIndex(links, id);

      links[index > -1 ? index : links.length] = index > -1 ? links[index] : { id };

      return LinkSource(ConfigSource, config, menuId, menuIndex, sectionId, sectionIndex, id);
    },
    remove: (id) => {
      passConfig.menu[menuIndex].sections[sectionIndex].links = links
        .filter((link) => link.id !== id);

      return LinksSource(ConfigSource, passConfig, menuId, menuIndex, sectionId, sectionIndex);
    },
    // eslint-disable-next-line no-use-before-define
    end: () => SectionSource(ConfigSource, passConfig, menuId, menuIndex, sectionId),
  };
};

const SectionSource = (ConfigSource, config, menuId, menuIndex, id) => {
  const passConfig = { ...config };
  const { sections } = passConfig.menu[menuIndex];
  const index = findIndex(sections, id);

  return {
    title: (newTitle) => {
      sections[index] = { ...sections[index], title: newTitle };

      return SectionSource(ConfigSource, passConfig, menuId, menuIndex, id);
    },
    tapTitle: (fn) => {
      sections[index].title = fn(sections[index].title || '');

      return SectionSource(ConfigSource, passConfig, menuId, menuIndex, id);
    },
    getTitle: () => sections
      .reduce((value, section) => (section.id === id ? section.title : value), null),
    links: LinksSource(ConfigSource, passConfig, menuId, menuIndex, id, index),
    // eslint-disable-next-line no-use-before-define
    end: () => SectionsSource(ConfigSource, passConfig, menuId, menuIndex),
  };
};

const SectionsSource = (ConfigSource, config, menuId, menuIndex) => {
  const passConfig = { ...config };
  const { sections } = passConfig.menu[menuIndex];

  return {
    use: (id) => {
      const index = findIndex(sections, id);

      sections[index > -1 ? index : sections.length] = index > -1
        ? sections[index]
        : { id, links: [] };

      return SectionSource(ConfigSource, passConfig, menuId, menuIndex, id);
    },
    remove: (id) => {
      passConfig.menu[menuIndex].sections = sections.filter((section) => section.id !== id);

      return SectionsSource(ConfigSource, passConfig, menuId, menuIndex);
    },
    // eslint-disable-next-line no-use-before-define
    end: () => MenuItemSource(ConfigSource, passConfig, menuId),
  };
};

const MenuItemSource = (ConfigSource, config, id) => {
  const passConfig = { ...config };
  const index = findIndex(passConfig.menu, id);

  return {
    title: (newTitle) => {
      passConfig.menu[index] = { ...passConfig.menu[index], title: newTitle };

      return MenuItemSource(ConfigSource, passConfig, id);
    },
    tapTitle: (fn) => {
      passConfig.menu[index].title = fn(passConfig.menu[index].title || '');

      return MenuItemSource(ConfigSource, passConfig, id, findIndex(passConfig.menu, id));
    },
    getTitle: () => passConfig.menu[index].title || '',
    sections: SectionsSource(ConfigSource, passConfig, id, index),
    // eslint-disable-next-line no-use-before-define
    end: () => MenuSource(ConfigSource, passConfig),
  };
};

const MenuSource = (ConfigSource, config = {}) => {
  const passConfig = { ...config, menu: config.menu || [] };

  return {
    use: (id) => {
      const index = findIndex(passConfig.menu, id);

      passConfig.menu[index > -1 ? index : passConfig.menu.length] = index > -1
        ? passConfig.menu[index]
        : { id, sections: [] };

      return MenuItemSource(ConfigSource, passConfig, id);
    },
    remove: (id) => MenuSource(ConfigSource, {
      ...passConfig,
      menu: passConfig.filter((menutItem) => menutItem.id !== id),
    }),
    end: () => ConfigSource(passConfig),
  };
};

module.exports = MenuSource;
