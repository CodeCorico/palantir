import axios from 'axios';

const name = 'GithubPulls';

const GITHUB_PULLS_API_URL = '/api/github-pulls';

const sortByDate = (arr) => arr.sort((a, b) => {
  const status = a.createdAt > b.createdAt ? 1 : 0;
  return status || (a.createdAt < b.createdAt ? -1 : 0);
});

const presetIndex = (patterns, input) => {
  for (let i = 0; i < patterns.length; i += 1) {
    if (patterns[i] instanceof RegExp && input.match(patterns[i])) {
      return i + 1;
    }
  }
  return 0;
};

const stringToRegExp = (patternObj) => {
  if (patternObj instanceof RegExp || patternObj === '*') {
    return patternObj;
  }
  let modifier = 'gi'; let
    pattern;
  if (Array.isArray(patternObj)) {
    if (patternObj.length === 1) {
      [pattern] = patternObj;
    } else if (patternObj.length === 2) {
      [pattern, modifier] = patternObj;
    } else {
      throw Error('Accept only two-d array with [pattern, modifier].');
    }
  } else if (typeof patternObj === 'string') {
    pattern = patternObj;
  } else {
    throw Error(`Unsupported RegEx declaration, must be String | Array, got ${typeof patternObj}`);
  }
  try {
    return new RegExp(pattern, modifier);
  } catch (err) {
    throw Error(`Accept only '*' or valid RegExp declaration, [pattern: ${
      pattern}, modifier: ${modifier}]`);
  }
};

const regexSort = (list, patternsRaw, key = (item) => item) => {
  const patterns = patternsRaw.map((pattern) => stringToRegExp(pattern));
  const defaultIndex = patterns.indexOf('*') > -1 ? patterns.indexOf('*') : Infinity;

  return list
    .map((input, oldIndex) => ({
      input,
      oldIndex,
      index: presetIndex(patterns, key(input)),
    }))
    .sort((a, b) => a.index - b.index || b.oldIndex)
    .map((item, oldIndex) => ({
      ...item,
      oldIndex,
      index: item.index === 0 ? defaultIndex + 1 : item.index,
    }))
    .sort((a, b) => a.index - b.index || b.oldIndex)
    .map((c) => c.input);
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

      pulls.forEach((pullRaw) => {
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

        let type = pullDateDiff >= alertDays ? 'alert' : '';
        type = type || (pullDateDiff >= warningDays ? 'warning' : '');

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

        // If original status (oldMergeableState) is clean
        // or pending and becomes dirty (mergeableState)
        if (!changes.unclean) {
          changes.unclean = (oldMergeableState === 'clean' || oldMergeableState === 'pending')
            && mergeableState !== 'clean'
            && mergeableState !== 'pending';
        }

        newCachePulls[pullRaw.id].mergeableState = mergeableState;

        const cachePull = newCachePulls[pullRaw.id];

        groups[title].pulls.push({
          key: `${pullRaw.palantirScope}-${pullRaw.number}`,
          id: pullRaw.id,
          number: pullRaw.number,
          createdAt,
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
              spaceIndex: Math.floor(Math.random() * (10 + 1)),
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

      Object.keys(groups).forEach((key) => sortByDate(groups[key].pulls));

      state.lastTaskId = taskId;
      state.changes = Object.keys(changes).filter((key) => changes[key]);
      state.cachePulls = newCachePulls;
      state.groups = Object.keys(groups).map((title) => groups[title]);

      sortByDate(state.groups);
      state.groups = regexSort(state.groups, order, (item) => item.title);
    },
  },
  actions: {
    async reload({ commit }, task) {
      const { order = [] } = task.config;
      const { data } = await axios.get(`${GITHUB_PULLS_API_URL}?appId=${task.appId}`);

      if (data.error) {
        // eslint-disable-next-line no-console
        console.error(data.error);

        return;
      }

      commit('mutatePulls', { taskId: task.id, pulls: data.pulls, order });
    },
    clear({ commit }) {
      commit('clear');
    },
  },
};

export default { name, store };
