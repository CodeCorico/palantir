const path = require('path');
const fs = require('fs');
const glob = require('glob');
const configChain = require(path.resolve(__dirname, '../config-chain'));
const { banner, log, logDate, logSuccess, logWarning } =
  require(path.resolve(__dirname, '../command-console-format'));

const handler = (argv) => {
  const { file } = argv;
  const fileReal = path.resolve(file);

  banner();

  logDate(`Execute "${fileReal}"`);

  if (!fs.existsSync(fileReal)) {
    logWarning('No file found\n');

    return;
  }

  const script = require(fileReal);

  script({ config: configChain, log: logDate, glob });

  logSuccess('Finished');

  log();
};

module.exports = {
  command: 'script <file>',
  desc: 'Execute a script file to configure the Palantir',
  builder: yargs => yargs
    .positional('file', {
      describe: 'NodeJS file to execute',
      type: 'string',
    }),
  handler,
};
