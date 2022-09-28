const https = require('https');
const fs = require('fs');
const options = {
  key: fs.readFileSync("./certs/localhost-key.pem"),
  cert: fs.readFileSync("./certs/localhost.pem"),
};
const session = require("express-session");
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();

const bodyParser = require("body-parser");

const setup = () => {
    app.set("view engine", "ejs");

    app.use(express.static("public"));

    app.use(bodyParser.urlencoded({extended: true}))

    app.use(session({
        secret: process.env.SESSION_SECRET_KEY,
        resave: true,
        saveUninitialized: true,
    }));

    const mainRouter = require("./routes/router");
    app.use("/", mainRouter);
    
    https.createServer(options, app).listen(1337);
};

const main = () => {
    setup();
}

main();
