const express = require("express");
const { createOrder, getOneOrder } = require("../Controllers/order");
const { isLoggedIn } = require("../Middlewares/user");
const router = express.Router();

router.route("/order/create").post(isLoggedIn, createOrder);
router.route("/order/:orderId").get(isLoggedIn, getOneOrder);

module.exports = router;
