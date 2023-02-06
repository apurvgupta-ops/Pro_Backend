const BigPromise = require("../Middlewares/BigPromise");
const stripe = require("stripe")(process.env.STRIPE_PUBLISHABLE_KEY);

exports.stripeKey = BigPromise(async (req, res, next) => {
  res.status(200).json({
    stripe_key: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});


exports.captureStripePaymentIntent =BigPromise(async(req,res,next)=>{
    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: 'inr',
        automatic_payment_methods: {enabled: true},

        //options
        // metadata:{}

    });
    res.status(200).json({
        success: true,
        client_key = paymentIntent.client_secret
    })
})