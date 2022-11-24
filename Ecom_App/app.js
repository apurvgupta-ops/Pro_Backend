const express = require("express");
const app = express();

app.use("/", (req, res) => {
  res.send("Api running");
});

module.exports = app;
