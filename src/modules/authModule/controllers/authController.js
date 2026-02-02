const authService = require('../services/authService');
const {
    validateRegister,
    validateLogin,
    validateForgotPassword,
    validateVerifyOTP,
    validateResetPassword,
    validateRefreshToken
} = require('../validators/authValidator');
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

    // Handle forgot password - send OTP to email
    async forgotPassword(req, res) {
        try {
            // Validate forgot password input
            const { error, value } = validateForgotPassword(req.body);
            if (error) {
                const errorMessage = error.details.map((detail) => detail.message).join(', ');
                return errorResponse(res, errorMessage, 400);
            }

            // Generate and send OTP
            const result = await authService.forgotPassword(value.email_id);
            return successResponse(res, result.message, {}, 200);
        } catch (error) {
            logger.error(`Forgot password error: ${error.message}`);
            // Don't reveal if user exists for security
            if (error.message === 'User not found with this email') {
                return errorResponse(res, 'If this email exists, an OTP has been sent', 200);
            }
            return errorResponse(res, 'Failed to process request', 500, error.message);
        }
    }

    // Handle OTP verification
    async verifyOTP(req, res) {
        try {
            // Validate OTP input
            const { error, value } = validateVerifyOTP(req.body);
            if (error) {
                const errorMessage = error.details.map((detail) => detail.message).join(', ');
                return errorResponse(res, errorMessage, 400);
            }

            // Verify OTP
            const result = await authService.verifyOTP(value.email_id, value.otp);
            return successResponse(res, result.message, { userId: result.userId }, 200);
        } catch (error) {
            logger.error(`Verify OTP error: ${error.message}`);
            // Handle specific OTP errors
            if (error.message === 'Invalid OTP' || error.message === 'OTP has expired') {
                return errorResponse(res, error.message, 400);
            }
            if (error.message === 'No OTP found. Please request a new one') {
                return errorResponse(res, error.message, 400);
            }
            return errorResponse(res, 'Failed to verify OTP', 500, error.message);
        }
    }

    // Handle password reset
    async resetPassword(req, res) {
        try {
            // Validate reset password input
            const { error, value } = validateResetPassword(req.body);
            if (error) {
                const errorMessage = error.details.map((detail) => detail.message).join(', ');
                return errorResponse(res, errorMessage, 400);
            }

            // Reset password
            const result = await authService.resetPassword(
                value.email_id,
                value.otp,
                value.new_password
            );
            return successResponse(res, result.message, {}, 200);
        } catch (error) {
            logger.error(`Reset password error: ${error.message}`);
            // Handle OTP verification errors
            if (error.message === 'Invalid OTP' || error.message === 'OTP has expired') {
                return errorResponse(res, error.message, 400);
            }
            if (error.message === 'No OTP found. Please request a new one') {
                return errorResponse(res, error.message, 400);
            }
            return errorResponse(res, 'Failed to reset password', 500, error.message);
        }
    }

    // Handle refresh token to get new access token
    async refreshToken(req, res) {
        try {
            // Validate refresh token input
            const { error, value } = validateRefreshToken(req.body);
            if (error) {
                const errorMessage = error.details.map((detail) => detail.message).join(', ');
                return errorResponse(res, errorMessage, 400);
            }

            // Generate new access token
            const result = await authService.refreshAccessToken(value.refresh_token);
            return successResponse(res, 'Access token refreshed successfully', result, 200);
        } catch (error) {
            logger.error(`Refresh token error: ${error.message}`);
            // Handle token errors
            if (error.message === 'Invalid or expired refresh token' ||
                error.message === 'Refresh token not found or has been revoked') {
                return errorResponse(res, error.message, 401);
            }
            return errorResponse(res, 'Failed to refresh token', 500, error.message);
        }
    }
}


const authController = new AuthController();

module.exports = {
    register: authController.register.bind(authController),
    login: authController.login.bind(authController),
    logout: authController.logout.bind(authController),
    getCurrentUser: authController.getCurrentUser.bind(authController),
    forgotPassword: authController.forgotPassword.bind(authController),
    verifyOTP: authController.verifyOTP.bind(authController),
    resetPassword: authController.resetPassword.bind(authController),
    refreshToken: authController.refreshToken.bind(authController)
};
