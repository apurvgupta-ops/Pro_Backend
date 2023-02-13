const express = require("express");
const router = express.Router();
const {
  stripeKey,
  captureStripePaymentIntent,
} = require("../Controllers/payment");
const { isLoggedIn } = require("../Middlewares/user");

router.route("/stripekey").get(isLoggedIn, stripeKey);
router.route("/capturestripepi").get(isLoggedIn, captureStripePaymentIntent);

module.exports = router;
