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
  getAllUsers,
  managerGetAllUsers,
  getAUser,
  updateAUser,
  deleteAUser,
} = require("../Controllers/user");
const { isLoggedIn, customRole } = require("../Middlewares/user");

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgotpassword").post(forgotPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/userdashboard").get(isLoggedIn, getLoggedInUserDetails);
router.route("/password/update").post(isLoggedIn, updatePassword);
router.route("/userDashboard/update/profile").post(isLoggedIn, updateProfile);
router.route("/admin/users").get(isLoggedIn, customRole("admin"), getAllUsers);
router
  .route("/admin/user/:userId")
  .get(isLoggedIn, customRole("admin"), getAUser)
  .put(isLoggedIn, customRole("admin"), updateAUser)
  .delete(isLoggedIn, customRole("admin"), deleteAUser);
router
  .route("/manager/users")
  .get(isLoggedIn, customRole("manager"), managerGetAllUsers);

module.exports = router;
