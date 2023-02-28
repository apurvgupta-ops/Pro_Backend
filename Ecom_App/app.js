const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");

const userRoute = require("./Routes/user");
const productRoute = require("./Routes/products");
const paymentRoute = require("./Routes/payment");
const orderRoute = require("./Routes/order");

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

app.set("view engine", "ejs");

//Routes
app.use("/api/v1", userRoute);
app.use("/api/v1", productRoute);
app.use("/api/v1", paymentRoute);
app.use("/api/v1", orderRoute);
app.get("/api/v1/auth", (req, res) => {
  res.render("home");
});

module.exports = app;
