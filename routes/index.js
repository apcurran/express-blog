const express = require("express");
const router = express.Router();
const Article = require("../models/Article");

router.get("/", async (req, res) => {
    const articles = await Article.find().sort({ createdAt: "desc" });

    res.render("articles/index", { title: "Alex Curran's Main Page", articles: articles, user: req.user });
});

module.exports = router;