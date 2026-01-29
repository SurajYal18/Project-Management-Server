const Joi = require('joi');

class AuthValidator {
    constructor() {
        this.registerSchema = Joi.object({
            name: Joi.string().required().messages({
                'any.required': 'Name is required',
                'string.empty': 'Name cannot be empty'
            }),
            user_name: Joi.string().alphanum().min(3).max(30).required().messages({
                'any.required': 'Username is required',
                'string.alphanum': 'Username must only contain alpha-numeric characters',
                'string.min': 'Username should have a minimum length of 3',
                'string.max': 'Username should have a maximum length of 30'
            }),
            email_id: Joi.string().email().required().messages({
                'any.required': 'Email is required',
                'string.email': 'Email must be a valid email address'
            }),
            phone_no: Joi.string().pattern(/^[0-9]+$/).min(10).max(15).optional().messages({
                'string.pattern.base': 'Phone number must only contain digits',
                'string.min': 'Phone number length must be at least 10 characters',
                'string.max': 'Phone number length must be at most 15 characters'
            }),
            password: Joi.string().min(6).required().messages({
                'any.required': 'Password is required',
                'string.min': 'Password should have a minimum length of 6'
            })
        });

        this.loginSchema = Joi.object({
            identifier: Joi.string().required().messages({
                'any.required': 'Email or username is required',
                'string.empty': 'Email or username cannot be empty'
            }),
            password: Joi.string().required().messages({
                'any.required': 'Password is required',
                'string.empty': 'Password cannot be empty'
            })
        });

        this.forgotPasswordSchema = Joi.object({
            email_id: Joi.string().email().required().messages({
                'any.required': 'Email is required',
                'string.email': 'Email must be a valid email address',
                'string.empty': 'Email cannot be empty'
            })
        });

        this.verifyOTPSchema = Joi.object({
            email_id: Joi.string().email().required().messages({
                'any.required': 'Email is required',
                'string.email': 'Email must be a valid email address'
            }),
            otp: Joi.string().length(6).pattern(/^[0-9]+$/).required().messages({
                'any.required': 'OTP is required',
                'string.length': 'OTP must be 6 digits',
                'string.pattern.base': 'OTP must only contain digits',
                'string.empty': 'OTP cannot be empty'
            })
        });

        this.resetPasswordSchema = Joi.object({
            email_id: Joi.string().email().required().messages({
                'any.required': 'Email is required',
                'string.email': 'Email must be a valid email address'
            }),
            otp: Joi.string().length(6).pattern(/^[0-9]+$/).required().messages({
                'any.required': 'OTP is required',
                'string.length': 'OTP must be 6 digits',
                'string.pattern.base': 'OTP must only contain digits'
            }),
            new_password: Joi.string().min(6).required().messages({
                'any.required': 'New password is required',
                'string.min': 'New password should have a minimum length of 6',
                'string.empty': 'New password cannot be empty'
            })
        });

        this.refreshTokenSchema = Joi.object({
            refresh_token: Joi.string().required().messages({
                'any.required': 'Refresh token is required',
                'string.empty': 'Refresh token cannot be empty'
            })
        });
    }


    validateRegister(data) {
        return this.registerSchema.validate(data, { abortEarly: false });
    }

    validateLogin(data) {
        return this.loginSchema.validate(data, { abortEarly: false });
    }

    validateForgotPassword(data) {
        return this.forgotPasswordSchema.validate(data, { abortEarly: false });
    }

    validateVerifyOTP(data) {
        return this.verifyOTPSchema.validate(data, { abortEarly: false });
    }

    validateResetPassword(data) {
        return this.resetPasswordSchema.validate(data, { abortEarly: false });
    }

    validateRefreshToken(data) {
        return this.refreshTokenSchema.validate(data, { abortEarly: false });
    }
}

const authValidator = new AuthValidator();

module.exports = {
    validateRegister: authValidator.validateRegister.bind(authValidator),
    validateLogin: authValidator.validateLogin.bind(authValidator),
    validateForgotPassword: authValidator.validateForgotPassword.bind(authValidator),
    validateVerifyOTP: authValidator.validateVerifyOTP.bind(authValidator),
    validateResetPassword: authValidator.validateResetPassword.bind(authValidator),
    validateRefreshToken: authValidator.validateRefreshToken.bind(authValidator)
};
