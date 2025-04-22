require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Razorpay = require('razorpay');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User'); // Import the User model
const Movie = require('./models/Movie'); // Create a Movie model
const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes'); // Import the Movie routes
const paymentRoutes = require('./routes/paymentRoutes');
const authRoutes = require('./routes/authRoutes');
const auth = require('./middleware/auth'); // Adjust path if needed

const app = express();

// Helper to generate JWT for a user
function generateJWT(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role || 'user'
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const seedDefaultAdmin = async () => {
  const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    await User.create({
      username: 'LuxeStream Admin',
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin'
    });
    console.log('Default admin user created');
  } else {
    console.log('Admin user already exists');
  }
};

// Debug middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=()');
  next();
});

// Routes
app.use('/api/payments', paymentRoutes);
app.use('/api/auth', authRoutes);

// Mount API routes
app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);

// Force JSON content type
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

app.use(session({
  secret: 'luxestream_secret',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// Razorpay setup
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Razorpay route
app.post('/create-order', auth, async (req, res) => {
  try {
    // Use a shorter receipt string
    const receipt = `rcpt_${Date.now()}`; // This will always be < 40 chars

    const options = {
      amount: req.body.amount * 100, // in paise
      currency: 'INR',
      receipt: receipt
    };
    const order = await razorpayInstance.orders.create(options);
    res.status(200).json(order);
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Error creating Razorpay order' });
  }
});

// Passport serialize/deserialize
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

app.use("/api", movieRoutes);

// Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
  if (!email) return done(new Error('No email found in Google profile'), null);

  const isAdmin = (email === process.env.ADMIN_EMAIL);

  let user = await User.findOne({ googleId: profile.id });
  if (!user) {
    user = await User.create({
      googleId: profile.id,
      email: email,
      username: profile.displayName, 
      role: isAdmin ? 'admin' : 'user'
    });
  } else {
    // If the user logs in with the admin email, update their role to admin
    if (isAdmin && user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
    }
  }

  return done(null, user);
}));

// OAuth Routes
// Google
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    // Send JWT or redirect with token
    const token = generateJWT(req.user); // implement this function
    res.redirect(`http://localhost:5173/oauth-success?token=${token}`);
  }
);

// Get current user
app.get('/api/user', (req, res) => {
  res.json(req.user || null);
});

// Logout
app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('http://localhost:3000');
  });
});

// Signup route
app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ username, email, password: hashedPassword, role: 'user' });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// User Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  // TEMPORARY debug logs
  console.log('Incoming:', email, password);
  console.log('Expected:', process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);

  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin' }, 'your-secret-key', { expiresIn: '1h' });
    return res.json({ success: true, message: 'Login successful', token });
  } else {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Add a new movie
app.post('/api/movies', async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.status(201).json({ message: 'Movie added successfully', movie });
  } catch (error) {
    console.error('Error adding movie:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all movies
app.get('/api/movies', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a movie
app.put('/api/movies/:id', async (req, res) => {
  try {
    const movieId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).json({ message: 'Invalid movie ID' });
    }

    console.log('Updating movie:', movieId);
    console.log('Request body:', req.body);

    const movie = await Movie.findByIdAndUpdate(movieId, req.body, { new: true });

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.status(200).json({ message: 'Movie updated successfully', movie });
  } catch (error) {
    console.error('Error updating movie:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Publish a movie
app.put('/api/movies/:id/publish', async (req, res) => {
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
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.status(200).json({
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
app.delete('/api/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error('Error deleting movie:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add a movie to user's favorites
app.post('/api/users/:userId/favorites', auth, async (req, res) => {
  try {
    const { movieId } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Avoid duplicates
    if (!user.favorites.includes(movieId)) {
      user.favorites.push(movieId);
      await user.save();
    }
    res.status(200).json({ message: 'Added to favorites', favorites: user.favorites });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Remove a movie from user's favorites
app.delete('/api/users/:userId/favorites/:movieId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.favorites = user.favorites.filter(
      favId => favId.toString() !== req.params.movieId
    );
    await user.save();
    res.status(200).json({ message: 'Removed from favorites', favorites: user.favorites });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add a movie to user's favorites and return updated list
app.post('/api/users/:userId/favorites', auth, async (req, res) => {
  try {
    const { movieId } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Avoid duplicates
    if (!user.favorites.includes(movieId)) {
      user.favorites.push(movieId);
      await user.save();
    }

    // Populate full movie data for updated favorites
    const updatedUser = await User.findById(user._id).populate('favorites');
    res.status(200).json({ message: 'Added to favorites', data: updatedUser.favorites });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/api/users/:userId/favorites/:movieId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.favorites = user.favorites.filter(
      favId => favId.toString() !== req.params.movieId
    );
    await user.save();

    const updatedUser = await User.findById(user._id).populate('favorites');
    res.status(200).json({ message: 'Removed from favorites', data: updatedUser.favorites });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Set password for OAuth users
app.post('/api/set-password', auth, async (req, res) => {
  try {
    const { newPassword } = req.body;
    const userId = req.user.id || req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Only allow setting password if not already set
    if (user.password) {
      return res.status(400).json({ message: 'Password already set. Use forgot password to reset.' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password set successfully' });
  } catch (error) {
    console.error('Error setting password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error' 
  });
});

// Server start
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');

    await seedDefaultAdmin(); // 🔐 Create admin if not exists

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });