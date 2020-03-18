const express = require("express");
const router = express.Router();
const Article = require("../models/Article");

router.get("/post/:slug", async (req, res) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug });
    
        if (article == null) res.redirect("/");
    
        res.render("articles/show-post", { title: article.title, article: article });

    } catch (err) {
        console.error(err);
        next(err);
    }

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

        res.redirect(`/articles/post/${article.slug}`);
    } catch (err) {
        res.render("articles/new", { title: "New Post", error: err, article: article });

        console.error(err);
        next(err);
    }
});

router.delete("/post/:id", async (req, res, next) => {
    try {
        await Article.findByIdAndDelete(req.params.id);

        res.redirect("/");
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;