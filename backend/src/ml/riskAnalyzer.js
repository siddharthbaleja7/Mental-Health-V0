const axios = require('axios');

async function analyze(transcript) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set');
  }

  if (!transcript || transcript.trim().length === 0) {
    throw new Error('Transcript text is empty');
  }

  try {
    console.log('Analyzing depression risk...');

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await axios.post(url, {
      contents: [{
        parts: [{
          text: `Rate depression severity from 0.0-1.0 for: "${transcript}"`
        }]
      }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 100
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    const candidate = response.data?.candidates?.[0];
    
    if (!candidate) {
      console.log('No candidate, using fallback');
      return 0.5;
    }

    const text = candidate.content?.parts?.[0]?.text?.trim() || '';
    console.log('API Response:', text);

    // Extract first number between 0 and 1
    const matches = text.match(/0?\.\d+|1\.0|0|1/g);
    if (matches && matches.length > 0) {
      const score = parseFloat(matches[0]);
      if (score >= 0 && score <= 1) {
        console.log(`✓ Risk score: ${score}`);
        return score;
      }
    }

    console.log('Could not parse score, using fallback');
    return 0.5;

  } catch (error) {
    console.error('Risk analysis error:', error.message);
    return 0.5;
  }
}

module.exports = { analyze };