const express = require("express");
const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getLoggedInUserDetails,
  updatePassword,
  updateProfile,
} = require("../Controllers/user");
const { isLoggedIn } = require("../Middlewares/user");

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgotpassword").post(forgotPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/userdashboard").get(isLoggedIn, getLoggedInUserDetails);
router.route("/password/update").post(isLoggedIn, updatePassword);
router.route("/userDashboard/update/profile").post(isLoggedIn, updateProfile);

module.exports = router;
