const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: function() {
      // Only require password for local authentication
      return !this.googleId && !this.githubId;
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  googleId: { 
    type: String 
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  }],  
  watchHistory: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  }],
  subscription: {
    type: Object
  } // or your subscription schema
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);