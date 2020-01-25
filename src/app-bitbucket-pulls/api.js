const { app } = require('../config');
const bitbucket = require('./bitbucket.js');

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

  const { username = '', password = '' } = appConfig.secrets;
  const { repositories = [] } = appConfig.config;

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

  res.json({ pulls });
};

const routes = [{ path: 'bitbucket-pulls', method: 'GET', callback }];

module.exports = routes;
