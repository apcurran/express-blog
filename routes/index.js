const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    // Test articles
    const articles = [
        { title: "Test Article 1", createdAt: new Date, description: "Test description 1" }
    ];

    res.render("index", { title: "Alex Curran's Main Page", articles: articles });
});

module.exports = router;