// File: backend/src/models/Student.js

const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  email: { type: String, required: true, unique: true },
  sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Session' }],
});

module.exports = mongoose.model('Student', studentSchema);
