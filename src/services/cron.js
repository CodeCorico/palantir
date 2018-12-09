import store from '@/services/store';

const tasks = {};

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

const trigger = (task) => {
  store.dispatch(task.dispatch, task);
};

const clearTaskLoop = task => clearInterval(task.timeout);

const intervalLoop = (task) => {
  task.timeout = setTimeout(() => {
    clearTaskLoop(task);
    trigger(task);

    intervalLoop(task);
  }, task.every * 1000);
};

const dailyLoop = (task) => {
  const date = new Date();
  const nextDate = new Date();

  const [hours, minutes] = task.time.split(':');

  if (hours < date.getHours() || (hours == date.getHours() && minutes <= date.getMinutes())) {
    nextDate.setDate(date.getDate() + 1);
  }

  nextDate.setHours(parseInt(hours, 10));
  nextDate.setMinutes(parseInt(minutes));
  nextDate.setSeconds(0);

  const timeLeft = nextDate.getTime() - date.getTime();

  task.timeout = setTimeout(() => {
    clearTaskLoop(task);
    trigger(task);

    dailyLoop(task);
  }, timeLeft);
};

class Cron {
  register(task) {
    tasks[task.id] = task;

    prepareAndStart(task);
  }

  unregister(id) {
    clearTaskLoop(tasks[id]);

    delete tasks[id];
  }

  update(task) {
    tasks[task.id] = task;

    prepareAndStart(task);
  }
}

const cron = new Cron();

export default cron;
