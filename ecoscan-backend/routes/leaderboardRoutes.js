const express = require('express');

const {
  getLeaderboard,
  getCityLeaderboard,
} = require('../controllers/leaderboardController');

const router = express.Router();

router.get('/', getLeaderboard);
router.get('/city', getCityLeaderboard);

module.exports = router;