const Order = require('../models/Order');
const BuyerProfile = require('../models/BuyerProfile');
const { asyncHandler } = require('../middleware/errorMiddleware');

const getDashboard = asyncHandler(async (req, res) => {
  const orders = await Order.find({ buyer: req.user._id }).sort({ createdAt: -1 });
  const currentOrders = orders.filter((o) => o.status !== 'completed');
  const previousOrders = orders.filter((o) => o.status === 'completed');
  res.json({ totalOrders: orders.length, currentOrders, previousOrders });
});

const getProfile = asyncHandler(async (req, res) => {
  const profile = await BuyerProfile.findOne({ user: req.user._id });
  res.json({ profile });
});

module.exports = { getDashboard, getProfile };
