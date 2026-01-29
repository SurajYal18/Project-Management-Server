const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../../authModule/middlewares/authMiddleware');
const authorize = require('../middlewares/authorizationMiddleware');

// Get all users (Admin only)
router.get('/', authenticate, authorize(['admin']), userController.getUsers);

module.exports = router;
