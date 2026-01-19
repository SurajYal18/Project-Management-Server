const authManager = require('../managers/authManager');
const { hashPassword } = require('../../../helpers/passwordHelper');
const { generateToken, generateRefreshToken } = require('../../../helpers/jwtHelper');
const logger = require('../../../utils/logger');

// Authentication service class
class AuthService {
    // Register new user
    async registerUser(userData) {
        const { name, user_name, email_id, phone_no, password } = userData;

        // Check if email already exists
        const existingUserByEmail = await authManager.findUserByEmail(email_id);
        if (existingUserByEmail) {
            throw new Error('Email already registered');
        }

        // Check if username already exists
        const existingUserByUsername = await authManager.findUserByUsername(user_name);
        if (existingUserByUsername) {
            throw new Error('Username already taken');
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create new user in database
        const newUser = await authManager.createUser({
            name,
            user_name,
            email_id,
            phone_no,
            password: hashedPassword
        });

        // Convert user to JSON and remove password
        const userJson = newUser.toJSON();
        delete userJson.password;

        // Generate access and refresh tokens
        const accessToken = generateToken({ id: newUser.user_id, username: newUser.user_name });
        const refreshToken = generateRefreshToken({ id: newUser.user_id, username: newUser.user_name });

        // Log successful registration
        logger.info(`User registered successfully: ${newUser.user_name}`);

       
        return {
            user: userJson,
            accessToken,
            refreshToken
        };
    }
}

const authService = new AuthService();

module.exports = {
    registerUser: authService.registerUser.bind(authService)
};
