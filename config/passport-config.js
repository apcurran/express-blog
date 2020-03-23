const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");

passport.use(
    new LocalStrategy((username, password, done) => {
        Admin.findOne({ username: username }, (err, admin) => {
            if (err) return done(err);

            if (!admin) return done(null, false, { error: "Incorrect username" });

            bcrypt.compare(password, admin.password, (err, res) => {
                if (res) return done(null, admin);

                return done(null, false, { error: "Incorrect password" });
            })
        });
    })
);

passport.serializeUser((admin, done) => {
    done(null, admin.id);
});

passport.deserializeUser((id, done) => {
    Admin.findById(id, (err, admin) => {
        done(err, admin);
    });
});