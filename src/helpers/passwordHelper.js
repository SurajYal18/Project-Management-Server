const bcrypt = require('bcrypt');
const logger = require('../utils/logger');

// Password helper class for hashing and comparing passwords
class PasswordHelper {
    constructor() {
        this.SALT_ROUNDS = 10;
    }

    // Hash plain text password
    async hashPassword(password) {
        try {
            const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
            return await bcrypt.hash(password, salt);
        } catch (error) {
            logger.error(`Error hashing password: ${error.message}`);
            throw error;
        }
    }

    // Compare plain password with hashed password
    async comparePassword(plainPassword, hashedPassword) {
        try {
            return await bcrypt.compare(plainPassword, hashedPassword);
        } catch (error) {
            logger.error(`Error comparing passwords: ${error.message}`);
            throw error;
        }
    }
}


const passwordHelper = new PasswordHelper();

module.exports = {
    hashPassword: passwordHelper.hashPassword.bind(passwordHelper),
    comparePassword: passwordHelper.comparePassword.bind(passwordHelper)
};
