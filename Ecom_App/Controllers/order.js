const Order = require("../Models/order");
const Product = require("../Models/products");
const BigPromise = require("../Middlewares/BigPromise");

exports.createOrder = BigPromise(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    taxAmount,
    shippingAmount,
    totalAmount,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    taxAmount,
    shippingAmount,
    totalAmount,
    user: req.user._id,
  });

  res.status(200).json({
    success: true,
    order,
  });
});

exports.getOneOrder = BigPromise(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new Error("orderId not found"));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

exports.getAllOrders = BigPromise(async (req, res, next) => {
  const userId = req.user._id;
  // console.log(userId);
  const order = await Order.find({ userId });

  if (!order) {
    return next(new Error("order not found"));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

exports.adminGetAllOrders = BigPromise(async (req, res, next) => {
  const orders = await Order.find({});
  res.status(200).json({
    success: true,
    orders,
  });
});

exports.adminUpateOrder = BigPromise(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);

  if (order.orderStatus == "Delivered") {
    return next(new Error("order is already delivered"));
  }
  order.orderStatus = req.body.orderStatus;

  order.orderItems.forEach(async (prod) => {
    updateTheStock(prod.product, prod.quantity);
  });

  await order.save();
  res.status(200).json({
    success: true,
    order,
  });
});

async function updateTheStock(productId, quantity) {
  const product = await Product.findById(productId);

  product.stock = product.stock - quantity;

  await product.save({ validateBeforeSave: false });
}

exports.adminDeleteOrder = BigPromise(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) {
    return next(new Error("There is no orders"));
  }

  await order.remove();

  res.status(200).json({
    success: true,
    message: "Deletion done",
  });
});
