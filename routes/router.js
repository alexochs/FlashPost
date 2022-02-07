const express = require("express");
const router = express.Router();
const database = require("../database/database");
const twitter = require("../controllers/twitter");

router.get("/", async (req, res) => {
    console.log(req.session.id);
    res.render("index", { twitterAuthUrl: twitter.getAuthUrl(), twitterUsername: await twitter.getUsername(req.session.id) || "Connect"});
});

router.get("/twitter", twitter.login, (req, res) => {
    res.redirect("/");
});

router.get("/tweet", twitter.tweet, (req, res) => {
    res.redirect("/");
});

router.get("/newsession", twitter.tweet, (req, res) => {
    req.session.destroy();
    res.redirect("/");
});

module.exports = router;