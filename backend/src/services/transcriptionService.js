const fs = require('fs');
const path = require('path');
const axios = require('axios');
let googleClient;

// Lazy-require Google Speech client only when needed (avoids forcing credentials for other providers)
function getGoogleClient() {
  if (!googleClient) {
    try {
      const speech = require('@google-cloud/speech');
      googleClient = new speech.SpeechClient();
    } catch (err) {
      // If the package isn't installed or cannot be initialized, surface a clear error later
      googleClient = null;
    }
  }
  return googleClient;
}

/**
 * Contract:
 * - Input: filePath (string) - absolute/relative path to audio file
 * - Output: transcription (string) on success
 * - Errors: throws on missing file, provider misconfiguration, or upstream failures
 *
 * Providers supported:
 * - gemini: sends base64 audio to GEMINI_API_URL with Bearer GEMINI_API_KEY and expects { text | transcript }
 * - google (default): uses @google-cloud/speech.SpeechClient
 */
async function transcribe(filePath) {
  if (!filePath) throw new Error('filePath is required');

  if (!fs.existsSync(filePath)) {
    throw new Error(`audio file not found: ${filePath}`);
  }

  const provider = (process.env.TRANSCRIPTION_PROVIDER || 'google').toLowerCase();

  if (provider === 'gemini') {
    // Gemini provider: send base64 audio in JSON payload to configurable endpoint
    const url = process.env.GEMINI_API_URL;
    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_TOKEN;

    if (!url) throw new Error('GEMINI_API_URL is not set for gemini provider');
    if (!apiKey) {
      // allow calling without a key for local dev/test endpoints
      console.warn('GEMINI_API_KEY not set; attempting unauthenticated request to GEMINI_API_URL');
    }

    const file = fs.readFileSync(filePath);
    const audioBase64 = file.toString('base64');

    const filename = path.basename(filePath);

    // Build request body - keep it generic so it can be adapted to different Gemini endpoints
    const body = {
      filename,
      audio: audioBase64,
      // hint for provider about the content type if available
      content_type: 'audio/wav',
    };

    const headers = {
      'Content-Type': 'application/json',
    };
    if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;

    try {
      const resp = await axios.post(url, body, { headers, timeout: 120000 });

      // Try several likely response shapes. Keep robust for integrations that return { text } or { transcript }
      const data = resp.data || {};
      const transcript = data.text || data.transcript || data.result || data.output;

      if (typeof transcript === 'string' && transcript.trim().length > 0) return transcript.trim();

      // If the response contains nested structures, attempt to extract plausible transcript strings
      if (Array.isArray(data.results)) {
        return data.results.map(r => r.text || r.transcript).filter(Boolean).join('\n');
      }

      throw new Error('Gemini provider returned an unexpected response shape: ' + JSON.stringify(data).slice(0, 500));
    } catch (err) {
      // Normalize error message
      const msg = err && err.response && err.response.data ? JSON.stringify(err.response.data) : err.message;
      throw new Error(`Gemini transcription failed: ${msg}`);
    }
  }

  // Default: use Google Cloud Speech
  const client = getGoogleClient();
  if (!client) throw new Error('Google Speech client not available - install @google-cloud/speech or set TRANSCRIPTION_PROVIDER=gemini');

  const file = fs.readFileSync(filePath);
  const audioBytes = file.toString('base64');

  const audio = { content: audioBytes };
  const config = { encoding: 'LINEAR16', languageCode: 'en-US' };
  const request = { audio, config };

  const [response] = await client.recognize(request);
  const transcription = (response.results || [])
    .map(result => (result.alternatives && result.alternatives[0] && result.alternatives[0].transcript) || '')
    .filter(Boolean)
    .join('\n');

  return transcription;
}

module.exports = { transcribe };