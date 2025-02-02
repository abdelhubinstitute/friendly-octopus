const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');

// Get full conversation by room
router.get('/:room', async (req, res) => {
  try {
    const conv = await Conversation.findOne({ room: req.params.room });
    res.json(conv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save a new chat message
router.post('/:room', async (req, res) => {
  try {
    let conv = await Conversation.findOne({ room: req.params.room });
    if (!conv) {
      conv = new Conversation({ room: req.params.room, messages: [] });
    }
    conv.messages.push(req.body);
    await conv.save();
    res.json(conv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
