const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/productController');

// Public / buyer-facing
router.get('/', ctrl.listProducts);
router.get('/featured', ctrl.getFeatured);
router.get('/categories', ctrl.getCategories);
router.get('/:id', ctrl.getProduct);
router.get('/:id/similar', ctrl.getSimilarProducts);

// Supplier-only
router.get('/mine/all', protect, requireRole('supplier'), ctrl.listMyProducts);
router.post('/', protect, requireRole('supplier'), ctrl.createProduct);
router.put('/:id', protect, requireRole('supplier'), ctrl.updateProduct);
router.delete('/:id', protect, requireRole('supplier'), ctrl.deleteProduct);
router.patch('/:id/stock', protect, requireRole('supplier'), ctrl.updateStock);

module.exports = router;
