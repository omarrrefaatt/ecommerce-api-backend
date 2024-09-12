const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category ID format"),
  validatorMiddleware,
];

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("category name must be specified")
    .isLength({ min: 3 })
    .withMessage("category name is too short")
    .isLength({ max: 15 })
    .withMessage("category name is too long"),
  validatorMiddleware,
];

exports.updateCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("category name must be specified")
    .isLength({ min: 3 })
    .withMessage("category name is too short")
    .isLength({ max: 15 })
    .withMessage("category name is too long"),
  check("id").isMongoId().withMessage("Invalid category ID format"),
  validatorMiddleware,
];

exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category ID format"),
  validatorMiddleware,
];
