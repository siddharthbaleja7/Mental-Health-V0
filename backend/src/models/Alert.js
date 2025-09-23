// File: backend/src/models/Alert.js

const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  message: { type: String, required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Alert', alertSchema);
