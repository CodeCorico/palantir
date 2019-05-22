require('dotenv').config();

const path = require('path');
const fs = require('fs');
const glob = require('glob');
const axios = require('axios');
const express = require('express');
const { RTMClient } = require('@slack/rtm-api');
const socket = require('socket.io');

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

if (statics) {
  const palantirFile = JSON.parse(fs.readFileSync(`${statics}/palantir.json`, 'utf8'));
  const slackToken = palantirFile.variables['slack-token'];
  if (slackToken) {
    const rtm = new RTMClient(slackToken);

    const registerSlack = async (apps) => {
      await rtm.start();
      rtm.on('message', ({ text, user, channel }) => {
        if (text === 'palantir help') {
          rtm.sendMessage(`<@${user}>, voici les commandes disponibles: ${
            apps.map(command => `\n- \`${command}\``)
            }`, channel);
        } else if (apps.includes(text)) {
          io.emit(text);
          rtm.sendMessage('C\'est parti !!', channel);
        }
      });
    }

    const slackApps = Object
      .values(palantirFile.apps)
      .reduce((acc, { tasks }) => tasks ? [
        ...acc,
        ...tasks
          .filter(({ slackCommand }) => slackCommand)
          .map(({ slackCommand }) => slackCommand)] : acc, []);
    registerSlack(slackApps);
  }
}



// eslint-disable-next-line no-console
const server = app.listen(port, () => console.log(`Server started on :${port}`));
const io = socket(server)

