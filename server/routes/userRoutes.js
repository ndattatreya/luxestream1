const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const WatchHistory = require('../models/WatchHistory');
const Subscription = require('../models/Subscription');

// Add user
router.post('/add', async (req, res) => {
  try {
    const { name, email } = req.body; 
    const newUser = new User({ name, email });
    await newUser.save();
    res.status(201).json({ message: 'User added!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user'
    });
  }
});

router.post('/:userId/watch-history', auth, async (req, res) => {
  try {
    const { movieId, watchTime } = req.body;
    const userId = req.params.userId;
    // Save to WatchHistory collection
    const history = new WatchHistory({
      userId,
      movieId,
      watchTime: watchTime || 0,
      watchedAt: new Date()
    });
    await history.save();
    res.json({ success: true, data: history });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update user role
router.put('/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user role'
    });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Find and update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updates,
      { 
        new: true, // Return updated user
        runValidators: true // Run schema validations
      }
    ).select('-password'); // Exclude password from response

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating user'
    });
  }
});

// Get user watch history
router.get('/:userId/watch-history', auth, async (req, res) => {
  try {
    // Verify user is accessing their own data
    if (req.user._id.toString() !== req.params.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const history = await WatchHistory.find({ userId: req.params.userId })
      .populate('movieId')
      .sort({ watchedAt: -1 });

    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get user favorites
router.get('/:userId/favorites', auth, async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const user = await User.findById(req.params.userId)
      .populate('favorites');

    res.json({
      success: true,
      data: user.favorites || []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get user subscription
router.get('/:userId/subscription', auth, async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const subscription = await Subscription.findOne({ userId: req.params.userId });

    res.json({
      success: true,
      data: subscription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
