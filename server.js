const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const morgan = require("morgan");
const expressLayouts = require("express-ejs-layouts");
require("dotenv").config();

// Dev logging
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.set("view engine", "ejs");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Import routes
const articlesRouter = require("./routes/articles");
const indexRouter = require("./routes/index");

// Initialize routes
app.use("/articles", articlesRouter);
app.use("/", indexRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}.`));
