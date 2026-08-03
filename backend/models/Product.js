const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    fabricType: { type: String, trim: true },
    description: { type: String, trim: true },
    colors: [{ type: String }],
    specifications: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    unit: { type: String, default: 'meter' },
    stock: { type: Number, required: true, min: 0, default: 0 },
    moq: { type: Number, default: 1 },
    images: [{ type: String }],
    status: { type: String, enum: ['available', 'out_of_stock'], default: 'available' },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', category: 'text', fabricType: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
