const path = require('path');
const fs = require('fs');

const palantirFile = (file) => path.resolve(file || process.env.PALANTIR_FILE);

const load = (file, removeSecrets = false) => {
  const filePath = palantirFile(file);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const config = JSON.parse(fs
    .readFileSync(filePath, 'utf8')
    .replace(/#{(.*?)}/g, (match, key) => process.env[key] || ''));

  if (removeSecrets && config.apps) {
    Object.keys(config.apps).forEach((appId) => {
      delete config.apps[appId].secrets;
    });
  }

  return config;
};

const app = (id, file, removeSecrets) => {
  const config = load(file, removeSecrets);
  let appConfig = null;

  Object.keys(config.apps || {}).every((appId) => {
    appConfig = appId === id ? config.apps[appId] : appConfig;

    return !appConfig;
  });

  return appConfig;
};

module.exports = {
  palantirFile,
  load,
  app,
};
