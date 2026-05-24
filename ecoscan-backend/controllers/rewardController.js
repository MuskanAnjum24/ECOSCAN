const Reward = require('../models/Reward');
const User   = require('../models/User');

// GET /api/rewards — all reward transactions for logged-in user
const getMyRewards = async (req, res) => {
  try {
    const rewards = await Reward.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(rewards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/rewards/redeem
const redeemPoints = async (req, res) => {
  try {
    const { points, description } = req.body;
    if (!points || points <= 0)
      return res.status(400).json({ message: 'Invalid points amount' });

    const user = await User.findById(req.user._id);
    if (user.points < points)
      return res.status(400).json({ message: 'Insufficient points' });

    user.points -= points;
    await user.save();

    await Reward.create({
      user: req.user._id,
      type: 'redeemed',
      points,
      description: description || 'Points redeemed',
    });

    res.json({ message: 'Points redeemed successfully 🎁', remainingPoints: user.points });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/rewards/summary
const getRewardSummary = async (req, res) => {
  try {
    const rewards  = await Reward.find({ user: req.user._id });
    const earned   = rewards.filter(r => r.type === 'earned').reduce((s, r) => s + r.points, 0);
    const redeemed = rewards.filter(r => r.type === 'redeemed').reduce((s, r) => s + r.points, 0);
    const user = await User.findById(req.user._id);
    res.json({ earned, redeemed, current: user.points });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getMyRewards, redeemPoints, getRewardSummary };
