const crypto = require('crypto');
const logger = require('../utils/logger');

// OTP helper class for generating and managing OTPs
class OtpHelper {
    constructor() {
        // OTP valid for 10 minutes by default
        this.OTP_EXPIRY_MINUTES = process.env.OTP_EXPIRY_MINUTES || 10;
        this.OTP_LENGTH = 6;
    }

    // Generate a random numeric OTP
    generateOTP() {
        try {
            // Generate random 6-digit OTP
            const otp = crypto.randomInt(100000, 999999).toString();
            logger.info(`OTP generated successfully`);
            return otp;
        } catch (error) {
            logger.error(`Error generating OTP: ${error.message}`);
            throw error;
        }
    }

    // Calculate OTP expiry timestamp
    getOTPExpiry() {
        try {
            const expiryTime = new Date();
            expiryTime.setMinutes(expiryTime.getMinutes() + parseInt(this.OTP_EXPIRY_MINUTES));
            return expiryTime;
        } catch (error) {
            logger.error(`Error calculating OTP expiry: ${error.message}`);
            throw error;
        }
    }

    // Verify if OTP is valid and not expired
    verifyOTP(storedOTP, providedOTP, expiryTime) {
        try {
            // Check if OTP matches
            if (storedOTP !== providedOTP) {
                logger.warn(`OTP mismatch`);
                return { valid: false, message: 'Invalid OTP' };
            }

            // Check if OTP has expired
            const currentTime = new Date();
            if (currentTime > new Date(expiryTime)) {
                logger.warn(`OTP has expired`);
                return { valid: false, message: 'OTP has expired' };
            }

            logger.info(`OTP verified successfully`);
            return { valid: true, message: 'OTP is valid' };
        } catch (error) {
            logger.error(`Error verifying OTP: ${error.message}`);
            throw error;
        }
    }

    // Send OTP via email (console log for now)
    sendOTPEmail(email, otp, name = 'User') {
        try {
            // TODO: Integrate with email service (e.g., SendGrid, Nodemailer)
            console.log('\n========================================');
            console.log('📧 EMAIL SERVICE (DEVELOPMENT MODE)');
            console.log('========================================');
            console.log(`To: ${email}`);
            console.log(`Subject: Password Reset OTP`);
            console.log('========================================');
            console.log(`Hello ${name},\n`);
            console.log(`Your OTP for password reset is: ${otp}`);
            console.log(`This OTP will expire in ${this.OTP_EXPIRY_MINUTES} minutes.\n`);
            console.log(`If you didn't request this, please ignore this message.`);
            console.log('========================================\n');

            logger.info(`OTP email sent to ${email} (logged to console)`);
            return true;
        } catch (error) {
            logger.error(`Error sending OTP email: ${error.message}`);
            throw error;
        }
    }
}

const otpHelper = new OtpHelper();

module.exports = {
    generateOTP: otpHelper.generateOTP.bind(otpHelper),
    getOTPExpiry: otpHelper.getOTPExpiry.bind(otpHelper),
    verifyOTP: otpHelper.verifyOTP.bind(otpHelper),
    sendOTPEmail: otpHelper.sendOTPEmail.bind(otpHelper)
};
