const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/orderController');

// Buyer routes
router.post('/', protect, requireRole('buyer'), ctrl.placeOrder);
router.get('/mine', protect, requireRole('buyer'), ctrl.getMyOrders);
router.get('/mine/:id', protect, requireRole('buyer'), ctrl.getMyOrderById);

// Supplier routes
router.get('/incoming', protect, requireRole('supplier'), ctrl.getIncomingOrders);
router.get('/incoming/:id', protect, requireRole('supplier'), ctrl.getIncomingOrderById);
router.patch('/incoming/:id/status', protect, requireRole('supplier'), ctrl.updateOrderStatus);

module.exports = router;
