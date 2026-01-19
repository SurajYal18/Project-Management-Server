const errorResponse = require('../utils/errorResponse');
const logger = require('../utils/logger');

class NotFoundHandler {
    handle(req, res, next) {
        try {
            logger.warn(`404 Not Found: ${req.originalUrl}`);
            return errorResponse(res, `Not Found - ${req.originalUrl}`, 404);
        } catch (err) {
            logger.error(`Error in notFound middleware: ${err.message}`);
            next(err);
        }
    }
}

const notFoundHandler = new NotFoundHandler();

module.exports = notFoundHandler.handle.bind(notFoundHandler);
