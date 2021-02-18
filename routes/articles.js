"use strict";

const express = require("express");
const router = express.Router();

const Article = require("../models/Article");
const { checkAuthenticated } = require("../config/check-auth");

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
        }
    }
}

router.get("/post/:slug", async (req, res) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug });
    
        if (article == null) res.redirect("/");
    
        res.render("articles/show-post", { title: article.title, article: article });

    } catch (err) {
        next(err);
    }

});

router.get("/new", checkAuthenticated, (req, res) => {
    res.render("articles/new", { title: "New Post" });
});

router.get("/post/edit/:id", async (req, res) => {
    try {
        const article = await Article.findById(req.params.id).lean();
        
        res.render("articles/edit", { title: "New Post", article: article });
    } catch (err) {
        next(err);
    }
});

router.post("/new", checkAuthenticated, async (req, res, next) => {
    req.article = new Article();
    next();
}, saveArticleAndRedirect("new"));

router.patch("/post/edit/:id", checkAuthenticated, async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    next();
}, saveArticleAndRedirect("edit"));

router.delete("/post/:id", checkAuthenticated, async (req, res, next) => {
    try {
        await Article.findByIdAndDelete(req.params.id);

        res.redirect("/");
    } catch (err) {
        next(err);
    }
});

// POST comment
router.post("/post/:id/comment", async (req, res, next) => {
    try {
        const article = await Article.findById(req.params.id);
        const newComment = { name: req.body.name, text: req.body.comment };
        
        // Add new comment
        article.comments.unshift(newComment);

        await article.save();

        // Redirect to the article post with the new comment added
        res.redirect(`/articles/post/${article.slug}`);
        
    } catch (err) {
        next(err);
    }
});

// DELETE comment
router.delete("/post/:id/comment/:comment_id", checkAuthenticated, async (req, res, next) => {
    try {
        const { id, comment_id } = req.params;
        const article = await Article.findById(id);

        article.comments.id(comment_id).remove();

        await article.save();

        // Show the article post with the comment now deleted
        res.redirect(`/articles/post/${article.slug}`);
        
    } catch (err) {
        next(err);
    }
});

module.exports = router;