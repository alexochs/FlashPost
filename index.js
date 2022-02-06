const TwitterApi = require("twitter-api-v2").default;
const dotenv = require("dotenv");
dotenv.config();

const twitter = new TwitterApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
});


const authenticate = () => {
    const { url, codeVerifier, state } = twitter.generateOAuth2AuthLink("https://alexochs.de", { scope: ['tweet.read', 'users.read', 'offline.access'] });
    console.log(url);
    console.log(codeVerifier);
    console.log(state);
};

const tweet = () => {
    const text = "Hello, World! via FlashPost(tm)";
    results = twitter.v2.tweetCountRecent("elon musk");
    console.log(results);
};

const main = () => {
    authenticate();
}
const express = require("express");
const app = express();

app.set("view engine", "ejs");

const mainRouter = require("./routes/router");
app.use("/", mainRouter);

app.listen(80);