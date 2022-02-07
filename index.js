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

const main = () => {
    setup();
}

main();
