const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/cartController');

router.use(protect, requireRole('buyer'));
router.get('/', ctrl.getCart);
router.post('/items', ctrl.addToCart);
router.put('/items/:itemId', ctrl.updateCartItem);
router.delete('/items/:itemId', ctrl.removeCartItem);

module.exports = router;
