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
    }

    validateRegister(data) {
        return this.registerSchema.validate(data, { abortEarly: false });
    }
}

const authValidator = new AuthValidator();

module.exports = {
    validateRegister: authValidator.validateRegister.bind(authValidator)
};
