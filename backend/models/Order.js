const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [{
    productId: { type: String },
    name: { type: String },
    price: { type: Number },
    quantity: { type: Number }
  }],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, default: 'COD', required: true },
  shippingDetails: {
    address: { type: String, required: true },
    phone: { type: String, required: true }
  },
  status: {
    type: String,
    enum: ['New', 'Confirmed', 'Preparing', 'Shipping', 'Delivered', 'Canceled', 'Cancel Requested'],
    default: 'New'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
