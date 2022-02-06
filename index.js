
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();

const setup = () => {
    app.set("view engine", "ejs");

    const mainRouter = require("./routes/router");
    app.use("/", mainRouter);
    
    app.listen(80);
};

/*const tweet = () => {
    const text = "Hello, World! via FlashPost(tm)";
    results = twitter.v2.tweetCountRecent("elon musk");
    console.log(results);
};*/

const main = () => {
    setup();
}

main();
