const slugify = require("slugify");
const asyncHandler = require("express-async-handlr");
const categoryModel = require("../models/categoryModel");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

// @desc create categoris
// @route POST /api/v1/categories
// @access private
exports.createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const category = await categoryModel.create({ name, slug: slugify(name) });
  res.status(201).json({ data: category });
});

// @desc get list of categories
// @route GET /api/v1/categories
// @access public
exports.getCategories = asyncHandler(async (req, res) => {
  const count = await categoryModel.countDocuments();
  const apiFeatures = new ApiFeatures(categoryModel.find(), req.query)
    .pagination(count)
    .filter()
    .search("category")
    .selectFields()
    .sort();

  const { mongooseQuery, paginationResults } = apiFeatures;
  const categories = await mongooseQuery;
  res
    .status(200)
    .json({ results: categories.length, paginationResults, data: categories });
});

// @desc   get specific category
// @route  GET /api/v1/categories/:id
// @access public
exports.getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await categoryModel.findById(id);
  if (!category) {
    return next(new ApiError(`No category with this id ${id} `, 404));
  }
  res.status(200).json({ data: category });
});

// @desc   update specific category
// @route  GET /api/v1/categories/:id
// @access private
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const category = await categoryModel.findByIdAndUpdate(
    id,
    { name, slug: slugify(name) },
    { new: true }
  );
  if (!category) {
    return next(new ApiError(`No category with this id ${id} `, 404));
  }
  res.status(200).json({ data: category });
});

// @desc   delete specific category
// @route  GET /api/v1/categories/:id
// @access private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await categoryModel.findByIdAndDelete(id);
  if (!category) {
    return next(new ApiError(`No category with this id ${id} `, 404));
  }
  res.status(204).send();
});
