const Joi = require('joi');

const validateUpdateUser = (data) => {
    const schema = Joi.object({
        name: Joi.string().optional(),
        phone_no: Joi.string().pattern(/^[0-9]+$/).min(10).max(15).optional(),
    });
    return schema.validate(data);
};

const validateChangePassword = (data) => {
    const schema = Joi.object({
        old_password: Joi.string().required(),
        new_password: Joi.string().min(6).required()
    });
    return schema.validate(data);
};

module.exports = {
    validateUpdateUser,
    validateChangePassword
};
