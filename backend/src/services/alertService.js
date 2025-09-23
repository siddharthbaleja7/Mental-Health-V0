// File: backend/src/services/alertService.js

const Alert = require('../models/Alert');

async function createAlert(studentId, message) {
  const alert = new Alert({ student: studentId, message });
  await alert.save();
  return alert;
}

async function getAlerts() {
  return await Alert.find().populate('student');
}

module.exports = { createAlert, getAlerts };
