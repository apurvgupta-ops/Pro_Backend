const express = require("express");
const { signup, login, logout } = require("../Controllers/user");

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);

module.exports = router;
