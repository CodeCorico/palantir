import axios from 'axios';

const name = 'Trello';

const TRELLO_API_URL = '/api/trello';

const store = {
  namespaced: true,
  state: {
    cards: [],
  },
  mutations: {
    clear(state) {
      state.cards = [];
    },
    mutateCards: (state, cards) => {
      state.cards = cards;
    },
  },
  actions: {
    async reload({ commit }, task) {
      const key = task.config['api-key'];
      const token = task.config['api-token'];
      const { board, list } = task.config;
      const queryParams = { key, token, board, list };

      const query = Object
        .keys(queryParams)
        .map(key => `${key}=${queryParams[key]}`)
        .join('&');

      const { data } = await axios.get(`${TRELLO_API_URL}?${query}`);

      if (data.error) {
        // eslint-disable-next-line no-console
        console.error(data.error);

        return;
      }

      let avatars = null;
      if (task.config.avatars) {
        avatars = {};
        Object.keys(task.config.avatars).forEach((key) => {
          avatars[key.toLowerCase()] = task.config.avatars[key];
        });
      }

      commit('mutateCards', data.cards.map((card) => {
        if (avatars) {
          (card.members || []).forEach((member) => {
            member.avatarUrlLocal = avatars[member.fullName.toLowerCase()] || null;
          });
        }

        return card;
      }));
    },
    clear({ commit }) {
      commit('clear');
    },
  },
};

export default { name, store };
