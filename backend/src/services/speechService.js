const transcriptionService = require('./transcriptionService');
const riskAnalyzer = require('../ml/riskAnalyzer');
const User = require('../models/User');
const fs = require('fs').promises;
const path = require('path');
const audioConverter = require('../utils/audioConverter');
const { ensureDir } = require('../utils/ensureDir');

async function processSpeech(filePath, userId) {
  // Ensure the uploads directory exists
  const uploadsDir = path.join(__dirname, '../../uploads');
  await ensureDir(uploadsDir);

  try {
    // Convert audio to WAV format if needed
    const wavFilePath = await audioConverter.convertToWav(filePath);
    
    // Step 1: Transcribe audio to text using Gemini
    const transcript = await transcriptionService.transcribe(wavFilePath);
    console.log('Transcription completed:', transcript);

    // Step 2: Analyze depression risk using Gemini
    let riskScore;
    let riskError = null;
    try {
      riskScore = await riskAnalyzer.analyze(transcript);
      console.log('Risk analysis completed. Score:', riskScore);
    } catch (error) {
      console.error('Risk analysis failed:', error.message);
      riskError = error.message;
    }

    // Step 3: Save results to user profile
    const assessment = {
      transcript,
      riskScore: riskError ? null : riskScore,
      riskError,
      date: new Date(),
    };

    await User.findByIdAndUpdate(userId, {
      $push: { assessments: assessment }
    });

    // Step 4: Clean up the uploaded files
    try {
      // Delete both original and converted files if they exist
      if (filePath !== wavFilePath) {
        await fs.unlink(path.resolve(filePath));
        await fs.unlink(path.resolve(wavFilePath));
      } else {
        await fs.unlink(path.resolve(filePath));
      }
    } catch (err) {
      console.warn('Failed to delete uploaded file:', err);
    }

    return {
      transcript,
      riskScore: riskError ? null : riskScore,
      riskError,
      message: riskError ? null : getRiskMessage(riskScore)
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
