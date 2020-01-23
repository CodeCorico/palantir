const createJiraClientExtended = require('./jira-connector-extended.js');

const pullEpicsReports = async (jiraClient, boardId, epics, reports = []) => {
  const report = await jiraClient.rapid.getEpicReport({
    rapidViewId: boardId,
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
  const {
    jiraHost,
    jiraEmail,
    jiraToken,
    sprintsBoardId,
    epicsFilterId,
  } = req.query;

  if (!jiraHost || !jiraEmail || !jiraToken) {
    res.json({ error: 'The "jira" parameters are missing' });

    return;
  }

  const result = { epics: [] };

  const jiraClient = createJiraClientExtended({
    host: jiraHost,
    basic_auth: {
      email: jiraEmail,
      api_token: jiraToken,
    },
  });

  const filter = await jiraClient.filter.getFilter({ filterId: epicsFilterId });
  const search = await jiraClient.search.search({ jql: filter.jql });

  result.epics = await pullEpicsReports(
    jiraClient,
    sprintsBoardId,
    search.issues,
  );

  res.json(result);
};

module.exports = callback;
