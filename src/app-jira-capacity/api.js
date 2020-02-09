const { app } = require('../config');
const { createJiraClientExtended } = require('../services/jira');

const pullEpicsReports = async (jiraClient, boardId, epics, reports = []) => {
  const report = await jiraClient.rapid.getEpicReport({
    boardId,
    epicKey: epics[reports.length].key,
  });

  const { contents } = report;

  const estimateTotal = contents.completedIssuesEstimateSum.value
    + contents.incompletedIssuesEstimateSum.value;

  const reportFormatted = {
    id: report.epic.id,
    key: report.epic.key,
    name: report.epic.summary,
    estimate: {
      total: estimateTotal,
      todo: 0,
      doing: 0,
      done: contents.completedIssuesEstimateSum.value,
      unestimatedPercent: 0,
    },
  };

  contents.incompleteEstimatedIssues.forEach((issue) => {
    if (!issue.estimateStatistic) {
      return;
    }

    reportFormatted.estimate[issue.status.statusCategory.key === 'new' ? 'todo' : 'doing'] +=
      issue.estimateStatistic.statFieldValue.value || 0;
  });

  const issuesEstimatedTotal = contents.completedIssues.length
    + contents.incompleteEstimatedIssues.length
    + contents.incompleteUnestimatedIssues.length;

  reportFormatted.estimate.unestimatedPercent =
    Math.round(contents.incompleteUnestimatedIssues.length * 100 / issuesEstimatedTotal) || 0;

  const allReports = reports.concat([reportFormatted]);

  return epics.length === allReports.length
    ? allReports
    : await pullEpicsReports(jiraClient, boardId, epics, allReports);
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
  const { epics, sprints } = appConfig.config;

  const jiraClient = createJiraClientExtended({
    host: host,
    basic_auth: {
      email: email,
      api_token: token,
    },
  });

  const filter = await jiraClient.filter.getFilter({ filterId: epics.filterId });
  const search = await jiraClient.search.search({ jql: filter.jql });

  res.json({
    epics: await pullEpicsReports(jiraClient, sprints.boardId, search.issues),
  });
};

module.exports = [{ path: 'jira-capacity', method: 'GET', callback }];
