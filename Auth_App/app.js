const express = require("express");
require("./config/Db.js").connect();

const User = require("./Models/user.js");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const user = require("./Models/user.js");
const auth = require('./Middlewares/auth.js')
const app = express();

//MIDDLEWARES
app.use(express.json());
// app.use(bodyParser());
app.use(cookieParser());

//ROUTES
app.get("/", (req, res) => {
  res.send("hello");
});

app.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!(email && password && firstName && lastName)) {
      res.status(400).send("All fields is required");
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(401).send("User Already register");
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
    });
    await user.save();
    console.log(user);

    const token = await jwt.sign(
      { userId: user._id, email },
      process.env.SECRET_KEY,
      { expiresIn: "2h" }
    );
    user.token = token;
    user.password = undefined;
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).send("All Fields are required");
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      res.status(400).send("Go and register yourself to login");
    }
    const comparePassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!comparePassword) {
      res.status(400).send("Credentials are incorrect");
    }

    if (existingUser && comparePassword) {
      const token = await jwt.sign(
        { userId: existingUser._id, email },
        process.env.SECRET_KEY,
        { expiresIn: "2h" }
      );

      existingUser.token = token;
      existingUser.password = undefined;

      // IF YOU WANT TO USE COOKIE;
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res.status(200).cookie("token", token, options).json({
        success: true,
        token,
        existingUser,
      });
    }
    res.status(400).send("email and password is wrong");
  } catch (error) {
    console.log(error);
  }
});

app.get("/dashboard",auth, (req, res) => {
  res.status(200).send("DashBoard");
});

module.exports = app;
