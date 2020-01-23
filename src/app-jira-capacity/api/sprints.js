const createJiraClientExtended = require('./jira-connector-extended.js');

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
  const {
    jiraHost,
    jiraEmail,
    jiraToken,
    velocitySprintsCount,
    sprintsBoardId,
    sprintsNameFilter,
    sprintsMax,
    sprintsWeeks,
  } = req.query;

  if (!jiraHost || !jiraEmail || !jiraToken) {
    res.json({ error: 'The "jira" parameters are missing' });

    return;
  }

  const result = {
    velocity: {
      sprint: 0,
      weekly: 0,
    },
    sprints: [],
    activeSprint: null,
  };

  const jiraClient = createJiraClientExtended({
    host: jiraHost,
    basic_auth: {
      email: jiraEmail,
      api_token: jiraToken,
    },
  });

  // Sprints

  const sprintsNameFilterRe = sprintsNameFilter ? new RegExp(sprintsNameFilter, 'i') : null;
  const allSprints = (await pullSprints(jiraClient, sprintsBoardId))
    .filter((sprint) => {
      if (sprint.state.toLowerCase() === 'future') {
        return false;
      }

      return sprintsNameFilterRe ? !!sprint.name.match(sprintsNameFilterRe) : true;
    })

  const sprints = allSprints.slice(Math.max(allSprints.length - sprintsMax, 0));

  result.sprints = await pullSprintsReports(jiraClient, sprintsBoardId, sprints);

  // Active sprint

  const activeSprints = result.sprints.filter(sprint => sprint.state === 'active');
  result.activeSprint = activeSprints.length ? activeSprints[0] : null;

  // Velocity

  const velocityFilteredSprints = result.sprints.filter(sprint => sprint.state !== 'active');

  const velocitySprintsRealCount = Math.max(
    velocityFilteredSprints.length - velocitySprintsCount, 0);

  const velocitySelectedSprints = velocityFilteredSprints.slice(velocitySprintsRealCount);

  result.velocity.sprint = Math.round(velocitySelectedSprints
    .map(sprint => sprint.estimate.done)
    .reduce((accumulator, currentValue) => accumulator + currentValue)
    / velocitySelectedSprints.length);

  result.velocity.weekly = result.velocity.sprint / sprintsWeeks;

  res.json(result);
};

module.exports = callback;
