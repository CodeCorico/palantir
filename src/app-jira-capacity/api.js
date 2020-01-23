const sprintsCallback = require('./api/sprints.js');
const epicsCallback = require('./api/epics.js');

const routes = [
  { path: 'jira-capacity/sprints', method: 'GET', callback: sprintsCallback },
  { path: 'jira-capacity/epics', method: 'GET', callback: epicsCallback },
];

module.exports = routes;
