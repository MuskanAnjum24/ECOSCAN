const express = require('express');

const {
  getPlatformStats,
  getAllUsers,
  getUserDetails,
  toggleUserStatus,
  adjustUserPoints,
  getAllScans,
} = require('../controllers/adminController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/stats', protect, adminOnly, getPlatformStats);

router.get('/users', protect, adminOnly, getAllUsers);
router.get('/users/:id', protect, adminOnly, getUserDetails);

router.patch('/users/:id/toggle', protect, adminOnly, toggleUserStatus);

router.post('/users/:id/adjust-points', protect, adminOnly, adjustUserPoints);

router.get('/scans', protect, adminOnly, getAllScans);

module.exports = router;