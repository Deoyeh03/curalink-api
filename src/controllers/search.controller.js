import { searchAll } from '../services/search.service.js';

export const search = async (req, res) => {
  try {
    const q = req.query.q;
    const results = await searchAll(q);
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
