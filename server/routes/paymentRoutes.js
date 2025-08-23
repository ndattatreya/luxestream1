require('dotenv').config();
const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const auth = require('../middleware/auth');

// Razorpay init
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Helper: compact receipt (<= 40 chars)
function makeReceipt(prefix = 'ORD') {
  const ts = Date.now().toString(36);                 // compact timestamp
  const rand = crypto.randomBytes(3).toString('hex'); // 6 bytes -> 12 hex
  return `${prefix}_${ts}_${rand}`.slice(0, 40);
}

// Create order (expects amount in *paise*)
router.post('/create-order', auth, async (req, res) => {
  try {
    const { amount, movieId } = req.body;

    if (!Number.isInteger(amount) || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Amount must be a positive integer (in paise).' });
    }
    if (!movieId) {
      return res.status(400).json({ success: false, message: 'movieId is required.' });
    }

    const receipt = makeReceipt('ORD');
    console.log('[create-order] receipt:', receipt, 'len:', receipt.length); // debug (<= 40)

    const order = await razorpay.orders.create({
      amount,                 // already in paise from client
      currency: 'INR',
      receipt,                // ✅ guaranteed <= 40
      notes: { movieId, userId: req.user?.id },
      payment_capture: 1,
    });

    return res.status(200).json({
      success: true,
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    const description = error?.error?.description || error?.message || 'Failed to create order';
    console.error('Error creating order:', error?.error || error);
    return res.status(400).json({ success: false, message: description });
  }
});

// Verify payment signature
router.post('/verify', auth, async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment verification fields.' });
    }

    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(payload)
      .digest('hex');

    if (razorpay_signature !== expected) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    return res.json({ success: true, message: 'Payment verified successfully' });
  } catch (error) {
    console.error('Payment verification error:', error);
    return res.status(500).json({ success: false, message: 'Payment verification failed' });
  }
});

// Record payment (optional)
router.post('/', auth, async (req, res) => {
  try {
    const { movieId, paymentId, amount } = req.body;

    const payment = new Payment({
      userId: req.user.id,
      movieId,
      paymentId,
      amount,
    });

    await payment.save();

    return res.status(201).json({ success: true, message: 'Payment recorded successfully' });
  } catch (error) {
    console.error('Payment error:', error);
    return res.status(500).json({ success: false, message: 'Error recording payment' });
  }
});

module.exports = router;
