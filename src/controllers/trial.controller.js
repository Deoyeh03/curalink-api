import ClinicalTrial from '../models/ClinicalTrial.model.js';

export const getAllTrials = async (req, res) => {
  const trials = await ClinicalTrial.find();
  res.json({ success: true, data: trials });
};

export const addTrial = async (req, res) => {
  try {
    const trial = await ClinicalTrial.create(req.body);
    res.status(201).json({ success: true, data: trial, message: 'Trial added' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
