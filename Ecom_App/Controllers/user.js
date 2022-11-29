const User = require("../Models/user");
const BigPromise = require("../Middlewares/BigPromise");
const CookieToken = require("../Utils/cookieToken");

exports.signup = BigPromise(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!(email || password || name)) {
    return next(new Error("All fields are required"));
  }
  const user = await User.create({
    name,
    email,
    password,
  });
  CookieToken(user, res);
});

// module.exports = signup
