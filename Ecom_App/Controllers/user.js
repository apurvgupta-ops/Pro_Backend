const User = require("../Models/user");
const BigPromise = require("../Middlewares/BigPromise");

exports.signup = BigPromise(async (req, res, next) => {
  //
  res.send("signup route");
});

// module.exports = signup
