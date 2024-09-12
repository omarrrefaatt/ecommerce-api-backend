const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "subcategory required"],
      unique: [true, "subcategory must be unique"],
      minlength: [2, "subcategory name is too short"],
      maxlength: [32, "subcategory name is too long"],
    },
    // A and B => /a-and-b
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "subcategory must belong to a category"],
    },
  },
  { timestamps: true }
);

const subCategoryModel = mongoose.model("SubCategory", subCategorySchema);

module.exports = subCategoryModel;
