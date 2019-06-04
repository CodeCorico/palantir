#! /usr/bin/env node

process.argv[1] = 'palantir';

const path = require('path');
const glob = require('glob');
const yargs = require('yargs');
const clc = require('cli-color');

require('dotenv').config({
  path: path.resolve(__dirname, '../../.env'),
});

const commandFiles = glob.sync(path.resolve(__dirname, 'src/*/command.js'));

yargs.usage('palantir <cmd> [args]');

commandFiles.forEach((commandFile) => {
  const command = require(commandFile);

  yargs.command(command);
});

yargs
  .demandCommand(1, clc.yellowBright('Please specify a command'))
  .help()
  .wrap(yargs.terminalWidth())
  .locale('en')
  .wrap(130)
  .argv;
