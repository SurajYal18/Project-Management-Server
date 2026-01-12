/**
 * Standard Error Response function to send formatted JSON error responses
 */
const logger = require('./logger');

const errorResponse = (res, message = 'Internal Server Error', statusCode = 500, error = {}) => {
    try {
        logger.error(`Sending error response: ${message}`);
        return res.status(statusCode).json({
            success: false,
            message,
            error,
        });
    } catch (err) {
        console.error('Critical Error in errorResponse:', err);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

module.exports = errorResponse;
