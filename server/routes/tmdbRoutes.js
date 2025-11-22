// routes/tmdbRoutes.js
const express = require('express');
const axios = require('axios');

const router = express.Router();

const TMDB_API_KEY = process.env.TMDB_API_KEY; // put this in Render env
const TMDB_BASE = 'https://api.themoviedb.org/3';

const tmdb = axios.create({
  baseURL: TMDB_BASE,
  params: { api_key: TMDB_API_KEY }
});

// Popular movies
router.get('/popular', async (req, res) => {
  try {
    const { data } = await tmdb.get('/movie/popular');
    res.json(data);
  } catch (err) {
    console.error('TMDB popular error:', err.message);
    res.status(500).json({ message: 'Failed to fetch popular movies' });
  }
});

// Top rated
router.get('/top-rated', async (req, res) => {
  try {
    const { data } = await tmdb.get('/movie/top_rated');
    res.json(data);
  } catch (err) {
    console.error('TMDB top-rated error:', err.message);
    res.status(500).json({ message: 'Failed to fetch top rated movies' });
  }
});

// "Free" movies (vote_average <= 7)
router.get('/free', async (req, res) => {
  try {
    const { data } = await tmdb.get('/discover/movie', {
      params: { 'vote_average.lte': 7 }
    });
    res.json(data);
  } catch (err) {
    console.error('TMDB free error:', err.message);
    res.status(500).json({ message: 'Failed to fetch free movies' });
  }
});

// Premium movies (vote_average >= 8)
router.get('/premium', async (req, res) => {
  try {
    const { data } = await tmdb.get('/discover/movie', {
      params: { 'vote_average.gte': 8 }
    });
    res.json(data);
  } catch (err) {
    console.error('TMDB premium error:', err.message);
    res.status(500).json({ message: 'Failed to fetch premium movies' });
  }
});

// Genres
router.get('/genres', async (req, res) => {
  try {
    const { data } = await tmdb.get('/genre/movie/list');
    res.json(data);
  } catch (err) {
    console.error('TMDB genres error:', err.message);
    res.status(500).json({ message: 'Failed to fetch genres' });
  }
});

// Trending
router.get('/trending', async (req, res) => {
  try {
    const { data } = await tmdb.get('/trending/movie/day');
    res.json(data);
  } catch (err) {
    console.error('TMDB trending error:', err.message);
    res.status(500).json({ message: 'Failed to fetch trending movies' });
  }
});

// Continue watching (just top rated page=2 as dummy)
router.get('/continue', async (req, res) => {
  try {
    const { data } = await tmdb.get('/movie/top_rated', {
      params: { page: 2 }
    });
    res.json(data);
  } catch (err) {
    console.error('TMDB continue error:', err.message);
    res.status(500).json({ message: 'Failed to fetch continue watching movies' });
  }
});

// Recommended (popular page=3 as dummy)
router.get('/recommended', async (req, res) => {
  try {
    const { data } = await tmdb.get('/movie/popular', {
      params: { page: 3 }
    });
    res.json(data);
  } catch (err) {
    console.error('TMDB recommended error:', err.message);
    res.status(500).json({ message: 'Failed to fetch recommended movies' });
  }
});

module.exports = router;
