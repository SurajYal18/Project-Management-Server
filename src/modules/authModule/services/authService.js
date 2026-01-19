const authManager = require('../managers/authManager');
const { hashPassword } = require('../../../helpers/passwordHelper');
const { generateToken, generateRefreshToken } = require('../../../helpers/jwtHelper');
const logger = require('../../../utils/logger');

class AuthService {
    async registerUser(userData) {
        const { name, user_name, email_id, phone_no, password } = userData;

        // Check for duplicate email or username
        const existingUserByEmail = await authManager.findUserByEmail(email_id);
        if (existingUserByEmail) throw new Error('Email already registered');

        const existingUserByUsername = await authManager.findUserByUsername(user_name);
        if (existingUserByUsername) throw new Error('Username already taken');

        // Hash password and create user
        const hashedPassword = await hashPassword(password);
        const newUser = await authManager.createUser({
            name, user_name, email_id, phone_no,
            password: hashedPassword
        });

        // Remove password from response
        const userJson = newUser.toJSON();
        delete userJson.password;

        // Generate JWT tokens
        const accessToken = generateToken({ id: newUser.user_id, username: newUser.user_name });
        const refreshToken = generateRefreshToken({ id: newUser.user_id, username: newUser.user_name });

        return { user: userJson, accessToken, refreshToken };
    }

    async loginUser(loginData) {
        const { identifier, password } = loginData;
        const { comparePassword } = require('../../../helpers/passwordHelper');

        // Find user by email or username
        const user = await authManager.findUserByIdentifier(identifier);
        if (!user) throw new Error('Invalid credentials');

        // Verify password
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) throw new Error('Invalid credentials');

        // Update last login timestamp
        await authManager.updateLastLogin(user.user_id);

        // Remove password from response
        const userJson = user.toJSON();
        delete userJson.password;

        // Generate JWT tokens
        const accessToken = generateToken({ id: user.user_id, username: user.user_name });
        const refreshToken = generateRefreshToken({ id: user.user_id, username: user.user_name });

        return { user: userJson, accessToken, refreshToken };
    }

    async getCurrentUser(userId) {
        // Fetch user by ID
        const user = await authManager.findUserById(userId);
        if (!user) throw new Error('User not found');

        // Remove password from response
        const userJson = user.toJSON();
        delete userJson.password;

        return userJson;
    }
}

const authService = new AuthService();

module.exports = {
    registerUser: authService.registerUser.bind(authService),
    loginUser: authService.loginUser.bind(authService),
    getCurrentUser: authService.getCurrentUser.bind(authService)
};
