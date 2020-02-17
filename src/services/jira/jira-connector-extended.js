const JiraClient = require('jira-connector');
const url = require('url');

const createJiraClientExtended = (options) => {
  const jiraClient = new JiraClient(options);

  // Fix method
  jiraClient.board.getBoardByFilterId = (opts) => jiraClient.makeRequest({
    uri: jiraClient.buildAgileURL(`/board/filter/${opts.filterId}`),
    method: 'GET',
    followAllRedirects: true,
    json: true,
    qs: {
      startAt: opts.startAt,
      maxResults: opts.maxResults,
    },
  });

  // Add full recursive method
  jiraClient.board.getAllSprintsFull = async (opts, sprints = []) => {
    const { boardId } = opts;
    const result = await jiraClient.board.getAllSprints({ boardId, startAt: sprints.length });
    const allSprints = sprints.concat(result.values);

    return result.isLast ? allSprints : jiraClient.board.getAllSprintsFull(opts, allSprints);
  };

  // Add the greenhopper API

  jiraClient.greenHopperApiVersion = '1.0';

  jiraClient.buildGreenHopperURL = (path, forcedVersion) => {
    const apiBasePath = `${jiraClient.path_prefix}rest/greenhopper/`;
    const version = forcedVersion || jiraClient.greenHopperApiVersion;
    const requestUrl = url.format({
      protocol: jiraClient.protocol,
      hostname: jiraClient.host,
      port: jiraClient.port,
      pathname: apiBasePath + version + path,
    });

    return decodeURIComponent(requestUrl);
  };

  jiraClient.rapid = {};

  jiraClient.rapid.getSprintReport = (opts) => jiraClient.makeRequest({
    uri: jiraClient.buildGreenHopperURL('/rapid/charts/sprintreport'),
    method: 'GET',
    followAllRedirects: true,
    json: true,
    qs: {
      rapidViewId: opts.boardId,
      sprintId: opts.sprintId,
    },
  });

  jiraClient.rapid.getEpicReport = (opts) => jiraClient.makeRequest({
    uri: jiraClient.buildGreenHopperURL('/rapid/charts/epicreport'),
    method: 'GET',
    followAllRedirects: true,
    json: true,
    qs: {
      rapidViewId: opts.boardId,
      epicKey: opts.epicKey,
    },
  });

  return jiraClient;
};

module.exports = createJiraClientExtended;
