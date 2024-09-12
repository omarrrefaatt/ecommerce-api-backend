const mongoose = require("mongoose");

const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "brand required"],
      unique: [true, "brand must be unique"],
      minlength: [3, "brand name is too short"],
      maxlength: [32, "brand name is too long"],
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

const brandModel = mongoose.model("Brand", BrandSchema);

module.exports = brandModel;
