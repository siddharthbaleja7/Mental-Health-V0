const speech = require('@google-cloud/speech');
const fs = require('fs');

const client = new speech.SpeechClient();

async function transcribe(filePath) {
  const file = fs.readFileSync(filePath);
  const audioBytes = file.toString('base64');

  const audio = {
    content: audioBytes,
  };

  const config = {
    encoding: 'LINEAR16',
    languageCode: 'en-US',
  };

  const request = {
    audio,
    config,
  };

  const [response] = await client.recognize(request);
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');

  return transcription;
}

module.exports = { transcribe };
