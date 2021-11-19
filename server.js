"use strict";

require("dotenv").config();

const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose");
const morgan = require("morgan");
const session = require("express-session");
const flash = require("express-flash");
const MongoDBStore = require("connect-mongodb-session")(session);
const passport = require("passport");
const initializePassport = require("./config/passport-config");
const methodOverride = require("method-override");
const expressLayouts = require("express-ejs-layouts");
const shrinkRay = require("shrink-ray-current");
const helmet = require("helmet");

// Import routes
const articlesRouter = require("./routes/articles");
const indexRouter = require("./routes/index");
const registerRouter = require("./routes/register");
const loginRouter = require("./routes/login");
const logoutRouter = require("./routes/logout");


if (process.env.NODE_ENV === "development") {
    // Enable dev logging
    app.use(morgan("dev"));
}

const store = new MongoDBStore({
    uri: process.env.DB_URI,
    collection: "sessions"
});

// DB Setup
mongoose
    .connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch((err) => console.error("Mongo error:", err));
mongoose
    .set("useCreateIndex", true);

app.use(shrinkRay());
app.use(express.static("public"));
app.use(helmet());
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));

// Passport Setup
initializePassport(); // Custom function
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store, // MongoDB session store
    cookie: { maxAge: 60000 }
}));
app.use(flash());
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

// 404 error page
app.use((req, res) => {
    res.status(404).render("404-error", { title: "404 Not Found" });
});
// Catch-all final error page
app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).render("error", { title: "Server Error", error: err.message });
});

app.listen(PORT, () =>  {
    if (process.env.NODE_ENV === "development") {
        console.log(`Server running on port ${PORT}.`);
    } 
});
