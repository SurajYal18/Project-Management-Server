const errorResponse = require('../utils/errorResponse');
const logger = require('../utils/logger');

class ErrorHandler {
    handle(err, req, res, next) {
        try {
            logger.error(err.message);

            // Handle unauthorized errors
            if (err.name === 'UnauthorizedError') {
                return errorResponse(res, 'Invalid Token', 401);
            }

            // Handle validation errors
            if (err.name === 'ValidationError') {
                return errorResponse(res, err.message, 400);
            }

            // Handle generic errors
            return errorResponse(res, err.message || 'Internal Server Error', err.status || 500);
        } catch (loggingError) {
            console.error('Error in error handler:', loggingError);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
}


const errorHandler = new ErrorHandler();


module.exports = errorHandler.handle.bind(errorHandler);
