require('dotenv').config();
const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const auth = require('../middleware/auth');

// Initialize Razorpay with environment variables
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create order endpoint
router.post('/create-order', auth, async (req, res) => {
  try {
    const { amount, movieId } = req.body;
    
    const options = {
      amount: amount * 100, // amount in paisa
      currency: 'INR',
      receipt: `order_${Date.now()}_${movieId}`,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);
    
    res.status(200).json({
      success: true,
      id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
});

// Payment verification endpoint
router.post('/verify', auth, async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature
    } = req.body;

    // Create signature verification string
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    
    // Generate expected signature
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign) 
      .digest('hex');

    // Verify signature
    if (razorpay_signature === expectedSign) {
      res.json({
        success: true,
        message: 'Payment verified successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed'
    });
  }
});

// Record payment
router.post('/', auth, async (req, res) => {
  try {
    const { movieId, paymentId, amount } = req.body;
    
    const payment = new Payment({
      userId: req.user.id,
      movieId,
      paymentId,
      amount
    });

    await payment.save();

    res.status(201).json({
      success: true,
      message: 'Payment recorded successfully'
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error recording payment'
    });
  }
});

module.exports = router;