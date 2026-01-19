const User = require('../models/user');
const logger = require('../../../utils/logger');

// Auth manager class for database operations
class AuthManager {
    // Find user by email address
    async findUserByEmail(email_id) {
        try {
            return await User.findOne({ where: { email_id } });
        } catch (error) {
            logger.error(`Error finding user by email: ${error.message}`);
            throw error;
        }
    }

    // Find user by username
    async findUserByUsername(user_name) {
        try {
            return await User.findOne({ where: { user_name } });
        } catch (error) {
            logger.error(`Error finding user by username: ${error.message}`);
            throw error;
        }
    }

    // Create new user in database
    async createUser(userData) {
        try {
            const newUser = await User.create(userData);
            return newUser;
        } catch (error) {
            logger.error(`Error creating user: ${error.message}`);
            throw error;
        }
    }
}

module.exports = new AuthManager();
