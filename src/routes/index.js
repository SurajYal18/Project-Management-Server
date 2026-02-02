const express = require('express');
const router = express.Router();
const healthRoutes = require('./health');
const authRoutes = require('../modules/authModule/routes/authRoutes');
const userRoutes = require('../modules/usersModule/routes/userRoutes');

router.use('/health', healthRoutes);
// Register authentication routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

module.exports = router;
