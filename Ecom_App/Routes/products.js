const express = require("express");
const { addProduct, getAllProducts } = require("../Controllers/products");
const { isLoggedIn, customRole } = require("../Middlewares/user");
const router = express.Router();

router
  .route("/admin/product/add")
  .post(isLoggedIn, customRole("admin"), addProduct);
router.route("/products").get(isLoggedIn, getAllProducts);

module.exports = router;
