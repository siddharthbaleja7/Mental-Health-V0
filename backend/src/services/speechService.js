const transcriptionService = require('./transcriptionService');
const riskAnalyzer = require('../ml/riskAnalyzer');
const User = require('../models/User');
const fs = require('fs').promises;

async function processSpeech(filePath, userId) {
  try {
    // Step 1: Transcribe audio to text using Gemini
    const transcript = await transcriptionService.transcribe(filePath);
    console.log('Transcription completed:', transcript);

    // Step 2: Analyze depression risk using Gemini
    const riskScore = await riskAnalyzer.analyze(transcript);
    console.log('Risk analysis completed. Score:', riskScore);

    // Step 3: Save results to user profile
    const assessment = {
      transcript,
      riskScore,
      date: new Date(),
    };

    await User.findByIdAndUpdate(userId, {
      $push: { assessments: assessment }
    });

    // Step 4: Clean up the uploaded file
    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.warn('Failed to delete uploaded file:', err);
    }

    return {
      transcript,
      riskScore,
      message: getRiskMessage(riskScore)
    };
  } catch (error) {
    console.error('Error in processSpeech:', error);
    throw new Error('Failed to process speech analysis');
  }
}

function getRiskMessage(score) {
  if (score <= 0.3) {
    return "Low risk - Your responses suggest minimal signs of depression. However, continue monitoring your mental health and seek support if needed.";
  } else if (score <= 0.7) {
    return "Moderate risk - Some signs of depression detected. Consider talking to a mental health professional about your feelings.";
  } else {
    return "High risk - Strong indicators of depression detected. Please reach out to a mental health professional or counselor as soon as possible.";
  }
}

module.exports = { processSpeech };
