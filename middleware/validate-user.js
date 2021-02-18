"use strict";

const { loginValidation, registerValidation } = require("../validation/user-validation-schemas"); // Joi Validation Schemas

async function validateLoginFields(req, res, next) {
    try {
        await loginValidation(req.body);

        return next();

    } catch (err) {
        const { username, password } = req.body;

        return res.render("account/login-form", { title: "Login to Account", username, password, error: err.details[0].message });
    }
}

async function validateRegisterFields(req, res, next) {
    try {
        await registerValidation(req.body);

        return next();

    } catch (err) {
        const { username, password, code } = req.body;

        return res.render("account/register-form", { title: "Login to Account", username, password, code, error: err.details[0].message });
    }
}

module.exports = {
    validateLoginFields,
    validateRegisterFields
};