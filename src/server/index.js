require('dotenv').config();

const path = require('path');
const fs = require('fs');
const glob = require('glob');
const axios = require('axios');
const express = require('express');
const app = express();
const port = process.env.SERVER_PORT || 80;

const statics = process.env.SERVER_STATICS || null;

const PROJECT_URL = 'https://hub.docker.com/r/codecorico/palantir/tags';
const PACKAGE_URL = 'https://raw.githubusercontent.com/CodeCorico/palantir/master/package.json';

const resolve = file => path.join(__dirname, '../../', file);

const version = () => JSON.parse(fs.readFileSync(resolve('package.json'), 'utf8')).version;

if (statics) {
  app.use(express.static(statics));
}
app.use(express.static(resolve('dist')));

glob.sync(resolve('src/*/api.js')).forEach((file) => {
  const routes = require(file);

  routes.forEach((route) => {
    app[route.method.toLowerCase()](`/api/${route.path}`, route.callback);
  });
});

app.get('/api/version', async (req, res) => {
  const { data } = await axios.get(PACKAGE_URL);

  res.json({
    version: version(),
    versionLatest: data.version,
    link: PROJECT_URL,
  });
});

app.use((req, res) => {
  if (req.accepts('html')) {
    res.sendFile(resolve('dist/index.html'));
  } else if (req.accepts('json')) {
    res.status(404).send({ error: 'Not found' });
  } else {
    res.status(404).type('txt').send('Not found');
  }
});

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Server started on :${port}`));
