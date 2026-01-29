const authManager = require('../managers/authManager');
const { hashPassword } = require('../../../helpers/passwordHelper');
const { generateToken, generateRefreshToken } = require('../../../helpers/jwtHelper');
const logger = require('../../../utils/logger');

class AuthService {
    async registerUser(userData) {
        const { name, user_name, email_id, phone_no, password, role } = userData;

        // Check for duplicate email or username
        const existingUserByEmail = await authManager.findUserByEmail(email_id);
        if (existingUserByEmail) throw new Error('Email already registered');

        const existingUserByUsername = await authManager.findUserByUsername(user_name);
        if (existingUserByUsername) throw new Error('Username already taken');

        // Hash password and create user
        const hashedPassword = await hashPassword(password);
        const newUser = await authManager.createUser({
            name, user_name, email_id, phone_no, role,
            password: hashedPassword
        });

        // Remove password from response
        const userJson = newUser.toJSON();
        delete userJson.password;

        // Generate JWT tokens
        const accessToken = generateToken({ id: newUser.user_id, username: newUser.user_name, role: newUser.role });
        const refreshToken = generateRefreshToken({ id: newUser.user_id, username: newUser.user_name, role: newUser.role });

        // Store refresh token in database
        await authManager.storeRefreshToken(newUser.user_id, refreshToken);

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
        const accessToken = generateToken({ id: user.user_id, username: user.user_name, role: user.role });
        const refreshToken = generateRefreshToken({ id: user.user_id, username: user.user_name, role: user.role });

        // Store refresh token in database
        await authManager.storeRefreshToken(user.user_id, refreshToken);

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

    // Initiate forgot password - generate and send OTP
    async forgotPassword(email_id) {
        const { generateOTP, getOTPExpiry, sendOTPEmail } = require('../../../helpers/otpHelper');

        // Check if user exists
        const user = await authManager.findUserByEmail(email_id);
        if (!user) throw new Error('User not found with this email');

        // Generate OTP and expiry
        const otp = generateOTP();
        const otpExpiry = getOTPExpiry();

        // Create OTP record in database
        await authManager.createOTP(user.user_id, email_id, otp, otpExpiry);

        // Send OTP via email (console log for now)
        sendOTPEmail(email_id, otp, user.name);

        logger.info(`OTP generated for user: ${email_id}`);
        return { message: 'OTP sent successfully to your email' };
    }

    // Verify OTP for password reset
    async verifyOTP(email_id, otp) {
        const { verifyOTP } = require('../../../helpers/otpHelper');

        // Find OTP record by email
        const otpRecord = await authManager.findOTPByEmail(email_id);
        if (!otpRecord) {
            throw new Error('No OTP found. Please request a new one');
        }

        // Verify OTP
        const verification = verifyOTP(otpRecord.otp_code, otp, otpRecord.expires_at);
        if (!verification.valid) {
            throw new Error(verification.message);
        }

        logger.info(`OTP verified successfully for user: ${email_id}`);
        return {
            message: 'OTP verified successfully',
            userId: otpRecord.user_id
        };
    }

    // Reset password after OTP verification
    async resetPassword(email_id, otp, newPassword) {
        const { verifyOTP } = require('../../../helpers/otpHelper');

        // Find user by email
        const user = await authManager.findUserByEmail(email_id);
        if (!user) throw new Error('User not found');

        // Find OTP record
        const otpRecord = await authManager.findOTPByEmail(email_id);
        if (!otpRecord) {
            throw new Error('No OTP found. Please request a new one');
        }

        // Verify OTP again for security
        const verification = verifyOTP(otpRecord.otp_code, otp, otpRecord.expires_at);
        if (!verification.valid) {
            throw new Error(verification.message);
        }

        // Hash new password
        const hashedPassword = await hashPassword(newPassword);

        // Update password in database
        await authManager.updatePassword(user.user_id, hashedPassword);

        // Delete OTP from database
        await authManager.deleteOTP(otpRecord.otp_id);

        logger.info(`Password reset successfully for user: ${email_id}`);
        return { message: 'Password reset successfully' };
    }

    // Refresh access token using refresh token
    async refreshAccessToken(refreshToken) {
        const { verifyRefreshToken } = require('../../../helpers/jwtHelper');

        // Verify refresh token
        let decoded;
        try {
            decoded = verifyRefreshToken(refreshToken);
        } catch (error) {
            throw new Error('Invalid or expired refresh token');
        }

        // Verify token exists in database
        const user = await authManager.verifyStoredRefreshToken(decoded.id, refreshToken);
        if (!user) {
            throw new Error('Refresh token not found or has been revoked');
        }

        // Generate new access token
        const accessToken = generateToken({
            id: user.user_id,
            username: user.user_name
        });

        logger.info(`Access token refreshed for user: ${user.user_id}`);
        return {
            accessToken,
            user: {
                id: user.user_id,
                username: user.user_name,
                email: user.email_id
            }
        };
    }
}


const authService = new AuthService();

module.exports = {
    registerUser: authService.registerUser.bind(authService),
    loginUser: authService.loginUser.bind(authService),
    getCurrentUser: authService.getCurrentUser.bind(authService),
    forgotPassword: authService.forgotPassword.bind(authService),
    verifyOTP: authService.verifyOTP.bind(authService),
    resetPassword: authService.resetPassword.bind(authService),
    refreshAccessToken: authService.refreshAccessToken.bind(authService)
};
