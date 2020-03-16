const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("articles", { title: "Alex Curran's Main Page" });
});

module.exports = router;