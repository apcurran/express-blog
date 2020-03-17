const express = require("express");
const router = express.Router();

router.get("/new", (req, res) => {
    res.render("articles/new", { title: "New Post" });
});

router.post("/new", (req, res) => {
    
});

module.exports = router;