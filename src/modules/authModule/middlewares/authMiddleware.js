const { verifyToken } = require('../../../helpers/jwtHelper');
const errorResponse = require('../../../utils/errorResponse');
const logger = require('../../../utils/logger');

class AuthMiddleware {
    authenticate(req, res, next) {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return errorResponse(res, 'Access token required', 401);
            }

            const token = authHeader.split(' ')[1];
            const decoded = verifyToken(token);

            req.user = decoded;
            next();
        } catch (error) {
            logger.error(`Authentication error: ${error.message}`);
            return errorResponse(res, 'Invalid or expired token', 401);
        }
    }
}

const authMiddleware = new AuthMiddleware();

module.exports = {
    authenticate: authMiddleware.authenticate.bind(authMiddleware)
};
