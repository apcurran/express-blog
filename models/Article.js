const mongoose = require("mongoose");
const marked = require("marked");
const slugify = require("slugify");
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const dompurify = createDOMPurify(new JSDOM("").window);
const moment = require("moment");

const ArticleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    markdown: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    slug: { type: String, unique: true, required: true },
    sanitizedHtml: { type: String, required: true },
    comments: [
        {
            name: { type: String, required: true },
            text: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ]
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
        return moment(this.createdAt).format("MMMM Do, YYYY");
    });

module.exports = mongoose.model("Article", ArticleSchema);