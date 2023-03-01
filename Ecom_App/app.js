const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");

const passportConfig = require("./Passport/Passport");
const passport = require("passport");
const userRoute = require("./Routes/user");
const productRoute = require("./Routes/products");
const paymentRoute = require("./Routes/payment");
const orderRoute = require("./Routes/order");
const socialRoute = require("./Routes/socialLogin");
const cookieSession = require("cookie-session");

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
app.use(
  cookieSession({
    keys: ["passportsecreat"],
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use("/api/v1", userRoute);
app.use("/api/v1", productRoute);
app.use("/api/v1", paymentRoute);
app.use("/api/v1", orderRoute);
app.use("", socialRoute);

module.exports = app;
