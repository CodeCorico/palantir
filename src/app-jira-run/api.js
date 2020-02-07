const { app } = require('../config');
const createJiraClientExtended = require('../jira/jira-connector-extended.js');

const pullSprints = async (jiraClient, boardId, sprints = []) => {
  const result = await jiraClient.board.getAllSprints({ boardId, startAt: sprints.length });
  const allSprints = sprints.concat(result.values);

  return result.isLast
    ? allSprints
    : await pullSprints(jiraClient, boardId, allSprints);
};

const pullSprintsReports = async (jiraClient, boardId, sprints, reports = []) => {
  const report = await jiraClient.rapid.getSprintReport({
    rapidViewId: boardId,
    sprintId: sprints[reports.length].id,
  });

  const { contents } = report;

  const reportFormatted = {
    id: report.sprint.id,
    name: report.sprint.name,
    state: report.sprint.state.toLowerCase(),
    estimate: {
      todo: 0,
      doing: 0,
      done: contents.completedIssuesEstimateSum.value,
    },
  };

  contents.issuesNotCompletedInCurrentSprint.forEach((issue) => {
    if (!issue.estimateStatistic) {
      return;
    }

    reportFormatted.estimate[issue.status.statusCategory.key === 'new' ? 'todo' : 'doing'] +=
      issue.estimateStatistic.statFieldValue.value || 0;
  });

  const allReports = reports.concat([reportFormatted]);

  return sprints.length === allReports.length
    ? allReports
    : await pullSprintsReports(jiraClient, boardId, sprints, allReports);
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

  const { host, email, token } = appConfig.secrets;
  const { sprints, velocity } = appConfig.config;

  const result = {
    velocity: {
      sprint: 0,
      weekly: 0,
    },
    sprints: [],
    activeSprint: null,
  };

  const jiraClient = createJiraClientExtended({
    host: host,
    basic_auth: {
      email: email,
      api_token: token,
    },
  });

  // Sprints

  const sprintsNameFilterRe = sprints.nameFilter ? new RegExp(sprints.nameFilter, 'i') : null;
  const allSprints = (await pullSprints(jiraClient, sprints.boardId))
    .filter((sprint) => {
      if (sprint.state.toLowerCase() === 'future') {
        return false;
      }

      return sprintsNameFilterRe ? !!sprint.name.match(sprintsNameFilterRe) : true;
    })

  result.sprints = await pullSprintsReports(
    jiraClient,
    sprints.boardId,
    allSprints.slice(Math.max(allSprints.length - sprints.max, 0)));

  // Active sprint

  const activeSprints = result.sprints.filter(sprint => sprint.state === 'active');
  result.activeSprint = activeSprints.length ? activeSprints[0] : null;

  // Velocity

  const velocityFilteredSprints = result.sprints.filter(sprint => sprint.state !== 'active');

  const velocitySprintsRealCount = Math.max(
    velocityFilteredSprints.length - velocity.sprintsCount, 0);

  const velocitySelectedSprints = velocityFilteredSprints.slice(velocitySprintsRealCount);

  result.velocity.sprint = Math.round(velocitySelectedSprints
    .map(sprint => sprint.estimate.done)
    .reduce((accumulator, currentValue) => accumulator + currentValue)
    / velocitySelectedSprints.length);

  result.velocity.weekly = result.velocity.sprint / sprints.weeks;

  res.json(result);
};

module.exports = callback;


module.exports = [{ path: 'jira-run', method: 'GET', callback }];
