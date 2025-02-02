const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  room: { type: String, required: true, unique: true },
  messages: [{
    sender: { type: String, required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('Conversation', conversationSchema);
