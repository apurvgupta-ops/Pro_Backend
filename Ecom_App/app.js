const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");

const userRoute = require("./Routes/user");
const productRoute = require("./Routes/products");

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use(morgan("tiny"));

//Routes
app.use("/api/v1", userRoute);
app.use("/api/v1", productRoute);

module.exports = app;
