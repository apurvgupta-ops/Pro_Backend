const express = require("express");
const { addProduct } = require("../Controllers/products");
const { isLoggedIn, customRole } = require("../Middlewares/user");
const router = express.Router();

router.route("/addproducts").post(isLoggedIn, addProduct);
module.exports = router;
