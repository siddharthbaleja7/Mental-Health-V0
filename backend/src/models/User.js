// File: backend/src/models/User.js

const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  transcript: String,
  riskScore: Number,
  date: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  assessments: [assessmentSchema],
});

module.exports = mongoose.model('User', userSchema);
