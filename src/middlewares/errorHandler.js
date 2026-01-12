/**
 * Global Error Handler Middleware
 * Handles all uncaught exceptions locally
 */
const errorResponse = require('../utils/errorResponse');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    try {
        logger.error(err.message);

        if (err.name === 'UnauthorizedError') {
            return errorResponse(res, 'Invalid Token', 401);
        }

        if (err.name === 'ValidationError') {
            return errorResponse(res, err.message, 400);
        }

        return errorResponse(res, err.message || 'Internal Server Error', err.status || 500);
    } catch (loggingError) {
        console.error('Error in error handler:', loggingError);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

module.exports = errorHandler;
