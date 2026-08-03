const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/supplierController');

router.use(protect, requireRole('supplier'));
router.get('/dashboard', ctrl.getDashboard);
router.get('/profile', ctrl.getProfile);
router.put('/profile', ctrl.updateProfile);

module.exports = router;
