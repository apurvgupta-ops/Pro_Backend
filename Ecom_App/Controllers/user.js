const User = require("../Models/user");
const BigPromise = require("../Middlewares/BigPromise");
const CookieToken = require("../Utils/cookieToken");
const cloudinary = require("cloudinary");
const MailHelper = require("../Utils/MailHelper");
const crypto = require("crypto");

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

exports.forgotPassword = BigPromise(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new Error("Email not found in the DB"));
  }

  const forgotPassword = await user.getForgetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const myUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${forgotPassword}`;

  const message = "Copy paste this link to forgot the password";

  try {
    await MailHelper({
      email: user.email,
      subject: "Ecom - password reset token",
      message: myUrl,
    });

    res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    user.forgetPasswordToken = undefined;
    user.forgetPasswordExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new Error("forgot password not working"));
  }
});

exports.resetPassword = BigPromise(async (req, res, next) => {
  const token = req.params.token;
  // console.log(token);
  const encryptedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  console.log(encryptedToken);
  const user = await User.findOne({
    encryptedToken,
    forgetPasswordExpiry: { $gt: Date.now() },
  });
  console.log(user);

  if (!user) {
    return next(new Error("No user found"));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new Error("Password not match"));
  }

  user.password = req.body.password;

  user.forgetPasswordToken = undefined;
  user.forgetPasswordExpiry = undefined;

  await user.save();

  CookieToken(user, res);
});

exports.getLoggedInUserDetails = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

exports.updatePassword = BigPromise(async (req, res, next) => {
  const userId = req.user.id;

  const user = await User.findById(userId).select("+password");
  const isPasswordCorrect = await user.isPasswordMatch(
    req.body.currentPassword
  );

  if (!isPasswordCorrect) {
    return next(new Error("Current password is not matched in the db"));
  }

  user.password = req.body.newPassword;

  await user.save();
  CookieToken(user, res);
});

exports.updateProfile = BigPromise(async (req, res, next) => {
  const newData = {
    email: req.body.email,
    name: req.body.name,
  };

  if (req.files) {
    const user = await User.findById(req.user.id);
    const imageId = user.photo.id;
    const deleteImage = await cloudinary.v2.uploader.destroy(imageId);

    const result = await cloudinary.v2.uploader.upload(
      req.files.photo.tempFilePath,
      {
        folder: "usersImage",
        width: 150,
        crop: "scale",
      }
    );

    newData.photo = {
      id: result.public_id,
      secure_url: result.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Profile updation complete",
  });
});
