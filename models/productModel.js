const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "product title required"],
      unique: [true, "product title must be unique"],
      minlength: [3, "product title too short"],
      maxlength: [50, "product title too long"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    description: {
      type: String,
      required: [true, "product description required"],
      minlength: [10, "product description too short"],
      maxlength: [500, "product description too long"],
    },

    quantity: {
      type: Number,
      required: [true, "product quantity required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "product price required"],
      trim: true,
      maxlength: [6, "product price too long"],
    },
    discountPrice: {
      type: Number,
    },
    colors: [String],
    coverImage: {
      type: String,
      required: [true, "product cover image required"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "product category required"],
    },
    subategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
      required: [true, "product brand required"],
    },
    rating: {
      type: Number,
      min: [1, "product rating must be between 1.0 and 5.0"],
      max: [5, "product rating must be between 1.0 and 5.0"],
    },
    numberOfRatings: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const productModel = mongoose.model("Product", productSchema);

module.exports = productModel;
