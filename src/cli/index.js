#! /usr/bin/env node

process.argv[1] = 'palantir';

const path = require('path');
const glob = require('glob');
const yargs = require('yargs');
const clc = require('cli-color');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

glob
  .sync(path.resolve(__dirname, 'commands/*-command.js'))
  // eslint-disable-next-line global-require, import/no-dynamic-require
  .forEach((commandFile) => yargs.command(require(commandFile)));

// eslint-disable-next-line no-unused-expressions
yargs
  .usage('palantir <cmd> [args]')
  .demandCommand(1, clc.yellowBright('Please specify a command'))
  .help()
  .wrap(yargs.terminalWidth())
  .locale('en')
  .wrap(130)
  .argv;
