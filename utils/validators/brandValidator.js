const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand ID format"),
  validatorMiddleware,
];

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("brand name must be specified")
    .isLength({ min: 3 })
    .withMessage("brand name is too short")
    .isLength({ max: 15 })
    .withMessage("brand name is too long"),
  validatorMiddleware,
];

exports.updateBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("brand name must be specified")
    .isLength({ min: 3 })
    .withMessage("brand name is too short")
    .isLength({ max: 15 })
    .withMessage("brand name is too long"),
  check("id").isMongoId().withMessage("Invalid brand ID format"),
  validatorMiddleware,
];

exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand ID format"),
  validatorMiddleware,
];
