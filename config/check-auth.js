const express = require("express");
const passport = require("passport");

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();

    return res.redirect("/account/login");
}

function checkNotAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) return next();

    return res.render("account/login-form", { title: "Login to Account", admin: req.admin });
}