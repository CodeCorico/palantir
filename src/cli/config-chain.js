const path = require('path');
const fs = require('fs');
const { log, logError } = require('./command-console-format');
const AppsSource = require('./config-chain-apps');
const MenuSource = require('./config-chain-menu');

const error = (message) => {
  logError(message);
  throw new Error(message);
};

const palantirFilePath = (file) => path.resolve(file || process.env.PALANTIR_FILE);
const fileExists = (filePath) => fs.existsSync(filePath)
  || error(`Config "${filePath}" file doesn't exist`);

const ConfigSource = (config = {}) => ({
  load: (file) => {
    const filePath = palantirFilePath(file);

    fileExists(filePath);

    return ConfigSource(JSON.parse(fs.readFileSync(filePath, 'utf8')));
  },
  save: (file, indent = 2) => {
    fs.writeFileSync(palantirFilePath(file), JSON.stringify(config, null, indent));

    return ConfigSource(config);
  },
  reset: () => ConfigSource({}),
  toConfig: () => ({ ...config }),
  display: () => {
    log(config);

    return ConfigSource(config);
  },
  apps: AppsSource(ConfigSource, config),
  menu: MenuSource(ConfigSource, config),
});

module.exports = ConfigSource();
