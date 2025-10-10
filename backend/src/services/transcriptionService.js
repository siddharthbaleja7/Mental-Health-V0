const fs = require('fs');
const axios = require('axios');

/**
 * Transcribe audio using Google Gemini 2.5 Flash
 */
async function transcribeWithGemini(filePath) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set');
  }

  const file = fs.readFileSync(filePath);
  const audioBase64 = file.toString('base64');

  // Use Gemini 2.5 Flash (best for audio transcription)
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const response = await axios.post(url, {
    contents: [{
      parts: [{
        text: "Transcribe this audio file accurately. Return only the transcription text without any additional commentary."
      }, {
        inlineData: {
          mimeType: "audio/wav",
          data: audioBase64
        }
      }]
    }]
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
    console.error('Unexpected API response:', JSON.stringify(response.data));
    throw new Error('Invalid response format from Gemini API');
  }

  return response.data.candidates[0].content.parts[0].text.trim();
}

/**
 * Main transcription function with fallback options
 */
async function transcribe(filePath) {
  if (!filePath) {
    throw new Error('filePath is required');
  }

  if (!fs.existsSync(filePath)) {
    throw new Error(`Audio file not found: ${filePath}`);
  }

  // Try Gemini 2.5 models in order of preference
  const models = [
    'gemini-2.5-flash',           // Best balance of speed and quality
    'gemini-2.5-pro',             // Highest quality
    'gemini-2.0-flash',           // Fallback
    'gemini-flash-latest'         // Generic latest
  ];

  let lastError;

  for (const model of models) {
    try {
      console.log(`Attempting transcription with ${model}...`);
      
      const apiKey = process.env.GEMINI_API_KEY;
      const file = fs.readFileSync(filePath);
      const audioBase64 = file.toString('base64');

      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await axios.post(url, {
        contents: [{
          parts: [{
            text: "Transcribe this audio file accurately. Return only the transcription text without any additional commentary."
          }, {
            inlineData: {
              mimeType: "audio/wav",
              data: audioBase64
            }
          }]
        }]
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 60 second timeout
      });

      if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        const transcription = response.data.candidates[0].content.parts[0].text.trim();
        console.log(`✓ Transcription successful with ${model}`);
        return transcription;
      }
    } catch (error) {
      lastError = error;
      console.log(`✗ ${model} failed: ${error.response?.data?.error?.message || error.message}`);
      continue;
    }
  }

  // If all models fail, throw the last error
  const errorMessage = lastError?.response?.data?.error?.message || lastError?.message || 'Unknown error';
  throw new Error(`Transcription failed with all models: ${errorMessage}`);
}

/**
 * List available Gemini models (for debugging)
 */
async function listGeminiModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log('GEMINI_API_KEY not set');
    return;
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const response = await axios.get(url);
    
    console.log('\n=== Available Gemini Models ===');
    response.data.models
      .filter(m => m.supportedGenerationMethods.includes('generateContent'))
      .forEach(model => {
        console.log(`\nModel: ${model.name}`);
        console.log(`  Display Name: ${model.displayName}`);
      });
    console.log('\n================================\n');
  } catch (error) {
    console.error('Error listing models:', error.response?.data || error.message);
  }
}

module.exports = { 
  transcribe, 
  transcribeWithGemini,
  listGeminiModels 
};