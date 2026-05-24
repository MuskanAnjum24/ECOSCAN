const express = require('express');

const {
  getProfile,
  updateProfile,
  changePassword,
  getUserStats,
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.get('/stats', protect, getUserStats);

module.exports = router;