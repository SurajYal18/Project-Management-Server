const User = require('../models/user');
const logger = require('../../../utils/logger');

class AuthManager {
    async findUserByEmail(email_id) {
        try {
            return await User.findOne({ where: { email_id } });
        } catch (error) {
            logger.error(`Error finding user by email: ${error.message}`);
            throw error;
        }
    }

    async findUserByUsername(user_name) {
        try {
            return await User.findOne({ where: { user_name } });
        } catch (error) {
            logger.error(`Error finding user by username: ${error.message}`);
            throw error;
        }
    }

    async createUser(userData) {
        try {
            const newUser = await User.create(userData);
            return newUser;
        } catch (error) {
            logger.error(`Error creating user: ${error.message}`);
            throw error;
        }
    }

    async findUserById(userId) {
        try {
            return await User.findByPk(userId);
        } catch (error) {
            logger.error(`Error finding user by ID: ${error.message}`);
            throw error;
        }
    }

    async findUserByIdentifier(identifier) {
        try {
            const { Op } = require('sequelize');
            return await User.findOne({
                where: {
                    [Op.or]: [{ email_id: identifier }, { user_name: identifier }]
                }
            });
        } catch (error) {
            logger.error(`Error finding user by identifier: ${error.message}`);
            throw error;
        }
    }

    async updateLastLogin(userId) {
        try {
            await User.update(
                { last_login: new Date() },
                { where: { user_id: userId } }
            );
        } catch (error) {
            logger.error(`Error updating last login: ${error.message}`);
            throw error;
        }
    }
}

module.exports = new AuthManager();
