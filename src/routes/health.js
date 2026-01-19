const express = require('express');
const router = express.Router();
const successResponse = require('../utils/successResponse');
const logger = require('../utils/logger');

router.get('/', (req, res, next) => {
    try {
        logger.info('Performing health check');
        return successResponse(res, 'Health Check Passed', {
            uptime: process.uptime(),
            timestamp: Date.now()
        });
    } catch (error) {
        logger.error(`Health check failed: ${error.message}`);
        next(error);
    }
});

module.exports = router;
