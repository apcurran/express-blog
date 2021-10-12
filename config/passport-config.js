"use strict";

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const Admin = require("../models/Admin");

function initializePassport() {
    passport.use(
        new LocalStrategy((username, password, done) => {
            Admin.findOne({ username: username }, (err, user) => {
                if (err) return done(err);
    
                if (!user) return done(null, false, { message: "Incorrect username" });
    
                bcrypt.compare(password, user.password, (err, res) => {
                    if (res) return done(null, user);
    
                    return done(null, false, { message: "Incorrect password" });
                });
            });
        })
    );
    
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    
    passport.deserializeUser((id, done) => {
        Admin.findById(id, (err, user) => {
            done(err, user);
        });
    });
}

module.exports = initializePassport;
