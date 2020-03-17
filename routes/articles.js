const express = require("express");
const router = express.Router();
const Article = require("../models/Article");

// router.get("/:id", (req, res) => {

// });

router.get("/new", (req, res) => {
    res.render("articles/new", { title: "New Post" });
});

router.post("/new", async (req, res, next) => {
    let article = new Article({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown
    });
    
    try {

        article = await article.save();

        res.redirect(`/article/${article._id}`)
    } catch (err) {
        res.render("articles/new", { title: "New Post", error: err, article: article });

        console.error(err);
        next(err);
    }
});

module.exports = router;