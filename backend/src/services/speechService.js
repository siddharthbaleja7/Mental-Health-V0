const transcriptionService = require('./transcriptionService');
const riskAnalyzer = require('../ml/riskAnalyzer');
const User = require('../models/User');
const fs = require('fs').promises;
const path = require('path');
const audioConverter = require('../utils/audioConverter');
const { ensureDir } = require('../utils/ensureDir');

async function processSpeech(filePath, userId) {
  const uploadsDir = path.join(__dirname, '../../uploads');
  await ensureDir(uploadsDir);

  try {
    const wavFilePath = await audioConverter.convertToWav(filePath);
    
    const transcript = await transcriptionService.transcribe(wavFilePath);
    console.log('Transcription completed:', transcript);

    let riskResult = null;
    let riskError = null;
    try {
      // *** UPDATED LINE ***
      // riskAnalyzer now returns an object: { prediction, score }
      riskResult = await riskAnalyzer.analyze(transcript);
      console.log('Risk analysis completed. Result:', riskResult);
    } catch (error) {
      console.error('Risk analysis failed:', error.message);
      riskError = error.message;
    }

    // *** UPDATED BLOCK ***
    // Save all new fields to the database
    const assessment = {
      transcript,
      riskScore: riskResult?.score || null,
      prediction: riskResult?.prediction || null,
      riskError,
      date: new Date(),
    };
    
    await User.findByIdAndUpdate(userId, {
      $push: { assessments: assessment }
    });
    
    // ... (file cleanup logic) ...
    try {
      if (filePath !== wavFilePath) {
        await fs.unlink(path.resolve(filePath));
        await fs.unlink(path.resolve(wavFilePath));
      } else {
        await fs.unlink(path.resolve(filePath));
      }
    } catch (err) {
      console.warn('Failed to delete uploaded file:', err);
    }

    // *** UPDATED RETURN ***
    // Return all new fields to the frontend
    return {
      transcript,
      riskScore: riskResult?.score || null,
      prediction: riskResult?.prediction || null,
      riskError,
      message: riskError ? null : getRiskMessage(riskResult?.score)
    };
  } catch (error) {
    console.error('Error in processSpeech:', error);
    throw new Error('Failed to process speech analysis');
  }
}

function getRiskMessage(score) {
  if (score === null) return null;
  if (score <= 0.3) {
    return "Low risk - Your responses suggest minimal signs of depression. However, continue monitoring your mental health and seek support if needed.";
  } else if (score <= 0.7) {
    return "Moderate risk - Some signs of depression detected. Consider talking to a mental health professional about your feelings.";
  } else {
    return "High risk - Strong indicators of depression detected. Please reach out to a mental health professional or counselor as soon as possible.";
  }
}

module.exports = { processSpeech };