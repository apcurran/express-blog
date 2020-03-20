const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
    res.render("account/register-form", { title: "Register an Admin Account" });
});

router.post("/", async (req, res, next) => {
    try {
        const usernameExists = await Admin.findOne({ username: req.body.username });

        if (usernameExists) {
            return res.render("account/register-form", { title: "Register an Admin Account", usernameAlreadyExists: "Username already exists" })
        }

        // Otherwise, hash pw and save admin to db
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        const admin = new Admin({
            username: req.body.username,
            password: hashedPassword
        });

        await admin.save();
        res.redirect("/account/login");

    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;