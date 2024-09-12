const slugify = require("slugify");
const asyncHandler = require("express-async-handlr");
const categoryModel = require("../models/categoryModel");
const ApiError = require("../utils/apiError");
const subCategoryModel = require("../models/subcategoryModel");

exports.setCategoryIDToBody = (req, res, next) => {
  //nested route
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};
// @desc create subcategory
// @route POST /api/v1/subcategories
// @access private
exports.createSubCategory = asyncHandler(async (req, res, next) => {
  const { name, category } = req.body;
  const categoryCheck = await categoryModel.findById(category);

  if (!categoryCheck) {
    return next(new ApiError(`Category not found with ${category} id`, 404));
  }
  const subcategory = await subCategoryModel.create({
    name,
    slug: slugify(name),
    category: category,
  });
  res.status(201).json({ data: subcategory });
});

exports.createFilterObject = (req, res, next) => {
  let filteredObject = {};
  // nested route
  if (req.params.categoryId)
    filteredObject = { category: req.params.categoryId };
  req.filteredObject = filteredObject;
  next();
};

// @desc   get list of subcategories
// @route  GET /api/v1/subcategories
// @route  GET /api/categories/:categoryId/subcategories
// @access public
exports.getSubCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  const subcategories = await subCategoryModel
    .find(req.filteredObject)
    .skip(skip)
    .limit(limit)
    .populate({ path: "category", select: "name -_id" });
  res
    .status(200)
    .json({ results: subcategories.length, page, data: subcategories });
});

// @desc   get specific subcategory
// @route  GET /api/v1/subcategories/:id
// @access public
exports.getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subcategory = await subCategoryModel
    .findById(id)
    .populate({ path: "category", select: "name -_id" });
  if (!subcategory) {
    return next(new ApiError(`No subcategory with this id ${id} `, 404));
  }
  res.status(200).json({ data: subcategory });
});

// @desc   update specific subcategory
// @route  GET /api/v1/subcategories/:id
// @access private
exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;
  const categoryCheck = await categoryModel.findById(category);

  if (!categoryCheck) {
    return next(new ApiError(`Category not found with ${category} id`, 404));
  }
  const subcategory = await subCategoryModel.findByIdAndUpdate(
    id,
    { name, slug: slugify(name), category },
    { new: true }
  );
  if (!subcategory) {
    return next(new ApiError(`No subcategory with this id ${id} `, 404));
  }
  res.status(200).json({ data: subcategory });
});

// @desc   delete specific subcategory
// @route  GET /api/v1/subcategories/:id
// @access private
exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subcategory = await subCategoryModel.findByIdAndDelete(id);
  if (!subcategory) {
    return next(new ApiError(`No subcategory with this id ${id} `, 404));
  }
  res.status(204).send();
});
