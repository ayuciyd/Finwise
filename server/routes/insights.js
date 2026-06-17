const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

router.use(authenticate);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /api/insights
router.post('/', async (req, res) => {
  const { prompt, contextData } = req.body;
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const fullPrompt = `
You are FinWise, a highly intelligent and supportive AI financial advisor for university students.
The user is asking: "${prompt || 'Give me a general financial insight based on my data.'}"

Here is their current financial context (transactions, budget, etc):
${JSON.stringify(contextData, null, 2)}

Please provide a concise, actionable, and encouraging insight or advice based on their data. Keep it under 100 words. Do not use markdown headers, just plain text or simple bullet points.
    `;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    res.json({ insight: text });
  } catch (err) {
    console.error('AI Error:', err);
    res.status(500).json({ error: 'Failed to generate insight', details: err.message });
  }
});

module.exports = router;
