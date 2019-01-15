import axios from 'axios';

const name = 'Habitica';

const store = {
  namespaced: true,
  state: {
    css: null,
    js: null,
    quest: null,
    members: [],
  },
  mutations: {
    clear(state) {
      state.css = null;
      state.js = null;
      state.quest = null;
      state.members = [];
    },
    updateQuest: (state, { quest, members, css, js }) => {
      if (!quest) {
        state.members = [];
        state.quest = null;

        return;
      }

      state.css = css;
      state.js = js;

      let pending = 0;

      state.members = members.map((member) => {
        pending += member.party.quest.progress.up;

        return {
          id: member.id,
          items: member.items,
          stats: member.stats,
          preferences: member.preferences,
          username: member.profile.name,
          mount: member.items.currentMount,
          pet: member.items.currentPet,
          pendingAttack: member.party.quest.progress.up,
          hp: member.stats.hp,
          hpMax: member.stats.maxHealth,
          level: member.stats.lvl,
        };
      });

      state.quest = {
        key: quest.key,
        hp: quest.progress.hp,
        hpMax: quest.progress.hpMax,
        pending,
      };
    },
  },
  actions: {
    async reload({ commit, state }, payload) {
      const { config } = payload;

      const axiosInstance = axios.create({
        headers: {
          'x-api-user': config['api-user'],
          'x-api-key': config['api-key'],
        },
      });

      const party = await axiosInstance.get('https://habitica.com/api/v4/groups/party');
      const partyData = party && party.data && party.data.data || null;

      let quest = null;
      let members = null;

      if (partyData && partyData.quest && partyData.quest.active) {
        quest = partyData.quest;

        members = await axiosInstance.get(
          `https://habitica.com/api/v4/groups/${config.group}/members?includeAllPublicFields=true`
        );

        members = members.data.data;
      }

      let css = null;
      let js = null;

      if (quest && (!state.css || !state.js)) {
        const page = await axiosInstance.get('https://habitica.com');

        if (!state.css) {
          const url = page.data.match(/<link\s+href="?(\/static\/css\/app\..*?.css)/i);

          if (url) {
            css = `https://habitica.com${url[1]}`;

            const { data } = await axiosInstance.get(css);
            const indexTrash = data.indexOf('.Pet {');

            css = data
              .substr(indexTrash, data.length - indexTrash)
              .trim()
              .replace(/\[data-v-\w+\]/gi, '[data-app-habitica]')
              .replace(/url\((.*?)\);/gi, 'url(https://habitica.com$1);');
          }
        }

        if (!state.js) {
          const url = page.data.match(/<script\s+type="?text\/javascript"?\s+src="?(\/static\/js\/app\..*?.js)/i);

          if (url) {
            js = `https://habitica.com${url[1]}`;

            const { data } = await axiosInstance.get(js);
            const hp = data.match(new RegExp(`${quest.key}:{.*?boss:{.*?hp:(.*?),`, 'i'));

            if (hp) {
              quest.progress.hpMax = parseFloat(hp[1]);
            }
          }
        }
      }

      commit('updateQuest', { quest, members, css, js });
    },
    clear({ commit }) {
      commit('clear');
    },
  },
};

export default { name, store };
