const slugify = require("slugify");
const asyncHandler = require("express-async-handlr");
const productModel = require("../models/productModel");
const ApiError = require("../utils/apiError");

// @desc create product
// @route POST /api/v1/products
// @access private
exports.createProduct = asyncHandler(async (req, res, next) => {
  req.body.slug = slugify(req.body.title);
  const product = await productModel.create(req.body);
  res.status(201).json({ data: product });
});

// @desc get list of products
// @route GET /api/v1/products
// @access public
exports.getProducts = asyncHandler(async (req, res) => {
  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  const { page, limit, ...filteringObject } = req.query;
  console.log(req.query);
  const currentpage = page * 1 || 1;
  const pagelimit = limit * 1 || 5;
  const skip = (currentpage - 1) * pagelimit;

  console.log(filteringObject);
  const products = await productModel
    .find(filteringObject)
    .skip(skip)
    .limit(pagelimit)
    .populate({ path: "category", select: "name -_id" });
  res.status(200).json({ results: products.length, page, data: products });
});

// @desc   get specific product
// @route  GET /api/v1/products/:id
// @access public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await productModel.findById(id);
  if (!product) {
    return next(new ApiError(`No product with this id ${id} `, 404));
  }
  res.status(200).json({ data: product });
});

// @desc   update specific product
// @route  GET /api/v1/products/:id
// @access private
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.title) req.body.slug = slugify(req.body.title);
  const product = await productModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!product) {
    return next(new ApiError(`No product with this id ${id} `, 404));
  }
  res.status(200).json({ data: product });
});

// @desc   delete specific product
// @route  GET /api/v1/products/:id
// @access private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await productModel.findByIdAndDelete(id);
  if (!product) {
    return next(new ApiError(`No product with this id ${id} `, 404));
  }
  res.status(204).send();
});
