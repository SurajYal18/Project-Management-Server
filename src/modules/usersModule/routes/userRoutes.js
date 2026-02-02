const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../../authModule/middlewares/authMiddleware');
const authorize = require('../middlewares/authorizationMiddleware');

// Search users by name, email, or username
router.get('/search', authenticate, userController.searchUsers);

// Get all users (Admin only)
router.get('/', authenticate, authorize(['admin']), userController.getUsers);

// Get user by ID
router.get('/:id', authenticate, userController.getUserById);

// Update user profile
router.put('/:id', authenticate, userController.updateUser);

// Change password
router.put('/:id/change-password', authenticate, userController.changePassword);

// Delete user (Admin only)
router.delete('/:id', authenticate, authorize(['admin']), userController.deleteUser);

module.exports = router;
