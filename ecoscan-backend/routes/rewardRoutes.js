const express = require('express');

const {
  getMyRewards,
  redeemPoints,
  getRewardSummary,
} = require('../controllers/rewardController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getMyRewards);
router.post('/redeem', protect, redeemPoints);
router.get('/summary', protect, getRewardSummary);

module.exports = router;