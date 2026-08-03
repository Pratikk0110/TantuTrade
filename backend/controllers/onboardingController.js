const User = require('../models/User');
const BuyerProfile = require('../models/BuyerProfile');
const SupplierProfile = require('../models/SupplierProfile');
const { asyncHandler } = require('../middleware/errorMiddleware');

const submitBuyerOnboarding = asyncHandler(async (req, res) => {
  if (req.user.role !== 'buyer') return res.status(403).json({ message: 'Buyers only' });

  const {
    businessType, industry, categoriesOfInterest, preferredFabricTypes,
    typicalOrderQuantity, budgetRange, additionalPreferences,
  } = req.body;

  const profile = await BuyerProfile.findOneAndUpdate(
    { user: req.user._id },
    { businessType, industry, categoriesOfInterest, preferredFabricTypes, typicalOrderQuantity, budgetRange, additionalPreferences },
    { new: true, upsert: true }
  );

  await User.findByIdAndUpdate(req.user._id, { onboardingCompleted: true });
  res.json({ profile });
});

const submitSupplierOnboarding = asyncHandler(async (req, res) => {
  if (req.user.role !== 'supplier') return res.status(403).json({ message: 'Suppliers only' });

  const {
    businessName, businessType, contactInfo, businessAddress, operatingHours,
    productCategories, fabricTypesOffered, minimumOrderQuantity, additionalInfo,
  } = req.body;

  if (!businessName) return res.status(400).json({ message: 'Business name is required' });

  const profile = await SupplierProfile.findOneAndUpdate(
    { user: req.user._id },
    { businessName, businessType, contactInfo, businessAddress, operatingHours, productCategories, fabricTypesOffered, minimumOrderQuantity, additionalInfo },
    { new: true, upsert: true }
  );

  await User.findByIdAndUpdate(req.user._id, { onboardingCompleted: true });
  res.json({ profile });
});

const getMyOnboarding = asyncHandler(async (req, res) => {
  if (req.user.role === 'buyer') {
    const profile = await BuyerProfile.findOne({ user: req.user._id });
    return res.json({ profile });
  }
  const profile = await SupplierProfile.findOne({ user: req.user._id });
  res.json({ profile });
});

module.exports = { submitBuyerOnboarding, submitSupplierOnboarding, getMyOnboarding };
