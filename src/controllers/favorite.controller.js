import User from '../models/User.model.js';

export const addFavorite = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { model } = req.body;
    const user = await User.findById(req.user._id);
    if (!user.favorites.includes(itemId)) {
      user.favorites.push(itemId);
      user.favoritesModel = model;
      await user.save();
    }
    res.json({ success: true, data: user.favorites, message: 'Added to favorites' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const { itemId } = req.params;
    const user = await User.findById(req.user._id);
    user.favorites = user.favorites.filter((id) => id.toString() !== itemId);
    await user.save();
    res.json({ success: true, data: user.favorites, message: 'Removed from favorites' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
