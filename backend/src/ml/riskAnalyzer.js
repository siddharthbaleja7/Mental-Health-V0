const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const ML_API_URL = process.env.ML_SERVICE_URL;

if (!ML_API_URL) {
  console.error("FATAL ERROR: ML_SERVICE_URL is not defined in your .env file.");
  throw new Error("ML_SERVICE_URL not configured.");
}

/**
 * Calls the Python ML service to analyze text for depression risk.
 * @param {string} text The transcript text to analyze.
 * @returns {Promise<object>} A promise that resolves to the full analysis object
 * (e.g., { prediction: "Depression", score: 0.75 })
 */
async function analyze(text) {
  if (!text || text.trim().length === 0) {
    console.error('[ML Service] Error: Transcript text is empty.');
    throw new Error('Transcript text is empty');
  }
  
  console.log(`[ML Service] Sending text to Python API at ${ML_API_URL}...`);
  try {
    const response = await axios.post(`${ML_API_URL}/analyze`, {
      text: text
    });

    // *** UPDATED LINE ***
    // Get the full result object
    const result = response.data;

    if (!result.score || !result.prediction) {
      console.error("[ML Service] Response did not contain 'score' or 'prediction'.");
      throw new Error("Invalid response from ML service.");
    }
    
    console.log(`[ML Service] Received result:`, result);
    return result; // <-- Return the full { prediction, score } object

  } catch (error) {
    if (error.response) {
      console.error(`[ML Service] Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      console.error(`[ML Service] Python API is not responding at ${ML_API_URL}. Is it running?`);
    } else {
      console.error('[ML Service] Error setting up request:', error.message);
    }
    throw new Error('Failed to get analysis from ML service.');
  }
}

module.exports = { analyze };