"use strict";

const express = require("express");
const router = express.Router();
const passport = require("passport");

const { checkNotAuthenticated } = require("../config/check-auth");
const { validateLoginFields } = require("../middleware/validate-user");

router.get("/", checkNotAuthenticated, (req, res) => {
    res.render("account/login-form", { title: "Login to Account", user: req.user });
});

router.post(
    "/",
    validateLoginFields,
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/account/login",
        failureFlash: true
    })
);

module.exports = router;