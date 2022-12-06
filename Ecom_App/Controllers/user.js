const User = require("../Models/user");
const BigPromise = require("../Middlewares/BigPromise");
const CookieToken = require("../Utils/cookieToken");
const cloudinary = require("cloudinary");

exports.signup = BigPromise(async (req, res, next) => {
  let result;
  if (req.files) {
    const files = req.files.photo;
    result = await cloudinary.v2.uploader.upload(files, {
      folder: "usersImage",
      width: 150,
      crop: "scale",
    });
  }

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

// module.exports = signup
