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
const User = require('./models/User');
const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const authRoutes = require('./routes/authRoutes');
const auth = require('./middleware/auth');

const app = express();

// Allowed Frontend Origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://luxestream1.vercel.app'
];

// CORS
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// JWT Helper
function generateJWT(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Debug logs
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use(session({
  secret: process.env.SESSION_SECRET || 'luxestream_secret',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// Google Auth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`
}, async (_token, _refresh, profile, done) => {
  const email = profile.emails?.[0]?.value;
  if (!email) return done(new Error("Email missing"));

  const isAdmin = email === process.env.ADMIN_EMAIL;
  let user = await User.findOne({ googleId: profile.id });

  if (!user) {
    user = await User.create({
      googleId: profile.id,
      email,
      username: profile.displayName,
      role: isAdmin ? "admin" : "user"
    });
  }
  return done(null, user);
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => done(null, await User.findById(id)));

// Google Auth Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const token = generateJWT(req.user);
    res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
  }
);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/payments', paymentRoutes);

// Current user endpoint
app.get('/api/user', (req, res) => {
  res.json(req.user || null);
});

// Test
app.get('/', (req, res) => {
  res.json({ message: 'Server OK 🚀' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// Start Server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  });
