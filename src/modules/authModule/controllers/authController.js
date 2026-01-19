const authService = require('../services/authService');
const { validateRegister, validateLogin } = require('../validators/authValidator');
const successResponse = require('../../../utils/successResponse');
const errorResponse = require('../../../utils/errorResponse');
const logger = require('../../../utils/logger');

// Authentication controller class
class AuthController {
    // Handle user registration
    async register(req, res) {
        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                return errorResponse(res, 'Request body is required', 400);
            }

            // Validate registration input
            const { error, value } = validateRegister(req.body);
            if (error) {
                const errorMessage = error.details.map((detail) => detail.message).join(', ');
                return errorResponse(res, errorMessage, 400);
            }

            // Create new user and generate tokens
            const result = await authService.registerUser(value);
            return successResponse(res, 'User registered successfully', result, 201);
        } catch (error) {
            logger.error(`Registration error: ${error.message}`);
            // Handle duplicate user errors
            if (error.message === 'Email already registered' || error.message === 'Username already taken') {
                return errorResponse(res, error.message, 409);
            }
            return errorResponse(res, 'Registration failed', 500, error.message);
        }
    }

    async login(req, res) {
        try {
            // Validate login credentials
            const { error, value } = validateLogin(req.body);
            if (error) {
                const errorMessage = error.details.map((detail) => detail.message).join(', ');
                return errorResponse(res, errorMessage, 400);
            }

            // Authenticate user and generate tokens
            const result = await authService.loginUser(value);
            return successResponse(res, 'Login successful', result, 200);
        } catch (error) {
            logger.error(`Login error: ${error.message}`);
            // Handle authentication errors
            if (error.message === 'Invalid credentials') {
                return errorResponse(res, 'Invalid email/username or password', 401);
            }
            return errorResponse(res, 'Login failed', 500, error.message);
        }
    }

    async logout(req, res) {
        try {
            // Client-side token invalidation (server stateless)
            return successResponse(res, 'Logout successful', {}, 200);
        } catch (error) {
            logger.error(`Logout error: ${error.message}`);
            return errorResponse(res, 'Logout failed', 500, error.message);
        }
    }

    async getCurrentUser(req, res) {
        try {
            // Fetch authenticated user details
            const user = await authService.getCurrentUser(req.user.id);
            return successResponse(res, 'User retrieved successfully', { user }, 200);
        } catch (error) {
            logger.error(`Get current user error: ${error.message}`);
            return errorResponse(res, 'Failed to retrieve user', 500, error.message);
        }
    }
}

const authController = new AuthController();

module.exports = {
    register: authController.register.bind(authController),
    login: authController.login.bind(authController),
    logout: authController.logout.bind(authController),
    getCurrentUser: authController.getCurrentUser.bind(authController)
};
