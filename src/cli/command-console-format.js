/* eslint-disable no-console */
const clc = require('cli-color');

const date = () => {
  const d = new Date();
  let hours = d.getHours();
  let minutes = d.getMinutes();
  let seconds = d.getSeconds();

  hours = hours > 9 ? hours : `0${hours}`;
  minutes = minutes > 9 ? minutes : `0${minutes}`;
  seconds = seconds > 9 ? seconds : `0${seconds}`;

  return `[${hours}:${minutes}:${seconds}]`;
};

const log = (...args) => console.log(...args);
const logDate = (message) => log(`${clc.greenBright(date())} ${message || ''}`);
const logSuccess = (message) => log(`${clc.greenBright(date())} ${clc.greenBright(message || '')}`);
const logWarning = (message) => log(`${clc.greenBright(date())} ${clc.yellowBright(message || '')}`);
const logError = (message) => log(`${clc.greenBright(date())} ${clc.redBright(message || '')}`);

const banner = (title, useProcessTitle) => {
  process.title = useProcessTitle ? title : process.title;

  console.log(`${clc.redBright('┌────────────────────────┐')}
${clc.redBright('│        Palantir        │')}
${clc.redBright('└────────────────────────┘')}${title ? `\n  ${title}` : ''}

`);
};

module.exports = {
  date, log, logDate, logSuccess, logWarning, logError, banner,
};
