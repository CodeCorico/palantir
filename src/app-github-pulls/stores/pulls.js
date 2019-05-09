import github from '../github';

const name = 'GithubPulls';

const fetchRepo = async (key, repo) => {
  const { data } = await github.get(`repos/${repo}/pulls`);

  data.palantirScope = key;

  return data;
};

const fetchPull = async (pullSummary) => {
  const pull = await github.get(pullSummary.url);
  const data = Object.assign({}, pull.data);

  const reviews = await github.get(`${pullSummary.url}/reviews`);
  data.pReviews = reviews.data;

  if (data.statuses_url) {
    const status = await github.get(data.statuses_url);
    data.pStatus = status.data;
  }

  data.palantirScope = pullSummary.palantirScope;

  return data;
};

const sortByDate = arr =>
  arr.sort((a, b) => a.createdAt < b.createdAt ? -1 : (a.createdAt > b.createdAt ? 1 : 0));

const regexSort = (list, patterns) => {
  if (patterns.some(pattern => !(pattern === '*' || pattern instanceof RegExp))) {
    throw Error('Accept only \'*\' or RegExp.');
  }
  const presetIndex = (input) => {
    for (var i = 0; i < patterns.length; ++i) {
      if (patterns[i] instanceof RegExp && patterns[i].test(input)) {
        return i + 1;
      }
    }
    return 0;
  }

  let indexes = list.map(c => ({
    input: c,
    index: presetIndex(c.text)
  }));

  indexes.sort((a, b) => a.index < b.index ? -1 : 1);

  const defaultIndex = patterns.includes('*') ? patterns.indexOf('*') : Infinity;

  indexes = indexes.map(a => a.index === 0 ? {
    ...a,
    index: defaultIndex + 1,
  } : a).sort(
    (a, b) => a.index < b.index ? -1 : 1
  );

  return indexes.map(c => c.input);
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
    mutatePulls: (state, { taskId, pulls, order }) => {
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

        let mergeableState = 'clean';

        // C.I. check
        if (pullRaw.pStatus && pullRaw.pStatus.length) {
          if (pullRaw.pStatus[0].state === 'error') {
            mergeableState = 'unstable';
          } else if (pullRaw.pStatus[0].state === 'pending') {
            mergeableState = 'pending';
          }
        }

        // Review changes requests check
        if (mergeableState === 'clean' && pullRaw.pReviews && pullRaw.pReviews.length) {
          const requests = {};

          pullRaw.pReviews.forEach((review) => {
            if (review.state === 'CHANGES_REQUESTED') {
              requests[review.user.id] = true;
            } else if (review.state === 'APPROVED') {
              delete requests[review.user.id];
            }
          });

          if (Object.keys(requests).length > 0) {
            mergeableState = 'comments';
          }
        }

        // Github mergeable state
        if (mergeableState === 'clean') {
          mergeableState = pullRaw.mergeable_state;
        }

        const oldMergeableState = newCachePulls[pullRaw.id].mergeableState;

        if (!changes.unclean) {
          changes.unclean = oldMergeableState === 'clean' && mergeableState !== 'clean';
        }

        newCachePulls[pullRaw.id].mergeableState = mergeableState;

        const cachePull = newCachePulls[pullRaw.id];

        groups[title].pulls.push({
          id: pullRaw.id,
          number: pullRaw.number,
          createdAt: createdAt,
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
              spaceIndex: Math.floor(Math.random() * (10 + 1))
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

      Object.keys(groups).forEach(key => sortByDate(groups[key].pulls));

      state.lastTaskId = taskId;
      state.changes = Object.keys(changes).filter(key => changes[key]);
      state.cachePulls = newCachePulls;
      state.groups = Object.keys(groups).map(title => groups[title]);

      sortByDate(state.groups);
      regexSort(state.groups, order.map(value => new RegExp(value)));
    },
  },
  actions: {
    async reload({ commit }, task) {
      const { token = '', repositories = [], order = [] } = task.config;

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

      commit('mutatePulls', { taskId: task.id, pulls, order });
    },
    clear({ commit }) {
      commit('clear');
    },
  },
};

export default { name, store };
