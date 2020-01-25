
const path = require('path');
const fs = require('fs');

const palantirFile = file => path.resolve(file || process.env.PALANTIR_FILE);

const load = (file) => {
  const filePath = palantirFile(file);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  return JSON.parse(fs
    .readFileSync(filePath, 'utf8')
    .replace(/#{(.*?)}/g, (match, key) => process.env[key] || ''));
};

module.exports = {
  load,
  palantirFile,
};
