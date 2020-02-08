const goalResult = () => ({
  date: null,
  workdays: 0,
  events: [],
});

const GoalFunctor = (goal, lines = [], result = goalResult()) => ({
  result,
  splitInLines: () => GoalFunctor(goal, goal.split('\n'), result),
  map: fns => GoalFunctor(goal, lines, Object.keys(fns).reduce((prev, resultKey) => ({
    ...prev,
    [resultKey]: fns[resultKey](lines, resultKey, prev),
  }), { ...result })),
});

const goalDate = (lines, key, result) => lines.reduce((prev, line) => {
  const match = line.trim().match(/^\[(.*?)-(.*?)\]$/);

  return match ? [match[1], match[2]] : prev;
}, result[key]);

const goalWorkdays = (lines, key, result) => lines.reduce((prev, line) => {
  const match = line.trim().match(/^=(.*?)$/);

  return match && !isNaN(match[1]) ? Number(match[1]) : prev;
}, result[key]);

const goalEvents = (lines, key, result) => result[key];

const extactGoal = sprint => GoalFunctor(sprint.goal || '')
  .splitInLines()
  .map({
    date: goalDate,
    workdays: goalWorkdays,
    events: goalEvents,
  })
  .result;

module.exports = { extactGoal };
