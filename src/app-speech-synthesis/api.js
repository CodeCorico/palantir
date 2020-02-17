// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');
const { Language } = require('node-nlp');

const callback = async (req, res) => {
  const { text = null } = req.query;

  if (typeof text !== 'string' && !text) {
    res.json({ error: 'The "text" parameter is missing or is an invalid string' });

    return;
  }

  const language = new Language();

  // Creates a client
  const client = new textToSpeech.TextToSpeechClient();

  const languages = {
    default: 'fr-FR',
    fr: Math.random() > 0.5 ? 'fr-FR' : 'fr-CA',
    en: Math.random() > 0.5 ? 'en-GB' : 'en-US',
  };
  const guess = language.guess(text, ['fr', 'en'], 1);
  const languageCode = languages[guess[0].alpha2] || languages.default;

  const ssmlGender = Math.random() > 0.5 ? 'FEMALE' : 'MALE';

  // Construct the request
  const request = {
    input: { text },
    // Select the language and SSML Voice Gender (optional)
    voice: { languageCode, ssmlGender },
    // Select the type of audio encoding
    audioConfig: { audioEncoding: 'MP3' },
  };

  // Performs the Text-to-Speech request
  try {
    const [response] = await client.synthesizeSpeech(request);
    res.json({ audioContent: response.audioContent });
  } catch (error) {
    res.json({ error });
  }
};
const routes = [{ path: 'speech-synthesis', method: 'GET', callback }];

module.exports = routes;
