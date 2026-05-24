const User = require('../models/User');

// GET /api/leaderboard — global top 20
const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({ isActive: true })
      .select('firstName lastName points totalScans city')
      .sort({ points: -1 })
      .limit(20);
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/leaderboard/city?city=Hyderabad
const getCityLeaderboard = async (req, res) => {
  try {
    const { city } = req.query;
    const query = city
      ? { city: new RegExp(city, 'i'), isActive: true }
      : { isActive: true };
    const users = await User.find(query)
      .select('firstName lastName points totalScans city')
      .sort({ points: -1 })
      .limit(10);
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getLeaderboard, getCityLeaderboard };
