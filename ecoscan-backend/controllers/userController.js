const User = require('../models/User');
const Scan = require('../models/Scan');

// GET /api/users/profile
const getProfile = async (req, res) => {
  res.json(req.user);
};

// PUT /api/users/profile
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, city, phone } = req.body;
    const user = await User.findById(req.user._id);
    if (firstName) user.firstName = firstName;
    if (lastName)  user.lastName  = lastName;
    if (city  !== undefined) user.city  = city;
    if (phone !== undefined) user.phone = phone;
    await user.save();
    res.json({ message: 'Profile updated', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/users/change-password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: 'Both current and new password are required' });

    const user = await User.findById(req.user._id);
    if (!(await user.matchPassword(currentPassword)))
      return res.status(400).json({ message: 'Current password is incorrect' });

    if (newPassword.length < 8)
      return res.status(400).json({ message: 'New password must be at least 8 characters' });

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/users/stats
const getUserStats = async (req, res) => {
  try {
    const scans    = await Scan.find({ user: req.user._id });
    const recycled = scans.filter(s => s.recycled).length;
    res.json({
      totalScans: scans.length,
      recycled,
      points: req.user.points,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getProfile, updateProfile, changePassword, getUserStats };
