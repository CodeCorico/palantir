// [{
//   "title": "Refresh pull-requests",
//   "description": "Check for new content in %s",
//   "type": "interval",
//   "every": 4,
//   "immediate": true,
//   "trigger": "reload"
// }, {
//   "title": "Daily Virage",
//   "description": "Start the daily randomizer each day at 10h",
//   "type": "daily",
//   "time": "10:00",
//   "trigger": "start"
// }]

// setTimeout(() => {
//   store.dispatch(task.dispatch, task);
// }, 2000);

import store from '@/services/store';

const tasks = {};

const prepareAndStart = (task) => {
  if (task.disabled) {
    return;
  }

  if (task.immediate) {
    trigger(task);
  }
};

const trigger = (task) => {
  store.dispatch(task.dispatch, task);
};

class Cron {
  register(task) {
    tasks[task.id] = task;

    prepareAndStart(task);
  }

  unregister(id) {
    delete tasks[id];
  }

  update(task) {
    tasks[task.id] = task;

    prepareAndStart(task);
  }
}

const cron = new Cron();

export default cron;
