"use strict";

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();

    return res.redirect("/account/login");
}

function checkNotAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) return next();

    // Redirect to home page
    return res.redirect("/");
}

module.exports = {
    checkAuthenticated,
    checkNotAuthenticated
};