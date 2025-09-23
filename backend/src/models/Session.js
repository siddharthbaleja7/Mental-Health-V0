// File: backend/src/models/Session.js

const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  date: { type: Date, default: Date.now },
  notes: String,
  riskScore: Number,
});

module.exports = mongoose.model('Session', sessionSchema);
