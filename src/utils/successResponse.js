/**
 * Standard Success Response function to send formatted JSON data
 */
const logger = require('./logger');

const successResponse = (res, message = 'Success', data = {}, statusCode = 200) => {
    try {
        logger.info(`Sending success response: ${message}`);
        return res.status(statusCode).json({
            success: true,
            message,
            data,
        });
    } catch (error) {
        logger.error(`Error in successResponse: ${error.message}`);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

module.exports = successResponse;
