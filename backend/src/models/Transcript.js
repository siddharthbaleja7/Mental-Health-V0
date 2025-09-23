// File: backend/src/models/Transcript.js

const mongoose = require('mongoose');

const transcriptSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transcript', transcriptSchema);
