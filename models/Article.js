"use strict";

const mongoose = require("mongoose");
const marked = require("marked");
const slugify = require("slugify");
const { JSDOM } = require("jsdom");
const moment = require("moment");
const createDOMPurify = require("dompurify");
const dompurify = createDOMPurify(new JSDOM("").window);

const CommentsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const ArticleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    markdown: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    slug: { type: String, unique: true, required: true },
    sanitizedHtml: { type: String, required: true },
    comments: [CommentsSchema]
});

ArticleSchema
    .pre("validate", function(next) {
        if (this.title) {
            this.slug = slugify(this.title, { lower: true, strict: true });
        }

        if (this.markdown) {
            const convertedHtmlFromMarkdown = marked(this.markdown);
            this.sanitizedHtml = dompurify.sanitize(convertedHtmlFromMarkdown);
        }

        next();
    });

ArticleSchema
    .virtual("createdDateFormatted")
    .get(function() {
        return new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(this.createdAt);
    });

CommentsSchema
    .virtual("commentDateFormatted")
    .get(function() {
        return new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(this.createdAt);
    });

module.exports = mongoose.model("Article", ArticleSchema);