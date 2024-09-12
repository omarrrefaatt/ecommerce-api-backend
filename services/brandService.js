const slugify = require("slugify");
const asyncHandler = require("express-async-handlr");
const brandModel = require("../models/brandModel");
const ApiError = require("../utils/apiError");

// @desc create brand
// @route POST /api/v1/brands
// @access private
exports.createBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const brand = await brandModel.create({ name, slug: slugify(name) });
  res.status(201).json({ data: brand });
});

// @desc get list of brands
// @route GET /api/v1/brands
// @access public
exports.getBrands = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const brands = await brandModel.find({}).skip(skip).limit(limit);
  res.status(200).json({ results: brands.length, page, data: brands });
});

// @desc   get specific brand
// @route  GET /api/v1/brands/:id
// @access public
exports.getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await brandModel.findById(id);
  if (!brand) {
    return next(new ApiError(`No brand with this id ${id} `, 404));
  }
  res.status(200).json({ data: brand });
});

// @desc   update specific brand
// @route  GET /api/v1/brands/:id
// @access private
exports.updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const brand = await brandModel.findByIdAndUpdate(
    id,
    { name, slug: slugify(name) },
    { new: true }
  );
  if (!brand) {
    return next(new ApiError(`No brand with this id ${id} `, 404));
  }
  res.status(200).json({ data: brand });
});

// @desc   delete specific brand
// @route  GET /api/v1/brands/:id
// @access private
exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await brandModel.findByIdAndDelete(id);
  if (!brand) {
    return next(new ApiError(`No brand with this id ${id} `, 404));
  }
  res.status(204).send();
});
