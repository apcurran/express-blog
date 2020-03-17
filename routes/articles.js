const express = require("express");
const router = express.Router();
const Article = require("../models/Article");

router.get("/post/:id", async (req, res) => {
    const article = await Article.findById(req.params.id);

    if (article == null) res.redirect("/");

    res.render("articles/show-post", { title: article.title, article: article });
});

router.get("/new", (req, res) => {
    res.render("articles/new", { title: "New Post", error: "", article: new Article() });
});

router.post("/new", async (req, res, next) => {
    let article = new Article({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown
    });

    try {
        article = await article.save();

        res.redirect(`/articles/post/${article._id}`)
    } catch (err) {
        res.render("articles/new", { title: "New Post", error: err, article: article });

        console.error(err);
        next(err);
    }
});

module.exports = router;