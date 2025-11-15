// services/search.service.js
import ClinicalTrial from '../models/ClinicalTrial.model.js';
import Publication from '../models/Publication.model.js';
import ForumPost from '../models/ForumPost.model.js';

export const searchAll = async (query) => {
  try {
    if (!query) return { trials: [], publications: [], forums: [] };

    const regex = new RegExp(query, 'i');
    const [trials, publications, forums] = await Promise.all([
      ClinicalTrial.find({ $or: [{ title: regex }, { summary: regex }, { condition: regex }] }),
      Publication.find({ $or: [{ title: regex }, { abstract: regex }, { authors: regex }] }),
      ForumPost.find({ $or: [{ title: regex }, { content: regex }, { tags: regex }] }),
    ]);

    return { trials, publications, forums };
  } catch (error) {
    console.error('Search error:', error);
    throw new Error('Search failed');
  }
};
