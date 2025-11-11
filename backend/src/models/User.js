const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  transcript: { type: String },
  riskScore: { type: Number },
  prediction: { type: String }, // <-- ADDED
  riskError: { type: String },
  date: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: { // <-- ADDED
    type: String,
    enum: ['student', 'teacher'],
    default: 'student',
  },
  assessments: [assessmentSchema],
});

module.exports = mongoose.model('User', userSchema);