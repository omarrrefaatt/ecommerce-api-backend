const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "category required"],
      unique: [true, "category must be unique"],
      minlength: [3, "category name is too short"],
      maxlength: [32, "category name is too long"],
    },
    // A and B => /a-and-b
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

const categoryModel = mongoose.model("Category", CategorySchema);

module.exports = categoryModel;
