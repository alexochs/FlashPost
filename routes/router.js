const express = require("express");
const router = express.Router();

const twitter = require("../controllers/twitter");

router.get("/", async (req, res) => {
    res.render("index", { twitterAuthUrl: twitter.getAuthUrl(), twitterUsername: await twitter.getUsername("testSession")});
});

router.get("/twitter", twitter.login, (req, res) => {
    res.redirect("/");
});

router.get("/tweet", twitter.tweet, (req, res) => {
    res.redirect("/");
});

module.exports = router;