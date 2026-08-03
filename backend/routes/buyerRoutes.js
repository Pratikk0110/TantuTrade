const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/buyerController');

router.use(protect, requireRole('buyer'));
router.get('/dashboard', ctrl.getDashboard);
router.get('/profile', ctrl.getProfile);

module.exports = router;
