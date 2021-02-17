"use strict";

const { loginValidation } = require("../validation/user-validation-schemas"); // Joi Validation Schema

async function validateLoginFields(req, res, next) {
    try {
        await loginValidation(req.body);

        return next();

    } catch (err) {
        console.error(err.details[0].message);

        return res.render("account/login-form", { title: "Login to Account", user: req.user, error: err.details[0].message });
    }
}

module.exports = {
    validateLoginFields
};