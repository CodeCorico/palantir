import github from '../github';

const name = 'GithubPulls';

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
    changes: [],
    groups: [],
    cachePulls: {},
    lastTaskId: null,
  },
  mutations: {
    clear(state) {
      state.changes = [];
      state.groups = [];
      state.cachePulls = [];
      state.lastTaskId = null;
    },
    mutatePulls: (state, { taskId, pulls }) => {
      const firstMutation = taskId !== state.lastTaskId;
      const groups = {};
      const changes = {
        init: firstMutation,
        new: false,
        unclean: false,
        merged: false,
      };
      const newCachePulls = {};

      pulls.forEach(pullRaw => {
        const { title } = pullRaw;

        groups[title] = groups[title] || {
          id: title,
          title,
          pulls: [],
        };

        const createdAt = new Date(pullRaw.created_at).getTime();
        groups[title].createdAt = groups[title].createdAt
          ? Math.min(groups[title].createdAt, createdAt)
          : createdAt;

        const pullDateDiff = new Date().getTime() - createdAt;
        const warningDays = 4 * (3600 * 24) * 1000; // 4d
        const alertDays = 7 * (3600 * 24) * 1000; // 7d

        const type = pullDateDiff >= alertDays
          ? 'alert'
          : (pullDateDiff >= warningDays ? 'warning' : '');

        if (!firstMutation && !changes.new) {
          changes.new = !state.cachePulls[pullRaw.id];
        }

        newCachePulls[pullRaw.id] = state.cachePulls[pullRaw.id] || {
          animationDelay: Math.round(Math.random() * 2000),
          animationDuration: Math.floor(Math.random() * (5001 - 2000)) + 2000,
          reviewers: {},
          mergeableState: null,
        };

        let mergeableState = pullRaw.review_comments ? 'comments' : pullRaw.mergeable_state;
        mergeableState = mergeableState === 'unknown' ? 'clean' : mergeableState;

        const oldMergeableState = newCachePulls[pullRaw.id].mergeableState;

        if (!changes.unclean) {
          changes.unclean = oldMergeableState === 'clean' && mergeableState !== 'clean';
        }

        newCachePulls[pullRaw.id].mergeableState = mergeableState;

        const cachePull = newCachePulls[pullRaw.id];

        groups[title].pulls.push({
          id: pullRaw.id,
          number: pullRaw.number,
          url: pullRaw.html_url,
          scope: pullRaw.palantirScope,
          authorImg: pullRaw.user.avatar_url,
          type,
          lines: [
            pullRaw.additions,
            pullRaw.deletions,
            // 500 lines is big
            Math.max(0, 500 - (pullRaw.additions + pullRaw.deletions)),
          ],
          commits: pullRaw.commits,
          mergeableState,
          animationDelay: cachePull.animationDelay,
          animationDuration: cachePull.animationDuration,
          reviewers: (pullRaw.assignees || []).map((assignee) => {
            cachePull.reviewers[assignee.id] = cachePull.reviewers[assignee.id] || {
              spaceIndex:Math.floor(Math.random() * (10 + 1))
            };

            const cacheReviwer = cachePull.reviewers[assignee.id];

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

      Object.keys(state.cachePulls).forEach((id) => {
        if (!newCachePulls[id]) {
          changes.merged = true;
        }
      });

      state.lastTaskId = taskId;
      state.changes = Object.keys(changes).filter(key => changes[key]);
      state.cachePulls = newCachePulls;
      state.groups = Object
        .keys(groups)
        .map(title => groups[title])
        .sort((a, b) => a.createdAt < b.createdAt ? -1 : (a.createdAt > b.createdAt ? 1 : 0));
    },
  },
  actions: {
    async reload({ commit }, task) {
      const { token = '', repositories = [] } = task.config;

      github.defaults.headers.common.Authorization = `token ${token}`;

      const pullsSubArrays = await Promise.all(
        Object.keys(repositories).map(key => fetchRepo(key, repositories[key]))
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

      commit('mutatePulls', { taskId: task.id, pulls });
    },
    clear({ commit }) {
      commit('clear');
    },
  },
};

export default { name, store };
