const express = require("express");
const {
  addProduct,
  getAllProducts,
  adminGetAllProducts,
  getAProduct,
} = require("../Controllers/products");
const { isLoggedIn, customRole } = require("../Middlewares/user");
const router = express.Router();

router
  .route("/admin/product/add")
  .post(isLoggedIn, customRole("admin"), addProduct);
router
  .route("/admin/products")
  .get(isLoggedIn, customRole("admin"), adminGetAllProducts);

router.route("/products").get(isLoggedIn, getAllProducts);
router.route("/product/:productId").get(isLoggedIn, getAProduct);

module.exports = router;
