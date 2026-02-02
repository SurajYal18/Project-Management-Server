const errorResponse = require('../../../utils/errorResponse');

// Authorization middleware
const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!req.user || (roles.length && !roles.includes(req.user.role))) {
            return errorResponse(res, 'Unauthorized access', 403);
        }
        next();
    };
};

module.exports = authorize;
