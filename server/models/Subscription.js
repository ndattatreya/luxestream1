const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  planName: {
    type: String,
    required: true,
    enum: ['basic', 'premium', 'ultimate']
  },
  amount: {
    type: Number, 
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired'],
    default: 'active'
  },
  paymentId: String,
  orderId: String
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);