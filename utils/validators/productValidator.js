const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const categoryModel = require("../../models/categoryModel");
const subcategoryModel = require("../../models/subcategoryModel");
const brandModel = require("../../models/brandModel");

exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid product ID format"),
  validatorMiddleware,
];

exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("product title must be specified")
    .isLength({ min: 3 })
    .withMessage("product title too short")
    .isLength({ max: 50 })
    .withMessage("product title is too long"),
  check("description")
    .notEmpty()
    .withMessage("product description must be specified")
    .isLength({ min: 10 })
    .withMessage("product description too short")
    .isLength({ max: 500 })
    .withMessage("product description is too long"),
  check("quantity")
    .notEmpty()
    .withMessage("product quantity must be specified")
    .isNumeric()
    .withMessage("product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("product quantity must be a number"),
  check("price")
    .notEmpty()
    .withMessage("product price required")
    .isLength({ max: 9 })
    .withMessage("product price is too long")
    .isNumeric()
    .withMessage("product quantity must be a number"),
  check("discountPrice")
    .optional()
    .toFloat()
    .isNumeric()
    .withMessage("discount price must be a number")
    .custom((value, { req }) => {
      if (req.body.price < value) {
        throw new Error("discount price must be less than or equal to price");
      }
      return true;
    }),

  check("colors").optional().isArray().withMessage("colors should be an array"),
  check("coverImage").notEmpty().withMessage("product cover image  required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("product images should be an array of strings"),
  check("category")
    .isMongoId()
    .withMessage("Invalid category ID format")
    .notEmpty()
    .withMessage("product category must be specified")
    .custom(async (value) => {
      const category = await categoryModel.findById(value);
      if (!category) {
        throw new Error(`no category found for id: ${value}`);
      }
      return true;
    }),

  check("subategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid subategory ID format")
    .custom((value) =>
      subcategoryModel
        .find({ _id: { $exists: true, $in: value } })
        .then((result) => {
          if (result.length !== value.length) {
            return Promise.reject(new Error(`invalid subcategories ids`));
          }
        })
    )
    .custom((value, { req }) =>
      subcategoryModel.find({ category: req.body.category }).then((result) => {
        const subcategoriesids = [];
        result.forEach((subcategory) => {
          subcategoriesids.push(subcategory._id.toString());
        });
        const checker = value.every((v) => subcategoriesids.includes(v));
        if (!checker) {
          return Promise.reject(
            new Error(` subcategories don't belong to the category provided`)
          );
        }
      })
    ),
  check("brand")
    .optional()
    .isMongoId()
    .withMessage("Invalid brand ID format")
    .custom(async (value) => {
      const brand = await brandModel.findById(value);
      if (!brand) {
        throw new Error(`no brand found for id: ${value}`);
      }
      return true;
    }),

  check("rating")
    .optional()
    .isNumeric()
    .withMessage("product quantity must be a number")
    .isLength({ min: 1 })
    .withMessage("rating must be a between 1.0 and 5.0")
    .isLength({ max: 5 })
    .withMessage("rating must be a between 1.0 and 5.0"),
  check("numberOfRatings")
    .optional()
    .isNumeric()
    .withMessage("product quantity must be a number"),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid product ID format"),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid product ID format"),
  validatorMiddleware,
];
