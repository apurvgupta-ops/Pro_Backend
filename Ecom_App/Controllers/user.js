const User = require("../Models/user");
const BigPromise = require("../Middlewares/BigPromise");
const CookieToken = require("../Utils/cookieToken");
const cloudinary = require("cloudinary");

exports.signup = BigPromise(async (req, res, next) => {
  let result;
  if (!req.files) {
    return next(new Error("Please provide the photo"));
  }
  const files = req.files.photo;
  result = await cloudinary.v2.uploader.upload(files.tempFilePath, {
    folder: "usersImage",
    width: 150,
    crop: "scale",
  });

  const { name, email, password } = req.body;
  if (!(email || password || name)) {
    return next(new Error("All fields are required"));
  }
  const user = await User.create({
    name,
    email,
    password,
    photo: {
      id: result.public_id,
      secure_url: result.secure_url,
    },
  });
  CookieToken(user, res);
});

exports.login = BigPromise(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new Error("Email and password is required"));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new Error("Email not found"));
  }

  const isPasswordCorrect = await user.isPasswordMatch(password);
  if (!isPasswordCorrect) {
    return next(new Error("Incorrect Crendentials"));
  }

  CookieToken(user, res);
});

exports.logout = BigPromise(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logout successfully",
  });
});
