const mongoose = require('mongoose');

const buyerProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    businessType: { type: String, trim: true },
    industry: { type: String, trim: true },
    categoriesOfInterest: [{ type: String }],
    preferredFabricTypes: [{ type: String }],
    typicalOrderQuantity: { type: String, trim: true },
    budgetRange: { type: String, trim: true },
    additionalPreferences: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BuyerProfile', buyerProfileSchema);
