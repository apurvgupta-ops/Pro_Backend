const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  shippingInfo: {
    address: {
      type: String,
      required,
    },
    phoneNo: {
      type: Number,
      required,
    },
    postelCode: {
      type: String,
      required,
    },
    state: {
      type: String,
      required,
    },
    country: {
      type: String,
      required,
    },
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  orderItem: [
    {
      name: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
      },
    },
  ],

  taxAmount: {
    type: Number,
    required: true,
  },
  shippingAmount: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentInfo: {
    id: {
      type: String,
    },
  },

  orderStatus: {
    type: String,
    required: true,
    default: "processing",
  },

  deliveryAt: {
    type: Date,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Order", orderSchema);

// shippingInfo{}
// orderItem[{}]
// user
// payment info{}
// taxAmount
// shippingamount
// totalamount
// orderstatus
// deliveryat
// createdat
