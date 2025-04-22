const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  addedAt: { type: Date, default: Date.now }
});
 
module.exports = mongoose.model('Favorite', favoriteSchema);