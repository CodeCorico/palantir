import axios from 'axios';
import io from 'socket.io-client';

const name = 'SpeechSynthesis';
const SPEECH_SYNTHESIS_API_URL = '/api/speech-synthesis';

let socket = null;

const store = {
  namespaced: true,
  state: {
    id: null,
    text: null,
    speech: null,
    emitter: null,
    error: null,
    channel: null,
  },
  mutations: {
    updateSpeech: (state, payload) => {
      state.id = payload.id || null;
      state.text = payload.text || null;
      state.speech = payload.speech || null;
      state.emitter = payload.emitter || null;
      state.channel = payload.channel || null;
      state.error = payload.error || null;
    },
  },
  actions: {
    async start({ commit }, task) {
      socket = socket || io.connect('/');

      const slack = task.slack || null;
      const text = slack ? slack.parameters : task.text;
      const queryParams = { text };

      const query = Object
        .keys(queryParams)
        .map(key => `${key}=${queryParams[key]}`)
        .join('&');

      const { data } = await axios.get(`${SPEECH_SYNTHESIS_API_URL}?${query}`);

      if (data.error) {
        // eslint-disable-next-line no-console
        console.error(data.error);

        if (slack) {
          socket.emit('slackMessage', [
            `*App(${name})* `,
            `<@${slack.user}>, Sorry, an error occurred.\n`,
            `*Detail: *\`${data.error.details}\``,
          ].join(''), slack.channel);
        }

        commit('updateSpeech', {
          id: task.id,
          error: data.error.details,
          emitter: slack ? slack.user : 'Palantir',
          channel: slack ? slack.channel : null,
        });

        return;
      }

      if (slack) {
        socket.emit(
          'slackMessage',
          [
            `*App(${name})*`,
            `<@${slack.user}>,`,
            'The message has been retrieved by Palantir and will be played.'
          ].join(' '),
          slack.channel
        );
      }

      commit('updateSpeech', {
        id: task.id,
        text,
        speech: data.audioContent.data,
        emitter: slack ? slack.user : 'Palantir',
        channel: slack ? slack.channel : null,
      });
    },
  },
};

export default { name, store };
