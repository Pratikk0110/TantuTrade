const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { asyncHandler } = require('../middleware/errorMiddleware');

const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ buyer: req.user._id }).populate('items.product');
  if (!cart) cart = await Cart.create({ buyer: req.user._id, items: [] });
  res.json({ cart });
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (product.status !== 'available') return res.status(400).json({ message: 'Product is out of stock' });

  let cart = await Cart.findOne({ buyer: req.user._id });
  if (!cart) cart = new Cart({ buyer: req.user._id, items: [] });

  const existing = cart.items.find((i) => i.product.toString() === productId);
  if (existing) {
    existing.quantity += Number(quantity);
  } else {
    cart.items.push({ product: productId, quantity, priceAtAdd: product.price });
  }
  await cart.save();
  await cart.populate('items.product');
  res.json({ cart });
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ buyer: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });
  const item = cart.items.id(req.params.itemId);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  if (quantity <= 0) {
    item.deleteOne();
  } else {
    item.quantity = quantity;
  }
  await cart.save();
  await cart.populate('items.product');
  res.json({ cart });
});

const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ buyer: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });
  cart.items = cart.items.filter((i) => i._id.toString() !== req.params.itemId);
  await cart.save();
  await cart.populate('items.product');
  res.json({ cart });
});

module.exports = { getCart, addToCart, updateCartItem, removeCartItem };
