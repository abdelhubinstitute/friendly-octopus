const express = require('express');
const router = express.Router();
const axios = require('axios');
const Conversation = require('../models/Conversation');

// Endpoint to analyze conversation and generate a friend report
router.post('/:room', async (req, res) => {
  try {
    const { role } = req.body; // e.g., "friendship report", "couple consulting", "professional mediator"
    const conv = await Conversation.findOne({ room: req.params.room });
    if (!conv) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    // Build transcript from conversation messages
    const transcript = conv.messages.map(msg => `${msg.sender}: ${msg.text}`).join('\n');

    // Create a system prompt for GPT-4o mini
    const prompt = `You are acting as a ${role}. Analyze the following conversation between friends and provide an honest, constructive report on their relationship dynamics:\n\n${transcript}`;

    // Call OpenAI GPT-4o mini API
    const openaiResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: prompt }
      ],
      max_tokens: 1024,
      temperature: 0.7
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });

    const report = openaiResponse.data.choices[0].message.content;
    res.json({ report });
  } catch (error) {
    console.error("Analysis error:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
