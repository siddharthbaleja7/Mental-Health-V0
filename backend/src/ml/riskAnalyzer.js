const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

async function analyze(transcript) {
  try {
    const response = await axios.post(process.env.ML_API_URL, {
      text: transcript,
    });

    return response.data.riskScore;
  } catch (error) {
    console.error('Error analyzing risk:', error);
    throw error;
  }
}

module.exports = { analyze };
