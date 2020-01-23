require('dotenv').config();

const path = require('path');
const fs = require('fs');
const glob = require('glob');
const axios = require('axios');
const express = require('express');
const { RTMClient } = require('@slack/rtm-api');
const { WebClient } = require('@slack/web-api');
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
  process.env.GOOGLE_APPLICATION_CREDENTIALS = palantirFile.variables['gapi-credentials-path'];

  const slackToken = palantirFile.variables['slack-token'];

  if (slackToken) {
    const rtm = new RTMClient(slackToken);
    const web = new WebClient(slackToken);

    const registerSlack = async (apps) => {
      await rtm.start();

      io.on('connection', function (socket) {
        socket.on('slackMessage', function (message, channel) {
          try {
            rtm.sendMessage(message, channel);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
          }
        });
      });

      rtm.on('message', async ({ text, user, channel }) => {
        if (!text) {
          return;
        }

        const [command, parameters] = text.split(/ (.*)/).filter(e => e.length > 1);

        if (apps.indexOf(command) === -1) {
          if (command === 'help') {
            rtm.sendMessage(`<@${user}>, here are the available commands: ${
              apps.map(command => `\n- \`${command}\``)
            }`, channel);
          }

          return;
        }

        const response = await web.users.info({ user });

        io.emit(command, {
          parameters,
          user: response.user.profile.display_name,
          channel,
        });

        rtm.sendMessage([
          'Receiving...\n',
          `command: \`${command}\`\n`,
          parameters ? `parameters: \`${parameters}\`\n` : '',
        ].join(''), channel);
      });
    }

    const slackApps = Object
      .values(palantirFile.apps)
      .reduce((acc, { tasks }) => tasks ? [
        ...acc,
        ...tasks
        .filter(({ slackCommand }) => slackCommand)
        .map(({ slackCommand }) => slackCommand)] : acc, []);

    if (slackApps.some(slackCommand => slackCommand.match(/\s/))) {
      throw Error('slackCommand should not have any whitespace.');
    }

    registerSlack(slackApps);
  }
}

// eslint-disable-next-line no-console
const server = app.listen(port, () => console.log(`Server started on http://localhost:${port}`));
const io = socket(server);
