/**
 * Not Found Middleware
 * Handles 404 errors for undefined routes
 */
const errorResponse = require('../utils/errorResponse');
const logger = require('../utils/logger');

const notFound = (req, res, next) => {
    try {
        logger.warn(`404 Not Found: ${req.originalUrl}`);
        return errorResponse(res, `Not Found - ${req.originalUrl}`, 404);
    } catch (err) {
        logger.error(`Error in notFound middleware: ${err.message}`);
        next(err);
    }
};

module.exports = notFound;
