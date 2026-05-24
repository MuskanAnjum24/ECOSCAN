const Scan   = require('../models/Scan');
const User   = require('../models/User');
const Reward = require('../models/Reward');

// POST /api/scans — save a scan result from the AI scanner
const saveScan = async (req, res) => {
  try {
    const { itemName, material, recyclable, imageUrl, aiResponse } = req.body;
    if (!itemName)
      return res.status(400).json({ message: 'itemName is required' });

    const pointsEarned = recyclable ? 10 : 2;

    const scan = await Scan.create({
      user: req.user._id,
      itemName,
      material:     material   || 'Unknown',
      recyclable:   !!recyclable,
      imageUrl:     imageUrl   || '',
      aiResponse:   aiResponse || '',
      pointsEarned,
    });

    // Credit points to user
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { points: pointsEarned, totalScans: 1 },
    });

    // Log reward
    await Reward.create({
      user: req.user._id,
      type: 'earned',
      points: pointsEarned,
      description: `Scanned: ${itemName}`,
    });

    res.status(201).json({ scan, pointsEarned });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/scans — user's scan history
const getMyScanHistory = async (req, res) => {
  try {
    const scans = await Scan.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(scans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/scans/:id
const getScanById = async (req, res) => {
  try {
    const scan = await Scan.findById(req.params.id);
    if (!scan) return res.status(404).json({ message: 'Scan not found' });
    if (scan.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    res.json(scan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/scans/:id/recycle — mark an item as actually recycled
const markAsRecycled = async (req, res) => {
  try {
    const scan = await Scan.findById(req.params.id);
    if (!scan) return res.status(404).json({ message: 'Scan not found' });
    if (scan.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    if (scan.recycled)
      return res.status(400).json({ message: 'Already marked as recycled' });

    scan.recycled   = true;
    scan.recycledAt = new Date();
    await scan.save();

    // Bonus points for actually recycling
    const bonus = 5;
    await User.findByIdAndUpdate(req.user._id, { $inc: { points: bonus } });
    await Reward.create({
      user: req.user._id,
      type: 'earned',
      points: bonus,
      description: `Recycled: ${scan.itemName}`,
    });

    res.json({ message: 'Marked as recycled ✅', bonusPoints: bonus });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { saveScan, getMyScanHistory, getScanById, markAsRecycled };
