const express = require('express');

const {
  getAllRecyclers,
  getNearbyRecyclers,
  getRecyclerById,
  addRecycler,
  updateRecycler,
  deleteRecycler,
} = require('../controllers/recyclerController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllRecyclers);
router.get('/nearby', getNearbyRecyclers);
router.get('/:id', getRecyclerById);

router.post('/', protect, adminOnly, addRecycler);
router.put('/:id', protect, adminOnly, updateRecycler);
router.delete('/:id', protect, adminOnly, deleteRecycler);

module.exports = router;