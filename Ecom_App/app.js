const express = require("express");
const app = express();
const userRoute = require("./Routes/user");
const cors = require("cors");
const cookieParser = require("cookie-parser");
//Middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());

//Routes
app.use("/api/v1", userRoute);

module.exports = app;
