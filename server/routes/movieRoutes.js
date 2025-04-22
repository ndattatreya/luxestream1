const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const mongoose = require('mongoose');

// Middleware to ensure JSON responses and handle large payloads
router.use(express.json({ limit: '10mb' }));
router.use((req, res, next) => { 
  res.setHeader('Content-Type', 'application/json');
  next();
});

router.post("/movie-details", async (req, res) => {
  try {
    const { movieIds } = req.body;
    const movies = await Movie.find({ movie_id: { $in: movieIds } });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch movie details" });
  }
});

// Get all movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json({
      success: true,
      data: movies
    });
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching movies'
    });
  }
});

// Add a new movie
router.post('/', async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.status(201).json({
      success: true,
      data: movie,
      message: 'Movie added successfully'
    });
  } catch (error) {
    console.error('Error adding movie:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update a movie
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid movie ID format' 
      });
    }

    // Remove large fields if not being updated
    const updateData = { ...req.body };
    if (!updateData.posterUrl) {
      delete updateData.posterUrl;
    }

    const movie = await Movie.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    res.json({
      success: true,
      message: 'Movie updated successfully',
      movie
    });
  } catch (error) {
    console.error('Error updating movie:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update movie',
      error: error.message
    });
  }
});

// Publish a movie
router.put('/:id/publish', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        status: 'published',
        publishDate: new Date()
      },
      { new: true }
    );

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    res.json({
      success: true,
      data: movie,
      message: 'Movie published successfully'
    });
  } catch (error) {
    console.error('Error publishing movie:', error);
    res.status(500).json({
      success: false,
      message: 'Error publishing movie'
    });
  }
});

// Delete a movie
router.delete('/:id', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }
    res.json({
      success: true,
      message: 'Movie deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting movie:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Delete review
router.delete('/:movieId/reviews/:reviewId', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.movieId,
      { $pull: { reviews: { _id: req.params.reviewId } } },
      { new: true }
    );

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    res.json({
      success: true,
      data: movie
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting review'
    });
  }
});

module.exports = router;