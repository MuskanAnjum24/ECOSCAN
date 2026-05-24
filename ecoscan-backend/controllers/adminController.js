const User   = require('../models/User');
const Scan   = require('../models/Scan');
const Reward = require('../models/Reward');

// GET /api/admin/stats
const getPlatformStats = async (req, res) => {
  try {
    const [totalUsers, totalScans, totalRecycled, pointsResult] = await Promise.all([
      User.countDocuments(),
      Scan.countDocuments(),
      Scan.countDocuments({ recycled: true }),
      Reward.aggregate([
        { $match: { type: 'earned' } },
        { $group: { _id: null, total: { $sum: '$points' } } }
      ])
    ]);
    res.json({
      totalUsers,
      totalScans,
      totalRecycled,
      pointsAwarded: pointsResult[0]?.total || 0,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/admin/users/:id
const getUserDetails = async (req, res) => {
  try {
    const user  = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    const scans = await Scan.find({ user: req.params.id }).sort({ createdAt: -1 });
    res.json({ user, scans });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// PATCH /api/admin/users/:id/toggle
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'}`, isActive: user.isActive });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST /api/admin/users/:id/adjust-points
const adjustUserPoints = async (req, res) => {
  try {
    const { points, reason } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.points = Math.max(0, user.points + points);
    await user.save();
    await Reward.create({
      user: user._id,
      type: points > 0 ? 'earned' : 'redeemed',
      points: Math.abs(points),
      description: reason || 'Admin adjustment',
    });
    res.json({ message: 'Points adjusted', newPoints: user.points });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/admin/scans
const getAllScans = async (req, res) => {
  try {
    const scans = await Scan.find()
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 });
    res.json(scans);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getPlatformStats, getAllUsers, getUserDetails, toggleUserStatus, adjustUserPoints, getAllScans };
