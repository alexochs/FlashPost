const express = require("express");
const router = express.Router();

const Twitter = require("../controllers/twitter");
const twitter = new Twitter();

router.get("/", (req, res) => {
    console.log("callback state: " + req.query.state);
    console.log("callback code: " + req.query.code);
    res.render("index", { authTwitterUrl: twitter.getAuthUrl() , authTwitter: twitter.getAuthUrl()});
});

module.exports = router;