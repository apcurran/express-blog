"use strict";

const Joi = require("joi");

function loginValidation(data) {
    const schema = Joi.object({
        username: Joi
                .string()
                .min(1)
                .required(),
        password: Joi
                .string()
                .min(6)
                .required()
    });

    return schema.validateAsync(data);
}

module.exports = { loginValidation };