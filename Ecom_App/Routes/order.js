const express = require("express");
const {
  createOrder,
  getOneOrder,
  getAllOrders,
  adminGetAllOrders,
  adminUpateOrder,
  adminDeleteOrder,
} = require("../Controllers/order");
const { isLoggedIn, customRole } = require("../Middlewares/user");
const router = express.Router();

router.route("/order/create").post(isLoggedIn, createOrder);
router.route("/order/:orderId").get(isLoggedIn, getOneOrder);
router.route("/myorder").get(isLoggedIn, getAllOrders);
router
  .route("/admin/orders")
  .get(isLoggedIn, customRole("admin"), adminGetAllOrders);

router
  .route("/admin/order/:orderId")
  .put(isLoggedIn, customRole("admin"), adminUpateOrder)
  .delete(isLoggedIn, customRole("admin"), adminDeleteOrder);

module.exports = router;
