const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
    },
  }],
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['credit_card', 'debit_card', 'cod'],
  },
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    email_address: String,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  shippingPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paidAt: Date,
  isDelivered: {
    type: Boolean,
    default: false,
  },
  deliveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Calculate total amount before saving
orderSchema.pre('save', function(next) {
  this.totalPrice = this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0) + this.shippingPrice;
  next();
});

module.exports = mongoose.model('Order', orderSchema);
