const express = require('express');
const router = express.Router();
const healthRoutes = require('./health');
const authRoutes = require('../modules/authModule/routes/authRoutes');

router.use('/health', healthRoutes);
// Register authentication routes
router.use('/auth', authRoutes);

module.exports = router;
