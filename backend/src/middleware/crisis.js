// File: backend/src/middleware/crisis.js

function crisisHandler(req, res, next) {
  if (req.body && req.body.riskScore >= 80) {
    return res.status(200).json({
      message: 'High risk detected! Please contact a crisis helpline immediately.',
    });
  }
  next();
}

module.exports = crisisHandler;
