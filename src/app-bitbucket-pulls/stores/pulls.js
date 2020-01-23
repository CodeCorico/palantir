import bitbucket from '../bitbucket';

const name = 'BitbucketPulls';

const fetchRepo = async (key, repo) => {
  const { data } = await bitbucket.get(`repositories/${repo}/pullrequests?q=state="OPEN"`);
  const { values } = data;

  values.palantirScope = key;

  return values;
};

const fetchPull = async (pullSummary) => {
  const pull = await bitbucket.get(pullSummary.url);
  const data = Object.assign({}, pull.data);

  const diffstat = await bitbucket.get(data.links.diffstat.href);
  data.pDiffstat = diffstat.data.values;

  data.palantirScope = pullSummary.palantirScope;

  return data;
};

const sortByDate = arr =>
  arr.sort((a, b) => a.createdAt < b.createdAt ? -1 : (a.createdAt > b.createdAt ? 1 : 0));

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

  let modifier = 'gi', pattern;

  if (Array.isArray(patternObj)) {
    if (patternObj.length === 1) {
      [pattern] = patternObj;
    }
    else if (patternObj.length === 2) {
      [pattern, modifier] = patternObj;
    }
    else {
      throw Error("Accept only two-d array with [pattern, modifier].");
    }
  }
  else if (typeof patternObj === 'string') {
    pattern = patternObj;
  }
  else {
    throw Error(`Unsupported RegEx declaration, must be String | Array, got ${typeof patternObj}`);
  }

  try {
    return new RegExp(pattern, modifier);
  }
  catch (err) {
    throw Error(
      `Accept only '*' or valid RegExp declaration, [pattern: ${pattern}, modifier: ${modifier}]`
    );
  }
};

const regexSort = (list, patternsRaw, key = item => item) => {
  const patterns = patternsRaw.map(pattern => stringToRegExp(pattern));
  const defaultIndex =
    patterns.indexOf('*') > -1 ? patterns.indexOf('*') : Infinity;

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
    .map(c => c.input);
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

        const createdAt = new Date(pullRaw.created_on).getTime();
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

        let additions = 0;
        let deletions = 0;

        let mergeableState = 'clean';

        pullRaw.pDiffstat.forEach((diff) => {
          additions += diff.lines_added;
          deletions += diff.lines_removed;

          if (diff.status === 'merge conflict') {
            mergeableState = 'dirty';
          }
        });

        // C.I. check
        // if (pullRaw.pStatus && pullRaw.pStatus.length) {
        //   if (pullRaw.pStatus[0].state === 'error') {
        //     mergeableState = 'unstable';
        //   } else if (pullRaw.pStatus[0].state === 'pending') {
        //     mergeableState = 'pending';
        //   }
        // }

        // Review changes requests check
        if (
          mergeableState === 'clean'
          && pullRaw.comment_count && pullRaw.participants && pullRaw.participants.length
        ) {
          let approved = true;

          pullRaw.participants.forEach((participant) => {
            if (participant.role !== 'REVIEWER') {
              return;
            }

            approved = participant.approved === false ? false : approved;
          });

          if (!approved) {
            mergeableState = !approved ? 'comments' : mergeableState;
          }
        }

        // Bitbucket mergeable state
        if (mergeableState === 'clean') {
          pullRaw.pDiffstat.forEach((diff) => {
            if (diff.status === 'merge conflict') {
              mergeableState = 'dirty';
            }
          });
        }

        const oldMergeableState = newCachePulls[pullRaw.id].mergeableState;

        // If original status (oldMergeableState) is clean and becomes dirty (mergeableState)
        if (!changes.unclean) {
          changes.unclean = oldMergeableState === 'clean' && mergeableState !== 'clean';
        }

        newCachePulls[pullRaw.id].mergeableState = mergeableState;

        const cachePull = newCachePulls[pullRaw.id];

        groups[title].pulls.push({
          key: `${pullRaw.palantirScope}-${pullRaw.id}`,
          id: pullRaw.id,
          number: pullRaw.id,
          createdAt,
          url: pullRaw.links.html.href,
          scope: pullRaw.palantirScope,
          authorImg: pullRaw.author.links.avatar.href,
          type,
          lines: [
            additions,
            deletions,
            // 500 lines is big
            Math.max(0, 500 - (additions + deletions)),
          ],
          commits: pullRaw.pDiffstat,
          mergeableState,
          animationDelay: cachePull.animationDelay,
          animationDuration: cachePull.animationDuration,
          reviewers: (pullRaw.reviewers || []).map((reviewer) => {
            cachePull.reviewers[reviewer.uuid] = cachePull.reviewers[reviewer.uuid] || {
              spaceIndex: Math.floor(Math.random() * (10 + 1))
            };

            const cacheReviwer = cachePull.reviewers[reviewer.uuid];

            return {
              id: reviewer.uuid,
              url: reviewer.links.html.href,
              spaceIndex: cacheReviwer.spaceIndex,
              name: reviewer.display_name,
              img: reviewer.links.avatar.href,
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
      state.groups = regexSort(state.groups, order, item => item.title);
    },
  },
  actions: {
    async reload({ commit }, task) {
      const { username = '', password = '', repositories = [], order = [] } = task.config;

      bitbucket.defaults.auth = { username, password };

      const pullsSubArrays = await Promise.all(
        Object.keys(repositories).map(key => fetchRepo(key, repositories[key]))
      );

      const pullsSummary = [];

      pullsSubArrays.forEach((pullsSubArray) => {
        pullsSubArray.forEach((pull) => {
          pullsSummary.push({
            url: pull.links.self.href,
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
