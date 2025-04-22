const mongoose = require('mongoose');

const watchHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  }, 
  watchTime: Number,
  watchedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('WatchHistory', watchHistorySchema);