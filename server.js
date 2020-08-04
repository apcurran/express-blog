"use strict";

require("dotenv").config();

const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose");
const morgan = require("morgan");
const session = require("express-session");
const passport = require("passport");
const initializePassport = require("./config/passport-config");
const methodOverride = require("method-override");
const expressLayouts = require("express-ejs-layouts");
const compression = require("compression");
const helmet = require("helmet");

// Import routes
const articlesRouter = require("./routes/articles");
const indexRouter = require("./routes/index");
const registerRouter = require("./routes/register");
const loginRouter = require("./routes/login");
const logoutRouter = require("./routes/logout");

// Dev logging
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// DB Setup
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set("useCreateIndex", true)
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

app.use(helmet());
app.use(compression());
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Passport Setup
initializePassport(); // Custom function
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    // Set global view variable for conditional templating when logged in.
    res.locals.isAuthenticated = req.isAuthenticated();

    next();
});

// Initialize routes
app.use("/", indexRouter);
app.use("/articles", articlesRouter);
app.use("/account/register", registerRouter);
app.use("/account/login", loginRouter);
app.use("/account/logout", logoutRouter);

app.listen(PORT, () =>  {
    if (process.env.NODE_ENV === "development") {
        console.log(`Server running on port ${PORT}.`);
    } 
});
