const mongoose = require('mongoose');
const User = require('./User'); // Ensure this is the correct path

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

// Define and export the Message model
const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

module.exports = Message; 