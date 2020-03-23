const express = require("express");
const router = express.Router();
const passport = require("passport");
const { checkNotAuthenticated } = require("../config/check-auth");

router.get("/", (req, res) => {
    res.render("account/login-form", { title: "Login to Account", admin: req.admin });
});

router.post(
    "/",
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/account/login"
    })
);

module.exports = router;