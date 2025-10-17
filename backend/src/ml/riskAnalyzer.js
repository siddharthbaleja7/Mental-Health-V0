const axios = require('axios');

async function analyze(transcript) {
  if (!transcript || transcript.trim().length === 0) {
    throw new Error('Transcript text is empty');
  }

  try {
    console.log('Analyzing depression risk...');

    // Call the ML model API endpoint (running in Docker)
    const response = await axios.post('http://localhost:5001/analyze', {
      text: transcript
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    if (!response.data) {
      throw new Error('No response received from ML model');
    }

    console.log('ML Model Response:', response.data);

    // Convert the confidence score to a risk score between 0 and 1
    const riskScore = response.data.prediction === "Depression" ? response.data.confidence : 1 - response.data.confidence;
    console.log(`✓ Risk score: ${riskScore}`);
    return riskScore;

  } catch (error) {
    console.error('Risk analysis error:', error.message);
    throw error;
  }
}

module.exports = { analyze };