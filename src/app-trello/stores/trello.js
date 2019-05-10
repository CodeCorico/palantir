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
    mutateCards: (state, { cards }) => {
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

      commit('mutateCards', data);
    },
    clear({ commit }) {
      commit('clear');
    },
  },
};

export default { name, store };
