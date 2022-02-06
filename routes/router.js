const express = require("express");
const router = express.Router();

const authTwitterUrl = require("../index");

router.get("/", (req, res) => {
    res.render("index", { authTwitter: "authTwitterUrl" });
});

module.exports = router;