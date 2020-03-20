const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose");
const morgan = require("morgan");
const methodOverride = require("method-override");
const expressLayouts = require("express-ejs-layouts");
require("dotenv").config();

// Dev logging
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// DB Setup
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set("useCreateIndex", true)
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Import routes
const articlesRouter = require("./routes/articles");
const indexRouter = require("./routes/index");
const registerRouter = require("./routes/register");

// Initialize routes
app.use("/", indexRouter);
app.use("/articles", articlesRouter);
app.use("/account/register", registerRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}.`));
