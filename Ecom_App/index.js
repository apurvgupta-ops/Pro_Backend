require("dotenv").config();
const express = require("express");
const app = require("./app");
const connection = require("./Config/db");

connection();

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});
