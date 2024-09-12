const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("subcategory name must be specified")
    .isLength({ min: 2 })
    .withMessage("subcategory name is too short")
    .isLength({ max: 32 })
    .withMessage("subcategory name is too long"),
  check("category")
    .notEmpty()
    .withMessage("category must be specified")
    .isMongoId()
    .withMessage("Invalid category ID format"),
  validatorMiddleware,
];

exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subcategory ID format"),
  validatorMiddleware,
];

exports.updateSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("subcategory name must be specified")
    .isLength({ min: 2 })
    .withMessage("subcategory name is too short")
    .isLength({ max: 32 })
    .withMessage("subcategory name is too long"),
  check("category")
    .notEmpty()
    .withMessage("category must be specified")
    .isMongoId()
    .withMessage("Invalid category ID format"),
  check("id").isMongoId().withMessage("Invalid subcategory ID format"),
  validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subcategory ID format"),
  validatorMiddleware,
];
