const session = require("express-session");
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();

const setup = () => {
    app.set("view engine", "ejs");

    app.use(express.static("public"));

    app.use(session({
        secret: process.env.SESSION_SECRET_KEY,
        resave: true,
        saveUninitialized: true,
    }));

    const mainRouter = require("./routes/router");
    app.use("/", mainRouter);
    
    app.listen(80);
};

const main = () => {
    setup();
}

main();
