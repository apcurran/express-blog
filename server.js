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
app.use(express.urlencoded());
app.set("layout", "layouts/layout");
app.use(expressLayouts);

// Import routes
const articlesRouter = require("./routes/articles");

// Initialize routes
app.use("/articles", articlesRouter);

app.get("/", (req, res) => {
    // Test articles
    const articles = [
        { title: "Test Article 1", createdAt: new Date, description: "Test description" }
    ];

    res.render("index", { title: "Alex Curran's Main Page", articles: articles });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}.`))
