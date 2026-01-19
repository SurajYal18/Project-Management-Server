const rateLimit = require('express-rate-limit');
const errorResponse = require('../utils/errorResponse');

class RateLimiter {
    constructor() {
        this.apiLimiter = this.createApiLimiter();
        this.authLimiter = this.createAuthLimiter();
    }

    // Create general API rate limiter (100 requests per 15 minutes)
    createApiLimiter() {
        return rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 100,
            standardHeaders: true,
            legacyHeaders: false,
            handler: (req, res) => {
                return errorResponse(res, 'Too many requests, please try again later', 429);
            }
        });
    }

    // Create auth endpoints rate limiter (5 requests per 15 minutes)
    createAuthLimiter() {
        return rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 5,
            standardHeaders: true,
            legacyHeaders: false,
            handler: (req, res) => {
                return errorResponse(res, 'Too many authentication attempts, please try again later', 429);
            }
        });
    }

    // Get API rate limiter
    getApiLimiter() {
        return this.apiLimiter;
    }

    // Get auth rate limiter
    getAuthLimiter() {
        return this.authLimiter;
    }
}


const rateLimiter = new RateLimiter();

module.exports = {
    apiLimiter: rateLimiter.getApiLimiter(),
    authLimiter: rateLimiter.getAuthLimiter()
};
