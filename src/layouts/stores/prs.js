import github from '@/services/github';

const name = 'Prs';

const REPOS = {};

Object.keys(process.env).forEach((key) => {
  if (key.match(/^VUE_APP_REPO_/)) {
    REPOS[key.replace('VUE_APP_REPO_', '')] = process.env[key];
  }
});

const fetchRepo = async (key, repo) => {
  const { data } = await github.get(`repos/${repo}/pulls`);

  data.palantirScope = key;

  return data;
};

const fetchPull = async (pullSummary) => {
  const { data } = await github.get(pullSummary.url);

  data.palantirScope = pullSummary.palantirScope;

  return data;
};

const store = {
  namespaced: true,
  state: {
    groups: [],
  },
  mutations: {
    mutatePulls: (state, { pulls }) => {
      const groups = {};

      pulls.forEach(prRaw => {
        const { title } = prRaw;

        groups[title] = groups[title] || {
          id: title,
          title,
          prs: [],
        };

        const prDateDiff = new Date().getTime() - new Date(prRaw.created_at).getTime();
        const warningDays = 4 * (3600 * 24) * 1000; // 4d
        const alertDays = 7 * (3600 * 24) * 1000; // 7d

        const type = prDateDiff >= alertDays
          ? 'alert'
          : (prDateDiff >= warningDays ? 'warning' : '');

        groups[title].prs.push({
          id: prRaw.number,
          url: prRaw.html_url,
          scope: prRaw.palantirScope,
          authorImg: prRaw.user.avatar_url,
          type,
          lines: [prRaw.additions, prRaw.deletions, Math.max(0, 500 - (prRaw.additions + prRaw.deletions))],
          commits: prRaw.commits,
          reviewers: (prRaw.assignees || []).map(assignee => ({
            id: assignee.id,
            url: assignee.html_url,
            spaceIndex: 3,
            name: assignee.login,
            img: assignee.avatar_url,
          })),
        });
      });

      state.groups = groups;
    },
    mutatePullsError: (state, { err }) => {
      state.groups = [];

      // eslint-disable-next-line no-console
      console.warn(err);
    },
  },
  actions: {
    async loadGroups({ commit }) {
      const pullsSubArrays = await Promise.all(
        Object.keys(REPOS).map(key => fetchRepo(key, REPOS[key]))
      );

      const pullsSummary = [];

      pullsSubArrays.forEach((pullsSubArray) => {
        pullsSubArray.forEach((pull) => {
          pullsSummary.push({
            url: pull.url,
            palantirScope: pullsSubArray.palantirScope,
          })
        });
      });

      const pulls = await Promise.all(
        pullsSummary.map(pullSummary => fetchPull(pullSummary))
      );

      commit('mutatePulls', { pulls });
    },
  },
};

export default { name, store };
