import { getRecommendations } from '../services/recommendation.service.js';

export const generateRecommendations = async (req, res) => {
  try {
    const data = await getRecommendations(req.user._id);
    res.json({ success: true, data, message: 'Recommendations generated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
