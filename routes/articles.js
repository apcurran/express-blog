const express = require("express");
const router = express.Router();
const Article = require("../models/Article");

function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let article = req.article;

        article.title = req.body.title;
        article.description = req.body.description;
        article.markdown = req.body.markdown;
    
        try {
            article = await article.save();
    
            res.redirect(`/articles/post/${article.slug}`);
        } catch (err) {
            res.render(`articles/${path}`, { title: "Post", error: err, article: article });
    
            console.error(err);
            next(err);
        }
    }
}

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
    res.render("articles/new", { title: "New Post", article: new Article() });
});

router.get("/post/edit/:id", async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        
        res.render("articles/edit", { title: "New Post", article: article });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post("/new", async (req, res, next) => {
    req.article = new Article();
    next();

}, saveArticleAndRedirect("new"));

router.patch("/post/edit/:id", async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    next();
}, saveArticleAndRedirect("edit"));

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