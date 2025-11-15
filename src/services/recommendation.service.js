// services/recommendation.service.js
import ClinicalTrial from '../models/ClinicalTrial.model.js';
import Publication from '../models/Publication.model.js';
import User from '../models/User.model.js';

export const getRecommendations = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.interests || user.interests.length === 0)
      return { trials: [], publications: [] };

    const interestsRegex = user.interests.map((i) => new RegExp(i, 'i'));

    const trials = await ClinicalTrial.find({
      $or: [{ title: { $in: interestsRegex } }, { condition: { $in: interestsRegex } }],
    }).limit(10);

    const publications = await Publication.find({
      $or: [{ title: { $in: interestsRegex } }, { abstract: { $in: interestsRegex } }],
    }).limit(10);

    return { trials, publications };
  } catch (error) {
    console.error('Recommendation error:', error);
    throw new Error('Failed to generate recommendations');
  }
};
