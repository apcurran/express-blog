"use strict";

const Joi = require("joi");

function loginValidation(data) {
    const schema = Joi.object({
        username: Joi
                .string()
                .required(),
        password: Joi
                .string()
                .min(6)
                .required()
    });

    return schema.validateAsync(data);
}

function registerValidation(data) {
    const schema = Joi.object({
        username: Joi
                .string()
                .required(),
        password: Joi
                .string()
                .min(6)
                .required(),
        code:     Joi
                .string()
                .required() 
    });

    return schema.validateAsync(data);
}

module.exports = {
    loginValidation,
    registerValidation
};