// File: backend/src/routes/speechRoutes.js

const express = require('express');
const multer = require('multer');
const speechService = require('../services/speechService');
const auth = require('../middleware/auth');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post(
  '/analyze',
  auth,
  upload.single('audio'),
  async (req, res) => {
    try {
      const result = await speechService.processSpeech(req.file.path, req.user.id);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error processing speech' });
    }
  }
);

module.exports = router;
