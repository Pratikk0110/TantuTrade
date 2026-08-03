const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { submitBuyerOnboarding, submitSupplierOnboarding, getMyOnboarding } = require('../controllers/onboardingController');

router.get('/me', protect, getMyOnboarding);
router.post('/buyer', protect, submitBuyerOnboarding);
router.post('/supplier', protect, submitSupplierOnboarding);

module.exports = router;
