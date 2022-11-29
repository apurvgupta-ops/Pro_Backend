const express = require("express");
const { signup } = require("../Controllers/user");

const router = express.Router();

router.route("/signup").get(signup);

module.exports = router;
