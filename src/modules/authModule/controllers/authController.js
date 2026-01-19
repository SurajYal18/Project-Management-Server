// Import required services and utilities
const authService = require('../services/authService');
const { validateRegister } = require('../validators/authValidator');
const successResponse = require('../../../utils/successResponse');
const errorResponse = require('../../../utils/errorResponse');
const logger = require('../../../utils/logger');

// Authentication controller class
class AuthController {
    // Handle user registration
    async register(req, res) {
        try {
            // Log incoming registration request
            logger.info(`Register request received`);
            logger.info(`Request body: ${JSON.stringify(req.body)}`);

            // Validate request body exists
            if (!req.body || Object.keys(req.body).length === 0) {
                logger.error('Request body is empty');
                return errorResponse(res, 'Request body is required', 400);
            }

            // Validate input data
            const { error, value } = validateRegister(req.body);

            // Handle validation errors
            if (error) {
                logger.error(`Validation error: ${error.message}`);
                const errorMessage = error.details.map((detail) => detail.message).join(', ');
                return errorResponse(res, errorMessage, 400);
            }

            logger.info(`Validation passed. Validated data: ${JSON.stringify(value)}`);

            // Check if validated value exists
            if (!value) {
                logger.error('Validated value is undefined');
                return errorResponse(res, 'Validation failed - no data', 400);
            }

            // Call registration service
            logger.info('Calling authService.registerUser...');
            const result = await authService.registerUser(value);
            logger.info('User registration successful');

            // Send success response
            return successResponse(res, 'User registered successfully', result, 201);
        } catch (error) {
            // Log registration errors
            logger.error(`Registration error: ${error.message}`);
            logger.error(`Error stack: ${error.stack}`);

            // Handle duplicate entry errors
            if (error.message === 'Email already registered' || error.message === 'Username already taken') {
                return errorResponse(res, error.message, 409);
            }
            // Handle generic errors
            return errorResponse(res, 'Registration failed', 500, error.message);
        }
    }
}

const authController = new AuthController();

module.exports = {
    register: authController.register.bind(authController)
};
