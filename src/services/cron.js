import store from '@/services/store';

const tasks = {};
const trigger = (task) => store.dispatch(task.dispatch, task);
const clearTaskLoop = (task) => clearTimeout(task.timeout);

const intervalLoop = (task) => {
  // eslint-disable-next-line no-param-reassign
  task.timeout = setTimeout(() => {
    clearTaskLoop(task);
    trigger(task);

    intervalLoop(task);
  }, task.every * 1000);
};

const dailyLoop = (task) => {
  const date = new Date();
  const nextDate = new Date();

  const timeSplitted = task.time.split(':');
  const hours = parseInt(timeSplitted[0] || 0, 10);
  const minutes = parseInt(timeSplitted[1] || 0, 10);

  if (hours < date.getHours() || (hours === date.getHours() && minutes <= date.getMinutes())) {
    nextDate.setDate(date.getDate() + 1);
  }

  nextDate.setHours(parseInt(hours, 10));
  nextDate.setMinutes(parseInt(minutes, 10));
  nextDate.setSeconds(0);

  const timeLeft = nextDate.getTime() - date.getTime();

  // eslint-disable-next-line no-param-reassign
  task.timeout = setTimeout(() => {
    clearTaskLoop(task);
    trigger(task);

    dailyLoop(task);
  }, timeLeft);
};

const prepareAndStart = (task) => {
  clearTaskLoop(task);

  if (task.disabled) {
    return;
  }

  if (task.immediate) {
    trigger(task);
  }

  if (task.type === 'manual') {
    return;
  }

  if (task.type === 'interval') {
    intervalLoop(task);
  } else if (task.type === 'daily') {
    dailyLoop(task);
  }
};

export default {
  register: (task) => {
    tasks[task.id] = task;

    prepareAndStart(task);
  },
  unregister: (id) => {
    clearTaskLoop(tasks[id]);

    delete tasks[id];
  },
  update: (id, config) => {
    if (!tasks[id]) {
      return;
    }

    Object.assign(tasks[id], config);

    prepareAndStart(tasks[id]);
  },
};
