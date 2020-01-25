const { app } = require('../config');
const github = require('./github.js');

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

const callback = async (req, res) => {
  const { appId = null } = req.query;

  if (!appId) {
    res.json({ error: 'The "appId" parameter is missing' });

    return;
  }

  const appConfig = app(appId);

  if (!appConfig) {
    res.json({ error: `The app ${appId} doesn't exist` });

    return;
  }

  const { token } = appConfig.secrets;
  const { repositories = [] } = appConfig.config;

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

  res.json({ pulls });
};

const routes = [{ path: 'github-pulls', method: 'GET', callback }];

module.exports = routes;
