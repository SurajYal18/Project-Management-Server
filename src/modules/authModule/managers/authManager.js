const User = require('../models/user');
const Otp = require('../models/Otp');
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

    // Create OTP record for password reset
    async createOTP(userId, email_id, otp_code, expires_at) {
        try {
            // Delete any existing OTPs for this user
            await Otp.destroy({ where: { user_id: userId } });

            // Create new OTP record
            const otpRecord = await Otp.create({
                user_id: userId,
                email_id,
                otp_code,
                expires_at
            });

            return otpRecord;
        } catch (error) {
            logger.error(`Error creating OTP: ${error.message}`);
            throw error;
        }
    }

    // Find OTP by email
    async findOTPByEmail(email_id) {
        try {
            return await Otp.findOne({
                where: { email_id },
                order: [['created_at', 'DESC']]
            });
        } catch (error) {
            logger.error(`Error finding OTP: ${error.message}`);
            throw error;
        }
    }

    // Delete OTP after successful verification
    async deleteOTP(otpId) {
        try {
            await Otp.destroy({ where: { otp_id: otpId } });
            logger.info(`OTP deleted successfully: ${otpId}`);
        } catch (error) {
            logger.error(`Error deleting OTP: ${error.message}`);
            throw error;
        }
    }

    // Delete all expired OTPs (cleanup task)
    async deleteExpiredOTPs() {
        try {
            const { Op } = require('sequelize');
            const deletedCount = await Otp.destroy({
                where: {
                    expires_at: {
                        [Op.lt]: new Date()
                    }
                }
            });
            logger.info(`Deleted ${deletedCount} expired OTPs`);
            return deletedCount;
        } catch (error) {
            logger.error(`Error deleting expired OTPs: ${error.message}`);
            throw error;
        }
    }

    // Update user password
    async updatePassword(userId, hashedPassword) {
        try {
            await User.update(
                { password: hashedPassword },
                { where: { user_id: userId } }
            );
        } catch (error) {
            logger.error(`Error updating password: ${error.message}`);
            throw error;
        }
    }

    // Store refresh token
    async storeRefreshToken(userId, refreshToken) {
        try {
            await User.update(
                { refresh_token: refreshToken },
                { where: { user_id: userId } }
            );
        } catch (error) {
            logger.error(`Error storing refresh token: ${error.message}`);
            throw error;
        }
    }

    // Verify refresh token
    async verifyStoredRefreshToken(userId, refreshToken) {
        try {
            const user = await User.findOne({
                where: { user_id: userId, refresh_token: refreshToken },
                attributes: ['user_id', 'user_name', 'email_id']
            });
            return user;
        } catch (error) {
            logger.error(`Error verifying stored refresh token: ${error.message}`);
            throw error;
        }
    }
}



module.exports = new AuthManager();
