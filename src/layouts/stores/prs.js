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
    cachePrs: {},
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

        const createdAt = new Date(prRaw.created_at).getTime();
        groups[title].createdAt = groups[title].createdAt
          ? Math.min(groups[title].createdAt, createdAt)
          : createdAt;

        const prDateDiff = new Date().getTime() - createdAt;
        const warningDays = 4 * (3600 * 24) * 1000; // 4d
        const alertDays = 7 * (3600 * 24) * 1000; // 7d

        const type = prDateDiff >= alertDays
          ? 'alert'
          : (prDateDiff >= warningDays ? 'warning' : '');

        state.cachePrs[prRaw.id] = state.cachePrs[prRaw.id] || {
          animationDelay: Math.round(Math.random() * 2000),
          animationDuration: Math.floor(Math.random() * (5001 - 2000)) + 2000,
          reviewers: {},
        };

        const cachePr = state.cachePrs[prRaw.id];

        groups[title].prs.push({
          id: prRaw.id,
          number: prRaw.number,
          url: prRaw.html_url,
          scope: prRaw.palantirScope,
          authorImg: prRaw.user.avatar_url,
          type,
          lines: [
            prRaw.additions,
            prRaw.deletions,
            Math.max(0, 500 - (prRaw.additions + prRaw.deletions)), // 500 lines is big
          ],
          commits: prRaw.commits,
          animationDelay: cachePr.animationDelay,
          animationDuration: cachePr.animationDuration,
          reviewers: (prRaw.assignees || []).map((assignee) => {
            cachePr.reviewers[assignee.id] = cachePr.reviewers[assignee.id] || {
              spaceIndex:Math.floor(Math.random() * (10 + 1))
            };

            const cacheReviwer = cachePr.reviewers[assignee.id];

            return {
              id: assignee.id,
              url: assignee.html_url,
              spaceIndex: cacheReviwer.spaceIndex,
              name: assignee.login,
              img: assignee.avatar_url,
            };
          }),
        });
      });

      state.groups = Object.keys(groups)
        .map(title => groups[title])
        .sort((a, b) => {
          return a.createdAt < b.createdAt
            ? -1
            : a.createdAt > b.createdAt
            ? 1
            : 0;
        });
    },
    mutatePullsError: (state, { err }) => {
      state.groups = [];

      // eslint-disable-next-line no-console
      console.warn(err);
    },
  },
  actions: {
    async loadGroups({ commit }) {
      // eslint-disable-next-line no-console
      console.log('reload');

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
