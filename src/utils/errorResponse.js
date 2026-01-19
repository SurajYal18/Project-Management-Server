// Import logger utility
const logger = require('./logger');

// Error response handler class
class ErrorResponseHandler {
    // Send formatted error response
    send(res, message = 'Internal Server Error', statusCode = 500, error = {}) {
        try {
            // Log error message
            logger.error(`Sending error response: ${message}`);
            // Send JSON error response
            return res.status(statusCode).json({
                success: false,
                message,
                error,
            });
        } catch (err) {
            // Fallback error handling
            console.error('Critical Error in errorResponse:', err);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
}

// Create singleton instance
const errorResponseHandler = new ErrorResponseHandler();

// Export bound handler method
module.exports = errorResponseHandler.send.bind(errorResponseHandler);
