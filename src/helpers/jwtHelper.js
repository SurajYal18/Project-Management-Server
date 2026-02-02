
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

// JWT helper class for token generation and verification
class JwtHelper {
    constructor() {
       
        this.JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';
        this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
        this.REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your_refresh_secret_key';
        this.REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
    }

    // Generate access token with payload
    generateToken(payload) {
        try {
            return jwt.sign(payload, this.JWT_SECRET, { expiresIn: this.JWT_EXPIRES_IN });
        } catch (error) {
            logger.error(`Error generating token: ${error.message}`);
            throw error;
        }
    }

    // Generate refresh token with payload
    generateRefreshToken(payload) {
        try {
            return jwt.sign(payload, this.REFRESH_TOKEN_SECRET, { expiresIn: this.REFRESH_TOKEN_EXPIRES_IN });
        } catch (error) {
            logger.error(`Error generating refresh token: ${error.message}`);
            throw error;
        }
    }

    // Verify and decode access token
    verifyToken(token) {
        try {
            return jwt.verify(token, this.JWT_SECRET);
        } catch (error) {
            logger.error(`Error verifying token: ${error.message}`);
            throw new Error('Invalid or expired token');
        }
    }

    // Verify and decode refresh token
    verifyRefreshToken(token) {
        try {
            return jwt.verify(token, this.REFRESH_TOKEN_SECRET);
        } catch (error) {
            logger.error(`Error verifying refresh token: ${error.message}`);
            throw new Error('Invalid or expired refresh token');
        }
    }
}


const jwtHelper = new JwtHelper();

module.exports = {
    generateToken: jwtHelper.generateToken.bind(jwtHelper),
    generateRefreshToken: jwtHelper.generateRefreshToken.bind(jwtHelper),
    verifyToken: jwtHelper.verifyToken.bind(jwtHelper),
    verifyRefreshToken: jwtHelper.verifyRefreshToken.bind(jwtHelper)
};
