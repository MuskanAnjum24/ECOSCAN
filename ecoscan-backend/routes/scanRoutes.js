const express = require('express');

const {
  saveScan,
  getMyScanHistory,
  getScanById,
  markAsRecycled,
} = require('../controllers/scanController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, saveScan);
router.get('/', protect, getMyScanHistory);
router.get('/:id', protect, getScanById);
router.patch('/:id/recycle', protect, markAsRecycled);

module.exports = router;