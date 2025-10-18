// File: backend/src/routes/speechRoutes.js

const express = require('express');
const multer = require('multer');
const path = require('path');
const speechService = require('../services/speechService');
const auth = require('../middleware/auth');
const { ensureDir } = require('../utils/ensureDir');

const router = express.Router();
const uploadsDir = path.join(__dirname, '../../uploads');

// Ensure uploads directory exists
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await ensureDir(uploadsDir);
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname.replace(/[^a-zA-Z0-9]/g, '') + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

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
