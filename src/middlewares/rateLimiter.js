
const rateLimit = require('express-rate-limit');
const errorResponse = require('../utils/errorResponse');

// General API rate limit: 100 requests per 15 minutes
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        return errorResponse(res, 'Too many requests, please try again later', 429);
    }
});

// Auth endpoints rate limit: 5 requests per 15 minutes 
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        return errorResponse(res, 'Too many authentication attempts, please try again later', 429);
    }
});

module.exports = { apiLimiter, authLimiter };
