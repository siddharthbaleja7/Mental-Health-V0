// File: backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

const speechRoutes = require('./src/routes/speechRoutes');
const authRoutes = require('./src/routes/authRoutes');
const logger = require('./src/utils/logger');
const crisisHandler = require('./src/middleware/crisis');
const db = require('./src/config/database');

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(logger);

app.use('/api/speech', speechRoutes);
app.use('/api/auth', authRoutes);

app.use(crisisHandler);

const PORT = process.env.PORT || 5000;

db.connect()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });
