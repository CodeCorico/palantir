const { app } = require('../config');
const { createJiraClientExtended, extactGoal } = require('../services/jira');

const pullEpicsReports = async (jiraClient, boardId, epics, reports = []) => {
  const epic = epics[reports.length];
  const report = await jiraClient.rapid.getEpicReport({
    boardId,
    epicKey: epic.key,
  });

  const { contents } = report;

  const backlog = contents.incompletedIssuesEstimateSum.value;
  const done = contents.completedIssuesEstimateSum.value;
  const estimateTotal = backlog + done;

  const reportFormatted = {
    id: report.epic.id,
    key: report.epic.key,
    name: report.epic.summary,
    estimate: {
      total: estimateTotal,
      backlog,
      backlogPercent: Math.round(backlog * 100 / estimateTotal),
      done,
      donePercent: Math.round(done * 100 / estimateTotal),
      unestimatedPercent: 0,
    },
  };

  const issuesEstimatedTotal = contents.completedIssues.length
    + contents.incompleteEstimatedIssues.length
    + contents.incompleteUnestimatedIssues.length;

  reportFormatted.estimate.unestimatedPercent =
    Math.round(contents.incompleteUnestimatedIssues.length * 100 / issuesEstimatedTotal) || 0;

  const allReports = await reports.concat([reportFormatted]);

  return epics.length === allReports.length
    ? allReports
    : await pullEpicsReports(jiraClient, boardId, epics, allReports);
};

const pullSprints = async (jiraClient, boardId, nameFilter, max) =>
  (await jiraClient.board.getAllSprintsFull({ boardId }))
    .reduce((prevSprints, sprint) => {
      if (sprint.state === 'closed' || (max && prevSprints.length === max)) {
        return prevSprints;
      }

      if (nameFilter && !sprint.name.match(new RegExp(nameFilter, 'i'))) {
        return prevSprints;
      }

      return prevSprints.concat({
        ...sprint,
        goalExtracted: extactGoal(sprint),
      });
    }, []);

const pullIssuesFromSprints = async (jiraClient, boardId, sprints, newSprints = []) => {
  const { id } = sprints[newSprints.length];
  const { issues } = await jiraClient.board.getIssuesForSprint({ boardId, sprintId: id });

  const sprintsWithIssues = newSprints.concat([{
    ...sprints[newSprints.length],
    estimate: {
      total: 0,
    },
    issues,
  }]);

  return sprintsWithIssues.length === sprints.length
    ? sprintsWithIssues
    : await pullIssuesFromSprints(jiraClient, boardId, sprints, sprintsWithIssues);
};

const mergeSprintsInEpics = async (sprints, epics, pointsCustomField) => {
  const epicsTable = epics.reduce((table, epic) => {
    const newEpic = { ...epic, sprints: [] };

    return {
      epics: table.epics.concat([newEpic]),
      refs: { ...table.refs, [epic.id]: newEpic },
    };
  }, {
    epics: [],
    refs: {},
  });

  sprints.forEach((sprint, sprintIndex) => {
    epicsTable.epics.forEach((epic) => {
      epic.sprints.push({ title: sprint.name, value: 0 });
    });

    sprint.issues.forEach((issue) => {
      const points = issue.fields[pointsCustomField] || 0;
      sprint.estimate.total += points;

      if (issue.fields.epic && epicsTable.refs[issue.fields.epic.id]) {
        const epicRef = epicsTable.refs[issue.fields.epic.id];

        epicRef.sprints[sprintIndex].value += points;

        if (issue.fields.status.statusCategory.key !== 'done') {
          epicRef.estimate.backlog -= points;
          epicRef.estimate.backlogPercent =
            Math.round(epicRef.estimate.backlog * 100 / epicRef.estimate.total);
        }
      }
    });

    let startAt = 0;

    epicsTable.epics.forEach((epic) => {
      const epicSprint = epic.sprints[sprintIndex];

      if (epicSprint.value) {
        epicSprint.startAt = startAt;
        epicSprint.percent = Math.round(epicSprint.value * 100 / sprint.estimate.total);
        startAt += epicSprint.percent;
      }
    });
  });

  return { epics: epicsTable.epics, sprints };
};

const createResult = () => ({
  events: [],
  sprints: [],
  epics: [],
});

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
  const { epics, sprints, issues } = appConfig.config;
  const { boardId, nameFilter, max } = sprints;
  const { pointsCustomField } = issues;

  const jiraClient = createJiraClientExtended({
    host: host,
    basic_auth: {
      email: email,
      api_token: token,
    },
  });

  const result = createResult();

  // Epics

  const filter = await jiraClient.filter.getFilter({ filterId: epics.filterId });
  const search = await jiraClient.search.search({ jql: filter.jql });

  const allEpics = await pullEpicsReports(jiraClient, boardId, search.issues);

  // Sprints

  const allSprints = await pullSprints(jiraClient, boardId, nameFilter, max);
  const allSprintsWithIssues = await pullIssuesFromSprints(jiraClient, boardId, allSprints);

  const merged = await mergeSprintsInEpics(allSprintsWithIssues, allEpics, pointsCustomField);
  result.epics = merged.epics;
  result.sprintsOrig = merged.sprints;
  result.sprints = merged.sprints.map(sprint => `${sprint.name} (${sprint.estimate.total}pt)`);

  // Events

  result.events = allSprints.map(sprint => ({
    name: sprint.name,
    events: sprint.goalExtracted.events,
  }));

  res.json(result);
};

module.exports = [{ path: 'jira-roadmap', method: 'GET', callback }];
