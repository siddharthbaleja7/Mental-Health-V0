// File: backend/src/services/speechService.js

const axios = require('axios');
const transcriptionService = require('./transcriptionService');
const riskAnalyzer = require('../ml/riskAnalyzer');
const User = require('../models/User');

async function processSpeech(filePath, userId) {
  try {
    // Step 1: Transcribe audio to text
    const transcript = await transcriptionService.transcribe(filePath);

    // Step 2: Analyze depression risk
    const riskScore = await riskAnalyzer.analyze(transcript);

    // Step 3: Save results to user profile
    await User.findByIdAndUpdate(userId, {
      $push: {
        assessments: {
          transcript,
          riskScore,
          date: new Date(),
        },
      },
    });

    return { transcript, riskScore };
  } catch (error) {
    console.error('Error in processSpeech:', error);
    throw error;
  }
}

module.exports = { processSpeech };
