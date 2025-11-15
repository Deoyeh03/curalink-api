import { generateAIResponse } from '../services/ai.service.js';

export const askAI = async (req, res) => {
  try {
    const { prompt } = req.body;
    const aiResponse = await generateAIResponse(prompt);
    res.json({ success: true, data: aiResponse, message: 'AI response generated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
