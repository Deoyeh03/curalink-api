import Publication from '../models/Publication.model.js';

export const getPublications = async (req, res) => {
  const pubs = await Publication.find();
  res.json({ success: true, data: pubs });
};

export const addPublication = async (req, res) => {
  try {
    const pub = await Publication.create(req.body);
    res.status(201).json({ success: true, data: pub, message: 'Publication added' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
