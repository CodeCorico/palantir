import axios from 'axios';

const name = 'Page';

const store = {
  namespaced: true,
  state: {
    leftSidebars: [],
    rightSidebars: [],
    leftButtons: [],
    rightButtons: [],
    versions: null,
  },
  mutations: {
    pushSidebar: (state, sidebar) => {
      const buttons = state[`${sidebar.location}Buttons`];

      for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].id === sidebar.id) {
          return;
        }
      }

      state[`${sidebar.location}Buttons`].push({
        id: sidebar.id,
        title: sidebar.title,
        icon: sidebar.icon,
        handler: sidebar.handler,
        unSelectable: sidebar.unSelectable,
        selected: false,
        hidden: false,
      });

      state[`${sidebar.location}Sidebars`].push({
        id: sidebar.id,
        component: sidebar.component,
        opened: false,
      });
    },
    sliceSidebar: (state, id) => {
      ['left', 'right'].forEach((location) => {
        state[`${location}Buttons`] = state[`${location}Buttons`]
          .filter(button => button.id !== id);

        state[`${location}Sidebars`] = state[`${location}Sidebars`]
          .filter(sidebar => sidebar.id !== id);
      });
    },
    updateButtonSelected: (state, payload) => {
      const { location } = payload;

      let isSelected = false;
      let handler = false;

      state[`${location}Buttons`].forEach((button) => {
        button.selected = button.id === payload.id ? !button.selected : false;
        if (button.selected) {
          handler = button.handler;
          isSelected = true;

          if (button.unSelectable) {
            button.selected = false;
          }
        }
      });

      state[`${location}Sidebars`].forEach((sidebar) => {
        sidebar.opened = (isSelected && sidebar.id === payload.id) || false;
      });

      if (handler) {
        handler();
      }
    },
    updateButtonDisplay: (state, visible) => {
      ['left', 'right'].forEach((location) => {
        state[`${location}Buttons`].forEach(button => (button.hidden = !visible));
      });
    },
    updateVersions: (state, data) => {
      state.versions = {
        version: data.version,
        versionLatest: data.versionLatest,
        link: data.link,
      };
    },
  },
  actions: {
    addSidebar({ commit }, sidebar) {
      commit('pushSidebar', sidebar);
    },
    removeSidebar({ commit }, id) {
      commit('sliceSidebar', id);
    },
    toggleButton({ commit }, payload) {
      commit('updateButtonSelected', payload);
    },
    hideButtons({ commit }) {
      commit('updateButtonDisplay', false);
    },
    showButtons({ commit }) {
      commit('updateButtonDisplay', true);
    },
    async version({ commit }) {
      const { data } = await axios.get('/api/version');

      commit('updateVersions', data);
    }
  },
};

export default { name, store };
