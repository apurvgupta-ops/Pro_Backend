const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter the product name"],
    trim: true,
  },
  price: {
    type: String,
    required: [true, "Please enter the product price"],
  },
  description: {
    type: String,
    required: [true, "Please enter the product description"],
  },
  photos: [
    {
      id: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
    },
  ],

  category: {
    type: String,
    required: [
      true,
      "Please Select the category from short-sleeves, Long-sleeves, sweat-shirts and hoodies",
    ],
    enum: {
      values: ["ShortSleeves", "LongSleeves", "SweatShirt", "hoodies"],
      message:
        "Please Select the category from short-sleeves, Long-sleeves, sweat-shirts and hoodies",
    },
  },
  stock: {
    type: Number,
    required: [true, "Please add stocks"],
  },
  brand: {
    type: String,
    required: [true, "Please add a brand for clothing"],
  },
  rating: {
    type: Number,
    default: 0,
  },

  numberOfReviews: {
    type: Number,
    default: 0,
  },

  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },

      name: {
        type: String,
        required: true,
      },

      rating: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
