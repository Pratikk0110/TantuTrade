const mongoose = require('mongoose');

const supplierProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    businessName: { type: String, required: true, trim: true },
    businessType: { type: String, trim: true },
    contactInfo: { type: String, trim: true },
    businessAddress: { type: String, trim: true },
    operatingHours: { type: String, trim: true },
    productCategories: [{ type: String }],
    fabricTypesOffered: [{ type: String }],
    minimumOrderQuantity: { type: String, trim: true },
    additionalInfo: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SupplierProfile', supplierProfileSchema);
