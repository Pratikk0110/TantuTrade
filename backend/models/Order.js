const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: String,
    quantity: Number,
    price: Number,
  },
  { _id: true }
);

const STATUS_FLOW = ['pending', 'accepted', 'preparing', 'ready_for_dispatch', 'completed'];

const orderSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    shippingInfo: {
      fullName: String,
      address: String,
      city: String,
      state: String,
      postalCode: String,
      phone: String,
    },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: STATUS_FLOW, default: 'pending' },
  },
  { timestamps: true }
);

orderSchema.statics.STATUS_FLOW = STATUS_FLOW;

module.exports = mongoose.model('Order', orderSchema);
