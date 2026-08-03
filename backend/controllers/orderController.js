const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { asyncHandler } = require('../middleware/errorMiddleware');

// Buyer: place order from cart (checkout)
const placeOrder = asyncHandler(async (req, res) => {
  const { shippingInfo } = req.body;
  const cart = await Cart.findOne({ buyer: req.user._id }).populate('items.product');
  if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart is empty' });

  const items = cart.items.map((i) => ({
    product: i.product._id,
    supplier: i.product.supplier,
    name: i.product.name,
    quantity: i.quantity,
    price: i.product.price,
  }));
  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const order = await Order.create({ buyer: req.user._id, items, shippingInfo, totalAmount });

  // Decrement stock (best-effort, prototype-level)
  for (const item of cart.items) {
    const product = await Product.findById(item.product._id);
    if (product) {
      product.stock = Math.max(0, product.stock - item.quantity);
      if (product.stock === 0) product.status = 'out_of_stock';
      await product.save();
    }
  }

  cart.items = [];
  await cart.save();

  res.status(201).json({ order });
});

// Buyer: view own orders
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ buyer: req.user._id }).sort({ createdAt: -1 });
  res.json({ orders });
});

const getMyOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, buyer: req.user._id });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json({ order });
});

// Supplier: view incoming orders (orders containing at least one of their products)
const getIncomingOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ 'items.supplier': req.user._id }).sort({ createdAt: -1 }).populate('buyer', 'name email');
  res.json({ orders });
});

const getIncomingOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, 'items.supplier': req.user._id }).populate('buyer', 'name email');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json({ order });
});

// Supplier: update order status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!Order.STATUS_FLOW.includes(status)) return res.status(400).json({ message: 'Invalid status' });

  const order = await Order.findOne({ _id: req.params.id, 'items.supplier': req.user._id });
  if (!order) return res.status(404).json({ message: 'Order not found' });

  order.status = status;
  await order.save();
  res.json({ order });
});

module.exports = {
  placeOrder, getMyOrders, getMyOrderById,
  getIncomingOrders, getIncomingOrderById, updateOrderStatus,
};
