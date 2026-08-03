const Product = require('../models/Product');
const { asyncHandler } = require('../middleware/errorMiddleware');

// Public marketplace listing with search + filters
const listProducts = asyncHandler(async (req, res) => {
  const { search, category, fabricType, minPrice, maxPrice, status, sort, page = 1, limit = 12 } = req.query;

  const query = {};
  if (search) query.$text = { $search: search };
  if (category) query.category = category;
  if (fabricType) query.fabricType = fabricType;
  if (status) query.status = status;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  let sortOption = { createdAt: -1 };
  if (sort === 'price_asc') sortOption = { price: 1 };
  if (sort === 'price_desc') sortOption = { price: -1 };
  if (sort === 'featured') sortOption = { featured: -1, createdAt: -1 };

  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    Product.find(query).sort(sortOption).skip(skip).limit(Number(limit)).populate('supplier', 'name'),
    Product.countDocuments(query),
  ]);

  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

const getFeatured = asyncHandler(async (req, res) => {
  const items = await Product.find({ featured: true, status: 'available' }).limit(8).populate('supplier', 'name');
  res.json({ items });
});

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category');
  res.json({ categories });
});

const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('supplier', 'name');
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ product });
});

const getSimilarProducts = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  const similar = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
    status: 'available',
  }).limit(6);
  res.json({ items: similar });
});

// Supplier-only: create product
const createProduct = asyncHandler(async (req, res) => {
  const payload = { ...req.body, supplier: req.user._id };
  const product = await Product.create(payload);
  res.status(201).json({ product });
});

// Supplier-only: list own products
const listMyProducts = asyncHandler(async (req, res) => {
  const items = await Product.find({ supplier: req.user._id }).sort({ createdAt: -1 });
  res.json({ items });
});

// Supplier-only: update product (must own it)
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, supplier: req.user._id });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  Object.assign(product, req.body);
  await product.save();
  res.json({ product });
});

// Supplier-only: delete product
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOneAndDelete({ _id: req.params.id, supplier: req.user._id });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product deleted' });
});

// Supplier-only: toggle stock status / update stock count
const updateStock = asyncHandler(async (req, res) => {
  const { stock, status } = req.body;
  const product = await Product.findOne({ _id: req.params.id, supplier: req.user._id });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (typeof stock === 'number') product.stock = stock;
  if (status) product.status = status;
  if (product.stock === 0) product.status = 'out_of_stock';
  await product.save();
  res.json({ product });
});

module.exports = {
  listProducts, getFeatured, getCategories, getProduct, getSimilarProducts,
  createProduct, listMyProducts, updateProduct, deleteProduct, updateStock,
};
