import Joi from '@hapi/joi';

export const userSchema = Joi.object({
    login: Joi.string()
        .alphanum()
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{2,}$'))
        .required(),

    age: Joi.number()
        .required()
        .integer()
        .min(4)
        .max(130)
});
