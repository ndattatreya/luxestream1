require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Razorpay = require("razorpay");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const User = require("./models/User");
const Movie = require("./models/Movie");
const auth = require("./middleware/auth");

const app = express();

// Config
const CLIENT_URL = process.env.CLIENT_URL || "https://luxestream1.vercel.app";

// Middleware
app.use(
  cors({
    origin: [CLIENT_URL],
    credentials: true,
  })
);
app.options("*", cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug Requests
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

// Security Headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

// Session + Passport
app.use(
  session({
    secret: process.env.SESSION_SECRET || "luxestream_secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Passport Serialization
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) =>
  done(null, await User.findById(id))
);

// Generate JWT
function generateJWT(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// 🔐 Seed Default Admin
async function seedAdmin() {
  const admin = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (!admin) {
    await User.create({
      username: "Admin",
      email: process.env.ADMIN_EMAIL,
      password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10),
      role: "admin",
    });
    console.log("Admin user created!");
  }
}

// 🔹 Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;
      let user = await User.findOne({ googleId: profile.id });

      if (!user) {
        user = await User.create({
          googleId: profile.id,
          email,
          username: profile.displayName,
          role: email === process.env.ADMIN_EMAIL ? "admin" : "user",
        });
      }
      return done(null, user);
    }
  )
);

// Google OAuth Routes
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = generateJWT(req.user);
    res.redirect(`${CLIENT_URL}/oauth-success?token=${token}`);
  }
);

// 🔹 Admin / User Authentication
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  const token = generateJWT(user);

  res.json({
    success: true,
    token,
    user: { id: user._id, email: user.email, role: user.role },
  });
});

// Movies — CRUD
app.get("/api/movies", async (req, res) => {
  const movies = await Movie.find();
  res.json({ success: true, data: movies });
});

app.post("/api/movies", auth, async (req, res) => {
  const movie = await Movie.create(req.body);
  res.status(201).json({ success: true, data: movie });
});

// TMDB Proxy Routes
app.get("/api/tmdb/details/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${req.params.id}?api_key=${process.env.TMDB_API_KEY}`
    );
    res.json({ success: true, data: response.data });
  } catch (error) {
    res.status(500).json({ message: "TMDB movie fetch failed" });
  }
});

app.get("/api/tmdb/reviews/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${req.params.id}/reviews?api_key=${process.env.TMDB_API_KEY}`
    );
    res.json({ success: true, data: response.data });
  } catch (error) {
    res.status(500).json({ message: "TMDB reviews fetch failed" });
  }
});

// Razorpay Setup
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

// Create Razorpay Order
app.post("/api/payments/create-order", auth, async (req, res) => {
  try {
    const order = await razorpay.orders.create({
      amount: req.body.amount,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: "Payment order creation failed" });
  }
});

// Test Route
app.get("/", (req, res) => res.send("🔥 LuxeStream Server Running!"));

// Start Server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected!");
    await seedAdmin();
    app.listen(PORT, () => console.log(`⚡ Server Live on ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  });

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(500).json({ message: "Server Error" });
});
