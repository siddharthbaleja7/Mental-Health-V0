const axios = require('axios');
const dotenv = require('dotenv');

// # // Load environment variables (like ML_SERVICE_URL) from your .env file
dotenv.config();

const ML_API_URL = process.env.ML_SERVICE_URL;

if (!ML_API_URL) {
  console.error("FATAL ERROR: ML_SERVICE_URL is not defined in your .env file.");
  console.log("Please add ML_SERVICE_URL=http://localhost:8080 to your .env file");
  // Stop the backend from starting if this critical variable is missing
  throw new Error("ML_SERVICE_URL not configured.");
}

/**
 * Calls the Python ML service to analyze text for depression risk.
 * @param {string} text The transcript text to analyze.
 * @returns {Promise<number>} A promise that resolves to the depression risk score (a number between 0 and 1).
 */
async function analyze(text) {
  console.log(`[ML Service] Sending text to Python API at ${ML_API_URL}...`);
  try {
    // Make a POST request to the Python server's /analyze endpoint
    const response = await axios.post(`${ML_API_URL}/analyze`, {
      text: text
    });

    // We are now expecting a response like: {"prediction": "...", "score": 0.75}
    const score = response.data.score;

    if (score === undefined) {
      console.error("[ML Service] Response did not contain a 'score' field.");
      throw new Error("Invalid response from ML service.");
    }

    // Return just the numerical score.
    // This is exactly what speechService.js expects!
    return score;

  } catch (error) {
    if (error.response) {
      // The Python server responded with an error (e.g., 400, 500)
      console.error(`[ML Service] Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      // The backend couldn't reach the Python server at all. Is it running?
      console.error(`[ML Service] Python API is not responding at ${ML_API_URL}.`);
    } else {
      // Something else went wrong
      console.error('[ML Service] Error setting up request:', error.message);
    }
    throw new Error('Failed to get analysis from ML service.');
  }
}

module.exports = { analyze };