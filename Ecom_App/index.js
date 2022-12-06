require("dotenv").config();
const express = require("express");
const app = require("./app");
const connection = require("./Config/db");
const cloudinary = require("cloudinary");
connection();

//CLOUDINARY CONFIG
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUDNAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_APISECRET,
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});
