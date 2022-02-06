const express = require("express");
const app = express();

app.set("view engine", "ejs");

const mainRouter = require("./routes/router");
app.use("/", mainRouter);

app.listen(80);