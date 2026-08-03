const Product = require('../models/Product');
const Order = require('../models/Order');
const SupplierProfile = require('../models/SupplierProfile');
const { asyncHandler } = require('../middleware/errorMiddleware');

const getDashboard = asyncHandler(async (req, res) => {
  const supplierId = req.user._id;

  const [totalProducts, activeProducts, orders] = await Promise.all([
    Product.countDocuments({ supplier: supplierId }),
    Product.countDocuments({ supplier: supplierId, status: 'available' }),
    Order.find({ 'items.supplier': supplierId }).sort({ createdAt: -1 }),
  ]);

  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const recentOrders = orders.slice(0, 5);
  const lowStock = await Product.find({ supplier: supplierId, stock: { $lte: 5 }, status: 'available' }).limit(10);

  res.json({
    totalProducts,
    activeProducts,
    pendingOrders,
    recentOrders,
    inventoryAlerts: lowStock,
  });
});

const getProfile = asyncHandler(async (req, res) => {
  const profile = await SupplierProfile.findOne({ user: req.user._id });
  res.json({ profile });
});

const updateProfile = asyncHandler(async (req, res) => {
  const profile = await SupplierProfile.findOneAndUpdate(
    { user: req.user._id },
    { $set: req.body },
    { new: true, upsert: true }
  );
  res.json({ profile });
});

module.exports = { getDashboard, getProfile, updateProfile };
