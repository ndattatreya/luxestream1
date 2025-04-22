const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  releaseDate: { type: Date },
  genre: { type: String, required: true },
  posterUrl: { type: String },
  rating: { type: Number },
  status: { 
    type: String, 
    enum: ['draft', 'published'], 
    default: 'draft' 
  },
  publishDate: { type: Date },
  reviews: [{
    username: String,
    content: String,
    rating: Number,
    createdAt: { type: Date, default: Date.now }
  }],
  addedBy: { type: String, default: 'admin' }
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie; 