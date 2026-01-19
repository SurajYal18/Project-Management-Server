// Import logger utility
const logger = require('./logger');

// Success response handler class
class SuccessResponseHandler {
    // Send formatted success response
    send(res, message = 'Success', data = {}, statusCode = 200) {
        try {
            // Log success message
            logger.info(`Sending success response: ${message}`);
            // Send JSON success response
            return res.status(statusCode).json({
                success: true,
                message,
                data,
            });
        } catch (error) {
            // Log and handle errors
            logger.error(`Error in successResponse: ${error.message}`);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
}

// Create singleton instance
const successResponseHandler = new SuccessResponseHandler();

// Export bound handler method
module.exports = successResponseHandler.send.bind(successResponseHandler);
